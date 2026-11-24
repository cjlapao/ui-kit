import type { SurfacePadding, SurfaceTone, SurfaceVariant } from "./Theme";

export interface NestedPanelSurface {
  variant: SurfaceVariant;
  tone: SurfaceTone;
  depth: number;
  eligible: boolean;
}

const TINTED_VARIANTS: readonly SurfaceVariant[] = ["simple", "tonal", "subtle", "glass", "liquid-glass"];

/**
 * Compute a bounded step from the nearest panel, not the nearest DOM element.
 *
 * `force` is the caller's explicit floor — the Panel's `raisedSurface` ask:
 * "give me at least the first depth step even though no parent earned one".
 * It bypasses the ladder's matching rules (parent identity, the
 * `nestedSurface`/`backgroundColor` eligibility) because the caller is
 * explicitly requesting the step — but only inside the tinted set, and never
 * removes a step the auto ladder already earned: the floor is a `max`.
 */
export function nestedPanelSurface(
  parent: NestedPanelSurface | null,
  variant: SurfaceVariant,
  tone: SurfaceTone,
  eligible: boolean,
  force: boolean = false,
): NestedPanelSurface {
  const tinted = TINTED_VARIANTS.includes(variant);
  const matches = eligible && tinted && parent?.eligible && parent.variant === variant && parent.tone === tone;
  const depth = matches ? Math.min(parent.depth + 1, 3) : 0;
  return { variant, tone, eligible, depth: force && tinted ? Math.max(depth, 1) : depth };
}

// Static classes keep the treatment visible to Tailwind's scanner.
export const NESTED_PANEL_WASH = [
  "",
  "bg-black/[0.04] dark:bg-white/[0.04]",
  "bg-black/[0.08] dark:bg-white/[0.08]",
  "bg-black/[0.12] dark:bg-white/[0.12]",
] as const;

/**
 * The sub-row wash's padding ladder — the tight sibling of the card
 * Panel's generous `SURFACE_PADDING_CLASSES`, for chrome one line tall.
 *
 * The four numbers per step are mechanically tied, which is why they
 * travel as one static table:
 * - bleed (`-mx`/`-my`) = padding, so entries stay pinned at the column's
 *   leading edge while the wash bleeds into the gutter;
 * - column `py` = vertical bleed + 4px — an `xs` IconButton spills 4px
 *   past the 20px actions band and the region clips;
 * - column `pr` = bleed — the region clips, so without a right gutter the
 *   right bleed and its padding cancel and the content sits flush against
 *   the wash's clipped edge;
 * - column `gap` = 2·bleed + 2px — stacked washes keep a constant 2px of
 *   air instead of overlapping as the bleed grows.
 */
export const SUB_ROW_PADDING: Record<SurfacePadding, { row: string; column: string }> = {
  none: { row: "px-0 py-0", column: "gap-0.5 py-1 pr-0" },
  xs: { row: "-mx-1.5 -my-0.5 px-1.5 py-0.5", column: "gap-1.5 py-1.5 pr-1.5" },
  sm: { row: "-mx-2 -my-1 px-2 py-1", column: "gap-2.5 py-2 pr-2" },
  md: { row: "-mx-3 -my-2 px-3 py-2", column: "gap-4.5 py-3 pr-3" },
  lg: { row: "-mx-4 -my-3 px-4 py-3", column: "gap-6.5 py-4 pr-4" },
  xl: { row: "-mx-5 -my-4 px-5 py-4", column: "gap-8.5 py-5 pr-5" },
};
