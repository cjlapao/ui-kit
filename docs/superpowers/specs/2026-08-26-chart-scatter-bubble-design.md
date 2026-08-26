# Chart type: Scatter / Bubble — design

Reference: PrimeUI Pro scatter-bubble. Approved by the user 2026-08-26
("Proceed as designed").

## Element

`<Chart.Scatter data xField yField [sizeField] [name] [color] …>` — the 8th
series type (`"scatter"` in the descriptor). Cartesian: shares x/y scales,
axes, grid, legend, tooltip, loading/error with the other cartesian series.
Both SVG and canvas renderers.

## Fields & scales

- `xField` (number | Date), `yField` (number); field or accessor form like
  the other series. Per-series `yFieldAxis="right"` like line.
- **New axis log scale**: `log` prop on `XAxis`/`YAxis` (numeric only;
  ignored for time/categorical domains). `createLogScale` (d3 `scaleLog`)
  in `engine/scales.ts`; tick labels via `formatSI` (10K / 1M / 1B).
  Domain uses the positive data range; values ≤ 0 are excluded; if no
  positive values exist the axis falls back to linear.
- Auto-domain from data (existing `collectXValues` / `computeYDomain` —
  scatter contributes through the usual x/y accessors).

## Bubble mode

- `sizeField` + `minSize` (default 6) / `maxSize` (default 30):
  area-proportional radius — `r = minSize + (maxSize − minSize) ·
  √((v − vmin)/(vmax − vmin))`.
- No `sizeField` → uniform dots at `minSize` (plain scatter).

## Style props (PrimeUI list)

- `markerShape`: `circle` (default) | `square` | `triangle` | `diamond` |
  `cross` | `star` (reuses the line marker geometry).
- `opacity` (1), `fillOpacity` (1), `borderWidth` (0) with an auto darker
  border when > 0, `pointHitRadius` (default 2) — extra hit slop.

## Hover

- `hoverRadiusMultiplier` (default 1.3) or explicit hover size in px.
- `hoverBrightness` (default 1.1) — reuses the engine brighten util.
- Root `hoverDim` = dimOpacity (already exists).
- `hoverBackgroundColor` `"auto"` (series color) | custom hex, plus
  `hoverBorderWidth` / `hoverBorderColor`.
- Hit test: nearest point center within `r + pointHitRadius`, across all
  visible scatter series; the hit point renders as an enlarged, brightened
  overlay (full opacity); all other series dim via the hoverDim pattern
  (seriesId tag `scatter-dim:${id}`).

## Reference marks

- Existing `ReferenceLine` (x-only / y-only) and `ReferenceBand` unchanged.
- **New: two-point reference line** — `x`/`y` plus `x2`/`y2` (data
  values) renders a sloped line (ROI 5×/10×, Moore's trend); maps through
  any scale (incl. log). Optional label at the end.
- `Annotation` (dot + card + leader) covers per-point callouts.

## Engine — `engine/series/scatter.ts`

- `ScatterPoint { x, y, r }` (pixels), `ScatterGeometry { points }`.
- `computeScatterGeometry({ data, xAccessor, yAccessor, sizeAccessor?,
  xScale, yScale, minSize, maxSize })` — skips non-finite rows.
- `frameScatterGeometry(prev, next, t)` — index-paired morph of x/y/r;
  length changes: extra points grow in from r = 0 at their position;
  removed points shrink out.
- `hitTestScatter(points, px, py, hitRadius)` — nearest center within
  `r + hitRadius`.
- Entrance animation types: `grow` (default) = radius grow + fade;
  `fade` = alpha only; `radial`/`sweep` fall back to `grow`.

## Root

- Scatter is a cartesian series (not excluded from x/y scales).
- Tooltip rows: series name, x, y, size (when bubbled).
- StrictMode-safe update bookkeeping (dataSig-guarded prevRef, per the
  round-15 fix) in the scatter component.
- `data-chart-series` groups; CSS hook `.chart-scatter-point`.

## Demo — `/docs/charts-scatter`

Registry entry + type card on the charts overview + playground kind
`scatter` with the full control panel (Series 1/2/3, marker shape, hit
radius, opacity, fillOpacity, bubble mode + min/max size, per-series
colors, border width, hover: brightness / dim / radius multiplier / hover
size / hover background auto|custom / hover border width).

Examples:

1. **Revenue risk portfolio** — 3 series (Expansion / Recovery / Monitor),
   size = ARR, reference bands (recovery zone, expansion lane), dashed
   reference lines (pressure ceiling, adoption target), annotation callouts.
2. **Moore's Law** — log y, two-point dashed trend line (2×/2 yr),
   annotation callouts (Intel 4004 … NVIDIA B200).
3. **Blockbuster ROI** — log-log, 5 studios, 5×/10× ROI two-point lines,
   annotation callouts.
4. **US tech profitability** — 4 sub-industries, high-margin zone band,
   industry-average line. Standard legend (custom leader-badge legend
   cards are out of scope for v1).

## Tests

- Engine: compute (linear + bubble scaling + uniform), frame morph, hit
  test (inside / outside / nearest), entrance frames.
- Scales: `createLogScale` (map/invert/ticks, positive-domain guard,
  linear fallback).
- Component: render count, bubble vs uniform radius, two-point reference
  line (slanted line in DOM), StrictMode update morph, hover point style
  on pointer move.
- Live Playwright QA on 5176 (render, hover grow, bubble mode, log axis
  ticks, sloped reference lines, animation).

## Out of scope (v1)

Custom HTML legend cards (leader + margin % badges), regression
trendline fitting, bubble collision/packing, per-point labels without
annotations.
