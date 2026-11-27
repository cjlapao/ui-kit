import type { ReactElement } from "react";
import type { PlaygroundState } from "../../shared/playground/schema";
import { END, EXTRA, SEARCH, START } from "./toolbarFixture";

/**
 * What the controls, the preview and the Code view all have to agree on — this
 * page's reading of `Toolbar.tsx`, line-referenced. Nothing here renders.
 */

/** What `Toolbar.tsx:94` destructures, spelled here so the two cannot drift. */
const DEFAULT_SURFACE_TONE = "none";

/** The bar's own name in the preview; a real bar says which bar it is. */
export const DEFAULT_ARIA_LABEL = "Preview toolbar";

/** The one variant with vibrancy and a glass fill to speak of (:130-137). */
export const LIQUID = "liquid-glass";

/**
 * The two variants whose chrome carries no tint, so `tone` cannot be seen:
 * `elevated` returns its shadow alone (:141-143) and `default` its rim
 * (:126-127). Every other branch reads `palette` (:103) somewhere.
 */
const UNTINTED = ["elevated", "default"];

const variantOf = (state: PlaygroundState): string =>
  String(state.variant ?? "elevated");

const toneOf = (state: PlaygroundState): string =>
  String(state.tone ?? DEFAULT_SURFACE_TONE);

export const isLiquid = (state: PlaygroundState): boolean =>
  variantOf(state) === LIQUID;

export const showsTone = (state: PlaygroundState): boolean =>
  !UNTINTED.includes(variantOf(state));

/**
 * The variants whose chrome carries an alpha background whatever the tone:
 * `outlined`'s `bg-white/90` and `default`'s `bg-white/80` (Panel.tsx:367,:375)
 * and the two glass fills (Theme.ts:3696).
 */
const ALWAYS_ALPHA = ["outlined", "default", "glass", LIQUID];

/** The variants that only get a fill from the tone's palette. */
const TONE_ALPHA = ["none", "subtle", "tonal", "simple"];

/**
 * Whether the transparency scale can be seen at all.
 *
 * It changes background alpha and nothing else (surfaceTransparency.ts:12,:17-39),
 * and only where there is an alpha to change: with no `/alpha` in the class
 * list, `getSurfaceTransparencyClasses` hands the classes back untouched (:27).
 * So `elevated` — `bg-white`, Panel.tsx:363-364 — and an untinted `none`,
 * `subtle`, `tonal` or `simple` bar — `bg-white` too, Theme.ts:3691-3692 — have
 * nothing for it to do, and the control hides there rather than pretending.
 */
export const showsTransparency = (state: PlaygroundState): boolean => {
  const variant = variantOf(state);
  if (ALWAYS_ALPHA.includes(variant)) return true;
  return TONE_ALPHA.includes(variant) && toneOf(state) !== DEFAULT_SURFACE_TONE;
};

/** The value the transparency control opens on — "let the variant decide". */
export const PANEL_DEFAULT = "inherit";

/**
 * A region of the bar: the prop it fills, the const the snippet hoists it
 * under, and the element the preview mounts. One table, three consumers — so a
 * group that is not on screen cannot be printed, and a printed group is always
 * the one the reader can see.
 */
export interface RegionSpec {
  /** The prop the group is passed as; `extra` is `children` instead. */
  prop: "start" | "center" | "end" | null;
  constName: string;
  element: ReactElement;
  label: string;
  note: string;
  /** Which kit components the snippet has to import to render this group. */
  uses: string[];
}

export type RegionId = "start" | "center" | "end" | "extra";

export const REGIONS: Record<RegionId, RegionSpec> = {
  start: {
    prop: "start",
    constName: "START",
    uses: ["IconButton"],
    element: START,
    label: "The left group",
    note: "Toolbar.tsx:162 puts it in the first of three always-present groups — the bar never collapses an empty one away (test :34-40).",
  },
  center: {
    prop: "center",
    constName: "SEARCH",
    uses: ["Input"],
    element: SEARCH,
    label: "The centred group",
    note: "Centred by justify-between (Toolbar.tsx:152), which measures the flanks — keep it a field, not a toolbar.",
  },
  end: {
    prop: "end",
    constName: "END",
    uses: ["Button"],
    element: END,
    label: "The right group",
    note: "Parked right by the same justify-between, even when the other two are empty (test :34-40).",
  },
  extra: {
    prop: null,
    constName: "EXTRA",
    uses: ["Button"],
    element: EXTRA,
    label: "The fourth group",
    note: "children are appended after the regions as their own group (Toolbar.tsx:165, test :42-52) — the only one that disappears when empty.",
  },
};

export const REGION_IDS: RegionId[] = ["start", "center", "end", "extra"];

/** Whether the reader is passing this group at all. */
export const regionOn = (state: PlaygroundState, id: RegionId): boolean =>
  state[id] === true;

/** Trimmed text for the two fields that print only when filled in. */
export const textOf = (state: PlaygroundState, id: string): string =>
  String(state[id] ?? "").trim();
