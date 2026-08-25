# Range area chart + shared area-fill system — design

**Date:** 2026-08-25
**Status:** approved (user: "yes, but lets add to our chart engine the ability for
fill between two lines … lets implement this")

## Context

The kit charts (line, bar, pie, candlestick) render fills only on line
series: `fillOpacity` (flat) plus `areaGradient` (a gradient that fades to
transparent), both hardwired in `LineSeries` with the area always closed
to the axis baseline. The "Checkout response corridor" reference (a
min–max latency envelope) needs a **band between two curves** with a soft
gradient fill, plus the ability to reuse that fill treatment anywhere.

## Goal

1. A **shared area-fill system**: one fill spec (flat color at an opacity,
   or a gradient fading to transparent) usable by any area-capable series.
2. **Fill between two lines** on regular line charts (close the area to a
   second field's curve instead of the axis baseline).
3. A new **`RangeArea`** series type (band between min/max fields) with a
   demo scenario mimicking the reference screenshot, 22 data points.

## Shared fill spec

New `ChartAreaFill` in `engine/types.ts`, exposed as uniform props on
area-capable series:

| Prop | Meaning | Default |
|---|---|---|
| `fillStyle` | `"flat"` (solid) or `"gradient"` (fades to transparent) | `"flat"` |
| `fillColor` | fill color, may differ from series color | series color |
| `fillOpacity` | flat: solid opacity; gradient: start opacity (end is 0) | series default (line: 0) |
| `fillDirection` | gradient direction `vertical` \| `horizontal` | `vertical` |

`areaGradient` remains as a deprecated alias for `fillStyle="gradient"` so
existing demos and the playground keep working unchanged.

Shared paint helpers (engine): `svgFillDef` (linearGradient def for SVG)
and `canvasFillStyle` (createLinearGradient / rgba for canvas), replacing
LineSeries' private gradient code. Line, RangeArea and future area types
all consume them.

## Fill between two lines

`Line` gains `fillBaseline?: "zero" | "field"` + `fillBaselineField?:
string`. With `"field"`, the area path closes to the y of the second
field's (smoothed) curve instead of the axis baseline. Shared path
builder `buildAreaPath(upper, lower)` produces the closed area from two
edge point sets; line uses (value curve, baseline curve) and range area
uses (max curve, min curve).

## RangeArea series

`Chart.RangeArea` props: `data, name, color, curve, minYField?` (default
`"min"`), `maxYField?` (default `"max"`), the shared fill props, and
`showEdges?` (default true — crisp band edge strokes in the series color).

- Geometry (`engine/series/rangeArea.ts`): upper edge = max curve, lower
  edge = min curve, each smoothed with the same interpolation as line
  (smooth/linear/step); output = closed band path + the two edge paths
  (for canvas, hover and edge dots).
- Animation: entrance grows both edges from the axis baseline
  (progress-driven, same easing machinery); data updates interpolate from
  the previous settled geometry (streaming works for free).
- Hover: item carries `value` (min) + new optional `valueMax` (max); the
  tooltip renders the row as `min–max` (e.g. `173–226`). Hover `y` is the
  band midpoint.
- Legend: one entry.

## Demo scenario — "Checkout response corridor"

`data.ts` gains `corridorData`: **22 points**, 06:00 AM → 05:00 PM (30-min
steps), hand-tuned to the reference:

- `avg` (teal line, markers): ~118 start → peak ~208 at 10:00 → dip ~158
  at 12:00 → second peak ~210 at 14:30 → ends **169**
- `opMin/opMax` (blue operating band): avg ± ~25
- `envMin/envMax` (violet full envelope): avg −45/+60, crest **291**
- derived `volatility = (envMax − envMin) / avg`

`examples/RangeArea.tsx` mirrors the screenshot: title + subtitle, the
three series (bands use **gradient** fills, ~0.5 start opacity), Y-axis
`ms` domain 80–310, red dashed **p95 SLO** rule at 260 with label, two
reference bands (SLO risk zone 09:00–11:30 orange; Forecast 13:00–17:00
violet), **RISK CREST** callout (red title, "291 ms p95 band"), "Release
train" / "Forecast" labels, teal end badge **"169 ms now"**, and the
tooltip with four rows (average, operating band range, envelope range,
volatility % — a derived stat computed per point).

## Playground + docs

- Playground `Kind` gains `"range"`; the Range kind renders the corridor
  data as RangeArea + Line, with a "Fill" control (Flat / Gradient / Off)
  driving `fillStyle`; streaming extends to the range kind (new point
  every 5 s, sliding window, mean-reverting walk on all five fields).
- Registry entry `charts-range-area` + `RangeAreaChartPage` (playground
  `fixedKind="range"` + the scenario card); "Range Area" card on the
  Charts overview page.

## Tests

- Engine: `buildAreaPath` (band vs baseline closure), line
  `fillBaselineField` area path, `rangeArea` geometry (closed path, edge
  curves, animation interpolation), paint helpers (flat rgba / gradient
  stops).
- Components: RangeArea renders on SVG and Canvas, tooltip renders
  `min–max`, line fill-between-field produces a non-baseline area path.

## Out of scope

- Fill between two *different* series (a band across series) — the
  baseline-field mechanism covers the same-data case; cross-series bands
  can reuse it later.
- Per-point fill color scales (heat-style fills).
