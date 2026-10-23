/**
 * TaskBoard history — a pure undo/redo stack over moves.
 *
 * The board does not own it: an undo has to reach the app's backend like any
 * other move, so the app calls `undo(cards)` and commits what comes back.
 */

import { applyMove } from "./move";
import type { TaskBoardCard, TaskBoardColumn, TaskBoardLane, TaskBoardMove } from "./types";

export interface TaskBoardHistory {
  push(move: TaskBoardMove): void;
  /** Apply the inverse of the last move; null when there is nothing to undo. */
  undo(cards: TaskBoardCard[], columns: TaskBoardColumn[], lanes?: TaskBoardLane[]): TaskBoardCard[] | null;
  redo(cards: TaskBoardCard[], columns: TaskBoardColumn[], lanes?: TaskBoardLane[]): TaskBoardCard[] | null;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  /** Moves on the undo stack. */
  readonly size: number;
  clear(): void;
}

const invert = (m: TaskBoardMove): TaskBoardMove => ({ cardId: m.cardId, from: m.to, to: m.from });

export function createTaskBoardHistory(limit = 100): TaskBoardHistory {
  let past: TaskBoardMove[] = [];
  let future: TaskBoardMove[] = [];
  return {
    push(move) {
      past = [...past, move].slice(-limit);
      future = [];
    },
    undo(cards, columns, lanes) {
      const move = past[past.length - 1];
      if (!move) return null;
      past = past.slice(0, -1);
      future = [...future, move];
      return applyMove(cards, invert(move), columns, lanes);
    },
    redo(cards, columns, lanes) {
      const move = future[future.length - 1];
      if (!move) return null;
      future = future.slice(0, -1);
      past = [...past, move];
      return applyMove(cards, move, columns, lanes);
    },
    get canUndo() {
      return past.length > 0;
    },
    get canRedo() {
      return future.length > 0;
    },
    get size() {
      return past.length;
    },
    clear() {
      past = [];
      future = [];
    },
  };
}
