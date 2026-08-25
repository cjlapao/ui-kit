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
  /** True when this point is a gap placeholder (excluded by `defined`). */
  gap: boolean;
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

/** Build the area-under-line path down to `baselineY` — animation-safe. */
export function areaPathFromPoints(
  points: { x: number; y: number }[],
  baselineY: number,
  curve: LineCurve,
): string {
  if (points.length === 0) return "";
  return (
    area<{ x: number; y: number }>()
      .x((d) => d.x)
      .y0(baselineY)
      .y1((d) => d.y)
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
}

function isMissing(v: number | null): v is null {
  return v === null || v === undefined || Number.isNaN(v as number);
}

export function computeLineGeometry(input: LineGeometryInput): LineGeometry {
  const { points, curve, connectNulls, baselineY, zeroY } = input;

  const pathPoints: PathPoint[] = [];
  for (const p of points) {
    if (isMissing(p.y)) {
      if (connectNulls === "zero") {
        pathPoints.push({ x: p.x, y: zeroY, value: 0, gap: false, zero: true, item: p.item, index: p.index });
      } else if (connectNulls === "connect") {
        // Bridge: drop the point so the path runs straight across.
        continue;
      } else {
        // Gap: keep a placeholder so `defined()` breaks the sub-path.
        pathPoints.push({ x: p.x, y: baselineY, value: 0, gap: true, zero: false, item: p.item, index: p.index });
      }
      continue;
    }
    pathPoints.push({ x: p.x, y: p.y, value: p.value ?? p.y, gap: false, zero: false, item: p.item, index: p.index });
  }

  const lineGen = line<PathPoint>()
    .x((d) => d.x)
    .y((d) => d.y)
    .defined((d) => !d.gap)
    .curve(curveFactory(curve));
  const areaGen = area<PathPoint>()
    .x((d) => d.x)
    .y0(baselineY)
    .y1((d) => d.y)
    .defined((d) => !d.gap)
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
