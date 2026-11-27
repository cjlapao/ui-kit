import { createElement } from "react";
import { ColorSwatches } from "@cjlapao/ui-kit";
import type { TrueColor } from "@cjlapao/ui-kit";
import type {
  PlaygroundConfig,
  PlaygroundOption,
  PlaygroundState,
} from "../../shared/playground/schema";
import {
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  toggleVariantOptions,
  trueColorOptions,
} from "../../shared/options";
import {
  ALIGN_DEFAULT,
  DESCRIPTION_EXAMPLE,
  GLASS_OPACITY_DEFAULT,
  ICON_OFF_EXAMPLE,
  ICON_ON_EXAMPLE,
  LABEL_DEFAULT,
  NONE,
  PADDING_DEFAULT,
  PLACEMENT_DEFAULT,
  SIZE_DEFAULT,
  SPECULAR_DEFAULT,
  TONE_DEFAULT,
  TOOLTIP_POSITION_DEFAULT,
  VARIANT_DEFAULT,
  VIBRANCY_DEFAULT,
  flag,
  hasDescription,
  hasTooltip,
  isGlass,
  textValue,
  usesLegacyColor,
} from "./toggleStage";

/**
 * One description of every lever this page offers: the control, the value it edits,
 * and the line of `react/src/components/Toggle.tsx` it owes the reader. Array order is
 * the order the snippet prints its attributes in; `group` only decides which accordion
 * section the control sits in.
 */

const ALIGN_OPTIONS: PlaygroundOption[] = [
  { label: "left", value: "left" },
  { label: "right", value: ALIGN_DEFAULT },
];

const PLACEMENT_OPTIONS: PlaygroundOption[] = [
  { label: "inline", value: "inline" },
  { label: "stacked", value: PLACEMENT_DEFAULT },
];

const TOOLTIP_POSITION_OPTIONS: PlaygroundOption[] = [
  "top",
  "bottom",
  "left",
  "right",
].map((value) => ({ label: value, value }));

const withNone = (label: string, values: string[]): PlaygroundOption[] => [
  { label, value: NONE },
  ...values.map((value) => ({ label: value, value })),
];

/**
 * `ColorSwatches` is a kit component and this file is a `.ts`, so the control is
 * created with `createElement` rather than JSX — one indirection, next to the field
 * that uses it.
 */
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

export const toggleConfig: PlaygroundConfig = {
  groups: [
    { id: "shape", title: "Shape", defaultOpen: true },
    { id: "content", title: "Content", defaultOpen: true },
    { id: "states", title: "States" },
    { id: "surface", title: "Glass" },
  ],
  data: [],
  fields: [
    // ── Shape ────────────────────────────────────────────────────────────────
    {
      kind: "choice",
      id: "variant",
      prop: "variant",
      label: "Variant",
      group: "shape",
      default: VARIANT_DEFAULT,
      options: toggleVariantOptions,
      emit: (value) =>
        String(value) === VARIANT_DEFAULT
          ? null
          : `variant=${JSON.stringify(value)}`,
    },
    {
      kind: "choice",
      id: "size",
      prop: "size",
      label: "Size",
      group: "shape",
      default: SIZE_DEFAULT,
      options: controlSizeOptions,
      emit: (value) =>
        String(value) === SIZE_DEFAULT ? null : `size=${JSON.stringify(value)}`,
    },
    {
      kind: "choice",
      id: "padding",
      prop: "padding",
      label: "Padding",
      group: "shape",
      default: PADDING_DEFAULT,
      options: panelPaddingOptions,
      emit: (value) =>
        String(value) === PADDING_DEFAULT
          ? null
          : `padding=${JSON.stringify(value)}`,
    },
    {
      kind: "choice",
      id: "alignLabel",
      prop: "alignLabel",
      label: "Label side",
      group: "shape",
      default: ALIGN_DEFAULT,
      options: ALIGN_OPTIONS,
      emit: (value) =>
        String(value) === ALIGN_DEFAULT
          ? null
          : `alignLabel=${JSON.stringify(value)}`,
    },
    {
      kind: "toggle",
      id: "fullWidth",
      prop: "fullWidth",
      label: "Full width",
      group: "shape",
      default: false,
    },
    {
      kind: "custom",
      id: "tone",
      prop: "tone",
      label: "Tone",
      group: "shape",
      default: TONE_DEFAULT,
      // The legacy spelling is a real prop, so it prints as one (:75,:249-251).
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
      label: "Use the deprecated `color`",
      group: "shape",
      default: false,
      emit: () => null,
    },

    // ── Content ──────────────────────────────────────────────────────────────
    {
      kind: "text",
      id: "label",
      prop: null,
      label: "Label",
      group: "content",
      default: LABEL_DEFAULT,
      placeholder: "Email me a digest",
      // The label is the switch's accessible name, so it prints even at its
      // example value — an unnamed switch is what the dev warning is for (:221).
      emit: (value) =>
        String(value).trim() === "" ? null : `label=${JSON.stringify(value)}`,
    },
    {
      kind: "text",
      id: "description",
      prop: null,
      label: "Description",
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
      label: "Description layout",
      group: "content",
      default: PLACEMENT_DEFAULT,
      options: PLACEMENT_OPTIONS,
      when: hasDescription,
      docDefault: PLACEMENT_DEFAULT,
    },
    {
      kind: "choice",
      id: "iconOn",
      prop: "iconOn",
      label: "Icon when on",
      group: "content",
      default: NONE,
      options: withNone("none", ["Check", ICON_ON_EXAMPLE, "Star", "Save"]),
      emit: (value) =>
        String(value) === NONE ? null : `iconOn=${JSON.stringify(value)}`,
    },
    {
      kind: "choice",
      id: "iconOff",
      prop: "iconOff",
      label: "Icon when off",
      group: "content",
      default: NONE,
      options: withNone("none", [ICON_OFF_EXAMPLE, "Unlock", "Trash", "Search"]),
      emit: (value) =>
        String(value) === NONE ? null : `iconOff=${JSON.stringify(value)}`,
    },

    // ── States ───────────────────────────────────────────────────────────────
    {
      kind: "toggle",
      id: "defaultChecked",
      prop: "defaultChecked",
      label: "Starts on",
      group: "states",
      default: false,
      // `defaultChecked` is the uncontrolled seed; a controlled switch ignores it.
      emit: (value, state) =>
        value === true && !flag(state as PlaygroundState, "controlled")
          ? "defaultChecked"
          : null,
    },
    {
      kind: "toggle",
      id: "controlled",
      prop: null,
      label: "Controlled by state",
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
      label: "Disabled",
      group: "states",
      default: false,
    },
    {
      kind: "toggle",
      id: "readOnly",
      prop: "readOnly",
      label: "Read only",
      group: "states",
      default: false,
    },
    {
      kind: "text",
      id: "tooltip",
      prop: null,
      label: "Tooltip",
      group: "states",
      default: "",
      placeholder: "One email a day, no more",
      emit: (value) =>
        String(value).trim() === "" ? null : `tooltip=${JSON.stringify(value)}`,
    },
    {
      kind: "choice",
      id: "tooltipPosition",
      prop: "tooltipPosition",
      label: "Tooltip position",
      group: "states",
      default: TOOLTIP_POSITION_DEFAULT,
      options: TOOLTIP_POSITION_OPTIONS,
      when: hasTooltip,
      docDefault: TOOLTIP_POSITION_DEFAULT,
    },

    // ── Glass ────────────────────────────────────────────────────────────────
    {
      kind: "toggle",
      id: "glass",
      prop: "glass",
      label: "Glass",
      group: "surface",
      default: false,
    },
    {
      kind: "choice",
      id: "vibrancy",
      prop: "vibrancy",
      label: "Vibrancy",
      group: "surface",
      default: VIBRANCY_DEFAULT,
      options: glassVibrancyOptions,
      when: isGlass,
      docDefault: VIBRANCY_DEFAULT,
    },
    {
      kind: "choice",
      id: "glassOpacity",
      prop: "glassOpacity",
      label: "Glass opacity",
      group: "surface",
      default: GLASS_OPACITY_DEFAULT,
      options: glassOpacityOptions,
      when: isGlass,
      docDefault: GLASS_OPACITY_DEFAULT,
    },
    {
      kind: "choice",
      id: "specularMode",
      prop: "specularMode",
      label: "Specular",
      group: "surface",
      default: SPECULAR_DEFAULT,
      options: panelSpecularOptions,
      when: isGlass,
      docDefault: SPECULAR_DEFAULT,
    },

    // ── Scratch (never a control, never printed) ─────────────────────────────
    {
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

/** The glass knobs are only worth showing once there is a glass surface (:248). */
export const showsGlassControls = isGlass;

/** Whether the tooltip's own controls are worth showing (:443-448). */
export const showsTooltipControls = hasTooltip;

/**
 * The host state a copied snippet needs. Printed, not quietly added: a controlled
 * switch without its `useState` is a switch that never moves (:327,:333).
 */
export const hostStateLines = (state: PlaygroundState): string[] =>
  flag(state, "controlled") ? ["const [isOn, setIsOn] = useState(false);"] : [];

/** The colour list the swatches offer — the same 21 the component accepts (:70). */
export const TONE_OPTIONS = trueColorOptions;

/** Which spelling of the colour the reader sees, for the hint's copy. */
export const toneSpelling = (state: PlaygroundState): string =>
  usesLegacyColor(state) ? "color" : "tone";

/** The text the stage prints under the switch, so a click leaves evidence. */
export const stageCaption = (state: PlaygroundState): string => {
  const value = textValue(state, "report");
  if (value !== "") return `onChange fired with checked=${value} (:327).`;
  if (flag(state, "readOnly"))
    return "Read only: the row still looks clickable, but every click is cancelled (:292-294,:328-332).";
  if (flag(state, "disabled"))
    return "Disabled: the input carries the real attribute, so nothing fires (:326).";
  return "Nothing toggled yet — the whole row is the hit area, including the label (:291-309).";
};
