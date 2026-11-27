/**
 * Shared vocabulary for the Button playground, its fixture, its printed snippet
 * and the two tests that guard them. Every default here was read out of
 * `react/src/components/Button.tsx` at the cited line; the tests assert against
 * these constants so a drift in one place fails in the other.
 *
 * A sentinel is a value the component itself can never receive — `"none"` for a
 * prop whose absence is the documented behaviour. It never reaches the kit: the
 * `Stage` translates it back to `undefined`, and the emitter's `emit` refuses to
 * print it.
 */

import type { PlaygroundState } from "../../shared/playground/schema";

/** `variant = "solid"` (:116). */
export const VARIANT_DEFAULT = "solid";
/** `color = "blue"` (:117). */
export const COLOR_DEFAULT = "blue";
/** `size = "md"` (:118). */
export const SIZE_DEFAULT = "md";
/** `weight = "normal"` (:119). */
export const WEIGHT_DEFAULT = "normal";
/** `type = "button"` (:141) — not HTML's `"submit"` (:300-302). */
export const TYPE_DEFAULT = "button";
/** `vibrancy = "medium"` (:130). */
export const VIBRANCY_DEFAULT = "medium";
/** `glassOpacity = "frosted"` (:131). */
export const GLASS_OPACITY_DEFAULT = "frosted";
/** `specularMode = "none"` (:132). */
export const SPECULAR_DEFAULT = "none";
/** `TooltipWrapper`'s own `position = "top"` (:85), which Button forwards (:334). */
export const TOOLTIP_POSITION_DEFAULT = "top";
/** `TooltipWrapper`'s own `delay = 1000` (:84), which Button forwards (:335). */
export const TOOLTIP_DELAY_DEFAULT = 1000;

/** The label the stage prints, and the one the page's examples use. */
export const LABEL_DEFAULT = "Deploy build";
/** A tooltip short enough to read at a glance, long enough to need a position. */
export const TOOLTIP_DEFAULT = "Ship this build to the fleet";
/** A raw CSS colour, which is what `iconColor` is (:70,:286-294). */
export const ICON_COLOR_EXAMPLE = "#f59e0b";

/** The absent-prop choice for the icon, tooltip and accent-colour levers. */
export const NONE = "none";

/** The two names a `<button>` can carry that the kit itself does not set. */
export const ARIA_LABEL_EXAMPLE = "Deploy build 4.2.0 to the fleet";

export const textValue = (state: PlaygroundState, id: string): string =>
  typeof state[id] === "string" ? (state[id] as string) : "";

export const flag = (state: PlaygroundState, id: string): boolean =>
  state[id] === true;

/** `glass = false` (:129) or `variant === "glass"` — either one (:189). */
export const isGlass = (state: PlaygroundState): boolean =>
  flag(state, "glass") || textValue(state, "variant") === "glass";

/** `iconOnly` or the `icon` variant: the same mode, reached two ways (:150). */
export const isIconMode = (state: PlaygroundState): boolean =>
  flag(state, "iconOnly") || textValue(state, "variant") === "icon";

export const isLoading = (state: PlaygroundState): boolean => flag(state, "loading");

/** The trigger of a popup that is up: `Menu` stamps this, not `open` (:211). */
export const isMenuOpen = (state: PlaygroundState): boolean => flag(state, "open");

/** Whether the `tooltip` line is printed at all (:330). */
export const hasTooltip = (state: PlaygroundState): boolean =>
  textValue(state, "tooltip").trim().length > 0;

/** Whether the specular overlay can exist: glass, and a mode (:220-235). */
export const hasSpecular = (state: PlaygroundState): boolean =>
  isGlass(state) && textValue(state, "specularMode") !== SPECULAR_DEFAULT;

/** The children are JSX rather than the label's string (:316-325). */
export const isRichLabel = (state: PlaygroundState): boolean => flag(state, "richLabel");

/** An icon-only button with nothing to say: the sr-only fallback is all it has (:322). */
export const isUnnamed = (state: PlaygroundState): boolean =>
  isIconMode(state) &&
  textValue(state, "label").trim().length === 0 &&
  textValue(state, "ariaLabel").trim().length === 0;

/** Whether the demo lives inside a `<form>`, which is the whole `type` story (:300-302). */
export const isInForm = (state: PlaygroundState): boolean => flag(state, "inForm");

/** What the last click reported — the button's own `type` attribute (:303). */
export const clickReport = (state: PlaygroundState): string =>
  textValue(state, "clickReport");

/** What the last submit reported, or `""` when the form never saw one. */
export const submitReport = (state: PlaygroundState): string =>
  textValue(state, "submitReport");

/** An `iconColor` only prints when it is a real colour, not an empty box. */
export const iconColorOf = (state: PlaygroundState): string | undefined => {
  const value = textValue(state, "iconColor").trim();
  return value.length === 0 ? undefined : value;
};

/** A leading/trailing icon's name, or `undefined` for the absent prop. */
export const iconOf = (state: PlaygroundState, id: string): string | undefined => {
  const value = textValue(state, id);
  return value === NONE || value.length === 0 ? undefined : value;
};

/** `accentColor`'s absence means "the same colour as `color`" (:151,:171). */
export const accentColorOf = (state: PlaygroundState): string | undefined => {
  const value = textValue(state, "accentColor");
  return value === NONE ? undefined : value;
};
