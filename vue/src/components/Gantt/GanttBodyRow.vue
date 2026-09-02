<script lang="ts">
import type {
  GanttBarGeometry,
  GanttColumn,
  GanttLabels,
  GanttRow,
  GanttTask,
  TrueColor,
} from "../../../../common/gantt";
import type { VNodeChild } from "vue";
export interface GanttBodyRowProps {
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
  renderCell?: (value: unknown, task: GanttTask, column: GanttColumn) => VNodeChild | null;
  renderBar?: (task: GanttTask, geo: GanttBarGeometry) => VNodeChild;
  drag: { taskId: string; kind: string } | null;
  liveDates: { start: number; end: number } | null;
  selectionTokens: { ring: string; row: string };
  /**
   * Hairline divider classes (border colour) for row / cell edges — the
   * Gantt passes its Panel surface divider so hairlines follow the variant.
   */
  dividerClass?: string;
}
export interface GanttBodyRowEmits {
  (e: "grip-pointer-down", rowKey: string, task: GanttTask, ev: PointerEvent): void;
  (e: "bar-pointer-down", task: GanttTask, ev: PointerEvent): void;
  (e: "resize-pointer-down", task: GanttTask, edge: "start" | "end", ev: PointerEvent): void;
  (e: "link-handle-pointer-down", task: GanttTask, side: 1 | -1, ev: PointerEvent, fromOffset?: number): void;
  (e: "progress-pointer-down", task: GanttTask, ev: PointerEvent): void;
  (e: "caret-click", taskId: string, isOpen: boolean): void;
  (e: "lane-caret-click", laneId: string, isOpen: boolean): void;
  (e: "select", id: string): void;
  (e: "bar-keydown", ev: KeyboardEvent, task: GanttTask): void;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import { getGanttLaneTokens } from "../../../../common/gantt";
import GanttCell from "./GanttCell.vue";
import GanttTaskBar from "./GanttTaskBar.vue";
import VNodeRenderer from "../internal/VNodeRenderer";
import { useIconRenderer } from "../../contexts/IconContext";

defineOptions({ name: "GanttBodyRow" });
const props = defineProps<GanttBodyRowProps>();
const emit = defineEmits<GanttBodyRowEmits>();
const renderIcon = useIconRenderer();

// Hairline colour following the Gantt's surface variant (solid → neutral,
// translucent → the glass divider).
const divider = computed(() => props.dividerClass ?? "border-neutral-100 dark:border-neutral-800");

const isDraggingThis = computed(
  () => props.row.task != null && props.drag?.taskId === props.row.task.id,
);
const dimmed = computed(
  () => props.drag?.kind === "reorder" && props.row.task?.id === props.drag.taskId,
);

// Lane header derived values.
const lane = computed(() => props.row.lane!);
const laneColor = computed(() => lane.value.color ?? props.color);
const laneTokens = computed(() => getGanttLaneTokens(laneColor.value));
const laneIsOpen = computed(() => lane.value.open !== false);
const lanePct = computed(() => Math.round((props.row.progress ?? 0) * 100));
</script>

<template>
  <div
    :data-row-key="row.key"
    :class="
      classNames(
        'group/row relative flex border-b',
        divider,
        selected && selectionTokens.row,
        dimmed && 'opacity-40',
      )
    "
    :style="{ height: row.height }"
  >
    <!-- ── Lane header ──────────────────────────────────────────── -->
    <!-- Left block zoned to the same column geometry as task rows so the
         lane progress sits in the Progress column. -->
    <template v-if="row.task == null">
      <div
        :class="
          classNames(
            'sticky left-0 z-20 flex items-stretch border-r',
            divider,
            laneTokens.band,
          )
        "
        :style="{ width: leftWidth }"
      >
        <div class="flex w-9 shrink-0 items-center justify-center">
          <button
            type="button"
            class="flex h-5 w-5 shrink-0 items-center justify-center rounded text-neutral-500 hover:bg-white/60 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:text-neutral-400 dark:hover:bg-white/10"
            :aria-label="`${laneIsOpen ? 'Collapse' : 'Expand'} ${lane.label}`"
            @click="emit('lane-caret-click', lane.id, laneIsOpen)"
          >
            <VNodeRenderer
              :nodes="renderIcon('ChevronRight', undefined, classNames('h-3 w-3 transition-transform', laneIsOpen && 'rotate-90'))"
            />
          </button>
        </div>
        <div
          v-for="(col, i) in columns"
          :key="col.key"
          :class="
            classNames(
              'flex shrink-0 items-center gap-2 overflow-hidden border-r px-2 last:border-r-0',
              divider,
            )
          "
          :style="{ width: col.width ?? '160px' }"
        >
          <template v-if="i === 0">
            <span :class="classNames('truncate text-[13px] font-semibold', laneTokens.label)">
              {{ lane.label }}
            </span>
            <span
              v-if="lane.description"
              class="hidden truncate text-[11px] text-neutral-500 dark:text-neutral-400 lg:inline"
            >
              {{ lane.description }}
            </span>
            <span
              v-if="row.childCount > 0"
              class="shrink-0 rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600 dark:bg-white/10 dark:text-neutral-300"
            >
              {{ row.childCount }}
            </span>
          </template>
          <span v-else-if="col.key === 'progress'" class="flex w-full items-center gap-1.5">
            <span class="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-neutral-200/80 dark:bg-white/10">
              <span :class="classNames('block h-full rounded-full', laneTokens.chip)" :style="{ width: `${lanePct}%` }" />
            </span>
            <span class="w-7 shrink-0 text-right text-[10px] font-semibold tabular-nums text-neutral-500 dark:text-neutral-400">
              {{ lanePct }}%
            </span>
          </span>
        </div>
      </div>
      <div class="relative min-w-0 flex-1">
        <div :class="classNames('absolute inset-0', laneTokens.band)" />
      </div>
    </template>

    <!-- ── Task row ─────────────────────────────────────────────── -->
    <template v-else>
      <!-- Left cells -->
      <div class="sticky left-0 z-20 flex items-stretch bg-white dark:bg-neutral-900" :style="{ width: leftWidth }">
        <div class="flex w-9 shrink-0 items-center justify-center">
          <span
            v-if="interactive && !row.task.locked"
            class="flex cursor-grab touch-none items-center text-neutral-300 opacity-0 transition-opacity group-hover/row:opacity-100 active:cursor-grabbing dark:text-neutral-600"
            title="Drag to reorder"
            aria-hidden="true"
            @pointerdown="emit('grip-pointer-down', row.key, row.task!, $event)"
          >
            <VNodeRenderer :nodes="renderIcon('Drag', undefined, 'h-3.5 w-3.5')" />
          </span>
        </div>
        <GanttCell
          v-for="(col, i) in columns"
          :key="col.key"
          :col="col"
          :task="row.task!"
          :depth="row.depth"
          :is-group="row.isGroup"
          :child-count="row.childCount"
          :first="i === 0"
          :render-cell="renderCell"
          :divider-class="divider"
          @caret-click="(id, open) => emit('caret-click', id, open)"
        />
      </div>

      <!-- Timeline cell -->
      <div class="relative shrink-0" :style="{ width: timelineWidth }">
        <GanttTaskBar
          :task="row.task!"
          :row="row"
          :range-start="rangeStart"
          :zoom="zoom"
          :color="color"
          :interactive="interactive"
          :fan-out="fanOut"
          :fan-in="fanIn"
          :selected="selected"
          :labels="labels"
          :is-dragging-this="isDraggingThis"
          :live-dates="isDraggingThis ? liveDates : null"
          :render-bar="renderBar"
          :selection-tokens="selectionTokens"
          @bar-pointer-down="(t, ev) => emit('bar-pointer-down', t, ev)"
          @resize-pointer-down="(t, edge, ev) => emit('resize-pointer-down', t, edge, ev)"
          @link-handle-pointer-down="(t, side, ev, off) => emit('link-handle-pointer-down', t, side, ev, off)"
          @progress-pointer-down="(t, ev) => emit('progress-pointer-down', t, ev)"
          @select="(id) => emit('select', id)"
          @bar-keydown="(ev, t) => emit('bar-keydown', ev, t)"
        />
      </div>
    </template>
  </div>
</template>
