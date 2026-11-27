import { createElement } from "react";
import { ColorSwatches } from "@cjlapao/ui-kit";
import type { TrueColor } from "@cjlapao/ui-kit";
import type {
  PlaygroundConfig,
  PlaygroundOption,
  PlaygroundState,
} from "../../shared/playground/schema";
import {
  buttonSizeOptions,
  buttonVariantOptions,
  buttonWeightOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelSpecularOptions,
  trueColorOptions,
} from "../../shared/options";
import {
  COLOR_DEFAULT,
  GLASS_OPACITY_DEFAULT,
  NONE,
  SIZE_DEFAULT,
  SPECULAR_DEFAULT,
  TOOLTIP_DELAY_DEFAULT,
  TOOLTIP_POSITION_DEFAULT,
  TYPE_DEFAULT,
  VARIANT_DEFAULT,
  VIBRANCY_DEFAULT,
  WEIGHT_DEFAULT,
  LABEL_DEFAULT,
  flag,
  hasTooltip,
  iconOf,
  isGlass,
} from "./buttonStage";

/**
 * One description of every lever this page offers: the control, the value it
 * edits, and the line of source it owes the reader. Line citations in a label are
 * the line in `react/src/components/Button.tsx` that was read to write the row —
 * the controls column is documentation, so it cites.
 *
 * Array order is the order the snippet prints its attributes in; `group` only
 * decides which accordion section the control sits in.
 */

const LEADING_ICONS = ["Search", "Download", "Save", "Star", "Trash"];
const TRAILING_ICONS = ["ArrowDown", "ChevronRight", "Rocket", "Star", "Trash"];

const withNone = (label: string, values: string[]): PlaygroundOption[] => [
  { label, value: NONE },
  ...values.map((value) => ({ label: value, value })),
];

const tooltipPositionOptions: PlaygroundOption[] = [
  "top",
  "bottom",
  "left",
  "right",
].map((value) => ({ label: value, value }));

const typeOptions: PlaygroundOption[] = [
  { label: TYPE_DEFAULT, value: TYPE_DEFAULT },
  { label: "submit", value: "submit" },
  { label: "reset", value: "reset" },
];

/** `accentColor`'s absence is a real answer: the hover follows `color` (:180-184). */
const accentColorOptions: PlaygroundOption[] = [
  { label: "same as color", value: NONE },
  ...trueColorOptions,
];

/** A registry name prints as a string prop; the sentinel prints nothing. */
const iconEmit =
  (id: string) =>
  (_value: unknown, state: PlaygroundState): string | null => {
    const name = iconOf(state, id);
    return name === undefined ? null : `${id}="${name}"`;
  };

export const buttonConfig: PlaygroundConfig = {
  groups: [
    { id: "shape", title: "Shape", defaultOpen: true },
    { id: "colour", title: "Colour", defaultOpen: true },
    { id: "content", title: "Content", defaultOpen: true },
    { id: "states", title: "States" },
    { id: "tooltip", title: "Tooltip" },
    { id: "glass", title: "Glass" },
  ],
  fields: [
    // ── Shape ────────────────────────────────────────────────────────────────
    {
      kind: "choice",
      id: "variant",
      prop: "variant",
      label: "Variant (:116,:150,:189)",
      group: "shape",
      default: VARIANT_DEFAULT,
      options: buttonVariantOptions,
    },
    {
      kind: "choice",
      id: "size",
      prop: "size",
      label: "Size (:118,:148,:241)",
      group: "shape",
      default: SIZE_DEFAULT,
      options: buttonSizeOptions,
    },
    {
      kind: "choice",
      id: "weight",
      prop: "weight",
      label: "Weight (:119,:243)",
      group: "shape",
      default: WEIGHT_DEFAULT,
      options: buttonWeightOptions,
    },
    {
      kind: "toggle",
      id: "fullWidth",
      prop: "fullWidth",
      label: "Full width (:120,:244)",
      group: "shape",
      default: false,
    },
    {
      kind: "toggle",
      id: "iconOnly",
      prop: "iconOnly",
      label: "Icon only (:124,:150,:316-325)",
      group: "shape",
      default: false,
    },

    // ── Colour ───────────────────────────────────────────────────────────────
    {
      kind: "custom",
      id: "color",
      prop: "color",
      label: "Color (:117,:149)",
      group: "colour",
      default: COLOR_DEFAULT,
      emit: (value, _state, h) =>
        String(value) === COLOR_DEFAULT ? null : `color=${h.lit(value)}`,
      render: ({ state, set }) =>
        // A colour decision, picked from the 21 swatches rather than typed.
        renderSwatches(String(state.color ?? COLOR_DEFAULT), (next) =>
          set("color", next),
        ),
    },
    {
      kind: "choice",
      id: "accentColor",
      prop: "accentColor",
      label: "Accent color (:64,:151,:169-184)",
      group: "colour",
      default: NONE,
      options: accentColorOptions,
      emit: (value) =>
        String(value) === NONE ? null : `accentColor=${JSON.stringify(value)}`,
    },
    {
      kind: "toggle",
      id: "accent",
      prop: "accent",
      label: "Accent (:63,:158-164)",
      group: "colour",
      default: false,
    },
    {
      kind: "toggle",
      id: "active",
      prop: "active",
      label: "Active (:72,:170-179)",
      group: "colour",
      default: false,
    },

    // ── Content ──────────────────────────────────────────────────────────────
    {
      kind: "text",
      id: "label",
      prop: null,
      label: "Label (children, :82,:268-273,:324)",
      group: "content",
      default: LABEL_DEFAULT,
      emit: () => null,
      placeholder: "Leave empty to see the fallback name",
    },
    {
      kind: "toggle",
      id: "richLabel",
      prop: null,
      label: "Rich label (:268-273,:322)",
      group: "content",
      default: false,
      emit: () => null,
    },
    {
      kind: "choice",
      id: "leadingIcon",
      prop: "leadingIcon",
      label: "Leading icon (:59,:279-295,:315)",
      group: "content",
      default: NONE,
      options: withNone("none", LEADING_ICONS),
      emit: iconEmit("leadingIcon"),
    },
    {
      kind: "choice",
      id: "trailingIcon",
      prop: "trailingIcon",
      label: "Trailing icon (:60,:326)",
      group: "content",
      default: NONE,
      options: withNone("none", TRAILING_ICONS),
      emit: iconEmit("trailingIcon"),
    },
    {
      kind: "text",
      id: "iconColor",
      prop: "iconColor",
      label: "Icon color (:70,:286-294)",
      group: "content",
      default: "",
      placeholder: "#f59e0b",
      emit: (value) => {
        const colour = String(value ?? "").trim();
        return colour === "" ? null : `iconColor=${JSON.stringify(colour)}`;
      },
    },

    // ── States ───────────────────────────────────────────────────────────────
    {
      kind: "choice",
      id: "type",
      prop: "type",
      label: "type (:141,:300-303)",
      group: "states",
      default: TYPE_DEFAULT,
      options: typeOptions,
    },
    {
      kind: "text",
      id: "ariaLabel",
      prop: "aria-label",
      label: "aria-label (:261-263,:268-273)",
      group: "states",
      default: "",
      placeholder: "Name it when the label is a glyph",
    },
    {
      kind: "toggle",
      id: "open",
      prop: "aria-expanded",
      label: "Popup is open (:211-218,:312)",
      group: "states",
      default: false,
      emit: (value) => (value === true ? "aria-expanded={true}" : null),
    },
    {
      kind: "toggle",
      id: "loading",
      prop: "loading",
      label: "Loading (:123,:239,:250-258,:305,:315,:326)",
      group: "states",
      default: false,
    },
    {
      kind: "toggle",
      id: "disabled",
      prop: "disabled",
      label: "Disabled (:135,:260,:305)",
      group: "states",
      default: false,
    },
    {
      kind: "toggle",
      id: "onClick",
      prop: "onClick",
      label: "Wire a click handler (:136,:311)",
      group: "states",
      default: false,
      emit: (value) =>
        value === true ? "onClick={() => setClicked(true)}" : null,
    },
    {
      kind: "toggle",
      id: "inForm",
      prop: null,
      label: "Sit it in a form (:300-303)",
      group: "states",
      default: false,
      emit: () => null,
    },
    // Scratch state for the two captions under the preview. `when: () => false`
    // keeps the control out of the column; `emit: () => null` keeps it out of the
    // snippet; `prop: null` keeps it out of the tag.
    {
      kind: "text",
      id: "clickReport",
      prop: null,
      label: "Last click",
      group: "states",
      default: "",
      when: () => false,
      emit: () => null,
    },
    {
      kind: "text",
      id: "submitReport",
      prop: null,
      label: "Last submit",
      group: "states",
      default: "",
      when: () => false,
      emit: () => null,
    },

    // ── Tooltip ──────────────────────────────────────────────────────────────
    {
      kind: "text",
      id: "tooltip",
      prop: "tooltip",
      label: "Tooltip (:84,:330-341)",
      group: "tooltip",
      default: "",
      placeholder: "What this button does",
    },
    {
      kind: "choice",
      id: "tooltipPosition",
      prop: "tooltipPosition",
      label: "Tooltip position (:86,:334)",
      group: "tooltip",
      default: TOOLTIP_POSITION_DEFAULT,
      docDefault: TOOLTIP_POSITION_DEFAULT,
      options: tooltipPositionOptions,
      when: hasTooltip,
    },
    {
      kind: "number",
      id: "tooltipDelay",
      prop: "tooltipDelay",
      label: "Tooltip delay (ms, :91,:335)",
      group: "tooltip",
      default: TOOLTIP_DELAY_DEFAULT,
      docDefault: TOOLTIP_DELAY_DEFAULT,
      min: 0,
      max: 3000,
      step: 100,
      when: hasTooltip,
    },
    {
      kind: "toggle",
      id: "tooltipDisabled",
      prop: "tooltipDisabled",
      label: "Tooltip suppressed (:92-94,:336)",
      group: "tooltip",
      default: false,
      when: hasTooltip,
    },

    // ── Glass ────────────────────────────────────────────────────────────────
    {
      kind: "toggle",
      id: "glass",
      prop: "glass",
      label: "Glass (:74,:189-200)",
      group: "glass",
      default: false,
    },
    {
      kind: "choice",
      id: "vibrancy",
      prop: "vibrancy",
      label: "Vibrancy (:76,:197)",
      group: "glass",
      default: VIBRANCY_DEFAULT,
      options: glassVibrancyOptions,
      when: isGlass,
    },
    {
      kind: "choice",
      id: "glassOpacity",
      prop: "glassOpacity",
      label: "Glass opacity (:78,:196)",
      group: "glass",
      default: GLASS_OPACITY_DEFAULT,
      options: glassOpacityOptions,
      when: isGlass,
    },
    {
      kind: "choice",
      id: "specularMode",
      prop: "specularMode",
      label: "Specular (:80,:220-235)",
      group: "glass",
      default: SPECULAR_DEFAULT,
      options: panelSpecularOptions,
      when: isGlass,
    },
  ],
};

/**
 * `ColorSwatches` is a kit component and this file is a `.ts`, so the control is
 * created with `createElement` rather than JSX — one indirection, next to the
 * field that uses it.
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

/** The glass knobs are only worth showing once there is a glass surface (:189). */
export const showsGlassControls = isGlass;

/**
 * The `<form>` the page can wrap the button in. Printed, not quietly added: the
 * whole point of the control is what `type` does to a form (:300-303), and a reader
 * copying the snippet needs the element the button is sitting in.
 */
export const FORM_PROPS = [
  "onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}",
];

/** The `useState` calls the printed demo declares, in the order it declares them. */
export const hostStateLines = (state: PlaygroundState): string[] => {
  const lines: string[] = [];
  if (flag(state, "onClick")) {
    lines.push("const [clicked, setClicked] = useState(false);");
  }
  if (flag(state, "inForm")) {
    lines.push("const [submitted, setSubmitted] = useState(false);");
  }
  return lines;
};
