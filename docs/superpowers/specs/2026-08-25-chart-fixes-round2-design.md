# Chart Fixes Round 2 — Design

**Date:** 2026-08-25
**Status:** Approved (brainstorming)
**Scope:** Five reported issues on the chart system (user screenshots of the PrimeUI Pro LINE reference as fidelity benchmark): grid overlap + grid configurability, entrance animations not firing, line markers not highlighting on hover, y-axis value badges as an alternative to the tooltip popup, and gradient area fills.

## 1. Grid overlap + configurability

- **Root cause:** children render in declaration order — `<XAxis>`/`<YAxis>` declared after the series draw on top of the marks.
- **Fix (layering):** render axes/grid/reference bands behind the series.
  - SVG: the root's split loop collects `backChildren` (XAxis, YAxis, ReferenceBand) and renders them before `frontChildren` (everything else).
  - Canvas: `registerDraw(id, fn, layer?: "back" | "front")` (default `"front"`); the draw loop runs all back fns (insertion order) before front fns. XAxis/YAxis/ReferenceBand register as `"back"`.
- **New `YAxis` props:**
  - `gridDash?: "solid" | "dashed"` (default `"solid"`) — dash pattern `4 4` for dashed.
  - `gridOpacity?: number` (0–1, default 1) — multiplies the grid stroke opacity (intensity control).

## 2. Entrance animations (engine bug)

- **Root cause (verified via instrumented frame logs):** series `prev`/`lastRef` bookkeeping runs every render and `final` geometry is a fresh object per render — so on the first animation frame `prev` becomes non-null, `entrance` flips false, and the mark renders at final state. The root's progress animates; nothing consumes it for the entrance.
- **Fix (all four series — Line, Bar, Pie, Candlestick):** settle the bookkeeping only on settled renders:
  ```
  if (progress >= 1 && lastRef.current !== final) { prevRef.current = lastRef.current; lastRef.current = final; }
  const prev = progress < 1 ? prevRef.current : null;
  ```
  During animation `prev` stays the previous *settled* geometry (`null` during entrance); update animations interpolate from it; entrance uses the entrance transform with live progress.
- **Regression test:** with fake timers + mocked rAF, a bar chart at t=50% of the animation has its first bar height strictly between 0 and the final height.

## 3. Line markers highlight on hover

- While `ctx.hover` is active, each visible line series renders an enlarged marker at the hovered point: `r ≈ 4.5`, fill = series color, stroke = crosshair color (1.5px).
- SVG: extra circle in the series group after the line path. Canvas: the draw fn draws it when `ctx.hover` is present; the effect deps include the hover state so the canvas redraws.
- Applies per series (each series' own value at the hovered x-index). No canvas crosshair line (SVG-only today; out of scope).

## 4. Y-axis value badges (`Chart.AxisBadges`)

- **New feature component** (HTML overlay, both renderers, registered like other features):
  - For each visible cartesian series (hidden skipped): value = hovered series value while `hover` is active, else the last value.
  - Colored pill (series color background, white text, value formatted plain: `Math.round(v * 10) / 10`) pinned to the left y-axis: `left: area.x - 6` with `translateX(-100%)`, vertically centered on `valueScale.map(value)`.
  - `mode?: "hover" | "endpoints" | "both"` (default `"hover"`) — `"hover"` renders only while hovering, `"endpoints"` renders the last values always, `"both"` renders last-value pills always and swaps to hovered values while hovering.
  - No collision resolution (YAGNI — the reference stacks near-equal values without resolving).
  - Uses the right scale when the series declares `yFieldAxis: "right"` (pills on the right axis edge).
- Exported from the kit index + `setChartRegistry`.

## 5. Gradient area fill

- **New `Chart.Line` prop** `areaGradient?: boolean` (default false): the area fill becomes a vertical linear gradient from the series color (full fill alpha at the plot top) to transparent at the baseline.
  - SVG: extra `<linearGradient>` in the existing per-series defs block (separate id), stops: color @ `fillOpacity` → color @ 0; `fill` switches from flat color to the gradient url.
  - Canvas: `createLinearGradient(0, area.y, 0, area.y + area.height)` with the same stops.
- Playground "Area fill" keeps the flat fill; the new "Area gradient" toggle (visible when fill is on) sets `areaGradient`.

## 6. Playground controls (per-kind, existing widgets)

| Kind | Control | Values | Wiring |
|---|---|---|---|
| line/bar/candlestick | Grid | Off / Solid / Dashed | `YAxis grid={off?false:undefined} gridDash` |
| line/bar/candlestick | Grid fade | Full / Faint / Very faint | `YAxis gridOpacity` = 1 / 0.55 / 0.25 |
| line | Area gradient | toggle | `Line areaGradient` (all three series) |
| line | Values | Popup / Y-axis / Both | `Tooltip` rendered for Popup/Both, `AxisBadges` for Y-axis/Both |

Bar mode/percent already owns the Y-axis; the grid controls pass to the (left) YAxis in all cartesian kinds.

## 7. Files touched

- `react/src/components/chart/engine/layout.ts` — none (no layout changes).
- `react/src/components/chart/react/`: `ChartRoot.tsx` (layered plot children + canvas draw layers + ctx pass-through of hover to canvas fns already present), `features/YAxis.tsx` (gridDash/gridOpacity, layer "back"), `features/XAxis.tsx` (layer "back"), `features/ReferenceBand.tsx` (layer "back"), `features/AxisBadges.tsx` (NEW), `series/LineSeries.tsx` (prev fix, hover markers, areaGradient), `series/BarSeries.tsx` + `series/PieSeries.tsx` + `series/CandlestickSeries.tsx` (prev fix), `ChartContext.tsx` (registerDraw layer param, AxisBadges type), `props.ts` (YAxis/Line props, AxisBadgesProps), `series-utils.ts` (AxisBadges in registry types + descriptor passthrough where needed), `index.ts` (export).
- `react/demo/src/kit-docs/`: `shared/options.ts` (chartGridOptions, chartGridFadeOptions, chartValuesOptions), `components/chart/ChartPlayground.tsx` (state + controls + wiring).
- Tests: `chart-components.test.tsx` (entrance mid-state, AxisBadges render + hover swap, YAxis gridDash/gridOpacity attrs, areaGradient def present), `layout.test.ts` untouched.

## 8. Out of scope

Canvas crosshair line, badge collision resolution, horizontal-bar orientation axis swap (carried), zoom/navigator/export.
