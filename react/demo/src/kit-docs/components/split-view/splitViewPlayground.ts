import {
  controlSizeOptions,
  inputVariantOptions,
  surfaceVariantOptions,
} from "../../shared/options";
import type {
  EmitHelpers,
  PlaygroundConfig,
  PlaygroundDataSource,
  PlaygroundState,
} from "../../shared/playground/schema";
import {
  CAPSULES,
  LOADING_STATE,
  LIST_ACTIONS,
  EMPTY_LIST,
  PANEL_EMPTY,
  PANEL_HEADER,
  ROW_MENU,
  SUB_MENU,
  detailSource,
  type CapsuleSpec,
} from "./splitViewFixture";
import {
  LIST_TITLE,
  LOADER_DEFAULT,
  MAX_LIST_WIDTH_AUTO,
  MENU_VISIBILITY_DEFAULT,
  MIN_LIST_WIDTH_DEFAULT,
  LIST_WIDTH_AUTO,
  PROGRESS_DEFAULT,
  SELECTION_AUTO,
  SELECTION_NONE,
  SIZE_DEFAULT,
  SURFACE_TONE_DEFAULT,
  SEARCH_VARIANT_AUTO,
  TONE_DEFAULT,
  VARIANT_DEFAULT,
  choiceOf,
  errorText,
  hasRetry,
  isError,
  isLoading,
  isResizable,
  numberOf,
  showsHeader,
  withSubItems,
  flag,
} from "./splitViewStage";

/**
 * One description of the split view's options: the controls column, the props the
 * preview mounts and the attributes the Code view prints all come from this list.
 *
 * Four props have no control, on purpose. `color` is the deprecated twin of `tone`
 * (:195-196) and the table says which one wins (:485). `defaultValue`,
 * `expandedValue` and `onExpand` are host-state props that only mean something
 * with a component of your own around them — the table carries their numbers and
 * the Examples show the two that matter. And `items[].tags` is declared (:123) and
 * never read: nothing in the component renders it, so printing it would be a
 * fiction the reader would have to debug.
 */

/** The palette a deployment plausibly wears; the table states the full union. */
const TONE_OPTIONS = ["blue", "emerald", "amber", "rose", "violet", "sky"].map(
  (value) => ({ label: value, value }),
);

/** `SurfaceTone | "auto"` (:213). `"auto"` hands the surface to the accent (:487). */
const SURFACE_TONE_OPTIONS = [
  "none",
  "neutral",
  "slate",
  "blue",
  "emerald",
  "amber",
  "rose",
  "auto",
].map((value) => ({ label: value, value }));

/** The three loader treatments the component exports (:59). */
const LOADER_OPTIONS = ["skeleton", "spinner", "progress"].map((value) => ({
  label: value,
  value,
}));

/**
 * `listWidth` is a Tailwind class while the pane is fixed and a *pixel string*
 * once it is resizable, because the resizable seed parses it with `parseInt`
 * (:623-624). Both spellings are offered; the second one only works in the second
 * mode, which is the point of listing it.
 */
const LIST_WIDTH_OPTIONS = [
  { label: "(w-72)", value: LIST_WIDTH_AUTO },
  { label: "w-56", value: "w-56" },
  { label: "w-96", value: "w-96" },
  { label: "320 px", value: "320" },
];

/** No `maxListWidth` means 75% of the container, or 600 with nothing to measure (:614-621). */
const MAX_LIST_WIDTH_OPTIONS = [
  { label: "75% of the frame", value: MAX_LIST_WIDTH_AUTO },
  { label: "400", value: "400" },
  { label: "600", value: "600" },
];

/**
 * Selection, including the two states a reader needs to see: nothing selected
 * (`value=""`, which no id matches) and a `hidden` row selected — the hidden row
 * is filtered out of `visibleItems` before the lookup (:573,:669), so selecting it
 * by id selects nothing at all.
 */
const SELECTION_OPTIONS = [
  { label: "first row", value: SELECTION_AUTO },
  { label: "(none)", value: "__none" },
  ...CAPSULES.map((spec) => ({
    label: spec.hidden ? `${spec.label} (hidden)` : spec.label,
    value: spec.id,
  })),
];

/** A JSX attribute: the braces belong to the attribute, not to the printer. */
const jsx = (node: string): string => `{${node}}`;

/** One row as the object literal the reader would have written by hand. */
const printedItem = (
  spec: CapsuleSpec,
  subItemsOn: boolean,
  h: EmitHelpers,
): string => {
  const entries = [
    `id: ${h.lit(spec.id)}`,
    `label: ${h.lit(spec.label)}`,
    `subtitle: ${h.lit(spec.subtitle)}`,
    `icon: "Container"`,
    detailSource(spec.detail),
    "menu: ROW_MENU",
  ];
  if (spec.id === "gateway") {
    entries.push(`actions: <Button size="xs" variant="ghost">Logs</Button>`);
  }
  if (spec.id === "batch") {
    entries.push(`badges: [{ label: "nightly", tone: "amber", variant: "soft" }]`);
  }
  if (spec.highlight) entries.push("highlight: true");
  if (spec.disabled) entries.push("disabled: true");
  if (spec.hidden) entries.push("hidden: true");
  if (subItemsOn && spec.replicas.length > 0) {
    entries.push(`subContent: <Replicas names={${h.lit(spec.replicas)}} />`);
  }
  if (subItemsOn && spec.subItems) {
    const rows = spec.subItems.map(
      (sub, index) =>
        `{ id: ${h.lit(sub.id)}, label: ${h.lit(sub.label)}, menu: SUB_MENU${
          index === 0 ? ", onClick: (sub) => console.log(sub.id)" : ""
        } }`,
    );
    entries.push(`subItems: [${rows.join(", ")}]`);
  }
  return `{\n      ${entries.join(",\n      ")},\n    }`;
};

export const splitViewData: PlaygroundDataSource[] = [
  {
    id: "items",
    constName: "ITEMS",
    prop: "items",
    label: "the rows the list renders",
    note:
      "`hidden` rows stay in the array and never paint (:98-99,:573); a row without `panel` falls back to `panelEmptyState` (:1532)",
    value: () => CAPSULES,
    /*
     * Rows carry markup — a `panel`, a `subContent`, an `actions` button — and a
     * markup value has no literal. So the array is printed by hand from the same
     * `CAPSULES` records the preview builds elements out of.
     */
    emit: "source",
    source: (state, h) =>
      `[\n    ${CAPSULES.map((spec) =>
        printedItem(spec, withSubItems(state), h),
      ).join(",\n    ")},\n  ]`,
  },
];

export const splitViewConfig: PlaygroundConfig = {
  groups: [
    { id: "list", title: "The list", defaultOpen: true },
    { id: "surface", title: "Surface" },
    { id: "detail", title: "Detail pane" },
    { id: "states", title: "Loading & error" },
  ],

  data: splitViewData,

  fields: [
    /* ---------------------------------------------------------------- list */
    {
      id: "listTitle",
      label: "List title",
      group: "list",
      kind: "toggle",
      prop: "listTitle",
      default: true,
      emit: (value) =>
        value === true ? `listTitle=${JSON.stringify(LIST_TITLE)}` : null,
    },
    {
      id: "listActions",
      label: "List actions",
      group: "list",
      kind: "toggle",
      prop: "listActions",
      default: false,
      emit: (value) => (value === true ? "listActions={<LIST_ACTIONS />}" : null),
    },
    {
      id: "searchPlaceholder",
      label: "Search placeholder",
      group: "list",
      kind: "text",
      prop: "searchPlaceholder",
      default: "",
      placeholder: "Search...",
    },
    {
      id: "searchVariant",
      label: "Search surface",
      group: "list",
      kind: "choice",
      prop: "searchVariant",
      options: [{ label: "follows surface", value: SEARCH_VARIANT_AUTO }, ...inputVariantOptions],
      default: SEARCH_VARIANT_AUTO,
      // `"auto"` is this page's word for *send nothing*: the map at :67-77 picks
      // the `InputVariant` that belongs to the surface underneath.
      emit: (value) =>
        value === SEARCH_VARIANT_AUTO ? null : `searchVariant="${String(value)}"`,
    },
    {
      id: "menuVisibility",
      label: "Row menu dots",
      group: "list",
      kind: "choice",
      prop: "menuVisibility",
      options: [
        { label: "on hover", value: "hover" },
        { label: "always", value: "always" },
      ],
      default: MENU_VISIBILITY_DEFAULT,
      docDefault: MENU_VISIBILITY_DEFAULT,
    },
    {
      id: "showHighlightIndicator",
      label: "New-item dot",
      group: "list",
      kind: "toggle",
      prop: "showHighlightIndicator",
      default: true,
      docDefault: true,
    },
    {
      id: "subItems",
      label: "Sub-items",
      group: "list",
      kind: "toggle",
      prop: null,
      default: true,
      // A data lever: it changes what `ITEMS` holds, so it has no attribute of its own.
      emit: () => null,
    },
    {
      id: "resizable",
      label: "Draggable divider",
      group: "list",
      kind: "toggle",
      prop: "resizable",
      default: false,
      docDefault: false,
    },
    {
      id: "minListWidth",
      label: "Min list width",
      group: "list",
      kind: "number",
      prop: "minListWidth",
      default: MIN_LIST_WIDTH_DEFAULT,
      docDefault: MIN_LIST_WIDTH_DEFAULT,
      min: 120,
      max: 400,
      step: 10,
      when: isResizable,
    },
    {
      id: "maxListWidth",
      label: "Max list width",
      group: "list",
      kind: "choice",
      prop: "maxListWidth",
      options: MAX_LIST_WIDTH_OPTIONS,
      default: MAX_LIST_WIDTH_AUTO,
      emit: (value) =>
        value === MAX_LIST_WIDTH_AUTO ? null : `maxListWidth={${String(value)}}`,
      when: isResizable,
    },
    {
      id: "listWidth",
      label: "List width",
      group: "list",
      kind: "choice",
      prop: "listWidth",
      options: LIST_WIDTH_OPTIONS,
      default: LIST_WIDTH_AUTO,
      // Only `parseInt`-able values mean anything once the divider is draggable
      // (:623-624) — `w-96` seeds 288px, exactly as if it had not been passed.
      emit: (value) =>
        value === LIST_WIDTH_AUTO ? null : `listWidth="${String(value)}"`,
    },
    {
      id: "collapsible",
      label: "Collapsible list",
      group: "list",
      kind: "toggle",
      prop: "collapsible",
      default: false,
      docDefault: false,
    },
    {
      id: "collapse",
      label: "Collapse state",
      group: "list",
      kind: "choice",
      prop: "collapsed",
      options: [
        { label: "list owns it", value: "self" },
        { label: "host says folded", value: "collapsed" },
        { label: "host says open", value: "expanded" },
      ],
      default: "self",
      emit: (value) =>
        value === "self" ? null : `collapsed={${String(value === "collapsed")}}`,
      when: (state) => flag(state, "collapsible"),
    },
    {
      id: "collapseReport",
      label: "Report collapse",
      group: "list",
      kind: "toggle",
      prop: "onCollapsedChange",
      default: false,
      emit: (value) =>
        value === true
          ? `onCollapsedChange=${jsx("(next) => setCollapsed(next)")}`
          : null,
      when: (state) => flag(state, "collapsible"),
    },

    /* ------------------------------------------------------------- surface */
    {
      id: "variant",
      label: "Variant",
      group: "surface",
      kind: "choice",
      prop: "variant",
      options: surfaceVariantOptions,
      default: VARIANT_DEFAULT,
      docDefault: VARIANT_DEFAULT,
      control: "select",
    },
    {
      id: "tone",
      label: "Accent tone",
      group: "surface",
      kind: "choice",
      prop: "tone",
      options: TONE_OPTIONS,
      default: TONE_DEFAULT,
      control: "select",
    },
    {
      id: "surfaceTone",
      label: "Surface tone",
      group: "surface",
      kind: "choice",
      prop: "surfaceTone",
      options: SURFACE_TONE_OPTIONS,
      default: SURFACE_TONE_DEFAULT,
      // No `docDefault`: the JSDoc announces `"neutral"` (:211) and the code opens
      // at `"none"` (:450). The table tells the story; a control would launder it.
      control: "select",
    },
    {
      id: "size",
      label: "Size",
      group: "surface",
      kind: "choice",
      prop: "size",
      options: controlSizeOptions,
      default: SIZE_DEFAULT,
      docDefault: SIZE_DEFAULT,
    },
    {
      id: "raisedSurface",
      label: "Raised surface",
      group: "surface",
      kind: "toggle",
      prop: "raisedSurface",
      default: false,
      docDefault: false,
    },
    {
      id: "borderLeft",
      label: "Left rule",
      group: "surface",
      kind: "toggle",
      prop: "borderLeft",
      default: false,
      docDefault: false,
    },

    /* -------------------------------------------------------------- detail */
    {
      id: "panelHeaderProps",
      label: "Built-in header",
      group: "detail",
      kind: "toggle",
      prop: "panelHeaderProps",
      default: true,
      emit: (value) =>
        value === true ? "panelHeaderProps={PANEL_HEADER_PROPS}" : null,
    },
    {
      id: "headerDetails",
      label: "Header details block",
      group: "detail",
      kind: "toggle",
      prop: null,
      default: true,
      // It edits the contents of `PANEL_HEADER_PROPS`, not an attribute.
      emit: () => null,
      when: showsHeader,
    },
    {
      id: "panelHeader",
      label: "panelHeader node",
      group: "detail",
      kind: "toggle",
      prop: "panelHeader",
      default: false,
      emit: (value) => (value === true ? "panelHeader={<PANEL_HEADER />}" : null),
    },
    {
      id: "selection",
      label: "Selected row",
      group: "detail",
      kind: "choice",
      prop: "value",
      options: SELECTION_OPTIONS,
      default: SELECTION_AUTO,
      // `value` is a controlled prop: naming one row freezes the selection, and the
      // empty string matches no id at all (:669).
      emit: (value) => {
        const picked = String(value);
        if (picked === SELECTION_AUTO) return null;
        return `value="${picked === "__none" ? SELECTION_NONE : picked}"`;
      },
    },
    {
      id: "panelEmptyState",
      label: "Detail placeholder",
      group: "detail",
      kind: "toggle",
      prop: "panelEmptyState",
      default: false,
      emit: (value) =>
        value === true ? "panelEmptyState={<PANEL_EMPTY />}" : null,
    },
    {
      id: "emptyState",
      label: "Filter-empty node",
      group: "detail",
      kind: "toggle",
      prop: "emptyState",
      default: false,
      emit: (value) => (value === true ? "emptyState={<EMPTY_LIST />}" : null),
    },
    {
      id: "panelScrollable",
      label: "Detail scrolls",
      group: "detail",
      kind: "toggle",
      prop: "panelScrollable",
      default: true,
      docDefault: true,
    },

    /* -------------------------------------------------------------- states */
    {
      id: "loading",
      label: "Loading",
      group: "states",
      kind: "toggle",
      prop: "loading",
      default: false,
      docDefault: false,
    },
    {
      id: "loaderType",
      label: "Loader",
      group: "states",
      kind: "choice",
      prop: "loaderType",
      options: LOADER_OPTIONS,
      default: LOADER_DEFAULT,
      docDefault: LOADER_DEFAULT,
      when: isLoading,
    },
    {
      id: "loadingProgress",
      label: "Progress value",
      group: "states",
      kind: "number",
      prop: "loadingProgress",
      default: PROGRESS_DEFAULT,
      min: 0,
      max: 100,
      step: 1,
      // Emitted while the progress loader is on screen; the prop itself has no
      // component default, so no `docDefault` to disagree with.
      emit: (_value, state) =>
        isLoading(state) && choiceOf(state, "loaderType", LOADER_DEFAULT) === "progress"
          ? `loadingProgress={${String(numberOf(state, "loadingProgress", PROGRESS_DEFAULT))}}`
          : null,
      when: (state) =>
        isLoading(state) &&
        choiceOf(state, "loaderType", LOADER_DEFAULT) === "progress",
    },
    {
      id: "loadingState",
      label: "Custom loader",
      group: "states",
      kind: "toggle",
      prop: "loadingState",
      default: false,
      emit: (value) => (value === true ? "loadingState={<LOADING_STATE />}" : null),
      when: isLoading,
    },
    {
      id: "error",
      label: "Error state",
      group: "states",
      kind: "toggle",
      prop: null,
      default: false,
      // One attribute, two controls: this one decides whether it exists, the text
      // field below decides what it says.
      emit: (value, state) => {
        if (value !== true) return null;
        const message = errorText(state);
        return hasRetry(state)
          ? `error={errored ? ${JSON.stringify(message)} : undefined}`
          : `error=${JSON.stringify(message)}`;
      },
    },
    {
      id: "errorText",
      label: "Error message",
      group: "states",
      kind: "text",
      prop: null,
      default: "",
      placeholder: "Could not reach the registry",
      emit: () => null,
      when: isError,
    },
    {
      id: "onRetry",
      label: "Retry action",
      group: "states",
      kind: "toggle",
      prop: "onRetry",
      default: false,
      emit: (value) =>
        value === true ? `onRetry=${jsx("() => setErrored(false)")}` : null,
      when: isError,
    },
  ],
};

/**
 * The fixture constants a printed demo hoists, in the order the reader meets
 * them. `code()` prints only the ones its attributes actually refer to.
 */
export const FIXTURE_CONSTS = {
  ROW_MENU,
  SUB_MENU,
  LIST_ACTIONS,
  PANEL_HEADER,
  PANEL_EMPTY,
  EMPTY_LIST,
  LOADING_STATE,
} as const;

/** The `useState` lines the printed demo owns, for state its props report back. */
export const hostStateLines = (state: PlaygroundState): string[] => {
  const lines: string[] = [];
  if (hasRetry(state)) {
    lines.push("const [errored, setErrored] = useState(true);");
  }
  if (flag(state, "collapsible") && flag(state, "collapseReport")) {
    lines.push("const [collapsed, setCollapsed] = useState(false);");
  }
  return lines;
};
