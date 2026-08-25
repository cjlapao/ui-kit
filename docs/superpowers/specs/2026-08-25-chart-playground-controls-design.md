# Chart Playground — Extended Controls — Design

**Date:** 2026-08-25
**Status:** Approved (brainstorming)
**Scope:** Extend the `/docs/chart` playground (demo-only) so the chart can be configured far more than the current 7 controls (renderer / kind / curve / area-fill / donut / height / animate / easing). No kit-engine changes; the engine already supports every prop exposed.

## 1. Goal

The user's ask: *"add the gaps to the pie for example, at the moment we cannot configure the chart that well — let's add more options."* Expose the engine's existing capabilities through the playground's standard control vocabulary (`MultiToggle` / `SelectControl` / `ToggleRow` in `kit-docs/shared/PlaygroundPanel`).

**Chosen approach (of three proposed):** kind-conditional flat controls — per-kind control blocks inserted beside the related existing rows, plus one shared control. No new UI components, no preset bundles, no generic props editor.

## 2. New controls

| Kind | Control | Widget | Values | Prop mapping |
|---|---|---|---|---|
| bar | Mode | MultiToggle | Grouped / Stacked / Percent | `mode` = `group` / `stack` / `percent` |
| bar | Corner | MultiToggle | Square / Rounded / Pill | `cornerRadius` = 0 / 6 / 999 |
| bar | Segment gap | MultiToggle | None / Small / Large | `segmentGap` = 0 / 3 / 8 — row visible only in Stacked/Percent |
| bar | (stacking) | — | — | when `mode !== "group"`, both bar series get `stackId="pg"` so they stack |
| pie | Slice gap | MultiToggle | None / Subtle / Gapped | `padAngle` = 0 / 0.008 / 0.02 |
| pie | Corner | MultiToggle | None / Rounded / Heavy | `cornerRadius` = 0 / 6 / 10 |
| pie | Sweep | MultiToggle | Full / 270° / 180° | Full: `startAngle` 0, `sweepAngle` 2π · 270°: start π/4, sweep 1.5π (90° opening at the bottom) · 180°: start 3π/2, sweep π (top semicircle) — Sweep row visible only when Donut is on, and selecting a non-Full sweep forces Donut on |
| candlestick | Variant | MultiToggle | Candles / Hollow / OHLC | `variant` = `candle` / `hollow` / `ohlc` |
| line | Markers | ToggleRow | off (default) / on | `showMarkers` on all three line series (circle shape) |
| all | Legend position | MultiToggle | Top / Bottom | `Legend position` |

Control placement: Line rows (Curve, Area fill, Markers) stay in the line block; Bar block (Mode, Corner, Segment gap) after the Chart-kind row; Pie block (Donut, Slice gap, Corner, Sweep) after it; Candle block (Variant) after it; Legend position after Height.

**Excluded (documented gap, not shipped):** `orientation="horizontal"` — the engine's axis layer does not swap axis roles for horizontal bars (`BarSeries` always routes the categorical scale through `xScale`, so bar Y-positions come from the X pixel range and axes keep vertical roles). Ships as a follow-up engine task instead of a broken toggle.

## 3. Data / fixture changes (playground only)

- `barQuarterly` unchanged; the two series (Revenue/Profit) carry `stackId="pg"` conditionally at render time.
- `piePlans` unchanged (4 slices read fine as a gauge).
- No new fixtures.

## 4. Files touched

- `react/demo/src/kit-docs/shared/options.ts` — new option arrays: `chartBarModeOptions`, `chartBarCornerOptions`, `chartSegmentGapOptions`, `chartPieGapOptions`, `chartPieCornerOptions`, `chartSweepOptions`, `chartCandleVariantOptions`, `chartLegendPositionOptions`.
- `react/demo/src/kit-docs/components/chart/ChartPlayground.tsx` — state (barMode, barCorner, segmentGap, pieGap, pieCorner, sweep, candleVariant, showMarkers, legendPosition), conditional control rows, prop wiring, `stackId` wiring.

No kit (`react/src`) changes; no new unit tests (demo-only surface — engine props are already unit-tested; matches current demo practice).

## 5. QA

- `tsc --noEmit` (kit) + `tsc -p demo` clean.
- Playwright sweep, dark: bar (stacked + pill + gap, percent, horizontal-free), pie (gapped donut, heavy corner, 270° gauge), candle OHLC, line markers, legend bottom — screenshot per state.
- Light-mode spot check of the two headline states (gapped donut, stacked pill bars).

## 6. Out of scope

Horizontal-orientation axis swap (engine), zoom/navigator/export, annotation toggles (user declined the "full set + annotations" option).
