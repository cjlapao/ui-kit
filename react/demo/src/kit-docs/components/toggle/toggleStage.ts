import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * The single source of truth for what the Toggle playground's knobs mean. Every
 * constant here was read off `react/src/components/Toggle.tsx` at the cited line;
 * the config, the preview and the tests all read these instead of re-deciding.
 */

/** `variant = "solid"` (:200); the five values live in the theme (:3221-3227). */
export const VARIANT_DEFAULT = "solid";
/** `effectiveTone = tone ?? color ?? "blue"` (:251). */
export const TONE_DEFAULT = "blue";
/** `size = "md"` (:198), with `sizeTokens[size] ?? sizeTokens.md` behind it (:244). */
export const SIZE_DEFAULT = "md";
/** `padding = "sm"` (:199), spelled by the shared surface scale (:49-56). */
export const PADDING_DEFAULT = "sm";
/** `alignLabel = "right"` (:203). */
export const ALIGN_DEFAULT = "right";
/** `descriptionPlacement = "stacked"` (:197). */
export const PLACEMENT_DEFAULT = "stacked";
/** `vibrancy = "medium"` (:213) — only read while the variant is glass (:262). */
export const VIBRANCY_DEFAULT = "medium";
/** `glassOpacity = "frosted"` (:214) — handed to `getToggleVariantTokens` (:255). */
export const GLASS_OPACITY_DEFAULT = "frosted";
/** `specularMode = "none"` (:215). */
export const SPECULAR_DEFAULT = "none";
/** `TooltipWrapper`'s own `position = "top"` (TooltipWrapper:85), forwarded at :445. */
export const TOOLTIP_POSITION_DEFAULT = "top";
/** What the label box holds by default — the switch's accessible name (:394-410). */
export const LABEL_DEFAULT = "Email me a digest";
/** The sentinel every icon choice uses for "no icon". */
export const NONE = "none";
/** The one registry glyph pair worth showing: it fits the track at every size (:183-189). */
export const ICON_ON_EXAMPLE = "Sun";
export const ICON_OFF_EXAMPLE = "Moon";
/** The description doubles as the `aria-describedby` text, so it has to say something. */
export const DESCRIPTION_EXAMPLE = "Sent once a day, at 09:00 your time";

const read = (state: PlaygroundState, id: string): unknown => state[id];

export const textValue = (state: PlaygroundState, id: string): string => {
  const raw = read(state, id);
  return typeof raw === "string" ? raw : "";
};

export const flag = (state: PlaygroundState, id: string): boolean =>
  read(state, id) === true;

/** `label` is a `ReactNode` (:62), but the demo only ever prints a string. */
export const hasLabel = (state: PlaygroundState): boolean =>
  textValue(state, "label").trim() !== "";

/** A description is what makes `aria-describedby` and the `<label>` block exist (:229,:325). */
export const hasDescription = (state: PlaygroundState): boolean =>
  textValue(state, "description").trim() !== "";

/** `iconOn`/`iconOff` are `string | ReactElement` (:78,:80); the choice holds a name. */
export const iconOf = (state: PlaygroundState, id: string): string | undefined => {
  const raw = textValue(state, id);
  return raw === "" || raw === NONE ? undefined : raw;
};

/** `glass` is the deprecated spelling of `variant="glass"` (:91,:247). */
export const isGlass = (state: PlaygroundState): boolean =>
  flag(state, "glass") || textValue(state, "variant") === "glass";

/** The tooltip only exists when its text does (:443-448). */
export const hasTooltip = (state: PlaygroundState): boolean =>
  textValue(state, "tooltip").trim() !== "";

/** Controlled versus uncontrolled is the whole `onChange` story (:327). */
export const isControlled = (state: PlaygroundState): boolean =>
  flag(state, "controlled");

/** Which of the two spellings of the colour prints (:75,:249-251). */
export const usesLegacyColor = (state: PlaygroundState): boolean =>
  flag(state, "legacyColor");

/** The tone the track is painted with, or `undefined` while it is the documented one. */
export const toneOf = (state: PlaygroundState): string | undefined => {
  const raw = textValue(state, "tone");
  return raw === "" || raw === TONE_DEFAULT ? undefined : raw;
};

/** What the last `onChange` reported — scratch state, printed as the stage caption. */
export const changeReport = (state: PlaygroundState): string =>
  textValue(state, "report");

/** The class the row carries when the whole row is the click target (:275-285). */
export const STAGE_CLASS = "flex w-full max-w-md flex-col items-start gap-4";
