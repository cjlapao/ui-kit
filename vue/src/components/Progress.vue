<script lang="ts">
import type { ControlSize, TrueColor } from "../theme/Theme";

/** The shared control scale, so a bar lines up with the controls around it. */
export type ProgressSize = ControlSize;

export const PROGRESS_MOTIONS = [
  "none",
  "shimmer",
  "pulse",
  "shimmer-pulse",
  "stripes",
  "stripes-shimmer",
] as const;
export type ProgressMotion = (typeof PROGRESS_MOTIONS)[number];

export const PROGRESS_MOTION_SPEEDS = ["slow", "normal", "fast"] as const;
export type ProgressMotionSpeed = (typeof PROGRESS_MOTION_SPEEDS)[number];

export const PROGRESS_MOTION_DIRECTIONS = ["forward", "reverse"] as const;
export type ProgressMotionDirection =
  (typeof PROGRESS_MOTION_DIRECTIONS)[number];

export const PROGRESS_CORNERS = ["full", "rounded", "none"] as const;
export type ProgressCorner = (typeof PROGRESS_CORNERS)[number];

export interface ProgressProps {
  /** Current value, clamped between `min` and `max`. @default 0 */
  value?: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /**
   * Work is happening but its extent is unknown — the bar sweeps instead of
   * filling. `value` is ignored, and no `aria-valuenow` is published, which is
   * what tells assistive technology the progress is indeterminate.
   */
  indeterminate?: boolean;
  /** @default "md" */
  size?: ProgressSize;
  /** @default "blue" */
  color?: TrueColor;
  /** Alias for `color`, matching the input family's `tone`. */
  tone?: TrueColor;
  /** @default "full" */
  corner?: ProgressCorner;
  motion?: ProgressMotion;
  /** @default "normal" */
  motionSpeed?: ProgressMotionSpeed;
  /** @default "forward" */
  motionDirection?: ProgressMotionDirection;
  /**
   * Caption above the bar. Also becomes the bar's accessible name — a
   * `role="progressbar"` with no name is announced as just "progress bar".
   */
  label?: string;
  /** Show the value beside the label. @default false */
  showValue?: boolean;
  /**
   * Formats the displayed value and `aria-valuetext`. Defaults to a percentage
   * of the `min`–`max` range.
   */
  formatValue?: (value: number, percent: number) => string;
  /** Classes for the filled bar. */
  barClassName?: string;
  /**
   * @deprecated Use `motion="shimmer"` or `motion="none"`.
   */
  showShimmer?: boolean;
}

const HEIGHTS: Record<ProgressSize, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
  xl: "h-4",
};

const CORNERS: Record<ProgressCorner, string> = {
  full: "rounded-full",
  rounded: "rounded-sm",
  none: "rounded-none",
};

const SPEEDS: Record<ProgressMotionSpeed, string> = {
  slow: "2.4s",
  normal: "1.8s",
  fast: "1.2s",
};

/** The indeterminate sweep reads better a little slower than the shimmer. */
const INDETERMINATE_SPEEDS: Record<ProgressMotionSpeed, string> = {
  slow: "2.6s",
  normal: "1.9s",
  fast: "1.3s",
};
</script>

<script setup lang="ts">
import { computed, ref, useId, useSlots } from "vue";
import classNames from "classnames";
import { getLoaderProgressColors } from "../theme/Theme";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "Progress", inheritAttrs: false });

const props = withDefaults(defineProps<ProgressProps>(), {
  value: 0,
  min: 0,
  max: 100,
  indeterminate: false,
  size: "md",
  corner: "full",
  motionSpeed: "normal",
  motionDirection: "forward",
  showValue: false,
  showShimmer: true,
});

const { classAttr, restAttrs } = useClassAttrs();
const slots = useSlots();

const el = ref<HTMLDivElement | null>(null);
defineExpose({ el });

const labelId = useId();

const effectiveColor = computed(() => props.color ?? props.tone ?? "blue");
const palette = computed(() => getLoaderProgressColors(effectiveColor.value));
const trackHeight = computed(() => HEIGHTS[props.size] ?? HEIGHTS.md);
const cornerClass = computed(() => CORNERS[props.corner] ?? CORNERS.full);

// A zero-width range would divide by zero; treat it as "no progress".
const span = computed(() => props.max - props.min);
const clampedValue = computed(() =>
  Math.min(props.max, Math.max(props.min, props.value)),
);
const percent = computed(() =>
  span.value > 0
    ? Math.min(
        100,
        Math.max(0, ((clampedValue.value - props.min) / span.value) * 100),
      )
    : 0,
);

const resolvedMotion = computed<ProgressMotion>(
  () => props.motion ?? (props.showShimmer ? "shimmer" : "none"),
);
const showShimmerOverlay = computed(
  () =>
    !props.indeterminate &&
    (resolvedMotion.value === "shimmer" ||
      resolvedMotion.value === "shimmer-pulse" ||
      resolvedMotion.value === "stripes-shimmer"),
);
const showStripesOverlay = computed(
  () =>
    resolvedMotion.value === "stripes" ||
    resolvedMotion.value === "stripes-shimmer",
);
const pulseBar = computed(
  () =>
    !props.indeterminate &&
    (resolvedMotion.value === "pulse" ||
      resolvedMotion.value === "shimmer-pulse"),
);

// Custom properties rather than an inline `animation` shorthand: a
// `prefers-reduced-motion` media query cannot override an inline style, so the
// old version animated regardless of the user's setting.
const motionVars = computed(() => ({
  "--progress-duration": props.indeterminate
    ? (INDETERMINATE_SPEEDS[props.motionSpeed] ?? INDETERMINATE_SPEEDS.normal)
    : (SPEEDS[props.motionSpeed] ?? SPEEDS.normal),
  "--progress-direction":
    props.motionDirection === "reverse" ? "reverse" : "normal",
}));

const display = computed(() =>
  props.formatValue
    ? props.formatValue(clampedValue.value, percent.value)
    : `${Math.round(percent.value)}%`,
);

const hasLabel = computed(() => Boolean(props.label) || Boolean(slots.label));
const hasHeader = computed(() => hasLabel.value || props.showValue);

const trackClass = computed(() =>
  classNames(
    "relative w-full overflow-hidden shadow-inner",
    trackHeight.value,
    cornerClass.value,
    palette.value.track,
    !hasHeader.value && classAttr.value,
  ),
);

const barClass = computed(() =>
  classNames(
    "relative h-full overflow-hidden",
    cornerClass.value,
    palette.value.bar,
    props.indeterminate
      ? "progress-indeterminate absolute inset-y-0"
      : "transition-[width] duration-300 ease-out",
    pulseBar.value && "animate-pulse",
    props.barClassName,
  ),
);

const stripesStyle = {
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 12px, transparent 12px, transparent 24px)",
  backgroundSize: "34px 34px",
};
</script>

<template>
  <div
    v-if="hasHeader"
    ref="el"
    :class="classNames('w-full', classAttr)"
    v-bind="restAttrs"
  >
    <div class="mb-1.5 flex items-baseline justify-between gap-3">
      <span
        v-if="hasLabel"
        :id="labelId"
        class="text-xs font-medium text-neutral-700 dark:text-neutral-200"
      >
        <slot name="label">{{ label }}</slot>
      </span>
      <span
        v-if="showValue"
        class="text-xs tabular-nums text-neutral-500 dark:text-neutral-400"
      >
        {{ indeterminate ? "…" : display }}
      </span>
    </div>

    <div
      :class="trackClass"
      :style="motionVars"
      role="progressbar"
      :aria-valuenow="indeterminate ? undefined : clampedValue"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuetext="indeterminate ? undefined : display"
      :aria-labelledby="hasLabel ? labelId : undefined"
    >
      <div :class="barClass" :style="indeterminate ? undefined : { width: `${percent}%` }">
        <span
          v-if="showShimmerOverlay"
          aria-hidden="true"
          class="progress-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"
        />
        <span
          v-if="showStripesOverlay"
          aria-hidden="true"
          class="progress-stripes absolute inset-0"
          :style="stripesStyle"
        />
      </div>
    </div>
  </div>

  <div
    v-else
    ref="el"
    :class="trackClass"
    :style="motionVars"
    role="progressbar"
    :aria-valuenow="indeterminate ? undefined : clampedValue"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuetext="indeterminate ? undefined : display"
    v-bind="restAttrs"
  >
    <div :class="barClass" :style="indeterminate ? undefined : { width: `${percent}%` }">
      <span
        v-if="showShimmerOverlay"
        aria-hidden="true"
        class="progress-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"
      />
      <span
        v-if="showStripesOverlay"
        aria-hidden="true"
        class="progress-stripes absolute inset-0"
        :style="stripesStyle"
      />
    </div>
  </div>
</template>
