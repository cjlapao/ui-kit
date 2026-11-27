import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * The words this page uses for the values a row can hold, and the predicates the
 * controls, the preview and the snippet all read. They live here — not inline in
 * the three consumers — so a field's `when`, what paints on screen and what the
 * Code view prints are decided by one expression, not by three that once agreed.
 *
 * Every line cited here was read out of `react/src/components/InfoRow.tsx`.
 */

/** The kit defaults the component destructures (:373-398, :911-922). */
export const VARIANT_DEFAULT = "elevated"; // :387,:914
export const TONE_DEFAULT = "none"; // :388,:915 — its JSDoc (:116) says "blue"
export const SIZE_DEFAULT = "md"; // :373
export const LOADER_DEFAULT = "skeleton"; // :382
export const EMPTY_TEXT_DEFAULT = "—"; // :378
export const LABEL_DEFAULT = "Image digest";
export const ERROR_TEXT = "Registry unreachable";

/** Sentinels for the choices where "the kit decides" is a real third option. */
export const AUTO = "";
export const GROW = "grow";
export const FIXED_LABEL_WIDTH = "w-32";
export const NO_PLACEHOLDER = "none";
export const CUSTOM_PLACEHOLDER = "Not set";

/** The `value` shapes, since one control has to cover four types (:312-329). */
export const VALUE_DIGEST = "digest";
export const VALUE_COUNT = "count";
export const VALUE_BOOLEAN = "boolean";
export const VALUE_NODE = "node";
export const VALUE_EMPTY = "empty";
export const DIGEST_TEXT = "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b";
export const COUNT_NUMBER = 3;

/** What the disclosure's three-state control means (:450,:455). */
export const COLLAPSE_AUTO = "auto";
export const COLLAPSE_ON = "yes";
export const COLLAPSE_OFF = "no";
export const EXPAND_AUTO = "auto";
export const EXPAND_OPEN = "open";
export const EXPAND_SHUT = "shut";

const GLASS_VARIANTS = ["glass", "liquid-glass"];

export const textValue = (state: PlaygroundState, id: string): string =>
  typeof state[id] === "string" ? (state[id] as string) : "";

export const flag = (state: PlaygroundState, id: string): boolean =>
  state[id] === true;

export const variantOf = (state: PlaygroundState): string =>
  textValue(state, "variant") || VARIANT_DEFAULT;

/** A `plain` row draws no surface and *is* the root element (:980-990). */
export const isPlain = (state: PlaygroundState): boolean =>
  variantOf(state) === "plain";

/** Only the two borderless variants honour `bottomBorder` (:521-524). */
export const honoursBottomBorder = (state: PlaygroundState): boolean => {
  const variant = variantOf(state);
  return variant === "simple" || variant === "none";
};

/** The glass knobs only reach a surface that has any glass in it (:992-1004). */
export const isGlass = (state: PlaygroundState): boolean =>
  GLASS_VARIANTS.includes(variantOf(state));

export const isLoading = (state: PlaygroundState): boolean =>
  flag(state, "loading");

export const isError = (state: PlaygroundState): boolean => flag(state, "error");

export const errorText = (state: PlaygroundState): string => {
  const typed = textValue(state, "errorText").trim();
  return typed === "" ? ERROR_TEXT : typed;
};

export const valueOfKind = (state: PlaygroundState): string =>
  textValue(state, "value") || VALUE_DIGEST;

export const isEmptyValue = (state: PlaygroundState): boolean =>
  valueOfKind(state) === VALUE_EMPTY;

/** Whether the value can be copied at all: only a string, number or boolean (:325-328). */
export const isCopyableValue = (state: PlaygroundState): boolean => {
  const kind = valueOfKind(state);
  return (
    (kind === VALUE_DIGEST || kind === VALUE_COUNT || kind === VALUE_BOOLEAN) &&
    flag(state, "copyable")
  );
};

/** `body` is what the region renders; `collapsible` only decides the toggle (:853,:450). */
export const hasBody = (state: PlaygroundState): boolean => flag(state, "body");

/** The component's own rule: `collapsible ?? body !== undefined` (:450). */
export const isDisclosure = (state: PlaygroundState): boolean => {
  const collapsible = textValue(state, "collapsible") || COLLAPSE_AUTO;
  if (collapsible === COLLAPSE_ON) return true;
  if (collapsible === COLLAPSE_OFF) return false;
  return hasBody(state);
};

/** Only ever true while the row is a disclosure — the kit ignores it otherwise (:449). */
export const isControlledExpand = (state: PlaygroundState): boolean =>
  isDisclosure(state) && textValue(state, "expanded") !== EXPAND_AUTO;

/** The `labelWidth`/`padding`/`corner`/glass selects print nothing at this value. */
export const isAuto = (state: PlaygroundState, id: string): boolean =>
  textValue(state, id) === AUTO;

/**
 * The row vanishes entirely here — the emptiness gate (:965-974) returns `null`
 * before anything renders. The page says so instead of showing a blank box.
 */
export const isHiddenRow = (state: PlaygroundState): boolean =>
  isEmptyValue(state) &&
  flag(state, "hideIfEmpty") &&
  !isLoading(state) &&
  !isError(state) &&
  !flag(state, "subItems") &&
  !hasBody(state) &&
  textValue(state, "collapsible") !== COLLAPSE_ON;

/** Whether the copy button is mounted at all (:436-437). */
export const showsCopy = (state: PlaygroundState): boolean =>
  isCopyableValue(state) && !isEmptyValue(state) && !isLoading(state) && !isError(state);

/** Whether a truncated value gets its focusable, portaled tooltip (:438-439,:702). */
export const canTooltip = (state: PlaygroundState): boolean =>
  flag(state, "tooltipOnTruncate") &&
  !flag(state, "wrap") &&
  !isEmptyValue(state) &&
  !isLoading(state) &&
  !isError(state) &&
  valueOfKind(state) !== VALUE_NODE;
