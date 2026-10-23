/**
 * Edit-mode furniture for columns: the drag grip, the "Add column" slot with
 * its inline name field, and the floating header clone of a column drag.
 */

import React, { useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import {
  getTaskBoardCardToneTokens,
  getTaskBoardColumnTokens,
  getTaskBoardSelectionTokens,
  type TaskBoardCard as TaskBoardCardModel,
  type TaskBoardColumn,
} from "../../../../common/taskboard";
import { getSurfaceTriggerTokens } from "../../theme/Theme";
import { Add } from "../../icons/components/Add";
import { Drag } from "../../icons/components/Drag";
import { useTaskBoard } from "./context";
import { TaskBoardCardBody } from "./TaskBoardCard";
import type { TaskBoardColumnDragState } from "./useTaskBoardColumnDrag";

/** The column's drag handle — only rendered in edit mode. */
export const TaskBoardColumnGrip: React.FC<{ column: TaskBoardColumn; index: number }> = ({ column, index }) => {
  const { columnGripProps, surface, color } = useTaskBoard();
  if (!columnGripProps) return null;
  const trigger = getSurfaceTriggerTokens(color);
  return (
    <button
      type="button"
      {...columnGripProps(column, index)}
      // touch-none: on touch the grip drags at once instead of scrolling.
      className={classNames(
        "shrink-0 cursor-grab touch-none rounded p-1 active:cursor-grabbing",
        surface.muted,
        trigger.hover,
        trigger.focusRing,
      )}
    >
      <Drag className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
};

/** "Add column" — a button that turns into a name field. Enter adds, Escape cancels. */
export const TaskBoardAddColumn: React.FC<{ onAdd: (title: string) => void; variant: "column" | "header" }> = ({
  onAdd,
  variant,
}) => {
  const { text, surface, color, size, columnCornerClass } = useTaskBoard();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const trigger = getSurfaceTriggerTokens(color);
  const close = () => {
    setEditing(false);
    setTitle("");
  };
  const submit = () => {
    const t = title.trim();
    if (t) onAdd(t);
    close();
  };
  return (
    <div
      data-taskboard-add-column
      style={variant === "column" ? { width: Math.round(size.columnWidth * 0.75) } : undefined}
      className={classNames(
        "flex shrink-0 flex-col",
        variant === "column" && classNames("border-2 border-dashed p-2", surface.divider, columnCornerClass),
        variant === "header" && "px-2 py-1.5",
      )}
    >
      {editing ? (
        <input
          // A fresh field opened on purpose — focusing it is the point.
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          aria-label={text("columnName")}
          placeholder={text("columnName")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            } else if (e.key === "Escape") {
              e.preventDefault();
              close();
            }
          }}
          onBlur={submit}
          className={classNames(
            "w-full rounded-md border bg-transparent px-2 py-1.5 text-sm outline-none",
            surface.divider,
            surface.heading,
            trigger.focusRing,
          )}
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className={classNames(
            "flex items-center justify-center gap-1 rounded-md py-1.5 text-sm",
            surface.muted,
            trigger.hover,
            trigger.focusRing,
          )}
        >
          <Add className="h-3.5 w-3.5" aria-hidden="true" />
          {text("addColumn")}
        </button>
      )}
    </div>
  );
};

/**
 * The floating copy of a column during a drag — the whole column (header and
 * cards, drawn at the column's own size), the way the card clone is the whole
 * card. It is a picture, not a column: no data-* hooks, so hit-testing, focus
 * and queries only ever see the real board underneath.
 */
export const TaskBoardColumnClone: React.FC<{
  drag: TaskBoardColumnDragState | null;
  column?: TaskBoardColumn;
  cards: TaskBoardCardModel[];
  count: number;
}> = ({ drag, column, cards, count }) => {
  const { color, surface, size, cardSurface, columnCornerClass, renderCard } = useTaskBoard();
  if (!drag || drag.keyboard || !column || typeof document === "undefined") return null;
  const tone = column.color ?? color;
  return createPortal(
    <div
      data-taskboard-column-clone
      aria-hidden="true"
      className={classNames(
        "pointer-events-none fixed top-0 left-0 z-[1000] flex rotate-1 flex-col overflow-hidden border-t-[3px] bg-neutral-100 shadow-2xl motion-reduce:rotate-0 dark:bg-neutral-800",
        columnCornerClass,
        getTaskBoardColumnTokens(tone).edge,
        getTaskBoardSelectionTokens(tone).clone,
      )}
      style={{
        width: drag.width || undefined,
        height: drag.height || undefined,
        transform: `translate3d(${drag.x - drag.grabOffset.x}px, ${drag.y - drag.grabOffset.y}px, 0)`,
      }}
    >
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <Drag className={classNames("h-3.5 w-3.5 shrink-0", surface.muted)} aria-hidden="true" />
        <span className={classNames("truncate text-sm font-semibold", surface.heading)}>{column.title}</span>
        <span className={classNames("text-xs font-semibold tabular-nums", surface.muted)}>{count}</span>
      </div>
      {!column.collapsed && (
        <div className={classNames("flex min-h-0 flex-col px-2 pb-2", size.gap)}>
          {cards.map((card) => (
            <div
              key={card.id}
              className={classNames(
                "rounded-lg",
                size.cardPad,
                card.tone ? classNames("shadow-sm ring-1", getTaskBoardCardToneTokens(card.tone).solid) : cardSurface,
              )}
            >
              {renderCard ? (
                renderCard(card, { dragging: false, selected: false, pending: false })
              ) : (
                <TaskBoardCardBody card={card} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
};
