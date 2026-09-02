<script lang="ts">
import type { GanttColumn, GanttTask } from "../../../../common/gantt";
import type { VNodeChild } from "vue";
export interface GanttCellProps {
  col: GanttColumn;
  task: GanttTask;
  depth: number;
  isGroup: boolean;
  childCount: number;
  first: boolean;
  /** Live percent complete (0..1) while this task's progress knob is dragged. */
  liveProgress?: number | null;
  renderCell?: (value: unknown, task: GanttTask, column: GanttColumn) => VNodeChild | null;
  /** Hairline divider classes (border colour) for the cell's right edge. */
  dividerClass?: string;
}
export interface GanttCellEmits {
  (e: "caret-click", taskId: string, isOpen: boolean): void;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import { getGanttBarTokens } from "../../../../common/gantt";
import VNodeRenderer from "../internal/VNodeRenderer";
import { useIconRenderer } from "../../contexts/IconContext";

defineOptions({ name: "GanttCell" });
const props = defineProps<GanttCellProps>();
const emit = defineEmits<GanttCellEmits>();
const renderIcon = useIconRenderer();

const value = computed(
  () =>
    props.col.key === "name"
      ? props.task.name
      : props.col.key === "owner"
        ? props.task.owner
        : props.col.key === "progress"
          ? (props.liveProgress ?? props.task.progress)
          : (props.task.values?.[props.col.key] ?? null),
);

const custom = computed(() => {
  if (props.col.key === "name" || !props.renderCell) return null;
  return props.renderCell(value.value, props.task, props.col);
});

const justify = computed(() =>
  props.col.align === "center"
    ? "center"
    : props.col.align === "right"
      ? "flex-end"
      : "flex-start",
);

const ownerInitial = computed(() =>
  value.value != null ? String(value.value).slice(0, 1) : "",
);
const ownerTokens = computed(() => getGanttBarTokens(props.task.color ?? "blue").fill);
const badgeTokens = computed(() => getGanttBarTokens(props.task.badgeColor ?? "neutral").fill);
const isOpen = computed(() => props.task.open !== false);
const progressValue = computed(() => (typeof value.value === "number" ? value.value : 0));
</script>

<template>
  <div
    :class="classNames(
      'flex shrink-0 items-center gap-1.5 overflow-hidden border-r px-2 text-[12.5px] last:border-r-0',
      dividerClass ?? 'border-neutral-100 dark:border-neutral-800',
    )"
    :style="{ width: col.width ?? '160px', justifyContent: justify }"
  >
    <!-- First (name) column: indent + caret + name -->
    <template v-if="first">
      <span class="shrink-0" :style="{ width: depth * 14 + 18 }">
        <button
          v-if="isGroup"
          type="button"
          class="flex h-4 w-4 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:hover:bg-white/10 dark:hover:text-neutral-300"
          :aria-label="`${isOpen ? 'Collapse' : 'Expand'} ${task.name}`"
          @click="emit('caret-click', task.id, isOpen)"
        >
          <VNodeRenderer
            :nodes="renderIcon('ChevronRight', undefined, classNames('h-3 w-3 transition-transform', isOpen && 'rotate-90'))"
          />
        </button>
      </span>
      <span
        v-if="isGroup && childCount > 0"
        class="flex min-w-0 items-center gap-1 font-semibold text-neutral-800 dark:text-neutral-100"
      >
        <span class="truncate">{{ task.name }}</span>
        <span class="shrink-0 rounded-full bg-neutral-100 px-1 text-[10px] font-semibold text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
          {{ childCount }}
        </span>
      </span>
      <span v-else class="truncate font-medium text-neutral-700 dark:text-neutral-300">
        {{ task.name }}
      </span>
    </template>

    <!-- Owner column -->
    <template v-else-if="col.kind === 'owner'">
      <span v-if="value != null" class="flex min-w-0 items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
        <span :class="classNames('flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold uppercase text-white', ownerTokens)">
          {{ ownerInitial }}
        </span>
        <span class="truncate">{{ String(value) }}</span>
      </span>
      <span v-else class="text-neutral-400 dark:text-neutral-600">—</span>
    </template>

    <!-- Progress column -->
    <span v-else-if="col.kind === 'progress'" class="flex w-full items-center gap-1.5">
      <span class="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-neutral-200/80 dark:bg-white/10">
        <span
          class="block h-full rounded-full bg-emerald-500"
          :style="{ width: `${Math.round(progressValue * 100)}%` }"
        />
      </span>
      <span class="w-7 shrink-0 text-right text-[10px] font-semibold tabular-nums text-neutral-500 dark:text-neutral-400">
        {{ Math.round(progressValue * 100) }}%
      </span>
    </span>

    <!-- Badge column -->
    <template v-else-if="col.kind === 'badge'">
      <span
        v-if="task.badge != null"
        :class="classNames('rounded-full px-1.5 py-0.5 text-[10px] font-semibold', badgeTokens, 'text-white')"
      >
        {{ task.badge }}
      </span>
      <span v-else class="text-neutral-400 dark:text-neutral-600">—</span>
    </template>

    <!-- Custom / default -->
    <template v-else>
      <VNodeRenderer v-if="custom != null" :nodes="custom" />
      <span v-else class="truncate text-neutral-600 dark:text-neutral-400">
        {{ value == null || value === '' ? '—' : String(value) }}
      </span>
    </template>
  </div>
</template>
