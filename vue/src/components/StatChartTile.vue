<script lang="ts">
import type { TrueColor } from "../theme";
import type { StatTileProps } from "./StatTile.vue";

export interface StatChartItem {
  label: string;
  value: number;
  /** Omit to auto-assign from the theme palette. */
  color?: TrueColor;
  intensity?: string;
  onClick?: () => void;
}

export interface StatChartDataset {
  id: string | number;
  label: string;
  centerLabel: string;
  items: StatChartItem[];
}

export interface StatChartTileProps
  extends Omit<StatTileProps, "body" | "title" | "value" | "subtitle"> {
  data: StatChartDataset[];
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import classNames from "classnames";
import StatTile from "./StatTile.vue";
import CustomIcon from "./CustomIcon.vue";
import { getColorPaletteNames } from "../theme";

defineOptions({ name: "StatChartTile" });

const props = defineProps<StatChartTileProps>();

const currentIndex = ref(0);
const hoveredIndex = ref<number | null>(null);

const currentDataset = computed(() => props.data[currentIndex.value]);

const resolvedItems = computed(() => {
  const palette = getColorPaletteNames(currentDataset.value.items.length);
  return currentDataset.value.items.map((item, i) => ({
    ...item,
    color: (item.color ?? palette[i]) as TrueColor,
  }));
});

const total = computed(() =>
  currentDataset.value.items.reduce((acc, item) => acc + item.value, 0),
);

const handlePrev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
  }
};

const handleNext = () => {
  if (currentIndex.value < props.data.length - 1) {
    currentIndex.value += 1;
  }
};

// Chart dimensions
const size = 200;
const strokeWidth = 12; // Thicker stroke for donut
const radius = (size - strokeWidth) / 2 - 1; // -1 for buffer
const circumference = radius * 2 * Math.PI;

// Calculate segments
const segments = computed(() => {
  let cumulativePercent = 0;
  return total.value === 0
    ? [
        {
          label: "",
          value: 0,
          color: "neutral",
          intensity: "200",
          dashArray: `${circumference} ${circumference}`,
          dashOffset: 0,
          onClick: undefined as (() => void) | undefined,
        },
      ]
    : resolvedItems.value.map((item) => {
        const percent = item.value / total.value;
        const dashArray = `${circumference * percent} ${circumference}`;
        const dashOffset = -circumference * cumulativePercent;
        cumulativePercent += percent;
        return {
          ...item,
          dashArray,
          dashOffset,
        };
      });
});

const hoveredSegment = computed(() =>
  hoveredIndex.value !== null && total.value > 0
    ? segments.value[hoveredIndex.value]
    : null,
);

const onSegmentClick = (e: MouseEvent, segment: { onClick?: () => void }) => {
  if (total.value > 0 && segment.onClick) {
    e.stopPropagation();
    segment.onClick();
  }
};

const statTileProps = computed(() => {
  const { data: _data, ...rest } = props;
  return rest;
});
</script>

<template>
  <StatTile v-bind="statTileProps">
    <template v-if="$slots.actions" #actions><slot name="actions" /></template>
    <template #body>
      <div class="flex flex-col h-full">
        <!-- Header with Navigation -->
        <div class="flex justify-between items-center mb-2 px-2">
          <button
            :disabled="currentIndex === 0"
            :class="
              classNames(
                'p-1 rounded-full transition-colors',
                currentIndex === 0
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800',
                data.length <= 1 && 'invisible',
              )
            "
            @click="handlePrev"
          >
            <CustomIcon icon="ArrowChevronLeft" size="sm" />
          </button>

          <span
            class="font-bold text-neutral-900 dark:text-white flex-1 text-center"
          >
            {{ currentDataset.label }}
          </span>

          <button
            :disabled="currentIndex === data.length - 1"
            :class="
              classNames(
                'p-1 rounded-full transition-colors',
                currentIndex === data.length - 1
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800',
                data.length <= 1 && 'invisible',
              )
            "
            @click="handleNext"
          >
            <CustomIcon icon="ArrowChevronRight" size="sm" />
          </button>
        </div>

        <!-- Chart Area -->
        <div
          class="relative flex-1 flex items-center justify-center min-h-55"
        >
          <svg
            class="transform -rotate-90 w-48 h-48 overflow-visible"
            :viewBox="`0 0 ${size} ${size}`"
          >
            <!-- Background Circle (Optional, maybe not needed if full 100%) -->
            <circle
              class="text-neutral-100 dark:text-neutral-800"
              :stroke-width="strokeWidth"
              stroke="currentColor"
              fill="none"
              :r="radius"
              :cx="size / 2"
              :cy="size / 2"
            />

            <!-- Segments - Render non-hovered first -->
            <template v-for="(segment, idx) in segments" :key="idx">
              <circle
                v-if="!(idx === hoveredIndex && total > 0)"
                :class="
                  classNames(
                    `text-${segment.color}-${segment.intensity || '500'} transition-all duration-300 ease-out origin-center`,
                    total > 0 &&
                      'hover:scale-110 hover:drop-shadow-lg cursor-pointer hover:opacity-90',
                  )
                "
                :stroke-width="strokeWidth"
                :stroke-dasharray="segment.dashArray"
                :stroke-dashoffset="segment.dashOffset"
                :stroke-linecap="total > 0 ? 'round' : undefined"
                stroke="currentColor"
                fill="none"
                :r="radius"
                :cx="size / 2"
                :cy="size / 2"
                @mouseenter="total > 0 && (hoveredIndex = idx)"
                @mouseleave="hoveredIndex = null"
                @click="(e: MouseEvent) => onSegmentClick(e, segment)"
              >
                <title v-if="total > 0">
                  {{ segment.label }}: {{ segment.value }}
                </title>
              </circle>
            </template>

            <!-- Render Hovered Segment Last (On Top) -->
            <circle
              v-if="hoveredSegment"
              :class="
                classNames(
                  `text-${hoveredSegment.color}-${hoveredSegment.intensity || '500'} transition-all duration-300 ease-out origin-center scale-110 drop-shadow-lg cursor-pointer opacity-90`,
                )
              "
              :stroke-width="strokeWidth"
              :stroke-dasharray="hoveredSegment.dashArray"
              :stroke-dashoffset="hoveredSegment.dashOffset"
              stroke-linecap="round"
              stroke="currentColor"
              fill="none"
              :r="radius"
              :cx="size / 2"
              :cy="size / 2"
              @mouseleave="hoveredIndex = null"
              @click="(e: MouseEvent) => onSegmentClick(e, hoveredSegment!)"
            >
              <title>{{ hoveredSegment.label }}: {{ hoveredSegment.value }}</title>
            </circle>
          </svg>

          <!-- Center Text -->
          <div
            class="absolute flex flex-col items-center justify-center text-center max-w-30"
          >
            <span
              class="text-4xl font-bold text-neutral-900 dark:text-white leading-none mb-1"
            >
              {{ total }}
            </span>
            <span
              class="text-sm font-medium text-neutral-500 dark:text-neutral-400 leading-tight"
            >
              {{ currentDataset.centerLabel }}
            </span>
          </div>
        </div>

        <!-- Legend -->
        <div v-if="total > 0" class="grid grid-cols-2 gap-x-6 gap-y-3 mt-4 px-2">
          <div
            v-for="(item, idx) in resolvedItems"
            :key="idx"
            :class="
              classNames(
                'flex items-center justify-between min-w-0 group',
                item.onClick
                  ? 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded px-1 -mx-1'
                  : 'cursor-default',
              )
            "
            :title="`${item.label}: ${item.value}`"
            @click="item.onClick && item.onClick()"
          >
            <div class="flex items-center min-w-0 mr-2">
              <div
                :class="`w-2.5 h-2.5 flex-none rounded-full bg-${item.color}-500 mr-2`"
              />
              <span
                class="text-xs text-neutral-600 dark:text-neutral-300 truncate group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
              >
                {{ item.label }}
              </span>
            </div>
            <span
              class="text-xs font-bold text-neutral-900 dark:text-white flex-none"
            >
              {{ item.value }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </StatTile>
</template>
