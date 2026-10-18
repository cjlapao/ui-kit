import type { TooltipPosition } from "./placement";

/**
 * How the tooltip is painted.
 *
 * `surface` follows the theme — a light card in light mode, a dark one in dark
 * mode. `inverted` contrasts against the page instead, which is the classic
 * tooltip convention.
 *
 * The component used to be `bg-neutral-900 … dark:bg-neutral-700`: dark in
 * *both* themes, with no light appearance at all.
 */
export const TOOLTIP_VARIANTS = ["surface", "inverted"] as const;
export type TooltipVariant = (typeof TOOLTIP_VARIANTS)[number];

export interface TooltipVariantTokens {
  /** Classes for the tooltip box, including its border. */
  box: string;
  /**
   * Classes for the arrow. It is a rotated square sharing the box's fill and
   * border, not a CSS-triangle: a triangle built from `border-*-<colour>` has
   * no outline of its own, so on the light `surface` variant it was a white
   * shape on a white page — invisible, which is exactly how it was reported.
   */
  arrow: string;
}

/**
 * Solid borders rather than a translucent `ring`, so the arrow's border can be
 * the *same* colour as the box's. A translucent edge composites differently
 * over the page than over the box fill, and the join would not line up.
 */
const TOKENS: Record<TooltipVariant, TooltipVariantTokens> = {
  surface: {
    box: [
      "bg-white text-neutral-900 border border-neutral-200 shadow-lg",
      "dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700",
    ].join(" "),
    arrow: [
      "bg-white border-neutral-200",
      "dark:bg-neutral-800 dark:border-neutral-700",
    ].join(" "),
  },
  inverted: {
    box: [
      "bg-neutral-900 text-white border border-neutral-900 shadow-lg",
      "dark:bg-white dark:text-neutral-900 dark:border-white",
    ].join(" "),
    // Border matches the fill: the inverted look has no visible outline, and
    // the arrow must not sprout one.
    arrow: ["bg-neutral-900 border-neutral-900", "dark:bg-white dark:border-white"].join(
      " ",
    ),
  },
};

export const getTooltipVariantTokens = (
  variant: TooltipVariant,
): TooltipVariantTokens => TOKENS[variant] ?? TOKENS.surface;

/**
 * Which box edge the arrow's centre sits on. `top` means the tooltip is above
 * the trigger, so the arrow hangs off its bottom edge.
 */
export const TOOLTIP_ARROW_EDGE: Record<TooltipPosition, string> = {
  top: "top-full",
  bottom: "top-0",
  left: "left-full",
  right: "left-0",
};

/**
 * Which two edges of the (unrotated) square keep their border.
 *
 * The square is rotated 45°, so its original edges face diagonally: a vector
 * pointing right becomes down-right, and one pointing down becomes down-left.
 * Only the two faces pointing *away* from the box are outlined — the two
 * facing into it share the box's fill and vanish into it, which is what makes
 * the arrow read as part of the bubble rather than a diamond stuck to it.
 */
export const TOOLTIP_ARROW_BORDER: Record<TooltipPosition, string> = {
  top: "border-b border-r",
  bottom: "border-t border-l",
  left: "border-t border-r",
  right: "border-b border-l",
};
