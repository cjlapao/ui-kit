import type { CSSProperties, HTMLAttributes } from "react";

/** Which lattice to draw: the square's lines, or just its cardinal points. */
export type GridBackgroundPattern = "grid" | "dots";

/** The accepted `pattern` values, literal so docs options derive from the component. */
export const GRID_BACKGROUND_PATTERNS = ["grid", "dots"] as const;

export interface GridBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /** Lattice to draw: crossing lines, or a dot on every crossing. */
  pattern?: GridBackgroundPattern;
  /** Grid spacing in CSS pixels. */
  size?: number;
  /** CSS color of the lines — or of the dots. */
  lineColor?: string;
  /** Dot radius in CSS pixels. Dots pattern only. */
  dotSize?: number;
  /** Grid opacity from 0 to 1. */
  opacity?: number;
  /** Fade the lattice towards the edges. */
  fade?: "none" | "radial" | "vertical";
  /** Percentage of the background that remains solid before fading. */
  fadeStart?: number;
  /** Fill a positioned parent, or use the background as a normal wrapper. */
  position?: "absolute" | "relative";
}

/** Below this a dot stops reading as a point; above half a cell it collides with its neighbour. */
const DOT_MIN_RADIUS = 0.25;
const DOT_DEFAULT_RADIUS = 1;

/**
 * A decorative, reusable lattice background — square grid lines by default, or
 * dots on the lines' cardinal points. Both patterns share one `size` lattice,
 * so switching `pattern` in place keeps every crossing where it was.
 */
export function GridBackground({ pattern = "grid", size = 32, lineColor = "currentColor", dotSize = DOT_DEFAULT_RADIUS, opacity = 0.12, fade = "none", fadeStart = 15, position = "absolute", style, children, ...props }: GridBackgroundProps) {
  const spacing = Number.isFinite(size) && size > 0 ? size : 32;
  const radius = Number.isFinite(dotSize) ? Math.min(Math.max(dotSize, DOT_MIN_RADIUS), spacing / 2) : DOT_DEFAULT_RADIUS;
  const alpha = Number.isFinite(opacity) ? Math.max(0, Math.min(1, opacity)) : 0.12;
  const start = Number.isFinite(fadeStart) ? Math.max(0, Math.min(85, fadeStart)) : 15;
  const edge = (100 - start) / 2;
  const mask = fade === "radial" ? `radial-gradient(ellipse at center, black ${start}%, transparent 100%)` : fade === "vertical" ? `linear-gradient(to bottom, transparent, black ${edge}%, black ${100 - edge}%, transparent)` : undefined;
  // `at 0 0` is what puts a dot on the crossings: each tile draws the quarter
  // of the dot at its origin and the three abutting tiles complete it. The
  // half-pixel ramp to transparent is the anti-alias — a hard stop stair-steps.
  const backgroundImage = pattern === "dots" ? `radial-gradient(circle at 0 0, ${lineColor} ${radius}px, transparent ${radius + 0.5}px)` : `linear-gradient(${lineColor} 1px, transparent 1px), linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`;
  const grid: CSSProperties = { position: "absolute", inset: 0, pointerEvents: "none", opacity: alpha, backgroundImage, backgroundSize: `${spacing}px ${spacing}px`, maskImage: mask, WebkitMaskImage: mask };
  return <div {...props} style={{ position, ...(position === "absolute" ? { inset: 0, pointerEvents: "none" } : {}), ...style }}>
    <div aria-hidden="true" style={grid} />{children}
  </div>;
}

export default GridBackground;
