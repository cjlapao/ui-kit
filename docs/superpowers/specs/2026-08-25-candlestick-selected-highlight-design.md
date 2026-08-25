# Candlestick selected-candle highlight + close label — design

**Date:** 2026-08-25
**Status:** approved (user: "it looks good to me")

## Context

The chart root already snaps hover to candles (nearest x) and its `hover.items`
carries the candle's **close price** (`closeAccessor`) for candlestick series.
But `CandlestickSeries` ignores hover entirely — there is no visual indication
of which candle you are pointing at. This adds an opt-out highlight for the
selected (hovered) candle.

## Goal

When hovering a candlestick chart (option enabled, default on):

1. The hovered candle is highlighted: body + wicks in the up/down color
   lightened ~35% toward white, body width ×1.4 (clamped to 90% of the step so
   candles never overlap neighbors).
2. A small pill with the candle's **close price** appears above the high wick,
   following the hover, using the established darkened-pill style (white
   11px/600 text on `shadeColor(color, 0.45)` background, rounded 999).

Non-goals (explicit): click-to-pin selection, OHLC multi-value labels,
canvas glow/blur effects, count-up animation on the label (hover is transient),
any engine/hover-state changes (the root already does what's needed).

## API

- `Chart.Candlestick` gains `highlightSelected?: boolean` — **default `true`**.
  `false` renders candles exactly as today (no highlight, no pill).
- `SeriesDescriptor` passes the flag through (`candleHighlightSelected?:
  boolean`) so the series reads it via the descriptor, consistent with
  `piePercentLabels`.

## Behavior

- **Selected candle:** the candle whose x the root hover snapped to. The
  series reads `hover` from the chart context; it finds the matching candle by
  index/position (`hover.items` is one entry per visible series; the
  candlestick entry's `value` is the close and `item` the raw datum). If no
  hover, or the flag is off, everything renders unchanged.
- **Lightening:** a local `lighten(hex, f)` helper blends toward white
  (`channel + (255 - channel) * f`, f ≈ 0.35) — the mirror of the existing
  `shadeColor` (which only darkens). Non-hex colors fall back to the
  unlightened color.
- **Bigger:** body width `bodyWidth * 1.4`, clamped to `step * 0.9` where
  `step = area.width / n` (same step the width default uses). The wick stays
  at its normal width; only its color is lightened.
- **Pill label:** close value formatted with `formatSI`-style rounding
  (`String(Math.round(v * 10) / 10)`), centered above the high wick
  (y = `highY - 8`), same geometry as the pie percent pills (width ≈
  text.length × 6.4 + 12, height 17, rx 8.5).
- **Transition:** SVG body rect gets `style={{ transition: "width 150ms ease,
  x 150ms ease, fill 150ms ease" }}` so the grow/fade is smooth; canvas has no
  transition (instant per frame — acceptable, matches other canvas hovers).

## Renderers

- **SVG:** per-candle, when hovered & enabled: lighter `fill`/`stroke`,
  widened rect (`x = x - w/2`), lightened wick strokes, plus the pill
  (`<rect rx> + <text>`, `pointerEvents="none"`).
- **Canvas:** the draw fn branches on the hovered index (derived from the
  `hover` captured in the effect): lighter fill/stroke, wider `fillRect`,
  pill via the same measure-and-round-rect pattern as the pie labels.

## Playground / demo

- New **Selected** On/Off MultiToggle control, shown only for the `candle`
  kind, wired to `highlightSelected` (new `chartSelectedOptions` in
  `shared/options.ts`).
- The candlestick example card needs no data change — default-on makes the
  highlight visible there automatically.

## Testing

Component tests (SVG):

1. Hovering a candle (absolute clientX over a candle, pointer move) widens its
   body rect (width attribute larger than a non-hovered candle) and lightens
   its fill (differs from the base up/down color).
2. The close-price pill text appears while hovering and is absent after
   pointer leave.
3. `highlightSelected={false}`: hover changes nothing (no pill, unchanged
   width).

Plus the standing loop: tsc (kit + demo), chart test file, full suite
(1584 baseline), Playwright sweep (hover a candle, capture dark + light).

## Files touched

- `react/src/components/chart/react/series/CandlestickSeries.tsx`
- `react/src/components/chart/react/props.ts` (prop + descriptor field)
- `react/src/components/chart/react/series-utils.ts` (pass-through)
- `react/src/components/chart/react/chart-components.test.tsx` (+3 tests)
- `react/demo/src/kit-docs/shared/options.ts` (control options)
- `react/demo/src/kit-docs/components/chart/ChartPlayground.tsx` (control + wiring)
