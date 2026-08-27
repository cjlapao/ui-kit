# Chart.Treemap — Design (Round 26)

PrimeVue Pro reference: https://vue.primeuipro.dev/charts/types/treemap
Reference screenshots (user-provided): flat continent tiles (single color),
the same data with per-category palette colors, stock tiles (AAPL/GOOGL/…)
with a top-left title, signed delta pill, and bottom-left value, and a
two-group layout (ENGINEERING / MARKETING) with uppercase group headers,
group borders, and a group-total tooltip on the header.

## 1. Architecture

Self-contained non-cartesian series, same family as pie/gauge/heatmap:
the series owns its layout inside the plot area. No x/y value scales, no
axes, treemap-only charts (mixing with cartesian series is unsupported,
like pie+bar; documented in the props JSDoc).

Layout per group (groups are optional):

```
┌───────────────────────┐
│ GROUP HEADER (18px)   │  reserved when groupField is set
├───────────────────────┤
│  ┌──────┐ ┌─────────┐ │
│  │tile  │ │  tile   │ │  squarified children
│  └──────┘ └─────────┘ │
└───────────────────────┘
```

- Top-level regions are squarified by group total (flat data = one
  region covering the whole area, no header).
- Each group reserves a header band at the top, then squarifies its
  children into the remaining space.
- Squarified layout: classic Bruls/van Wijk algorithm (sort descending,
  worst-aspect-ratio row selection), implemented in the engine as pure
  math over `{value}` items.

## 2. Engine — `engine/series/treemap.ts`

- `squarifyArea(area: {x,y,width,height}, items: number[]): Rect[]` —
  squarified treemap of one region for descending-sorted values; returns
  one rect per value (same order as input). Degenerate: zero/negative
  total → all rects zero-sized.
- `computeTreemapLayout(area, groups: { name: string; values: number[] }[], headerHeight): { groups: { name: string; rect: Rect; headerH: number; body: Rect; tiles: Rect[] }[] }` —
  squarifies the group regions (by totals), then each group's children.
  Flat data is passed as a single group with `headerH: 0`.
- `hitTestTreemap(layout, px, py): { group: number; tile: number } | null` —
  point-in-rect over groups; also reports a header hit as `tile: -1`
  (hovering the header band → group total tooltip).
- Export `Rect` type (`{x,y,width,height}`).
- Tests (`treemap.test.ts`): area preservation (sum of tile areas ==
  region area within epsilon), single-item fills region, ordering
  (largest first), grouped geometry (header band + body partition),
  hit-test (tile, header, outside → null), degenerate zero total.

## 3. Props — `TreemapSeriesProps<T>`

| Prop | Default | Notes |
|---|---|---|
| `data: T[]` | — | flat array |
| `categoryField` | `"name"` | tile label |
| `valueField` | `"value"` | numeric |
| `groupField` | — | when set, tiles cluster into regions with an uppercase header band |
| `color` | — | uniform fill for all tiles (flat example) |
| `colors` | — | per-tile array (by tile order); beats palette |
| `colorAccessor` | — | `(item, i) => string` for dynamic fills |
| palette | — | default when none of the above: one hue per tile (series palette, same as pie); palette index is by **data order**, so colors stay stable when the layout re-sorts values |
| `showLabels` | `true` | tile title, centered (flat) or top-left (when `valueLabels`) |
| `labelFormat` | — | `(label, item, i) => string` |
| `valueLabels` | `false` | draw the value in the bottom-left corner (stock style); moves the title top-left |
| `valueLabelFormat` | `(v) => String(v)` | e.g. `$${v}T` |
| `deltaField` | — | signed numeric field → pill under the title (▲ green / ▼ red); missing → no pill; `0` → no pill (edge case) |
| `deltaFormat` | `(v) => \`${Math.abs(v)}%\`` | triangle glyph is drawn, sign is not printed |
| `gap` | `2` | px between tiles; engine rects are the full cells, the series insets each drawn rect by `gap/2` (heatmap-cell style) |
| `cornerRadius` | `0` | px |
| `groupHeaderHeight` | `18` | px band; uppercase, letter-spaced |
| `name` / `id` / `animation` | — | standard |

Descriptor: `type: "treemap"` + `treemapLabel`/`treemapValue` accessors,
`treemapGroup` accessor, `treemapColor*` fields, `treemapValueLabels`,
`treemapDelta*` fields, `treemapLayout` (filled by the root memo) and
`treemapItems` (resolved `{label, value, group}` list from describeSeries).

## 4. Root integration (`ChartRoot.tsx`)

Mirror the heatmap round:

- `summarizeChildren`/`describeSeries`: `"treemap"` kind branch (kind
  union, types param, child-split, registry object + `Chart` namespace +
  re-export in `chart/index.ts`).
- Non-cartesian exclusions: `cartesianSeries` filter, `collectXValues`,
  last-point endpoints skip.
- `treemapLayout` memo (like `scatterLayout`): resolve items + groups
  from the descriptor, run `computeTreemapLayout` over `area`, keyed by
  `[treemapSeries, area]`.
- `computeHover`: branch `treemapVisible.length > 0 && cartVisible.length === 0`,
  placed **before** the cartesian `return null` guard (the heatmap
  lesson): `hitTestTreemap` → one HoverItem
  `{seriesId, name: tile label (group total name for header hits), color,
  value, y: tileCenterY, item: raw datum, index}`.

## 5. Series component — `react/series/TreemapSeries.tsx`

- `me` = first treemap descriptor; layout from the `treemapLayout`-style
  local memo (series recomputes via the shared engine fn, same as heatmap
  does with `computeHeatmapLayout`).
- SVG: one `<g data-chart-series>` containing: per group — header band
  text (uppercase) + group border rect (when grouped); per tile —
  `<rect>` fill (color/colors/accessor/palette), centered title
  (default) or top-left title + delta pill + bottom-left value
  (when `valueLabels`); delta pill = rounded rect + ▲/▼ glyph, green
  (`#10b981` tinted) / red (`#ef4444` tinted).
- Canvas: same drawing in `registerDraw`.
- Entrance: per-tile staggered fade+scale (index-ordered), settled when
  `progress >= 1` or `animation={false}`.
- Hover: hovered tile gets a contrast outline (like heatmap); hovered
  group header gets a subtle highlight.
- Label fit: skip the label if the tile is too small (< ~34px width for
  title, < ~20px height).

## 6. Demo

`data.ts`:

- `treemapContinents` — Asia 45, Africa 28, Europe 22, "N. America" 14,
  "S. America" 8, Oceania 3 (matches the flat + palette screenshots).
- `treemapStocks` — AAPL 2.9 (+1.2), GOOGL 1.7 (+2.1), AMZN 1.6 (−1.5),
  MSFT 2.8 (−0.8), NVDA 1.2 (+3.4), META 0.9 (+0.6); fields
  `{symbol, value, delta}`.
- `treemapTeams` — Engineering: Frontend 42, Backend 34, DevOps 28, QA 19
  (sum 123, matching the reference tooltip); Marketing: Digital 38,
  Brand 24, Events 16, HR 22, Finance 18, Legal 12.

Examples (4):

1. `TreemapContinents.tsx` — flat, uniform `color` (sky blue), centered
   labels, no legend.
2. `TreemapRegions.tsx` — same data, default palette colors, tooltip
   `rows` (name + share % of total).
3. `TreemapStocks.tsx` — `categoryField="symbol"` (the tile title),
   `valueLabels` + `valueLabelFormat={(v) => \`$${v}T\`}`, `deltaField="delta"`,
   muted palette (6 blues/indigos/teals via `colors`), tooltip rows
   (symbol, market cap, Δ with color).
4. `TreemapTeams.tsx` — `groupField="group"`, palette tiles, group
   headers; tooltip rows (team, headcount value; group total on header
   hover).

Page `TreemapChartPage.tsx` (PageHeader + playground `fixedKind="treemap"`
+ 4 ExampleCards with `?raw` code), playground kind `"treemap"` (Controls:
Colors MultiToggle Flat/Palette/Custom, Grouped toggle switches the demo
dataset, Value labels toggle, Corner value toggle), `chartKindOptions` +=
Treemap, registry `charts-treemap` (icon `ChartLine`), `ChartsPage`
TYPE_LINKS card.

## 7. Tests

Engine (`treemap.test.ts`): as in §2.
Component (`chart-components.test.tsx` "treemap series"):

- flat: one rect per item (6), fills uniform when `color` set, distinct
  when palette; centered label text present.
- grouped: group header text rendered (uppercase), tile count, header
  band reserved (first tile y > group top).
- stocks: delta pill renders (▲ text / colored rect) and corner value
  text (`$2.9T`) present.
- hover: tooltip with tile value via mocked svg rect + pointerMove on the
  hover rect (established pattern).

## 8. Verification

- Kit: `tsc --noEmit` (WIP-filtered), full `vitest run` (baseline after
  this round: 2342 passing / 103 files pre-treemap).
- Demo tsc from `react/demo` cwd (WIP-filtered).
- Playwright on :5176 `docs/charts-treemap`: 4 examples SVG in dark +
  light, playground palette/grouped/corner-value states (SVG + canvas
  lit-sample), hover tooltip on a tile and on a group header — scroll the
  inner scroller first.
- Screenshots reviewed before commit.

## 9. Out of scope (YAGNI)

- Nested groups deeper than one level, interactive drill-down.
- Treemap sorting/ratio options (squarify only; no slice-and-dice /
  strip variants).
- Mixing treemap with other series in one chart.
