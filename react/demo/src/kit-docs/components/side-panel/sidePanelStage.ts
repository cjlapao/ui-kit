import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * The reading the preview and the Code view share.
 *
 * Every predicate here answers a question the *component* decides (:SidePanel.tsx),
 * not one the page invents — so the panel the stage mounts and the attributes the
 * emitter prints are gated by the same tests, which is the only reason the two can
 * be trusted to say the same thing.
 */

/** The variant the component opens on (:461). */
export const VARIANT_DEFAULT = "outlined";
/** What the surface tone really defaults to (:467) — the JSDoc says `neutral` (:336). */
export const SURFACE_TONE_DEFAULT = "none";
/** `tone ?? color ?? "neutral"` (:494). */
export const TONE_DEFAULT = "neutral";
export const SIZE_DEFAULT = "md";
/** `DEFAULT_SURFACE_CORNER` (:474 → common/theme/Theme.ts:1531). */
export const CORNER_DEFAULT = "rounded-md";
export const WIDTH_DEFAULT = 420;
export const HEIGHT_DEFAULT = 240;
export const MIN_WIDTH_DEFAULT = 280;
export const MAX_WIDTH_DEFAULT = 900;
/** The collapsed rail's width, shared with the workflow rail (:709 → Theme.ts:1545). */
export const RAIL_WIDTH = 56;
/** `inset` is derived from the variant when omitted (:513). */
export const INSET_AUTO = "auto";

/** Names the component still accepts, each resolved to a current surface (:45-50). */
export const LEGACY_VARIANTS: Record<string, string> = {
  sidebar: "elevated",
  inset: "tonal",
  floating: "elevated",
  "floating-glass": "glass",
};

const textOf = (state: PlaygroundState, id: string): string =>
  state[id] === undefined || state[id] === null ? "" : String(state[id]).trim();

export const hasText = (state: PlaygroundState, id: string): boolean =>
  textOf(state, id).length > 0;

export const textValue = (state: PlaygroundState, id: string): string =>
  textOf(state, id);

export const flag = (state: PlaygroundState, id: string): boolean =>
  state[id] === true;

export const sideOf = (state: PlaygroundState): string =>
  String(state.side ?? "right");

/** Top/bottom panels live on the height axis (:493). */
export const isVertical = (state: PlaygroundState): boolean =>
  sideOf(state) === "top" || sideOf(state) === "bottom";

export const variantOf = (state: PlaygroundState): string =>
  String(state.variant ?? VARIANT_DEFAULT);

/** A legacy name is an alias, not a surface: it is resolved before it paints (:497). */
export const isLegacy = (state: PlaygroundState): boolean =>
  variantOf(state) in LEGACY_VARIANTS;

export const resolvedVariant = (state: PlaygroundState): string =>
  LEGACY_VARIANTS[variantOf(state)] ?? variantOf(state);

/** The glass knobs only reach the surfaces that have a glass layer. */
export const isGlassy = (state: PlaygroundState): boolean => {
  const resolved = resolvedVariant(state);
  return resolved === "glass" || resolved === "liquid-glass";
};

/** `inset` follows the variant unless the reader pins it (:513). */
export const isInset = (state: PlaygroundState): boolean => {
  const chosen = String(state.inset ?? INSET_AUTO);
  if (chosen !== INSET_AUTO) return chosen !== "none";
  // SideMenu's `offset` is what marks a detached variant; `floating` and
  // `floating-glass` are the ones that carry one (:506-509, Theme.ts:2389).
  return variantOf(state) === "floating" || variantOf(state) === "floating-glass";
};

export const isCollapsible = (state: PlaygroundState): boolean =>
  flag(state, "collapsible");

/** `collapsed` is meaningless unless the panel may collapse (:702). */
export const collapseChoice = (state: PlaygroundState): string =>
  isCollapsible(state) ? String(state.collapse ?? "self") : "self";

export const isCollapsed = (state: PlaygroundState): boolean =>
  collapseChoice(state) === "collapsed";

export const isResizable = (state: PlaygroundState): boolean =>
  flag(state, "resizable");

/** A docked panel is in flow, which is also why it never gets a scrim (:1162). */
export const isDocked = (state: PlaygroundState): boolean => flag(state, "docked");

export const usesOverlay = (state: PlaygroundState): boolean =>
  !isDocked(state) && flag(state, "overlay");

/** The close button needs `onClose` *and* the absence of `collapsible` (:1080). */
export const showsCloseButton = (state: PlaygroundState): boolean =>
  flag(state, "closable") && !isCollapsible(state);

/** With no `onClose`, the scrim is a click that goes nowhere (:1165). */
export const scrimIsDecorative = (state: PlaygroundState): boolean =>
  usesOverlay(state) && !flag(state, "closable");

/**
 * `width` is the whole story unresized and only a seed once the handle exists:
 * resizing keeps its number in local state, which no callback ever reports
 * (:697-698,:656-665).
 */
export const widthOf = (state: PlaygroundState): number =>
  Math.max(1, Math.round(Number(state.width ?? WIDTH_DEFAULT)) || WIDTH_DEFAULT);

export const heightOf = (state: PlaygroundState): number =>
  Math.max(1, Math.round(Number(state.height ?? HEIGHT_DEFAULT)) || HEIGHT_DEFAULT);

export const minOf = (state: PlaygroundState): number =>
  Math.max(0, Math.round(Number(state.minWidth ?? MIN_WIDTH_DEFAULT)) || 0);

export const maxOf = (state: PlaygroundState): number =>
  Math.max(0, Math.round(Number(state.maxWidth ?? MAX_WIDTH_DEFAULT)) || 0);

/** The reader has pushed the size outside the bounds the handle would allow. */
export const sizeEscapesBounds = (state: PlaygroundState): boolean => {
  if (!isResizable(state)) return false;
  const size = isVertical(state) ? heightOf(state) : widthOf(state);
  return size < minOf(state) || size > maxOf(state);
};

/** The host has to be shown the state it owns: the panel is a controlled thing. */
export const needsHostState = (state: PlaygroundState): boolean =>
  flag(state, "closable") || (isCollapsible(state) && flag(state, "collapseReport"));
