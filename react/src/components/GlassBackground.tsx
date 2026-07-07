import React from "react";
import classNames from "classnames";
import type { TrueColor } from "../theme/Theme";

export type GradientDirection =
  | "t"
  | "tr"
  | "r"
  | "br"
  | "b"
  | "bl"
  | "l"
  | "tl";

export type GlassBackgroundPosition = "fixed" | "absolute";

export interface GlassBackgroundProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  /** Positioning mode.
   *  `"fixed"` (default) — covers the full viewport, always visible.
   *  `"absolute"` — fills a `position: relative` parent (e.g. a PlaygroundSection preview).
   *  Parent must be `relative` when `"absolute"`.
   */
  position?: GlassBackgroundPosition;
  /** Primary theme color driving the gradient (default: "purple"). */
  color?: TrueColor;
  /** Secondary color for the middle gradient stop. Derived from color if omitted. */
  colorSecondary?: TrueColor;
  /** Deep color for the final gradient stop. Derived if omitted. */
  colorDeep?: TrueColor;
  /** Gradient direction (default: "br" → bottom-right). */
  direction?: GradientDirection;
  /** Enable a slow-moving shimmer overlay (default: false). */
  shimmer?: boolean;
  /** Show ambient glow circles behind content (default: true). */
  ambient?: boolean;
}

/**
 * GlassBackground — a fixed, full-viewport gradient background layer
 * with optional ambient glows and shimmer. Renders behind its children
 * so panels, modals, and other surfaces can sit on top.
 */
const GlassBackground: React.FC<GlassBackgroundProps> = ({
  position = "fixed",
  color = "purple",
  colorSecondary,
  colorDeep,
  direction = "br",
  shimmer = false,
  ambient = true,
  className,
  style,
  children,
  ...rest
}) => {
  // Colors are already TrueColor — no resolution needed
  const c = color;
  const s = colorSecondary ?? getFallbackSecondary(color);
  const d = colorDeep ?? getFallbackDeep(color);

  // Map direction codes to CSS gradient angle strings
  const directionArg: Record<GradientDirection, string> = {
    t: "to top",
    tr: "to top right",
    r: "to right",
    br: "to bottom right",
    b: "to bottom",
    bl: "to bottom left",
    l: "to left",
    tl: "to top left",
  };

  // Ambient glow positions
  const glowPositions = [
    { top: "-25%", left: "-25%", size: "w-2/3 h-2/3" },
    { bottom: "-25%", right: "-25%", size: "w-2/3 h-2/3" },
  ];

  return (
    <div
      className={classNames(
        position === "fixed" ? "fixed inset-0 z-0" : "absolute inset-0 z-0",
        className,
      )}
      style={style}
      {...rest}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 transition-colors duration-300 dark:hidden glass-gradient"
        style={{
          "--glass-from": `var(--color-${c}-300)`,
          "--glass-via": `var(--color-${s}-200)`,
          "--glass-to": `var(--color-${d}-50)`,
          "--glass-angle": directionArg[direction],
        } as React.CSSProperties}
      />
      <div
        className="absolute inset-0 hidden transition-colors duration-300 dark:block glass-gradient"
        style={{
          "--glass-from": `var(--color-${c}-700)`,
          "--glass-via": `var(--color-${s}-600)`,
          "--glass-to": `var(--color-${d}-800)`,
          "--glass-angle": directionArg[direction],
        } as React.CSSProperties}
      />

      {/* Ambient glows */}
      {ambient && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {glowPositions.map((pos, idx) => (
            <div
              key={idx}
              className={classNames(
                "absolute rounded-full blur-3xl ambient-pulse",
                pos.size,
                `bg-${c}-400/12 dark:bg-${c}-500/15`,
              )}
              style={pos}
            />
          ))}
        </div>
      )}

      {/* Shimmer overlay */}
      {shimmer && (
        <div
          className={classNames(
            "pointer-events-none absolute inset-0 animate-shimmer",
          )}
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Children on top */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Derive a sensible secondary color based on the primary.
 */
function getFallbackSecondary(color: TrueColor): TrueColor {
  // Color is already TrueColor — no resolution needed
  // Neighboring hues on the color wheel tend to look good
  const neighbors: Record<string, TrueColor> = {
    purple: "blue",
    blue: "indigo",
    indigo: "violet",
    violet: "purple",
    rose: "red",
    emerald: "teal",
    teal: "emerald",
    amber: "orange",
    orange: "amber",
    red: "rose",
    cyan: "sky",
    sky: "cyan",
    lime: "green",
    green: "lime",
    neutral: "zinc",
    zinc: "stone",
    stone: "neutral",
    gray: "zinc",
  };
  return neighbors[color] ?? color;
}

/**
 * Derive a deep color for the final gradient stop.
 */
function getFallbackDeep(color: TrueColor): TrueColor {
  const deepMap: Record<string, TrueColor> = {
    purple: "indigo",
    blue: "violet",
    indigo: "purple",
    violet: "blue",
    rose: "red",
    emerald: "green",
    teal: "cyan",
    amber: "red",
    orange: "amber",
    red: "rose",
    cyan: "blue",
    sky: "indigo",
    lime: "emerald",
    green: "emerald",
    neutral: "stone",
    zinc: "neutral",
    stone: "gray",
    gray: "neutral",
  };
  return deepMap[color] ?? color;
}

export default GlassBackground;