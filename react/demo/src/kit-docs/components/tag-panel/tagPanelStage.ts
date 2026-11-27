import type { PlaygroundState } from "../../shared/playground/schema";
import { TAG_UNIVERSE, tagsOf } from "./tagPanelFixture";

/**
 * Everything the preview, the controls and the Code view need to agree on about
 * `TagPanel.tsx`, derived in one place. A control that appears without its
 * matching `emit` is how a playground starts lying, so both read these.
 */

/** `tagLimit = 5` in the destructure (:96) and in the JSDoc (:44) — they agree. */
export const TAG_LIMIT_DEFAULT = 5;
/** `tagSize = "sm"` (:102) — the pills' scale, `@default "sm"` at :61. */
export const TAG_SIZE_DEFAULT = "sm";
/** `size` has no default here; `Section` supplies "md" (:101 vs Section.tsx:127). */
export const HEADER_SIZE_DEFAULT = "md";
/** `variant` likewise, from `Section.tsx:128`. */
export const HEADER_VARIANT_DEFAULT = "uppercase";
/** `overflowTone = "neutral"` (:97) matching its JSDoc (:48). */
export const OVERFLOW_TONE_DEFAULT = "neutral";
/** `Pill` would default a tag to `neutral` (:205 vs Pill.tsx:128). */
export const TAG_TONE_DEFAULT = "neutral";
/** `title` is not defaulted; the deck opens with a header because it is set. */
export const TITLE_DEFAULT = "Labels";
export const SUBTITLE_NONE = "";
export const EMPTY_MESSAGE_NONE = "";
export const CLASS_NAME_NONE = "";

export const BODY_TAGS = "tags";
export const BODY_EMPTY = "empty";

export const HEADER_WITH = "with";
export const HEADER_WITHOUT = "without";

export const TAG_COUNT_MAX = TAG_UNIVERSE;

export const textOf = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

/** The empty deck is the *caller* passing `[]`, not a prop of its own (:238). */
export const isEmpty = (state: PlaygroundState): boolean =>
  state.body === BODY_EMPTY;

/** `title != null` is the whole header gate (:216) — see the empty-string row. */
export const hasHeader = (state: PlaygroundState): boolean =>
  state.header === HEADER_WITH;

/** How many tags the caller is handing over (:41). */
export const tagCount = (state: PlaygroundState): number =>
  isEmpty(state) ? 0 : Number(state.tagCount ?? TAG_COUNT_MAX);

export const isStyled = (state: PlaygroundState): boolean => state.deck === "mixed";

export const tagsFor = (state: PlaygroundState) =>
  tagsOf(tagCount(state), isStyled(state));

/**
 * The `+N` chip exists only while something is actually folded: `tagLimit > 0`
 * and more tags than the limit (:139). With no chip there is no chip to tone,
 * which is why `overflowTone` hides itself.
 */
export const showsChip = (state: PlaygroundState): boolean => {
  const limit = Number(state.tagLimit ?? TAG_LIMIT_DEFAULT);
  return !isEmpty(state) && limit > 0 && tagCount(state) > limit;
};

/** `actions` sits in the header, so with no header there is nowhere to put it. */
export const showsActions = (state: PlaygroundState): boolean =>
  hasHeader(state) && state.actions === true;

/** The default empty state only shows when the caller did not bring one (:242). */
export const showsDefaultEmptyCopy = (state: PlaygroundState): boolean =>
  isEmpty(state) && state.emptyState !== true;

/** What the fold would be showing, for the caption under the preview. */
export const foldedCount = (state: PlaygroundState): number => {
  const limit = Number(state.tagLimit ?? TAG_LIMIT_DEFAULT);
  return showsChip(state) ? tagCount(state) - limit : 0;
};
