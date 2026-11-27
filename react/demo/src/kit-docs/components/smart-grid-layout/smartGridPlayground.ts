import type { ButtonVariant } from "@cjlapao/ui-kit";
import {
  buttonVariantOptions,
  controlSizeOptions,
  plainSurfaceVariantOptions,
} from "../../shared/options";
import type {
  PlaygroundCodeContext,
  PlaygroundConfig,
  PlaygroundDataSource,
  PlaygroundState,
} from "../../shared/playground/schema";
import {
  TILE_COUNT,
  tileSource,
  tilesFor,
  layoutOf,
  type SmartGridTileSpec,
} from "./smartGridFixture";
import {
  COLUMNS_DEFAULT,
  DEBOUNCE_DEFAULT,
  HISTORY_DEFAULT,
  RESPONSIVE_BASE,
  RESPONSIVE_MD,
  SIZE_DEFAULT,
  STORAGE_PREFIX_DEFAULT,
  SURFACE_TONE_DEFAULT,
  TONE_DEFAULT,
  VARIANT_DEFAULT,
  columnsOf,
  isPlainSurface,
  isResponsive,
  layoutChoice,
  savesAutomatically,
  showsUncontrolledStart,
  tileCount,
  usesStorage,
} from "./smartGridStage";

/**
 * The knobs of a dashboard builder, in the order a reader meets them: what is on
 * the board, how wide it is, what it sits on, how it is edited, where the result
 * is kept.
 *
 * Two props are deliberately absent. `persistedLayout`/`onLayoutChange` are the
 * manual half of persistence and `storage` is an adapter object — all three are
 * data this playground cannot invent on the reader's behalf, so the API table and
 * the Persistence example carry them instead of a control pretending to.
 */

export const ITEMS_CONST = "ITEMS";
export const LAYOUT_CONST = "LAYOUT";
export const EDIT_REPORT_CONST = "logEditMode";

/** Printed as the host's own reaction, so the snippet compiles on its own. */
export const EDIT_REPORT_ARRAY = "editReports";
export const EDIT_REPORT_SOURCE =
  "[] as boolean[]";
export const EDIT_REPORT_HANDLER_SOURCE =
  "(isEditMode: boolean) => editReports.push(isEditMode)";

const TILE_OPTIONS = [
  { label: "4", value: "4" },
  // The middle step is the one that opens: a full row of tiles and one spare for
  // the palette, which is what a dashboard actually ships with.
  { label: `${TILE_COUNT - 1}`, value: String(TILE_COUNT - 1) },
  { label: `all ${TILE_COUNT}`, value: String(TILE_COUNT) },
];

const LAYOUT_OPTIONS = [
  { label: "One section", value: "overview" },
  { label: "Two sections", value: "sections" },
];

const COLUMN_OPTIONS = [4, 6, 8, 12].map((n) => ({
  label: `${n}`,
  value: String(n),
}));

/**
 * The whole `SURFACE_TONES` union is 22 members; a segment of 22 swatches is not
 * a control, so the surface tone and the accent offer the handful a dashboard
 * plausibly wears. The API table states the real type.
 */
const SURFACE_TONE_OPTIONS = [
  "none",
  "neutral",
  "slate",
  "blue",
  "emerald",
  "amber",
  "rose",
].map((value) => ({ label: value, value }));

const TONE_OPTIONS = [
  "blue",
  "emerald",
  "amber",
  "rose",
  "violet",
  "sky",
].map((value) => ({ label: value, value }));

const EDIT_MODE_OPTIONS = [
  { label: "grid owns it", value: "self" },
  { label: "host says editing", value: "on" },
  { label: "host says viewing", value: "off" },
];

/** The catalogue entry, printed field by field because `render` is not data. */
const printedItem = (
  spec: SmartGridTileSpec,
  h: PlaygroundCodeContext["h"],
): string => {
  const fields = [
    `id: ${h.lit(spec.id)}`,
    `title: ${h.lit(spec.title)}`,
    "active: true",
    "single: true",
    `defaultSpan: ${String(spec.span)}`,
    `render: ${tileSource(spec)}`,
  ];
  return `{ ${fields.join(", ")} }`;
};

export const smartGridData: PlaygroundDataSource[] = [
  {
    id: "items",
    constName: ITEMS_CONST,
    prop: "items",
    label: "the catalogue of tiles the layout may place",
    note:
      "what exists, not what is on screen — the entry no row names is what “Add Item” offers (:40-51)",
    value: (state) => tilesFor(state),
    /*
     * An item's `render` is a function, and a function has no literal: the array
     * is printed by hand, from the same spec records the preview mounts, as the
     * call that builds the very element it renders.
     */
    emit: "source",
    source: (state, h) =>
      `[${tilesFor(state)
        .map((spec) => printedItem(spec, h))
        .join(",\n  ")}]`,
  },
  {
    id: "layout",
    constName: LAYOUT_CONST,
    prop: "defaultLayout",
    label: "the layout the app shipped with",
    note:
      "rows name tiles by id, never by position; the last entry is left unplaced on purpose (:78-88)",
    value: (state) => layoutOf(tileCount(state), layoutChoice(state) === "sections"),
    emit: "literal",
  },
];

export const smartGridConfig: PlaygroundConfig = {
  groups: [
    { id: "board", title: "The board" },
    { id: "surface", title: "Surface" },
    { id: "editing", title: "Editing", defaultOpen: true },
    { id: "persistence", title: "Persistence" },
    { id: "classes", title: "Spacing & classes" },
  ],

  fields: [
    {
      id: "tiles",
      label: "Tiles",
      group: "board",
      kind: "choice",
      options: TILE_OPTIONS,
      prop: null,
      default: String(TILE_COUNT - 1),
      emit: () => null,
    },
    {
      id: "layout",
      label: "Layout",
      group: "board",
      kind: "choice",
      options: LAYOUT_OPTIONS,
      prop: null,
      default: "overview",
      emit: () => null,
    },
    {
      id: "columns",
      label: "Columns",
      group: "board",
      kind: "choice",
      options: COLUMN_OPTIONS,
      prop: "maxColumns",
      // A choice holds strings, so its documented default is the string the
      // component opens on — `maxColumnsProp = 12` (:944).
      docDefault: String(COLUMNS_DEFAULT),
      default: String(COLUMNS_DEFAULT),
      /*
       * Measured against the container, not the viewport — a grid in a split pane
       * is narrower than the window (:967-984). In responsive mode this number
       * becomes the `lg` of the map, so it stays visible either way.
       */
      emit: (value, state) =>
        isResponsive(state) || Number(value) === COLUMNS_DEFAULT
          ? null
          : `maxColumns={${String(columnsOf(state))}}`,
    },
    {
      id: "responsive",
      label: "Per-breakpoint counts",
      group: "board",
      kind: "toggle",
      prop: "maxColumns",
      default: false,
      emit: (value, state) =>
        value === true
          ? `maxColumns={{ base: ${RESPONSIVE_BASE}, md: ${RESPONSIVE_MD}, lg: ${String(
              columnsOf(state),
            )} }}`
          : null,
    },
    {
      id: "variant",
      label: "Variant",
      group: "surface",
      kind: "choice",
      options: plainSurfaceVariantOptions,
      prop: "variant",
      docDefault: VARIANT_DEFAULT,
      default: VARIANT_DEFAULT,
      emit: (value) =>
        String(value) === VARIANT_DEFAULT ? null : `variant="${String(value)}"`,
    },
    {
      id: "surfaceTone",
      label: "Surface tone",
      group: "surface",
      kind: "choice",
      options: SURFACE_TONE_OPTIONS,
      prop: "surfaceTone",
      docDefault: SURFACE_TONE_DEFAULT,
      default: SURFACE_TONE_DEFAULT,
      when: (state) => !isPlainSurface(state),
      emit: (value) =>
        String(value) === SURFACE_TONE_DEFAULT
          ? null
          : `surfaceTone="${String(value)}"`,
    },
    {
      id: "tone",
      label: "Edit accent",
      group: "surface",
      kind: "choice",
      options: TONE_OPTIONS,
      prop: "tone",
      docDefault: TONE_DEFAULT,
      default: TONE_DEFAULT,
      emit: (value) =>
        String(value) === TONE_DEFAULT ? null : `tone="${String(value)}"`,
    },
    {
      id: "size",
      label: "Size",
      group: "surface",
      kind: "choice",
      options: controlSizeOptions,
      prop: "size",
      docDefault: SIZE_DEFAULT,
      default: SIZE_DEFAULT,
      emit: (value) =>
        String(value) === SIZE_DEFAULT ? null : `size="${String(value)}"`,
    },
    {
      id: "controlVariant",
      label: "Control surface",
      group: "surface",
      kind: "choice",
      options: [
        { label: "follows variant", value: "" },
        ...buttonVariantOptions,
      ],
      prop: "controlVariant",
      default: "",
      emit: (value) =>
        String(value).length === 0
          ? null
          : `controlVariant="${String(value) as ButtonVariant}"`,
    },
    {
      id: "editMode",
      label: "Edit mode",
      group: "editing",
      kind: "choice",
      options: EDIT_MODE_OPTIONS,
      prop: "isEditMode",
      default: "self",
      emit: (value) => {
        if (String(value) === "on") return "isEditMode";
        if (String(value) === "off") return "isEditMode={false}";
        return null;
      },
    },
    {
      id: "onEditModeChange",
      label: "Report edit mode",
      group: "editing",
      kind: "toggle",
      prop: "onEditModeChange",
      default: false,
      emit: (value) =>
        value === true ? `onEditModeChange={${EDIT_REPORT_CONST}}` : null,
    },
    {
      id: "defaultEditMode",
      label: "Start in edit mode",
      group: "editing",
      kind: "toggle",
      prop: "defaultEditMode",
      docDefault: false,
      default: false,
      when: showsUncontrolledStart,
      emit: (value) => (value === true ? "defaultEditMode" : null),
    },
    {
      id: "readOnly",
      label: "Read-only",
      group: "editing",
      kind: "toggle",
      prop: "readOnly",
      docDefault: false,
      default: false,
      emit: (value) => (value === true ? "readOnly" : null),
    },
    {
      id: "historyLimit",
      label: "Undo steps",
      group: "editing",
      kind: "number",
      prop: "historyLimit",
      docDefault: HISTORY_DEFAULT,
      default: HISTORY_DEFAULT,
      min: 0,
      max: 100,
      step: 1,
      emit: (value) =>
        Number(value) === HISTORY_DEFAULT
          ? null
          : `historyLimit={${String(Math.max(0, Math.round(Number(value)) || 0))}}`,
    },
    {
      id: "storageKey",
      label: "Storage key",
      group: "persistence",
      kind: "text",
      prop: "storageKey",
      default: "",
      placeholder: "playground-dashboard",
      emit: (value) =>
        String(value).trim().length === 0
          ? null
          : `storageKey=${JSON.stringify(String(value).trim())}`,
    },
    {
      id: "storagePrefix",
      label: "Storage prefix",
      group: "persistence",
      kind: "text",
      prop: "storagePrefix",
      docDefault: STORAGE_PREFIX_DEFAULT,
      // The control opens on the prefix the component itself would have used
      // (:1017, GRID_STORAGE_DEFAULT_PREFIX) instead of on an empty box, so what
      // the reader reads out of the field is what lands in the key — and the emit
      // keeps it out of the tag for exactly that reason.
      default: STORAGE_PREFIX_DEFAULT,
      placeholder: "my-app:grids",
      when: usesStorage,
      emit: (value) => {
        const raw = String(value).trim();
        return raw.length === 0 || raw === STORAGE_PREFIX_DEFAULT
          ? null
          : `storagePrefix=${JSON.stringify(raw)}`;
      },
    },
    {
      id: "autoSave",
      label: "Write on change",
      group: "persistence",
      kind: "toggle",
      prop: "autoSave",
      docDefault: true,
      default: true,
      when: usesStorage,
      emit: (value) => (value === false ? "autoSave={false}" : null),
    },
    {
      id: "autoSaveDebounceMs",
      label: "Save delay, ms",
      group: "persistence",
      kind: "number",
      prop: "autoSaveDebounceMs",
      docDefault: DEBOUNCE_DEFAULT,
      default: DEBOUNCE_DEFAULT,
      min: 0,
      max: 2000,
      step: 50,
      when: (state) => usesStorage(state) && savesAutomatically(state),
      emit: (value) =>
        Number(value) === DEBOUNCE_DEFAULT
          ? null
          : `autoSaveDebounceMs={${String(Math.max(0, Math.round(Number(value)) || 0))}}`,
    },
    {
      id: "className",
      label: "Class name",
      group: "classes",
      kind: "text",
      prop: "className",
      default: "",
      placeholder: "min-h-[24rem]",
      emit: (value) =>
        String(value).trim().length === 0
          ? null
          : `className=${JSON.stringify(String(value).trim())}`,
    },
  ],

  data: smartGridData,
};

/** A number the reader can trust in both views: what is mounted is what prints. */
export const placedCount = (state: PlaygroundState): number =>
  layoutOf(tileCount(state), layoutChoice(state) === "sections").reduce(
    (total, section) => total + section.rows.reduce((n, row) => n + row.itemIds.length, 0),
    0,
  );
