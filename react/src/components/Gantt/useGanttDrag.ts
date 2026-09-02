/**
 * useGanttDrag — pointer interaction state machine for the Gantt.
 *
 * Kinds:
 *  - `move`         drag the bar body → change start & end (duration kept).
 *  - `resize-start` / `resize-end` drag the bar edge handles.
 *  - `progress`     drag the progress knob → set `task.progress`.
 *  - `link`         drag from an edge handle → rubber-band, drop on a bar to
 *                   create a dependency (FS from the right edge, SF from the
 *                   left).
 *  - `reorder`      drag the row grip → vertical reorder within the lane.
 *
 * All geometry resolves against the overlay ref's rect, which sits at the
 * timeline's origin (left panel excluded, header excluded).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  GanttBarGeometry,
  GanttLink,
  GanttLinkPoint,
  GanttRow,
  GanttSnap,
  GanttTask,
  TrueColor,
} from "../../../../common/gantt";
import {
  applyDragDates,
  applyRowReorder,
  commitDragEdit,
  dateToX,
  linkSourceAnchor,
  progressFromPointer,
  resolveDropBeforeId,
  rubberLinkPath,
  toMs,
} from "../../../../common/gantt";

export interface GanttDragState {
  kind: "move" | "resize-start" | "resize-end" | "link" | "reorder" | "progress";
  taskId: string;
  startX: number; // timeline x at drag start
  startY: number; // row-area y at drag start
  originStart: number; // epoch ms
  originEnd: number; // epoch ms
  x: number; // live timeline x
  y: number; // live row-area y
  /** Link kind only: which edge the rubber band departs from. */
  side?: 1 | -1;
  /** Link kind only: vertical slot (from the handle's `fanHandleOffset`) the
   *  rubber band departs from on the source edge, so the preview starts in
   *  the largest free gap instead of on an existing port. */
  fromOffset?: number;
  /** Link kind only: anchor point (timeline coords). */
  anchor?: { x: number; y: number };
  /** Reorder kind only: resolved drop target. */
  beforeId?: string | null;
  /** Progress kind only: live percent complete (0..1) as the knob drags, so
   *  the bar's progress fill and the % readout follow the pointer in real
   *  time (committed only on drop). */
  liveProgress?: number;
  /** Accent colour for the rubber band (link kind). */
  color?: TrueColor;
}

export interface GanttRubber {
  d: string;
  color: TrueColor;
  /** Arrowhead polygon when the pointer is over a target bar. */
  arrow?: string;
  /** Port anchors (source right edge, and the target left edge / pointer). */
  from: GanttLinkPoint;
  to: GanttLinkPoint;
}

interface UseGanttDragOptions {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  rows: GanttRow[];
  tasksById: Map<string, GanttTask>;
  zoom: number;
  snap: GanttSnap;
  rangeStart: number;
  rowHeight: number;
  leftWidth: number;
  interactive: boolean;
  tasks: GanttTask[];
  links: GanttLink[];
  rowOrder?: string[];
  accentColor: TrueColor;
  onTasksChange?: (tasks: GanttTask[]) => void;
  onLinksChange?: (links: GanttLink[]) => void;
  onReorder?: (order: string[]) => void;
  setSelected: (id: string | null) => void;
}

export interface UseGanttDragApi {
  drag: GanttDragState | null;
  rubber: GanttRubber | null;
  reorderPreviewY: number | null;
  linkSelected: GanttLink | null;
  setLinkSelected: (link: GanttLink | null) => void;
  onBarPointerDown: (task: GanttTask, e: React.PointerEvent) => void;
  onResizePointerDown: (task: GanttTask, edge: "start" | "end", e: React.PointerEvent) => void;
  onGripPointerDown: (rowKey: string, task: GanttTask, e: React.PointerEvent) => void;
  onLinkHandlePointerDown: (task: GanttTask, side: 1 | -1, e: React.PointerEvent, fromOffset?: number) => void;
  onProgressPointerDown: (task: GanttTask, e: React.PointerEvent) => void;
}

export function useGanttDrag(opts: UseGanttDragOptions): UseGanttDragApi {
  const [drag, setDrag] = useState<GanttDragState | null>(null);
  const [linkSelected, setLinkSelected] = useState<GanttLink | null>(null);
  // Latest-value refs so the window listeners never close over stale state.
  const optsRef = useRef(opts);
  optsRef.current = opts;
  const dragRef = useRef<GanttDragState | null>(null);
  dragRef.current = drag;
  const { rows, zoom, rangeStart, accentColor } = opts;

  /** Pixel geometry of a task's bar (timeline-relative), or null. */
  const barGeom = useCallback(
    (taskId: string): GanttBarGeometry | null => {
      const row = rows.find((r) => r.key === `task:${taskId}`);
      if (!row?.task) return null;
      const t = row.task;
      const s = toMs(t.start);
      const e = toMs(t.end);
      const left = dateToX(s, rangeStart, zoom);
      const width = t.type === "milestone" ? 0 : Math.max(6, dateToX(e, rangeStart, zoom) - left);
      return {
        taskId: t.id,
        left,
        width,
        top: row.top,
        height: row.height,
        milestone: t.type === "milestone",
      };
    },
    [rows, zoom, rangeStart],
  );

  /** The bar under the pointer (same hit-test the drop uses), or null. */
  const findTargetBar = useCallback(
    (x: number, y: number, excludeId: string): GanttBarGeometry | null => {
      const row = rows.find((r) => r.task && y >= r.top && y < r.top + r.height);
      if (!row?.task || row.task.id === excludeId) return null;
      const g = barGeom(row.task.id);
      if (!g) return null;
      const hit = x >= g.left - 6 && x <= (g.width === 0 ? g.left + 12 : g.left + g.width + 6);
      return hit ? g : null;
    },
    [rows, barGeom],
  );

  /** Bar geometry for every visible task row (used to keep the rubber band
   *  clear of bars while dragging a dependency). */
  const allBarGeoms = useCallback((): GanttBarGeometry[] => {
    const out: GanttBarGeometry[] = [];
    for (const row of rows) {
      if (!row.task) continue;
      const g = barGeom(row.task.id);
      if (g) out.push(g);
    }
    return out;
  }, [rows, barGeom]);

  const timelineX = useCallback((clientX: number): number => {
    const overlay = optsRef.current.overlayRef.current;
    if (!overlay) return 0;
    return clientX - overlay.getBoundingClientRect().left;
  }, []);
  const rowY = useCallback((clientY: number): number => {
    const overlay = optsRef.current.overlayRef.current;
    if (!overlay) return 0;
    return clientY - overlay.getBoundingClientRect().top;
  }, []);

  // ── Reorder preview Y ──────────────────────────────────────────────────────
  const reorderPreviewY = (state: GanttDragState): number | null => {
    const { rows } = optsRef.current;
    const dragRow = rows.find((r) => r.key === `task:${state.taskId}`);
    if (!dragRow) return null;
    if (state.beforeId != null) {
      const target = rows.find((r) => r.key === `task:${state.beforeId}`);
      return target ? target.top : null;
    }
    // End of the dragged lane's segment: the next foreign lane header below
    // the dragged row, or the bottom of the body.
    const dragLane = dragRow.task?.lane ?? dragRow.lane?.id ?? "";
    for (let i = rows.indexOf(dragRow) + 1; i < rows.length; i++) {
      const r = rows[i];
      const rLane = r.task ? (r.task.lane ?? "") : (r.lane?.id ?? "");
      if (rLane !== dragLane && (r.task == null ? true : i > 0)) {
        // A row whose lane differs ends the segment when it is a header;
        // task rows of another lane also end it (lanes are contiguous).
        if (r.task == null || rLane !== dragLane) return r.top;
      }
    }
    const last = rows[rows.length - 1];
    return last ? last.top + last.height : null;
  };

  // ── Move listener while dragging ───────────────────────────────────────────
  useEffect(() => {
    if (!drag) return;

    const onMove = (e: PointerEvent) => {
      e.preventDefault();
      const o = optsRef.current;
      const state = dragRef.current;
      if (!state) return;
      const x = timelineX(e.clientX);
      const y = rowY(e.clientY);

      if (state.kind === "reorder") {
        const { beforeId } = resolveDropBeforeId(
          o.rows,
          o.tasksById,
          `task:${state.taskId}`,
          y,
        );
        setDrag({ ...state, x, y, beforeId });
        return;
      }
      if (state.kind === "link") {
        setDrag({ ...state, x, y });
        return;
      }
      if (state.kind === "progress") {
        // Live percent: the bar's geometry is fixed during a progress drag
        // (dates don't change), so the pointer maps straight to 0..1.
        const task = o.tasksById.get(state.taskId);
        if (task) {
          const s = toMs(task.start);
          const en = toMs(task.end);
          const barLeft = dateToX(s, o.rangeStart, o.zoom);
          const barWidth = Math.max(6, dateToX(en, o.rangeStart, o.zoom) - barLeft);
          setDrag({ ...state, x, y, liveProgress: progressFromPointer(x, barLeft, barWidth) });
        } else {
          setDrag({ ...state, x, y });
        }
        return;
      }
      setDrag({ ...state, x, y });
    };

    const onUp = (e: PointerEvent) => {
      const o = optsRef.current;
      const state = dragRef.current;
      setDrag(null);
      if (!state) return;
      const x = timelineX(e.clientX);
      const y = rowY(e.clientY);
      const task = o.tasksById.get(state.taskId);
      if (!task) return;

      if (state.kind === "move" || state.kind === "resize-start" || state.kind === "resize-end") {
        if (task.locked || !o.onTasksChange) return;
        const dates = applyDragDates(
          { kind: state.kind, originStart: state.originStart, originEnd: state.originEnd },
          x - state.startX,
          o.zoom,
          o.snap,
        );
        const edited = commitDragEdit(task, dates.start, dates.end);
        if (edited !== task) {
          o.onTasksChange(o.tasks.map((t) => (t.id === task.id ? edited : t)));
        }
        return;
      }

      if (state.kind === "progress") {
        if (task.locked || !o.onTasksChange) return;
        // Progress knob: bar geometry at commit time.
        const s = toMs(task.start);
        const en = toMs(task.end);
        const barLeft = dateToX(s, o.rangeStart, o.zoom);
        const barWidth = Math.max(6, dateToX(en, o.rangeStart, o.zoom) - barLeft);
        const p = progressFromPointer(x, barLeft, barWidth);
        o.onTasksChange(o.tasks.map((t) => (t.id === task.id ? { ...t, progress: p } : t)));
        return;
      }

      if (state.kind === "link") {
        if (!o.onLinksChange) return;
        // Hit-test the bar under the pointer.
        const targetRow = o.rows.find((r) => {
          if (r.task == null) return false;
          return y >= r.top && y < r.top + r.height;
        });
        if (!targetRow?.task || targetRow.task.id === state.taskId) return;
        const s = toMs(targetRow.task.start);
        const en = toMs(targetRow.task.end);
        const tLeft = dateToX(s, o.rangeStart, o.zoom);
        const tWidth =
          targetRow.task.type === "milestone"
            ? 0
            : Math.max(6, dateToX(en, o.rangeStart, o.zoom) - tLeft);
        const hit =
          x >= tLeft - 6 && x <= (tWidth === 0 ? tLeft + 12 : tLeft + tWidth + 6);
        if (!hit) return;
        const type = state.side === -1 ? "sf" : "fs";
        const exists = o.links.some(
          (l) =>
            l.source === state.taskId &&
            l.target === targetRow.task!.id &&
            (l.type ?? "fs") === type,
        );
        if (exists) return;
        o.onLinksChange([
          ...o.links,
          {
            source: state.taskId,
            target: targetRow.task.id,
            type,
            id: `link-${state.taskId}-${targetRow.task.id}-${type}`,
          },
        ]);
        return;
      }

      if (state.kind === "reorder") {
        if (!o.onReorder) return;
        // applyRowReorder is idempotent: a drop that lands where the row
        // already is returns the same order, so emitting it is a harmless
        // no-op rather than a loop.
        const order = applyRowReorder(
          o.tasks,
          state.taskId,
          state.beforeId ?? null,
          o.rowOrder,
        );
        o.onReorder(order);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [drag != null, timelineX, rowY]);

  // ── Start handlers ─────────────────────────────────────────────────────────
  const beginDrag = useCallback(
    (
      partial: Omit<GanttDragState, "x" | "y">,
      e: React.PointerEvent,
      focusEl?: HTMLElement,
    ) => {
      const o = optsRef.current;
      if (!o.interactive) return;
      e.preventDefault();
      const x = timelineX(e.clientX);
      const y = rowY(e.clientY);
      let anchor: { x: number; y: number } | undefined;
      if (partial.kind === "link") {
        const row = o.rows.find((r) => r.key === `task:${partial.taskId}`);
        if (row?.task) {
          const s = toMs(row.task.start);
          const en = toMs(row.task.end);
          const left = dateToX(s, o.rangeStart, o.zoom);
          const width =
            row.task.type === "milestone"
              ? 0
              : Math.max(6, dateToX(en, o.rangeStart, o.zoom) - left);
          anchor = linkSourceAnchor(
            {
              taskId: row.task.id,
              left,
              width,
              top: row.top,
              height: row.height,
              milestone: row.task.type === "milestone",
            },
            x,
          );
        }
      }
      setDrag({ ...partial, x, y, anchor, color: partial.color ?? o.accentColor } as GanttDragState);
      o.setSelected(partial.taskId);
      focusEl?.focus();
    },
    [timelineX, rowY],
  );

  const onBarPointerDown = useCallback(
    (task: GanttTask, e: React.PointerEvent) => {
      if (e.button !== 0) return;
      beginDrag(
        {
          kind: "move",
          taskId: task.id,
          startX: timelineX(e.clientX),
          startY: rowY(e.clientY),
          originStart: new Date(task.start as string | number | Date).getTime(),
          originEnd: new Date(task.end as string | number | Date).getTime(),
        },
        e,
        e.currentTarget as HTMLElement,
      );
    },
    [beginDrag, timelineX, rowY],
  );

  const onResizePointerDown = useCallback(
    (task: GanttTask, edge: "start" | "end", e: React.PointerEvent) => {
      if (e.button !== 0) return;
      // Keep the event from bubbling to the bar body (which would start a move).
      e.stopPropagation();
      beginDrag(
        {
          kind: edge === "start" ? "resize-start" : "resize-end",
          taskId: task.id,
          startX: timelineX(e.clientX),
          startY: rowY(e.clientY),
          originStart: new Date(task.start as string | number | Date).getTime(),
          originEnd: new Date(task.end as string | number | Date).getTime(),
        },
        e,
        e.currentTarget as HTMLElement,
      );
    },
    [beginDrag, timelineX, rowY],
  );

  const onGripPointerDown = useCallback(
    (_rowKey: string, task: GanttTask, e: React.PointerEvent) => {
      if (e.button !== 0) return;
      beginDrag(
        {
          kind: "reorder",
          taskId: task.id,
          startX: timelineX(e.clientX),
          startY: rowY(e.clientY),
          originStart: 0,
          originEnd: 0,
          beforeId: null,
        },
        e,
      );
    },
    [beginDrag, timelineX, rowY],
  );

  const onLinkHandlePointerDown = useCallback(
    (task: GanttTask, side: 1 | -1, e: React.PointerEvent, fromOffset = 0) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      beginDrag(
        {
          kind: "link",
          taskId: task.id,
          startX: timelineX(e.clientX),
          startY: rowY(e.clientY),
          originStart: 0,
          originEnd: 0,
          side,
          fromOffset,
        },
        e,
      );
    },
    [beginDrag, timelineX, rowY],
  );

  const onProgressPointerDown = useCallback(
    (task: GanttTask, e: React.PointerEvent) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      beginDrag(
        {
          kind: "progress",
          taskId: task.id,
          startX: timelineX(e.clientX),
          startY: rowY(e.clientY),
          originStart: 0,
          originEnd: 0,
        },
        e,
      );
    },
    [beginDrag, timelineX, rowY],
  );

  // ── Rubber band for link drags ─────────────────────────────────────────────
  // The preview is the exact committed-connector path when the pointer is over
  // a target bar (best-path, collision-free right→left), so it never crosses a
  // bar; otherwise it dangles to the pointer, still routed clear of the source.
  const rubber = useMemo<GanttRubber | null>(() => {
    if (!drag || drag.kind !== "link") return null;
    const source = barGeom(drag.taskId);
    if (!source) return null;
    const target = findTargetBar(drag.x, drag.y, drag.taskId);
    const obstacles = allBarGeoms().filter(
      (g) => g.taskId !== drag.taskId && g.taskId !== target?.taskId,
    );
    const { d, arrow, from, to } = rubberLinkPath(
      source,
      drag.x,
      drag.y,
      target ?? undefined,
      obstacles,
      drag.fromOffset ?? 0,
    );
    return { d, arrow, from, to, color: drag.color ?? accentColor };
  }, [drag, barGeom, findTargetBar, allBarGeoms, accentColor]);

  return {
    drag,
    rubber,
    reorderPreviewY: drag?.kind === "reorder" ? reorderPreviewY(drag) : null,
    linkSelected,
    setLinkSelected,
    onBarPointerDown,
    onResizePointerDown,
    onGripPointerDown,
    onLinkHandlePointerDown,
    onProgressPointerDown,
  };
}
