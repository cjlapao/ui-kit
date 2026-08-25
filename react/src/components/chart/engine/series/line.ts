/**
 * Line / area geometry.
 *
 * Inputs are already in pixel space (the React layer scales data → pixels
 * with the chart's scales); this module only decides the path shape, gap
 * handling, and marker points. The same `linePathFromPoints` is used for
 * update-animation frames (interpolated pixel points).
 */
import {
  area,
  curveCatmullRom,
  curveLinear,
  curveMonotoneX,
  curveStep,
  curveStepAfter,
  curveStepBefore,
  line,
  type CurveFactory,
} from "d3-shape";
import type { ConnectNulls, LineCurve, LineGeometry, LinePoint } from "../types";

/** A point in pixel space; `y` null means the source value was null. */
export interface PlottedPoint {
  x: number;
  y: number | null;
  /** Raw data value (null when missing). Carried through for tooltips/labels. */
  value: number | null;
  item: unknown;
  index: number;
}

interface PathPoint {
  x: number;
  y: number;
  /** Raw data value (0 when zero-substituted). */
  value: number;
  /** True when this point is a gap placeholder for the LINE path. */
  gap: boolean;
  /**
   * True when this point is a gap placeholder for the AREA path (missing
   * value, or a missing baseline-field value — the line still draws).
   */
  areaGap: boolean;
  /** True when the value was substituted with zero (`connectNulls="zero"`). */
  zero: boolean;
  item: unknown;
  index: number;
}

export function curveFactory(curve: LineCurve): CurveFactory {
  switch (curve) {
    case "linear":
      return curveLinear;
    case "smooth":
      return curveMonotoneX;
    case "spline":
      // tension 0.5 = the classic Catmull-Rom
      return curveCatmullRom.alpha(0.5);
    case "step":
      return curveStep;
    case "step-before":
      return curveStepBefore;
    case "step-after":
      return curveStepAfter;
  }
}

/** Build a line path from pixel points (all finite) — animation-safe. */
export function linePathFromPoints(
  points: { x: number; y: number }[],
  curve: LineCurve,
): string {
  if (points.length === 0) return "";
  return (
    line<{ x: number; y: number }>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(curveFactory(curve))(points) ?? ""
  );
}

/**
 * Build a closed area path between two edges (`y0` lower, `y1` upper).
 * Each edge is interpolated independently by the curve factory — the same
 * treatment d3 gives a plain area — so a smooth curve on both edges gives
 * the "corridor" look. Shared by the line baseline-field fill and the
 * range-area band.
 */
export function bandAreaPath(
  points: { x: number; y0: number; y1: number; gap?: boolean }[],
  curve: LineCurve,
): string {
  if (points.length === 0) return "";
  return (
    area<{ x: number; y0: number; y1: number; gap?: boolean }>()
      .x((d) => d.x)
      .y0((d) => d.y0)
      .y1((d) => d.y1)
      .defined((d) => !d.gap)
      .curve(curveFactory(curve))(points) ?? ""
  );
}

/** Build the area-under-line path down to `baselineY` — animation-safe. */
export function areaPathFromPoints(
  points: { x: number; y: number }[],
  baselineY: number,
  curve: LineCurve,
): string {
  if (points.length === 0) return "";
  return bandAreaPath(
    points.map((p) => ({ x: p.x, y0: baselineY, y1: p.y })),
    curve,
  );
}

/**
 * Build a line path from pixel points with per-point gaps (placeholder
 * points with `gap: true` break the sub-path). Used for band edges where
 * one edge is missing mid-series.
 */
export function linePathWithGaps(
  points: { x: number; y: number; gap?: boolean }[],
  curve: LineCurve,
): string {
  if (points.length === 0) return "";
  return (
    line<{ x: number; y: number; gap?: boolean }>()
      .x((d) => d.x)
      .y((d) => d.y)
      .defined((d) => !d.gap)
      .curve(curveFactory(curve))(points) ?? ""
  );
}

export interface LineGeometryInput {
  /** Pixel-space points, in data order. Null y = missing value. */
  points: PlottedPoint[];
  curve: LineCurve;
  connectNulls: ConnectNulls;
  /** Pixel y of the area floor (usually the y-domain minimum). */
  baselineY: number;
  /** Pixel y of value zero (used by `connectNulls="zero"`). */
  zeroY: number;
  /**
   * Optional second edge (a baseline FIELD, same data order/x). When
   * present, the area path closes to this curve instead of `baselineY`
   * (fill between two lines). A missing baseline value turns the point
   * into a gap.
   */
  baselinePoints?: { x: number; y: number | null }[];
}

function isMissing(v: number | null): v is null {
  return v === null || v === undefined || Number.isNaN(v as number);
}

export function computeLineGeometry(input: LineGeometryInput): LineGeometry {
  const { points, curve, connectNulls, baselineY, zeroY, baselinePoints } =
    input;

  const pathPoints: (PathPoint & { baseY: number | null })[] = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const baseY = baselinePoints?.[i]?.y ?? null;
    if (isMissing(p.y)) {
      if (connectNulls === "zero") {
        pathPoints.push({ x: p.x, y: zeroY, value: 0, gap: false, areaGap: false, zero: true, item: p.item, index: p.index, baseY });
      } else if (connectNulls === "connect") {
        // Bridge: drop the point so the path runs straight across.
        continue;
      } else {
        // Gap: keep a placeholder so `defined()` breaks the sub-path.
        pathPoints.push({ x: p.x, y: baselineY, value: 0, gap: true, areaGap: true, zero: false, item: p.item, index: p.index, baseY });
      }
      continue;
    }
    if (baselinePoints && isMissing(baseY)) {
      // Fill between two lines: a missing baseline can't anchor the band,
      // but the line itself still draws through this point.
      pathPoints.push({ x: p.x, y: p.y, value: p.value ?? p.y, gap: false, areaGap: true, zero: false, item: p.item, index: p.index, baseY: null });
      continue;
    }
    pathPoints.push({ x: p.x, y: p.y, value: p.value ?? p.y, gap: false, areaGap: false, zero: false, item: p.item, index: p.index, baseY });
  }

  const lineGen = line<PathPoint>()
    .x((d) => d.x)
    .y((d) => d.y)
    .defined((d) => !d.gap)
    .curve(curveFactory(curve));
  const areaGen = area<PathPoint & { baseY: number | null }>()
    .x((d) => d.x)
    .y0((d) => (baselinePoints ? d.baseY ?? baselineY : baselineY))
    .y1((d) => d.y)
    .defined((d) => !d.areaGap)
    .curve(curveFactory(curve));

  const solid = pathPoints.filter((d) => !d.gap);
  const markerPoints: LinePoint[] = solid.map((d) => ({
    x: d.x,
    y: d.y,
    value: d.value,
    item: d.item,
    index: d.index,
  }));

  return {
    points: markerPoints,
    linePath: lineGen(pathPoints) ?? "",
    areaPath: solid.length > 0 ? areaGen(pathPoints) ?? "" : "",
    first: markerPoints.length > 0 ? markerPoints[0] : null,
    last: markerPoints.length > 0 ? markerPoints[markerPoints.length - 1] : null,
  };
}
