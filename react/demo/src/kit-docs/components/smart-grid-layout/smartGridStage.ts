import type { PlaygroundState } from "../../shared/playground/schema";
import type { SmartGridTileSpec } from "./smartGridFixture";
import { TILE_COUNT, TILE_SPECS } from "./smartGridFixture";

/**
 * One place for what the component's defaults are and for the questions the
 * config, the preview and the Code view all have to answer the same way.
 *
 * The constants are the *code's* defaults, not the JSDoc's: `surfaceTone` is the
 * one that disagrees with its own comment, so it is written here once.
 */

export const VARIANT_DEFAULT = "plain";
export const SURFACE_TONE_DEFAULT = "none";
export const TONE_DEFAULT = "blue";
export const SIZE_DEFAULT = "md";
export const COLUMNS_DEFAULT = 12;
export const HISTORY_DEFAULT = 50;
export const DEBOUNCE_DEFAULT = 400;
export const STORAGE_PREFIX_DEFAULT = "ui-kit:grid";

/** Where the `lg` count of a responsive map comes from. */
export const RESPONSIVE_BASE = 4;
export const RESPONSIVE_MD = 8;

export type EditModeChoice = "self" | "on" | "off";
export type LayoutChoice = "overview" | "sections";

export const textOf = (state: PlaygroundState, id: string): string =>
  String(state[id] ?? "").trim();

export const hasText = (state: PlaygroundState, id: string): boolean =>
  textOf(state, id).length > 0;

export const tileCount = (state: PlaygroundState): number =>
  Math.min(Number(state.tiles ?? String(TILE_COUNT - 1)), TILE_COUNT);

export const tilesFor = (state: PlaygroundState): SmartGridTileSpec[] =>
  TILE_SPECS.slice(0, tileCount(state));

export const layoutChoice = (state: PlaygroundState): LayoutChoice =>
  (String(state.layout ?? "overview") as LayoutChoice) === "sections"
    ? "sections"
    : "overview";

export const sectionCount = (state: PlaygroundState): number =>
  layoutChoice(state) === "sections" ? 2 : 1;

export const columnsOf = (state: PlaygroundState): number => {
  const raw = Number(state.columns ?? COLUMNS_DEFAULT);
  return Number.isFinite(raw) ? Math.max(1, Math.round(raw)) : COLUMNS_DEFAULT;
};

/** A map is a different prop value, not an extra prop (:209-220). */
export const isResponsive = (state: PlaygroundState): boolean =>
  state.responsive === true;

/** The prop arrives as a number or a map; the preview passes whichever it is. */
export const columnsValue = (state: PlaygroundState): number | Record<string, number> =>
  isResponsive(state)
    ? { base: RESPONSIVE_BASE, md: RESPONSIVE_MD, lg: columnsOf(state) }
    : columnsOf(state);

export const isPlainSurface = (state: PlaygroundState): boolean =>
  String(state.variant ?? VARIANT_DEFAULT) === VARIANT_DEFAULT;

export const surfaceToneOf = (state: PlaygroundState): string =>
  String(state.surfaceTone ?? SURFACE_TONE_DEFAULT);

export const editModeChoice = (state: PlaygroundState): EditModeChoice => {
  const raw = String(state.editMode ?? "self");
  return raw === "on" || raw === "off" ? raw : "self";
};

/** Controlled means the host passes `isEditMode`; `self` means it does not. */
export const isControlled = (state: PlaygroundState): boolean =>
  editModeChoice(state) !== "self";

export const showsUncontrolledStart = (state: PlaygroundState): boolean =>
  !isControlled(state);

export const reportsEditMode = (state: PlaygroundState): boolean =>
  state.onEditModeChange === true;

/** `defaultEditMode` only means something to the component that owns the state. */
export const usesDefaultEditMode = (state: PlaygroundState): boolean =>
  showsUncontrolledStart(state) && state.defaultEditMode === true;

export const isReadOnly = (state: PlaygroundState): boolean =>
  state.readOnly === true;

/** Nothing about persistence is real until `storageKey` is a name (:170-178). */
export const usesStorage = (state: PlaygroundState): boolean =>
  hasText(state, "storageKey");

export const savesAutomatically = (state: PlaygroundState): boolean =>
  state.autoSave !== false;
