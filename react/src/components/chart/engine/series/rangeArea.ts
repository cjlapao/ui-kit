/**
 * Range-area (band) geometry: a filled area between a lower (min) and an
 * upper (max) edge, both smoothed independently by the curve factory.
 *
 * Inputs are in pixel space; the React layer scales the min/max fields with
 * the chart's value scale. The same generator runs for animation frames
 * (interpolated pixel points), so entrance/update frames reuse the exact
 * settled shape.
 */
import type { ConnectNulls, LineCurve, RangeAreaGeometry, RangeAreaPoint } from "../types";
import { bandAreaPath, linePathFromPoints, linePathWithGaps } from "./line";

/** A pixel-space range-area point; null edges = missing source value. */
export interface RangeAreaPlottedPoint {
  x: number;
  yMin: number | null;
  yMax: number | null;
  min: number | null;
  max: number | null;
  item: unknown;
  index: number;
}

export interface RangeAreaGeometryInput {
  points: RangeAreaPlottedPoint[];
  curve: LineCurve;
  /**
   * How to treat missing edges. Range areas only support "gap" semantics
   * (a band can't be anchored where either edge is missing); "connect"
   * and "zero" fall back to gaps.
   */
  connectNulls?: ConnectNulls;
}

function isMissing(v: number | null): v is null {
  return v === null || v === undefined || Number.isNaN(v as number);
}

export function computeRangeAreaGeometry(
  input: RangeAreaGeometryInput,
): RangeAreaGeometry {
  const { points, curve } = input;

  const solid: RangeAreaPoint[] = [];
  const bandPts: { x: number; y0: number; y1: number; gap?: boolean }[] = [];
  const upperPts: { x: number; y: number; gap?: boolean }[] = [];
  const lowerPts: { x: number; y: number; gap?: boolean }[] = [];

  for (const p of points) {
    const missing = isMissing(p.yMin) || isMissing(p.yMax);
    if (missing) {
      bandPts.push({ x: p.x, y0: 0, y1: 0, gap: true });
      upperPts.push({ x: p.x, y: 0, gap: true });
      lowerPts.push({ x: p.x, y: 0, gap: true });
      continue;
    }
    const pt: RangeAreaPoint = {
      x: p.x,
      yMin: p.yMin as number,
      yMax: p.yMax as number,
      min: p.min as number,
      max: p.max as number,
      item: p.item,
      index: p.index,
    };
    solid.push(pt);
    // y0 = lower (min) edge, y1 = upper (max) edge.
    bandPts.push({ x: p.x, y0: pt.yMin, y1: pt.yMax });
    upperPts.push({ x: p.x, y: pt.yMax });
    lowerPts.push({ x: p.x, y: pt.yMin });
  }

  return {
    bandPath: solid.length > 0 ? bandAreaPath(bandPts, curve) : "",
    upperPath: solid.length > 0 ? linePathWithGaps(upperPts, curve) : "",
    lowerPath: solid.length > 0 ? linePathWithGaps(lowerPts, curve) : "",
    points: solid,
    first: solid.length > 0 ? solid[0] : null,
    last: solid.length > 0 ? solid[solid.length - 1] : null,
  };
}

/**
 * Interpolate two settled range geometries toward each other (update
 * animation frames). Points must share data alignment (same x order);
 * mismatched lengths fall back to the current geometry per point.
 */
export function frameRangeAreaGeometry(
  cur: RangeAreaGeometry,
  prev: RangeAreaGeometry | null,
  p: number,
  curve: LineCurve,
): RangeAreaGeometry {
  if (!prev || p >= 1 || cur.points.length === 0) return cur;
  const bandPts: { x: number; y0: number; y1: number; gap?: boolean }[] = [];
  const upperPts: { x: number; y: number }[] = [];
  const lowerPts: { x: number; y: number }[] = [];
  const points = cur.points.map((pt) => {
    const q = prev.points[pt.index] ?? null;
    const x = q ? q.x + (pt.x - q.x) * p : pt.x;
    const yMin = q ? q.yMin + (pt.yMin - q.yMin) * p : pt.yMin;
    const yMax = q ? q.yMax + (pt.yMax - q.yMax) * p : pt.yMax;
    const fp: RangeAreaPoint = { ...pt, x, yMin, yMax };
    bandPts.push({ x, y0: yMin, y1: yMax });
    upperPts.push({ x, y: yMax });
    lowerPts.push({ x, y: yMin });
    return fp;
  });
  return {
    bandPath: bandAreaPath(bandPts, curve),
    upperPath: linePathFromPoints(upperPts, curve),
    lowerPath: linePathFromPoints(lowerPts, curve),
    points,
    first: points[0] ?? null,
    last: points[points.length - 1] ?? null,
  };
}
