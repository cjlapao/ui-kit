<script lang="ts">
import type { VNode } from "vue";
import type { ButtonColor, ButtonSize, ButtonVariant } from "./Button.vue";
import type { SpinnerColor, SpinnerSize } from "./Spinner.vue";
import type { TooltipPosition } from "./Tooltip.vue";
import type {
  GlassVibrancy,
  GlassOpacity,
  SpecularMode,
} from "../../../common/theme/glass";

type IconButtonRounded = "md" | "lg" | "xl" | "full";

const sizeTokens: Record<
  ButtonSize,
  {
    button: string;
    icon: string;
    spinner: SpinnerSize;
  }
> = {
  xs: { button: "h-7 w-7 leading-none", icon: "h-4 w-4", spinner: "xs" },
  sm: { button: "h-8 w-8 leading-none", icon: "h-5 w-5", spinner: "xs" },
  md: { button: "h-10 w-10 leading-none", icon: "h-6 w-6", spinner: "sm" },
  lg: { button: "h-12 w-12 leading-none", icon: "h-7 w-7", spinner: "md" },
  xl: { button: "h-14 w-14 leading-none", icon: "h-8 w-8", spinner: "lg" },
};

const roundedMap: Record<IconButtonRounded, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const baseClasses =
  "inline-flex items-center justify-center select-none transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

export interface IconButtonProps {
  icon: string | VNode;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  rounded?: IconButtonRounded;
  customSizeClass?: string;
  iconClassName?: string;
  loading?: boolean;
  spinnerVariant?: "solid" | "segments";
  spinnerColor?: SpinnerColor;
  srLabel?: string;
  accent?: boolean;
  accentColor?: ButtonColor;
  disabled?: boolean;
  /** When set, a styled tooltip is shown on hover (replaces the native title attribute). */
  tooltip?: string;
  /** Position of the tooltip relative to the button. Defaults to 'top'. */
  tooltipPosition?: TooltipPosition;
  /** When true, applies glass styling (fill + vibrancy + optional specular overlay). */
  glass?: boolean;
  /** Backdrop vibrancy level for glass surfaces. */
  vibrancy?: GlassVibrancy;
  /** Glass fill transparency level for glass surfaces. Defaults to "clear" for IconButton. */
  glassOpacity?: GlassOpacity;
  /** Specular highlight mode for glass surfaces. Defaults to "none" for IconButton. */
  specularMode?: SpecularMode;
}
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import { getButtonColorClasses } from "../theme/Theme";
import { iconAccentHover, iconAccentRing } from "../theme/ButtonTypes";
import type { IconSize } from "../types/Icon";
import { useClassAttrs } from "../utils/attrsUtils";
import {
  getGlassFillClass,
  getGlassVibrancyClass,
  getSpecularClasses,
} from "../../../common/theme/glass";
import Spinner from "./Spinner.vue";
import TooltipWrapper from "./TooltipWrapper.vue";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "IconButton", inheritAttrs: false });

const props = withDefaults(defineProps<IconButtonProps>(), {
  variant: "icon",
  color: "blue",
  size: "md",
  rounded: "full",
  loading: false,
  spinnerVariant: "segments",
  accent: false,
  disabled: false,
  glass: false,
  vibrancy: "medium",
  glassOpacity: "clear",
  specularMode: "none",
});

const { classAttr, restAttrs } = useClassAttrs();
const renderIcon = useIconRenderer();

const el = ref<HTMLButtonElement | null>(null);
defineExpose({ el });

const sizeConfig = computed(() => sizeTokens[props.size] ?? sizeTokens.md);
const baseColorClasses = computed(() =>
  getButtonColorClasses(props.variant, props.color),
);
const accentTone = computed(() => props.accentColor ?? props.color);
const accentRing = computed(
  () => iconAccentRing[accentTone.value] ?? iconAccentRing.blue,
);
const accentHover = computed(
  () => iconAccentHover[accentTone.value] ?? iconAccentHover.blue,
);
const accentClasses = computed(() =>
  props.accent
    ? classNames(
        "bg-transparent text-inherit hover:bg-transparent focus-visible:ring-2 focus-visible:ring-offset-2",
        accentRing.value,
        accentHover.value,
      )
    : null,
);

// When accent is off but accentColor is explicitly provided,
// apply hover text color for non-solid variants (ghost, soft, outline, icon)
const nonAccentHover = computed(() =>
  !props.accent && props.accentColor && props.variant !== "solid"
    ? (iconAccentHover[props.accentColor] ?? null)
    : null,
);

// Glass styling — variant="glass" auto-enables glass; glass prop overrides
const isGlass = computed(
  () => props.variant === "glass" || props.glass,
);
const glassClasses = computed(() =>
  isGlass.value
    ? classNames(
        "backdrop-blur-sm",
        getGlassFillClass(props.color, props.glassOpacity),
        getGlassVibrancyClass(props.vibrancy),
      )
    : null,
);

// Specular overlay — only when glass is active
const effectiveSpecularMode = computed<SpecularMode>(() =>
  isGlass.value ? props.specularMode : "none",
);
const specularOverlayClasses = computed(() =>
  effectiveSpecularMode.value !== "none"
    ? classNames(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        getSpecularClasses(effectiveSpecularMode.value) ?? "",
      )
    : undefined,
);

const dimensionClass = computed(
  () => props.customSizeClass ?? sizeConfig.value.button,
);
const spinnerColorToken = computed<SpinnerColor>(
  () => props.spinnerColor ?? (props.color as SpinnerColor),
);

const computedClassName = computed(() =>
   classNames(
     baseClasses,
     dimensionClass.value,
     roundedMap[props.rounded] ?? roundedMap.full,
     isGlass.value ? (accentClasses.value ?? "") : (accentClasses.value ?? baseColorClasses.value),
     nonAccentHover.value,
     isGlass.value && "relative",
     glassClasses.value,
     classAttr.value,
   ),
 );

const iconContent = computed(() =>
  renderIcon(
    props.icon,
    props.size as IconSize,
    classNames("flex-shrink-0", sizeConfig.value.icon, props.iconClassName),
  ),
);

// Pull aria-label and title out of rest so we can set them explicitly.
// title falls back to aria-label → srLabel so the native browser tooltip
// always shows the accessible label rather than the icon's own SVG title.
// When a styled tooltip is provided, omit the native title to avoid doubling.
const ariaLabelAttr = computed(
  () => restAttrs.value["aria-label"] as string | undefined,
);
const titleAttr = computed(() => restAttrs.value.title as string | undefined);
const otherAttrs = computed(() => {
  const { "aria-label": _ariaLabel, title: _title, ...rest } = restAttrs.value;
  return rest;
});
const computedAriaLabel = computed(() => ariaLabelAttr.value ?? props.srLabel);
const computedTitle = computed(() =>
  props.tooltip ? undefined : (titleAttr.value ?? computedAriaLabel.value),
);

const buttonBindings = computed(() => ({
  class: computedClassName.value,
  "data-variant": props.variant,
  "data-color": props.color,
  "data-size": props.size,
  "data-glass": props.glass,
  disabled: props.disabled || props.loading,
  "aria-label": computedAriaLabel.value,
  title: computedTitle.value,
  ...otherAttrs.value,
}));
</script>

<template>
  <TooltipWrapper v-if="tooltip" :text="tooltip" :position="tooltipPosition">
    <button ref="el" v-bind="buttonBindings">
      <div
        v-if="specularOverlayClasses"
        :class="specularOverlayClasses"
        aria-hidden="true"
      />
      <Spinner
        v-if="loading"
        :size="sizeConfig.spinner"
        :color="spinnerColorToken"
        :variant="spinnerVariant"
        aria-hidden="true"
      />
      <VNodeRenderer v-else :nodes="iconContent" />
      <span class="sr-only">
        {{ srLabel ?? ariaLabelAttr ?? "Icon button" }}
      </span>
    </button>
  </TooltipWrapper>
  <button v-else ref="el" v-bind="buttonBindings">
    <div
      v-if="specularOverlayClasses"
      :class="specularOverlayClasses"
      aria-hidden="true"
    />
    <Spinner
      v-if="loading"
      :size="sizeConfig.spinner"
      :color="spinnerColorToken"
      :variant="spinnerVariant"
      aria-hidden="true"
    />
    <VNodeRenderer v-else :nodes="iconContent" />
    <span class="sr-only">
      {{ srLabel ?? ariaLabelAttr ?? "Icon button" }}
    </span>
  </button>
</template>
