import { createElement } from "react";
import type { MultiToggleOption, SurfaceTone } from "@cjlapao/ui-kit";
import type {
  PlaygroundConfig,
  PlaygroundOption,
} from "../../shared/playground/schema";
import { SurfaceToneSwatches } from "../../shared/SurfaceToneControl";
import {
  appDividerSpacingOptions,
  appDividerVariantOptions,
  controlSizeOptions,
} from "../../shared/options";
import {
  decorativeChoice,
  hasLabel,
  isBadgeLabel,
  LABEL_NODE_JSX,
  LABEL_TEXT,
} from "./appDividerStage";

/**
 * App Divider's controls.
 *
 * Two of the props are three-state, and a toggle would lie about both:
 *
 *   - **`decorative`** defaults to `!label` (:130). Absent is not `false` — it
 *     means "hidden, unless the rule has something to say", so this is a
 *     three-way choice: inherit, force hidden, force announced. Forcing it on an
 *     unlabelled rule publishes `role="separator"` with no accessible name, which
 *     the hint says out loud.
 *   - **`length`** defaults to `1.5rem` vertical and `100%` horizontal (:117), so
 *     "Auto" is a real third answer and prints nothing.
 *
 * `tone` is absent rather than a colour: an untoned rule takes the surrounding
 * surface's `divider` token through `useSurfaceText` (:170), which is the whole
 * reason the rule adapts on glass. The swatch row has a `none` swatch, and
 * choosing it prints nothing — `tone="none"` is not a thing this component
 * accepts (`tone` is `TrueColor`, :63).
 *
 * The deprecated `height` / `width` / `margin` aliases (:83-88, honoured at
 * :117-128) deliberately get no control: the playground prints the props a reader
 * should write, and the API table names the aliases instead.
 */

/*
 * `MultiToggleOption`'s members are all optional and its `label` is a ReactNode,
 * while `PlaygroundOption` requires both and narrows `label` to a string — so the
 * shared lists arrive as the loose shape and leave as the strict one.
 */
const options = (list: readonly MultiToggleOption[]): PlaygroundOption[] =>
  list as unknown as PlaygroundOption[];

export const appDividerConfig: PlaygroundConfig = {
  groups: [
    { id: "rule", title: "Rule", defaultOpen: true },
    { id: "label", title: "Label", defaultOpen: true },
    { id: "context", title: "Context", defaultOpen: true },
  ],
  fields: [
    // ── The rule itself. ─────────────────────────────────────────────────────
    {
      id: "orientation",
      label: "Orientation",
      group: "rule",
      kind: "choice",
      prop: "orientation",
      // Vertical is the documented default (:54-56) — the component was written
      // for header sections and says so.
      default: "vertical",
      options: options([
        { label: "Vertical", value: "vertical" },
        { label: "Horizontal", value: "horizontal" },
      ]),
    },
    {
      id: "variant",
      label: "Variant",
      group: "rule",
      kind: "choice",
      prop: "variant",
      default: "solid",
      options: options(appDividerVariantOptions),
    },
    {
      id: "tone",
      label: "Tone",
      group: "rule",
      kind: "custom",
      prop: "tone",
      // Absent is the useful answer: the rule then borrows the surface's own
      // divider colour (:170), which is what keeps it visible on glass.
      default: "none",
      emit: (value) => (value === "none" ? null : `tone=${JSON.stringify(value)}`),
      render: ({ state, set }) =>
        createElement(SurfaceToneSwatches, {
          value: String(state.tone ?? "none") as SurfaceTone,
          onSelect: (next: SurfaceTone) => set("tone", next),
        }),
    },
    {
      id: "size",
      label: "Thickness",
      group: "rule",
      kind: "choice",
      prop: "size",
      // 1px on the shared control scale (:26-32, :98).
      default: "xs",
      options: options(controlSizeOptions),
    },
    {
      id: "spacing",
      label: "Spacing",
      group: "rule",
      kind: "choice",
      prop: "spacing",
      // `mx-2` / `my-2` on the rule's cross axis (:35-45, :119-122).
      default: "sm",
      options: options(appDividerSpacingOptions),
    },
    {
      id: "length",
      label: "Length",
      group: "rule",
      kind: "choice",
      prop: "length",
      // Auto is the orientation-dependent answer (:117): 1.5rem vertical, 100%
      // horizontal — so it prints nothing rather than a value that contradicts it.
      default: "auto",
      options: options([
        { label: "Auto", value: "auto" },
        { label: "24 px", value: "24" },
        { label: "48 px", value: "48" },
        { label: "96 px", value: "96" },
      ]),
      emit: (value) =>
        value === "auto" ? null : `length={${Number(value)}}`,
    },

    // ── The label: decoration versus an announced separator. ─────────────────
    {
      id: "withLabel",
      label: "Labelled",
      group: "label",
      kind: "toggle",
      prop: null,
      // The docs show the labelled rule, because that is the branch with the
      // semantics in it (:206-210).
      default: true,
    },
    {
      id: "label",
      label: "Label",
      group: "label",
      kind: "text",
      prop: "label",
      default: LABEL_TEXT,
      when: (state) => (state.withLabel ?? true) !== false,
      // No component default to compare against (:74): the prop's presence is the
      // difference between decoration and a separator, so it always prints.
      emit: (value, state, h) => {
        if (!hasLabel(state)) return null;
        if (isBadgeLabel(state)) return `label={${LABEL_NODE_JSX}}`;
        return `label=${h.lit(String(value))}`;
      },
    },
    {
      id: "labelKind",
      label: "Label is",
      group: "label",
      kind: "choice",
      prop: null,
      default: "text",
      when: (state) => hasLabel(state),
      options: options([
        { label: "Text", value: "text" },
        { label: "A node (Pill)", value: "badge" },
      ]),
    },
    {
      id: "labelPosition",
      label: "Label position",
      group: "label",
      kind: "choice",
      prop: "labelPosition",
      default: "center",
      options: options([
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
      ]),
      // With no label there is no position to state: the placement branches
      // (:199-204) only run inside the labelled layout, so the prop is meaningless
      // — and printing it would describe a rule the component ignores.
      when: (state) => hasLabel(state),
    },
    {
      id: "decorative",
      label: "Decorative",
      group: "label",
      kind: "choice",
      prop: "decorative",
      // `decorative ?? !label` (:130) — absent is its own answer, so this is a
      // three-way control, not a toggle.
      default: "auto",
      options: options([
        { label: "Inherit", value: "auto" },
        { label: "Yes — hide it", value: "yes" },
        { label: "No — announce it", value: "no" },
      ]),
      emit: (_value, state) => {
        const choice = decorativeChoice(state);
        if (choice === "auto") return null;
        return `decorative={${choice === "yes"}}`;
      },
    },

    // ── Context: what the rule sits on, and the pass-through root. ───────────
    {
      id: "context",
      label: "Sits on",
      group: "context",
      kind: "choice",
      prop: null,
      default: "outlined",
      options: options([
        { label: "The page", value: "plain" },
        { label: "Outlined card", value: "outlined" },
        { label: "Liquid-glass card", value: "liquid-glass" },
      ]),
    },
    {
      id: "className",
      label: "Class name",
      group: "context",
      kind: "text",
      prop: "className",
      // The wrapper is `classNames("flex items-center", …, className)` (:211-216)
      // and every other DOM prop rides through `...rest` (:218).
      default: "",
      emit: (value, _state, h) =>
        String(value).trim() === "" ? null : `className=${h.lit(String(value))}`,
    },
  ],
};
