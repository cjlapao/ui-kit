/**
 * TaskBoard layout — derive the column × lane buckets from the flat cards
 * array, plus the counts and WIP state the headers display.
 */

import type { TaskBoardCard, TaskBoardColumn, TaskBoardLane } from "./types";

/** Stable key for one column × lane bucket (`lane` null on a columns board). */
export function bucketKey(column: string, lane: string | null): string {
  return `${column}::${lane ?? ""}`;
}

/** The lane a card renders in: its own when known, else the first lane. */
export function resolveLane(card: TaskBoardCard, lanes?: TaskBoardLane[]): string | null {
  if (!lanes || lanes.length === 0) return null;
  return card.lane && lanes.some((l) => l.id === card.lane) ? card.lane : lanes[0].id;
}

/**
 * Bucket the cards by column × lane, keeping array order inside each
 * bucket. Every known bucket is present (empty ones as `[]`); a card whose
 * column is unknown is left out of the view.
 */
export function bucketCards(
  cards: TaskBoardCard[],
  columns: TaskBoardColumn[],
  lanes?: TaskBoardLane[],
): Map<string, TaskBoardCard[]> {
  const map = new Map<string, TaskBoardCard[]>();
  const laneIds: (string | null)[] = lanes && lanes.length ? lanes.map((l) => l.id) : [null];
  for (const col of columns) for (const lane of laneIds) map.set(bucketKey(col.id, lane), []);
  for (const card of cards) {
    const bucket = map.get(bucketKey(card.column, resolveLane(card, lanes)));
    if (bucket) bucket.push(card);
  }
  return map;
}

export function columnCount(cards: TaskBoardCard[], columnId: string): number {
  let n = 0;
  for (const c of cards) if (c.column === columnId) n++;
  return n;
}

/** Cards in a lane. Pass `lanes` to count lane-less cards into the first lane. */
export function laneCount(cards: TaskBoardCard[], laneId: string, lanes?: TaskBoardLane[]): number {
  let n = 0;
  for (const c of cards) if ((lanes ? resolveLane(c, lanes) : c.lane) === laneId) n++;
  return n;
}

export type TaskBoardWipState = "none" | "ok" | "full" | "over";

/** WIP readout state: no limit, under, at, or over it. */
export function wipState(count: number, limit?: number): TaskBoardWipState {
  if (limit === undefined || limit === null) return "none";
  if (count > limit) return "over";
  if (count === limit) return "full";
  return "ok";
}
