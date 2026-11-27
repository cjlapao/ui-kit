import type { CSSProperties, HTMLAttributes } from "react";
import "./GridBackground.css";

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
  /** Animate a subtle wave over the dots. Respects reduced-motion preferences. */
  shimmer?: boolean;
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
export function GridBackground({ pattern = "grid", size = 32, lineColor = "currentColor", dotSize = DOT_DEFAULT_RADIUS, shimmer = false, opacity = 0.12, fade = "none", fadeStart = 15, position = "absolute", style, children, ...props }: GridBackgroundProps) {
  const spacing = Number.isFinite(size) && size > 0 ? size : 32;
  const radius = Number.isFinite(dotSize) ? Math.min(Math.max(dotSize, DOT_MIN_RADIUS), spacing / 2) : DOT_DEFAULT_RADIUS;
  const alpha = Number.isFinite(opacity) ? Math.max(0, Math.min(1, opacity)) : 0.12;
  const start = Number.isFinite(fadeStart) ? Math.max(0, Math.min(85, fadeStart)) : 15;
  const edge = (100 - start) / 2;
  const mask = fade === "radial" ? `radial-gradient(ellipse at center, black ${start}%, transparent 100%)` : fade === "vertical" ? `linear-gradient(to bottom, transparent, black ${edge}%, black ${100 - edge}%, transparent)` : undefined;
  // Center the entire dot in its tile; offset the tiles by half a cell so the
  // dots still land on grid crossings. The half-pixel ramp softens their edges.
  const backgroundImage = pattern === "dots" ? `radial-gradient(circle at center, ${lineColor} ${radius}px, transparent ${radius + 0.5}px)` : `linear-gradient(${lineColor} 1px, transparent 1px), linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`;
  const backgroundPosition = pattern === "dots" ? `${-spacing / 2}px ${-spacing / 2}px` : undefined;
  const shimmering = shimmer && pattern === "dots";
  const grid: CSSProperties = { position: "absolute", inset: 0, pointerEvents: "none", opacity: shimmering ? undefined : alpha, backgroundImage, backgroundPosition, backgroundSize: `${spacing}px ${spacing}px`, maskImage: mask, WebkitMaskImage: mask, ...(shimmering ? { "--cj-grid-opacity": alpha } as CSSProperties : {}) };
  return <div {...props} style={{ position, ...(position === "absolute" ? { inset: 0, pointerEvents: "none" } : {}), ...style }}>
    <div aria-hidden="true" className={shimmering ? "cj-grid-background-shimmer-base" : undefined} style={grid} />
    {shimmering && <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: Math.min(1, alpha * 4), maskImage: mask, WebkitMaskImage: mask }}>
      <div className="cj-grid-background-shimmer" style={{ backgroundImage, backgroundPosition, backgroundSize: `${spacing}px ${spacing}px` }} />
    </div>}{children}
  </div>;
}

export default GridBackground;
