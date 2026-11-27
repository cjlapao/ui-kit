import type {
  PlaygroundConfig,
  PlaygroundDataSource,
  PlaygroundGroup,
  PlaygroundOption,
  PlaygroundState,
} from "../../shared/playground/schema";
import {
  ERROR_TEXT,
  EMPTY_MESSAGE_NONE,
  LOADER_DEFAULT,
  LOADING_LABEL_NONE,
  PAGE_UNCONTROLLED,
  PROGRESS_DEFAULT,
  SIZE_DEFAULT,
  SUBTITLE_NONE,
  TONE_DEFAULT,
  VARIANT_DEFAULT,
  pageCount,
  showsBuiltInLoader,
  showsEmptyBlock,
  showsLoadingLabel,
  showsProgress,
  showsTitles,
  titlesFor,
  textOf,
} from "./pagedPanelStage";
import { FIXTURE_NAMES, pagesOf } from "./pagedPanelFixture";

/** The hoisted names the Code view gives the two replacement blocks. */
export const LOADING_CONST = "LOADING_CARD";
export const EMPTY_CONST = "EMPTY_BLOCK";
/** What a caller really writes beside a controlled index (:66-67,:340). */
export const PAGE_CHANGE_HANDLER = "(next) => setRegion(next)";

const PAGE_COUNT_OPTIONS: PlaygroundOption[] = [
  { label: "1", value: "1" },
  { label: "3", value: "3" },
  { label: "5", value: "5" },
];

const TITLES_OPTIONS: PlaygroundOption[] = [
  { label: "Static", value: "static" },
  { label: "Per page", value: "per-page" },
  { label: "None", value: "none" },
];

const STATE_OPTIONS: PlaygroundOption[] = [
  { label: "Ready", value: "ready" },
  { label: "Loading", value: "loading" },
  { label: "Error", value: "error" },
  { label: "Empty", value: "empty" },
];

const LOADER_OPTIONS: PlaygroundOption[] = [
  { label: "skeleton", value: "skeleton" },
  { label: "spinner", value: "spinner" },
  { label: "progress", value: "progress" },
];

// Colour, not words: the tone paints the nav buttons and the Panel surface at
// once (:334,:378), so it is read as ink.
const TONE_OPTIONS: PlaygroundOption[] = [
  { label: "None — neutral ink", value: "none" },
  { label: "Blue", value: "blue" },
  { label: "Emerald", value: "emerald" },
  { label: "Amber", value: "amber" },
  { label: "Rose", value: "rose" },
  { label: "Violet", value: "violet" },
];

const SIZE_OPTIONS: PlaygroundOption[] = [
  { label: "xs", value: "xs" },
  { label: "sm", value: "sm" },
  { label: "md", value: "md" },
  { label: "lg", value: "lg" },
  { label: "xl", value: "xl" },
];

const VARIANT_OPTIONS: PlaygroundOption[] = [
  { label: "elevated", value: "elevated" },
  { label: "flat", value: "flat" },
  { label: "glass", value: "glass" },
];

/** A free-text prop earns its line only when the reader typed something. */
const printed = (
  name: string,
  value: unknown,
  lit: (text: string) => string,
): string | null => {
  const text = textOf(value);
  return text.length === 0 ? null : `${name}=${lit(text)}`;
};

export const PAGED_PANEL_GROUPS: PlaygroundGroup[] = [
  { id: "content", title: "Pages & header", defaultOpen: true },
  { id: "states", title: "Loading, error, empty", defaultOpen: true },
  { id: "paging", title: "Who owns the index" },
  { id: "surface", title: "Surface" },
];

export const pagedPanelData: PlaygroundDataSource[] = [
  {
    id: "pages",
    constName: "PAGES",
    prop: "pages",
    label: "One card per region — the panel shows one at a time",
    note: "an empty array is what makes the empty state: total is 0, so no nav (:175,:294)",
    emit: "source",
    // The preview and this line read the same `pagesOf`, so the cards printed
    // are the cards mounted (:1-99 of `pagedPanelFixture.tsx`).
    value: (state: PlaygroundState) => pagesOf(pageCount(state)),
    source: (state: PlaygroundState, h) =>
      h.jsx(pagesOf(pageCount(state)), { names: FIXTURE_NAMES }),
  },
  {
    id: "titles",
    constName: "TITLES",
    prop: "title",
    label: "One title per page — the array must match the pages",
    note: "title[current] is read per page (:343), so with no pages there is no title to show",
    emit: "literal",
    value: (state: PlaygroundState) => titlesFor(state),
    when: showsTitles,
  },
];

export const pagedPanelConfig: PlaygroundConfig = {
  groups: PAGED_PANEL_GROUPS,
  data: pagedPanelData,
  fields: [
    // ── Pages & header ───────────────────────────────────────────────────────
    {
      id: "pageCount",
      label: "Pages — nav appears only past one",
      group: "content",
      kind: "choice",
      prop: null,
      default: "3",
      options: PAGE_COUNT_OPTIONS,
      control: "segments",
      emit: () => null,
    },
    {
      id: "titles",
      label: "Title — static, one per page, or none",
      group: "content",
      kind: "choice",
      prop: null,
      default: "static",
      options: TITLES_OPTIONS,
      control: "segments",
      emit: () => null,
    },
    {
      id: "title",
      label: "Header title",
      group: "content",
      kind: "text",
      prop: "title",
      default: "Regions",
      when: (state) => state.titles === "static",
      // A supplied `emit` skips the default check, so the blank case is named
      // here: no text, no attribute (:35-39).
      emit: (value, _state, h) => printed("title", value, h.lit),
    },
    {
      id: "subtitle",
      label: "Subtitle",
      group: "content",
      kind: "text",
      prop: "subtitle",
      default: SUBTITLE_NONE,
      emit: (value, _state, h) => printed("subtitle", value, h.lit),
    },

    // ── Loading, error, empty ────────────────────────────────────────────────
    {
      id: "state",
      label: "Body — what the panel is showing",
      group: "states",
      kind: "choice",
      prop: null,
      default: "ready",
      options: STATE_OPTIONS,
      control: "segments",
      // The one lever that does reach the code: `loading` is a prop of its own
      // (:42-43). The error message prints itself, and an empty body prints as
      // the empty `pages` array the component reads `total` from (:294).
      emit: (value) => (value === "loading" ? "loading" : null),
    },
    {
      id: "loaderType",
      label: "Loader — skeleton keeps the height",
      group: "states",
      kind: "choice",
      prop: "loaderType",
      default: LOADER_DEFAULT,
      docDefault: LOADER_DEFAULT,
      options: LOADER_OPTIONS,
      control: "segments",
      when: showsBuiltInLoader,
    },
    {
      id: "progress",
      label: "progress — 0–100",
      group: "states",
      kind: "number",
      prop: "progress",
      default: PROGRESS_DEFAULT,
      min: 0,
      max: 100,
      step: 5,
      when: showsProgress,
      // Only `loaderType="progress"` reads it (:276-282), and it is meaningless
      // without a value — so it prints whenever the control is visible.
      emit: (value) => `progress={${Number(value)}}`,
    },
    {
      id: "loadingLabel",
      label: "loadingLabel — copy beside the loader",
      group: "states",
      kind: "text",
      prop: "loadingLabel",
      default: LOADING_LABEL_NONE,
      when: showsLoadingLabel,
      emit: (value, _state, h) => printed("loadingLabel", value, h.lit),
    },
    {
      id: "loadingState",
      label: "loadingState — replaces all three treatments",
      group: "states",
      kind: "toggle",
      prop: "loadingState",
      default: false,
      when: (state) => state.state === "loading",
      emit: (value) =>
        value === true ? `loadingState={${LOADING_CONST}}` : null,
    },
    {
      id: "error",
      label: "error — the message the EmptyState shows",
      group: "states",
      kind: "text",
      prop: "error",
      default: ERROR_TEXT,
      when: (state) => state.state === "error",
      emit: (value, _state, h) => printed("error", value, h.lit),
    },
    {
      id: "emptyMessage",
      label: 'emptyMessage — the kit says "No data available." (:352)',
      group: "states",
      kind: "text",
      prop: "emptyMessage",
      default: EMPTY_MESSAGE_NONE,
      when: showsEmptyBlock,
      emit: (value, _state, h) => printed("emptyMessage", value, h.lit),
    },
    {
      id: "emptyState",
      label: "emptyState — bring your own block",
      group: "states",
      kind: "toggle",
      prop: "emptyState",
      default: false,
      when: (state) => state.state === "empty",
      emit: (value) => (value === true ? `emptyState={${EMPTY_CONST}}` : null),
    },

    // ── Who owns the index ───────────────────────────────────────────────────
    {
      id: "page",
      label: "page — controlled index, −1 for uncontrolled",
      group: "paging",
      kind: "number",
      prop: "page",
      default: PAGE_UNCONTROLLED,
      min: -1,
      max: 4,
      step: 1,
      // `page` present means the caller owns it; −1 is this control's own
      // sentinel for "not passed" and must never reach the snippet (:47,:65).
      emit: (value) =>
        Number(value) < 0 ? null : `page={${Number(value)}}`,
    },
    {
      id: "onPageChange",
      label: "onPageChange — hear the index move",
      group: "paging",
      kind: "toggle",
      prop: "onPageChange",
      default: false,
      emit: (value) =>
        value === true ? `onPageChange={${PAGE_CHANGE_HANDLER}}` : null,
    },

    // ── Surface ──────────────────────────────────────────────────────────────
    {
      id: "tone",
      label: "tone — the nav buttons and the Panel, one knob",
      group: "surface",
      kind: "choice",
      prop: "tone",
      default: TONE_DEFAULT,
      docDefault: TONE_DEFAULT,
      options: TONE_OPTIONS,
      control: "select",
    },
    {
      id: "size",
      label: "size — header type, counter and buttons together",
      group: "surface",
      kind: "choice",
      prop: "size",
      default: SIZE_DEFAULT,
      docDefault: SIZE_DEFAULT,
      options: SIZE_OPTIONS,
      control: "segments",
    },
    {
      id: "variant",
      label: "variant — the wrapping Panel's own",
      group: "surface",
      kind: "choice",
      prop: "variant",
      default: VARIANT_DEFAULT,
      docDefault: VARIANT_DEFAULT,
      options: VARIANT_OPTIONS,
      control: "segments",
      when: (state) => state.bare !== true,
    },
    {
      id: "bare",
      label: "bare — no Panel, for inside one you already own",
      group: "surface",
      kind: "toggle",
      prop: "bare",
      default: false,
    },
    {
      id: "className",
      label: "className — onto the Panel, or the bare div",
      group: "surface",
      kind: "text",
      prop: "className",
      default: "",
      emit: (value, _state, h) => printed("className", value, h.lit),
    },
  ],
};
