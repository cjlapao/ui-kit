/**
 * TaskBoard moves — validation (locks, transition rules, WIP limits,
 * collaborative holds), applying a move to the flat cards array, resolving a
 * pointer into a drop index, and the keyboard's next valid slot.
 *
 * Slot indexes are always *final* positions in the target bucket, counted
 * without the moving card — the same number before and after the move lands.
 */

import { bucketCards, bucketKey, resolveLane } from "./layout";
import type {
  TaskBoardCard,
  TaskBoardColumn,
  TaskBoardLane,
  TaskBoardMove,
  TaskBoardSlot,
} from "./types";

export interface MoveContext {
  cards: TaskBoardCard[];
  columns: TaskBoardColumn[];
  lanes?: TaskBoardLane[];
  /** cardId → userId of whoever currently holds the card (collab). */
  heldBy?: Map<string, string>;
  /** The local user's id — a hold by yourself does not block you. */
  selfId?: string;
  /** Board-wide default for `column.maxItems`. */
  maxItems?: number;
}

export type MoveBlockReason =
  | "locked-card"
  | "locked-column"
  | "locked-lane"
  | "not-accepted"
  | "wip-column"
  | "wip-lane"
  | "max-items"
  | "held";

export type MoveVerdict = { ok: true } | { ok: false; reason: MoveBlockReason };

const OK: MoveVerdict = { ok: true };
const no = (reason: MoveBlockReason): MoveVerdict => ({ ok: false, reason });

export function validateMove(ctx: MoveContext, move: TaskBoardMove): MoveVerdict {
  const card = ctx.cards.find((c) => c.id === move.cardId);
  if (!card) return no("locked-card");
  if (card.locked) return no("locked-card");
  const holder = ctx.heldBy?.get(card.id);
  if (holder && holder !== ctx.selfId) return no("held");

  const fromCol = ctx.columns.find((c) => c.id === move.from.column);
  const toCol = ctx.columns.find((c) => c.id === move.to.column);
  if (!toCol || fromCol?.locked || toCol.locked) return no("locked-column");

  const fromLane = ctx.lanes?.find((l) => l.id === move.from.lane);
  const toLane = ctx.lanes?.find((l) => l.id === move.to.lane);
  if (fromLane?.locked || toLane?.locked) return no("locked-lane");

  const changesColumn = move.from.column !== move.to.column;
  if (changesColumn && toCol.accepts && !toCol.accepts.includes(move.from.column)) {
    return no("not-accepted");
  }
  const max = effectiveMaxItems(toCol, ctx.maxItems);
  if (changesColumn && max !== undefined) {
    const others = ctx.cards.filter((c) => c.column === toCol.id && c.id !== card.id).length;
    if (others >= max) return no("max-items");
  }
  if (changesColumn && toCol.wipLimit !== undefined) {
    const others = ctx.cards.filter((c) => c.column === toCol.id && c.id !== card.id).length;
    if (others >= toCol.wipLimit) return no("wip-column");
  }
  if (move.from.lane !== move.to.lane && toLane?.wipLimit !== undefined) {
    const others = ctx.cards.filter(
      (c) => c.id !== card.id && resolveLane(c, ctx.lanes) === toLane.id,
    ).length;
    if (others >= toLane.wipLimit) return no("wip-lane");
  }
  return OK;
}

/** A column's cap: its own `maxItems`, else the board default. */
export function effectiveMaxItems(column: TaskBoardColumn, boardMax?: number): number | undefined {
  return column.maxItems ?? boardMax;
}

/** The column holds as many cards as it may — no add, no drops in. */
export function columnAtMax(cards: TaskBoardCard[], column: TaskBoardColumn, boardMax?: number): boolean {
  const max = effectiveMaxItems(column, boardMax);
  if (max === undefined) return false;
  let n = 0;
  for (const c of cards) if (c.column === column.id) n++;
  return n >= max;
}

/**
 * Apply a move: the card takes the target column/lane and is placed in the
 * flat array so that `bucketCards` yields it at `to.index` (clamped). Every
 * other card keeps its relative order; the input array is not mutated.
 */
export function applyMove(
  cards: TaskBoardCard[],
  move: TaskBoardMove,
  columns: TaskBoardColumn[],
  lanes?: TaskBoardLane[],
): TaskBoardCard[] {
  const card = cards.find((c) => c.id === move.cardId);
  if (!card) return cards;
  const rest = cards.filter((c) => c.id !== move.cardId);
  const moved: TaskBoardCard = { ...card, column: move.to.column };
  if (move.to.lane !== null) moved.lane = move.to.lane;

  const bucket = bucketCards(rest, columns, lanes).get(bucketKey(move.to.column, move.to.lane)) ?? [];
  const index = Math.max(0, Math.min(move.to.index, bucket.length));
  if (bucket.length === 0) return [...rest, moved];
  if (index < bucket.length) {
    const at = rest.indexOf(bucket[index]);
    return [...rest.slice(0, at), moved, ...rest.slice(at)];
  }
  const after = rest.indexOf(bucket[bucket.length - 1]) + 1;
  return [...rest.slice(0, after), moved, ...rest.slice(after)];
}

export interface DropRect {
  id: string;
  top: number;
  height: number;
}

/**
 * Midpoint rule (SmartGrid / Gantt reorder): above the hovered card's
 * midpoint → before it, below → after it. Over the dragged card itself the
 * current target is kept, so a fresh press and small jitters shift nothing.
 * `rects` is the bucket's live card list in visual order and may include the
 * dragged card; the returned index excludes it.
 */
export function resolveDropIndex(
  rects: DropRect[],
  pointerY: number,
  draggedId: string,
  current: number | null,
): number {
  const others = rects.filter((r) => r.id !== draggedId);
  const self = rects.find((r) => r.id === draggedId);
  if (self && pointerY >= self.top && pointerY <= self.top + self.height) {
    return current ?? others.filter((r) => r.top < self.top).length;
  }
  for (let i = 0; i < others.length; i++) {
    const r = others[i];
    if (pointerY < r.top + r.height / 2) return i;
  }
  return others.length;
}

export type KeyboardDirection = "left" | "right" | "up" | "down" | "lane-up" | "lane-down";

/** The nearest valid slot in a direction, or null at the edge / when none. */
export function keyboardTarget(
  ctx: MoveContext,
  from: TaskBoardSlot,
  cardId: string,
  dir: KeyboardDirection,
): TaskBoardSlot | null {
  const others = ctx.cards.filter((c) => c.id !== cardId);
  const buckets = bucketCards(others, ctx.columns, ctx.lanes);
  const lenOf = (column: string, lane: string | null) => buckets.get(bucketKey(column, lane))?.length ?? 0;
  const valid = (to: TaskBoardSlot) => validateMove(ctx, { cardId, from, to }).ok;

  if (dir === "up" || dir === "down") {
    const index = from.index + (dir === "down" ? 1 : -1);
    if (index < 0 || index > lenOf(from.column, from.lane)) return null;
    const to = { ...from, index };
    return valid(to) ? to : null;
  }

  if (dir === "left" || dir === "right") {
    const cols = ctx.columns;
    const step = dir === "right" ? 1 : -1;
    for (let i = cols.findIndex((c) => c.id === from.column) + step; i >= 0 && i < cols.length; i += step) {
      const col = cols[i];
      if (col.collapsed) continue;
      const to = { column: col.id, lane: from.lane, index: Math.min(from.index, lenOf(col.id, from.lane)) };
      if (valid(to)) return to;
    }
    return null;
  }

  const lanes = ctx.lanes ?? [];
  const step = dir === "lane-down" ? 1 : -1;
  for (let i = lanes.findIndex((l) => l.id === from.lane) + step; i >= 0 && i < lanes.length; i += step) {
    const lane = lanes[i];
    if (lane.collapsed) continue;
    const to = { column: from.column, lane: lane.id, index: Math.min(from.index, lenOf(from.column, lane.id)) };
    if (valid(to)) return to;
  }
  return null;
}
