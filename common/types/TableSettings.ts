/**
 * Unified snapshot of all user-configurable table preferences.
 *
 * Defined here (not in a kit) because it is the persistence contract shared
 * by the React and Vue kits and by the storage helpers in
 * `common/utils/tableStorage.ts`. A kit's Table component re-exports it.
 */
export interface TableSettings {
  columnVisibility?: Record<string, boolean>;
  columnWidths?: Record<string, number>;
  activeView?: "table" | "panel";
  groupBy?: string | null;
  showGroupHeader?: boolean;
  stickyColumns?: Record<string, "left" | "right">;
}
