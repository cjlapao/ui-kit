# Pie outerRadius ratio — design

Date: 2026-08-26 · Status: approved

## Problem

The nightingale outside labels (ring + 14px + text) reach into the title /
subtitle band in the demo examples; the ring fills the full plot radius.

## Change

- `Chart.Pie` gains **`outerRadius?: number`** — a 0–1 ratio of the
  available plot radius (same semantics as the reference's `:outer-radius`).
  Default `1` (current behavior). Everything radius-derived follows the
  scaled ring: nightingale labels/ticks/bands, percent labels, pop-out.
- Descriptor field `pieOuterRadius`; `PieSeries` multiplies the available
  radius by it.

## Demo

- Precipitation example: `outerRadius={0.78}` — labels clear the subtitle.
- Tornado example: `outerRadius={0.8}` — same.

## Tests

- Component: a pie with `outerRadius={0.5}` renders a ring (bbox)
  noticeably smaller than the default; labels follow the scaled radius.
