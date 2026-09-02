/**
 * useGanttDrag — pointer interaction state machine for the Gantt (Vue port).
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
 *
 * The options are passed as refs/computeds so the window listeners always read
 * the latest values (the Vue equivalent of React's "optsRef reassigned every
 * render").
 */

import { computed, onBeforeUnmount, ref, watch, type ComputedRef, type Ref } from "vue";
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
  scrollRef: Ref<HTMLElement | null>;
  overlayRef: Ref<HTMLElement | null>;
  rows: ComputedRef<GanttRow[]>;
  tasksById: ComputedRef<Map<string, GanttTask>>;
  zoom: ComputedRef<number>;
  snap: Ref<GanttSnap>;
  rangeStart: ComputedRef<number>;
  rowHeight: ComputedRef<number>;
  leftWidth: ComputedRef<number>;
  interactive: ComputedRef<boolean>;
  tasks: ComputedRef<GanttTask[]>;
  links: ComputedRef<GanttLink[]>;
  rowOrder: ComputedRef<string[] | undefined>;
  accentColor: ComputedRef<TrueColor>;
  onTasksChange?: (tasks: GanttTask[]) => void;
  onLinksChange?: (links: GanttLink[]) => void;
  onReorder?: (order: string[]) => void;
  setSelected: (id: string | null) => void;
}

export interface UseGanttDragApi {
  drag: Ref<GanttDragState | null>;
  rubber: ComputedRef<GanttRubber | null>;
  reorderPreviewY: ComputedRef<number | null>;
  linkSelected: Ref<GanttLink | null>;
  setLinkSelected: (link: GanttLink | null) => void;
  onBarPointerDown: (task: GanttTask, e: PointerEvent) => void;
  onResizePointerDown: (task: GanttTask, edge: "start" | "end", e: PointerEvent) => void;
  onGripPointerDown: (rowKey: string, task: GanttTask, e: PointerEvent) => void;
  onLinkHandlePointerDown: (task: GanttTask, side: 1 | -1, e: PointerEvent, fromOffset?: number) => void;
  onProgressPointerDown: (task: GanttTask, e: PointerEvent) => void;
}

export function useGanttDrag(opts: UseGanttDragOptions): UseGanttDragApi {
  const drag = ref<GanttDragState | null>(null);
  const linkSelected = ref<GanttLink | null>(null);
  const setLinkSelected = (link: GanttLink | null) => {
    linkSelected.value = link;
  };

  const timelineX = (clientX: number): number => {
    const overlay = opts.overlayRef.value;
    if (!overlay) return 0;
    return clientX - overlay.getBoundingClientRect().left;
  };
  const rowY = (clientY: number): number => {
    const overlay = opts.overlayRef.value;
    if (!overlay) return 0;
    return clientY - overlay.getBoundingClientRect().top;
  };

  // ── Reorder preview Y ──────────────────────────────────────────────────────
  const reorderPreviewYOf = (state: GanttDragState): number | null => {
    const rows = opts.rows.value;
    const dragRow = rows.find((r) => r.key === `task:${state.taskId}`);
    if (!dragRow) return null;
    if (state.beforeId != null) {
      const target = rows.find((r) => r.key === `task:${state.beforeId}`);
      return target ? target.top : null;
    }
    const dragLane = dragRow.task?.lane ?? dragRow.lane?.id ?? "";
    for (let i = rows.indexOf(dragRow) + 1; i < rows.length; i++) {
      const r = rows[i];
      const rLane = r.task ? (r.task.lane ?? "") : (r.lane?.id ?? "");
      if (r.task == null || rLane !== dragLane) return r.top;
    }
    const last = rows[rows.length - 1];
    return last ? last.top + last.height : null;
  };

  // ── Move listener while dragging ───────────────────────────────────────────
  const onMove = (e: PointerEvent) => {
    e.preventDefault();
    const state = drag.value;
    if (!state) return;
    const x = timelineX(e.clientX);
    const y = rowY(e.clientY);

    if (state.kind === "reorder") {
      const { beforeId } = resolveDropBeforeId(
        opts.rows.value,
        opts.tasksById.value,
        `task:${state.taskId}`,
        y,
      );
      drag.value = { ...state, x, y, beforeId };
      return;
    }
    drag.value = { ...state, x, y };
  };

  const onUp = (e: PointerEvent) => {
    const state = drag.value;
    drag.value = null;
    if (!state) return;
    const x = timelineX(e.clientX);
    const y = rowY(e.clientY);
    const task = opts.tasksById.value.get(state.taskId);
    if (!task) return;

    if (state.kind === "move" || state.kind === "resize-start" || state.kind === "resize-end") {
      if (task.locked || !opts.onTasksChange) return;
      const dates = applyDragDates(
        { kind: state.kind, originStart: state.originStart, originEnd: state.originEnd },
        x - state.startX,
        opts.zoom.value,
        opts.snap.value,
      );
      const edited = commitDragEdit(task, dates.start, dates.end);
      if (edited !== task) {
        opts.onTasksChange(opts.tasks.value.map((t) => (t.id === task.id ? edited : t)));
      }
      return;
    }

    if (state.kind === "progress") {
      if (task.locked || !opts.onTasksChange) return;
      const s = toMs(task.start);
      const en = toMs(task.end);
      const barLeft = dateToX(s, opts.rangeStart.value, opts.zoom.value);
      const barWidth = Math.max(6, dateToX(en, opts.rangeStart.value, opts.zoom.value) - barLeft);
      const p = progressFromPointer(x, barLeft, barWidth);
      opts.onTasksChange(
        opts.tasks.value.map((t) => (t.id === task.id ? { ...t, progress: p } : t)),
      );
      return;
    }

    if (state.kind === "link") {
      if (!opts.onLinksChange) return;
      const targetRow = opts.rows.value.find((r) => {
        if (r.task == null) return false;
        return y >= r.top && y < r.top + r.height;
      });
      if (!targetRow?.task || targetRow.task.id === state.taskId) return;
      const s = toMs(targetRow.task.start);
      const en = toMs(targetRow.task.end);
      const tLeft = dateToX(s, opts.rangeStart.value, opts.zoom.value);
      const tWidth =
        targetRow.task.type === "milestone"
          ? 0
          : Math.max(6, dateToX(en, opts.rangeStart.value, opts.zoom.value) - tLeft);
      const hit = x >= tLeft - 6 && x <= (tWidth === 0 ? tLeft + 12 : tLeft + tWidth + 6);
      if (!hit) return;
      const type = state.side === -1 ? "sf" : "fs";
      const exists = opts.links.value.some(
        (l) =>
          l.source === state.taskId &&
          l.target === targetRow.task!.id &&
          (l.type ?? "fs") === type,
      );
      if (exists) return;
      opts.onLinksChange([
        ...opts.links.value,
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
      if (!opts.onReorder) return;
      const order = applyRowReorder(
        opts.tasks.value,
        state.taskId,
        state.beforeId ?? null,
        opts.rowOrder.value,
      );
      opts.onReorder(order);
    }
  };

  const removeListeners = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };

  watch(
    () => drag.value,
    (val) => {
      if (!val) return;
      window.addEventListener("pointermove", onMove, { passive: false });
      window.addEventListener("pointerup", onUp, { once: true });
      return removeListeners;
    },
  );
  onBeforeUnmount(removeListeners);

  // ── Start handlers ─────────────────────────────────────────────────────────
  const beginDrag = (
    partial: Omit<GanttDragState, "x" | "y">,
    e: PointerEvent,
    focusEl?: HTMLElement,
  ) => {
    if (!opts.interactive.value) return;
    e.preventDefault();
    const x = timelineX(e.clientX);
    const y = rowY(e.clientY);
    let anchor: { x: number; y: number } | undefined;
    if (partial.kind === "link") {
      const row = opts.rows.value.find((r) => r.key === `task:${partial.taskId}`);
      if (row?.task) {
        const s = toMs(row.task.start);
        const en = toMs(row.task.end);
        const left = dateToX(s, opts.rangeStart.value, opts.zoom.value);
        const width =
          row.task.type === "milestone"
            ? 0
            : Math.max(6, dateToX(en, opts.rangeStart.value, opts.zoom.value) - left);
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
    drag.value = { ...partial, x, y, anchor, color: partial.color ?? opts.accentColor.value };
    opts.setSelected(partial.taskId);
    focusEl?.focus();
  };

  const onBarPointerDown = (task: GanttTask, e: PointerEvent) => {
    if (e.button !== 0) return;
    beginDrag(
      {
        kind: "move",
        taskId: task.id,
        startX: timelineX(e.clientX),
        startY: rowY(e.clientY),
        originStart: toMs(task.start),
        originEnd: toMs(task.end),
      },
      e,
      e.currentTarget as HTMLElement,
    );
  };

  const onResizePointerDown = (task: GanttTask, edge: "start" | "end", e: PointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    beginDrag(
      {
        kind: edge === "start" ? "resize-start" : "resize-end",
        taskId: task.id,
        startX: timelineX(e.clientX),
        startY: rowY(e.clientY),
        originStart: toMs(task.start),
        originEnd: toMs(task.end),
      },
      e,
      e.currentTarget as HTMLElement,
    );
  };

  const onGripPointerDown = (_rowKey: string, task: GanttTask, e: PointerEvent) => {
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
  };

  const onLinkHandlePointerDown = (task: GanttTask, side: 1 | -1, e: PointerEvent, fromOffset = 0) => {
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
  };

  const onProgressPointerDown = (task: GanttTask, e: PointerEvent) => {
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
  };

  /** Pixel geometry of a task's bar (timeline-relative), or null. */
  const barGeom = (taskId: string): GanttBarGeometry | null => {
    const row = opts.rows.value.find((r) => r.key === `task:${taskId}`);
    if (!row?.task) return null;
    const t = row.task;
    const s = toMs(t.start);
    const e = toMs(t.end);
    const left = dateToX(s, opts.rangeStart.value, opts.zoom.value);
    const width = t.type === "milestone" ? 0 : Math.max(6, dateToX(e, opts.rangeStart.value, opts.zoom.value) - left);
    return {
      taskId: t.id,
      left,
      width,
      top: row.top,
      height: row.height,
      milestone: t.type === "milestone",
    };
  };

  /** The bar under the pointer (same hit-test the drop uses), or null. */
  const findTargetBar = (x: number, y: number, excludeId: string): GanttBarGeometry | null => {
    const row = opts.rows.value.find((r) => r.task && y >= r.top && y < r.top + r.height);
    if (!row?.task || row.task.id === excludeId) return null;
    const g = barGeom(row.task.id);
    if (!g) return null;
    const hit = x >= g.left - 6 && x <= (g.width === 0 ? g.left + 12 : g.left + g.width + 6);
    return hit ? g : null;
  };

  /** Bar geometry for every visible task row (keeps the rubber band clear of
   *  bars while dragging a dependency). */
  const allBarGeoms = (): GanttBarGeometry[] => {
    const out: GanttBarGeometry[] = [];
    for (const row of opts.rows.value) {
      if (!row.task) continue;
      const g = barGeom(row.task.id);
      if (g) out.push(g);
    }
    return out;
  };

  // ── Rubber band for link drags ─────────────────────────────────────────────
  // The preview is the exact committed-connector path when the pointer is over
  // a target bar (best-path, collision-free right→left), so it never crosses a
  // bar; otherwise it dangles to the pointer, still routed clear of every bar.
  const rubber = computed<GanttRubber | null>(() => {
    const d = drag.value;
    if (!d || d.kind !== "link") return null;
    const source = barGeom(d.taskId);
    if (!source) return null;
    const target = findTargetBar(d.x, d.y, d.taskId);
    const obstacles = allBarGeoms().filter(
      (g) => g.taskId !== d.taskId && g.taskId !== target?.taskId,
    );
    const { d: path, arrow, from, to } = rubberLinkPath(source, d.x, d.y, target ?? undefined, obstacles, d.fromOffset ?? 0);
    return { d: path, arrow, from, to, color: d.color ?? opts.accentColor.value };
  });

  const reorderPreviewY = computed<number | null>(() =>
    drag.value?.kind === "reorder" ? reorderPreviewYOf(drag.value) : null,
  );

  return {
    drag,
    rubber,
    reorderPreviewY,
    linkSelected,
    setLinkSelected,
    onBarPointerDown,
    onResizePointerDown,
    onGripPointerDown,
    onLinkHandlePointerDown,
    onProgressPointerDown,
  };
}
