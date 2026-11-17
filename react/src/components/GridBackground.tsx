import type { CSSProperties, HTMLAttributes } from "react";

export interface GridBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /** Grid spacing in CSS pixels. */
  size?: number;
  /** CSS color for grid lines. */
  lineColor?: string;
  /** Grid opacity from 0 to 1. */
  opacity?: number;
  /** Fade grid lines towards the edges. */
  fade?: "none" | "radial" | "vertical";
  /** Percentage of the background that remains solid before fading. */
  fadeStart?: number;
  /** Fill a positioned parent, or use the background as a normal wrapper. */
  position?: "absolute" | "relative";
}

/** A decorative, reusable grid background. */
export function GridBackground({ size = 32, lineColor = "currentColor", opacity = 0.12, fade = "none", fadeStart = 15, position = "absolute", style, children, ...props }: GridBackgroundProps) {
  const spacing = Number.isFinite(size) && size > 0 ? size : 32;
  const alpha = Number.isFinite(opacity) ? Math.max(0, Math.min(1, opacity)) : 0.12;
  const start = Number.isFinite(fadeStart) ? Math.max(0, Math.min(85, fadeStart)) : 15;
  const edge = (100 - start) / 2;
  const mask = fade === "radial" ? `radial-gradient(ellipse at center, black ${start}%, transparent 100%)` : fade === "vertical" ? `linear-gradient(to bottom, transparent, black ${edge}%, black ${100 - edge}%, transparent)` : undefined;
  const grid: CSSProperties = { position: "absolute", inset: 0, pointerEvents: "none", opacity: alpha, backgroundImage: `linear-gradient(${lineColor} 1px, transparent 1px), linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`, backgroundSize: `${spacing}px ${spacing}px`, maskImage: mask, WebkitMaskImage: mask };
  return <div {...props} style={{ position, ...(position === "absolute" ? { inset: 0, pointerEvents: "none" } : {}), ...style }}>
    <div aria-hidden="true" style={grid} />{children}
  </div>;
}

export default GridBackground;
