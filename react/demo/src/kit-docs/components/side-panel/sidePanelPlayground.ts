import {
  controlSizeOptions,
  panelCornerOptions,
  panelPaddingOptions,
  surfaceVariantOptions,
  trueColorOptions,
} from "../../shared/options";
import type { ReactElement } from "react";
import type {
  PlaygroundConfig,
  PlaygroundField,
  PlaygroundOption,
} from "../../shared/playground/schema";
import {
  CORNER_DEFAULT,
  HEIGHT_DEFAULT,
  INSET_AUTO,
  MAX_WIDTH_DEFAULT,
  MIN_WIDTH_DEFAULT,
  SIZE_DEFAULT,
  SURFACE_TONE_DEFAULT,
  TONE_DEFAULT,
  VARIANT_DEFAULT,
  WIDTH_DEFAULT,
  isCollapsible,
  isDocked,
  isLegacy,
  isResizable,
  isVertical,
  needsHostState,
  flag,
} from "./sidePanelStage";
import {
  FOOTER,
  HEADER_ACTIONS,
  HEADER_PILLS,
  ROWS,
  SUB_HEADER,
} from "./sidePanelFixture";

/**
 * One description of the panel's options, which becomes the controls column, the
 * preview's props and the Code view's attributes. Every label cites the line that
 * decides it, and every `emit` suppresses what the component already does by
 * default — so the block a reader copies is the difference between this panel and
 * the plainest one, which is the only kind of snippet worth reading.
 *
 * Three props have no control, on purpose. `minHeight`/`maxHeight` are the vertical
 * twins of the two bounds below and are only interesting once `side` is `top` or
 * `bottom` — the table carries their numbers (120 / 600, :246-249). `raisedSurface`
 * and `glassOpacity` only reach the inner `Panel` (:965-979), which the surface
 * group already describes in words. And `onWidthChange` does not exist: a drag
 * moves local state that no callback reports (:656-665), which is a fact for the
 * table, not a knob.
 */

/** The four edges, none of them a `Placement` (:136-137,:493). */
const SIDE_OPTIONS: PlaygroundOption[] = [
  { label: "left", value: "left" },
  { label: "right", value: "right" },
  { label: "top", value: "top" },
  { label: "bottom", value: "bottom" },
];

/** `SURFACE_TONES` is `"none"` plus every palette colour (:67). */
const SURFACE_TONE_OPTIONS: PlaygroundOption[] = [
  { label: "none", value: "none" },
  ...trueColorOptions,
];

/**
 * Still accepted, each one an alias for a current surface (:45-50). They are here
 * because the Examples below use two of them and because `SIDE_PANEL_VARIANTS`
 * exports only the current nine (:42) — a page that hides the aliases cannot say
 * what `floating` actually is.
 */
const LEGACY_VARIANT_OPTIONS: PlaygroundOption[] = [
  { label: "sidebar → elevated", value: "sidebar" },
  { label: "inset → tonal", value: "inset" },
  { label: "floating → elevated", value: "floating" },
  { label: "floating-glass → glass", value: "floating-glass" },
];

const COLLAPSE_OPTIONS: PlaygroundOption[] = [
  { label: "panel owns it", value: "self" },
  { label: "host says closed", value: "collapsed" },
  { label: "host says open", value: "expanded" },
];

/** `auto` is this page's word, not the component's: it means *send nothing*. */
const INSET_OPTIONS: PlaygroundOption[] = [
  { label: "from variant", value: INSET_AUTO },
  ...panelPaddingOptions,
];

/** A JSX expression: the braces belong to the attribute, not to the printer. */
const jsx = (node: string): string => `{${node}}`;

/**
 * One entry per slot, and three jobs for it: the control, the attribute the
 * emitter prints, and the hoisted declaration the Code view shows. Slot markup is
 * where a Code view most easily lies — the preview mounting four buttons while the
 * snippet prints a comment — so the markup exists once, in the fixture, and both
 * sides are read out of this table.
 */
export interface SidePanelSlot {
  /** Field id *and* prop name: the control's key is the prop it edits. */
  id: "headerActions" | "headerPills" | "subHeader" | "footer";
  label: string;
  /** The identifier the reader sees on both sides. */
  constName: string;
  /** The very element the stage mounts, walked by `h.jsx`. */
  node: ReactElement;
  /** Kit components it mounts, so the import line is derived rather than guessed. */
  imports: string[];
  /** Whether the demo opens with it — the header's own button stays off. */
  on: boolean;
}

export const SIDE_PANEL_SLOTS: SidePanelSlot[] = [
  {
    id: "headerActions",
    // `[collapse] [headerActions] [headerPills] [close]` — the row the header
    // builds around the buttons it owns (:259).
    label: "Header actions (:259)",
    constName: "HEADER_ACTIONS",
    node: HEADER_ACTIONS,
    imports: ["Button"],
    on: false,
  },
  {
    id: "headerPills",
    label: "Header pills (:261)",
    constName: "HEADER_PILLS",
    node: HEADER_PILLS,
    imports: ["Pill"],
    on: true,
  },
  {
    id: "subHeader",
    label: "Sub-header strip (:269)",
    constName: "SUB_HEADER",
    node: SUB_HEADER,
    imports: ["Button"],
    on: true,
  },
  {
    id: "footer",
    label: "Footer (:274)",
    constName: "FOOTER",
    node: FOOTER,
    imports: ["Button"],
    on: true,
  },
];

const slotFields: PlaygroundField[] = SIDE_PANEL_SLOTS.map((slot) => ({
  id: slot.id,
  label: slot.label,
  group: "slots",
  kind: "toggle",
  prop: slot.id,
  default: slot.on,
  emit: (value) =>
    value === true ? `${slot.id}={${slot.constName}}` : null,
}));

export const sidePanelConfig: PlaygroundConfig = {
  groups: [
    { id: "board", title: "On the board", defaultOpen: true },
    { id: "surface", title: "Surface", defaultOpen: true },
    { id: "geometry", title: "Size", defaultOpen: false },
    { id: "slots", title: "Slots", defaultOpen: false },
  ],
  data: [
    {
      id: "rows",
      constName: "ROWS",
      // `null`: the body is children, so no attribute of the panel's owns this —
      // the page's `code` places the declaration where the reader needs it.
      prop: null,
      label: "what the body scrolls through",
      note: "the six rows the stage mounts, in the order they appear",
      value: () => ROWS,
      emit: "literal",
    },
  ],
  fields: [
    /* ── On the board: who owns it, where it sits ───────────────────────── */
    {
      id: "side",
      label: "Docked edge (:136,:493)",
      group: "board",
      kind: "choice",
      options: SIDE_OPTIONS,
      prop: "side",
      docDefault: "right",
      default: "right",
    },
    {
      id: "open",
      label: "Open (:839)",
      group: "board",
      kind: "toggle",
      prop: "isOpen",
      default: true,
      /**
       * `isOpen` is required, so it prints whichever way it is. Once the demo has
       * host state to read, it prints the *expression* the host is really using —
       * a literal `isOpen` next to an `onClose` that clears a different literal
       * would be a snippet that cannot run.
       */
      emit: (value, state) =>
        needsHostState(state)
          ? "isOpen={open}"
          : value === true
            ? "isOpen"
            : "isOpen={false}",
    },
    {
      id: "closable",
      label: "Close affordance (:1080)",
      group: "board",
      kind: "toggle",
      prop: "onClose",
      default: true,
      emit: (value) =>
        value === true ? `onClose=${jsx("() => setOpen(false)")}` : null,
    },
    {
      id: "docked",
      label: "In the flow (:1283)",
      group: "board",
      kind: "toggle",
      prop: "docked",
      docDefault: false,
      default: false,
    },
    {
      id: "overlay",
      label: "Overlay scrim (:1162)",
      group: "board",
      kind: "toggle",
      prop: "overlay",
      docDefault: false,
      default: false,
      // A docked panel sits beside the content, so it never gets a scrim (:1162).
      when: (state) => !isDocked(state),
    },
    {
      id: "collapsible",
      label: "Collapsible (:702)",
      group: "board",
      kind: "toggle",
      prop: "collapsible",
      docDefault: false,
      default: false,
    },
    {
      id: "collapse",
      label: "Collapse state (:702)",
      group: "board",
      kind: "choice",
      options: COLLAPSE_OPTIONS,
      prop: "collapsed",
      // "panel owns it" is the uncontrolled path: it prints nothing, because
      // passing nothing is exactly what the reader would write.
      default: "self",
      when: isCollapsible,
      control: "segments",
      emit: (value, state) => {
        if (value === "self") return null;
        // Host-owned *and* reported: the attribute and the state it reads have to
        // agree, or the snippet shows a `collapsed={true}` no callback can move.
        return flag(state, "collapseReport")
          ? "collapsed={collapsed}"
          : value === "collapsed"
            ? "collapsed"
            : "collapsed={false}";
      },
    },
    {
      id: "collapseReport",
      label: "Report collapse (:706)",
      group: "board",
      kind: "toggle",
      prop: "onCollapsedChange",
      docDefault: false,
      default: false,
      when: isCollapsible,
      emit: (value) =>
        value === true
          ? `onCollapsedChange=${jsx("(next) => setCollapsed(next)")}`
          : null,
    },
    {
      id: "collapsedLabel",
      label: "Rail label (:1138)",
      group: "board",
      kind: "text",
      prop: "collapsedLabel",
      docDefault: "",
      default: "",
      placeholder: "falls back to the title",
      when: isCollapsible,
      emit: (value) => {
        const raw = String(value).trim();
        return raw.length === 0 ? null : `collapsedLabel=${JSON.stringify(raw)}`;
      },
    },

    /* ── Surface: what it is made of ────────────────────────────────────── */
    {
      id: "variant",
      label: "Variant (:461,:497)",
      group: "surface",
      kind: "choice",
      options: [...surfaceVariantOptions, ...LEGACY_VARIANT_OPTIONS],
      prop: "variant",
      docDefault: VARIANT_DEFAULT,
      default: VARIANT_DEFAULT,
      control: "select",
    },
    {
      id: "surfaceTone",
      label: "Surface tone (:467)",
      group: "surface",
      kind: "choice",
      options: SURFACE_TONE_OPTIONS,
      prop: "surfaceTone",
      // The code's default — the JSDoc announces `neutral`, which would tint the
      // fill this panel ships without (:336 vs :467).
      docDefault: SURFACE_TONE_DEFAULT,
      default: SURFACE_TONE_DEFAULT,
      control: "select",
    },
    {
      id: "tone",
      label: "Handle accent (:494)",
      group: "surface",
      kind: "choice",
      options: trueColorOptions,
      prop: "tone",
      docDefault: TONE_DEFAULT,
      default: TONE_DEFAULT,
      control: "select",
    },
    {
      id: "size",
      label: "Size (:468,:171-216)",
      group: "surface",
      kind: "choice",
      options: controlSizeOptions,
      prop: "size",
      docDefault: SIZE_DEFAULT,
      default: SIZE_DEFAULT,
    },
    {
      id: "corner",
      label: "Corner (:474,:520)",
      group: "surface",
      kind: "choice",
      options: panelCornerOptions,
      prop: "corner",
      // `auto` is a request to inherit `DEFAULT_SURFACE_CORNER`, which is
      // `rounded-md` — the theme's answer, not `flush` (:520 → Theme.ts:1531).
      docDefault: CORNER_DEFAULT,
      default: CORNER_DEFAULT,
      control: "select",
    },
    {
      id: "flush",
      label: "Square the docked edge (:520)",
      group: "surface",
      kind: "toggle",
      prop: "flush",
      docDefault: true,
      default: true,
    },
    {
      id: "inset",
      label: "Inset (:513)",
      group: "surface",
      kind: "choice",
      options: INSET_OPTIONS,
      prop: "inset",
      default: INSET_AUTO,
      control: "select",
      emit: (value) => {
        const chosen = String(value);
        if (chosen === INSET_AUTO) return null;
        return chosen === "none"
          ? "inset={false}"
          : `inset=${JSON.stringify(chosen)}`;
      },
    },
    {
      id: "noise",
      label: "Noise layer (:546)",
      group: "surface",
      kind: "toggle",
      prop: "noise",
      docDefault: false,
      default: false,
      // The dither is painted by the inner `Panel`, which legacy aliases replace
      // wholesale with their own classes (:961-979).
      when: (state) => !isLegacy(state),
    },

    /* ── Size: one number, and the bounds the handle obeys ──────────────── */
    {
      id: "resizable",
      label: "Resizable (:1195,:809-832)",
      group: "geometry",
      kind: "toggle",
      prop: "resizable",
      docDefault: false,
      default: false,
    },
    {
      id: "width",
      label: "Width px (:697)",
      group: "geometry",
      kind: "number",
      prop: "width",
      docDefault: WIDTH_DEFAULT,
      default: WIDTH_DEFAULT,
      min: 120,
      max: 900,
      step: 20,
      when: (state) => !isVertical(state),
    },
    {
      id: "height",
      label: "Height px (:698)",
      group: "geometry",
      kind: "number",
      prop: "height",
      docDefault: HEIGHT_DEFAULT,
      default: HEIGHT_DEFAULT,
      min: 80,
      max: 320,
      step: 20,
      when: isVertical,
    },
    {
      id: "minWidth",
      label: "Min px (:827-833)",
      group: "geometry",
      kind: "number",
      prop: "minWidth",
      docDefault: MIN_WIDTH_DEFAULT,
      default: MIN_WIDTH_DEFAULT,
      min: 0,
      max: 900,
      step: 20,
      when: (state) => isResizable(state) && !isVertical(state),
    },
    {
      id: "maxWidth",
      label: "Max px (:827-833)",
      group: "geometry",
      kind: "number",
      prop: "maxWidth",
      docDefault: MAX_WIDTH_DEFAULT,
      default: MAX_WIDTH_DEFAULT,
      min: 120,
      max: 1400,
      step: 20,
      when: (state) => isResizable(state) && !isVertical(state),
    },

    /* ── Slots: the four strips the panel positions for you ─────────────── */
    ...slotFields,
  ],
};

