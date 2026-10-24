/**
 * TaskBoardLaneGrid — the swimlane layout: a sticky row of column headers
 * crossed with one row per lane, each with a sticky label cell (caret, title,
 * count). Every column × lane cell is a bucket and a drop target; lanes
 * collapse independently and cards cross lanes freely.
 */

import React from "react";
import classNames from "classnames";
import {
  bucketKey,
  columnAtMax,
  columnCount,
  effectiveMaxItems,
  laneCount,
  wipState,
  getTaskBoardColumnTokens,
  type TaskBoardCard as Card,
  type TaskBoardColumn as Column,
  type TaskBoardLane as Lane,
} from "../../../../common/taskboard";
import { getSurfaceTriggerTokens } from "../../theme/Theme";
import { ScrollArea } from "../ScrollArea";
import { Add } from "../../icons/components/Add";
import { ChevronRight } from "../../icons/components/ChevronRight";
import { TaskBoardBucket } from "./TaskBoardBucket";
import { COLLAPSED_WIDTH, columnCountLabel } from "./TaskBoardColumn";
import { REFUSED_DROP, useTaskBoard } from "./context";
import { usePresence } from "./usePresence";
import { TaskBoardAddColumn, TaskBoardColumnGrip } from "./TaskBoardColumnEdit";
import { TaskBoardColumnEditButton } from "./TaskBoardColumnEditor";

const LANE_LABEL_WIDTH = 220;

export interface TaskBoardLaneGridProps {
  cards: Card[];
  columns: Column[];
  lanes: Lane[];
  buckets: Map<string, Card[]>;
  onToggleLane?: (id: string) => void;
  onToggleColumn?: (id: string) => void;
  /** Edit mode: an "Add column" header cell after the last column. */
  onAddColumn?: (title: string) => void;
}

/** Width of the edit-mode "Add column" track. */
const ADD_COLUMN_WIDTH = 180;

export const TaskBoardLaneGrid: React.FC<TaskBoardLaneGridProps> = ({
  cards,
  columns,
  lanes,
  buckets,
  onToggleLane,
  onToggleColumn,
  onAddColumn,
}) => {
  const { surface, text, color, size, stickySurface, draggingColumnId, boardMaxItems } = useTaskBoard();
  // Columns at their cap: no Add card in any of their lane cells.
  const fullColumns = new Set(columns.filter((c) => columnAtMax(cards, c, boardMaxItems)).map((c) => c.id));
  const trigger = getSurfaceTriggerTokens(color);
  const template = [
    `${LANE_LABEL_WIDTH}px`,
    ...columns.map((c) => `${c.collapsed ? COLLAPSED_WIDTH : size.columnWidth}px`),
    ...(onAddColumn ? [`${ADD_COLUMN_WIDTH}px`] : []),
  ].join(" ");
  const cellBorder = classNames("border-b border-r", surface.divider);

  const caret = (collapsed: boolean | undefined, name: string, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={!collapsed}
      aria-label={text(collapsed ? "expand" : "collapse", { name })}
      className={classNames("rounded p-1", surface.muted, trigger.hover, trigger.focusRing)}
    >
      <ChevronRight
        className={classNames("h-3 w-3 transition-transform motion-reduce:transition-none", !collapsed && "rotate-90")}
      />
    </button>
  );

  return (
    <ScrollArea data-taskboard-scroll variant="hover" tabIndex={-1} className="min-h-0 flex-1">
      <div
        data-lane-grid
        // Chromium interpolates grid-template-columns, so a column collapsing
        // in the lane view narrows smoothly instead of snapping.
        className="grid w-max transition-[grid-template-columns] duration-200 ease-out motion-reduce:transition-none"
        style={{ gridTemplateColumns: template }}
      >
        {/* Header row — sticky top; the corner cell is sticky on both axes. */}
        <div className={classNames("sticky top-0 left-0 z-30", stickySurface, cellBorder)} />
        {columns.map((col, index) => {
          const count = columnCount(cards, col.id);
          const wip = wipState(count, col.wipLimit);
          return (
            <div
              key={col.id}
              data-lane-column-header={col.id}
              data-column-target={col.id}
              data-flip-key={col.id}
              data-column-dragging={draggingColumnId === col.id || undefined}
              data-wip={wip}
              className={classNames(
                "sticky top-0 z-20 flex items-center gap-2 overflow-hidden px-3 py-2.5",
                stickySurface,
                cellBorder,
                draggingColumnId === col.id && "opacity-50 outline-2 -outline-offset-2 outline-dashed outline-black/25 dark:outline-white/30",
              )}
            >
              <TaskBoardColumnGrip column={col} index={index} />
              {!col.collapsed && (
                <span className={classNames("truncate text-xs font-semibold uppercase tracking-wider", surface.body)}>
                  {col.title}
                </span>
              )}
              <span className="flex-1" />
              <span
                data-column-count
                className={classNames(
                  "rounded-full bg-black/5 px-1.5 text-[11px] font-semibold tabular-nums dark:bg-white/10",
                  wip === "full" || wip === "over" || fullColumns.has(col.id)
                    ? getTaskBoardColumnTokens(col.color ?? color).wipFull
                    : surface.muted,
                )}
              >
                {columnCountLabel(count, col.wipLimit ?? effectiveMaxItems(col, boardMaxItems))}
              </span>
              <TaskBoardColumnEditButton column={col} />
              {onToggleColumn && caret(col.collapsed, col.title, () => onToggleColumn(col.id))}
            </div>
          );
        })}
        {onAddColumn && (
          <div className={classNames("sticky top-0 z-20", stickySurface, cellBorder)}>
            <TaskBoardAddColumn variant="header" onAdd={onAddColumn} />
          </div>
        )}

        {lanes.map((lane) => (
          <TaskBoardLaneRow
            key={lane.id}
            lane={lane}
            count={laneCount(cards, lane.id, lanes)}
            columns={columns}
            buckets={buckets}
            cellBorder={cellBorder}
            trailingCell={Boolean(onAddColumn)}
            fullColumns={fullColumns}
            caret={onToggleLane && caret(lane.collapsed, lane.title, () => onToggleLane(lane.id))}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

interface TaskBoardLaneRowProps {
  lane: Lane;
  count: number;
  columns: Column[];
  buckets: Map<string, Card[]>;
  cellBorder: string;
  caret?: React.ReactNode;
  /** An empty cell under the edit-mode "Add column" track, keeping the grid aligned. */
  trailingCell?: boolean;
  /** Columns at their max items — their cells show no Add card button. */
  fullColumns: Set<string>;
}

/**
 * One lane: a sticky label cell plus a cell per column. Collapsing animates
 * the row height with the grid-rows 1fr → 0fr technique; the buckets stay
 * mounted (inert) until it has played, then unmount.
 */
const TaskBoardLaneRow: React.FC<TaskBoardLaneRowProps> = ({
  lane,
  count,
  columns,
  buckets,
  cellBorder,
  caret,
  trailingCell,
  fullColumns,
}) => {
  const { surface, text, color, stickySurface, onAddCard, dropTarget } = useTaskBoard();
  const refusedBucket = dropTarget && !dropTarget.valid ? dropTarget.bucket : null;
  const trigger = getSurfaceTriggerTokens(color);
  const open = !lane.collapsed;
  const bodyMounted = usePresence(open);
  return (
    <div data-lane-id={lane.id} data-collapsed={lane.collapsed ? "true" : undefined} className="contents">
      <div className={classNames("sticky left-0 z-10 flex items-start gap-2 px-3 py-3", stickySurface, cellBorder)}>
        {caret}
        <span className={classNames("min-w-0 flex-1 truncate pt-0.5 text-sm font-semibold", surface.heading)}>
          {lane.title}
        </span>
        <span
          data-lane-count
          className={classNames(
            "rounded-full bg-black/5 px-1.5 text-[11px] font-semibold tabular-nums dark:bg-white/10",
            surface.muted,
          )}
        >
          {count}
        </span>
      </div>
      {columns.map((col) => (
        <div
          key={col.id}
          data-flip-key={`${col.id}:${lane.id}`}
          data-drop-zone={open && !col.collapsed ? true : undefined}
          data-drop={refusedBucket === bucketKey(col.id, lane.id) ? "invalid" : undefined}
          className={classNames(cellBorder, refusedBucket === bucketKey(col.id, lane.id) && REFUSED_DROP)}
        >
          <div
            data-lane-cell
            className={classNames(
              "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="min-h-0 overflow-hidden" inert={!open} aria-hidden={!open || undefined}>
              {bodyMounted && !col.collapsed && (
                <div className="flex flex-col gap-1 p-2">
                  <TaskBoardBucket
                    column={col.id}
                    lane={lane.id}
                    cards={buckets.get(bucketKey(col.id, lane.id)) ?? []}
                    label={`${col.title}, ${lane.title}`}
                  />
                  {onAddCard && !fullColumns.has(col.id) && (
                    <button
                      type="button"
                      onClick={() => onAddCard({ column: col.id, lane: lane.id })}
                      aria-label={`${text("addCard")} \u2014 ${col.title}, ${lane.title}`}
                      className={classNames(
                        "flex items-center justify-center rounded-md py-1 opacity-60 hover:opacity-100 focus-visible:opacity-100",
                        surface.muted,
                        trigger.hover,
                        trigger.focusRing,
                      )}
                    >
                      <Add className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {trailingCell && <div aria-hidden="true" className={cellBorder} />}
    </div>
  );
};
