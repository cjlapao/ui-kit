# Combo chart — design (round 24)

**Status:** approved 2026-08-26 (user: "next one is the combo, we should have
everything" + "Proceed as designed (Recommended)").

## Goal

A dedicated combo chart page that showcases mixing `Chart.Bar`, `Chart.Line`,
and `Chart.Scatter` in a single chart — the patterns from the PrimeVue combo
reference (6 screenshots):

1. **Revenue vs budget** — bars + dashed line, shared axis.
2. **Electricity demand / mean temperature** — bars + line with **dual
   y-axes** (left: demand TWh, right: temperature °C, both labeled + formatted).
3. **Fulfilled orders / 3-month avg** — bars + line with area fill; hovering
   one series dims the other (existing `hoverDim`).
4. **Cloud cost mix** — **stacked** bars (compute/storage/network) with a
   **total line** overlaid on top.
5. **Ad spend → new customers** — scatter on **numeric** x/y with a dashed
   two-point **regression reference line** (`ReferenceLine x/y + x2/y2`).
6. **Target vs actual (monthly)** — target **line** + actual **scatter
   markers** on a **band (categorical)** x scale, landing on the same band
   centers as the line vertices.

## Key finding — no engine changes

The render engine already supports everything the reference needs, verified
against the source:

- Mixed cartesian series share the x scale (band or numeric) and left/right
  continuous y scales (`yFieldAxis="right"` creates the right axis;
  `needsRightYAxis` plumbing exists and is used by the existing `DualAxis`
  example on the line page).
- `Chart.Scatter` already resolves **band** x positions
  (`computeScatterGeometry`: `if ("bandWidth" in xScale) return
  xScale.center(String(v))`), so example 6 needs no new code.
- Stacked bars (`mode="stack"` + `stackId`) + a plain line overlay example 4.
- Hover dimming (`seriesDimStyle`/`hoverDim`) and the shared tooltip already
  cover example 3.
- Two-point sloped reference lines (`ReferenceLine` with `x,y,x2,y2`) cover
  the regression line in example 5.

**This round is demo-only:** data + examples + page + playground kind +
registry/overview wiring. No kit/engine edits, no new props.

## Deliverables

### Data (`react/demo/.../charts/data.ts`)

- `comboMonthly` — 12 months: `revenue`, `budget`, `orders`,
  `avg3` (3-month rolling average of orders), `temperature` (°C),
  `demand` (TWh) — one dataset feeds examples 1–3 and the playground.
- `comboCloud` — 8 quarters: `compute`, `storage`, `network` (total line =
  sum).
- `comboAds` — ~15 points: `spend` ($), `customers`.
- `comboTarget` — 12 months: `target`, `actual`.

### Examples (`react/demo/.../charts/examples/`)

| File | Pattern | Notable props |
| --- | --- | --- |
| `ComboRevenue.tsx` | bars + dashed line | `lineStyle="dashed"` on the line; tooltip `itemFormat` |
| `ComboDualAxis.tsx` | bars + line, dual axis | `yFieldAxis="right"` on the line; `YAxis axis="right"` with `label` + `format`; both axes labeled |
| `ComboOrders.tsx` | bars + avg line w/ area | line `fillOpacity={0.18}`; hover dim is automatic |
| `ComboCloud.tsx` | stacked bars + total line | three `Bar` series `mode="stack"` shared `stackId`; one `Line` for the total |
| `ComboRegression.tsx` | scatter + regression | numeric axes; `Chart.Scatter` + `ReferenceLine x=… y=… x2=… y2=…` dashed; axis labels |
| `ComboTargetActual.tsx` | line + scatter on band | `Chart.Line` (target) + `Chart.Scatter` (actual) sharing band months |

### Page

`ComboChartPage.tsx` — `PageHeader` + `ChartPlayground fixedKind="combo"` +
the six `ExampleCard`s with `?raw` source, mirroring the existing page
structure (Nightingale/Waterfall pattern).

### Playground kind `combo`

- Data: `comboMonthly`.
- Series: `Chart.Bar` (revenue) + conditional secondary:
  - **Secondary** toggle group: `Line` (budget) / `Scatter` (budget) / `Off`.
  - **Right axis** toggle: when on, the secondary rides `yFieldAxis="right"`
    (a temperature-like scale) and a right `YAxis` renders.
  - **Stack** toggle: turns the bar into a 3-layer stack
    (revenue/orders/temperature-free split of revenue) with a **total line**
    overlay — mirroring example 4.
  - **Dashed** + **Area** toggles for the secondary line.
- Controls reuse the existing `MultiToggle`/`ToggleRow` blocks; legend at the
  bottom (like nightingale) when the secondary is on.

### Wiring

- `registry.ts` entry `slug: "charts-combo"` (name "Combo", category Charts,
  icon `ChartLine` — a verified available icon).
- `ChartsPage.tsx` TYPE_LINKS card (blurb: "bars + lines + points in one plot,
  dual axes, stacked overlays, regression lines").

### Tests

Kit-level (coexistence is engine behavior worth pinning):

- bar + line render together (rects + path present in one svg).
- stacked bars + line: 3 bar series stack (3 rects per category) + line path.
- right-axis scale: a series with `yFieldAxis="right"` renders its own y-axis
  feature (`data-chart-feature="yaxis-right"`).
- scatter + line on a band x: scatter markers centered on the band
  (`cx ≈ band center`).

## Out of scope

- No new kit props, engine modules, or series types.
- No canvas-specific combo work beyond the standard renderers (both renderers
  share the series code paths).

## Verification

- `tsc --noEmit` (kit, WIP-filtered) + demo `tsc -p . --noEmit`.
- Full vitest suite green.
- Playwright on :5176 `/docs/charts-combo`: 6 examples render (SVG),
  playground combos (SVG + canvas), hover dim on the orders example,
  dark + light screenshots, visual review.
- Surgical commit (explicit paths only).
