import { createElement } from "react";
import type { ChangeEvent } from "react";
import type { MultiToggleOption } from "@cjlapao/ui-kit";
import type {
  PlaygroundConfig,
  PlaygroundOption,
} from "../../shared/playground/schema";
import { ChoiceControl } from "../../shared/PlaygroundPanel";
import { controlSizeOptions } from "../../shared/options";
import {
  ACTIONS_CHOICES,
  ACTION_SET_LABELS,
  DEFAULT_ACTIONS,
  DEFAULT_SUMMARY,
  DEFAULT_TITLE,
  DEFAULT_WIDTH,
  defined,
  hasActions,
  MAX_WIDTH,
  MIN_WIDTH,
  stageWidth,
} from "./contentActionsStage";

/**
 * Content Actions' controls.
 *
 * There are four props in total (:9-12 of the component, two of them class
 * hooks from `common/components/contentActions.ts`), so the interesting work here
 * is deciding what each one is allowed to say:
 *
 *   - `gap` and `align` open on the values the component destructures (:18-19), so
 *     they print only when the reader moves them — and `gap` is worth moving,
 *     because it lands in two places at once (the gap between the regions, :30, and
 *     the gap between the actions, :40).
 *   - `actions` is not a value but whether a *second region exists at all*. The
 *     component tests `actions != null && typeof actions !== "boolean"` (:25) and
 *     renders nothing otherwise (:35), so the choice that means "no actions" prints
 *     nothing rather than `actions={null}`.
 *   - `contentClassName` opens on `overflow-hidden` even though the component's own
 *     default is nothing (:32): truncating the content needs it, and a snippet that
 *     omitted the class would show a header that squashes instead of ellipsizing.
 *     Its own `emit` owns the bar, so the value still prints.
 *   - `ariaLabel` prints a prop that does very little: the root is a plain div with
 *     no role (:26-47), so most assistive tech ignores the name. It is here to be
 *     compared against the actions, which must each arrive with their own.
 */

/*
 * `MultiToggleOption`'s members are all optional and its `label` is a ReactNode,
 * while `PlaygroundOption` requires both and narrows `label` to a string — so the
 * shared lists arrive as the loose shape and leave as the strict one.
 */
const options = (list: readonly MultiToggleOption[]): PlaygroundOption[] =>
  list as unknown as PlaygroundOption[];

const ACTION_CHOICES = options(
  ACTIONS_CHOICES.map((id) => ({ label: ACTION_SET_LABELS[id], value: id })),
);

const ALIGN_CHOICES = options([
  { label: "Start", value: "start" },
  { label: "Center", value: "center" },
  { label: "End", value: "end" },
]);

const LABEL_CHOICES = options([
  { label: "None", value: "absent" },
  { label: "Agent header", value: "Agent header" },
]);

/** The width slider is a stage lever: nothing about it belongs in the snippet. */
const WidthSlider = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) =>
  createElement(
    "div",
    { className: "space-y-1.5" },
    createElement(
      "div",
      { className: "flex items-center justify-between text-xs" },
      createElement("span", null, "Available width"),
      createElement("span", { className: "font-mono opacity-70" }, `${value}px`),
    ),
    createElement("input", {
      type: "range",
      min: MIN_WIDTH,
      max: MAX_WIDTH,
      step: 10,
      value,
      "aria-label": "Available width",
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        onChange(Number(event.target.value)),
      className: "w-full accent-blue-500",
    }),
  );

export const contentActionsConfig: PlaygroundConfig = {
  groups: [
    { id: "layout", title: "Layout", defaultOpen: true },
    { id: "content", title: "Content", defaultOpen: true },
    { id: "actions", title: "Actions", defaultOpen: true },
    { id: "root", title: "Root element", defaultOpen: false },
  ],
  fields: [
    // ── How the two regions sit against each other. ──────────────────────────
    {
      id: "width",
      label: "Available width",
      group: "layout",
      kind: "custom",
      prop: null,
      // The width of the box is the demo's business: `ContentActions` fills
      // whatever it is given (flex-1 content, :32) and never sizes itself.
      default: DEFAULT_WIDTH,
      render: ({ state, set }) =>
        createElement(WidthSlider, {
          value: stageWidth(state),
          onChange: (next: number) => set("width", next),
        }),
    },
    {
      id: "gap",
      label: "Gap",
      group: "layout",
      kind: "choice",
      prop: "gap",
      // One knob, two gaps: between the regions (:30) and between the actions
      // (:40). `md` is what the component destructures, so it stays unprinted.
      default: "md",
      options: options(controlSizeOptions),
    },
    {
      id: "align",
      label: "Align",
      group: "layout",
      kind: "choice",
      prop: "align",
      // Cross-axis only — `items-start|center|end` (:30 with the map in
      // common/components/contentActions.ts:19-23). The horizontal split comes
      // from flex-1 vs flex-initial (:32,:39), not from this prop.
      default: "start",
      options: ALIGN_CHOICES,
    },

    // ── The region that yields. ──────────────────────────────────────────────
    {
      id: "title",
      label: "Title",
      group: "content",
      kind: "text",
      prop: null,
      // Children, not a prop (:10): the content region renders whatever it is
      // given and adds nothing but `min-w-0 flex-1` (:32).
      default: DEFAULT_TITLE,
    },
    {
      id: "summary",
      label: "Summary",
      group: "content",
      kind: "text",
      prop: null,
      default: DEFAULT_SUMMARY,
    },
    {
      id: "contentClassName",
      label: "Content class",
      group: "content",
      kind: "text",
      prop: "contentClassName",
      // Not the component's default (:32) — the component adds no class beyond
      // `min-w-0 flex-1` — but the honest setting for a truncating title: without
      // it a long word widens the flex item instead of ellipsizing. Own emit, so it
      // still prints, and blank means the prop is absent.
      default: "overflow-hidden",
      emit: (value, _state, h) => {
        const text = defined(value);
        return text === undefined ? null : `contentClassName=${h.lit(text)}`;
      },
    },

    // ── The region that never wraps. ─────────────────────────────────────────
    {
      id: "actions",
      label: "Actions",
      group: "actions",
      kind: "custom",
      prop: "actions",
      // Three, one, six (past the edge, where `overflow-x-auto` and
      // `[&>*]:shrink-0` at :39 take over) or none at all — and "none" prints
      // nothing, because the region is not rendered (:25,:35) rather than
      // rendered empty.
      default: DEFAULT_ACTIONS,
      emit: (_value, state) => (hasActions(state) ? "actions={ACTIONS}" : null),
      render: ({ state, set }) =>
        createElement(ChoiceControl, {
          label: "Actions",
          options: ACTION_CHOICES,
          value: String(state.actions ?? DEFAULT_ACTIONS),
          onChange: (next: string) => set("actions", next),
        }),
    },
    {
      id: "actionsClassName",
      label: "Actions class",
      group: "actions",
      kind: "text",
      prop: "actionsClassName",
      // The hook for the row that already carries flex-nowrap, items-center and
      // overflow-x-auto (:39); blank leaves those classes alone.
      default: "",
      emit: (value, _state, h) => {
        const text = defined(value);
        return text === undefined ? null : `actionsClassName=${h.lit(text)}`;
      },
    },

    // ── What the root div accepts, and what it does with it. ─────────────────
    {
      id: "ariaLabel",
      label: "Root aria-label",
      group: "root",
      kind: "choice",
      prop: "aria-label",
      // A plain div with no role (:26-47): the name lands on an element most
      // assistive tech will not announce. Kept on purpose, next to actions that
      // each carry a real name — the difference is the lesson.
      default: "absent",
      options: LABEL_CHOICES,
      emit: (value, _state, h) => {
        const text = defined(value);
        return text === undefined ? null : `aria-label=${h.lit(text)}`;
      },
    },
  ],
};
