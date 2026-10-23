/**
 * TaskBoardColumn — one column of the columns layout: a well with a toned
 * top edge, a header (title, count or WIP readout, collapse caret), the
 * scrolling card list and the "+ Add card" footer. Collapsed, it folds to a
 * narrow strip with the rotated title.
 */

import React from "react";
import classNames from "classnames";
import {
  getTaskBoardColumnTokens,
  wipState,
  type TaskBoardCard as Card,
  type TaskBoardColumn as Column,
} from "../../../../common/taskboard";
import { getSurfaceTriggerTokens } from "../../theme/Theme";
import { ScrollArea } from "../ScrollArea";
import { Add } from "../../icons/components/Add";
import { ChevronRight } from "../../icons/components/ChevronRight";
import { TaskBoardBucket } from "./TaskBoardBucket";
import { useTaskBoard } from "./context";
import { usePresence } from "./usePresence";
import { TaskBoardColumnGrip } from "./TaskBoardColumnEdit";
import { TaskBoardColumnEditButton } from "./TaskBoardColumnEditor";

/** Width of a collapsed column strip. */
export const COLLAPSED_WIDTH = 44;

export interface TaskBoardColumnProps {
  column: Column;
  cards: Card[];
  /** Cards in the whole column (all lanes) — what the header counts. */
  count: number;
  /** Position in the row — what the edit-mode grip reports. */
  index?: number;
  onToggle?: () => void;
}

export function columnCountLabel(count: number, limit?: number): string {
  return limit === undefined ? String(count) : `${count} / ${limit}`;
}

export const TaskBoardColumn: React.FC<TaskBoardColumnProps> = ({
  column,
  cards,
  count,
  index = 0,
  onToggle,
}) => {
  const { surface, text, color, size, wellSurface, columnCornerClass, onAddCard, draggingColumnId } = useTaskBoard();
  const dragging = draggingColumnId === column.id;
  const tone = column.color ?? color;
  const tokens = getTaskBoardColumnTokens(tone);
  const wip = wipState(count, column.wipLimit);
  const bodyMounted = usePresence(!column.collapsed);
  // Each layer lingers only while the width animates, so the steady states
  // never carry a hidden duplicate of the title or the caret.
  const stripMounted = usePresence(Boolean(column.collapsed));
  const trigger = getSurfaceTriggerTokens(tone);
  const caret = onToggle && (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={!column.collapsed}
      aria-label={text(column.collapsed ? "expand" : "collapse", {
        name: column.title,
      })}
      className={classNames(
        "rounded p-1",
        surface.muted,
        trigger.hover,
        trigger.focusRing,
      )}
    >
      <ChevronRight
        className={classNames(
          "h-3 w-3 transition-transform motion-reduce:transition-none",
          !column.collapsed && "rotate-90",
        )}
      />
    </button>
  );
  const countChip = (
    <span
      data-column-count
      title={
        column.wipLimit !== undefined
          ? text("wip", { count, limit: column.wipLimit })
          : undefined
      }
      className={classNames(
        "text-xs font-semibold tabular-nums",
        wip === "full" || wip === "over" ? tokens.wipFull : surface.muted,
      )}
    >
      {columnCountLabel(count, column.wipLimit)}
    </span>
  );

  return (
    <div
      data-column-id={column.id}
      data-column-target={column.id}
      data-flip-key={column.id}
      data-column-dragging={dragging || undefined}
      data-collapsed={column.collapsed ? "true" : undefined}
      data-wip={wip}
      data-drop-zone={column.collapsed ? undefined : true}
      // One element for both states, so the width can animate between the
      // strip and the full column. Height comes from the row (stretch).
      style={{ width: column.collapsed ? COLLAPSED_WIDTH : size.columnWidth }}
      className={classNames(
        "relative flex min-h-40 shrink-0 flex-col overflow-hidden border-t-[3px]",
        columnCornerClass,
        "transition-[width] duration-200 ease-out motion-reduce:transition-none",
        tokens.edge,
        wellSurface,
        // Edit-mode drag: the column's slot holds as a dashed placeholder.
        dragging && "opacity-50 outline-2 -outline-offset-2 outline-dashed outline-black/25 dark:outline-white/30",
      )}
    >
      {/* Collapsed strip: caret, count, rotated title. */}
      {stripMounted && (
        <div
          aria-hidden={!column.collapsed}
          inert={!column.collapsed}
          className={classNames(
            "absolute inset-y-0 left-0 flex flex-col items-center gap-3 py-3 transition-opacity duration-200 motion-reduce:transition-none",
            column.collapsed ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          style={{ width: COLLAPSED_WIDTH }}
        >
          <TaskBoardColumnGrip column={column} index={index} />
          <TaskBoardColumnEditButton column={column} />
          {caret}
          {countChip}
          <span
            className={classNames(
              "text-sm font-semibold whitespace-nowrap [writing-mode:vertical-rl]",
              surface.heading,
            )}
          >
            {column.title}
          </span>
        </div>
      )}

      {/* Open body — kept mounted (inert) while the close animation plays. A
          fixed width keeps the cards from reflowing as the column narrows. */}
      {bodyMounted && (
        <div
          data-column-body
          aria-hidden={column.collapsed || undefined}
          inert={column.collapsed}
          style={{ width: size.columnWidth }}
          className={classNames(
            "flex min-h-0 flex-1 flex-col transition-opacity duration-200 motion-reduce:transition-none",
            column.collapsed && "opacity-0",
          )}
        >
          <div className="flex items-center gap-2 px-3 pt-3 pb-2">
            <TaskBoardColumnGrip column={column} index={index} />
            <span
              className={classNames(
                "truncate text-sm font-semibold",
                surface.heading,
              )}
            >
              {column.title}
            </span>
            {countChip}
            <span className="flex-1" />
            <TaskBoardColumnEditButton column={column} />
            {caret}
          </div>
          <ScrollArea
            data-taskboard-scroll
            variant="hover"
            horizontal={false}
            tabIndex={-1}
            className="min-h-0 flex-1"
            contentClassName="px-2 pb-2"
          >
            <TaskBoardBucket
              column={column.id}
              lane={null}
              cards={cards}
              label={`${column.title}, ${text("cardCount", { count: cards.length })}`}
            />
          </ScrollArea>
          {onAddCard && (
            <button
              type="button"
              onClick={() => onAddCard({ column: column.id, lane: null })}
              className={classNames(
                "mx-2 mb-2 flex items-center justify-center gap-1 rounded-lg py-1.5 text-sm",
                surface.muted,
                trigger.hover,
                trigger.focusRing,
              )}
            >
              <Add className="h-3.5 w-3.5" aria-hidden="true" />
              {text("addCard")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
