import { getSurfaceTextTokens } from "../theme/Theme";
import type { SurfaceVariant } from "../theme/Theme";
import type {
  ConnectionFlowNode,
  ConnectionFlowProgressType,
} from "./types";

/**
 * The frame around the graph: an eyebrow, an icon, a title, a tag and the
 * flow's own progress, sitting above a scrolling canvas.
 *
 * Everything the header *decides* lives here rather than in either renderer.
 * The two kits draw the same block, and every divergence in this component so
 * far has come from letting each of them work something out for itself.
 */

export interface HeaderSurface {
  translucent: boolean;
  /** Hairline between the header and the graph. */
  divider: string;
  /** The tiny uppercase line above the title. */
  eyebrow: string;
  /** Subtitle, and the caption beside the progress bar. */
  muted: string;
  /** Fill behind the icon chip. */
  chip: string;
}

const SOLID: HeaderSurface = {
  translucent: false,
  divider: "border-neutral-200 dark:border-neutral-800",
  eyebrow: "text-neutral-400 dark:text-neutral-500",
  muted: "text-neutral-500 dark:text-neutral-400",
  chip: "bg-neutral-100 dark:bg-white/10",
};

/**
 * Inside a see-through card an opaque inner surface reads as a hole punched in
 * the glass, so every internal surface switches to a translucent token set —
 * and the copy steps two shades darker, because over a glass fill the light
 * neutral scale drops below AA.
 */
const TRANSLUCENT: HeaderSurface = {
  translucent: true,
  divider: "border-white/30 dark:border-white/10",
  eyebrow: "text-neutral-600 dark:text-neutral-200",
  muted: "text-neutral-700 dark:text-neutral-100",
  chip: "bg-white/40 dark:bg-white/10",
};

export const getHeaderSurface = (variant: SurfaceVariant): HeaderSurface =>
  getSurfaceTextTokens(variant).translucent ? TRANSLUCENT : SOLID;

/** What occupies the header's icon slot right now. */
export type HeaderGlyph =
  | { kind: "spinner"; value: number }
  | { kind: "icon" }
  | { kind: "none" };

/**
 * A spinner takes the icon's place while the flow is running and gives it back
 * at 100% — the same rule an item's glyph follows, so the two read as one
 * idea rather than two similar ones.
 */
export const headerGlyph = (
  hasIcon: boolean,
  progressType: ConnectionFlowProgressType,
  progress: number | undefined,
): HeaderGlyph => {
  if (progressType === "spinner" && progress !== undefined && progress < 1) {
    return { kind: "spinner", value: progress };
  }
  return hasIcon ? { kind: "icon" } : { kind: "none" };
};

/**
 * Whether the slot is held open. Reserved for a spinner even with no icon
 * behind it, so the title does not step sideways the moment the flow finishes.
 */
export const headerReservesGlyph = (
  hasIcon: boolean,
  progressType: ConnectionFlowProgressType,
): boolean => hasIcon || progressType === "spinner";

/**
 * A node's completion: its own if it declares one, else the mean of whatever
 * its items report. A card built from items has no `progress` of its own, and
 * before this it simply did not count towards the flow's total.
 */
export const nodeProgress = (node: ConnectionFlowNode): number | undefined => {
  if (typeof node.progress === "number") return node.progress;
  const values = (node.items ?? [])
    .map((item) => item.progress)
    .filter((value): value is number => typeof value === "number");
  if (values.length === 0) return undefined;
  return values.reduce((a, b) => a + b, 0) / values.length;
};

/**
 * The flow's completion, 0–1.
 *
 * The mean of the nodes that report one, unless the caller states it outright
 * — which it usually should: a pipeline knows its own progress better than the
 * average of its cards does.
 */
export const flowProgress = (
  nodes: ConnectionFlowNode[],
  override?: number,
): number | undefined => {
  if (typeof override === "number") {
    return Math.min(1, Math.max(0, override));
  }
  const values = nodes
    .map(nodeProgress)
    .filter((value): value is number => typeof value === "number");
  if (values.length === 0) return undefined;
  return values.reduce((a, b) => a + b, 0) / values.length;
};
