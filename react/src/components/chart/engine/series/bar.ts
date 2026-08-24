/**
 * Bar / column geometry: grouped, stacked and percent layouts, vertical
 * (columns) and horizontal (bars) orientation.
 *
 * Stacking is coordinated by {@link computeStacks} (called once per stack
 * group by the root), which resolves each series to (start, end) value pairs
 * per category; {@link computeBarGeometry} then turns those into rects.
 */
import type { BarGeometry } from "../types";

export type BarMode = "group" | "stack" | "percent";
export type BarOrientation = "vertical" | "horizontal";

export interface BarValueDatum {
  /** Category (x) key. */
  category: string;
  /** This series' value at the category (already in stack units for
   *  stack/percent — the root applies computeStacks first). */
  value: number;
  /** Stack offset: the cumulative value of the series below (group mode: 0). */
  offset: number;
  item: unknown;
  index: number;
}

export interface BarGeometryInput {
  bars: BarValueDatum[];
  /** Category (band/point) scale. Vertical mode: x-axis; horizontal: y-axis. */
  categoryScale: { map(c: string): number; center(c: string): number; bandWidth: number };
  /** Value (linear) scale. Vertical mode: y-axis; horizontal: x-axis. */
  valueScale: { map(v: number): number; domain: [number, number] };
  mode: BarMode;
  orientation: BarOrientation;
  /** 0-based position of this series within its group/stack (grouped mode). */
  groupIndex?: number;
  /** Number of series sharing the group (grouped mode). */
  groupCount?: number;
  /** Pixel position of the zero line (falls back to the value domain edge
   *  when zero is not inside the domain). */
  baselinePixel?: number;
}

/**
 * Resolve stacked values per category.
 *
 * Returns `seriesCount` arrays of `{ start, end }` pairs aligned to the
 * category order. `percent` normalizes each category to 100 (0 when the
 * category total is 0). Negative values stack downward from zero.
 */
export function computeStacks(
  seriesValues: number[][],
  mode: Extract<BarMode, "stack" | "percent">,
): { start: number; end: number }[][] {
  const categories = seriesValues[0]?.length ?? 0;
  const out: { start: number; end: number }[][] = seriesValues.map(() => []);
  if (seriesValues.length === 0) return out;

  for (let c = 0; c < categories; c++) {
    // Positive and negative stacks grow away from zero independently.
    let posBase = 0;
    let negBase = 0;
    let total = 0;
    for (const v of seriesValues) total += v[c] ?? 0;

    for (let s = 0; s < seriesValues.length; s++) {
      const v = seriesValues[s][c] ?? 0;
      let start: number;
      let end: number;
      if (v >= 0) {
        start = posBase;
        end = posBase + v;
        posBase = end;
      } else {
        end = negBase;
        start = negBase + v;
        negBase = start;
      }
      if (mode === "percent" && total !== 0) {
        start = (start / total) * 100;
        end = (end / total) * 100;
      }
      out[s].push({ start, end });
    }
  }
  return out;
}

export function computeBarGeometry(input: BarGeometryInput): BarGeometry {
  const {
    bars,
    categoryScale,
    valueScale,
    orientation,
    groupIndex = 0,
    groupCount = 1,
  } = input;

  const zeroInDomain =
    valueScale.domain[0] <= 0 && 0 <= valueScale.domain[1];
  const baseline =
    input.baselinePixel ??
    (zeroInDomain ? valueScale.map(0) : valueScale.domain[0] < 0 ? valueScale.map(valueScale.domain[1]) : valueScale.map(valueScale.domain[0]));

  const grouped = input.mode === "group";
  const slot = categoryScale.bandWidth / Math.max(1, groupCount);

  const rects = bars.map((b) => {
    // Stacked (and percent) bars span offset → value; grouped bars span
    // baseline → value.
    const from = grouped ? 0 : b.offset;
    const to = grouped ? b.value : b.value + b.offset;
    const v0 = valueScale.map(from);
    const v1 = valueScale.map(to);
    const size = Math.abs(v1 - v0);
    const start = Math.min(v0, v1);

    if (orientation === "vertical") {
      const xStart = categoryScale.map(b.category);
      const x = grouped ? xStart + slot * groupIndex : xStart;
      const width = grouped ? slot : categoryScale.bandWidth;
      return {
        x,
        y: start,
        width,
        height: size,
        value: b.value,
        item: b.item,
        index: b.index,
      };
    }
    // horizontal
    const yStart = categoryScale.map(b.category);
    const y = grouped ? yStart + slot * groupIndex : yStart;
    const height = grouped ? slot : categoryScale.bandWidth;
    return {
      x: start,
      y,
      width: size,
      height,
      value: b.value,
      item: b.item,
      index: b.index,
    };
  });

  return { bars: rects, baseline };
}
