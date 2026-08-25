/**
 * Radar (spider) chart geometry.
 *
 * Polar mapping shared by all radar series in a chart:
 * - `angle(i) = -π/2 + i · 2π/n` — first axis at 12 o'clock, clockwise.
 * - radius `r = (value / domainMax) · R` on a [0, domainMax] domain.
 *
 * The shared grid (rings, spokes, axis labels, tick labels) is computed
 * once by the root; each series computes its own polygon.
 */
import type { RadarGeometry, RadarGrid, RadarPoint } from "../types";

/** Polar angle for axis `i` of `n` (radians, y-down, 0 = 12 o'clock). */
export function radarAngle(i: number, n: number): number {
  return -Math.PI / 2 + (i * 2 * Math.PI) / n;
}

/**
 * Extend a max value to a nice round number divisible by `rings` steps
 * (e.g. 97 with 4 rings → 100, ring step 25).
 */
export function niceRadarMax(value: number, rings: number): number {
  if (!Number.isFinite(value) || value <= 0) return rings;
  const raw = value / rings;
  const pow = 10 ** Math.floor(Math.log10(raw));
  for (const c of [1, 2, 2.5, 5, 10]) {
    const step = c * pow;
    if (step * rings >= value) return step * rings;
  }
  return 10 * pow * rings;
}

function isMissing(v: number | null | undefined): v is null | undefined {
  return v === null || v === undefined || !Number.isFinite(v);
}

/**
 * Build the polygon path from plotted points (in axis order). Consecutive
 * present points form a run; a full ring closes with Z, otherwise each run
 * is an open sub-path (gaps).
 */
export function radarPath(points: RadarPoint[], axisCount: number): string {
  if (points.length === 0) return "";
  const byAxis = new Map<number, RadarPoint>();
  points.forEach((q) => byAxis.set(q.axis, q));
  if (byAxis.size === axisCount) {
    return points.map((q, i) => `${i === 0 ? "M" : "L"}${q.x},${q.y}`).join("") + "Z";
  }
  let path = "";
  let run: RadarPoint[] = [];
  for (let i = 0; i < axisCount; i++) {
    const q = byAxis.get(i);
    if (!q) {
      if (run.length >= 2) {
        path += run.map((r, j) => `${j === 0 ? "M" : "L"}${r.x},${r.y}`).join("");
      }
      run = [];
      continue;
    }
    run.push(q);
  }
  if (run.length >= 2) {
    path += run.map((r, j) => `${j === 0 ? "M" : "L"}${r.x},${r.y}`).join("");
  }
  return path;
}

export interface RadarGeometryInput {
  /** One raw value per axis (in axis order). */
  values: (number | null | undefined)[];
  cx: number;
  cy: number;
  R: number;
  domainMax: number;
  items?: unknown[];
}

/**
 * Plot a series' values onto the radar. Missing values drop the point and
 * break the polygon into open sub-paths (a closed polygon with a gap is an
 * open polyline). Linear segments only.
 */
export function computeRadarGeometry(input: RadarGeometryInput): RadarGeometry {
  const { values, cx, cy, R, domainMax, items } = input;
  const n = values.length;
  if (n === 0 || domainMax <= 0) {
    return {
      points: [],
      linePath: "",
      fillPath: "",
      hasGaps: false,
      first: null,
      last: null,
    };
  }

  const points: RadarPoint[] = [];
  for (let i = 0; i < n; i++) {
    const v = values[i];
    if (isMissing(v)) continue;
    const r = Math.max(0, Math.min(1, (v as number) / domainMax)) * R;
    const a = radarAngle(i, n);
    points.push({
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
      value: v as number,
      axis: i,
      item: items?.[i] ?? null,
      index: i,
    });
  }

  const linePath = radarPath(points, n);

  return {
    points,
    linePath,
    fillPath: linePath,
    hasGaps: points.length !== n,
    first: points[0] ?? null,
    last: points[points.length - 1] ?? null,
  };
}

export interface RadarGridInput {
  axes: string[];
  cx: number;
  cy: number;
  R: number;
  rings: number;
  domainMax: number;
  /** Format one ring value into its tick label (defaults to String). */
  format?: (value: number) => string;
}

/**
 * The shared radar grid: `rings` concentric polygons, spokes to each axis
 * vertex, and ring tick labels along the first (top) axis.
 */
export function computeRadarGrid(input: RadarGridInput): RadarGrid {
  const { axes, cx, cy, R, rings, domainMax, format } = input;
  const n = axes.length;
  const ringValues: number[] = [];
  const ringPaths: string[] = [];
  for (let k = 1; k <= rings; k++) {
    const r = (R * k) / rings;
    ringValues.push((domainMax * k) / rings);
    ringPaths.push(
      axes
        .map((_, i) => {
          const a = radarAngle(i, n);
          return `${i === 0 ? "M" : "L"}${cx + r * Math.cos(a)},${
            cy + r * Math.sin(a)
          }`;
        })
        .join("") + "Z",
    );
  }

  const spokes = axes.map((label, i) => {
    const a = radarAngle(i, n);
    return {
      x1: cx,
      y1: cy,
      x2: cx + R * Math.cos(a),
      y2: cy + R * Math.sin(a),
      label,
      angle: a,
    };
  });

  // Tick labels sit just LEFT of the first (top) axis, at each ring height.
  const tickLabels = ringValues.map((v, k) => ({
    x: cx - 7,
    y: cy - (R * (k + 1)) / rings + 4,
    text: format ? format(v) : String(Math.round(v * 10) / 10),
  }));

  return { cx, cy, R, ringValues, ringPaths, spokes, tickLabels };
}

/**
 * Interpolate between two radar geometries for update animation frames.
 * Index-aligned; returns `cur` when settled or without a previous one.
 */
export function frameRadarGeometry(
  cur: RadarGeometry,
  prev: RadarGeometry | null,
  p: number,
): RadarGeometry {
  if (!prev || p >= 1 || cur.points.length === 0) return cur;
  if (prev.points.length !== cur.points.length) return cur;
  const pts = cur.points.map((pt, i) => {
    const from = prev.points[i];
    return {
      ...pt,
      x: from.x + (pt.x - from.x) * p,
      y: from.y + (pt.y - from.y) * p,
      value: from.value + (pt.value - from.value) * p,
    };
  });
  const n = Math.max(...cur.points.map((q) => q.axis)) + 1;
  const linePath = radarPath(pts, n);
  return {
    ...cur,
    points: pts,
    linePath,
    fillPath: linePath,
    first: pts[0] ?? null,
    last: pts[pts.length - 1] ?? null,
  };
}
