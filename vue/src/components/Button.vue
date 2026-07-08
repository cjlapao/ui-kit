<script lang="ts">
import type { VNode } from "vue";
import type { TrueColor, ButtonVariant } from "../theme/Theme";
import type { TooltipPosition } from "./Tooltip.vue";
import type {
  GlassVibrancy,
  GlassOpacity,
  SpecularMode,
} from "../../../common/theme/glass";

export type ButtonColor = TrueColor;
export type { ButtonVariant };
export type { GlassVibrancy, GlassOpacity, SpecularMode };

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonWeight = "normal" | "medium" | "semibold" | "bold";

export interface ButtonProps {
  variant?: ButtonVariant;
  color?: TrueColor;
  size?: ButtonSize;
  weight?: ButtonWeight;
  fullWidth?: boolean;
  leadingIcon?: string | VNode;
  trailingIcon?: string | VNode;
  loading?: boolean;
  iconOnly?: boolean;
  accent?: boolean;
  accentColor?: TrueColor;
  /** When true, renders in a persistent lighter "on" state with hover suppressed. accentColor overrides the active color. */
  active?: boolean;
  /** When true, applies glass styling (fill + vibrancy + optional specular overlay). */
  glass?: boolean;
  /** Backdrop vibrancy level for glass surfaces. */
  vibrancy?: GlassVibrancy;
  /** Glass fill transparency level for glass surfaces. */
  glassOpacity?: GlassOpacity;
  /** Specular highlight mode for glass surfaces. */
  specularMode?: SpecularMode;
  disabled?: boolean;
  /** When set, a styled tooltip is shown on hover. */
  tooltip?: string;
  /** Position of the tooltip relative to the button. Defaults to 'top'. */
  tooltipPosition?: TooltipPosition;
}

const baseClasses =
  "inline-flex items-center justify-center rounded-md transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 select-none";

const sizeStyles: Record<
  ButtonSize,
  { base: string; iconOnly: string; gap: string; icon: string; spinner: string }
> = {
  xs: {
    base: "px-2 py-1 text-xs",
    iconOnly: "p-1.5 text-xs",
    gap: "gap-1.5",
    icon: "h-4 w-4",
    spinner: "h-4 w-4",
  },
  sm: {
    base: "px-3 py-2 text-xs",
    iconOnly: "p-2 text-xs",
    gap: "gap-1.5",
    icon: "h-5 w-5",
    spinner: "h-4 w-4",
  },
  md: {
    base: "px-3.5 py-2.5 text-sm",
    iconOnly: "p-2.5 text-sm",
    gap: "gap-2",
    icon: "h-6 w-6",
    spinner: "h-6 w-6",
  },
  lg: {
    base: "px-4 py-2.5 text-base",
    iconOnly: "p-3 text-base",
    gap: "gap-2.5",
    icon: "h-7 w-7",
    spinner: "h-7 w-7",
  },
  xl: {
    base: "px-5 py-3 text-base",
    iconOnly: "p-3.5 text-base",
    gap: "gap-3",
    icon: "h-8 w-8",
    spinner: "h-8 w-8",
  },
};

const weightClasses: Record<ButtonWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import classNames from "classnames";
import { type IconSize } from "../types/Icon";
import { useIconRenderer } from "../contexts/IconContext";
import {
  getButtonColorClasses,
  getButtonBaseClasses,
  getButtonHoverClasses,
  getButtonActiveClasses,
  getButtonActiveHoverClasses,
} from "../theme/Theme";
import { iconAccentHover, iconAccentRing } from "../theme/ButtonTypes";
import { useClassAttrs } from "../utils/attrsUtils";
import {
  getGlassFillClass,
  getGlassVibrancyClass,
  getSpecularClasses,
} from "../../../common/theme/glass";
import TooltipWrapper from "./TooltipWrapper.vue";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "Button", inheritAttrs: false });

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "solid",
  color: "blue",
  size: "md",
  weight: "normal",
  fullWidth: false,
  loading: false,
  iconOnly: false,
  accent: false,
  active: false,
  glass: false,
  vibrancy: "medium",
  glassOpacity: "frosted",
  specularMode: "none",
  disabled: false,
});

const { classAttr, restAttrs } = useClassAttrs();
const renderIconFn = useIconRenderer();

const el = ref<HTMLButtonElement | null>(null);
defineExpose({ el });

const sizeConfig = computed(() => sizeStyles[props.size] ?? sizeStyles.md);
const baseColorClasses = computed(() =>
  getButtonColorClasses(props.variant, props.color),
);
const isIconMode = computed(() => props.iconOnly || props.variant === "icon");
const accentTone = computed(() => props.accentColor ?? props.color);
const accentRingClass = computed(
  () => iconAccentRing[accentTone.value] ?? iconAccentRing.blue,
);
const accentHoverClass = computed(
  () => iconAccentHover[accentTone.value] ?? iconAccentHover.blue,
);
const accentClasses = computed(() =>
  isIconMode.value && props.accent
    ? classNames(
        "bg-transparent text-inherit hover:bg-transparent focus-visible:ring-2 focus-visible:ring-offset-2",
        accentRingClass.value,
        accentHoverClass.value,
      )
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

const isEffectivelyDisabled = computed(
  () => (props.disabled ?? false) || props.loading,
);
// active: persistent lighter "on" state, no hover; accentColor overrides the active color
// accentColor on enabled non-active: replaces only the hover classes
const colorClasses = computed(() => {
  if (props.active) {
    const activeColor = props.accentColor ?? props.color;
    const activeBase = getButtonActiveClasses(props.variant, activeColor);
    return isEffectivelyDisabled.value
      ? activeBase
      : classNames(
          activeBase,
          getButtonActiveHoverClasses(props.variant, activeColor),
        );
  }
  if (!isIconMode.value && props.accentColor && !isEffectivelyDisabled.value)
    return classNames(
      getButtonBaseClasses(props.variant, props.color),
      getButtonHoverClasses(props.variant, props.accentColor),
    );
  return baseColorClasses.value;
});

const computedClassName = computed(() =>
   classNames(
     baseClasses,
     sizeConfig.value.gap,
     isIconMode.value ? sizeConfig.value.iconOnly : sizeConfig.value.base,
     isGlass.value ? (accentClasses.value ?? "") : (accentClasses.value ?? colorClasses.value),
     weightClasses[props.weight],
     props.fullWidth && "w-full",
     isGlass.value && "relative",
     glassClasses.value,
     classAttr.value,
   ),
 );

const spinnerClass = computed(() =>
  classNames(
    "inline-flex animate-spin rounded-full border-2 border-current border-t-transparent",
    sizeConfig.value.spinner,
  ),
);

const isDisabled = computed(() => props.disabled ?? false);
const srOnlyContent = computed(
  () => restAttrs.value["aria-label"] as string | undefined,
);

const buttonBindings = computed(() => ({
  class: computedClassName.value,
  disabled: isDisabled.value || props.loading,
  "data-variant": props.variant,
  "data-color": props.color,
  "data-size": props.size,
  "data-glass": props.glass,
  "aria-busy": props.loading || undefined,
  ...restAttrs.value,
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
      <template v-if="loading">
        <span :class="spinnerClass" aria-hidden="true" />
      </template>
      <template v-else>
        <VNodeRenderer
          :nodes="
            renderIconFn(
              leadingIcon,
              size as IconSize,
              classNames(' flex-shrink-0', sizeConfig.icon),
            )
          "
        />
        <span v-if="isIconMode" class="sr-only">{{
          srOnlyContent ?? "Button"
        }}</span>
        <slot v-else />
        <VNodeRenderer
          :nodes="
            renderIconFn(
              trailingIcon,
              size as IconSize,
              classNames('flex-shrink-0', sizeConfig.icon),
            )
          "
        />
      </template>
    </button>
  </TooltipWrapper>
  <button v-else ref="el" v-bind="buttonBindings">
    <div
      v-if="specularOverlayClasses"
      :class="specularOverlayClasses"
      aria-hidden="true"
    />
    <template v-if="loading">
      <span :class="spinnerClass" aria-hidden="true" />
    </template>
    <template v-else>
      <VNodeRenderer
        :nodes="
          renderIconFn(
            leadingIcon,
            size as IconSize,
            classNames(' flex-shrink-0', sizeConfig.icon),
          )
        "
      />
      <span v-if="isIconMode" class="sr-only">{{
        srOnlyContent ?? "Button"
      }}</span>
      <slot v-else />
      <VNodeRenderer
        :nodes="
          renderIconFn(
            trailingIcon,
            size as IconSize,
            classNames('flex-shrink-0', sizeConfig.icon),
          )
        "
      />
    </template>
  </button>
</template>
