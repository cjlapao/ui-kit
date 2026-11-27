import { createElement } from "react";
import type { SurfaceTone } from "@cjlapao/ui-kit";
import type {
  PlaygroundConfig,
  PlaygroundOption,
  PlaygroundValue,
} from "../../shared/playground/schema";
import { SurfaceToneSwatches } from "../../shared/SurfaceToneControl";
import {
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelLoaderTypeOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  surfaceVariantOptions,
} from "../../shared/options";
import {
  ARIA_LABEL,
  isControlled,
  isGlass,
  isLiquid,
  itemsSource,
  openSelection,
  printIds,
} from "./accordionStage";

/**
 * Accordion's controls.
 *
 * Three axes decide what may print, and none of them is a prop the reader can
 * read off the tag:
 *
 *   1. **`items` is the component.** Rows carry their own `icon`, `badge`,
 *      `actions`, `disabled` and `loading` (:29-40), so the row levers below are
 *      not props at all — they rewrite the printed `ITEMS` literal. A lever the
 *      reader switched off must disappear from that literal, or the Code view
 *      describes rows the preview never painted.
 *   2. **The selection mode.** `openIds ?? internalOpenIds` (useAccordion.ts:29)
 *      means `openIds={[]}` is a controlled accordion with nothing open, while
 *      no `openIds` at all is the uncontrolled one — so the same "which rows
 *      start open" control prints `defaultOpenIds` in one mode and `openIds`
 *      (plus `onChange`) in the other, and never both.
 *   3. **Which surface is see-through**, exactly as on Panel: `vibrancy` and
 *      `glassOpacity` are read in the liquid branch alone (Panel.tsx:958,
 *      1011-1012), `specularMode` on the three glass-aware variants (:391).
 *
 * `padding` deserves the same warning it gets on the collapsible pages: it is
 * the rows' inset (:209,333,456) while the card is pinned `padding="none"`
 * (:537), and `hoverable` is this component's override of Panel's
 * `Boolean(onClick)` (:504, Panel.tsx:725).
 */

const options = (
  list: readonly { label: string; value: string }[],
): PlaygroundOption[] => list as PlaygroundOption[];

const withAuto = (list: readonly { label: string; value: string }[]) =>
  options([{ label: "Auto", value: "auto" }, ...list]);

/** `auto` is the absent prop: Panel's own answer, not a value to send it. */
const autoEmit =
  (name: string) =>
  (value: PlaygroundValue): string | null =>
    value === "auto" ? null : `${name}=${JSON.stringify(value)}`;

export const accordionConfig: PlaygroundConfig = {
  groups: [
    { id: "surface", title: "Surface", defaultOpen: true },
    { id: "rows", title: "Rows", defaultOpen: true },
    { id: "disclosure", title: "Disclosure", defaultOpen: true },
    { id: "glass", title: "Glass" },
  ],
  fields: [
    // ── Surface — forwarded to `Panel` (:530-542). ────────────────────────────
    {
      id: "variant",
      label: "Variant",
      group: "surface",
      kind: "choice",
      prop: "variant",
      // Panel's own default, kept rather than replaced (:499).
      default: "elevated",
      control: "select",
      options: options(surfaceVariantOptions),
    },
    {
      id: "tone",
      label: "Tone",
      group: "surface",
      kind: "custom",
      prop: "tone",
      default: "none",
      // `resolvePanelTone(tone, color)` (:509) lands on "none" with both absent,
      // and `tone="none"` would say the card is untinted in a way the component
      // never asked for.
      emit: (value) => (value === "none" ? null : `tone=${JSON.stringify(value)}`),
      render: ({ state, set }) =>
        createElement(SurfaceToneSwatches, {
          value: String(state.tone ?? "none") as SurfaceTone,
          onSelect: (next: SurfaceTone) => set("tone", next),
        }),
    },
    {
      id: "corner",
      label: "Corner",
      group: "surface",
      kind: "choice",
      prop: "corner",
      // DEFAULT_SURFACE_CORNER (:503, Theme.ts:1531).
      default: "rounded-md",
      control: "select",
      options: options(panelCornerOptions),
    },
    {
      id: "padding",
      label: "Padding",
      group: "surface",
      kind: "choice",
      prop: "padding",
      // DEFAULT_SURFACE_PADDING (:510). Applied to each row's header and
      // content — the card is pinned to none (:537).
      default: "sm",
      control: "select",
      options: options(panelPaddingOptions),
    },
    {
      id: "raisedSurface",
      label: "Raised surface",
      group: "surface",
      kind: "toggle",
      prop: "raisedSurface",
      default: false,
    },
    {
      id: "hoverable",
      label: "Hover answer",
      group: "surface",
      kind: "toggle",
      prop: "hoverable",
      // Off is the documented answer (:504): a list whose rows are the controls
      // should not light up as if the card itself were one.
      default: false,
    },
    {
      id: "transparency",
      label: "Transparency",
      group: "surface",
      kind: "choice",
      prop: "transparency",
      default: "auto",
      control: "select",
      options: withAuto([
        { label: "None", value: "none" },
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
      ]),
      emit: autoEmit("transparency"),
    },

    // ── Rows: the `items` fixture and the list's own knobs. ──────────────────
    {
      id: "itemCount",
      label: "Rows",
      group: "rows",
      kind: "number",
      prop: null,
      // 0 is the empty state, which the component owns (:213-226).
      default: 3,
      min: 0,
      max: 4,
      step: 1,
    },
    {
      id: "size",
      label: "Size",
      group: "rows",
      kind: "choice",
      prop: "size",
      // The shared control scale, and type/icon/indicator density only (:483).
      default: "md",
      // The shared control scale — the same list the rest of the kit's dense
      // components use, so a reader who has seen one size control has seen this.
      options: options(controlSizeOptions),
    },
    {
      id: "indicator",
      label: "Indicator",
      group: "rows",
      kind: "choice",
      prop: "indicator",
      default: "chevron",
      options: options([
        { label: "Chevron", value: "chevron" },
        { label: "Plus / minus", value: "plus-minus" },
        { label: "None", value: "none" },
      ]),
    },
    {
      id: "indicatorPlacement",
      label: "Indicator side",
      group: "rows",
      kind: "choice",
      prop: "indicatorPlacement",
      default: "right",
      options: options([
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ]),
      // With no indicator there is no side to place, and a printed
      // `indicatorPlacement` would describe an element that is not rendered
      // (:351,425).
      when: (state) => (state.indicator ?? "chevron") !== "none",
    },
    {
      id: "withIcons",
      label: "Icon chip",
      group: "rows",
      kind: "toggle",
      prop: null,
      default: true,
    },
    {
      id: "withBadge",
      label: "Badge",
      group: "rows",
      kind: "toggle",
      prop: null,
      default: true,
    },
    {
      id: "withDescription",
      label: "Description",
      group: "rows",
      kind: "toggle",
      prop: null,
      default: false,
    },
    {
      id: "withActions",
      label: "Row action",
      group: "rows",
      kind: "toggle",
      prop: null,
      default: true,
    },
    {
      id: "oneDisabled",
      label: "One disabled row",
      group: "rows",
      kind: "toggle",
      prop: null,
      default: false,
    },
    {
      id: "oneLoading",
      label: "One loading row",
      group: "rows",
      kind: "toggle",
      prop: null,
      default: false,
    },
    {
      id: "loading",
      label: "List loading",
      group: "rows",
      kind: "toggle",
      prop: "loading",
      // Forwarded to Panel, which returns its skeleton in place of the body
      // (Panel.tsx:1233-1236) — rows and hairlines included.
      default: false,
    },
    {
      id: "loaderType",
      label: "Loader type",
      group: "rows",
      kind: "choice",
      prop: "loaderType",
      default: "skeleton",
      // Panel's own list — the accordion forwards the pair untouched.
      options: options(panelLoaderTypeOptions),
      when: (state) => (state.loading ?? false) === true,
    },

    // ── Disclosure. ───────────────────────────────────────────────────────────
    {
      id: "mode",
      label: "Selection",
      group: "disclosure",
      kind: "choice",
      prop: null,
      default: "uncontrolled",
      options: options([
        { label: "Uncontrolled", value: "uncontrolled" },
        { label: "Controlled", value: "controlled" },
      ]),
    },
    {
      id: "startOpen",
      label: "Open at start",
      group: "disclosure",
      kind: "choice",
      prop: null,
      // `defaultOpenIds ?? []` (useAccordion.ts:26), so "none" is the
      // component's own answer and prints nothing in uncontrolled mode.
      default: "first",
      options: options([
        { label: "None", value: "none" },
        { label: "First row", value: "first" },
        { label: "All rows", value: "all" },
      ]),
      emit: (_value, state) => {
        const ids = openSelection(state);
        const name = isControlled(state) ? "openIds" : "defaultOpenIds";
        if (!isControlled(state) && ids.length === 0) return null;
        return `${name}={${printIds(ids)}}`;
      },
    },
    {
      id: "multiple",
      label: "Multiple open",
      group: "disclosure",
      kind: "toggle",
      prop: "multiple",
      // Off, the component's answer (:496 and useAccordion.ts:22): opening a row
      // replaces the array rather than appending to it (:50-54).
      default: false,
    },
    {
      id: "animated",
      label: "Animated",
      group: "disclosure",
      kind: "toggle",
      prop: "animated",
      // On, the component's answer (:486). Off is not a paused transition but a
      // dropped class (:430-431) — the rows switch instantly.
      default: true,
    },
    {
      id: "onChange",
      label: "Selection handler",
      group: "disclosure",
      kind: "toggle",
      prop: "onChange",
      // The component's own default is no handler; in controlled mode the
      // accordion cannot move without one (useAccordion.ts:31-39).
      default: true,
      when: isControlled,
      emit: (value) => (value ? "onChange={handleOpenIds}" : null),
    },
    {
      id: "onItemToggle",
      label: "Per-row handler",
      group: "disclosure",
      kind: "toggle",
      prop: "onItemToggle",
      default: false,
      emit: (value) => (value ? "onItemToggle={handleItemToggle}" : null),
    },
    {
      id: "ariaLabel",
      label: "List label",
      group: "disclosure",
      kind: "text",
      prop: "ariaLabel",
      default: ARIA_LABEL,
      // There is no default to fall back to (:77-78): an unnamed group is
      // announced as an unlabelled group.
      alwaysEmit: true,
      emit: (value, _state, h) =>
        String(value).trim() === "" ? null : `ariaLabel=${h.lit(String(value))}`,
    },
    {
      id: "disabled",
      label: "Disabled",
      group: "disclosure",
      kind: "toggle",
      prop: "disabled",
      default: false,
    },

    // ── Glass. ────────────────────────────────────────────────────────────────
    {
      id: "specularMode",
      label: "Specular",
      group: "glass",
      kind: "choice",
      prop: "specularMode",
      default: "auto",
      control: "select",
      options: withAuto(panelSpecularOptions),
      when: isGlass,
      emit: autoEmit("specularMode"),
    },
    {
      id: "vibrancy",
      label: "Vibrancy",
      group: "glass",
      kind: "choice",
      prop: "vibrancy",
      default: "auto",
      options: withAuto(glassVibrancyOptions),
      when: isLiquid,
      emit: autoEmit("vibrancy"),
    },
    {
      id: "glassOpacity",
      label: "Glass opacity",
      group: "glass",
      kind: "choice",
      prop: "glassOpacity",
      default: "auto",
      options: withAuto(glassOpacityOptions),
      when: isLiquid,
      emit: autoEmit("glassOpacity"),
    },
  ],
  data: [
    {
      id: "items",
      prop: "items",
      constName: "ITEMS",
      label: "Rows",
      note: "the fixture the preview renders — every row field here is optional but id, title and content (:29-40)",
      emit: "source",
      value: itemsSource,
      source: itemsSource,
    },
  ],
};
