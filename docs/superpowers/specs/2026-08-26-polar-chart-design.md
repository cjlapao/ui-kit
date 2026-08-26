# Polar (rose / nightingale) chart + shared GridSpec — design

Reference: PrimeUI polar playground (grouped, stacked, grid shape/style/width/
opacity/color, border radius/width, hover brightness/dim/offset/scale, sort)
plus the "AI workflow adoption map" (stacked) and "Monaco Grand Prix" (grouped)
examples.

Approved decisions (2026-08-26):

- **Compound children** — one `<Chart.Polar>` per series, like radar.
- **Full shared GridSpec** — grid style/width/opacity/color apply to cartesian
  axes AND radar rings; polar adds gridShape + gridLines + tick labels.
- **Generic hover dim + polar pop** — root `hoverDim` dims non-hovered series
  in any chart; polar adds brightness + radial offset on the hovered segment.
- **Two scenarios + playground** on the docs page.

## 1. Shared GridSpec (engine)

```ts
interface ChartGridSpec {
  style: "solid" | "dashed" | "dotted";
  width: number;    // px, default 1
  opacity: number;  // default 1
  color: string;    // resolved (theme gridColor when unset)
}
resolveGrid(opts?: {
  gridStyle?: "solid" | "dashed" | "dotted";
  gridWidth?: number;
  gridOpacity?: number;
  gridColor?: string;
}, themeColor: string): ChartGridSpec
```

- XAxis / YAxis props gain `gridStyle?` (supersedes `gridDash` — kept as a
  deprecated alias), `gridWidth?`, `gridColor?`. `grid` (on/off) and
  `gridOpacity` are unchanged.
- SVG: dasharray — solid: none; dashed: "4 3"; dotted: "1 3" with round
  linecap. Canvas: `setLineDash` mirror.
- `RadarAxis` accepts the same four props; applied to the ring paths (spokes
  keep their subtle alpha).
- Polar axis config (below) reuses the same four fields.

## 2. Polar engine — `engine/series/polar.ts`

- Angles: first category at 12 o'clock, clockwise (`-π/2 + i·2π/n`), same
  convention as radar.
- `computePolarGeometry(input)` with

  ```ts
  input: {
    categories: { label: string }[];   // ordered, post-sort
    series: { id: string; values: (number | null)[] }[];
    mode: "group" | "stack";
    cx: number; cy: number;
    R: number;                 // outer radius
    innerR: number;            // hole radius (absolute px)
    valueMax: number;          // shared across series
    gapAngle?: number;         // rad, between category slots (auto ≈ 3 px)
    bandGap?: number;          // px, between stacked bands (default 3)
    segmentRadius?: number;    // corner radius px (default 0)
  }
  ```

  - **stack**: series s occupies the band
    `[innerR + Σprev·k, innerR + Σprev·k + value_s·k]` where
    `k = (R - innerR - (bands-1)·bandGap) / maxTotal` — annular sector over
    the full slot (minus gap).
  - **group**: the slot is split into k equal sub-arcs (minus gaps); each
    series is a sector `innerR → innerR + value·kGroup` where
    `kGroup = (R - innerR) / valueMax`.
  - Missing (null) values → no segment (skipped, no gap artifacts).
  - Each segment: `{ path, midAngle, rInner, rOuter, value, categoryIndex,
    seriesId, seriesIndex }`.
  - `roundedAnnularSector(cx, cy, r0, r1, a0, a1, radius)` path builder:
    4 rounded corners (arc of `radius` at each corner), radius clamped so it
    fits the wedge (`min(radius, (r1-r0)/2, arcLen/2 - 1)`); `radius ≤ 0.5`
    yields the plain sector path (outer arc → line → inner arc reversed →
    close).
- `nicePolarMax(value, rings)` — reuse the radar nice-step helper.
- Sort: `"none" | "desc" | "asc"` orders categories by total (stack) / max
  (group) before geometry.
- `hitTestPolar(segments, x, y)` — angle + radius from center → segment or
  null (radius within [rInner, rOuter], angle within the segment's slot).
- `framePolarGeometry(current, previous, progress)` — index-aligned
  (categoryIndex, seriesId) interpolation of rInner/rOuter, paths rebuilt.

## 3. React API

### `<Chart.Polar>` (one element per series)

```ts
interface PolarSeriesProps {
  data: T[];
  categoryField?: keyof T;   // default "category"
  valueYField?: keyof T;     // default "value"
  name?: string; id?: string; color?: string;
  mode?: "group" | "stack";  // default "group"
  innerRadius?: number;      // 0..1 fraction of R, default 0 (like Pie)
  segmentGap?: number;       // px, default auto (3)
  segmentRadius?: number;    // corner radius px, default 0
  borderWidth?: number;      // default 0 (stroke in series color)
  showLabels?: boolean;      // perimeter category labels, default true
  animation?: boolean;
}
```

- Rendered by `PolarSeries` (SVG group `data-chart-series={id}` + canvas
  registerDraw). Fill = solid series color (no area-fill gradient for v1).
- Entrance: segments grow radially from innerR (rOuter eased by progress) +
  group fade; updates interpolate via framePolarGeometry.
- Hover: the hovered segment shifts `hoverOffset` (4 px, default) along its
  mid-angle and brightens (`hoverBrightness`, 1.1 default) — SVG via
  `style={{ filter: "brightness(1.1)" }}`, canvas via a lighten stroke
  pass. Both series props are on the element (defaults above).
- Category labels: painted once by the root grid layer (shared, like radar
  axis labels) at `R + 14`, quadrant-aligned.

### `<Chart.PolarAxis>` (root-consumed, renders null — radar pattern)

```ts
interface PolarAxisProps {
  gridShape?: "circle" | "polygon"; // default "circle"
  gridLines?: number;               // default 4
  gridStyle?: "solid" | "dashed" | "dotted";
  gridWidth?: number; gridOpacity?: number; gridColor?: string;
  showTickLabels?: boolean;         // ring value labels, default false
  tickFormat?: (v: number) => string;
  domainMax?: number;               // default nice max of all values
  sort?: "none" | "desc" | "asc";   // default "none"
}
```

- Rings: `gridShape="circle"` → arc paths; `"polygon"` → N-gon paths (same
  builder as radar rings, N = category count).
- Tick labels sit just left of the top axis (same placement as radar), one
  per ring, when `showTickLabels`.

### Root (`ChartRoot`)

- `polarLayout` memo: categories from the first polar series (≥2 required),
  cx/cy = area center, `R = min(w,h)/2 − 56` (label margin), shared
  `innerR` = max of series innerRadius fractions × R, `valueMax` from
  `PolarAxis.domainMax` or nice max (stack: max category total; group: max
  single value). Published as `ctx.polar` (like `ctx.radar`).
- `polarGrid` memo: rings + spokes (for polygon shape the category spokes;
  circles keep faint spokes too) + category labels + tick labels. Painted in
  the SVG `<g data-chart-layer="polar-grid">` (before plot children) and the
  canvas back layer (like radar).
- Hover: when polar series are visible (and no cartesian/pie series are),
  hit-test the pointer against all visible polar segments → one HoverItem per
  series (that category's value, y = segment mid-radius point), `rawX` =
  category label. Tooltip renders the category header + per-series rows
  (existing Tooltip handles it).
- Polar excluded from cartesian series collection, x-values, y-domain,
  scales; crosshair gated `!radarLayout && !polarLayout`; Legend falls
  through (swatch "bar").

### `hoverDim` (root, generic)

- `Chart.Svg` / `Chart.Canvas` prop `hoverDim?: number` (0–1, default 1 =
  off). When a hover is active, every series group whose id is not present
  in `hover.items` gets `opacity: hoverDim` (250 ms transition, same
  contract as the hidden-series fade).
- Implemented via a `seriesDimStyle(hover, seriesId, hoverDim)` helper in
  `series-common.ts`, used by all series group styles (line, bar, pie,
  candlestick, rangeArea, radar, polar).
- Canvas: draw dimmed series with `globalAlpha = hoverDim` (the registerDraw
  fns read `ctx` hover state as today).

## 4. Center label

`Chart.PieCenter` is reused unchanged — it renders at the chart center for
any chart: "59%" via `value="59%"`, "Monaco / GP sectors" via `value` +
`subtitle`.

## 5. Demo

- `data.ts`:
  - `workflowData` — 12 sectors (Layout refine, Sketch import, Prompt kit,
    Search assist, Anomaly scan, Group finder, Priority sort, Diagram map,
    Link review, Release notes + 2) × `{ autonomous, assisted, manual }`
    weekly volume, autonomous share ≈ 59%.
  - `monacoData` — S1–S8 × `{ redBull, ferrari, mercedes }` sector times.
- `examples/PolarStacked.tsx` — "AI workflow adoption map": 3 ×
  `Chart.Polar mode="stack"` (cyan/purple/amber), `PolarAxis` circles +
  `PieCenter value="59%"`, perimeter labels.
- `examples/PolarGrouped.tsx` — "Monaco Grand Prix — Sector Performance by
  Team": 3 × `Chart.Polar mode="group"` with `segmentRadius` (rounded
  corners), S1–S8 labels, `PieCenter value="Monaco" subtitle="GP sectors"`.
- `ChartPlayground` `fixedKind="polar"` — workflow data; controls: Mode
  (Grouped/Stacked), Sort (none/desc/asc), Segment radius, Border width,
  streaming walk (5 s, values clamped 10–120); grid toggle + renderer as
  today.
- `PolarChartPage` — PageHeader + playground + both scenario cards
  (`?raw` code imports).
- Registry `charts-polar` (Charts category, after `charts-radar`) +
  ChartsPage overview card.

## 6. Tests

- Engine: `resolveGrid` (defaults, dotted/dashed, color fallback); polar
  geometry — group sub-arc angles, stack band radii (exact math), gaps,
  null values skipped, rounded sector path (clamped radius + plain sector
  for 0), hit test (inside/outside radius/angle), sort order, frame
  alignment; polar grid rings (circle vs polygon path strings) + tick
  labels.
- Components: polar SVG — segment counts per series in group and stack
  modes, category labels, tick labels on, PolarAxis polygon shape, center
  label via PieCenter, tooltip (hover a segment → category header + 3 rows),
  `hoverDim` (second series group opacity when first is hovered, default 1
  → no change), radar dashed rings (`gridStyle="dashed"` → dasharray),
  XAxis dotted grid dasharray, canvas no-crash + dimmed alpha.

## 7. Non-goals (v2)

- Hover scale + custom hover color/border color (auto|custom).
- DataLabels / percent labels on polar segments.
- Mixed polar + cartesian charts in one SVG.
- Border color customization (width only, series color).
