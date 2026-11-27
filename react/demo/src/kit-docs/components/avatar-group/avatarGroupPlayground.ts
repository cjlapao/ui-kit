import type { AvatarGroupItem } from "@cjlapao/ui-kit";
import {
  controlSizeOptions,
  panelPaddingOptions,
  trueColorOptions,
} from "../../shared/options";
import type { PlaygroundConfig } from "../../shared/playground/schema";

/**
 * AvatarGroup's playground as data — the shape every remaining page will take.
 *
 * One list of options drives the controls column, the preview's props and the
 * Code view. The roster is a declared **data source**, so the snippet prints the
 * identities the strip is actually wearing rather than a `items={…}` the reader
 * has to imagine.
 *
 * Every `default` here is the component's own default, read from
 * `src/components/AvatarGroup.tsx` — none of them a matter of taste. The
 * playground therefore opens wearing the kit's defaults, the Code view opens
 * minimal, and a prop appears in it the moment the reader deviates. Nothing
 * needs `docDefault`: the opening value and the documented default are the same
 * number on purpose.
 */

const ROSTER: AvatarGroupItem[] = [
  { name: "Ada Lovelace" },
  { name: "Grace Hopper" },
  { name: "Alan Turing" },
  { name: "Katherine Johnson" },
  { name: "Linus Torvalds" },
  { name: "Margaret Hamilton" },
  { name: "Barbara Liskov" },
  { name: "PostgreSQL", icon: "Database", tone: "emerald" },
  { name: "CI bot", icon: "Cog", tone: "zinc" },
];

const ROUNDED_OPTIONS = [
  { value: "full", label: "Full" },
  { value: "lg", label: "LG" },
  { value: "md", label: "MD" },
  { value: "none", label: "None" },
];

const EXPAND_ON_OPTIONS = [
  { value: "click", label: "Click" },
  { value: "hover", label: "Hover" },
];

const MAX_VISIBLE_OPTIONS = [
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "8", label: "8" },
];

export const avatarGroupConfig: PlaygroundConfig = {
  groups: [
    { id: "chips", title: "Chips" },
    { id: "behaviour", title: "Behaviour" },
  ],
  fields: [
    {
      kind: "choice",
      id: "size",
      label: "Size",
      group: "chips",
      options: controlSizeOptions,
      default: "md",
      control: "select",
    },
    {
      kind: "choice",
      id: "padding",
      label: "Padding",
      group: "chips",
      options: panelPaddingOptions,
      default: "none",
    },
    {
      kind: "choice",
      id: "tone",
      label: "Tone",
      group: "chips",
      options: trueColorOptions,
      default: "blue",
      control: "select",
    },
    {
      kind: "choice",
      id: "rounded",
      label: "Rounded",
      group: "chips",
      options: ROUNDED_OPTIONS,
      default: "full",
    },
    {
      kind: "toggle",
      id: "border",
      label: "border",
      group: "chips",
      default: true,
    },
    {
      kind: "choice",
      id: "expandOn",
      label: "Expand on",
      group: "behaviour",
      options: EXPAND_ON_OPTIONS,
      default: "click",
    },
    {
      kind: "choice",
      id: "maxVisible",
      label: "Max visible",
      group: "behaviour",
      options: MAX_VISIBLE_OPTIONS,
      default: "5",
      // A numeric prop chosen from a segmented control: the value is a string
      // in the state and a bare number in the code.
      valueType: "number",
    },
    {
      kind: "toggle",
      id: "defaultExpanded",
      label: "defaultExpanded",
      group: "behaviour",
      default: false,
    },
    {
      kind: "toggle",
      id: "singleRow",
      label: "singleRow",
      group: "behaviour",
      default: false,
    },
  ],
  data: [
    {
      id: "roster",
      constName: "ROSTER",
      prop: "items",
      label: "The roster",
      note: "seven people and two app chips — the chips carry their own tone, so the group's is a fallback",
      emit: "literal",
      value: () => ROSTER,
    },
  ],
};
