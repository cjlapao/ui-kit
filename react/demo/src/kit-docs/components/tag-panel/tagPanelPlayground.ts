import type {
  PlaygroundConfig,
  PlaygroundDataSource,
  PlaygroundGroup,
  PlaygroundOption,
  PlaygroundState,
} from "../../shared/playground/schema";
import {
  BODY_EMPTY,
  BODY_TAGS,
  CLASS_NAME_NONE,
  HEADER_SIZE_DEFAULT,
  HEADER_VARIANT_DEFAULT,
  HEADER_WITH,
  HEADER_WITHOUT,
  OVERFLOW_TONE_DEFAULT,
  SUBTITLE_NONE,
  TAG_LIMIT_DEFAULT,
  TAG_SIZE_DEFAULT,
  TITLE_DEFAULT,
  foldedCount,
  hasHeader,
  isEmpty,
  showsChip,
  showsDefaultEmptyCopy,
  tagCount,
  textOf,
  tagsFor,
} from "./tagPanelStage";
import { FIXTURE_NAMES } from "./tagPanelFixture";

/** The hoisted names the Code view gives the two blocks a caller may bring. */
export const EMPTY_CONST = "EMPTY_BLOCK";
export const ACTIONS_CONST = "HEADER_ACTIONS";

const BODY_OPTIONS: PlaygroundOption[] = [
  { label: "Tags", value: BODY_TAGS },
  { label: "No tags", value: BODY_EMPTY },
];

const TAG_COUNT_OPTIONS: PlaygroundOption[] = [
  { label: "3", value: "3" },
  { label: "5", value: "5" },
  { label: "8", value: "8" },
];

const DECK_OPTIONS: PlaygroundOption[] = [
  { label: "Plain", value: "plain" },
  { label: "Mixed tones", value: "mixed" },
];

const HEADER_OPTIONS: PlaygroundOption[] = [
  { label: "With header", value: HEADER_WITH },
  { label: "No header", value: HEADER_WITHOUT },
];

// The chip is a single pill among the others, so its tone reads as colour and
// the options are the ones a reader can tell apart at `size="xs"`.
const OVERFLOW_TONE_OPTIONS: PlaygroundOption[] = [
  { label: "Neutral", value: "neutral" },
  { label: "Blue", value: "blue" },
  { label: "Emerald", value: "emerald" },
  { label: "Amber", value: "amber" },
  { label: "Rose", value: "rose" },
  { label: "Violet", value: "violet" },
];

const PILL_SIZE_OPTIONS: PlaygroundOption[] = ["xs", "sm", "md", "lg", "xl"].map(
  (value) => ({ label: value, value }),
);

const HEADER_SIZE_OPTIONS: PlaygroundOption[] = ["xs", "sm", "md", "lg"].map(
  (value) => ({ label: value, value }),
);

const HEADER_VARIANT_OPTIONS: PlaygroundOption[] = [
  "default",
  "subtle",
  "uppercase",
  "bordered",
  "filled",
].map((value) => ({ label: value, value }));

/** A free-text prop earns its line only when the reader typed something. */
const printed = (
  name: string,
  value: unknown,
  lit: (text: string) => string,
): string | null => {
  const text = textOf(value);
  return text.length === 0 ? null : `${name}=${lit(text)}`;
};

export const TAG_PANEL_GROUPS: PlaygroundGroup[] = [
  { id: "content", title: "Tags & header", defaultOpen: true },
  { id: "fold", title: "The fold", defaultOpen: true },
  { id: "pills", title: "Pills" },
  { id: "header", title: "Header scale" },
  { id: "surface", title: "Spacing & classes" },
];

export const tagPanelData: PlaygroundDataSource[] = [
  {
    id: "tags",
    constName: "TAGS",
    prop: "tags",
    label: "The caller's own entries — four fields per tag are read, the rest ignored",
    // The same array the preview mounts: the printed entries *are* the pills
    // above, tone, outline variant, leading glyph and all (:203-212,:251-260).
    note: "an empty array is the empty state; there is no empty prop to set (:238)",
    emit: "source",
    value: (state: PlaygroundState) => tagsFor(state),
    source: (state: PlaygroundState, h) =>
      h.jsx(tagsFor(state), { names: FIXTURE_NAMES }),
  },
];

export const tagPanelConfig: PlaygroundConfig = {
  groups: TAG_PANEL_GROUPS,
  data: tagPanelData,
  fields: [
    // ── Tags & header ────────────────────────────────────────────────────────
    {
      id: "body",
      label: "Body — what the panel is holding",
      group: "content",
      kind: "choice",
      prop: null,
      default: BODY_TAGS,
      options: BODY_OPTIONS,
      control: "segments",
      // The empty case reaches the code through `TAGS = []`, never as a prop.
      emit: () => null,
    },
    {
      id: "tagCount",
      label: "How many tags",
      group: "content",
      kind: "choice",
      prop: null,
      default: "8",
      options: TAG_COUNT_OPTIONS,
      control: "segments",
      when: (state) => !isEmpty(state),
      emit: () => null,
    },
    {
      id: "deck",
      label: "Deck — per-tag tone, variant, size, icon (:21-33)",
      group: "content",
      kind: "choice",
      prop: null,
      default: "plain",
      options: DECK_OPTIONS,
      control: "segments",
      when: (state) => !isEmpty(state),
      emit: () => null,
    },
    {
      id: "header",
      label: "Header",
      group: "content",
      kind: "choice",
      prop: null,
      default: HEADER_WITH,
      options: HEADER_OPTIONS,
      control: "segments",
      // Omitting `title` is the only way to hide the header (:216) — the choice
      // prints nothing because it removes the props rather than adding one.
      emit: () => null,
    },
    {
      id: "title",
      label: "Header title",
      group: "content",
      kind: "text",
      prop: "title",
      default: TITLE_DEFAULT,
      when: hasHeader,
      emit: (value, _state, h) => printed("title", value, h.lit),
    },
    {
      id: "subtitle",
      label: "Subtitle",
      group: "content",
      kind: "text",
      prop: "subtitle",
      default: SUBTITLE_NONE,
      when: hasHeader,
      emit: (value, _state, h) => printed("subtitle", value, h.lit),
    },
    {
      id: "emptyMessage",
      label: 'emptyMessage — the kit says "No tags" (:246, en.ts:386)',
      group: "content",
      kind: "text",
      prop: "emptyMessage",
      default: CLASS_NAME_NONE,
      when: showsDefaultEmptyCopy,
      emit: (value, _state, h) => printed("emptyMessage", value, h.lit),
    },
    {
      id: "emptyState",
      label: "emptyState — bring your own block (:50,:242)",
      group: "content",
      kind: "toggle",
      prop: "emptyState",
      default: false,
      when: isEmpty,
      emit: (value) => (value === true ? `emptyState={${EMPTY_CONST}}` : null),
    },

    // ── The fold ─────────────────────────────────────────────────────────────
    {
      id: "tagLimit",
      label: "tagLimit — 0 shows every pill (:44,:139)",
      group: "fold",
      kind: "number",
      prop: "tagLimit",
      default: TAG_LIMIT_DEFAULT,
      min: 0,
      max: 8,
      step: 1,
      // A number needs its own braces, and the documented 5 stays unprinted (:96).
      emit: (value) =>
        Number(value) === TAG_LIMIT_DEFAULT ? null : `tagLimit={${Number(value)}}`,
    },
    {
      id: "overflowTone",
      label: "overflowTone — the chip's own tone (:48,:285)",
      group: "fold",
      kind: "choice",
      prop: "overflowTone",
      default: OVERFLOW_TONE_DEFAULT,
      options: OVERFLOW_TONE_OPTIONS,
      control: "segments",
      // No fold, no chip, no chip to tone (:139).
      when: showsChip,
    },

    // ── Pills ────────────────────────────────────────────────────────────────
    {
      id: "tagSize",
      label: "tagSize — the pills' scale, not the header's (:63,:102)",
      group: "pills",
      kind: "choice",
      prop: "tagSize",
      default: TAG_SIZE_DEFAULT,
      options: PILL_SIZE_OPTIONS,
      control: "segments",
    },

    // ── Header scale ─────────────────────────────────────────────────────────
    {
      id: "size",
      label: "size — the header's scale; also picks the empty size (:245)",
      group: "header",
      kind: "choice",
      prop: "size",
      default: HEADER_SIZE_DEFAULT,
      options: HEADER_SIZE_OPTIONS,
      control: "segments",
    },
    {
      id: "variant",
      label: "variant — header style (Section.tsx:128)",
      group: "header",
      kind: "choice",
      prop: "variant",
      default: HEADER_VARIANT_DEFAULT,
      options: HEADER_VARIANT_OPTIONS,
      control: "segments",
    },
    {
      id: "noPadding",
      label: "noPadding — header padding off (Section.tsx:149)",
      group: "header",
      kind: "toggle",
      prop: "noPadding",
      default: false,
      when: hasHeader,
    },
    {
      id: "actions",
      label: "actions — the right side of the header (:54,:220)",
      group: "header",
      kind: "toggle",
      prop: "actions",
      default: false,
      when: hasHeader,
      emit: (value) => (value === true ? `actions={${ACTIONS_CONST}}` : null),
    },

    // ── Spacing & classes ────────────────────────────────────────────────────
    {
      id: "className",
      label: "className — the root, a plain flex column (:215)",
      group: "surface",
      kind: "text",
      prop: "className",
      default: CLASS_NAME_NONE,
      emit: (value, _state, h) => printed("className", value, h.lit),
    },
    {
      id: "bodyClassName",
      label: "bodyClassName — the pill row, which keeps its own px-0 pb-1 (:233-236)",
      group: "surface",
      kind: "text",
      prop: "bodyClassName",
      default: CLASS_NAME_NONE,
      emit: (value, _state, h) => printed("bodyClassName", value, h.lit),
    },
  ],
};

/** The caption's number: what the chip is currently holding back. */
export const foldedLabel = (state: PlaygroundState): string => {
  const folded = foldedCount(state);
  if (isEmpty(state)) return "no tags at all";
  if (folded === 0) return `${tagCount(state)} pill${tagCount(state) === 1 ? "" : "s"}, nothing folded`;
  return `${folded} of ${tagCount(state)} folded behind the chip`;
};
