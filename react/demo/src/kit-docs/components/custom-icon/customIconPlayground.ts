import { createElement } from "react";
import { ColorSwatches } from "@cjlapao/ui-kit";
import type { TrueColor } from "@cjlapao/ui-kit";
import type {
  PlaygroundConfig,
  PlaygroundState,
} from "../../shared/playground/schema";
import { controlSizeOptions, trueColorOptions } from "../../shared/options";
import {
  ALT_EXAMPLE,
  CLASS_EXAMPLE,
  COLOR_EXAMPLE,
  CUSTOM_SIZE_EXAMPLE,
  HOVER_COLOR_EXAMPLE,
  ICON_CHOICES,
  ICON_DEFAULT,
  NONE,
  SIZE_DEFAULT,
  flag,
  hasAlt,
  hasClassName,
  hasCustomSize,
  hasTone,
  iconName,
  isBuiltIn,
  isClickable,
  pressReport,
  textValue,
} from "./customIconStage";

/** The 21 accents `TrueColor` accepts — the same list `tone` types (:26). */
export const TONE_OPTIONS = trueColorOptions;

const renderSwatches = (
  value: string,
  onSelect: (next: string) => void,
): ReturnType<typeof createElement> =>
  createElement(ColorSwatches, {
    selectable: true,
    size: "sm",
    defaultExpanded: true,
    // No tone is a real answer here, so the strip is allowed to show nothing
    // selected — `value` is optional precisely so a picker can start clean (:96).
    value: value === "" ? undefined : (value as TrueColor),
    onSelect: (next: TrueColor) => onSelect(next),
  });

/**
 * The CustomIcon config. The order of `fields` *is* the order the attributes print
 * in, so it follows the order the props are declared in `CustomIconProps`
 * (:14-48) as far as it can, then puts the state levers last.
 */
export const customIconConfig: PlaygroundConfig = {
  groups: [
    { id: "identity", title: "Identity", defaultOpen: true },
    { id: "size", title: "Size", defaultOpen: true },
    { id: "colour", title: "Colour" },
    { id: "behaviour", title: "Behaviour" },
  ],
  data: [],
  fields: [
    // ── Identity ─────────────────────────────────────────────────────────────
    {
      kind: "choice",
      id: "icon",
      prop: null,
      label: "Icon",
      group: "identity",
      default: ICON_DEFAULT,
      // `icon` is required (:14), so it prints even at the name the stage opened
      // with — a snippet without it is not a snippet that compiles.
      emit: (value, _state, h) => `icon=${h.lit(value)}`,
      options: ICON_CHOICES.map(({ label, value }) => ({ label, value })),
    },
    {
      kind: "text",
      id: "alt",
      prop: null,
      label: "alt",
      group: "identity",
      default: "",
      placeholder: ALT_EXAMPLE,
      // Blank is decoration — `aria-hidden`, nothing to name (:125-128) — so the
      // attribute only belongs on the tag once a reader has typed a name.
      emit: (value, state) =>
        hasAlt(state) ? `alt=${JSON.stringify(value)}` : null,
    },

    // ── Size ─────────────────────────────────────────────────────────────────
    {
      kind: "text",
      id: "customSize",
      prop: null,
      label: "customSize",
      group: "size",
      default: "",
      placeholder: CUSTOM_SIZE_EXAMPLE,
      // Digits are a pixel count — `48` means `48px` (:83) — so they print in
      // braces; anything else is a CSS length and prints as a string.
      emit: (value) => {
        const raw = String(value).trim();
        if (raw === "") return null;
        return /^\d+$/.test(raw)
          ? `customSize={${raw}}`
          : `customSize=${JSON.stringify(raw)}`;
      },
    },
    {
      kind: "choice",
      id: "size",
      prop: "size",
      label: "Size",
      group: "size",
      default: SIZE_DEFAULT,
      docDefault: SIZE_DEFAULT,
      options: controlSizeOptions,
    },
    {
      kind: "text",
      id: "className",
      prop: null,
      label: "className",
      group: "size",
      default: "",
      placeholder: CLASS_EXAMPLE,
      // Merged last (:122), and a `w-*`/`h-*` in it retires the `size` class (:105-106).
      emit: (value) =>
        String(value).trim() === "" ? null : `className=${JSON.stringify(value)}`,
    },

    // ── Colour ───────────────────────────────────────────────────────────────
    {
      kind: "custom",
      id: "tone",
      prop: null,
      label: "Tone",
      group: "colour",
      default: "",
      // No documented default: absent `tone` means the icon inherits (:108-111).
      emit: (value, state, h) =>
        hasTone(state) ? `tone=${h.lit(value)}` : null,
      render: ({ state, set }) =>
        renderSwatches(textValue(state, "tone"), (next) => set("tone", next)),
    },
    {
      kind: "text",
      id: "color",
      prop: null,
      label: "color",
      group: "colour",
      default: "",
      placeholder: COLOR_EXAMPLE,
      // Not the `tone` alias other controls carry: a raw CSS string that wins over
      // `tone` (:31,:109) and reaches the wrapper as `style.color` (:97).
      emit: (value) =>
        String(value).trim() === "" ? null : `color=${JSON.stringify(value)}`,
    },
    {
      kind: "text",
      id: "hoverColor",
      prop: null,
      label: "hoverColor",
      group: "colour",
      default: "",
      placeholder: HOVER_COLOR_EXAMPLE,
      emit: (value) =>
        String(value).trim() === "" ? null : `hoverColor=${JSON.stringify(value)}`,
    },
    {
      kind: "toggle",
      id: "colored",
      prop: "colored",
      label: "colored — keep its own colours",
      group: "colour",
      default: false,
    },

    // ── Behaviour ────────────────────────────────────────────────────────────
    {
      kind: "toggle",
      id: "spin",
      prop: "spin",
      label: "spin",
      group: "behaviour",
      default: false,
    },
    {
      kind: "toggle",
      id: "activatable",
      prop: null,
      label: "onClick — make it a button",
      group: "behaviour",
      default: false,
      // Printed with the handler it needs, not a bare `onClick`: the element
      // changes to a `<button>` because of this prop (:146-164).
      emit: (value) => (value === true ? "onClick={handlePress}" : null),
    },
    {
      kind: "toggle",
      id: "disabled",
      prop: "disabled",
      label: "Disabled",
      group: "behaviour",
      default: false,
    },
    {
      // Scratch state, not a prop: it holds what the last press reported so the
      // stage can show that the click left evidence (:146-164).
      kind: "text",
      id: "press",
      prop: null,
      label: "Last press",
      group: "behaviour",
      default: NONE,
      when: () => false,
      emit: () => null,
    },
  ],
};

/**
 * The module-level declarations a copied snippet needs. Printed, not quietly
 * added: an `onClick` whose handler exists only in the playground is a snippet
 * that does not compile (:43).
 */
export const snippetDecls = (state: PlaygroundState): string[] =>
  isClickable(state)
    ? [
        "function handlePress(): void {",
        "  // What the icon does when someone activates it.",
        "}",
      ]
    : [];

/** Which of the three masters is sizing the icon right now (:81-106). */
export const sizeStory = (state: PlaygroundState): string => {
  if (hasCustomSize(state)) {
    const raw = textValue(state, "customSize").trim();
    return /^\d+$/.test(raw)
      ? `customSize={${raw}} is a pixel count, so it becomes width/height: ${raw}px in inline style (:81-91).`
      : `customSize="${raw}" is already a CSS length, so it goes into inline style untouched (:81-91).`;
  }
  if (hasClassName(state) && /\b(?:min-|max-)?(?:w|h)-/.test(textValue(state, "className"))) {
    return "Your className already carries a size, so no h-*/w-* class is added at all (:105-106).";
  }
  return `size="${textValue(state, "size") || SIZE_DEFAULT}" is the only thing sizing it — one class from SIZE_CLASS_MAP (:51-57,:105-106).`;
};

/** The text the stage prints under the icon, in the reader's own language. */
export const stageCaption = (state: PlaygroundState): string => {
  const name = iconName(state);
  if (!isBuiltIn(state)) {
    return `\`${name}\` is not a built-in name — the monogram stands in, and it keeps the requested size so nothing around it moves (:130-144).`;
  }
  if (isClickable(state)) {
    const report = pressReport(state);
    if (report !== "")
      return "Pressed — it is a real <button type=\"button\">, so Enter and Space reach it too (:146-164).";
    if (flag(state, "disabled"))
      return "Disabled carries the native attribute, so the button leaves the tab order entirely (:151).";
    return "A real <button type=\"button\">, named by alt — without one it is an unlabelled control (:148-164).";
  }
  if (hasAlt(state)) {
    return `role="img" with aria-label — and the glyph inside stays aria-hidden and focusable="false" (:126-131).`;
  }
  return "No alt, so the wrapper is aria-hidden: decoration, and a reader never hears it (:125-128).";
};
