import type { PlaygroundState } from "../../shared/playground/schema";


/**
 * Facts about the banner that the controls, the preview and the Code view all
 * need to agree on. Nothing here renders — it is the page's copy of what
 * `PanelHero.tsx` actually does, line-referenced.
 */

/** The docs' sample copy. `title` is required (:62), so it always prints. */
export const DEFAULT_TITLE = "Release Canary version";
export const DEFAULT_SUBTITLE = "on: workflow_dispatch";

/** What may sit in the icon slot. `none` draws no chip at all (:166,:196-199). */
export const ICON_CHOICES = ["none", "Rocket", "Warning", "node"] as const;
export type IconChoice = (typeof ICON_CHOICES)[number];
export const DEFAULT_ICON: IconChoice = "Rocket";

/**
 * The four variants the glass props reach. `TRANSLUCENT_SURFACES` is private to
 * the theme (common/theme/Theme.ts:1119-1124) and decides which surfaces wash
 * their copy — the same four whose props `PanelHero` forwards at :292-295.
 */
export const GLASSY = ["glass", "liquid-glass", "default", "simple"] as const;

/** The three glass knobs have no component default at all (:251-254): unset
 *  means "whatever Panel does", which is what the leading option says. */
export const PANEL_DEFAULT = "inherit";

/** The stage's own switches, neither of which is a prop (:52-109 has no word
 *  for the artwork behind the banner or for an ancestor that clips). */
export const BACKDROPS = ["page", "artwork"] as const;
export type Backdrop = (typeof BACKDROPS)[number];

/** The artwork the banner can be laid on, so glass has something to see. */
export const ARTWORK_CLASS =
  "bg-neutral-900 bg-[radial-gradient(circle_at_25%_25%,#f472b6,transparent_55%),radial-gradient(circle_at_75%_75%,#22d3ee,transparent_55%)]";

/** Breathing room around it, so the halo has somewhere to go. */
export const ARTWORK_PAD = "p-5";

/** `overflow-auto` on that wrapper, to prove the halo survives it (:316-318). */
export const CLIP_CLASS = "overflow-auto";

/**
 * The one class list both consumers use — the preview composes it and the Code
 * view hoists it, so the snippet is the stage the reader is looking at.
 */
export const backdropClass = (clipped: boolean): string =>
  [ARTWORK_CLASS, ARTWORK_PAD, clipped ? CLIP_CLASS : ""].filter(Boolean).join(" ");

export const isGradient = (state: PlaygroundState): boolean =>
  String(state.variant ?? "gradient") === "gradient";

export const isSurface = (state: PlaygroundState): boolean => !isGradient(state);

export const isGlassy = (state: PlaygroundState): boolean =>
  (GLASSY as readonly string[]).includes(String(state.variant ?? "gradient"));

/** The icon slot: `none` prints no attribute and mounts no chip. */
export const iconChoice = (state: PlaygroundState): IconChoice =>
  (state.icon as IconChoice) ?? DEFAULT_ICON;

/** Whether the reader is passing actions as children (:56-60,:218). */
export const hasActions = (state: PlaygroundState): boolean =>
  state.actions !== false;

export const textOf = (state: PlaygroundState, id: string): string =>
  String(state[id] ?? "").trim();
