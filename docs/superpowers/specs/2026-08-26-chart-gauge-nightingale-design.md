# Gauge & Nightingale chart types — design

Date: 2026-08-26 · Status: approved (two separate demo pages)

## Context

Both charts are pie/donut-family: single annular arcs on the existing
d3-arc geometry (`engine/series/pie.ts`), reusing pie's sweep-clip entrance,
angle-morph update animation, pie hover/tooltip and `PieCenter`.

## Part 1 — Gauge (new `Chart.Gauge` type)

A single value plotted on an arc track.

### Props (`GaugeSeriesProps`)

- `value: number` — the reading. `min` (default 0), `max` (default 100).
- `name?`, `id?`, `color?` (fallback when no zones).
- `arcSpan` — radians, default `1.5 * 2π` (270°). Supports 180° semicircle
  and full circle.
- `startAngle` — radians, d3 convention (0 = 12 o'clock), same as
  `PieSeriesProps.startAngle`. Default: the gap is centered at 6 o'clock —
  `π + (2π − arcSpan) / 2`.
- `innerRadius` — ring cutout as a 0–1 ratio, default 0.78.
- `zones?: Array<{ from: number; to: number; color: string }>` — value-space
  color stops spanning min→max. Rendered as finely subdivided arc segments
  (16 per zone) with linear color interpolation at boundaries: discrete
  bands when each zone is one color, a smooth ramp when zones are narrow.
  One code path for SVG and canvas. Without zones: solid `color`/palette.
- `ticks?: { count?: number; majorEvery?: number; length?: number }` —
  radial tick marks just outside the arc across the full span (count
  default 40, majorEvery 5 → longer majors, length default 8px). Off when
  the prop is absent.
- `target?: number` — value-position marker: a small dot on the arc's outer
  edge (white ring + tone fill). `targetLabel?: string` adds an outside
  label at that angle (e.g. "Paris 1.5°C").
- `animation` — as other series.

### Geometry

`computeGaugeGeometry` in `engine/series/gauge.ts`: value→fraction,
angle = startAngle + span·fraction; the value arc (inner/outer radius) plus
an identical "track" arc covering the remainder (subtle gray, drawn under,
non-interactive); zone sub-segments precomputed (angle ranges + colors);
tick positions; target angle/point. Pure + unit-testable.

### Rendering / behavior

- `GaugeSeries.tsx` (SVG + canvas) — arcs as paths (d3 `arc` per segment),
  ticks as lines, target dot as circle.
- The value arc is the single slice in the pie hover path: tooltip shows
  value + % of span; the track is skipped in hit testing. `hoverDim` is
  inert for a single interactive slice (no dimming).
- Center: existing `Chart.PieCenter` (title/value/subtitle or full custom
  `render` for multi-line readouts).
- Entrance: the existing pie sweep clip. Update: angle morph (a live-updating
  value example re-animates the arc smoothly).
- Registry: `Gauge` in `ChildTypeRegistry` + `summarizeChildren` (kind
  "gauge") + `Chart.Gauge` namespace export + type exports. `GaugeSeriesProps`
  in props; descriptor gains `gauge*` fields.
- Legend: omitted (single value).

## Part 2 — Nightingale (`nightingale?: boolean` on `Chart.Pie`)

A rose where slice ANGLES are equal and RADII carry the value (primevue's
pie-donut nightingale variant).

- `nightingale?: boolean` on `PieSeriesProps`. When true:
  - Equal angles: each slice `sweepAngle / n` (padAngle still applies).
  - Per-slice outer radius `inner + (outer − inner) · (v / maxV)` — the
    smallest value ends at the hub, the largest at the outer ring. d3's
    `arc().outerRadius(fn)` makes this a drop-in in `computePieGeometry`
    (new input `radiusValues?: number[]`); `PieSlice` gains `sliceRadius`.
  - Outside category labels at each slice's mid angle: name + value at
    `outerRadius + 14`, with a short leader spoke from the petal tip.
    `startAngle` (existing) anchors the first slice — the precipitation
    example uses `−π/12` so January centers at 12 o'clock.
- Everything else (colors array, gap, corner, hover pop-out, tooltip,
  `PieCenter`, legend, entrance/update animation) is unchanged.

## Demo — two pages

- `charts-gauge` ("Gauge"): playground (preset-value MultiToggle controls,
  no sliders — value, min/max, arcSpan 180/270/360, thickness, zone style
  gradient/3-band/single, ticks off/20/40, target off/on + value) + 3
  examples:
  1. Edge SLO burn guardrail — 270°, green→amber→red ramp, dense ticks,
     target dot, **live value updating every 1.5s** (exercises the angle
     morph), center "98% / Freeze deploys".
  2. Atmospheric CO₂ (Mauna Loa) — ~300° donut, gray track remainder,
     multi-stop ramp, 4-line center via `PieCenter` `render`.
  3. Global temperature anomaly — 180° semicircle, 3 discrete zones,
     target + "Paris 1.5°C" label, center readout.
- `charts-nightingale` ("Nightingale"): playground (nightingale on,
  startAngle presets 0/−90°/−15°, thickness, gap, labels on/off) + 2
  examples:
  4. US tornado climatology by month — 12 slices, seasonal colors array,
     spokes + month labels, quiet/shoulder/peak legend.
  5. US average monthly precipitation — January centered at 12 o'clock
     (`startAngle = −π/12`), seasonal hues, "PEAK" month mark, annual avg
     center.
- Registry entries (icons, side menu after charts-polar) + ChartsPage
  TYPE_LINKS cards for both pages.

## Error handling / edge cases

- Gauge `max <= min` or non-finite value → no arcs, no crash.
- All-zero nightingale values → all petals at the hub (no NaN radii).
- Nightingale single slice → full circle, label centered at start.
- Zones not covering min→max → uncovered spans render in the fallback
  color (track tone), no gaps in the arc.

## Testing

- Engine `engine/series/gauge.test.ts`: value→angle mapping, default
  start centering for 270°/180°, zone subdivision + interpolation
  endpoints, tick count/majors, target angle, degenerate domains.
- Engine pie test additions: nightingale equal angles, radius scaling
  (min→hub, max→outer, mid→lerp), zero values safe.
- Component tests: gauge renders value arc + track + ticks + target (SVG
  attribute counts), nightingale renders n petals with distinct radii,
  gauge value update morphs (fake timers), nightingale labels present.
- Live QA on 5176: both pages render, gauge live update animates, ticks /
  target / labels visible, hover tooltip on gauge, canvas renderer clean.

## Files

- `react/src/components/chart/engine/series/gauge.ts` (+ tests)
- `react/src/components/chart/engine/series/pie.ts` (radiusValues, sliceRadius)
- `react/src/components/chart/engine/types.ts` (PieSlice.sliceRadius, GaugeGeometry)
- `react/src/components/chart/engine/index.ts` (export gauge)
- `react/src/components/chart/react/props.ts` (GaugeSeriesProps,
  PieSeriesProps.nightingale, descriptor fields)
- `react/src/components/chart/react/series-utils.ts` (gauge + nightingale
  descriptor branches/fields)
- `react/src/components/chart/react/ChartRoot.tsx` (registry entry, gauge
  excluded from cartesian/pie-only guards where needed, hover: gauge
  shares the pie branch)
- `react/src/components/chart/react/series/GaugeSeries.tsx` (new)
- `react/src/components/chart/react/series/PieSeries.tsx` (nightingale
  radii + outside labels/spokes)
- `react/src/components/chart/index.ts` (Gauge export + props type)
- `react/src/components/chart/react/chart-components.test.tsx` (+nightingale
  pie engine tests in the existing pie test file if one exists)
- Demo: `data.ts` (gauge + nightingale datasets), `GaugeChartPage.tsx`,
  `NightingaleChartPage.tsx`, `examples/Gauge{SloBurn,Co2,Temperature}.tsx`,
  `examples/Nightingale{Tornado,Precipitation}.tsx`, `registry.ts`,
  `ChartsPage.tsx`, `ChartPlayground.tsx` (gauge + nightingale kinds),
  `options.ts` (preset control options)
