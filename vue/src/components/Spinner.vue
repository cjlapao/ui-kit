<script lang="ts">
import type { TrueColor } from "../theme/Theme";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerColor = TrueColor;
export type SpinnerVariant = "solid" | "segments";
export type SpinnerThickness = "thin" | "normal" | "thick";

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  variant?: SpinnerVariant;
  thickness?: SpinnerThickness;
  label?: string;
}

const sizeTokens: Record<
  SpinnerSize,
  { diameter: string; border: Record<SpinnerThickness, string> }
> = {
  xs: {
    diameter: "h-4 w-4",
    border: { thin: "border", normal: "border-[2px]", thick: "border-[4px]" },
  },
  sm: {
    diameter: "h-5 w-5",
    border: {
      thin: "border-[1.5px]",
      normal: "border-2",
      thick: "border-[4px]",
    },
  },
  md: {
    diameter: "h-6 w-6",
    border: {
      thin: "border-3",
      normal: "border-[3.5px]",
      thick: "border-[4.5px]",
    },
  },
  lg: {
    diameter: "h-8 w-8",
    border: {
      thin: "border-[3.5px]",
      normal: "border-[4px]",
      thick: "border-[5px]",
    },
  },
  xl: {
    diameter: "h-10 w-10",
    border: {
      thin: "border-[4px]",
      normal: "border-[4.5px]",
      thick: "border-[5.5px]",
    },
  },
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import classNames from "classnames";
import { getSpinnerColorTokens } from "../theme/Theme";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "Spinner", inheritAttrs: false });

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: "md",
  color: "blue",
  variant: "solid",
  thickness: "normal",
});

const { classAttr, restAttrs } = useClassAttrs();

const el = ref<HTMLSpanElement | null>(null);
defineExpose({ el });

const sizeStyles = computed(() => sizeTokens[props.size] ?? sizeTokens.md);
const borderThickness = computed(
  () => sizeStyles.value.border[props.thickness] ?? sizeStyles.value.border.thin,
);
const colorStyles = computed(() => getSpinnerColorTokens(props.color));

const spinnerBase = computed(() =>
  classNames(
    "inline-flex rounded-full border-solid border-transparent",
    sizeStyles.value.diameter,
    borderThickness.value,
    classAttr.value,
  ),
);

const spinnerClass = computed(() =>
  classNames(
    spinnerBase.value,
    "transition-all duration-150 ease-in-out",
    props.variant === "segments"
      ? ["animate-[spin_1s_linear_infinite]", ...colorStyles.value]
      : ["animate-spin", colorStyles.value[0]],
  ),
);
</script>

<template>
  <span class="inline-flex items-center gap-2" role="status" aria-live="polite">
    <span ref="el" :class="spinnerClass" v-bind="restAttrs" />
    <span
      v-if="label"
      class="text-sm font-medium text-neutral-600 dark:text-neutral-300"
    >
      {{ label }}
    </span>
    <span class="sr-only">{{ label ?? "Loading" }}</span>
  </span>
</template>
