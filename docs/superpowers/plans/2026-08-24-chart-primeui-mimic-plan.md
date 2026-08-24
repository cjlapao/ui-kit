# Implementation Plan — Chart (PrimeUI Pro mimic)

**Spec:** `docs/superpowers/specs/2026-08-24-chart-primeui-mimic-design.md`
**Date:** 2026-08-24
**Dev loop:** `cd react/demo && npm run dev` → http://localhost:5174/docs/chart (Vite aliases `@cjlapao/ui-kit` to `react/src/index.ts`, so kit source hot-reloads — no kit rebuild needed while iterating)
**Test loop:** `cd react && npm test` (vitest) · **Type check:** `cd react && npm run lint` (tsc --noEmit)

**Grounding facts (verified 2026-08-24):**
- d3 micro-modules already in `react/node_modules` via recharts: `d3-array@3.2.4`, `d3-scale@4.0.2`, `d3-shape@3.2.0`, `d3-time@3.1.0`; `@types/d3-*` present transitively. Pin direct deps to these majors.
- tsup bundles non-external deps (recharts is bundled today) → d3 modules bundle the same way; **no tsup config change needed**.
- Kit theme: `useTheme()` (`react/src/hooks/useTheme.ts`) returns `effectiveTheme: "light" | "dark"` — use for `theme="auto"`.
- `test-setup.ts` already stubs `matchMedia` + `ResizeObserver` for jsdom.
- Icons are hand-drawn 24×24 `forwardRef` SVGs; `IconName` is a union type + `Record<IconName, …>` map in `react/src/icons/registry.ts` (TS enforces the entry when you extend the union).
- Demo shared pieces: `PageHeader {name, description}`, `PlaygroundPanel {controls, children}` with `Control`/`SelectControl`/`ToggleRow`, `ExampleCard {title, description, code, filename, children}` (code via `import x from "./X.tsx?raw"`).
- **Tailwind v4 gotcha (Learnings):** dynamic class strings need `@source inline()` safelist entries. Mitigation by design: chart marks use SVG attributes / canvas `fillStyle` (inline colors, no dynamic Tailwind classes); Tailwind classes are used only as static strings for chrome (tooltip card, legend, badges).
- Other Learnings rules that apply: animations need `backwards` fill when staggered; `box-shadow` does not apply to SVG shapes; never hand-write raw variant CSS; a ring/border colour without a width paints nothing; measure visual claims with Playwright, don't eyeball.

**Acceptance criteria (definition of done):**
1. `Chart` namespace exported from `@cjlapao/ui-kit` with all components in spec §3.
2. LINE playground demo is visually close to the reference screenshot (phase windows, pill labels, baseline line + label, crosshair date line, two callout annotations, four left-edge value badges, legend, title/subtitle) — verified by side-by-side Playwright screenshots in dark and light, SVG and Canvas.
3. Bar / Pie-Donut / Candlestick demos render with working legend, tooltip, hover, entrance animation.
4. SVG and Canvas renderers produce matching geometry for the same props.
5. All engine + component tests pass; `tsc --noEmit` clean in `react/` and the demo.
6. `/docs/chart` reachable in the demo with registry entry, playground, and 7 examples; `prefers-reduced-motion` and `animation={false}` render instantly.

---

## Phase 0 — Dependencies & scaffolding

**Task 0.1 — Add d3 deps to `react/package.json`**
- `dependencies`: `d3-array@^3.2.4`, `d3-scale@^4.0.2`, `d3-shape@^3.2.0`, `d3-time@^3.1.0`
- `devDependencies`: `@types/d3-array@^3`, `@types/d3-scale@^4`, `@types/d3-shape@^3`, `@types/d3-time@^3`
- `cd react && npm install`
- Verify: `cd react && npx tsc --noEmit` (clean), `npx tsc --noEmit` in `react/demo` (clean)
- Commit: `chore(chart): add d3 micro-module deps for the chart engine`

**Task 0.2 — Create folder skeleton**
- `react/src/components/chart/engine/types.ts` (placeholder types from spec §4), `react/src/components/chart/react/` (empty), `react/src/components/chart/index.ts` re-exporting nothing yet.
- Verify: `tsc --noEmit` clean.
- (Commit with Phase 1.)

## Phase 1 — Engine core (pure TS, unit-tested)

**Task 1.1 — `engine/types.ts`**
- Core types: `ChartColor` (TrueColor name | hex | `GradientColor`), `GradientColor {x1,y1,x2,y2,stops}`, `Accessor<T,R>`, `EasingName`, `EasingFn`, `AnimationConfig = false | { duration?, easing? }`, `ChartMargins`, `ChartLayout { width, height, chartArea {x,y,width,height} }`, `ChartThemeTokens { textColor, subtleText, gridColor, axisColor, tooltipBg, tooltipBorder, tooltipText }`, `PointContext<T>`, `SeriesGeometryBase`, per-series geometry types (LineGeometry, BarGeometry, PieGeometry, CandlestickGeometry), `SeriesDescriptor` (normalized series props read by the root).
- Verify: compiles standalone.

**Task 1.2 — `engine/scales.ts`** (wrap d3-scale; keep d3 importable-only in this file so the rest of the engine stays dependency-free)
- `createLinearScale({domain, range, nice?})` → `{ scale, ticks(count?) }`
- `createTimeScale({domain: Date[], range})` → `{ scale, ticks, tickFormat }` — adaptive time tick formatting: ticks that fall on Jan 1 render year-only ("2024"), others "Mon yyyy" ("Mar 2024") — matches the reference axis
- `createBandScale({categories, range, paddingInner?, paddingOuter?})`, `createPointScale(...)`
- `isTimeDomain(values)` helper (all values Dates / parseable ISO → time scale)
- Tests (`scales.test.ts`): linear nice ticks are "nice" numbers and cover domain; **time ticks over Jan 2024 → Jun 2025 produce the reference label set** (`2024, Mar 2024, May 2024, Jul 2024, Sep 2024, 2025, Mar 2025, May 2025` — assert exact set; if d3's default tick count differs, tune `tickCount` until the set matches and assert stability); band scale positions are ordered & equal-width; `isTimeDomain` on mixed data → false.

**Task 1.3 — `engine/layout.ts`**
- `computeLayout({ width, height, margin, hasTitle, titleLines, hasLegend, legendOrientation, hasXAxis, hasYAxis, hasRightAxis }) → ChartLayout` — reserves space: title block (height by lines), legend row (~28px), axes (estimate from tick label widths — fixed 48px y, 28px x for v1; dual y adds another 48).
- Tests: area = box − margins − reserved strips; right axis widens reservation; legend off frees the row.

**Task 1.4 — `engine/animation.ts`**
- Easing registry: `linear`, `easeInQuart`, `easeOutQuart` (default), `easeInOutCubic`, `easeOutCubic`, `easeOutBounce`, `easeOutElastic` (formulas from d3-ease / standard definitions). `registerEasing(name, fn)`, `getEasing(name) → EasingFn` (unknown → easeOutQuart, no throw).
- `prefersReducedMotion()` — `matchMedia("(prefers-reduced-motion: reduce)").matches` (SSR-safe).
- `createAnimator({ duration, easing, onFrame, onDone, clock? })` — rAF loop; `clock` injectable for tests (`(now) => void` start + cancel); `start()`/`cancel()`; returns progress 0→1 through the easing fn.
- `immediate(config, reducedMotion) → boolean` — true when `animation === false` or reduced motion.
- Tests: every easing fn: f(0)=0, f(1)=1, monotone for non-spring easings, bounce/elastic overshoot within [−0.2, 1.2]; animator with fake clock reaches 1 and calls onDone exactly once; cancel stops frames; `immediate` truth table.

**Task 1.5 — `engine/theme.ts`**
- `CHART_THEME_TOKENS: { light: ChartThemeTokens, dark: ChartThemeTokens }` — values sampled from the reference screenshot (dark: bg transparent, grid ~#1f2937/60, axis text #9ca3af, tooltip bg #0b0f14cc border #2a3140; light: grid #e5e7eb, text #6b7280, tooltip white/95).
- `DEFAULT_SERIES_PALETTE: ChartColor[]` — the reference order: indigo/purple (#8b5cf6), sky (#38bdf8), emerald (#34d399), red (#f87171), then amber, teal, pink, orange (400/500 hexes matching the kit's TrueColor scale).
- `resolveColor(input | undefined, index): { stroke, fill, gradient? }` — TrueColor name → kit hex; hex → as-is; gradient object → pass-through; undefined → palette[index % length].
- Tests: palette cycling with 10 series; hex passthrough; gradient passthrough; undefined falls back by index; unknown tone name falls back to palette (no crash — the CollapsibleHelpText lesson).

**Commit:** `feat(chart): engine core — scales, layout, animation, theme`

## Phase 2 — Series geometry (pure TS, unit-tested)

**Task 2.1 — `engine/series/line.ts`**
- `computeLineSeries({ data, xAccessor, yAccessor, xScale, yScale, curve, connectNulls, decimate? }) → { points, segments, linePath, areaPath }`
- Curve mapping: `linear → curveLinear`, `smooth → curveMonotoneX`, `spline → curveCatmullRom` (tension param via d3 `curveCatmullRom.alpha`), `step/step-before/step-after → curveStep/curveStepBefore/curveStepAfter`.
- Nulls: `gap` splits into segments (one subpath each, `M` restart); `connect` bridges; `zero` substitutes 0 (line to baseline then up).
- Area path = line path + close to baseline (y=domain min).
- `decimate(points, maxPoints)` from `decimation.ts` applied pre-path.
- Tests: 3-point linear path is exact `M..L..L`; gap produces two `M`s; connect produces one continuous path; zero path dips to baseline; monotone path has no NaN for duplicate x; step shapes have only H/V moves; decimate keeps first/last and caps count.

**Task 2.2 — `engine/series/bar.ts`**
- `computeBarSeries({ data, xAccessor, yAccessor, xScale(band/point), yScale, mode: "group" | "stack" | "percent", orientation: "vertical" | "horizontal", seriesIndex, seriesCount, baseline }) → rects[]`
- Group: sub-band width; stack: cumulative from baseline (percent → 0–100 scale); horizontal: x/y swapped; negative values stack downward.
- Tests: 2-series group rects don't overlap and share category center; stack tops equal sum; percent stack sums to 100; horizontal rects transpose; negative stack goes below baseline.

**Task 2.3 — `engine/series/pie.ts`**
- `computePieSeries({ items: {name, value, color}[], innerRadiusRatio, startAngle, sweepAngle, outerRadius, cx, cy }) → { slices: { startAngle, endAngle, path, labelAngle, popOffset {dx,dy} }[], total }`
- Arc path via `d3-shape` arc generator (or hand-rolled SVG arc — `d3-shape` chosen for consistency).
- Tests: slice angles sum to 2π (full) / sweepAngle; donut inner radius = ratio × outer; zero-total → empty slices, no crash; single item renders full circle (d3 arc handles the 2π edge); labelAngle is slice midpoint.

**Task 2.4 — `engine/series/candlestick.ts`**
- `computeCandlestickSeries({ data, open/high/low/close accessors, xScale, yScale, bodyWidth }) → candles: { x, openY, highY, lowY, closeY, bodyTop, bodyHeight, direction: "up" | "down" | "flat" }[]`
- `flat` (doji) → body height 1px min.
- Tests: up = close>open, body spans open–close; wick spans high–low exactly; doji clamps height; x positions evenly spaced.

**Commit:** `feat(chart): series geometry — line, bar, pie, candlestick, decimation`

## Phase 3 — React root + context + SVG series

**Task 3.1 — `react/ChartContext.tsx`**
- `ChartContextValue`: `{ width, height, layout, xScale, yScale, themeTokens, isDark, progress, seriesState (per-series: geometry, hidden, exitAlpha), registerDraw(fn), unregisterDraw(fn), hover (nearest point info), setHover, redrawNonce }`
- Hook `useChart()` throws a helpful error outside a root (per the IconContext lesson: default to real behavior, fail loudly when misused).

**Task 3.2 — `react/ChartRoot.tsx`** (`ChartSvg` and `ChartCanvas` share a `useChartRoot` hook)
- Container ref + `ResizeObserver` → width (100%), `height` prop (default 400). Width 0 → defer first paint (store pending, paint on first real width).
- **Child inspection:** `React.Children.toArray(children)` — series children (type in a known set) → read props → `SeriesDescriptor[]`; config children set flags (`hasXAxis`, `hasYAxis`, `rightAxis`, `hasLegend`, `hasTitle`, `tooltipMode`, `hoverEnabled`).
- **Domain computation:** x-domain = union across series (time if `isTimeDomain`, else categories in first-seen order); y-domain = min/max across visible series + `domain` overrides, `nice()`.
- Compute scales + layout (useMemo on data/size/flags).
- **Theme:** `theme` prop `"auto"` → `useTheme().effectiveTheme`; tokens from `engine/theme.ts`.
- **Animation:** on mount → entrance progress (stroke-dash for lines; scale-from-0 for bars/pie/candles — per-series progress = global progress with optional stagger); on data change → interpolate old→new geometry (match by `keyField` or category; enter/exit items); on series remove (legend toggle) → exit alpha 0→…; `animation={false}` / `prefersReducedMotion()` → set final state instantly. Frame state on root for SVG; same progress passed to canvas draw fns.
- **SVG render:** `<svg role="img" aria-label={title} width height>` → gridlines (if axes) → `{children}` (series/config marks render from context) → hover overlay rect (transparent, captures pointer) for tooltip/hover.
- **Canvas render:** `<canvas>` sized width/height × dpr; rAF loop (start on mount, stop on unmount, `EcgMonitor` pattern) calls each registered draw fn with `(ctx, state)`; loop runs only while animating or when a redraw is requested (static charts don't spin a perpetual loop — one repaint after settle; hover changes trigger a repaint via `redrawNonce`).
- `forwardRef` → `{ redraw() }` (re-reads children, recomputes, repaints once).
- **Empty data** (all series empty) → kit-style placeholder div (icon + "No data") instead of svg/canvas.
- Tests (`ChartRoot.test.tsx`): mounts `<svg>` with one path per line series; canvas variant mounts `<canvas>`; empty data → placeholder text; `theme="dark"` vs `"light"` flips token-driven axis text color (assert attribute); `redraw()` ref method exists and is callable; `aria-label` from `Chart.Title` title prop.

**Task 3.3 — SVG series components (`Line.tsx`, `Bar.tsx`, `Pie.tsx`, `Candlestick.tsx`)**
- Each reads its own props + context geometry; renders `<g>` marks with `fill`/`stroke` from `resolveColor`; entrance via context `progress` (line: `stroke-dasharray` reveal using `pathLength={1}` + dashoffset — path computed once; bar/pie/candle: transform/height interpolation).
- `Line` extras: `fillOpacity` area path (gradient def with unique id via `useId` when color is a gradient), markers (`showMarkers`, `markerShape` circle/square/triangle/cross/star, `markerSize`), `lineStyle` solid/dashed/dotted presets (`[6,4]` / `[2,4]` defaults), `borderColor` halo path behind.
- `Bar`: `stacked` prop or `Chart.Stacked`-style grouping via `stackKey` (v1: `mode` prop on each bar series sharing the same stack id — keep simple: `stack="a"` groups series); rounded top corners optional (skip v1).
- `Pie`: slice paths, `innerRadius`, center slot (`children` → rendered at cx/cy via absolutely-positioned div in SVG mode; text in canvas mode), hover pop-out (translate slice 4px along `popOffset`).
- `Candlestick`: `variant: "candle" | "hollow" | "ohlc"`; up = emerald, down = red (tokens, overridable via `color`); wick 1.5px line + body rect (hollow = unfilled with stroke; ohlc = tick bars).
- Tests: line series renders path with expected stroke color; `fillOpacity` adds an area path; markers render when `showMarkers`; pie renders N slice paths + center slot; candlestick renders wicks + bodies with correct fill per direction; hidden series (via state) renders nothing.

**Commit:** `feat(chart): compound root (SVG), context, series components`

## Phase 4 — Feature components (SVG)

**Task 4.1 — `XAxis.tsx` / `YAxis.tsx`**
- Render axis line, ticks (small strokes), labels (time format from `scales.ts`; linear SI via `formatSI`), dashed horizontal (y) / optional vertical (x) gridlines at `chartThemeTokens.gridColor`.
- Props: `domain`, `tickCount`, `label` (axis title, rotated for y), `axis?: "left" | "right"` (dual y), `grid` (bool, default true), `format` (override).
- Tests: renders tick labels for a time axis; right axis renders at chartArea.right; grid lines count = ticks.

**Task 4.2 — `Legend.tsx`**
- Renders per visible series: swatch (line → 16×3 rounded line sample with series dash style + marker dot if `showMarkers`; area → 12×12 rounded-rect; bar → 10×10 square; pie → 10px circle) + label text.
- Each entry is a `<button>` (`aria-pressed`) — click → `setSeriesHidden` (exit/enter animation via root state). Hidden → 50% opacity + strike-through (subtle).
- Tests: N buttons for N series; click hides the series path (assert removal after exit — assert on `data-series-id` attr) and re-clicks to restore.

**Task 4.3 — `Tooltip.tsx` + `Hover.tsx`**
- `Hover` (or root `hoverEnabled` when `<Chart.Hover/>` present): pointer move on the overlay rect → nearest category x (snap) → for each visible series, value at that x → `setHover({ x, items: [{name, color, value, y}] , rawDate? })`. Peer dimming: root sets `opacity 0.35` on non-hovered series `<g>` when hover active (cartesian only).
- `Tooltip`: absolutely-positioned card (HTML div in a relatively-positioned wrapper around the svg/canvas — same for both renderers). Modes: `shared` (card lists all hovered items, swatch + name + `itemFormat` value), `follow` (follows cursor, nearest single item), `crosshair` (adds vertical + horizontal cross lines inside the chart). Time header row ("Friday, Nov 1, 2024" for Date x). Flip horizontally when within 160px of right edge. Hidden on pointer leave. `content` slot overrides the card body.
- Tests: mousemove at a known x shows tooltip containing the expected value string; leave hides it; shared mode lists all series; crosshair lines appear.

**Task 4.4 — `Title.tsx` / `Caption.tsx`**
- `title`/`subtitle` props or `children` slot; renders above chart (title block reserved in layout); caption below (footer). Centered alignment option (demos use centered).

**Task 4.5 — `ReferenceLine.tsx` / `ReferenceBand.tsx`**
- `ReferenceLine`: `x` or `y` value (scale-space), `stroke` dash `[4,4]`, `label` with `labelPosition: "start" | "end" | "center"` + inside/outside; date values allowed on time axes.
- `ReferenceBand`: `x1/x2` or `y1/y2` (values), `color` (tone or hex), `opacity` (default 0.1), `label` → pill at window top: rounded-full border in band color + dot + text (the phase-window pills from the screenshot).
- Tests: vertical line at date renders at expected x attribute; band renders rect spanning its range; pill label present with text.

**Task 4.6 — `Annotation.tsx`**
- Props: `x`/`y` (values), `tone` (TrueColor), `title`, `value` (string, toned), `leaderLine` (bool), `placement` (auto | "top" | "bottom" | "left" | "right").
- Renders: marker dot (6px, tone) at (x,y); dashed leader line from dot to callout card; card (rounded, dark surface, title row + toned value row) offset ~40–60px, auto-flip near edges.
- Tests: renders dot + card text; leader line present when `leaderLine`.

**Task 4.7 — `DataLabels.tsx`**
- `position: "last" | "all" | "none"` (default "none"), `formatter`, `anchor`, `render` slot (custom node per point — the badge renderer in the LINE demo uses this to paint the left-edge pills: `position="last"` + `anchor="margin-left"`, each badge aligned to its final point's y).
- Basic overlap suppression for "all": skip a label if its bbox overlaps the previous (estimate 8px×14px boxes).
- Tests: `position="last"` renders one label per series with formatted value; custom `render` output present.

**Commit:** `feat(chart): features — axes, legend, tooltip/hover, title, references, annotations, data labels`

## Phase 5 — Canvas parity

**Task 5.1 — `react/canvas-draw.ts`**
- Draw fns mirroring each SVG mark from the same geometry: line/area (gradients via `createLinearGradient`), markers, bars, pie slices (arc paths + center text/caption), candlesticks, axis lines + tick text (`fillText`, font = `12px` system stack), gridlines, reference lines/bands (band pill via `roundRect`), annotation (dot, dashed line, card via `roundRect` + text), data labels (text or custom canvas fn).
- Series components register their draw fns in Canvas mode (same components, branch on renderer from context).
- Canvas hover/tooltip: same pointer math on the canvas element; tooltip stays the HTML overlay.
- Tests: canvas mode registers ≥1 draw fn per series; draw loop starts and settles (mock ctx + fake clock); no exceptions on a full LINE demo dataset; (pixel-level QA is manual/Playwright, not unit).

**Verify parity:** Playwright screenshot of LINE demo in both renderers side by side; compare geometry (tick positions, curve shapes, band spans). Iterate until indistinguishable at a glance (text rasterization may differ slightly — inherent, per PrimeUI's own docs).

**Commit:** `feat(chart): canvas renderer parity`

## Phase 6 — Demo page (kit-docs)

**Task 6.1 — `ChartLine` icon**
- `react/src/icons/components/ChartLine.tsx` — hand-drawn 24×24 line-chart glyph (axis + rising line + dot), `currentColor`, matching kit icon style (see `Dashboard.tsx` for the pattern).
- `registry.ts`: add `"ChartLine"` to the `IconName` union + map entry.
- Verify: tsc clean (exhaustive map forces the entry).

**Task 6.2 — `components/chart/data.ts` (fixtures)**
- `lineMetrics`: ~70 weekly points Jan 2024 → Jun 2025. Narrative shape from the screenshot: `arr` 100 → ~205 (slow ramp, +105 jump at Nov 2024 pricing lift, continued climb); `activation` 100 → ~171 (steady rise); `retention` ~100 → ~118 (dip mid-2024, recover, gentle rise); `risk` 100 → hump ~120 mid-2024 → ~88 (cooling, small Nov-2024 dip to ~80 then recover toward 99). Phase windows: *Public beta* ≈ Feb 2024–Jun 2024, *Usage pricing* ≈ Nov 2024–Mar 2025 (pricing lift at Nov 1 2024), *Enterprise rollout* ≈ Mar 2025–Jun 2025. Crosshair date: **Nov 1, 2024**.
- `barQuarterly`: Q1–Q4 × {revenue, profit, cost}.
- `piePlans`: 5 plan-mix categories (e.g. Free/Pro/Team/Enterprise/Agency).
- `candlesOhlc`: ~60 trading days seeded random walk (seeded PRNG — deterministic) + one "Pricing lift" annotation day + target price for the reference line.
- Tests: dates ascending & unique; no NaN/nulls in values; counts match expectations; PRNG deterministic (two calls equal).

**Task 6.3 — Demos (`demos/LineDemo.tsx`, `BarDemo.tsx`, `PieDemo.tsx`, `CandlestickDemo.tsx`)**
- `LineDemo`: the full screenshot replication — every element from spec §5 (title/subtitle, 4 series with exact styling, axes, legend, 3 phase bands + pills, baseline reference line, Nov-1 vertical line + date label, 2 annotations, 4 last-value badges, shared tooltip, hover dimming).
- `BarDemo`: grouped columns, Q1–Q4, 3 series; `mode` and `orientation` driven by props from the playground.
- `PieDemo`: donut `innerRadius=0.6`, 5 categories, center total + label, data labels (percent), legend.
- `CandlestickDemo`: 60-day OHLC, time axis, variant prop, OHLC tooltip, one annotation + target reference line.
- Verify: each demo renders in the playground without console errors (manual + a smoke test importing each).

**Task 6.4 — `ChartPlayground.tsx`**
- `PlaygroundPanel` controls (kit `MultiToggle`): **Type** (Line/Bar/Pie/Candlestick), **Renderer** (SVG/Canvas), **Animation** (Off/Default/Elastic/Bounce), per-type: **Curve** (linear/smooth/spline/step) for line; **Layout** (grouped/stacked) + **Orientation** (vertical/horizontal) for bar; **Donut** toggle for pie; **Variant** (candles/hollow/ohlc) for candlestick.
- Preview area renders the selected demo with the selected root (`Chart.Svg` / `Chart.Canvas`) and `animation` config.
- Options lists from `shared/options.ts` (Task 6.6) — never hand-write (Learnings).

**Task 6.5 — `ChartPage.tsx` + examples**
- `PageHeader` + `ChartPlayground` + Examples section with 7 `ExampleCard`s: `Basic`, `AreaAndCurves`, `Annotations`, `RealTime` (interval-appended data, update animation + decimation), `PieDonut`, `Candlestick`, `States` (empty/loading/error placeholders via root `loading`/`error` props — **note:** if root doesn't support loading/error yet, add minimal `loading?: boolean | ReactNode` / `error?: boolean | ReactNode` props to `ChartRoot` in Task 3.2 scope; keep them cheap).
- Each example imports its own source via `?raw` for the code block.

**Task 6.6 — `registry.ts` + `shared/options.ts`**
- Registry entry (category **Data**, after meter-group): `slug: "chart"`, `name: "Chart"`, `icon: "ChartLine"`, description per spec §7.
- `options.ts`: `CHART_TYPES`, `CHART_RENDERERS`, `CHART_EASINGS` (from the animation engine's preset list — export `EASING_PRESETS` from the kit), `CHART_CURVES`, `BAR_MODES`, `BAR_ORIENTATIONS`, `CANDLE_VARIANTS` — all derived from kit runtime lists with the existing `titleCase` helper.
- Verify: `http://localhost:5174/docs/chart` renders; menu shows the entry; type-check demo (`npx tsc -p react/demo`).

**Commit:** `feat(demo): chart docs page — playground, demos, examples, registry entry`

## Phase 7 — Test hardening, visual QA, build, docs

**Task 7.1 — Full test pass**
- `cd react && npm test` — all engine + component tests green (target: ~15 new test files).
- `cd react && npm run lint` — tsc clean.
- `npx tsc -p react/demo` — demo type-checks (Learnings: confirm sources were actually checked, not just config errors).

**Task 7.2 — Visual QA (Playwright)**
- Screenshots of `/docs/chart`: LINE demo (dark, SVG; dark, Canvas; light, SVG), Bar, Pie, Candlestick; compare LINE side-by-side with the reference screenshot (colors, dash patterns, tick label set, band pills, badges, callout placement).
- Chrome flags for glass/backdrop per Learnings (`--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`); wait for entrance animation to settle before capturing (animations don't advance under `--virtual-time-budget` — use a real wait or freeze at final frame).
- Iterate on deltas until the acceptance criteria's "visually close" bar is met; record any deliberate differences.

**Task 7.3 — Build check**
- `cd react && npm run build` — tsup + Tailwind CLI succeed; grep `dist/index.css` for any static chart chrome classes actually used (tooltip/legend/badge) — if any dynamic Tailwind class slipped in, add `@source inline()` safelist entries via `scripts/generate-safelist.mjs` and regenerate (Learnings).
- Confirm d3 bundles cleanly (no external-missing warnings).

**Task 7.4 — Docs & memory**
- `Learnings.md` entries: (a) demo Vite aliases `@cjlapao/ui-kit` → `react/src/index.ts`, so demo dev needs no kit build; (b) anything discovered during visual QA (e.g., d3 tick-count tuning for the reference axis, SVG text vs canvas text differences).
- Final commit: `chore(chart): QA fixes from visual comparison + learnings`.

---

## Sequencing notes

- Phases 1–2 are independent of React — build + test them first; every pixel decision later rests on tested geometry.
- SVG fully works before Canvas is started (Phase 3–4 before 5); Canvas parity is measured against a working SVG baseline.
- One commit per phase (tasks inside a phase may share the commit); keep `Learnings.md` updates with the final phase, not scattered.
- If the time-axis tick set (Task 1.2) proves impossible to match exactly with d3 defaults, the fallback is a custom tick generator for the time scale (still in `scales.ts`, still tested) — do not loosen the test to "whatever d3 emits".
