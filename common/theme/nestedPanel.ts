import type { SurfaceTone, SurfaceVariant } from "./Theme";

export interface NestedPanelSurface {
  variant: SurfaceVariant;
  tone: SurfaceTone;
  depth: number;
  eligible: boolean;
}

const TINTED_VARIANTS: readonly SurfaceVariant[] = ["simple", "tonal", "subtle", "glass", "liquid-glass"];

/** Compute a bounded step from the nearest panel, not the nearest DOM element. */
export function nestedPanelSurface(
  parent: NestedPanelSurface | null,
  variant: SurfaceVariant,
  tone: SurfaceTone,
  eligible: boolean,
): NestedPanelSurface {
  const matches = eligible && TINTED_VARIANTS.includes(variant) && parent?.eligible && parent.variant === variant && parent.tone === tone;
  return { variant, tone, eligible, depth: matches ? Math.min(parent.depth + 1, 3) : 0 };
}

// Static classes keep the treatment visible to Tailwind's scanner.
export const NESTED_PANEL_WASH = [
  "",
  "bg-black/[0.04] dark:bg-white/[0.04]",
  "bg-black/[0.08] dark:bg-white/[0.08]",
  "bg-black/[0.12] dark:bg-white/[0.12]",
] as const;
