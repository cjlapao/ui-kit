<script lang="ts">
import type { SpinnerColor } from "./Spinner.vue";

export type ProgressSize = "xs" | "sm" | "md" | "lg";
export type ProgressMotion =
  | "none"
  | "shimmer"
  | "pulse"
  | "shimmer-pulse"
  | "stripes"
  | "stripes-shimmer";
export type ProgressMotionSpeed = "slow" | "normal" | "fast";
export type ProgressMotionDirection = "forward" | "reverse";

export interface ProgressProps {
  value?: number;
  size?: ProgressSize;
  color?: SpinnerColor;
  motion?: ProgressMotion;
  motionSpeed?: ProgressMotionSpeed;
  motionDirection?: ProgressMotionDirection;
  /**
   * @deprecated Use `motion="shimmer"` or `motion="none"` instead.
   */
  showShimmer?: boolean;
}

const heightTokens: Record<ProgressSize, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

const speedSeconds: Record<ProgressMotionSpeed, string> = {
  slow: "2.4s",
  normal: "1.8s",
  fast: "1.2s",
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import classNames from "classnames";
import { getLoaderProgressColors } from "../theme/Theme";
import { useClassAttrs } from "../utils/attrsUtils";
import "../../../react/src/components/progress-animations.css";

defineOptions({ name: "Progress", inheritAttrs: false });

const props = withDefaults(defineProps<ProgressProps>(), {
  value: 0,
  size: "md",
  color: "blue",
  motionSpeed: "normal",
  motionDirection: "forward",
  showShimmer: true,
});

const { classAttr, restAttrs } = useClassAttrs();

const el = ref<HTMLDivElement | null>(null);
defineExpose({ el });

const clamped = computed(() =>
  Math.min(100, Math.max(0, Math.round(props.value))),
);
const palette = computed(() => getLoaderProgressColors(props.color));
const trackHeight = computed(() => heightTokens[props.size] ?? heightTokens.md);
const resolvedMotion = computed<ProgressMotion>(
  () => props.motion ?? (props.showShimmer ? "shimmer" : "none"),
);
const showShimmerOverlay = computed(
  () =>
    resolvedMotion.value === "shimmer" ||
    resolvedMotion.value === "shimmer-pulse" ||
    resolvedMotion.value === "stripes-shimmer",
);
const showStripesOverlay = computed(
  () =>
    resolvedMotion.value === "stripes" ||
    resolvedMotion.value === "stripes-shimmer",
);
const pulseBar = computed(
  () =>
    resolvedMotion.value === "pulse" || resolvedMotion.value === "shimmer-pulse",
);

const duration = computed(
  () => speedSeconds[props.motionSpeed] ?? speedSeconds.normal,
);
const direction = computed(() =>
  props.motionDirection === "reverse" ? "reverse" : "normal",
);

const trackClass = computed(() =>
  classNames(
    "relative w-full overflow-hidden rounded-full shadow-inner",
    trackHeight.value,
    palette.value.track,
    classAttr.value,
  ),
);

const barClass = computed(() =>
  classNames(
    "relative h-full overflow-hidden rounded-full transition-[width] duration-300 ease-out",
    pulseBar.value && "animate-pulse",
    palette.value.bar,
  ),
);
</script>

<template>
  <div
    ref="el"
    :class="trackClass"
    role="progressbar"
    :aria-valuenow="clamped"
    :aria-valuemin="0"
    :aria-valuemax="100"
    v-bind="restAttrs"
  >
    <div :class="barClass" :style="{ width: `${clamped}%` }">
      <span
        v-if="showShimmerOverlay"
        class="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"
        :style="{
          animation: `progress-shimmer ${duration} linear infinite`,
          animationDirection: direction,
        }"
      />
      <span
        v-if="showStripesOverlay"
        class="absolute inset-0"
        :style="{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 12px, transparent 12px, transparent 24px)',
          backgroundSize: '34px 34px',
          animation: `progress-stripes ${duration} linear infinite`,
          animationDirection: direction,
        }"
      />
    </div>
  </div>
</template>
