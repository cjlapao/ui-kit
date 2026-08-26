/**
 * Shared grid styling for every chart (cartesian axes, radar rings, polar
 * rings). One resolver, one spec — series and axis features all consume
 * `ChartGridSpec`.
 */

export type GridStyle = "solid" | "dashed" | "dotted";

export interface ChartGridSpec {
  style: GridStyle;
  /** Stroke width in px. */
  width: number;
  /** Multiplier on the (already resolved) grid color. */
  opacity: number;
  /** Resolved stroke color. */
  color: string;
}

export interface GridSpecOptions {
  gridStyle?: GridStyle;
  gridWidth?: number;
  gridOpacity?: number;
  gridColor?: string;
  /** Deprecated alias for gridStyle (cartesian axes kept gridDash). */
  gridDash?: "solid" | "dashed";
}

/**
 * Resolve grid props into a spec. Defaults: solid, 1 px, full opacity,
 * theme grid color.
 */
export function resolveGrid(
  opts: GridSpecOptions = {},
  themeColor: string,
): ChartGridSpec {
  const style: GridStyle =
    opts.gridStyle ?? (opts.gridDash === "dashed" ? "dashed" : "solid");
  return {
    style,
    width: opts.gridWidth ?? 1,
    opacity: opts.gridOpacity ?? 1,
    color: opts.gridColor ?? themeColor,
  };
}

/** SVG dasharray for a grid style (none for solid). */
export function gridDashArray(style: GridStyle): string | undefined {
  if (style === "dashed") return "4 3";
  if (style === "dotted") return "1 3";
  return undefined;
}

/** Canvas line dash for a grid style. */
export function gridLineDash(style: GridStyle): number[] {
  if (style === "dashed") return [4, 3];
  if (style === "dotted") return [1, 3];
  return [];
}
