<script lang="ts">
import type { VNode } from "vue";
import type { ControlSize, TrueColor } from "../theme/Theme";

export interface MultiProgressBarSeries {
  key: string;
  label: string;
  labelClassName?: string;
  value: number;
  /** Accent for this segment. Omit to auto-assign from the theme palette. */
  tone?: TrueColor;
  /**
   * @deprecated Use `tone`. A raw class here cannot be dimmed or safelisted
   * with the rest, and callers were passing shades the palette never emits.
   */
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
  /** @default "md" */
  size?: ControlSize;
  /** Hide the legend under the bar. */
  hideLegend?: boolean;
}

const SIZE_TOKENS: Record<
  ControlSize,
  { track: string; label: string; meta: string; dot: string; dotActive: string }
> = {
  xs: { track: "h-1.5", label: "text-xs", meta: "text-[10px]", dot: "w-1.5 h-1.5", dotActive: "w-2 h-2" },
  sm: { track: "h-2", label: "text-xs", meta: "text-[11px]", dot: "w-2 h-2", dotActive: "w-2.5 h-2.5" },
  md: { track: "h-2.5", label: "text-sm", meta: "text-xs", dot: "w-2 h-2", dotActive: "w-3 h-3" },
  lg: { track: "h-3", label: "text-base", meta: "text-sm", dot: "w-2.5 h-2.5", dotActive: "w-3.5 h-3.5" },
  xl: { track: "h-4", label: "text-lg", meta: "text-base", dot: "w-3 h-3", dotActive: "w-4 h-4" },
};

interface TooltipState {
  key: string;
  x: number;
  y: number;
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import classNames from "classnames";
import { getColorPaletteNames, hasTextColor } from "../theme";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "MultiProgressBar" });

const props = withDefaults(defineProps<MultiProgressBarProps>(), {
  size: "md",
  hideLegend: false,
});

const tokens = computed(() => SIZE_TOKENS[props.size] ?? SIZE_TOKENS.md);

/**
 * Vue has no `SurfaceProvider`, so the solid-surface tokens are spelled out.
 * They are the same strings `getSurfaceTextTokens("elevated")` returns.
 */
const T = {
  heading: "text-neutral-900 dark:text-neutral-100",
  body: "text-neutral-700 dark:text-neutral-300",
  muted: "text-neutral-500 dark:text-neutral-400",
};

const slots = defineSlots<{
  secondaryLabel?: () => unknown;
  totalLabel?: () => unknown;
}>();

const hoveredKey = ref<string | null>(null);
const tooltip = ref<TooltipState | null>(null);
const barRef = ref<HTMLDivElement | null>(null);

const resolvedSeries = computed(() => {
  const palette = getColorPaletteNames(props.series.length);
  // A raw `color` class still wins, so existing call sites keep working.
  return props.series.map((s, i) => ({
    ...s,
    fill: s.color ?? `bg-${s.tone ?? palette[i]}-500`,
  }));
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

const labelClasses = computed(() =>
  classNames(
    tokens.value.label,
    "font-semibold",
    !hasTextColor(props.labelClassName) && T.heading,
    props.labelClassName,
  ),
);
const secondaryLabelClasses = computed(() =>
  classNames(
    tokens.value.meta,
    "mt-0.5",
    !hasTextColor(props.secondaryLabelClassName) && T.muted,
    props.secondaryLabelClassName,
  ),
);

/**
 * A stacked bar is a picture of a breakdown, so it gets one text alternative
 * naming every slice. Previously the whole chart was invisible to a screen
 * reader: no role, no label, and the numbers lived only in a hover tooltip.
 */
const summary = computed(() =>
  segments.value
    .map((s) => `${s.label}: ${s.value} (${s.pct.toFixed(1)}%)`)
    .join(", "),
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
        :class="classNames(tokens.meta, 'font-medium', T.muted)"
      >
        <slot name="totalLabel">{{ totalLabel }}</slot>
      </span>
    </div>

    <!-- Bar -->
    <div ref="barRef" class="relative py-2">
      <div
        role="img"
        :aria-label="summary ? `${label} — ${summary}` : label"
        :class="
          classNames(
            'rounded-full overflow-hidden bg-black/10 dark:bg-white/10 shadow-inner',
            tokens.track,
          )
        "
      >
        <div class="flex h-full w-full">
          <div
            v-for="s in segments"
            :key="s.key"
            :class="
              classNames(
                'h-full cursor-pointer transition-all duration-200 ease-out',
                s.fill,
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
    <div
      v-if="!hideLegend"
      class="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1"
    >
      <span
        v-for="s in resolvedSeries"
        :key="s.key"
        :class="
          classNames(
            'flex items-center gap-1.5 whitespace-nowrap cursor-pointer select-none',
            tokens.meta,
            'transition-all duration-200',
            hoveredKey === s.key
              ? T.heading
              : hoveredKey !== null
                ? 'opacity-40'
                : T.muted,
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
              s.fill,
              hoveredKey === s.key
                ? classNames(tokens.dotActive, 'shadow-md brightness-110')
                : tokens.dot,
              hoveredKey !== null && hoveredKey !== s.key && 'opacity-30',
            )
          "
        />
        <!-- Value -->
        <span
          :class="
            classNames(
              'font-semibold transition-colors duration-200',
              hoveredKey === s.key ? T.heading : T.body,
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
