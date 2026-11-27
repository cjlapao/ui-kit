import { createElement } from "react";
import {
  gradientBackdropSchemeOptions,
  gradientBackdropTemplateOptions,
} from "../../shared/options";
import type {
  PlaygroundConfig,
  PlaygroundOption,
  PlaygroundState,
} from "../../shared/playground/schema";
import type { GradientBackdropRole } from "@cjlapao/ui-kit";
import {
  ColorLever,
  ROLES,
  SAMPLE,
  STAGE_CLASS,
  STAGE_OPTIONS,
  overlayFor,
  themeFor,
} from "./gradientBackdropStage";

/**
 * Gradient Backdrop's playground as data.
 *
 * Every `default` is the destructuring at `GradientBackdrop.tsx:55` —
 * `theme="slate"`, `scheme="auto"`, `noise` off, `noiseScale` absent — so the
 * stage opens on the kit's own template and the Code view opens with two
 * attributes at most.
 *
 * Two of the controls are not props at all: `source` and `sides` decide
 * *which* value `theme` holds, so they carry `prop: null` and can never leak
 * into the snippet. `noiseScale` is the knob that needs a partner — the
 * component reads it only inside the `noise &&` layer (GradientBackdrop.tsx:87)
 * — so it is hidden, and unprinted, while noise is off.
 */

const SOURCE_OPTIONS: PlaygroundOption[] = [
  { value: "template", label: "Template" },
  { value: "custom", label: "Custom theme" },
];

const SIDES_OPTIONS: PlaygroundOption[] = [
  { value: "light", label: "Light only" },
  { value: "dark", label: "Dark only" },
  { value: "both", label: "Both" },
];

const SCALE_OPTIONS: PlaygroundOption[] = [
  { value: "auto", label: "Auto" },
  { value: "0.25", label: "0.25" },
  { value: "0.5", label: "0.5" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
];

const isCustom = (state: PlaygroundState): boolean =>
  String(state.source ?? "template") === "custom";

const stateKey = (side: "light" | "dark", role: string): string =>
  `${side}${role[0].toUpperCase()}${role.slice(1)}`;

/** One hex of the sample theme; a fixture colour, so it never prints by itself. */
const colourField = (side: "light" | "dark", role: GradientBackdropRole) => ({
  kind: "custom" as const,
  id: stateKey(side, role),
  group: "theme",
  label: `${side === "light" ? "Light" : "Dark"} ${role}`,
  prop: null,
  default: SAMPLE[side][role],
  when: (state: PlaygroundState) =>
    isCustom(state) &&
    (side === "light"
      ? String(state.sides ?? "light") !== "dark"
      : String(state.sides ?? "light") !== "light"),
  render: ({ state, set }: { state: PlaygroundState; set: (id: string, v: string) => void }) =>
    createElement(ColorLever, {
      role,
      side,
      value: state[stateKey(side, role)],
      onChange: (hex: string) => set(stateKey(side, role), hex),
    }),
});

export const gradientBackdropConfig: PlaygroundConfig = {
  groups: [
    { id: "theme", title: "Theme", defaultOpen: true },
    { id: "scheme", title: "Scheme", defaultOpen: true },
    { id: "texture", title: "Texture" },
    { id: "stage", title: "The stage" },
  ],
  fields: [
    {
      kind: "choice",
      id: "size",
      group: "stage",
      label: "Stage",
      // The one attribute that must print even at its default: without a height
      // the reader gets a 0px div and no idea why (see STAGE_CLASS).
      prop: "className",
      options: STAGE_OPTIONS as PlaygroundOption[],
      default: STAGE_CLASS,
      alwaysEmit: true,
      control: "select",
    },
    {
      kind: "choice",
      id: "source",
      group: "theme",
      label: "Theme source",
      options: SOURCE_OPTIONS,
      default: "template",
      prop: null,
    },
    {
      kind: "choice",
      id: "template",
      group: "theme",
      label: "Template",
      // The id is the docs' handle; the prop it fills is `theme`, and off
      // "slate" (GradientBackdrop.tsx:55) is the only thing worth printing.
      prop: "theme",
      options: gradientBackdropTemplateOptions as PlaygroundOption[],
      default: "slate",
      control: "select",
      when: (state) => !isCustom(state),
    },
    {
      kind: "choice",
      id: "sides",
      group: "theme",
      label: "Colours given",
      options: SIDES_OPTIONS,
      default: "light",
      prop: null,
      when: isCustom,
    },
    ...ROLES.map((role) => colourField("light", role)),
    ...ROLES.map((role) => colourField("dark", role)),
    {
      kind: "choice",
      id: "scheme",
      group: "scheme",
      label: "Scheme",
      options: gradientBackdropSchemeOptions as PlaygroundOption[],
      default: "auto",
    },
    { kind: "toggle", id: "noise", group: "texture", label: "Noise (film grain)", default: false },
    {
      kind: "choice",
      id: "noiseScale",
      group: "texture",
      label: "Grain scale",
      options: SCALE_OPTIONS,
      default: "auto",
      // A number prop chosen from a segmented control: string in the state,
      // bare in the code. `auto` is the absent value — the component keeps its
      // own automatic sizing when noiseScale is undefined.
      valueType: "number",
      when: (state) => Boolean(state.noise),
    },
  ],
  data: [
    {
      id: "theme",
      constName: "THEME",
      prop: "theme",
      label: "The custom theme",
      note: "the side you hid is not in here: the component derives it (deriveDarkColor / deriveLightColor, common/backdrop/gradient.ts:149,156)",
      // Not a literal: it is a nested object, and which of its two keys exists
      // is what the reader is demonstrating. `value` feeds the stage, `source`
      // feeds the Code view, both from `themeFor`.
      emit: "source",
      value: (state) => themeFor(state),
      source: (state, h) => {
        const theme = themeFor(state) as {
          light?: Record<string, string>;
          dark?: Record<string, string>;
        };
        const entries: string[] = [];
        if (theme.light) entries.push(`light: ${h.lit(theme.light)}`);
        if (theme.dark) entries.push(`dark: ${h.lit(theme.dark)}`);
        return h.object(entries);
      },
      when: isCustom,
    },
    {
      id: "overlay",
      // Children are content, not an attribute: the page's `code` places it.
      prop: null,
      label: "The panel on the backdrop",
      note: "printed as the JSX the stage is mounting",
      emit: "literal",
      value: () => overlayFor(),
    },
  ],
};
