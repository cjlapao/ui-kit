<script lang="ts">
import type { TrueColor } from "../theme";
import type { IconName } from "../icons/registry";
import type { StatTileProps } from "./StatTile.vue";

export interface StatGoalItem {
  value: number;
  label: string;
  icon: IconName;
  /** Omit to auto-assign from the theme palette. */
  color?: TrueColor;
  tooltip?: string;
}

export interface StatGoalTileProps
  extends Omit<StatTileProps, "body" | "value" | "subtitle"> {
  goals: StatGoalItem[];
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import StatTile from "./StatTile.vue";
import CustomIcon from "./CustomIcon.vue";
import { getColorPaletteNames } from "../theme";

defineOptions({ name: "StatGoalTile" });

const props = defineProps<StatGoalTileProps>();

const resolvedGoals = computed(() => {
  const palette = getColorPaletteNames(props.goals.length);
  return props.goals.map((g, i) => ({
    ...g,
    color: (g.color ?? palette[i]) as TrueColor,
  }));
});

const statTileProps = computed(() => {
  const { goals: _goals, ...rest } = props;
  return rest;
});

// CircularProgress geometry (React kit defaults: size = 56, strokeWidth = 4)
const size = 56;
const strokeWidth = 4;
const radius = (size - strokeWidth) / 2 - 1;
const circumference = radius * 2 * Math.PI;
const offsetFor = (value: number) =>
  circumference - (value / 100) * circumference;

// Map theme colors to hex or specific tailwind classes for stroke
// Since we can't easily adhere to "stroke-current" with dynamic colors in SVG stroke attribute without complex mapping or specific classes
// We will use standard tailwind text classes on the SVG and use `stroke="currentColor"`
</script>

<template>
  <StatTile v-bind="statTileProps">
    <template v-if="$slots.title" #title><slot name="title" /></template>
    <template v-if="$slots.actions" #actions><slot name="actions" /></template>
    <template #body>
      <div class="flex flex-col h-full justify-center">
        <template v-for="(goal, idx) in resolvedGoals" :key="idx">
          <div
            class="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
            :title="goal.tooltip"
          >
            <div
              class="relative inline-flex items-center justify-center shrink-0"
              :style="{ width: `${size}px`, height: `${size}px` }"
            >
              <svg class="transform -rotate-90 w-full h-full overflow-visible">
                <!-- Background Circle -->
                <circle
                  class="text-neutral-100 dark:text-neutral-800"
                  :stroke-width="strokeWidth"
                  stroke="currentColor"
                  fill="transparent"
                  :r="radius"
                  :cx="size / 2"
                  :cy="size / 2"
                />
                <!-- Progress Circle -->
                <circle
                  :class="`text-${goal.color}-500 transition-all duration-1000 ease-out`"
                  :stroke-width="strokeWidth"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="offsetFor(goal.value)"
                  stroke-linecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  :r="radius"
                  :cx="size / 2"
                  :cy="size / 2"
                />
              </svg>
              <div :class="`absolute text-${goal.color}-500`">
                <CustomIcon :icon="goal.icon" size="md" />
              </div>
            </div>
            <div class="flex flex-col">
              <span
                class="text-2xl font-bold text-neutral-900 dark:text-white leading-none"
              >
                {{ goal.value }}%
              </span>
              <span
                class="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-1"
              >
                {{ goal.label }}
              </span>
            </div>
          </div>
          <div
            v-if="idx < goals.length - 1"
            class="h-px bg-neutral-100 dark:bg-neutral-800 my-1 w-full"
          />
        </template>
      </div>
    </template>
  </StatTile>
</template>
