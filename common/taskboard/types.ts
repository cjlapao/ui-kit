/**
 * TaskBoard — framework-agnostic data model.
 *
 * A flat `cards[]` (each card names its `column` and, on a swimlane board,
 * its `lane`) plus `columns[]` and optional `lanes[]`. Order inside a
 * column × lane bucket is the order of the cards array — the board never
 * keeps a second ordering, so the app stores one list and the engine derives
 * the slots (`bucketCards`).
 */

import type { TrueColor } from "../theme/Theme";
export type { TrueColor };

/** A date accepted anywhere the model takes one: ISO string, Date or epoch ms. */
export type TaskBoardDate = string | Date | number;

export interface TaskBoardUser {
  id: string;
  name: string;
  avatarUrl?: string;
  /** Presence / avatar colour. Derived from the id when omitted (`peerColor`). */
  color?: TrueColor;
}

/** A tag — a bare string, or a label with its own colour. */
export type TaskBoardTag = string | { label: string; color?: TrueColor };

export interface TaskBoardPriority {
  id: string;
  label: string;
  color: TrueColor;
}

export interface TaskBoardCard {
  id: string;
  title: string;
  /** Column id the card sits in. */
  column: string;
  /** Lane id (swimlane boards). Missing / unknown → the first lane. */
  lane?: string;
  /** Free text; a card with notes shows the "has notes" glyph. */
  description?: string;
  tags?: TaskBoardTag[];
  /** Id into the board's `priorities`. */
  priority?: string;
  assignees?: TaskBoardUser[];
  due?: TaskBoardDate;
  checklist?: { done: number; total: number };
  /** Estimate points (compact cards show them as `3p`). */
  points?: number;
  /** Per-card permission: a locked card cannot be moved. */
  locked?: boolean;
  /** Tints the card's surface — give cards different colours (status, type,
   *  owner…). Omitted = the board's neutral card surface. */
  tone?: TrueColor;
  /** App payload, passed back untouched. */
  data?: Record<string, unknown>;
}

export interface TaskBoardColumn {
  id: string;
  title: string;
  color?: TrueColor;
  /** Work-in-progress limit — a full column refuses new cards. */
  wipLimit?: number;
  /** A locked column accepts no drops and lets no card leave. */
  locked?: boolean;
  collapsed?: boolean;
  /** Transition rule: the column ids a card may arrive from. Omitted = any. */
  accepts?: string[];
}

export interface TaskBoardLane {
  id: string;
  title: string;
  color?: TrueColor;
  collapsed?: boolean;
  wipLimit?: number;
  locked?: boolean;
}

/** One position on the board: a column × lane bucket and an index in it. */
export interface TaskBoardSlot {
  column: string;
  lane: string | null;
  index: number;
}

/** A card moving from one slot to another — the single commit unit. */
export interface TaskBoardMove {
  cardId: string;
  from: TaskBoardSlot;
  to: TaskBoardSlot;
}

/** Board layouts — runtime list so demos can enumerate them. */
export const TASKBOARD_LAYOUTS = ["columns", "lanes"] as const;
export type TaskBoardLayout = (typeof TASKBOARD_LAYOUTS)[number];
/** Card presets. */
export const TASKBOARD_CARD_LAYOUTS = ["detailed", "compact"] as const;
export type TaskBoardCardLayout = (typeof TASKBOARD_CARD_LAYOUTS)[number];

/** Built-in strings. The React layer fills them from the `kit.taskboard.*`
 *  catalogs; `labels` overrides them per board. */
export interface TaskBoardLabels {
  root: string;
  loading: string;
  empty: string;
  error: string;
  retry: string;
  addCard: string;
  collapse: string;
  expand: string;
  cardCount: string;
  wip: string;
  grabbed: string;
  moved: string;
  movedLane: string;
  dropped: string;
  cancelled: string;
  held: string;
  heldShort: string;
  notAllowed: string;
  pending: string;
  online: string;
  notes: string;
  checklist: string;
  due: string;
  addColumn: string;
  columnName: string;
  moveColumn: string;
  columnGrabbed: string;
  columnMoved: string;
  editColumn: string;
  columnColor: string;
  wipLimit: string;
  wipLimitHint: string;
  lockColumn: string;
  lockColumnHint: string;
  acceptsFrom: string;
  acceptsAny: string;
  save: string;
  cancel: string;
}

export const DEFAULT_TASKBOARD_LABELS: TaskBoardLabels = {
  root: "Task board",
  loading: "Loading board…",
  empty: "No cards yet",
  error: "Couldn't load the board",
  retry: "Retry",
  addCard: "Add card",
  collapse: "Collapse {name}",
  expand: "Expand {name}",
  cardCount: "{count} cards",
  wip: "{count} of {limit}",
  grabbed: "Picked up {title}. Use arrow keys to move, Space to drop, Escape to cancel.",
  moved: "Moved to {column}, position {index} of {total}",
  movedLane: "Moved to {column} in {lane}, position {index} of {total}",
  dropped: "Dropped {title} in {column}",
  cancelled: "Move cancelled",
  held: "{name} is moving this",
  heldShort: "{name} has this",
  notAllowed: "Can't drop here",
  pending: "Saving…",
  online: "{count} online",
  notes: "Has notes",
  checklist: "{done} of {total} done",
  due: "Due {date}",
  addColumn: "Add column",
  columnName: "Column name",
  moveColumn: "Move {name}",
  columnGrabbed: "Picked up {name}. Use the arrow keys to move it, Space to drop, Escape to cancel.",
  columnMoved: "{name} moved to position {index} of {total}",
  editColumn: "Edit {name}",
  columnColor: "Colour",
  wipLimit: "WIP limit",
  wipLimitHint: "Empty means no limit.",
  lockColumn: "Locked",
  lockColumnHint: "No card moves in or out.",
  acceptsFrom: "Accepts cards from",
  acceptsAny: "None ticked: any column.",
  save: "Save",
  cancel: "Cancel",
};
