import { createElement } from "react";
import { HueSwatches } from "../../shared/HueControl";
import { SurfaceToneSwatches } from "../../shared/SurfaceToneControl";
import {
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelSpecularOptions,
} from "../../shared/options";
import type { TrueColor } from "@cjlapao/ui-kit";
import type {
  PlaygroundConfig,
  PlaygroundOption,
} from "../../shared/playground/schema";
import {
  DEFAULT_ACCENT_COLOR,
  DEFAULT_ARIA_LABEL,
  PANEL_DEFAULT,
  isFloatingGlass,
  isLiquid,
  showsRaisedSurface,
  showsTone,
  showsTransparency,
  textOf,
} from "./pageHeaderStage";

/**
 * Every option the bar offers, in one list — the controls column, the preview and
 * the Code view are all read out of it, so a control that vanished from the screen
 * cannot survive in the printed snippet.
 *
 * Each entry that has a counterpart in the component carries the line it comes
 * from. The `inherit` members are this page's spelling for `undefined` — the
 * variant keeps its own default — which is why each of them prints nothing.
 */

const inheritOptions = (
  options: readonly PlaygroundOption[],
  note: string,
): PlaygroundOption[] => [
  { label: `Inherit — ${note}`, value: PANEL_DEFAULT },
  ...options.map(({ label, value }) => ({ label, value })),
];

/** The gutter ladder: `Panel`'s padding token names on a margin scale (Theme.ts:1932-1935). */
const GUTTER_LADDER: PlaygroundOption[] = [
  { label: "None", value: "none" },
  { label: "Xs", value: "xs" },
  { label: "Sm", value: "sm" },
  { label: "Md", value: "md" },
  { label: "Lg", value: "lg" },
  { label: "Xl", value: "xl" },
];

/** The transparency ladder, as `SurfaceTransparency` spells it. */
const TRANSPARENCY_LADDER: PlaygroundOption[] = [
  { label: "None", value: "none" },
  { label: "Subtle", value: "subtle" },
  { label: "Tonal", value: "tonal" },
  { label: "Simple", value: "simple" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

/**
 * The variant ladder: the nine `SURFACE_VARIANTS` (`Theme.ts:1069-1078` — here
 * `default` means the seam bar, `PageHeader.tsx:46-48`), plus the two floating
 * compatibility names and the `plain` alias (`:22`).
 */
const VARIANT_OPTIONS: PlaygroundOption[] = [
  { label: "Default — the seam bar", value: "default" },
  { label: "Elevated", value: "elevated" },
  { label: "Outlined", value: "outlined" },
  { label: "Subtle", value: "subtle" },
  { label: "Tonal", value: "tonal" },
  { label: "Glass", value: "glass" },
  { label: "Liquid glass", value: "liquid-glass" },
  { label: "Simple", value: "simple" },
  { label: "None", value: "none" },
  { label: "Plain — alias of none", value: "plain" },
  { label: "Floating", value: "floating" },
  { label: "Floating glass", value: "floating-glass" },
];

const swatches = (
  state: Record<string, string | number | boolean>,
  set: (id: string, value: string) => void,
) =>
  createElement(SurfaceToneSwatches, {
    value: String(state.tone ?? "none") as TrueColor | "none",
    onSelect: (value: TrueColor | "none") => set("tone", String(value)),
  });

const hues = (
  state: Record<string, string | number | boolean>,
  set: (id: string, value: string) => void,
) =>
  createElement(HueSwatches, {
    value: state.accentColor === PANEL_DEFAULT ? undefined : (String(state.accentColor) as TrueColor),
    onSelect: (value?: TrueColor) => set("accentColor", value ?? PANEL_DEFAULT),
    autoLabel: "Auto — the variant's own hue",
  });

/** `inherit` means the caller never wrote the prop, so the line must not appear. */
const gated = (name: string, value: unknown, lit: (text: string) => string) =>
  value === PANEL_DEFAULT ? null : `${name}=${lit(String(value))}`;

export const PAGE_HEADER_GROUPS = [
  { id: "regions", title: "Regions", defaultOpen: true },
  { id: "surface", title: "Surface", defaultOpen: true },
  { id: "glass", title: "Glass", defaultOpen: false },
  { id: "gutter", title: "Gutter", defaultOpen: false },
  { id: "naming", title: "Naming", defaultOpen: false },
  { id: "shell", title: "Shell", defaultOpen: false },
];

export const pageHeaderConfig: PlaygroundConfig = {
  groups: PAGE_HEADER_GROUPS,
  fields: [
    {
      id: "start",
      label: "start — brand and trail",
      group: "regions",
      kind: "toggle",
      default: true,
      // The prop is real (`PageHeader.tsx:28`) but its value is an element, so the
      // line prints the hoisted const the preview mounts instead of a literal.
      prop: null,
      emit: (value) => (value === true ? "start={TRAIL}" : null),
    },
    {
      id: "center",
      label: "center — status note",
      group: "regions",
      kind: "toggle",
      default: false,
      prop: null,
      emit: (value) => (value === true ? "center={NOTE}" : null),
    },
    {
      id: "end",
      label: "end — page controls",
      group: "regions",
      kind: "toggle",
      default: true,
      prop: null,
      emit: (value) => (value === true ? "end={ACTIONS}" : null),
    },
    {
      id: "extra",
      label: "children — fourth group",
      group: "regions",
      kind: "toggle",
      default: false,
      // The one region the reader cannot pass by name: `children` is appended after
      // the three (`:191`), so the code view prints it between the tags and this
      // control prints nothing of its own.
      prop: null,
      emit: () => null,
    },
    {
      id: "variant",
      label: "variant",
      group: "surface",
      kind: "choice",
      default: "default",
      docDefault: "default",
      // `:119` opens on the seam bar and `:143` decides which names get a `Panel`
      // behind them; the two floating names keep their own card chrome (`:170-176`).
      prop: "variant",
      options: VARIANT_OPTIONS,
      control: "select",
    },
    {
      id: "tone",
      label: "tone — Panel's palette",
      group: "surface",
      kind: "custom",
      default: "none",
      // Forwarded to the body `Panel` at `:183` and read nowhere else, so it earns a
      // control only while one is rendered (`:143`) and on the variants that consult
      // a palette at all.
      prop: "tone",
      when: showsTone,
      render: ({ state, set }) => swatches(state, set),
    },
    {
      id: "accentColor",
      label: "accentColor — frosted tint",
      group: "surface",
      kind: "custom",
      default: DEFAULT_ACCENT_COLOR,
      // `:120` defaults it to `blue`, `:144` reads it for the two floating names
      // only, and the JSDoc at `:68` says the rest ignore it — so the control is for
      // `floating-glass` alone. `Auto` is the same colour by another route: it
      // unsets the prop, which `:120` then fills back in.
      prop: "accentColor",
      when: isFloatingGlass,
      render: ({ state, set }) => hues(state, set),
      // A field with an `emit` never reaches the default check, so the two
      // spellings of "leave it out" have to be said here: `inherit` (the control's
      // Auto) and the component's own `blue` (:120).
      emit: (value) =>
        value === PANEL_DEFAULT || value === DEFAULT_ACCENT_COLOR
          ? null
          : gated("accentColor", value, (text) => `"${text}"`),
    },
    {
      id: "corner",
      label: "corner — Panel's scale",
      group: "surface",
      kind: "choice",
      default: "rounded-md",
      docDefault: "rounded-md",
      // `:132` takes Panel's own default, which resolves to `rounded-2xl`
      // (Theme.ts:1515) — the radius the floating cards already had, so a paired
      // menu and header only drift once you turn this knob (`:98-100`).
      prop: "corner",
      options: panelCornerOptions,
      control: "select",
    },
    {
      id: "glassOpacity",
      label: "glassOpacity",
      group: "glass",
      kind: "choice",
      default: PANEL_DEFAULT,
      // `:59` forwards it; Panel spends it on the liquid fill and nowhere else
      // (Panel.tsx:1012, and its own JSDoc at Panel.tsx:327-333 says so).
      prop: "glassOpacity",
      options: inheritOptions(glassOpacityOptions, "Panel's frosted"),
      when: isLiquid,
      emit: (value) => gated("glassOpacity", value, (text) => `"${text}"`),
    },
    {
      id: "vibrancy",
      label: "vibrancy",
      group: "glass",
      kind: "choice",
      default: PANEL_DEFAULT,
      // `:61` forwards it; the backdrop it tunes is a liquid-glass feature
      // (Panel.tsx:1011, Panel.tsx:320-324).
      prop: "vibrancy",
      options: inheritOptions(glassVibrancyOptions, "Panel's medium"),
      when: isLiquid,
      emit: (value) => gated("vibrancy", value, (text) => `"${text}"`),
    },
    {
      id: "specularMode",
      label: "specularMode",
      group: "glass",
      kind: "choice",
      default: PANEL_DEFAULT,
      // `:62` forwards it; the highlight is liquid-glass only
      // (Panel.tsx:344-349).
      prop: "specularMode",
      options: inheritOptions(panelSpecularOptions, "Panel's classic"),
      when: isLiquid,
      emit: (value) => gated("specularMode", value, (text) => `"${text}"`),
    },
    {
      id: "transparency",
      label: "transparency",
      group: "glass",
      kind: "choice",
      default: PANEL_DEFAULT,
      // `:60` forwards it, and the scale can only thin an alpha background that is
      // already there — with no `/alpha` in the class list the classes come back
      // untouched (surfaceTransparency.ts:27), which is why this one gates on
      // variant *and* tone.
      prop: "transparency",
      options: inheritOptions(TRANSPARENCY_LADDER, "variant decides"),
      when: showsTransparency,
      emit: (value) => gated("transparency", value, (text) => `"${text}"`),
    },
    {
      id: "raisedSurface",
      label: "raisedSurface",
      group: "glass",
      kind: "toggle",
      default: false,
      // `:126` opens false and `:184` forwards it; outside the nesting ladder's
      // tinted variants Panel documents it a no-op (Panel.tsx:312-314).
      prop: "raisedSurface",
      when: showsRaisedSurface,
    },
    {
      id: "padding",
      label: "padding — every side",
      group: "gutter",
      kind: "choice",
      default: PANEL_DEFAULT,
      // The footgun, stated plainly: this is the space OUTSIDE the bar
      // (`:73-88`, painted as margins at `:165-168`), not the inset inside it, which
      // stays the seam's own `px-5` (`:163`). Per axis it loses to `paddingTop` and
      // its three siblings (`:153-156`).
      prop: "padding",
      options: inheritOptions(GUTTER_LADDER, "variant decides"),
      control: "select",
      emit: (value) => gated("padding", value, (text) => `"${text}"`),
    },
    {
      id: "paddingTop",
      label: "paddingTop",
      group: "gutter",
      kind: "choice",
      default: PANEL_DEFAULT,
      // `:89` — above the bar; the floating card keeps the menu's `m-2` here
      // (`:151`, `:153`).
      prop: "paddingTop",
      options: inheritOptions(GUTTER_LADDER, "variant decides"),
      control: "select",
      emit: (value) => gated("paddingTop", value, (text) => `"${text}"`),
    },
    {
      id: "paddingRight",
      label: "paddingRight",
      group: "gutter",
      kind: "choice",
      default: PANEL_DEFAULT,
      // `:91` — a *physical* right margin (`mr-*`, Theme.ts:1933), so unlike the
      // region props it does not follow the writing direction.
      prop: "paddingRight",
      options: inheritOptions(GUTTER_LADDER, "variant decides"),
      control: "select",
      emit: (value) => gated("paddingRight", value, (text) => `"${text}"`),
    },
    {
      id: "paddingBottom",
      label: "paddingBottom",
      group: "gutter",
      kind: "choice",
      default: PANEL_DEFAULT,
      // `:93` — flush whatever the variant is, because a gutter below the bar would
      // lift it off the page it is supposed to sit on (`:155`).
      prop: "paddingBottom",
      options: inheritOptions(GUTTER_LADDER, "variant decides"),
      control: "select",
      emit: (value) => gated("paddingBottom", value, (text) => `"${text}"`),
    },
    {
      id: "paddingLeft",
      label: "paddingLeft",
      group: "gutter",
      kind: "choice",
      default: PANEL_DEFAULT,
      // `:95` — flush on the side that faces the sidebar, which is what keeps the
      // seam continuous. Also physical (`ml-*`, Theme.ts:1935).
      prop: "paddingLeft",
      options: inheritOptions(GUTTER_LADDER, "variant decides"),
      control: "select",
      emit: (value) => gated("paddingLeft", value, (text) => `"${text}"`),
    },
    {
      id: "ariaLabel",
      label: "aria-label — which banner",
      group: "naming",
      kind: "text",
      default: DEFAULT_ARIA_LABEL,
      // Nothing here names itself: `rest` lands on the `<header>` at `:161`, so the
      // caller's `aria-label` is all a screen reader has to tell two banners apart.
      // Blank unsets it — an unnamed banner is just "banner".
      prop: null,
      emit: (_value, state, h) => {
        const label = textOf(state, "ariaLabel");
        return label ? `aria-label=${h.lit(label)}` : null;
      },
    },
    {
      id: "className",
      label: "className",
      group: "naming",
      kind: "text",
      default: "",
      // Merged last (`:178`), so it adds to the seam classes instead of replacing
      // them; blank prints nothing.
      prop: "className",
      emit: (_value, state, h) => {
        const extra = textOf(state, "className");
        return extra ? `className=${h.lit(extra)}` : null;
      },
    },
    {
      id: "shell",
      label: "show the paired sidebar",
      group: "shell",
      kind: "toggle",
      default: true,
      // Preview furniture: the `SideMenu` the bar is designed to sit beside
      // (`WithSideMenu.tsx`), never part of the printed page.
      prop: null,
      emit: () => null,
    },
    {
      id: "collapsed",
      label: "collapse it",
      group: "shell",
      kind: "toggle",
      default: false,
      // Also furniture — and the point of it: collapsing the menu shifts the whole
      // bar left without stretching anything, seam included (`:177`, test :60-67).
      prop: null,
      when: (state) => state.shell === true,
      emit: () => null,
    },
  ],
};
