/**
 * Scatter / bubble geometry.
 *
 * One circle per datum, positioned on the shared x/y scales (linear, log or
 * time) with an optional area-proportional radius from a size field. The
 * component owns animation bookkeeping; this module is pure math.
 */
import { lerp } from "../animation";
import type { AnyScale, ContinuousScale } from "../types";

export interface ScatterPoint {
  /** Pixel x. */
  x: number;
  /** Pixel y. */
  y: number;
  /** Marker radius in px (already size-scaled). */
  r: number;
}

export interface ScatterGeometry {
  points: ScatterPoint[];
}

export interface ScatterGeometryInput {
  data: unknown[];
  xAccessor: (item: unknown, index: number) => number | Date | string;
  yAccessor: (item: unknown, index: number) => number | null | undefined;
  /** Size accessor (bubble mode); omit for uniform dots. */
  sizeAccessor?: (item: unknown, index: number) => number | null | undefined;
  xScale: AnyScale;
  yScale: ContinuousScale;
  /** Smallest marker radius in px. Default 6. */
  minSize?: number;
  /** Largest marker radius in px. Default 30. */
  maxSize?: number;
}

function xPixel(xScale: AnyScale, v: number | Date | string): number {
  if ("bandWidth" in xScale) return xScale.center(String(v));
  return (xScale as ContinuousScale).map(v as number | Date);
}

/**
 * Compute the settled pixel geometry for a scatter series. Rows with a
 * missing/non-finite y are skipped. Bubble radii are area-proportional:
 * r ∝ √value, linearly mapped into [minSize, maxSize]; a single distinct
 * size value renders at `minSize` (no artificial max).
 */
export function computeScatterGeometry(
  input: ScatterGeometryInput,
): ScatterGeometry {
  const minSize = input.minSize ?? 6;
  const maxSize = input.maxSize ?? 30;

  const values: number[] = [];
  for (let i = 0; i < input.data.length; i++) {
    const v = input.yAccessor(input.data[i], i);
    if (v !== null && v !== undefined && Number.isFinite(v)) values.push(v as number);
  }
  if (values.length === 0) return { points: [] };

  // Size scale (bubble mode).
  let sizeMin = 0;
  let sizeMax = 0;
  let hasSize = false;
  if (input.sizeAccessor) {
    const sizes: number[] = [];
    for (let i = 0; i < input.data.length; i++) {
      const s = input.sizeAccessor(input.data[i], i);
      if (s !== null && s !== undefined && Number.isFinite(s)) {
        sizes.push(s as number);
      }
    }
    if (sizes.length > 0) {
      hasSize = true;
      sizeMin = Math.min(...sizes);
      sizeMax = Math.max(...sizes);
    }
  }

  const points: ScatterPoint[] = [];
  for (let i = 0; i < input.data.length; i++) {
    const item = input.data[i];
    const yv = input.yAccessor(item, i);
    if (yv === null || yv === undefined || !Number.isFinite(yv as number))
      continue;
    const x = xPixel(input.xScale, input.xAccessor(item, i));
    if (!Number.isFinite(x)) continue;
    const y = input.yScale.map(yv as number);
    if (!Number.isFinite(y)) continue;

    let r = minSize;
    if (hasSize) {
      const sv = input.sizeAccessor!(item, i);
      if (sv !== null && sv !== undefined && Number.isFinite(sv as number)) {
        const t =
          sizeMax > sizeMin
            ? (sv as number - sizeMin) / (sizeMax - sizeMin)
            : 0;
        r = minSize + (maxSize - minSize) * Math.sqrt(Math.max(0, Math.min(1, t)));
      }
    }
    points.push({ x, y, r });
  }
  return { points };
}

/**
 * Interpolate between two geometries (t: 0 = prev, 1 = next). With no
 * previous geometry (entrance) points keep their position and grow from
 * r = 0. Length mismatches: extra points grow in at their position,
 * removed points shrink in place (they belong to `prev`).
 */
export function frameScatterGeometry(
  prev: ScatterGeometry | null,
  next: ScatterGeometry,
  t: number,
): ScatterGeometry {
  if (t >= 1) return next;
  if (!prev) {
    return {
      points: next.points.map((p) => ({ x: p.x, y: p.y, r: p.r * t })),
    };
  }
  const n = Math.max(prev.points.length, next.points.length);
  const points: ScatterPoint[] = [];
  for (let i = 0; i < n; i++) {
    const a = prev.points[i] ?? null;
    const b = next.points[i] ?? null;
    if (a && b) {
      points.push({
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        r: Math.max(0, lerp(a.r, b.r, t)),
      });
    } else if (b) {
      // New point: grow in at its settled position.
      points.push({ x: b.x, y: b.y, r: b.r * t });
    } else if (a) {
      // Removed point: shrink out in place.
      points.push({ x: a.x, y: a.y, r: Math.max(0, a.r * (1 - t)) });
    }
  }
  return { points };
}

/**
 * Nearest-point hit test: the point whose center is closest to (px, py)
 * among points within `r + hitRadius`. Returns the index, or null.
 */
export function hitTestScatter(
  points: ScatterPoint[],
  px: number,
  py: number,
  hitRadius: number,
): number | null {
  let best: number | null = null;
  let bestDist = Infinity;
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const d = Math.hypot(px - p.x, py - p.y);
    if (d <= p.r + hitRadius && d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}
