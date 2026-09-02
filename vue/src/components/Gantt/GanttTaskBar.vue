<script lang="ts">
import type {
  GanttBarGeometry,
  GanttLabels,
  GanttRow,
  GanttTask,
  TrueColor,
} from "../../../../common/gantt";
import type { VNodeChild } from "vue";
export interface GanttTaskBarProps {
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
  renderBar?: (task: GanttTask, geo: GanttBarGeometry) => VNodeChild;
  selectionTokens: { ring: string };
}
export interface GanttTaskBarEmits {
  (e: "bar-pointer-down", task: GanttTask, ev: PointerEvent): void;
  (e: "resize-pointer-down", task: GanttTask, edge: "start" | "end", ev: PointerEvent): void;
  (e: "link-handle-pointer-down", task: GanttTask, side: 1 | -1, ev: PointerEvent, fromOffset?: number): void;
  (e: "progress-pointer-down", task: GanttTask, ev: PointerEvent): void;
  (e: "select", id: string): void;
  (e: "bar-keydown", ev: KeyboardEvent, task: GanttTask): void;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import {
  formatDateTime,
  formatDuration,
  getGanttBarTokens,
  fanHandleOffset,
  toMs,
  dateToX,
} from "../../../../common/gantt";
import VNodeRenderer from "../internal/VNodeRenderer";

const BAR_HEIGHT = 24;
const MILESTONE_SIZE = 14;

defineOptions({ name: "GanttTaskBar" });
const props = defineProps<GanttTaskBarProps>();
const emit = defineEmits<GanttTaskBarEmits>();

const milestone = computed(() => props.task.type === "milestone");
const tokens = computed(() => getGanttBarTokens(props.task.color ?? props.color));

const startMs = computed(() => (props.liveDates ? props.liveDates.start : toMs(props.task.start)));
const endMs = computed(() => (props.liveDates ? props.liveDates.end : toMs(props.task.end)));
const left = computed(() => dateToX(startMs.value, props.rangeStart, props.zoom));
const width = computed(() =>
  milestone.value ? 0 : Math.max(6, dateToX(endMs.value, props.rangeStart, props.zoom) - left.value),
);
const progress = computed(() => props.task.progress ?? 0);
const progressPct = computed(() => Math.round(progress.value * 100));

const top = computed(() => (props.row.height - BAR_HEIGHT) / 2);
const showName = computed(() => !milestone.value && width.value > 44);
const canEdit = computed(() => props.interactive && !props.task.locked);
// Port slot on each edge: the centre of the largest free gap, so a handle
// never sits on the static fan — and the rubber band departs from the same
// slot the handle occupies.
const inSlot = computed(() => fanHandleOffset(BAR_HEIGHT, props.fanIn ?? []));
const outSlot = computed(() => fanHandleOffset(BAR_HEIGHT, props.fanOut ?? []));

const ariaLabel = computed(
  () =>
    `${props.task.name}: ${formatDateTime(startMs.value)} to ${formatDateTime(endMs.value)}, ${
      milestone.value ? "milestone" : `${formatDuration(startMs.value, endMs.value)}, ${progressPct.value}% complete`
    }`,
);

const barTitle = computed(
  () =>
    `${props.task.name} · ${formatDateTime(startMs.value)} → ${formatDateTime(endMs.value)} · ${progressPct.value}%`,
);

const renderBarNode = computed(() => {
  if (!props.renderBar) return null;
  return props.renderBar(props.task, {
    taskId: props.task.id,
    left: left.value,
    width: width.value,
    top: top.value,
    height: props.row.height,
    milestone: false,
  });
});
</script>

<template>
  <template v-if="milestone">
    <div
      role="button"
      tabindex="0"
      :aria-label="ariaLabel"
      :title="ariaLabel"
      :data-gantt-bar="task.id"
      :class="
        classNames(
          'absolute z-10 flex cursor-pointer items-center gap-1.5 outline-none',
          selected && selectionTokens.ring,
          'rounded',
        )
      "
      :style="{
        left: left - MILESTONE_SIZE / 2,
        top: (row.height - MILESTONE_SIZE) / 2,
        width: MILESTONE_SIZE + 160,
        height: MILESTONE_SIZE,
      }"
      @pointerdown="canEdit && emit('bar-pointer-down', task, $event)"
      @click="emit('select', task.id)"
      @keydown="emit('bar-keydown', $event, task)"
    >
      <span :class="classNames('h-3.5 w-3.5 shrink-0 rotate-45 rounded-[2px] shadow-sm', tokens.milestone)" />
      <span class="truncate text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
        {{ task.name }}
      </span>
    </div>
  </template>
  <template v-else>
    <div
      role="button"
      tabindex="0"
      :aria-label="ariaLabel"
      :title="barTitle"
      :data-gantt-bar="task.id"
      :class="
        classNames(
          'group/bar absolute z-10 cursor-grab touch-none rounded-md shadow-sm outline-none transition-shadow active:cursor-grabbing',
          tokens.fill,
          tokens.rim,
          'border',
          tokens.hover,
          selected && selectionTokens.ring,
          'hover:shadow-md',
        )
      "
      :style="{ left, top, width, height: BAR_HEIGHT }"
      @pointerdown="canEdit ? emit('bar-pointer-down', task, $event) : emit('select', task.id)"
      @click="emit('select', task.id)"
      @keydown="emit('bar-keydown', $event, task)"
    >
      <!-- Progress overlay -->
      <div
        v-if="progress > 0"
        :class="classNames('absolute inset-y-0 left-0 rounded-l-md', tokens.progress)"
        :style="{ width: `${progress * 100}%` }"
      />
      <!-- Progress knob (drag to set progress) -->
      <div
        v-if="canEdit && progress > 0 && progress < 1"
        class="absolute inset-y-0 z-20 w-2 cursor-ew-resize touch-none opacity-0 transition-opacity group-hover/bar:opacity-100"
        :style="{ left: `${progress * 100}%`, marginLeft: -4 }"
        :title="labels.progress"
        aria-hidden="true"
        @pointerdown="emit('progress-pointer-down', task, $event)"
      >
        <div class="mx-auto h-full w-0.5 rounded-full bg-white/90" />
      </div>
      <!-- Label -->
      <div
        v-if="showName && renderBar"
        class="pointer-events-none absolute inset-0 flex items-center px-1.5 text-[11px] font-medium text-white"
      >
        <VNodeRenderer :nodes="renderBarNode" />
      </div>
      <span
        v-else-if="showName"
        class="pointer-events-none absolute inset-0 flex items-center truncate px-1.5 text-[11px] font-medium text-white"
      >
        {{ task.name }}
      </span>
      <!-- Resize handles -->
      <template v-if="canEdit">
        <div
          class="absolute inset-y-0 -left-1 z-20 w-2 cursor-ew-resize touch-none"
          title="Resize start"
          aria-hidden="true"
          @pointerdown="emit('resize-pointer-down', task, 'start', $event)"
        >
          <div class="mx-auto h-full w-1 rounded-full bg-white/0 opacity-0 transition-opacity group-hover/bar:opacity-100" />
        </div>
        <div
          class="absolute inset-y-0 -right-1 z-20 w-2 cursor-ew-resize touch-none"
          title="Resize end"
          aria-hidden="true"
          @pointerdown="emit('resize-pointer-down', task, 'end', $event)"
        >
          <div class="mx-auto h-full w-1 rounded-full bg-white/0 opacity-0 transition-opacity group-hover/bar:opacity-100" />
        </div>
      </template>
      <!-- Link handles (create dependencies) -->
      <template v-if="canEdit">
        <button
          type="button"
          class="absolute -left-1.5 z-30 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-neutral-400 bg-white opacity-0 shadow-sm transition-opacity hover:scale-125 group-hover/bar:opacity-100 focus-visible:opacity-100 dark:border-neutral-300 dark:bg-neutral-800"
          :style="{ top: `calc(50% + ${inSlot}px)` }"
          :title="labels.link"
          :aria-label="`${labels.link} from start of ${task.name}`"
          @pointerdown="emit('link-handle-pointer-down', task, -1, $event, inSlot)"
        />
        <button
          type="button"
          class="absolute -right-1.5 z-30 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-neutral-400 bg-white opacity-0 shadow-sm transition-opacity hover:scale-125 group-hover/bar:opacity-100 focus-visible:opacity-100 dark:border-neutral-300 dark:bg-neutral-800"
          :style="{ top: `calc(50% + ${outSlot}px)` }"
          :title="labels.link"
          :aria-label="`${labels.link} from end of ${task.name}`"
          @pointerdown="emit('link-handle-pointer-down', task, 1, $event, outSlot)"
        />
      </template>
    </div>
  </template>
</template>
