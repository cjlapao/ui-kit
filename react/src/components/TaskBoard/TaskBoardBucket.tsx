/**
 * TaskBoardBucket — the card list of one column × lane cell, and the drop
 * target the drag layer resolves against (`data-bucket`). Shared by the
 * columns layout and the swimlane grid.
 */

import React from "react";
import classNames from "classnames";
import { bucketKey, type TaskBoardCard as Card } from "../../../../common/taskboard";
import { TaskBoardCard } from "./TaskBoardCard";
import { useTaskBoard } from "./context";

export interface TaskBoardBucketProps {
  column: string;
  lane: string | null;
  cards: Card[];
  className?: string;
  /** Accessible name for the group, e.g. "Ideas, 4 cards". */
  label?: string;
}

export const TaskBoardBucket: React.FC<TaskBoardBucketProps> = ({ column, lane, cards, className, label }) => {
  const { cardState, cardProps, dropTarget, size, text } = useTaskBoard();
  const key = bucketKey(column, lane);
  // Only a refused target is marked here — an accepted one already shows
  // the card's placeholder sitting in its prospective slot.
  const target = dropTarget && dropTarget.bucket === key ? dropTarget : null;
  return (
    <div
      role="group"
      aria-label={label}
      data-bucket={key}
      data-bucket-column={column}
      data-bucket-lane={lane ?? ""}
      data-drop={target ? (target.valid ? "valid" : "invalid") : undefined}
      title={target && !target.valid ? text("notAllowed") : undefined}
      className={classNames(
        "flex min-h-12 flex-col rounded-lg transition-colors",
        size.gap,
        // The refused tint is painted by the column / lane cell around this list.
        className,
      )}
    >
      {cards.map((card, index) => (
        <TaskBoardCard
          key={card.id}
          card={card}
          column={column}
          lane={lane}
          index={index}
          state={cardState(card)}
          {...cardProps?.(card, { column, lane, index })}
        />
      ))}
    </div>
  );
};
