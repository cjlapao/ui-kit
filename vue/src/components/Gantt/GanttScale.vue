<script lang="ts">
import type { GanttTimeScaleLevel } from "../../../../common/gantt";
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
            'flex shrink-0 flex-col items-center justify-center overflow-hidden border-r border-neutral-200/70 dark:border-neutral-800/70',
            li === 0 ? 'bg-neutral-50/60 dark:bg-neutral-800/40' : 'bg-white dark:bg-neutral-900',
          )
        "
        :style="{ width: col.width + 'px' }"
      >
        <span
          :class="
            classNames(
              'max-w-full truncate px-1 text-[10px] font-semibold uppercase leading-none tracking-wide',
              li === 0
                ? 'text-neutral-700 dark:text-neutral-200'
                : 'text-neutral-500 dark:text-neutral-400',
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
      </div>
    </div>
  </div>
</template>
