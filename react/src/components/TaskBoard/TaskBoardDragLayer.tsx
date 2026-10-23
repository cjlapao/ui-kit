/**
 * TaskBoardDragLayer — the floating clone that follows the pointer during a
 * local drag. Portaled to the body (a pointer-event drag has no browser drag
 * image), pointer-events off so hit-testing sees the board underneath, and
 * always on an opaque card surface so it reads over any column.
 */

import React from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import {
  getTaskBoardCardToneTokens,
  getTaskBoardSelectionTokens,
  type TaskBoardCard as Card,
} from "../../../../common/taskboard";
import { TaskBoardCardBody } from "./TaskBoardCard";
import { useTaskBoard } from "./context";
import type { TaskBoardDragState } from "./useTaskBoardDrag";

const OPAQUE_CARD = "bg-white shadow-2xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10";

export const TaskBoardDragLayer: React.FC<{ drag: TaskBoardDragState | null; card?: Card }> = ({ drag, card }) => {
  const { renderCard, size, color } = useTaskBoard();
  if (!drag || drag.keyboard || !card || typeof document === "undefined") return null;
  return createPortal(
    <div
      data-taskboard-clone
      aria-hidden="true"
      className={classNames(
        "pointer-events-none fixed top-0 left-0 z-[1000] rotate-1 rounded-lg motion-reduce:rotate-0",
        card.tone ? classNames("shadow-2xl ring-1", getTaskBoardCardToneTokens(card.tone).solid) : OPAQUE_CARD,
        getTaskBoardSelectionTokens(color).clone,
        size.cardPad,
        !drag.valid && drag.to && "cursor-not-allowed opacity-80",
      )}
      style={{
        width: drag.width || undefined,
        transform: `translate3d(${drag.x - drag.grabOffset.x}px, ${drag.y - drag.grabOffset.y}px, 0)`,
      }}
    >
      {renderCard
        ? renderCard(card, { dragging: true, selected: false, pending: false })
        : <TaskBoardCardBody card={card} />}
    </div>,
    document.body,
  );
};
