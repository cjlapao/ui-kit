<script lang="ts">
import type { VNode } from "vue";
import type { SpinnerColor, SpinnerProps } from "./Spinner.vue";

type LoaderVariant = "spinner" | "progress";
type LoaderSize = "sm" | "md" | "lg";
type GlassBlurIntensity = "none" | "low" | "medium" | "high";
type LoaderColor = SpinnerColor;

export interface LoaderProps {
  variant?: LoaderVariant;
  size?: LoaderSize;
  color?: LoaderColor;
  spinnerVariant?: SpinnerProps["variant"];
  spinnerThickness?: SpinnerProps["thickness"];
  title?: string | VNode | null;
  label?: string | VNode | null;
  progress?: number;
  overlay?: boolean;
  glass?: boolean;
  glassBlurIntensity?: GlassBlurIntensity;
}

const sizeMap: Record<
  LoaderSize,
  {
    spinner: SpinnerProps["size"];
    title: string;
    label: string;
  }
> = {
  sm: { spinner: "sm", title: "text-sm", label: "text-xs" },
  md: { spinner: "md", title: "text-base", label: "text-sm" },
  lg: { spinner: "lg", title: "text-lg", label: "text-sm" },
};

const blurIntensityMap: Record<GlassBlurIntensity, string> = {
  none: "backdrop-blur-none",
  low: "backdrop-blur-md",
  medium: "backdrop-blur-lg",
  high: "backdrop-blur-2xl",
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";
import Spinner from "./Spinner.vue";
import Progress from "./Progress.vue";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "Loader", inheritAttrs: false });

const props = withDefaults(defineProps<LoaderProps>(), {
  variant: "spinner",
  spinnerVariant: "segments",
  spinnerThickness: "normal",
  size: "md",
  color: "blue",
  progress: 0,
  overlay: false,
  glass: false,
  glassBlurIntensity: "medium",
});

const slots = defineSlots<{
  title?: () => unknown;
  label?: () => unknown;
}>();

const { classAttr, restAttrs } = useClassAttrs();

const resolvedSize = computed(() => sizeMap[props.size] ?? sizeMap.md);

const containerClass = computed(() =>
  classNames(
    "inline-flex flex-col items-center justify-center gap-3 text-center",
    props.overlay &&
      (props.glass
        ? `absolute inset-0 z-50 rounded-[inherit] bg-white/70 p-6 ${blurIntensityMap[props.glassBlurIntensity]} dark:bg-neutral-900/60`
        : `absolute inset-0 z-50 rounded-[inherit] bg-white/85 p-6 ${blurIntensityMap[props.glassBlurIntensity]} dark:bg-neutral-900/80`),
    classAttr.value,
  ),
);

const hasTitle = computed(() => Boolean(props.title) || Boolean(slots.title));
const hasLabel = computed(() => Boolean(props.label) || Boolean(slots.label));
</script>

<template>
  <div :class="containerClass" v-bind="restAttrs">
    <div
      v-if="hasTitle"
      :class="
        classNames(
          'font-semibold text-neutral-800 dark:text-neutral-100',
          resolvedSize.title,
        )
      "
    >
      <slot name="title"><VNodeRenderer :nodes="title" /></slot>
    </div>
    <div v-if="variant === 'progress'" class="w-full min-w-[12rem] space-y-3">
      <Progress :value="progress" size="md" :color="color" />
    </div>
    <Spinner
      v-else
      :size="resolvedSize.spinner"
      :color="color"
      :variant="spinnerVariant"
      :thickness="spinnerThickness"
    />
    <div
      v-if="hasLabel"
      :class="
        classNames('text-neutral-600 dark:text-neutral-300', resolvedSize.label)
      "
    >
      <slot name="label"><VNodeRenderer :nodes="label" /></slot>
    </div>
  </div>
</template>
