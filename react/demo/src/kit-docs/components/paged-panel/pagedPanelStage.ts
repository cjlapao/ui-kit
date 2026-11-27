import type { PlaygroundState } from "../../shared/playground/schema";
import { REGIONS } from "./pagedPanelFixture";

/**
 * What both sides of this page — the preview that mounts a live `PagedPanel` and
 * the Code view that prints one — agree the component does. Every predicate here
 * is the component's own condition, with its line, so a control cannot be
 * visible in one place and silent in the other.
 */

export const STATES = {
  ready: "ready",
  loading: "loading",
  error: "error",
  empty: "empty",
} as const;

/** The prop defaults, as the destructure spells them — not as the JSDoc claims. */
export const TONE_DEFAULT = "none"; // :322; "none" paints `neutral` ink (Theme.ts:69)
export const SIZE_DEFAULT = "md"; // :323,:60-61
export const VARIANT_DEFAULT = "elevated"; // Panel's own default (Panel.tsx:654)
export const LOADER_DEFAULT = "skeleton"; // :328,:44-45
export const PROGRESS_DEFAULT = 65; // :46 — 0–100, only `progress` reads it
export const TITLE_STATIC = "Regions"; // :35-39 — one string, so it never swaps
export const ERROR_TEXT = "Could not reach the registry"; // :52
export const SUBTITLE_NONE = ""; // :40-41
export const EMPTY_MESSAGE_NONE = ""; // :56-57 — the kit's own copy is t("kit.pagedpanel.empty") :352
export const LOADING_LABEL_NONE = ""; // :48
export const CLASS_NAME_NONE = ""; // :369,:381
/** The sentinel the `page` control uses for "uncontrolled" (:47,:65). */
export const PAGE_UNCONTROLLED = -1;

/** `loading` replaces the page, the header and nav stay (:263-283,:176). */
export const showsLoader = (state: PlaygroundState): boolean =>
  state.state === STATES.loading;

/** `loadingState` wins over all three built-in treatments (:265). */
export const showsBuiltInLoader = (state: PlaygroundState): boolean =>
  showsLoader(state) && state.loadingState !== true;

/** Only the `progress` variant reads `progress` (:276-282). */
export const showsProgress = (state: PlaygroundState): boolean =>
  showsBuiltInLoader(state) && state.loaderType === "progress";

/** The skeleton is `aria-hidden` shape and draws no copy (:266-274). */
export const showsLoadingLabel = (state: PlaygroundState): boolean =>
  showsBuiltInLoader(state) && state.loaderType !== "skeleton";

/** The empty block is `pages.length === 0` and not loading (:294). */
export const showsEmptyBlock = (state: PlaygroundState): boolean =>
  state.state === STATES.empty && state.emptyState !== true;

/** Controlled paging: the prop is present, so the caller owns the index (:47,:65). */
export const isControlled = (state: PlaygroundState): boolean =>
  typeof state.page === "number" && state.page >= 0;

/** `total`, and therefore whether there is anything to page through (:46,:294). */
export const pageCount = (state: PlaygroundState): number =>
  state.state === STATES.empty ? 0 : Number(state.pageCount ?? 3);

/** The nav exists only past one page — one page has nowhere to go (:175). */
export const showsNav = (state: PlaygroundState): boolean => pageCount(state) > 1;

/** The header appears for a title, a subtitle, or a nav to sit in (:176). */
export const showsHeader = (state: PlaygroundState): boolean =>
  showsNav(state) ||
  state.titles !== "none" ||
  String(state.subtitle ?? "").trim().length > 0;

/** Per-page titles only while there are pages to name (:36-39,:343). */
export const showsTitles = (state: PlaygroundState): boolean =>
  state.titles === "per-page" && pageCount(state) > 0;

/** The titles the fixture can supply, clamped to the regions that exist. */
export const titlesFor = (state: PlaygroundState): string[] =>
  REGIONS.slice(0, pageCount(state)).map((region) => region.name);

export const textOf = (value: unknown): string => String(value ?? "").trim();
