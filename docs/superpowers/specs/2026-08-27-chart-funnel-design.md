# Funnel chart — new series type (Round 31)

Goal (user): add a **funnel chart** to the engine — a marketing/conversion
funnel like the reference screenshot (Impressions 3.6M → Clicks 83.1K →
Leads 871). Not in PrimeVue; completely new. Constraints: **max 6 items,
single series**, series color set by us — the number labels sit on the
bright trapezoids, the connectors/background are a **darker version of the
stage color**, and the bottom **arrow** is ours to control. Everything is
rendered and computed in real time by our own engine (no third-party
geometry).

## 1. Public API — `<Chart.Funnel>`

```tsx
<Chart.Funnel
  data={stages}                    // {name, value} rows (any shape)
  name="Marketing funnel"
  categoryField="name"             // default "name"
  valueField="value"               // default "value"
  color="#6366f1"                  // base stage color (default: series palette)
  colors={["#7c5cf0", "#2f6fd0", "#12a5b8"]}  // OPTIONAL per-stage override
  showLabels                       // stage names + dotted leaders (default true)
  showValues                       // value inside trapezoid (default true)
  showConversion                   // % between stages (default true)
  arrow                            // bottom arrowhead (default true)
  minWidthRatio={0.22}             // min stage width / max (default 0.22)
  scale="log"                      // log (default) | linear width scale
  valueFormat={formatSI}           // default formatSI
/>
```

- **Max 6 stages** — data beyond 6 is ignored (documented; the geometry
  is tuned for 1–6).
- Colors: single `color` drives every stage; connectors + arrow are
  auto-derived as a **darker version** (mixed ~40% toward a dark neutral).
  `colors[]` overrides per stage when provided (screenshot look).
- Vertical orientation only (horizontal is a future extension).

## 2. Engine — `engine/series/funnel.ts` (real-time geometry)

`computeFunnelGeometry(area, items, opts)` — pure function, unit-tested:

- **Widths**: `w_i = funnelMaxW * ratio(v_i)`, clamped to
  `minWidthRatio * funnelMaxW` so small stages stay legible.
  `scale` (default `log`): `ratio = log10(1+v) / log10(1+v_max)` —
  funnels are steep by nature, so log widths keep the tail legible
  and distinct; `linear` is strictly proportional.
- **Layout**: stages as bands of equal height;
  `stageH = (H - (n-1)*gap - arrowH) / n` with `gap ≈ 0.09H`,
  `arrowH ≈ 0.10H` (0 when `arrow` off).
  `funnelMaxW = area.width * (showLabels ? 0.62 : 0.86)`, centered at
  `cx = area.x + funnelMaxW / 2` (right side reserved for the name
  leaders — no margin plumbing; self-contained like treemap).
- **Bright stage trapezoid i**: top half-width `w_i/2`, bottom
  `0.8 * w_i/2` (gentle taper, like the screenshot).
- **Dark connector i** (between stages i and i+1): trapezoid from
  stage i's bottom edge to stage i+1's top edge, filled
  `darken(color_i)` — the "background" the user described.
- **Arrow**: dark trapezoid tapering from the last stage's bottom to a
  narrow base (~18% of its width), filled `darken(color_last)`.
- **Labels**: value centered in each trapezoid (white, `valueFormat`);
  conversion % (`v_{i+1} / v_i`, one decimal) centered in each gap,
  offset right of the connector; stage names on the right with a short
  dotted leader + dot from each trapezoid's mid-right edge.
- `darken(c) = mix(c, #0b1220, 0.42)` — small hex-mix helper (reused by
  the series component; no dependency added).
- Returns: stage polygons, connector polygons, arrow polygon, label
  anchor points, conversion values — everything the renderer needs.

## 3. Descriptor + ChartRoot wiring (mirrors treemap)

- `series-utils.ts`: `kind === "funnel"` branch → descriptor
  `type: "funnel"` with `funnelItems` (label/value, capped at 6),
  `funnelColor(s)`, `funnelShowLabels/Values/Conversion`, `funnelArrow`,
  `funnelMinWidth`, `funnelValueFormat`.
- `ChartRoot.tsx`:
  - "funnel" added to the non-cartesian exclusions (x-domain collector +
    cartesian series filter).
  - `funnelSeries` memo (first funnel descriptor) + `funnelLayout` memo
    (`computeFunnelGeometry(area, …)`).
  - **computeHover funnel branch** (after treemap, guarded
    `cartVisible.length === 0`): point-in-convex-polygon test against the
    bright stage trapezoids → `HoverState { x: cx, y: bandMid,
    pointerX, pointerY, rawX: stageName, items: [{ value, name, color:
    stageColor, index }] }`.
- `FunnelSeries.tsx` (new, `series/`): SVG — connectors/arrow (back),
  stage trapezoids, value/%/name labels; hover = subtle stroke +
  brighten on the active stage; entrance animation via the shared
  `progress` (fade + rise). Canvas renderer via `registerDraw` with the
  same polygons/text (2D API).
- `index.ts`: registry + `Chart.Funnel` namespace + `FunnelSeriesProps`
  export. `props.ts`: `FunnelSeriesProps` + "funnel" in the kind union.

## 4. Demo

- `data.ts`: `funnelMarketing` — 6 stages (Impressions 3.6M, Clicks
  83.1K, Leads 871, Trials 342, Customers 96, Renewals 71) — exercises
  the min-width clamp and small-stage labels.
- Playground `kind === "funnel"` (shared component → new page):
  controls **Stages** (3/4/5/6), **Colors** (Single / Multi), **Arrow**,
  **Stage labels**, **Conversion %**, **Values** — plus the usual
  renderer/theme/loading/animation controls. No legend (single series).
  Shared tooltip + hover apply as with every other kind.
- New docs page `charts-funnel` with the playground + 1–2 examples
  (single-color tile funnel, multi-color funnel with axes-off look).

## 5. Tests

- `engine/series/funnel.test.ts` (pure geometry):
  - widths proportional to values, clamped at `minWidthRatio`;
  - 7 items → exactly 6 stages;
  - stage polygons tile the area (no overflow, ordered top→bottom);
  - conversion values = v_{i+1}/v_i (and zero-division safe);
  - connector/arrow polygon counts; `arrow=false` drops the arrow.
- `chart-components.test.tsx` — "funnel" suite:
  - renders stage/connector/arrow paths + value + stage-name text;
  - hovering a stage (jsdom pointer probe like the nightingale test)
    resolves the correct stage index/name into the shared tooltip.

## 6. Verification

- Kit tsc (WIP-filtered) + full vitest (baseline 2544 / 107 files).
- Demo tsc (WIP-filtered).
- Playwright on :5176 (funnel page, dark + light): default 6-stage
  render, stage-count changes, colors single/multi, arrow/labels/conversion
  toggles, hover → single tooltip with the right stage; screenshot.

## 7. Out of scope

- Horizontal orientation, multi-funnel comparison, rounded stage
  corners, editable/reorderable stages, pie-style donut funnels.
