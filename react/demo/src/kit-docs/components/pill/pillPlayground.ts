import { createElement } from "react";
import { ColorSwatches } from "@cjlapao/ui-kit";
import type { TrueColor } from "@cjlapao/ui-kit";
import type {
  PlaygroundCodeContext,
  PlaygroundConfig,
  PlaygroundState,
} from "../../shared/playground/schema";
import {
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  pillCornerOptions,
  pillVariantOptions,
} from "../../shared/options";
import {
  CORNER_DEFAULT,
  GLASS_OPACITY_DEFAULT,
  ICON_NONE,
  ICON_OPTIONS,
  LABEL_DEFAULT,
  LOCALES,
  LOCALE_DEFAULT,
  MAX_WIDTH_NONE,
  SIZE_DEFAULT,
  SPECULAR_DEFAULT_CHOICE,
  SPECULAR_OPTIONS,
  TRAILING_ICON_OPTIONS,
  VIBRANCY_DEFAULT,
  VARIANT_DEFAULT,
  choiceValue,
  flag,
  hasRemoveLabel,
  isDot,
  isGlass,
  isTranslated,
  localeValue,
  maxWidthValue,
  showsIcon,
  showsTrailingIcon,
  trailingIconName,
  iconName,
  labelText as labelTextOf,
} from "./pillStage";

/**
 * The Pill config. Field order *is* the printed tag's attribute order, and it
 * follows `PillProps` (:76-125): what it looks like, what it says, what it does.
 * The workbench fields (`locale`, `backdrop`) and the two report fields own no
 * prop and say nothing to the snippet.
 */

const renderSwatches = (
  value: string,
  onSelect: (next: string) => void,
): ReturnType<typeof createElement> =>
  createElement(ColorSwatches, {
    selectable: true,
    size: "sm",
    defaultExpanded: true,
    value: value as TrueColor,
    onSelect: (next: TrueColor) => onSelect(next),
  });

export const pillConfig: PlaygroundConfig = {
  groups: [
    { id: "shape", title: "Shape", defaultOpen: true },
    { id: "label", title: "Label", defaultOpen: true },
    { id: "state", title: "State", defaultOpen: true },
    { id: "interactive", title: "Interactive", defaultOpen: true },
    { id: "glass", title: "Glass", defaultOpen: true },
    { id: "workbench", title: "Workbench" },
  ],
  data: [],
  fields: [
    // ── Shape ───────────────────────────────────────────────────────────────
    {
      kind: "choice",
      id: "variant",
      group: "shape",
      label: "variant (:79-80,:129)",
      prop: "variant",
      options: pillVariantOptions,
      default: VARIANT_DEFAULT,
      docDefault: VARIANT_DEFAULT,
    },
    {
      kind: "custom",
      id: "tone",
      group: "shape",
      label: "tone (:78,:128)",
      prop: "tone",
      default: "blue",
      docDefault: "blue",
      // A palette, not a dropdown of 21 colour names. `blue` is the
      // destructured default (:128), so at rest the tag carries no tone at all.
      render: ({ state, set }) =>
        renderSwatches(choiceValue(state, "tone", "blue"), (next) => set("tone", next)),
    },
    {
      kind: "choice",
      id: "size",
      group: "shape",
      label: "size (:81-82,:130)",
      prop: "size",
      options: controlSizeOptions,
      default: SIZE_DEFAULT,
      docDefault: SIZE_DEFAULT,
    },
    {
      kind: "choice",
      id: "corner",
      group: "shape",
      label: "corner (:83-84,:131)",
      prop: "corner",
      options: pillCornerOptions,
      default: CORNER_DEFAULT,
      docDefault: CORNER_DEFAULT,
    },

    // ── Label ───────────────────────────────────────────────────────────────
    {
      kind: "text",
      id: "labelText",
      group: "label",
      label: "The label — children (:147,:244-253)",
      prop: null,
      default: LABEL_DEFAULT,
      // Not an attribute: children go inside the tag, which the page's `code`
      // prints. A field cannot be both, and a `label` attribute would be a lie.
      emit: () => null,
    },
    {
      kind: "toggle",
      id: "uppercase",
      group: "label",
      label: "uppercase (:85,:287)",
      prop: "uppercase",
      default: false,
    },
    {
      kind: "choice",
      id: "icon",
      group: "label",
      label: "icon (:95-96,:246-250)",
      prop: "icon",
      options: ICON_OPTIONS,
      default: ICON_NONE,
      // "None" is the absence of the prop, not a value of it.
      emit: (value) =>
        typeof value === "string" && value !== ICON_NONE ? `icon="${value}"` : null,
    },
    {
      kind: "choice",
      id: "trailingIcon",
      group: "label",
      label: "trailingIcon (:97-98,:254-258)",
      prop: "trailingIcon",
      options: TRAILING_ICON_OPTIONS,
      default: ICON_NONE,
      emit: (value) =>
        typeof value === "string" && value !== ICON_NONE
          ? `trailingIcon="${value}"`
          : null,
    },
    {
      kind: "number",
      id: "maxWidth",
      group: "label",
      label: "maxWidth (:118-119,:294-296)",
      prop: "maxWidth",
      default: MAX_WIDTH_NONE,
      min: 0,
      max: 400,
      step: 10,
      // 0 is "the prop is not passed"; a number is a JSX expression (:119,:353).
      emit: (_value, state) => {
        const width = maxWidthValue(state);
        return width === undefined ? null : `maxWidth={${width}}`;
      },
    },

    // ── State ───────────────────────────────────────────────────────────────
    {
      kind: "toggle",
      id: "dot",
      group: "state",
      label: "dot — a bare status dot (:99-103,:218-242)",
      prop: "dot",
      default: false,
    },
    {
      kind: "text",
      id: "dotLabel",
      group: "state",
      label: "label — names the dot (:120-124,:236-238)",
      prop: "label",
      default: "",
      when: isDot,
      emit: (value) =>
        typeof value === "string" && value.trim() !== ""
          ? `label=${JSON.stringify(value.trim())}`
          : null,
    },
    {
      kind: "toggle",
      id: "pulse",
      group: "state",
      label: "pulse (:104-110,:286)",
      prop: "pulse",
      default: false,
    },

    // ── Interactive ─────────────────────────────────────────────────────────
    {
      kind: "toggle",
      id: "onClick",
      group: "interactive",
      label: "onClick — makes it a button (:115-116,:300-316)",
      prop: "onClick",
      default: false,
      emit: (value) =>
        value === true ? "onClick={() => setPinned(true)}" : null,
    },
    {
      kind: "toggle",
      id: "onRemove",
      group: "interactive",
      label: "onRemove — adds the remove button (:111-112,:259-273)",
      prop: "onRemove",
      default: false,
      emit: (value) =>
        value === true ? "onRemove={() => setShown(false)}" : null,
    },
    {
      kind: "text",
      id: "removeLabel",
      group: "interactive",
      label: "removeLabel (:113-114,:268)",
      prop: "removeLabel",
      default: "",
      when: hasRemoveLabel,
      emit: (value) =>
        typeof value === "string" && value.trim() !== ""
          ? `removeLabel=${JSON.stringify(value.trim())}`
          : null,
    },
    {
      kind: "toggle",
      id: "disabled",
      group: "interactive",
      label: "disabled (:117,:288)",
      prop: "disabled",
      default: false,
    },

    // ── Glass ───────────────────────────────────────────────────────────────
    {
      kind: "choice",
      id: "glassOpacity",
      group: "glass",
      label: "glassOpacity (:86-87,:133)",
      prop: "glassOpacity",
      options: glassOpacityOptions,
      default: GLASS_OPACITY_DEFAULT,
      docDefault: GLASS_OPACITY_DEFAULT,
      when: isGlass,
    },
    {
      kind: "choice",
      id: "vibrancy",
      group: "glass",
      label: "vibrancy (:88-89,:134)",
      prop: "vibrancy",
      options: glassVibrancyOptions,
      default: VIBRANCY_DEFAULT,
      docDefault: VIBRANCY_DEFAULT,
      when: isGlass,
    },
    {
      kind: "choice",
      id: "specularMode",
      group: "glass",
      label: "specularMode (:90-94,:197-198)",
      prop: "specularMode",
      options: SPECULAR_OPTIONS,
      default: SPECULAR_DEFAULT_CHOICE,
      when: isGlass,
      // "Variant default" means the prop is not passed at all; the rest are
      // real values, including "none", which is *not* what glass defaults to.
      emit: (value) =>
        typeof value === "string" && value !== SPECULAR_DEFAULT_CHOICE
          ? `specularMode="${value}"`
          : null,
    },

    // ── Workbench ───────────────────────────────────────────────────────────
    {
      kind: "choice",
      id: "locale",
      group: "workbench",
      label: "Preview locale (not a prop)",
      prop: null,
      options: LOCALES.map(({ label, value }) => ({ label, value })),
      default: LOCALE_DEFAULT,
      // Context, not a Pill prop (:151,:268). The page's `code` wraps the tag in
      // the provider the preview is actually inside — nothing prints this field.
      emit: () => null,
    },
    {
      kind: "toggle",
      id: "backdrop",
      group: "workbench",
      label: "Give it something to see through (not a prop)",
      prop: null,
      default: false,
      emit: () => null,
    },
    // Set by the preview when the pill or its remove button is pressed; never
    // shown, never printed — a place to put what the handlers report.
    {
      kind: "text",
      id: "clickReport",
      group: "workbench",
      label: "Last click",
      prop: null,
      default: "",
      when: () => false,
      emit: () => null,
    },
    {
      kind: "text",
      id: "removeReport",
      group: "workbench",
      label: "Last remove",
      prop: null,
      default: "",
      when: () => false,
      emit: () => null,
    },
  ],
};

/** A label is JSX text, so the characters that mean something else get quoted. */
const jsxText = (label: string): string =>
  /[<>{}]/.test(label) ? `{${JSON.stringify(label)}}` : label;

/** The `useState` calls the printed demo declares, in the order it declares them. */
export const hostStateLines = (state: PlaygroundState): string[] => {
  const lines: string[] = [];
  if (flag(state, "onClick")) {
    lines.push(
      `// onClick is what turns a label into a control (:115-116,:300-316).\nconst [pinned, setPinned] = useState(false);`,
    );
  }
  if (flag(state, "onRemove")) {
    lines.push(
      `// The remove button takes the pill out of the caller\'s list (:111-112,:259-273).\nconst [shown, setShown] = useState(true);`,
    );
  }
  return lines;
};

/** The children the tag carries — nothing at all once `dot` takes the element over. */
export const pillChildren = (state: PlaygroundState): string | undefined =>
  isDot(state) ? undefined : jsxText(labelTextOf(state));

export const pillCode = ({ state, h }: PlaygroundCodeContext): string => {
  const pill = h.element("Pill", h.props(), 0, pillChildren(state));

  // The preview really is inside a provider when a locale is chosen, so the
  // snippet says so rather than printing a tag that would render in English.
  const root = isTranslated(state)
    ? h.element("I18nProvider", [`locale=${h.lit(localeValue(state))}`], 0, pill)
    : pill;

  const hostState = hostStateLines(state);
  const demo = [
    "export default function Demo() {",
    ...hostState.map((line) => `  ${line}`),
    "  return (",
    h.indent(root, 2),
    "  );",
  "}",
  ].join("\n");

  const imports = ["Pill"];
  if (root.includes("<I18nProvider")) imports.push("I18nProvider");

  const snippet = h.snippet({ imports, decls: [], body: demo });
  return hostState.length > 0
    ? `import { useState } from "react";\n${snippet}`
    : snippet;
};

/** What the adornments are, in the words the stage prints under the preview. */
export const adornmentNote = (state: PlaygroundState): string => {
  const parts: string[] = [];
  if (showsIcon(state)) parts.push(`icon="${iconName(state)}"`);
  if (showsTrailingIcon(state)) parts.push(`trailingIcon="${trailingIconName(state)}"`);
  if (parts.length === 0) return "";
  return `Both adornments are registry names handed to the icon renderer at ${
    choiceValue(state, "size", SIZE_DEFAULT)
  } — the string is not markup, it is a lookup key (:210-215).`;
};

