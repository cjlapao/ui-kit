/**
 * Shared area-fill painting for area-capable series (line with fill,
 * range area). One spec (`ChartAreaFill`) drives both renderers:
 *
 * - SVG: an `<linearGradient>` def (gradient style) or a plain fill with
 *   `fill-opacity` (flat style).
 * - Canvas: a `createLinearGradient` (gradient style) or a solid color +
 *   `globalAlpha` (flat style).
 *
 * Gradient geometry spans the whole plot area (userSpaceOnUse) so every
 * series in the chart fades in sync, matching the reference look.
 */
import React from "react";
import type { ChartAreaFill } from "../../engine/types";

export interface AreaFillContext {
  /** Plot area (px). */
  area: { x: number; y: number; width: number; height: number };
}

/** Resolve a descriptor's raw fill props into a concrete spec. */
export function resolveAreaFill(
  raw: {
    fillStyle?: "flat" | "gradient";
    fillColor?: string;
    fillOpacity?: number;
    fillDirection?: "vertical" | "horizontal";
  },
  seriesColor: string,
): ChartAreaFill {
  return {
    style: raw.fillStyle ?? "flat",
    color: raw.fillColor ?? seriesColor,
    opacity: raw.fillOpacity ?? 0,
    direction: raw.fillDirection ?? "vertical",
  };
}

/**
 * The SVG `<linearGradient>` def for a gradient fill. Returns null for the
 * flat style (plain fill + fill-opacity is used instead).
 */
export const AreaFillGradientDef: React.FC<{
  id: string;
  spec: ChartAreaFill;
  ctx: AreaFillContext;
}> = ({ id, spec, ctx }) => {
  const { area } = ctx;
  const vertical = spec.direction === "vertical";
  return (
    <linearGradient
      id={id}
      x1={vertical ? 0 : area.x}
      y1={vertical ? area.y : 0}
      x2={vertical ? 0 : area.x + area.width}
      y2={vertical ? area.y + area.height : 0}
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stopColor={spec.color} stopOpacity={spec.opacity} />
      <stop offset="1" stopColor={spec.color} stopOpacity={0} />
    </linearGradient>
  );
};

/**
 * Canvas fill for a spec: a gradient (gradient style) or a solid color
 * (flat style — the caller sets `globalAlpha` to `spec.opacity` first).
 */
export function canvasAreaFill(
  c: CanvasRenderingContext2D,
  spec: ChartAreaFill,
  ctx: AreaFillContext,
): string | CanvasGradient {
  if (spec.style === "gradient") {
    const { area } = ctx;
    const color = spec.color ?? "#000000";
    if (spec.direction === "vertical") {
      const g = c.createLinearGradient(0, area.y, 0, area.y + area.height);
      g.addColorStop(0, hexWithAlpha(color, spec.opacity));
      g.addColorStop(1, hexWithAlpha(color, 0));
      return g;
    }
    const g = c.createLinearGradient(area.x, 0, area.x + area.width, 0);
    g.addColorStop(0, hexWithAlpha(color, spec.opacity));
    g.addColorStop(1, hexWithAlpha(color, 0));
    return g;
  }
  return spec.color ?? "#000000";
}

/** CSS color (hex or any name) with an alpha channel, for canvas stops. */
export function hexWithAlpha(color: string, alpha: number): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  if (!m) return color;
  const [r, g, b] = [1, 2, 3].map((i) => parseInt(m[i], 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
