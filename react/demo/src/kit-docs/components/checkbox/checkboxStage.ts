/**
 * The one source of truth for what the Checkbox playground stage holds, so the
 * config, the preview and both test files ask the same questions of the same
 * state. Every default here is the component's own destructured default
 * (`Checkbox.tsx:192-206`) — the stage must not invent a second one.
 */
import type { PlaygroundState } from "../../shared/playground/schema";

/** `variant`'s documented default (:62,:194). */
export const VARIANT_DEFAULT = "flat";
/** `size`'s documented default (:58,:193,:247). */
export const SIZE_DEFAULT = "md";
/** `controlAlign`'s documented default (:77,:199). */
export const ALIGN_DEFAULT = "left";
/** `descriptionPlacement`'s documented default (:56,:192). */
export const PLACEMENT_DEFAULT = "bottom";
/** The `tone ?? color ?? "blue"` fallback (:248). */
export const TONE_DEFAULT = "blue";
/** `validationStatus`'s documented default (:82,:200). */
export const VALIDATION_DEFAULT = "none";

/** The label the stage starts with — also the checkbox's accessible name (:52). */
export const LABEL_DEFAULT = "Email me a digest";
/** The description the stage offers when the reader turns one on (:54). */
export const DESCRIPTION_EXAMPLE = "One email a week, nothing else";
/** The validation message that goes with a non-`none` status (:84). */
export const MESSAGE_EXAMPLE = "You have to accept this to continue";
/** What the reader can type into the `inputClassName` box (:89,:320). */
export const INPUT_CLASS_EXAMPLE = "ring-1 ring-neutral-300";

/** The state the scratch `report` field holds when nothing has fired yet. */
export const NONE = "";

/** The stage's own layout — wide enough to show `fullWidth` doing something. */
export const STAGE_CLASS = "flex w-full max-w-md flex-col items-start gap-4";

// ── Reading the state ────────────────────────────────────────────────────────

/** A text field as a string, never `undefined` (:47-90). */
export const textValue = (state: PlaygroundState, id: string): string => {
  const raw = state[id];
  return typeof raw === "string" ? raw : "";
};

/** A checkbox-style field as a boolean. */
export const flag = (state: PlaygroundState, id: string): boolean =>
  state[id] === true;

/** A label is only really there when it has characters in it (:360). */
export const hasLabel = (state: PlaygroundState): boolean =>
  textValue(state, "label").trim() !== "";

/** A description is only there when it has characters — and it names the box alone (:215-219,:346). */
export const hasDescription = (state: PlaygroundState): boolean =>
  textValue(state, "description").trim() !== "";

/** An `aria-label` is only worth printing when someone typed one (:215-219). */
export const hasAriaLabel = (state: PlaygroundState): boolean =>
  textValue(state, "ariaLabel").trim() !== "";

/** The validation row only exists with a message to show (:84,:422). */
export const hasMessage = (state: PlaygroundState): boolean =>
  textValue(state, "validationMessage").trim() !== "";

/** A status other than `none` is what makes the border and the tint appear (:262,:308-310,:428-431). */
export const hasValidation = (state: PlaygroundState): boolean =>
  textValue(state, "validationStatus") !== VALIDATION_DEFAULT;

/** Which spelling of the colour the reader is using (:71,:248). */
export const usesLegacyColor = (state: PlaygroundState): boolean =>
  flag(state, "legacyColor");

/** The accent the tokens are built from (:248). */
export const toneOf = (state: PlaygroundState): string =>
  textValue(state, "tone") || TONE_DEFAULT;

/** Whether the stage hands `checked` to the app (:295). */
export const isControlled = (state: PlaygroundState): boolean =>
  flag(state, "controlled");

/** The last value the app saw, which is also the stage's only scratch state. */
export const changeReport = (state: PlaygroundState): string =>
  textValue(state, "report");
