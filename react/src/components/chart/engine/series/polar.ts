/**
 * Polar (rose / nightingale) chart geometry.
 *
 * Categories start at 12 o'clock and proceed clockwise (same convention as
 * radar). Each series contributes annular sectors:
 * - `mode: "stack"` — series stack inner→outer across the full category
 *   slot (like stacked bars along the radius).
 * - `mode: "group"` — series sit side-by-side in equal sub-arcs within the
 *   slot (like grouped bars).
 *
 * The shared grid (rings, spokes, category labels, tick labels) is computed
 * once by the root; each series computes its own segments.
 */
import { niceRadarMax } from "./radar";
import type { PolarGeometry, PolarGrid, PolarSegment } from "../types";

/** Polar angle for category `i` of `n` (radians, y-down, 0 = 12 o'clock). */
export function polarAngle(i: number, n: number): number {
  return -Math.PI / 2 + (i * 2 * Math.PI) / n;
}

/** Nice domain max for polar values (shared radar helper). */
export function nicePolarMax(value: number, rings: number): number {
  return niceRadarMax(value, rings);
}

function isMissing(v: number | null | undefined): v is null | undefined {
  return v === null || v === undefined || !Number.isFinite(v);
}

/** Round to 2 decimals for compact path strings. */
const r2 = (v: number) => Math.round(v * 100) / 100;

const pt = (cx: number, cy: number, r: number, a: number) =>
  `${r2(cx + r * Math.cos(a))} ${r2(cy + r * Math.sin(a))}`;

const arcTo = (
  r: number,
  from: number,
  to: number,
  sweep: 0 | 1,
) =>
  `A${r2(r)} ${r2(r)} 0 ${to - from > Math.PI ? 1 : 0} ${sweep} `;

/**
 * Path for an annular sector (donut wedge) from inner radius r0 to outer
 * r1 between angles a0..a1 (a1 > a0), with optional rounded corners.
 *
 * Corner radius is clamped to fit the wedge; `radius <= 0.5` produces the
 * plain sector (outer arc → line → inner arc reversed → close). A wedge
 * with a near-zero inner radius falls back to the plain sector (a rounded
 * tip at the center is ambiguous).
 */
export function roundedAnnularSector(
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  a0: number,
  a1: number,
  radius: number,
): string {
  const span = a1 - a0;
  if (r1 <= r0 || span <= 0) return "";

  if (radius > 0.5) {
    let rr = radius;
    if (r0 < 1) rr = Math.min(rr, 0.5);
    else {
      rr = Math.min(
        rr,
        (r1 - r0) / 2,
        (r1 * span) / 2 - 0.5,
        (r0 * span) / 2 - 0.5,
      );
    }
    if (rr > 0.5 && r0 >= 1) {
      const dO = rr / r1; // tangent offset (rad) on the outer arc
      const dI = rr / r0; // tangent offset (rad) on the inner arc
      return (
        `M${pt(cx, cy, r1 - rr, a0)}` +
        `A${r2(rr)} ${r2(rr)} 0 0 1 ${pt(cx, cy, r1, a0 + dO)}` +
        arcTo(r1, a0 + dO, a1 - dO, 1) +
        pt(cx, cy, r1, a1 - dO) +
        `A${r2(rr)} ${r2(rr)} 0 0 1 ${pt(cx, cy, r1 - rr, a1)}` +
        `L${pt(cx, cy, r0 + rr, a1)}` +
        `A${r2(rr)} ${r2(rr)} 0 0 1 ${pt(cx, cy, r0, a1 - dI)}` +
        arcTo(r0, a1 - dI, a0 + dI, 0) +
        pt(cx, cy, r0, a0 + dI) +
        `A${r2(rr)} ${r2(rr)} 0 0 1 ${pt(cx, cy, r0 + rr, a0)}` +
        `L${pt(cx, cy, r1 - rr, a0)}Z`
      );
    }
  }

  // Plain sector.
  return (
    `M${pt(cx, cy, r1, a0)}` +
    arcTo(r1, a0, a1, 1) +
    pt(cx, cy, r1, a1) +
    `L${pt(cx, cy, r0, a1)}` +
    arcTo(r0, a1, a0, 0) +
    pt(cx, cy, r0, a0) +
    "Z"
  );
}

export interface PolarGeometryInput {
  /** Ordered category labels (post-sort). */
  categories: string[];
  series: { id: string; values: (number | null | undefined)[] }[];
  mode: "group" | "stack";
  cx: number;
  cy: number;
  /** Outer radius. */
  R: number;
  /** Hole radius (absolute px). */
  innerR: number;
  /** Shared value max across all series. */
  valueMax: number;
  /**
   * Max category total (stack mode scale). Defaults to the max of the
   * per-category sums of the provided series — pass the cross-series total
   * so every series scales identically.
   */
  maxTotal?: number;
  /** Angular gap between category slots (radians). */
  gapAngle?: number;
  /** Radial gap between stacked bands (px). */
  bandGap?: number;
  /** Segment corner radius (px). */
  segmentRadius?: number;
}

/**
 * Compute the annular sectors for every (category, series) pair. Missing
 * values produce no segment.
 */
export function computePolarGeometry(input: PolarGeometryInput): PolarGeometry {
  const {
    categories,
    series,
    mode,
    cx,
    cy,
    R,
    innerR,
    valueMax,
    maxTotal: inputMaxTotal,
    gapAngle = 0.04,
    bandGap = 3,
    segmentRadius = 0,
  } = input;
  const n = categories.length;
  const segments: PolarSegment[] = [];
  if (n === 0 || valueMax <= 0 || series.length === 0) {
    return { segments, mode, n };
  }

  const usable = R - innerR;
  if (usable <= 0) return { segments, mode, n };

  // Max category total (stack mode scale). When the caller provides the
  // cross-series total, prefer it so every series shares one scale.
  const computedMaxTotal = Math.max(
    1e-9,
    ...categories.map((_, i) =>
      series.reduce(
        (sum, s) => sum + (isMissing(s.values[i]) ? 0 : s.values[i]),
        0,
      ),
    ),
  );
  const maxTotal =
    mode === "stack"
      ? Math.max(computedMaxTotal, inputMaxTotal ?? 0)
      : 0;
  const bands = series.length;
  const kStack = (usable - Math.max(0, bands - 1) * bandGap) / maxTotal;
  const kGroup = usable / Math.max(1e-9, valueMax);

  for (let i = 0; i < n; i++) {
    const a0 = polarAngle(i, n) + gapAngle / 2;
    const a1 = polarAngle((i + 1) % n, n) - gapAngle / 2 + (i === n - 1 ? 0 : 0);
    const aEnd = a1 > a0 ? a1 : a1 + 2 * Math.PI;
    if (aEnd - a0 <= 0) continue;

    if (mode === "stack") {
      let running = innerR;
      for (let sIdx = 0; sIdx < bands; sIdx++) {
        const v = series[sIdx].values[i];
        if (isMissing(v)) continue;
        const r0 = running;
        const r1 = running + v * kStack;
        running = r1 + bandGap;
        segments.push(
          makeSegment(i, sIdx, series[sIdx].id, v, a0, aEnd, r0, r1),
        );
      }
    } else {
      const present = series
        .map((s, sIdx) => ({ sIdx, v: s.values[i] as number }))
        .filter((item) => !isMissing(item.v));
      const k = present.length || 1;
      const subSpan = (aEnd - a0) / k;
      present.forEach(({ sIdx, v }, j) => {
        segments.push(
          makeSegment(
            i,
            sIdx,
            series[sIdx].id,
            v,
            a0 + j * subSpan,
            a0 + (j + 1) * subSpan,
            innerR,
            innerR + (v as number) * kGroup,
          ),
        );
      });
    }
  }

  function makeSegment(
    categoryIndex: number,
    seriesIndex: number,
    seriesId: string,
    value: number,
    sa0: number,
    sa1: number,
    r0: number,
    r1: number,
  ): PolarSegment {
    return {
      path: roundedAnnularSector(
        cx,
        cy,
        r0,
        Math.max(r0 + 0.5, r1),
        sa0,
        sa1,
        segmentRadius,
      ),
      a0: sa0,
      a1: sa1,
      midAngle: (sa0 + sa1) / 2,
      rInner: r0,
      rOuter: Math.max(r0 + 0.5, r1),
      value,
      categoryIndex,
      seriesId,
      seriesIndex,
    };
  }

  return { segments, mode, n };
}

/**
 * Hit-test a pointer position against segments. In stack mode the outermost
 * containing segment wins (it is topmost under the pointer).
 */
export function hitTestPolar(
  segments: PolarSegment[],
  x: number,
  y: number,
  cx: number,
  cy: number,
): PolarSegment | null {
  const dx = x - cx;
  const dy = y - cy;
  const r = Math.hypot(dx, dy);
  if (r <= 0) return null;
  let angle = Math.atan2(dy, dx);
  // Normalize into [-π/2, 3π/2) — the chart's angle range.
  while (angle < -Math.PI / 2) angle += 2 * Math.PI;
  while (angle >= -Math.PI / 2 + 2 * Math.PI) angle -= 2 * Math.PI;
  for (let i = segments.length - 1; i >= 0; i--) {
    const s = segments[i];
    if (r < s.rInner || r > s.rOuter) continue;
    if (angle < s.a0 || angle > s.a1) continue;
    return s;
  }
  return null;
}

/**
 * Index-aligned interpolation of segment radii for update animations.
 * Rebuilds each path from the interpolated radii (angle span unchanged).
 */
export function framePolarGeometry(
  current: PolarGeometry,
  previous: PolarGeometry | null,
  progress: number,
  input: {
    cx: number;
    cy: number;
    segmentRadius?: number;
    /**
     * Shared category totals (stack mode): recomputes the band scale from
     * the CURRENT totals so the stacked set stays visually consistent while
     * the radii animate. Omit for single-series (group) updates.
     */
    sharedTotals?: number[];
    bandGap?: number;
    R?: number;
    innerR?: number;
  },
): PolarGeometry {
  if (!previous || progress >= 1 || previous.n !== current.n) return current;
  const p = Math.max(0, Math.min(1, progress));
  const byKey = new Map(
    previous.segments.map((s) => [`${s.categoryIndex}:${s.seriesId}`, s]),
  );
  // `sharedTotals` is accepted for API completeness: stack updates animate
  // each segment's radii toward its own previous radii (the shared scale
  // only rescales when the data set itself changes, which rebuilds the
  // geometry from scratch).
  void input.sharedTotals;
  const segments = current.segments.map((s) => {
    const prev = byKey.get(`${s.categoryIndex}:${s.seriesId}`);
    if (!prev) return s;
    const r0 = prev.rInner + (s.rInner - prev.rInner) * p;
    const r1 = prev.rOuter + (s.rOuter - prev.rOuter) * p;
    return {
      ...s,
      rInner: r0,
      rOuter: r1,
      path: roundedAnnularSector(
        input.cx,
        input.cy,
        r0,
        Math.max(r0 + 0.5, r1),
        s.a0,
        s.a1,
        input.segmentRadius ?? 0,
      ),
    };
  });
  return { ...current, segments };
}

export interface PolarGridInput {
  categories: string[];
  cx: number;
  cy: number;
  R: number;
  rings: number;
  domainMax: number;
  shape: "circle" | "polygon";
  format?: (v: number) => string;
}

/** Shared polar grid: rings, spokes (carry category labels), tick labels. */
export function computePolarGrid(input: PolarGridInput): PolarGrid {
  const { categories, cx, cy, R, rings, domainMax, shape, format } = input;
  const n = categories.length;
  const ringValues = Array.from({ length: rings }, (_, k) =>
    domainMax * ((k + 1) / rings),
  );
  const ringPaths = ringValues.map((_, k) => {
    const r = (R * (k + 1)) / rings;
    if (shape === "circle") {
      return (
        `M${r2(cx - r)},${r2(cy)}` +
        `A${r2(r)} ${r2(r)} 0 1 1 ${r2(cx + r)},${r2(cy)}` +
        `A${r2(r)} ${r2(r)} 0 1 1 ${r2(cx - r)},${r2(cy)}Z`
      );
    }
    let d = "";
    for (let i = 0; i < n; i++) {
      const a = polarAngle(i, n);
      d += `${i === 0 ? "M" : "L"}${r2(cx + r * Math.cos(a))},${r2(cy + r * Math.sin(a))}`;
    }
    return d + "Z";
  });
  const spokes = categories.map((label, i) => {
    const a = polarAngle(i, Math.max(1, n));
    return {
      x1: cx,
      y1: cy,
      x2: cx + R * Math.cos(a),
      y2: cy + R * Math.sin(a),
      label,
      angle: a,
    };
  });
  const tickLabels = ringValues.map((v, k) => ({
    x: cx - 7,
    y: cy - (R * (k + 1)) / rings + 4,
    text: format ? format(v) : String(Math.round(v * 10) / 10),
  }));
  return { cx, cy, R, ringValues, ringPaths, spokes, tickLabels };
}
