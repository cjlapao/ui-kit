<script lang="ts">
import type { ControlSize, TrueColor } from "../theme/Theme";

export interface MetricBarProps {
  /** Caption on the left. Also becomes the bar's accessible name. */
  label: string;
  /**
   * Free-form reading shown on the right — "12 / 20 GB", "4 runs", "87%".
   * This is display text, not the bar's geometry: `percentage` drives the fill.
   */
  value?: string | number;
  /** Fill percentage, 0–100. */
  percentage: number;
  /** @default "blue" */
  color?: TrueColor;
  /** Alias for `color`, matching the rest of the kit. */
  tone?: TrueColor;
  /** @default "sm" */
  size?: ControlSize;
  /** @deprecated Use Progress's `motion="shimmer"`. */
  showShimmer?: boolean;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import Progress from "./Progress.vue";
import { useClassAttrs } from "../utils/attrsUtils";

/**
 * A labelled progress row: caption on the left, reading on the right, bar
 * underneath.
 *
 * It renders `Progress` rather than drawing its own header. The hand-rolled
 * one published no accessible name, so the `role="progressbar"` underneath it
 * was announced as just "progress bar" — `Progress` already wires its `label`
 * as `aria-labelledby`. That also brings the whole size ladder, every tone and
 * the motion props, none of which this component used to expose.
 */
defineOptions({ name: "MetricBar", inheritAttrs: false });

const props = withDefaults(defineProps<MetricBarProps>(), {
  size: "sm",
  showShimmer: undefined,
});

const { classAttr, restAttrs } = useClassAttrs();

const rootClass = computed(() => classNames("w-full", classAttr.value));
const resolvedColor = computed(() => props.tone ?? props.color ?? "blue");
const formatValue = computed(() =>
  props.value !== undefined ? () => String(props.value) : undefined,
);
</script>

<template>
  <Progress
    v-bind="restAttrs"
    :class="rootClass"
    :value="percentage"
    :label="label"
    :show-value="value !== undefined"
    :format-value="formatValue"
    :size="size"
    :color="resolvedColor"
    :show-shimmer="showShimmer"
  />
</template>
