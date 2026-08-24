<script lang="ts">
import type { VNode } from "vue";
import type { ControlSize } from "../theme/Theme";
import type {
  SpinnerColor,
  SpinnerProps,
  SpinnerThickness,
  SpinnerVariant,
} from "./Spinner.vue";

export const LOADER_VARIANTS = ["spinner", "progress"] as const;
export type LoaderVariant = (typeof LOADER_VARIANTS)[number];

/**
 * The shared control scale: it drives the spinner's diameter, the progress
 * bar's height, and the title/label type size together.
 */
export type LoaderSize = ControlSize;
export type LoaderColor = SpinnerColor;

export const LOADER_GLASS_BLURS = ["none", "low", "medium", "high"] as const;
export type GlassBlurIntensity = (typeof LOADER_GLASS_BLURS)[number];

export interface LoaderProps {
  variant?: LoaderVariant;
  size?: LoaderSize;
  color?: LoaderColor;
  spinnerVariant?: SpinnerVariant;
  spinnerThickness?: SpinnerThickness;
  title?: string | VNode | null;
  label?: string | VNode | null;
  progress?: number;
  /**
   * Progress variant only — the bar sweeps instead of filling and no
   * `aria-valuenow` is published, which is what tells assistive technology
   * the extent is unknown.
   */
  indeterminate?: boolean;
  /**
   * Cover the nearest positioned ancestor. Render the loader inside a
   * `relative` container for the overlay to fill.
   */
  overlay?: boolean;
  /** Overlay only — a see-through glass fill instead of a solid scrim. */
  glass?: boolean;
  glassBlurIntensity?: GlassBlurIntensity;
}

const sizeMap: Record<
  LoaderSize,
  {
    spinner: NonNullable<SpinnerProps["size"]>;
    title: string;
    label: string;
  }
> = {
  xs: { spinner: "xs", title: "text-xs", label: "text-xs" },
  sm: { spinner: "sm", title: "text-sm", label: "text-xs" },
  md: { spinner: "md", title: "text-base", label: "text-sm" },
  lg: { spinner: "lg", title: "text-lg", label: "text-base" },
  xl: { spinner: "xl", title: "text-xl", label: "text-base" },
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
import { getSurfaceTextTokens } from "../theme/Theme";
import { getSurfaceGlassFillClass } from "../theme/glass";
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
  indeterminate: false,
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

const overlayClass = computed(() =>
  classNames(
    "absolute inset-0 z-50 rounded-[inherit] p-6",
    blurIntensityMap[props.glassBlurIntensity] ?? blurIntensityMap.medium,
    // The glass fill comes from the shared container scale in theme/glass.ts,
    // tinted with the loader's own tone; the scrim stays a solid token.
    props.glass
      ? getSurfaceGlassFillClass(props.color, "light")
      : "bg-white/85 dark:bg-neutral-900/80",
  ),
);

const containerClass = computed(() =>
  classNames(
    "inline-flex flex-col items-center justify-center gap-3 text-center",
    props.overlay && overlayClass.value,
    classAttr.value,
  ),
);

// Vue has no SurfaceProvider yet: the overlay knows the surface it draws, but
// the inline loader cannot see a panel around it, so it takes the solid tokens.
const surface = computed(() => {
  if (props.overlay) {
    return getSurfaceTextTokens(props.glass ? "liquid-glass" : "elevated");
  }
  return getSurfaceTextTokens("elevated");
});

const hasTitle = computed(() => Boolean(props.title) || Boolean(slots.title));
const hasLabel = computed(() => Boolean(props.label) || Boolean(slots.label));
</script>

<template>
  <div :class="containerClass" v-bind="restAttrs" role="status">
    <div
      v-if="hasTitle"
      :class="classNames('font-semibold', surface.heading, resolvedSize.title)"
    >
      <slot name="title"><VNodeRenderer :nodes="title" /></slot>
    </div>
    <div v-if="variant === 'progress'" class="w-full min-w-[12rem] space-y-3">
      <Progress
        :value="progress"
        :indeterminate="indeterminate"
        :size="size"
        :color="color"
      />
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
      :class="classNames(surface.description, resolvedSize.label)"
    >
      <slot name="label"><VNodeRenderer :nodes="label" /></slot>
    </div>
  </div>
</template>
