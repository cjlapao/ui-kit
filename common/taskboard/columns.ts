/**
 * TaskBoard column editing — reorder and add columns (edit mode).
 */

import type { TaskBoardColumn } from "./types";

/** Move a column to `toIndex` (its final position, clamped). Pure. */
export function moveColumn(columns: TaskBoardColumn[], id: string, toIndex: number): TaskBoardColumn[] {
  const from = columns.findIndex((c) => c.id === id);
  if (from === -1) return columns;
  const rest = columns.filter((c) => c.id !== id);
  const at = Math.max(0, Math.min(toIndex, rest.length));
  return [...rest.slice(0, at), columns[from], ...rest.slice(at)];
}

export interface ColumnDropRect {
  id: string;
  left: number;
  width: number;
}

/**
 * Swap-on-hover for a column drag: the moment the pointer enters a
 * neighbouring column, the dragged one takes its place. `rects` are the
 * columns in their current (preview) order, the dragged one included.
 *
 * Only a column *ahead* in the direction of travel swaps (`dx` is the sign of
 * the pointer's on-screen movement). Without that, unequal widths flip-flop:
 * a narrow column swapped past a wide one lands with the wide one under the
 * pointer again. Over the dragged column itself, or in a gap, the current
 * target holds. Past either end of the row the column goes to that end.
 */
export function resolveColumnSwapIndex(
  rects: ColumnDropRect[],
  pointerX: number,
  draggedId: string,
  current: number,
  dx: number,
  rtl = false,
): number {
  const d = rects.findIndex((r) => r.id === draggedId);
  if (d === -1 || dx === 0 || rects.length === 0) return current;
  const forward = rtl ? dx < 0 : dx > 0;
  const last = rects.length - 1;
  const hovered = rects.findIndex((r) => pointerX >= r.left && pointerX <= r.left + r.width);
  if (hovered !== -1) {
    if (hovered === d) return current;
    if (hovered > d && forward) return Math.min(hovered, last);
    if (hovered < d && !forward) return hovered;
    return current;
  }
  const minLeft = Math.min(...rects.map((r) => r.left));
  const maxRight = Math.max(...rects.map((r) => r.left + r.width));
  const pastEnd = rtl ? pointerX < minLeft : pointerX > maxRight;
  const beforeStart = rtl ? pointerX > maxRight : pointerX < minLeft;
  if (pastEnd && forward) return last;
  if (beforeStart && !forward) return 0;
  return current;
}

/** An id for a new column from its title: slugged, suffixed when taken. */
export function uniqueColumnId(title: string, columns: TaskBoardColumn[]): string {
  const base =
    title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "column";
  const taken = new Set(columns.map((c) => c.id));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
