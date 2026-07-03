<script lang="ts">
export interface AppDividerProps {
  /** Height of the divider in pixels or as CSS value */
  height?: number | string;
  /** Width of the divider in pixels */
  width?: number;
  /** Margin around the divider */
  margin?: number | string;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "AppDivider", inheritAttrs: false });

defineProps<AppDividerProps>();

const { classAttr, restAttrs } = useClassAttrs();

const className = computed(() => classAttr.value ?? "");
</script>

<!-- A vertical divider for separating header sections -->
<template>
  <div :class="`flex h-[75%] items-center ${className}`" v-bind="restAttrs">
    <div
      :class="`h-6 w-[1.2px] bg-neutral-300 dark:bg-neutral-700 ${className}-line`"
    ></div>
  </div>
</template>
