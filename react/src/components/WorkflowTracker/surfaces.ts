import { getSurfaceTextTokens } from "../../theme/Theme";
import type { TrueColor } from "../../theme/Theme";
import type { WorkflowTrackerVariant } from "./types";

/**
 * Inside a see-through card, an opaque inner surface reads as a hole punched
 * in the glass, so every internal surface switches to a translucent token set.
 *
 * The list of which variants those are lives in the theme — this used to keep
 * its own copy, which is why it never picked up `simple` when that variant was
 * reclassified as see-through.
 */
export const isTranslucentVariant = (
  variant: WorkflowTrackerVariant,
): boolean => getSurfaceTextTokens(variant).translucent;

export interface WorkflowSurfaceTokens {
  translucent: boolean;
  /** Hairline between sections (progress header, legend, sub-step strip). */
  border: string;
  /** Hairlines between sub-step rows. */
  divider: string;
  /** The SUB-STEPS header band. */
  strip: string;
  /** The nested sub-step box in the rail. */
  nestedBox: string;
  /** Interior of a hollow status node — it has to mask the connector line. */
  nodeFill: string;
  /** The LIVE chip. It sits over the raw backdrop, not over a card. */
  chip: string;
  /** Tiny uppercase labels — PROGRESS, STEP n OF N, OWNER, SUB-STEPS. */
  faintText: string;
  /** Secondary lines — step meta, tally labels, counters, durations. */
  mutedText: string;
}

const SOLID: WorkflowSurfaceTokens = {
  translucent: false,
  border: "border-neutral-200 dark:border-neutral-800",
  divider: "divide-neutral-200 dark:divide-neutral-800",
  strip: "bg-neutral-50 dark:bg-white/5",
  nestedBox:
    "border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-white/5",
  nodeFill: "bg-white dark:bg-neutral-900",
  chip: "bg-white dark:bg-neutral-900",
  faintText: "text-neutral-400 dark:text-neutral-500",
  mutedText: "text-neutral-500 dark:text-neutral-400",
};

const TRANSLUCENT: WorkflowSurfaceTokens = {
  translucent: true,
  border: "border-white/30 dark:border-white/10",
  divider: "divide-white/25 dark:divide-white/10",
  strip: "bg-white/20 dark:bg-white/5",
  nestedBox:
    "border border-white/30 bg-white/20 dark:border-white/10 dark:bg-white/5",
  // Kept partly opaque: fully transparent and the connector shows through.
  nodeFill: "bg-white/60 dark:bg-neutral-900/50",
  // Denser than the other surfaces — the chip sits on the bare backdrop.
  chip: "bg-white/70 dark:bg-neutral-900/60",
  // Two steps darker than the solid set: over a glass fill the light neutral
  // scale drops below AA, which is what the kit's a11y guard warns about.
  faintText: "text-neutral-600 dark:text-neutral-200",
  mutedText: "text-neutral-700 dark:text-neutral-100",
};

export const getSurfaceTokens = (translucent: boolean): WorkflowSurfaceTokens =>
  translucent ? TRANSLUCENT : SOLID;

/**
 * Background for the actively-running sub-step row. Solid cards get a flat
 * accent tint; glass cards get a translucent one so the backdrop still reads.
 */
export const getRowHighlight = (
  accent: TrueColor,
  translucent: boolean,
): string =>
  translucent
    ? `bg-${accent}-50/50 dark:bg-${accent}-500/15`
    : `bg-${accent}-50 dark:bg-white/5`;
