import { createElement } from "react";
import type { SurfaceTone } from "@cjlapao/ui-kit";
import { SurfaceToneSwatches } from "../../shared/SurfaceToneControl";
import type {
  PlaygroundConfig,
  PlaygroundOption,
  PlaygroundState,
} from "../../shared/playground/schema";
import {
  collapsibleHelpVariantOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
} from "../../shared/options";
import {
  CHILDREN_TEXT,
  DEFAULT_MAX_LENGTH,
  TITLE_TEXT,
  copyFor,
  hasCard,
  hasSpecular,
  isLiquid,
  isTruncated,
} from "./collapsibleHelpStage";

/**
 * Collapsible Help Text's playground, as data.
 *
 * One fact organises this whole list: the trigger exists only while the copy is
 * longer than `maxLength` (:277,209). Below that the component renders a `div`
 * (:230), there is no button, no `aria-expanded`, no chevron — so `expandLabel`,
 * `collapseLabel` and everything else that hangs off the toggle have nothing to
 * describe and their controls retire with them. The same rule runs through the
 * surface group: `plain` renders no `Panel` at all (:305-311), so `corner`,
 * `padding`, `raisedSurface`, `transparency` and the glass knobs are meaningless
 * there, and `padding` is applied to the *trigger* (:205) while the card is
 * pinned to `padding="none"` (:320) — which is why the hover wash is full-bleed.
 *
 * Defaults are `CollapsibleHelpText.tsx:251-272`'s own destructuring. The two
 * labels keep the component's English ("Show more" / "Show less", :144-145), so
 * the Code view stays quiet about them until the reader supplies their own.
 */

const options = (list: readonly { label: string; value: string }[]): PlaygroundOption[] =>
  list as PlaygroundOption[];

const autoOption = (label: string): PlaygroundOption => ({ value: "auto", label });

/** An absent colour: `auto` is the prop being missing, not a value. */
const autoEmit = (name: string) => (value: unknown): string | null =>
  value === "auto" ? null : `${name}=${JSON.stringify(value)}`;

export const collapsibleHelpConfig: PlaygroundConfig = {
  groups: [
    { id: "surface", title: "Surface", defaultOpen: true },
    { id: "content", title: "Content", defaultOpen: true },
    { id: "glass", title: "Glass" },
  ],
  fields: [
    /* ---------------------------------------------------------------- surface */
    {
      id: "variant",
      label: "Variant",
      group: "surface",
      kind: "choice",
      prop: "variant",
      // "card" is the documented default (:260) and an alias of the outlined
      // Panel (:44) — the Code view stays silent until the reader moves off it.
      default: "card",
      control: "select",
      options: options(collapsibleHelpVariantOptions),
    },
    {
      id: "tone",
      label: "Tone",
      group: "surface",
      kind: "custom",
      prop: "tone",
      // :259. The tone reaches the icon chip, the title line, the chevron, the
      // hover wash and the focus ring (:164-224) — all of which survive on
      // `plain`, so this control is never hidden.
      default: "none",
      emit: (value, _state, h) => (value === "none" ? null : `tone=${h.lit(value)}`),
      render: ({ state, set }) =>
        createElement(SurfaceToneSwatches, {
          value: String(state.tone ?? "none") as SurfaceTone,
          onSelect: (hue: string) => set("tone", hue),
        }),
    },
    {
      id: "corner",
      label: "Corner",
      group: "surface",
      kind: "choice",
      prop: "corner",
      // DEFAULT_SURFACE_CORNER (:261), which renders `rounded-2xl` (Theme.ts).
      default: "rounded-md",
      control: "select",
      when: hasCard,
      options: options(panelCornerOptions),
    },
    {
      id: "padding",
      label: "Padding",
      group: "surface",
      kind: "choice",
      prop: "padding",
      // :262 — and note where it goes: `getSurfacePaddingClass(padding)` lands on
      // the trigger (:205,230) and the Panel is pinned to "none" (:320).
      default: "sm",
      when: hasCard,
      options: options(panelPaddingOptions),
    },
    {
      id: "raisedSurface",
      label: "Raised surface",
      group: "surface",
      kind: "toggle",
      prop: "raisedSurface",
      // :270 — forwarded to Panel, so it means nothing without a Panel.
      default: false,
      when: hasCard,
    },
    {
      id: "transparency",
      label: "Transparency",
      group: "surface",
      kind: "choice",
      prop: "transparency",
      // `auto` is the absent prop; Panel then resolves it per variant.
      default: "auto",
      when: hasCard,
      options: [
        autoOption("Variant default"),
        ...options(["none", "low", "medium", "high"].map((value) => ({ value, label: value }))),
      ],
      emit: autoEmit("transparency"),
    },

    /* ---------------------------------------------------------------- content */
    {
      id: "copy",
      label: "Copy",
      group: "content",
      kind: "choice",
      // The lever, not the prop: `text` is a data source, so the paragraph and
      // its `HELP_TEXT` const come from one place.
      prop: null,
      // The long paragraph, because a helper that cannot collapse is not this
      // component's usual job.
      default: "long",
      options: [
        { value: "long", label: "Long (239 chars)" },
        { value: "short", label: "Short (75 chars)" },
      ],
    },
    {
      id: "maxLength",
      label: "maxLength",
      group: "content",
      kind: "number",
      prop: "maxLength",
      default: DEFAULT_MAX_LENGTH,
      min: 40,
      max: 280,
      step: 10,
    },
    {
      id: "showTitle",
      label: "Title",
      group: "content",
      kind: "toggle",
      prop: null,
      default: true,
    },
    {
      id: "title",
      label: "Title text",
      group: "content",
      kind: "text",
      prop: "title",
      default: TITLE_TEXT,
      when: (state: PlaygroundState) => (state.showTitle ?? true) === true,
      // A title has no component default (:252) and is on screen, so it prints.
      alwaysEmit: true,
    },
    {
      id: "showIcon",
      label: "Icon",
      group: "content",
      kind: "toggle",
      prop: "showIcon",
      // :255 — off by default, so the opening snippet has no icon either.
      default: false,
    },
    {
      id: "icon",
      label: "Icon name",
      group: "content",
      kind: "choice",
      prop: "icon",
      // :256, resolved against the kit's registry by `useIconRenderer` (:147,170).
      default: "Help",
      when: (state: PlaygroundState) => (state.showIcon ?? false) === true,
      options: options(["Help", "Info", "Warning", "Check"].map((value) => ({ value, label: value }))),
    },
    {
      id: "withChildren",
      label: "Extra children",
      group: "content",
      kind: "toggle",
      prop: null,
      // Off: `children` is not gated by the toggle (:234-244) and a reader who
      // switches it on should see that for themselves.
      default: false,
    },
    {
      id: "renderMarkdown",
      label: "renderMarkdown",
      group: "content",
      kind: "toggle",
      prop: "renderMarkdown",
      // :269 — no renderer of its own; the plain paragraph wins when absent
      // (:150-158), which is also what keeps the copy on the surface colours.
      default: false,
      emit: (value) => (value ? "renderMarkdown={renderMarkdown}" : null),
    },

    /* ------------------------------------------------------- the trigger's name */
    {
      id: "expandLabel",
      label: "expandLabel",
      group: "content",
      kind: "text",
      prop: "expandLabel",
      // The component's own English (:144). Nothing prints while the reader is
      // happy with it — and nothing at all while the copy is short enough that
      // there is no button to name (:209).
      default: "Show more",
      when: isTruncated,
    },
    {
      id: "collapseLabel",
      label: "collapseLabel",
      group: "content",
      kind: "text",
      prop: "collapseLabel",
      default: "Show less",
      when: isTruncated,
    },

    /* ------------------------------------------------------------------ glass */
    {
      id: "specularMode",
      label: "Specular",
      group: "glass",
      kind: "choice",
      prop: "specularMode",
      // `auto` = absent, which Panel resolves to `classic` (:820-824). Applied
      // to glass, liquid-glass and default (:1431) — `card` counts, since it is
      // outlined and outlined gets nothing.
      default: "auto",
      when: hasSpecular,
      options: [
        autoOption("Auto"),
        { value: "none", label: "None" },
        { value: "classic", label: "Classic" },
        { value: "halo", label: "Halo" },
      ],
      emit: autoEmit("specularMode"),
    },
    {
      id: "vibrancy",
      label: "Vibrancy",
      group: "glass",
      kind: "choice",
      prop: "vibrancy",
      default: "auto",
      // Forwarded (:323) but read by Panel's `liquid-glass` branch alone
      // (Panel.tsx:958,1011) — the old playground offered it for every glass
      // variant, where it changed nothing on screen or in the source.
      when: isLiquid,
      options: [autoOption("Auto"), ...options(glassVibrancyOptions)],
      emit: autoEmit("vibrancy"),
    },
    {
      id: "glassOpacity",
      label: "Glass opacity",
      group: "glass",
      kind: "choice",
      prop: "glassOpacity",
      default: "auto",
      // Same: `glassFillClass` is applied at Panel.tsx:1012.
      when: isLiquid,
      options: [autoOption("Auto"), ...options(glassOpacityOptions)],
      emit: autoEmit("glassOpacity"),
    },
  ],
  data: [
    {
      id: "text",
      prop: "text",
      constName: "HELP_TEXT",
      label: "The help copy",
      // The point of the fixture: it is the length of this string, not a mode,
      // that decides whether the component renders a toggle (:277).
      // State-independent on purpose: a note that described the long paragraph
      // while the short one was on screen would be a lie in the Code view.
      note: "the trigger exists only while this string is longer than `maxLength`; the summary then cuts on a word boundary (:277,52-62)",
      emit: "source",
      value: (state) => copyFor(state),
      source: (state) => JSON.stringify(copyFor(state)),
    },
    {
      id: "children",
      prop: null,
      label: "Extra content",
      note: "rendered outside the collapsed branch (:234-244), so it never hides",
      emit: "literal",
      value: (state) =>
        (state.withChildren ?? false) === true ? CHILDREN_TEXT : "",
      when: (state: PlaygroundState) => (state.withChildren ?? false) === true,
    },
  ],
};
