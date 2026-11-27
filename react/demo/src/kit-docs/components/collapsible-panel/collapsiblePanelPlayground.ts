import { createElement } from "react";
import type { SurfaceTone } from "@cjlapao/ui-kit";
import type {
  PlaygroundConfig,
  PlaygroundOption,
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";
import { SurfaceToneSwatches } from "../../shared/SurfaceToneControl";
import {
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  surfaceVariantOptions,
} from "../../shared/options";
import {
  ACTIONS_JSX,
  HEADER_LABEL,
  RICH_TITLE_JSX,
  SUBTITLE_TEXT,
  TITLE_TEXT,
  isControlled,
  isGlass,
  isLiquid,
  longBodyJsx,
  shortBodyJsx,
} from "./collapsiblePanelStage";

/**
 * Collapsible Panel's controls.
 *
 * Two things decide what this file prints, and neither is a prop of its own:
 *
 *   1. **The disclosure mode.** `expanded` is read as `typeof expanded ===
 *      "boolean"` (:267), so an absent `expanded` is the uncontrolled panel and
 *      `expanded={false}` is the controlled one. The reader picks the mode, and
 *      only the props of that mode can print — `defaultExpanded` beside a
 *      controlled panel would be a prop the component never reads.
 *   2. **Which surfaces are see-through.** `vibrancy` and `glassOpacity` reach
 *      Panel and are consumed in its liquid-glass branch alone (Panel.tsx:958,
 *      1011-1012); `specularMode` covers the three glass-aware variants (:391).
 *
 * `padding` is the trap this page has to be straight about: the value goes to
 * the header and the content box (:91,214), never to the card, which is pinned
 * `padding="none"` (:293).
 */

const options = (list: readonly { label: string; value: string }[]): PlaygroundOption[] =>
  list as PlaygroundOption[];

const withAuto = (list: readonly { label: string; value: string }[]) =>
  options([{ label: "Auto", value: "auto" }, ...list]);

/** `auto` is the absent prop: Panel's own answer, not a value to send it. */
const autoEmit =
  (name: string) =>
  (value: PlaygroundValue): string | null =>
    value === "auto" ? null : `${name}=${JSON.stringify(value)}`;

export const collapsiblePanelConfig: PlaygroundConfig = {
  groups: [
    { id: "surface", title: "Surface", defaultOpen: true },
    { id: "header", title: "Header", defaultOpen: true },
    { id: "content", title: "Content", defaultOpen: true },
    { id: "glass", title: "Glass" },
  ],
  fields: [
    // ── Surface — every one of these is forwarded to `Panel` (:285-298). ──────
    {
      id: "variant",
      label: "Variant",
      group: "surface",
      kind: "choice",
      prop: "variant",
      // Panel's own default, which this component does not override (:253).
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
      // `resolvePanelTone(tone, color)` (:264) lands on "none" when both are
      // absent, and printing `tone="none"` would say the card is untinted in a
      // way the component never asked for.
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
      // DEFAULT_SURFACE_CORNER (:256) — the token that renders a 1rem radius.
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
      // DEFAULT_SURFACE_PADDING (:265), applied to header and content — the
      // card itself is pinned to none (:293), which is what keeps the header's
      // hover wash full-bleed against the card's edge.
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
      // This component overrides Panel's default here: Panel would resolve an
      // absent `hoverable` to Boolean(onClick) (Panel.tsx:725), but a card whose
      // only control is its header should not light up as if the whole card
      // were a button. Off is the documented answer (:258).
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

    // ── Header. ───────────────────────────────────────────────────────────────
    {
      id: "richTitle",
      label: "Title as a node",
      group: "header",
      kind: "toggle",
      prop: null,
      default: false,
    },
    {
      id: "title",
      label: "Title",
      group: "header",
      kind: "text",
      prop: "title",
      default: TITLE_TEXT,
      alwaysEmit: true,
      // The only prop the interface makes required (:19-32). As a node it stops
      // being a name, which is what `headerLabel` below is for.
      emit: (value, state, h) =>
        (state.richTitle ?? false) === true
          ? `title={${RICH_TITLE_JSX}}`
          : `title=${h.lit(String(value))}`,
    },
    {
      id: "headerLabel",
      label: "Header label",
      group: "header",
      kind: "text",
      prop: "headerLabel",
      default: HEADER_LABEL,
      alwaysEmit: true,
      // The header is a div with role="button" (:112-116), so its accessible
      // name is its content — and a node title puts a status glyph and an
      // environment tag into that content. This prop overwrites both (:121).
      when: (state) => (state.richTitle ?? false) === true,
    },
    {
      id: "subtitle",
      label: "Subtitle",
      group: "header",
      kind: "text",
      prop: "subtitle",
      default: SUBTITLE_TEXT,
      // The docs' string, not the component's — its own answer is no subtitle at
      // all (:142). The `emit` below owns the bar for "worth printing": blank
      // means the prop, and the line, go.
      emit: (value, _state, h) =>
        String(value).trim() === "" ? null : `subtitle=${h.lit(String(value))}`,
    },
    {
      id: "showActions",
      label: "Header action",
      group: "header",
      kind: "toggle",
      prop: null,
      default: true,
    },
    {
      id: "disabled",
      label: "Disabled",
      group: "header",
      kind: "toggle",
      prop: "disabled",
      default: false,
    },

    // ── Content and the disclosure. ───────────────────────────────────────────
    {
      id: "mode",
      label: "Expansion",
      group: "content",
      kind: "choice",
      prop: null,
      default: "uncontrolled",
      options: options([
        { label: "Uncontrolled", value: "uncontrolled" },
        { label: "Controlled", value: "controlled" },
      ]),
    },
    {
      id: "defaultExpanded",
      label: "Open at start",
      group: "content",
      kind: "toggle",
      prop: "defaultExpanded",
      default: false,
      when: (state) => !isControlled(state),
    },
    {
      id: "expanded",
      label: "Expanded",
      group: "content",
      kind: "choice",
      prop: "expanded",
      default: "open",
      options: options([
        { label: "Open", value: "open" },
        { label: "Closed", value: "closed" },
      ]),
      // `false` is a printed answer here, not an absence: passing
      // `expanded={false}` is what keeps the card shut under a parent's
      // control, and passing nothing is a different component (:267-268).
      when: isControlled,
      emit: (value) => `expanded={${value === "open"}}`,
    },
    {
      id: "onToggle",
      label: "Toggle handler",
      group: "content",
      kind: "toggle",
      prop: "onToggle",
      default: true,
      // The component's own default is no handler at all, so the `emit` below
      // prints the line only when there is one — and in controlled mode a card
      // without it has a header that does nothing (:277-282).
      when: isControlled,
      emit: (value) => (value ? "onToggle={handleToggle}" : null),
    },
    {
      id: "content",
      label: "Content",
      group: "content",
      kind: "choice",
      prop: null,
      default: "short",
      options: options([
        { label: "Paragraph", value: "short" },
        { label: "Log (12 lines)", value: "long" },
      ]),
    },
    {
      id: "contentMaxHeight",
      label: "Content max height",
      group: "content",
      kind: "number",
      prop: "contentMaxHeight",
      default: 320,
      min: 120,
      max: 640,
      step: 20,
      // `min(Npx, 65vh)` (:222): the viewport cap is not a prop, so past a
      // certain point this number stops being the answer.
      when: (state) => (state.fillHeight ?? false) !== true,
    },
    {
      id: "minExpandedHeight",
      label: "Min expanded height",
      group: "content",
      kind: "number",
      prop: "minExpandedHeight",
      default: 0,
      min: 0,
      max: 320,
      step: 8,
      // 0 is the control's own "no style"; the component's default is no
      // minHeight at all (:227).
      emit: (value) =>
        Number(value) > 0 ? `minExpandedHeight={${Number(value)}}` : null,
    },
    {
      id: "fillHeight",
      label: "Fill height",
      group: "content",
      kind: "toggle",
      prop: "fillHeight",
      default: false,
      // Grows to fill the parent instead of scrolling, and while it is doing
      // that `contentMaxHeight` is not read at all (:216-223).
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
      // Panel reads it in one branch (:958,1011); everywhere else it is
      // forwarded into code that changes nothing.
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
      id: "actions",
      prop: "actions",
      constName: "ACTIONS",
      label: "Header actions",
      // Not Panel's `PanelAction[]`: this is a ReactNode, and it is the reason
      // the header is a div with a button role rather than a <button> (:112).
      note: "clicks and key presses inside it are stopped from toggling the panel (:156-166)",
      emit: "source",
      value: () => ACTIONS_JSX,
      source: () => ACTIONS_JSX,
      when: (state: PlaygroundState) => (state.showActions ?? true) !== false,
    },
    {
      id: "children",
      prop: null,
      label: "Panel content",
      note: "collapsed, this region is inert rather than display: none (:203-207)",
      emit: "source",
      value: (state: PlaygroundState) =>
        (state.content ?? "short") === "long" ? longBodyJsx() : shortBodyJsx(),
      source: (state: PlaygroundState) =>
        (state.content ?? "short") === "long" ? longBodyJsx() : shortBodyJsx(),
    },
  ],
};
