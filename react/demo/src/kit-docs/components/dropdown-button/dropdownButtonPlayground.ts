import { createElement } from "react";
import { ColorSwatches } from "@cjlapao/ui-kit";
import type { TrueColor } from "@cjlapao/ui-kit";
import type {
  PlaygroundCodeContext,
  PlaygroundConfig,
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";
import {
  controlSizeOptions,
  dropdownButtonVariantOptions,
} from "../../shared/options";
import {
  COLOR_DEFAULT,
  DROPDOWN_ICON_DEFAULT,
  DROPDOWN_ICON_OPTIONS,
  FIXTURE_DEFAULT,
  FIXTURE_OPTIONS,
  LABEL_DEFAULT,
  LENGTH_AUTO,
  LOCALE_DEFAULT,
  LOCALE_OPTIONS,
  MAX_WIDTH_OPTIONS,
  MENU_WIDTH_DEFAULT,
  MENU_WIDTH_OPTIONS,
  MENU_WIDTH_TRIGGER,
  SIZE_DEFAULT,
  VARIANT_DEFAULT,
  WIDTH_OPTIONS,
  choiceValue,
  fixtureSource,
  hasItems,
  isTranslated,
  localeValue,
  menuItems,
  showsCaret,
} from "./dropdownButtonStage";

/**
 * The DropdownButton config. Field order *is* the printed tag's attribute order
 * and follows `DropdownButtonProps` (:13-60): what it says, what it looks like,
 * how it is laid out, what it does. The data source prints `options` before any
 * of it, because the menu's content is the thing the control is about.
 */

/** The tone is a palette, not a dropdown of colour names. */
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

/** A length knob says nothing while it sits on `auto` — that is the documented absence. */
const lengthEmit = (name: string) => (value: PlaygroundValue): string | null => {
  const raw = String(value);
  if (raw === LENGTH_AUTO || raw === "") return null;
  return Number.isNaN(Number(raw))
    ? `${name}=${JSON.stringify(raw)}`
    : `${name}={${raw}}`;
};

/** An empty text box means the prop was never passed, so it prints nothing. */
const optionalTextEmit =
  (name: string) => (value: PlaygroundValue): string | null => {
    const raw = String(value).trim();
    return raw === "" ? null : `${name}=${JSON.stringify(raw)}`;
  };

export const dropdownButtonConfig: PlaygroundConfig = {
  groups: [
    { id: "trigger", title: "Trigger", defaultOpen: true },
    { id: "menu", title: "Menu", defaultOpen: true },
    { id: "layout", title: "Layout", defaultOpen: true },
    { id: "action", title: "Action", defaultOpen: true },
    { id: "workbench", title: "Workbench" },
  ],
  data: [
    {
      id: "menu",
      constName: "MENU_OPTIONS",
      prop: "options",
      label: "The menu's content",
      // The one place a reader can be told the list is made up rather than real.
      note: "plain data, in render order — pick another fixture above",
      value: (state) => menuItems(state),
      emit: "source",
      source: (state) => fixtureSource(state),
    },
  ],
  fields: [
    {
      kind: "text",
      id: "label",
      group: "trigger",
      label: "label — the primary button",
      prop: "label",
      default: LABEL_DEFAULT,
      // Required, so it prints even at the fixture's own starting value: a
      // snippet with no label would not compile.
      emit: (value) => `label=${JSON.stringify(String(value))}`,
    },
    {
      kind: "choice",
      id: "variant",
      group: "trigger",
      label: "variant",
      prop: "variant",
      default: VARIANT_DEFAULT,
      docDefault: VARIANT_DEFAULT,
      options: dropdownButtonVariantOptions,
    },
    {
      kind: "custom",
      id: "color",
      group: "trigger",
      label: "color",
      prop: "color",
      default: COLOR_DEFAULT,
      docDefault: COLOR_DEFAULT,
      render: ({ state, set }) =>
        renderSwatches(choiceValue(state, "color", COLOR_DEFAULT), (next) =>
          set("color", next),
        ),
      emit: (value) =>
        String(value) === COLOR_DEFAULT ? null : `color=${JSON.stringify(String(value))}`,
    },
    {
      kind: "choice",
      id: "size",
      group: "trigger",
      label: "size",
      prop: "size",
      default: SIZE_DEFAULT,
      docDefault: SIZE_DEFAULT,
      options: controlSizeOptions,
    },
    {
      kind: "choice",
      id: "dropdownIcon",
      group: "trigger",
      label: "dropdownIcon",
      prop: "dropdownIcon",
      default: DROPDOWN_ICON_DEFAULT,
      docDefault: DROPDOWN_ICON_DEFAULT,
      options: DROPDOWN_ICON_OPTIONS,
      // The caret is the only thing that reads it (:158), so a hidden caret
      // must not leave a knob — or an attribute — behind.
      when: showsCaret,
    },
    {
      kind: "text",
      id: "caretLabel",
      group: "trigger",
      label: "caretLabel",
      prop: "caretLabel",
      default: "",
      when: showsCaret,
      emit: optionalTextEmit("caretLabel"),
    },
    {
      kind: "toggle",
      id: "split",
      group: "layout",
      label: "split — its own button",
      prop: "split",
      default: true,
      docDefault: true,
      // With no caret there is nothing to split (:117,:205).
      when: showsCaret,
    },
    {
      kind: "toggle",
      id: "fullWidth",
      group: "layout",
      label: "fullWidth",
      prop: "fullWidth",
      default: false,
    },
    {
      kind: "choice",
      id: "width",
      group: "layout",
      label: "width — the pair together",
      prop: "width",
      default: LENGTH_AUTO,
      options: WIDTH_OPTIONS,
      emit: lengthEmit("width"),
    },
    {
      kind: "choice",
      id: "maxWidth",
      group: "layout",
      label: "maxWidth",
      prop: "maxWidth",
      default: LENGTH_AUTO,
      options: MAX_WIDTH_OPTIONS,
      emit: lengthEmit("maxWidth"),
    },
    {
      kind: "toggle",
      id: "hideDropdownTriggerWhenEmpty",
      group: "layout",
      label: "hideDropdownTriggerWhenEmpty",
      prop: "hideDropdownTriggerWhenEmpty",
      default: true,
      docDefault: true,
      // The knob only exists while the answer matters (:117).
      when: (state) => !hasItems(state),
    },
    {
      kind: "choice",
      id: "menuWidth",
      group: "menu",
      label: "menuWidth",
      prop: "menuWidth",
      default: MENU_WIDTH_DEFAULT,
      docDefault: MENU_WIDTH_DEFAULT,
      options: MENU_WIDTH_OPTIONS,
      // No items, no popup, no width to talk about (:118).
      when: hasItems,
      emit: (value) => {
        const raw = String(value);
        if (raw === MENU_WIDTH_DEFAULT) return null; // :76 — the component's own default.
        return raw === MENU_WIDTH_TRIGGER
          ? `menuWidth=${JSON.stringify(MENU_WIDTH_TRIGGER)}`
          : `menuWidth={${raw}}`;
      },
    },
    {
      kind: "choice",
      id: "options",
      group: "menu",
      label: "The menu's content",
      // The fixture picker drives the `options` data source, which prints the
      // attribute; this field owning one too would print it twice.
      prop: null,
      default: FIXTURE_DEFAULT,
      options: FIXTURE_OPTIONS,
      emit: () => null,
    },
    {
      kind: "toggle",
      id: "disabled",
      group: "action",
      label: "disabled",
      prop: "disabled",
      default: false,
    },
    {
      kind: "toggle",
      id: "loading",
      group: "action",
      label: "loading (inherited from ButtonProps)",
      prop: "loading",
      default: false,
    },
    {
      kind: "text",
      id: "tooltip",
      group: "action",
      label: "tooltip (inherited)",
      prop: "tooltip",
      default: "",
      emit: optionalTextEmit("tooltip"),
    },
    {
      kind: "toggle",
      id: "onPrimaryClick",
      group: "action",
      label: "onPrimaryClick",
      prop: "onPrimaryClick",
      default: false,
      emit: (value) =>
        value === true
          ? "onPrimaryClick={() => setRuns((count) => count + 1)}"
          : null,
    },
    {
      kind: "toggle",
      id: "onOptionSelect",
      group: "action",
      label: "onOptionSelect",
      prop: "onOptionSelect",
      default: false,
      // With no items nothing can be selected (:117-118).
      when: hasItems,
      emit: (value) =>
        value === true
          ? "onOptionSelect={(option) => setPicked(option.value)}"
          : null,
    },
    {
      kind: "choice",
      id: "locale",
      group: "workbench",
      label: "Preview locale (not a prop)",
      prop: null,
      default: LOCALE_DEFAULT,
      options: LOCALE_OPTIONS,
      emit: () => null,
    },
    {
      kind: "text",
      id: "clickReport",
      group: "workbench",
      label: "Last primary click",
      prop: null,
      default: "",
      when: () => false,
      emit: () => null,
    },
    {
      kind: "text",
      id: "pickReport",
      group: "workbench",
      label: "Last pick",
      prop: null,
      default: "",
      when: () => false,
      emit: () => null,
    },
  ],
};

/** The host state the handlers above need — and only when they are wired. */
export const hostStateLines = (state: PlaygroundState): string[] => {
  const lines: string[] = [];
  if (state.onPrimaryClick === true) {
    lines.push(
      "// The caret owns the menu; this is the action the wide half takes (:104-107,:182).\nconst [runs, setRuns] = useState(0);",
    );
  }
  if (state.onOptionSelect === true && hasItems(state)) {
    lines.push(
      "// The menu closes itself after a pick — handleSelect does both (:97-100,:211).\nconst [picked, setPicked] = useState<string | null>(null);",
    );
  }
  return lines;
};

export const dropdownButtonCode = ({
  state,
  h,
}: PlaygroundCodeContext): string => {
  const tag = h.element("DropdownButton", h.props(), 0);

  // The preview genuinely sits inside a provider once a locale is chosen, so the
  // snippet says so rather than printing a tag that would render in English.
  const root = isTranslated(state)
    ? h.element("I18nProvider", [`locale=${JSON.stringify(localeValue(state))}`], 0, tag)
    : tag;

  const hostState = hostStateLines(state);
  const demo = [
    "export default function Demo() {",
    ...hostState.flatMap((group) =>
      group.split("\n").map((line) => `  ${line}`),
    ),
    "  return (",
    h.indent(root, 2),
    "  );",
    "}",
  ].join("\n");

  const imports = ["DropdownButton"];
  if (root.includes("<I18nProvider")) imports.push("I18nProvider");

  const snippet = h.snippet({
    imports,
    decls: [h.decl("menu")],
    body: demo,
  });
  return hostState.length > 0
    ? `import { useState } from "react";\n${snippet}`
    : snippet;
};

/** What the caret's glyph is, in the words the stage prints under the preview. */
export const caretGlyphNote = (state: PlaygroundState): string => {
  if (!showsCaret(state)) return "";
  const glyph = choiceValue(state, "dropdownIcon", DROPDOWN_ICON_DEFAULT);
  return glyph === DROPDOWN_ICON_DEFAULT
    ? "The caret's glyph is the documented ArrowDown (:67) — a registry name the icon " +
      "renderer looks up (:158), not markup."
    : `The caret's glyph is "${glyph}" (:158) — any name the icon registry knows; a ` +
      "string here is a lookup key, so a typo renders nothing at all.";
};
