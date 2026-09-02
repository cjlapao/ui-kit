/**
 * Gantt — a feature-rich, editable timeline chart.
 *
 * Built on the framework-agnostic engine in `common/gantt`: drag to move or
 * resize tasks, drag the row grip to reorder within a lane, drag from a bar
 * edge handle to create a dependency, collapse lanes and group rows,
 * wheel-zoom (⌘/Ctrl + trackpad pinch) or use the zoom toolbar, per-task /
 * per-lane / per-column TrueColor theming.
 *
 * The component is fully controlled: `tasks` / `links` / `rowOrder` in,
 * `onTasksChange` / `onLinksChange` / `onReorder` out. `editable` is derived
 * from the presence of those callbacks unless set explicitly.
 *
 * Usage:
 * ```tsx
 * <Gantt
 *   tasks={tasks}
 *   links={links}
 *   lanes={lanes}
 *   onTasksChange={setTasks}
 *   onLinksChange={setLinks}
 *   onReorder={setOrder}
 *   color="blue"
 * />
 * ```
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import classNames from "classnames";

import {
  GANTT_MAX_ZOOM,
  GANTT_MIN_ZOOM,
  GANTT_ZOOM_PRESETS,
  DEFAULT_GANTT_LABELS,
  DEFAULT_ROW_HEIGHT,
  GanttBarGeometry,
  GanttColumn,
  GanttDate,
  GanttLabels,
  GanttLane,
  GanttLink,
  GanttSnap,
  GanttTask,
  TrueColor,
  applyDragDates,
  buildRows,
  buildTimeScale,
  commitDragEdit,
  computeLinkFanOffsets,
  computeLinkPaths,
  computeViewRange,
  dateToX,
  getGanttSelectionTokens,
  getGanttTodayTokens,
  LINK_RIGHT_GUTTER,
  rangeWidth,
  toMs,
  MS_PER_DAY,
} from "../../../../common/gantt";
import { getSurfaceTextTokens, getSurfaceVariantClasses } from "../../theme/Theme";
import Panel, { type PanelVariant } from "../Panel";
import { GanttScale } from "./GanttScale";
import { GanttLinkLayer } from "./GanttLinkLayer";
import { GanttBodyRow } from "./GanttBodyRow";
import { GanttToolbar } from "./GanttToolbar";
import { useGanttDrag } from "./useGanttDrag";

export type { GanttTask, GanttLink, GanttLane, GanttColumn, GanttSnap, GanttLabels, TrueColor };
/** The Panel surface variant driving the Gantt chrome (re-exported name). */
export type GanttVariant = PanelVariant;

const HEADER_HEIGHT = 52;
/** Grip/caret column width (w-9) — part of the left block, so `leftWidth`
 *  includes it: the left block, the grid lines and the scale window all
 *  start at `leftWidth`, and the columns never overflow into the timeline. */
const GRIP_WIDTH = 36;
const DEFAULT_COLUMNS: GanttColumn[] = [
  { key: "name", title: "Task", width: "220px", kind: "text" },
  { key: "owner", title: "Owner", width: "120px", kind: "owner" },
  { key: "progress", title: "Progress", width: "110px", kind: "progress" },
];

export interface GanttProps {
  /** The task list (controlled). Parents/children via `task.parent`. */
  tasks: GanttTask[];
  /** Dependencies (controlled). Omit for a bar-only chart. */
  links?: GanttLink[];
  /** Swimlanes / group bands. Tasks are assigned via `task.lane`. */
  lanes?: GanttLane[];
  /** Left-panel columns. Defaults to name / owner / progress. */
  columns?: GanttColumn[];
  /**
   * Chart header content. The header strip (above the column header) is
   * always rendered — it carries the zoom selector at the right edge (after
   * `actions`) — and these parts render when provided.
   */
  icon?: ReactNode;
  /** Small uppercase eyebrow rendered above the `title`. */
  subtitle?: string;
  /** Large title line. */
  title?: string;
  /** Right-aligned actions region (e.g. a status pill). */
  actions?: ReactNode;
  /**
   * Enable pointer editing (move / resize / reorder / link). Defaults to
   * `true` when any of `onTasksChange`, `onLinksChange`, `onReorder` is
   * provided, or when the prop is set explicitly.
   */
  editable?: boolean;
  onTasksChange?: (tasks: GanttTask[]) => void;
  onLinksChange?: (links: GanttLink[]) => void;
  /** Emitted with the new per-lane top-level id order after a reorder drop. */
  onReorder?: (order: string[]) => void;
  /** Explicit per-lane top-level order (controlled). */
  rowOrder?: string[];
  /** Controlled selection. When omitted the selection is internal. */
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  /** px per day. Controlled when provided with `onZoomChange`. */
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  /** Initial px per day when uncontrolled. Defaults to 16 (week). */
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  /** Snap for drag edits. Defaults to `"day"`. */
  snap?: GanttSnap;
  /** Draw the today marker line. Defaults to `true`. */
  showToday?: boolean;
  /** Override the today date (demo/tests). */
  today?: GanttDate;
  /** Row height in px. Defaults to 44. */
  rowHeight?: number;
  /** Total component height (px or CSS length). Defaults to 520. */
  height?: number | string;
  /** Accent colour for chrome (today marker, selection, default bars). */
  color?: TrueColor;
  /**
   * Panel surface variant for the whole Gantt chrome — container fill,
   * border, header and toolbar. Propagated to the controls and the hairline
   * dividers through the shared surface tokens.
   * @default "elevated"
   */
  variant?: GanttVariant;
  /** Show a loading skeleton. */
  loading?: boolean;
  /** Replace the built-in empty message. */
  emptyState?: React.ReactNode;
  /** Copy overrides. */
  labels?: Partial<GanttLabels>;
  /** Custom bar content; receives the task and its live geometry. */
  renderBar?: (task: GanttTask, geo: GanttBarGeometry) => React.ReactNode;
  /** Custom cell content for user columns (`renderCell(value, task, column)`). */
  renderCell?: (value: unknown, task: GanttTask, column: GanttColumn) => React.ReactNode;
}

/** Merge user copy with the defaults. */
export function mergeGanttLabels(overrides?: Partial<GanttLabels>): GanttLabels {
  return { ...DEFAULT_GANTT_LABELS, ...overrides };
}

export const Gantt: React.FC<GanttProps> = ({
  tasks,
  links = [],
  lanes,
  columns,
  icon,
  subtitle,
  title,
  actions,
  editable,
  onTasksChange,
  onLinksChange,
  onReorder,
  rowOrder: rowOrderProp,
  selectedId: selectedIdProp,
  onSelect,
  zoom: zoomProp,
  onZoomChange,
  initialZoom = 16,
  minZoom = GANTT_MIN_ZOOM,
  maxZoom = GANTT_MAX_ZOOM,
  snap = "day",
  showToday = true,
  today,
  rowHeight = DEFAULT_ROW_HEIGHT,
  height = 520,
  color = "blue",
  variant = "elevated",
  loading = false,
  emptyState,
  labels,
  renderBar,
  renderCell,
}) => {
  const resolvedColumns = columns ?? DEFAULT_COLUMNS;
  // `false` counts as absent (React idiom — and Vue boolean-casts
  // VNode-typed props to `false` when they are not passed).
  const hasNode = (v: unknown) => v != null && v !== false;
  const allLabels = useMemo(() => mergeGanttLabels(labels), [labels]);
  const interactive =
    editable ?? Boolean(onTasksChange || onLinksChange || onReorder);

  // Surface chrome derived from the variant — one source for the container,
  // header and hairline dividers, so the whole chart follows the Panel's
  // surface language (solid vs translucent ink included).
  const surfaceText = useMemo(() => getSurfaceTextTokens(variant), [variant]);

  // ── Zoom (controlled or internal) ─────────────────────────────────────────
  const [internalZoom, setInternalZoom] = useState(initialZoom);
  const zoom = zoomProp ?? internalZoom;
  const setZoom = useCallback(
    (z: number) => {
      const clamped = Math.min(maxZoom, Math.max(minZoom, z));
      if (onZoomChange) onZoomChange(clamped);
      else setInternalZoom(clamped);
    },
    [minZoom, maxZoom, onZoomChange],
  );

  // ── Selection (controlled or internal) ────────────────────────────────────
  const [internalSelection, setInternalSelection] = useState<string | null>(null);
  const selectedId =
    selectedIdProp !== undefined ? selectedIdProp : internalSelection;
  const setSelected = useCallback(
    (id: string | null) => {
      onSelect?.(id);
      if (selectedIdProp === undefined) setInternalSelection(id);
    },
    [onSelect, selectedIdProp],
  );

  // ── Row order (controlled or internal) ────────────────────────────────────
  const [internalOrder, setInternalOrder] = useState<string[] | undefined>(undefined);
  const rowOrder = rowOrderProp ?? internalOrder;

  // Reorder commit: notify the parent and, when uncontrolled, apply the new
  // order internally so the rows reflow immediately.
  const handleReorder = useCallback(
    (order: string[]) => {
      onReorder?.(order);
      if (rowOrderProp === undefined) setInternalOrder(order);
    },
    [onReorder, rowOrderProp],
  );

  // ── Collapse state (internal; seeds from `task.open === false`) ───────────
  const [collapsed, setCollapsed] = useState<Set<string>>(
    () => new Set(tasks.filter((t) => t.open === false).map((t) => t.id)),
  );
  const [closedLanes, setClosedLanes] = useState<Set<string>>(
    () => new Set((lanes ?? []).filter((l) => l.open === false).map((l) => l.id)),
  );

  // Reseed when the data array identity changes (a new dataset).
  const tasksRef = useRef(tasks);
  const lanesRef = useRef(lanes);
  useEffect(() => {
    if (tasksRef.current !== tasks) {
      tasksRef.current = tasks;
      setCollapsed(new Set(tasks.filter((t) => t.open === false).map((t) => t.id)));
    }
    if (lanesRef.current !== lanes) {
      lanesRef.current = lanes;
      setClosedLanes(new Set((lanes ?? []).filter((l) => l.open === false).map((l) => l.id)));
    }
  }, [tasks, lanes]);

  // The sets hold the *collapsed* ids. Clicking an open row adds it; clicking
  // a collapsed row removes it.
  const toggleCollapse = useCallback((taskId: string, isOpen: boolean) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (isOpen) next.add(taskId);
      else next.delete(taskId);
      return next;
    });
  }, []);
  const toggleLane = useCallback((laneId: string, isOpen: boolean) => {
    setClosedLanes((prev) => {
      const next = new Set(prev);
      if (isOpen) next.add(laneId);
      else next.delete(laneId);
      return next;
    });
  }, []);

  // Effective task list with overrides applied (collapse + drag previews).
  const effectiveTasks = useMemo(() => {
    let out = tasks;
    if (collapsed.size > 0) {
      out = out.map((t) => (collapsed.has(t.id) ? { ...t, open: false } : t));
    }
    return out;
  }, [tasks, collapsed]);

  const effectiveLanes = useMemo(() => {
    if (closedLanes.size === 0) return lanes;
    return (lanes ?? []).map((l) =>
      closedLanes.has(l.id) ? { ...l, open: false } : l,
    );
  }, [lanes, closedLanes]);

  // ── Derived model ──────────────────────────────────────────────────────────
  const model = useMemo(
    () => buildRows(effectiveTasks, effectiveLanes, rowOrder, rowHeight),
    [effectiveTasks, effectiveLanes, rowOrder, rowHeight],
  );

  const range = useMemo(() => {
    const starts = tasks.map((t) => toMs(t.start));
    const ends = tasks.map((t) => toMs(t.end));
    return computeViewRange(starts, ends);
  }, [tasks]);

  const timelineWidth = rangeWidth(range.start, range.end, zoom);
  const scaleLevels = useMemo(
    () => buildTimeScale(range.start, range.end, zoom),
    [range, zoom],
  );

  const leftWidth = useMemo(
    () =>
      GRIP_WIDTH +
      resolvedColumns.reduce((sum, c) => {
        const m = /^(\d+(?:\.\d+)?)px$/.exec(c.width ?? "");
        return sum + (m ? Number(m[1]) : 160);
      }, 0),
    [resolvedColumns],
  );

  // Bar geometry for every visible task row (link layer + drag math).
  const bars = useMemo(() => {
    const map = new Map<string, GanttBarGeometry>();
    for (const row of model.rows) {
      if (!row.task) continue;
      const t = row.task;
      const s = toMs(t.start);
      const e = toMs(t.end);
      const milestone = t.type === "milestone";
      const left = dateToX(s, range.start, zoom);
      const width = milestone ? 0 : Math.max(6, dateToX(e, range.start, zoom) - left);
      map.set(t.id, {
        taskId: t.id,
        left,
        width,
        top: row.top,
        height: row.height,
        milestone,
      });
    }
    return map;
  }, [model.rows, range, zoom]);

  const bodyHeight = model.rows.length > 0 ? model.rows[model.rows.length - 1].top + model.rows[model.rows.length - 1].height : 0;

  // ── Scrolling / zoom anchoring ─────────────────────────────────────────────
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  // The detached header's scale content — it must track the body scroller's
  // horizontal position so the header stays aligned with the grid. We use a
  // transform instead of copying `scrollLeft`: the body's scroll range can be
  // wider than the header window (the link layer's right-outside detours push
  // the body's scrollWidth past the timeline), so a clamped scrollLeft would
  // desync, while a translate tracks the body 1:1 at every position.
  const headerScaleRef = useRef<HTMLDivElement | null>(null);

  const syncHeaderScale = useCallback(() => {
    const s = scrollRef.current;
    const h = headerScaleRef.current;
    if (s && h) h.style.transform = `translateX(${-s.scrollLeft}px)`;
  }, []);

  // Zoom keeps the date under the pointer stationary. The view range is
  // zoom-independent, so timeline coordinates scale uniformly by `k` and:
  //   newScrollLeft = tl·k + leftWidth − (pointer x on screen)
  const zoomBy = useCallback(
    (factor: number, pointerClientX?: number) => {
      const el = scrollRef.current;
      const next = Math.min(maxZoom, Math.max(minZoom, zoom * factor));
      const k = next / zoom;
      if (el && pointerClientX != null) {
        const rect = el.getBoundingClientRect();
        const screenX = pointerClientX - rect.left;
        // Pointer x in content space at the current zoom.
        const contentX = screenX + el.scrollLeft;
        const tl = contentX - leftWidth; // in timeline space
        el.scrollLeft = Math.max(0, tl * k + leftWidth - screenX);
      } else if (el) {
        // Anchor the viewport centre.
        const cx = el.clientWidth / 2;
        el.scrollLeft = Math.max(0, (el.scrollLeft - cx) * k + cx);
      }
      setZoom(next);
    },
    [zoom, minZoom, maxZoom, leftWidth, setZoom],
  );

  // Trackpad pinch (⌘/Ctrl + wheel) zooms; a plain wheel must keep scrolling.
  // React's onWheel is passive, so the non-passive native listener owns this.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      zoomBy(factor, e.clientX);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomBy]);

  // Re-align the header scale when the timeline geometry changes (zoom,
  // range, columns) — the body scroller keeps its own scrollLeft, so only
  // the detached window needs to catch up.
  useEffect(() => {
    syncHeaderScale();
  }, [syncHeaderScale, timelineWidth, zoom, range.start, leftWidth]);

  // ── Drag machinery ─────────────────────────────────────────────────────────
  const dragApi = useGanttDrag({
    scrollRef,
    overlayRef,
    rows: model.rows,
    tasksById: model.tasksById,
    zoom,
    snap,
    rangeStart: range.start,
    rowHeight,
    leftWidth,
    interactive,
    tasks,
    links,
    accentColor: color,
    onTasksChange,
    onLinksChange,
    onReorder: handleReorder,
    rowOrder,
    setSelected,
  });

  // Keyboard editing on the focused bar.
  const onBarKeyDown = useCallback(
    (e: React.KeyboardEvent, task: GanttTask) => {
      if (!interactive || task.locked || !onTasksChange) return;
      const stepMs =
        snap === "hour"
          ? 3_600_000
          : snap === "week"
            ? 7 * MS_PER_DAY
            : MS_PER_DAY;
      let ns = toMs(task.start);
      let ne = toMs(task.end);
      let handled = true;
      const shift = e.shiftKey;
      switch (e.key) {
        case "ArrowLeft":
          if (shift) ns = Math.min(ns - stepMs, ne - 3_600_000);
          else {
            const dur = ne - ns;
            ns -= stepMs;
            ne = ns + dur;
          }
          break;
        case "ArrowRight":
          if (shift) ne = Math.max(ne + stepMs, ns + 3_600_000);
          else {
            const dur = ne - ns;
            ns += stepMs;
            ne = ns + dur;
          }
          break;
        case "ArrowUp":
        case "ArrowDown":
          handled = false;
          break;
        case "Enter":
        case " ":
          setSelected(task.id);
          break;
        default:
          handled = false;
      }
      if (!handled) return;
      e.preventDefault();
      const edited = commitDragEdit(task, ns, ne);
      if (edited !== task) {
        onTasksChange(tasks.map((t) => (t.id === task.id ? edited : t)));
      }
    },
    [interactive, snap, tasks, onTasksChange, setSelected],
  );

  // Remove the currently-selected link (shared by the Delete key and the
  // floating delete control / double-click).
  const deleteSelectedLink = useCallback(() => {
    const sel = dragApi.linkSelected;
    if (!sel || !interactive || !onLinksChange) return;
    const key = (l: GanttLink) => l.id ?? `${l.source}~${l.target}~${l.type ?? "fs"}`;
    const selKey = key(sel);
    onLinksChange(links.filter((l) => key(l) !== selKey));
    dragApi.setLinkSelected(null);
  }, [dragApi, links, interactive, onLinksChange]);

  // Delete key removes the selected link; Escape deselects (only when the
  // chart has focus — it gains focus the moment a link is selected).
  const onRootKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!dragApi.linkSelected) return;
      if (e.key === "Escape") {
        dragApi.setLinkSelected(null);
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelectedLink();
      }
    },
    [dragApi, deleteSelectedLink],
  );

  // Select a link and move focus to the chart so the Delete key works right
  // after the click. Selecting nothing (deselect) also clears the focus target.
  const handleSelectLink = useCallback(
    (link: GanttLink | null) => {
      dragApi.setLinkSelected(link);
      if (link) rootRef.current?.focus();
    },
    [dragApi],
  );

  // Pressing anywhere outside a connector (or its delete control) clears the
  // link selection. Pointerdown — not click — is used because interactive bars
  // call preventDefault on pointerdown, which suppresses the click event.
  const handleRootPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as Element).closest?.("[data-gantt-keep-link-selection]")) return;
      if (dragApi.linkSelected) dragApi.setLinkSelected(null);
    },
    [dragApi],
  );

  const todayX = dateToX(toMs(today ?? new Date()), range.start, zoom);
  const todayVisible = showToday && todayX >= 0 && todayX <= timelineWidth;
  const todayTokens = getGanttTodayTokens(color);
  const selectionTokens = getGanttSelectionTokens(color);
  const isEmpty = tasks.length === 0;

  const drag = dragApi.drag;
  const dragTask = drag?.taskId ? model.tasksById.get(drag.taskId) : undefined;
  const liveDragDates = useMemo(() => {
    if (!drag || !dragTask) return null;
    if (drag.kind !== "move" && drag.kind !== "resize-start" && drag.kind !== "resize-end") return null;
    return applyDragDates(
      { kind: drag.kind, originStart: drag.originStart, originEnd: drag.originEnd },
      drag.x - drag.startX,
      zoom,
      snap,
    );
  }, [drag, dragTask, zoom, snap]);

  // While a progress drag is live, the dragged task's percent complete is
  // replaced by the pointer's live value, so the progress fill, the % readout
  // and the Progress column all follow the knob in real time (committed only
  // on drop).
  const liveDragProgress =
    drag?.kind === "progress" && drag.liveProgress != null ? drag.liveProgress : null;

  // While a move/resize drag is live, the dragged task's committed geometry is
  // replaced by its preview geometry, so its dependency arrows re-route in
  // place (following the bar as it moves/resizes) instead of snapping on drop.
  const liveLinkBars = useMemo(() => {
    if (!liveDragDates || !dragTask) return bars;
    const g = bars.get(dragTask.id);
    if (!g) return bars;
    const left = dateToX(liveDragDates.start, range.start, zoom);
    const width = g.milestone
      ? 0
      : Math.max(6, dateToX(liveDragDates.end, range.start, zoom) - left);
    if (left === g.left && width === g.width) return bars;
    return new Map(bars).set(dragTask.id, { ...g, left, width });
  }, [bars, liveDragDates, dragTask, range, zoom]);

  const linkPaths = useMemo(
    () => computeLinkPaths(links, liveLinkBars, color),
    [links, liveLinkBars, color],
  );

  // Port slots per bar edge: the hover link handle sits on the largest free
  // slot (never on the static fan) and passes the same offset to the
  // rubber-band preview.
  const linkFan = useMemo(() => computeLinkFanOffsets(links, bars), [links, bars]);

  // ── Render ─────────────────────────────────────────────────────────────────
  // The chart is a Panel: the container chrome (fill, border, backdrop,
  // corner) comes from the surface variant, and the surface context flows to
  // every control inside. The header is detached from the body — a fixed
  // strip above the scroller, so it never scrolls; only the body scrolls.
  return (
    <Panel
      ref={rootRef}
      variant={variant}
      padding="none"
      corner="rounded-sm"
      flexBody
      scrollable={false}
      className="select-none outline-none focus:outline-none"
      style={{ height }}
      data-gantt
      tabIndex={0}
      aria-label="Gantt chart"
      onKeyDown={onRootKeyDown}
      onPointerDown={handleRootPointerDown}
    >
      <div className="flex h-full min-h-0 flex-col">
        {/* ── Chart header (always rendered; icon | eyebrow + title | actions
              | zoom selector). The zoom selector always lives here — it never
              floats over the scale window. ── */}
        <div
          className={classNames(
            "flex shrink-0 items-center gap-3 border-b px-4 py-3",
            surfaceText.divider,
          )}
        >
          {hasNode(icon) && (
            <div
              className={classNames(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                getSurfaceVariantClasses(variant, "neutral"),
              )}
            >
              {icon}
            </div>
          )}
          {(title != null || subtitle != null) && (
            <div className="min-w-0 flex-1">
              {subtitle != null && (
                <div className="truncate text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  {subtitle}
                </div>
              )}
              {title != null && (
                <div className="truncate text-lg font-semibold text-neutral-900 dark:text-white">
                  {title}
                </div>
              )}
            </div>
          )}
          {hasNode(actions) && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
          {/* Zoom selector — always in the header strip (after the actions),
              never floating over the scale window. `ml-auto` keeps it at the
              right edge when no icon/title/actions are present. */}
          <div className="ml-auto shrink-0">
            <GanttToolbar
              variant={variant}
              zoom={zoom}
              presets={GANTT_ZOOM_PRESETS}
              onZoomTo={setZoom}
              onZoomBy={(f) => zoomBy(f)}
            />
          </div>
        </div>
        {/* ── Header (detached: labels | synced scale window) ── */}
        <div
          className={classNames(
            "relative flex shrink-0 items-stretch border-b",
            surfaceText.divider,
          )}
          style={{ height: HEADER_HEIGHT }}
        >
          <div
            className="flex items-stretch border-r bg-white dark:bg-neutral-900"
            style={{ width: leftWidth }}
          >
            {/* Grip/caret column — no label (the name column carries it). */}
            <div className="w-9 shrink-0" />
            {resolvedColumns.map((col) => (
              <div
                key={col.key}
                className="flex shrink-0 items-center overflow-hidden border-r border-neutral-200/70 px-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-600 last:border-r-0 dark:border-neutral-800/70 dark:text-neutral-400"
                style={{
                  width: col.width ?? "160px",
                  justifyContent: col.align === "center" ? "center" : col.align === "right" ? "flex-end" : "flex-start",
                }}
              >
                <span className="truncate">{col.title}</span>
              </div>
            ))}
          </div>
          <div className="relative min-w-0 flex-1 overflow-hidden">
            <div
              ref={headerScaleRef}
              className="relative h-full"
              style={{ width: timelineWidth }}
            >
              <GanttScale levels={scaleLevels} height={HEADER_HEIGHT} />
              {todayVisible && !loading && !isEmpty && (
                <div
                  className={classNames(
                    "pointer-events-none absolute inset-y-0 z-[1] border-l-2",
                    todayTokens.line,
                  )}
                  style={{ left: todayX }}
                />
              )}
              {todayVisible && !loading && !isEmpty && (
                <div
                  className="pointer-events-none absolute top-1 z-10 -translate-x-1/2"
                  style={{ left: todayX }}
                >
                  <span className={classNames("rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm", todayTokens.chip)}>
                    {allLabels.today}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Body (the only scroller) ─────────────────────────────────── */}
        <div
          ref={scrollRef}
          className="gantt-scroller min-h-0 flex-1 overflow-auto overscroll-contain"
          onScroll={syncHeaderScale}
        >
          <div style={{ width: leftWidth + timelineWidth + LINK_RIGHT_GUTTER, minWidth: "100%" }}>
          {loading ? (
            <GanttSkeleton rows={12} rowHeight={rowHeight} leftWidth={leftWidth} />
          ) : isEmpty ? (
            <div className="flex items-center justify-center text-sm text-neutral-500" style={{ height: bodyHeight || 160, width: leftWidth + timelineWidth }}>
              {emptyState ?? allLabels.empty}
            </div>
          ) : (
            <div className="relative" style={{ height: bodyHeight }}>
              {/* Grid lines (behind bars, above row backgrounds) */}
              <div
                className="pointer-events-none absolute inset-y-0 z-0"
                style={{ left: leftWidth, width: timelineWidth }}
              >
                {scaleLevels.length > 0 &&
                  scaleLevels[scaleLevels.length - 1].columns.map((c) => (
                    <div
                      key={c.id}
                      className="absolute inset-y-0 border-r border-neutral-100 dark:border-neutral-800"
                      style={{ left: dateToX(c.start, range.start, zoom), width: c.width }}
                    />
                  ))}
                {todayVisible && (
                  <div
                    className={classNames("absolute inset-y-0 border-l-2", todayTokens.line)}
                    style={{ left: todayX }}
                  />
                )}
              </div>

              {/* Rows */}
              {model.rows.map((row) => (
                <GanttBodyRow
                  key={row.key}
                  row={row}
                  columns={resolvedColumns}
                  leftWidth={leftWidth}
                  timelineWidth={timelineWidth}
                  rangeStart={range.start}
                  zoom={zoom}
                  color={color}
                  interactive={interactive}
                  fanOut={row.task ? linkFan.bars.get(row.task.id)?.out : undefined}
                  fanIn={row.task ? linkFan.bars.get(row.task.id)?.inc : undefined}
                  selected={
                    row.task ? row.task.id === selectedId : selectedId === `lane:${row.lane?.id ?? ""}`
                  }
                  labels={allLabels}
                  renderCell={renderCell}
                  renderBar={renderBar}
                  drag={drag}
                  liveDates={liveDragDates ?? null}
                  liveProgress={
                    row.task && drag?.taskId === row.task.id ? liveDragProgress : null
                  }
                  onBarPointerDown={dragApi.onBarPointerDown}
                  onResizePointerDown={dragApi.onResizePointerDown}
                  onGripPointerDown={dragApi.onGripPointerDown}
                  onLinkHandlePointerDown={dragApi.onLinkHandlePointerDown}
                  onProgressPointerDown={dragApi.onProgressPointerDown}
                  onCaretClick={toggleCollapse}
                  onLaneCaretClick={toggleLane}
                  onSelect={(id) => setSelected(id)}
                  onBarKeyDown={onBarKeyDown}
                  selectionTokens={selectionTokens}
                  dividerClass={surfaceText.divider}
                />
              ))}

              {/* Dependency overlay (above rows, below handles via z-index) */}
              <GanttLinkLayer
                ref={overlayRef}
                width={timelineWidth + LINK_RIGHT_GUTTER}
                height={bodyHeight}
                offsetLeft={leftWidth}
                paths={linkPaths}
                color={color}
                selected={dragApi.linkSelected}
                rubber={dragApi.rubber}
                interactive={interactive}
                onSelectLink={handleSelectLink}
                onDeleteLink={interactive && onLinksChange ? deleteSelectedLink : undefined}
              />

              {/* Reorder insertion indicator */}
              {drag?.kind === "reorder" && dragApi.reorderPreviewY != null && (
                <div
                  className="pointer-events-none absolute z-30 h-0.5 rounded-full"
                  style={{
                    left: leftWidth,
                    width: timelineWidth,
                    top: dragApi.reorderPreviewY,
                    backgroundColor: `var(--color-${color}-500)`,
                  }}
                />
              )}

              {/* Live drag readout */}
              {drag && drag.kind !== "reorder" && dragTask && liveDragDates && (
                <div
                  className="pointer-events-none absolute z-50 rounded-md bg-neutral-900/90 px-2 py-1 text-[11px] font-medium text-white shadow-lg dark:bg-neutral-700/95"
                  style={{
                    left: leftWidth + (drag.x ?? 0) + 12,
                    top: (drag.y ?? 0) - 24,
                  }}
                >
                  {formatRangeLabel(liveDragDates.start, liveDragDates.end, zoom)}
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </Panel>
  );
};

Gantt.displayName = "Gantt";

function formatRangeLabel(start: number, end: number, zoom: number): string {
  const fmt = (ms: number) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      ...(zoom >= 24 ? { hour: "2-digit", minute: "2-digit" } : {}),
    }).format(new Date(ms));
  return `${fmt(start)} → ${fmt(end)}`;
}

/** Skeleton placeholder rows while data loads. */
const GanttSkeleton: React.FC<{ rows: number; rowHeight: number; leftWidth: number }> = ({
  rows,
  rowHeight,
  leftWidth,
}) => (
  <div className="animate-pulse" aria-busy="true">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex" style={{ height: rowHeight }}>
        <div
          className="sticky left-0 flex items-center border-b border-neutral-100 bg-white px-3 dark:border-neutral-800 dark:bg-neutral-900"
          style={{ width: leftWidth }}
        >
          <div
            className="h-3 rounded-full bg-neutral-200 dark:bg-neutral-700"
            style={{ width: `${40 + ((i * 37) % 45)}%` }}
          />
        </div>
        <div className="relative flex-1">
          <div
            className="absolute top-1/2 h-4 -translate-y-1/2 rounded-md bg-neutral-200/80 dark:bg-neutral-700/60"
            style={{
              left: `${((i * 53) % 40) + 5}%`,
              width: `${25 + ((i * 29) % 35)}%`,
            }}
          />
        </div>
      </div>
    ))}
  </div>
);
