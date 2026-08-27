import type { TableSettings } from "../types/TableSettings";

/**
 * Built-in table settings persistence.
 *
 * The kit's Table exposes `storageKey`; when set, the table reads its
 * settings once on mount and writes the full snapshot after every change.
 * This module is framework-agnostic so the React and Vue kits share one
 * envelope format and one validation pass.
 *
 * The default backend is a best-effort localStorage wrapper: it swallows
 * quota errors, private-mode rejections and SSR (no `window`) so persistence
 * can never crash a render. Any `Storage`-shaped object (sessionStorage, a
 * test mock, an IndexedDB adapter) can be passed in its place.
 */

import {
  buildStorageKey,
  createSafeLocalStorage,
  isRecord,
  type KitStorageAdapter,
} from "./safeStorage";

/**
 * The storage backend and key builder now live in `safeStorage.ts`, shared
 * with `SmartGridLayout`. Re-exported here under their original names so
 * `Table` and its tests are untouched.
 */
export type TableStorageAdapter = KitStorageAdapter;
export { createSafeLocalStorage };

/** Default key prefix so table entries never collide with app keys. */
export const TABLE_STORAGE_DEFAULT_PREFIX = "ui-kit:table";

/** Envelope version. Bump when the settings shape changes incompatibly. */
export const TABLE_SETTINGS_STORAGE_VERSION = 1;

export interface TableStoredSettings {
  v: number;
  settings: TableSettings;
}

export const buildTableStorageKey = (
  prefix: string,
  storageKey: string,
): string => buildStorageKey(prefix, storageKey);

const isBooleanMap = (
  value: unknown,
): value is Record<string, boolean> =>
  isRecord(value) && Object.values(value).every((v) => typeof v === "boolean");

const isNumberMap = (value: unknown): value is Record<string, number> =>
  isRecord(value) && Object.values(value).every((v) => typeof v === "number");

const isStickyMap = (
  value: unknown,
): value is Record<string, "left" | "right"> =>
  isRecord(value) &&
  Object.values(value).every((v) => v === "left" || v === "right");

/**
 * Validate a persisted snapshot field by field. A half-corrupt object keeps
 * whatever parts are valid instead of being discarded wholesale — a table
 * with only widths saved must not lose them because the view field garbled.
 */
const sanitizeSettings = (value: unknown): TableSettings => {
  if (!isRecord(value)) return {};
  const settings: TableSettings = {};
  if (isBooleanMap(value.columnVisibility)) {
    settings.columnVisibility = value.columnVisibility;
  }
  if (isNumberMap(value.columnWidths)) {
    settings.columnWidths = value.columnWidths;
  }
  if (value.activeView === "table" || value.activeView === "panel") {
    settings.activeView = value.activeView;
  }
  if (value.groupBy === null || typeof value.groupBy === "string") {
    settings.groupBy = value.groupBy;
  }
  if (typeof value.showGroupHeader === "boolean") {
    settings.showGroupHeader = value.showGroupHeader;
  }
  if (isStickyMap(value.stickyColumns)) {
    settings.stickyColumns = value.stickyColumns;
  }
  return settings;
};

export const encodeStoredSettings = (
  settings: TableSettings,
): string =>
  JSON.stringify({
    v: TABLE_SETTINGS_STORAGE_VERSION,
    settings,
  } satisfies TableStoredSettings);

/**
 * Parse and validate a stored value. Returns `null` for anything that is not
 * a current-version settings object — the component then falls back to its
 * prop-provided defaults rather than rendering against garbage.
 */
export const decodeStoredSettings = (
  raw: string | null,
): TableSettings | null => {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.v !== TABLE_SETTINGS_STORAGE_VERSION) {
      return null;
    }
    return sanitizeSettings(parsed.settings);
  } catch {
    return null;
  }
};
