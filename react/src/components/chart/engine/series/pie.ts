/**
 * Pie / donut geometry via d3-shape.
 *
 * d3 angle convention: 0 rad = 12 o'clock, increasing clockwise; a point at
 * angle a is (cx + r·sin a, cy − r·cos a). Pop-out offsets follow the same
 * convention.
 */
import { arc, pie } from "d3-shape";
import type { PieGeometry, PieSlice } from "../types";

export interface PieSeriesInput {
  items: { value: number; item: unknown }[];
  /** 0 = pie, 0–1 ratio of the outer radius = donut. */
  innerRadiusRatio: number;
  /** Start angle in radians (d3 convention). Default 0 (12 o'clock). */
  startAngle?: number;
  /** Sweep in radians. Default 2π (full circle). */
  sweepAngle?: number;
  cx: number;
  cy: number;
  outerRadius: number;
}

const POP_OUT_PX = 4;

export function computePieGeometry(input: PieSeriesInput): PieGeometry {
  const { items, innerRadiusRatio, cx, cy, outerRadius } = input;
  const startAngle = input.startAngle ?? 0;
  const sweepAngle = input.sweepAngle ?? Math.PI * 2;
  const innerRadius = Math.max(0, outerRadius * Math.min(1, innerRadiusRatio));

  const total = items.reduce((acc, d) => acc + (Number.isFinite(d.value) ? d.value : 0), 0);

  if (total <= 0) {
    return { slices: [], total: 0, cx, cy, outerRadius, innerRadius };
  }

  // d3 pie with sort disabled — data order is the slice order.
  const arcs = pie<{ value: number }>()
    .value((d) => d.value)
    .sort(null)
    .startAngle(startAngle)
    .endAngle(startAngle + sweepAngle)(
    items.map((d) => ({ value: d.value })),
  );

  const arcGen = arc<{ value: number }>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(0);

  const slices: PieSlice[] = arcs.map((a, index) => {
    const mid = (a.startAngle + a.endAngle) / 2;
    return {
      index,
      item: items[index]?.item ?? null,
      value: items[index]?.value ?? 0,
      startAngle: a.startAngle,
      endAngle: a.endAngle,
      path: arcGen(a) ?? "",
      labelAngle: mid,
      popOffset: {
        dx: Math.sin(mid) * POP_OUT_PX,
        dy: -Math.cos(mid) * POP_OUT_PX,
      },
    };
  });

  return { slices, total, cx, cy, outerRadius, innerRadius };
}

/**
 * Point on the (label) radius at a slice's mid angle — for data labels and
 * leader lines.
 */
export function pieLabelPoint(
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
