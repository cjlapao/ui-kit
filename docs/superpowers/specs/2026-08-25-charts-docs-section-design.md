# Charts docs section — per-type demo pages — design

**Date:** 2026-08-25
**Status:** approved (user: "yes lets start implementation")

## Context

The docs site (`react/demo/src/kit-docs`) is registry-driven: `registry.ts`
is the single source of truth for pages, side-menu grouping, routes,
breadcrumbs and the overview grid — adding a page is one registry entry +
one folder. Charts currently live as a single `chart` page (category
"Data") holding one playground plus seven example cards. As more chart
types are added (area, scatter, gauge, radar, heatmap, treemap, waterfall,
horizontal bar, range area, combo), one page per chart type is the
maintainable shape.

## Goal

A dedicated **Charts** section with an individual demo page per chart
type, so future types are trivial to add: one registry entry + one page
file + its examples.

## Registry

- New category `"Charts"` in `DocCategory` and `DOC_CATEGORIES`, displayed
  after `"Data"`.
- The `chart` entry is replaced by six entries:

  | Slug                | Name                 | Contents                                                        |
  |---------------------|----------------------|-----------------------------------------------------------------|
  | `charts`            | Charts (overview)    | system intro + the multi-kind ChartPlayground                   |
  | `charts-line`       | Line                 | Growth metrics reference, Curves/dashes/markers, Dual y-axes    |
  | `charts-bar`        | Bar                  | Bar modes (grouped/stacked/percent)                             |
  | `charts-pie`        | Pie & Donut          | Pie & donut reference                                           |
  | `charts-candlestick`| Candlestick          | Candlestick demo                                                |
  | `charts-annotations`| Reference & Callouts | Annotations (bands, rules, callouts — cross-cutting)            |

- `/docs/chart` (old slug) redirects to `/docs/charts` so existing links
  keep working.

## Files

`components/chart/` moves to `components/charts/`:

```
components/charts/
  ChartsPage.tsx            overview: PageHeader + system intro + ChartPlayground
  LineChartPage.tsx         PageHeader + that type's ExampleCards (?raw code)
  BarChartPage.tsx
  PieChartPage.tsx
  CandlestickChartPage.tsx
  AnnotationsChartPage.tsx
  ChartPlayground.tsx       moved, unchanged
  data.ts                   moved, unchanged
  examples/*.tsx            moved, unchanged (7 files)
```

The old `ChartPage.tsx` is deleted; its content is split across the six
pages. Example components and data are not modified.

## Page shape

Every page uses the existing pattern: `PageHeader` (name + description)
then `ExampleCard`s with the exact code via `?raw` imports. The overview
page additionally carries a short "how it works" block (one set of
children, SVG/Canvas renderers, entrance/update animations, shared
hover/tooltip/axes) and the playground. Type pages are pure demos — no
second playground copy (the playground on the overview switches kind).

## Out of scope

- New chart types (next round; each will follow the one-entry-one-page
  pattern established here).
- Any kit component or playground behavior changes.
- Example code/data changes.
