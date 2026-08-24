# Chart (PrimeUI Pro mimic) — Design

**Date:** 2026-08-24
**Status:** Approved (brainstorming)
**Scope:** Add a `Chart` component to `@cjlapao/ui-kit` (React) that closely mimics PrimeUI Pro Charts, with a new kit-docs demo page.

---

## 1. Goal

Build a React charting system in `react/` (`@cjlapao/ui-kit`) that reverse-engineers the PrimeUI Pro charts at <https://vue.primeuipro.dev/charts>. The target is a *very close* visual and behavioral match — including the distinctive LINE-tab demo (phase windows, value badges, annotation callouts) — with a full animation system, dual SVG/Canvas rendering from one layout core, and a standard kit-docs page.

Reference screenshot provided (LINE tab, dark theme) is the fidelity benchmark for the flagship demo.

### Reverse-engineered reference (from PrimeUI Pro docs)

PrimeUI Pro uses a **compound API**: `Chart.Svg`/`Chart.Canvas` roots; every visible feature (series, axes, legend, tooltip, hover, annotations, reference lines/bands, data labels, title/caption, zoom, navigator, group) is a child component — "the component is the configuration." Data is a flat `T[]` of objects; each series binds `categoryXField`/`valueYField`. Animation has entrance, update, and looping property animations, with an `animation` prop (duration + easing), custom easing registration, and `animation: false`. SVG and Canvas share one layout pass. The charts page shows 14 product-grade demo tabs.

## 2. Approved decisions (brainstorming Q&A)

| Decision | Choice |
|---|---|
| Scope | Line + Bar/Column + Pie/Donut + Candlestick |
| API shape | Compound API mirroring PrimeUI |
| Renderers | SVG + Canvas (shared layout core) |
| Demo page | Standard kit-docs pattern (playground + examples) |
| Animation | Full PrimeUI set (entrance/update/exit, easing presets + custom registration, `animation={false}`, reduced-motion) |
| Engine | Custom hand-built SVG + Canvas renderers, with d3 micro-modules for scale/tick/curve math |

## 3. Public API

Exported from `@cjlapao/ui-kit` as one `Chart` namespace.

```tsx
import { Chart } from "@cjlapao/ui-kit";

<Chart.Svg height={420} animation={{ duration: 900, easing: "easeOutQuart" }}>
  <Chart.Title title="Release-room health index"
               subtitle="Four launch metrics are indexed to 100…" />
  <Chart.Line data={metrics} categoryXField="date" valueYField="arr"
              name="Expansion ARR" color="purple" fillOpacity={0.35} curve="smooth" />
  <Chart.Line data={metrics} categoryXField="date" valueYField="activation"
              name="Activation rate" color="blue" curve="smooth" showMarkers />
  <Chart.Line data={metrics} categoryXField="date" valueYField="retention"
              name="Week 8 retention" color="green" lineStyle="dashed" />
  <Chart.Line data={metrics} categoryXField="date" valueYField="risk"
              name="Support risk" color="red" lineStyle="dotted" />
  <Chart.XAxis />                                   {/* time axis, adaptive date ticks */}
  <Chart.YAxis domain={[50, 350]} />
  <Chart.Legend />                                  {/* click-to-toggle series */}
  <Chart.Tooltip mode="shared" />                   {/* crosshair + shared card */}
  <Chart.Hover />                                   {/* nearest-mark highlight, dims peers */}
  <Chart.ReferenceLine y={100} label="Indexed baseline" />
  <Chart.ReferenceBand x1={betaStart} x2={betaEnd} color="teal" label="Public beta" />
  <Chart.Annotation x={liftDate} y={205} tone="purple"
                    title="Pricing lift" value="+105 pts" leaderLine />
  <Chart.DataLabels position="last" render={renderBadge} />  {/* the 205/171/118/88 badges */}
</Chart.Svg>
```

### Component inventory (this round)

| Group | Components |
|---|---|
| Roots | `Chart.Svg`, `Chart.Canvas` — same children; manage layout, scales, animation loop, theme |
| Series | `Chart.Line` (area via `fillOpacity`), `Chart.Bar` (group/stack/horizontal), `Chart.Pie` (donut via `innerRadius`), `Chart.Candlestick` (OHLC fields) |
| Axes | `Chart.XAxis` (category/linear/**time** auto-detected, grid, ticks, title), `Chart.YAxis` (linear, dual via `axis="right"`) |
| Overlays | `Chart.Legend`, `Chart.Tooltip` (shared/crosshair/follow + custom slot), `Chart.Hover`, `Chart.DataLabels` (formatter/anchor + custom render slot) |
| Marks | `Chart.Title`, `Chart.Caption`, `Chart.ReferenceLine`, `Chart.ReferenceBand` (phase windows + pill labels), `Chart.Annotation` (marker + callout card + leader line) |

### Data model

Flat `T[]` of objects. Each series binds its own `valueYField`; `categoryXField` is shared or per-series. `color` accepts a kit `TrueColor` (`"purple"`), a hex string, or a gradient object `{ x1, y1, x2, y2, stops }`. `null` values break the line (`connectNulls: "gap" | "connect" | "zero"`).

### Key root props

`height`, `margin`, `theme?: "light" | "dark" | "auto"` (auto follows the kit theme), `animation?: false | { duration, easing }` (+ per-series `animation` override), and an imperative `redraw()` ref method (mirrors PrimeUI).

### Out of scope (documented, built for later)

`Chart.Zoom`, `Chart.Navigator`, `Chart.Group` (synced charts), `Chart.Export`, `Chart.Accessibility` (canvas a11y), Gauge/Nightingale, Treemap, Radar, Polar, Heatmap, Waterfall, Range-Area wrapper, Combo.

## 4. Architecture

Location: new `react/src/components/chart/` folder, published as part of `@cjlapao/ui-kit`, exported from the barrel. The engine is plain TypeScript (no React); the surface is thin React.

```
react/src/components/chart/
├── engine/                  # framework-agnostic core — fully unit-testable
│   ├── types.ts             # ChartSeries, Accessor, GradientColor, PointContext, Layout…
│   ├── scales.ts            # d3-scale wrappers: linear / time / band / point + nice ticks
│   ├── layout.ts            # margins → chartArea; reserves space for axes, legend, title, bands
│   ├── series/
│   │   ├── line.ts          # points, line+area paths (d3-shape curves), gaps
│   │   ├── bar.ts           # group/stack rect layout, horizontal mode
│   │   ├── pie.ts           # arc math, donut cutout, label positions
│   │   └── candlestick.ts   # OHLC wicks/bodies, bull/bear resolution
│   ├── decimation.ts        # stride decimation for > ~2pt/px data
│   └── animation.ts         # rAF engine: easing registry, entrance/update/exit,
│                            #   animation=false + prefers-reduced-motion
├── react/
│   ├── ChartRoot.tsx        # Chart.Svg / Chart.Canvas — the compound root
│   ├── ChartContext.tsx     # provides { scales, layout, theme, progress, registerDraw }
│   ├── svg-marks.tsx        # SVG mark components (path/rect/arc) reading context
│   ├── canvas-draw.ts       # imperative draw fns per mark type for the canvas loop
│   ├── Line.tsx Bar.tsx Pie.tsx Candlestick.tsx
│   ├── XAxis.tsx YAxis.tsx Legend.tsx Tooltip.tsx Hover.tsx DataLabels.tsx
│   ├── Title.tsx Caption.tsx ReferenceLine.tsx ReferenceBand.tsx Annotation.tsx
│   └── index.ts             # assembles the `Chart` namespace object
└── index.ts                 # public re-exports (Chart, registerEasing, types)
```

### Compound API in React (the recharts model)

1. **Root inspects children.** `ChartRoot` reads `React.Children` (series children's props) to compute data domains, scales, and layout — config children (axes, legend, bands) only flag features. Same render, no registration round-trip.
2. **Root computes geometry once** per data/prop change and puts `{ xScale, yScale, chartArea, theme, seriesGeometry }` into context.
3. **Children render marks.** SVG mode: each series/feature renders real SVG elements (`<path>`, `<rect>`, `<text>`, `<g>`) — CSS-stylable, DOM-accessible. Canvas mode: children register a `draw(ctx, progress)` via context; a `requestAnimationFrame` loop (DPR-aware, `ResizeObserver`-sized, same pattern as `EcgMonitor`) repaints from shared geometry.
4. **One layout, two renderers** — geometry is renderer-agnostic, so SVG and Canvas match by construction.

### Animation flow (single engine, both renderers)

- **Entrance:** on mount, an eased `progress` 0→1 drives marks — lines reveal via a stroke-dash trick, bars/pie scale from 0, areas reveal left→right.
- **Update:** on data change, the engine interpolates old→new geometry per frame (matched by `keyField`/category), one rAF loop, all series in one pass.
- **Exit:** removed series fade/interpolate out before unmount.
- `animation={false}` and `prefers-reduced-motion: reduce` short-circuit to the instant final state.
- Easing: `easeOutQuart` default (1000 ms); presets + `registerEasing(name, fn)` / `getEasing(name)`.
- **Implementation detail:** SVG animates by re-rendering with `progress` (frame state on the root — cheap at demo scale). Canvas animates by calling registered draw fns with `progress` (no React re-render). 100K-point charts should use Canvas (documented, matching PrimeUI's guidance).

### Dependencies added

`d3-scale`, `d3-shape`, `d3-time`, `d3-array` (+ `@types/*` for each) — micro-modules, tree-shakeable, no umbrella `d3`. `recharts` stays untouched (StatGraphTile keeps working).

### Theming

`engine/theme.ts` holds chart tokens — default series palette (the screenshot's indigo/sky/emerald/red at 400–500), and grid/axis/tooltip tokens per light/dark. `theme="auto"` reads the kit's existing dark-mode hook. Series `color` accepts kit `TrueColor` and resolves from the theme palette so charts stay in the kit's color system.

### Error handling / edge cases

- Empty `data` → empty state (kit's `EmptyState`-style placeholder)
- All-null series → skipped gracefully
- Mixed date/string x values → falls back to category axis
- Container width 0 (hidden tab) → `ResizeObserver` defers first paint
- `ResizeObserver`/`matchMedia` already stubbed in `test-setup.ts` for jsdom

## 5. The four chart demos

### LINE demo (replicating the reference screenshot; playground flagship)

- **Data:** ~70 weekly points, Jan 2024 → Jun 2025 (17 months, matching the axis span); fields `arr`, `activation`, `retention`, `risk`.
- **Series:**
  - *Expansion ARR* — purple, area (`fillOpacity={0.35}`, vertical gradient), `curve="smooth"`, ends 205
  - *Activation rate* — sky, smooth line with markers, ends 171
  - *Week 8 retention* — emerald, `lineStyle="dashed"`, ends 118
  - *Support risk* — red, `lineStyle="dotted"`, ends 88
- **Frame:** `Chart.Title` + subtitle; centered legend (area swatch = rounded rect, line swatches carry their dash style); Y-axis 50→350 with dashed gridlines; time X-axis with adaptive ticks ("2024 · Mar 2024 · May 2024 · … · May 2025").
- **Annotations (the distinctive part):**
  - Three `ReferenceBand` phase windows — *Public beta* (teal), *Usage pricing* (violet), *Enterprise rollout* (blue) — each with a pill label (dot + text, rounded outline) at the window's top.
  - `ReferenceLine y=100` dashed, left label "Indexed baseline".
  - `ReferenceLine x=Nov 1 2024` dashed vertical with bottom date label "Friday, Nov 1, 2024".
  - Two `Annotation` callouts — "Pricing lift / +105 pts" (violet) and "Risk burn cooling / 99 index" (red) — dot markers with dashed leader lines into the card.
  - `DataLabels position="last"` with a custom badge renderer → the 205 / 171 / 118 / 88 pills stacked in the left margin, each at its series' final point's y-position.
- **Interaction:** shared-mode tooltip with crosshair + date header; hover dims peers; SVG/CANVAS toggle.

### BAR demo

Quarterly Q1–Q4, three series (Revenue / Profit / Cost), grouped columns with a Grouped↔Stacked toggle, horizontal-orientation toggle, legend, tooltip, entrance = columns grow from baseline.

### PIE/DONUT demo

Donut (`innerRadius={0.6}`), five plan-mix categories in the default palette, center slot with total + label, data labels with percentages, legend beside; hover pops the slice out 4px and shows the tooltip.

### CANDLESTICK demo

~60 trading days of synthesized OHLC, time axis, emerald/red bodies by direction, `variant` toggle (candles ↔ hollow ↔ OHLC bars), hover with OHLC tooltip, one `Annotation` (e.g. "Pricing lift") + a `ReferenceLine` at a target price.

## 6. Feature behavior specs

| Feature | Behavior |
|---|---|
| **Axes** | auto tick count; time axis adapts to range (year → month → day); dashed gridlines; optional axis title; dual Y via `axis="right"` |
| **Legend** | top-center placement in demos; swatch matches series shape (rounded-rect for area, dashed line sample, square, circle); click toggles series with exit/enter animation; buttons with `aria-pressed`, keyboard-operable |
| **Tooltip** | HTML overlay (absolutely positioned, same in both renderers); modes `shared` (snapped x, all series), `follow`, `crosshair` (adds cross lines); time header; `itemFormat`; flips near container edges; hidden on leave |
| **Hover** | nearest mark within ~24 px; marker grows; other series dim to 0.35 opacity ("peer dimming"); `onHover` callback |
| **DataLabels** | `position: "last" \| "all" \| "none"`, `formatter`, `anchor`, custom `render` slot; basic overlap suppression for "all" |
| **ReferenceLine** | x or y value, dashed by default, `label` with side/inside-outside placement |
| **ReferenceBand** | x1/x2 or y1/y2, tone + low opacity fill (0.08–0.12), pill label slot at window top |
| **Annotation** | point (field or explicit x/y), marker dot, card (title + toned value row), `leaderLine` (dashed), auto-flip near edges |
| **Title/Caption** | props or slots; header/subtitle/footer aligned to chart frame |
| **Responsive** | `ResizeObserver` + `height` prop; layout recomputes on resize; deferred first paint at width 0 |
| **A11y** | `role="img"` + `aria-label` from title; decorative marks `aria-hidden`; legend buttons focusable; canvas keyboard-nav noted as future work (PrimeUI's `Chart.Accessibility`) |
| **Theme** | `theme="auto" \| "light" \| "dark"`; auto follows the kit's dark mode; tokens for grid/axis/tooltip per scheme; default series palette = the screenshot's indigo/sky/emerald/red (+ amber/teal/pink/orange for more series) resolved from the kit's `TrueColor` hex |
| **Edge cases** | empty data → kit-style empty placeholder; all-null series skipped; mixed date strings fall back to category axis; hidden container defers paint |

## 7. Demo page (kit-docs pattern)

**Registry entry** (`registry.ts`, category **Data**, after meter-group):

- slug `chart`, name **Chart**
- description: *"A unified charting system for SVG and Canvas from the same compound API — axes, legends, tooltips, annotations and entrance/update animation, with Line, Bar, Pie/Donut and Candlestick series."*
- icon: new `ChartLine` glyph added to the icon registry (hand-drawn SVG component matching the kit's icon style), used here

**Files** under `react/demo/src/kit-docs/components/chart/`:

| File | Content |
|---|---|
| `ChartPage.tsx` | `PageHeader` + playground + Examples section (same shape as CarouselPage) |
| `ChartPlayground.tsx` | Controls: **Type** (Line / Bar / Pie / Candlestick), **Renderer** (SVG / Canvas), **Animation** (Off / Default / Elastic / Bounce), plus per-type toggles (curve for line; grouped↔stacked + orientation for bar; donut on/off for pie). Preview renders the selected demo — the LINE preview is the full screenshot replication with its phase windows, badges and callouts |
| `demos/LineDemo.tsx`, `BarDemo.tsx`, `PieDemo.tsx`, `CandlestickDemo.tsx`, `data.ts` | The four demos + fixtures (weekly metrics, quarterly P&L, plan mix, synthesized OHLC) |
| `examples/Basic.tsx` | Minimal compound API: one series, two axes, legend, tooltip |
| `examples/AreaAndCurves.tsx` | Area fills + curve types (linear / smooth / spline / step) |
| `examples/Annotations.tsx` | Reference lines, phase bands and annotation callouts |
| `examples/RealTime.tsx` | Streaming updates — data appends on an interval, update animation + decimation in action |
| `examples/PieDonut.tsx` | Donut with center slot and data labels |
| `examples/Candlestick.tsx` | OHLC with variant toggle (candles / hollow / OHLC bars) |
| `examples/States.tsx` | Empty / loading / error placeholders |

`shared/options.ts` gains chart option lists derived from the kit's runtime constants (per the Learnings rule: never hand-write option lists that can drift).

## 8. Testing

- **Engine unit tests** (vitest, plain functions): scales (nice ticks; time axis over the demo range produces the adaptive label set), layout math, line path generation per curve type + `connectNulls` gaps, bar group/stack positioning, pie arc sums, candlestick geometry, easing registry (endpoints, monotonicity), animation orchestrator (progress reaches 1 and stops; `animation={false}` and reduced-motion are instant), decimation stride cap.
- **Component tests** (Testing Library): SVG marks render per series; legend click hides a series with exit; tooltip shows values on hover; empty data renders the placeholder; Canvas mode mounts a canvas and registers draw functions (mocked 2d context).
- **Visual verification:** run the demo app, screenshot `/docs/chart` with Playwright (using the glass-safe Chrome flags from Learnings), compare side-by-side against the reference screenshot, iterate until close.

## 9. Performance notes

- Line entrance uses a stroke-dash reveal (path computed once, dashoffset animated) so the flagship demo never re-renders paths per frame; only data *updates* interpolate geometry.
- Large datasets should use Canvas (documented).

## 10. Deliverables

1. `react/src/components/chart/**` — engine + React surface + barrel exports.
2. New `ChartLine` icon component in `react/src/icons/` + registry entry.
3. d3 dependencies added to `react/package.json` (+ `@types/*`).
4. Demo page files + `registry.ts` entry + `shared/options.ts` additions.
5. Engine + component tests.
6. Learnings.md note if any new gotchas are discovered.

## 11. Risks / mitigations

- **Time-tick label fidelity** vs. the screenshot — mitigated by `d3-scale` `scaleTime` ticks + tick formatting; verify in visual QA.
- **SVG per-frame re-render** on the flagship demo — mitigated by stroke-dash entrance (no per-frame path recompute); updates are the only per-frame interpolation.
- **Canvas + jsdom** — `requestAnimationFrame`/`ResizeObserver`/`matchMedia` already stubbed in `test-setup.ts`; canvas 2d context mocked in tests.
