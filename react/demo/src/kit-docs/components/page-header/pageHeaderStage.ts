import type { ReactElement } from "react";
import type { PlaygroundState } from "../../shared/playground/schema";
import { ACTIONS, EXTRA, NOTE, TRAIL } from "./pageHeaderFixture";

/**
 * What the controls, the preview and the Code view all have to agree on — this
 * page's reading of `PageHeader.tsx`, line-referenced. Nothing here renders.
 */

/** The bar's own name in the preview; a real banner says which one it is. */
export const DEFAULT_ARIA_LABEL = "Preview header";

/** What "let the component decide" spells in these controls (:85-86,:119-132). */
export const PANEL_DEFAULT = "inherit";

/** The hue `:120` fills in when the prop is left out — the JSDoc's own default (:70). */
export const DEFAULT_ACCENT_COLOR = "blue";

/** The two detached-card names the component keeps for compatibility (:22,:144). */
export const FLOATING = "floating";
export const FLOATING_GLASS = "floating-glass";

const variantOf = (state: PlaygroundState): string =>
  String(state.variant ?? "default");

/** `none` and its alias `plain` paint nothing at all (:22,:142,:177). */
export const isPlain = (state: PlaygroundState): boolean =>
  variantOf(state) === "none" || variantOf(state) === "plain";

/** The legacy names, which paint their own card rather than a Panel variant. */
export const isLegacy = (state: PlaygroundState): boolean =>
  ["default", FLOATING, FLOATING_GLASS].includes(variantOf(state));

/**
 * Whether the bar puts a `Panel` behind itself at all (:143,:181-187).
 *
 * This is the gate that decides whether the five forwarded knobs mean anything:
 * `tone`, `glassOpacity`, `transparency`, `vibrancy`, `specularMode` and
 * `raisedSurface` are read nowhere else in the file (:183-185), so on `default`,
 * `floating`, `floating-glass`, `none` and `plain` they are inert and the
 * controls hide rather than advertise an attribute that does nothing.
 */
export const isShared = (state: PlaygroundState): boolean =>
  !isPlain(state) && !isLegacy(state);

export const isFloating = (state: PlaygroundState): boolean =>
  variantOf(state) === FLOATING || variantOf(state) === FLOATING_GLASS;

/** The one variant whose frosted fill `accentColor` retints (:144-145,:172). */
export const isFloatingGlass = (state: PlaygroundState): boolean =>
  variantOf(state) === FLOATING_GLASS;

/**
 * The variants on which the inner Panel actually reads `tone`.
 *
 * `elevated` returns its shadow alone and `default` its rim (Panel.tsx:963-999),
 * so a tint there is invisible — which is also why `default` is not in this list:
 * it is not a shared-surface variant to begin with (:143).
 */
const TINTED = ["outlined", "subtle", "tonal", "glass", "liquid-glass", "simple"];

/**
 * The variants the nesting ladder answers to. Outside these five `raisedSurface`
 * is a documented no-op, because `elevated` and `outlined` separate from the page
 * with fill, rim and shadow instead (Panel.tsx:312-314,:718).
 */
const LADDER = ["subtle", "tonal", "glass", "liquid-glass", "simple"];

/** `vibrancy`, `glassOpacity` and `specularMode` are liquid-glass props (:1011-1012, Panel.tsx:322-349). */
const LIQUID = "liquid-glass";

/**
 * The variants that already carry an alpha background, which is the only thing
 * the transparency scale is allowed to change: with no `/alpha` in the class list
 * `getSurfaceTransparencyClasses` hands the classes back untouched
 * (surfaceTransparency.ts:27).
 */
const ALWAYS_ALPHA = ["outlined", "glass", LIQUID];
const TONE_ALPHA = ["subtle", "tonal", "simple"];

const toneOf = (state: PlaygroundState): string =>
  String(state.tone ?? "none");

export const showsTone = (state: PlaygroundState): boolean =>
  isShared(state) && TINTED.includes(variantOf(state));

export const showsRaisedSurface = (state: PlaygroundState): boolean =>
  isShared(state) && LADDER.includes(variantOf(state));

export const isLiquid = (state: PlaygroundState): boolean =>
  isShared(state) && variantOf(state) === LIQUID;

export const showsTransparency = (state: PlaygroundState): boolean => {
  if (!isShared(state)) return false;
  const variant = variantOf(state);
  if (ALWAYS_ALPHA.includes(variant)) return true;
  return TONE_ALPHA.includes(variant) && toneOf(state) !== "none";
};

/** The sidebar the preview stands beside, derived from the bar's own variant. */
export const shellVariant = (state: PlaygroundState): string =>
  isFloating(state) || variantOf(state) === "glass"
    ? variantOf(state)
    : "sidebar";

/**
 * A region of the bar: the prop it fills, the const the snippet hoists it under,
 * and the element the preview mounts. One table, three consumers — so a group
 * that is not on screen cannot be printed, and a printed group is always the one
 * the reader can see.
 */
export interface RegionSpec {
  /** The prop the group is passed as; `extra` is `children` instead. */
  prop: "start" | "center" | "end" | null;
  constName: string;
  element: ReactElement;
  label: string;
  note: string;
  uses: string[];
}

export type RegionId = "start" | "center" | "end" | "extra";

export const REGIONS: Record<RegionId, RegionSpec> = {
  start: {
    prop: "start",
    constName: "TRAIL",
    element: TRAIL,
    label: "The left group",
    note: "PageHeader.tsx:188 puts it in the first of three always-present groups — the bar never collapses an empty one away (test :39-47).",
    uses: ["Breadcrumb"],
  },
  center: {
    prop: "center",
    constName: "NOTE",
    element: NOTE,
    label: "The centred group",
    note: "Centred by justify-between (Toolbar-shaped: PageHeader.tsx:163), which measures the flanks — the JSDoc at :30 says keep it narrow.",
    uses: [],
  },
  end: {
    prop: "end",
    constName: "ACTIONS",
    element: ACTIONS,
    label: "The right group",
    note: "Parked right by the same justify-between, even when the other two are empty (test :39-47).",
    uses: ["Button", "IconButton"],
  },
  extra: {
    prop: null,
    constName: "EXTRA",
    element: EXTRA,
    label: "The fourth group",
    note: "children are appended after the regions as their own group (PageHeader.tsx:191, test :49-58) — the only one that disappears when empty.",
    uses: ["Button"],
  },
};

export const REGION_IDS: RegionId[] = ["start", "center", "end", "extra"];

/** Whether the reader is passing this group at all. */
export const regionOn = (state: PlaygroundState, id: RegionId): boolean =>
  state[id] === true;

/** Trimmed text for the two fields that print only when filled in. */
export const textOf = (state: PlaygroundState, id: string): string =>
  String(state[id] ?? "").trim();

/** The gutter axes, in the order the file maps them (:151-157). */
export const GUTTER_AXES = [
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
] as const;

export type GutterAxis = (typeof GUTTER_AXES)[number];

/** The axis a gutter control edits, or `null` for the uniform `padding` prop. */
export const axisOf = (id: string): GutterAxis | null =>
  (GUTTER_AXES as readonly string[]).includes(id) ? (id as GutterAxis) : null;
