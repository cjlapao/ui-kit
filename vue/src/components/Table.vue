<script lang="ts">
import type { CSSProperties, VNodeChild } from "vue";
import type { TrueColor } from "../theme";
import type { IconName } from "../icons/registry";
import type { PanelTone } from "./Panel.vue";

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

/** Unified snapshot of all user-configurable table preferences. */
export interface TableSettings {
  columnVisibility?: Record<string, boolean>;
  columnWidths?: Record<string, number>;
  activeView?: "table" | "panel";
  groupBy?: string | null;
  showGroupHeader?: boolean;
  stickyColumns?: Record<string, "left" | "right">;
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

export type TableVariant =
  | "default"
  | "compact"
  | "minimal"
  | "bordered"
  | "flat";

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
  variant?: TableVariant;
  tone?: PanelTone;
  /** Theme color applied to action buttons, sort indicators, group dot, badges, and pagination. */
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
  sortState?: TableSortState;
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
  /** When true, wraps the table in a rounded border regardless of the variant. */
  rounded?: boolean;
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
}

const getToneHeaderClasses = (tone: TrueColor): string => {
  const c = tone;

  if (tone === "neutral") {
    return "bg-neutral-50 text-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700";
  }

  return `bg-${c}-50 text-${c}-700 dark:bg-${c}-500/15 dark:text-${c}-100 border-${c}-200 dark:border-${c}-500/30`;
};

/** Returns a static `bg-*-500` class for the active-group indicator dot. */
function getDotColorClass(color: TrueColor): string {
  switch (color) {
    case "blue":
      return "bg-blue-500";
    case "green":
      return "bg-green-500";
    case "teal":
      return "bg-teal-500";
    case "cyan":
      return "bg-cyan-500";
    case "indigo":
      return "bg-indigo-500";
    case "purple":
      return "bg-purple-500";
    case "violet":
      return "bg-violet-500";
    case "red":
      return "bg-red-500";
    case "orange":
      return "bg-orange-500";
    case "amber":
      return "bg-amber-500";
    case "yellow":
      return "bg-yellow-500";
    case "lime":
      return "bg-lime-500";
    case "emerald":
      return "bg-emerald-500";
    case "sky":
      return "bg-sky-500";
    case "fuchsia":
      return "bg-fuchsia-500";
    case "rose":
      return "bg-rose-500";
    case "slate":
      return "bg-slate-500";
    case "gray":
      return "bg-gray-500";
    case "zinc":
      return "bg-zinc-500";
    case "neutral":
      return "bg-neutral-500";
    case "stone":
      return "bg-stone-500";
    default:
      return "bg-blue-500";
  }
}

/** Returns static `accent-*` classes for native checkbox/radio inputs. */
function getAccentClass(color: TrueColor): string {
  switch (color) {
    case "blue":
      return "accent-blue-600 dark:accent-blue-400";
    case "green":
      return "accent-green-600 dark:accent-green-400";
    case "teal":
      return "accent-teal-600 dark:accent-teal-400";
    case "cyan":
      return "accent-cyan-600 dark:accent-cyan-400";
    case "indigo":
      return "accent-indigo-600 dark:accent-indigo-400";
    case "purple":
      return "accent-purple-600 dark:accent-purple-400";
    case "violet":
      return "accent-violet-600 dark:accent-violet-400";
    case "red":
      return "accent-red-600 dark:accent-red-400";
    case "orange":
      return "accent-orange-600 dark:accent-orange-400";
    case "amber":
      return "accent-amber-600 dark:accent-amber-400";
    case "yellow":
      return "accent-yellow-600 dark:accent-yellow-400";
    case "lime":
      return "accent-lime-600 dark:accent-lime-400";
    case "emerald":
      return "accent-emerald-600 dark:accent-emerald-400";
    case "sky":
      return "accent-sky-600 dark:accent-sky-400";
    case "fuchsia":
      return "accent-fuchsia-600 dark:accent-fuchsia-400";
    case "rose":
      return "accent-rose-600 dark:accent-rose-400";
    case "slate":
      return "accent-slate-600 dark:accent-slate-400";
    case "gray":
      return "accent-gray-600 dark:accent-gray-400";
    case "zinc":
      return "accent-zinc-600 dark:accent-zinc-400";
    case "neutral":
      return "accent-neutral-700 dark:accent-neutral-300";
    case "stone":
      return "accent-stone-600 dark:accent-stone-400";
    default:
      return "accent-blue-600 dark:accent-blue-400";
  }
}

/** Returns a static `bg-*-50` class for the selected row background. */
function getSelectedRowClass(color: TrueColor): string {
  switch (color) {
    case "blue":
      return "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800";
    case "green":
      return "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-800";
    case "teal":
      return "bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-800";
    case "cyan":
      return "bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-800";
    case "indigo":
      return "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-800";
    case "purple":
      return "bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-800";
    case "violet":
      return "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-800";
    case "red":
      return "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-800";
    case "orange":
      return "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-800";
    case "amber":
      return "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-800";
    case "yellow":
      return "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-800";
    case "lime":
      return "bg-lime-50 dark:bg-lime-500/10 border-lime-200 dark:border-lime-800";
    case "emerald":
      return "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800";
    case "sky":
      return "bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-800";
    case "fuchsia":
      return "bg-fuchsia-50 dark:bg-fuchsia-500/10 border-fuchsia-200 dark:border-fuchsia-800";
    case "rose":
      return "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-800";
    case "slate":
      return "bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-800";
    case "gray":
      return "bg-gray-50 dark:bg-gray-500/10 border-gray-200 dark:border-gray-800";
    case "zinc":
      return "bg-zinc-50 dark:bg-zinc-500/10 border-zinc-200 dark:border-zinc-800";
    case "neutral":
      return "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700";
    case "stone":
      return "bg-stone-50 dark:bg-stone-500/10 border-stone-200 dark:border-stone-800";
    default:
      return "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800";
  }
}

function getHighlightRowClass(color: TrueColor): string {
  switch (color) {
    case "blue":
      return "bg-blue-100 dark:bg-blue-500/20";
    case "green":
      return "bg-green-100 dark:bg-green-500/20";
    case "teal":
      return "bg-teal-100 dark:bg-teal-500/20";
    case "cyan":
      return "bg-cyan-100 dark:bg-cyan-500/20";
    case "indigo":
      return "bg-indigo-100 dark:bg-indigo-500/20";
    case "purple":
      return "bg-purple-100 dark:bg-purple-500/20";
    case "violet":
      return "bg-violet-100 dark:bg-violet-500/20";
    case "red":
      return "bg-red-100 dark:bg-red-500/20";
    case "orange":
      return "bg-orange-100 dark:bg-orange-500/20";
    case "amber":
      return "bg-amber-100 dark:bg-amber-500/20";
    case "yellow":
      return "bg-yellow-100 dark:bg-yellow-500/20";
    case "lime":
      return "bg-lime-100 dark:bg-lime-500/20";
    case "emerald":
      return "bg-emerald-100 dark:bg-emerald-500/20";
    case "sky":
      return "bg-sky-100 dark:bg-sky-500/20";
    case "fuchsia":
      return "bg-fuchsia-100 dark:bg-fuchsia-500/20";
    case "rose":
      return "bg-rose-100 dark:bg-rose-500/20";
    case "slate":
      return "bg-slate-100 dark:bg-slate-500/20";
    case "gray":
      return "bg-gray-100 dark:bg-gray-500/20";
    case "zinc":
      return "bg-zinc-100 dark:bg-zinc-500/20";
    case "neutral":
      return "bg-neutral-100 dark:bg-neutral-700/50";
    case "stone":
      return "bg-stone-100 dark:bg-stone-500/20";
    default:
      return "bg-blue-100 dark:bg-blue-500/20";
  }
}

function getHighlightBorderClass(color: TrueColor): string {
  switch (color) {
    case "blue":
      return "border-l-blue-500";
    case "green":
      return "border-l-green-500";
    case "teal":
      return "border-l-teal-500";
    case "cyan":
      return "border-l-cyan-500";
    case "indigo":
      return "border-l-indigo-500";
    case "purple":
      return "border-l-purple-500";
    case "violet":
      return "border-l-violet-500";
    case "red":
      return "border-l-red-500";
    case "orange":
      return "border-l-orange-500";
    case "amber":
      return "border-l-amber-500";
    case "yellow":
      return "border-l-yellow-500";
    case "lime":
      return "border-l-lime-500";
    case "emerald":
      return "border-l-emerald-500";
    case "sky":
      return "border-l-sky-500";
    case "fuchsia":
      return "border-l-fuchsia-500";
    case "rose":
      return "border-l-rose-500";
    case "slate":
      return "border-l-slate-500";
    case "gray":
      return "border-l-gray-500";
    case "zinc":
      return "border-l-zinc-500";
    case "neutral":
      return "border-l-neutral-500";
    case "stone":
      return "border-l-stone-500";
    default:
      return "border-l-blue-500";
  }
}

/** Returns static Tailwind hover class for the column resize handle track. */
function getResizeHandleHoverClass(color: TrueColor): string {
  switch (color) {
    case "blue":
      return "group-hover/rh:bg-blue-500    dark:group-hover/rh:bg-blue-400";
    case "green":
      return "group-hover/rh:bg-green-500   dark:group-hover/rh:bg-green-400";
    case "teal":
      return "group-hover/rh:bg-teal-500    dark:group-hover/rh:bg-teal-400";
    case "cyan":
      return "group-hover/rh:bg-cyan-500    dark:group-hover/rh:bg-cyan-400";
    case "indigo":
      return "group-hover/rh:bg-indigo-500  dark:group-hover/rh:bg-indigo-400";
    case "purple":
      return "group-hover/rh:bg-purple-500  dark:group-hover/rh:bg-purple-400";
    case "violet":
      return "group-hover/rh:bg-violet-500  dark:group-hover/rh:bg-violet-400";
    case "red":
      return "group-hover/rh:bg-red-500     dark:group-hover/rh:bg-red-400";
    case "orange":
      return "group-hover/rh:bg-orange-500  dark:group-hover/rh:bg-orange-400";
    case "amber":
      return "group-hover/rh:bg-amber-500   dark:group-hover/rh:bg-amber-400";
    case "yellow":
      return "group-hover/rh:bg-yellow-500  dark:group-hover/rh:bg-yellow-400";
    case "lime":
      return "group-hover/rh:bg-lime-500    dark:group-hover/rh:bg-lime-400";
    case "emerald":
      return "group-hover/rh:bg-emerald-500 dark:group-hover/rh:bg-emerald-400";
    case "sky":
      return "group-hover/rh:bg-sky-500     dark:group-hover/rh:bg-sky-400";
    case "fuchsia":
      return "group-hover/rh:bg-fuchsia-500 dark:group-hover/rh:bg-fuchsia-400";
    case "rose":
      return "group-hover/rh:bg-rose-500    dark:group-hover/rh:bg-rose-400";
    case "slate":
      return "group-hover/rh:bg-slate-500   dark:group-hover/rh:bg-slate-400";
    case "gray":
      return "group-hover/rh:bg-gray-500    dark:group-hover/rh:bg-gray-400";
    case "zinc":
      return "group-hover/rh:bg-zinc-500    dark:group-hover/rh:bg-zinc-400";
    case "neutral":
      return "group-hover/rh:bg-neutral-500 dark:group-hover/rh:bg-neutral-400";
    case "stone":
      return "group-hover/rh:bg-stone-500   dark:group-hover/rh:bg-stone-400";
    default:
      return "group-hover/rh:bg-blue-500    dark:group-hover/rh:bg-blue-400";
  }
}

const variantCellPadding: Record<TableVariant, string> = {
  default: "px-6 py-5 text-sm",
  compact: "px-4 py-3 text-sm",
  minimal: "px-3 py-4 text-xs",
  bordered: "px-5 py-5 text-sm",
  flat: "px-4 py-3 text-sm",
};

const variantSidePadding: Record<
  TableVariant,
  { left: string; right: string; contentVertical: string }
> = {
  default: { left: "pl-6", right: "pr-6", contentVertical: "py-1.5" },
  compact: { left: "pl-4", right: "pr-4", contentVertical: "py-1" },
  minimal: { left: "pl-3", right: "pr-3", contentVertical: "py-1.5" },
  bordered: { left: "pl-5", right: "pr-5", contentVertical: "py-1.5" },
  flat: { left: "pl-4", right: "pr-4", contentVertical: "py-1.5" },
};

const variantTableBase: Record<TableVariant, string> = {
  default: "min-w-full divide-y divide-neutral-200 dark:divide-neutral-700",
  compact: "min-w-full divide-y divide-neutral-200 dark:divide-neutral-700",
  minimal: "min-w-full divide-y divide-neutral-200 dark:divide-neutral-700",
  bordered: "min-w-full border border-neutral-200 dark:border-neutral-700",
  flat: "min-w-full divide-y divide-neutral-100 dark:divide-neutral-800",
};

const variantWrapperBase: Record<TableVariant, string> = {
  default:
    "overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-700/60 dark:bg-neutral-900/90",
  compact:
    "overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-sm dark:border-neutral-700/60 dark:bg-neutral-900/90",
  minimal:
    "overflow-hidden rounded-xl border border-neutral-200/60 bg-white/95 shadow-sm dark:border-neutral-700/60 dark:bg-neutral-900/90",
  bordered:
    "overflow-hidden rounded-2xl border border-neutral-300 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900",
  flat: "overflow-hidden bg-transparent dark:bg-transparent",
};

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

function getNextSortDirection(current?: SortDirection): SortDirection {
  if (current === "asc") {
    return "desc";
  }

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
  variant: "default",
  tone: "neutral",
  striped: false,
  noBorders: false,
  hoverable: true,
  stickyHeader: false,
  stickyActions: false,
  loading: false,
  loaderType: "spinner",
  manualSorting: false,
  rounded: false,
  showColumnSelector: false,
  resizableColumns: false,
  headerTitle: "",
  color: "blue",
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

const hasPanelRenderer = computed(() => !!props.panelItem || !!slots.panelItem);
const showViewToggle = computed(
  () => !!props.columns?.length && hasPanelRenderer.value,
);
const initialHasPanel = !!props.panelItem || !!slots.panelItem;
const defaultViewResolved: "table" | "panel" =
  props.tableSettings?.activeView ??
  props.defaultView ??
  (!!props.columns?.length && initialHasPanel
    ? "table"
    : initialHasPanel
      ? "panel"
      : "table");
const activeView = ref<"table" | "panel">(defaultViewResolved);

const internalSort = ref<TableSortState | null>(props.defaultSort ?? null);

const resolvedSort = computed(() => props.sortState ?? internalSort.value);

// ── Column visibility ────────────────────────────────────────────────────────
const colVisibility = ref<Record<string, boolean>>(
  (() => {
    const init: Record<string, boolean> = {};
    const source = props.tableSettings?.columnVisibility ?? props.columnVisibility;
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
    const widthSource = props.tableSettings?.columnWidths ?? props.columnWidths;
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
let resizing: { colId: string; startX: number; startWidth: number } | null =
  null;
let widthsDuringResize: Record<string, number> = {};

const setThRef = (colId: string, el: unknown) => {
  thRefs[colId] = (el as HTMLTableCellElement | null) ?? null;
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
  resizing = { colId, startX: e.clientX, startWidth };
  widthsDuringResize = { ...currentWidths };

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
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    emit("columnWidthChange", widthsDuringResize);
    emit("tableSettingsChange", {
      ...settingsSnapshot.value,
      columnWidths: widthsDuringResize,
    });
    resizing = null;
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

// When resizable and any width is stored, switch the table to fixed layout
// so column widths are honoured precisely.
const useFixedLayout = computed(
  () => props.resizableColumns && Object.keys(internalColWidths.value).length > 0,
);

// ── User sticky columns state ────────────────────────────────────────────────
const internalStickyColumns = ref<Record<string, "left" | "right">>(
  props.tableSettings?.stickyColumns ?? props.defaultStickyColumns ?? {},
);
const stickyPanelOpen = ref(false);
const stickyPanelRef = ref<HTMLDivElement | null>(null);

const handleStickyChange = (colId: string, pin: "left" | "right" | null) => {
  const next = { ...internalStickyColumns.value };
  if (pin === null) delete next[colId];
  else next[colId] = pin;
  internalStickyColumns.value = next;
  emit("stickyColumnsChange", next);
  emit("tableSettingsChange", {
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
  props.tableSettings?.groupBy ?? props.defaultGroupBy ?? null,
);
const expandedGroups = ref<Record<string, boolean>>({});
const groupPanelOpen = ref(false);
const showGroupHeaderLocal = ref(
  props.tableSettings?.showGroupHeader ?? props.showGroupHeader ?? true,
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

  if (!props.sortState) {
    internalSort.value = nextSort;
  }

  emit("sortChange", nextSort);
};

// ── Group handler ────────────────────────────────────────────────────────────
const handleGroupChange = (columnId: string | null) => {
  internalGroupBy.value = columnId;
  expandedGroups.value = {}; // reset expansion state when group changes
  emit("groupByChange", columnId);
  emit("tableSettingsChange", {
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

  const sorted = [...props.data];
  sorted.sort((a, b) => {
    const aValue = getValue(a, props.data.indexOf(a));
    const bValue = getValue(b, props.data.indexOf(b));

    if (aValue === bValue) {
      return 0;
    }

    const safeString = (val: unknown): string => {
      if (typeof val === "string") return val;
      if (typeof val === "number") return String(val);
      if (typeof val === "boolean") return String(val);
      return "";
    };

    const aComparable =
      typeof aValue === "number" ? aValue : safeString(aValue).toLowerCase();
    const bComparable =
      typeof bValue === "number" ? bValue : safeString(bValue).toLowerCase();

    if (aComparable < bComparable) {
      return sort.direction === "asc" ? -1 : 1;
    }

    return sort.direction === "asc" ? 1 : -1;
  });

  return sorted;
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
const wrapperClasses = computed(() =>
  classNames(
    "w-full",
    variantWrapperBase[props.variant],
    props.rounded &&
      "overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-700/60",
    props.fullHeight && "h-full flex flex-col",
    classAttr.value,
  ),
);
const tableClasses = computed(() =>
  classNames(variantTableBase[props.variant], props.tableClassName),
);

const cellPadding = computed(() => variantCellPadding[props.variant]);
const sidePaddingTokens = computed(() => variantSidePadding[props.variant]);

const headerToneClasses = computed(() =>
  props.variant === "flat"
    ? "bg-white text-neutral-500 dark:bg-transparent dark:text-neutral-400 border-neutral-200 dark:border-neutral-700"
    : getToneHeaderClasses(props.tone),
);
const headerBaseClasses =
  "text-xs font-semibold uppercase tracking-wide text-left text-neutral-600 dark:text-neutral-200";

const tbodyClasses = computed(() =>
  classNames(
    "bg-white dark:bg-neutral-900/40 divide-y divide-neutral-200 dark:divide-neutral-800",
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
  emit("tableSettingsChange", {
    ...settingsSnapshot.value,
    activeView: view,
  });
};

const handleVisibilityToggle = (col: TableColumn<T>) => {
  const visible = colVisibility.value[col.id] !== false;
  const next = { ...colVisibility.value, [col.id]: !visible };
  colVisibility.value = next;
  emit("columnVisibilityChange", next);
  emit("tableSettingsChange", {
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
  emit("tableSettingsChange", {
    ...settingsSnapshot.value,
    columnVisibility: reset,
  });
};

const handleShowGroupHeaderToggle = () => {
  const next = !showGroupHeaderLocal.value;
  showGroupHeaderLocal.value = next;
  emit("tableSettingsChange", {
    ...settingsSnapshot.value,
    showGroupHeader: next,
  });
};

// ── Group label for the config panel ─────────────────────────────────────────
const getColumnLabel = (col: TableColumn<T>) =>
  typeof col.header === "string" ? col.header : col.id;

const checkboxAccentClass = computed(() =>
  classNames("h-3.5 w-3.5 rounded border-neutral-300", getAccentClass(props.color)),
);
const radioAccentClass = computed(() =>
  classNames("h-3.5 w-3.5 border-neutral-300", getAccentClass(props.color)),
);
const activeDotClass = computed(() =>
  classNames(
    "pointer-events-none absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2 ring-white dark:ring-neutral-900",
    getDotColorClass(props.color),
  ),
);
const stickySides = ["left", null, "right"] as const;

// ── Layout wrappers ──────────────────────────────────────────────────────────
const innerWrapperClass = computed(() =>
  classNames(
    "relative flex flex-col",
    props.fullHeight && "flex-1 overflow-hidden h-full",
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
    getResizeHandleHoverClass(props.color),
  ),
);

interface HeaderCellEntry {
  id: string;
  column: TableColumn<T>;
  isSorted: boolean;
  thClass: string;
  thStyle: CSSProperties;
  ariaSort: "ascending" | "descending" | "none";
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

  const selectedClass = isSelected ? getSelectedRowClass(props.color) : "";
  const highlightRowClass = isHighlighted
    ? getHighlightRowClass(props.color)
    : "";
  const baseRowBgClass =
    props.striped && originalIndex % 2 === 1
      ? "bg-neutral-100 dark:bg-neutral-800/40"
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
        : props.striped &&
          originalIndex % 2 === 1 &&
          "bg-neutral-100 dark:bg-neutral-800/40",
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
        ? getSelectedRowClass(props.color)
        : isHighlighted
          ? getHighlightRowClass(props.color)
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
            ? getSelectedRowClass(props.color)
            : isHighlighted
              ? getHighlightRowClass(props.color)
              : props.striped && originalIndex % 2 === 1
                ? "bg-neutral-100 dark:bg-neutral-800/40"
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
        colIndex === 0 && sidePaddingTokens.value.left,
        colIndex === orderedVisibleColumns.value.length - 1 &&
          sidePaddingTokens.value.right,
        // Pulsing left border indicator on the first visible cell for highlighted rows
        colIndex === 0 &&
          isHighlighted &&
          classNames("border-l-4 animate-pulse", getHighlightBorderClass(props.color)),
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
    "sticky left-0 flex w-fit items-center gap-2 bg-inherit",
    sidePaddingTokens.value.left,
  ),
);

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
  <div :class="wrapperClasses" v-bind="restAttrs">
    <div :class="innerWrapperClass">
      <!-- ── Header bar ────────────────────────────────────────────────────── -->
      <div
        v-if="hasHeaderBar"
        class="flex-none flex items-center gap-3 border-b border-neutral-200 px-6 py-3 dark:border-neutral-700"
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
              :color="color"
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
              :color="color"
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
              :color="color"
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
                  :color="color"
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
                :color="color"
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
                :color="color"
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
          :class="scrollContainerClass"
          :style="!fullHeight ? scrollContainerStyle : undefined"
        >
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
                      :color="hc.isSorted ? color : 'slate'"
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
                      <div :class="groupHeaderInnerClass">
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
                        <Badge :count="entry.count" :tone="color" />
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
        class="border-t border-neutral-200 bg-neutral-50 px-6 py-3 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-300"
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
                <option :value="20">20 per page</option>
                <option :value="50">50 per page</option>
                <option :value="100">100 per page</option>
              </Select>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Button
              variant="soft"
              :color="color"
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
              :color="color"
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
  </div>
</template>


