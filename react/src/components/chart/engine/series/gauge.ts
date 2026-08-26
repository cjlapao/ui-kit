/**
 * Gauge geometry — a single value plotted on an arc track.
 *
 * d3 angle convention (same as pie): 0 rad = 12 o'clock, increasing
 * clockwise. The gauge's value maps to an angle across `arcSpan`; zones in
 * value space are subdivided into small arc segments so discrete bands and
 * smooth color ramps share one code path (SVG and canvas).
 */

export interface GaugeZone {
  from: number;
  to: number;
  color: string;
}

export interface GaugeZoneSegment {
  /** Angle in radians (d3 convention). */
  startAngle: number;
  endAngle: number;
  color: string;
}

export interface GaugeTicks {
  count?: number;
  /** Every Nth tick is a major (longer) tick. Default 5. */
  majorEvery?: number;
  /** Tick length in px outside the arc. Default 8. */
  length?: number;
}

export interface GaugeGeometryInput {
  value: number;
  min: number;
  max: number;
  /** Sweep in radians. Default 1.5·2π (270°). */
  arcSpan?: number;
  /** Start angle in radians (d3 convention). Default: gap centered at 6 o'clock. */
  startAngle?: number;
  /** Donut cutout as a 0–1 ratio of the outer radius. Default 0.78. */
  innerRadiusRatio?: number;
  zones?: GaugeZone[];
  ticks?: GaugeTicks;
  /** Marker value (drawn on the arc when provided). */
  targetValue?: number;
  cx: number;
  cy: number;
  outerRadius: number;
}

export interface GaugeGeometry {
  cx: number;
  cy: number;
  outerRadius: number;
  innerRadius: number;
  startAngle: number;
  arcSpan: number;
  /** Angle (radians) at the current value. */
  valueAngle: number;
  valueFraction: number;
  /** Value-space → angle across the span. */
  angleFor: (v: number) => number;
  /** Colored value-arc segments (the fill), in angle order. */
  fillSegments: GaugeZoneSegment[];
  /** Track segments for the remaining span (empty part of the gauge). */
  trackSegment: GaugeZoneSegment | null;
  /** Tick marks across the full span. */
  ticks: { angle: number; major: boolean }[];
  target: {
    angle: number;
    x: number;
    y: number;
    outerX: number;
    outerY: number;
    labelX: number;
    labelY: number;
  } | null;
}

export const GAUGE_ZONE_SUBDIVISIONS = 16;

/** Linear interpolation of two hex colors. */
export function lerpColor(a: string, b: string, t: number): string {
  const pa = hex(a);
  const pb = hex(b);
  const c = pa.map((av, i) => Math.round(av + (pb[i] - av) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function hex(color: string): [number, number, number] {
  let h = color.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((ch) => ch + ch)
      .join("");
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return [200, 200, 200];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Point at `radius` and `angle` (d3 convention, y-down screen space). */
export function gaugePoint(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
): { x: number; y: number } {
  return {
    x: cx + radius * Math.sin(angle),
    y: cy - radius * Math.cos(angle),
  };
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function computeGaugeGeometry(input: GaugeGeometryInput): GaugeGeometry {
  const { cx, cy } = input;
  const outerRadius = Math.max(10, input.outerRadius);
  const innerRadius = Math.max(
    0,
    outerRadius * Math.min(1, input.innerRadiusRatio ?? 0.78),
  );
  const arcSpan = Math.max(0.05, Math.min(Math.PI * 2, input.arcSpan ?? 1.5 * Math.PI));
  // Default: the gap is centered at 6 o'clock (π in d3 convention).
  const startAngle =
    input.startAngle ?? Math.PI + (Math.PI * 2 - arcSpan) / 2;

  const min = input.min;
  const max = input.max;
  const span = max - min;
  const ok = Number.isFinite(min) && Number.isFinite(max) && span > 0;
  const value = ok
    ? Math.max(min, Math.min(max, Number.isFinite(input.value) ? input.value : min))
    : min;
  const valueFraction = ok ? clamp01((value - min) / span) : 0;
  const valueAngle = startAngle + arcSpan * valueFraction;
  const angleFor = (v: number) =>
    ok ? startAngle + arcSpan * clamp01((v - min) / span) : startAngle;

  // ── Zones → subdivided colored segments across the FULL span ────────────
  const fallbackColor = "#e5e7eb";
  const zones = (input.zones ?? [])
    .filter((z) => Number.isFinite(z.from) && Number.isFinite(z.to) && z.to > z.from)
    .map((z) => ({
      from: Math.max(min, z.from),
      to: Math.min(max, z.to),
      color: z.color,
    }))
    .filter((z) => z.to > z.from)
    .sort((a, b) => a.from - b.from);

  // Build value-space coverage: zones + gaps in the fallback color.
  const coverage: { from: number; to: number; color: string }[] = [];
  let cursor = min;
  for (const z of zones) {
    if (z.from > cursor) {
      coverage.push({ from: cursor, to: z.from, color: fallbackColor });
    }
    coverage.push({ from: z.from, to: z.to, color: z.color });
    cursor = Math.max(cursor, z.to);
  }
  if (cursor < max) coverage.push({ from: cursor, to: max, color: fallbackColor });
  if (coverage.length === 0) coverage.push({ from: min, to: max, color: fallbackColor });

  // Interpolate across boundaries: each coverage run is subdivided and its
  // first/last sub-segments lerp toward the neighboring zone's color, so
  // narrow zones read as smooth ramps and wide single-color zones stay flat.
  const fillSegments: GaugeZoneSegment[] = [];
  coverage.forEach((run, ri) => {
    const isFallback = run.color === fallbackColor;
    const prevColor =
      ri > 0 && coverage[ri - 1].color !== fallbackColor
        ? coverage[ri - 1].color
        : null;
    const nextColor =
      ri < coverage.length - 1 &&
      coverage[ri + 1].color !== fallbackColor
        ? coverage[ri + 1].color
        : null;
    const n = GAUGE_ZONE_SUBDIVISIONS;
    for (let i = 0; i < n; i++) {
      const vA = run.from + ((run.to - run.from) * i) / n;
      const vB = run.from + ((run.to - run.from) * (i + 1)) / n;
      let color = run.color;
      // Blend only at zone-to-zone boundaries (fallback spans stay flat).
      if (!isFallback && nextColor !== null) {
        color = lerpColor(run.color, nextColor, 1 - (i + 1) / n);
      } else if (!isFallback && prevColor !== null) {
        color = lerpColor(prevColor, run.color, i / n);
      }
      fillSegments.push({
        startAngle: angleFor(vA),
        endAngle: angleFor(vB),
        color,
      });
    }
  });

  const trackSegment: GaugeZoneSegment | null =
    valueFraction >= 1
      ? null
      : {
          startAngle: valueAngle,
          endAngle: startAngle + arcSpan,
          color: fallbackColor,
        };

  // ── Ticks ────────────────────────────────────────────────────────────────
  const ticks: { angle: number; major: boolean }[] = [];
  if (ok) {
    const tickCount = input.ticks
      ? Math.max(1, Math.floor(input.ticks.count ?? 20))
      : 0;
    const majorEvery = input.ticks?.majorEvery ?? 5;
    for (let i = 0; tickCount > 0 && i <= tickCount; i++) {
      const f = i / tickCount;
      ticks.push({
        angle: startAngle + arcSpan * f,
        major: i % majorEvery === 0,
      });
    }
  }

  // ── Target marker ────────────────────────────────────────────────────────
  let target: GaugeGeometry["target"] = null;
  if (ok && input.targetValue !== undefined) {
    const a = angleFor(input.targetValue);
    const mid = gaugePoint(cx, cy, (innerRadius + outerRadius) / 2, a);
    const outer = gaugePoint(cx, cy, outerRadius + 4, a);
    const label = gaugePoint(cx, cy, outerRadius + 24, a);
    target = { angle: a, x: mid.x, y: mid.y, outerX: outer.x, outerY: outer.y, labelX: label.x, labelY: label.y };
  }

  return {
    cx,
    cy,
    outerRadius,
    innerRadius,
    startAngle,
    arcSpan,
    valueAngle,
    valueFraction,
    angleFor,
    fillSegments,
    trackSegment,
    ticks,
    target,
  };
}
