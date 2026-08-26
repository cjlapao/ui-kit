# Waterfall chart — design

Date: 2026-08-26 · Status: approved

## Goal

A `Chart.Waterfall` series for bridge analysis (built on the bar chart's
band/linear scales), covering the primevue reference examples: vertical +
horizontal, delta/total bars, signed data labels, connectors, stacked
layers, reference lines, corner annotations.

## Engine — `engine/series/waterfall.ts`

```ts
interface WaterfallStep {
  category: string;
  delta: number;        // value of the step
  total: boolean;       // true → bar anchors at 0 and running := delta
  layers?: { name: string; value: number; color?: string }[];
}
computeWaterfallSteps(data, { valueField, totalField, layersField? })
  → { steps, spans: [lo, hi][], running }[]
```

- Running accumulation: total → span [0, delta], running = delta;
  delta → span [running, running+delta], running += delta.
- Layers: delta = Σ layer values; span from the combined delta.
- Y-domain: `computeYDomain` gains a waterfall branch using the step
  spans; `hasBar` anchoring pins 0 into the domain (baseline).

## Props — `Chart.Waterfall`

- `data`, `categoryField` (default "category"), `valueField` (default
  "value"), `totalField` (optional field/flag marking total steps),
  `layersField` (optional; stacked layers per step),
- `orientation?: "vertical" | "horizontal"` (default vertical),
- `colors?: { up?, down?, total? }` (defaults: green / rose / indigo);
  per-datum `color` accessor wins,
- `valueLabels?: boolean` (default true),
  `valueLabelFormat?: (delta, datum, index) => string` (default signed),
- `connectors?: boolean` (dashed running-total lines in the gaps),
- `cornerRadius?: number`, `animation?`, standard `name`/`id`.

## Rendering (`WaterfallSeries`, SVG + canvas)

- Band-positioned rects via xScale.bandWidth (single-series width, like
  the bar default), y from yScale on the step spans.
- Color routing: datum color > layer color > up/down/total palette.
- Value labels above positive/total bars, below negative steps.
- Connectors: dashed line at the running level across the gap between
  consecutive bars.
- Entrance: each bar grows from its anchor edge (scale height by
  progress), labels fade in with it.
- Hover: band hit-test (bar branch, `type === "waterfall"` added);
  tooltip item carries name=category, value=delta, item=raw datum —
  examples use the existing `ChartTooltip rows` callback for the
  running-total rows.

## Root wiring

- Type union += "waterfall"; included in cartesian/band paths (x from
  category strings); excluded from line-only paths; y-domain waterfall
  branch; hover band branch; child registry += `Waterfall`.

## Demo

- `charts-waterfall` page: playground kind (orientation, connectors,
  labels, zero reference) + 4 examples:
  1. EU-27 government revenue/spending (%, per-item colors via kind
     field, corner "Deficit 3.4%" annotation),
  2. Global carbon budget 2022 (horizontal, per-item colors,
     `Chart.ReferenceLine x=5.7` dashed, "7× over budget" annotation),
  3. FY 2023 EBITDA bridge (layers: core + incremental,
     `Chart.ReferenceLine y=0` break-even),
  4. ARR bridge by driver (connectors, Open/Closing totals, Open/Close
     dashed lines, NET CHANGE annotation).
- Registry entry + overview card.

## Tests

- Engine: step/span accumulation (delta, total reset, negatives,
  layers sum), degenerate data.
- Component: rect count, connectors (n−1 lines), signed labels,
  horizontal orientation, layers segment count, hover tooltip via
  pointer move.
- Full suite + both tsc + live QA on 5176 (SVG + canvas, all 4 examples,
  hover rows).
