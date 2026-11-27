import type {
  PlaygroundConfig,
  PlaygroundCodeContext,
  PlaygroundState,
} from "../../shared/playground/schema";
import {
  AUTO,
  COLLAPSE_AUTO,
  COLLAPSE_OFF,
  COLLAPSE_ON,
  CUSTOM_PLACEHOLDER,
  EMPTY_TEXT_DEFAULT,
  EXPAND_AUTO,
  EXPAND_OPEN,
  EXPAND_SHUT,
  ERROR_TEXT,
  FIXED_LABEL_WIDTH,
  GROW,
  LOADER_DEFAULT,
  NO_PLACEHOLDER,
  SIZE_DEFAULT,
  TONE_DEFAULT,
  VALUE_BOOLEAN,
  VALUE_COUNT,
  VALUE_DIGEST,
  VALUE_EMPTY,
  VALUE_NODE,
  VARIANT_DEFAULT,
  errorText,
  flag,
  isControlledExpand,
  isDisclosure,
  isError,
  isGlass,
  isLoading,
  isPlain,
  textValue,
} from "./infoRowStage";
import {
  SUB_ITEMS,
  SUB_ITEMS_SOURCE,
  VALUE_SOURCE,
} from "./infoRowFixture";

/**
 * One description of every lever this page offers: the control, the value it
 * edits, and the line of source it owes the reader. Line citations in a label are
 * the line in `react/src/components/InfoRow.tsx` that was read to write the row —
 * the controls column is documentation, so it cites.
 */

const SIZE_OPTIONS = ["xs", "sm", "md", "lg", "xl"].map((size) => ({
  label: size,
  value: size,
}));

/** A size override whose "no override" is the empty string, not a lie. */
const sizeOverrideOptions = [{ label: "auto (from size)", value: AUTO }].concat(
  SIZE_OPTIONS,
);

export const infoRowData = [
  {
    id: "subItems",
    constName: "SUB_ITEMS",
    prop: "subItems",
    label: "the secondary lines stacked under the main one",
    note:
      "the third is a boolean and paints the catalog's Yes; the fourth has neither text nor value and paints nothing (:810-814)",
    value: () => SUB_ITEMS,
    emit: "source" as const,
    source: () => SUB_ITEMS_SOURCE,
    when: (state: PlaygroundState) => flag(state, "subItems"),
  },
];

export const infoRowConfig: PlaygroundConfig = {
  groups: [
    { id: "value", title: "Value", defaultOpen: true },
    { id: "type", title: "Type & surface" },
    { id: "anatomy", title: "Anatomy" },
    { id: "disclosure", title: "Disclosure" },
    { id: "states", title: "States" },
  ],
  data: infoRowData,
  fields: [
    // ── Value ────────────────────────────────────────────────────────────────
    {
      kind: "text",
      id: "label",
      prop: "label",
      label: "Label",
      group: "value",
      default: "Image digest",
      alwaysEmit: true,
    },
    {
      kind: "choice",
      id: "value",
      prop: "value",
      label: "Value",
      group: "value",
      default: VALUE_DIGEST,
      options: [
        { label: "string", value: VALUE_DIGEST },
        { label: "number", value: VALUE_COUNT },
        { label: "boolean", value: VALUE_BOOLEAN },
        { label: "ReactNode", value: VALUE_NODE },
        { label: "empty", value: VALUE_EMPTY },
      ],
      emit: (value) => `value=${VALUE_SOURCE[String(value)]}`,
    },
    {
      kind: "choice",
      id: "emptyText",
      prop: "emptyText",
      label: "Empty placeholder",
      group: "value",
      default: EMPTY_TEXT_DEFAULT,
      docDefault: EMPTY_TEXT_DEFAULT,
      options: [
        { label: "— (kit default)", value: EMPTY_TEXT_DEFAULT },
        { label: "none at all (null)", value: NO_PLACEHOLDER },
        { label: "written text", value: CUSTOM_PLACEHOLDER },
      ],
      emit: (value) =>
        value === EMPTY_TEXT_DEFAULT
          ? null
          : value === NO_PLACEHOLDER
            ? "emptyText={null}"
            : `emptyText="${String(value)}"`,
    },
    {
      kind: "toggle",
      id: "mono",
      prop: "mono",
      label: "Monospace value",
      group: "value",
      default: false,
    },
    {
      kind: "toggle",
      id: "wrap",
      prop: "wrap",
      label: "Wrap instead of truncate",
      group: "value",
      default: false,
    },
    {
      kind: "toggle",
      id: "tooltipOnTruncate",
      prop: "tooltipOnTruncate",
      label: "Tooltip when truncated",
      group: "value",
      default: true,
      docDefault: true,
    },
    {
      kind: "toggle",
      id: "copyable",
      prop: "copyable",
      label: "Copy button",
      group: "value",
      default: true,
      docDefault: true,
    },
    {
      kind: "toggle",
      id: "onCopy",
      prop: "onCopy",
      label: "onCopy callback",
      group: "value",
      default: false,
      emit: (value) =>
        value === true ? "onCopy={(text) => console.log(text)}" : null,
    },
    {
      /*
       * The preview writes the callback's payload here so the caption can show it;
       * the reader never gets a box for it, and the snippet never prints it.
       */
      kind: "text",
      id: "copyReport",
      prop: null,
      label: "Last copy",
      group: "value",
      default: "",
      when: () => false,
      emit: () => null,
    },
    {
      kind: "choice",
      id: "labelWidth",
      prop: "labelWidth",
      label: "Label column",
      group: "value",
      default: AUTO,
      options: [
        { label: "auto (30% cap)", value: AUTO },
        { label: '"" — grows', value: GROW },
        { label: '"w-32" — fixed', value: FIXED_LABEL_WIDTH },
      ],
      emit: (value) =>
        value === AUTO
          ? null
          : value === GROW
            ? 'labelWidth=""'
            : `labelWidth="${String(value)}"`,
    },
    {
      kind: "choice",
      id: "labelSize",
      prop: "labelSize",
      label: "Label size",
      group: "value",
      default: AUTO,
      options: sizeOverrideOptions,
      emit: (value) =>
        value === AUTO ? null : `labelSize="${String(value)}"`,
    },
    {
      kind: "choice",
      id: "valueSize",
      prop: "valueSize",
      label: "Value size",
      group: "value",
      default: AUTO,
      options: sizeOverrideOptions,
      emit: (value) =>
        value === AUTO ? null : `valueSize="${String(value)}"`,
    },
    {
      kind: "toggle",
      id: "valueClassName",
      prop: "valueClassName",
      label: "Own the value's colour",
      group: "value",
      default: false,
      emit: (value) =>
        value === true
          ? 'valueClassName="text-emerald-600 dark:text-emerald-400"'
          : null,
    },

    // ── Type & surface ───────────────────────────────────────────────────────
    {
      kind: "choice",
      id: "variant",
      prop: "variant",
      label: "Variant",
      group: "type",
      default: VARIANT_DEFAULT,
      docDefault: VARIANT_DEFAULT,
      control: "select",
      options: [
        "none",
        "elevated",
        "outlined",
        "subtle",
        "tonal",
        "default",
        "glass",
        "simple",
        "liquid-glass",
        "plain",
      ].map((variant) => ({ label: variant, value: variant })),
    },
    {
      // No `docDefault`: the JSDoc's `"blue"` (:116) is not what the component
      // destructures (:388,:915). The kit's own value is the bar for printing.
      kind: "choice",
      id: "tone",
      prop: "tone",
      label: "Tone",
      group: "type",
      default: TONE_DEFAULT,
      control: "select",
      options: ["none", "blue", "emerald", "amber", "rose"].map((tone) => ({
        label: tone,
        value: tone,
      })),
    },
    {
      kind: "choice",
      id: "size",
      prop: "size",
      label: "Size",
      group: "type",
      default: SIZE_DEFAULT,
      docDefault: SIZE_DEFAULT,
      options: SIZE_OPTIONS,
    },
    {
      kind: "choice",
      id: "padding",
      prop: "padding",
      label: "Padding",
      group: "type",
      default: AUTO,
      options: [
        { label: "auto (from size)", value: AUTO },
        { label: "none", value: "none" },
        ...SIZE_OPTIONS,
      ],
      emit: (value) => (value === AUTO ? null : `padding="${String(value)}"`),
    },
    {
      kind: "choice",
      id: "corner",
      prop: "corner",
      label: "Corner",
      group: "type",
      default: AUTO,
      control: "select",
      when: (state: PlaygroundState) => !isPlain(state),
      options: [
        { label: "auto (rounded-md)", value: AUTO },
        { label: "none", value: "none" },
        { label: "rounded", value: "rounded" },
        { label: "rounded-sm", value: "rounded-sm" },
        { label: "rounded-md", value: "rounded-md" },
        { label: "rounded-lg", value: "rounded-lg" },
        { label: "rounded-xl", value: "rounded-xl" },
      ],
      emit: (value) => (value === AUTO ? null : `corner="${String(value)}"`),
    },
    {
      kind: "toggle",
      id: "raisedSurface",
      prop: "raisedSurface",
      label: "Raised surface",
      group: "type",
      default: false,
      docDefault: false,
      when: (state: PlaygroundState) => !isPlain(state),
    },
    {
      kind: "choice",
      id: "glassOpacity",
      prop: "glassOpacity",
      label: "Glass opacity",
      group: "type",
      default: AUTO,
      when: isGlass,
      options: [
        { label: "auto (frosted)", value: AUTO },
        { label: "frosted", value: "frosted" },
        { label: "light", value: "light" },
        { label: "clear", value: "clear" },
      ],
      emit: (value) =>
        value === AUTO ? null : `glassOpacity="${String(value)}"`,
    },
    {
      kind: "choice",
      id: "vibrancy",
      prop: "vibrancy",
      label: "Vibrancy",
      group: "type",
      default: AUTO,
      when: isGlass,
      options: [
        { label: "auto", value: AUTO },
        { label: "low", value: "low" },
        { label: "medium", value: "medium" },
        { label: "high", value: "high" },
      ],
      emit: (value) => (value === AUTO ? null : `vibrancy="${String(value)}"`),
    },
    {
      // Undocumented in the source (no JSDoc at :170) but read at :920,:1001.
      kind: "choice",
      id: "transparency",
      prop: "transparency",
      label: "Transparency",
      group: "type",
      default: AUTO,
      when: isGlass,
      options: [
        { label: "auto", value: AUTO },
        { label: "none", value: "none" },
        { label: "low", value: "low" },
        { label: "medium", value: "medium" },
        { label: "high", value: "high" },
      ],
      emit: (value) =>
        value === AUTO ? null : `transparency="${String(value)}"`,
    },
    {
      kind: "toggle",
      id: "hoverable",
      prop: "hoverable",
      label: "Hover wash",
      group: "type",
      default: false,
    },
    {
      kind: "toggle",
      id: "noBorder",
      prop: "noBorder",
      label: "No hairline",
      group: "type",
      default: false,
    },
    {
      kind: "toggle",
      id: "noPadding",
      prop: "noPadding",
      label: "No horizontal padding",
      group: "type",
      default: false,
    },
    {
      kind: "toggle",
      id: "bottomBorder",
      prop: "bottomBorder",
      label: "Bottom border",
      group: "type",
      default: false,
      docDefault: false,
    },

    // ── Anatomy ──────────────────────────────────────────────────────────────
    {
      kind: "choice",
      id: "icon",
      prop: "icon",
      label: "Icon",
      group: "anatomy",
      default: AUTO,
      control: "select",
      options: [
        { label: "none", value: AUTO },
        { label: "Check", value: "Check" },
        { label: "Info", value: "Info" },
        { label: "Key", value: "Key" },
        { label: "Link", value: "Link" },
      ],
      emit: (value) => (value === AUTO ? null : `icon="${String(value)}"`),
    },
    {
      kind: "toggle",
      id: "iconClassName",
      prop: "iconClassName",
      label: "Own the icon's colour",
      group: "anatomy",
      default: false,
      when: (state: PlaygroundState) => textValue(state, "icon") !== AUTO,
      emit: (value) =>
        value === true
          ? 'iconClassName="text-amber-600 dark:text-amber-400"'
          : null,
    },
    {
      kind: "toggle",
      id: "subItems",
      prop: null,
      label: "Sub-items",
      group: "anatomy",
      default: false,
      emit: () => null,
    },

    // ── Disclosure ───────────────────────────────────────────────────────────
    {
      kind: "toggle",
      id: "body",
      prop: "body",
      label: "Body node",
      group: "disclosure",
      default: false,
      emit: (value) => (value === true ? "body={<BODY />}" : null),
    },
    {
      kind: "choice",
      id: "collapsible",
      prop: "collapsible",
      label: "Collapsible",
      group: "disclosure",
      default: COLLAPSE_AUTO,
      options: [
        { label: "implied by body", value: COLLAPSE_AUTO },
        { label: "true", value: COLLAPSE_ON },
        { label: "false", value: COLLAPSE_OFF },
      ],
      emit: (value) =>
        value === COLLAPSE_AUTO
          ? null
          : value === COLLAPSE_ON
            ? "collapsible"
            : "collapsible={false}",
    },
    {
      kind: "choice",
      id: "expanded",
      prop: "expanded",
      label: "Expanded",
      group: "disclosure",
      default: EXPAND_AUTO,
      when: isDisclosure,
      options: [
        { label: "row owns it", value: EXPAND_AUTO },
        { label: "host says open", value: EXPAND_OPEN },
        { label: "host says folded", value: EXPAND_SHUT },
      ],
      emit: (value, state) =>
        value === EXPAND_OPEN
          ? "expanded={true}"
          : value === EXPAND_SHUT
            ? "expanded={false}"
            : // `setExpanded` with nothing reading `expanded` would be a lie about
              // what the host does with the report (:449-452).
              needsHostState(state)
              ? "expanded={expanded}"
              : null,
    },
    {
      kind: "toggle",
      id: "expandReport",
      prop: "onToggle",
      label: "Report toggle",
      group: "disclosure",
      default: false,
      when: isDisclosure,
      emit: (value) =>
        value === true ? "onToggle={(next) => setExpanded(next)}" : null,
    },
    {
      kind: "toggle",
      id: "defaultExpanded",
      prop: "defaultExpanded",
      label: "Starts open",
      group: "disclosure",
      default: false,
      docDefault: false,
      when: (state: PlaygroundState) => isDisclosure(state) && !isControlledExpand(state),
    },

    // ── States ───────────────────────────────────────────────────────────────
    {
      kind: "toggle",
      id: "loading",
      prop: "loading",
      label: "Loading",
      group: "states",
      default: false,
    },
    {
      kind: "choice",
      id: "loaderType",
      prop: "loaderType",
      label: "Loader",
      group: "states",
      default: LOADER_DEFAULT,
      docDefault: LOADER_DEFAULT,
      when: isLoading,
      options: [
        { label: "skeleton", value: "skeleton" },
        { label: "spinner", value: "spinner" },
      ],
    },
    {
      kind: "toggle",
      id: "error",
      // The emit speaks for it; the prop is named so the ordering test can see it.
      prop: "error",
      label: "Error",
      group: "states",
      default: false,
      emit: (value, state) =>
        value === true ? `error={"${errorText(state)}"}` : null,
    },
    {
      kind: "text",
      id: "errorText",
      prop: null,
      label: "Error message",
      group: "states",
      default: ERROR_TEXT,
      when: isError,
      emit: () => null,
    },
    {
      kind: "toggle",
      id: "hideIfEmpty",
      prop: "hideIfEmpty",
      label: "Hide if empty",
      group: "states",
      default: true,
      docDefault: true,
    },
  ],
};

/** The consts a printed snippet may need hoisted, keyed by what switches them on. */
export const needsHostState = (state: PlaygroundState): boolean =>
  flag(state, "expandReport") && isDisclosure(state);

/** The `useState` the printed demo declares, when the page asks to be told. */
export const hostStateLines = (state: PlaygroundState): string[] => {
  const lines: string[] = [];
  if (needsHostState(state)) {
    lines.push("const [expanded, setExpanded] = useState(false);");
  }
  return lines;
};

/** Whether the snippet's host card is needed — a `plain` row draws no surface. */
export const wrapsInPanel = (state: PlaygroundState): boolean => isPlain(state);

/** Everything `code()` reads, so the printing has one place to look. */
export type InfoRowCodeContext = PlaygroundCodeContext;
