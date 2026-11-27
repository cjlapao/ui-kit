import { createElement } from "react";
import { ColorSwatches } from "@cjlapao/ui-kit";
import type { MultiToggleOption, TrueColor } from "@cjlapao/ui-kit";
import type {
  PlaygroundConfig,
  PlaygroundOption,
  PlaygroundState,
} from "../../shared/playground/schema";
import {
  checkboxAlignOptions,
  checkboxDescriptionPlacementOptions,
  checkboxValidationOptions,
  controlSizeOptions,
  inputVariantOptions,
  trueColorOptions,
} from "../../shared/options";
import {
  ALIGN_DEFAULT,
  DESCRIPTION_EXAMPLE,
  INPUT_CLASS_EXAMPLE,
  LABEL_DEFAULT,
  MESSAGE_EXAMPLE,
  PLACEMENT_DEFAULT,
  SIZE_DEFAULT,
  TONE_DEFAULT,
  VALIDATION_DEFAULT,
  VARIANT_DEFAULT,
  flag,
  hasDescription,
  hasValidation,
  isControlled,
  textValue,
  usesLegacyColor,
} from "./checkboxStage";

/** The chrome wants required `label`/`value`, which `MultiToggleOption` only offers. */
const plain = (options: MultiToggleOption[]): PlaygroundOption[] =>
  options.map(({ label, value }) => ({ label: String(label), value: String(value) }));

/** The 21 accents `TrueColor` accepts — the same list the component types (:69). */
export const TONE_OPTIONS = trueColorOptions;

const renderSwatches = (
  value: string,
  onSelect: (next: string) => void,
): ReturnType<typeof createElement> =>
  createElement(ColorSwatches, {
    selectable: true,
    size: "sm",
    defaultExpanded: true,
    value: value as TrueColor,
    onSelect: (next: TrueColor) => onSelect(next),
  });

/**
 * The Checkbox config. The order of `fields` *is* the order the attributes print in,
 * so it follows the order the props are declared in `CheckboxProps` (:47-90) as far
 * as it can, then puts the state levers last.
 */
export const checkboxConfig: PlaygroundConfig = {
  groups: [
    { id: "shape", title: "Shape", defaultOpen: true },
    { id: "content", title: "Content", defaultOpen: true },
    { id: "validation", title: "Validation" },
    { id: "states", title: "States" },
  ],
  data: [],
  fields: [
    // ── Shape ────────────────────────────────────────────────────────────────
    {
      kind: "choice",
      id: "variant",
      prop: "variant",
      label: "Variant (:62,:194,:3421-3424)",
      group: "shape",
      default: VARIANT_DEFAULT,
      docDefault: VARIANT_DEFAULT,
      options: inputVariantOptions,
    },
    {
      kind: "choice",
      id: "size",
      prop: "size",
      label: "Size (:58,:193,:247)",
      group: "shape",
      default: SIZE_DEFAULT,
      docDefault: SIZE_DEFAULT,
      options: controlSizeOptions,
    },
    {
      kind: "choice",
      id: "controlAlign",
      prop: "controlAlign",
      label: "Box side (:77,:199,:412)",
      group: "shape",
      default: ALIGN_DEFAULT,
      docDefault: ALIGN_DEFAULT,
      options: plain(checkboxAlignOptions),
    },
    {
      kind: "toggle",
      id: "fullWidth",
      prop: "fullWidth",
      label: "Full width (:75,:372,:405,:414)",
      group: "shape",
      default: false,
    },
    {
      kind: "custom",
      id: "tone",
      prop: "tone",
      label: "Tone (:248,:3442-3453)",
      group: "shape",
      default: TONE_DEFAULT,
      // `tone ?? color ?? "blue"` (:248): the shared name prints as `tone`, the
      // legacy one as `color`, and the blue fallback prints as neither.
      emit: (value, state, h) => {
        const name = usesLegacyColor(state as PlaygroundState) ? "color" : "tone";
        return String(value) === TONE_DEFAULT ? null : `${name}=${h.lit(value)}`;
      },
      render: ({ state, set }) =>
        renderSwatches(String(state.tone ?? TONE_DEFAULT), (next) =>
          set("tone", next),
        ),
    },
    {
      kind: "toggle",
      id: "legacyColor",
      prop: null,
      label: "Use the deprecated `color` (:71,:248)",
      group: "shape",
      default: false,
      emit: () => null,
    },

    // ── Content ──────────────────────────────────────────────────────────────
    {
      kind: "text",
      id: "label",
      prop: null,
      label: "Label (:52,:378-396)",
      group: "content",
      default: LABEL_DEFAULT,
      placeholder: LABEL_DEFAULT,
      // The label is the box's accessible name, so it prints even at its example
      // value — an unnamed checkbox is what the dev warning is for (:215-219).
      emit: (value) =>
        String(value).trim() === "" ? null : `label=${JSON.stringify(value)}`,
    },
    {
      kind: "text",
      id: "description",
      prop: null,
      label: "Description (:54,:346-357)",
      group: "content",
      default: "",
      placeholder: DESCRIPTION_EXAMPLE,
      emit: (value) =>
        String(value).trim() === "" ? null : `description=${JSON.stringify(value)}`,
    },
    {
      kind: "choice",
      id: "descriptionPlacement",
      prop: "descriptionPlacement",
      label: "Description layout (:56,:351,:373-375)",
      group: "content",
      default: PLACEMENT_DEFAULT,
      docDefault: PLACEMENT_DEFAULT,
      options: plain(checkboxDescriptionPlacementOptions),
      when: hasDescription,
    },
    {
      kind: "toggle",
      id: "required",
      prop: "required",
      label: "Required (:86,:294,:387-394)",
      group: "content",
      default: false,
    },
    {
      kind: "text",
      id: "ariaLabel",
      prop: null,
      label: "aria-label (:215-219)",
      group: "content",
      default: "",
      placeholder: "Subscribe to the digest",
      // Only read by the development warning (:215-219), but a real attribute too —
      // it reaches the input through the spread (:295).
      emit: (value) =>
        String(value).trim() === "" ? null : `aria-label=${JSON.stringify(value)}`,
    },

    // ── Validation ───────────────────────────────────────────────────────────
    {
      kind: "choice",
      id: "validationStatus",
      prop: "validationStatus",
      label: "Validation (:82,:308-310,:428-431)",
      group: "validation",
      default: VALIDATION_DEFAULT,
      docDefault: VALIDATION_DEFAULT,
      options: plain(checkboxValidationOptions),
    },
    {
      kind: "text",
      id: "validationMessage",
      prop: null,
      label: "Message (:84,:422-436)",
      group: "validation",
      default: MESSAGE_EXAMPLE,
      placeholder: MESSAGE_EXAMPLE,
      when: hasValidation,
      emit: (value) =>
        String(value).trim() === ""
          ? null
          : `validationMessage=${JSON.stringify(value)}`,
    },

    // ── States ───────────────────────────────────────────────────────────────
    {
      kind: "toggle",
      id: "indeterminate",
      prop: "indeterminate",
      label: "Indeterminate (:73,:229,:292,:337)",
      group: "states",
      default: false,
    },
    {
      kind: "toggle",
      id: "defaultChecked",
      prop: "defaultChecked",
      label: "Starts checked (:295)",
      group: "states",
      default: false,
      // A controlled input ignores the seed, so the tag must not claim both (:295).
      emit: (value, state) =>
        isControlled(state as PlaygroundState) || value !== true
          ? null
          : "defaultChecked",
    },
    {
      kind: "toggle",
      id: "controlled",
      prop: null,
      label: "Controlled by state (:295)",
      group: "states",
      default: false,
      emit: (value) =>
        value === true
          ? "checked={isOn}\nonChange={(event) => setIsOn(event.target.checked)}"
          : null,
    },
    {
      kind: "toggle",
      id: "disabled",
      prop: "disabled",
      label: "Disabled (:205,:293,:319,:415)",
      group: "states",
      default: false,
    },
    {
      kind: "text",
      id: "inputClassName",
      prop: null,
      label: "inputClassName (:89,:320)",
      group: "states",
      default: "",
      placeholder: INPUT_CLASS_EXAMPLE,
      // The name says `input`, the class lands on the drawn box (:89,:320).
      emit: (value) =>
        String(value).trim() === ""
          ? null
          : `inputClassName=${JSON.stringify(value)}`,
    },
    {
      // Scratch state, not a prop: it holds the last value the app saw so the
      // stage can show a click left evidence (:295).
      kind: "text",
      id: "report",
      prop: null,
      label: "Last change",
      group: "states",
      default: "",
      when: () => false,
      emit: () => null,
    },
  ],
};

/** Which spelling of the colour the reader sees, for the hint's copy (:248). */
export const toneSpelling = (state: PlaygroundState): string =>
  usesLegacyColor(state) ? "color" : "tone";

/** Whether the validation message's own box is worth showing (:84). */
export const showsMessage = hasValidation;

/**
 * The host state a copied snippet needs. Printed, not quietly added: a controlled
 * checkbox without its `useState` is a checkbox that never moves (:295).
 */
export const hostStateLines = (state: PlaygroundState): string[] =>
  flag(state, "controlled") ? ["const [isOn, setIsOn] = useState(false);"] : [];

/** The text the stage prints under the box, so a click leaves evidence. */
export const stageCaption = (state: PlaygroundState): string => {
  const value = textValue(state, "report");
  if (value !== "") return `onChange fired with checked=${value} (:295).`;
  if (flag(state, "disabled"))
    return "Disabled: the input carries the real attribute, so nothing fires (:293).";
  if (flag(state, "indeterminate"))
    return "Mixed: the dash is drawn from `:indeterminate`, and a reader hears “mixed” (:292,:337).";
  return "Nothing ticked yet — the `<label>` wraps the input, so anywhere in the row activates it (:409-420).";
};
