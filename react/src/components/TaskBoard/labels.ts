/**
 * TaskBoard copy — `labels` prop > `kit.taskboard.*` catalog (translated by
 * the kit i18n engine, which falls back to en).
 */

import { useCallback } from "react";
import type { TaskBoardLabels } from "../../../../common/taskboard";
import { useKitT } from "../../i18n";

// Literal keys: the catalog-consistency test scans for each one.
const KEYS: Record<keyof TaskBoardLabels, string> = {
  root: "kit.taskboard.root",
  loading: "kit.taskboard.loading",
  empty: "kit.taskboard.empty",
  error: "kit.taskboard.error",
  retry: "kit.taskboard.retry",
  addCard: "kit.taskboard.addCard",
  collapse: "kit.taskboard.collapse",
  expand: "kit.taskboard.expand",
  cardCount: "kit.taskboard.cardCount",
  wip: "kit.taskboard.wip",
  grabbed: "kit.taskboard.grabbed",
  moved: "kit.taskboard.moved",
  movedLane: "kit.taskboard.movedLane",
  dropped: "kit.taskboard.dropped",
  cancelled: "kit.taskboard.cancelled",
  held: "kit.taskboard.held",
  heldShort: "kit.taskboard.heldShort",
  notAllowed: "kit.taskboard.notAllowed",
  pending: "kit.taskboard.pending",
  online: "kit.taskboard.online",
  notes: "kit.taskboard.notes",
  checklist: "kit.taskboard.checklist",
  due: "kit.taskboard.due",
  addColumn: "kit.taskboard.addColumn",
  columnName: "kit.taskboard.columnName",
  moveColumn: "kit.taskboard.moveColumn",
  columnGrabbed: "kit.taskboard.columnGrabbed",
  columnMoved: "kit.taskboard.columnMoved",
  editColumn: "kit.taskboard.editColumn",
  columnColor: "kit.taskboard.columnColor",
  wipLimit: "kit.taskboard.wipLimit",
  wipLimitHint: "kit.taskboard.wipLimitHint",
  lockColumn: "kit.taskboard.lockColumn",
  lockColumnHint: "kit.taskboard.lockColumnHint",
  acceptsFrom: "kit.taskboard.acceptsFrom",
  acceptsAny: "kit.taskboard.acceptsAny",
  save: "kit.taskboard.save",
  cancel: "kit.taskboard.cancel",
  maxItems: "kit.taskboard.maxItems",
  maxItemsHint: "kit.taskboard.maxItemsHint",
};

export type TaskBoardText = (key: keyof TaskBoardLabels, values?: Record<string, unknown>) => string;

const interpolate = (s: string, values?: Record<string, unknown>) =>
  values ? s.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m)) : s;

export function useTaskBoardText(labels?: Partial<TaskBoardLabels>): TaskBoardText {
  const t = useKitT();
  return useCallback<TaskBoardText>(
    (key, values) => {
      const own = labels?.[key];
      return own !== undefined ? interpolate(own, values) : t(KEYS[key], values);
    },
    [t, labels],
  );
}
