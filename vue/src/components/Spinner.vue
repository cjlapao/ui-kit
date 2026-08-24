<script lang="ts">
import type { ControlSize, TrueColor } from "../theme/Theme";

/**
 * The shared control scale, so a spinner lines up with the Button next to it
 * instead of speaking its own size language.
 */
export type SpinnerSize = ControlSize;
export type SpinnerColor = TrueColor;

export const SPINNER_VARIANTS = ["solid", "segments"] as const;
export type SpinnerVariant = (typeof SPINNER_VARIANTS)[number];

export const SPINNER_THICKNESSES = ["thin", "normal", "thick"] as const;
export type SpinnerThickness = (typeof SPINNER_THICKNESSES)[number];

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  variant?: SpinnerVariant;
  thickness?: SpinnerThickness;
  /** Visible text beside the ring. Also announced — the ring alone reads as "Loading". */
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
import { getSpinnerColorTokens, getSurfaceTextTokens } from "../theme/Theme";
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

// Vue has no SurfaceProvider yet, so the label takes the solid-surface tokens
// and cannot adapt to a glass panel around it.
const labelClass = `text-sm font-medium ${getSurfaceTextTokens("elevated").body}`;

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
    "transition-all duration-150 ease-in-out motion-reduce:animate-none",
    props.variant === "segments"
      ? ["animate-[spin_1s_linear_infinite]", ...colorStyles.value]
      : ["animate-spin", colorStyles.value[0]],
  ),
);
</script>

<template>
  <span class="inline-flex items-center gap-2" role="status">
    <span ref="el" :class="spinnerClass" v-bind="restAttrs" />
    <!-- With a visible label the text is already inside the status region —
         an sr-only copy beside it would be announced twice. -->
    <span v-if="label" :class="labelClass">{{ label }}</span>
    <span v-else class="sr-only">Loading</span>
  </span>
</template>
