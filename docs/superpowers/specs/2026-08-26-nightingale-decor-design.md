# Nightingale decor props — design

Date: 2026-08-26 · Status: approved

## Context

The reference precipitation nightingale (primevue) stacks per-slice outer
ticks, season arcs, an in-slice PEAK mark, colored labels and a delta
tooltip row. Today the kit has nightingale petals + plain outside labels;
the reference's effects require hand-rolled SVG. This round makes them
first-class props.

## Props (`Chart.Pie`, nightingale mode)

- `nightingaleTicks?: boolean` — per-slice radial ticks just outside the
  ring: from 1.02×outer to 1.10×outer at each slice mid-angle, slice color,
  strokeWidth 1, opacity 0.45.
- `nightingaleBands?: { from: number; to: number; color: string }[]` —
  inclusive slice-index ranges; each draws a rounded thin arc outside the
  ring at 1.22×outer (strokeWidth 2, linecap round, opacity 0.45) spanning
  slice `from`'s startAngle to slice `to`'s endAngle. Angles derived from
  the settled geometry (adapts to padAngle/startAngle automatically).
- `peakLabel?: string` (default "PEAK") — bold white 9px label centered in
  the max-value slice at (innerRadius + sliceRadius)/2.
- Outside label restyle (nightingale only): name in slice color (600 weight,
  11px), value in subtle text at 55% opacity (9px). Replaces the current
  neutral-name/slice-color split.

## `ChartTooltip` `rows` prop (generic)

```ts
rows?: (item: HoverItem) => { label: string; value: string; color?: string }[]
```

When provided, the tooltip card renders the item header (name + swatch)
followed by these rows (label muted, value right-aligned, optional row
color) instead of the single formatted value. Works for every chart type.

## Rendering

- All decor renders in `PieSeries` (SVG `<g>` after slices; canvas after
  fills) — gated on `d.pieNightingale` + the specific prop. No new series
  type; geometry comes from the existing `final` (slice angles/radii).
- Entrance: decor fades in with the slices (opacity = entrance progress).
- Hover pop-out is unchanged (decor stays put while the petal pops).

## Demo

- Precipitation example rebuilt with: `nightingaleTicks`, four
  `nightingaleBands` (winter 10–11, spring 2–3, summer 4–7, fall 8–9 on the
  Jan-first ordering), `peakLabel`, and `ChartTooltip rows` computing the
  vs-annual-average delta (▲/▼ + signed, colored) and the season row.
- Nightingale playground: Ticks toggle, Season bands toggle, Peak label
  toggle.

## Tests

- Engine/component: nightingale with ticks renders 12 tick lines; bands
  render as N paths at the band radius; peakLabel text present inside the
  max slice; tooltip `rows` renders custom rows for a hovered slice
  (jsdom pointer-move).
- Full suite + both tsc + live QA on 5176 (SVG + canvas, hover tooltip).

## Files

- `react/src/components/chart/react/props.ts` (PieSeriesProps decor props,
  TooltipProps.rows)
- `react/src/components/chart/react/series-utils.ts` (descriptor fields)
- `react/src/components/chart/react/series/PieSeries.tsx` (SVG + canvas
  decor, label restyle)
- `react/src/components/chart/react/features/Tooltip.tsx` (rows)
- `react/src/components/chart/react/chart-components.test.tsx`
- Demo: `ChartPlayground.tsx` (toggles + example wiring),
  `examples/NightingalePrecipitation.tsx` (rebuilt)
