import { createElement } from "react";
import type { SurfaceTone } from "@cjlapao/ui-kit";
import type { MultiToggleOption } from "@cjlapao/ui-kit";
import type {
  PlaygroundConfig,
  PlaygroundOption,
} from "../../shared/playground/schema";
import { SurfaceToneSwatches } from "../../shared/SurfaceToneControl";
import { FIXTURE_NAMES, ICON_NODE } from "./panelHeroFixture";
import {
  controlSizeOptions,
  glowIntensityOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelDecorationOptions,
  panelHeroTitleElementOptions,
  panelHeroVariantOptions,
  panelPaddingOptions,
  panelSpecularOptions,
} from "../../shared/options";
import {
  BACKDROPS,
  backdropClass,
  DEFAULT_ICON,
  DEFAULT_SUBTITLE,
  DEFAULT_TITLE,
  ICON_CHOICES,
  PANEL_DEFAULT,
  isGlassy,
  isGradient,
  isSurface,
} from "./panelHeroStage";

/**
 * Panel Hero's controls.
 *
 * Twenty-two fields, and the interesting part is which of them print nothing at
 * the opening state. `variant`, `titleAs`, `titleSize`, `subtitleSize`,
 * `padding`, `corner` and `decoration` all open on the values the component
 * destructures (:237-247), so the banner they draw is what you get for free and
 * the Code view says so with an empty tag. Four fields own their own bar
 * instead, because the value in the control is the docs' choice and not the
 * component's:
 *
 *   - `title` is required (:62), so it prints whatever it holds;
 *   - `subtitle`, `gradientFrom`/`gradientTo` and `className` print only when
 *     filled in — they have no component default (:64,:95-97,:96) and printing
 *     an empty one would advertise an attribute that does nothing;
 *   - the glass knobs open on `inherit`, which prints nothing: the component
 *     passes them straight to `Panel` (:292-295) and "unset" is the honest
 *     answer for what Panel does on its own.
 *
 * `tone` has the same problem in the other direction. Its JSDoc says
 * `@default "blue"` (:73-74) while the code destructures nothing and falls back
 * through `tone ?? color ?? "none"` (:260) to `neutral`
 * (common/theme/Theme.ts:69) — so the control opens on **None** and the docs
 * never claim a colour the component does not choose.
 */

/*
 * `MultiToggleOption`'s members are all optional and its `label` is a ReactNode,
 * while `PlaygroundOption` requires both and narrows `label` to a string.
 */
const options = (list: readonly MultiToggleOption[]): PlaygroundOption[] =>
  list as unknown as PlaygroundOption[];

const withInherit = (label: string, list: readonly MultiToggleOption[]) =>
  options([{ label: `${label} default`, value: PANEL_DEFAULT }, ...list]);

const ICON_OPTIONS = options([
  { label: "None", value: "none" },
  ...ICON_CHOICES.filter((value) => value !== "none").map((value) => ({
    label: value === "node" ? "Node (CustomIcon)" : value,
    value,
  })),
]);

const BACKDROP_OPTIONS = options(
  BACKDROPS.map((value) => ({
    label: value === "page" ? "Page" : "Artwork",
    value,
  })),
);

export const panelHeroConfig: PlaygroundConfig = {
  groups: [
    { id: "banner", title: "Banner", defaultOpen: true },
    { id: "type", title: "Type", defaultOpen: true },
    { id: "surface", title: "Surface", defaultOpen: true },
    { id: "gradient", title: "Gradient" },
    { id: "glass", title: "Glass" },
    { id: "stage", title: "Stage" },
    { id: "root", title: "Root" },
  ],
  fields: [
    // ── The surface the banner wears. ────────────────────────────────────────
    {
      id: "variant",
      label: "Variant",
      group: "surface",
      kind: "choice",
      prop: "variant",
      default: "gradient", // :241
      options: panelHeroVariantOptions,
    },
    {
      id: "tone",
      label: "Tone",
      group: "surface",
      kind: "custom",
      prop: "tone",
      // :239 destructures nothing, and :260 falls through to "none" → neutral.
      // The JSDoc's `@default "blue"` (:73) is not what runs, so it is not the
      // docs' default either.
      default: "none",
      emit: (value) =>
        String(value ?? "none") === "none" ? null : `tone=${JSON.stringify(value)}`,
      render: ({ state, set }) =>
        createElement(SurfaceToneSwatches, {
          value: String(state.tone ?? "none") as SurfaceTone,
          onSelect: (next: SurfaceTone) => set("tone", next),
        }),
    },
    {
      id: "padding",
      label: "Padding",
      group: "surface",
      kind: "choice",
      prop: "padding",
      default: "sm", // :244
      options: panelPaddingOptions,
    },
    {
      id: "corner",
      label: "Corner",
      group: "surface",
      kind: "choice",
      prop: "corner",
      // :261-262 — `corner ?? (rounded ? DEFAULT_SURFACE_CORNER : "none")`, and
      // the theme's default is "rounded-md" (Theme.ts:1531-1532), which is the
      // scale name for the `rounded-2xl` class (Theme.ts:1511-1515).
      default: "rounded-md",
      options: panelCornerOptions,
    },
    {
      id: "decoration",
      label: "Decoration",
      group: "surface",
      kind: "choice",
      prop: "decoration",
      default: "both", // :247
      options: panelDecorationOptions,
    },
    {
      id: "raisedSurface",
      label: "Raised surface",
      group: "surface",
      kind: "toggle",
      prop: "raisedSurface",
      default: false, // :255
      // Only the Panel branch receives it (:296); the band has no fill to lift.
      when: isSurface,
      emit: (value, state) =>
        isSurface(state) && value === true ? "raisedSurface" : null,
    },

    // ── The words. ───────────────────────────────────────────────────────────
    {
      id: "titleAs",
      label: "Title element",
      group: "banner",
      kind: "choice",
      prop: "titleAs",
      default: "p", // :237,:155
      options: panelHeroTitleElementOptions,
    },
    {
      id: "icon",
      label: "Icon",
      group: "banner",
      kind: "choice",
      prop: "icon",
      default: DEFAULT_ICON,
      /*
       * A registry name and a node are different props in practice: the name
       * goes through `CustomIcon` sized by the title (:168-172 + CHIP_SIZES
       * :128-134), the node is rendered verbatim (:174). "None" prints nothing
       * and the chip is not drawn at all (:181).
       */
      emit: (value, _state, h) => {
        const choice = String(value ?? DEFAULT_ICON);
        if (choice === "none") return null;
        if (choice === "node") {
          // Verbatim, exactly as :174 renders it — sized by whoever wrote it.
          return `icon={${h.jsx(ICON_NODE, { names: FIXTURE_NAMES })}}`;
        }
        return `icon=${JSON.stringify(choice)}`;
      },
      options: ICON_OPTIONS,
    },
    {
      id: "title",
      label: "Title",
      group: "banner",
      kind: "text",
      prop: "title",
      default: DEFAULT_TITLE,
      // Required (:62): an empty title is still an attribute the reader needs.
      emit: (value) => `title=${JSON.stringify(String(value ?? ""))}`,
    },
    {
      id: "subtitle",
      label: "Subtitle",
      group: "banner",
      kind: "text",
      prop: "subtitle",
      default: DEFAULT_SUBTITLE,
      emit: (value) => {
        const text = String(value ?? "").trim();
        return text === "" ? null : `subtitle=${JSON.stringify(text)}`;
      },
    },
    {
      id: "actions",
      label: "Actions as children",
      group: "banner",
      kind: "toggle",
      prop: null,
      // Children, not an attribute (:56-60) — they go inside the tag, and they
      // used to be spread onto the wrapper and then overwritten (:31-43).
      default: true,
    },
    {
      id: "titleSize",
      label: "Title size",
      group: "type",
      kind: "choice",
      prop: "titleSize",
      default: "sm", // :242
      options: options(controlSizeOptions),
    },
    {
      id: "subtitleSize",
      label: "Subtitle size",
      group: "type",
      kind: "choice",
      prop: "subtitleSize",
      default: "xs", // :243
      options: options(controlSizeOptions),
    },

    // ── The band's own paint. ────────────────────────────────────────────────
    {
      id: "glowIntensity",
      label: "Glow",
      group: "gradient",
      kind: "choice",
      prop: "glowIntensity",
      // The component's own (:250) — not the kit's standing "subtle"
      // (Theme.ts:510), which is what the fields use.
      default: "soft",
      options: options(glowIntensityOptions),
      // Only the band draws a halo (:305,:319-330); a Panel surface gets none —
      // including when the reader set the intensity before switching away.
      when: isGradient,
      emit: (value, state) =>
        isGradient(state) && String(value ?? "soft") !== "soft"
          ? `glowIntensity=${JSON.stringify(value)}`
          : null,
    },
    {
      id: "gradientFrom",
      label: "Stop from",
      group: "gradient",
      kind: "text",
      prop: "gradientFrom",
      // Empty means the tone's own 700 (:310). Overriding it is opting out of
      // the contrast floor the band otherwise keeps (:223-233).
      default: "",
      emit: (value, state) => {
        const text = String(value ?? "").trim();
        return isGradient(state) && text !== ""
          ? `gradientFrom=${JSON.stringify(text)}`
          : null;
      },
      when: isGradient,
    },
    {
      id: "gradientTo",
      label: "Stop to",
      group: "gradient",
      kind: "text",
      prop: "gradientTo",
      default: "",
      emit: (value, state) => {
        const text = String(value ?? "").trim();
        return isGradient(state) && text !== ""
          ? `gradientTo=${JSON.stringify(text)}`
          : null;
      },
      when: isGradient,
    },

    // ── Only for the see-through surfaces. ───────────────────────────────────
    {
      id: "glassOpacity",
      label: "Glass opacity",
      group: "glass",
      kind: "choice",
      prop: "glassOpacity",
      default: PANEL_DEFAULT,
      options: withInherit("Panel", glassOpacityOptions),
      emit: (value, state) =>
        isGlassy(state) && String(value ?? PANEL_DEFAULT) !== PANEL_DEFAULT
          ? `glassOpacity=${JSON.stringify(value)}`
          : null,
      when: isGlassy,
    },
    {
      id: "transparency",
      label: "Transparency",
      group: "glass",
      kind: "choice",
      prop: "transparency",
      default: PANEL_DEFAULT,
      // `none | low | medium | high` (common/theme/surfaceTransparency.ts:3-4),
      // and Panel's own answer is already "high" on glass and liquid-glass
      // (surfaceTransparency.ts:7-9) — so "Panel default" is not "opaque".
      options: withInherit("Panel", [
        { label: "None", value: "none" },
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
      ]),
      emit: (value, state) =>
        isGlassy(state) && String(value ?? PANEL_DEFAULT) !== PANEL_DEFAULT
          ? `transparency=${JSON.stringify(value)}`
          : null,
      when: isGlassy,
    },
    {
      id: "vibrancy",
      label: "Vibrancy",
      group: "glass",
      kind: "choice",
      prop: "vibrancy",
      default: PANEL_DEFAULT,
      options: withInherit("Panel", glassVibrancyOptions),
      emit: (value, state) =>
        isGlassy(state) && String(value ?? PANEL_DEFAULT) !== PANEL_DEFAULT
          ? `vibrancy=${JSON.stringify(value)}`
          : null,
      when: isGlassy,
    },
    {
      id: "specularMode",
      label: "Specular",
      group: "glass",
      kind: "choice",
      prop: "specularMode",
      default: PANEL_DEFAULT,
      options: withInherit("Panel", panelSpecularOptions),
      emit: (value, state) =>
        isGlassy(state) && String(value ?? PANEL_DEFAULT) !== PANEL_DEFAULT
          ? `specularMode=${JSON.stringify(value)}`
          : null,
      when: isGlassy,
    },

    // ── Stage furniture, neither of them a prop. ─────────────────────────────
    {
      id: "backdrop",
      label: "Behind the banner",
      group: "stage",
      kind: "choice",
      prop: null,
      default: "page",
      options: BACKDROP_OPTIONS,
    },
    {
      id: "clipped",
      label: "Ancestor clips (overflow-auto)",
      group: "stage",
      kind: "toggle",
      prop: null,
      // The halo is inset inside the padding the band reserves (:315,:323) so a
      // scroller cannot cut it — the switch exists to watch that hold.
      default: false,
      when: (state) => String(state.backdrop ?? "page") === "artwork",
    },

    // ── The root. ────────────────────────────────────────────────────────────
    {
      id: "className",
      label: "Class",
      group: "root",
      kind: "text",
      prop: "className",
      // Lands on the band for the gradient (:336) and on the Panel otherwise
      // (:286) — different elements, same prop.
      default: "",
      emit: (value) => {
        const text = String(value ?? "").trim();
        return text === "" ? null : `className=${JSON.stringify(text)}`;
      },
    },
  ],
  data: [
    {
      id: "backdrop",
      constName: "BACKDROP_CLASS",
      // Not an attribute: it belongs to the wrapper the banner is placed on, and
      // the component has no word for what sits behind it (:52-109).
      prop: null,
      label: "What sits behind the banner",
      note: "Stage furniture, not a prop — put your own artwork here.",
      emit: "source",
      value: () => backdropClass(false),
      // The clip switch joins the same class list the preview composes, so the
      // reader who copies this gets the same scroller that does not cut the halo.
      source: (state) => JSON.stringify(backdropClass(state.clipped === true)),
    },
  ],
};
