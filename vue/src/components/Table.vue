<script lang="ts">
import type { CSSProperties, VNodeChild } from "vue";
import type { TrueColor } from "../theme";
import {
  NEUTRAL_TONES,
  TRUE_COLORS,
  getSurfaceTextTokens,
  getTableDensityTokens,
  type SurfaceCorner,
  type SurfaceVariant,
  type TableDensity,
} from "../theme";
import type { IconName } from "../icons/registry";
import Panel from "./Panel.vue";
import type { PanelTone } from "./Panel.vue";
import {
  TABLE_STORAGE_DEFAULT_PREFIX,
  buildTableStorageKey,
  createSafeLocalStorage,
  decodeStoredSettings,
  encodeStoredSettings,
  type TableStorageAdapter,
} from "../utils/tableStorage";
import type { TableSettings } from "../types/TableSettings";

type SortDirection = "asc" | "desc";

export interface TableSortState {
  columnId: string;
  direction: SortDirection;
}

export interface TablePaginationState {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

type AccessorFn<T> = (row: T, index: number) => VNodeChild;

export interface TableColumn<T> {
  id: string;
  header: VNodeChild;
  accessor?: keyof T | AccessorFn<T>;
  render?: (row: T, index: number) => VNodeChild;
  /** Override the value used for sorting when render returns a non-primitive (e.g. an icon). */
  sortValue?: (row: T) => string | number;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  tooltip?: string;
  className?: string;
  headerClassName?: string;
  sticky?: "left" | "right";
  /** When true, this column is excluded from user preference menus (hide/show, group-by, sticky). */
  isActionsColumn?: boolean;
  /** When true, the column starts hidden by default but can still be enabled from the Columns menu. */
  defaultHidden?: boolean;
  /** When false, this column cannot be hidden via the column visibility toggle. Defaults to true. */
  hideable?: boolean;
  /** When false, this column will not appear in the group-by picker. Defaults to true. */
  groupable?: boolean;
  /** When false, this column cannot be resized even when `resizableColumns` is set on the table. Defaults to true. */
  resizable?: boolean;
  /**
   * Returns a plain string used as the group key and header label when this column is the active
   * group-by. Use this when `render` returns VNodes (which would otherwise give "[object Object]").
   * Falls back to: accessor result → sortValue → render result (only if a primitive string/number).
   */
  groupValue?: (row: T) => string;
  /**
   * Background Tailwind class(es) applied to sticky cells so they remain opaque over scrolled
   * content. Defaults to `'bg-white dark:bg-neutral-900'`. Pass `'bg-transparent'` to let the
   * row/table background show through instead.
   */
  stickyBackground?: string;
  /**
   * Per-row variant of `stickyBackground`. When provided, takes precedence over `stickyBackground`
   * for the matching row. Return `undefined` to fall back to the static `stickyBackground`.
   */
  stickyBackgroundFn?: (row: T, index: number) => string | undefined;
}

export type Column<T> = TableColumn<T>;

/**
 * The container surface, on the shared panel family — the same eight
 * treatments as `Panel`, so a table reads identically to the card beside it.
 * The former density members (`compact`, `minimal`) moved to the `density`
 * prop and `bordered` to a boolean prop, so those old values are now type
 * errors by design.
 */
export type TableVariant = SurfaceVariant;

/** Internal type for a single group entry when grouping is active. */
type GroupEntry<T> = {
  key: string;
  display: string;
  rows: { row: T; originalIndex: number }[];
};

export interface TableProps<T> {
  columns?: TableColumn<T>[];
  data: T[];
  selectedItems?: T[];
  rowKey?: (row: T, index: number) => string | number;
  /**
   * The container surface — the shared panel family (`elevated`,
   * `outlined`, `subtle`, `tonal`, `default`, `glass`, `simple`,
   * `liquid-glass`). Rendered by `Panel`, so the table sits on the exact
   * surface a `Panel` beside it would. Defaults to `outlined`.
   */
  variant?: TableVariant;
  /**
   * How tight the cells sit — `default`, `compact` or `minimal`
   * (`TABLE_DENSITIES`). Orthogonal to `variant`: a compact table on glass
   * reads the same as a compact table on an outlined card.
   */
  density?: TableDensity;
  /**
   * Draws grid lines between cells (vertical rules per column plus a
   * stronger header rule). `noBorders` still wins when both are set.
   */
  bordered?: boolean;
  /** Corner radius of the container, on the shared surface corner scale. */
  corner?: SurfaceCorner;
  /**
   * Palette tone of the table: the header band, tone accents, and — unless
   * overridden by `color` — the controls inside the table (action buttons,
   * sort indicators, group dots, badges, pagination, selected/highlight rows,
   * focus rings).
   */
  tone?: PanelTone;
  /**
   * Control-only tone override: tints the interior controls (buttons, sort
   * indicators, group dots, badges, pagination, selected/highlight rows,
   * focus rings) independently of `tone`. Defaults to `tone`.
   */
  color?: TrueColor;
  striped?: boolean;
  noBorders?: boolean;
  hoverable?: boolean;
  stickyHeader?: boolean;
  /**
   * When true, the last column is pinned to the right edge and stays visible
   * while the other columns scroll horizontally. A left border separator is
   * added automatically to distinguish it from the scrolling content.
   */
  stickyActions?: boolean;
  loading?: boolean;
  loadingMessage?: string;
  loaderType?: "spinner" | "progress";
  loaderProgress?: number;
  emptyState?: VNodeChild;
  /**
   * Controlled sort state. Pass `null` to clear the sort — like every other
   * prop, `undefined` means "uncontrolled" (the table keeps its own state),
   * so the two must not be conflated.
   */
  sortState?: TableSortState | null;
  defaultSort?: TableSortState;
  headerActions?: VNodeChild;
  footer?: VNodeChild;
  pagination?: TablePaginationState;
  maxHeight?: string | number;
  rowClassName?: (row: T, index: number) => string;
  /** When provided and returns true for a row, that row is rendered with an intense accent background and a pulsing left-border indicator to signal new/updated content. */
  rowHighlight?: (row: T, index: number) => boolean;
  tableClassName?: string;
  bodyClassName?: string;
  fullHeight?: boolean;
  manualSorting?: boolean;
  /** Title shown in the header bar alongside headerActions / view toggle. Defaults to empty. */
  headerTitle?: string;
  /**
   * Initial column visibility map (`columnId → visible`).
   * Serialise with `JSON.stringify` to save; parse and pass back to restore.
   */
  columnVisibility?: Record<string, boolean>;
  /**
   * When true, shows the column visibility toggle button in the header bar.
   * Defaults to false — the icon is hidden unless this prop is explicitly set.
   */
  showColumnSelector?: boolean;
  /**
   * Enables drag-to-resize column headers. Each column can opt out via `column.resizable = false`.
   */
  resizableColumns?: boolean;
  /**
   * Initial column width map (`columnId → pixels`).
   * Serialise with `JSON.stringify` to save; parse and pass back to restore.
   */
  columnWidths?: Record<string, number>;
  /** Renders each row as a panel card. When provided alongside columns, a view toggle appears in the header. */
  panelItem?: (row: T, index: number) => VNodeChild;
  /** Initial view when both columns and panelItem are provided. Defaults to "table". */
  defaultView?: "table" | "panel";
  /** CSS class(es) for the panel grid container. Defaults to a 1–3 column responsive grid. */
  panelGridClassName?: string;
  /**
   * Minimum width of each panel card. The grid uses CSS `auto-fill` to place
   * as many columns as fit the container — adapts to the parent width with no
   * hard breakpoints. Accepts a CSS length string ("280px", "20rem") or a
   * number treated as px. When set, takes precedence over the column layout in
   * `panelGridClassName` (extra classes from `panelGridClassName` still apply).
   */
  panelMinItemWidth?: string | number;
  /**
   * Gap between panel cards when `panelMinItemWidth` is set. Accepts a CSS
   * length string ("1rem", "16px") or a number treated as px. Defaults to
   * "1rem" (= `gap-4`). The value is applied via inline style so it cannot be
   * accidentally overridden by a conflicting Tailwind class.
   */
  panelGap?: string | number;
  /**
   * Maximum width of each panel card when `panelMinItemWidth` is set. Prevents cards from
   * growing too wide on large containers. Accepts a CSS length string ("480px", "30rem") or
   * a number treated as px. When omitted, cards stretch to fill available space (`1fr`).
   */
  panelMaxItemWidth?: string | number;
  /**
   * When provided, the panel view only renders the first row for each unique key value.
   * Use this when `data` is a flattened list but panels should show one card per logical entity.
   * Example: `:panel-deduplicate-by="(row) => row.manifest.id"`
   */
  panelDeduplicateBy?: (row: T) => string | number;
  // ── Grouping ────────────────────────────────────────────────────────────────
  /**
   * Column id to group rows by (code-defined).
   * Always applied; the user cannot override this via the UI.
   */
  groupBy?: string;
  /**
   * When true, a grouping control is shown in the header letting the user
   * configure grouping at runtime. Only effective when `groupBy` is not set.
   */
  groupable?: boolean;
  /**
   * Initial user-configured group column id (uncontrolled).
   * Pass the persisted value here on mount to restore previous state.
   * Only used when `groupable` is true and `groupBy` is not set.
   */
  defaultGroupBy?: string;
  /** Whether to show a header row for each group value. Defaults to true. */
  showGroupHeader?: boolean;
  /** Whether groups start expanded. Defaults to true. */
  defaultGroupExpanded?: boolean;
  // ── User sticky columns ──────────────────────────────────────────────────────
  /**
   * When true, a sticky-column picker is shown in the header bar letting the
   * user pin individual columns to the left or right at runtime.
   */
  userStickyColumns?: boolean;
  /**
   * Initial user-configured sticky map (`columnId → 'left' | 'right'`).
   * Pass the persisted value here on mount to restore previous state.
   */
  defaultStickyColumns?: Record<string, "left" | "right">;
  /**
   * Unified table settings snapshot. Fields here take precedence over the
   * individual initial-value props (`columnVisibility`, `columnWidths`,
   * `defaultView`, `defaultGroupBy`, `defaultStickyColumns`).
   * Pass a previously persisted value to restore all settings on mount.
   */
   tableSettings?: TableSettings;
  // ── Built-in settings persistence ──────────────────────────────────────────
  /**
   * Enables built-in settings persistence. When set, the table restores its
   * settings from storage on mount and saves the full `TableSettings`
   * snapshot after every change, under
   * `{storagePrefix}:{storageKey}` (default prefix `ui-kit:table`).
   *
   * An explicitly passed `tableSettings` (or the individual initial props)
   * still wins over the stored value on mount; afterwards every change
   * emits `tableSettingsChange` AND writes to storage. Omit to keep the
   * current fully-manual behaviour.
   */
  storageKey?: string;
  /** Prefix for the composed storage key. Defaults to `ui-kit:table`. */
  storagePrefix?: string;
  /**
   * Storage backend override — anything with `getItem`/`setItem`/
   * `removeItem` (sessionStorage, a test mock, an IndexedDB adapter).
   * Defaults to a best-effort localStorage wrapper that never throws.
   */
  storage?: TableStorageAdapter;
}

const NEUTRAL_HEADER_CLASSES =
  "bg-neutral-50 text-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700";
// Zebra stripe — kept close to the white base so rows read as one surface with
// a faint alternation rather than two distinct bands.
const STRIPED_ROW_BG = "bg-neutral-50 dark:bg-neutral-800/20";

/**
 * Tinted header band per tone. Generated from TRUE_COLORS — every class
 * below is in the safelist (`scripts/generate-safelist.mjs`, Table section)
 * because the scanner cannot see interpolated candidates. The neutral
 * family shares one treatment instead of painting a grey-blue header.
 */
const toneHeaderClasses: Record<TrueColor, string> = {
  ...Object.fromEntries(
    TRUE_COLORS.filter((tone) => !NEUTRAL_TONES.includes(tone)).map(
      (tone) => [
        tone,
        `bg-${tone}-50 text-${tone}-700 dark:bg-${tone}-500/15 dark:text-${tone}-100 border-${tone}-200 dark:border-${tone}-500/30`,
      ],
    ),
  ),
  ...Object.fromEntries(NEUTRAL_TONES.map((tone) => [tone, NEUTRAL_HEADER_CLASSES])),
} as Record<TrueColor, string>;

const getToneHeaderClasses = (tone: TrueColor): string =>
  toneHeaderClasses[tone] ?? NEUTRAL_HEADER_CLASSES;

/** Static `bg-*-500` class for the active-group / sticky indicator dot. */
const dotColorClasses: Record<TrueColor, string> = Object.fromEntries(
  TRUE_COLORS.map((tone) => [tone, `bg-${tone}-500`]),
) as Record<TrueColor, string>;

const getDotColorClass = (color: TrueColor): string =>
  dotColorClasses[color] ?? dotColorClasses.blue;

/**
 * Static `accent-*` classes for native checkbox/radio inputs. The neutral
 * tone sits two shades off the pattern (its `-600` is too dark against the
 * light header band), so it keeps an explicit entry.
 */
const accentClasses: Record<TrueColor, string> = {
  ...Object.fromEntries(
    TRUE_COLORS.map((tone) => [tone, `accent-${tone}-600 dark:accent-${tone}-400`]),
  ),
  neutral: "accent-neutral-700 dark:accent-neutral-300",
} as Record<TrueColor, string>;

const getAccentClass = (color: TrueColor): string =>
  accentClasses[color] ?? accentClasses.blue;

/**
 * Selected-row fill + edge per tone. The neutral tone steps to `-100`
 * (its `-50` is indistinguishable from the page background).
 */
const selectedRowClasses: Record<TrueColor, string> = {
  ...Object.fromEntries(
    TRUE_COLORS.map((tone) => [
      tone,
      `bg-${tone}-50 dark:bg-${tone}-500/10 border-${tone}-200 dark:border-${tone}-800`,
    ]),
  ),
  neutral:
    "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700",
} as Record<TrueColor, string>;

const getSelectedRowClass = (color: TrueColor): string =>
  selectedRowClasses[color] ?? selectedRowClasses.blue;

/**
 * Highlighted-row fill per tone. The neutral tone drops to a 50% `-700` in
 * dark mode (its `-500/20` would be nearly invisible on the dark surface).
 */
const highlightRowClasses: Record<TrueColor, string> = {
  ...Object.fromEntries(
    TRUE_COLORS.map((tone) => [
      tone,
      `bg-${tone}-100 dark:bg-${tone}-500/20`,
    ]),
  ),
  neutral: "bg-neutral-100 dark:bg-neutral-700/50",
} as Record<TrueColor, string>;

const getHighlightRowClass = (color: TrueColor): string =>
  highlightRowClasses[color] ?? highlightRowClasses.blue;

/** Pulsing left-border indicator for highlighted rows. */
const highlightBorderClasses: Record<TrueColor, string> = Object.fromEntries(
  TRUE_COLORS.map((tone) => [tone, `border-l-${tone}-500`]),
) as Record<TrueColor, string>;

const getHighlightBorderClass = (color: TrueColor): string =>
  highlightBorderClasses[color] ?? highlightBorderClasses.blue;

/**
 * Hover fill for the column resize handle track, driven off the header
 * cell's `group/rh`. Generated from TRUE_COLORS (the `group-hover/rh:`
 * candidates are in the safelist — the scanner never sees them otherwise).
 */
const resizeHandleHoverClasses: Record<TrueColor, string> = Object.fromEntries(
  TRUE_COLORS.map((tone) => [
    tone,
    `group-hover/rh:bg-${tone}-500 dark:group-hover/rh:bg-${tone}-400`,
  ]),
) as Record<TrueColor, string>;

const getResizeHandleHoverClass = (color: TrueColor): string =>
  resizeHandleHoverClasses[color] ?? resizeHandleHoverClasses.blue;

/**
 * Full-height guide line shown while a resize handle is hovered/dragged.
 * When the grid is drawn the guide takes the control color (matching the
 * column-selector hover); otherwise it stays a faded neutral hairline.
 */
const resizeGuideColorClasses: Record<TrueColor, string> = Object.fromEntries(
  TRUE_COLORS.map((tone) => [
    tone,
    `bg-${tone}-500 dark:bg-${tone}-400`,
  ]),
) as Record<TrueColor, string>;

const getResizeGuideColorClass = (color: TrueColor): string =>
  resizeGuideColorClasses[color] ?? resizeGuideColorClasses.blue;

// The resize handle is an 8px (`w-2`) hit area whose 1px line is centered, so
// the visible line sits 4px inside the column edge. Center the 2px (`w-0.5`)
// full-height guide there too so it lines up with the handle line — not the
// raw column edge (4px handle inset + 1px half of the guide width).
const RESIZE_GUIDE_EDGE_INSET = 5;

/**
 * Row rules. The container chrome (fill, shadow, ring, glass) now comes from
 * the `Panel` rendered below — only the table's own internal rules live here.
 * Translucent surfaces (glass / liquid-glass / default / simple) use light
 * rules so the backdrop still shows through the row separators.
 */
const SOLID_ROW_RULES = "divide-neutral-200 dark:divide-neutral-700";
const TRANSLUCENT_ROW_RULES = "divide-white/30 dark:divide-white/10";

const alignmentClass: Record<
  NonNullable<TableColumn<unknown>["align"]>,
  string
> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const alignmentFlexClass: Record<
  NonNullable<TableColumn<unknown>["align"]>,
  string
> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const getCellAlignment = (align?: TableColumn<unknown>["align"]) =>
  align ? alignmentClass[align] : "text-left";
const getCellFlexAlignment = (align?: TableColumn<unknown>["align"]) =>
  align ? alignmentFlexClass[align] : "justify-start";

const sortIconMap: Record<"asc" | "desc" | "default", IconName> = {
  asc: "ArrowUp",
  desc: "ArrowDown",
  default: "Dots",
};

function resolveValue<T>(
  row: T,
  column: TableColumn<T>,
  index: number,
): VNodeChild {
  if (column.render) {
    return column.render(row, index);
  }

  if (column.accessor) {
    if (typeof column.accessor === "function") {
      return column.accessor(row, index);
    }

    return (row as Record<string, unknown>)[
      column.accessor as string
    ] as VNodeChild;
  }

  return null;
}

function resolveRowKey<T>(
  row: T,
  index: number,
  rowKey?: (row: T, index: number) => string | number,
): string | number {
  if (rowKey) {
    return rowKey(row, index);
  }

  if (typeof (row as Record<string, unknown>).id !== "undefined") {
    return String((row as Record<string, unknown>).id);
  }

  return index;
}

function applyWidthStyle(
  width?: string | number,
  minWidth?: string | number,
  maxWidth?: string | number,
) {
  if (!width && !minWidth && !maxWidth) {
    return undefined;
  }

  const style: CSSProperties = {};
  if (width !== undefined)
    style.width = typeof width === "number" ? `${width}px` : width;
  if (minWidth !== undefined)
    style.minWidth = typeof minWidth === "number" ? `${minWidth}px` : minWidth;
  if (maxWidth !== undefined) {
    style.maxWidth = typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
    // If maxWidth is set, prevent the column from expanding beyond it
    if (!width) {
      style.width = style.maxWidth;
    }
  }

  return style;
}

/** asc → desc → (clear) → asc. `null` is the "no sort" step. */
function getNextSortDirection(
  current?: SortDirection,
): SortDirection | null {
  if (current === "asc") return "desc";
  if (current === "desc") return null;
  return "asc";
}
</script>

<script setup lang="ts" generic="T">
import {
  computed,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  ref,
  useSlots,
  watch,
} from "vue";
import classNames from "classnames";
import Loader from "./Loader.vue";
import IconButton from "./IconButton.vue";
import Button from "./Button.vue";
import Select from "./Select.vue";
import Badge from "./Badge.vue";
import TruncatedText from "./TruncatedText.vue";
import VNodeRenderer from "./internal/VNodeRenderer";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "Table", inheritAttrs: false });

const props = withDefaults(defineProps<TableProps<T>>(), {
  variant: "outlined",
  density: "default",
  bordered: false,
  tone: "neutral",
  striped: false,
  noBorders: false,
  hoverable: true,
  stickyHeader: false,
  stickyActions: false,
  loading: false,
  loaderType: "spinner",
  manualSorting: false,
  showColumnSelector: false,
  resizableColumns: false,
  headerTitle: "",
  // No default: the controls follow `tone` unless `color` overrides them.
  color: undefined,
  // Tri-state props must opt out of Vue's boolean casting, which turns an
  // ABSENT boolean prop into `false` (not `undefined`) and would make
  // `props.showGroupHeader ?? local` resolve to `false` by default. An
  // explicit `undefined` default keeps absent distinguishable from false.
  showGroupHeader: undefined,
  defaultGroupExpanded: undefined,
  emptyState: undefined,
});

const emit = defineEmits<{
  /** Called when the sort state changes (`null` = sort cleared). */
  (e: "sortChange", sort: TableSortState | null): void;
  /** Called when a row is clicked. */
  (e: "rowClick", row: T, index: number): void;
  /** Called whenever the user switches between table and panel view. */
  (e: "viewChange", view: "table" | "panel"): void;
  /** Called whenever the user changes column visibility. Receives the full current config. */
  (e: "columnVisibilityChange", visibility: Record<string, boolean>): void;
  /** Called when the user finishes resizing a column. Receives the full updated widths map. */
  (e: "columnWidthChange", widths: Record<string, number>): void;
  /** Called when the user changes the group column (null = no grouping). Use for persistence. */
  (e: "groupByChange", columnId: string | null): void;
  /** Called when the user changes column stickiness. Use for persistence. */
  (e: "stickyColumnsChange", config: Record<string, "left" | "right">): void;
  /**
   * Called whenever any user-configurable table setting changes (visibility,
   * widths, view, group-by, sticky columns). Use a single handler to persist
   * the full settings object instead of wiring up all individual callbacks.
   */
  (e: "tableSettingsChange", settings: TableSettings): void;
}>();

defineSlots<{
  /** Overrides the `headerActions` prop. */
  headerActions?: () => VNodeChild;
  /** Overrides the `footer` prop. */
  footer?: () => VNodeChild;
  /** Overrides the `emptyState` prop. */
  emptyState?: () => VNodeChild;
  /** Scoped-slot alternative to the `panelItem` render prop. */
  panelItem?: (slotProps: { row: T; index: number }) => VNodeChild;
}>();

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();

const instance = getCurrentInstance();
// React attaches the row onClick handler only when `onRowClick` is provided; the
// cursor style depends on it. Detect the presence of the `rowClick` listener.
const hasRowClickListener = computed(() => !!instance?.vnode.props?.onRowClick);

const getDefaultColumnVisibility = (column: TableColumn<T>) => {
  if (column.hideable === false) {
    return true;
  }

  return column.defaultHidden !== true;
};

// ── Built-in settings persistence ──────────────────────────────────────────
// The adapter is created once; the composed key is stable for the life of
// the component, so the stored snapshot is read exactly once per mount.
// An explicit `tableSettings` prop (or the individual initial props) always
// outranks the stored value on mount.
const storageAdapter = computed<TableStorageAdapter>(
  () => props.storage ?? createSafeLocalStorage(),
);
const fullStorageKey = computed<string | null>(() =>
  props.storageKey
    ? buildTableStorageKey(
        props.storagePrefix ?? TABLE_STORAGE_DEFAULT_PREFIX,
        props.storageKey,
      )
    : null,
);
const storedSettings = computed<TableSettings | null>(() => {
  if (!fullStorageKey.value) return null;
  return decodeStoredSettings(storageAdapter.value.getItem(fullStorageKey.value));
});
/** Precedence: explicit prop → stored snapshot → individual initial prop. */
const settingsSource = computed<TableSettings | undefined>(
  () => props.tableSettings ?? storedSettings.value ?? undefined,
);

/** Fire the observer event AND persist when storage is enabled. */
const emitSettingsChange = (settings: TableSettings) => {
  emit("tableSettingsChange", settings);
  if (fullStorageKey.value) {
    storageAdapter.value.setItem(
      fullStorageKey.value,
      encodeStoredSettings(settings),
    );
  }
};

// The tone tints the interior controls too, unless the caller overrides
// just those with `color` (e.g. an emerald table with blue actions).
const controlColor = computed(() => props.color ?? props.tone);

const focusRingClass = computed(
  () =>
    `focus-visible:ring-${controlColor.value}-500 dark:focus-visible:ring-${controlColor.value}-400`,
);
const densityTokens = computed(() => getTableDensityTokens(props.density));
const cellPadding = computed(() => densityTokens.value.cell);
const sidePaddingTokens = computed(() => densityTokens.value);

const hasPanelRenderer = computed(() => !!props.panelItem || !!slots.panelItem);
const showViewToggle = computed(
  () => !!props.columns?.length && hasPanelRenderer.value,
);
const initialHasPanel = !!props.panelItem || !!slots.panelItem;
const defaultViewResolved: "table" | "panel" =
  settingsSource.value?.activeView ??
  props.defaultView ??
  (!!props.columns?.length && initialHasPanel
    ? "table"
    : initialHasPanel
      ? "panel"
      : "table");
const activeView = ref<"table" | "panel">(defaultViewResolved);

const internalSort = ref<TableSortState | null>(props.defaultSort ?? null);

// `!== undefined`, not `??`: a controlled `null` (sort cleared by the
// parent) must NOT fall back to the internal state.
const resolvedSort = computed(
  () => (props.sortState !== undefined ? props.sortState : internalSort.value),
);

// ── Column visibility ────────────────────────────────────────────────────────
const colVisibility = ref<Record<string, boolean>>(
  (() => {
    const init: Record<string, boolean> = {};
    const source =
      settingsSource.value?.columnVisibility ?? props.columnVisibility;
    for (const col of props.columns ?? []) {
      init[col.id] = source?.[col.id] ?? getDefaultColumnVisibility(col);
    }
    return init;
  })(),
);

// Sync when the columnVisibility prop changes (e.g. after loading saved config)
watch(
  () => [props.columnVisibility, props.tableSettings?.columnVisibility] as const,
  () => {
    const source = props.tableSettings?.columnVisibility ?? props.columnVisibility;
    if (!source) return;
    const next = { ...colVisibility.value };
    for (const col of props.columns ?? []) {
      next[col.id] =
        source[col.id] ??
        colVisibility.value[col.id] ??
        getDefaultColumnVisibility(col);
    }
    colVisibility.value = next;
  },
);

const colPanelOpen = ref(false);
const colPanelRef = ref<HTMLDivElement | null>(null);

// ── Column resize ─────────────────────────────────────────────────────────────
const internalColWidths = ref<Record<string, number>>(
  (() => {
    const init: Record<string, number> = {};
    const widthSource =
      settingsSource.value?.columnWidths ?? props.columnWidths;
    if (widthSource) {
      Object.assign(init, widthSource);
    } else {
      for (const col of props.columns ?? []) {
        if (typeof col.width === "number") {
          init[col.id] = col.width;
        } else if (
          typeof col.width === "string" &&
          /^\d+(\.\d+)?px$/.test(col.width)
        ) {
          init[col.id] = parseFloat(col.width);
        }
      }
    }
    return init;
  })(),
);

// Sync when columnWidths prop changes (e.g. after loading saved config)
watch(
  () => [props.columnWidths, props.tableSettings?.columnWidths] as const,
  () => {
    const widthSource = props.tableSettings?.columnWidths ?? props.columnWidths;
    if (!widthSource) return;
    internalColWidths.value = { ...internalColWidths.value, ...widthSource };
  },
);

// refs: one per <th> for DOM measurement, plus transient resize state
const thRefs: Record<string, HTMLTableCellElement | null> = {};
const scrollContainerRef = ref<HTMLDivElement | null>(null);
let resizing: { colId: string; startX: number; startWidth: number } | null =
  null;
let widthsDuringResize: Record<string, number> = {};

// Full-height guide line position while a resize handle is hovered/dragged.
// `left` is the column's right edge in scroll-content coordinates.
const resizeGuide = ref<{ colId: string; left: number } | null>(null);

const setThRef = (colId: string, el: unknown) => {
  thRefs[colId] = (el as HTMLTableCellElement | null) ?? null;
};

// Column's right edge in scroll-content coordinates. Uses the visual
// (getBoundingClientRect) position + scrollLeft so a sticky (pinned) column
// lines up with its handle even when the table is horizontally scrolled.
const computeGuideLeft = (colId: string): number | null => {
  const th = thRefs[colId];
  const container = scrollContainerRef.value;
  if (!th || !container) return null;
  const thRect = th.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return (
    Math.round(thRect.right - containerRect.left + container.scrollLeft) -
    RESIZE_GUIDE_EDGE_INSET
  );
};

// Keep the guide glued to a (sticky) column while the user scrolls.
const handleGuideScroll = () => {
  if (!resizeGuide.value) return;
  const left = computeGuideLeft(resizeGuide.value.colId);
  if (left != null) resizeGuide.value = { ...resizeGuide.value, left };
};

const handleResizeStart = (
  e: MouseEvent,
  colId: string,
  minColWidth: number,
) => {
  e.preventDefault();
  e.stopPropagation();

  // On the very first resize, seed ALL visible column widths from the DOM so
  // switching to table-layout:fixed doesn't cause a layout jump.
  const currentWidths = { ...internalColWidths.value };
  if (Object.keys(currentWidths).length === 0) {
    for (const col of visibleColumns.value) {
      const el = thRefs[col.id];
      if (el) currentWidths[col.id] = el.offsetWidth;
    }
    internalColWidths.value = currentWidths;
  }

  const startWidth =
    currentWidths[colId] ?? thRefs[colId]?.offsetWidth ?? 100;
  const startLeft = computeGuideLeft(colId) ?? 0;
  resizing = { colId, startX: e.clientX, startWidth };
  widthsDuringResize = { ...currentWidths };
  resizeGuide.value = { colId, left: startLeft };

  const onMouseMove = (moveEvt: MouseEvent) => {
    if (!resizing) return;
    const newWidth = Math.max(
      minColWidth,
      resizing.startWidth + (moveEvt.clientX - resizing.startX),
    );
    widthsDuringResize = {
      ...widthsDuringResize,
      [resizing.colId]: newWidth,
    };
    internalColWidths.value = { ...widthsDuringResize };
    // The column's right edge moves by the width delta, so the guide does too.
    const delta = newWidth - resizing.startWidth;
    resizeGuide.value = { colId, left: startLeft + delta };
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    emit("columnWidthChange", widthsDuringResize);
    emitSettingsChange({
      ...settingsSnapshot.value,
      columnWidths: widthsDuringResize,
    });
    resizing = null;
    resizeGuide.value = null;
  };

  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

const onResizeHandleMouseDown = (e: MouseEvent, column: TableColumn<T>) => {
  const minW =
    column.minWidth !== undefined
      ? typeof column.minWidth === "number"
        ? column.minWidth
        : parseInt(column.minWidth, 10)
      : 48;
  handleResizeStart(e, column.id, Math.max(48, isNaN(minW) ? 48 : minW));
};

const onResizeHandleEnter = (column: TableColumn<T>) => {
  const left = computeGuideLeft(column.id);
  if (left != null) resizeGuide.value = { colId: column.id, left };
};

const onResizeHandleLeave = () => {
  if (!resizing) resizeGuide.value = null;
};

// When resizable and any width is stored, switch the table to fixed layout
// so column widths are honoured precisely.
const useFixedLayout = computed(
  () => props.resizableColumns && Object.keys(internalColWidths.value).length > 0,
);

// ── User sticky columns state ────────────────────────────────────────────────
const internalStickyColumns = ref<Record<string, "left" | "right">>(
  settingsSource.value?.stickyColumns ?? props.defaultStickyColumns ?? {},
);
const stickyPanelOpen = ref(false);
const stickyPanelRef = ref<HTMLDivElement | null>(null);

const handleStickyChange = (colId: string, pin: "left" | "right" | null) => {
  const next = { ...internalStickyColumns.value };
  if (pin === null) delete next[colId];
  else next[colId] = pin;
  internalStickyColumns.value = next;
  emit("stickyColumnsChange", next);
  emitSettingsChange({
    ...settingsSnapshot.value,
    stickyColumns: next,
  });
};

const handleStickyClearAll = () => {
  internalStickyColumns.value = {};
  emit("stickyColumnsChange", {});
};

const hasStickyColumns = computed(
  () => Object.keys(internalStickyColumns.value).length > 0,
);

// ── Grouping state ───────────────────────────────────────────────────────────
const internalGroupBy = ref<string | null>(
  settingsSource.value?.groupBy ?? props.defaultGroupBy ?? null,
);
const expandedGroups = ref<Record<string, boolean>>({});
const groupPanelOpen = ref(false);
const showGroupHeaderLocal = ref(
  settingsSource.value?.showGroupHeader ?? props.showGroupHeader ?? true,
);
const groupPanelRef = ref<HTMLDivElement | null>(null);

const resolvedGroupBy = computed(() => props.groupBy ?? internalGroupBy.value);
const resolvedShowGroupHeader = computed(
  () => props.showGroupHeader ?? showGroupHeaderLocal.value,
);

// ── Unified settings snapshot ────────────────────────────────────────────────
const settingsSnapshot = computed<TableSettings>(() => ({
  columnVisibility: colVisibility.value,
  columnWidths: internalColWidths.value,
  activeView: activeView.value,
  groupBy: internalGroupBy.value,
  showGroupHeader: showGroupHeaderLocal.value,
  stickyColumns: internalStickyColumns.value,
}));

// ── Selection Lookup ─────────────────────────────────────────────────────────
const selectionLookup = computed(() => {
  if (!props.selectedItems || props.selectedItems.length === 0) return null;

  const lookup = new Set<unknown>();
  props.selectedItems.forEach((item) => {
    // Support reference equality
    lookup.add(item);

    // Support ID equality
    if (props.rowKey) {
      // We pass -1 as index since we don't have it for selected items,
      // expecting rowKey to rely on intrinsic properties.
      lookup.add(props.rowKey(item, -1));
    } else if (typeof (item as Record<string, unknown>).id !== "undefined") {
      const idVal = (item as Record<string, unknown>).id;
      lookup.add(String(idVal));
    }
  });
  return lookup;
});

// ── Outside-click handlers ───────────────────────────────────────────────────
const onDocumentMouseDown = (e: MouseEvent) => {
  const target = e.target as Node;
  if (
    colPanelOpen.value &&
    colPanelRef.value &&
    !colPanelRef.value.contains(target)
  ) {
    colPanelOpen.value = false;
  }
  if (
    groupPanelOpen.value &&
    groupPanelRef.value &&
    !groupPanelRef.value.contains(target)
  ) {
    groupPanelOpen.value = false;
  }
  if (
    stickyPanelOpen.value &&
    stickyPanelRef.value &&
    !stickyPanelRef.value.contains(target)
  ) {
    stickyPanelOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("mousedown", onDocumentMouseDown);
});

// Clean up listeners and any lingering body styles if the component unmounts mid-drag
onUnmounted(() => {
  document.removeEventListener("mousedown", onDocumentMouseDown);
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
});

// ── Sort handler ─────────────────────────────────────────────────────────────
const handleSortToggle = (column: TableColumn<T>) => {
  if (!column.sortable) {
    return;
  }

  const nextDirection = getNextSortDirection(
    resolvedSort.value?.columnId === column.id
      ? resolvedSort.value.direction
      : undefined,
  );

  const nextSort = nextDirection
    ? { columnId: column.id, direction: nextDirection }
    : null;

  if (props.sortState === undefined) {
    internalSort.value = nextSort;
  }

  emit("sortChange", nextSort);
};

// ── Group handler ────────────────────────────────────────────────────────────
const handleGroupChange = (columnId: string | null) => {
  internalGroupBy.value = columnId;
  expandedGroups.value = {}; // reset expansion state when group changes
  emit("groupByChange", columnId);
  emitSettingsChange({
    ...settingsSnapshot.value,
    groupBy: columnId,
  });
};

// ── Sorted data ──────────────────────────────────────────────────────────────
const sortedData = computed(() => {
  if (props.manualSorting) {
    return props.data;
  }

  const sort = resolvedSort.value;
  if (!sort) {
    return props.data;
  }

  const column = props.columns?.find((col) => col.id === sort.columnId);

  if (!column || (!column.accessor && !column.render && !column.sortValue)) {
    return props.data;
  }

  // sortValue takes priority; fall back to the raw accessor value, then render.
  // Accessor is preferred over render because render typically returns VNodes which
  // cannot be meaningfully compared as a string.
  const getValue = column.sortValue
    ? (row: T) => column.sortValue!(row)
    : column.accessor
      ? (row: T, index: number) => {
          if (typeof column.accessor === "function")
            return column.accessor(row, index);
          return (row as Record<string, unknown>)[column.accessor as string];
        }
      : (row: T, index: number) =>
          column.render ? column.render(row, index) : null;

  const safeString = (val: unknown): string => {
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
    if (typeof val === "boolean") return String(val);
    return "";
  };

  // Precompute the comparable value per row ONCE. Computing it inside the
  // comparator (via data.indexOf(row)) made every comparison an O(n)
  // lookup — O(n²) log n overall on large tables.
  const indexed = props.data.map((row, index) => ({
    row,
    key:
      typeof getValue(row, index) === "number"
        ? (getValue(row, index) as number)
        : safeString(getValue(row, index)).toLowerCase(),
  }));

  const sorted = indexed.sort((a, b) => {
    if (a.key === b.key) {
      return 0;
    }

    // Type-safe stand-in for `a.key < b.key` (TS rejects `<` on
    // number | string). Numbers compare numerically; anything else —
    // including the mixed case — falls back to string order, which is
    // exactly what the JS relational operator did via coercion.
    let cmp: number;
    if (typeof a.key === "number" && typeof b.key === "number") {
      cmp = a.key - b.key;
    } else {
      const sa = String(a.key);
      const sb = String(b.key);
      cmp = sa < sb ? -1 : sa > sb ? 1 : 0;
    }

    return sort.direction === "asc" ? cmp : -cmp;
  });

  return sorted.map(({ row }) => row);
});

// ── Column helpers ───────────────────────────────────────────────────────────
const effectiveColumns = computed(() => props.columns ?? []);
const menuColumns = computed(() =>
  effectiveColumns.value.filter((col) => !col.isActionsColumn),
);

// User-configurable grouping is only shown when groupable=true and no code-defined groupBy
const isUserGroupable = computed(
  () =>
    props.groupable === true &&
    !props.groupBy &&
    menuColumns.value.some((col) => col.groupable !== false),
);

// The grouped column is always hidden from the rendered table
const visibleColumns = computed(() =>
  effectiveColumns.value.filter(
    (col) =>
      colVisibility.value[col.id] !== false && col.id !== resolvedGroupBy.value,
  ),
);
const hasHideableColumns = computed(() =>
  menuColumns.value.some((col) => col.hideable !== false),
);

// ── Ordered visible columns ──────────────────────────────────────────────────
// When columns are pinned (user-configured or code-defined), they are moved to
// the appropriate edge while preserving relative order within each group:
//   [ left-pinned | normal | right-pinned ]
// The stickyActions column (original last col) is always last within the right group.
const orderedVisibleColumns = computed((): TableColumn<T>[] => {
  const left: TableColumn<T>[] = [];
  const middle: TableColumn<T>[] = [];
  const right: TableColumn<T>[] = [];
  visibleColumns.value.forEach((col, i) => {
    const effective = internalStickyColumns.value[col.id] ?? col.sticky;
    if (effective === "left") {
      left.push(col);
    } else if (
      effective === "right" ||
      (props.stickyActions && i === visibleColumns.value.length - 1)
    ) {
      right.push(col);
    } else {
      middle.push(col);
    }
  });
  return [...left, ...middle, ...right];
});

// ── Grouped data ─────────────────────────────────────────────────────────────
const groupedData = computed((): GroupEntry<T>[] | null => {
  if (!resolvedGroupBy.value) return null;
  const column = effectiveColumns.value.find(
    (c) => c.id === resolvedGroupBy.value,
  );
  if (!column) return null;

  const groups: GroupEntry<T>[] = [];
  const groupMap = new Map<string, number>();

  sortedData.value.forEach((row, idx) => {
    // Resolution priority: groupValue → accessor primitive → sortValue → render primitive → ""
    let display = "";
    if (column.groupValue) {
      display = column.groupValue(row);
    } else if (column.accessor) {
      const accVal =
        typeof column.accessor === "function"
          ? column.accessor(row, idx)
          : (row as Record<string, unknown>)[column.accessor as string];
      if (typeof accVal === "string") display = accVal;
      else if (typeof accVal === "number") display = String(accVal);
    } else if (column.sortValue) {
      const sv = column.sortValue(row);
      display = String(sv);
    } else {
      const rendered = resolveValue(row, column, idx);
      if (typeof rendered === "string") display = rendered;
      else if (typeof rendered === "number") display = String(rendered);
      // VNodes → display stays "" (avoids [object Object])
    }
    const key = display.toLowerCase(); // case-insensitive grouping

    if (!groupMap.has(key)) {
      groupMap.set(key, groups.length);
      groups.push({ key, display, rows: [] });
    }
    groups[groupMap.get(key)!].rows.push({ row, originalIndex: idx });
  });

  return groups;
});

// Auto-initialize expansion state for newly seen groups
watch(
  [groupedData, () => props.defaultGroupExpanded],
  () => {
    if (!groupedData.value) return;
    const next = { ...expandedGroups.value };
    let changed = false;
    for (const g of groupedData.value) {
      if (!(g.key in next)) {
        next[g.key] = props.defaultGroupExpanded !== false; // default: expanded
        changed = true;
      }
    }
    if (changed) expandedGroups.value = next;
  },
  { immediate: true },
);

const toggleGroup = (key: string) => {
  expandedGroups.value = {
    ...expandedGroups.value,
    [key]: !expandedGroups.value[key],
  };
};

// When panelDeduplicateBy is set, only the first row for each key is shown in panel view
const panelRows = computed(() => {
  if (!props.panelDeduplicateBy) return sortedData.value;
  const seen = new Set<string | number>();
  return sortedData.value.filter((row) => {
    const key = props.panelDeduplicateBy!(row);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
});

// When grouping is active AND showing group headers, we render an extra
// leading column for the expand/collapse chevron.
const showGroupExpandCol = computed(
  () => !!(resolvedGroupBy.value && resolvedShowGroupHeader.value),
);

// ── Effective per-column stickiness (column-defined + user-configured) ───────
// User config takes precedence over the column-defined sticky value, so users
// can override or clear a code-defined pin at runtime.
const getEffectiveSticky = (
  col: TableColumn<T>,
): "left" | "right" | undefined =>
  internalStickyColumns.value[col.id] ?? col.sticky ?? undefined;

// True when at least one visible column is pinned to the left (code-defined or user-configured).
// Used to decide whether the grouped-row spacer td needs an opaque background.
const hasLeftStickyColumn = computed(() =>
  orderedVisibleColumns.value.some((col) => getEffectiveSticky(col) === "left"),
);

// ── Sticky-right column offsets ──────────────────────────────────────────────
// When multiple columns are pinned to the right (via sticky:'right',
// stickyActions, or user config), each one needs a `right` offset equal to
// the total width of all right-sticky columns further to the right. We
// calculate this from internalColWidths → column.width → column.minWidth.
const rightStickyOffsets = computed((): Record<string, number | undefined> => {
  const offsets: Record<string, number | undefined> = {};
  let cumulative = 0;
  for (let i = orderedVisibleColumns.value.length - 1; i >= 0; i--) {
    const col = orderedVisibleColumns.value[i];
    const effective = internalStickyColumns.value[col.id] ?? col.sticky;
    const isSticky =
      effective === "right" ||
      (props.stickyActions && i === orderedVisibleColumns.value.length - 1);
    if (!isSticky) continue;
    offsets[col.id] = cumulative;
    const w =
      internalColWidths.value[col.id] ??
      (typeof col.width === "number" ? col.width : undefined) ??
      (typeof col.minWidth === "number" ? col.minWidth : undefined);
    if (w !== undefined) cumulative += w;
  }
  return offsets;
});

// ── Visual class helpers ─────────────────────────────────────────────────────
// Container chrome (fill, shadow, ring, glass) now lives on the `Panel`
// rendered below. Everything here is the table's OWN interior rule; on
// translucent surfaces (glass / liquid-glass / default / simple) fills and
// separators stay light so the backdrop still shows through.
const surfaceText = computed(() => getSurfaceTextTokens(props.variant));
const gridLinesOn = computed(() => props.bordered && !props.noBorders);

const wrapperClasses = computed(() =>
  classNames(props.fullHeight && "h-full", classAttr.value),
);
const tableClasses = computed(() =>
  classNames(
    "min-w-full divide-y",
    surfaceText.value.translucent ? TRANSLUCENT_ROW_RULES : SOLID_ROW_RULES,
    gridLinesOn.value &&
      "border border-neutral-200 dark:border-neutral-700",
    props.tableClassName,
  ),
);
const gridLineClass =
  "border-neutral-200 dark:border-neutral-700";

// On a see-through surface the header band must stay see-through too — an
// opaque band reads as a hole punched in the glass. The light-mode tint is a
// translucent half of the solid tone fill (`-50/50`); dark mode reuses the
// already-translucent `-500/15` tint. Neutral steps down to white/20 (its
// `-50` is a paper-white that would still mask the backdrop).
const headerToneClasses = computed(() =>
  surfaceText.value.translucent
    ? NEUTRAL_TONES.includes(props.tone)
      ? "bg-white/20 text-neutral-700 border-neutral-200/60 dark:bg-white/5 dark:text-neutral-100 dark:border-white/10"
      : `bg-${props.tone}-50/50 text-${props.tone}-700 border-${props.tone}-200/60 dark:bg-${props.tone}-500/15 dark:text-${props.tone}-100 dark:border-${props.tone}-500/30`
    : getToneHeaderClasses(props.tone),
);
const headerBaseClasses =
  "text-xs font-semibold uppercase tracking-wide text-left";

const tbodyClasses = computed(() =>
  classNames(
    "divide-y",
    surfaceText.value.translucent ? TRANSLUCENT_ROW_RULES : SOLID_ROW_RULES,
    (props.striped || props.noBorders) && "divide-y-0",
    props.bodyClassName,
  ),
);

const scrollContainerStyle = computed<CSSProperties | undefined>(() =>
  props.maxHeight
    ? {
        maxHeight:
          typeof props.maxHeight === "number"
            ? `${props.maxHeight}px`
            : props.maxHeight,
      }
    : undefined,
);

const hasRows = computed(() => sortedData.value.length > 0);

// ── Empty state ──────────────────────────────────────────────────────────────
const emptyColSpan = computed(
  () =>
    (showGroupExpandCol.value
      ? visibleColumns.value.length + 1
      : visibleColumns.value.length) || 1,
);

// ── Header bar ───────────────────────────────────────────────────────────────
const hasHeaderActions = computed(
  () => !!slots.headerActions || props.headerActions != null,
);
const hasHeaderBar = computed(
  () =>
    hasHeaderActions.value ||
    showViewToggle.value ||
    (props.showColumnSelector && hasHideableColumns.value) ||
    isUserGroupable.value ||
    !!props.userStickyColumns,
);

const handleViewChange = (view: "table" | "panel") => {
  activeView.value = view;
  emit("viewChange", view);
  emitSettingsChange({
    ...settingsSnapshot.value,
    activeView: view,
  });
};

const handleVisibilityToggle = (col: TableColumn<T>) => {
  const visible = colVisibility.value[col.id] !== false;
  const next = { ...colVisibility.value, [col.id]: !visible };
  colVisibility.value = next;
  emit("columnVisibilityChange", next);
  emitSettingsChange({
    ...settingsSnapshot.value,
    columnVisibility: next,
  });
};

const handleVisibilityReset = () => {
  const reset: Record<string, boolean> = {};
  for (const col of effectiveColumns.value) {
    reset[col.id] = getDefaultColumnVisibility(col);
  }
  colVisibility.value = reset;
  emit("columnVisibilityChange", reset);
  emitSettingsChange({
    ...settingsSnapshot.value,
    columnVisibility: reset,
  });
};

const handleShowGroupHeaderToggle = () => {
  const next = !showGroupHeaderLocal.value;
  showGroupHeaderLocal.value = next;
  emitSettingsChange({
    ...settingsSnapshot.value,
    showGroupHeader: next,
  });
};

// ── Group label for the config panel ─────────────────────────────────────────
const getColumnLabel = (col: TableColumn<T>) =>
  typeof col.header === "string" ? col.header : col.id;

const checkboxAccentClass = computed(() =>
  classNames("h-3.5 w-3.5 rounded border-neutral-300", getAccentClass(controlColor.value)),
);
const radioAccentClass = computed(() =>
  classNames("h-3.5 w-3.5 border-neutral-300", getAccentClass(controlColor.value)),
);
const activeDotClass = computed(() =>
  classNames(
    "pointer-events-none absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2 ring-white dark:ring-neutral-900",
    getDotColorClass(controlColor.value),
  ),
);
const stickySides = ["left", null, "right"] as const;

// ── Layout wrappers ──────────────────────────────────────────────────────────
const innerWrapperClass = computed(() =>
  classNames(
    "relative flex flex-col",
    props.fullHeight && "flex-1 min-h-0 overflow-hidden",
  ),
);
const tableViewOuterClass = computed(() =>
  classNames("relative", props.fullHeight && "flex-1 min-h-0"),
);
const scrollContainerClass = computed(() =>
  classNames(
    "overflow-x-auto relative",
    props.fullHeight ? "h-full overflow-y-auto" : "",
    !props.fullHeight && props.maxHeight && "overflow-y-auto",
  ),
);
const panelOuterClass = computed(() =>
  classNames(
    "relative",
    props.fullHeight ? "flex-1 min-h-0 overflow-auto" : undefined,
  ),
);

// ── Header cells ─────────────────────────────────────────────────────────────
const theadRowClass = computed(() =>
  classNames(headerToneClasses.value, "border-b dark:border-opacity-60"),
);
const expandThClass = computed(() =>
  classNames(
    headerToneClasses.value,
    "sticky left-0",
    props.stickyHeader && "top-0",
    props.stickyHeader ? "z-30" : "z-10",
    "w-10 pl-3 pr-1",
  ),
);
const resizeHandleTrackClass = computed(() =>
  classNames(
    "h-1/2 w-px bg-neutral-300 dark:bg-neutral-600 transition-colors",
    getResizeHandleHoverClass(controlColor.value),
  ),
);

interface HeaderCellEntry {
  id: string;
  column: TableColumn<T>;
  isSorted: boolean;
  thClass: string;
  thStyle: CSSProperties;
  ariaSort: "ascending" | "descending" | "none" | "other";
  flexClass: string;
  sortIcon: IconName;
  sortTooltip: string;
  sortBtnClass: string;
  isResizable: boolean;
}

const headerCells = computed((): HeaderCellEntry[] =>
  orderedVisibleColumns.value.map((column, colIndex) => {
    const isSorted = resolvedSort.value?.columnId === column.id;
    const sortDirection = isSorted ? resolvedSort.value?.direction : undefined;

    const isResizable = props.resizableColumns && column.resizable !== false;
    const resizeWidth = internalColWidths.value[column.id];
    const thEffectiveSticky = getEffectiveSticky(column);
    const isStickyLeft = thEffectiveSticky === "left";
    const isStickyRight =
      thEffectiveSticky === "right" ||
      (props.stickyActions &&
        colIndex === orderedVisibleColumns.value.length - 1);
    const rightOffset = isStickyRight
      ? rightStickyOffsets.value[column.id]
      : undefined;

    const thClass = classNames(
      headerBaseClasses,
      headerToneClasses.value,
      cellPadding.value,
      props.stickyHeader && "sticky top-0",
      (isStickyLeft || isStickyRight) && "sticky",
      isStickyLeft && (showGroupExpandCol.value ? "left-10" : "left-0"),
      // right position is set via inline style when offset > 0
      isStickyRight && !rightOffset && "right-0",
      props.stickyHeader && (isStickyLeft || isStickyRight)
        ? "z-30"
        : props.stickyHeader
          ? "z-20"
          : isStickyLeft || isStickyRight
            ? "z-10"
            : "",
      getCellAlignment(column.align),
      "overflow-hidden",
      isResizable && "relative",
      isStickyRight &&
        thEffectiveSticky === "right" &&
        !props.noBorders &&
        "border-l border-neutral-200 dark:border-neutral-700",
      // The resize handle already marks each column edge, so the grid rule is
      // skipped while resizing.
      gridLinesOn.value &&
        !isResizable &&
        colIndex < orderedVisibleColumns.value.length - 1 &&
        `${gridLineClass} border-r`,
      column.headerClassName,
    );

    const thStyle: CSSProperties = {
      ...(resizeWidth
        ? {
            width: `${resizeWidth}px`,
            minWidth: `${resizeWidth}px`,
            maxWidth: `${resizeWidth}px`,
          }
        : (applyWidthStyle(column.width, column.minWidth, column.maxWidth) ??
          {})),
      ...(isStickyRight && rightOffset !== undefined
        ? { right: `${rightOffset}px` }
        : {}),
    };

    return {
      id: column.id,
      column,
      isSorted,
      thClass,
      thStyle,
      ariaSort: sortDirection
        ? sortDirection === "asc"
          ? "ascending"
          : "descending"
        : column.sortable
          ? // "other" = sortable but not currently sorted ("none" would
            // falsely claim the column can't be sorted at all).
            "other"
          : "none",
      flexClass: classNames(
        "flex items-center gap-1 min-w-0",
        column.align === "right"
          ? "justify-end"
          : column.align === "center"
            ? "justify-center"
            : "justify-start",
      ),
      sortIcon: sortDirection ? sortIconMap[sortDirection] : sortIconMap.default,
      sortTooltip:
        sortDirection === "asc"
          ? "Sort descending"
          : sortDirection === "desc"
            ? "Clear sort"
            : "Sort ascending",
      sortBtnClass: classNames(
        "ml-1 flex-shrink-0",
        !isSorted &&
          "text-neutral-400 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200",
      ),
      isResizable,
    };
  }),
);

// Colgroup drives precise column widths in fixed layout
const colgroupCols = computed(
  (): { id: string; style: CSSProperties | undefined }[] =>
    orderedVisibleColumns.value.map((col) => {
      const resizedW = internalColWidths.value[col.id];
      if (resizedW)
        return {
          id: col.id,
          style: { width: `${resizedW}px`, minWidth: `${resizedW}px` },
        };
      // For non-resized columns, honour width/minWidth so fixed layout can't squeeze them below their declared minimum
      const declaredW = col.width !== undefined ? col.width : undefined;
      const declaredMin = col.minWidth !== undefined ? col.minWidth : undefined;
      const colW = declaredW ?? declaredMin;
      return {
        id: col.id,
        style:
          colW !== undefined
            ? {
                width: typeof colW === "number" ? `${colW}px` : colW,
                minWidth: typeof colW === "number" ? `${colW}px` : colW,
              }
            : undefined,
      };
    }),
);

// ── Row renderer (shared between grouped and flat modes) ─────────────────────
interface CellEntry {
  id: string;
  tdClass: string;
  tdStyle: CSSProperties;
  innerClass: string;
  isText: boolean;
  value: VNodeChild;
}

interface RowEntry {
  kind: "row";
  key: string | number;
  row: T;
  originalIndex: number;
  rowClasses: string;
  spacerClass: string;
  cells: CellEntry[];
}

interface GroupHeaderEntry {
  kind: "group";
  key: string;
  display: string;
  count: number;
  isExpanded: boolean;
}

const buildRowEntry = (
  row: T,
  originalIndex: number,
  isGroupedSubRow = false,
): RowEntry => {
  const key = resolveRowKey(row, originalIndex, props.rowKey);

  // Check reference or ID match
  const isSelected = !!(
    selectionLookup.value?.has(row) || selectionLookup.value?.has(key)
  );
  const isHighlighted =
    !isSelected && (props.rowHighlight?.(row, originalIndex) ?? false);

  const selectedClass = isSelected ? getSelectedRowClass(controlColor.value) : "";
  const highlightRowClass = isHighlighted
    ? getHighlightRowClass(controlColor.value)
    : "";
  const baseRowBgClass =
    props.striped && originalIndex % 2 === 1
      ? STRIPED_ROW_BG
      : "bg-white dark:bg-neutral-900";
  // Use fully-opaque hover for all cells so the whole row shifts uniformly.
  // Sticky cells need !important to override their explicit base background class.
  const rowCellHoverClass =
    !isSelected && !isHighlighted && props.hoverable
      ? props.striped && originalIndex % 2 === 1
        ? "group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700"
        : "group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700"
      : undefined;
  const stickyCellHoverClass =
    !isSelected && !isHighlighted && props.hoverable
      ? props.striped && originalIndex % 2 === 1
        ? "group-hover:!bg-neutral-200 dark:group-hover:!bg-neutral-700"
        : "group-hover:!bg-neutral-200 dark:group-hover:!bg-neutral-700"
      : undefined;
  const rowClasses = classNames(
    cellPadding.value,
    "group",
    isSelected
      ? selectedClass
      : isHighlighted
        ? highlightRowClass
        : props.striped && originalIndex % 2 === 1 && STRIPED_ROW_BG,
    isHighlighted && props.hoverable && "hover:brightness-95",
    "transition-colors duration-150 ease-out",
    hasRowClickListener.value ? "cursor-pointer" : "cursor-default",
    props.rowClassName ? props.rowClassName(row, originalIndex) : undefined,
  );

  // Expand spacer column — only in grouped mode with visible group headers
  const spacerClass = classNames(
    "w-10 sticky left-0 z-20",
    // Only apply an opaque background when there is a left-sticky data column;
    // otherwise the spacer can remain transparent.
    hasLeftStickyColumn.value &&
      (isSelected
        ? getSelectedRowClass(controlColor.value)
        : isHighlighted
          ? getHighlightRowClass(controlColor.value)
          : baseRowBgClass),
    // When there are sticky columns use the opaque hover; otherwise use the normal semi-transparent hover.
    hasLeftStickyColumn.value ? stickyCellHoverClass : rowCellHoverClass,
  );

  const cells: CellEntry[] = orderedVisibleColumns.value.map(
    (column, colIndex) => {
      const cellValue = resolveValue(row, column, originalIndex);
      // Text cells (string/number) get TruncatedText with a tooltip on actual overflow.
      // VNode cells fall back to the old maxWidth-based truncate class.
      const isTextCell =
        typeof cellValue === "string" || typeof cellValue === "number";

      const tdResizeWidth = internalColWidths.value[column.id];
      const effectiveSticky = getEffectiveSticky(column);
      const isStickyLeft = effectiveSticky === "left";
      const isStickyRight =
        effectiveSticky === "right" ||
        (props.stickyActions &&
          colIndex === orderedVisibleColumns.value.length - 1);
      const rightOffset = isStickyRight
        ? rightStickyOffsets.value[column.id]
        : undefined;

      const tdClass = classNames(
        "whitespace-nowrap align-middle text-sm text-neutral-700 dark:text-neutral-200",
        (isStickyLeft || isStickyRight) && "sticky",
        isStickyLeft && (showGroupExpandCol.value ? "left-10" : "left-0"),
        // right position is set via inline style when offset > 0
        isStickyRight && !rightOffset && "right-0",
        (isStickyLeft || isStickyRight) && "z-10",
        (isStickyLeft || isStickyRight) &&
          (isSelected
            ? getSelectedRowClass(controlColor.value)
            : isHighlighted
              ? getHighlightRowClass(controlColor.value)
              : props.striped && originalIndex % 2 === 1
                ? STRIPED_ROW_BG
                : (column.stickyBackgroundFn?.(row, originalIndex) ??
                  column.stickyBackground ??
                  "bg-white dark:bg-neutral-900")),
        // Sticky cells must keep an opaque background on hover to avoid scrolled content
        // bleeding through — use the fully-opaque sticky hover class instead of the semi-transparent hover.
        isStickyLeft || isStickyRight
          ? stickyCellHoverClass
          : rowCellHoverClass,
        (isStickyLeft || isStickyRight) &&
          isHighlighted &&
          props.hoverable &&
          "group-hover:brightness-95",
        getCellAlignment(column.align),
        // Horizontal padding. Every cell keeps a symmetric gap so adjacent
        // columns never sit flush (bordered or not) and the body text lines up
        // under the header, which uses the same density cell padding.
        `${sidePaddingTokens.value.sideLeft} ${sidePaddingTokens.value.sideRight}`,
        // Vertical rule on the leading edge of the next column.
        gridLinesOn.value &&
          colIndex < orderedVisibleColumns.value.length - 1 &&
          `${gridLineClass} border-r`,
        // Pulsing left border indicator on the first visible cell for highlighted rows
        colIndex === 0 &&
          isHighlighted &&
          classNames("border-l-4 animate-pulse", getHighlightBorderClass(controlColor.value)),
        isStickyRight &&
          effectiveSticky === "right" &&
          !props.noBorders &&
          "border-l border-neutral-300 dark:border-neutral-700",
        column.className,
      );

      const tdStyle: CSSProperties = {
        ...(tdResizeWidth
          ? {
              width: `${tdResizeWidth}px`,
              minWidth: `${tdResizeWidth}px`,
              maxWidth: `${tdResizeWidth}px`,
            }
          : (applyWidthStyle(column.width, column.minWidth, column.maxWidth) ??
            {})),
        ...(isStickyRight && rightOffset !== undefined
          ? { right: `${rightOffset}px` }
          : {}),
      };

      const innerClass = classNames(
        "flex items-center min-w-0",
        "py-1",
        sidePaddingTokens.value.contentVertical,
        getCellFlexAlignment(column.align),
        // For VNode cells with a declared maxWidth, still clip via truncate
        !isTextCell && column.maxWidth && "truncate",
        // Add extra left indent to the first data column in grouped sub-rows
        isGroupedSubRow && colIndex === 0 && "pl-2",
      );

      return {
        id: column.id,
        tdClass,
        tdStyle,
        innerClass,
        isText: isTextCell,
        value: cellValue,
      };
    },
  );

  return {
    kind: "row",
    key,
    row,
    originalIndex,
    rowClasses,
    spacerClass,
    cells,
  };
};

const bodyEntries = computed((): (RowEntry | GroupHeaderEntry)[] => {
  const entries: (RowEntry | GroupHeaderEntry)[] = [];
  if (groupedData.value) {
    for (const group of groupedData.value) {
      const isExpanded = expandedGroups.value[group.key] !== false;
      if (resolvedShowGroupHeader.value) {
        entries.push({
          kind: "group",
          key: group.key,
          display: group.display,
          count: group.rows.length,
          isExpanded,
        });
      }
      // Sub-rows — hidden when collapsed
      if (isExpanded || !resolvedShowGroupHeader.value) {
        for (const { row, originalIndex } of group.rows) {
          entries.push(buildRowEntry(row, originalIndex, true));
        }
      }
    }
  } else {
    sortedData.value.forEach((row, rowIndex) => {
      entries.push(buildRowEntry(row, rowIndex, false));
    });
  }
  return entries;
});

const groupHeaderInnerClass = computed(() =>
  classNames(
    "sticky left-0 flex w-fit items-center gap-2 bg-inherit rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
    focusRingClass.value,
    sidePaddingTokens.value.sideLeft,
  ),
);

// Keyboard toggle for group headers (the row click covers the mouse).
const onGroupHeaderKeydown = (key: string, e: KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleGroup(key);
  }
};

const onRowClick = (entry: RowEntry) => {
  emit("rowClick", entry.row, entry.originalIndex);
};

// ── Panel view ───────────────────────────────────────────────────────────────
const panelGridClass = computed(() =>
  classNames(
    "p-4",
    props.panelMinItemWidth != null
      ? // auto-fill mode: grid base + any extra non-layout classes from consumer
        // gap is intentionally excluded here — it lives in the inline style below
        classNames("grid", props.panelGridClassName)
      : // legacy / explicit class mode (gap lives in the class string as before)
        (props.panelGridClassName ??
          "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"),
  ),
);

const panelGridStyle = computed<CSSProperties | undefined>(() => {
  if (props.panelMinItemWidth == null) return undefined;
  const minW =
    typeof props.panelMinItemWidth === "number"
      ? `${props.panelMinItemWidth}px`
      : props.panelMinItemWidth;
  const maxW =
    props.panelMaxItemWidth != null
      ? `min(${typeof props.panelMaxItemWidth === "number" ? `${props.panelMaxItemWidth}px` : props.panelMaxItemWidth}, 1fr)`
      : "1fr";
  return {
    gridTemplateColumns: `repeat(auto-fill, minmax(min(${minW}, 100%), ${maxW}))`,
    gap:
      props.panelGap != null
        ? typeof props.panelGap === "number"
          ? `${props.panelGap}px`
          : props.panelGap
        : "1rem",
  };
});

const panelRowKey = (row: T, index: number) =>
  resolveRowKey(row, index, props.rowKey);

// ── Footer / pagination ──────────────────────────────────────────────────────
const hasFooterBar = computed(
  () =>
    !!slots.footer ||
    !!props.footer ||
    !!(props.pagination && props.pagination.total > 0),
);

// Presets plus the active page size, so a non-preset size still renders
// a matching option instead of a blank select.
const pageSizeOptions = computed<number[]>(() => {
  const active = props.pagination?.pageSize;
  const set = new Set<number>([20, 50, 100, ...(active ? [active] : [])]);
  return Array.from(set).sort((a, b) => a - b);
});
const handlePageSizeChange = (value: unknown) => {
  props.pagination?.onPageSizeChange(Number(value));
};
const handlePrevPage = () => {
  const p = props.pagination;
  if (!p) return;
  p.onPageChange(Math.max(1, p.page - 1));
};
const handleNextPage = () => {
  const p = props.pagination;
  if (!p) return;
  p.onPageChange(Math.min(Math.ceil(p.total / p.pageSize), p.page + 1));
};
</script>

<template>
  <Panel
    :variant="variant"
    :tone="tone"
    padding="none"
    :corner="corner"
    :scrollable="false"
    :flex-body="fullHeight"
    :class="wrapperClasses"
    v-bind="restAttrs"
  >
    <div :class="innerWrapperClass">
      <!-- ── Header bar ────────────────────────────────────────────────────── -->
      <div
        v-if="hasHeaderBar"
        :class="
          classNames(
            'flex-none flex items-center gap-3 border-b px-6 py-3',
            surfaceText.divider,
          )
        "
      >
        <div
          v-if="headerTitle"
          class="text-sm font-semibold text-neutral-700 dark:text-neutral-200"
        >
          {{ headerTitle }}
        </div>
        <div class="flex-1" />
        <div class="flex items-center gap-2">
          <!-- View toggle -->
          <template v-if="showViewToggle">
            <IconButton
              icon="ViewRows"
              size="xs"
              variant="ghost"
              :color="controlColor"
              tooltip="Table view"
              tooltip-position="bottom"
              :disabled="activeView === 'table'"
              :aria-pressed="activeView === 'table'"
              aria-label="Switch to table view"
              @click="handleViewChange('table')"
            />
            <IconButton
              icon="ViewGrid"
              size="xs"
              variant="ghost"
              :color="controlColor"
              tooltip="Panel view"
              tooltip-position="bottom"
              :disabled="activeView === 'panel'"
              :aria-pressed="activeView === 'panel'"
              aria-label="Switch to panel view"
              @click="handleViewChange('panel')"
            />
          </template>

          <!-- Column visibility toggle — table view only -->
          <div
            v-if="showColumnSelector && hasHideableColumns && activeView === 'table'"
            ref="colPanelRef"
            class="relative"
          >
            <IconButton
              icon="EyeOpen"
              size="xs"
              variant="ghost"
              :color="controlColor"
              tooltip="Columns"
              tooltip-position="bottom"
              :aria-pressed="colPanelOpen"
              aria-label="Toggle column visibility"
              @click="colPanelOpen = !colPanelOpen"
            />
            <div
              v-if="colPanelOpen"
              class="absolute right-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div
                class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-800"
              >
                Columns
              </div>
              <div class="py-1 max-h-64 overflow-y-auto">
                <label
                  v-for="col in menuColumns"
                  :key="col.id"
                  :class="[
                    'flex items-center gap-2.5 px-3 py-1.5 text-sm select-none',
                    col.hideable !== false
                      ? 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                      : 'cursor-not-allowed opacity-40',
                  ]"
                >
                  <input
                    type="checkbox"
                    :checked="colVisibility[col.id] !== false"
                    :disabled="col.hideable === false"
                    :class="checkboxAccentClass"
                    @change="handleVisibilityToggle(col)"
                  />
                  <span class="text-neutral-700 dark:text-neutral-200">
                    {{ getColumnLabel(col) }}
                  </span>
                </label>
              </div>
              <div class="border-t border-neutral-100 px-3 py-2 dark:border-neutral-800">
                <Button
                  variant="ghost"
                  :color="controlColor"
                  size="xs"
                  @click="handleVisibilityReset"
                >
                  Reset to default
                </Button>
              </div>
            </div>
          </div>

          <!-- Group-by config button — table view only -->
          <div
            v-if="isUserGroupable && activeView === 'table'"
            ref="groupPanelRef"
            class="relative"
          >
            <!-- Wrapper to position the active indicator dot -->
            <div class="relative inline-flex">
              <IconButton
                icon="Group"
                size="xs"
                variant="ghost"
                :color="controlColor"
                tooltip="Group by"
                tooltip-position="bottom"
                :aria-pressed="groupPanelOpen || !!resolvedGroupBy"
                aria-label="Configure row grouping"
                @click="groupPanelOpen = !groupPanelOpen"
              />
              <!-- Active indicator dot -->
              <span
                v-if="resolvedGroupBy"
                :class="activeDotClass"
                aria-hidden="true"
              />
            </div>

            <div
              v-if="groupPanelOpen"
              class="absolute right-0 top-full z-50 mt-1 min-w-[220px] rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
            >
              <!-- Panel header -->
              <div
                class="flex items-center justify-between px-3 py-2 border-b border-neutral-100 dark:border-neutral-800"
              >
                <span
                  class="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500"
                >
                  Group by
                </span>
                <button
                  v-if="internalGroupBy"
                  type="button"
                  class="text-xs text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
                  @click="handleGroupChange(null)"
                >
                  Clear
                </button>
              </div>

              <!-- Column radio list — shows ALL columns (even hidden), excludes groupable:false -->
              <div class="py-1 max-h-64 overflow-y-auto">
                <label
                  class="flex items-center gap-2.5 px-3 py-1.5 text-sm select-none cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                >
                  <input
                    type="radio"
                    name="table-group-by"
                    :checked="!internalGroupBy"
                    :class="radioAccentClass"
                    @change="handleGroupChange(null)"
                  />
                  <span class="italic text-neutral-400 dark:text-neutral-500">
                    None
                  </span>
                </label>
                <label
                  v-for="col in menuColumns.filter((c) => c.groupable !== false)"
                  :key="col.id"
                  class="flex items-center gap-2.5 px-3 py-1.5 text-sm select-none cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                >
                  <input
                    type="radio"
                    name="table-group-by"
                    :checked="internalGroupBy === col.id"
                    :class="radioAccentClass"
                    @change="handleGroupChange(col.id)"
                  />
                  <span class="text-neutral-700 dark:text-neutral-200">
                    {{ getColumnLabel(col) }}
                  </span>
                  <!-- Show "(hidden)" hint when the column is currently not visible -->
                  <span
                    v-if="colVisibility[col.id] === false"
                    class="ml-auto text-xs text-neutral-400 dark:text-neutral-500"
                  >
                    hidden
                  </span>
                </label>
              </div>

              <!-- Show group header toggle -->
              <div class="border-t border-neutral-100 px-3 py-2.5 dark:border-neutral-800">
                <label class="flex items-center gap-2.5 text-sm select-none cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="resolvedShowGroupHeader"
                    :class="checkboxAccentClass"
                    @change="handleShowGroupHeaderToggle"
                  />
                  <span class="text-neutral-700 dark:text-neutral-200">
                    Show group header
                  </span>
                </label>
              </div>
            </div>
          </div>

          <!-- Sticky column picker — table view only -->
          <div
            v-if="userStickyColumns && activeView === 'table'"
            ref="stickyPanelRef"
            class="relative"
          >
            <div class="relative inline-flex">
              <IconButton
                icon="Pin"
                size="xs"
                variant="ghost"
                :color="controlColor"
                tooltip="Sticky columns"
                tooltip-position="bottom"
                :aria-pressed="stickyPanelOpen || hasStickyColumns"
                aria-label="Configure sticky columns"
                @click="stickyPanelOpen = !stickyPanelOpen"
              />
              <span
                v-if="hasStickyColumns"
                :class="activeDotClass"
                aria-hidden="true"
              />
            </div>

            <div
              v-if="stickyPanelOpen"
              class="absolute right-0 top-full z-50 mt-1 min-w-[240px] rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
            >
              <!-- Panel header -->
              <div
                class="flex items-center justify-between px-3 py-2 border-b border-neutral-100 dark:border-neutral-800"
              >
                <span
                  class="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500"
                >
                  Sticky columns
                </span>
                <button
                  v-if="hasStickyColumns"
                  type="button"
                  class="text-xs text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
                  @click="handleStickyClearAll"
                >
                  Clear all
                </button>
              </div>

              <!-- Column list -->
              <div class="py-1 max-h-64 overflow-y-auto">
                <div
                  v-for="col in menuColumns"
                  :key="col.id"
                  class="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                >
                  <span class="flex-1 truncate text-neutral-700 dark:text-neutral-200">
                    {{ getColumnLabel(col) }}
                  </span>
                  <!-- Left / None / Right toggle -->
                  <div
                    class="flex items-center rounded-md border border-neutral-200 dark:border-neutral-700 overflow-hidden text-xs"
                  >
                    <button
                      v-for="side in stickySides"
                      :key="String(side)"
                      type="button"
                      :class="[
                        'px-2 py-0.5 transition-colors select-none',
                        (internalStickyColumns[col.id] ?? null) === side
                          ? 'bg-neutral-200 dark:bg-neutral-700 font-semibold text-neutral-900 dark:text-neutral-100'
                          : 'text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-500',
                      ]"
                      @click="handleStickyChange(col.id, side)"
                    >
                      {{ side === "left" ? "←" : side === "right" ? "→" : "·" }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Legend -->
              <div class="border-t border-neutral-100 px-3 py-2 dark:border-neutral-800">
                <span class="text-xs text-neutral-400 dark:text-neutral-500">
                  ← pin left &nbsp;·&nbsp; · unpin &nbsp;·&nbsp; → pin right
                </span>
              </div>
            </div>
          </div>

          <slot name="headerActions">
            <VNodeRenderer :nodes="headerActions" />
          </slot>
        </div>
      </div>

      <!-- ── Table view ────────────────────────────────────────────────────── -->
      <div
        v-if="activeView === 'table' && visibleColumns.length > 0"
        :class="tableViewOuterClass"
      >
        <div
          ref="scrollContainerRef"
          :class="scrollContainerClass"
          :style="!fullHeight ? scrollContainerStyle : undefined"
          @scroll="handleGuideScroll"
        >
          <div class="relative">
          <table
            :class="tableClasses"
            :style="
              useFixedLayout ? { tableLayout: 'fixed', width: '100%' } : undefined
            "
          >
            <!-- Colgroup drives precise column widths in fixed layout -->
            <colgroup v-if="useFixedLayout">
              <col v-if="showGroupExpandCol" :style="{ width: '2.5rem' }" />
              <col
                v-if="resolvedGroupBy && !showGroupExpandCol"
                :style="{ width: '1rem' }"
              />
              <col v-for="c in colgroupCols" :key="c.id" :style="c.style" />
            </colgroup>
            <thead>
              <tr :class="theadRowClass">
                <!-- Extra leading th for expand/collapse when grouping with group headers -->
                <th
                  v-if="showGroupExpandCol"
                  scope="col"
                  :class="expandThClass"
                  aria-hidden="true"
                >
                  <div class="w-full h-full" />
                </th>
                <!-- Indent spacer th for grouped mode without group headers -->
                <th
                  v-if="resolvedGroupBy && !showGroupExpandCol"
                  scope="col"
                  class="w-4"
                  aria-hidden="true"
                />
                <th
                  v-for="hc in headerCells"
                  :key="hc.id"
                  :ref="(el) => setThRef(hc.id, el)"
                  scope="col"
                  :class="hc.thClass"
                  :style="hc.thStyle"
                  :aria-sort="hc.ariaSort"
                  :title="hc.column.tooltip"
                >
                  <div :class="hc.flexClass">
                    <span class="truncate min-w-0 flex-1">
                      <VNodeRenderer :nodes="hc.column.header" />
                    </span>
                    <IconButton
                      v-if="hc.column.sortable"
                      :icon="hc.sortIcon"
                      size="xs"
                      variant="icon"
                      :color="hc.isSorted ? controlColor : 'slate'"
                      rounded="md"
                      :accent="false"
                      :tooltip="hc.sortTooltip"
                      tooltip-position="bottom"
                      :class="hc.sortBtnClass"
                      aria-label="Toggle sort"
                      @click="handleSortToggle(hc.column)"
                    />
                  </div>
                  <!-- Resize handle -->
                  <div
                    v-if="hc.isResizable"
                    role="separator"
                    aria-hidden="true"
                    class="group/rh absolute inset-y-0 right-0 z-10 flex w-2 cursor-col-resize select-none items-center justify-center"
                    @mouseenter="onResizeHandleEnter(hc.column)"
                    @mouseleave="onResizeHandleLeave()"
                    @mousedown="(e) => onResizeHandleMouseDown(e, hc.column)"
                  >
                    <div :class="resizeHandleTrackClass" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody :class="tbodyClasses">
              <template v-if="hasRows">
                <template
                  v-for="entry in bodyEntries"
                  :key="entry.kind === 'group' ? `group-${entry.key}` : entry.key"
                >
                  <!-- Group header row -->
                  <tr
                    v-if="entry.kind === 'group'"
                    class="cursor-pointer select-none border-b border-neutral-100 bg-neutral-50 transition-colors duration-150 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/50"
                    @click="toggleGroup(entry.key)"
                  >
                    <td
                      :colspan="visibleColumns.length + 1"
                      class="py-2 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/50"
                    >
                      <div
                        :class="groupHeaderInnerClass"
                        role="button"
                        tabindex="0"
                        :aria-expanded="entry.isExpanded"
                        :aria-label="
                          `${entry.isExpanded ? 'Collapse' : 'Expand'} group ${
                            entry.display
                          }`
                        "
                        @keydown="onGroupHeaderKeydown(entry.key, $event)"
                      >
                        <span class="inline-flex text-neutral-400 dark:text-neutral-500">
                          <!-- Inline chevron SVG (avoids importing icon components directly) -->
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            width="14"
                            height="14"
                            :class="[
                              'flex-shrink-0 text-current transition-transform duration-200',
                              entry.isExpanded && 'rotate-90',
                            ]"
                            aria-hidden="true"
                          >
                            <path
                              d="M6 4l4 4-4 4"
                              stroke="currentColor"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </span>
                        <span
                          class="text-sm font-semibold text-neutral-700 dark:text-neutral-200"
                        >
                          <template v-if="entry.display">{{
                            entry.display
                          }}</template>
                          <span
                            v-else
                            class="italic text-neutral-400 dark:text-neutral-500"
                            >empty</span
                          >
                        </span>
                        <Badge :count="entry.count" :tone="controlColor" />
                      </div>
                    </td>
                  </tr>
                  <!-- Data row (shared between grouped and flat modes) -->
                  <tr
                    v-else
                    :class="entry.rowClasses"
                    @click="onRowClick(entry)"
                  >
                    <!-- Expand spacer column — only in grouped mode with visible group headers -->
                    <td
                      v-if="showGroupExpandCol"
                      :class="entry.spacerClass"
                      aria-hidden="true"
                    >
                      <div class="w-full h-full" />
                    </td>
                    <!-- Indent spacer — only in grouped mode without group headers -->
                    <td
                      v-if="resolvedGroupBy && !showGroupExpandCol"
                      class="w-4"
                      aria-hidden="true"
                    />
                    <td
                      v-for="cell in entry.cells"
                      :key="cell.id"
                      :class="cell.tdClass"
                      :style="cell.tdStyle"
                    >
                      <div :class="cell.innerClass">
                        <TruncatedText
                          v-if="cell.isText"
                          :text="String(cell.value)"
                          as="span"
                          :delay="2000"
                          no-wrapper
                          class="min-w-0 flex-1"
                        />
                        <VNodeRenderer v-else :nodes="cell.value" />
                      </div>
                    </td>
                  </tr>
                </template>
              </template>
              <tr v-else>
                <td
                  :colspan="emptyColSpan"
                  class="px-6 py-16 text-center text-sm font-medium text-neutral-500 dark:text-neutral-300"
                >
                  <slot name="emptyState">
                    <VNodeRenderer :nodes="emptyState ?? 'No data to display'" />
                  </slot>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Full-height column-resize guide, spanning the whole table. -->
          <div
            v-if="resizeGuide"
            aria-hidden="true"
            :class="[
              'pointer-events-none absolute inset-y-0 z-30 w-0.5',
              gridLinesOn
                ? getResizeGuideColorClass(controlColor)
                : 'bg-neutral-300 dark:bg-neutral-600',
            ]"
            :style="{ left: resizeGuide.left + 'px' }"
          />
          </div>
          <Loader
            v-if="loading"
            overlay
            :variant="loaderType"
            :label="loadingMessage"
            :progress="loaderProgress"
            class="rounded-none"
          />
        </div>
      </div>

      <!-- ── Panel view ────────────────────────────────────────────────────── -->
      <div
        v-if="activeView === 'panel' && hasPanelRenderer"
        :class="panelOuterClass"
        :style="!fullHeight ? scrollContainerStyle : undefined"
      >
        <Loader
          v-if="loading"
          overlay
          :variant="loaderType"
          :label="loadingMessage"
          :progress="loaderProgress"
          class="rounded-none"
        />
        <div v-if="hasRows" :class="panelGridClass" :style="panelGridStyle">
          <template
            v-for="(row, rowIndex) in panelRows"
            :key="panelRowKey(row, rowIndex)"
          >
            <slot
              v-if="$slots.panelItem"
              name="panelItem"
              :row="row"
              :index="rowIndex"
            />
            <VNodeRenderer
              v-else
              :nodes="panelItem ? panelItem(row, rowIndex) : null"
            />
          </template>
        </div>
        <div
          v-else
          class="px-6 py-16 text-center text-sm font-medium text-neutral-500 dark:text-neutral-300"
        >
          <slot name="emptyState">
            <VNodeRenderer :nodes="emptyState ?? 'No data to display'" />
          </slot>
        </div>
      </div>

      <!-- ── Footer / pagination ───────────────────────────────────────────── -->
      <div
        v-if="hasFooterBar"
        :class="
          classNames(
            'border-t px-6 py-3 text-sm text-neutral-600 dark:text-neutral-300',
            // The footer band is interior chrome — on a see-through surface an
            // opaque `bg-neutral-50` strip would seal the bottom of the glass,
            // so it drops to the same translucent fill as the header.
            surfaceText.translucent
              ? 'bg-white/20 dark:bg-white/5'
              : 'bg-neutral-50 dark:bg-neutral-900/60',
            surfaceText.divider,
          )
        "
      >
        <template v-if="$slots.footer || footer">
          <slot name="footer">
            <VNodeRenderer :nodes="footer" />
          </slot>
        </template>
        <div
          v-else-if="pagination"
          class="flex items-center justify-between w-full"
        >
          <div class="flex items-center gap-2">
            <span class="text-sm text-neutral-600 dark:text-neutral-400">
              Showing {{ (pagination.page - 1) * pagination.pageSize + 1 }} to
              {{ Math.min(pagination.page * pagination.pageSize, pagination.total) }}
              of {{ pagination.total }} results
            </span>
            <div class="w-32 ml-4">
              <Select
                :model-value="String(pagination.pageSize)"
                size="sm"
                @update:model-value="handlePageSizeChange"
              >
                <option
                  v-for="size in pageSizeOptions"
                  :key="size"
                  :value="size"
                >
                  {{ size }} per page
                </option>
              </Select>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Button
              variant="soft"
              :color="controlColor"
              size="sm"
              :disabled="pagination.page === 1 || loading"
              leading-icon="ArrowLeft"
              @click="handlePrevPage"
            >
              Previous
            </Button>
            <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Page {{ pagination.page }} of
              {{ Math.ceil(pagination.total / pagination.pageSize) }}
            </span>
            <Button
              variant="soft"
              :color="controlColor"
              size="sm"
              :disabled="
                pagination.page >=
                  Math.ceil(pagination.total / pagination.pageSize) || loading
              "
              trailing-icon="ArrowRight"
              @click="handleNextPage"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Panel>
</template>


