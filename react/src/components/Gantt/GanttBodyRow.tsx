/**
 * GanttBodyRow — one row of the Gantt body: the sticky left cells plus the
 * timeline cell with the task bar (or lane band) and its interaction handles.
 */

import React, { useMemo } from "react";
import classNames from "classnames";

import {
  GanttBarGeometry,
  GanttColumn,
  GanttLabels,
  GanttRow,
  GanttTask,
  TrueColor,
  dateToX,
  formatDateTime,
  formatDuration,
  fanHandleOffset,
  getGanttBarTokens,
  getGanttLaneTokens,
  toMs,
} from "../../../../common/gantt";
import { ChevronRight } from "../../icons/components/ChevronRight";
import { Drag } from "../../icons/components/Drag";

const BAR_HEIGHT = 24;
const MILESTONE_SIZE = 14;

interface GanttBodyRowProps {
  row: GanttRow;
  columns: GanttColumn[];
  leftWidth: number;
  timelineWidth: number;
  rangeStart: number;
  zoom: number;
  color: TrueColor;
  interactive: boolean;
  /** Static port slots on this bar's edges (offsets from centre) — the
   *  hover link handles avoid the fan and sit on the largest free slot. */
  fanOut?: number[];
  fanIn?: number[];
  selected: boolean;
  labels: GanttLabels;
  renderCell?: (value: unknown, task: GanttTask, column: GanttColumn) => React.ReactNode;
  renderBar?: (task: GanttTask, geo: GanttBarGeometry) => React.ReactNode;
  drag: { taskId: string; kind: string } | null;
  liveDates: { start: number; end: number } | null;
  /** Live percent complete (0..1) while this row's progress knob is dragged. */
  liveProgress: number | null;
  /** Live lane roll-up (0..1) while one of the lane's children is dragged. */
  liveLane?: number | null;
  /** Live group roll-up (0..1) while one of this row's descendants is dragged. */
  liveRollup?: number | null;
  onBarPointerDown: (task: GanttTask, e: React.PointerEvent) => void;
  onResizePointerDown: (task: GanttTask, edge: "start" | "end", e: React.PointerEvent) => void;
  onGripPointerDown: (rowKey: string, task: GanttTask, e: React.PointerEvent) => void;
  onLinkHandlePointerDown: (task: GanttTask, side: 1 | -1, e: React.PointerEvent, fromOffset?: number) => void;
  onProgressPointerDown: (task: GanttTask, e: React.PointerEvent) => void;
  onCaretClick: (taskId: string, isOpen: boolean) => void;
  onLaneCaretClick: (laneId: string, isOpen: boolean) => void;
  onSelect: (id: string) => void;
  onBarKeyDown: (e: React.KeyboardEvent, task: GanttTask) => void;
  selectionTokens: { ring: string; row: string };
  /**
   * Hairline divider classes (border colour) for row / cell edges — the
   * Gantt passes its Panel surface divider so hairlines follow the variant.
   */
  dividerClass?: string;
}

export const GanttBodyRow: React.FC<GanttBodyRowProps> = ({
  row,
  columns,
  leftWidth,
  timelineWidth,
  rangeStart,
  zoom,
  color,
  interactive,
  fanOut,
  fanIn,
  selected,
  labels,
  renderCell,
  renderBar,
  drag,
  liveDates,
  liveProgress,
  liveLane,
  liveRollup,
  onBarPointerDown,
  onResizePointerDown,
  onGripPointerDown,
  onLinkHandlePointerDown,
  onProgressPointerDown,
  onCaretClick,
  onLaneCaretClick,
  onSelect,
  onBarKeyDown,
  selectionTokens,
  dividerClass = "border-neutral-100 dark:border-neutral-800",
}) => {
  const isDraggingThis = row.task != null && drag?.taskId === row.task.id;
  // While this row's reorder drag is live, the row sits in its previewed
  // slot (fully visible) with an accent cue on the grip and the row itself.
  const reorderDragging = isDraggingThis && drag?.kind === "reorder";

  return (
    <div
      data-row-key={row.key}
      className={classNames(
        // overflow-hidden pins the rendered row to its model height: the
        // flex halves carry `min-height: auto`, so with roomier font metrics
        // (zoom/DPI/fallback fonts) their content can push a row taller than
        // the geometry the bars/links/dividers are laid out from.
        "group/row relative flex overflow-hidden",
        selected && selectionTokens.row,
      )}
      style={{
        height: row.height,
        ...(reorderDragging
          ? {
              background: `color-mix(in srgb, var(--color-${color}-500) 7%, transparent)`,
              boxShadow: `inset 2px 0 0 var(--color-${color}-500)`,
            }
          : {}),
      }}
    >
      {row.task == null ? (
        <LaneHeader
          row={row}
          columns={columns}
          leftWidth={leftWidth}
          color={color}
          onCaretClick={onLaneCaretClick}
          dividerClass={dividerClass}
          liveProgress={liveLane}
        />
      ) : (
        <>
          {/* ── Left cells ─────────────────────────────────────────── */}
          {/* border-r on the sticky edge keeps the fixed/timeline divider
              continuous with the header and lane rows; border-b lives on
              the halves, not the row, so each half is the full row height
              and scrolling links/grid lines can't poke through a 1px gap
              under the sticky block. */}
          <div
            className={classNames(
              "sticky left-0 z-20 flex items-stretch border-r border-b bg-white dark:bg-neutral-900",
              dividerClass,
            )}
            style={{ width: leftWidth }}
          >
            <div className="flex w-9 shrink-0 items-center justify-center">
              {interactive && !row.task.locked && (
                <span
                  className={classNames(
                    "flex cursor-grab touch-none items-center text-neutral-300 transition-opacity active:cursor-grabbing dark:text-neutral-600",
                    reorderDragging ? "opacity-100" : "opacity-0 group-hover/row:opacity-100",
                  )}
                  style={
                    reorderDragging ? { color: `var(--color-${color}-500)` } : undefined
                  }
                  onPointerDown={(e) => onGripPointerDown(row.key, row.task!, e)}
                  title="Drag to reorder"
                  aria-hidden="true"
                >
                  <Drag className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
            {columns.map((col, i) => (
              <Cell
                key={col.key}
                col={col}
                task={row.task!}
                depth={row.depth}
                isGroup={row.isGroup}
                childCount={row.childCount}
                onCaretClick={onCaretClick}
                renderCell={renderCell}
                liveProgress={isDraggingThis ? liveProgress : null}
                liveRollup={row.isGroup ? liveRollup : null}
                rowProgress={row.progress ?? null}
                first={i === 0}
                dividerClass={dividerClass}
              />
            ))}
          </div>

          {/* ── Timeline cell ──────────────────────────────────────── */}
          <div
            className={classNames("relative shrink-0 border-b", dividerClass)}
            style={{ width: timelineWidth }}
          >
            <TaskBar
              task={row.task!}
              row={row}
              rangeStart={rangeStart}
              zoom={zoom}
              color={color}
              interactive={interactive}
              fanOut={fanOut}
              fanIn={fanIn}
              selected={selected}
              labels={labels}
              isDraggingThis={isDraggingThis}
              liveDates={isDraggingThis ? liveDates : null}
              liveProgress={isDraggingThis ? liveProgress : null}
              liveRollup={row.isGroup ? liveRollup : null}
              renderBar={renderBar}
              onBarPointerDown={onBarPointerDown}
              onResizePointerDown={onResizePointerDown}
              onLinkHandlePointerDown={onLinkHandlePointerDown}
              onProgressPointerDown={onProgressPointerDown}
              onSelect={onSelect}
              onBarKeyDown={onBarKeyDown}
              selectionTokens={selectionTokens}
            />
          </div>
        </>
      )}
    </div>
  );
};

GanttBodyRow.displayName = "GanttBodyRow";

// ── Lane header ──────────────────────────────────────────────────────────────

const LaneHeader: React.FC<{
  row: GanttRow;
  columns: GanttColumn[];
  leftWidth: number;
  color: TrueColor;
  onCaretClick: (laneId: string, isOpen: boolean) => void;
  dividerClass?: string;
  /** Live lane roll-up (0..1) while one of the lane's children is dragged. */
  liveProgress?: number | null;
}> = ({ row, columns, leftWidth, color, onCaretClick, dividerClass = "border-neutral-200 dark:border-neutral-800", liveProgress }) => {
  const lane = row.lane!;
  const laneColor = lane.color ?? color;
  const tokens = getGanttLaneTokens(laneColor);
  const isOpen = lane.open !== false;

  return (
    <>
      {/* Left block — zoned to the same column geometry as task rows so the
          lane progress sits in the Progress column. The tint sits on an
          opaque surface (not a translucent background) so the scrolling
          timeline can never show through the fixed lane cells. */}
      <div
        className={classNames(
          "sticky left-0 z-20 flex items-stretch border-r border-b bg-white dark:bg-neutral-900",
          dividerClass,
        )}
        style={{ width: leftWidth }}
      >
        <div className={classNames("pointer-events-none absolute inset-0", tokens.band)} />
        <div className="relative flex w-9 shrink-0 items-center justify-center">
          <button
            type="button"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-neutral-500 hover:bg-white/60 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:text-neutral-400 dark:hover:bg-white/10"
            onClick={() => onCaretClick(lane.id, isOpen)}
            aria-label={`${isOpen ? "Collapse" : "Expand"} ${lane.label}`}
          >
            <ChevronRight className={classNames("h-3 w-3 transition-transform", isOpen && "rotate-90")} />
          </button>
        </div>
        {columns.map((col, i) => (
          <div
            key={col.key}
            className={classNames(
              "relative flex shrink-0 items-center gap-2 overflow-hidden border-r px-2 last:border-r-0",
              dividerClass,
            )}
            style={{ width: col.width ?? "160px" }}
          >
            {i === 0 ? (
              <>
                <span className={classNames("truncate text-[13px] font-semibold", tokens.label)}>{lane.label}</span>
                {lane.description && (
                  <span className="hidden truncate text-[11px] text-neutral-500 dark:text-neutral-400 lg:inline">
                    {lane.description}
                  </span>
                )}
                {row.childCount > 0 && (
                  <span className="shrink-0 rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
                    {row.childCount}
                  </span>
                )}
              </>
            ) : col.key === "progress" ? (
              <ProgressCell value={liveProgress ?? row.progress ?? 0} barClass={tokens.chip} />
            ) : null}
          </div>
        ))}
      </div>
      <div className={classNames("relative min-w-0 flex-1 border-b", dividerClass)}>
        <div className={classNames("absolute inset-0", tokens.band)} />
      </div>
    </>
  );
};

// ── Cell ─────────────────────────────────────────────────────────────────────

const Cell: React.FC<{
  col: GanttColumn;
  task: GanttTask;
  depth: number;
  isGroup: boolean;
  childCount: number;
  first: boolean;
  onCaretClick: (taskId: string, isOpen: boolean) => void;
  renderCell?: (value: unknown, task: GanttTask, column: GanttColumn) => React.ReactNode;
  /** Live percent complete (0..1) while this task's progress knob is dragged. */
  liveProgress?: number | null;
  /** Live group roll-up (0..1) while one of this group's descendants is dragged. */
  liveRollup?: number | null;
  /** Committed roll-up (0..1) for a group row (groups display their children's roll-up, not an own value). */
  rowProgress?: number | null;
  dividerClass?: string;
}> = ({ col, task, depth, isGroup, childCount, first, onCaretClick, renderCell, liveProgress, liveRollup, rowProgress, dividerClass = "border-neutral-100 dark:border-neutral-800" }) => {
  const value =
    col.key === "name"
      ? task.name
      : col.key === "owner"
        ? task.owner
        : col.key === "progress"
          ? isGroup
            ? (liveRollup ?? rowProgress ?? 0)
            : (liveProgress ?? task.progress ?? 0)
          : (task.values?.[col.key] ?? null);

  const custom = col.key !== "name" && renderCell ? renderCell(value, task, col) : null;

  return (
    <div
      className={classNames(
        "flex shrink-0 items-center gap-1.5 overflow-hidden border-r px-2 text-[12.5px] last:border-r-0",
        dividerClass,
      )}
      style={{
        width: col.width ?? "160px",
        justifyContent: col.align === "center" ? "center" : col.align === "right" ? "flex-end" : "flex-start",
      }}
    >
      {first ? (
        <>
          <span className="shrink-0" style={{ width: depth * 14 + 18 }}>
            {isGroup && (
              <button
                type="button"
                className="flex h-4 w-4 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:hover:bg-white/10 dark:hover:text-neutral-300"
                onClick={() => onCaretClick(task.id, task.open !== false)}
                aria-label={`${task.open === false ? "Expand" : "Collapse"} ${task.name}`}
              >
                <ChevronRight className={classNames("h-3 w-3 transition-transform", task.open !== false && "rotate-90")} />
              </button>
            )}
          </span>
          {isGroup && childCount > 0 ? (
            <span className="flex min-w-0 items-center gap-1 font-semibold text-neutral-800 dark:text-neutral-100">
              <span className="truncate">{task.name}</span>
              <span className="shrink-0 rounded-full bg-neutral-100 px-1 text-[10px] font-semibold text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                {childCount}
              </span>
            </span>
          ) : (
            <span className="truncate font-medium text-neutral-700 dark:text-neutral-300">{task.name}</span>
          )}
        </>
      ) : col.kind === "owner" ? (
        value != null ? (
          <span className="flex min-w-0 items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
            <span
              className={classNames(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold uppercase text-white",
                getGanttBarTokens(task.color ?? "blue").fill,
              )}
            >
              {String(value).slice(0, 1)}
            </span>
            <span className="truncate">{String(value)}</span>
          </span>
        ) : (
          <span className="text-neutral-400 dark:text-neutral-600">—</span>
        )
      ) : col.kind === "progress" ? (
        <ProgressCell value={typeof value === "number" ? value : 0} />
      ) : col.kind === "badge" ? (
        task.badge != null ? (
          <span
            className={classNames(
              "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
              getGanttBarTokens(task.badgeColor ?? "neutral").fill,
              "text-white",
            )}
          >
            {task.badge}
          </span>
        ) : (
          <span className="text-neutral-400 dark:text-neutral-600">—</span>
        )
      ) : (
        custom != null ? (
          custom
        ) : (
          <span className="truncate text-neutral-600 dark:text-neutral-400">
            {value == null || value === "" ? "—" : String(value)}
          </span>
        )
      )}
    </div>
  );
};

const ProgressCell: React.FC<{ value: number; barClass?: string }> = ({ value, barClass = "bg-emerald-500" }) => (
  <span className="flex w-full items-center gap-1.5">
    <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-neutral-200/80 dark:bg-white/10">
      <span className={classNames("block h-full rounded-full", barClass)} style={{ width: `${Math.round(value * 100)}%` }} />
    </span>
    <span className="w-7 shrink-0 text-right text-[10px] font-semibold tabular-nums text-neutral-500 dark:text-neutral-400">
      {Math.round(value * 100)}%
    </span>
  </span>
);

// ── Task bar ──────────────────────────────────────────────────────────────────

const TaskBar: React.FC<{
  task: GanttTask;
  row: GanttRow;
  rangeStart: number;
  zoom: number;
  color: TrueColor;
  interactive: boolean;
  fanOut?: number[];
  fanIn?: number[];
  selected: boolean;
  labels: GanttLabels;
  isDraggingThis: boolean;
  liveDates: { start: number; end: number } | null;
  /** Live percent complete (0..1) while this bar's progress knob is dragged. */
  liveProgress?: number | null;
  /** Live group roll-up (0..1) while one of this group's descendants is dragged. */
  liveRollup?: number | null;
  renderBar?: (task: GanttTask, geo: GanttBarGeometry) => React.ReactNode;
  onBarPointerDown: (task: GanttTask, e: React.PointerEvent) => void;
  onResizePointerDown: (task: GanttTask, edge: "start" | "end", e: React.PointerEvent) => void;
  onLinkHandlePointerDown: (task: GanttTask, side: 1 | -1, e: React.PointerEvent, fromOffset?: number) => void;
  onProgressPointerDown: (task: GanttTask, e: React.PointerEvent) => void;
  onSelect: (id: string) => void;
  onBarKeyDown: (e: React.KeyboardEvent, task: GanttTask) => void;
  selectionTokens: { ring: string };
}> = ({
  task,
  row,
  rangeStart,
  zoom,
  color,
  interactive,
  fanOut,
  fanIn,
  selected,
  labels,
  liveDates,
  liveProgress,
  liveRollup,
  renderBar,
  onBarPointerDown,
  onResizePointerDown,
  onLinkHandlePointerDown,
  onProgressPointerDown,
  onSelect,
  onBarKeyDown,
  selectionTokens,
}) => {
  const milestone = task.type === "milestone";
  const barColor = task.color ?? color;
  const tokens = useMemo(() => getGanttBarTokens(barColor), [barColor]);

  const startMs = liveDates ? liveDates.start : toMs(task.start);
  const endMs = liveDates ? liveDates.end : toMs(task.end);
  const left = dateToX(startMs, rangeStart, zoom);
  const width = milestone ? 0 : Math.max(6, dateToX(endMs, rangeStart, zoom) - left);

  const top = (row.height - BAR_HEIGHT) / 2;
  const showName = !milestone && width > 44;
  const canEdit = interactive && !task.locked;
  // Progress: a leaf is its own (draggable) value; a group has no progress of
  // its own — it displays the (read-only) roll-up of its children, re-rolled
  // live while one of them is edited.
  const progress = row.isGroup
    ? (liveRollup ?? row.progress ?? 0)
    : (liveProgress ?? task.progress ?? 0);
  const progressPct = Math.round(progress * 100);
  // The un-done part of the bar is a light tint, so the label reads dark on
  // it (low progress) and white on the dark progress fill (high progress).
  const labelText =
    progress < 0.5 ? "text-neutral-800/80 dark:text-neutral-100/90" : "text-white";
  // Port slot on each edge: the centre of the largest free gap, so a handle
  // never sits on the static fan — and the rubber band departs from the same
  // slot the handle occupies.
  const inSlot = fanHandleOffset(BAR_HEIGHT, fanIn ?? []);
  const outSlot = fanHandleOffset(BAR_HEIGHT, fanOut ?? []);

  const ariaLabel = `${task.name}: ${formatDateTime(startMs)} to ${formatDateTime(endMs)}, ${
    milestone ? "milestone" : `${formatDuration(startMs, endMs)}, ${progressPct}% complete`
  }`;

  if (milestone) {
    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        title={ariaLabel}
        data-gantt-bar={task.id}
        className={classNames(
          "absolute z-10 flex cursor-pointer items-center gap-1.5 outline-none",
          selected && selectionTokens.ring,
          "rounded",
        )}
        style={{ left: left - MILESTONE_SIZE / 2, top: (row.height - MILESTONE_SIZE) / 2, width: MILESTONE_SIZE + 160, height: MILESTONE_SIZE }}
        onPointerDown={(e) => canEdit && onBarPointerDown(task, e)}
        onClick={() => onSelect(task.id)}
        onKeyDown={(e) => onBarKeyDown(e, task)}
      >
        <span className={classNames("h-3.5 w-3.5 shrink-0 rotate-45 rounded-[2px] shadow-sm", tokens.milestone)} />
        <span className="truncate text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">{task.name}</span>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      title={`${task.name} · ${formatDateTime(startMs)} → ${formatDateTime(endMs)} · ${progressPct}%`}
      data-gantt-bar={task.id}
      className={classNames(
        "group/bar absolute z-10 cursor-grab touch-none rounded-md shadow-sm outline-none transition-shadow active:cursor-grabbing",
        tokens.base,
        tokens.rim,
        "border",
        tokens.baseHover,
        selected && selectionTokens.ring,
        "hover:shadow-md",
      )}
      style={{ left, top, width, height: BAR_HEIGHT }}
      onPointerDown={(e) => {
        if (canEdit) onBarPointerDown(task, e);
        else onSelect(task.id);
      }}
      onClick={() => onSelect(task.id)}
      onKeyDown={(e) => onBarKeyDown(e, task)}
    >
      {/* Progress overlay */}
      {progress > 0 && (
        <div
          className={classNames("absolute inset-y-0 left-0 rounded-l-md", tokens.progress)}
          style={{ width: `${progress * 100}%` }}
        />
      )}
      {/* Progress knob (drag to set progress) — groups are read-only roll-ups */}
      {canEdit && !row.isGroup && progress > 0 && progress < 1 && (
        <div
          className={classNames(
            "absolute inset-y-0 z-20 w-2 cursor-ew-resize touch-none opacity-0 transition-opacity group-hover/bar:opacity-100",
            liveProgress != null && "opacity-100",
          )}
          style={{ left: `${progress * 100}%`, marginLeft: -4 }}
          onPointerDown={(e) => onProgressPointerDown(task, e)}
          title={labels.progress}
          aria-hidden="true"
        >
          <div className="mx-auto h-full w-0.5 rounded-full bg-white/90" />
        </div>
      )}
      {/* Live % readout while the knob is dragged */}
      {liveProgress != null && (
        <div
          className="pointer-events-none absolute -top-5 z-30 -translate-x-1/2 rounded-full bg-neutral-900/90 px-1.5 py-px text-[10px] font-semibold tabular-nums text-white shadow-md"
          style={{ left: `${progress * 100}%` }}
        >
          {progressPct}%
        </div>
      )}
      {/* Label */}
      {showName &&
        (renderBar != null ? (
          <div className={classNames("pointer-events-none absolute inset-0 flex items-center px-1.5 text-[11px] font-medium", labelText)}>
            {renderBar(task, { taskId: task.id, left, width, top, height: row.height, milestone: false })}
          </div>
        ) : (
          <span className={classNames("pointer-events-none absolute inset-0 flex items-center truncate px-1.5 text-[11px] font-medium", labelText)}>
            {task.name}
          </span>
        ))}
      {/* Resize handles */}
      {canEdit && (
        <>
          <div
            className="absolute inset-y-0 -left-1 z-20 w-2 cursor-ew-resize touch-none"
            onPointerDown={(e) => onResizePointerDown(task, "start", e)}
            title="Resize start"
            aria-hidden="true"
          >
            <div className="mx-auto h-full w-1 rounded-full bg-white/0 opacity-0 transition-opacity group-hover/bar:opacity-100" />
          </div>
          <div
            className="absolute inset-y-0 -right-1 z-20 w-2 cursor-ew-resize touch-none"
            onPointerDown={(e) => onResizePointerDown(task, "end", e)}
            title="Resize end"
            aria-hidden="true"
          >
            <div className="mx-auto h-full w-1 rounded-full bg-white/0 opacity-0 transition-opacity group-hover/bar:opacity-100" />
          </div>
        </>
      )}
      {/* Link handles (create dependencies) */}
      {canEdit && (
        <>
          <button
            type="button"
            className="absolute -left-1.5 z-30 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-neutral-400 bg-white opacity-0 shadow-sm transition-opacity hover:scale-125 group-hover/bar:opacity-100 focus-visible:opacity-100 dark:border-neutral-300 dark:bg-neutral-800"
            style={{ top: `calc(50% + ${inSlot}px)` }}
            onPointerDown={(e) => onLinkHandlePointerDown(task, -1, e, inSlot)}
            title={labels.link}
            aria-label={`${labels.link} from start of ${task.name}`}
          />
          <button
            type="button"
            className="absolute -right-1.5 z-30 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-neutral-400 bg-white opacity-0 shadow-sm transition-opacity hover:scale-125 group-hover/bar:opacity-100 focus-visible:opacity-100 dark:border-neutral-300 dark:bg-neutral-800"
            style={{ top: `calc(50% + ${outSlot}px)` }}
            onPointerDown={(e) => onLinkHandlePointerDown(task, 1, e, outSlot)}
            title={labels.link}
            aria-label={`${labels.link} from end of ${task.name}`}
          />
        </>
      )}
    </div>
  );
};

