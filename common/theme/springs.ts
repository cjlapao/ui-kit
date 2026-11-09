/**
 * The spring curves, tuned by how far they overshoot.
 *
 * The `1.56` in the third position of the default curve is the whole trick:
 * a control point above 1 pushes the interpolated value past its target and
 * settles it back down, which is what reads as elastic. `precise` is the
 * same transition with the overshoot dialled off, for when a control should
 * feel engineered rather than playful.
 */
export const CONTROL_SPRINGS = [
  "bouncy",
  "snappy",
  "gentle",
  "precise",
] as const;
export type ControlSpring =
  (typeof CONTROL_SPRINGS)[number];

/**
 * Exported so any component that moves on the kit's physics rides *this*
 * table — one set of curves for the whole kit, never a copied bezier.
 */
export const CONTROL_SPRING_TOKENS: Record<
  ControlSpring,
  { easing: string; duration: number }
> = {
  // The elastic default: a clear overshoot, then a settle.
  bouncy: { easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", duration: 600 },
  // Short, still overshoots — for toolbars where a 600ms reveal is chatter.
  snappy: { easing: "cubic-bezier(0.22, 1.35, 0.36, 1)", duration: 380 },
  // Long and soft: overshoots less because it has further to travel.
  gentle: { easing: "cubic-bezier(0.34, 1.28, 0.5, 1)", duration: 900 },
  // No overshoot at all — the Material standard curve.
  precise: { easing: "cubic-bezier(0.4, 0, 0.2, 1)", duration: 320 },
};

