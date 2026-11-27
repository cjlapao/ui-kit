import { createElement } from "react";
import type {
  PlaygroundConfig,
  PlaygroundField,
  PlaygroundOption,
  PlaygroundState,
} from "../../shared/playground/schema";
import {
  glassOpacityOptions,
  glassVibrancyOptions,
  panelActionLayoutOptions,
  panelClickableOptions,
  panelCornerOptions,
  panelDecorationOptions,
  panelHoverableOptions,
  panelLoaderTypeOptions,
  panelMediaPlacementOptions,
  panelPaddingOptions,
  surfaceVariantOptions,
} from "../../shared/options";
import {
  BODY_TEXT,
  HueLever,
  ToneLever,
  actionsFor,
  mediaFor,
  triEmit,
} from "./panelStage";

/**
 * Panel's playground, as data.
 *
 * Panel is the kit's container standard, so this list is long — and the length
 * is the point: every entry is one control, one value, one printed line, and
 * the lines that would describe a prop the component cannot see are the ones
 * that switch themselves off. `Panel.tsx` reads `vibrancy` and `glassOpacity`
 * on the `liquid-glass` branch alone (:1011-1012); it answers an absent
 * `hoverable`/`clickable` with `Boolean(onClick)` (:725,731); it suppresses
 * decoration outright in overlay mode (:927-930); and `pulsing` is
 * `pulse && !disabled` (:921). Those are gated or emitted by hand rather than
 * printed as if they were plain strings.
 *
 * Defaults are `Panel.tsx:645-711`'s own destructuring, not this page's taste.
 */

const options = (list: readonly { label: string; value: string }[]): PlaygroundOption[] =>
  list as PlaygroundOption[];

const GLASS_VARIANTS = ["glass", "liquid-glass", "default"];
const isGlass = (state: PlaygroundState): boolean =>
  GLASS_VARIANTS.includes(String(state.variant));
const isLiquid = (state: PlaygroundState): boolean => state.variant === "liquid-glass";
// Every predicate reads `?? default`, never the bare key: a `when` that trusts
// `state` to be seeded would hide a control the reader has not touched yet, and
// the rule is that a hidden control and its line of code go together.
const hasMedia = (state: PlaygroundState): boolean => (state.showMedia ?? true) === true;
const hasActions = (state: PlaygroundState): boolean => (state.showActions ?? true) === true;
const hasBadge = (state: PlaygroundState): boolean => (state.showBadge ?? true) === true;
const isLoading = (state: PlaygroundState): boolean => (state.loading ?? false) === true;
const loaderShown = (state: PlaygroundState): boolean =>
  isLoading(state) && (state.loaderType ?? "skeleton") !== "skeleton";
/** `overlay` suppresses decoration entirely (Panel.tsx:927-930). */
const decorationVisible = (state: PlaygroundState): boolean =>
  !(hasMedia(state) && state.mediaPlacement === "overlay");

/** A hue control whose empty choice means "the prop is absent". */
const hueField = (
  id: string,
  label: string,
  autoLabel: string,
  when?: (state: PlaygroundState) => boolean,
): PlaygroundField => ({
  id,
  label,
  group: "states",
  kind: "custom",
  prop: id,
  default: "",
  when,
  emit: (value) => (value === "" ? null : `${id}=${JSON.stringify(value)}`),
  render: ({ state, set }) =>
    createElement(HueLever, {
      autoLabel,
      value: typeof state[id] === "string" && state[id] !== "" ? String(state[id]) : undefined,
      onChange: (hue: string | undefined) => set(id, hue ?? ""),
    }),
});

export const panelConfig: PlaygroundConfig = {
  groups: [
    { id: "surface", title: "Surface", defaultOpen: true },
    { id: "content", title: "Content", defaultOpen: true },
    { id: "states", title: "States", defaultOpen: true },
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
      // `Panel.tsx:656` destructures no default; `resolvePanelTone` maps the
      // absence to "none", which is also what `data-tone` reports.
      default: "none",
      emit: (value, _state, h) =>
        value === "none" ? null : `tone=${h.lit(value)}`,
      render: ({ state, set }) =>
        createElement(ToneLever, {
          value: String(state.tone ?? "none"),
          onSelect: (hue: string) => set("tone", hue),
        }),
    },
    {
      id: "transparency",
      label: "Transparency",
      group: "surface",
      kind: "choice",
      prop: "transparency",
      // `auto` is the absent prop: `resolveSurfaceTransparency` then picks
      // `high` for glass, liquid-glass and subtle, `none` for everything else.
      default: "auto",
      options: [
        { value: "auto", label: "Variant default" },
        ...options(["none", "low", "medium", "high"].map((value) => ({ value, label: value }))),
      ],
    },
    {
      id: "corner",
      label: "Corner",
      group: "surface",
      kind: "choice",
      prop: "corner",
      // Theme.ts:1531 — the container default, which renders `rounded-2xl`.
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
      // Theme.ts:1859.
      default: "sm",
      options: options(panelPaddingOptions),
    },
    {
      id: "maxWidth",
      label: "Max width (px)",
      group: "surface",
      kind: "number",
      prop: "maxWidth",
      min: 0,
      max: 640,
      step: 10,
      // 0 is the playground's "unset": a number becomes `${n}px` at :934-937,
      // and an absent prop writes no style at all.
      default: 0,
      emit: (value, _state, h) =>
        Number(value) > 0 ? `maxWidth={${h.lit(value)}}` : null,
    },
    {
      id: "minHeight",
      label: "Min height (px)",
      group: "surface",
      kind: "number",
      prop: "minHeight",
      min: 0,
      max: 640,
      step: 10,
      default: 0,
      emit: (value, _state, h) =>
        Number(value) > 0 ? `minHeight={${h.lit(value)}}` : null,
    },
    {
      id: "decoration",
      label: "Decoration",
      group: "surface",
      kind: "choice",
      prop: "decoration",
      default: "none",
      when: decorationVisible,
      options: options(panelDecorationOptions),
    },

    /* ---------------------------------------------------------------- content */
    {
      id: "showMedia",
      label: "Media",
      group: "content",
      kind: "toggle",
      // The lever, not the prop: `media` itself is a data source, so the
      // fixture and its attribute come from one place.
      prop: null,
      default: true,
    },
    {
      id: "mediaPlacement",
      label: "Media placement",
      group: "content",
      kind: "choice",
      prop: "mediaPlacement",
      default: "top",
      when: hasMedia,
      options: options(panelMediaPlacementOptions),
    },
    {
      id: "showBadge",
      label: "Badge",
      group: "content",
      kind: "toggle",
      prop: null,
      default: true,
    },
    {
      id: "badge",
      label: "Badge label",
      group: "content",
      kind: "text",
      prop: "badge",
      default: "New",
      when: hasBadge,
      // A string badge is wrapped in the panel's own pill (Panel.tsx:1064-1075),
      // so the label is on screen and must be in the source.
      alwaysEmit: true,
    },
    {
      id: "title",
      label: "Title",
      group: "content",
      kind: "text",
      prop: "title",
      default: "Panel title",
      alwaysEmit: true,
    },
    {
      id: "subtitle",
      label: "Subtitle",
      group: "content",
      kind: "text",
      prop: "subtitle",
      default: "A subtitle",
      alwaysEmit: true,
    },
    {
      id: "description",
      label: "Description",
      group: "content",
      kind: "text",
      prop: "description",
      default: "A description, which uses the surface's muted tone.",
      alwaysEmit: true,
    },
    {
      id: "showActions",
      label: "Actions",
      group: "content",
      kind: "toggle",
      prop: null,
      default: true,
    },
    {
      id: "actionLayout",
      label: "Action layout",
      group: "content",
      kind: "choice",
      prop: "actionLayout",
      default: "auto",
      when: hasActions,
      options: options(panelActionLayoutOptions),
    },
    {
      id: "loading",
      label: "Loading",
      group: "content",
      kind: "toggle",
      prop: "loading",
      default: false,
    },
    {
      id: "loaderType",
      label: "Loader type",
      group: "content",
      kind: "choice",
      prop: "loaderType",
      default: "skeleton",
      when: isLoading,
      options: options(panelLoaderTypeOptions),
    },
    {
      id: "skeletonLines",
      label: "Skeleton lines",
      group: "content",
      kind: "number",
      prop: "skeletonLines",
      min: 0,
      max: 8,
      // Panel.tsx:676.
      default: 3,
      when: (state) =>
        isLoading(state) && (state.loaderType ?? "skeleton") === "skeleton",
    },
    {
      id: "loaderTitle",
      label: "Loader title",
      group: "content",
      kind: "text",
      prop: "loaderTitle",
      default: "Loading…",
      when: loaderShown,
      alwaysEmit: true,
    },
    {
      id: "loaderMessage",
      label: "Loader message",
      group: "content",
      kind: "text",
      prop: "loaderMessage",
      default: "Getting things ready…",
      when: loaderShown,
      alwaysEmit: true,
    },
    {
      id: "loaderProgress",
      label: "Loader progress (%)",
      group: "content",
      kind: "number",
      prop: "loaderProgress",
      min: 0,
      max: 100,
      default: 30,
      when: (state) =>
        loaderShown(state) && (state.loaderType ?? "skeleton") === "progress",
      alwaysEmit: true,
    },

    /* ----------------------------------------------------------------- states */
    {
      id: "onClick",
      label: "onClick",
      group: "states",
      kind: "toggle",
      prop: "onClick",
      // Off, because the component has no handler of its own. Switching it on
      // is the interesting act: it is what `hoverable` and `clickable` default
      // to (Panel.tsx:725,731), what adds `role="button"` and a tab stop
      // (:1330-1331), and what attaches the Enter/Space path (:1354-1357).
      default: false,
      emit: (value) => (value ? "onClick={onActivate}" : null),
    },
    {
      id: "hoverable",
      label: "Hoverable",
      group: "states",
      kind: "choice",
      prop: "hoverable",
      default: "auto",
      options: options(panelHoverableOptions),
      emit: triEmit("hoverable"),
    },
    {
      id: "clickable",
      label: "Clickable",
      group: "states",
      kind: "choice",
      prop: "clickable",
      default: "auto",
      options: options(panelClickableOptions),
      emit: triEmit("clickable"),
    },
    {
      id: "hoverShadow",
      label: "Hover shadow",
      group: "states",
      kind: "toggle",
      prop: "hoverShadow",
      default: false,
      // Deliberately not gated on `hoverable`: `hoverShadow && "hover:shadow-xl
      // hover:-translate-y-[1px]"` (:1283) is unconditional, so the lift paints
      // with `hoverable={false}` too. Only the shared transition list that
      // eases it alongside the tint is gated (:1288-1296).
    },
    {
      id: "disabled",
      label: "Disabled",
      group: "states",
      kind: "toggle",
      prop: "disabled",
      default: false,
    },
    {
      id: "disabledVeil",
      label: "Disabled sheet",
      group: "states",
      kind: "toggle",
      prop: "disabledVeil",
      default: true,
      // The sheet is painted inside the `disabled` branch (Panel.tsx:1479-1484).
      when: (state) => (state.disabled ?? false) === true,
    },
    {
      id: "active",
      label: "Selected",
      group: "states",
      kind: "toggle",
      prop: "active",
      default: false,
    },
    hueField(
      "activeTone",
      "Selected hue",
      "Auto — borderColor, then tone, then blue",
      // Not only while selected: `activeHue` (Panel.tsx:891-894) is what the
      // hover chain reads when the card is active (:857-859) *and* what the
      // glow wears through `pulseHue = pulseTone ?? activeHue` (:922), selected
      // or not — so a pulsing card answers to this hue on its own.
      (state) =>
        (state.active ?? false) === true ||
        ((state.pulse ?? false) === true && (state.disabled ?? false) !== true),
    ),
    {
      id: "pulse",
      label: "Pulse",
      group: "states",
      kind: "toggle",
      prop: "pulse",
      default: false,
    },
    hueField(
      "pulseTone",
      "Pulse hue",
      "Auto — the selected hue",
      // `pulsing = pulse && !disabled` (Panel.tsx:921).
      (state) => (state.pulse ?? false) === true && (state.disabled ?? false) !== true,
    ),
    hueField(
      "hoverColor",
      "Hover hue",
      "Auto — the selected hue while selected, else the panel's own",
      (state) => (state.hoverable ?? "auto") !== "off",
    ),
    hueField("borderColor", "Border colour", "Auto — the variant's own edge"),
    hueField(
      "backgroundColor",
      "Background colour",
      "Auto — the variant's fill for its tone",
    ),
    {
      id: "raisedSurface",
      label: "Raised surface",
      group: "states",
      kind: "toggle",
      prop: "raisedSurface",
      default: false,
    },
    {
      id: "nestedSurface",
      label: "Nested step",
      group: "states",
      kind: "toggle",
      prop: "nestedSurface",
      // Panel.tsx:704 — a matching parent panel nudges a child's fill unless
      // this is off, or unless `backgroundColor` has taken over the paint
      // (:718 passes `nestedSurface && !backgroundColor`).
      default: true,
    },
    {
      id: "scrollable",
      label: "Body scroll",
      group: "states",
      kind: "toggle",
      prop: "scrollable",
      // Panel.tsx:706 — off drops the body's `overflow-auto` (:1158).
      default: true,
    },
    {
      id: "flexBody",
      label: "Flex body",
      group: "states",
      kind: "toggle",
      prop: "flexBody",
      default: false,
    },

    /* ------------------------------------------------------------------ glass */
    {
      id: "specularMode",
      label: "Specular",
      group: "glass",
      kind: "choice",
      prop: "specularMode",
      // `auto` is the absent prop; `resolvedSpecularMode` (:820-824) then
      // answers `classic` unless the deprecated `specularHighlight={false}`.
      default: "auto",
      when: isGlass,
      options: [
        { value: "auto", label: "Auto" },
        // Pinning `classic` prints the prop; leaving Auto prints nothing and
        // resolves to classic anyway (:820-824).
        { value: "classic", label: "Classic" },
        { value: "none", label: "None" },
        { value: "halo", label: "Halo" },
      ],
    },
    {
      id: "vibrancy",
      label: "Vibrancy",
      group: "glass",
      kind: "choice",
      prop: "vibrancy",
      default: "auto",
      // Read only on the `liquid-glass` branch (:958,1011) — the old playground
      // offered it for every translucent variant, where it changed nothing.
      when: isLiquid,
      options: [
        { value: "auto", label: "Auto" },
        ...options(glassVibrancyOptions),
      ],
    },
    {
      id: "glassOpacity",
      label: "Glass opacity",
      group: "glass",
      kind: "choice",
      prop: "glassOpacity",
      default: "auto",
      // Same: `glassFillClass` is applied at :1012, inside `liquid-glass`.
      when: isLiquid,
      options: [
        { value: "auto", label: "Auto" },
        ...options(glassOpacityOptions),
      ],
    },
  ],
  data: [
    {
      id: "media",
      prop: "media",
      constName: "MEDIA",
      label: "The card's media",
      note: "a gradient block standing in for an image",
      emit: "source",
      // The preview mounts this element; the Code view prints the same one (:559
      // walks it), so the card and the snippet cannot disagree about the media.
      value: (state) => mediaFor(state),
      when: hasMedia,
      source: (state, h) => h.jsx(mediaFor(state), { names: {} }),
    },
    {
      id: "actions",
      prop: "actions",
      constName: "ACTIONS",
      label: "The card's own buttons",
      note: "Panel renders each entry as a Button (:1190); your handler goes in onClick",
      emit: "source",
      value: () => actionsFor(),
      when: hasActions,
      source: (_state, h) => h.jsx(actionsFor(), { replace: { onClick: "onAction" } }),
    },
    {
      id: "content",
      prop: null,
      label: "Body copy",
      note: "the panel's children, printed as children",
      emit: "literal",
      value: () => BODY_TEXT,
    },
  ],
};

