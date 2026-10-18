<script lang="ts">
import {
  getProgressSpinnerToneTokens,
  type ControlSize,
  type TrueColor,
} from "../theme/Theme";
import type { SpinnerThickness } from "./Spinner.vue";

/**
 * The shared control scale, so a progress spinner lines up with the `Spinner`
 * and `Button` next to it instead of speaking its own size language.
 */
export type ProgressSpinnerSize = ControlSize;
export type ProgressSpinnerColor = TrueColor;

export interface ProgressSpinnerProps {
  /**
   * Progress value. Omit it for an indeterminate spinner — the two modes are
   * the same component with different ARIA, the way `role="progressbar"` is
   * specified. Values outside `[min, max]` are clamped.
   */
  value?: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default "md" */
  size?: ProgressSpinnerSize;
  /** @default "blue" */
  color?: ProgressSpinnerColor;
  /** @default "normal" */
  thickness?: SpinnerThickness;
  /**
   * One revolution in indeterminate mode. The dash animation runs at 3/4 of
   * this, so a single value sets the whole tempo.
   * @default "2s"
   */
  animationDuration?: string;
  /** Centre percentage readout, determinate mode only. @default true */
  showValue?: boolean;
  /** @default "Loading" */
  ariaLabel?: string;
}
</script>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import classNames from "classnames";
import { useKitT } from "../i18n";

defineOptions({ inheritAttrs: false });

const t = useKitT();

const props = withDefaults(defineProps<ProgressSpinnerProps>(), {
  min: 0,
  max: 100,
  size: "md",
  color: "blue",
  thickness: "normal",
  animationDuration: "2s",
  showValue: true,
});

const attrs = useAttrs();

const VIEWBOX = 50;
const CENTER = VIEWBOX / 2;

/**
 * The centre readout sits *inside* the ring, so it stays well under the
 * control size — at xl the ring's clear diameter is ~31px and a 14px "100%"
 * already crowds it. Mirrors the React component exactly, because the two are
 * expected to sit side by side at identical weight.
 */
const sizeTokens: Record<
  ProgressSpinnerSize,
  { diameter: string; px: number; value: string }
> = {
  xs: { diameter: "h-4 w-4", px: 16, value: "text-[6px]" },
  sm: { diameter: "h-5 w-5", px: 20, value: "text-[7px]" },
  md: { diameter: "h-6 w-6", px: 24, value: "text-[8px]" },
  lg: { diameter: "h-8 w-8", px: 32, value: "text-[10px]" },
  xl: { diameter: "h-10 w-10", px: 40, value: "text-xs" },
};

/** Rendered stroke in px, matching `Spinner`'s border map size-for-size. */
const strokePx: Record<ProgressSpinnerSize, Record<SpinnerThickness, number>> = {
  xs: { thin: 1, normal: 2, thick: 4 },
  sm: { thin: 1.5, normal: 2, thick: 4 },
  md: { thin: 3, normal: 3.5, thick: 4.5 },
  lg: { thin: 3.5, normal: 4, thick: 5 },
  xl: { thin: 4, normal: 4.5, thick: 5.5 },
};

const geometry = computed(() => sizeTokens[props.size] ?? sizeTokens.md);
const width = computed(
  () => (strokePx[props.size] ?? strokePx.md)[props.thickness] ?? 4,
);

// The SVG scales with the container, so the px width converts into viewBox
// units — otherwise "normal" would be a different physical weight at every
// size. The radius pulls in to match, or the thick strokes clip at the edge.
const strokeWidth = computed(
  () => (width.value * VIEWBOX) / geometry.value.px,
);
const radius = computed(() => CENTER - strokeWidth.value / 2 - 0.5);
const circumference = computed(() => 2 * Math.PI * radius.value);

const tone = computed(() => getProgressSpinnerToneTokens(props.color));

const determinate = computed(() => props.value !== undefined);
const span = computed(() => props.max - props.min);
const clamped = computed(() =>
  props.value !== undefined
    ? Math.min(Math.max(props.value, props.min), props.max)
    : props.min,
);
const percent = computed(() =>
  span.value > 0 ? ((clamped.value - props.min) / span.value) * 100 : 0,
);

const rootClass = computed(() =>
  classNames("relative inline-flex", geometry.value.diameter, attrs.class as string),
);
</script>

<template>
  <div
    role="progressbar"
    :aria-label="ariaLabel ?? t('kit.progressspinner.loading')"
    :aria-valuemin="determinate ? min : undefined"
    :aria-valuemax="determinate ? max : undefined"
    :aria-valuenow="determinate ? clamped : undefined"
    :aria-valuetext="determinate ? `${Math.round(percent)}%` : undefined"
    :class="rootClass"
    v-bind="{ ...attrs, class: undefined }"
  >
    <svg
      aria-hidden="true"
      class="block h-full w-full"
      :class="!determinate && 'progress-spinner-rotate'"
      :style="{ '--progress-spinner-duration': animationDuration }"
      :viewBox="`0 0 ${VIEWBOX} ${VIEWBOX}`"
    >
      <circle
        :cx="CENTER"
        :cy="CENTER"
        :r="radius"
        fill="none"
        :stroke="tone.track"
        :stroke-width="strokeWidth"
      />
      <circle
        v-if="determinate"
        :cx="CENTER"
        :cy="CENTER"
        :r="radius"
        fill="none"
        :stroke="tone.arc"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="`${(percent / 100) * circumference} ${circumference}`"
        :transform="`rotate(-90 ${CENTER} ${CENTER})`"
        :style="{ transition: 'stroke-dasharray 200ms ease-out' }"
      />
      <circle
        v-else
        class="progress-spinner-dash"
        :cx="CENTER"
        :cy="CENTER"
        :r="radius"
        fill="none"
        :stroke="tone.arc"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
      />
    </svg>
    <span
      v-if="determinate && showValue"
      class="absolute inset-0 flex items-center justify-center font-semibold tabular-nums text-neutral-700 dark:text-neutral-200"
      :class="geometry.value"
    >
      {{ Math.round(percent) }}%
    </span>
  </div>
</template>
