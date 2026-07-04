<script lang="ts">
import type { VNodeChild } from "vue";
import type { ThemeColor } from "../theme/Theme";

export interface SmartGridItemDefinition {
  id: string;
  title: string;
  description?: string;
  screenshot?: string;
  defaultSpan?: number;
  defaultRowHeightSpan?: number;
  active: boolean;
  single: boolean;
  render: () => VNodeChild;
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

interface SmartGridLayoutProps {
  items: SmartGridItemDefinition[];
  defaultLayout: SmartGridSectionDefinition[];
  persistedLayout?: SmartGridLayoutState | null;
  maxColumns?: number;
  editThemeColor?: ThemeColor;
  isEditMode?: boolean;
}

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

interface SmartGridCellEntry {
  id: string;
  item: SmartGridItemDefinition;
  state: SmartGridItem;
  order: number;
  sectionId: string;
  rowId: string;
  isSpacer?: boolean;
}

interface SmartGridCell {
  kind: "item";
  id: string;
  entry: SmartGridCellEntry;
  span: number;
}

interface SmartGridRenderCell {
  kind: "item" | "ghost";
  id: string;
  span: number;
  cell?: SmartGridCell;
  neighbor?: SmartGridRenderCell;
  neighborCell?: SmartGridCell;
  def?: SmartGridItemDefinition;
}

interface SmartGridRowView {
  row: SmartGridRow;
  rowIndex: number;
  rowDomKey: string;
  isManagedRow: boolean;
  rowContentSpan: number;
  isRowPreviewActive: boolean;
  cells: SmartGridCell[];
  renderCells: SmartGridRenderCell[];
  rowHeight: number | undefined;
  rowBorderClass: string;
}

const GRID_GAP_PX = 16;
const ROW_SPAN_SIZE = 100;
const MAX_ROW_SPANS = 12;
const SPACER_PREFIX = "spacer:";

const EDIT_THEME_COLORS: Record<
  string,
  { border: string; tint: string; solid: string; rgb: string }
> = {
  blue: {
    border: "border-blue-300 dark:border-blue-700",
    tint: "bg-blue-500/10",
    solid: "bg-blue-500 dark:bg-blue-400",
    rgb: "59,130,246",
  },
  sky: {
    border: "border-sky-300 dark:border-sky-700",
    tint: "bg-sky-500/10",
    solid: "bg-sky-500 dark:bg-sky-400",
    rgb: "14,165,233",
  },
  emerald: {
    border: "border-emerald-300 dark:border-emerald-700",
    tint: "bg-emerald-500/10",
    solid: "bg-emerald-500 dark:bg-emerald-400",
    rgb: "16,185,129",
  },
  lime: {
    border: "border-lime-300 dark:border-lime-700",
    tint: "bg-lime-500/10",
    solid: "bg-lime-500 dark:bg-lime-400",
    rgb: "132,204,22",
  },
  amber: {
    border: "border-amber-300 dark:border-amber-700",
    tint: "bg-amber-500/10",
    solid: "bg-amber-500 dark:bg-amber-400",
    rgb: "245,158,11",
  },
  orange: {
    border: "border-orange-300 dark:border-orange-700",
    tint: "bg-orange-500/10",
    solid: "bg-orange-500 dark:bg-orange-400",
    rgb: "249,115,22",
  },
  rose: {
    border: "border-rose-300 dark:border-rose-700",
    tint: "bg-rose-500/10",
    solid: "bg-rose-500 dark:bg-rose-400",
    rgb: "244,63,94",
  },
  violet: {
    border: "border-violet-300 dark:border-violet-700",
    tint: "bg-violet-500/10",
    solid: "bg-violet-500 dark:bg-violet-400",
    rgb: "139,92,246",
  },
  fuchsia: {
    border: "border-fuchsia-300 dark:border-fuchsia-700",
    tint: "bg-fuchsia-500/10",
    solid: "bg-fuchsia-500 dark:bg-fuchsia-400",
    rgb: "217,70,239",
  },
  neutral: {
    border: "border-neutral-300 dark:border-neutral-700",
    tint: "bg-neutral-500/10",
    solid: "bg-neutral-500 dark:bg-neutral-400",
    rgb: "115,115,115",
  },
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

function serializeLayout(layout: SmartGridLayoutState): string {
  return JSON.stringify(layout.sections.map((s) => ({
    id: s.id,
    title: s.title,
    rows: s.rows.map((r) => ({
      id: r.id,
      itemCount: r.items.length,
      spans: r.items.map((i) => ({ id: i.id, defId: i.definitionId, span: i.span, rowId: i.rowId })),
    })),
  })));
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
      console.log('[SmartGrid.normalizeColumnSpans] Row', row.id, ':', currentSpans, '->', newSpans);
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

        if (!itemDef) {
          console.warn(
            `[SmartGridLayout] Item "${itemId}" not found in available items`,
          );
          return;
        }

        if (!itemDef.active) {
          console.warn(
            `[SmartGridLayout] Item "${itemId}" is inactive and will be skipped`,
          );
          return;
        }

        // Handle single=true items - replace existing instance
        if (itemDef.single && placedSingleItems.has(itemId)) {
          const existing = placedSingleItems.get(itemId)!;
          removeLayoutItem(layout, existing.id);
        }

        console.log('[SmartGrid] Seeding item:', itemId, 'with defaultSpan:', itemDef.defaultSpan, '(single:', itemDef.single, ')');
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
    console.log('[SmartGrid] === PERSISTED LAYOUT PATH ===');
    console.log('[SmartGrid] Persisted sections:', serializeLayout(persistedLayout));

    // Use persisted layout directly - don't merge with default
    const wrappedLayout = ensureAutoRowWrapping(
      persistedLayout,
      items,
      maxColumns,
    );

    console.log('[SmartGrid] After wrapping:', serializeLayout(wrappedLayout));

    // Remove empty sections/rows
    const prunedLayout = pruneEmptySectionsAndRows(wrappedLayout);

    // Update orders
    updateSectionRowOrders(prunedLayout);

    // Normalize row spans from persisted layouts
    const normalizedSpansLayout = normalizeLayoutRowSpans(prunedLayout);

    // Normalize column spans so items fill the row evenly (prevents drift)
    const normalizedColLayout = normalizeColumnSpans(normalizedSpansLayout, maxColumns);

    console.log('[SmartGrid] Final normalized:', serializeLayout(normalizedColLayout));

    return normalizedColLayout;
  }

  // Ensure auto-row-wrapping
  console.log('[SmartGrid] === DEFAULT LAYOUT PATH ===');
  console.log('[SmartGrid] Default layout items per row:', JSON.stringify(defaultLayout.flatMap(s => s.rows.map(r => ({ section: s.title, row: r.id, itemIds: r.itemIds })))));
  console.log('[SmartGrid] Item defs:', JSON.stringify(items.map(i => ({ id: i.id, defaultSpan: i.defaultSpan, single: i.single, active: i.active }))));

  const wrappedLayout = ensureAutoRowWrapping(
    layout,
    items,
    maxColumns,
  );

  console.log('[SmartGrid] After wrapping (default):', serializeLayout(wrappedLayout));

  // Remove empty sections/rows
  const prunedLayout = pruneEmptySectionsAndRows(wrappedLayout);

  // Update orders
  updateSectionRowOrders(prunedLayout);

  // Normalize row spans from persisted layouts
  const normalizedSpansLayout = normalizeLayoutRowSpans(prunedLayout);

  // Normalize column spans so items fill the row evenly (prevents drift)
  const normalizedColLayout = normalizeColumnSpans(normalizedSpansLayout, maxColumns);

  console.log('[SmartGrid] Final normalized (default):', serializeLayout(normalizedColLayout));

  return normalizedColLayout;
}

function updateSectionRowOrders(layout: SmartGridLayoutState): void {
  layout.sections.forEach((section, sectionIdx) => {
    section.order = sectionIdx;
    section.rows.forEach((row, rowIdx) => {
      row.order = rowIdx;
      row.items.forEach((item, itemIdx) => {
        item.order = itemIdx;
      });
    });
  });
}

function ensureAutoRowWrapping(
  layout: SmartGridLayoutState,
  items: SmartGridItemDefinition[],
  maxColumns: number,
): SmartGridLayoutState {
  const itemsMap = new Map(items.map((i) => [i.id, i]));

  console.log('[SmartGrid.ensureAutoRowWrapping] Input sections:', serializeLayout(layout));

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
    console.log('[SmartGrid.ensureAutoRowWrapping] SKIP: all rows fit, returning unchanged');
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

  console.log('[SmartGrid.ensureAutoRowWrapping] Output:', serializeLayout(result));

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
</script>

<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import { useClassAttrs } from "../utils/attrsUtils";
import Button from "./Button.vue";
import CustomIcon from "./CustomIcon.vue";
import IconButton from "./IconButton.vue";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "SmartGridLayout", inheritAttrs: false });

const props = withDefaults(defineProps<SmartGridLayoutProps>(), {
  maxColumns: 12,
  editThemeColor: "blue",
});

const emit = defineEmits<{
  (e: "layoutChange", layout: SmartGridLayoutState): void;
  (e: "editModeChange", isEditMode: boolean): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();

const isAddModalOpen = ref(false);

const draggingId = ref<string | null>(null);
const dragOver = ref<DragOverState | null>(null);
const emptyRowDropTarget = ref<string | null>(null);
const sectionBottomDropTarget = ref<string | null>(null);
const newSectionDropTarget = ref(false);
const rowAddTarget = ref<RowAddTargetState | null>(null);
const rowPreview = ref<RowPreviewState | null>(null);

const resizeState = ref<ResizeState | null>(null);
const rowResizeState = ref<RowResizeState | null>(null);
const editingSectionId = ref<string | null>(null);
const sectionDraftTitle = ref("");
const isEditMode = computed(() => Boolean(props.isEditMode));

// Compute normalized layout only when defaultLayout or persistedLayout changes (not on every items change)
function computeNormalizedLayout(): SmartGridLayoutState {
  console.log('[SmartGrid.Component] useMemo called, persistedLayout:', props.persistedLayout ? props.persistedLayout.sections.length + ' sections' : 'null');
  // Create a copy of items to avoid mutating props
  const itemsCopy = props.items.map((item) => ({ ...item }));
  return normalizeLayout(
    itemsCopy,
    props.defaultLayout,
    props.persistedLayout,
    props.maxColumns,
  );
}

const normalizedLayout = shallowRef<SmartGridLayoutState>(
  computeNormalizedLayout(),
);
watch(
  [
    () => props.defaultLayout,
    () => props.persistedLayout,
    () => props.maxColumns,
  ],
  () => {
    normalizedLayout.value = computeNormalizedLayout();
  },
);

console.log('[SmartGrid.Component] useState init with normalizedLayout');
const layout = shallowRef<SmartGridLayoutState>(normalizedLayout.value);
let hasInitializedLayout = false;
let layoutLoadCounter = 0;

const rowRefs: Record<string, HTMLDivElement | null> = {};
let resizeChangedRef = false;

// Only update layout when persistedLayout or defaultLayout changes (not on every render)
// AND only on first load - don't recalculate after initialization
watch(
  [normalizedLayout, isEditMode, () => props.persistedLayout],
  () => {
    console.log('[SmartGrid.Component] layout update effect, hasInitialized:', hasInitializedLayout, 'counter:', layoutLoadCounter, 'persistedLayout:', !!props.persistedLayout, 'editMode:', isEditMode.value);

    // Reset initialization flag when persistedLayout changes (user saved new layout)
    if (props.persistedLayout && layoutLoadCounter > 0) {
      console.log('[SmartGrid.Component] Resetting init flag (persistedLayout changed)');
      hasInitializedLayout = false;
      layoutLoadCounter = 0;
    }

    if (hasInitializedLayout) return;

    // Compare the actual layout structure
    if (!layout.value || !normalizedLayout.value) return;

    const prevSections = layout.value.sections;
    const nextSections = normalizedLayout.value.sections;

    const sectionsEqual =
      prevSections.length === nextSections.length &&
      prevSections.every((s, i) => {
        const next = nextSections[i];
        return (
          s.id === next.id &&
          s.rows.length === next.rows.length &&
          s.rows.every((r, j) => {
            const nextRow = next.rows[j];
            return (
              r.id === nextRow.id && r.items.length === nextRow.items.length
            );
          })
        );
      });

    console.log('[SmartGrid.Component] sectionsEqual:', sectionsEqual, 'prevSections:', prevSections.length, 'nextSections:', nextSections.length, 'prevRows:', prevSections.flatMap(s => s.rows.map(r => r.id)).join(','), 'nextRows:', nextSections.flatMap(s => s.rows.map(r => r.id)).join(','));

    // Only update layout if sections are different AND we're not in the middle of drag operations
    if (!sectionsEqual && !isEditMode.value) {
      console.log('[SmartGrid.Component] Updating layout (sections differ)');
      layout.value = normalizedLayout.value;
    }

    hasInitializedLayout = true;
    layoutLoadCounter += 1;
  },
  { immediate: true },
);

// Create items map once, only when items array reference changes
const byId = computed(
  () => new Map(props.items.map((item) => [item.id, item])),
);

// Compute deployed single item IDs from layout
const deployedSingleItemIds = computed(() => {
  const deployedIds = new Set<string>();
  layout.value.sections.forEach((section) => {
    section.rows.forEach((row) => {
      row.items.forEach((item) => {
        const def = props.items.find((i) => i.id === item.definitionId);
        if (def?.single) {
          deployedIds.add(item.definitionId);
        }
      });
    });
  });
  return deployedIds;
});

// Items available to add: all active items minus deployed single items
const addableItems = computed(() => {
  return props.items.filter((item) => {
    // Skip items already in layout if single
    if (item.single && deployedSingleItemIds.value.has(item.id)) {
      return false;
    }
    // Skip inactive items
    if (!item.active) {
      return false;
    }
    return true;
  });
});

const orderedSectionIds = computed(() => {
  return sortByOrder(
    layout.value.sections.map((section) => ({
      id: section.id,
      order: section.order,
    })),
  ).map((entry) => entry.id);
});

const orderedSections = computed(() =>
  orderedSectionIds.value
    .map((sectionId) =>
      layout.value.sections.find((s) => s.id === sectionId),
    )
    .filter((section): section is SmartGridSection => Boolean(section)),
);

function updateLayout(
  updater: (prev: SmartGridLayoutState) => SmartGridLayoutState,
): void {
  const prev = layout.value;
  const next = updater(prev);
  if (next !== prev) {
    emit("layoutChange", next);
  }
  layout.value = next;
}

// When leaving edit mode (save), prune empty managed rows from section rowOrder.
watch(isEditMode, (editing, wasEditing) => {
  if (!wasEditing || editing) return; // only fires on true → false transition

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
});

function removeItem(itemId: string): void {
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
          const newSpans = distributeSpans(remainingIds, props.maxColumns);

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
}

function addSpacerToRow(
  sectionId: string,
  rowId: string,
  span: number = 1,
): void {
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

    const newSection = { ...section };
    const newRow = { ...row };
    newRow.items = newItems;
    newSection.rows[rowIndex] = newRow;

    const newSections = [...prev.sections];
    newSections[sectionIndex] = newSection;

    return { ...prev, sections: newSections };
  });
}

function addItemToRow(
  itemId: string,
  sectionId: string,
  rowId: string,
): void {
  console.log("[ADD ITEM] Called with:", { itemId, sectionId, rowId });

  if (isSpacerId(itemId)) {
    console.log("[ADD ITEM] Adding spacer");
    addSpacerToRow(sectionId, rowId);
    return;
  }

  updateLayout((prev) => {
    const itemDef = props.items.find((i) => i.id === itemId);
    if (!itemDef) {
      console.log("[ADD ITEM] Item definition not found");
      return prev;
    }

    console.log("[ADD ITEM] Item definition found:", itemDef);

    // Check if item already exists in the target row BEFORE making changes
    const targetSection = prev.sections.find((s) => s.id === sectionId);
    if (targetSection) {
      const targetRow = targetSection.rows.find((r) => r.id === rowId);
      if (targetRow) {
        const alreadyExists = targetRow.items.some(
          (item) => item.definitionId === itemId,
        );
        if (alreadyExists) {
          console.log(
            "[ADD ITEM] Item already exists in target row, ABORTING",
          );
          return prev;
        }
      }
    }

    let workingSections = prev.sections;

    // Handle single=true items - replace existing instance
    if (itemDef.single) {
      // Find and remove existing instance
      const existingItem = findLayoutItem(prev, itemId);
      console.log("[ADD ITEM] Existing single item:", existingItem);
      if (existingItem) {
        console.log(
          "[ADD ITEM] Removing existing item with slug:",
          existingItem.id,
        );
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
      console.log("[ADD ITEM] Section not found");
      return prev;
    }

    let section = workingSections[sectionIndex];
    let rowIndex = section.rows.findIndex((r) => r.id === rowId);
    const isEmptyRow = rowIndex !== -1 && section.rows[rowIndex].items.length === 0;

    if (rowIndex === -1) {
      console.log("[ADD ITEM] Row not found, creating it now");
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
        const newSections = [...workingSections];
        const newSection = { ...section };
        const newRow = { ...existingRow, heightSpan: newItemHeightSpan };
        newSection.rows[rowIndex] = newRow;
        newSections[sectionIndex] = newSection;
        workingSections = newSections;
        section = workingSections[sectionIndex];
      }
    }

    const row = section.rows[rowIndex];

    console.log(
      "[ADD ITEM] Before adding, row has",
      row.items.length,
      "items",
    );

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

    console.log("[ADD ITEM] Creating new item with slug:", newSlug);

    const newSection = { ...section };
    const newRow = { ...row };
    newRow.items.push(newItem);
    newSection.rows[rowIndex] = newRow;

    const newSections = [...workingSections];
    newSections[sectionIndex] = newSection;

    console.log(
      "[ADD ITEM] After adding, row has",
      newRow.items.length,
      "items",
    );

    return { ...prev, sections: newSections };
  });
}

function ensureSection(sectionId: string, title?: string): void {
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
}

function renameSection(sectionId: string, title: string): void {
  updateLayout((prev) => {
    const sectionIndex = prev.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) return prev;
    const newSections = [...prev.sections];
    newSections[sectionIndex] = { ...newSections[sectionIndex], title };
    return { ...prev, sections: newSections };
  });
}

function createRow(sectionId: string): string {
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
}

function removeRowItems(
  sectionId: string,
  rowId: string,
  itemIds: string[],
  isManagedRow: boolean,
): void {
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
        const newSpans = distributeSpans(remainingIds, props.maxColumns);

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
}

function createSection(): string {
  const sectionId = makeId("section");
  ensureSection(sectionId, "New Section");
  return sectionId;
}

function removeSection(sectionId: string): void {
  updateLayout((prev) => {
    const sectionIndex = prev.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) return prev;

    const newSections = [...prev.sections];
    newSections.splice(sectionIndex, 1);

    // Reorder remaining sections
    newSections.forEach((section, idx) => {
      section.order = idx;
    });

    return { ...prev, sections: newSections };
  });
}

function setItemPlacement(
  itemId: string,
  sectionId: string,
  rowId?: string,
): void {
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
}

function reorderItems(
  sourceId: string,
  targetId: string,
  position: "before" | "after",
): void {
  if (sourceId === targetId) return;
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
            const newSpans = distributeSpans(remainingIds, props.maxColumns);

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

          const itemDef = props.items.find(i => i.id === sourceItem.definitionId);
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
}

function moveItemToSectionEnd(itemId: string, sectionId: string): void {
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

    const itemDef = props.items.find(i => i.id === sourceItem.definitionId);
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
}

// Atomically remove an item from its current row and place it in a newly-appended
// row at the end of the target section. Used by the "drop here to add item to new
// row" / "drop to create a new section" drop zones, where the user's intent is for
// the dragged item to appear inside the freshly-created row — not to fall back into
// an existing non-empty row the way moveItemToSectionEnd would.
function moveItemToNewRow(itemId: string, sectionId: string): void {
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
      const newSpans = distributeSpans(remainingIds, props.maxColumns);

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
      definitionId: sourceItem.definitionId,
      id: createSlug(),
      sectionId,
      rowId: newRowId,
      order: 0,
      span: props.maxColumns, // New row item takes full width
    };

    const itemDef = props.items.find(i => i.id === sourceItem.definitionId);
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
}

function beginResize(
  event: MouseEvent,
  rowDomKey: string,
  leftId: string,
  rightId: string,
  leftSpan: number,
  rightSpan: number,
): void {
  if (!isEditMode.value) return;
  event.preventDefault();
  event.stopPropagation();

  const rowEl = rowRefs[rowDomKey];
  if (!rowEl) return;

  const rect = rowEl.getBoundingClientRect();
  const colWidth =
    (rect.width - (props.maxColumns - 1) * GRID_GAP_PX) / props.maxColumns;
  if (!Number.isFinite(colWidth) || colWidth <= 0) return;

  resizeChangedRef = false;
  resizeState.value = {
    leftId,
    rightId,
    startX: event.clientX,
    startLeftSpan: leftSpan,
    pairTotal: leftSpan + rightSpan,
    colWidth,
  };
}

function beginRowResize(
  event: MouseEvent,
  rowId: string,
  sectionId: string,
  startHeight: number,
  startHeightSpan: number,
): void {
  if (!isEditMode.value) return;
  event.preventDefault();
  event.stopPropagation();

  resizeChangedRef = false;
  rowResizeState.value = {
    rowId,
    sectionId,
    startY: event.clientY,
    startHeight,
    startHeightSpan,
  };
}

watch(resizeState, (state, _prevState, onCleanup) => {
  if (!state) return;

  const onMouseMove = (event: MouseEvent) => {
    const deltaColumns = Math.round(
      (event.clientX - state.startX) / state.colWidth,
    );
    const nextLeft = Math.max(
      1,
      Math.min(
        state.pairTotal - 1,
        state.startLeftSpan + deltaColumns,
      ),
    );
    const nextRight = state.pairTotal - nextLeft;

    const prev = layout.value;
    let leftItem: SmartGridItem | undefined;
    let rightItem: SmartGridItem | undefined;

    prev.sections.forEach((section) => {
      section.rows.forEach((row) => {
        if (!leftItem) {
          leftItem = row.items.find((i) => i.id === state.leftId);
        }
        if (!rightItem) {
          rightItem = row.items.find((i) => i.id === state.rightId);
        }
      });
    });

    if (!leftItem || !rightItem) return;

    let shouldUpdate = false;

    if (state.leftId === state.rightId) {
      if (leftItem.span === nextLeft) return;
      shouldUpdate = true;
    } else {
      if (leftItem.span === nextLeft && rightItem.span === nextRight)
        return;
      shouldUpdate = true;
    }

    resizeChangedRef = true;

    if (shouldUpdate) {
      const newSections = prev.sections.map((section) => ({
        ...section,
        rows: section.rows.map((row) => ({
          ...row,
          items: row.items.map((item) => {
            if (item.id === state.leftId) {
              return { ...item, span: nextLeft };
            }
            if (
              state.leftId !== state.rightId &&
              item.id === state.rightId
            ) {
              return { ...item, span: nextRight };
            }
            return item;
          }),
        })),
      }));

      layout.value = { ...prev, sections: newSections };
    }
  };

  const onMouseUp = () => {
    resizeState.value = null;
    if (resizeChangedRef) {
      emit("layoutChange", layout.value);
    }
    resizeChangedRef = false;
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  onCleanup(() => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  });
});

watch(rowResizeState, (state, _prevState, onCleanup) => {
  if (!state) return;

  const onMouseMove = (event: MouseEvent) => {
    const deltaHeight = event.clientY - state.startY;
    const newHeight = state.startHeight + deltaHeight;

    let newSpan = Math.round(newHeight / ROW_SPAN_SIZE);

    if (state.startHeightSpan > 0) {
      newSpan = Math.max(1, Math.min(MAX_ROW_SPANS, newSpan));
    }

    const newHeightPx = newSpan * ROW_SPAN_SIZE;

    const prev = layout.value;
    const targetSection = prev.sections.find(
      (s) => s.id === state.sectionId,
    );
    if (!targetSection) return;

    const targetRow = targetSection.rows.find(
      (r) => r.id === state.rowId,
    );
    if (!targetRow || (targetRow.height === newHeightPx && targetRow.heightSpan === newSpan)) return;

    resizeChangedRef = true;

    const newSections = prev.sections.map((section) => {
      if (section.id !== state.sectionId) return section;
      return {
        ...section,
        rows: section.rows.map((row) => {
          if (row.id !== state.rowId) return row;
          return { ...row, height: newHeightPx, heightSpan: newSpan };
        }),
      };
    });

    layout.value = { ...prev, sections: newSections };
  };

  const onMouseUp = () => {
    rowResizeState.value = null;
    if (resizeChangedRef) {
      emit("layoutChange", layout.value);
    }
    resizeChangedRef = false;
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  onCleanup(() => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  });
});

const editTheme = computed(
  () => EDIT_THEME_COLORS[props.editThemeColor] ?? EDIT_THEME_COLORS.blue,
);

function resetDragState(): void {
  draggingId.value = null;
  dragOver.value = null;
  emptyRowDropTarget.value = null;
  sectionBottomDropTarget.value = null;
  newSectionDropTarget.value = false;
  rowPreview.value = null;
}

watch(
  isEditMode,
  (editing) => {
    if (!editing) {
      resetDragState();
      editingSectionId.value = null;
      sectionDraftTitle.value = "";
      rowAddTarget.value = null;
      isAddModalOpen.value = false;
    }
  },
  { immediate: true },
);

function getDraggedId(event: DragEvent): string | null {
  return (
    draggingId.value ?? (event.dataTransfer?.getData("text/plain") || null)
  );
}

const rootClass = computed(() => `relative ${classAttr.value ?? ""}`);

const spacerEntryVisible = computed(() => {
  const target = rowAddTarget.value;
  if (!target) return false;
  const section = layout.value.sections.find(
    (s) => s.id === target.sectionId,
  );
  const targetRow = section?.rows.find((r) => r.id === target.rowId);
  return Boolean(targetRow && targetRow.items.length > 0);
});

function closeAddModal(): void {
  rowAddTarget.value = null;
  isAddModalOpen.value = false;
}

function onAddModalSpacer(): void {
  if (!rowAddTarget.value) return;
  addSpacerToRow(rowAddTarget.value.sectionId, rowAddTarget.value.rowId);
  rowAddTarget.value = null;
  isAddModalOpen.value = false;
}

function onAddModalItem(item: SmartGridItemDefinition): void {
  if (!rowAddTarget.value) return;
  if (isSpacerId(item.id)) {
    addSpacerToRow(rowAddTarget.value.sectionId, rowAddTarget.value.rowId);
  } else {
    addItemToRow(
      item.id,
      rowAddTarget.value.sectionId,
      rowAddTarget.value.rowId,
    );
  }
  rowAddTarget.value = null;
  isAddModalOpen.value = false;
}

function commitSectionTitle(sectionId: string): void {
  renameSection(
    sectionId,
    sectionDraftTitle.value.trim() || "Untitled Section",
  );
  editingSectionId.value = null;
}

function onSectionTitleKeydown(event: KeyboardEvent, sectionId: string): void {
  if (event.key === "Enter") {
    renameSection(
      sectionId,
      sectionDraftTitle.value.trim() || "Untitled Section",
    );
    editingSectionId.value = null;
  }
  if (event.key === "Escape") {
    editingSectionId.value = null;
  }
}

function focusInput(el: unknown): void {
  const input = el as HTMLInputElement | null;
  if (input && typeof input.focus === "function" && document.activeElement !== input) {
    input.focus();
  }
}

function setRowRef(key: string, el: unknown): void {
  rowRefs[key] = el as HTMLDivElement | null;
}

function onSectionAddItem(sectionId: string): void {
  const newRowId = makeId(`row:${sectionId}`);
  rowAddTarget.value = { sectionId, rowId: newRowId };
  isAddModalOpen.value = true;
}

function beginRenameSection(section: SmartGridSection): void {
  editingSectionId.value = section.id;
  sectionDraftTitle.value = section.title;
}

function onRowAddItem(sectionId: string, rowId: string): void {
  rowAddTarget.value = { sectionId, rowId };
  isAddModalOpen.value = true;
}

function onSectionBottomAddItem(sectionId: string): void {
  rowAddTarget.value = { sectionId, rowId: "" };
  isAddModalOpen.value = true;
}

function onCreateSectionClick(): void {
  const sectionId = createSection();
  const rowId = createRow(sectionId);
  rowAddTarget.value = { sectionId, rowId };
  isAddModalOpen.value = true;
}

function getRowViews(section: SmartGridSection): SmartGridRowView[] {
  const sectionId = section.id;
  const rows = section.rows;

  return rows.map((row, rowIndex) => {
    const rowDomKey = `${sectionId}-${row.id}-${rowIndex}`;
    const isManagedRow = section.rows.some(
      (r: SmartGridRow) => r.id === row.id,
    );
    const rowContentSpan = props.maxColumns;
    const dragging = draggingId.value;
    const preview = rowPreview.value;
    const isRowPreviewActive = Boolean(
      isEditMode.value &&
        dragging &&
        preview &&
        preview.sectionId === sectionId &&
        preview.rowId === row.id,
    );

    // Compute cells from row.items
    const cells: SmartGridCell[] = row.items
      .map((item): SmartGridCell | null => {
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

        const itemDef = byId.value.get(item.definitionId);
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
      .filter((cell): cell is NonNullable<typeof cell> => cell !== null);

    const isResizePreviewActive = false as boolean; // Resize preview not implemented for v3 yet
    const activeResizeState = resizeState.value;

    const renderCells: SmartGridRenderCell[] = (() => {
      if (!isRowPreviewActive && !isResizePreviewActive) {
        return cells.map((cell) => ({
          kind: cell.kind,
          id: cell.id,
          span: cell.span,
          cell,
        }));
      }

      if (isRowPreviewActive && dragging && preview) {
        const draggedItem = row.items.find((i) => i.id === dragging);
        const draggedSpan = clampSpan(
          draggedItem?.span ?? 3,
          rowContentSpan,
        );

        const withoutDragged = cells.filter((cell) => cell.id !== dragging);
        const insertIndex = Math.max(
          0,
          Math.min(preview.insertIndex, withoutDragged.length),
        );

        const withGhost: Array<{
          kind: "item" | "ghost";
          id: string;
          desiredSpan: number;
          cell?: SmartGridCell;
        }> = [
          ...withoutDragged.slice(0, insertIndex).map((cell) => ({
            kind: cell.kind,
            id: cell.id,
            desiredSpan: clampSpan(cell.entry.state.span, rowContentSpan),
            cell,
          })),
          {
            kind: "ghost" as const,
            id: "__ghost__",
            desiredSpan: draggedSpan,
          },
          ...withoutDragged.slice(insertIndex).map((cell) => ({
            kind: cell.kind,
            id: cell.id,
            desiredSpan: clampSpan(cell.entry.state.span, rowContentSpan),
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

      if (isResizePreviewActive && activeResizeState && cells.length > 0) {
        const itemId = activeResizeState.leftId;
        const currentSpan = activeResizeState.startLeftSpan;
        const resizedSpan = Math.max(
          1,
          Math.min(
            activeResizeState.pairTotal - 1,
            currentSpan +
              Math.round(
                (0 - activeResizeState.startX) / activeResizeState.colWidth,
              ),
          ),
        );

        const cell = cells[0];
        const emptySpaceSpan = props.maxColumns - resizedSpan;

        const withGhost: Array<{
          kind: "item" | "ghost";
          id: string;
          desiredSpan: number;
          cell?: SmartGridCell;
        }> = [
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

    const enrichedRenderCells: SmartGridRenderCell[] = renderCells.map(
      (renderCell, cellIndex) => {
        if (renderCell.kind === "ghost") return renderCell;

        const nextItemIndex = renderCells
          .slice(cellIndex + 1)
          .findIndex((c) => c.kind === "item");
        const neighbor =
          nextItemIndex >= 0
            ? renderCells[cellIndex + 1 + nextItemIndex]
            : undefined;
        const neighborCell =
          neighbor?.kind === "item" ? neighbor.cell : undefined;
        const def = renderCell.cell
          ? byId.value.get(renderCell.cell.entry.item.id)
          : undefined;

        return { ...renderCell, neighbor, neighborCell, def };
      },
    );

    const rowHeight =
      row.heightSpan === 0 ? undefined : spanToHeight(row.heightSpan);
    const rowBorderClass = isEditMode.value
      ? `${editTheme.value.border} border border-dashed rounded-lg`
      : "";

    return {
      row,
      rowIndex,
      rowDomKey,
      isManagedRow,
      rowContentSpan,
      isRowPreviewActive,
      cells,
      renderCells: enrichedRenderCells,
      rowHeight,
      rowBorderClass,
    };
  });
}

function onRowDragOver(
  event: DragEvent,
  section: SmartGridSection,
  rv: SmartGridRowView,
): void {
  if (!isEditMode.value) return;
  const sourceId = getDraggedId(event);
  if (!sourceId) return;
  event.preventDefault();

  const sectionId = section.id;
  const row = rv.row;
  const cells = rv.cells;

  if (cells.length === 0) {
    if (emptyRowDropTarget.value !== rv.rowDomKey)
      emptyRowDropTarget.value = rv.rowDomKey;
    if (
      !rowPreview.value ||
      rowPreview.value.sectionId !== sectionId ||
      rowPreview.value.rowId !== row.id ||
      rowPreview.value.insertIndex !== 0
    ) {
      rowPreview.value = {
        sectionId,
        rowId: row.id,
        insertIndex: 0,
      };
    }
    return;
  }

  if (emptyRowDropTarget.value === rv.rowDomKey)
    emptyRowDropTarget.value = null;

  const rowEl = rowRefs[rv.rowDomKey];
  const rowCellsWithoutDragged = cells.filter(
    (cell) => cell.id !== sourceId,
  );
  let nextIndex = rowCellsWithoutDragged.length;

  for (let i = 0; i < rowCellsWithoutDragged.length; i += 1) {
    const candidate = rowCellsWithoutDragged[i];
    const candidateEl = rowEl?.querySelector(
      `[data-sg-item-id="${candidate.id}"]`,
    ) as HTMLElement | null;
    if (!candidateEl) continue;
    const rect = candidateEl.getBoundingClientRect();
    if (event.clientX < rect.left + rect.width / 2) {
      nextIndex = i;
      break;
    }
  }

  if (
    !rowPreview.value ||
    rowPreview.value.sectionId !== sectionId ||
    rowPreview.value.rowId !== row.id ||
    rowPreview.value.insertIndex !== nextIndex
  ) {
    rowPreview.value = {
      sectionId,
      rowId: row.id,
      insertIndex: nextIndex,
    };
  }
}

function onRowDragLeave(
  event: DragEvent,
  section: SmartGridSection,
  rv: SmartGridRowView,
): void {
  if (!isEditMode.value) return;
  const nextTarget = event.relatedTarget as Node | null;
  if (nextTarget && (event.currentTarget as HTMLElement).contains(nextTarget))
    return;
  if (emptyRowDropTarget.value === rv.rowDomKey)
    emptyRowDropTarget.value = null;
  if (
    rowPreview.value?.sectionId === section.id &&
    rowPreview.value.rowId === rv.row.id
  ) {
    rowPreview.value = null;
  }
}

function onRowDrop(
  event: DragEvent,
  section: SmartGridSection,
  rv: SmartGridRowView,
): void {
  if (!isEditMode.value) return;
  event.preventDefault();
  const sourceId = getDraggedId(event);
  if (!sourceId) return;

  const sectionId = section.id;
  const row = rv.row;
  const cells = rv.cells;

  // Clear any active row preview
  const preview = rowPreview.value;
  if (preview) {
    rowPreview.value = null;
  }

  if (cells.length > 0) {
    const targetRowId = row.id;
    const previewIndex =
      preview?.sectionId === sectionId && preview.rowId === targetRowId
        ? preview.insertIndex
        : cells.length;

    const withoutDragged = cells.filter((cell) => cell.id !== sourceId);
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
      reorderItems(sourceId, withoutDragged[0].id, "before");
    } else {
      reorderItems(sourceId, withoutDragged[safeIndex - 1].id, "after");
    }
    setItemPlacement(sourceId, sectionId, targetRowId);

    // After reorder, re-balance the spans of ALL items now in the
    // target row (including the one we just moved) so the row sums to
    // maxColumns — matching the drag-preview behavior. Without this,
    // the pre-existing items would get normalized without the moved
    // item and grow to fill the row, pushing the moved item to wrap.
    updateLayout((prev) => {
      const targetSection = prev.sections.find((s) => s.id === sectionId);
      const targetRow = targetSection?.rows.find(
        (r) => r.id === targetRowId,
      );
      if (!targetRow || targetRow.items.length === 0) return prev;

      const currentSpans = targetRow.items.map((i) =>
        clampSpan(i.span, props.maxColumns),
      );
      const newSpans = normalizeRowSpans(currentSpans, props.maxColumns);

      // Skip update if nothing would actually change
      if (currentSpans.every((s, i) => s === newSpans[i])) return prev;

      const newSections = prev.sections.map((section) => {
        if (section.id !== sectionId) return section;
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
      });

      return { ...prev, sections: newSections };
    });

    resetDragState();
    return;
  }

  moveItemToSectionEnd(sourceId, sectionId);
  resetDragState();
}

function onCellDragStart(event: DragEvent, entryId: string): void {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", entryId);
  }
  draggingId.value = entryId;
  dragOver.value = null;
}

function onCellDragOver(
  event: DragEvent,
  section: SmartGridSection,
  rv: SmartGridRowView,
  entryId: string,
): void {
  if (!isEditMode.value || !draggingId.value) return;
  event.preventDefault();
  event.stopPropagation();
  if (draggingId.value === entryId) return;
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const position =
    event.clientX < rect.left + rect.width / 2 ? "before" : "after";
  if (
    !dragOver.value ||
    dragOver.value.id !== entryId ||
    dragOver.value.position !== position
  ) {
    dragOver.value = {
      id: entryId,
      position,
    };
  }

  const previewIndex =
    position === "before"
      ? rv.cells
          .filter((entry) => entry.id !== draggingId.value)
          .findIndex((entry) => entry.id === entryId)
      : rv.cells
          .filter((entry) => entry.id !== draggingId.value)
          .findIndex((entry) => entry.id === entryId) + 1;

  if (
    previewIndex >= 0 &&
    (!rowPreview.value ||
      rowPreview.value.sectionId !== section.id ||
      rowPreview.value.rowId !== rv.row.id ||
      rowPreview.value.insertIndex !== previewIndex)
  ) {
    rowPreview.value = {
      sectionId: section.id,
      rowId: rv.row.id,
      insertIndex: previewIndex,
    };
  }
}

function onCellDragLeave(event: DragEvent, entryId: string): void {
  if (!isEditMode.value || !draggingId.value) return;
  const nextTarget = event.relatedTarget as Node | null;
  if (nextTarget && (event.currentTarget as HTMLElement).contains(nextTarget))
    return;
  if (dragOver.value?.id === entryId) dragOver.value = null;
}

function onCellDrop(event: DragEvent, entryId: string): void {
  if (!isEditMode.value) return;
  event.preventDefault();
  event.stopPropagation();
  const sourceId = getDraggedId(event);
  if (!sourceId || sourceId === entryId) return;

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const position =
    event.clientX < rect.left + rect.width / 2 ? "before" : "after";

  reorderItems(sourceId, entryId, position);
  resetDragState();
}

function onSectionBottomDragOver(event: DragEvent, sectionId: string): void {
  if (!draggingId.value) return;
  event.preventDefault();
  if (sectionBottomDropTarget.value !== sectionId)
    sectionBottomDropTarget.value = sectionId;
}

function onSectionBottomDragLeave(event: DragEvent, sectionId: string): void {
  const nextTarget = event.relatedTarget as Node | null;
  if (nextTarget && (event.currentTarget as HTMLElement).contains(nextTarget))
    return;
  if (sectionBottomDropTarget.value === sectionId)
    sectionBottomDropTarget.value = null;
}

function onSectionBottomDrop(event: DragEvent, sectionId: string): void {
  event.preventDefault();
  const sourceId = getDraggedId(event);
  if (!sourceId) return;
  moveItemToNewRow(sourceId, sectionId);
  resetDragState();
}

function onNewSectionDragOver(event: DragEvent): void {
  if (!draggingId.value) return;
  event.preventDefault();
  if (!newSectionDropTarget.value) newSectionDropTarget.value = true;
}

function onNewSectionDragLeave(event: DragEvent): void {
  const nextTarget = event.relatedTarget as Node | null;
  if (nextTarget && (event.currentTarget as HTMLElement).contains(nextTarget))
    return;
  if (newSectionDropTarget.value) newSectionDropTarget.value = false;
}

function onNewSectionDrop(event: DragEvent): void {
  event.preventDefault();
  const sourceId = getDraggedId(event);
  if (!sourceId) return;
  const sectionId = createSection();
  moveItemToNewRow(sourceId, sectionId);
  resetDragState();
}
</script>

<template>
  <div :class="rootClass" v-bind="restAttrs">
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-30 flex items-center justify-center bg-neutral-900/50 p-4"
    >
      <div
        class="w-full max-w-xl rounded-xl border border-neutral-200 bg-white p-4 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div class="mb-3 flex items-center justify-between">
          <h3
            class="text-sm font-semibold text-neutral-900 dark:text-neutral-100"
          >
            Add Items To Row
          </h3>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
              @click="closeAddModal"
            >
              Close
            </button>
          </div>
        </div>
        <p
          v-if="addableItems.length === 0 && !isEditMode"
          class="text-sm text-neutral-500 dark:text-neutral-400"
        >
          No items available to add.
        </p>
        <div v-else class="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
          <div
            v-if="isEditMode && rowAddTarget && spacerEntryVisible"
            class="flex items-center gap-3 rounded-md border border-neutral-200 p-2 dark:border-neutral-700"
          >
            <!-- Thumbnail -->
            <div
              class="shrink-0 overflow-hidden rounded border border-neutral-200 dark:border-neutral-700"
              :style="{ width: '100px', height: '100px' }"
            >
              <div
                class="flex h-full w-full items-center justify-center bg-white dark:bg-neutral-900"
              >
                <CustomIcon
                  icon="Dashboard"
                  class="h-8 w-8 text-neutral-300 dark:text-neutral-600"
                />
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5">
                <span
                  class="text-sm font-medium text-neutral-900 dark:text-neutral-100"
                >
                  Spacer
                </span>
                <span class="text-[10px] text-neutral-400 dark:text-neutral-500">
                  · Spacer
                </span>
              </div>
              <div class="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                Flexible spacing between items
              </div>
            </div>
            <button
              type="button"
              class="shrink-0 rounded border border-emerald-300 px-2 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:text-emerald-300"
              @click="onAddModalSpacer"
            >
              Add Spacer
            </button>
          </div>
          <div
            v-for="item in addableItems"
            :key="item.id"
            class="flex items-center gap-3 rounded-md border border-neutral-200 p-2 dark:border-neutral-700"
          >
            <!-- Thumbnail -->
            <div
              class="shrink-0 overflow-hidden rounded border border-neutral-200 dark:border-neutral-700"
              :style="{ width: '100px', height: '100px' }"
            >
              <img
                v-if="item.screenshot"
                :src="item.screenshot"
                :alt="item.title"
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-white dark:bg-neutral-900"
              >
                <CustomIcon
                  icon="Dashboard"
                  class="h-8 w-8 text-neutral-300 dark:text-neutral-600"
                />
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5">
                <span
                  class="text-sm font-medium text-neutral-900 dark:text-neutral-100"
                >
                  {{ item.title }}
                </span>
                <span class="text-[10px] text-neutral-400 dark:text-neutral-500">
                  · {{ item.title }}
                </span>
              </div>
              <div
                v-if="item.description"
                class="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400"
              >
                {{ item.description }}
              </div>
            </div>
            <button
              type="button"
              class="shrink-0 rounded border border-emerald-300 px-2 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:text-emerald-300"
              @click="onAddModalItem(item)"
            >
              {{ isSpacerId(item.id) ? "Add Spacer" : "Add" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <section
      v-for="section in orderedSections"
      :key="section.id"
      class="mb-6"
    >
      <div class="mb-3 flex items-center justify-between gap-2">
        <div
          v-if="isEditMode && editingSectionId === section.id"
          class="flex items-center gap-2"
        >
          <input
            :ref="focusInput"
            v-model="sectionDraftTitle"
            class="rounded border border-neutral-300 px-2 py-1 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            @blur="commitSectionTitle(section.id)"
            @keydown="onSectionTitleKeydown($event, section.id)"
          />
        </div>
        <h2
          v-else
          class="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400"
        >
          {{ section.title }}
        </h2>

        <div
          v-if="isEditMode && addableItems.length > 0"
          class="flex items-center gap-2"
        >
          <Button
            type="button"
            variant="outline"
            color="slate"
            size="xs"
            leading-icon="Add"
            @click="onSectionAddItem(section.id)"
          >
            Add Item
          </Button>
          <Button
            type="button"
            variant="outline"
            color="slate"
            size="xs"
            leading-icon="Edit"
            @click="beginRenameSection(section)"
          >
            Rename
          </Button>
          <IconButton
            icon="Trash"
            size="xs"
            variant="ghost"
            color="rose"
            title="Remove section and all items"
            aria-label="Remove section and all items"
            @click="removeSection(section.id)"
          />
        </div>
      </div>

      <div class="space-y-2">
        <div
          v-for="rv in getRowViews(section)"
          :key="rv.rowDomKey"
          class="flex w-full relative gap-1 flex-col items-center"
        >
          <div
            :class="`relative w-full ${rv.rowBorderClass}`"
            :style="rv.rowHeight ? { height: `${rv.rowHeight}px` } : {}"
          >
            <div class="flex h-full gap-2 p-2">
              <div
                v-if="isEditMode && rv.cells.length > 0"
                class="z-20 flex w-7 shrink-0 items-start justify-center pt-1"
              >
                <IconButton
                  icon="Trash"
                  size="xs"
                  variant="ghost"
                  color="rose"
                  aria-label="Remove row"
                  title="Remove row"
                  @click="
                    removeRowItems(
                      section.id,
                      rv.row.id,
                      rv.cells.map((cell) => cell.id),
                      rv.isManagedRow,
                    )
                  "
                />
              </div>
              <div
                :ref="(el) => setRowRef(rv.rowDomKey, el)"
                class="relative grid flex-1 gap-4 rounded-lg overflow-hidden"
                :style="{
                  gridTemplateColumns: `repeat(${maxColumns}, minmax(0, 1fr))`,
                  height: '100%',
                }"
                @dragover="onRowDragOver($event, section, rv)"
                @dragleave="onRowDragLeave($event, section, rv)"
                @drop="onRowDrop($event, section, rv)"
              >
                <div
                  v-if="rv.cells.length === 0"
                  :class="`flex h-full flex-col items-center justify-center rounded-md border border-dashed p-4 text-center transition ${emptyRowDropTarget === rv.rowDomKey ? `${editTheme.border} ${editTheme.tint} text-neutral-900 dark:text-neutral-100` : 'border-neutral-300 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400'}`"
                  :style="{
                    gridColumn: `span ${rv.rowContentSpan} / span ${rv.rowContentSpan}`,
                  }"
                >
                  <div v-if="isEditMode && rv.isManagedRow" class="mb-2">
                    <IconButton
                      icon="Trash"
                      size="xs"
                      variant="ghost"
                      color="rose"
                      aria-label="Remove row"
                      title="Remove row"
                      @click="
                        removeRowItems(
                          section.id,
                          rv.row.id,
                          rv.row.items.map((item) => item.id),
                          rv.isManagedRow,
                        )
                      "
                    />
                  </div>
                  <p class="text-xs">Empty row. Drag a card here.</p>
                </div>

                <template
                  v-for="rc in rv.renderCells"
                  :key="rc.kind === 'ghost' ? `ghost-${rc.id}` : rc.id"
                >
                  <div
                    v-if="rc.kind === 'ghost'"
                    :class="`relative z-10 min-h-28 rounded-xl border-2 border-dashed ${editTheme.border} ${editTheme.tint}`"
                    :style="{
                      gridColumn: `span ${rc.span} / span ${rc.span}`,
                    }"
                  />
                  <div
                    v-else-if="rc.cell && rc.cell.entry.isSpacer"
                    :data-sg-item-id="rc.id"
                    :class="`smart-grid-item relative z-10 min-h-0 rounded-xl ${isEditMode ? 'border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-500/10 cursor-grab active:cursor-grabbing' : 'bg-transparent'} ${draggingId === rc.id ? 'opacity-50 scale-[0.99]' : ''}`"
                    :style="{
                      gridColumn: `span ${rc.span} / span ${rc.span}`,
                    }"
                    :draggable="isEditMode"
                    @dragstart="onCellDragStart($event, rc.id)"
                    @dragend="resetDragState"
                    @dragover="onCellDragOver($event, section, rv, rc.id)"
                    @dragleave="onCellDragLeave($event, rc.id)"
                    @drop="onCellDrop($event, rc.id)"
                  >
                    <template v-if="isEditMode">
                      <div class="absolute right-2 top-2 z-30">
                        <IconButton
                          icon="Trash"
                          size="xs"
                          variant="ghost"
                          color="rose"
                          aria-label="Remove spacer"
                          title="Remove spacer"
                          @click="removeItem(rc.id)"
                        />
                      </div>
                      <button
                        v-if="rc.neighborCell && rc.neighbor"
                        type="button"
                        class="group absolute left-full top-2 bottom-2 z-10 w-4 cursor-col-resize bg-transparent"
                        aria-label="Resize spacer"
                        @mousedown="
                          beginResize(
                            $event,
                            rv.rowDomKey,
                            rc.id,
                            rc.neighborCell.entry.id,
                            rc.span,
                            rc.neighbor.span,
                          )
                        "
                      >
                        <span
                          :class="`absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-150 group-hover:opacity-80 group-focus-visible:opacity-80 ${editTheme.solid} ${resizeState?.leftId === rc.id ? 'opacity-90' : ''}`"
                        />
                      </button>
                    </template>
                  </div>
                  <article
                    v-else-if="rc.cell && rc.def"
                    :data-sg-item-id="rc.id"
                    :class="`smart-grid-item relative z-0 min-w-0 min-h-0 transition-[grid-column,transform,box-shadow] duration-150 ease-out ${isEditMode ? 'cursor-grab active:cursor-grabbing' : ''} ${draggingId === rc.id ? 'opacity-50 scale-[0.99]' : ''}`"
                    :style="{
                      gridColumn: `span ${rc.span} / span ${rc.span}`,
                    }"
                    :draggable="isEditMode"
                    @dragstart="onCellDragStart($event, rc.id)"
                    @dragend="resetDragState"
                    @dragover="onCellDragOver($event, section, rv, rc.id)"
                    @dragleave="onCellDragLeave($event, rc.id)"
                    @drop="onCellDrop($event, rc.id)"
                  >
                    <VNodeRenderer :nodes="rc.def.render()" />

                    <div v-if="isEditMode" class="absolute right-2 top-2 z-30">
                      <IconButton
                        icon="Trash"
                        size="xs"
                        variant="ghost"
                        color="rose"
                        :aria-label="`Remove ${rc.cell.entry.item.title}`"
                        :title="`Remove ${rc.cell.entry.item.title}`"
                        @click="removeItem(rc.id)"
                      />
                    </div>

                    <button
                      v-if="isEditMode && rc.neighborCell && rc.neighbor"
                      type="button"
                      class="group absolute left-full top-2 bottom-2 z-10 w-4 cursor-col-resize bg-transparent"
                      :aria-label="`Resize ${rc.cell.entry.item.title}`"
                      @mousedown="
                        beginResize(
                          $event,
                          rv.rowDomKey,
                          rc.id,
                          rc.neighborCell.entry.id,
                          rc.span,
                          rc.neighbor.span,
                        )
                      "
                    >
                      <span
                        :class="`absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-150 group-hover:opacity-80 group-focus-visible:opacity-80 ${editTheme.solid} ${resizeState?.leftId === rc.id ? 'opacity-90' : ''}`"
                      />
                    </button>
                  </article>
                </template>
              </div>

              <div
                v-if="isEditMode && maxColumns > 1"
                class="z-20 flex w-7 shrink-0 items-center justify-center"
              >
                <IconButton
                  icon="Add"
                  variant="ghost"
                  size="xs"
                  :color="editThemeColor"
                  :aria-label="`Add item to ${section.title} row`"
                  title="Add item to row"
                  @click="onRowAddItem(section.id, rv.row.id)"
                />
              </div>

              <div
                v-if="rv.isRowPreviewActive"
                :class="`absolute inset-0 z-10 rounded-lg ${editTheme.border} ${editTheme.tint} pointer-events-none`"
              />
            </div>
          </div>
          <div
            v-if="isEditMode"
            :class="`flex flex-col items-center rounded-full group bottom-0 h-1 cursor-ns-resize opacity-0 hover:opacity-80 ${editTheme.solid} transition-opacity ${rowResizeState?.rowId === rv.row.id ? 'opacity-100' : 'group-hover:opacity-50'}`"
            :style="{ top: 'auto', bottom: '0px', width: '95%' }"
            title="Drag to resize row height"
            @mousedown="
              beginRowResize(
                $event,
                rv.row.id,
                section.id,
                rv.row.height ?? 120,
                rv.row.heightSpan ?? 0,
              )
            "
          />
        </div>

        <div
          v-if="isEditMode && addableItems.length > 0"
          :class="`rounded-md border border-dashed px-3 py-2 text-center text-xs transition ${sectionBottomDropTarget === section.id ? `${editTheme.border} ${editTheme.tint} text-neutral-900 dark:text-neutral-100` : 'border-neutral-300 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400'}`"
          @dragover="onSectionBottomDragOver($event, section.id)"
          @dragleave="onSectionBottomDragLeave($event, section.id)"
          @drop="onSectionBottomDrop($event, section.id)"
        >
          <Button
            type="button"
            variant="outline"
            color="slate"
            size="xs"
            leading-icon="Add"
            @click="onSectionBottomAddItem(section.id)"
          >
            Add New Item
          </Button>
          <p class="mt-1">Or drop here to add item to new row</p>
        </div>
      </div>
    </section>

    <div
      v-if="isEditMode"
      :class="`rounded-xl border border-dashed p-4 text-center text-sm transition ${newSectionDropTarget ? `${editTheme.border} ${editTheme.tint} text-neutral-900 dark:text-neutral-100` : 'border-neutral-300 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400'}`"
      @dragover="onNewSectionDragOver"
      @dragleave="onNewSectionDragLeave"
      @drop="onNewSectionDrop"
    >
      <Button
        type="button"
        variant="outline"
        color="slate"
        size="sm"
        leading-icon="Add"
        @click="onCreateSectionClick"
      >
        Add item to create new section
      </Button>
      <p class="mt-2 text-xs">
        Or drop a card here to create a section and place it there
      </p>
    </div>
  </div>
</template>
