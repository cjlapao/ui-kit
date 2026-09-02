<script lang="ts">
import type {
  GanttBarGeometry,
  GanttColumn,
  GanttDate,
  GanttLabels,
  GanttLane,
  GanttLink,
  GanttSnap,
  GanttTask,
  TrueColor,
} from "../../../../common/gantt";
import type { VNodeChild } from "vue";
import type { PanelVariant } from "../Panel.vue";
export type { GanttTask, GanttLink, GanttLane, GanttColumn, GanttSnap, GanttLabels, TrueColor };
/** The Panel surface variant driving the Gantt chrome (re-exported name). */
export type GanttVariant = PanelVariant;
export { mergeGanttLabels } from "./labels";

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
  icon?: VNodeChild;
  /** Small uppercase eyebrow rendered above the `title`. */
  subtitle?: string;
  /** Large title line. */
  title?: string;
  /** Right-aligned actions region (e.g. a status pill). */
  actions?: VNodeChild;
  /**
   * Enable pointer editing (move / resize / reorder / link). Defaults to
   * `true` when a change listener is provided, or when set explicitly.
   */
  editable?: boolean;
  /** Explicit per-lane top-level order (controlled). */
  rowOrder?: string[];
  /** Controlled selection. When omitted the selection is internal. */
  selectedId?: string | null;
  /** px per day. Controlled when provided with `onZoomChange`. */
  zoom?: number;
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
  /** Copy overrides. */
  labels?: Partial<GanttLabels>;
  /** Custom bar content; receives the task and its live geometry. */
  renderBar?: (task: GanttTask, geo: GanttBarGeometry) => VNodeChild;
  /** Custom cell content for user columns. */
  renderCell?: (value: unknown, task: GanttTask, column: GanttColumn) => VNodeChild | null;
}

export interface GanttEmits {
  (e: "tasks-change", tasks: GanttTask[]): void;
  (e: "links-change", links: GanttLink[]): void;
  (e: "reorder", order: string[]): void;
  (e: "select", id: string | null): void;
  (e: "zoom-change", zoom: number): void;
}
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from "vue";
import classNames from "classnames";
import {
  GANTT_MAX_ZOOM,
  GANTT_MIN_ZOOM,
  GANTT_ZOOM_PRESETS,
  DEFAULT_ROW_HEIGHT,
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
  laneRollupProgress,
  LINK_RIGHT_GUTTER,
  rangeWidth,
  taskRollupProgress,
  toMs,
  MS_PER_DAY,
} from "../../../../common/gantt";
import { mergeGanttLabels } from "./labels";
import Panel from "../Panel.vue";
import VNodeRenderer from "../internal/VNodeRenderer";
import { getSurfaceTextTokens, getSurfaceVariantClasses } from "../../theme/Theme";
import GanttScale from "./GanttScale.vue";
import GanttLinkLayer from "./GanttLinkLayer.vue";
import GanttBodyRow from "./GanttBodyRow.vue";
import GanttToolbar from "./GanttToolbar.vue";
import { useGanttDrag } from "./useGanttDrag";

defineOptions({ name: "Gantt", inheritAttrs: false });
const props = withDefaults(defineProps<GanttProps>(), {
  links: () => [],
  initialZoom: 16,
  minZoom: GANTT_MIN_ZOOM,
  maxZoom: GANTT_MAX_ZOOM,
  snap: "day",
  showToday: true,
  rowHeight: DEFAULT_ROW_HEIGHT,
  height: 520,
  color: "blue",
  variant: "elevated",
  loading: false,
});
const emit = defineEmits<GanttEmits>();

const HEADER_HEIGHT = 52;
/** Grip/caret column width (w-9 = 36px) — part of the left block, so
 *  `leftWidth` includes it: the left block, grid lines and scale window all
 *  start at `leftWidth`, and the columns never overflow into the timeline. */
const GRIP_WIDTH = 36;
const DEFAULT_COLUMNS: GanttColumn[] = [
  { key: "name", title: "Task", width: "220px", kind: "text" },
  { key: "owner", title: "Owner", width: "120px", kind: "owner" },
  { key: "progress", title: "Progress", width: "110px", kind: "progress" },
];

const resolvedColumns = computed<GanttColumn[]>(() => props.columns ?? DEFAULT_COLUMNS);
const allLabels = computed<GanttLabels>(() => mergeGanttLabels(props.labels));
const accentColor = computed<TrueColor>(() => props.color);

// Surface chrome derived from the variant — one source for the container,
// header and hairline dividers, so the whole chart follows the Panel's
// surface language (solid vs translucent ink included).
const surfaceText = computed(() => getSurfaceTextTokens(props.variant));

// Chart header (icon / subtitle / title / actions) — the strip is always
// rendered and always carries the zoom selector (right edge, after the
// actions). `false` counts as absent for the VNode props: Vue boolean-casts
// VNode-typed props to `false` when they are not passed (VNodeChild's union
// includes boolean).
const hasNode = (v: unknown) => v != null && v !== false;
const hasIcon = computed(() => hasNode(props.icon));
const hasActions = computed(() => hasNode(props.actions));
// Icon tile chrome follows the panel variant (sits flush beside the container).
const chartHeaderTile = computed(() => getSurfaceVariantClasses(props.variant, "neutral"));

// Whether the consumer wired change listeners (drives the `editable` default).
const instance = getCurrentInstance();
const vnodeProps = (instance?.vnode.props ?? {}) as Record<string, unknown>;
const hasChangeListeners =
  "onTasksChange" in vnodeProps || "onLinksChange" in vnodeProps || "onReorder" in vnodeProps;
const hasZoomListener = "onZoomChange" in vnodeProps;
const interactive = computed<boolean>(() => props.editable ?? hasChangeListeners);

// ── Zoom (controlled or internal) ─────────────────────────────────────────
const internalZoom = ref(props.initialZoom);
const zoom = computed<number>(() => (props.zoom !== undefined ? props.zoom : internalZoom.value));
const setZoom = (z: number) => {
  const clamped = Math.min(props.maxZoom, Math.max(props.minZoom, z));
  if (hasZoomListener) emit("zoom-change", clamped);
  else internalZoom.value = clamped;
};

// ── Selection (controlled or internal) ────────────────────────────────────
const internalSelection = ref<string | null>(null);
const selectedId = computed<string | null>(() =>
  props.selectedId !== undefined ? props.selectedId : internalSelection.value,
);
const setSelected = (id: string | null) => {
  emit("select", id);
  if (props.selectedId === undefined) internalSelection.value = id;
};

// ── Row order (controlled or internal) ────────────────────────────────────
const internalOrder = ref<string[] | undefined>(undefined);
const rowOrder = computed<string[] | undefined>(() => props.rowOrder ?? internalOrder.value);
const handleReorder = (order: string[]) => {
  emit("reorder", order);
  if (props.rowOrder === undefined) internalOrder.value = order;
};

// ── Collapse state (internal; seeds from `task.open === false`) ───────────
const collapsed = ref<Set<string>>(
  new Set(props.tasks.filter((t) => t.open === false).map((t) => t.id)),
);
const closedLanes = ref<Set<string>>(
  new Set((props.lanes ?? []).filter((l) => l.open === false).map((l) => l.id)),
);
// Reseed when the data array identity changes (a new dataset).
watch(
  () => props.tasks,
  (t) => {
    collapsed.value = new Set(t.filter((x) => x.open === false).map((x) => x.id));
  },
);
watch(
  () => props.lanes,
  (l) => {
    closedLanes.value = new Set((l ?? []).filter((x) => x.open === false).map((x) => x.id));
  },
);

const toggleCollapse = (taskId: string, isOpen: boolean) => {
  const next = new Set(collapsed.value);
  if (isOpen) next.add(taskId);
  else next.delete(taskId);
  collapsed.value = next;
};
const toggleLane = (laneId: string, isOpen: boolean) => {
  const next = new Set(closedLanes.value);
  if (isOpen) next.add(laneId);
  else next.delete(laneId);
  closedLanes.value = next;
};

const effectiveTasks = computed<GanttTask[]>(() => {
  if (collapsed.value.size === 0) return props.tasks;
  return props.tasks.map((t) => (collapsed.value.has(t.id) ? { ...t, open: false } : t));
});
const effectiveLanes = computed<GanttLane[] | undefined>(() => {
  if (closedLanes.value.size === 0) return props.lanes;
  return (props.lanes ?? []).map((l) => (closedLanes.value.has(l.id) ? { ...l, open: false } : l));
});

// ── Derived model ──────────────────────────────────────────────────────────
const model = computed(() => buildRows(effectiveTasks.value, effectiveLanes.value, rowOrder.value, props.rowHeight));

const range = computed(() => {
  const starts = props.tasks.map((t) => toMs(t.start));
  const ends = props.tasks.map((t) => toMs(t.end));
  return computeViewRange(starts, ends);
});
const timelineWidth = computed(() => rangeWidth(range.value.start, range.value.end, zoom.value));
const scaleLevels = computed(() => buildTimeScale(range.value.start, range.value.end, zoom.value));
const leftWidth = computed(() =>
  GRIP_WIDTH +
    resolvedColumns.value.reduce((sum, c) => {
      const m = /^(\d+(?:\.\d+)?)px$/.exec(c.width ?? "");
      return sum + (m ? Number(m[1]) : 160);
    }, 0),
);

// Bar geometry for every visible task row (link layer + drag math).
const bars = computed(() => {
  const map = new Map<string, GanttBarGeometry>();
  for (const row of model.value.rows) {
    if (!row.task) continue;
    const t = row.task;
    const s = toMs(t.start);
    const e = toMs(t.end);
    const milestone = t.type === "milestone";
    const left = dateToX(s, range.value.start, zoom.value);
    const width = milestone ? 0 : Math.max(6, dateToX(e, range.value.start, zoom.value) - left);
    map.set(t.id, { taskId: t.id, left, width, top: row.top, height: row.height, milestone });
  }
  return map;
});
const bodyHeight = computed(() => {
  const rows = model.value.rows;
  return rows.length > 0 ? rows[rows.length - 1].top + rows[rows.length - 1].height : 0;
});

// ── Scrolling / zoom anchoring ─────────────────────────────────────────────
const scrollRef = ref<HTMLElement | null>(null);
const overlayRef = ref<HTMLElement | null>(null);
// The Panel component instance — its `$el` is the chart's root section.
const rootRef = ref<{ $el: HTMLElement } | null>(null);
// The detached header's scale content — it must track the body scroller's
// horizontal position so the header stays aligned with the grid. We use a
// transform instead of copying `scrollLeft`: the body's scroll range can be
// wider than the header window (the link layer's right-outside detours push
// the body's scrollWidth past the timeline), so a clamped scrollLeft would
// desync, while a translate tracks the body 1:1 at every position.
const headerScaleRef = ref<HTMLElement | null>(null);

const syncHeaderScale = () => {
  const s = scrollRef.value;
  const h = headerScaleRef.value;
  if (s && h) h.style.transform = `translateX(${-s.scrollLeft}px)`;
};
// Re-align the header scale when the timeline geometry changes (zoom, range,
// columns) — the body scroller keeps its own scrollLeft.
watch([timelineWidth, zoom, range, leftWidth], syncHeaderScale);

const zoomBy = (factor: number, pointerClientX?: number) => {
  const el = scrollRef.value;
  const next = Math.min(props.maxZoom, Math.max(props.minZoom, zoom.value * factor));
  const k = next / zoom.value;
  if (el && pointerClientX != null) {
    const rect = el.getBoundingClientRect();
    const screenX = pointerClientX - rect.left;
    const contentX = screenX + el.scrollLeft;
    const tl = contentX - leftWidth.value;
    el.scrollLeft = Math.max(0, tl * k + leftWidth.value - screenX);
  } else if (el) {
    const cx = el.clientWidth / 2;
    el.scrollLeft = Math.max(0, (el.scrollLeft - cx) * k + cx);
  }
  setZoom(next);
};

const onWheel = (e: WheelEvent) => {
  if (!(e.ctrlKey || e.metaKey)) return;
  e.preventDefault();
  const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
  zoomBy(factor, e.clientX);
};
onMounted(() => {
  scrollRef.value?.addEventListener("wheel", onWheel, { passive: false });
});
onBeforeUnmount(() => {
  scrollRef.value?.removeEventListener("wheel", onWheel);
});

// ── Drag machinery ─────────────────────────────────────────────────────────
const emitTasksChange = (tasks: GanttTask[]) => emit("tasks-change", tasks);
const emitLinksChange = (links: GanttLink[]) => emit("links-change", links);

const dragApi = useGanttDrag({
  scrollRef,
  overlayRef,
  rows: computed(() => model.value.rows),
  tasksById: computed(() => model.value.tasksById),
  zoom,
  snap: computed(() => props.snap),
  rangeStart: computed(() => range.value.start),
  rowHeight: computed(() => props.rowHeight),
  leftWidth,
  interactive,
  tasks: computed(() => props.tasks),
  links: computed(() => props.links),
  rowOrder,
  accentColor,
  onTasksChange: emitTasksChange,
  onLinksChange: emitLinksChange,
  onReorder: handleReorder,
  setSelected,
});

// Keyboard editing on the focused bar.
const onBarKeyDown = (e: KeyboardEvent, task: GanttTask) => {
  if (!interactive.value || task.locked || !hasChangeListeners) return;
  const stepMs = props.snap === "hour" ? 3_600_000 : props.snap === "week" ? 7 * MS_PER_DAY : MS_PER_DAY;
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
    emitTasksChange(props.tasks.map((t) => (t.id === task.id ? edited : t)));
  }
};

// Remove the currently-selected link (shared by the Delete key and the
// floating delete control / double-click).
const deleteSelectedLink = () => {
  const sel = dragApi.linkSelected.value;
  if (!sel || !interactive.value || !hasChangeListeners) return;
  const key = (l: GanttLink) => l.id ?? `${l.source}~${l.target}~${l.type ?? "fs"}`;
  const selKey = key(sel);
  emitLinksChange(props.links.filter((l) => key(l) !== selKey));
  dragApi.setLinkSelected(null);
};

// Delete key removes the selected link; Escape deselects (the chart gains
// focus the moment a link is selected, so these fire right after a click).
const onRootKeyDown = (e: KeyboardEvent) => {
  if (!dragApi.linkSelected.value) return;
  if (e.key === "Escape") {
    dragApi.setLinkSelected(null);
    return;
  }
  if (e.key === "Delete" || e.key === "Backspace") {
    e.preventDefault();
    deleteSelectedLink();
  }
};

// Select a link and move focus to the chart so the Delete key works right
// after the click. The template ref resolves to the Panel component instance,
// so focus its root element.
const handleSelectLink = (link: GanttLink | null) => {
  dragApi.setLinkSelected(link);
  if (link) (rootRef.value?.$el as HTMLElement | undefined)?.focus();
};
// Pressing anywhere outside a connector (or its delete control) clears the
// link selection. Pointerdown — not click — is used because interactive bars
// call preventDefault on pointerdown, which suppresses the click event.
const handleRootPointerDown = (e: PointerEvent) => {
  if ((e.target as Element).closest?.("[data-gantt-keep-link-selection]")) return;
  if (dragApi.linkSelected.value) dragApi.setLinkSelected(null);
};
const handleDeleteLink = (link: GanttLink) => {
  void link; // the chip always targets the selected link
  deleteSelectedLink();
};

// Typed wrappers for the row/toolbar event handlers (keeps the template free of
// implicit-any inline arrows).
const hBarPointerDown = (t: GanttTask, ev: PointerEvent) => dragApi.onBarPointerDown(t, ev);
const hResizePointerDown = (t: GanttTask, edge: "start" | "end", ev: PointerEvent) =>
  dragApi.onResizePointerDown(t, edge, ev);
const hGripPointerDown = (k: string, t: GanttTask, ev: PointerEvent) => dragApi.onGripPointerDown(k, t, ev);
const hLinkHandlePointerDown = (t: GanttTask, side: 1 | -1, ev: PointerEvent, fromOffset?: number) =>
  dragApi.onLinkHandlePointerDown(t, side, ev, fromOffset);
const hProgressPointerDown = (t: GanttTask, ev: PointerEvent) => dragApi.onProgressPointerDown(t, ev);
const hCaretClick = (id: string, open: boolean) => toggleCollapse(id, open);
const hLaneCaretClick = (id: string, open: boolean) => toggleLane(id, open);
const hSelect = (id: string) => setSelected(id);
const hBarKeyDown = (ev: KeyboardEvent, t: GanttTask) => onBarKeyDown(ev, t);
const hZoomBy = (f: number) => zoomBy(f);

const todayX = computed(() => dateToX(toMs(props.today ?? new Date()), range.value.start, zoom.value));
const todayVisible = computed(() => (props.showToday ? todayX.value >= 0 && todayX.value <= timelineWidth.value : false));
const todayTokens = computed(() => getGanttTodayTokens(accentColor.value));
const selectionTokens = computed(() => getGanttSelectionTokens(accentColor.value));
const isEmpty = computed(() => props.tasks.length === 0);

const drag = computed(() => dragApi.drag.value);
const dragTask = computed(() => (drag.value?.taskId ? model.value.tasksById.get(drag.value.taskId) : undefined));
const liveDragDates = computed(() => {
  const d = drag.value;
  const t = dragTask.value;
  if (!d || !t) return null;
  if (d.kind !== "move" && d.kind !== "resize-start" && d.kind !== "resize-end") return null;
  return applyDragDates(
    { kind: d.kind, originStart: d.originStart, originEnd: d.originEnd },
    d.x - d.startX,
    zoom.value,
    props.snap,
  );
});

// While a progress drag is live, the dragged task's percent complete is
// replaced by the pointer's live value, so the progress fill, the % readout
// and the Progress column all follow the knob in real time (committed only
// on drop).
const liveDragProgress = computed(
  () =>
    drag.value?.kind === "progress" && drag.value.liveProgress != null
      ? drag.value.liveProgress
      : null,
);

// While a drag is live, the previewed edit of the dragged task (live dates
// for a move/resize, live progress for the knob) — the single input to the
// live re-rolls below.
const dragOverride = computed<GanttTask | null>(() => {
  const d = drag.value;
  const t = dragTask.value;
  if (!d || !t) return null;
  if (d.kind === "progress" && d.liveProgress != null) {
    return { ...t, progress: d.liveProgress };
  }
  if (
    (d.kind === "move" || d.kind === "resize-start" || d.kind === "resize-end") &&
    liveDragDates.value
  ) {
    return { ...t, start: liveDragDates.value.start, end: liveDragDates.value.end };
  }
  return null;
});

// The lane that owns the dragged task re-rolls its roll-up with the
// previewed edit, so the lane's Progress column follows the child in real
// time — a move/resize changes the duration weights, the progress knob
// changes the leaf value. Committed values are unchanged until the drop.
const liveLaneProgress = computed(() =>
  dragOverride.value && dragTask.value
    ? laneRollupProgress(effectiveTasks.value, dragTask.value.id, dragOverride.value)
    : null,
);

// The dragged task's ancestor groups are read-only roll-ups of their
// children, so each re-rolls live as the child moves/resizes/edits.
const liveGroupProgress = computed<Map<string, number> | null>(() => {
  const o = dragOverride.value;
  const t = dragTask.value;
  if (!o || !t) return null;
  const byId = new Map(effectiveTasks.value.map((x) => [x.id, x]));
  const m = new Map<string, number>();
  let p = t.parent != null ? byId.get(t.parent) : undefined;
  while (p) {
    const r = taskRollupProgress(effectiveTasks.value, p.id, o);
    if (r != null) m.set(p.id, r);
    p = p.parent != null ? byId.get(p.parent) : undefined;
  }
  return m.size > 0 ? m : null;
});

// While a move/resize drag is live, the dragged task's committed geometry is
// replaced by its preview geometry, so its dependency arrows re-route in
// place (following the bar as it moves/resizes) instead of snapping on drop.
const liveLinkBars = computed(() => {
  const live = liveDragDates.value;
  const t = dragTask.value;
  if (!live || !t) return bars.value;
  const g = bars.value.get(t.id);
  if (!g) return bars.value;
  const left = dateToX(live.start, range.value.start, zoom.value);
  const width = g.milestone
    ? 0
    : Math.max(6, dateToX(live.end, range.value.start, zoom.value) - left);
  if (left === g.left && width === g.width) return bars.value;
  return new Map(bars.value).set(t.id, { ...g, left, width });
});

const linkPaths = computed(() => computeLinkPaths(props.links, liveLinkBars.value, accentColor.value));

// Port slots per bar edge: the hover link handle sits on the largest free
// slot (never on the static fan) and passes the same offset to the
// rubber-band preview.
const linkFan = computed(() => computeLinkFanOffsets(props.links, bars.value));

function formatRangeLabel(start: number, end: number, zoom: number): string {
  const fmt = (ms: number) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      ...(zoom >= 24 ? { hour: "2-digit", minute: "2-digit" } : {}),
    }).format(new Date(ms));
  return `${fmt(start)} → ${fmt(end)}`;
}

const colJustify = (col: GanttColumn) =>
  col.align === "center" ? "center" : col.align === "right" ? "flex-end" : "flex-start";
</script>

<template>
  <!--
    The chart is a Panel: the container chrome (fill, border, backdrop,
    corner) comes from the surface variant, and the surface context flows to
    every control inside. The header is detached from the body — a fixed
    strip above the scroller, so it never scrolls; only the body scrolls.
  -->
  <Panel
    ref="rootRef"
    :variant="variant"
    padding="none"
    corner="rounded-sm"
    :flex-body="true"
    :scrollable="false"
    class="select-none outline-none focus:outline-none"
    :style="{ height: typeof height === 'number' ? `${height}px` : height }"
    data-gantt
    tabindex="0"
    aria-label="Gantt chart"
    @keydown="onRootKeyDown"
    @pointerdown="handleRootPointerDown"
  >
    <div class="flex h-full min-h-0 flex-col">
      <!-- ── Chart header (always rendered; icon | eyebrow + title | actions
           | zoom selector — the selector never floats over the scale) ── -->
      <div
        :class="classNames('flex shrink-0 items-center gap-3 border-b px-4 py-3', surfaceText.divider)"
      >
        <div
          v-if="hasIcon"
          :class="
            classNames(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
              chartHeaderTile,
            )
          "
        >
          <VNodeRenderer :nodes="icon" />
        </div>
        <div v-if="title || subtitle" class="min-w-0 flex-1">
          <div
            v-if="subtitle"
            class="truncate text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
          >
            {{ subtitle }}
          </div>
          <div v-if="title" class="truncate text-lg font-semibold text-neutral-900 dark:text-white">
            {{ title }}
          </div>
        </div>
        <div v-if="hasActions" class="flex shrink-0 items-center gap-2">
          <VNodeRenderer :nodes="actions" />
        </div>
        <!-- Zoom selector — always in the header strip (after the actions),
             never floating over the scale window. `ml-auto` keeps it at the
             right edge when no icon/title/actions are present. -->
        <div class="ml-auto shrink-0">
          <GanttToolbar
            :variant="variant"
            :zoom="zoom"
            :presets="GANTT_ZOOM_PRESETS"
            @zoom-to="setZoom"
            @zoom-by="hZoomBy"
          />
        </div>
      </div>
      <!-- ── Header (detached: labels | synced scale window) ── -->
      <div
        :class="classNames('relative flex shrink-0 items-stretch border-b', surfaceText.divider)"
        :style="{ height: HEADER_HEIGHT }"
      >
        <div
          class="flex items-stretch border-r bg-white dark:bg-neutral-900"
          :style="{ width: leftWidth }"
        >
          <!-- Grip/caret column — no label (the name column carries it). -->
          <div class="w-9 shrink-0" />
          <div
            v-for="col in resolvedColumns"
            :key="col.key"
            class="flex shrink-0 items-center overflow-hidden border-r border-neutral-200/70 px-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-600 last:border-r-0 dark:border-neutral-800/70 dark:text-neutral-400"
            :style="{ width: col.width ?? '160px', justifyContent: colJustify(col) }"
          >
            <span class="truncate">{{ col.title }}</span>
          </div>
        </div>
        <div class="relative min-w-0 flex-1 overflow-hidden">
          <div ref="headerScaleRef" class="relative h-full" :style="{ width: timelineWidth }">
            <GanttScale :levels="scaleLevels" :height="HEADER_HEIGHT" />
            <div
              v-if="todayVisible && !loading && !isEmpty"
              :class="classNames('pointer-events-none absolute inset-y-0 z-[1] border-l-2', todayTokens.line)"
              :style="{ left: todayX }"
            />
            <div
              v-if="todayVisible && !loading && !isEmpty"
              class="pointer-events-none absolute top-1 z-10 -translate-x-1/2"
              :style="{ left: todayX }"
            >
              <span :class="classNames('rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm', todayTokens.chip)">
                {{ allLabels.today }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Body (the only scroller) ─────────────────────────────────── -->
      <div
        ref="scrollRef"
        class="gantt-scroller min-h-0 flex-1 overflow-auto overscroll-contain"
        @scroll="syncHeaderScale"
      >
        <div :style="{ width: leftWidth + timelineWidth + LINK_RIGHT_GUTTER, minWidth: '100%' }">

        <!-- ── Body ───────────────────────────────────────────────────── -->
        <!-- Loading skeleton -->
        <div v-if="loading" class="animate-pulse" aria-busy="true">
          <div v-for="i in 12" :key="i" class="flex" :style="{ height: rowHeight }">
            <div
              class="sticky left-0 flex items-center border-b border-neutral-100 bg-white px-3 dark:border-neutral-800 dark:bg-neutral-900"
              :style="{ width: leftWidth }"
            >
              <div
                class="h-3 rounded-full bg-neutral-200 dark:bg-neutral-700"
                :style="{ width: `${40 + ((i * 37) % 45)}%` }"
              />
            </div>
            <div class="relative flex-1">
              <div
                class="absolute top-1/2 h-4 -translate-y-1/2 rounded-md bg-neutral-200/80 dark:bg-neutral-700/60"
                :style="{ left: `${((i * 53) % 40) + 5}%`, width: `${25 + ((i * 29) % 35)}%` }"
              />
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="isEmpty"
          class="flex items-center justify-center text-sm text-neutral-500"
          :style="{ height: bodyHeight || 160, width: leftWidth + timelineWidth }"
        >
          <slot name="empty">{{ allLabels.empty }}</slot>
        </div>

        <!-- Rows -->
        <div v-else class="relative" :style="{ height: bodyHeight }">
          <!-- Grid lines (behind bars, above row backgrounds) -->
          <div class="pointer-events-none absolute inset-y-0 z-0" :style="{ left: leftWidth, width: timelineWidth }">
            <template v-if="scaleLevels.length > 0">
              <div
                v-for="c in scaleLevels[scaleLevels.length - 1].columns"
                :key="c.id"
                class="absolute inset-y-0 border-r border-neutral-100 dark:border-neutral-800"
                :style="{ left: dateToX(c.start, range.start, zoom), width: c.width }"
              />
            </template>
            <div
              v-if="todayVisible"
              :class="classNames('absolute inset-y-0 border-l-2', todayTokens.line)"
              :style="{ left: todayX }"
            />
          </div>

          <!-- Rows -->
          <GanttBodyRow
            v-for="row in model.rows"
            :key="row.key"
            :row="row"
            :columns="resolvedColumns"
            :left-width="leftWidth"
            :timeline-width="timelineWidth"
            :range-start="range.start"
            :zoom="zoom"
            :color="accentColor"
            :interactive="interactive"
            :fan-out="row.task ? linkFan.bars.get(row.task.id)?.out : undefined"
            :fan-in="row.task ? linkFan.bars.get(row.task.id)?.inc : undefined"
            :selected="row.task ? row.task.id === selectedId : selectedId === `lane:${row.lane?.id ?? ''}`"
            :labels="allLabels"
            :render-cell="renderCell"
            :render-bar="renderBar"
            :drag="drag"
            :live-dates="liveDragDates ?? null"
            :live-progress="row.task && drag?.taskId === row.task.id ? liveDragProgress : null"
            :live-lane="row.lane && liveLaneProgress && row.lane.id === liveLaneProgress.laneId ? liveLaneProgress.progress : null"
            :live-rollup="row.task && row.isGroup ? (liveGroupProgress?.get(row.task.id) ?? null) : null"
            :selection-tokens="selectionTokens"
            :divider-class="surfaceText.divider"
            @bar-pointer-down="hBarPointerDown"
            @resize-pointer-down="hResizePointerDown"
            @grip-pointer-down="hGripPointerDown"
            @link-handle-pointer-down="hLinkHandlePointerDown"
            @progress-pointer-down="hProgressPointerDown"
            @caret-click="hCaretClick"
            @lane-caret-click="hLaneCaretClick"
            @select="hSelect"
            @bar-keydown="hBarKeyDown"
          />

          <!-- Dependency overlay (above rows, below handles via z-index) -->
          <div
            ref="overlayRef"
            class="pointer-events-none absolute top-0 z-10"
            :style="{ left: `${leftWidth}px`, width: `${timelineWidth + LINK_RIGHT_GUTTER}px`, height: `${bodyHeight}px` }"
          >
            <GanttLinkLayer
              :width="timelineWidth + LINK_RIGHT_GUTTER"
              :height="bodyHeight"
              :paths="linkPaths"
              :color="accentColor"
              :selected="dragApi.linkSelected.value"
              :rubber="dragApi.rubber.value"
              :interactive="interactive"
              :on-delete-link="interactive && hasChangeListeners ? handleDeleteLink : undefined"
              @select-link="handleSelectLink"
            />
          </div>

          <!-- Reorder insertion indicator -->
          <div
            v-if="drag?.kind === 'reorder' && dragApi.reorderPreviewY.value != null"
            class="pointer-events-none absolute z-30 h-0.5 rounded-full"
            :style="{
              left: leftWidth,
              width: timelineWidth,
              top: dragApi.reorderPreviewY.value,
              backgroundColor: `var(--color-${accentColor}-500)`,
            }"
          />

          <!-- Live drag readout -->
          <div
            v-if="drag && drag.kind !== 'reorder' && dragTask && liveDragDates"
            class="pointer-events-none absolute z-50 rounded-md bg-neutral-900/90 px-2 py-1 text-[11px] font-medium text-white shadow-lg dark:bg-neutral-700/95"
            :style="{ left: leftWidth + (drag.x ?? 0) + 12, top: (drag.y ?? 0) - 24 }"
          >
            {{ formatRangeLabel(liveDragDates.start, liveDragDates.end, zoom) }}
          </div>
        </div>
        </div>
      </div>
    </div>
  </Panel>
</template>
