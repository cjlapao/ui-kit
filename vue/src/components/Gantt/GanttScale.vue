<script lang="ts">
import type { GanttTimeColumn, GanttTimeScaleLevel } from "../../../../common/gantt";
export interface GanttScaleProps {
  levels: GanttTimeScaleLevel[];
  height: number;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";

defineOptions({ name: "GanttScale" });
const props = defineProps<GanttScaleProps>();

// Coarse level gets the top band; the fine level the taller bottom band.
const coarseHeight = computed(() => (props.levels.length > 1 ? 24 : props.height));

// A level is span-managed when the engine merges labels across columns
// (the hour tier). Unlabeled columns still draw their grid line; labeled
// ones float the text centered over the whole group, escaping the narrow
// column box (positioned content paints above the later columns'
// backgrounds).
const isSpanned = (level: GanttTimeScaleLevel) => level.columns.some((c) => c.labelSpan != null);
const labelColors = (li: number) =>
  li === 0 ? "text-neutral-700 dark:text-neutral-200" : "text-neutral-500 dark:text-neutral-400";
// Center of the merged group, measured from this column's left edge.
const overlayStyle = (col: GanttTimeColumn) => ({
  left: `${col.width / 2 + (((col.labelSpan ?? 1) - 1) * col.width) / 2}px`,
  top: "50%",
});
</script>

<template>
  <div v-if="levels.length === 0" :style="{ height: `${height}px` }" />
  <div v-else class="flex h-full w-full flex-col">
    <div
      v-for="(level, li) in levels"
      :key="level.id"
      :class="classNames('flex w-full', li === 0 ? 'shrink-0' : 'min-h-0 flex-1')"
      :style="li === 0 ? { height: `${coarseHeight}px` } : undefined"
    >
      <div
        v-for="col in level.columns"
        :key="col.id"
        :class="
          classNames(
            'flex shrink-0 flex-col items-center justify-center border-r',
            !isSpanned(level) && 'overflow-hidden',
            col.labelSpan != null && 'relative',
            col.major
              ? 'border-neutral-400 dark:border-neutral-600'
              : 'border-neutral-200/70 dark:border-neutral-800/70',
            li === 0 ? 'bg-neutral-50/60 dark:bg-neutral-800/40' : 'bg-white dark:bg-neutral-900',
          )
        "
        :style="{ width: col.width + 'px' }"
        :data-gantt-label-span="col.labelSpan"
      >
        <span
          v-if="col.labelSpan != null"
          :class="
            classNames(
              'pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-semibold uppercase leading-none tracking-wide',
              labelColors(li),
            )
          "
          :style="overlayStyle(col)"
        >
          {{ col.label }}
        </span>
        <template v-else-if="!isSpanned(level)">
          <span
            :class="
              classNames(
                'max-w-full truncate px-1 text-[10px] font-semibold uppercase leading-none tracking-wide',
                labelColors(li),
              )
            "
          >
            {{ col.label }}
          </span>
          <span
            v-if="col.subLabel != null"
            class="max-w-full truncate px-1 text-[9px] font-medium leading-none text-neutral-400 dark:text-neutral-500"
          >
            {{ col.subLabel }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>
