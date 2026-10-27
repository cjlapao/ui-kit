/**
 * TaskBoard internal context — what every column, lane cell and card needs
 * from the board, so the layouts do not thread a dozen props each.
 */

import type React from "react";
import { createContext, useContext, type ReactNode } from "react";
import type {
  TaskBoardCard,
  TaskBoardCardLayout,
  TaskBoardColumn,
  TaskBoardPriority,
  TaskBoardUser,
  TrueColor,
} from "../../../../common/taskboard";
import type { ControlSize, SurfaceTextTokens } from "../../theme/Theme";
import type { TaskBoardText } from "./labels";

export interface TaskBoardCardState {
  /** This card is the one being dragged locally. */
  dragging: boolean;
  /** Picked up with the keyboard (Space) and moving slot by slot. */
  grabbed?: boolean;
  /** A peer holds this card (collaboration). */
  held?: TaskBoardUser;
  /** A short-lived note on the card, e.g. "Ben has this" after losing a grab race. */
  notice?: string;
  /** Colour of the notice tag (the peer it is about). */
  noticeColor?: TrueColor;
  selected: boolean;
  /** A guarded move (`onBeforeMove`) is awaiting its answer. */
  pending: boolean;
}

export interface TaskBoardContextMenuPayload {
  card: TaskBoardCard;
  column: string;
  lane: string | null;
  index: number;
  x: number;
  y: number;
  event: React.MouseEvent | React.KeyboardEvent;
}

/** Per-size geometry — column width and the card's padding/type steps. */
export interface TaskBoardSizeTokens {
  columnWidth: number;
  cardPad: string;
  title: string;
  meta: string;
  gap: string;
}

export const TASKBOARD_SIZES: Record<ControlSize, TaskBoardSizeTokens> = {
  xs: { columnWidth: 232, cardPad: "p-2", title: "text-xs", meta: "text-[10px]", gap: "gap-1.5" },
  sm: { columnWidth: 248, cardPad: "p-2.5", title: "text-[13px]", meta: "text-[11px]", gap: "gap-2" },
  md: { columnWidth: 288, cardPad: "p-3", title: "text-sm", meta: "text-xs", gap: "gap-2" },
  lg: { columnWidth: 320, cardPad: "p-3.5", title: "text-[15px]", meta: "text-xs", gap: "gap-2.5" },
  xl: { columnWidth: 352, cardPad: "p-4", title: "text-base", meta: "text-sm", gap: "gap-3" },
};

export interface TaskBoardContextValue {
  text: TaskBoardText;
  surface: SurfaceTextTokens;
  color: TrueColor;
  size: TaskBoardSizeTokens;
  /** Resolved expanded-column width; `auto` has already fallen back to size. */
  columnWidth: number | string;
  cardLayout: TaskBoardCardLayout;
  priorities: Map<string, TaskBoardPriority>;
  locale: string;
  editable: boolean;
  renderCard?: (card: TaskBoardCard, state: TaskBoardCardState) => ReactNode;
  onCardOpen?: (card: TaskBoardCard) => void;
  onCardContextMenu?: (payload: TaskBoardContextMenuPayload) => void;
  onAddCard?: (target: { column: string; lane: string | null }) => void;
  /** Card surface classes for the board's surface (solid vs translucent). */
  cardSurface: string;
  /** Column well fill. */
  wellSurface: string;
  /** Radius class of the column wells (columnCorner). */
  columnCornerClass: string;
  /** Edit mode: props for a column's drag grip (absent outside edit mode). */
  columnGripProps?: (column: TaskBoardColumn, index: number) => React.ButtonHTMLAttributes<HTMLButtonElement> & {
    "data-column-grip": string;
  };
  /** The column being dragged (edit mode), shown as a placeholder in the row. */
  draggingColumnId?: string | null;
  /** Edit mode: commit one edited column (absent outside edit mode). */
  onEditColumn?: (next: TaskBoardColumn) => void;
  /** Every column, for editors that refer to the others (transition rules). */
  allColumns?: TaskBoardColumn[];
  /** Board-wide default for `column.maxItems`. */
  boardMaxItems?: number;
  /** Opaque-enough fill for sticky headers that cards scroll under. */
  stickySurface: string;
  /** Live state of a card (drag / hold / selection / pending). */
  cardState: (card: TaskBoardCard) => TaskBoardCardState;
  /** Extra props for a card element — pointer and keyboard wiring. */
  cardProps?: (card: TaskBoardCard, slot: { column: string; lane: string | null; index: number }) => React.HTMLAttributes<HTMLDivElement>;
  /** Per-bucket drop feedback: the insertion index and whether the drop is allowed. */
  dropTarget?: { bucket: string; index: number; valid: boolean } | null;
}

/**
 * A refused drop target — painted on the whole column well (or lane cell),
 * replacing its fill, so "not here" reads as one block, not as a red band
 * between the cards.
 */
export const REFUSED_DROP = "cursor-not-allowed bg-red-500/10 ring-2 ring-inset ring-red-500/40 dark:bg-red-500/15";

export const TaskBoardContext = createContext<TaskBoardContextValue | null>(null);

export function useTaskBoard(): TaskBoardContextValue {
  const ctx = useContext(TaskBoardContext);
  if (!ctx) throw new Error("TaskBoard parts must render inside <TaskBoard>");
  return ctx;
}
