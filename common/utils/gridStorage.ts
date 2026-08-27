import {
  buildStorageKey,
  createSafeLocalStorage,
  isRecord,
  type KitStorageAdapter,
} from "./safeStorage";

/**
 * Built-in layout persistence for `SmartGridLayout`.
 *
 * Follows `tableStorage.ts` deliberately: the same opt-in-by-`storageKey`
 * model, the same versioned envelope, the same "validate, do not trust"
 * decode. One mental model across the kit.
 *
 * The difference is depth. A table's settings are a flat bag of maps; a grid
 * layout is sections → rows → items, and a half-corrupt one used to reach the
 * renderer and crash it. `decodeStoredLayout` therefore rebuilds the structure
 * field by field and drops only the parts that are malformed.
 */

export type GridStorageAdapter = KitStorageAdapter;
export { createSafeLocalStorage };

/** Default key prefix so grid entries never collide with app keys. */
export const GRID_STORAGE_DEFAULT_PREFIX = "ui-kit:grid";

/** Envelope version. Bump when the layout shape changes incompatibly. */
export const GRID_LAYOUT_STORAGE_VERSION = 1;

/** The layout shape this module reads and writes. Mirrors the component's. */
export interface StoredGridItem {
  definitionId: string;
  id: string;
  span: number;
  order: number;
  sectionId: string;
  rowId: string;
  isSpacer?: boolean;
}

export interface StoredGridRow {
  id: string;
  order: number;
  items: StoredGridItem[];
  height?: number;
  heightSpan?: number;
}

export interface StoredGridSection {
  id: string;
  title: string;
  order: number;
  rows: StoredGridRow[];
}

export interface StoredGridLayout {
  version: 3;
  sections: StoredGridSection[];
}

export interface GridStoredEnvelope {
  v: number;
  layout: StoredGridLayout;
}

export const buildGridStorageKey = (prefix: string, storageKey: string): string =>
  buildStorageKey(prefix, storageKey);

const isString = (v: unknown): v is string => typeof v === "string";
const isFiniteNumber = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

/**
 * One item. Returns `null` for anything missing an identity or a placement —
 * an item without those cannot be rendered anywhere, so keeping it would only
 * move the failure downstream.
 */
const sanitizeItem = (value: unknown): StoredGridItem | null => {
  if (!isRecord(value)) return null;
  if (!isString(value.id) || !isString(value.definitionId)) return null;
  if (!isString(value.sectionId) || !isString(value.rowId)) return null;
  return {
    definitionId: value.definitionId,
    id: value.id,
    sectionId: value.sectionId,
    rowId: value.rowId,
    // A non-numeric span or order is recoverable: the component renormalises
    // both on load, so a sane default is better than dropping the tile.
    span: isFiniteNumber(value.span) ? value.span : 1,
    order: isFiniteNumber(value.order) ? value.order : 0,
    ...(value.isSpacer === true ? { isSpacer: true } : {}),
  };
};

const sanitizeRow = (value: unknown): StoredGridRow | null => {
  if (!isRecord(value) || !isString(value.id)) return null;
  const items = Array.isArray(value.items)
    ? value.items.map(sanitizeItem).filter((i): i is StoredGridItem => i !== null)
    : [];
  return {
    id: value.id,
    order: isFiniteNumber(value.order) ? value.order : 0,
    items,
    ...(isFiniteNumber(value.height) ? { height: value.height } : {}),
    ...(isFiniteNumber(value.heightSpan) ? { heightSpan: value.heightSpan } : {}),
  };
};

const sanitizeSection = (value: unknown): StoredGridSection | null => {
  if (!isRecord(value) || !isString(value.id)) return null;
  const rows = Array.isArray(value.rows)
    ? value.rows.map(sanitizeRow).filter((r): r is StoredGridRow => r !== null)
    : [];
  return {
    id: value.id,
    title: isString(value.title) ? value.title : value.id,
    order: isFiniteNumber(value.order) ? value.order : 0,
    rows,
  };
};

export const encodeStoredLayout = (layout: StoredGridLayout): string =>
  JSON.stringify({
    v: GRID_LAYOUT_STORAGE_VERSION,
    layout,
  } satisfies GridStoredEnvelope);

/**
 * Parse and validate. Returns `null` for anything that is not a
 * current-version layout, so the component falls back to its default rather
 * than rendering against garbage.
 *
 * A layout that decodes to zero usable sections also returns `null`: an empty
 * dashboard is indistinguishable from a broken one to the user, and falling
 * back to the default at least shows them something.
 */
export const decodeStoredLayout = (raw: string | null): StoredGridLayout | null => {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.v !== GRID_LAYOUT_STORAGE_VERSION) {
      return null;
    }
    const layout = parsed.layout;
    if (!isRecord(layout) || layout.version !== 3) return null;
    if (!Array.isArray(layout.sections)) return null;

    const sections = layout.sections
      .map(sanitizeSection)
      .filter((s): s is StoredGridSection => s !== null)
      .filter((s) => s.rows.length > 0);

    if (sections.length === 0) return null;
    return { version: 3, sections };
  } catch {
    return null;
  }
};


/**
 * Export a layout as pretty-printed JSON, for a user to save or share.
 *
 * Deliberately the *same envelope* the storage path writes, so an exported
 * file can be pasted straight back through `importGridLayout` — or dropped
 * into a storage key by hand.
 */
export const exportGridLayout = (layout: StoredGridLayout): string =>
  JSON.stringify(
    { v: GRID_LAYOUT_STORAGE_VERSION, layout } satisfies GridStoredEnvelope,
    null,
    2,
  );

/**
 * The inverse. Runs the same validation as a storage read, so a hand-edited or
 * truncated file degrades to `null` rather than reaching the renderer.
 *
 * Also accepts a bare layout object (`{ version: 3, sections: [...] }`)
 * without the envelope, because that is what people actually paste when they
 * have copied a layout out of devtools.
 */
export const importGridLayout = (raw: string): StoredGridLayout | null => {
  const enveloped = decodeStoredLayout(raw);
  if (enveloped) return enveloped;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 3) return null;
    return decodeStoredLayout(
      JSON.stringify({ v: GRID_LAYOUT_STORAGE_VERSION, layout: parsed }),
    );
  } catch {
    return null;
  }
};
