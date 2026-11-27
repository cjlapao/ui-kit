import type { PlaygroundState } from "../../shared/playground/schema";
import { CAPSULES } from "./splitViewFixture";

/**
 * Every default the component ships with, read out of `SplitView.tsx`, plus the
 * predicates the preview and the printer share. One place decides what "the
 * default" means, so the controls, the preview and the Code view cannot each
 * invent their own answer.
 */

/** `variant = "elevated"` (:449), and the JSDoc agrees (:197). */
export const VARIANT_DEFAULT = "elevated";
/** `tone ?? color ?? "blue"` (:485) — the interface never says so. */
export const TONE_DEFAULT = "blue";
/** `surfaceTone = "none"` (:450) where the JSDoc promises `"neutral"` (:211). */
export const SURFACE_TONE_DEFAULT = "none";
/** `size = "md"` (:452). */
export const SIZE_DEFAULT = "md";
/** No `searchVariant`: the map at :67-77 picks one per surface (:570-571). */
export const SEARCH_VARIANT_AUTO = "auto";
/** `menuVisibility = "hover"` (:443). */
export const MENU_VISIBILITY_DEFAULT = "hover";
/** `minListWidth = 180` (:460, documented :247). */
export const MIN_LIST_WIDTH_DEFAULT = 180;
/** No `maxListWidth`: 75% of the container, 600 when it cannot measure one (:614-621). */
export const MAX_LIST_WIDTH_AUTO = "auto";
/** No `listWidth`: `listWidth ?? "w-72"` (:700), 288px as a resize seed (:623). */
export const LIST_WIDTH_AUTO = "auto";
/** No `value`: the first visible row is selected on mount (:582). */
export const SELECTION_AUTO = "auto";
/** The value that selects nothing: `""` — no id matches, so the pane is empty. */
export const SELECTION_NONE = "";
/** `loaderType = "skeleton"` (:471). */
export const LOADER_DEFAULT = "skeleton";
/** `loadingProgress` has no component default; this is the demo's own number. */
export const PROGRESS_DEFAULT = 62;
/** `autoExpand = true` (:478), `panelScrollable = true` (:481). */
export const LIST_TITLE = `CAPSULES (${CAPSULES.filter((spec) => !spec.hidden).length})`;
export const ERROR_TEXT = "Could not reach the registry";

export const flag = (state: PlaygroundState, id: string): boolean =>
  state[id] === true;

export const textValue = (state: PlaygroundState, id: string): string =>
  typeof state[id] === "string" ? (state[id] as string) : "";

export const choiceOf = (
  state: PlaygroundState,
  id: string,
  fallback: string,
): string => (typeof state[id] === "string" && state[id] !== "" ? (state[id] as string) : fallback);

export const numberOf = (
  state: PlaygroundState,
  id: string,
  fallback: number,
): number => (typeof state[id] === "number" ? (state[id] as number) : fallback);

export const isResizable = (state: PlaygroundState): boolean =>
  flag(state, "resizable");

export const isCollapsible = (state: PlaygroundState): boolean =>
  flag(state, "collapsible");

/** The list's own collapse, reported or not, only exists while `collapsible` (:600-603). */
export const isCollapsed = (state: PlaygroundState): boolean =>
  isCollapsible(state) && flag(state, "collapsed");

export const isLoading = (state: PlaygroundState): boolean => flag(state, "loading");

export const isError = (state: PlaygroundState): boolean => flag(state, "error");

export const hasRetry = (state: PlaygroundState): boolean =>
  isError(state) && flag(state, "onRetry");

export const showsHeader = (state: PlaygroundState): boolean =>
  flag(state, "panelHeaderProps");

export const hasHeaderDetails = (state: PlaygroundState): boolean =>
  showsHeader(state) && flag(state, "headerDetails");

export const usesPanelHeader = (state: PlaygroundState): boolean =>
  flag(state, "panelHeader");

export const withSubItems = (state: PlaygroundState): boolean =>
  flag(state, "subItems");

/** A `value` the host owns: the rows stop moving the accent (:584,:676-682). */
export const isControlled = (state: PlaygroundState): boolean =>
  textValue(state, "selection") !== SELECTION_AUTO;

export const selectedId = (state: PlaygroundState): string =>
  textValue(state, "selection") === SELECTION_AUTO
    ? ""
    : textValue(state, "selection");

/** `error` as a string is the EmptyState subtitle (:974-978). */
export const errorText = (state: PlaygroundState): string =>
  textValue(state, "errorText") === "" ? ERROR_TEXT : textValue(state, "errorText");

/** Only the retry button forces the printed demo to own state. */
export const needsHostState = (state: PlaygroundState): boolean => hasRetry(state);
