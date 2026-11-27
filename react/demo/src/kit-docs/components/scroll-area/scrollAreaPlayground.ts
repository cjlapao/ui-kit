import type {
  PlaygroundConfig,
  PlaygroundOption,
} from "../../shared/playground/schema";
import {
  FRAME_DEFAULT,
  FRAME_NONE,
  ROLE_NONE,
  TEXT_NONE,
  isVirtual,
  showsHorizontal,
  showsVertical,
  textOf,
} from "./scrollAreaStage";

/**
 * Every option the playground offers, in one list — the controls column, the
 * preview and the Code view all read it, so a control that vanished from the
 * screen cannot survive in the printed snippet. Each entry names the line of
 * `ScrollArea.tsx` it comes from.
 */

/** The five bar policies, in the component's own order (:20-25,:352-358). */
const VARIANT_OPTIONS: PlaygroundOption[] = [
  { label: "Auto — on hover or while scrolling", value: "auto" },
  { label: "Hover — only under the pointer", value: "hover" },
  { label: "Scroll — after an event, 800ms", value: "scroll" },
  { label: "Always — while that axis overflows", value: "always" },
  { label: "Hidden — it scrolls, nothing is drawn", value: "hidden" },
];

/** The four contents, out of the fixture table. */
const CONTENT_OPTIONS: PlaygroundOption[] = [
  { label: "Rows — vertical overflow", value: "rows" },
  { label: "Tiles — horizontal overflow", value: "tiles" },
  { label: "Both — eight strips of three", value: "grid" },
  { label: "Fits — nothing overflows", value: "fits" },
];

/**
 * The frame's own classes (:158 merges them onto the root, :441). The height is
 * the caller's duty — with none, nothing can ever overflow (:101-104).
 */
const FRAME_OPTIONS: PlaygroundOption[] = [
  { label: "h-56 — a fixed frame", value: FRAME_DEFAULT },
  { label: "max-h-56 — a capped frame", value: "max-h-56 w-full" },
  { label: "h-40 — a short frame", value: "h-40 w-full" },
  { label: "No height — nothing overflows", value: FRAME_NONE },
];

/** Roles a caller may carry across the viewport (:90-96,:457). */
const ROLE_OPTIONS: PlaygroundOption[] = [
  { label: "None — the kit adds no role", value: ROLE_NONE },
  { label: "rowgroup — inside a role=table", value: "rowgroup" },
  { label: "list — a scrolling list", value: "list" },
  { label: "group — a paned region", value: "group" },
];

/** The scroller's classes; each one is a behaviour only that element can carry. */
const VIEWPORT_CLASS_OPTIONS: PlaygroundOption[] = [
  { label: "None", value: TEXT_NONE },
  {
    label: "overscroll-contain — a wheel at the end does not chain",
    value: "overscroll-contain",
  },
  { label: "pt-2 pb-2 — padding inside the scroller", value: "pt-2 pb-2" },
];

/** A text control left blank never reaches the snippet. */
const printed = (
  name: string,
  value: unknown,
  lit: (text: string) => string,
): string | null => {
  const text = String(value ?? TEXT_NONE).trim();
  return text === TEXT_NONE ? null : `${name}=${lit(text)}`;
};

export const SCROLL_AREA_GROUPS = [
  { id: "content", title: "Content", defaultOpen: true },
  { id: "behaviour", title: "Bars", defaultOpen: true },
  { id: "axes", title: "Axes", defaultOpen: false },
  { id: "naming", title: "Focus & naming", defaultOpen: false },
  { id: "hooks", title: "Class hooks", defaultOpen: false },
];

export const scrollAreaConfig: PlaygroundConfig = {
  groups: SCROLL_AREA_GROUPS,
  fields: [
    {
      id: "content",
      label: "what is inside the frame",
      group: "content",
      kind: "choice",
      default: "rows",
      // Not a prop: it picks which fixture the frame holds. The child prints in
      // `scrollAreaCode`, from the same table row.
      prop: null,
      emit: () => null,
      options: CONTENT_OPTIONS,
      control: "segments",
    },
    {
      id: "className",
      label: "className — the frame, and its height",
      group: "content",
      kind: "choice",
      default: FRAME_DEFAULT,
      // The component's own default is `""` (:158); this page prints the class
      // even at rest because a frame without a height draws no bar, reserves no
      // lane and never joins the tab order (:101-104,:458,:504) — the snippet has
      // to be a working region, not a silent one.
      prop: "className",
      emit: (value, _state, h) =>
        String(value).trim() === TEXT_NONE
          ? null
          : `className=${h.lit(String(value))}`,
      options: FRAME_OPTIONS,
      control: "select",
    },
    {
      id: "virtualScroll",
      label: "virtualScroll — an engine owns the viewport",
      group: "content",
      kind: "toggle",
      default: false,
      // The prop is real (:39) but its value is the engine's measurements and its
      // callback, so the line prints the hoisted object the preview drives.
      prop: null,
      emit: (value) => (value === true ? "virtualScroll={VIRTUAL}" : null),
    },
    {
      id: "variant",
      label: "variant — when the bars show",
      group: "behaviour",
      kind: "choice",
      default: "auto",
      docDefault: "auto",
      prop: "variant",
      options: VARIANT_OPTIONS,
      control: "select",
    },
    {
      id: "mask",
      label: "mask — fade the edges it can scroll toward",
      group: "behaviour",
      kind: "toggle",
      default: false,
      docDefault: false,
      prop: "mask",
    },
    {
      id: "gutter",
      label: "gutter — the content pays the bar's lane",
      group: "behaviour",
      kind: "toggle",
      default: true,
      docDefault: true,
      prop: "gutter",
    },
    {
      id: "horizontal",
      label: "horizontal — sideways scrolling",
      group: "axes",
      kind: "toggle",
      default: true,
      docDefault: true,
      prop: "horizontal",
      // `virtualScroll` forces the axis off (:161), so the lever is taken away
      // and its line with it.
      when: showsHorizontal,
      // A supplied `emit` skips the default check, so the silent values have to
      // be named here: `true` is what the component does anyway (:149-150).
      emit: (value, state) =>
        isVirtual(state) || value !== false ? null : locked("horizontal"),
    },
    {
      id: "vertical",
      label: "vertical — downward scrolling",
      group: "axes",
      kind: "toggle",
      default: true,
      docDefault: true,
      prop: "vertical",
      // …and the other one on (:162).
      when: showsVertical,
      emit: (value, state) =>
        isVirtual(state) || value !== false ? null : locked("vertical"),
    },
    {
      id: "tabIndex",
      label: "tabIndex — the viewport's tab entry",
      group: "naming",
      kind: "number",
      default: 0,
      docDefault: 0,
      prop: "tabIndex",
      min: -1,
      max: 4,
      step: 1,
    },
    {
      id: "viewportRole",
      label: "viewportRole — a role across the scroller",
      group: "naming",
      kind: "choice",
      default: ROLE_NONE,
      prop: "viewportRole",
      options: ROLE_OPTIONS,
      control: "select",
    },
    {
      id: "ariaLabel",
      label: "aria-label — name the region",
      group: "naming",
      kind: "text",
      default: TEXT_NONE,
      // A rest prop (:440): the viewport itself cannot be labelled, so the name
      // belongs to the frame the reader is looking at.
      prop: null,
      emit: (_value, state, h) => {
        const label = textOf(state, "ariaLabel");
        return label === TEXT_NONE ? null : `aria-label=${h.lit(label)}`;
      },
      placeholder: "Quarterly reports",
    },
    {
      id: "viewportClassName",
      label: "viewportClassName — the scroller",
      group: "hooks",
      kind: "choice",
      default: TEXT_NONE,
      prop: "viewportClassName",
      options: VIEWPORT_CLASS_OPTIONS,
      control: "select",
    },
    {
      id: "contentClassName",
      label: "contentClassName — the content wrapper",
      group: "hooks",
      kind: "text",
      default: TEXT_NONE,
      prop: "contentClassName",
      emit: (value, _state, h) => printed("contentClassName", value, h.lit),
      placeholder: "max-w-prose",
    },
  ],
};

/**
 * The one line an axis can earn: `horizontal={false}` / `vertical={false}`, which
 * is the difference between clipping content and drawing a bar over an axis that
 * scrolls nothing (:51-58,:262-266, test :322-376). `true` is the default (:149-150)
 * and prints nothing.
 */
const locked = (name: string): string => `${name}={false}`;
