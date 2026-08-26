/**
 * Waterfall (bridge) geometry: a sequence of delta steps that accumulate
 * a running total. Total steps anchor at zero and reset the running total
 * to their value; delta steps float from `running` to `running + delta`.
 */

export interface WaterfallLayer {
  name: string;
  value: number;
  color?: string;
}

export interface WaterfallStep {
  /** Category label. */
  category: string;
  /** Step value (Σ layers when present). */
  delta: number;
  /** True → the bar anchors at 0 and the running total resets to `delta`. */
  total: boolean;
  /** Stack layers (top-to-bottom for positive steps). */
  layers?: WaterfallLayer[];
  /** Span start (value space). */
  lo: number;
  /** Span end (value space). */
  hi: number;
  /** Running total after this step. */
  running: number;
  /** Raw datum + index (for labels/tooltips). */
  item: unknown;
  index: number;
}

export interface WaterfallStepsInput<T = unknown> {
  data: T[];
  categoryField: (item: T, index: number) => string | number;
  valueField: (item: T, index: number) => number;
  /** Returns a truthy flag for total steps (e.g. `isTotal` field). */
  totalField?: (item: T, index: number) => boolean;
  layersField?: (item: T, index: number) => WaterfallLayer[];
}

/**
 * Resolve the waterfall steps. Data order is the bridge order (the band
 * scale preserves it), so the running accumulation follows the draw order.
 */
export function computeWaterfallSteps<T>(input: WaterfallStepsInput<T>): {
  steps: WaterfallStep[];
  /** Per-step [lo, hi] spans (value space) for the y-domain. */
  spans: [number, number][];
} {
  const steps: WaterfallStep[] = [];
  let running = 0;
  input.data.forEach((item, index) => {
    const isTotal = input.totalField ? Boolean(input.totalField(item, index)) : false;
    const layers = input.layersField ? input.layersField(item, index) : undefined;
    const delta = layers
      ? layers.reduce((a, l) => a + (Number.isFinite(l.value) ? l.value : 0), 0)
      : input.valueField(item, index);
    const d = Number.isFinite(delta) ? delta : 0;
    let lo: number;
    let hi: number;
    if (isTotal) {
      // Total bar: 0 → value; the bridge continues from `value`.
      lo = 0;
      hi = d;
      running = d;
    } else {
      lo = running;
      hi = running + d;
      running = hi;
    }
    steps.push({
      category: String(input.categoryField(item, index)),
      delta: d,
      total: isTotal,
      layers,
      lo,
      hi,
      running,
      item,
      index,
    });
  });
  return { steps, spans: steps.map((s) => [s.lo, s.hi]) };
}
