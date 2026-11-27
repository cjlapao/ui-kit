import { createElement } from "react";
import type { ChangeEvent } from "react";
import { ColorSwatches } from "@cjlapao/ui-kit";
import type { MultiToggleOption, TrueColor } from "@cjlapao/ui-kit";
import type {
  PlaygroundConfig,
  PlaygroundOption,
} from "../../shared/playground/schema";
import { controlSizeOptions } from "../../shared/options";
import { CLUSTERS } from "./headerGroupFixture";
import type { Cluster } from "./headerGroupFixture";
import { CLUSTER_NAMES } from "./headerGroupFixture";
import {
  DEFAULT_BAR,
  DEFAULT_DIRECTION,
  DEFAULT_GROUPS,
  DEFAULT_SEPARATOR,
  DEFAULT_SURFACE,
  DIRECTIONS,
  MAX_BAR,
  MAX_GROUPS,
  MIN_BAR,
  MIN_GROUPS,
  RAW_PIXELS,
  SEPARATOR_SCALE,
  SURFACES,
  barHeight,
  groupCount,
  isRawPixels,
  isToned,
} from "./headerGroupStage";

/**
 * Header Group's controls.
 *
 * The component has seven props of its own (:76-96 of `HeaderGroup.tsx`), and the
 * interesting decision in each case is whether the value is the *component's*
 * default or the *docs'* default:
 *
 *   - `gap` and `itemGap` open on `sm` and `xs` (:101-102), so they stay silent
 *     until the reader moves them — and `gap` earns its line, because one value
 *     becomes both the margin between groups and the rule's offset (the two
 *     custom properties at :162,:165-167, pinned by `HeaderGroup.test.tsx:28-40`).
 *   - `separatorSize` is a union (`ControlSize | number`, :88), so the control
 *     carries the five named steps *and* two raw pixel values, and its own `emit`
 *     decides whether to print `separatorSize="md"` or `separatorSize={2}`.
 *   - `tone` has no default at all (:105): untoned, the rule is a quarter of the
 *     group's own copy colour (:177). So `toned` is a stage lever (`prop: null`)
 *     that only reveals the swatches, and the tone prints only when it exists.
 *   - `label` is the accessible name (:95,:151), which is why the naming control
 *     is a choice rather than a text box: the honest demo names its clusters, and
 *     the Code view says so with `label={group.label}` — because the groups are
 *     mapped from a fixture, not typed one at a time.
 *
 * The four stage levers (`groups`, `barHeight`, `direction`, `surface`) are
 * `prop: null`: they shape the bar the groups sit in, and none of them is a prop
 * of this component.
 */

/*
 * `MultiToggleOption`'s members are all optional and its `label` is a ReactNode,
 * while `PlaygroundOption` requires both and narrows `label` to a string — so the
 * shared lists arrive as the loose shape and leave as the strict one.
 */
const options = (list: readonly MultiToggleOption[]): PlaygroundOption[] =>
  list as unknown as PlaygroundOption[];

const DIRECTION_CHOICES = options(
  DIRECTIONS.map((value) => ({
    label: value === "rtl" ? "RTL" : "LTR",
    value,
  })),
);

const SURFACE_CHOICES = options(
  SURFACES.map((value) => ({
    label: value === "outlined" ? "Outlined" : value === "glass" ? "Glass" : value === "subtle" ? "Subtle" : "Elevated",
    value,
  })),
);

const SEPARATOR_CHOICES = options([
  ...SEPARATOR_SCALE.map((value) => ({ label: value, value })),
  ...RAW_PIXELS.map((value) => ({ label: `${value} px`, value })),
]);

/** The clusters are named from the fixture, so the choice is name them or not. */
const NAMING_CHOICES = options([
  { label: "Named", value: "named" },
  { label: "Unnamed", value: "unnamed" },
]);

/** A range input with its value in the label — the stage's only numeric lever. */
const Slider = (props: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (value: number) => void;
}) =>
  createElement(
    "label",
    { className: "flex flex-col gap-1 text-xs" },
    createElement(
      "span",
      { className: "opacity-70" },
      `${props.label} — ${props.value}${props.suffix}`,
    ),
    createElement("input", {
      type: "range",
      min: props.min,
      max: props.max,
      value: props.value,
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        props.onChange(Number(event.target.value)),
      className: "w-full accent-blue-500",
    }),
  );

export const headerGroupConfig: PlaygroundConfig = {
  groups: [
    { id: "stage", title: "Bar", defaultOpen: true },
    { id: "rows", title: "Gaps", defaultOpen: true },
    { id: "separator", title: "Separator", defaultOpen: true },
    { id: "naming", title: "Naming" },
    { id: "root", title: "Root" },
  ],
  fields: [
    // ── The bar the groups sit in. None of these is a prop. ──────────────────
    {
      id: "groups",
      label: "Clusters",
      group: "stage",
      kind: "custom",
      prop: null,
      default: DEFAULT_GROUPS,
      // One group draws no rule at all — the rule belongs to the second of two
      // adjacent groups (:62, and the component's own note at :37-39). Two is
      // where the component starts earning its keep.
      render: ({ state, set }) =>
        createElement(Slider, {
          label: "Clusters",
          value: groupCount(state),
          min: MIN_GROUPS,
          max: MAX_GROUPS,
          suffix: "",
          onChange: (value) => set("groups", value),
        }),
    },
    {
      id: "barHeight",
      label: "Bar height",
      group: "stage",
      kind: "custom",
      prop: null,
      default: DEFAULT_BAR,
      // The rule is `top-1/4` + `h-1/2` (:66-67) of the group, which is `h-full`
      // (:153) of the bar — so the bar's height is the rule's length.
      render: ({ state, set }) =>
        createElement(Slider, {
          label: "Bar height",
          value: barHeight(state),
          min: MIN_BAR,
          max: MAX_BAR,
          suffix: " px",
          onChange: (value) => set("barHeight", value),
        }),
    },
    {
      id: "direction",
      label: "Direction",
      group: "stage",
      kind: "choice",
      prop: null,
      default: DEFAULT_DIRECTION,
      options: DIRECTION_CHOICES,
    },
    {
      id: "surface",
      label: "Header surface",
      group: "stage",
      kind: "choice",
      prop: null,
      // Panel's own default is `elevated` (Panel.tsx:654); the docs show the
      // outlined bar, which is what a header card usually is.
      default: DEFAULT_SURFACE,
      options: SURFACE_CHOICES,
    },

    // ── The two gap ladders. ─────────────────────────────────────────────────
    {
      id: "gap",
      label: "Between groups",
      group: "rows",
      kind: "choice",
      prop: "gap",
      default: "sm", // :101
      options: options(controlSizeOptions),
    },
    {
      id: "itemGap",
      label: "Within a group",
      group: "rows",
      kind: "choice",
      prop: "itemGap",
      default: "xs", // :102
      options: options(controlSizeOptions),
    },

    // ── The rule between two adjacent groups. ────────────────────────────────
    {
      id: "divider",
      label: "Draw the rule",
      group: "separator",
      kind: "toggle",
      prop: "divider",
      // Default-true (:103): unchecking it prints `divider={false}`, which drops
      // the whole `[&+&…]` ladder (:157) rather than recolouring it.
      default: true,
    },
    {
      id: "separatorSize",
      label: "Rule thickness",
      group: "separator",
      kind: "choice",
      prop: "separatorSize",
      default: DEFAULT_SEPARATOR, // :104
      options: SEPARATOR_CHOICES,
      // The union at :88: a named step prints quoted, a number prints bare.
      emit: (value) => {
        const raw = String(value ?? DEFAULT_SEPARATOR);
        if (raw === DEFAULT_SEPARATOR) return null;
        return isRawPixels(raw)
          ? `separatorSize={${raw}}`
          : `separatorSize=${JSON.stringify(raw)}`;
      },
    },
    {
      id: "toned",
      label: "Tone the rule",
      group: "separator",
      kind: "toggle",
      prop: null,
      // Not a prop: it is the difference between `tone` existing and :177.
      default: false,
    },
    {
      id: "tone",
      label: "Rule tone",
      group: "separator",
      kind: "custom",
      prop: "tone",
      default: "blue",
      when: isToned,
      emit: (value) => `tone=${JSON.stringify(value)}`,
      render: ({ state, set }) =>
        createElement(ColorSwatches, {
          selectable: true,
          size: "sm",
          defaultExpanded: true,
          value: String(state.tone ?? "blue") as TrueColor,
          onSelect: (next: TrueColor) => set("tone", next),
        }),
    },

    // ── The accessible name. ─────────────────────────────────────────────────
    {
      id: "labelling",
      label: "Name each cluster",
      group: "naming",
      kind: "choice",
      prop: "label",
      default: "named",
      options: NAMING_CHOICES,
      // `role="group"` is applied unconditionally (:150); only the name is the
      // reader's call, and an unnamed group is usually skipped.
      emit: (value) =>
        String(value ?? "named") === "unnamed" ? null : "label={group.label}",
    },

    // ── The root. ────────────────────────────────────────────────────────────
    {
      id: "className",
      label: "Class",
      group: "root",
      kind: "text",
      prop: "className",
      // Appended last by `classNames` (:152-159), so it adds to the layout and the
      // surface copy rather than replacing either.
      default: "",
      emit: (value) => {
        const text = String(value ?? "").trim();
        return text === "" ? null : `className=${JSON.stringify(text)}`;
      },
    },
  ],
  data: [
    {
      id: "clusters",
      constName: "GROUPS",
      // Not an attribute: the element receives `{group.content}` from the map,
      // and `label` comes from the same object, so this fixture feeds two places
      // and belongs to neither on its own.
      prop: null,
      label: "The clusters, in reading order",
      note: "Handwritten for this page — one cluster per concern, so two rules are always visible.",
      emit: "source",
      // The preview mounts `CLUSTERS` itself; this is the same fixture reduced to
      // what a value-only reader would care about.
      value: () => CLUSTERS.map((cluster) => cluster.label),
      // Printed from the elements the preview mounts, so the const cannot drift
      // from the pixels the reader is looking at.
      source: (_state, h) => {
        const line = (text: string, spaces: number) => h.indent(text, spaces);
        const entry = (cluster: Cluster) => {
          const markup = h.jsx(cluster.content, { names: CLUSTER_NAMES });
          // `content: ( … )` across its own lines, the way a file would be written.
          // Each piece is placed at its final column — padding a whole multi-line
          // value would move the closing paren with it.
          const body = [
            "{",
            line(`label: ${JSON.stringify(cluster.label)},`, 2),
            "  content: (",
            line(markup, 4),
            "  ),",
            "}",
          ].join("\n");
          return line(body, 2);
        };
        return `[\n${CLUSTERS.map(entry).join(",\n")}\n]`;
      },
    },
  ],
};
