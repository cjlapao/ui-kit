import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// Direct, not `from "."`: the barrel re-exports this component, so going
// through it makes a cycle — and a partially-initialised barrel is what
// produces "does not provide an export named default" under HMR.
import Button from "./Button";
import { CustomIcon } from "./CustomIcon";
import IconButton from "./IconButton";
import Input from "./Input";
import SmartGridItemPalette from "./SmartGridItemPalette";
import SmartGridTileBoundary from "./SmartGridTileBoundary";
import {
  CONTROL_SIZES,
  PLAIN_SURFACE_VARIANTS,
  TRUE_COLORS,
  getPanelToneStyles,
  getSurfaceTextTokens,
  getSurfaceVariantClasses,
  type ButtonVariant,
  type ControlSize,
  type PlainSurfaceVariant,
  type TrueColor,
} from "../theme";
import {
  GRID_STORAGE_DEFAULT_PREFIX,
  buildGridStorageKey,
  createSafeLocalStorage,
  decodeStoredLayout,
  encodeStoredLayout,
  type GridStorageAdapter,
} from "../utils/gridStorage";

export interface SmartGridItemDefinition {
  id: string;
  title: string;
  description?: string;
  screenshot?: string;
  defaultSpan?: number;
  defaultRowHeightSpan?: number;
  active: boolean;
  single: boolean;
  render: () => React.ReactNode;
  isSpacer?: boolean;
}

export interface SmartGridItem {
  definitionId: string;
  id: string;
  span: number;
  order: number;
  sectionId: string;
  rowId: string;
  isSpacer?: boolean;
}

export interface SmartGridRow {
  id: string;
  items: SmartGridItem[];
  order: number;
  height?: number;
  heightSpan?: number;
}

export interface SmartGridSection {
  id: string;
  title: string;
  rows: SmartGridRow[];
  order: number;
}

export interface SmartGridSectionDefinition {
  id?: string;
  title: string;
  rows: SmartGridRowDefinition[];
}

export interface SmartGridRowDefinition {
  id?: number;
  itemIds: string[];
  defaultHeightSpan?: number;
}

export interface SmartGridLayoutState {
  version: 3;
  sections: SmartGridSection[];
}

export interface SmartGridLayoutProps {
  items: SmartGridItemDefinition[];
  defaultLayout: SmartGridSectionDefinition[];
  persistedLayout?: SmartGridLayoutState | null;
  onLayoutChange?: (layout: SmartGridLayoutState) => void;
  /**
   * Columns in the grid. A number, or a per-breakpoint map so a dashboard
   * stays readable on a narrow screen.
   * @default 12
   */
  maxColumns?: number | SmartGridColumns;
  className?: string;
  /** Accent for edit mode — tile outlines, drop indicators, resize handles. */
  tone?: TrueColor;
  /** @deprecated Use `tone`, which is what every other component calls it. */
  editThemeColor?: TrueColor;
  /**
   * The surface family, shared with `Panel`, plus `plain` for none at all.
   * @default "plain"
   */
  variant?: SmartGridVariant;
  /**
   * Tone of the *surface*, separate from the accent `tone`. A whole dashboard
   * tinted in the edit accent is a lot of colour, and the accent's job is to
   * stand out against the surface rather than match it.
   * @default "neutral"
   */
  surfaceTone?: TrueColor;
  /** Grid gap, tile padding and the row-height unit. @default "md" */
  size?: SmartGridSize;
  /**
   * Surface for the editor's own controls, independent of the body.
   *
   * They follow `variant` by default, which is right most of the time — but a
   * `plain` dashboard over a photograph wants `glass` controls while its body
   * draws nothing, and the two cannot be expressed with one prop.
   */
  controlVariant?: ButtonVariant;
  /**
   * Renders the dashboard with no editing affordances at all — no toolbar, no
   * drag handles, no resize grips, and edit mode cannot be entered.
   *
   * Distinct from `isEditMode={false}`, which merely hides the chrome while
   * leaving the machinery mounted and reachable.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Called when a tile throws while rendering. The tile is replaced with a
   * fallback and the rest of the dashboard keeps working.
   */
  onTileError?: (error: Error, title: string) => void;
  /**
   * How many steps of undo to keep within an edit session. `0` disables
   * undo/redo entirely.
   * @default 50
   */
  historyLimit?: number;
  /**
   * Controlled edit mode. Omit it and the component owns the state itself,
   * reporting changes through `onEditModeChange`.
   */
  isEditMode?: boolean;
  /** Uncontrolled starting state. @default false */
  defaultEditMode?: boolean;
  /**
   * Fires whenever edit mode changes, controlled or not.
   *
   * This was declared on the props and never called anywhere in the file, so
   * the component could not ask its host to leave edit mode — and with
   * `isEditMode` controlled-only there was no in-component way out at all.
   */
  onEditModeChange?: (isEditMode: boolean) => void;

  // ── Built-in layout persistence ───────────────────────────────────────────
  /**
   * Enables built-in persistence, exactly as on `Table`. When set, the grid
   * restores its layout from storage on mount and saves after every change,
   * under `{storagePrefix}:{storageKey}` (default prefix `ui-kit:grid`).
   *
   * Omit it and the component stays fully manual: pass `persistedLayout` and
   * handle `onLayoutChange` yourself.
   */
  storageKey?: string;
  /** Prefix for the composed storage key. @default "ui-kit:grid" */
  storagePrefix?: string;
  /**
   * Where the layout is read from and written to. Defaults to a best-effort
   * localStorage wrapper that never throws.
   */
  storage?: GridStorageAdapter;
  /**
   * Writes to storage as the layout changes. Turn it off to restore on mount
   * but save only when you call `onLayoutChange` yourself.
   * @default true
   */
  autoSave?: boolean;
  /**
   * How long to wait after the last change before writing, in ms.
   *
   * Not optional in spirit: column and row resizing update the layout on every
   * mousemove, so an unthrottled write would serialise the whole dashboard
   * dozens of times a second.
   * @default 400
   */
  autoSaveDebounceMs?: number;
}

/**
 * Column count per breakpoint, matching Tailwind's own widths.
 *
 * A single number is still accepted. It was the only option, which meant a
 * 12-column dashboard stayed 12 columns on a phone — every tile a sliver.
 */
export interface SmartGridColumns {
  /** Below 640px. */
  base?: number;
  /** ≥640px. */
  sm?: number;
  /** ≥768px. */
  md?: number;
  /** ≥1024px. */
  lg?: number;
  /** ≥1280px. */
  xl?: number;
}

const COLUMN_BREAKPOINTS: { key: keyof SmartGridColumns; min: number }[] = [
  { key: "xl", min: 1280 },
  { key: "lg", min: 1024 },
  { key: "md", min: 768 },
  { key: "sm", min: 640 },
  { key: "base", min: 0 },
];

/**
 * Resolve against a measured width. Falls back *down* the scale, so
 * `{ base: 4, lg: 12 }` gives 4 columns until 1024px rather than nothing.
 */
const resolveColumns = (
  columns: number | SmartGridColumns,
  width: number,
): number => {
  if (typeof columns === "number") return Math.max(1, Math.round(columns));
  const applicable = COLUMN_BREAKPOINTS.filter((bp) => width >= bp.min);
  for (const bp of applicable) {
    const value = columns[bp.key];
    if (typeof value === "number") return Math.max(1, Math.round(value));
  }
  // Nothing at or below the current width — take the smallest defined.
  for (const bp of [...COLUMN_BREAKPOINTS].reverse()) {
    const value = columns[bp.key];
    if (typeof value === "number") return Math.max(1, Math.round(value));
  }
  return 12;
};

interface ResizeState {
  leftId: string;
  rightId: string;
  startX: number;
  startLeftSpan: number;
  pairTotal: number;
  colWidth: number;
}

interface RowResizeState {
  rowId: string;
  sectionId: string;
  startY: number;
  startHeight: number;
  startHeightSpan: number;
}

interface DragOverState {
  id: string;
  position: "before" | "after";
}

interface RowAddTargetState {
  sectionId: string;
  rowId: string;
}

interface RowPreviewState {
  sectionId: string;
  rowId: string;
  insertIndex: number;
}

const ROW_SPAN_SIZE = 100;
const MAX_ROW_SPANS = 12;
const SPACER_PREFIX = "spacer:";

/**
 * How far past a row's edge the pointer must travel before another row can
 * take the drop preview from it. See `rowOwnsPointer`.
 */
const ROW_SWITCH_MARGIN_PX = 24;

/**
 * Sections are dragged with their own MIME type rather than sharing
 * `text/plain` with items.
 *
 * The item drop handlers read `text/plain` and look the value up as an item
 * id; a section id arriving there would miss, and every item drop zone in the
 * grid would light up while dragging a section. A separate type means each
 * kind of drag is only visible to the handlers that understand it.
 */
const SECTION_MIME = "application/x-smartgrid-section";

/**
 * The edit-mode accent, generated from `TRUE_COLORS`.
 *
 * This replaces a hand-written map of **10 tones out of 21** — pass `teal`,
 * `indigo`, `purple`, `pink`, `red`, `green`, `yellow`, `cyan`, `slate`,
 * `gray`, `zinc` or `stone` and it silently rendered blue. It also carried
 * hardcoded `rgb: "59,130,246"` triplets, a third copy of the palette in a
 * third format; the tint is a plain alpha utility now.
 *
 * The class shapes are declared in `scripts/generate-safelist.mjs`.
 */
type EditToneTokens = {
  /** Dashed outline around a draggable tile. */
  border: string;
  /** Fill behind a draggable tile. */
  tint: string;
  /** Solid accent for drop indicators and the resize handle. */
  solid: string;
};

const EDIT_TONE_TOKENS: Record<TrueColor, EditToneTokens> = Object.fromEntries(
  TRUE_COLORS.map((c) => [
    c,
    {
      border: `border-${c}-300 dark:border-${c}-700`,
      tint: `bg-${c}-500/10`,
      solid: `bg-${c}-500 dark:bg-${c}-400`,
    },
  ]),
) as Record<TrueColor, EditToneTokens>;

const getEditToneTokens = (tone: TrueColor): EditToneTokens =>
  EDIT_TONE_TOKENS[tone] ?? EDIT_TONE_TOKENS.blue;

/**
 * Which `Button` variant the editor's own controls take for a given surface.
 *
 * They were pinned to `outline` / `ghost` with a hardcoded `slate` accent, so
 * the editing chrome looked the same on a glass dashboard as on an elevated
 * one — the one part of the component that ignored its own `variant`.
 */
/**
 * A deliberate exception to `EDITOR_BUTTON_FOR_SURFACE`.
 *
 * The icon actions attached to a *row or section* — add an item, remove a row,
 * remove a section — stay `ghost` whatever surface the dashboard has. They sit
 * in the margins beside content rather than in the toolbar, and giving them
 * the toolbar's treatment made a column of bordered chips running down the
 * left edge of every row.
 */
const ROW_ICON_VARIANT: ButtonVariant = "ghost";

const EDITOR_BUTTON_FOR_SURFACE: Record<PlainSurfaceVariant, ButtonVariant> = {
  // `plain` means "the background is unknown". Glass is the treatment built
  // for exactly that: a frosted backdrop reads on a white page and on a photo.
  plain: "glass",
  elevated: "outline",
  outlined: "outline",
  default: "outline",
  subtle: "ghost",
  tonal: "ghost",
  simple: "ghost",
  glass: "glass",
  "liquid-glass": "glass",
};

/**
 * The shared surface family, **plus `plain`** — no background, border, shadow,
 * ring, radius or padding at all.
 *
 * `plain` is the default. A dashboard is nearly always dropped into a page
 * that already has its own container, and drawing a second panel around it
 * produced a grey slab floating over whatever was behind — obvious the moment
 * the host had a background image. Ask for a surface when you want one.
 */
export { PLAIN_SURFACE_VARIANTS as SMART_GRID_VARIANTS };
export type SmartGridVariant = PlainSurfaceVariant;
export { CONTROL_SIZES as SMART_GRID_SIZES };
export type SmartGridSize = ControlSize;

/**
 * Grid gap, tile padding and the row-height unit per size. All three were
 * fixed constants — `GRID_GAP_PX = 16` and `ROW_SPAN_SIZE = 100` — so a dense
 * dashboard and a spacious one were the same dashboard.
 */
const SIZE_TOKENS: Record<
  ControlSize,
  {
    gapPx: number;
    gapClass: string;
    /** Vertical gap between rows — matched to the column gap. */
    rowGap: string;
    /** Inner padding of the whole grid surface. */
    pad: string;
    rowUnit: number;
    title: string;
    label: string;
  }
> = {
  xs: { gapPx: 8, gapClass: "gap-2", rowGap: "space-y-2", pad: "p-2", rowUnit: 64, title: "text-xs", label: "text-[10px]" },
  sm: { gapPx: 12, gapClass: "gap-3", rowGap: "space-y-3", pad: "p-3", rowUnit: 80, title: "text-xs", label: "text-[11px]" },
  md: { gapPx: 16, gapClass: "gap-4", rowGap: "space-y-4", pad: "p-4", rowUnit: 100, title: "text-sm", label: "text-xs" },
  lg: { gapPx: 20, gapClass: "gap-5", rowGap: "space-y-5", pad: "p-5", rowUnit: 120, title: "text-base", label: "text-sm" },
  xl: { gapPx: 24, gapClass: "gap-6", rowGap: "space-y-6", pad: "p-6", rowUnit: 140, title: "text-lg", label: "text-sm" },
};

function makeId(prefix: string): string {
  return `${prefix}:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeSectionId(title: string, existingIds: string[]): string {
  let normalized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!existingIds.includes(normalized)) {
    return normalized;
  }

  let counter = 1;
  let id = `${normalized}_${counter}`;
  while (existingIds.includes(id)) {
    counter++;
    id = `${normalized}_${counter}`;
  }
  return id;
}

function normalizeRowId(sectionId: string, rowIndex: number): string {
  return `${sectionId}-row-${rowIndex + 1}`;
}

function isSpacerId(id: string): boolean {
  return id.startsWith(SPACER_PREFIX);
}

function clampSpan(span: number | undefined, maxColumns: number): number {
  if (!Number.isFinite(span)) return Math.min(4, maxColumns);
  return Math.max(1, Math.min(maxColumns, Math.round(Number(span))));
}

function createSlug(): string {
  return `item:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 8)}`;
}

function sortByOrder<T extends { id: string; order: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => {
    if (a.order === b.order) return a.id.localeCompare(b.id);
    return a.order - b.order;
  });
}

function heightToSpan(height: number | undefined): number {
  if (!height || height <= 0) return 0;
  const span = Math.round(height / ROW_SPAN_SIZE);
  return Math.max(1, Math.min(MAX_ROW_SPANS, span));
}

function spanToHeight(span: number | undefined): number {
  if (!span || span === 0) return 0;
  return span * ROW_SPAN_SIZE;
}

function normalizeRowHeight(row: SmartGridRow): SmartGridRow {
  if (row.heightSpan !== undefined) {
    return row;
  }
  return {
    ...row,
    heightSpan: row.height ? heightToSpan(row.height) : 0,
  };
}

function normalizeLayoutRowSpans(
  layout: SmartGridLayoutState,
): SmartGridLayoutState {
  const newSections = layout.sections.map((section) => ({
    ...section,
    rows: section.rows.map(normalizeRowHeight),
  }));
  return { ...layout, sections: newSections };
}

function normalizeColumnSpans(
  layout: SmartGridLayoutState,
  maxColumns: number,
): SmartGridLayoutState {
  const newSections = layout.sections.map((section) => ({
    ...section,
    rows: section.rows.map((row) => {
      if (row.items.length <= 1) return row;
      const currentSpans = row.items.map((i) => clampSpan(i.span, maxColumns));
      const newSpans = normalizeRowSpans(currentSpans, maxColumns);
      if (currentSpans.every((s, i) => s === newSpans[i])) return row;
      return {
        ...row,
        items: row.items.map((item, idx) => ({ ...item, span: newSpans[idx] })),
      };
    }),
  }));
  return { ...layout, sections: newSections };
}

function normalizeRowSpans(
  desiredSpans: number[],
  maxColumns: number,
): number[] {
  if (desiredSpans.length === 0) return [];
  if (desiredSpans.length === 1) return [maxColumns];

  const safe = desiredSpans.map((span) =>
    Math.max(1, Math.min(maxColumns, Math.round(span))),
  );
  const total = safe.reduce((acc, span) => acc + span, 0);
  if (total === maxColumns) return safe;

  const scaled = safe.map((span) => (span / total) * maxColumns);
  const normalized = scaled.map((span) => Math.max(1, Math.floor(span)));
  let diff = maxColumns - normalized.reduce((acc, span) => acc + span, 0);

  if (diff > 0) {
    const byRemainder = scaled
      .map((raw, index) => ({ index, remainder: raw - Math.floor(raw) }))
      .sort((a, b) => b.remainder - a.remainder);

    let i = 0;
    while (diff > 0 && byRemainder.length > 0) {
      normalized[byRemainder[i % byRemainder.length].index] += 1;
      diff -= 1;
      i += 1;
    }
  }

  if (diff < 0) {
    let i = 0;
    while (diff < 0 && normalized.some((span) => span > 1)) {
      const idx = i % normalized.length;
      if (normalized[idx] > 1) {
        normalized[idx] -= 1;
        diff += 1;
      }
      i += 1;
    }
  }

  // Every span is already 1 and the row still does not fit — there are more
  // items than there are columns. The loop above cannot shrink anything
  // further, so it used to return a row that overflowed its container.
  // Report the honest minimum and let the caller wrap.
  return normalized;
}

function normalizeLayout(
  items: SmartGridItemDefinition[],
  defaultLayout: SmartGridSectionDefinition[],
  persistedLayout: SmartGridLayoutState | null | undefined,
  maxColumns: number,
): SmartGridLayoutState {
  const itemsMap = new Map(items.map((i) => [i.id, i]));

  // Step 1: Generate section IDs and build default layout structure
  // First pass: extract all section IDs that are already provided
  const providedSectionIds = defaultLayout
    .map((s) => s.id)
    .filter((id): id is string => id !== undefined);

  const sectionDefinitions: SmartGridSectionDefinition[] = defaultLayout.map(
    (sectionDef, index) => {
      const id = sectionDef.id
        ? normalizeSectionId(
            sectionDef.id,
            providedSectionIds.filter((_, i) => i !== index),
          )
        : normalizeSectionId(
            sectionDef.title,
            providedSectionIds.filter((_, i) => i !== index),
          );

      return {
        ...sectionDef,
        id: id as string,
        rows: sectionDef.rows.map((rowDef) => ({
          id: rowDef.id,
          itemIds: rowDef.itemIds,
        })),
      };
    },
  );

  // Step 2: Build initial layout from default layout
  const layout: SmartGridLayoutState = {
    version: 3,
    sections: [],
  };

  // Track single items already placed
  const placedSingleItems = new Map<string, SmartGridItem>();

  sectionDefinitions.forEach((sectionDef, sectionIndex) => {
    const section: SmartGridSection = {
      id: sectionDef.id as string,
      title: sectionDef.title,
      rows: [],
      order: sectionIndex,
    };

    sectionDef.rows.forEach((rowDef, rowIndex) => {
      const row: SmartGridRow = {
        id:
          rowDef.id !== undefined
            ? `${rowDef.id}`
            : normalizeRowId(sectionDef.id as string, rowIndex),
        items: [],
        order: rowIndex,
        heightSpan: rowDef.defaultHeightSpan !== undefined
          ? Math.min(12, Math.max(0, Math.round(rowDef.defaultHeightSpan)))
          : 0,
      };

      rowDef.itemIds.forEach((itemId, itemIndex) => {
        const itemDef = itemsMap.get(itemId);

        // These two are kept deliberately while the tracing around them was
        // removed: a tile silently missing from the dashboard is otherwise
        // impossible to diagnose from the outside.
        if (!itemDef) {
          console.warn(
            `[SmartGridLayout] Item "${itemId}" is not in \`items\` and was skipped`,
          );
          return;
        }

        if (!itemDef.active) {
          console.warn(
            `[SmartGridLayout] Item "${itemId}" is inactive and was skipped`,
          );
          return;
        }

        // Handle single=true items - replace existing instance
        if (itemDef.single && placedSingleItems.has(itemId)) {
          const existing = placedSingleItems.get(itemId)!;
          removeLayoutItem(layout, existing.id);
        }

        const layoutItem: SmartGridItem = {
          definitionId: itemId,
          id: createSlug(),
          span: itemDef.defaultSpan ?? 4,
          order: itemIndex,
          sectionId: section.id,
          rowId: row.id,
          isSpacer: itemDef.isSpacer,
        };

        if (itemDef.single) {
          placedSingleItems.set(itemId, layoutItem);
        }

        row.items.push(layoutItem);
      });

      if (row.items.length > 0) {
        section.rows.push(row);
      }
    });

    if (section.rows.length > 0) {
      layout.sections.push(section);
    }
  });

  // Step 3: Use persisted layout if exists (no merging with default)
  if (persistedLayout && persistedLayout.version === 3) {

    // Use persisted layout directly - don't merge with default
    const wrappedLayout = ensureAutoRowWrapping(
      persistedLayout,
      items,
      maxColumns,
    );


    // Remove empty sections/rows
    const prunedLayout = withSectionRowOrders(
      pruneEmptySectionsAndRows(wrappedLayout),
    );

    // Normalize row spans from persisted layouts
    const normalizedSpansLayout = normalizeLayoutRowSpans(prunedLayout);

    // Normalize column spans so items fill the row evenly (prevents drift)
    const normalizedColLayout = normalizeColumnSpans(normalizedSpansLayout, maxColumns);


    return normalizedColLayout;
  }

  // Ensure auto-row-wrapping

  const wrappedLayout = ensureAutoRowWrapping(
    layout,
    items,
    maxColumns,
  );


  // Remove empty sections/rows
  const prunedLayout = withSectionRowOrders(
    pruneEmptySectionsAndRows(wrappedLayout),
  );

  // Normalize row spans from persisted layouts
  const normalizedSpansLayout = normalizeLayoutRowSpans(prunedLayout);

  // Normalize column spans so items fill the row evenly (prevents drift)
  const normalizedColLayout = normalizeColumnSpans(normalizedSpansLayout, maxColumns);


  return normalizedColLayout;
}

/**
 * Renumber `order` top to bottom.
 *
 * Returns a new layout rather than writing `order` onto the objects it is
 * handed. The mutating version was called on layouts that had already been
 * handed to React, so a renumber could change state that a render was
 * mid-way through reading.
 */
function withSectionRowOrders(
  layout: SmartGridLayoutState,
): SmartGridLayoutState {
  return {
    ...layout,
    sections: layout.sections.map((section, sectionIdx) => ({
      ...section,
      order: sectionIdx,
      rows: section.rows.map((row, rowIdx) => ({
        ...row,
        order: rowIdx,
        items: row.items.map((item, itemIdx) => ({ ...item, order: itemIdx })),
      })),
    })),
  };
}

function ensureAutoRowWrapping(
  layout: SmartGridLayoutState,
  items: SmartGridItemDefinition[],
  maxColumns: number,
): SmartGridLayoutState {
  const itemsMap = new Map(items.map((i) => [i.id, i]));


  // Wrap decisions must be based on the ACTUAL stored item.span (which reflects
  // user resizes), NOT the item definition's defaultSpan. Falling back to
  // defaultSpan only when item.span is unset (e.g. a freshly-seeded item from
  // the default layout that hasn't been persisted yet).
  const getSpan = (item: SmartGridItem): number => {
    const fallback = itemsMap.get(item.definitionId)?.defaultSpan ?? 4;
    const raw = Number.isFinite(item.span) ? (item.span as number) : fallback;
    return Math.max(1, Math.min(maxColumns, Math.round(raw)));
  };

  // Early exit: if all rows already fit within maxColumns, no wrapping needed
  let needsWrapping = false;
  for (const section of layout.sections) {
    for (const row of section.rows) {
      let total = 0;
      for (const item of row.items) {
        total += getSpan(item);
        if (total > maxColumns) {
          needsWrapping = true;
          break;
        }
      }
      if (needsWrapping) break;
    }
    if (needsWrapping) break;
  }
  if (!needsWrapping) {
    return layout;
  }

  const newSections = layout.sections.map((section) => {
    const newRows: SmartGridRow[] = [];

    section.rows.forEach((row) => {
      let currentRow: SmartGridRow | null = null;

      row.items.forEach((item) => {
        const span = getSpan(item);

        if (!currentRow) {
          currentRow = {
            id: row.id,
            items: [item],
            order: row.order,
          };
          newRows.push(currentRow);
        } else {
          const currentRowSpan = currentRow.items.reduce(
            (sum, i) => sum + getSpan(i),
            0,
          );

          if (currentRowSpan + span > maxColumns) {
            const newRow: SmartGridRow = {
              id: makeId(`row:${section.id}`),
              items: [item],
              order: currentRow.order + 1,
            };
            newRows.push(newRow);
            currentRow = newRow;
          } else {
            currentRow.items.push(item);
          }
        }
      });
    });

    return { ...section, rows: newRows };
  });

  const result = { ...layout, sections: newSections };


  return result;
}

function distributeSpans(
  itemIds: string[],
  maxColumns: number,
): Map<string, number> {
  if (itemIds.length === 0) return new Map();
  if (itemIds.length === 1) {
    return new Map([[itemIds[0], maxColumns]]);
  }

  // When deleting items, distribute the FULL maxColumns among remaining items
  const totalSpan = maxColumns;
  const baseSpan = Math.floor(totalSpan / itemIds.length);
  const remainder = totalSpan % itemIds.length;

  const newSpans = new Map<string, number>();
  itemIds.forEach((id, index) => {
    const span = baseSpan + (index < remainder ? 1 : 0);
    newSpans.set(id, span);
  });

  return newSpans;
}

// This function is no longer needed - deployed state is computed from layout

function findLayoutItem(
  layout: SmartGridLayoutState,
  itemId: string,
): SmartGridItem | null {
  for (const section of layout.sections) {
    for (const row of section.rows) {
      const item = row.items.find((i) => i.id === itemId);
      if (item) return item;
    }
  }
  return null;
}

function removeLayoutItem(layout: SmartGridLayoutState, itemId: string): void {
  layout.sections.forEach((section) => {
    section.rows.forEach((row) => {
      const idx = row.items.findIndex((i) => i.id === itemId);
      if (idx !== -1) {
        row.items.splice(idx, 1);
      }
    });
  });
}

function pruneEmptySectionsAndRows(
  layout: SmartGridLayoutState,
): SmartGridLayoutState {
  const sectionsWithNonEmptyRows = layout.sections.map((section) => {
    const nonEmptyRows = section.rows.filter((row) => row.items.length > 0);
    return { ...section, rows: nonEmptyRows };
  });

  const nonEmptySections = sectionsWithNonEmptyRows.filter(
    (section) => section.rows.length > 0,
  );

  return { ...layout, sections: nonEmptySections };
}

export const SmartGridLayout: React.FC<SmartGridLayoutProps> = ({
  items,
  defaultLayout,
  persistedLayout,
  onLayoutChange,
  maxColumns: maxColumnsProp = 12,
  className,
  tone,
  editThemeColor,
  variant = "plain",
  surfaceTone = "neutral",
  size = "md",
  controlVariant,
  readOnly = false,
  onTileError,
  historyLimit = 50,
  isEditMode: isEditModeProp,
  defaultEditMode = false,
  onEditModeChange,
  storageKey,
  storagePrefix,
  storage,
  autoSave = true,
  autoSaveDebounceMs = 400,
}) => {
  const effectiveTone = tone ?? editThemeColor ?? "blue";

  // Measured, not `window.innerWidth`: a grid inside a split pane or a modal
  // is narrower than the viewport, and it is the container that decides how
  // many columns fit.
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number>(
    typeof window === "undefined" ? 1280 : window.innerWidth,
  );
  useEffect(() => {
    if (typeof maxColumnsProp === "number") return;
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setMeasuredWidth(width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [maxColumnsProp]);

  const maxColumns = useMemo(
    () => resolveColumns(maxColumnsProp, measuredWidth),
    [maxColumnsProp, measuredWidth],
  );
  const sizeToken = SIZE_TOKENS[size] ?? SIZE_TOKENS.md;
  const isPlain = variant === "plain";
  const surfaceClasses = isPlain
    ? ""
    : getSurfaceVariantClasses(variant, surfaceTone);
  // `plain` sits on an unknown background, so it takes the higher-contrast
  // copy the translucent surfaces use rather than the muted solid palette —
  // `neutral-500` disappears over a photograph.
  const surfaceText = getSurfaceTextTokens(isPlain ? "glass" : variant);
  const tonePalette = getPanelToneStyles(surfaceTone);
  // No padding either: the host container owns the spacing when there is no
  // surface to inset from.
  const rootPadding = isPlain ? "" : sizeToken.pad;
  /** Editor chrome follows the dashboard's own surface. */
  const editorButtonVariant =
    controlVariant ?? EDITOR_BUTTON_FOR_SURFACE[variant] ?? "outline";
  /** The quiet twin, for icon-only controls that sit on top of content. */
  const editorIconVariant: ButtonVariant =
    editorButtonVariant === "glass" ? "glass" : "ghost";

  // ── Built-in persistence ──────────────────────────────────────────────────
  const storageAdapter = useMemo(
    () => storage ?? createSafeLocalStorage(),
    [storage],
  );
  const fullStorageKey = storageKey
    ? buildGridStorageKey(storagePrefix ?? GRID_STORAGE_DEFAULT_PREFIX, storageKey)
    : null;

  /**
   * Read once, on mount. Re-reading on every render would fight the in-memory
   * layout the user is editing.
   *
   * An explicit `persistedLayout` prop wins over storage: a caller who passes
   * state is the source of truth, and storage is the fallback beneath it.
   */
  const restoredLayout = useMemo(
    () =>
      fullStorageKey
        ? (decodeStoredLayout(
            storageAdapter.getItem(fullStorageKey),
          ) as SmartGridLayoutState | null)
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fullStorageKey, storageAdapter],
  );
  const effectivePersistedLayout = persistedLayout ?? restoredLayout;

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  /**
   * The definition being dragged out of the palette.
   *
   * Kept separate from `draggingId`, which is a *layout item* id: dropping one
   * reorders, dropping the other creates. A ref because `dragover` fires
   * before React re-renders, the same reason the section drag uses one.
   */
  const paletteDragRef = useRef<string | null>(null);
  const [paletteDragId, setPaletteDragId] = useState<string | null>(null);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  /**
   * The id lives in a ref as well as state.
   *
   * `dragover` starts firing immediately after `dragstart`, before React has
   * flushed the state update — so a handler reading state alone sees `null`,
   * returns early, and never calls `preventDefault()`. Without that call the
   * browser refuses the drop for those frames and shows a "no drop" cursor.
   */
  const draggingSectionRef = useRef<string | null>(null);
  /**
   * Where each section sat when the drag started, in page coordinates.
   *
   * The insertion point is computed against this snapshot rather than against
   * live positions. Live hit-testing feeds back on itself: inserting the ghost
   * shifts the target out from under the pointer, which fires `dragleave`,
   * which removes the ghost, which shifts it back — the flicker.
   */
  const sectionRectsRef = useRef<{ id: string; mid: number }[]>([]);
  const [draggingSectionId, setDraggingSectionId] = useState<string | null>(
    null,
  );
  /**
   * Which section is visually removed from the flow. Deliberately *not* the
   * same as `draggingSectionId`.
   *
   * Hiding the drag source synchronously during `dragstart` cancels the drag:
   * the browser needs the element it is dragging to stay rendered while it
   * takes the drag image. Deferring the hide by a frame lets the drag survive.
   */
  const [hiddenSectionId, setHiddenSectionId] = useState<string | null>(null);
  type SectionDragOver = { id: string; position: "before" | "after" };
  /**
   * The pending drop target, mirrored into a ref.
   *
   * `drop` fires immediately after `dragover`, often before React has
   * re-rendered — so a drop handler closing over state reads the value from
   * *before* the last dragover and, on the first drop of a drag, sees `null`
   * and does nothing. This is why dropping appeared not to save.
   */
  const sectionDragOverRef = useRef<SectionDragOver | null>(null);
  const [sectionDragOver, setSectionDragOverState] =
    useState<SectionDragOver | null>(null);

  const setSectionDragOver = useCallback(
    (
      next:
        | SectionDragOver
        | null
        | ((prev: SectionDragOver | null) => SectionDragOver | null),
    ) => {
      const resolved =
        typeof next === "function" ? next(sectionDragOverRef.current) : next;
      sectionDragOverRef.current = resolved;
      setSectionDragOverState(resolved);
    },
    [],
  );
  const [dragOver, setDragOver] = useState<DragOverState | null>(null);
  const [emptyRowDropTarget, setEmptyRowDropTarget] = useState<string | null>(
    null,
  );
  const [sectionBottomDropTarget, setSectionBottomDropTarget] = useState<
    string | null
  >(null);
  const [newSectionDropTarget, setNewSectionDropTarget] = useState(false);
  const [rowAddTarget, setRowAddTarget] = useState<RowAddTargetState | null>(
    null,
  );
  /**
   * Mirrored into a ref: the hysteresis below has to know which row owns the
   * preview *right now*, and `dragover` fires faster than React re-renders.
   */
  const rowPreviewRef = useRef<RowPreviewState | null>(null);
  const [rowPreview, setRowPreviewState] = useState<RowPreviewState | null>(
    null,
  );
  const setRowPreview = useCallback(
    (
      next:
        | RowPreviewState
        | null
        | ((prev: RowPreviewState | null) => RowPreviewState | null),
    ) => {
      const resolved =
        typeof next === "function" ? next(rowPreviewRef.current) : next;
      rowPreviewRef.current = resolved;
      setRowPreviewState(resolved);
    },
    [],
  );

  /**
   * What just happened, for a screen reader.
   *
   * Every editing action here was silent: reordering, resizing, removing and
   * moving between sections all changed the layout with nothing announced —
   * including the keyboard paths, so a user could press the arrow keys and get
   * no confirmation that anything had moved.
   *
   * Polite rather than assertive: these are confirmations of the user's own
   * action, not interruptions.
   */
  const [announcement, setAnnouncement] = useState("");
  const announce = useCallback((message: string) => {
    // Re-announce an identical message by nudging it, or a screen reader will
    // treat the unchanged text as nothing new — moving two tiles the same way
    // in a row would say it once.
    setAnnouncement((prev) => (prev === message ? `${message} ` : message));
  }, []);

  /** A definition's title, for the announcements. */
  const titleOf = useCallback(
    (definitionId: string) =>
      items.find((item) => item.id === definitionId)?.title ?? "Item",
    [items],
  );
  /**
   * Where every cell sat when the item drag began, in page coordinates.
   *
   * The insert index used to be computed from *live* `getBoundingClientRect`
   * calls — but by the time a second `dragover` arrives the ghost has already
   * been inserted and pushed those cells sideways, so the measurement includes
   * the effect of the previous measurement. Between two rows that feedback
   * shows up as flicker: the ghost reflows the row, the pointer falls outside
   * it, the preview clears, the layout snaps back, and round it goes.
   *
   * Resolving against a fixed snapshot breaks the loop. The positions go stale
   * as soon as a preview is applied, and that is the point: the pointer moves
   * in screen space and we map it onto the layout as it was before we started
   * rearranging it.
   */
  const itemDragGeomRef = useRef<{
    cells: Record<string, { id: string; mid: number }[]>;
    /** Each row's vertical band, so a reflow cannot hand the drag to a neighbour. */
    rows: { rowId: string; top: number; bottom: number }[];
  }>({ cells: {}, rows: [] });

  const captureItemDragGeometry = useCallback(() => {
    const cells: Record<string, { id: string; mid: number }[]> = {};
    const rows: { rowId: string; top: number; bottom: number }[] = [];
    const root = containerRef.current;
    if (!root) return;
    root.querySelectorAll("[data-sg-row-id]").forEach((rowEl) => {
      const rowId = rowEl.getAttribute("data-sg-row-id");
      if (!rowId) return;
      const rowRect = rowEl.getBoundingClientRect();
      rows.push({
        rowId,
        top: rowRect.top + window.scrollY,
        bottom: rowRect.bottom + window.scrollY,
      });
      cells[rowId] = [...rowEl.querySelectorAll("[data-sg-item-id]")].map(
        (cellEl) => {
          const rect = cellEl.getBoundingClientRect();
          return {
            id: cellEl.getAttribute("data-sg-item-id") ?? "",
            mid: rect.left + rect.width / 2 + window.scrollX,
          };
        },
      );
    });
    itemDragGeomRef.current = { cells, rows };
  }, []);

  /**
   * Is the pointer inside this row's *original* band?
   *
   * Inserting the ghost makes rows grow and shrink, which moves the pointer
   * across row boundaries without the user moving it. Without this, the
   * neighbour's `dragover` claims the preview, the layout swaps back, and the
   * two rows trade it forever — the flicker. Ties are resolved to the nearest
   * band so a pointer in the gap between rows still lands somewhere.
   */
  const rowOwnsPointer = useCallback((rowId: string, pageY: number) => {
    const { rows } = itemDragGeomRef.current;
    if (rows.length === 0) return true;
    const own = rows.find((entry) => entry.rowId === rowId);
    if (!own) return true;

    const current = rowPreviewRef.current?.rowId;

    // Hysteresis. The bands are frozen at drag start, but the *rendered* rows
    // move during the drag: the source row collapses when its item goes to the
    // preview, and the target grows to hold the ghost. Around the boundary
    // that leaves a band where a movement of a pixel or two flips the answer,
    // and the two rows trade the preview — the flicker.
    //
    // So the row holding the preview keeps it until the pointer is clearly
    // outside its band, and a challenger has to be clearly inside its own.
    // Between the two thresholds nobody claims anything and the preview simply
    // stays put, which is what stops the chatter.
    if (current === rowId) {
      return (
        pageY >= own.top - ROW_SWITCH_MARGIN_PX &&
        pageY <= own.bottom + ROW_SWITCH_MARGIN_PX
      );
    }
    if (pageY >= own.top + ROW_SWITCH_MARGIN_PX && pageY <= own.bottom) {
      return true;
    }
    // Nothing owns it yet — fall back to the nearest band so the first
    // `dragover` of a drag still finds a home.
    if (!current) {
      const nearest = rows.reduce((best, entry) => {
        const d = pageY < entry.top ? entry.top - pageY : pageY - entry.bottom;
        const bd = pageY < best.top ? best.top - pageY : pageY - best.bottom;
        return d < bd ? entry : best;
      });
      return nearest.rowId === rowId;
    }
    return false;
  }, []);
  /**
   * The pointer is over the delete zone.
   *
   * Mirrored into a ref for the same reason as the section drag state: `drop`
   * fires before React re-renders, so a handler closing over state alone reads
   * the value from before the last `dragover`.
   */
  const overDeleteZoneRef = useRef(false);
  const [overDeleteZone, setOverDeleteZone] = useState(false);

  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
  const [rowResizeState, setRowResizeState] = useState<RowResizeState | null>(
    null,
  );
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionDraftTitle, setSectionDraftTitle] = useState("");
  const [internalEditMode, setInternalEditMode] = useState(defaultEditMode);
  const isEditModeControlled = isEditModeProp !== undefined;
  // `readOnly` wins over both: the affordances are not merely hidden, they are
  // unreachable.
  const isEditMode =
    !readOnly &&
    (isEditModeControlled ? Boolean(isEditModeProp) : internalEditMode);

  const setEditMode = useCallback(
    (next: boolean) => {
      if (!isEditModeControlled) setInternalEditMode(next);
      onEditModeChange?.(next);
    },
    [isEditModeControlled, onEditModeChange],
  );

  // Compute normalized layout only when defaultLayout or persistedLayout changes (not on every items change)
  const normalizedLayout = useMemo(() => {
    // Create a copy of items to avoid mutating props
    const itemsCopy = items.map((item) => ({ ...item }));
    return normalizeLayout(
      itemsCopy,
      defaultLayout,
      effectivePersistedLayout,
      maxColumns,
    );
  }, [items, defaultLayout, effectivePersistedLayout, maxColumns]);

  const [layout, setLayout] = useState<SmartGridLayoutState>(() => {
    return normalizedLayout;
  });

  const layoutRef = useRef<SmartGridLayoutState>(normalizedLayout);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const resizeChangedRef = useRef(false);

  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  /**
   * Adopt a newly-derived layout when the *inputs* actually change.
   *
   * This replaces a hand-rolled sync built on two refs and a bespoke
   * deep-equal, which had three problems:
   *
   * - It reset itself whenever `persistedLayout` changed *identity*, so a
   *   caller passing an inline object recomputed on every render.
   * - Its comparison looked at ids and lengths only, so a layout differing
   *   just in column spans or row heights was treated as identical.
   * - When sections differed *while editing* it skipped the update but still
   *   marked itself initialised, losing the change permanently.
   *
   * A content signature fixes all three: it is a stable string, so inline
   * props do not retrigger it; it covers spans and heights; and deferring
   * while editing leaves the signature unapplied, so the update lands as soon
   * as edit mode ends rather than being dropped.
   */
  const layoutSignature = useMemo(
    () =>
      JSON.stringify(
        normalizedLayout.sections.map((section) => [
          section.id,
          section.title,
          section.rows.map((row) => [
            row.id,
            row.heightSpan ?? 0,
            row.items.map((item) => [item.id, item.definitionId, item.span]),
          ]),
        ]),
      ),
    [normalizedLayout],
  );

  const appliedSignatureRef = useRef(layoutSignature);

  useEffect(() => {
    if (appliedSignatureRef.current === layoutSignature) return;
    // Defer rather than discard: not marking it applied means this runs again
    // the moment editing stops.
    if (isEditMode) return;
    appliedSignatureRef.current = layoutSignature;
    setLayout(normalizedLayout);
  }, [layoutSignature, normalizedLayout, isEditMode]);

  // Create items map once, only when items array reference changes
  const byId = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items],
  );

  // Compute deployed single item IDs from layout
  const deployedSingleItemIds = useMemo(() => {
    const deployedIds = new Set<string>();
    layout.sections.forEach((section) => {
      section.rows.forEach((row) => {
        row.items.forEach((item) => {
          const def = items.find((i) => i.id === item.definitionId);
          if (def?.single) {
            deployedIds.add(item.definitionId);
          }
        });
      });
    });
    return deployedIds;
  }, [layout, items]);

  // Items available to add: all active items minus deployed single items
  const addableItems = useMemo(() => {
    return items.filter((item) => {
      // Skip items already in layout if single
      if (item.single && deployedSingleItemIds.has(item.id)) {
        return false;
      }
      // Skip inactive items
      if (!item.active) {
        return false;
      }
      return true;
    });
  }, [items, deployedSingleItemIds]);

  const orderedSectionIds = useMemo(() => {
    return sortByOrder(
      layout.sections.map((section) => ({
        id: section.id,
        order: section.order,
      })),
    ).map((entry) => entry.id);
  }, [layout]);

  /**
   * Debounced write. Column and row resizing update the layout on every
   * mousemove, so writing straight through would serialise the whole dashboard
   * dozens of times a second.
   */
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSaveRef = useRef<SmartGridLayoutState | null>(null);

  const flushSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const pending = pendingSaveRef.current;
    pendingSaveRef.current = null;
    if (!pending || !fullStorageKey) return;
    storageAdapter.setItem(fullStorageKey, encodeStoredLayout(pending as never));
  }, [fullStorageKey, storageAdapter]);

  const scheduleSave = useCallback(
    (next: SmartGridLayoutState) => {
      if (!fullStorageKey || !autoSave) return;
      pendingSaveRef.current = next;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(flushSave, autoSaveDebounceMs);
    },
    [fullStorageKey, autoSave, autoSaveDebounceMs, flushSave],
  );

  // A pending write must not be lost to an unmount — closing a dashboard is
  // exactly when the user expects their last change to have stuck.
  useEffect(() => () => flushSave(), [flushSave]);

  /**
   * Back to the default layout, clearing the stored one.
   *
   * With persistence there has to be a way back: a user who drags their
   * dashboard into a mess currently has no route to the layout the app
   * shipped with.
   */
  const resetLayout = useCallback(() => {
    if (fullStorageKey) {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      pendingSaveRef.current = null;
      storageAdapter.removeItem(fullStorageKey);
    }
    const fresh = normalizeLayout(
      items.map((item) => ({ ...item })),
      defaultLayout,
      null,
      maxColumns,
    );
    setLayout(fresh);
    announce("Layout reset to its default");
    onLayoutChange?.(fresh);
  }, [
    fullStorageKey,
    storageAdapter,
    items,
    defaultLayout,
    maxColumns,
    onLayoutChange,
  ]);

  /**
   * Undo/redo within an edit session.
   *
   * Only possible now that the layout is never mutated in place: a history of
   * snapshots is worthless if the snapshots keep changing underneath you,
   * which is what the three shallow-copy-then-mutate sites used to do.
   *
   * The stacks are cleared when edit mode ends — undoing into a session the
   * user has already committed reads as the dashboard changing on its own.
   */
  const undoStackRef = useRef<SmartGridLayoutState[]>([]);
  const redoStackRef = useRef<SmartGridLayoutState[]>([]);
  const [historyTick, setHistoryTick] = useState(0);

  const pushHistory = useCallback(
    (snapshot: SmartGridLayoutState) => {
      if (historyLimit <= 0) return;
      undoStackRef.current = [
        ...undoStackRef.current.slice(-(historyLimit - 1)),
        snapshot,
      ];
      redoStackRef.current = [];
      setHistoryTick((t) => t + 1);
    },
    [historyLimit],
  );

  const updateLayout = useCallback(
    (updater: (prev: SmartGridLayoutState) => SmartGridLayoutState) => {
      setLayout((prev) => {
        const next = updater(prev);
        if (next !== prev) {
          pushHistory(prev);
          onLayoutChange?.(next);
          scheduleSave(next);
        }
        return next;
      });
    },
    [onLayoutChange, scheduleSave, pushHistory],
  );

  // `historyTick` is read here on purpose: the stacks live in refs, so nothing
  // would re-render the toolbar when they move without it.
  void historyTick;
  const canUndo = undoStackRef.current.length > 0;
  const canRedo = redoStackRef.current.length > 0;

  const undo = useCallback(() => {
    const previous = undoStackRef.current[undoStackRef.current.length - 1];
    if (!previous) return;
    undoStackRef.current = undoStackRef.current.slice(0, -1);
    announce("Undone");
    setLayout((current) => {
      redoStackRef.current = [...redoStackRef.current, current];
      onLayoutChange?.(previous);
      scheduleSave(previous);
      return previous;
    });
    setHistoryTick((t) => t + 1);
  }, [onLayoutChange, scheduleSave]);

  const redo = useCallback(() => {
    const next = redoStackRef.current[redoStackRef.current.length - 1];
    if (!next) return;
    redoStackRef.current = redoStackRef.current.slice(0, -1);
    announce("Redone");
    setLayout((current) => {
      undoStackRef.current = [...undoStackRef.current, current];
      onLayoutChange?.(next);
      scheduleSave(next);
      return next;
    });
    setHistoryTick((t) => t + 1);
  }, [onLayoutChange, scheduleSave]);

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z, only while editing.
  useEffect(() => {
    if (!isEditMode || historyLimit <= 0) return;
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.key.toLowerCase() !== "z") return;
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isEditMode, historyLimit, undo, redo]);

  // When leaving edit mode (save), prune empty managed rows from section rowOrder.
  const prevEditModeRef = useRef(isEditMode);
  useEffect(() => {
    const wasEditing = prevEditModeRef.current;
    prevEditModeRef.current = isEditMode;
    if (!wasEditing || isEditMode) return; // only fires on true → false transition

    // Undoing into a session the user already committed reads as the dashboard
    // changing on its own.
    undoStackRef.current = [];
    redoStackRef.current = [];
    setHistoryTick((t) => t + 1);

    updateLayout((prev) => {
      const populatedRowKeys = new Set(
        prev.sections
          .flatMap((section) => section.rows.flatMap((row) => row.items))
          .map((item) => item.rowId as string),
      );

      let changed = false;
      const nextSections = prev.sections.map((section) => {
        const filteredRows = section.rows.filter((row: SmartGridRow) =>
          populatedRowKeys.has(row.id),
        );
        if (filteredRows.length !== section.rows.length) {
          changed = true;
          return { ...section, rows: filteredRows };
        }
        return section;
      });

      return changed ? { ...prev, sections: nextSections } : prev;
    });
  }, [isEditMode, updateLayout]);

  const removeItem = useCallback(
    (itemId: string) => {
      const removed = findLayoutItem(layoutRef.current, itemId);
      if (removed) announce(`${titleOf(removed.definitionId)} removed`);
      updateLayout((prev) => {
        const newSections = prev.sections.map((section) => {
          const newRows = section.rows.map((row) => {
            const itemIndex = row.items.findIndex((i) => i.id === itemId);
            if (itemIndex === -1) return row;

            const remainingItems = row.items.filter(
              (_, idx) => idx !== itemIndex,
            );
            const hasSpacer = remainingItems.some((i) => i.isSpacer);

            if (!hasSpacer && remainingItems.length > 0) {
              const remainingIds = remainingItems.map((i) => i.id);
              const newSpans = distributeSpans(remainingIds, maxColumns);

              const itemsWithNewSpans = row.items.map((item) => {
                if (item.id === itemId) return item;
                const newSpan = newSpans.get(item.id);
                if (newSpan !== undefined && newSpan !== item.span) {
                  return { ...item, span: newSpan };
                }
                return item;
              });

              return {
                ...row,
                items: itemsWithNewSpans.filter((_, idx) => idx !== itemIndex),
              };
            }

            return {
              ...row,
              items: [
                ...row.items.slice(0, itemIndex),
                ...row.items.slice(itemIndex + 1),
              ],
            };
          });
          return { ...section, rows: newRows };
        });

        return { ...prev, sections: newSections };
      });
    },
    [updateLayout, maxColumns, announce, titleOf],
  );

  const addSpacerToRow = useCallback(
    (sectionId: string, rowId: string, span: number = 1) => {
      updateLayout((prev) => {
        const sectionIndex = prev.sections.findIndex((s) => s.id === sectionId);
        if (sectionIndex === -1) return prev;

        const rowIndex = prev.sections[sectionIndex].rows.findIndex(
          (r) => r.id === rowId,
        );
        if (rowIndex === -1) return prev;

        const section = prev.sections[sectionIndex];
        const row = section.rows[rowIndex];

        // If row has items, reduce the rightmost item's span to make room for the spacer
        const newItems = [...row.items];
        if (newItems.length > 0) {
          const lastItemIndex = newItems.length - 1;
          const lastItem = newItems[lastItemIndex];
          const newLastSpan = Math.max(1, lastItem.span - span);
          newItems[lastItemIndex] = { ...lastItem, span: newLastSpan };
        }

        // Calculate max order in the row
        const maxOrder =
          newItems.length > 0
            ? Math.max(...newItems.map((i) => i.order)) + 1
            : 0;

        const newItem: SmartGridItem = {
          definitionId: createSlug(),
          id: createSlug(),
          span,
          order: maxOrder,
          sectionId: sectionId,
          rowId: rowId,
          isSpacer: true,
        };

        newItems.push(newItem);

        // `{ ...section }` copies the object, not the `rows` array inside it,
        // so writing into `newSection.rows[i]` used to mutate the state React
        // still holds as `prev`.
        const newSections = prev.sections.map((s, i) =>
          i !== sectionIndex
            ? s
            : {
                ...s,
                rows: s.rows.map((r, ri) =>
                  ri !== rowIndex ? r : { ...r, items: newItems },
                ),
              },
        );

        return { ...prev, sections: newSections };
      });
    },
    [updateLayout],
  );

  const addItemToRow = useCallback(
    (itemId: string, sectionId: string, rowId: string) => {

      if (isSpacerId(itemId)) {
        addSpacerToRow(sectionId, rowId);
        announce("Spacer added");
        return;
      }
      announce(`${titleOf(itemId)} added`);

      updateLayout((prev) => {
        const itemDef = items.find((i) => i.id === itemId);
        if (!itemDef) {
          return prev;
        }


        // Check if item already exists in the target row BEFORE making changes
        const targetSection = prev.sections.find((s) => s.id === sectionId);
        if (targetSection) {
          const targetRow = targetSection.rows.find((r) => r.id === rowId);
          if (targetRow) {
            const alreadyExists = targetRow.items.some(
              (item) => item.definitionId === itemId,
            );
            if (alreadyExists) {
              return prev;
            }
          }
        }

        let workingSections = prev.sections;

        // Handle single=true items - replace existing instance
        if (itemDef.single) {
          // Find and remove existing instance
          const existingItem = findLayoutItem(prev, itemId);
          if (existingItem) {
            workingSections = prev.sections.map((section) => ({
              ...section,
              rows: section.rows.map((row) => ({
                ...row,
                items: row.items.filter((i) => i.id !== existingItem.id),
              })),
            }));
          }
        }

        const sectionIndex = workingSections.findIndex(
          (s) => s.id === sectionId,
        );
        if (sectionIndex === -1) {
          return prev;
        }

        let section = workingSections[sectionIndex];
        let rowIndex = section.rows.findIndex((r) => r.id === rowId);
        const isEmptyRow = rowIndex !== -1 && section.rows[rowIndex].items.length === 0;
        
        if (rowIndex === -1) {
          rowIndex = section.rows.length;
          const newItemHeightSpan = itemDef.defaultRowHeightSpan !== undefined 
            ? Math.min(12, Math.max(0, Math.round(itemDef.defaultRowHeightSpan))) 
            : 0;
          const newSections = [...workingSections];
          newSections[sectionIndex] = {
            ...section,
            rows: [
              ...section.rows,
              { id: rowId, items: [], order: rowIndex, heightSpan: newItemHeightSpan },
            ],
          };
          workingSections = newSections;
          section = workingSections[sectionIndex];
        } else if (isEmptyRow) {
          const existingRow = section.rows[rowIndex];
          const newItemHeightSpan = itemDef.defaultRowHeightSpan !== undefined 
            ? Math.min(12, Math.max(0, Math.round(itemDef.defaultRowHeightSpan))) 
            : 0;
          if (existingRow.heightSpan !== newItemHeightSpan) {
            workingSections = workingSections.map((s, i) =>
              i !== sectionIndex
                ? s
                : {
                    ...s,
                    rows: s.rows.map((r, ri) =>
                      ri !== rowIndex
                        ? r
                        : { ...r, heightSpan: newItemHeightSpan },
                    ),
                  },
            );
            section = workingSections[sectionIndex];
          }
        }

        const row = section.rows[rowIndex];


        // Calculate max order in the row
        const maxOrder =
          row.items.length > 0
            ? Math.max(...row.items.map((i) => i.order)) + 1
            : 0;

        const newSlug = createSlug();
        const newItem: SmartGridItem = {
          definitionId: itemId,
          id: newSlug,
          span: itemDef.defaultSpan ?? 4,
          order: maxOrder,
          sectionId: sectionId,
          rowId: rowId,
          isSpacer: itemDef.isSpacer,
        };


        // Was `newRow.items.push(...)` on a shallow copy, which appended
        // straight into the previous state's array.
        const newSections = workingSections.map((s, i) =>
          i !== sectionIndex
            ? s
            : {
                ...s,
                rows: s.rows.map((r, ri) =>
                  ri !== rowIndex ? r : { ...r, items: [...r.items, newItem] },
                ),
              },
        );

        return { ...prev, sections: newSections };
      });
    },
    [updateLayout, addSpacerToRow, items, announce, titleOf],
  );

  /**
   * Add a definition to a row at a given index.
   *
   * `addItemToRow` appends, which is all the modal could express — it knew a
   * row but not a position. Dragging from the palette knows exactly where the
   * preview is, so it can place instead of append.
   */
  const insertItemAt = useCallback(
    (definitionId: string, sectionId: string, rowId: string, index: number) => {
      const itemDef = items.find((entry) => entry.id === definitionId);
      if (!itemDef) return;
      announce(`${itemDef.title} added`);
      updateLayout((prev) => {
        const sectionIndex = prev.sections.findIndex((x) => x.id === sectionId);
        if (sectionIndex === -1) return prev;
        const rowIndex = prev.sections[sectionIndex].rows.findIndex(
          (r) => r.id === rowId,
        );
        if (rowIndex === -1) return prev;

        // `single` means one instance: remove any existing one first.
        let working = prev.sections;
        if (itemDef.single) {
          working = working.map((section) => ({
            ...section,
            rows: section.rows.map((r) => ({
              ...r,
              items: r.items.filter((i) => i.definitionId !== definitionId),
            })),
          }));
        }

        const newItem: SmartGridItem = {
          definitionId,
          id: createSlug(),
          span: itemDef.defaultSpan ?? 4,
          order: index,
          sectionId,
          rowId,
          isSpacer: itemDef.isSpacer,
        };

        return {
          ...prev,
          sections: working.map((section, si) =>
            si !== sectionIndex
              ? section
              : {
                  ...section,
                  rows: section.rows.map((r, ri) => {
                    if (ri !== rowIndex) return r;
                    const at = Math.max(0, Math.min(index, r.items.length));
                    const next = [
                      ...r.items.slice(0, at),
                      newItem,
                      ...r.items.slice(at),
                    ];
                    return {
                      ...r,
                      items: next.map((item, i) => ({ ...item, order: i })),
                    };
                  }),
                },
          ),
        };
      });
    },
    [items, updateLayout, announce],
  );

  const ensureSection = useCallback(
    (sectionId: string, title?: string) => {
      updateLayout((prev) => {
        if (prev.sections.find((s) => s.id === sectionId)) return prev;
        const maxOrder = Math.max(
          ...prev.sections.map((section) => section.order),
          -1,
        );
        return {
          ...prev,
          sections: [
            ...prev.sections,
            {
              id: sectionId,
              title: title ?? sectionId,
              rows: [],
              order: maxOrder + 1,
            },
          ],
        };
      });
    },
    [updateLayout],
  );

  const renameSection = useCallback(
    (sectionId: string, title: string) => {
      updateLayout((prev) => {
        const sectionIndex = prev.sections.findIndex((s) => s.id === sectionId);
        if (sectionIndex === -1) return prev;
        const newSections = [...prev.sections];
        newSections[sectionIndex] = { ...newSections[sectionIndex], title };
        return { ...prev, sections: newSections };
      });
    },
    [updateLayout],
  );

  const createRow = useCallback(
    (sectionId: string): string => {
      const rowId = makeId(`row:${sectionId}`);
      updateLayout((prev) => {
        const sectionIndex = prev.sections.findIndex((s) => s.id === sectionId);
        if (sectionIndex === -1) return prev;

        const section = prev.sections[sectionIndex];
        if (section.rows.some((r) => r.id === rowId)) return prev;

        const newSections = [...prev.sections];
        newSections[sectionIndex] = {
          ...section,
          rows: [
            ...section.rows,
            { id: rowId, items: [], order: section.rows.length, heightSpan: 0 },
          ],
        };

        return { ...prev, sections: newSections };
      });
      return rowId;
    },
    [updateLayout],
  );

  const removeRowItems = useCallback(
    (
      sectionId: string,
      rowId: string,
      itemIds: string[],
      isManagedRow: boolean,
    ) => {
      updateLayout((prev) => {
        const newSections = prev.sections.map((section) => {
          if (section.id !== sectionId) return section;

          const newRow = section.rows.find((r) => r.id === rowId);
          if (!newRow) return section;

          const remainingItems = newRow.items.filter(
            (i) => !itemIds.includes(i.id),
          );
          const hasSpacer = remainingItems.some((i) => i.isSpacer);

          let updatedItems: SmartGridItem[];
          if (!hasSpacer && remainingItems.length > 0) {
            const remainingIds = remainingItems.map((i) => i.id);
            const newSpans = distributeSpans(remainingIds, maxColumns);

            updatedItems = newRow.items
              .filter((i) => !itemIds.includes(i.id))
              .map((item) => {
                const newSpan = newSpans.get(item.id);
                if (newSpan !== undefined && newSpan !== item.span) {
                  return { ...item, span: newSpan };
                }
                return item;
              });
          } else {
            updatedItems = newRow.items.filter((i) => !itemIds.includes(i.id));
          }

          const newRows = section.rows.map((r) => {
            if (r.id === rowId) {
              return { ...r, items: updatedItems };
            }
            return r;
          });

          if (isManagedRow) {
            const filteredRows = newRows.filter((r) => r.id !== rowId);
            return { ...section, rows: filteredRows };
          }

          return { ...section, rows: newRows };
        });

        return { ...prev, sections: newSections };
      });
    },
    [updateLayout, maxColumns],
  );

  const createSection = useCallback((): string => {
    const sectionId = makeId("section");
    ensureSection(sectionId, "New Section");
    return sectionId;
  }, [ensureSection]);

  /**
   * Move a section before or after another, then renumber.
   *
   * `order` is renumbered from the resulting array rather than patched, so the
   * stored values stay dense — `orderedSectionIds` sorts on `order` and ties
   * break on id, which would make a gap or a duplicate reorder silently.
   */
  const reorderSections = useCallback(
    (sourceId: string, targetId: string, position: "before" | "after") => {
      if (sourceId === targetId) return;
      {
        const sections = layoutRef.current.sections;
        const from = sections.find((e) => e.id === sourceId);
        const to = sections.find((e) => e.id === targetId);
        if (from && to) {
          announce(
            `Section ${from.title} moved ${position} ${to.title}`,
          );
        }
      }
      updateLayout((prev) => {
        const ordered = sortByOrder(
          prev.sections.map((section) => ({
            id: section.id,
            order: section.order,
          })),
        ).map((entry) => entry.id);

        const from = ordered.indexOf(sourceId);
        const to = ordered.indexOf(targetId);
        if (from === -1 || to === -1) return prev;

        const without = ordered.filter((id) => id !== sourceId);
        let insertAt = without.indexOf(targetId);
        if (position === "after") insertAt += 1;
        const nextOrder = [
          ...without.slice(0, insertAt),
          sourceId,
          ...without.slice(insertAt),
        ];

        if (nextOrder.every((id, i) => id === ordered[i])) return prev;

        const rank = new Map(nextOrder.map((id, i) => [id, i]));
        return {
          ...prev,
          sections: prev.sections.map((section) => ({
            ...section,
            order: rank.get(section.id) ?? section.order,
          })),
        };
      });
    },
    [updateLayout, announce],
  );

  /** Move a section one place up or down. The keyboard path for reordering. */
  const moveSection = useCallback(
    (sectionId: string, direction: -1 | 1) => {
      const moved = layoutRef.current.sections.find((e) => e.id === sectionId);
      if (moved) {
        announce(
          `Section ${moved.title} moved ${direction < 0 ? "up" : "down"}`,
        );
      }
      updateLayout((prev) => {
        const ordered = sortByOrder(
          prev.sections.map((section) => ({
            id: section.id,
            order: section.order,
          })),
        ).map((entry) => entry.id);
        const from = ordered.indexOf(sectionId);
        const to = from + direction;
        if (from === -1 || to < 0 || to >= ordered.length) return prev;

        const next = [...ordered];
        next.splice(to, 0, next.splice(from, 1)[0]);
        const rank = new Map(next.map((id, i) => [id, i]));
        return {
          ...prev,
          sections: prev.sections.map((section) => ({
            ...section,
            order: rank.get(section.id) ?? section.order,
          })),
        };
      });
    },
    [updateLayout, announce],
  );

  const removeSection = useCallback(
    (sectionId: string) => {
      const section = layoutRef.current.sections.find(
        (entry) => entry.id === sectionId,
      );
      if (section) announce(`Section ${section.title} removed`);
      updateLayout((prev) => {
        const sectionIndex = prev.sections.findIndex((s) => s.id === sectionId);
        if (sectionIndex === -1) return prev;

        // Renumber into fresh objects; the previous version assigned `order`
        // onto the section objects still held in `prev`.
        const newSections = prev.sections
          .filter((_, idx) => idx !== sectionIndex)
          .map((section, idx) => ({ ...section, order: idx }));

        return { ...prev, sections: newSections };
      });
    },
    [updateLayout, announce],
  );

  const setItemPlacement = useCallback(
    (itemId: string, sectionId: string, rowId?: string) => {
      updateLayout((prev) => {
        let found = false;
        const newSections = prev.sections.map((section) => {
          const newRows = section.rows.map((row) => {
            const itemIndex = row.items.findIndex((i) => i.id === itemId);
            if (itemIndex !== -1) {
              found = true;
              const item = row.items[itemIndex];
              return {
                ...row,
                items: [
                  ...row.items.slice(0, itemIndex),
                  { ...item, sectionId, rowId: rowId ?? item.rowId },
                  ...row.items.slice(itemIndex + 1),
                ],
              };
            }
            return row;
          });
          return { ...section, rows: newRows };
        });

        if (!found) return prev;
        return { ...prev, sections: newSections };
      });
    },
    [updateLayout],
  );

  const reorderItems = useCallback(
    (sourceId: string, targetId: string, position: "before" | "after") => {
      if (sourceId === targetId) return;
      {
        const from = findLayoutItem(layoutRef.current, sourceId);
        const to = findLayoutItem(layoutRef.current, targetId);
        if (from && to) {
          announce(
            `${titleOf(from.definitionId)} moved ${position} ${titleOf(to.definitionId)}`,
          );
        }
      }
      updateLayout((prev) => {
        // Find source and target positions (read-only — do not mutate prev)
        let sourceSectionIndex = -1;
        let sourceRowIndex = -1;
        let sourceItemIndex = -1;
        let targetSectionIndex = -1;
        let targetRowIndex = -1;
        let targetItemIndex = -1;

        prev.sections.forEach((section, sIdx) => {
          section.rows.forEach((row, rIdx) => {
            const srcIdx = row.items.findIndex((i) => i.id === sourceId);
            if (srcIdx !== -1) {
              sourceSectionIndex = sIdx;
              sourceRowIndex = rIdx;
              sourceItemIndex = srcIdx;
            }
            const tgtIdx = row.items.findIndex((i) => i.id === targetId);
            if (tgtIdx !== -1) {
              targetSectionIndex = sIdx;
              targetRowIndex = rIdx;
              targetItemIndex = tgtIdx;
            }
          });
        });

        if (sourceSectionIndex === -1 || targetSectionIndex === -1) return prev;
        if (
          sourceSectionIndex === targetSectionIndex &&
          sourceRowIndex === targetRowIndex &&
          sourceItemIndex === targetItemIndex
        ) {
          return prev;
        }

        const sourceItem =
          prev.sections[sourceSectionIndex].rows[sourceRowIndex].items[
            sourceItemIndex
          ];
        if (!sourceItem) return prev;

        const sameRow =
          sourceSectionIndex === targetSectionIndex &&
          sourceRowIndex === targetRowIndex;

        // Build next state immutably. Only touch the sections that change.
        const newSections = prev.sections.map((section, sIdx) => {
          if (sIdx !== sourceSectionIndex && sIdx !== targetSectionIndex) {
            return section;
          }

          const newRows = section.rows.map((row, rIdx) => {
            // Same-row move: remove source and re-insert around target in one step
            if (
              sameRow &&
              sIdx === sourceSectionIndex &&
              rIdx === sourceRowIndex
            ) {
              const filtered = row.items.filter(
                (_, i) => i !== sourceItemIndex,
              );
              let insertAt =
                sourceItemIndex < targetItemIndex
                  ? targetItemIndex - 1
                  : targetItemIndex;
              if (position === "after") insertAt += 1;
              insertAt = Math.max(0, Math.min(filtered.length, insertAt));
              const movedItem = {
                ...sourceItem,
                sectionId: section.id,
                rowId: row.id,
              };
              const nextItems = [
                ...filtered.slice(0, insertAt),
                movedItem,
                ...filtered.slice(insertAt),
              ].map((item, i) => ({ ...item, order: i }));
              return { ...row, items: nextItems };
            }

            // Different row: remove source from its row
            if (sIdx === sourceSectionIndex && rIdx === sourceRowIndex) {
              const remainingItems = row.items.filter(
                (_, i) => i !== sourceItemIndex,
              );
              const hasSpacer = remainingItems.some((i) => i.isSpacer);

              let nextItems: SmartGridItem[];
              if (!hasSpacer && remainingItems.length > 0) {
                const remainingIds = remainingItems.map((i) => i.id);
                const newSpans = distributeSpans(remainingIds, maxColumns);

                nextItems = row.items
                  .filter((_, i) => i !== sourceItemIndex)
                  .map((item) => {
                    const newSpan = newSpans.get(item.id);
                    if (newSpan !== undefined && newSpan !== item.span) {
                      return { ...item, span: newSpan };
                    }
                    return item;
                  })
                  .map((item, i) => ({ ...item, order: i }));
              } else {
                nextItems = row.items
                  .filter((_, i) => i !== sourceItemIndex)
                  .map((item, i) => ({ ...item, order: i }));
              }

              return { ...row, items: nextItems };
            }

            // Different row: insert source into the target row
            if (sIdx === targetSectionIndex && rIdx === targetRowIndex) {
              let insertAt = targetItemIndex;
              if (position === "after") insertAt += 1;
              insertAt = Math.max(0, Math.min(row.items.length, insertAt));
              const movedItem = {
                ...sourceItem,
                sectionId: section.id,
                rowId: row.id,
              };
              const nextItems = [
                ...row.items.slice(0, insertAt),
                movedItem,
                ...row.items.slice(insertAt),
              ].map((item, i) => ({ ...item, order: i }));
              
              const itemDef = items.find(i => i.id === sourceItem.definitionId);
              const newHeightSpan = itemDef?.defaultRowHeightSpan !== undefined
                ? Math.min(12, Math.max(0, Math.round(itemDef.defaultRowHeightSpan)))
                : row.heightSpan;
              
              return { ...row, items: nextItems, heightSpan: newHeightSpan };
            }

            return row;
          });

          return { ...section, rows: newRows };
        });

        return { ...prev, sections: newSections };
      });
    },
    [updateLayout, items, maxColumns, announce, titleOf],
  );

  const moveItemToSectionEnd = useCallback(
    (itemId: string, sectionId: string) => {
      updateLayout((prev) => {
        // Locate source (read-only — do not mutate prev)
        let sourceSectionIndex = -1;
        let sourceRowIndex = -1;
        let sourceItemIndex = -1;

        prev.sections.forEach((section, sIdx) => {
          section.rows.forEach((row, rIdx) => {
            const itemIndex = row.items.findIndex((i) => i.id === itemId);
            if (itemIndex !== -1) {
              sourceSectionIndex = sIdx;
              sourceRowIndex = rIdx;
              sourceItemIndex = itemIndex;
            }
          });
        });

        if (sourceSectionIndex === -1) return prev;

        const targetSectionIndex = prev.sections.findIndex(
          (s) => s.id === sectionId,
        );
        if (targetSectionIndex === -1) return prev;

        const sourceItem =
          prev.sections[sourceSectionIndex].rows[sourceRowIndex].items[
            sourceItemIndex
          ];
        if (!sourceItem) return prev;

        const targetSection = prev.sections[targetSectionIndex];
        // Find last non-empty row in target section (may be -1 if none)
        let targetRowIndex = -1;
        for (let i = targetSection.rows.length - 1; i >= 0; i--) {
          if (targetSection.rows[i].items.length > 0) {
            targetRowIndex = i;
            break;
          }
        }

        const sameSection = sourceSectionIndex === targetSectionIndex;
        const sameRow = sameSection && sourceRowIndex === targetRowIndex;

        // If the item is already the last one in the last non-empty row of the target section,
        // nothing to do.
        if (
          sameRow &&
          sourceItemIndex ===
            targetSection.rows[targetRowIndex].items.length - 1
        ) {
          return prev;
        }

        // Prepare the moved item with updated parent refs.
        // The rowId may change below if we create a new row.
        const newRowIdForEmptyTarget =
          targetRowIndex === -1 ? makeId(`row:${sectionId}`) : null;

        const movedItem: SmartGridItem = {
          ...sourceItem,
          sectionId,
          rowId:
            newRowIdForEmptyTarget ?? targetSection.rows[targetRowIndex].id,
        };

        const itemDef = items.find(i => i.id === sourceItem.definitionId);
        const newItemHeightSpan = itemDef?.defaultRowHeightSpan !== undefined
          ? Math.min(12, Math.max(0, Math.round(itemDef.defaultRowHeightSpan)))
          : undefined;

        // Build next state immutably.
        const newSections = prev.sections.map((section, sIdx) => {
          if (sIdx !== sourceSectionIndex && sIdx !== targetSectionIndex) {
            return section;
          }

          // Same-section case: one map pass removes source and appends target
          if (sameSection && sIdx === sourceSectionIndex) {
            // Remove source from its row first
            const rowsWithSourceRemoved = section.rows.map((row, rIdx) => {
              if (rIdx !== sourceRowIndex) return row;
              const nextItems = row.items
                .filter((_, i) => i !== sourceItemIndex)
                .map((item, i) => ({ ...item, order: i }));
              return { ...row, items: nextItems };
            });

            // After removal, recompute target row index if we need to create a fresh row
            if (newRowIdForEmptyTarget) {
              return {
                ...section,
                rows: [
                  ...rowsWithSourceRemoved,
                  {
                    id: newRowIdForEmptyTarget,
                    items: [{ ...movedItem, order: 0 }],
                    order: rowsWithSourceRemoved.length,
                    heightSpan: newItemHeightSpan ?? 0,
                  },
                ],
              };
            }

            const targetRowId = targetSection.rows[targetRowIndex].id;
            const rowsWithTarget = rowsWithSourceRemoved.map((row) => {
              if (row.id !== targetRowId) return row;
              const appended = [
                ...row.items,
                { ...movedItem, order: row.items.length },
              ];
              const targetRowHeightSpan = newItemHeightSpan ?? row.heightSpan;
              return { ...row, items: appended, heightSpan: targetRowHeightSpan };
            });
            return { ...section, rows: rowsWithTarget };
          }

          // Different sections: source section just removes the item
          if (sIdx === sourceSectionIndex) {
            const newRows = section.rows.map((row, rIdx) => {
              if (rIdx !== sourceRowIndex) return row;
              const nextItems = row.items
                .filter((_, i) => i !== sourceItemIndex)
                .map((item, i) => ({ ...item, order: i }));
              return { ...row, items: nextItems };
            });
            return { ...section, rows: newRows };
          }

          // Different sections: target section appends the item
          if (sIdx === targetSectionIndex) {
            if (newRowIdForEmptyTarget) {
              return {
                ...section,
                rows: [
                  ...section.rows,
                  {
                    id: newRowIdForEmptyTarget,
                    items: [{ ...movedItem, order: 0 }],
                    order: section.rows.length,
                    heightSpan: newItemHeightSpan ?? 0,
                  },
                ],
              };
            }
            const targetRowId = targetSection.rows[targetRowIndex].id;
            const newRows = section.rows.map((row) => {
              if (row.id !== targetRowId) return row;
              const appended = [
                ...row.items,
                { ...movedItem, order: row.items.length },
              ];
              const targetRowHeightSpan = newItemHeightSpan ?? row.heightSpan;
              return { ...row, items: appended, heightSpan: targetRowHeightSpan };
            });
            return { ...section, rows: newRows };
          }

          return section;
        });

        return { ...prev, sections: newSections };
      });
    },
    [updateLayout, items],
  );

  // Atomically remove an item from its current row and place it in a newly-appended
  // row at the end of the target section. Used by the "drop here to add item to new
  // row" / "drop to create a new section" drop zones, where the user's intent is for
  // the dragged item to appear inside the freshly-created row — not to fall back into
  // an existing non-empty row the way moveItemToSectionEnd would.
  const moveItemToNewRow = useCallback(
    (itemId: string, sectionId: string) => {
      const newRowId = makeId(`row:${sectionId}`);
      updateLayout((prev) => {
        const targetSectionIndex = prev.sections.findIndex(
          (s) => s.id === sectionId,
        );
        if (targetSectionIndex === -1) return prev;

        let sourceSectionIndex = -1;
        let sourceRowIndex = -1;
        let sourceItemIndex = -1;

        prev.sections.forEach((section, sIdx) => {
          section.rows.forEach((row, rIdx) => {
            const idx = row.items.findIndex((i) => i.id === itemId);
            if (idx !== -1) {
              sourceSectionIndex = sIdx;
              sourceRowIndex = rIdx;
              sourceItemIndex = idx;
            }
          });
        });

        if (sourceSectionIndex === -1) return prev;

        const sourceSection = prev.sections[sourceSectionIndex];
        const sourceRow = sourceSection.rows[sourceRowIndex];
        const sourceItem = sourceRow.items[sourceItemIndex];
        if (!sourceItem) return prev;

        // Resize items in source row
        const remainingItems = sourceRow.items.filter(
          (_, i) => i !== sourceItemIndex,
        );
        const hasSpacer = remainingItems.some((i) => i.isSpacer);

        let nextItems: SmartGridItem[];
        if (!hasSpacer && remainingItems.length > 0) {
          const remainingIds = remainingItems.map((i) => i.id);
          const newSpans = distributeSpans(remainingIds, maxColumns);

          nextItems = sourceRow.items
            .filter((_, i) => i !== sourceItemIndex)
            .map((item) => {
              const newSpan = newSpans.get(item.id);
              if (newSpan !== undefined && newSpan !== item.span) {
                return { ...item, span: newSpan };
              }
              return item;
            })
            .map((item, i) => ({ ...item, order: i }));
        } else {
          nextItems = sourceRow.items
            .filter((_, i) => i !== sourceItemIndex)
            .map((item, i) => ({ ...item, order: i }));
        }

        const movedItem: SmartGridItem = {
          ...sourceItem,
          // Keeps `sourceItem.id`. It used to mint a fresh one, which made
          // this a copy rather than a move: anything keyed by item id was
          // orphaned, and a `single` item could end up with two layout
          // entries pointing at one definition — the thing `single` exists
          // to prevent.
          sectionId,
          rowId: newRowId,
          order: 0,
          span: maxColumns, // New row item takes full width
        };

        const itemDef = items.find(i => i.id === sourceItem.definitionId);
        const newHeightSpan = itemDef?.defaultRowHeightSpan !== undefined
          ? Math.min(12, Math.max(0, Math.round(itemDef.defaultRowHeightSpan)))
          : 0;

        const newSections = prev.sections.map((section, sIdx) => {
          if (sIdx !== sourceSectionIndex && sIdx !== targetSectionIndex)
            return section;

          let newRows = section.rows;

          if (sIdx === sourceSectionIndex) {
            newRows = newRows.map((row, rIdx) => {
              if (rIdx !== sourceRowIndex) return row;
              return { ...row, items: nextItems };
            });
          }

          if (sIdx === targetSectionIndex) {
            newRows = [
              ...newRows,
              {
                id: newRowId,
                items: [movedItem],
                order: newRows.length,
                heightSpan: newHeightSpan,
              },
            ];
          }

          return { ...section, rows: newRows };
        });

        return { ...prev, sections: newSections };
      });
    },
    [updateLayout, items, maxColumns],
  );


  /**
   * Move one column between a pair of adjacent tiles.
   *
   * The resize handles were `onMouseDown`-only, so column widths could not be
   * changed from a keyboard at all — and drag-and-drop has no keyboard story
   * either, which together made the editor pointer-only. This is the same
   * operation the drag performs, one column at a time.
   */
  const nudgeSpan = useCallback(
    (leftId: string, rightId: string, direction: -1 | 1) => {
      updateLayout((prev) => {
        let changed = false;
        const sections = prev.sections.map((section) => ({
          ...section,
          rows: section.rows.map((row) => {
            const left = row.items.find((i) => i.id === leftId);
            const right = row.items.find((i) => i.id === rightId);
            if (!left || !right) return row;
            const nextLeft = left.span + direction;
            const nextRight = right.span - direction;
            if (nextLeft < 1 || nextRight < 1) return row;
            changed = true;
            announce(
              `${titleOf(left.definitionId)} ${nextLeft} of ${maxColumns} columns, ` +
                `${titleOf(right.definitionId)} ${nextRight}`,
            );
            return {
              ...row,
              items: row.items.map((item) =>
                item.id === leftId
                  ? { ...item, span: nextLeft }
                  : item.id === rightId
                    ? { ...item, span: nextRight }
                    : item,
              ),
            };
          }),
        }));
        return changed ? { ...prev, sections } : prev;
      });
    },
    [updateLayout, announce, titleOf, maxColumns],
  );

  /**
   * Keyboard row resizing — the row-height drag handle had no keyboard
   * equivalent (mouse-only, WCAG 2.1.1 gap). ArrowUp/ArrowDown move the
   * row one span (ROW_SPAN_SIZE px), same clamps as the mouse path
   * (1..MAX_ROW_SPANS), with the same SR announcement.
   */
  const nudgeRowHeight = useCallback(
    (sectionId: string, rowId: string, direction: -1 | 1) => {
      updateLayout((prev) => {
        let changed = false;
        const sections = prev.sections.map((section) => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            rows: section.rows.map((row) => {
              if (row.id !== rowId) return row;
              const current =
                row.heightSpan ?? (row.height ? heightToSpan(row.height) : 0);
              const next = Math.max(
                1,
                Math.min(MAX_ROW_SPANS, current + direction),
              );
              if (next === current) return row;
              changed = true;
              announce(`Row height ${next} of ${MAX_ROW_SPANS}`);
              return { ...row, height: next * ROW_SPAN_SIZE, heightSpan: next };
            }),
          };
        });
        return changed ? { ...prev, sections } : prev;
      });
    },
    [updateLayout, announce],
  );

  /**
   * Keyboard tile moving: lift, move, place.
   *
   * Drag-and-drop had no keyboard equivalent at all, so the *primary* action
   * of the editor — move a tile — was mouse-only. A grab/move/place model is
   * the accessible equivalent of a drag: Space or Enter lifts the tile, the
   * arrows move it a slot at a time, Space or Enter places it, and Escape puts
   * it back where it started.
   *
   * The pre-lift layout is kept so Escape can restore it, which is what makes
   * the mode safe to explore.
   */
  const [grabbedId, setGrabbedId] = useState<string | null>(null);
  const grabOriginRef = useRef<SmartGridLayoutState | null>(null);

  const liftItem = useCallback(
    (itemId: string) => {
      const entry = findLayoutItem(layoutRef.current, itemId);
      if (!entry) return;
      grabOriginRef.current = layoutRef.current;
      setGrabbedId(itemId);
      announce(
        `${titleOf(entry.definitionId)} lifted. Use the arrow keys to move it, ` +
          `Enter to place it, Escape to cancel.`,
      );
    },
    [announce, titleOf],
  );

  const placeItem = useCallback(() => {
    const entry = grabbedId
      ? findLayoutItem(layoutRef.current, grabbedId)
      : null;
    grabOriginRef.current = null;
    setGrabbedId(null);
    if (entry) announce(`${titleOf(entry.definitionId)} placed`);
  }, [grabbedId, announce, titleOf]);

  const cancelGrab = useCallback(() => {
    const origin = grabOriginRef.current;
    grabOriginRef.current = null;
    setGrabbedId(null);
    if (origin) {
      setLayout(origin);
      onLayoutChange?.(origin);
      announce("Move cancelled");
    }
  }, [announce, onLayoutChange]);

  /** One step in a direction, expressed through the existing move actions. */
  const moveGrabbedItem = useCallback(
    (itemId: string, direction: "left" | "right" | "up" | "down") => {
      const layout = layoutRef.current;
      let section: SmartGridSection | undefined;
      let row: SmartGridRow | undefined;
      let index = -1;
      layout.sections.forEach((sec) =>
        sec.rows.forEach((r) => {
          const i = r.items.findIndex((item) => item.id === itemId);
          if (i !== -1) {
            section = sec;
            row = r;
            index = i;
          }
        }),
      );
      if (!section || !row || index === -1) return;

      if (direction === "left" || direction === "right") {
        const neighbourIndex = direction === "left" ? index - 1 : index + 1;
        const neighbour = row.items[neighbourIndex];
        if (!neighbour) {
          announce("Edge of the row");
          return;
        }
        reorderItems(itemId, neighbour.id, direction === "left" ? "before" : "after");
        return;
      }

      const rowIndex = section.rows.findIndex((r) => r.id === row!.id);
      const targetRow =
        section.rows[direction === "up" ? rowIndex - 1 : rowIndex + 1];
      if (!targetRow || targetRow.items.length === 0) {
        announce(direction === "up" ? "Top row" : "Bottom row");
        return;
      }
      // Into the adjacent row, at the nearest slot to where it sat.
      const target =
        targetRow.items[Math.min(index, targetRow.items.length - 1)];
      reorderItems(itemId, target.id, index >= targetRow.items.length ? "after" : "before");
    },
    [reorderItems, announce],
  );

  const tileKeyHandler = useCallback(
    (itemId: string) => (event: React.KeyboardEvent) => {
      if (!isEditMode) return;
      const key = event.key;
      if (key === " " || key === "Enter") {
        event.preventDefault();
        if (grabbedId === itemId) placeItem();
        else liftItem(itemId);
        return;
      }
      if (grabbedId !== itemId) return;
      if (key === "Escape") {
        event.preventDefault();
        cancelGrab();
        return;
      }
      const map: Record<string, "left" | "right" | "up" | "down"> = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
      };
      const direction = map[key];
      if (!direction) return;
      event.preventDefault();
      moveGrabbedItem(itemId, direction);
    },
    [isEditMode, grabbedId, placeItem, liftItem, cancelGrab, moveGrabbedItem],
  );

  const resizeKeyHandler = useCallback(
    (leftId: string, rightId: string) =>
      (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          nudgeSpan(leftId, rightId, -1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          nudgeSpan(leftId, rightId, 1);
        }
      },
    [nudgeSpan],
  );

  const beginResize = useCallback(
    (
      event: React.MouseEvent,
      rowDomKey: string,
      leftId: string,
      rightId: string,
      leftSpan: number,
      rightSpan: number,
    ) => {
      if (!isEditMode) return;
      event.preventDefault();
      event.stopPropagation();

      const rowEl = rowRefs.current[rowDomKey];
      if (!rowEl) return;

      const rect = rowEl.getBoundingClientRect();
      const colWidth =
        (rect.width - (maxColumns - 1) * sizeToken.gapPx) / maxColumns;
      if (!Number.isFinite(colWidth) || colWidth <= 0) return;

      resizeChangedRef.current = false;
      setResizeState({
        leftId,
        rightId,
        startX: event.clientX,
        startLeftSpan: leftSpan,
        pairTotal: leftSpan + rightSpan,
        colWidth,
      });
    },
    [isEditMode, maxColumns],
  );

  const beginRowResize = useCallback(
    (
      event: React.MouseEvent,
      rowId: string,
      sectionId: string,
      startHeight: number,
      startHeightSpan: number,
    ) => {
      if (!isEditMode) return;
      event.preventDefault();
      event.stopPropagation();

      resizeChangedRef.current = false;
      setRowResizeState({
        rowId,
        sectionId,
        startY: event.clientY,
        startHeight,
        startHeightSpan,
      });
    },
    [isEditMode],
  );

  useEffect(() => {
    if (!resizeState) return;

    const onMouseMove = (event: MouseEvent) => {
      const deltaColumns = Math.round(
        (event.clientX - resizeState.startX) / resizeState.colWidth,
      );
      const nextLeft = Math.max(
        1,
        Math.min(
          resizeState.pairTotal - 1,
          resizeState.startLeftSpan + deltaColumns,
        ),
      );
      const nextRight = resizeState.pairTotal - nextLeft;

      setLayout((prev) => {
        let leftItem: SmartGridItem | undefined;
        let rightItem: SmartGridItem | undefined;

        prev.sections.forEach((section) => {
          section.rows.forEach((row) => {
            if (!leftItem) {
              leftItem = row.items.find((i) => i.id === resizeState.leftId);
            }
            if (!rightItem) {
              rightItem = row.items.find((i) => i.id === resizeState.rightId);
            }
          });
        });

        if (!leftItem || !rightItem) return prev;

        let shouldUpdate = false;

        if (resizeState.leftId === resizeState.rightId) {
          if (leftItem.span === nextLeft) return prev;
          shouldUpdate = true;
        } else {
          if (leftItem.span === nextLeft && rightItem.span === nextRight)
            return prev;
          shouldUpdate = true;
        }

        resizeChangedRef.current = true;

        if (shouldUpdate) {
          const newSections = prev.sections.map((section) => ({
            ...section,
            rows: section.rows.map((row) => ({
              ...row,
              items: row.items.map((item) => {
                if (item.id === resizeState.leftId) {
                  return { ...item, span: nextLeft };
                }
                if (
                  resizeState.leftId !== resizeState.rightId &&
                  item.id === resizeState.rightId
                ) {
                  return { ...item, span: nextRight };
                }
                return item;
              }),
            })),
          }));

          return { ...prev, sections: newSections };
        }

        return prev;
      });
    };

    const onMouseUp = () => {
      setResizeState(null);
      if (resizeChangedRef.current) {
        onLayoutChange?.(layoutRef.current);
        scheduleSave(layoutRef.current);
      }
      resizeChangedRef.current = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onLayoutChange, scheduleSave, resizeState]);

  useEffect(() => {
    if (!rowResizeState) return;

    const onMouseMove = (event: MouseEvent) => {
      const deltaHeight = event.clientY - rowResizeState.startY;
      const newHeight = rowResizeState.startHeight + deltaHeight;
      
      let newSpan = Math.round(newHeight / ROW_SPAN_SIZE);
      
      if (rowResizeState.startHeightSpan > 0) {
        newSpan = Math.max(1, Math.min(MAX_ROW_SPANS, newSpan));
      }
      
      const newHeightPx = newSpan * ROW_SPAN_SIZE;

      setLayout((prev) => {
        const targetSection = prev.sections.find(
          (s) => s.id === rowResizeState.sectionId,
        );
        if (!targetSection) return prev;

        const targetRow = targetSection.rows.find(
          (r) => r.id === rowResizeState.rowId,
        );
        if (!targetRow || (targetRow.height === newHeightPx && targetRow.heightSpan === newSpan)) return prev;

        resizeChangedRef.current = true;

        const newSections = prev.sections.map((section) => {
          if (section.id !== rowResizeState.sectionId) return section;
          return {
            ...section,
            rows: section.rows.map((row) => {
              if (row.id !== rowResizeState.rowId) return row;
              return { ...row, height: newHeightPx, heightSpan: newSpan };
            }),
          };
        });

        return { ...prev, sections: newSections };
      });
    };

    const onMouseUp = () => {
      setRowResizeState(null);
      if (resizeChangedRef.current) {
        onLayoutChange?.(layoutRef.current);
        scheduleSave(layoutRef.current);
      }
      resizeChangedRef.current = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onLayoutChange, scheduleSave, rowResizeState]);

  const editTheme = getEditToneTokens(effectiveTone);

  const resetDragState = useCallback(() => {
    setDraggingId(null);
    setDragOver(null);
    setEmptyRowDropTarget(null);
    setSectionBottomDropTarget(null);
    setNewSectionDropTarget(false);
    setRowPreview(null);
    draggingSectionRef.current = null;
    setDraggingSectionId(null);
    setHiddenSectionId(null);
    setSectionDragOver(null);
    overDeleteZoneRef.current = false;
    setOverDeleteZone(false);
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      resetDragState();
      setEditingSectionId(null);
      setSectionDraftTitle("");
      setRowAddTarget(null);
      setIsPaletteOpen(false);
    }
  }, [isEditMode, resetDragState]);

  const getDraggedId = useCallback(
    (event: React.DragEvent): string | null => {
      return draggingId ?? (event.dataTransfer.getData("text/plain") || null);
    },
    [draggingId],
  );

  // Shown when the component owns edit mode, or when the host asked to be
  // told about it. A host driving `isEditMode` with its own chrome and no
  // `onEditModeChange` gets no toolbar, which is what it wants.
  const showToolbar =
    !readOnly && (!isEditModeControlled || Boolean(onEditModeChange));

  /**
   * The section order as it would be *after* the drop, with a ghost standing in
   * for the dragged section.
   *
   * This mirrors how a row previews an incoming item: the placeholder occupies
   * real space, so the sections below visibly move down and the user sees the
   * result rather than a hairline hinting at it. The dragged section is pulled
   * out of the list entirely while it is in flight, which is what makes the
   * others close up behind it.
   */
  const sectionRenderOrder = useMemo<
    { kind: "section" | "ghost"; id: string }[]
  >(() => {
    const base = orderedSectionIds.map((id) => ({
      kind: "section" as const,
      id,
    }));
    if (!draggingSectionId || !sectionDragOver) return base;

    // The dragged section stays in the list. It is `display: none` while in
    // flight so it takes no space, but it must remain *mounted*: unmounting
    // the element a drag started from cancels the drag in every browser.
    const out: { kind: "section" | "ghost"; id: string }[] = [];
    for (const entry of base) {
      if (entry.id === sectionDragOver.id) {
        if (sectionDragOver.position === "before") {
          out.push({ kind: "ghost", id: "__section_ghost__" });
          out.push(entry);
        } else {
          out.push(entry);
          out.push({ kind: "ghost", id: "__section_ghost__" });
        }
      } else {
        out.push(entry);
      }
    }
    return out;
  }, [orderedSectionIds, draggingSectionId, sectionDragOver]);

  /**
   * Height of the ghost, measured from the section actually being dragged, so
   * the space it reserves matches what will land there. A fixed height would
   * make everything below jump again on drop.
   */
  const sectionHeights = useRef<Record<string, number>>({});
  const ghostHeight = draggingSectionId
    ? sectionHeights.current[draggingSectionId]
    : undefined;

  return (
    <div
      ref={containerRef}
      className={["relative", rootPadding, surfaceClasses, className]
        .filter(Boolean)
        .join(" ")}
      /*
        Section drops are handled here, on the container, rather than on each
        section. Per-element hover cannot work for an insertion placeholder:
        the ghost shifts the target out from under the pointer, `dragleave`
        fires, the ghost is removed, the layout shifts back — a flicker loop.
        And once the ghost *is* showing, the pointer is usually over it, so a
        drop landed on an element with no handler and did nothing.
      */
      onDragOver={(event) => {
        const dragging = draggingSectionRef.current;
        if (!dragging) return;
        // Must be called on every dragover or the browser refuses the drop.
        event.preventDefault();
        // Guarded: `dataTransfer` is absent on synthetic events, and throwing
        // here would kill the rest of the handler silently.
        if (event.dataTransfer) event.dataTransfer.dropEffect = "move";

        const others = sectionRectsRef.current.filter(
          (entry) => entry.id !== dragging,
        );
        if (others.length === 0) return;

        const y = event.clientY + window.scrollY;
        const before = others.find((entry) => y < entry.mid);
        const next = before
          ? { id: before.id, position: "before" as const }
          : { id: others[others.length - 1].id, position: "after" as const };

        setSectionDragOver((prev) =>
          prev?.id === next.id && prev.position === next.position ? prev : next,
        );
      }}
      onDrop={(event) => {
        const dragging = draggingSectionRef.current;
        if (!dragging) return;
        event.preventDefault();
        const target = sectionDragOverRef.current;
        draggingSectionRef.current = null;
        setDraggingSectionId(null);
        setHiddenSectionId(null);
        setSectionDragOver(null);
        if (target) {
          reorderSections(dragging, target.id, target.position);
        }
      }}
    >
      <span
        role="status"
        aria-live="polite"
        className="sr-only"
        data-sg-announcer="true"
      >
        {announcement}
      </span>

      {(showToolbar || (isEditMode && draggingId)) && (
        <div
          className={`mb-3 flex items-center justify-between gap-2 ${sizeToken.label}`}
        >
          {/*
            Drop-to-delete, opposite the Undo / Redo / Done controls.
            Only present while an item is actually in flight — an always-on
            delete target is a hazard, and there is nothing to say when nothing
            is being dragged. Removing a tile used to be a button on every
            tile, which meant a destructive control sitting permanently on top
            of the user's own content.
          */}
          {isEditMode && draggingId ? (
            <div
              data-sg-delete-zone="true"
              aria-hidden="true"
              onDragOver={(event) => {
                if (!draggingId) return;
                event.preventDefault();
                event.stopPropagation();
                if (event.dataTransfer) {
                  event.dataTransfer.dropEffect = "move";
                }
                if (!overDeleteZoneRef.current) {
                  overDeleteZoneRef.current = true;
                  setOverDeleteZone(true);
                }
              }}
              onDragLeave={(event) => {
                if (event.currentTarget.contains(event.relatedTarget as Node)) {
                  return;
                }
                overDeleteZoneRef.current = false;
                setOverDeleteZone(false);
              }}
              onDrop={(event) => {
                const id = getDraggedId(event);
                event.preventDefault();
                event.stopPropagation();
                if (id) removeItem(id);
                resetDragState();
              }}
              className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border-2 border-dashed px-3 py-1.5 transition-colors ${
                overDeleteZone
                  ? "border-rose-500 bg-rose-500/20 text-rose-700 dark:border-rose-400 dark:text-rose-200"
                  : "border-rose-300 bg-rose-500/10 text-rose-600 dark:border-rose-700 dark:text-rose-300"
              }`}
            >
              <CustomIcon icon="Trash" className="h-4 w-4" />
              <span>{overDeleteZone ? "Release to remove" : "Drop here to remove"}</span>
            </div>
          ) : (
            <span className="flex-1" />
          )}
          <div
            className={`flex shrink-0 items-center gap-2 ${
              showToolbar ? "" : "invisible"
            }`}
          >
          {isEditMode && historyLimit > 0 && (
            <>
              {/*
                Worded, not arrows. The registry has no undo/redo glyph, and a
                bare ← / → beside a "Done" button reads as pagination — which
                is exactly how it looked once rendered.
              */}
              <Button
                type="button"
                variant={editorIconVariant}
                size="xs"
                color={effectiveTone}
                disabled={!canUndo}
                onClick={undo}
                title="Undo (Ctrl+Z)"
              >
                Undo
              </Button>
              <Button
                type="button"
                variant={editorIconVariant}
                size="xs"
                color={effectiveTone}
                disabled={!canRedo}
                onClick={redo}
                title="Redo (Ctrl+Shift+Z)"
              >
                Redo
              </Button>
            </>
          )}
          {isEditMode && (storageKey || onLayoutChange) && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              color="rose"
              onClick={resetLayout}
            >
              Reset layout
            </Button>
          )}
          {/*
            The one toolbar button that still ignored the surface: it was
            pinned solid/outline, so a glass dashboard got a bordered chip
            beside its glass controls. It follows `editorButtonVariant` like
            the rest, which means the surface by default and `controlVariant`
            when that is set. Edit mode is signalled by the label and by the
            toolbar filling with controls, not by a variant swap.
          */}
          <Button
            type="button"
            variant={editorButtonVariant}
            size="xs"
            color={effectiveTone}
            onClick={() => setEditMode(!isEditMode)}
          >
            {isEditMode ? "Done" : "Edit layout"}
          </Button>
          </div>
        </div>
      )}
      {/*
        Built on the kit's `SidePanel`, so it inherits the slide animation, the
        resize grip and the surface handling instead of maintaining its own.
        (This comment used to describe a Modal; the palette replaced that, and
        the note outlived what it was about.)
      */}
      <SmartGridItemPalette
        items={addableItems}
        open={isEditMode && isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onAdd={(definitionId) => {
          const target =
            rowAddTarget ??
            (() => {
              // No explicit target: append to the last row of the last
              // section, which is where a click without a drag means.
              const section = layout.sections[layout.sections.length - 1];
              const lastRow = section?.rows[section.rows.length - 1];
              return section && lastRow
                ? { sectionId: section.id, rowId: lastRow.id }
                : null;
            })();
          if (!target) return;
          addItemToRow(definitionId, target.sectionId, target.rowId);
        }}
        onDragStart={(definitionId) => {
          paletteDragRef.current = definitionId;
          setPaletteDragId(definitionId);
          captureItemDragGeometry();
        }}
        onDragEnd={() => {
          paletteDragRef.current = null;
          setPaletteDragId(null);
          setRowPreview(null);
        }}
        tone={effectiveTone}
        buttonVariant={editorButtonVariant}
        // The palette is a `SidePanel`, which draws from SideMenu's surface
        // family rather than the grid's. Only the glass/solid distinction
        // carries over; `sidebar` is the standing docked look.
        variant={
          variant === "glass" || variant === "liquid-glass" ? "glass" : "sidebar"
        }
        surfaceTone={surfaceTone}
      />

      {sectionRenderOrder.map((entry) => {
        if (entry.kind === "ghost") {
          return (
            <div
              key="__section_ghost__"
              aria-hidden="true"
              data-sg-section-ghost="true"
              className={`pointer-events-none mb-6 rounded-xl border-2 border-dashed ${editTheme.border} ${editTheme.tint}`}
              style={{ height: Math.max(ghostHeight ?? 0, 96) }}
            />
          );
        }

        const sectionId = entry.id;
        const section = layout.sections.find((s) => s.id === sectionId);
        if (!section) return null;
        const rows = section.rows;

        return (
          <section
            key={sectionId}
            ref={(element) => {
              // Measured only while the section is *visible*. The ref runs
              // again right after the drag hides it, and a `display: none`
              // element measures 0 — which collapsed the ghost to a hairline,
              // the very thing it exists to replace.
              if (!element || hiddenSectionId === sectionId) return;
              const height = element.getBoundingClientRect().height;
              if (height > 0) sectionHeights.current[sectionId] = height;
            }}
            data-sg-section={sectionId}
            // Removed from the flow, not just faded: the point of the ghost is
            // that the remaining sections close up behind the dragged one and
            // reopen at the drop position.
            hidden={hiddenSectionId === sectionId}
            className={`relative mb-6 last:mb-0 ${
              hiddenSectionId === sectionId ? "hidden" : ""
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              {isEditMode && editingSectionId === sectionId ? (
                <div className="flex items-center gap-2">
                  <Input
                    size="sm"
                    tone={effectiveTone}
                    aria-label="Section title"
                    value={sectionDraftTitle}
                    onChange={(event) =>
                      setSectionDraftTitle(event.target.value)
                    }
                    onBlur={() => {
                      renameSection(
                        sectionId,
                        sectionDraftTitle.trim() || "Untitled Section",
                      );
                      setEditingSectionId(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        renameSection(
                          sectionId,
                          sectionDraftTitle.trim() || "Untitled Section",
                        );
                        setEditingSectionId(null);
                      }
                      if (event.key === "Escape") {
                        setEditingSectionId(null);
                      }
                    }}
                    // A11y audit P1-4 triage: this autoFocus is the
                    // legitimate case the rule can't see — it fires only
                    // when the user has just activated the section-rename
                    // control, and the focus lands on the very field that
                    // activation targets (WCAG 2.4.3-safe post-action focus
                    // transfer, cf. APG "focus moves to the input when the
                    // user opens it"). No page-load focus theft; an
                    // explicit ref.focus() effect would do the same thing
                    // with more code.
                    // eslint-disable-next-line jsx-a11y/no-autofocus -- post-action focus transfer on the field the user just asked to rename (WCAG 2.4.3); only autoFocus in the kit
                    autoFocus
                  />
                </div>
              ) : (
                <div className="flex min-w-0 items-center gap-1.5">
                  {isEditMode && orderedSectionIds.length > 1 && (
                    // Only with somewhere to move to: a lone section's handle
                    // is a control that cannot do anything.
                    //
                    // The handle carries the drag, not the whole section: a
                    // draggable section would swallow the item drags starting
                    // inside it.
                    <span
                      draggable
                      role="button"
                      tabIndex={0}
                      aria-label={`Reorder section ${section.title}`}
                      title="Drag to reorder, or focus and use the up and down arrows"
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData(SECTION_MIME, sectionId);
                        // Some browsers will not start a drag at all unless
                        // `text/plain` is present.
                        event.dataTransfer.setData("text/plain", "");
                        draggingSectionRef.current = sectionId;
                        sectionRectsRef.current = [
                          ...(containerRef.current?.querySelectorAll(
                            "[data-sg-section]",
                          ) ?? []),
                        ].map((element) => {
                          const rect = element.getBoundingClientRect();
                          return {
                            id: element.getAttribute("data-sg-section") ?? "",
                            mid: rect.top + rect.height / 2 + window.scrollY,
                          };
                        });
                        setDraggingSectionId(sectionId);
                        setSectionDragOver(null);
                        // Next frame, not now — see `hiddenSectionId`.
                        requestAnimationFrame(() =>
                          setHiddenSectionId(sectionId),
                        );
                      }}
                      onDragEnd={() => {
                        draggingSectionRef.current = null;
                        setDraggingSectionId(null);
                        setHiddenSectionId(null);
                        setSectionDragOver(null);
                      }}
                      onKeyDown={(event) => {
                        // Dragging has no keyboard equivalent, so the handle
                        // doubles as a move control rather than being a
                        // focusable element that does nothing.
                        if (event.key === "ArrowUp") {
                          event.preventDefault();
                          moveSection(sectionId, -1);
                        } else if (event.key === "ArrowDown") {
                          event.preventDefault();
                          moveSection(sectionId, 1);
                        }
                      }}
                      className={`cursor-grab select-none rounded px-1 leading-none opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 active:cursor-grabbing text-${effectiveTone}-600 dark:text-${effectiveTone}-400`}
                    >
                      ⠿
                    </span>
                  )}
                  {isEditMode ? (
                    // The title is the rename affordance. There was a separate
                    // "Rename" button for this, which is a second control for
                    // something the label itself can carry.
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSectionId(sectionId);
                        setSectionDraftTitle(section.title);
                      }}
                      title="Click to rename"
                      className={`truncate rounded px-1 text-left text-xs font-semibold uppercase tracking-[0.15em] transition-colors hover:text-${effectiveTone}-600 focus-visible:outline-none focus-visible:ring-2 dark:hover:text-${effectiveTone}-400 ${surfaceText.muted}`}
                    >
                      {section.title}
                    </button>
                  ) : (
                    <h2
                      className={`truncate text-xs font-semibold uppercase tracking-[0.15em] ${surfaceText.muted}`}
                    >
                      {section.title}
                    </h2>
                  )}
                </div>
              )}

              {isEditMode && addableItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={editorButtonVariant}
                    color={effectiveTone}
                    size="xs"
                    leadingIcon="Add"
                    onClick={() => {
                      const newRowId = makeId(`row:${sectionId}`);
                      setRowAddTarget({ sectionId, rowId: newRowId });
                      setIsPaletteOpen(true);
                    }}
                  >
                    Add Item
                  </Button>
                  {/*
                    `ghost`, matching the "+" on each row rather than the
                    toolbar's buttons — see `ROW_ICON_VARIANT`.
                  */}
                  <IconButton
                    icon="Trash"
                    size="xs"
                    variant={ROW_ICON_VARIANT}
                    color="rose"
                    onClick={() => removeSection(sectionId)}
                    title="Remove section and all items"
                    aria-label="Remove section and all items"
                  />
                </div>
              )}
            </div>

            <div className={sizeToken.rowGap}>
              {rows.map((row, rowIndex) => {
                const rowDomKey = `${sectionId}-${row.id}-${rowIndex}`;
                const isManagedRow = section.rows.some(
                  (r: SmartGridRow) => r.id === row.id,
                );
                const rowContentSpan = maxColumns;
                const isRowPreviewActive = Boolean(
                  isEditMode &&
                    // Either kind of drag: `draggingId` is a layout item being
                    // moved, `paletteDragId` a definition being added. Gating
                    // on the first alone meant a palette drag set the preview
                    // and then never rendered it — the drag looked dead.
                    (draggingId || paletteDragId) &&
                    rowPreview &&
                    rowPreview.sectionId === sectionId &&
                    rowPreview.rowId === row.id,
                );

                // Compute cells from row.items
                const cells = row.items
                  .map((item) => {
                    // Spacers don't have a definition in byId, they're special
                    if (item.isSpacer) {
                      return {
                        kind: "item" as const,
                        id: item.id,
                        entry: {
                          id: item.id,
                          item: {
                            id: item.id,
                            title: "Spacer",
                            active: true,
                            single: false,
                            render: () => null,
                            isSpacer: true,
                          } as SmartGridItemDefinition,
                          state: item,
                          order: item.order,
                          sectionId: section.id,
                          rowId: row.id,
                          isSpacer: true,
                        },
                        span: clampSpan(item.span, rowContentSpan),
                      };
                    }

                    const itemDef = byId.get(item.definitionId);
                    if (!itemDef) return null;
                    return {
                      kind: "item" as const,
                      id: item.id,
                      entry: {
                        id: item.id,
                        item: itemDef,
                        state: item,
                        order: item.order,
                        sectionId: section.id,
                        rowId: row.id,
                        isSpacer: item.isSpacer,
                      },
                      span: clampSpan(item.span, rowContentSpan),
                    };
                  })
                  .filter(
                    (cell): cell is NonNullable<typeof cell> => cell !== null,
                  );

                const isResizePreviewActive = false; // Resize preview not implemented for v3 yet

                const renderCells = (() => {
                  if (!isRowPreviewActive && !isResizePreviewActive) {
                    return cells.map((cell) => ({
                      kind: cell.kind,
                      id: cell.id,
                      span: cell.span,
                      cell,
                    }));
                  }

                  if (
                    isRowPreviewActive &&
                    (draggingId || paletteDragId) &&
                    rowPreview
                  ) {
                    const draggedItem = row.items.find(
                      (i) => i.id === draggingId,
                    );
                    // A palette drag has no layout item yet, so the ghost takes
                    // the definition's own default width.
                    const paletteDef = paletteDragId
                      ? items.find((entry) => entry.id === paletteDragId)
                      : undefined;
                    const draggedSpan = clampSpan(
                      paletteDef?.defaultSpan ?? draggedItem?.span ?? 3,
                      rowContentSpan,
                    );

                    const withoutDragged = cells.filter(
                      (cell) => cell.id !== draggingId,
                    );
                    const insertIndex = Math.max(
                      0,
                      Math.min(rowPreview.insertIndex, withoutDragged.length),
                    );

                    const withGhost = [
                      ...withoutDragged
                        .slice(0, insertIndex)
                        .map((cell) => ({
                          kind: cell.kind,
                          id: cell.id,
                          desiredSpan: clampSpan(
                            cell.entry.state.span,
                            rowContentSpan,
                          ),
                          cell,
                        })),
                      {
                        kind: "ghost" as const,
                        id: "__ghost__",
                        desiredSpan: draggedSpan,
                      },
                      ...withoutDragged
                        .slice(insertIndex)
                        .map((cell) => ({
                          kind: cell.kind,
                          id: cell.id,
                          desiredSpan: clampSpan(
                            cell.entry.state.span,
                            rowContentSpan,
                          ),
                          cell,
                        })),
                    ];

                    const normalized = normalizeRowSpans(
                      withGhost.map((entry) => entry.desiredSpan),
                      rowContentSpan,
                    );

                    return withGhost.map((entry) => ({
                      kind: entry.kind,
                      id: entry.id,
                      span: normalized[withGhost.indexOf(entry)],
                      cell: entry.kind === "item" ? entry.cell : undefined,
                    }));
                  }

                  if (
                    isResizePreviewActive &&
                    resizeState &&
                    cells.length > 0
                  ) {
                    const itemId = resizeState.leftId;
                    const currentSpan = resizeState.startLeftSpan;
                    const resizedSpan = Math.max(
                      1,
                      Math.min(
                        resizeState.pairTotal - 1,
                        currentSpan +
                          Math.round(
                            (0 - resizeState.startX) / resizeState.colWidth,
                          ),
                      ),
                    );

                    const cell = cells[0];
                    const emptySpaceSpan = maxColumns - resizedSpan;

                    const withGhost = [
                      {
                        kind: "item" as const,
                        id: itemId,
                        desiredSpan: resizedSpan,
                        cell,
                      },
                      {
                        kind: "ghost" as const,
                        id: "__empty_space__",
                        desiredSpan: emptySpaceSpan,
                      },
                    ];

                    return withGhost.map((entry) => ({
                      kind: entry.kind,
                      id: entry.id,
                      span: entry.desiredSpan,
                      cell: entry.kind === "item" ? entry.cell : undefined,
                    }));
                  }

                  return cells.map((cell) => ({
                    kind: cell.kind,
                    id: cell.id,
                    span: cell.span,
                    cell,
                  }));
                })();

                const rowHeight = row.heightSpan === 0 ? undefined : spanToHeight(row.heightSpan);
                const rowBorderClass = isEditMode
                  ? `${editTheme.border} border border-dashed rounded-lg`
                  : "";

                return (
                  <div className="flex w-full relative gap-1 flex-col items-center">
                  <div
                    key={row.id}
                    className={`relative w-full ${rowBorderClass}`}
                    style={rowHeight ? { height: rowHeight } : {}}
                  >
                      <div className="flex h-full gap-2 p-2">
                        {isEditMode && cells.length > 0 && (
                          <div className="z-20 flex w-7 shrink-0 items-start justify-center pt-1">
                            <IconButton
                              icon="Trash"
                              size="xs"
                              variant={ROW_ICON_VARIANT}
                              color="rose"
                              onClick={() =>
                                removeRowItems(
                                  sectionId,
                                  row.id,
                                  cells.map((cell) => cell.id),
                                  isManagedRow,
                                )
                              }
                              aria-label="Remove row"
                              title="Remove row"
                            />
                          </div>
                        )}
                        <div
                          ref={(element) => {
                            rowRefs.current[rowDomKey] = element;
                          }}
                          data-sg-row-id={row.id}
                          data-sg-section-id={section.id}
                          className={`relative grid flex-1 ${sizeToken.gapClass} rounded-lg`}
                          style={{
                            gridTemplateColumns: `repeat(${maxColumns}, minmax(0, 1fr))`,
                            height: "100%",
                          }}
                          onDragOver={(event) => {
                            // A section drag is in flight; the item handlers must not claim it.
                            if (draggingSectionRef.current) return;
                            if (!isEditMode) return;
                            // A palette drag carries a *definition* id and no
                            // layout id — it creates rather than moves — so it
                            // has to get past the `sourceId` guard.
                            const paletteId = paletteDragRef.current;
                            const sourceId = paletteId ?? getDraggedId(event);
                            if (!sourceId) return;
                            event.preventDefault();

                            // Only the row the pointer *started* over can claim
                            // the preview; see `rowOwnsPointer`.
                            if (
                              !rowOwnsPointer(
                                row.id,
                                event.clientY + window.scrollY,
                              )
                            ) {
                              return;
                            }

                            if (cells.length === 0) {
                              if (emptyRowDropTarget !== rowDomKey)
                                setEmptyRowDropTarget(rowDomKey);
                              if (
                                !rowPreview ||
                                rowPreview.sectionId !== sectionId ||
                                rowPreview.rowId !== row.id ||
                                rowPreview.insertIndex !== 0
                              ) {
                                setRowPreview({
                                  sectionId,
                                  rowId: row.id,
                                  insertIndex: 0,
                                });
                              }
                              return;
                            }

                            if (emptyRowDropTarget === rowDomKey)
                              setEmptyRowDropTarget(null);

                            const rowCellsWithoutDragged = cells.filter(
                              (cell) => cell.id !== sourceId,
                            );
                            // Against the drag-start snapshot, not live rects:
                            // by now the ghost has already displaced these
                            // cells, so measuring them would fold the previous
                            // measurement back into this one.
                            const snapshot = (
                              itemDragGeomRef.current.cells[row.id] ?? []
                            ).filter((entry) => entry.id !== sourceId);
                            const x = event.clientX + window.scrollX;
                            let nextIndex = rowCellsWithoutDragged.length;

                            for (
                              let i = 0;
                              i < rowCellsWithoutDragged.length;
                              i += 1
                            ) {
                              const candidate = rowCellsWithoutDragged[i];
                              const measured = snapshot.find(
                                (entry) => entry.id === candidate.id,
                              );
                              if (!measured) continue;
                              if (x < measured.mid) {
                                nextIndex = i;
                                break;
                              }
                            }

                            if (
                              !rowPreview ||
                              rowPreview.sectionId !== sectionId ||
                              rowPreview.rowId !== row.id ||
                              rowPreview.insertIndex !== nextIndex
                            ) {
                              setRowPreview({
                                sectionId,
                                rowId: row.id,
                                insertIndex: nextIndex,
                              });
                            }
                          }}
                          onDragLeave={(event) => {
                            // A section drag is in flight; the item handlers must not claim it.
                            if (draggingSectionRef.current) return;
                            if (!isEditMode) return;
                            const nextTarget =
                              event.relatedTarget as Node | null;
                            if (
                              nextTarget &&
                              event.currentTarget.contains(nextTarget)
                            )
                              return;
                            if (emptyRowDropTarget === rowDomKey)
                              setEmptyRowDropTarget(null);
                            // The preview is deliberately *not* cleared here.
                            // Inserting the ghost reflows the row, which pushes
                            // the pointer outside it and fires this very
                            // handler — clearing then snapped the layout back
                            // and re-entered the row, which is the flicker.
                            // Another row claiming it, or the drag ending,
                            // is what clears it now.
                          }}
                          onDrop={(event) => {
                            // A section drag is in flight; the item handlers must not claim it.
                            if (draggingSectionRef.current) return;
                            if (!isEditMode) return;
                            event.preventDefault();

                            // From the palette: place a new item at the
                            // preview's index rather than reordering one.
                            const paletteId = paletteDragRef.current;
                            if (paletteId) {
                              const at =
                                rowPreviewRef.current?.sectionId === sectionId &&
                                rowPreviewRef.current.rowId === row.id
                                  ? rowPreviewRef.current.insertIndex
                                  : cells.length;
                              paletteDragRef.current = null;
                              setPaletteDragId(null);
                              setRowPreview(null);
                              insertItemAt(paletteId, sectionId, row.id, at);
                              return;
                            }

                            const sourceId = getDraggedId(event);
                            if (!sourceId) return;

                            // Clear any active row preview
                            if (rowPreview) {
                              setRowPreview(null);
                            }

                            if (cells.length > 0) {
                              const targetRowId = row.id;
                              const previewIndex =
                                rowPreview?.sectionId === sectionId &&
                                rowPreview.rowId === targetRowId
                                  ? rowPreview.insertIndex
                                  : cells.length;

                              const withoutDragged = cells.filter(
                                (cell) => cell.id !== sourceId,
                              );
                              const safeIndex = Math.max(
                                0,
                                Math.min(previewIndex, withoutDragged.length),
                              );

                              if (withoutDragged.length === 0) {
                                moveItemToSectionEnd(sourceId, sectionId);
                                resetDragState();
                                return;
                              }

                              if (safeIndex <= 0) {
                                reorderItems(
                                  sourceId,
                                  withoutDragged[0].id,
                                  "before",
                                );
                              } else {
                                reorderItems(
                                  sourceId,
                                  withoutDragged[safeIndex - 1].id,
                                  "after",
                                );
                              }
                              setItemPlacement(
                                sourceId,
                                sectionId,
                                targetRowId,
                              );

                              // After reorder, re-balance the spans of ALL items now in the
                              // target row (including the one we just moved) so the row sums to
                              // maxColumns — matching the drag-preview behavior. Without this,
                              // the pre-existing items would get normalized without the moved
                              // item and grow to fill the row, pushing the moved item to wrap.
                              updateLayout((prev) => {
                                const targetSection = prev.sections.find(
                                  (s) => s.id === sectionId,
                                );
                                const targetRow = targetSection?.rows.find(
                                  (r) => r.id === targetRowId,
                                );
                                if (!targetRow || targetRow.items.length === 0)
                                  return prev;

                                const currentSpans = targetRow.items.map((i) =>
                                  clampSpan(i.span, maxColumns),
                                );
                                const newSpans = normalizeRowSpans(
                                  currentSpans,
                                  maxColumns,
                                );

                                // Skip update if nothing would actually change
                                if (
                                  currentSpans.every(
                                    (s, i) => s === newSpans[i],
                                  )
                                )
                                  return prev;

                                const newSections = prev.sections.map(
                                  (section) => {
                                    if (section.id !== sectionId)
                                      return section;
                                    return {
                                      ...section,
                                      rows: section.rows.map((r) => {
                                        if (r.id !== targetRowId) return r;
                                        return {
                                          ...r,
                                          items: r.items.map((item, idx) => ({
                                            ...item,
                                            span: newSpans[idx],
                                          })),
                                        };
                                      }),
                                    };
                                  },
                                );

                                return { ...prev, sections: newSections };
                              });

                              resetDragState();
                              return;
                            }

                            moveItemToSectionEnd(sourceId, sectionId);
                            resetDragState();
                          }}
                        >
                          {cells.length === 0 && (
                            <div
                              key={`empty-row-${row.id}`}
                              className={`flex h-full flex-col items-center justify-center rounded-md border border-dashed p-4 text-center transition ${emptyRowDropTarget === rowDomKey ? `${editTheme.border} ${editTheme.tint} ${surfaceText.heading}` : `${tonePalette.border} ${surfaceText.muted}`}`}
                              style={{
                                gridColumn: `span ${rowContentSpan} / span ${rowContentSpan}`,
                              }}
                            >
                              {isEditMode && isManagedRow && (
                                <div className="mb-2">
                                  <IconButton
                                    icon="Trash"
                                    size="xs"
                                    variant={editorIconVariant}
                                    color="rose"
                                    onClick={() =>
                                      removeRowItems(
                                        sectionId,
                                        row.id,
                                        row.items.map((item) => item.id),
                                        isManagedRow,
                                      )
                                    }
                                    aria-label="Remove row"
                                    title="Remove row"
                                  />
                                </div>
                              )}
                              <p className="text-xs">Empty row. Drag a card here.</p>
                            </div>
                          )}

                          {renderCells.map((renderCell, cellIndex) => {
                            if (renderCell.kind === "ghost") {
                              return (
                                <div
                                  key={`ghost-${renderCell.id}`}
                                  className={`relative z-10 min-h-28 rounded-xl border-2 border-dashed ${editTheme.border} ${editTheme.tint}`}
                                  data-sg-span={renderCell.span}
                                  style={{
                                    gridColumn: `span ${renderCell.span} / span ${renderCell.span}`,
                                  }}
                                />
                              );
                            }

                            const cell = renderCell.cell;
                            if (!cell) return null;

                            const nextItemIndex = renderCells
                              .slice(cellIndex + 1)
                              .findIndex((c) => c.kind === "item");
                            const neighbor =
                              nextItemIndex >= 0
                                ? renderCells[cellIndex + 1 + nextItemIndex]
                                : undefined;
                            const neighborCell =
                              neighbor?.kind === "item"
                                ? neighbor.cell
                                : undefined;

                            const def = byId.get(cell.entry.item.id);
                            if (!def && !cell.entry.isSpacer) return null;

                            if (cell.entry.isSpacer) {
                              return (
                                <div
                                  key={cell.entry.id}
                                  data-sg-item-id={cell.entry.id}
                                  className={`smart-grid-item relative z-10 min-h-0 rounded-xl ${isEditMode ? `border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-500/10 cursor-grab active:cursor-grabbing` : "bg-transparent"} ${
                                    draggingId === cell.entry.id
                                      ? // Nearly invisible, not half-faded. At
                                        // 50% the tile still covered the ghost
                                        // showing where it would land, so the
                                        // one thing the user needs to see was
                                        // hidden behind the thing they are
                                        // moving. The browser's own drag image
                                        // under the cursor is what tells them
                                        // what is in flight.
                                        //
                                        // Opacity only — never
                                        // `pointer-events-none`. Making the
                                        // drag source non-hit-testable while a
                                        // drag is running cancels it outright,
                                        // the same way hiding or unmounting it
                                        // does.
                                        overDeleteZone
                                        ? "opacity-10 scale-95 grayscale"
                                        : "opacity-10 scale-[0.98]"
                                      : ""
                                  }`}
                                  data-sg-span={renderCell.span}
                                  style={{
                                    gridColumn: `span ${renderCell.span} / span ${renderCell.span}`,
                                  }}
                                  draggable={isEditMode}
                                  tabIndex={isEditMode ? 0 : undefined}
                                  role={isEditMode ? "button" : undefined}
                                  aria-grabbed={
                                    isEditMode
                                      ? grabbedId === cell.entry.id
                                      : undefined
                                  }
                                  aria-label={
                                    isEditMode
                                      ? `${cell.entry.item?.title ?? "Item"}. Press Enter to lift, then the arrow keys to move it.`
                                      : undefined
                                  }
                                  onKeyDown={tileKeyHandler(cell.entry.id)}
                                  onDragStart={(event) => {
                                    event.dataTransfer.effectAllowed = "move";
                                    event.dataTransfer.setData(
                                      "text/plain",
                                      cell.entry.id,
                                    );
                                    captureItemDragGeometry();
                                  setDraggingId(cell.entry.id);
                                    setDragOver(null);
                                  }}
                                  onDragEnd={resetDragState}
                                  onDragOver={(event) => {
                                    // A section drag is in flight; the item handlers must not claim it.
                                    if (draggingSectionRef.current) return;
                                    if (!isEditMode || !draggingId) return;
                                    event.preventDefault();
                                    event.stopPropagation();
                                    if (draggingId === cell.entry.id) return;
                                    const rect =
                                      event.currentTarget.getBoundingClientRect();
                                    const position =
                                      event.clientX < rect.left + rect.width / 2
                                        ? "before"
                                        : "after";
                                    if (
                                      !dragOver ||
                                      dragOver.id !== cell.entry.id ||
                                      dragOver.position !== position
                                    ) {
                                      setDragOver({
                                        id: cell.entry.id,
                                        position,
                                      });
                                    }
                                    const previewIndex =
                                      position === "before"
                                        ? cells
                                            .filter(
                                              (entry) =>
                                                entry.id !== draggingId,
                                            )
                                            .findIndex(
                                              (entry) =>
                                                entry.id === cell.entry.id,
                                            )
                                        : cells
                                            .filter(
                                              (entry) =>
                                                entry.id !== draggingId,
                                            )
                                            .findIndex(
                                              (entry) =>
                                                entry.id === cell.entry.id,
                                            ) + 1;
                                    if (
                                      previewIndex >= 0 &&
                                      (!rowPreview ||
                                        rowPreview.sectionId !== sectionId ||
                                        rowPreview.rowId !== row.id ||
                                        rowPreview.insertIndex !== previewIndex)
                                    ) {
                                      setRowPreview({
                                        sectionId,
                                        rowId: row.id,
                                        insertIndex: previewIndex,
                                      });
                                    }
                                  }}
                                  onDragLeave={(event) => {
                                    // A section drag is in flight; the item handlers must not claim it.
                                    if (draggingSectionRef.current) return;
                                    if (!isEditMode || !draggingId) return;
                                    const nextTarget =
                                      event.relatedTarget as Node | null;
                                    if (
                                      nextTarget &&
                                      event.currentTarget.contains(nextTarget)
                                    )
                                      return;
                                    if (dragOver?.id === cell.entry.id)
                                      setDragOver(null);
                                  }}
                                  onDrop={(event) => {
                                    // A section drag is in flight; the item handlers must not claim it.
                                    if (draggingSectionRef.current) return;
                                    if (!isEditMode) return;
                                    event.preventDefault();
                                    event.stopPropagation();
                                    const sourceId = getDraggedId(event);
                                    if (!sourceId || sourceId === cell.entry.id)
                                      return;
                                    const rect =
                                      event.currentTarget.getBoundingClientRect();
                                    const position =
                                      event.clientX < rect.left + rect.width / 2
                                        ? "before"
                                        : "after";
                                    reorderItems(
                                      sourceId,
                                      cell.entry.id,
                                      position,
                                    );
                                    resetDragState();
                                  }}
                                >
                                  {isEditMode && (
                                    <>
                                      {neighborCell && neighbor && (
                                        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- ARIA 1.2 resizable separator: this div is the drag/keyboard resize target itself (WCAG 2.1.1); a button element here would conflict (interactive element with a non-interactive role)
                                        <div
                                          onMouseDown={(event) => {
                                            beginResize(
                                              event,
                                              rowDomKey,
                                              cell.entry.id,
                                              neighborCell.entry.id,
                                              renderCell.span,
                                              neighbor.span,
                                            );
                                          }}
                                          onKeyDown={resizeKeyHandler(
                                            cell.entry.id,
                                            neighborCell.entry.id,
                                          )}
                                          role="separator"
                                          aria-orientation="vertical"
                                          aria-valuenow={renderCell.span}
                                          aria-valuemin={1}
                                          aria-valuemax={maxColumns}
                                          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a resizable separator is the keyboard focus target (WCAG 2.1.1)
                                          tabIndex={0}
                                          className="group absolute left-full top-2 bottom-2 z-10 w-4 cursor-col-resize bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
                                          aria-label="Resize spacer — left and right arrows move one column"
                                        >
                                          <span
                                            className={`absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-150 group-hover:opacity-80 group-focus-visible:opacity-80 ${editTheme.solid} ${resizeState?.leftId === cell.entry.id ? "opacity-90" : ""}`}
                                          />
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              );
                            }
                            return (
                              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- conditional composite: in edit mode this tile is a real control (role="button", tabIndex, aria-grabbed, full keyboard lift/move/place); the handlers and draggable are gated on isEditMode and inert otherwise — the rule cannot see the conditional role
                              <article
                                key={cell.entry.id}
                                data-sg-item-id={cell.entry.id}
                                className={`smart-grid-item relative z-0 min-w-0 min-h-0 transition-[grid-column,transform,box-shadow] duration-150 ease-out ${isEditMode ? "cursor-grab active:cursor-grabbing" : ""} ${
                                    draggingId === cell.entry.id
                                      ? // Nearly invisible, not half-faded. At
                                        // 50% the tile still covered the ghost
                                        // showing where it would land, so the
                                        // one thing the user needs to see was
                                        // hidden behind the thing they are
                                        // moving. The browser's own drag image
                                        // under the cursor is what tells them
                                        // what is in flight.
                                        //
                                        // Opacity only — never
                                        // `pointer-events-none`. Making the
                                        // drag source non-hit-testable while a
                                        // drag is running cancels it outright,
                                        // the same way hiding or unmounting it
                                        // does.
                                        overDeleteZone
                                        ? "opacity-10 scale-95 grayscale"
                                        : "opacity-10 scale-[0.98]"
                                      : ""
                                  }`}
                                data-sg-span={renderCell.span}
                                style={{
                                  gridColumn: `span ${renderCell.span} / span ${renderCell.span}`,
                                }}
                                draggable={isEditMode}
                                tabIndex={isEditMode ? 0 : undefined}
                                role={isEditMode ? "button" : undefined}
                                aria-grabbed={
                                  isEditMode
                                    ? grabbedId === cell.entry.id
                                    : undefined
                                }
                                aria-label={
                                  isEditMode
                                    ? `${cell.entry.item?.title ?? "Item"}. Press Enter to lift, then the arrow keys to move it.`
                                    : undefined
                                }
                                onKeyDown={tileKeyHandler(cell.entry.id)}
                                onDragStart={(event) => {
                                  event.dataTransfer.effectAllowed = "move";
                                  event.dataTransfer.setData(
                                    "text/plain",
                                    cell.entry.id,
                                  );
                                  captureItemDragGeometry();
                                  setDraggingId(cell.entry.id);
                                  setDragOver(null);
                                }}
                                onDragEnd={resetDragState}
                                onDragOver={(event) => {
                                  // A section drag is in flight; the item handlers must not claim it.
                                  if (draggingSectionRef.current) return;
                                  if (!isEditMode || !draggingId) return;
                                  event.preventDefault();
                                  event.stopPropagation();
                                  if (draggingId === cell.entry.id) return;
                                  const rect =
                                    event.currentTarget.getBoundingClientRect();
                                  const position =
                                    event.clientX < rect.left + rect.width / 2
                                      ? "before"
                                      : "after";
                                  if (
                                    !dragOver ||
                                    dragOver.id !== cell.entry.id ||
                                    dragOver.position !== position
                                  ) {
                                    setDragOver({
                                      id: cell.entry.id,
                                      position,
                                    });
                                  }

                                  const previewIndex =
                                    position === "before"
                                      ? cells
                                          .filter(
                                            (entry) => entry.id !== draggingId,
                                          )
                                          .findIndex(
                                            (entry) =>
                                              entry.id === cell.entry.id,
                                          )
                                      : cells
                                          .filter(
                                            (entry) => entry.id !== draggingId,
                                          )
                                          .findIndex(
                                            (entry) =>
                                              entry.id === cell.entry.id,
                                          ) + 1;

                                  if (
                                    previewIndex >= 0 &&
                                    (!rowPreview ||
                                      rowPreview.sectionId !== sectionId ||
                                      rowPreview.rowId !== row.id ||
                                      rowPreview.insertIndex !== previewIndex)
                                  ) {
                                    setRowPreview({
                                      sectionId,
                                      rowId: row.id,
                                      insertIndex: previewIndex,
                                    });
                                  }
                                }}
                                onDragLeave={(event) => {
                                  // A section drag is in flight; the item handlers must not claim it.
                                  if (draggingSectionRef.current) return;
                                  if (!isEditMode || !draggingId) return;
                                  const nextTarget =
                                    event.relatedTarget as Node | null;
                                  if (
                                    nextTarget &&
                                    event.currentTarget.contains(nextTarget)
                                  )
                                    return;
                                  if (dragOver?.id === cell.entry.id)
                                    setDragOver(null);
                                }}
                                onDrop={(event) => {
                                  // A section drag is in flight; the item handlers must not claim it.
                                  if (draggingSectionRef.current) return;
                                  if (!isEditMode) return;
                                  event.preventDefault();
                                  event.stopPropagation();
                                  const sourceId = getDraggedId(event);
                                  if (!sourceId || sourceId === cell.entry.id)
                                    return;

                                  const rect =
                                    event.currentTarget.getBoundingClientRect();
                                  const position =
                                    event.clientX < rect.left + rect.width / 2
                                      ? "before"
                                      : "after";

                                  reorderItems(
                                    sourceId,
                                    cell.entry.id,
                                    position,
                                  );
                                  resetDragState();
                                }}
                              >
                                <SmartGridTileBoundary
                                  title={def!.title}
                                  tone={effectiveTone}
                                  onError={onTileError}
                                  render={def!.render}
                                />


                                {isEditMode && neighborCell && neighbor && (
                                  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- ARIA 1.2 resizable separator: this div is the drag/keyboard resize target itself (WCAG 2.1.1); a button element here would conflict (interactive element with a non-interactive role)
                                  <div
                                    onMouseDown={(event) => {
                                      beginResize(
                                        event,
                                        rowDomKey,
                                        cell.entry.id,
                                        neighborCell.entry.id,
                                        renderCell.span,
                                        neighbor.span,
                                      );
                                    }}
                                    onKeyDown={resizeKeyHandler(
                                      cell.entry.id,
                                      neighborCell.entry.id,
                                    )}
                                    role="separator"
                                    aria-orientation="vertical"
                                    aria-valuenow={renderCell.span}
                                    aria-valuemin={1}
                                    aria-valuemax={maxColumns}
                                    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a resizable separator is the keyboard focus target (WCAG 2.1.1)
                                    tabIndex={0}
                                    className="group absolute left-full top-2 bottom-2 z-10 w-4 cursor-col-resize bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
                                    aria-label={`Resize ${cell.entry.item.title} — left and right arrows move one column`}
                                  >
                                    <span
                                      className={`absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-150 group-hover:opacity-80 group-focus-visible:opacity-80 ${editTheme.solid} ${resizeState?.leftId === cell.entry.id ? "opacity-90" : ""}`}
                                    />
                                  </div>
                                )}
                              </article>
                            );
                          })}
                        </div>

                        {isEditMode && maxColumns > 1 && (
                          <div className="z-20 flex w-7 shrink-0 items-center justify-center">
                            <IconButton
                              icon="Add"
                              variant={ROW_ICON_VARIANT}
                              size="xs"
                              color={editThemeColor}
                              onClick={() => {
                                setRowAddTarget({ sectionId, rowId: row.id });
                                setIsPaletteOpen(true);
                              }}
                              aria-label={`Add item to ${section.title} row`}
                              title="Add item to row"
                            />
                          </div>
                        )}

                        {isRowPreviewActive && (
                          <div
                            className={`absolute inset-0 z-10 rounded-lg ${editTheme.border} ${editTheme.tint} pointer-events-none`}
                          />
                        )}
                      </div>
                    </div>
                    {isEditMode && (
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- ARIA 1.2 resizable separator: this div is the drag/keyboard resize target itself (WCAG 2.1.1)
                      <div
                        onMouseDown={(event) => {
                          beginRowResize(event, row.id, sectionId, row.height ?? 120, row.heightSpan ?? 0);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "ArrowUp") {
                            event.preventDefault();
                            nudgeRowHeight(sectionId, row.id, -1);
                          } else if (event.key === "ArrowDown") {
                            event.preventDefault();
                            nudgeRowHeight(sectionId, row.id, 1);
                          }
                        }}
                        role="separator"
                        aria-orientation="horizontal"
                        aria-valuenow={row.heightSpan ?? (row.height ? heightToSpan(row.height) : 0)}
                        aria-valuemin={1}
                        aria-valuemax={MAX_ROW_SPANS}
                        aria-label="Resize row height — up and down arrows move one row"
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a resizable separator is the keyboard focus target (WCAG 2.1.1)
                        tabIndex={0}
                        className={`flex flex-col items-center rounded-full group bottom-0 h-1 cursor-ns-resize opacity-0 hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ${editTheme.solid} transition-opacity ${rowResizeState?.rowId === row.id ? "opacity-100" : "group-hover:opacity-50"}`}
                        style={{ top: "auto", bottom: 0, width: "95%" }}
                        title="Drag to resize row height, or focus and use the up and down arrows"
                      />
                    )}
                  </div>
                );
              })}

              {isEditMode && addableItems.length > 0 && (
                <div
                  className={`rounded-md border border-dashed px-3 py-2 text-center text-xs transition ${sectionBottomDropTarget === sectionId ? `${editTheme.border} ${editTheme.tint} ${surfaceText.heading}` : `${tonePalette.border} ${surfaceText.muted}`}`}
                  onDragOver={(event) => {
                    // A section drag is in flight; the item handlers must not claim it.
                    if (draggingSectionRef.current) return;
                    if (!draggingId) return;
                    event.preventDefault();
                    if (sectionBottomDropTarget !== sectionId)
                      setSectionBottomDropTarget(sectionId);
                  }}
                  onDragLeave={(event) => {
                    // A section drag is in flight; the item handlers must not claim it.
                    if (draggingSectionRef.current) return;
                    const nextTarget = event.relatedTarget as Node | null;
                    if (nextTarget && event.currentTarget.contains(nextTarget))
                      return;
                    if (sectionBottomDropTarget === sectionId)
                      setSectionBottomDropTarget(null);
                  }}
                  onDrop={(event) => {
                    // A section drag is in flight; the item handlers must not claim it.
                    if (draggingSectionRef.current) return;
                    event.preventDefault();
                    const sourceId = getDraggedId(event);
                    if (!sourceId) return;
                    moveItemToNewRow(sourceId, sectionId);
                    resetDragState();
                  }}
                >
                  <Button
                    type="button"
                    variant={editorButtonVariant}
                    color={effectiveTone}
                    size="xs"
                    leadingIcon="Add"
                    onClick={() => {
                      setRowAddTarget({ sectionId, rowId: "" });
                      setIsPaletteOpen(true);
                    }}
                  >
                    Add New Item
                  </Button>
                  <p className="mt-1">Or drop here to add item to new row</p>
                </div>
              )}
            </div>
          </section>
        );
      })}

      {isEditMode && (
        <div
          className={`rounded-xl border border-dashed p-4 text-center text-sm transition ${newSectionDropTarget ? `${editTheme.border} ${editTheme.tint} ${surfaceText.heading}` : `${tonePalette.border} ${surfaceText.muted}`}`}
          onDragOver={(event) => {
            // A section drag is in flight; the item handlers must not claim it.
            if (draggingSectionRef.current) return;
            if (!draggingId) return;
            event.preventDefault();
            if (!newSectionDropTarget) setNewSectionDropTarget(true);
          }}
          onDragLeave={(event) => {
            // A section drag is in flight; the item handlers must not claim it.
            if (draggingSectionRef.current) return;
            const nextTarget = event.relatedTarget as Node | null;
            if (nextTarget && event.currentTarget.contains(nextTarget)) return;
            if (newSectionDropTarget) setNewSectionDropTarget(false);
          }}
          onDrop={(event) => {
            // A section drag is in flight; the item handlers must not claim it.
            if (draggingSectionRef.current) return;
            event.preventDefault();
            const sourceId = getDraggedId(event);
            if (!sourceId) return;
            const sectionId = createSection();
            moveItemToNewRow(sourceId, sectionId);
            resetDragState();
          }}
        >
          <Button
            type="button"
            variant={editorButtonVariant}
            color={effectiveTone}
            size="sm"
            leadingIcon="Add"
            onClick={() => {
              const sectionId = createSection();
              const rowId = createRow(sectionId);
              setRowAddTarget({ sectionId, rowId });
              setIsPaletteOpen(true);
            }}
          >
            Add item to create new section
          </Button>
          <p className="mt-2 text-xs">
            Or drop a card here to create a section and place it there
          </p>
        </div>
      )}
    </div>
  );
};
