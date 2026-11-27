/**
 * The one source of truth for what the CustomIcon playground stage holds, so the
 * config, the preview and both test files ask the same questions of the same
 * state. Every default here is the component's own destructured default
 * (`CustomIcon.tsx:62-77`) — the stage must not invent a second one.
 */
import type { PlaygroundState } from "../../shared/playground/schema";

/** `size`'s documented default (:24,:66) and the `md` rung of `SIZE_CLASS_MAP` (:51-57). */
export const SIZE_DEFAULT = "md";

/** The name the stage opens with — a built-in, so nothing is missing to start with (:79). */
export const ICON_DEFAULT = "Notification";

/** Names the select offers. The last two are deliberately *not* in the registry. */
export const ICON_CHOICES: { label: string; value: string; registered: boolean }[] = [
  { label: "Notification", value: "Notification", registered: true },
  { label: "Search", value: "Search", registered: true },
  { label: "Settings", value: "Settings", registered: true },
  { label: "Download", value: "Download", registered: true },
  { label: "Save", value: "Save", registered: true },
  { label: "Trash", value: "Trash", registered: true },
  { label: "Star", value: "Star", registered: true },
  { label: "Check", value: "Check", registered: true },
  { label: "Sun", value: "Sun", registered: true },
  { label: "Moon", value: "Moon", registered: true },
  { label: "Gauge", value: "Gauge", registered: true },
  { label: "Rocket", value: "Rocket", registered: true },
  { label: "Unicorn (not registered)", value: "Unicorn", registered: false },
  { label: "QuantumWidget (not registered)", value: "QuantumWidget", registered: false },
];

/** The `alt` the stage offers when the reader wants an announced icon (:20). */
export const ALT_EXAMPLE = "Mark everything as read";
/** A raw CSS colour for `color`, which is not a tone (:31,:97). */
export const COLOR_EXAMPLE = "#0ea5e9";
/** A raw CSS colour for `hoverColor`, which travels as a custom property (:33,:98-100). */
export const HOVER_COLOR_EXAMPLE = "#f97316";
/** What the reader can type into `customSize` — digits become px (:22,:81-84). */
export const CUSTOM_SIZE_EXAMPLE = "48";
/** A className carrying its own size, which retires the `size` class (:45,:105-106). */
export const CLASS_EXAMPLE = "h-10 w-10";

/** The state the scratch `press` field holds before anything has been clicked. */
export const NONE = "";

/** The stage's own layout — room for a 32px icon and the captions under it. */
export const STAGE_CLASS = "flex w-full max-w-md flex-col items-start gap-4";

// ── Reading the state ────────────────────────────────────────────────────────

/** A text field as a string, never `undefined` (:8-49). */
export const textValue = (state: PlaygroundState, id: string): string => {
  const raw = state[id];
  return typeof raw === "string" ? raw : "";
};

/** A toggle field as a boolean. */
export const flag = (state: PlaygroundState, id: string): boolean =>
  state[id] === true;

/** The name on the tag — required, so it is never blank (:14,:79). */
export const iconName = (state: PlaygroundState): string =>
  textValue(state, "icon") || ICON_DEFAULT;

/** A built-in name? Consumer registrations are the reader's own business (:79,:130-144). */
export const isBuiltIn = (state: PlaygroundState): boolean =>
  (ICON_CHOICES.find((entry) => entry.value === iconName(state))?.registered ?? true);

/** `alt` is the whole a11y contract, so an empty box really means decoration (:125). */
export const hasAlt = (state: PlaygroundState): boolean =>
  textValue(state, "alt").trim() !== "";

/** A raw colour is only there when someone typed one (:31). */
export const hasColor = (state: PlaygroundState): boolean =>
  textValue(state, "color").trim() !== "";

export const hasHoverColor = (state: PlaygroundState): boolean =>
  textValue(state, "hoverColor").trim() !== "";

/** No tone is a real choice here — `tone` has no documented default (:26,:108-111). */
export const hasTone = (state: PlaygroundState): boolean =>
  textValue(state, "tone").trim() !== "";

/** `customSize` in any spelling — digits, or a CSS length (:22). */
export const hasCustomSize = (state: PlaygroundState): boolean =>
  textValue(state, "customSize").trim() !== "";

/** Pixels when the box holds digits, a CSS length when it holds anything else (:81-84). */
export const customSizeValue = (
  state: PlaygroundState,
): number | string | undefined => {
  const raw = textValue(state, "customSize").trim();
  if (raw === "") return undefined;
  return /^\d+$/.test(raw) ? Number(raw) : raw;
};

export const hasClassName = (state: PlaygroundState): boolean =>
  textValue(state, "className").trim() !== "";

/** `colored` makes `tone`, `color` and `hoverColor` inert (:35,:92-101,:109). */
export const isColored = (state: PlaygroundState): boolean => flag(state, "colored");

/** `onClick` is what turns the span into a button (:43,:146-164). */
export const isClickable = (state: PlaygroundState): boolean =>
  flag(state, "activatable");

/** What the last press reported, held in scratch state so the stage can show it. */
export const pressReport = (state: PlaygroundState): string =>
  textValue(state, "press");
