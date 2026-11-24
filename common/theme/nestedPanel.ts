import type { SurfaceTone, SurfaceVariant } from "./Theme";

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
