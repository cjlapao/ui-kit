import { createElement } from "react";
import { SURFACE_TRANSPARENCIES } from "@cjlapao/ui-kit";
import type { MultiToggleOption, SurfaceTone } from "@cjlapao/ui-kit";
import type {
  PlaygroundConfig,
  PlaygroundOption,
} from "../../shared/playground/schema";
import { SurfaceToneSwatches } from "../../shared/SurfaceToneControl";
import {
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
  surfaceVariantOptions,
} from "../../shared/options";
import {
  DEFAULT_ARIA_LABEL,
  PANEL_DEFAULT,
  REGIONS,
  isLiquid,
  showsTransparency,
  showsTone,
} from "./toolbarStage";

/**
 * Toolbar's controls.
 *
 * Thirteen fields, and the bar prints almost none of them at rest: `variant`,
 * `tone`, `padding` and `corner` all open on what the component destructures
 * (:93-96), so an untouched playground is a `role="toolbar"` div with Panel's
 * elevated shadow and nothing else. Four fields own their printing instead,
 * because the value in the control is the docs' choice, not the component's:
 *
 *   - the three regions and the extra group, which are nodes — each prints as
 *     the hoisted const the Code view declares, and only while its toggle is
 *     on; an off toggle prints *nothing*, which is how the reader discovers
 *     that an absent group still leaves its `<div>` behind (:162-165);
 *   - `ariaLabel`, which prints whatever it holds — the component names itself
 *     nothing (:83-86), so "Preview toolbar" is a claim the snippet has to
 *     make out loud, and emptying the field shows the unnamed case;
 *   - `className`, which prints only when filled in (:73,:100).
 *
 * Three fields appear only where they can be seen. `tone` has nothing to tint
 * on `elevated` and `default` (:141-143,:126-127), `vibrancy`/`glassOpacity`
 * are read on `liquid-glass` alone (:130-137), and `transparency` has nothing
 * to do where the chrome has no alpha background to lower — `elevated`, or any
 * tone-less fill (surfaceTransparency.ts:27).
 */

/*
 * `MultiToggleOption`'s members are all optional and its `label` is a ReactNode,
 * while `PlaygroundOption` requires both and narrows `label` to a string.
 */
const options = (list: readonly MultiToggleOption[]): PlaygroundOption[] =>
  list as unknown as PlaygroundOption[];

const TRANSPARENCY_OPTIONS = options([
  { label: `${PANEL_DEFAULT === "inherit" ? "Variant" : PANEL_DEFAULT} default`, value: PANEL_DEFAULT },
  ...SURFACE_TRANSPARENCIES.map((value) => ({ label: value, value })),
]);

export const toolbarConfig: PlaygroundConfig = {
  groups: [
    { id: "surface", title: "Surface", defaultOpen: true },
    { id: "regions", title: "Regions", defaultOpen: true },
    { id: "naming", title: "Naming" },
  ],
  fields: [
    // ── The Panel the bar wears. ─────────────────────────────────────────────
    {
      id: "variant",
      label: "Variant",
      group: "surface",
      kind: "choice",
      prop: "variant",
      default: "elevated", // :93 — Panel's own default too
      options: surfaceVariantOptions,
    },
    {
      id: "tone",
      label: "Tone",
      group: "surface",
      kind: "custom",
      prop: "tone",
      // :94 destructures `DEFAULT_SURFACE_TONE`, which is "none"
      // (common/theme/Theme.ts:1664) — an untinted bar, as test :88-92 asserts.
      default: "none" as SurfaceTone,
      render: ({ state, set }) =>
        createElement(SurfaceToneSwatches, {
          value: String(state.tone ?? "none") as SurfaceTone,
          onSelect: (next: SurfaceTone) => set("tone", next),
        }),
      // Nothing to tint on the two shadow-and-rim variants (:126-127,:141-143).
      when: showsTone,
    },
    {
      id: "padding",
      label: "Padding",
      group: "surface",
      kind: "choice",
      prop: "padding",
      default: "xs", // :95
      options: panelPaddingOptions,
    },
    {
      id: "corner",
      label: "Corner",
      group: "surface",
      kind: "choice",
      prop: "corner",
      default: "rounded-md", // :96 — DEFAULT_SURFACE_CORNER (Theme.ts:1531-1532)
      options: panelCornerOptions,
    },
    {
      id: "vibrancy",
      label: "Vibrancy",
      group: "surface",
      kind: "choice",
      prop: "vibrancy",
      default: "medium", // :97
      options: glassVibrancyOptions,
      // Read only by the `liquid-glass` branch (:133).
      when: isLiquid,
    },
    {
      id: "glassOpacity",
      label: "Glass fill",
      group: "surface",
      kind: "choice",
      prop: "glassOpacity",
      default: "frosted", // :98
      options: glassOpacityOptions,
      when: isLiquid, // :134
    },
    {
      id: "transparency",
      label: "Transparency",
      group: "surface",
      kind: "choice",
      prop: "transparency",
      // :72 declares it, :99 destructures no default, and
      // `resolveSurfaceTransparency` answers per variant
      // (common/theme/surfaceTransparency.ts:8) — "the variant decides" is the
      // honest opening answer, and it prints nothing.
      default: PANEL_DEFAULT,
      options: TRANSPARENCY_OPTIONS,
      emit: (value: unknown) =>
        String(value ?? PANEL_DEFAULT) === PANEL_DEFAULT
          ? null
          : `transparency=${JSON.stringify(value)}`,
      when: showsTransparency,
    },

    // ── The four groups. ─────────────────────────────────────────────────────
    // Each prints as the const the Code view hoists, because the value is a
    // node: an attribute can only ever name the const it was lifted into
    // (:162-165). An off toggle prints nothing at all, which is how a reader
    // finds out that an absent group still leaves its `div` behind.
    {
      id: "start",
      label: "start — icon buttons",
      group: "regions",
      kind: "toggle",
      prop: null,
      default: true,
      emit: (value: unknown) =>
        value === true ? `start={${REGIONS.start.constName}}` : null,
    },
    {
      id: "center",
      label: "center — search field",
      group: "regions",
      kind: "toggle",
      prop: null,
      default: true,
      emit: (value: unknown) =>
        value === true ? `center={${REGIONS.center.constName}}` : null,
    },
    {
      id: "end",
      label: "end — primary action",
      group: "regions",
      kind: "toggle",
      prop: null,
      default: true,
      emit: (value: unknown) =>
        value === true ? `end={${REGIONS.end.constName}}` : null,
    },
    {
      id: "extra",
      label: "children — fourth group",
      group: "regions",
      kind: "toggle",
      prop: null,
      default: false,
      // A child, never an attribute (:43-48,:165) — the Code view prints the
      // const between the tags, so this one stays out of the tag.
      emit: () => null,
    },

    // ── What the bar says about itself. ──────────────────────────────────────
    {
      id: "ariaLabel",
      label: "aria-label",
      group: "naming",
      kind: "text",
      // Not `aria-label` as a field id: the printer would use the id as the
      // attribute name and the state key would read oddly in tests.
      prop: null,
      // The component never names itself (:83-86), so this is the docs' claim
      // and it prints whatever it holds — including nothing, when emptied.
      default: DEFAULT_ARIA_LABEL,
      emit: (value: unknown) => {
        const text = String(value ?? "").trim();
        return text === "" ? null : `aria-label=${JSON.stringify(text)}`;
      },
    },
    {
      id: "className",
      label: "className",
      group: "naming",
      kind: "text",
      prop: "className",
      default: "", // :100
      emit: (value: unknown) => {
        const text = String(value ?? "").trim();
        return text === "" ? null : `className=${JSON.stringify(text)}`;
      },
    },
  ],
  data: [],
};
