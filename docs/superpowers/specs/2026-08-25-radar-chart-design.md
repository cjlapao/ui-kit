# Radar chart — design spec

Date: 2026-08-25
Status: approved (follow-up round 13, after the range-area round)

## Goal

A radar (spider) chart series for the compound chart system, modeled on the
"Enterprise readiness gaps" reference: 8 axes, three series (one dashed),
polygon grid rings with unit-labeled ticks, a per-axis "goal" callout
("Launch-ready ≥ 80 pts"), and shared-fill polygons.

## Series model

Compound children — each `<Chart.Radar>` is one series on a shared axis set
(the kit's existing per-child pattern, like `Line`/`Bar`/`RangeArea`). The
axis list is derived from the data of the radar children (order-preserving
union; first child's order wins). Legend, colors, legend toggling, and the
fill props fall out of the existing descriptor machinery.

## Engine — `engine/series/radar.ts`

### Geometry

- Polar mapping: `angle(i) = -π/2 + i · 2π/n` — first axis at 12 o'clock,
  clockwise.
- Radius mapping: `r = ((value - 0) / domainMax) · R`. v1 domain is
  `[0, domainMax]` where `domainMax` = nice max of all radar series values
  (or an explicit `domainMax` from `RadarAxis`). Negative values are out of
  scope.
- Per series:
  - `points: { x, y, value, axis: number, item, index }[]` — one point per
    non-null axis value; missing values drop the point and break the
    polygon into an open sub-path (v1 has no `connectNulls` bridging —
    a closed polygon with a gap is an open polyline).
  - `linePath` — closed polygon `M…Z` (open when the series has gaps).
  - `fillPath` — same path (fill uses the default nonzero rule).
  - `first` / `last` for endpoints.
- Linear segments only (the reference is straight-edged; closed-loop curve
  factories produce artifacts and are not needed).
- `frameRadarGeometry(cur, prev, p)` — index-aligned interpolation for
  update animation; returns `cur` when settled or without `prev`.

### Grid (shared, rendered once by the root)

- `computeRadarGrid({ axes, R, cx, cy, rings, domainMax })` →
  - `rings: { points: {x,y}[], value, r }[]` (inner→outer),
  - `spokes: { x1, y1, x2, y2, label, angle }[]` (center → outer vertex),
  - `tickLabelX/Y` anchor = along the first (top) axis.
- Axis name labels sit outside the outer ring, offset per quadrant
  (top/bottom/left/right) with a small vertical offset.

## React

### `Chart.Radar` series

Props: `data`, `axisField?` (default `"axis"`), `valueYField` (required),
`name`, `id`, `color`, `dash?` (e.g. `[6,4]` for the dashed Target bar),
`showMarkers?` (default `true`), `markerSize?` (default `3`),
`goal?` + `goalLabel?` (dot on the first axis at `goal` + label beside it,
series-colored), `maxDataPoints?`, and the shared fill props
(`fillStyle?` default `"flat"`, `fillColor?`, `fillOpacity?` default
`0.18`, `fillDirection?` — `"gradient"` on radar resolves to a **radial**
gradient: `fillOpacity` at the outer edge → 0 at the center).

Descriptor: `type: "radar"` + `radarAccessor` + `goal` + the fill fields
(the shared descriptor already carries fill fields from round 12).

### `Chart.RadarAxis` feature

`<Chart.RadarAxis rings? (default 4) domainMax? tickFormat? />` — configures
the shared grid. When radar series are present and no `RadarAxis` is
given, the root uses the defaults (4 rings, nice max, `formatSI` ticks).
Grid layer: SVG paths (ring polygons + spokes) with the gridline colors,
axis labels, and tick labels along the top axis (right-offset, like the
reference). Canvas renderer draws the grid via a draw-registry entry.

### Hover / tooltip

- Snap to the nearest axis: angular distance from the pointer to each
  spoke, accepted only when the pointer is within `1.15·R` of the center
  (categorical-style snap, like pie).
- Hover state: header = axis name; one item per visible radar series at
  that axis (`{ name, value, color, y: point.y, item }`).
- Hover markers: dots on every series' point for the hovered axis
  (SVG circles `r=3.5` + canvas arcs, matching the line/range-area hover).

### Animation

- Entrance: all points scale from the center (r 0 → R) with the standard
  entrance easing (`entranceFrame`).
- Updates: `frameRadarGeometry` interpolation.

## Demo

- `data.ts`: `readinessData` — 8 axes in order (SSO, Data residency,
  Audit exports, Key rotation, RPO drills, Admin guardrails, Procurement,
  Support SLA) × three series shaped to the reference (0–100 pts):
  - Launch build (violet): strong on SSO/audit, weakest on RPO drills
    (~48) and key rotation (~55).
  - Target bar (teal, **dashed**): near the outer ring everywhere (~85–97).
  - Buyer benchmark (amber): in between (~62–97).
- `examples/Radar.tsx` (full mimic): three `Chart.Radar` children
  (Target bar `dash={[6,4]}`), `Chart.RadarAxis rings={4}
  tickFormat={(t) => `${t} pts`}`, `goal={80}
  goalLabel="Launch-ready ≥ 80 pts"` on the target series, Title
  "Enterprise readiness gaps" + subtitle, Legend, Tooltip, Hover.
- Playground: `fixedKind="radar"` — readiness data with a 5 s streaming
  walk on the three series (clamped 20–100), Fill (Gradient/Flat/Off)
  control, kind selector hidden.
- Docs: `registry.ts` `charts-radar` entry (Charts category, after
  range-area) + `ChartsPage` TYPE_LINKS card + `RadarChartPage`
  (PageHeader + Playground + scenario ExampleCard with `?raw` code).

## Out of scope

- Curved radar edges, negative values, multi-radar layouts, per-axis
  scaling, goal rings.

## Tests

- Engine: angles/radius mapping, polygon closure + open sub-paths on
  gaps, rings/spokes, nice domainMax, frame interpolation, empty data.
- Components: SVG grid + 3 series render (paths, markers, dash array),
  flat fill (fill color + opacity attr), radial gradient def for
  `fillStyle="gradient"`, goal dot + label, tooltip axis snap (header =
  axis name, one row per series), canvas render without crash, legend
  entries for all three series.
- Suite stays green (chart tests 157 → ~170; full suite green).
