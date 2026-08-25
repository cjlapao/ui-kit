/**
 * Named dash patterns (SVG stroke-dasharray units in px).
 */
export const DASH_PATTERNS: Record<"dashed" | "dotted", number[]> = {
  dashed: [6, 4],
  dotted: [2, 4],
};

export function getDashPattern(style: "dashed" | "dotted"): number[] {
  return DASH_PATTERNS[style];
}
