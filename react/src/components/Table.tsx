import React, { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import {
  Loader,
  IconButton,
  Button,
  Select,
  Badge,
  Panel,
  type PanelTone,
} from ".";
import type { TrueColor } from "../theme";
import { useKitT } from "../i18n";
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
import TruncatedText from "./TruncatedText";
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

type AccessorFn<T> = (row: T, index: number) => React.ReactNode;

export interface TableColumn<T> {
  id: string;
  header: React.ReactNode;
  accessor?: keyof T | AccessorFn<T>;
  render?: (row: T, index: number) => React.ReactNode;
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
   * group-by. Use this when `render` returns JSX (which would otherwise give "[object Object]").
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

/**
 * The three loading styles a Table/AccessMatrix can show, matching Panel.
 * `"spinner"` and `"progress"` draw a Loader overlay pinned to the card;
 * `"skeleton"` replaces the content with pulsing placeholders.
 */
export type TableLoaderType = "spinner" | "progress" | "skeleton";

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
  /**
   * Style of the loading indicator, matching Panel:
   * - `"spinner"` / `"progress"` — a Loader overlay pinned to the card (it
   *   stays in place while the content scrolls beneath it).
   * - `"skeleton"` — the content is replaced by pulsing placeholders shaped
   *   like the table.
   * @default "spinner"
   */
  loaderType?: TableLoaderType;
  loaderProgress?: number;
  /**
   * Placeholder rows drawn by `loaderType="skeleton"`.
   * @default 6
   */
  skeletonRows?: number;
   emptyState?: React.ReactNode;
  /**
   * Controlled sort state. Pass `null` to clear the sort — like every other
   * prop, `undefined` means "uncontrolled" (the table keeps its own state),
   * so the two must not be conflated.
   */
   sortState?: TableSortState | null;
   defaultSort?: TableSortState;
   onSortChange?: (sort: TableSortState | null) => void;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  pagination?: TablePaginationState;
  maxHeight?: string | number;
  onRowClick?: (row: T, index: number) => void;
  rowClassName?: (row: T, index: number) => string;
  /**
   * Per-row override for the data-row hover fill. When it returns a class for
   * a row, that class replaces the default zebra-parity hover for the row's
   * cells (still only while `hoverable`). Used by AccessMatrix so its
   * group-header rows paint the group hover — uniform across cells — instead
   * of a data-row hover.
   */
  rowHoverClassName?: (row: T, index: number) => string | undefined;
  /** When provided and returns true for a row, that row is rendered with an intense accent background and a pulsing left-border indicator to signal new/updated content. */
  rowHighlight?: (row: T, index: number) => boolean;
  className?: string;
  tableClassName?: string;
  bodyClassName?: string;
  style?: React.CSSProperties;
  fullHeight?: boolean;
  manualSorting?: boolean;
  /** Title shown in the header bar alongside headerActions / view toggle. Defaults to empty. */
  headerTitle?: string;
  /**
   * Initial column visibility map (`columnId → visible`).
   * Serialise with `JSON.stringify` to save; parse and pass back to restore.
   */
  columnVisibility?: Record<string, boolean>;
  /** Called whenever the user changes column visibility. Receives the full current config. */
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
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
  /** Called when the user finishes resizing a column. Receives the full updated widths map. */
  onColumnWidthChange?: (widths: Record<string, number>) => void;
  /** Renders each row as a panel card. When provided alongside columns, a view toggle appears in the header. */
  panelItem?: (row: T, index: number) => React.ReactNode;
  /** Initial view when both columns and panelItem are provided. Defaults to "table". */
  defaultView?: "table" | "panel";
  /** Called whenever the user switches between table and panel view. */
  onViewChange?: (view: "table" | "panel") => void;
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
   * Example: `panelDeduplicateBy={(row) => row.manifest.id}`
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
  /** Called when the user changes the group column (null = no grouping). Use for persistence. */
  onGroupByChange?: (columnId: string | null) => void;
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
  /** Called when the user changes column stickiness. Use for persistence. */
  onStickyColumnsChange?: (config: Record<string, "left" | "right">) => void;
  /**
   * Unified table settings snapshot. Fields here take precedence over the
   * individual initial-value props (`columnVisibility`, `columnWidths`,
   * `defaultView`, `defaultGroupBy`, `defaultStickyColumns`).
   * Pass a previously persisted value to restore all settings on mount.
   */
  tableSettings?: TableSettings;
  /**
   * Called whenever any user-configurable table setting changes (visibility,
   * widths, view, group-by, sticky columns). Use a single handler to persist
   * the full settings object instead of wiring up all individual callbacks.
   * When `storageKey` is set the table also persists to storage itself — this
   * callback remains as an observer.
   */
  onTableSettingsChange?: (settings: TableSettings) => void;
  // ── Built-in settings persistence ──────────────────────────────────────────
  /**
   * Enables built-in settings persistence. When set, the table restores its
   * settings from storage on mount and saves the full `TableSettings`
   * snapshot after every change, under
   * `{storagePrefix}:{storageKey}` (default prefix `ui-kit:table`).
   *
   * An explicitly passed `tableSettings` (or the individual initial props)
   * still wins over the stored value on mount, so an app can pin settings;
   * afterwards every change flows back through `onTableSettingsChange` AND
   * into storage. Omit to keep the current fully-manual behaviour.
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
// Zebra stripe — fainted so a hovered row has room to sit between the stripe
// and the group-header band while still reading as a faint alternation.
const STRIPED_ROW_BG = "bg-neutral-50/55 dark:bg-neutral-800/15";

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
 * Zebra-stripe fill per tone, fainted to open the band a hovered row shifts
 * into (see the data-row hover maps below). The neutral family keeps the grey
 * zebra; a tinted table washes the stripes in its tone so they read as part of
 * the surface rather than a grey overlay. Generated from TRUE_COLORS — every
 * class below is in the safelist because the scanner cannot see interpolated
 * candidates.
 */
const stripedRowClasses: Record<TrueColor, string> = {
  ...Object.fromEntries(
    TRUE_COLORS.filter((tone) => !NEUTRAL_TONES.includes(tone)).map(
      (tone) => [tone, `bg-${tone}-50/55 dark:bg-${tone}-500/8`],
    ),
  ),
  ...Object.fromEntries(NEUTRAL_TONES.map((tone) => [tone, STRIPED_ROW_BG])),
} as Record<TrueColor, string>;

const getStripedRowClass = (tone: TrueColor): string =>
  stripedRowClasses[tone] ?? STRIPED_ROW_BG;

const LIGHT_ROW_HOVER_NEUTRAL =
  "group-hover:bg-neutral-100/55 dark:group-hover:bg-neutral-800/25";
const STRIPED_ROW_HOVER_NEUTRAL =
  "group-hover:bg-neutral-100/80 dark:group-hover:bg-neutral-800/30";

/**
 * Data-row hover fill per tone, split by zebra parity. The zebra is fainted so
 * a hovered row can sit in a band between the stripe and the group header: a
 * light (non-striped) row gets the lighter step, a striped row the deeper
 * step. Both stay lighter than the group-header band, so a hovered data row
 * never reads as a header. The neutral family keeps the grey wash. The
 * `group-hover:` variant out-specifies the base `bg-*` utility, so it wins on
 * sticky cells without `!important`.
 */
const lightRowHoverClasses: Record<TrueColor, string> = {
  ...Object.fromEntries(
    TRUE_COLORS.filter((tone) => !NEUTRAL_TONES.includes(tone)).map(
      (tone) => [
        tone,
        `group-hover:bg-${tone}-100/55 dark:group-hover:bg-${tone}-500/13`,
      ],
    ),
  ),
  ...Object.fromEntries(
    NEUTRAL_TONES.map((tone) => [tone, LIGHT_ROW_HOVER_NEUTRAL]),
  ),
} as Record<TrueColor, string>;

const stripedRowHoverClasses: Record<TrueColor, string> = {
  ...Object.fromEntries(
    TRUE_COLORS.filter((tone) => !NEUTRAL_TONES.includes(tone)).map(
      (tone) => [
        tone,
        `group-hover:bg-${tone}-100/80 dark:group-hover:bg-${tone}-500/17`,
      ],
    ),
  ),
  ...Object.fromEntries(
    NEUTRAL_TONES.map((tone) => [tone, STRIPED_ROW_HOVER_NEUTRAL]),
  ),
} as Record<TrueColor, string>;

const getLightRowHoverClass = (tone: TrueColor): string =>
  lightRowHoverClasses[tone] ?? LIGHT_ROW_HOVER_NEUTRAL;

const getStripedRowHoverClass = (tone: TrueColor): string =>
  stripedRowHoverClasses[tone] ?? STRIPED_ROW_HOVER_NEUTRAL;

const GROUP_HEADER_NEUTRAL =
  "bg-neutral-100 hover:bg-neutral-300 dark:bg-neutral-800/40 dark:hover:bg-neutral-700/60";
const GROUP_HEADER_BORDER_NEUTRAL = "border-neutral-100 dark:border-neutral-800";
const GROUP_HEADER_BASE_NEUTRAL = "bg-neutral-100 dark:bg-neutral-800/40";

/**
 * Group-header (collapsible) row fill + rule per tone. A clear three-step
 * hierarchy keeps the header readable against striped data rows: the zebra
 * wash is the faintest, the group-header band sits one step darker, and its
 * hover step sits darkest. The neutral family keeps the grey band.
 * `getGroupHeaderBaseBg` is the hover-free base used by a sticky cell that must
 * stay opaque while content scrolls under it.
 */
const groupHeaderClasses: Record<TrueColor, string> = {
  ...Object.fromEntries(
    TRUE_COLORS.filter((tone) => !NEUTRAL_TONES.includes(tone)).map(
      (tone) => [
        tone,
        `bg-${tone}-100 hover:bg-${tone}-300 dark:bg-${tone}-500/20 dark:hover:bg-${tone}-500/35`,
      ],
    ),
  ),
  ...Object.fromEntries(
    NEUTRAL_TONES.map((tone) => [tone, GROUP_HEADER_NEUTRAL]),
  ),
} as Record<TrueColor, string>;

const groupHeaderBorderClasses: Record<TrueColor, string> = {
  ...Object.fromEntries(
    TRUE_COLORS.filter((tone) => !NEUTRAL_TONES.includes(tone)).map(
      (tone) => [tone, `border-${tone}-100 dark:border-${tone}-500/20`],
    ),
  ),
  ...Object.fromEntries(
    NEUTRAL_TONES.map((tone) => [tone, GROUP_HEADER_BORDER_NEUTRAL]),
  ),
} as Record<TrueColor, string>;

const groupHeaderBaseBgClasses: Record<TrueColor, string> = {
  ...Object.fromEntries(
    TRUE_COLORS.filter((tone) => !NEUTRAL_TONES.includes(tone)).map(
      (tone) => [tone, `bg-${tone}-100 dark:bg-${tone}-500/20`],
    ),
  ),
  ...Object.fromEntries(
    NEUTRAL_TONES.map((tone) => [tone, GROUP_HEADER_BASE_NEUTRAL]),
  ),
} as Record<TrueColor, string>;

export const getGroupHeaderClass = (tone: TrueColor): string =>
  groupHeaderClasses[tone] ?? GROUP_HEADER_NEUTRAL;

export const getGroupHeaderBorderClass = (tone: TrueColor): string =>
  groupHeaderBorderClasses[tone] ?? GROUP_HEADER_BORDER_NEUTRAL;

export const getGroupHeaderBaseBg = (tone: TrueColor): string =>
  groupHeaderBaseBgClasses[tone] ?? GROUP_HEADER_BASE_NEUTRAL;

const GROUP_ROW_HOVER_NEUTRAL =
  "group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700/60";

/**
 * Cell-level hover fill for a group-header row. A pseudo group row (as
 * AccessMatrix renders one) is a data row, so its cells would otherwise paint
 * a data-row hover over the tr's group hover — leaving the sticky cell out of
 * step. This class makes every cell paint the same bold group hover the tr
 * uses, so the whole row shifts as one.
 */
const groupRowHoverClasses: Record<TrueColor, string> = {
  ...Object.fromEntries(
    TRUE_COLORS.filter((tone) => !NEUTRAL_TONES.includes(tone)).map(
      (tone) => [
        tone,
        `group-hover:bg-${tone}-300 dark:group-hover:bg-${tone}-500/35`,
      ],
    ),
  ),
  ...Object.fromEntries(
    NEUTRAL_TONES.map((tone) => [tone, GROUP_ROW_HOVER_NEUTRAL]),
  ),
} as Record<TrueColor, string>;

export const getGroupRowHoverClass = (tone: TrueColor): string =>
  groupRowHoverClasses[tone] ?? GROUP_ROW_HOVER_NEUTRAL;

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
): React.ReactNode {
  if (column.render) {
    return column.render(row, index);
  }

  if (column.accessor) {
    if (typeof column.accessor === "function") {
      return column.accessor(row, index);
    }

    return (row as Record<string, unknown>)[
      column.accessor as string
    ] as React.ReactNode;
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

  const style: React.CSSProperties = {};
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

// ── Inline chevron SVG (avoids importing icon components directly) ─────────────
function ChevronSvg({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      width="14"
      height="14"
      className={classNames(
        "flex-shrink-0 text-current transition-transform duration-200",
        expanded && "rotate-90",
      )}
      aria-hidden="true"
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Shared pulsing-bar style, matching Panel's `SkeletonBar`. */
const SKELETON_BAR = "h-3 rounded-full bg-black/10 dark:bg-white/10";

/**
 * Placeholder drawn by `loaderType="skeleton"`: the same column count as the
 * real table, so the card keeps its shape while data loads.
 */
const TableSkeleton: React.FC<{ columns: number; rows: number }> = ({
  columns,
  rows,
}) => {
  const colCount = Math.max(1, columns);
  const rowBar = (i: number) => (
    <div key={i} className="min-w-0 flex-1">
      <div
        className={classNames(
          SKELETON_BAR,
          // Vary the widths so the placeholder reads as content, not columns.
          i % 4 === 0
            ? "w-full"
            : i % 4 === 1
              ? "w-5/6"
              : i % 4 === 2
                ? "w-4/5"
                : "w-3/4",
        )}
      />
    </div>
  );
  return (
    <div
      aria-hidden="true"
      className="w-full animate-pulse motion-reduce:animate-none"
    >
      <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
        {Array.from({ length: colCount }).map((_, i) => (
          <div key={i} className="min-w-0 flex-1">
            <div className={SKELETON_BAR} />
          </div>
        ))}
      </div>
      {Array.from({ length: Math.max(1, rows) }).map((_, r) => (
        <div
          key={r}
          className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3 dark:border-neutral-800"
        >
          {Array.from({ length: colCount }).map((_, c) => rowBar(c))}
        </div>
      ))}
    </div>
  );
};

/** Placeholder for the panel (card-grid) view under `loaderType="skeleton"`. */
const PanelCardSkeleton: React.FC<{ rows: number }> = ({ rows }) => (
  <div
    aria-hidden="true"
    className="w-full animate-pulse p-4 motion-reduce:animate-none"
  >
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: Math.max(1, rows) }).map((_, i) => (
        <div key={i} className="h-24 rounded-lg bg-black/10 dark:bg-white/10" />
      ))}
    </div>
  </div>
);

function TableComponent<T>({
  columns,
  data,
  selectedItems,
  rowKey,
  variant = "outlined",
  density = "default",
  bordered = false,
  corner,
  tone = "neutral",
  striped = false,
  noBorders = false,
  hoverable = true,
  stickyHeader = false,
  stickyActions = false,
  loading = false,
  loadingMessage,
  loaderType = "spinner",
  loaderProgress,
  skeletonRows = 6,
  emptyState,
  sortState,
  defaultSort,
  onSortChange,
  headerActions,
  footer,
  maxHeight,
  onRowClick,
  rowClassName,
  rowHoverClassName,
  rowHighlight,
  className,
  tableClassName,
  bodyClassName,
  style,
  fullHeight,
  pagination,
  manualSorting = false,
  panelItem,
  defaultView,
  onViewChange,
  panelGridClassName,
  panelMinItemWidth,
  panelMaxItemWidth,
  panelGap,
  panelDeduplicateBy,
  headerTitle = "",
  columnVisibility: columnVisibilityProp,
  onColumnVisibilityChange,
  showColumnSelector = false,
  resizableColumns = false,
  columnWidths: columnWidthsProp,
  onColumnWidthChange,
  // Grouping props
  groupBy,
  groupable,
  defaultGroupBy,
  showGroupHeader,
  defaultGroupExpanded,
  onGroupByChange,
  userStickyColumns,
  defaultStickyColumns,
  onStickyColumnsChange,
  tableSettings,
  onTableSettingsChange,
  storageKey,
  storagePrefix,
  storage,
  color,
}: TableProps<T>) {
  const t = useKitT();
  const getDefaultColumnVisibility = (column: TableColumn<T>) => {
    if (column.hideable === false) {
      return true;
    }

    return column.defaultHidden !== true;
  };

  // ── Built-in settings persistence ──────────────────────────────────────────
  // The adapter is created once per backend; the composed key is stable for
  // the life of the component, so the stored snapshot is read exactly once
  // per (key, backend) pair. An explicit `tableSettings` prop (or the
  // individual initial props) always outranks the stored value on mount.
  const storageAdapter = useMemo(
    () => storage ?? createSafeLocalStorage(),
    [storage],
  );
  const fullStorageKey = storageKey
    ? buildTableStorageKey(storagePrefix ?? TABLE_STORAGE_DEFAULT_PREFIX, storageKey)
    : null;
  const storedSettings = useMemo(
    () =>
      fullStorageKey
        ? decodeStoredSettings(storageAdapter.getItem(fullStorageKey))
        : null,
    [fullStorageKey, storageAdapter],
  );
  /** Precedence: explicit prop → stored snapshot → individual initial prop. */
  const settingsSource: TableSettings | undefined =
    tableSettings ?? storedSettings ?? undefined;

  /** Fire the observer callback AND persist when storage is enabled. */
  const emitSettingsChange = (settings: TableSettings) => {
    onTableSettingsChange?.(settings);
    if (fullStorageKey) {
      storageAdapter.setItem(fullStorageKey, encodeStoredSettings(settings));
    }
  };

  // The tone tints the interior controls too, unless the caller overrides
  // just those with `color` (e.g. an emerald table with blue actions).
  const controlColor: TrueColor = color ?? tone;
  const focusRingClass = `focus-visible:ring-${controlColor}-500 dark:focus-visible:ring-${controlColor}-400`;
  const densityTokens = getTableDensityTokens(density);
  const cellPadding = densityTokens.cell;
  const sidePaddingTokens = densityTokens;

  const showViewToggle = !!columns?.length && !!panelItem;
  const defaultViewResolved: "table" | "panel" =
    settingsSource?.activeView ??
    defaultView ??
    (showViewToggle ? "table" : panelItem ? "panel" : "table");
  const [activeView, setActiveView] = useState<"table" | "panel">(
    defaultViewResolved,
  );

  const [internalSort, setInternalSort] = useState<TableSortState | null>(
    defaultSort ?? null,
  );

  // `!== undefined`, not `??`: a controlled `null` (sort cleared by the
  // parent) must NOT fall back to the internal state.
  const resolvedSort = sortState !== undefined ? sortState : internalSort;

  // ── Column visibility ────────────────────────────────────────────────────────
  const [colVisibility, setColVisibility] = useState<Record<string, boolean>>(
    () => {
      const init: Record<string, boolean> = {};
      const source =
        settingsSource?.columnVisibility ?? columnVisibilityProp;
      for (const col of columns ?? []) {
        init[col.id] = source?.[col.id] ?? getDefaultColumnVisibility(col);
      }
      return init;
    },
  );

  // Sync when the columnVisibility prop changes (e.g. after loading saved config)
  useEffect(() => {
    const source = tableSettings?.columnVisibility ?? columnVisibilityProp;
    if (!source) return;
    setColVisibility((prev) => {
      const next = { ...prev };
      for (const col of columns ?? []) {
        next[col.id] =
          source[col.id] ?? prev[col.id] ?? getDefaultColumnVisibility(col);
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnVisibilityProp, tableSettings?.columnVisibility]);

  const [colPanelOpen, setColPanelOpen] = useState(false);
  const colPanelRef = useRef<HTMLDivElement>(null);

  // ── Column resize ─────────────────────────────────────────────────────────────
  const [internalColWidths, setInternalColWidths] = useState<
    Record<string, number>
  >(() => {
    const init: Record<string, number> = {};
    const widthSource =
      settingsSource?.columnWidths ?? columnWidthsProp;
    if (widthSource) {
      Object.assign(init, widthSource);
    } else {
      for (const col of columns ?? []) {
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
  });

  // Sync when columnWidths prop changes (e.g. after loading saved config)
  useEffect(() => {
    const widthSource = tableSettings?.columnWidths ?? columnWidthsProp;
    if (!widthSource) return;
    setInternalColWidths((prev) => ({ ...prev, ...widthSource }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnWidthsProp, tableSettings?.columnWidths]);

  // refs: one per <th> for DOM measurement, plus transient resize state
  const thRefs = useRef<Record<string, HTMLTableCellElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const resizingRef = useRef<{
    colId: string;
    startX: number;
    startWidth: number;
  } | null>(null);
  const widthsDuringResizeRef = useRef<Record<string, number>>({});

  // Full-height guide line position while a resize handle is hovered/dragged.
  // `left` is the column's right edge in scroll-content coordinates.
  const [resizeGuide, setResizeGuide] = useState<{
    colId: string;
    left: number;
  } | null>(null);

  // Column's right edge in scroll-content coordinates. Uses the visual
  // (getBoundingClientRect) position + scrollLeft so a sticky (pinned) column
  // lines up with its handle even when the table is horizontally scrolled.
  const computeGuideLeft = (colId: string): number | null => {
    const th = thRefs.current[colId];
    const container = scrollContainerRef.current;
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
    setResizeGuide((prev) => {
      if (!prev) return prev;
      const left = computeGuideLeft(prev.colId);
      return left == null ? prev : { ...prev, left };
    });
  };

  // Clean up any lingering body styles if the component unmounts mid-drag
  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, []);

  const handleResizeStart = (
    e: React.MouseEvent,
    colId: string,
    minColWidth: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // On the very first resize, seed ALL visible column widths from the DOM so
    // switching to table-layout:fixed doesn't cause a layout jump.
    let currentWidths = { ...internalColWidths };
    if (Object.keys(currentWidths).length === 0) {
      for (const col of visibleColumns) {
        const el = thRefs.current[col.id];
        if (el) currentWidths[col.id] = el.offsetWidth;
      }
      setInternalColWidths(currentWidths);
    }

    const startWidth =
      currentWidths[colId] ?? thRefs.current[colId]?.offsetWidth ?? 100;
    const startLeft = computeGuideLeft(colId) ?? 0;
    resizingRef.current = { colId, startX: e.clientX, startWidth };
    widthsDuringResizeRef.current = { ...currentWidths };
    setResizeGuide({ colId, left: startLeft });

    const onMouseMove = (moveEvt: MouseEvent) => {
      if (!resizingRef.current) return;
      const newWidth = Math.max(
        minColWidth,
        resizingRef.current.startWidth +
          (moveEvt.clientX - resizingRef.current.startX),
      );
      widthsDuringResizeRef.current = {
        ...widthsDuringResizeRef.current,
        [resizingRef.current.colId]: newWidth,
      };
      setInternalColWidths({ ...widthsDuringResizeRef.current });
      // The column's right edge moves by the width delta, so the guide does too.
      const delta = newWidth - resizingRef.current.startWidth;
      setResizeGuide({ colId, left: startLeft + delta });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      onColumnWidthChange?.(widthsDuringResizeRef.current);
      emitSettingsChange({
        ...settingsSnapshotRef.current,
        columnWidths: widthsDuringResizeRef.current,
      });
      resizingRef.current = null;
      setResizeGuide(null);
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // When resizable and any width is stored, switch the table to fixed layout
  // so column widths are honoured precisely.
  const useFixedLayout =
    resizableColumns && Object.keys(internalColWidths).length > 0;

  // ── User sticky columns state ────────────────────────────────────────────────
  const [internalStickyColumns, setInternalStickyColumns] = useState<
    Record<string, "left" | "right">
  >(settingsSource?.stickyColumns ?? defaultStickyColumns ?? {});
  const [stickyPanelOpen, setStickyPanelOpen] = useState(false);
  const stickyPanelRef = useRef<HTMLDivElement>(null);

  // ── Unified settings snapshot ref (declared early so all handlers can use it) ─
  // The .current assignment is done after all state is declared below.
  const settingsSnapshotRef = useRef<TableSettings>({});

  const handleStickyChange = (colId: string, pin: "left" | "right" | null) => {
    // The callbacks live OUTSIDE the state updater: React may invoke an
    // updater twice (StrictMode, concurrent re-render) and every side effect
    // in there would fire twice — the persistence write included.
    const next = { ...internalStickyColumns };
    if (pin === null) delete next[colId];
    else next[colId] = pin;
    setInternalStickyColumns(next);
    onStickyColumnsChange?.(next);
    emitSettingsChange({
      ...settingsSnapshotRef.current,
      stickyColumns: next,
    });
  };

  const hasStickyColumns = Object.keys(internalStickyColumns).length > 0;

  // ── Grouping state ───────────────────────────────────────────────────────────
  const [internalGroupBy, setInternalGroupBy] = useState<string | null>(
    settingsSource?.groupBy ?? defaultGroupBy ?? null,
  );
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const [groupPanelOpen, setGroupPanelOpen] = useState(false);
  const [showGroupHeaderLocal, setShowGroupHeaderLocal] = useState(
    settingsSource?.showGroupHeader ?? showGroupHeader ?? true,
  );
  const groupPanelRef = useRef<HTMLDivElement>(null);

  const resolvedGroupBy = groupBy ?? internalGroupBy;
  const resolvedShowGroupHeader = showGroupHeader ?? showGroupHeaderLocal;

  // ── Unified settings snapshot — update after all state is declared ───────────
  // Handlers close over the ref (declared above); this assignment runs
  // synchronously on every render before any user interaction can fire.
  settingsSnapshotRef.current = {
    columnVisibility: colVisibility,
    columnWidths: internalColWidths,
    activeView,
    groupBy: internalGroupBy,
    showGroupHeader: showGroupHeaderLocal,
    stickyColumns: internalStickyColumns,
  };

  // ── Selection Lookup ─────────────────────────────────────────────────────────
  const selectionLookup = useMemo(() => {
    if (!selectedItems || selectedItems.length === 0) return null;

    const lookup = new Set<unknown>();
    selectedItems.forEach((item) => {
      // Support reference equality
      lookup.add(item);

      // Support ID equality
      if (rowKey) {
        // We pass -1 as index since we don't have it for selected items,
        // expecting rowKey to rely on intrinsic properties.
        lookup.add(rowKey(item, -1));
      } else if (typeof (item as Record<string, unknown>).id !== "undefined") {
        const idVal = (item as Record<string, unknown>).id;
        lookup.add(String(idVal));
      }
    });
    return lookup;
  }, [selectedItems, rowKey]);

  // ── Outside-click handlers ───────────────────────────────────────────────────
  useEffect(() => {
    if (!colPanelOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        colPanelRef.current &&
        !colPanelRef.current.contains(e.target as Node)
      ) {
        setColPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [colPanelOpen]);

  useEffect(() => {
    if (!groupPanelOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        groupPanelRef.current &&
        !groupPanelRef.current.contains(e.target as Node)
      ) {
        setGroupPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [groupPanelOpen]);

  useEffect(() => {
    if (!stickyPanelOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        stickyPanelRef.current &&
        !stickyPanelRef.current.contains(e.target as Node)
      ) {
        setStickyPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [stickyPanelOpen]);

  // ── Sort handler ─────────────────────────────────────────────────────────────
  const handleSortToggle = (column: TableColumn<T>) => {
    if (!column.sortable) {
      return;
    }

    const nextDirection = getNextSortDirection(
      resolvedSort?.columnId === column.id ? resolvedSort.direction : undefined,
    );

    const nextSort = nextDirection
      ? { columnId: column.id, direction: nextDirection }
      : null;

    if (sortState === undefined) {
      setInternalSort(nextSort);
    }

    if (onSortChange) {
      onSortChange(nextSort);
    }
  };

  // ── Group handler ────────────────────────────────────────────────────────────
  const handleGroupChange = (columnId: string | null) => {
    setInternalGroupBy(columnId);
    setExpandedGroups({}); // reset expansion state when group changes
    onGroupByChange?.(columnId);
    emitSettingsChange({
      ...settingsSnapshotRef.current,
      groupBy: columnId,
    });
  };

  // ── Sorted data ──────────────────────────────────────────────────────────────
  const sortedData = useMemo(() => {
    if (manualSorting) {
      return data;
    }

    if (!resolvedSort) {
      return data;
    }

    const column = columns?.find((col) => col.id === resolvedSort.columnId);

    if (!column || (!column.accessor && !column.render && !column.sortValue)) {
      return data;
    }

    // sortValue takes priority; fall back to the raw accessor value, then render.
    // Accessor is preferred over render because render typically returns JSX which
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

    const safeString = (val: React.ReactNode): string => {
      if (typeof val === "string") return val;
      if (typeof val === "number") return String(val);
      if (typeof val === "boolean") return String(val);
      return "";
    };

    // Precompute the comparable value per row ONCE. Computing it inside the
    // comparator (via data.indexOf(row)) made every comparison an O(n)
    // lookup — O(n²) log n overall on large tables.
    const indexed = data.map((row, index) => ({
      row,
      key:
        typeof getValue(row, index) === "number"
          ? (getValue(row, index) as number)
          : safeString(getValue(row, index) as React.ReactNode).toLowerCase(),
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

      return resolvedSort.direction === "asc" ? cmp : -cmp;
    });

    return sorted.map(({ row }) => row);
  }, [resolvedSort, columns, data, manualSorting]);

  // ── Column helpers ───────────────────────────────────────────────────────────
  const effectiveColumns = columns ?? [];
  const menuColumns = effectiveColumns.filter((col) => !col.isActionsColumn);

  // User-configurable grouping is only shown when groupable=true and no code-defined groupBy
  const isUserGroupable =
    groupable === true &&
    !groupBy &&
    menuColumns.some((col) => col.groupable !== false);

  // The grouped column is always hidden from the rendered table
  const visibleColumns = effectiveColumns.filter(
    (col) => colVisibility[col.id] !== false && col.id !== resolvedGroupBy,
  );
  const hasHideableColumns = menuColumns.some((col) => col.hideable !== false);

  // ── Ordered visible columns ──────────────────────────────────────────────────
  // When columns are pinned (user-configured or code-defined), they are moved to
  // the appropriate edge while preserving relative order within each group:
  //   [ left-pinned | normal | right-pinned ]
  // The stickyActions column (original last col) is always last within the right group.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const orderedVisibleColumns = useMemo((): TableColumn<T>[] => {
    const left: TableColumn<T>[] = [];
    const middle: TableColumn<T>[] = [];
    const right: TableColumn<T>[] = [];
    visibleColumns.forEach((col, i) => {
      const effective = internalStickyColumns[col.id] ?? col.sticky;
      if (effective === "left") {
        left.push(col);
      } else if (
        effective === "right" ||
        (stickyActions && i === visibleColumns.length - 1)
      ) {
        right.push(col);
      } else {
        middle.push(col);
      }
    });
    return [...left, ...middle, ...right];
  }, [visibleColumns, internalStickyColumns, stickyActions]);

  // ── Grouped data ─────────────────────────────────────────────────────────────
  const groupedData = useMemo((): GroupEntry<T>[] | null => {
    if (!resolvedGroupBy) return null;
    const column = effectiveColumns.find((c) => c.id === resolvedGroupBy);
    if (!column) return null;

    const groups: GroupEntry<T>[] = [];
    const groupMap = new Map<string, number>();

    sortedData.forEach((row, idx) => {
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
        // React elements → display stays "" (avoids [object Object])
      }
      const key = display.toLowerCase(); // case-insensitive grouping

      if (!groupMap.has(key)) {
        groupMap.set(key, groups.length);
        groups.push({ key, display, rows: [] });
      }
      groups[groupMap.get(key)!].rows.push({ row, originalIndex: idx });
    });

    return groups;
  }, [resolvedGroupBy, effectiveColumns, sortedData]);

  // Auto-initialize expansion state for newly seen groups
  useEffect(() => {
    if (!groupedData) return;
    setExpandedGroups((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const g of groupedData) {
        if (!(g.key in next)) {
          next[g.key] = defaultGroupExpanded !== false; // default: expanded
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [groupedData, defaultGroupExpanded]);

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // When panelDeduplicateBy is set, only the first row for each key is shown in panel view
  const panelRows = useMemo(() => {
    if (!panelDeduplicateBy) return sortedData;
    const seen = new Set<string | number>();
    return sortedData.filter((row) => {
      const key = panelDeduplicateBy(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [sortedData, panelDeduplicateBy]);

  // When grouping is active AND showing group headers, we render an extra
  // leading column for the expand/collapse chevron.
  const showGroupExpandCol = !!(resolvedGroupBy && resolvedShowGroupHeader);

  // ── Effective per-column stickiness (column-defined + user-configured) ───────
  // User config takes precedence over the column-defined sticky value, so users
  // can override or clear a code-defined pin at runtime.
  const getEffectiveSticky = (
    col: TableColumn<T>,
  ): "left" | "right" | undefined =>
    internalStickyColumns[col.id] ?? col.sticky ?? undefined;

  // True when at least one visible column is pinned to the left (code-defined or user-configured).
  // Used to decide whether the grouped-row spacer td needs an opaque background.
  const hasLeftStickyColumn = orderedVisibleColumns.some(
    (col) => getEffectiveSticky(col) === "left",
  );

  // ── Sticky-right column offsets ──────────────────────────────────────────────
  // When multiple columns are pinned to the right (via sticky:'right',
  // stickyActions, or user config), each one needs a `right` offset equal to
  // the total width of all right-sticky columns further to the right. We
  // calculate this from internalColWidths → column.width → column.minWidth.
  const rightStickyOffsets = useMemo((): Record<string, number | undefined> => {
    const offsets: Record<string, number | undefined> = {};
    let cumulative = 0;
    for (let i = orderedVisibleColumns.length - 1; i >= 0; i--) {
      const col = orderedVisibleColumns[i];
      const effective = internalStickyColumns[col.id] ?? col.sticky;
      const isSticky =
        effective === "right" ||
        (stickyActions && i === orderedVisibleColumns.length - 1);
      if (!isSticky) continue;
      offsets[col.id] = cumulative;
      const w =
        internalColWidths[col.id] ??
        (typeof col.width === "number" ? col.width : undefined) ??
        (typeof col.minWidth === "number" ? col.minWidth : undefined);
      if (w !== undefined) cumulative += w;
    }
    return offsets;
  }, [
    orderedVisibleColumns,
    stickyActions,
    internalColWidths,
    internalStickyColumns,
  ]);

  // ── Visual class helpers ─────────────────────────────────────────────────────
  // Container chrome (fill, shadow, ring, glass) now lives on the `Panel`
  // rendered below. Everything here is the table's OWN interior rule; on
  // translucent surfaces (glass / liquid-glass / default / simple) fills and
  // separators stay light so the backdrop still shows through.
  const surfaceText = getSurfaceTextTokens(variant);
  const gridLinesOn = bordered && !noBorders;

  const wrapperClasses = classNames(fullHeight && "h-full", className);
  const tableClasses = classNames(
    "min-w-full divide-y",
    surfaceText.translucent ? TRANSLUCENT_ROW_RULES : SOLID_ROW_RULES,
    gridLinesOn && "border border-neutral-200 dark:border-neutral-700",
    tableClassName,
  );
  const gridLineClass =
    gridLinesOn && "border-neutral-200 dark:border-neutral-700";

  // On a see-through surface the header band must stay see-through too — an
  // opaque band reads as a hole punched in the glass. The light-mode tint is a
  // translucent half of the solid tone fill (`-50/50`); dark mode reuses the
  // already-translucent `-500/15` tint. Neutral steps down to white/20 (its
  // `-50` is a paper-white that would still mask the backdrop).
  const headerToneClasses = surfaceText.translucent
    ? NEUTRAL_TONES.includes(tone)
      ? "bg-white/20 text-neutral-700 border-neutral-200/60 dark:bg-white/5 dark:text-neutral-100 dark:border-white/10"
      : `bg-${tone}-50/50 text-${tone}-700 border-${tone}-200/60 dark:bg-${tone}-500/15 dark:text-${tone}-100 dark:border-${tone}-500/30`
    : getToneHeaderClasses(tone);
  const headerBaseClasses =
    "text-xs font-semibold uppercase tracking-wide text-left";

  const tbodyClasses = classNames(
    "divide-y",
    surfaceText.translucent ? TRANSLUCENT_ROW_RULES : SOLID_ROW_RULES,
    (striped || noBorders) && "divide-y-0",
    bodyClassName,
  );

  const scrollContainerStyle = maxHeight
    ? {
        maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
      }
    : undefined;

  const hasRows = sortedData.length > 0;

  // Skeleton mode replaces the content with placeholders instead of
  // overlaying a Loader, mirroring Panel's `showSkeleton`.
  const showSkeleton = loading && loaderType === "skeleton";

  // ── Empty state renderers ────────────────────────────────────────────────────
  const emptyColSpan =
    (showGroupExpandCol ? visibleColumns.length + 1 : visibleColumns.length) ||
    1;

  const renderEmptyState = () => (
    <tr>
      <td
        colSpan={emptyColSpan}
        className={classNames(
          "px-6 py-16 text-center text-sm font-medium text-neutral-500 dark:text-neutral-300",
        )}
      >
        {emptyState ?? t("kit.table.empty")}
      </td>
    </tr>
  );

  const renderPanelEmptyState = () => (
    <div className="px-6 py-16 text-center text-sm font-medium text-neutral-500 dark:text-neutral-300">
      {emptyState ?? t("kit.table.empty")}
    </div>
  );

  // ── Row renderer (shared between grouped and flat modes) ──────────────────────
  const renderRow = (
    row: T,
    originalIndex: number,
    isGroupedSubRow = false,
  ) => {
    const key = resolveRowKey(row, originalIndex, rowKey);

    // Check reference or ID match
    const isSelected = selectionLookup?.has(row) || selectionLookup?.has(key);
    const isHighlighted =
      !isSelected && (rowHighlight?.(row, originalIndex) ?? false);

    const selectedClass = isSelected ? getSelectedRowClass(controlColor) : "";
    const highlightRowClass = isHighlighted ? getHighlightRowClass(controlColor) : "";
    const isStripedRow = striped && originalIndex % 2 === 1;
    const baseRowBgClass = isStripedRow
      ? getStripedRowClass(tone)
      : "bg-white dark:bg-neutral-900";
    // The `group-hover:` variant out-specifies the base `bg-*` utility in the
    // cascade, so the whole row shifts uniformly on hover — sticky cells
    // included — without needing `!important`. Striped rows get the deeper
    // step so the hover change stays visible against the zebra wash.
    const rowHoverClass =
      !isSelected && !isHighlighted && hoverable
        ? (rowHoverClassName?.(row, originalIndex) ??
          (isStripedRow
            ? getStripedRowHoverClass(tone)
            : getLightRowHoverClass(tone)))
        : undefined;
    const rowClasses = classNames(
      cellPadding,
      "group",
      isSelected
        ? selectedClass
        : isHighlighted
          ? highlightRowClass
          : isStripedRow && getStripedRowClass(tone),
      isHighlighted && hoverable && "hover:brightness-95",
      "transition-colors duration-150 ease-out",
      onRowClick ? "cursor-pointer" : "cursor-default",
      rowClassName ? rowClassName(row, originalIndex) : undefined,
    );

    return (
      <tr
        key={key}
        className={rowClasses}
        onClick={onRowClick ? () => onRowClick(row, originalIndex) : undefined}
      >
        {/* Expand spacer column — only in grouped mode with visible group headers */}
        {showGroupExpandCol && (
          <td
            className={classNames(
              "w-10 sticky left-0 z-20 transition-colors duration-150 ease-out",
              // Only apply an opaque background when there is a left-sticky data column;
              // otherwise the spacer can remain transparent.
              hasLeftStickyColumn &&
                (isSelected
                  ? getSelectedRowClass(controlColor)
                  : isHighlighted
                    ? getHighlightRowClass(controlColor)
                    : baseRowBgClass),
              rowHoverClass,
            )}
            aria-hidden="true"
          >
            <div className="w-full h-full" />
          </td>
        )}
        {/* Indent spacer — only in grouped mode without group headers */}
        {resolvedGroupBy && !showGroupExpandCol && (
          <td className="w-4" aria-hidden="true" />
        )}
        {orderedVisibleColumns.map((column, colIndex) => {
          const cellValue = resolveValue(row, column, originalIndex);
          // Text cells (string/number) get TruncatedText with a tooltip on actual overflow.
          // JSX cells fall back to the old maxWidth-based truncate class.
          const isTextCell =
            typeof cellValue === "string" || typeof cellValue === "number";

          const tdResizeWidth = internalColWidths[column.id];
          const effectiveSticky = getEffectiveSticky(column);
          const isStickyLeft = effectiveSticky === "left";
          const isStickyRight =
            effectiveSticky === "right" ||
            (stickyActions && colIndex === orderedVisibleColumns.length - 1);
          const rightOffset = isStickyRight
            ? rightStickyOffsets[column.id]
            : undefined;
          return (
            <td
              key={column.id}
              className={classNames(
                "whitespace-nowrap align-middle text-sm text-neutral-700 dark:text-neutral-200",
                // Same transition as the row itself: cells paint their own
                // background (sticky columns, group rows) while the tr paints
                // through the transparent ones, so without this the two layers
                // animate at different speeds and the row visibly tears during
                // the 150ms hover fill.
                "transition-colors duration-150 ease-out",
                (isStickyLeft || isStickyRight) && "sticky",
                isStickyLeft && (showGroupExpandCol ? "left-10" : "left-0"),
                // right position is set via inline style when offset > 0
                isStickyRight && !rightOffset && "right-0",
                (isStickyLeft || isStickyRight) && "z-10",
                (isStickyLeft || isStickyRight) &&
                  (isSelected
                    ? getSelectedRowClass(controlColor)
                    : isHighlighted
                      ? getHighlightRowClass(controlColor)
                      : isStripedRow
                        ? getStripedRowClass(tone)
                        : (column.stickyBackgroundFn?.(row, originalIndex) ??
                          column.stickyBackground ??
                          "bg-white dark:bg-neutral-900")),
                // Same hover fill for every cell (sticky included) — the
                // `group-hover:` variant beats the cell's base background, so
                // the whole row shifts uniformly without scrolled content
                // bleeding through a sticky column.
                rowHoverClass,
                (isStickyLeft || isStickyRight) &&
                  isHighlighted &&
                  hoverable &&
                  "group-hover:brightness-95",
                getCellAlignment(column.align),
                // Horizontal padding. Every cell keeps a symmetric gap so
                // adjacent columns never sit flush (bordered or not) and the
                // body text lines up under the header, which uses the same
                // density cell padding.
                `${sidePaddingTokens.sideLeft} ${sidePaddingTokens.sideRight}`,
                // Vertical rule on the leading edge of the next column.
                gridLinesOn &&
                  colIndex < orderedVisibleColumns.length - 1 &&
                  `${gridLineClass} border-r`,
                // Pulsing left border indicator on the first visible cell for highlighted rows
                colIndex === 0 &&
                  isHighlighted &&
                  classNames(
                    "border-l-4 animate-pulse",
                    getHighlightBorderClass(controlColor),
                  ),
                isStickyRight &&
                  effectiveSticky === "right" &&
                  !noBorders &&
                  "border-l border-neutral-300 dark:border-neutral-700",
                column.className,
              )}
              style={{
                ...(tdResizeWidth
                  ? {
                      width: tdResizeWidth,
                      minWidth: tdResizeWidth,
                      maxWidth: tdResizeWidth,
                    }
                  : applyWidthStyle(
                      column.width,
                      column.minWidth,
                      column.maxWidth,
                    )),
                ...(isStickyRight && rightOffset !== undefined
                  ? { right: rightOffset }
                  : {}),
              }}
            >
              <div
                className={classNames(
                  "flex items-center min-w-0",
                  "py-1",
                  sidePaddingTokens.contentVertical,
                  getCellFlexAlignment(column.align),
                  // For JSX cells with a declared maxWidth, still clip via truncate
                  !isTextCell && column.maxWidth && "truncate",
                  // Add extra left indent to the first data column in grouped sub-rows
                  isGroupedSubRow && colIndex === 0 && "pl-2",
                )}
              >
                {isTextCell ? (
                  <TruncatedText
                    text={String(cellValue)}
                    as="span"
                    delay={2000}
                    noWrapper
                    className="min-w-0 flex-1"
                  />
                ) : (
                  cellValue
                )}
              </div>
            </td>
          );
        })}
      </tr>
    );
  };

  // ── Group label for the config panel ─────────────────────────────────────────
  const getColumnLabel = (col: TableColumn<T>) =>
    typeof col.header === "string" ? col.header : col.id;

  return (
    <Panel
      variant={variant}
      tone={tone}
      padding="none"
      corner={corner}
      scrollable={false}
      flexBody={fullHeight}
      className={wrapperClasses}
      style={style}
    >
      <div
        className={classNames(
          "relative flex flex-col",
          fullHeight && "flex-1 min-h-0 overflow-hidden",
        )}
      >
        {/* ── Header bar ────────────────────────────────────────────────────── */}
        {(headerActions ||
          showViewToggle ||
          (showColumnSelector && hasHideableColumns) ||
          isUserGroupable ||
          userStickyColumns) && (
          <div
            className={classNames(
              "flex-none flex items-center gap-3 border-b px-6 py-3",
              surfaceText.divider,
            )}
          >
            {headerTitle && (
              <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                {headerTitle}
              </div>
            )}
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              {/* View toggle */}
              {showViewToggle && (
                <>
                  <IconButton
                    icon="ViewRows"
                    size="xs"
                    variant="ghost"
                    color={controlColor}
                    tooltip="Table view"
                    tooltipPosition="bottom"
                    disabled={activeView === "table"}
                    aria-pressed={activeView === "table"}
                    onClick={() => {
                      setActiveView("table");
                      onViewChange?.("table");
                      emitSettingsChange({
                        ...settingsSnapshotRef.current,
                        activeView: "table",
                      });
                    }}
                    aria-label="Switch to table view"
                  />
                  <IconButton
                    icon="ViewGrid"
                    size="xs"
                    variant="ghost"
                    color={controlColor}
                    tooltip="Panel view"
                    tooltipPosition="bottom"
                    disabled={activeView === "panel"}
                    aria-pressed={activeView === "panel"}
                    onClick={() => {
                      setActiveView("panel");
                      onViewChange?.("panel");
                      emitSettingsChange({
                        ...settingsSnapshotRef.current,
                        activeView: "panel",
                      });
                    }}
                    aria-label="Switch to panel view"
                  />
                </>
              )}

              {/* Column visibility toggle — table view only */}
              {showColumnSelector &&
                hasHideableColumns &&
                activeView === "table" && (
                  <div className="relative" ref={colPanelRef}>
                    <IconButton
                      icon="EyeOpen"
                      size="xs"
                      variant="ghost"
                      color={controlColor}
                      tooltip="Columns"
                      tooltipPosition="bottom"
                      aria-pressed={colPanelOpen}
                      onClick={() => setColPanelOpen((o) => !o)}
                      aria-label="Toggle column visibility"
                    />
                    {colPanelOpen && (
                      <div className="absolute right-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-800">
                          Columns
                        </div>
                        <div className="py-1 max-h-64 overflow-y-auto">
                          {menuColumns.map((col) => {
                            const hideable = col.hideable !== false;
                            const visible = colVisibility[col.id] !== false;
                            const label =
                              typeof col.header === "string"
                                ? col.header
                                : col.id;
                            return (
                              <label
                                key={col.id}
                                className={classNames(
                                  "flex items-center gap-2.5 px-3 py-1.5 text-sm select-none",
                                  hideable
                                    ? "cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                                    : "cursor-not-allowed opacity-40",
                                )}
                              >
                                <input
                                  type="checkbox"
                                  checked={visible}
                                  disabled={!hideable}
                                  onChange={() => {
                                    const next = {
                                      ...colVisibility,
                                      [col.id]: !visible,
                                    };
                                    setColVisibility(next);
                                    onColumnVisibilityChange?.(next);
                                    emitSettingsChange({
                                      ...settingsSnapshotRef.current,
                                      columnVisibility: next,
                                    });
                                  }}
                                  className={classNames(
                                    "h-3.5 w-3.5 rounded border-neutral-300",
                                    getAccentClass(controlColor),
                                  )}
                                />
                                <span className="text-neutral-700 dark:text-neutral-200">
                                  {label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                        <div className="border-t border-neutral-100 px-3 py-2 dark:border-neutral-800">
                          <Button
                            variant="ghost"
                            color={controlColor}
                            size="xs"
                            onClick={() => {
                              const reset: Record<string, boolean> = {};
                              for (const col of effectiveColumns) {
                                reset[col.id] = getDefaultColumnVisibility(col);
                              }
                              setColVisibility(reset);
                              onColumnVisibilityChange?.(reset);
                              emitSettingsChange({
                                ...settingsSnapshotRef.current,
                                columnVisibility: reset,
                              });
                            }}
                          >
                            Reset to default
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {/* Group-by config button — table view only */}
              {isUserGroupable && activeView === "table" && (
                <div className="relative" ref={groupPanelRef}>
                  {/* Wrapper to position the active indicator dot */}
                  <div className="relative inline-flex">
                    <IconButton
                      icon="Group"
                      size="xs"
                      variant="ghost"
                      color={controlColor}
                      tooltip="Group by"
                      tooltipPosition="bottom"
                      aria-pressed={groupPanelOpen || !!resolvedGroupBy}
                      onClick={() => setGroupPanelOpen((o) => !o)}
                      aria-label="Configure row grouping"
                    />
                    {/* Active indicator dot */}
                    {resolvedGroupBy && (
                      <span
                        className={classNames(
                          "pointer-events-none absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2 ring-white dark:ring-neutral-900",
                          getDotColorClass(controlColor),
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {groupPanelOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1 min-w-[220px] rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                      {/* Panel header */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                          Group by
                        </span>
                        {internalGroupBy && (
                          <button
                            type="button"
                            onClick={() => handleGroupChange(null)}
                            className="text-xs text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {/* Column radio list — shows ALL columns (even hidden), excludes groupable:false */}
                      <div className="py-1 max-h-64 overflow-y-auto">
                        <label className="flex items-center gap-2.5 px-3 py-1.5 text-sm select-none cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                          <input
                            type="radio"
                            name="table-group-by"
                            checked={!internalGroupBy}
                            onChange={() => handleGroupChange(null)}
                            className={classNames(
                              "h-3.5 w-3.5 border-neutral-300",
                              getAccentClass(controlColor),
                            )}
                          />
                          <span className="italic text-neutral-400 dark:text-neutral-500">
                            None
                          </span>
                        </label>
                        {menuColumns
                          .filter((col) => col.groupable !== false)
                          .map((col) => (
                            <label
                              key={col.id}
                              className="flex items-center gap-2.5 px-3 py-1.5 text-sm select-none cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                            >
                              <input
                                type="radio"
                                name="table-group-by"
                                checked={internalGroupBy === col.id}
                                onChange={() => handleGroupChange(col.id)}
                                className={classNames(
                                  "h-3.5 w-3.5 border-neutral-300",
                                  getAccentClass(controlColor),
                                )}
                              />
                              <span className="text-neutral-700 dark:text-neutral-200">
                                {getColumnLabel(col)}
                              </span>
                              {/* Show "(hidden)" hint when the column is currently not visible */}
                              {colVisibility[col.id] === false && (
                                <span className="ml-auto text-xs text-neutral-400 dark:text-neutral-500">
                                  hidden
                                </span>
                              )}
                            </label>
                          ))}
                      </div>

                      {/* Show group header toggle */}
                      <div className="border-t border-neutral-100 px-3 py-2.5 dark:border-neutral-800">
                        <label className="flex items-center gap-2.5 text-sm select-none cursor-pointer">
                          <input
                            type="checkbox"
                            checked={resolvedShowGroupHeader}
                            onChange={() => {
                              const next = !resolvedShowGroupHeader;
                              setShowGroupHeaderLocal(next);
                              emitSettingsChange({
                                ...settingsSnapshotRef.current,
                                showGroupHeader: next,
                              });
                            }}
                            className={classNames(
                              "h-3.5 w-3.5 rounded border-neutral-300",
                              getAccentClass(controlColor),
                            )}
                          />
                          <span className="text-neutral-700 dark:text-neutral-200">
                            Show group header
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sticky column picker — table view only */}
              {userStickyColumns && activeView === "table" && (
                <div className="relative" ref={stickyPanelRef}>
                  <div className="relative inline-flex">
                    <IconButton
                      icon="Pin"
                      size="xs"
                      variant="ghost"
                      color={controlColor}
                      tooltip="Sticky columns"
                      tooltipPosition="bottom"
                      aria-pressed={stickyPanelOpen || hasStickyColumns}
                      onClick={() => setStickyPanelOpen((o) => !o)}
                      aria-label="Configure sticky columns"
                    />
                    {hasStickyColumns && (
                      <span
                        className={classNames(
                          "pointer-events-none absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2 ring-white dark:ring-neutral-900",
                          getDotColorClass(controlColor),
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {stickyPanelOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1 min-w-[240px] rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                      {/* Panel header */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                          Sticky columns
                        </span>
                        {hasStickyColumns && (
                          <button
                            type="button"
                            onClick={() => {
                              setInternalStickyColumns({});
                              onStickyColumnsChange?.({});
                            }}
                            className="text-xs text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
                          >
                            Clear all
                          </button>
                        )}
                      </div>

                      {/* Column list */}
                      <div className="py-1 max-h-64 overflow-y-auto">
                        {menuColumns.map((col) => {
                          const label = getColumnLabel(col);
                          const current = internalStickyColumns[col.id] ?? null;
                          return (
                            <div
                              key={col.id}
                              className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                            >
                              <span className="flex-1 truncate text-neutral-700 dark:text-neutral-200">
                                {label}
                              </span>
                              {/* Left / None / Right toggle */}
                              <div className="flex items-center rounded-md border border-neutral-200 dark:border-neutral-700 overflow-hidden text-xs">
                                {(["left", null, "right"] as const).map(
                                  (side) => (
                                    <button
                                      key={String(side)}
                                      type="button"
                                      onClick={() =>
                                        handleStickyChange(col.id, side)
                                      }
                                      className={classNames(
                                        "px-2 py-0.5 transition-colors select-none",
                                        current === side
                                          ? "bg-neutral-200 dark:bg-neutral-700 font-semibold text-neutral-900 dark:text-neutral-100"
                                          : "text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-500",
                                      )}
                                    >
                                      {side === "left"
                                        ? "←"
                                        : side === "right"
                                          ? "→"
                                          : "·"}
                                    </button>
                                  ),
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Legend */}
                      <div className="border-t border-neutral-100 px-3 py-2 dark:border-neutral-800">
                        <span className="text-xs text-neutral-400 dark:text-neutral-500">
                          ← pin left &nbsp;·&nbsp; · unpin &nbsp;·&nbsp; → pin
                          right
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {headerActions}
            </div>
          </div>
        )}

        {/* ── Table view ────────────────────────────────────────────────────── */}
        {activeView === "table" && visibleColumns.length > 0 && (
          <div
            className={classNames("relative", fullHeight && "flex-1 min-h-0")}
            aria-busy={loading || undefined}
          >
            {/*
              The Loader is pinned to this wrapper, not the scroll container
              below — inside a scroll container an `absolute inset-0` overlay
              scrolls away with the content and stops covering the viewport.
            */}
            {loading && loaderType !== "skeleton" && (
              <Loader
                overlay
                variant={loaderType}
                label={loadingMessage}
                progress={loaderProgress}
                className="rounded-none"
              />
            )}
            <div
              ref={scrollContainerRef}
              onScroll={handleGuideScroll}
              className={classNames(
                "overflow-x-auto relative",
                fullHeight ? "h-full overflow-y-auto" : "",
                !fullHeight && maxHeight && "overflow-y-auto",
              )}
              style={!fullHeight ? scrollContainerStyle : undefined}
            >
              <div className="relative">
              {showSkeleton ? (
                <TableSkeleton
                  columns={orderedVisibleColumns.length}
                  rows={skeletonRows}
                />
              ) : (
              <>
              <table
                className={tableClasses}
                style={
                  useFixedLayout
                    ? { tableLayout: "fixed", width: "100%" }
                    : undefined
                }
              >
                {/* Colgroup drives precise column widths in fixed layout */}
                {useFixedLayout && (
                  <colgroup>
                    {showGroupExpandCol && <col style={{ width: "2.5rem" }} />}
                    {resolvedGroupBy && !showGroupExpandCol && (
                      <col style={{ width: "1rem" }} />
                    )}
                    {orderedVisibleColumns.map((col) => {
                      const resizedW = internalColWidths[col.id];
                      if (resizedW)
                        return (
                          <col
                            key={col.id}
                            style={{
                              width: `${resizedW}px`,
                              minWidth: `${resizedW}px`,
                            }}
                          />
                        );
                      // For non-resized columns, honour width/minWidth so fixed layout can't squeeze them below their declared minimum
                      const declaredW =
                        col.width !== undefined
                          ? typeof col.width === "number"
                            ? col.width
                            : col.width
                          : undefined;
                      const declaredMin =
                        col.minWidth !== undefined
                          ? typeof col.minWidth === "number"
                            ? col.minWidth
                            : col.minWidth
                          : undefined;
                      const colW = declaredW ?? declaredMin;
                      return (
                        <col
                          key={col.id}
                          style={
                            colW !== undefined
                              ? {
                                  width:
                                    typeof colW === "number"
                                      ? `${colW}px`
                                      : colW,
                                  minWidth:
                                    typeof colW === "number"
                                      ? `${colW}px`
                                      : colW,
                                }
                              : undefined
                          }
                        />
                      );
                    })}
                  </colgroup>
                )}
                <thead>
                  <tr
                    className={classNames(
                      headerToneClasses,
                      "border-b dark:border-opacity-60",
                    )}
                  >
                    {/* Extra leading th for expand/collapse when grouping with group headers */}
                    {showGroupExpandCol && (
                      <th
                        scope="col"
                        className={classNames(
                          headerToneClasses,
                          "sticky left-0",
                          stickyHeader && "top-0",
                          stickyHeader ? "z-30" : "z-10",
                          "w-10 pl-3 pr-1",
                        )}
                        aria-hidden="true"
                      >
                        <div className="w-full h-full" />
                      </th>
                    )}
                    {/* Indent spacer th for grouped mode without group headers */}
                    {resolvedGroupBy && !showGroupExpandCol && (
                      <th scope="col" className="w-4" aria-hidden="true" />
                    )}
                    {orderedVisibleColumns.map((column, colIndex) => {
                      const isSorted = resolvedSort?.columnId === column.id;
                      const sortDirection = isSorted
                        ? resolvedSort?.direction
                        : undefined;

                      const isResizable =
                        resizableColumns && column.resizable !== false;
                      const resizeWidth = internalColWidths[column.id];
                      const thEffectiveSticky = getEffectiveSticky(column);
                      const isStickyLeft = thEffectiveSticky === "left";
                      const isStickyRight =
                        thEffectiveSticky === "right" ||
                        (stickyActions &&
                          colIndex === orderedVisibleColumns.length - 1);
                      const rightOffset = isStickyRight
                        ? rightStickyOffsets[column.id]
                        : undefined;

                      return (
                        <th
                          key={column.id}
                          ref={(el) => {
                            thRefs.current[column.id] = el;
                          }}
                          scope="col"
                          className={classNames(
                            headerBaseClasses,
                            headerToneClasses,
                            cellPadding,
                            stickyHeader && "sticky top-0",
                            (isStickyLeft || isStickyRight) && "sticky",
                            isStickyLeft &&
                              (showGroupExpandCol ? "left-10" : "left-0"),
                            // right position is set via inline style when offset > 0
                            isStickyRight && !rightOffset && "right-0",
                            stickyHeader && (isStickyLeft || isStickyRight)
                              ? "z-30"
                              : stickyHeader
                                ? "z-20"
                                : isStickyLeft || isStickyRight
                                  ? "z-10"
                                  : "",
                             getCellAlignment(column.align),
                             "overflow-hidden",
                             isResizable && "relative",
                             isStickyRight &&
                               thEffectiveSticky === "right" &&
                               !noBorders &&
                               "border-l border-neutral-200 dark:border-neutral-700",
                              // The resize handle already marks each column
                              // edge, so the grid rule is skipped while resizing.
                              gridLinesOn &&
                                !isResizable &&
                                colIndex < orderedVisibleColumns.length - 1 &&
                                `${gridLineClass} border-r`,
                              column.headerClassName,
                           )}
                          style={{
                            ...(resizeWidth
                              ? {
                                  width: resizeWidth,
                                  minWidth: resizeWidth,
                                  maxWidth: resizeWidth,
                                }
                              : applyWidthStyle(
                                  column.width,
                                  column.minWidth,
                                  column.maxWidth,
                                )),
                            ...(isStickyRight && rightOffset !== undefined
                              ? { right: rightOffset }
                              : {}),
                          }}
                          aria-sort={
                            sortDirection
                              ? sortDirection === "asc"
                                ? "ascending"
                                : "descending"
                              : column.sortable
                                ? // "other" = sortable but not currently sorted
                                  // ("none" would falsely claim the column
                                  // can't be sorted at all).
                                  "other"
                                : "none"
                          }
                          title={column.tooltip}
                        >
                          <div
                            className={classNames(
                              "flex items-center gap-1 min-w-0",
                              column.align === "right"
                                ? "justify-end"
                                : column.align === "center"
                                  ? "justify-center"
                                  : "justify-start",
                            )}
                          >
                            <span className="truncate min-w-0 flex-1">
                              {column.header}
                            </span>
                            {column.sortable ? (
                              <IconButton
                                icon={
                                  sortDirection
                                    ? sortIconMap[sortDirection]
                                    : sortIconMap.default
                                }
                                size="xs"
                                variant="icon"
                                color={isSorted ? controlColor : "slate"}
                                rounded="md"
                                accent={false}
                                tooltip={
                                  sortDirection === "asc"
                                    ? "Sort descending"
                                    : sortDirection === "desc"
                                      ? "Clear sort"
                                      : "Sort ascending"
                                }
                                tooltipPosition="bottom"
                                className={classNames(
                                  "ml-1 flex-shrink-0",
                                  !isSorted &&
                                    "text-neutral-400 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200",
                                )}
                                onClick={() => handleSortToggle(column)}
                                aria-label="Toggle sort"
                              />
                            ) : null}
                          </div>
                          {/* Resize handle */}
                          {isResizable && (
                            <div
                              role="separator"
                              aria-hidden="true"
                              className="group/rh absolute inset-y-0 right-0 z-10 flex w-2 cursor-col-resize select-none items-center justify-center"
                              onMouseEnter={() => {
                                const left = computeGuideLeft(column.id);
                                if (left != null)
                                  setResizeGuide({ colId: column.id, left });
                              }}
                              onMouseLeave={() => {
                                if (!resizingRef.current) setResizeGuide(null);
                              }}
                              onMouseDown={(e) => {
                                const minW =
                                  column.minWidth !== undefined
                                    ? typeof column.minWidth === "number"
                                      ? column.minWidth
                                      : parseInt(column.minWidth, 10)
                                    : 48;
                                handleResizeStart(
                                  e,
                                  column.id,
                                  Math.max(48, isNaN(minW) ? 48 : minW),
                                );
                              }}
                            >
                              <div
                                className={classNames(
                                  "h-1/2 w-px bg-neutral-300 dark:bg-neutral-600 transition-colors",
                                  getResizeHandleHoverClass(controlColor),
                                )}
                              />
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className={tbodyClasses}>
                  {/* ── Grouped rendering ─────────────────────────────── */}
                  {groupedData
                    ? hasRows
                      ? groupedData.map((group) => {
                          const isExpanded =
                            expandedGroups[group.key] !== false;
                          return (
                            <React.Fragment key={`group-${group.key}`}>
                              {/* Group header row */}
                              {resolvedShowGroupHeader && (
                                <tr
                                   className={classNames(
                                     "cursor-pointer select-none border-b transition-colors duration-150 ease-out",
                                     getGroupHeaderBorderClass(tone),
                                     getGroupHeaderClass(tone),
                                   )}
                                  onClick={() => toggleGroup(group.key)}
                                >
                                   <td
                                     colSpan={visibleColumns.length + 1}
                                     className={classNames(
                                       "py-2 transition-colors duration-150 ease-out",
                                       getGroupHeaderClass(tone),
                                     )}
                                   >
                                    <div
                                      className={classNames(
                                        "sticky left-0 flex w-fit items-center gap-2 bg-inherit rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                                        focusRingClass,
                                        sidePaddingTokens.sideLeft,
                                      )}
                                      role="button"
                                      tabIndex={0}
                                      aria-expanded={isExpanded}
                                      aria-label={`${
                                        isExpanded ? "Collapse" : "Expand"
                                      } group ${group.display}`}
                                      onKeyDown={(e) => {
                                        // The row click covers the mouse; this
                                        // makes the toggle reachable by
                                        // keyboard (Enter / Space).
                                        if (
                                          e.key === "Enter" ||
                                          e.key === " "
                                        ) {
                                          e.preventDefault();
                                          toggleGroup(group.key);
                                        }
                                      }}
                                    >
                                      <span
                                        className={classNames(
                                          "inline-flex text-neutral-400 dark:text-neutral-500",
                                        )}
                                      >
                                        <ChevronSvg expanded={isExpanded} />
                                      </span>
                                      <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                                        {group.display || (
                                          <span className="italic text-neutral-400 dark:text-neutral-500">
                                            empty
                                          </span>
                                        )}
                                      </span>
                                      <Badge
                                        count={group.rows.length}
                                        tone={controlColor}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              )}
                              {/* Sub-rows — hidden when collapsed */}
                              {(isExpanded || !resolvedShowGroupHeader) &&
                                group.rows.map(({ row, originalIndex }) =>
                                  renderRow(row, originalIndex, true),
                                )}
                            </React.Fragment>
                          );
                        })
                      : renderEmptyState()
                    : /* ── Flat (ungrouped) rendering ──────────────────── */
                      hasRows
                      ? sortedData.map((row, rowIndex) =>
                          renderRow(row, rowIndex, false),
                        )
                      : renderEmptyState()}
                </tbody>
              </table>
              {/* Full-height column-resize guide, spanning the whole table. */}
              {resizeGuide && (
                <div
                  aria-hidden="true"
                  className={classNames(
                    "pointer-events-none absolute inset-y-0 z-30 w-0.5",
                    gridLinesOn
                      ? getResizeGuideColorClass(controlColor)
                      : "bg-neutral-300 dark:bg-neutral-600",
                  )}
                  style={{ left: resizeGuide.left }}
                />
              )}
              </>
              )}
              </div>
            </div>
          </div>
        )}

        {/* ── Panel view ────────────────────────────────────────────────────── */}
        {activeView === "panel" && panelItem && (
          <div
            className={classNames("relative", fullHeight && "flex-1 min-h-0")}
            aria-busy={loading || undefined}
          >
            {loading && loaderType !== "skeleton" && (
              <Loader
                overlay
                variant={loaderType}
                label={loadingMessage}
                progress={loaderProgress}
                className="rounded-none"
              />
            )}
            <div
              className={classNames(
                "overflow-x-auto",
                fullHeight ? "h-full overflow-y-auto" : "",
                !fullHeight && maxHeight && "overflow-y-auto",
              )}
              style={!fullHeight ? scrollContainerStyle : undefined}
            >
            {showSkeleton ? (
              <PanelCardSkeleton rows={skeletonRows} />
            ) : hasRows ? (
              <div
                className={classNames(
                  "p-4",
                  panelMinItemWidth != null
                    ? // auto-fill mode: grid base + any extra non-layout classes from consumer
                      // gap is intentionally excluded here — it lives in the inline style below
                      classNames("grid", panelGridClassName)
                    : // legacy / explicit class mode (gap lives in the class string as before)
                      (panelGridClassName ??
                        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"),
                )}
                style={
                  panelMinItemWidth != null
                    ? (() => {
                        const minW =
                          typeof panelMinItemWidth === "number"
                            ? `${panelMinItemWidth}px`
                            : panelMinItemWidth;
                        const maxW =
                          panelMaxItemWidth != null
                            ? `min(${typeof panelMaxItemWidth === "number" ? `${panelMaxItemWidth}px` : panelMaxItemWidth}, 1fr)`
                            : "1fr";
                        return {
                          gridTemplateColumns: `repeat(auto-fill, minmax(min(${minW}, 100%), ${maxW}))`,
                          gap:
                            panelGap != null
                              ? typeof panelGap === "number"
                                ? `${panelGap}px`
                                : panelGap
                              : "1rem",
                        };
                      })()
                    : undefined
                }
              >
                {panelRows.map((row, rowIndex) => (
                  <React.Fragment key={resolveRowKey(row, rowIndex, rowKey)}>
                    {panelItem(row, rowIndex)}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              renderPanelEmptyState()
            )}
            </div>
          </div>
        )}

        {/* ── Footer / pagination ───────────────────────────────────────────── */}
        {(footer || (pagination && pagination.total > 0)) && (
          <div
            className={classNames(
              "border-t px-6 py-3 text-sm text-neutral-600 dark:text-neutral-300",
              // The footer band is interior chrome — on a see-through surface
              // an opaque `bg-neutral-50` strip would seal the bottom of the
              // glass, so it drops to the same translucent fill as the header.
              surfaceText.translucent
                ? "bg-white/20 dark:bg-white/5"
                : "bg-neutral-50 dark:bg-neutral-900/60",
              surfaceText.divider,
            )}
          >
            {footer
              ? footer
              : pagination && (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Showing{" "}
                        {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
                        {Math.min(
                          pagination.page * pagination.pageSize,
                          pagination.total,
                        )}{" "}
                        of {pagination.total} results
                      </span>
                      <div className="w-32 ml-4">
                        <Select
                          value={pagination.pageSize}
                          onChange={(e) => {
                            pagination.onPageSizeChange(Number(e.target.value));
                          }}
                          size="sm"
                        >
                          {Array.from(
                            new Set([20, 50, 100, pagination.pageSize]),
                          )
                            .sort((a, b) => a - b)
                            .map((size) => (
                              <option key={size} value={size}>
                                {size} per page
                              </option>
                            ))}
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="soft"
                        color={controlColor}
                        size="sm"
                        disabled={pagination.page === 1 || loading}
                        onClick={() =>
                          pagination.onPageChange(
                            Math.max(1, pagination.page - 1),
                          )
                        }
                        leadingIcon="ArrowLeft"
                      >
                        Previous
                      </Button>
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Page {pagination.page} of{" "}
                        {Math.ceil(pagination.total / pagination.pageSize)}
                      </span>
                      <Button
                        variant="soft"
                        color={controlColor}
                        size="sm"
                        disabled={
                          pagination.page >=
                            Math.ceil(pagination.total / pagination.pageSize) ||
                          loading
                        }
                        onClick={() =>
                          pagination.onPageChange(
                            Math.min(
                              Math.ceil(pagination.total / pagination.pageSize),
                              pagination.page + 1,
                            ),
                          )
                        }
                        trailingIcon="ArrowRight"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
          </div>
        )}
      </div>
    </Panel>
  );
}

export function Table<T>(props: TableProps<T>): React.ReactElement {
  return <TableComponent {...props} />;
}

export default Table;
