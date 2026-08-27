# Heatmap chart — design (round 25)

**Status:** approved 2026-08-26 (user: "next type the heatmap" +
"Proceed as designed (Recommended)").

## Goal

A first-class **heatmap** chart type: a grid of cells colored by value on a
configurable color scale, with row/column category labels, in-cell value
labels (optionally with a tier word), null/missing cells, a gradient legend
bar, and cell-level hover tooltips — matching the four PrimeVue reference
examples:

1. **S&P 500 sector correlation matrix** (9×9) — diverging white → cyan →
   blue → purple scale, value + tier word per cell (INDEP / WEAK / MOD /
   STRONG), gradient legend 0 / 0.5 / 1.
2. **Olympic medal table** (10 sports × 10 nations) — sequential
   pale-yellow → orange scale, missing cells left empty (dark), legend
   0 / 9 / 18.
3. **SaaS monthly-cohort retention** (11 cohorts × M0–M11) — triangular
   data (unobserved cells null), 3-stop red → yellow → teal scale, legend
   0 / 50 / 100, a red annotation pill on a cell
   ("Activation cliff: M0 → M1").
4. **Commute intensity** (7 days × 6 hour bands) — sequential warm scale,
   no legend.

## Architecture — self-contained (like pie/gauge)

Heatmaps are **not cartesian**: no x/y value scales, no axes. Like
`PieSeries`, `HeatmapSeries` owns its layout inside the plot area:

```
plot area
┌──────────────────────────────────────────┐
│ row-label │  ┌── cell grid (rows × cols) ┐ │
│  gutter   │  │                           │ │
│           │  └───────────────────────────┘ │
│           │  col labels (horizontal)       │
│           │  ▓▓▓▓ gradient legend ▓▓▓▓     │
└──────────────────────────────────────────┘
```

- **Left gutter**: `rowLabelWidth` heuristic (longest row label,
  `chars × 6.4px` at 11px) + 10px, overridable via prop.
- **Bottom space**: col-label row (24px when `colLabels`) + legend
  (~40px when `showLegend`).
- Cell geometry: `cellW = gridW / cols.length`, `cellH = gridH /
  rows.length`; rect inset by `cellGap` (default 3) and
  `cornerRadius` (default 3).
- Hover: root `computeHover` gains a **heatmap branch** (mirroring the
  pie branch): `heatmapVisible.length > 0 && cartVisible.length === 0` →
  hit-test `(px,py)` against the grid (floor math with the layout from a
  new `heatmapLayout` memo in the root, computed via the engine). One
  hover item per hit: `value`, `item` (raw datum), `index`, `name`
  (series name); demo tooltips use the `rows` callback (established
  pattern) to show `row × col → value`.
- Root exclusions: add `"heatmap"` to the non-cartesian filters
  (`collectXValues`, cartesianSeries, last-point map, L1796-style skips).

## Engine — `engine/series/heatmap.ts` (new)

```ts
export interface HeatmapCellDatum { row: string; col: string; value: number | null; data: unknown; index: number }
export function computeHeatmapCells(rows: string[], cols: string[], data: unknown[], rowField, colField, valueAccessor): { cells: HeatmapCellDatum[]; byKey: Map<string, number | null>; min: number; max: number }
export function computeHeatmapLayout(opts: { area: {x,y,width,height}; rowLabelWidth: number; showColLabels: boolean; showLegend: boolean }): { gridX, gridY, gridW, gridH, cellW, cellH, legendY, legendH }
export function sampleColorStops(stops: string[], t: number): string  // linear RGB interp, clamped
export function contrastTextColor(hex: string): "#ffffff" | "#0b1020" // relative luminance ≥ 0.55 → dark
export function hexToRgb / rgbToHex (internal)
```

- `computeHeatmapCells`: index `data` by `row|col` key; every (row, col)
  pair yields a cell (null when absent/non-finite) — missing cells are
  first-class so gaps render (Olympics example). `min`/`max` over
  non-null values (min defaults 0 when all values ≥ 0).
- `sampleColorStops`: piecewise-linear in RGB across `stops` at equal
  t-intervals; t clamped to [0,1].

## Props — `HeatmapSeriesProps` (props.ts)

| Prop | Default | Notes |
| --- | --- | --- |
| `data: T[]` | — | flat cells |
| `rows?: string[]` | derived | explicit row order (enables missing cells) |
| `cols?: string[]` | derived | explicit col order |
| `categoryYField?` / `categoryXField?` | "row" / "col" | accessors |
| `valueField?` | "value" | accessor; non-finite/missing → null cell |
| `colorStops?: string[]` | `["#dbeafe", "#3b82f6", "#7c3aed"]` | sequential or diverging, 2+ stops |
| `domain?: [number, number]` | data min/max | value range for the scale |
| `nullColor?` | subtle plot-surface tint | fill for missing cells; `null` hides |
| `valueLabels?` | `false` | in-cell value text |
| `valueLabelFormat?` | `v.toFixed(2)` | |
| `tierLabel?` | — | `(v) => string \| null`, smaller second line (WEAK/MOD/…) |
| `cellGap?` | 3 | px |
| `cornerRadius?` | 3 | px |
| `rowLabels?` / `colLabels?` | `true` | gutters + label text |
| `showLegend?` | `true` | gradient bar with tick labels |
| `legendTicks?` | 3 | count of min/mid/max-style ticks |
| `annotations?: { row, col, label, tone? }[]` | — | rounded pill anchored to a cell (`tone: "red" | "amber" | "neutral"`) |
| `name?`, `id?`, `color?`, `animation?` | — | standard |

Series descriptor gains: `type: "heatmap"` + fields
`heatmapRows/heatmapCols/heatmapColorStops/heatmapDomain/heatmapNullColor/heatmapValueLabels/heatmapValueLabelFormat/heatmapTierLabel/heatmapCellGap/heatmapCornerRadius/heatmapRowLabels/heatmapColLabels/heatmapShowLegend/heatmapLegendTicks/heatmapAnnotations/heatmapLayout`
(layout memo filled by the root).

## Component — `react/series/HeatmapSeries.tsx` (new)

- `me` = first heatmap descriptor (single-series chart; mixing is
  unsupported, like pie + bar).
- SVG: cell `<rect>`s (+ value/tier `<text>`s, null slots, annotation
  pills `<g>` rect+text, col/row labels, legend `<linearGradient>` +
  rect + tick texts).
- Canvas: same via `registerDraw` (createLinearGradient for the legend).
- Entrance: per-cell staggered fade/grow —
  `local = clamp(progress * 1.6 - (rowIdx + colIdx) * 0.03, 0, 1)`,
  scale about cell center; `animation={false}` → settled.
- Text contrast: `contrastTextColor(cellColor)` for value labels.

## Demo — `/docs/charts-heatmap`

Data (`data.ts`): `heatCorrelation` (9×9 symmetric Pearson matrix,
8 sectors: Tech, Financials, Health, C. Discr., C. Staples,
Industrials, Energy, Utilities, Materials — upper triangle + mirror),
`heatOlympics` (10 sports × 10 nations, a few nulls),
`heatCohort` (Jan–Nov 2024 × M0–M11, triangular nulls, 97 → ~12%),
`heatCommute` (Mon–Sun × 08–18, 0–100 intensity).

Examples: `HeatmapCorrelation` (diverging scale + tiers, legend
0/0.5/1), `HeatmapOlympics` (gold sequential, null cells, legend
0/9/18), `HeatmapCohort` (3-stop scale, annotation pill, legend 0/50/100),
`HeatmapCommute` (warm scale, `showLegend={false}`).

`HeatmapChartPage` (PageHeader + `ChartPlayground fixedKind="heatmap"` +
4 ExampleCards), registry entry `charts-heatmap` (icon `ChartLine`),
`ChartsPage` TYPE_LINKS card.

Playground kind `heatmap`: 7×12 commute-style data; controls —
palette (Ocean / Warm / Gold / Diverging MultiToggle), Value labels,
Legend, Cell radius (0/3/8 MultiToggle).

## Tests

- `heatmap.test.ts` (engine): cell indexing + missing cells, min/max;
  layout math (grid origin/size with gutters, legend row);
  `sampleColorStops` endpoints + midpoint + 3 stops; `contrastTextColor`
  light/dark.
- `chart-components.test.tsx` "heatmap series": renders rows×cols rects,
  null cells get the null fill, value labels present, legend gradient
  present, hover (mocked svg rect + pointerMove over a cell → tooltip).

## Out of scope

- No cartesian mixing (heatmap-only charts; documented).
- No canvas text measurement for the row gutter (heuristic + override).
- No per-cell click/selection interactions.

## Verification

- `tsc --noEmit` (kit, WIP-filtered) + demo tsc + full vitest.
- Playwright on :5176: 4 examples render (SVG), playground palettes
  (SVG + canvas), hover tooltip on a cell, dark + light screenshots.
- Surgical commit (explicit paths only).
