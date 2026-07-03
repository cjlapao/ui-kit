<script lang="ts">
import type { SpinnerColor } from "./Spinner.vue";

export interface MetricBarProps {
  label: string;
  value: string;
  percentage: number;
  color?: SpinnerColor;
  showShimmer?: boolean;
}

// Named export for parity with the React kit (`export const MetricBar = ...`).
export { default as MetricBar } from "./MetricBar.vue";
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import Progress from "./Progress.vue";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "MetricBar", inheritAttrs: false });

withDefaults(defineProps<MetricBarProps>(), {
  color: "blue",
  showShimmer: false,
});

const { classAttr, restAttrs } = useClassAttrs();

const rootClass = computed(() =>
  classNames("flex flex-col gap-1.5 w-full", classAttr.value),
);
</script>

<template>
  <div :class="rootClass" v-bind="restAttrs">
    <div class="flex items-center justify-between">
      <span class="text-xs font-medium text-neutral-500 dark:text-neutral-400">
        {{ label }}
      </span>
      <span class="text-xs text-neutral-600 dark:text-neutral-300">
        {{ value }}
      </span>
    </div>
    <Progress
      :value="percentage"
      size="sm"
      :color="color"
      :show-shimmer="showShimmer"
    />
  </div>
</template>
