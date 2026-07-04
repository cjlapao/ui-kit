<script lang="ts">
import type { VNode } from "vue";

export interface MultiProgressBarSeries {
  key: string;
  label: string;
  labelClassName?: string;
  value: number;
  /** Tailwind bg color class e.g., 'bg-rose-500'. Omit to auto-assign from the theme palette. */
  color?: string;
  /** Custom formatted value to display in legend, if omitted `value` is used */
  displayValue?: string | number | VNode;
}

export interface MultiProgressBarProps {
  label: string;
  labelClassName?: string;
  secondaryLabel?: string;
  secondaryLabelClassName?: string;
  totalLabel?: string;
  total: number;
  series: MultiProgressBarSeries[];
}

interface TooltipState {
  key: string;
  x: number;
  y: number;
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import classNames from "classnames";
import { getColorPalette } from "../theme";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "MultiProgressBar" });

const props = defineProps<MultiProgressBarProps>();

const slots = defineSlots<{
  secondaryLabel?: () => unknown;
  totalLabel?: () => unknown;
}>();

const hoveredKey = ref<string | null>(null);
const tooltip = ref<TooltipState | null>(null);
const barRef = ref<HTMLDivElement | null>(null);

const resolvedSeries = computed(() => {
  const palette = getColorPalette(props.series.length, "bg");
  return props.series.map((s, i) => ({ ...s, color: s.color ?? palette[i] }));
});

const defaultTotal = computed(() => props.total || 1);
const totalValue = computed(() =>
  resolvedSeries.value.reduce(
    (acc, curr) => acc + (curr.value > 0 ? curr.value : 0),
    0,
  ),
);
const normalizationFactor = computed(() =>
  totalValue.value > defaultTotal.value
    ? defaultTotal.value / totalValue.value
    : 1,
);

const labelClasses = computed(
  () =>
    props.labelClassName ||
    "text-sm font-semibold text-neutral-800 dark:text-neutral-200",
);
const secondaryLabelClasses = computed(
  () =>
    props.secondaryLabelClassName ||
    "text-xs text-neutral-500 dark:text-neutral-400 mt-0.5",
);

const hasSecondaryLabel = computed(
  () => Boolean(props.secondaryLabel) || Boolean(slots.secondaryLabel),
);
const hasTotalLabel = computed(
  () => Boolean(props.totalLabel) || Boolean(slots.totalLabel),
);

const segments = computed(() => {
  let cumulativePct = 0;
  return resolvedSeries.value
    .filter((s) => s.value > 0)
    .map((s) => {
      const pct = Math.min(
        100,
        ((s.value * normalizationFactor.value) / defaultTotal.value) * 100,
      );
      const centerPct = cumulativePct + pct / 2;
      cumulativePct += pct;
      return { ...s, pct, centerPct };
    });
});

const handleSegmentEnter = (key: string, e: MouseEvent) => {
  hoveredKey.value = key;
  tooltip.value = { key, x: e.clientX, y: e.clientY };
};

const handleSegmentMove = (key: string, e: MouseEvent) => {
  tooltip.value = { key, x: e.clientX, y: e.clientY };
};

const handleSegmentLeave = () => {
  hoveredKey.value = null;
  tooltip.value = null;
};

const tooltipSegment = computed(() =>
  tooltip.value
    ? segments.value.find((s) => s.key === tooltip.value?.key)
    : null,
);
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-start justify-between mb-2">
      <div class="flex flex-col">
        <span :class="classNames(labelClasses)">{{ label }}</span>
        <span v-if="hasSecondaryLabel" :class="classNames(secondaryLabelClasses)">
          <slot name="secondaryLabel">{{ secondaryLabel }}</slot>
        </span>
      </div>
      <span
        v-if="hasTotalLabel"
        class="text-xs font-medium text-neutral-500 dark:text-neutral-400"
      >
        <slot name="totalLabel">{{ totalLabel }}</slot>
      </span>
    </div>

    <!-- Bar -->
    <div ref="barRef" class="relative py-2">
      <div
        class="h-2.5 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-inner"
      >
        <div class="flex h-full w-full">
          <div
            v-for="s in segments"
            :key="s.key"
            :class="
              classNames(
                'h-full cursor-pointer transition-all duration-200 ease-out',
                s.color,
                hoveredKey === s.key && 'brightness-110',
                hoveredKey !== null && hoveredKey !== s.key && 'opacity-25',
              )
            "
            :style="{ width: `${s.pct}%` }"
            @mouseenter="handleSegmentEnter(s.key, $event)"
            @mousemove="handleSegmentMove(s.key, $event)"
            @mouseleave="handleSegmentLeave"
          />
        </div>
      </div>
    </div>

    <!-- Tooltip — rendered in a portal so no ancestor overflow:hidden can clip it -->
    <Teleport to="body">
      <div
        v-if="tooltip && tooltipSegment"
        class="fixed z-[9999] pointer-events-none"
        :style="{
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
          transform: 'translate(-50%, calc(-100% - 12px))',
        }"
      >
        <div
          class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl ring-1 ring-black/10 dark:ring-black/5"
        >
          <p class="font-semibold leading-tight">
            {{ tooltipSegment.label }}
          </p>
          <p class="text-neutral-400 dark:text-neutral-500 mt-0.5">
            <VNodeRenderer
              :nodes="tooltipSegment.displayValue ?? tooltipSegment.value"
            />
            <span class="mx-1 opacity-40">·</span>
            {{ tooltipSegment.pct.toFixed(1) }}%
          </p>
        </div>
        <!-- Arrow -->
        <div
          class="absolute top-full left-1/2 -translate-x-1/2 border-x-[5px] border-x-transparent border-t-[5px] border-t-neutral-900 dark:border-t-white"
        />
      </div>
    </Teleport>

    <!-- Legend -->
    <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1">
      <span
        v-for="s in resolvedSeries"
        :key="s.key"
        :class="
          classNames(
            'flex items-center gap-1.5 whitespace-nowrap cursor-pointer select-none',
            'text-xs transition-all duration-200',
            hoveredKey === s.key
              ? 'text-neutral-800 dark:text-neutral-100'
              : hoveredKey !== null
                ? 'text-neutral-300 dark:text-neutral-600'
                : 'text-neutral-500 dark:text-neutral-400',
          )
        "
        @mouseenter="hoveredKey = s.key"
        @mouseleave="hoveredKey = null"
      >
        <!-- Dot — grows and glows on hover -->
        <span
          :class="
            classNames(
              'inline-block rounded-full transition-all duration-200',
              s.color,
              hoveredKey === s.key
                ? 'w-3 h-3 shadow-md brightness-110'
                : 'w-2 h-2',
              hoveredKey !== null && hoveredKey !== s.key && 'opacity-30',
            )
          "
        />
        <!-- Value -->
        <span
          :class="
            classNames(
              'font-semibold transition-colors duration-200',
              hoveredKey === s.key
                ? 'text-neutral-900 dark:text-neutral-50'
                : hoveredKey !== null
                  ? 'text-neutral-300 dark:text-neutral-600'
                  : 'text-neutral-700 dark:text-neutral-300',
            )
          "
        >
          <VNodeRenderer :nodes="s.displayValue ?? s.value" />
        </span>
        {{ s.label }}
      </span>
    </div>
  </div>
</template>
