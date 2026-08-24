<script lang="ts">
import type { VNode } from "vue";
import type {
  TrueColor,
  ButtonVariant,
  ButtonWeight,
} from "../theme/Theme";
import { CONTROL_SIZES } from "../theme/Theme";
import type { TooltipPosition } from "./Tooltip.vue";
import type {
  GlassVibrancy,
  GlassOpacity,
  SpecularMode,
} from "../../../common/theme/glass";

export type ButtonColor = TrueColor;
export type { ButtonVariant };
export type { GlassVibrancy, GlassOpacity, SpecularMode };

/**
 * Buttons use the shared control scale. Aliased rather than redeclared so a
 * change to `ControlSize` reaches Button without a second list to update —
 * the same rule the React kit's Button follows.
 */
export {
  BUTTON_VARIANTS,
  BUTTON_WEIGHTS,
} from "../theme/Theme";
export const BUTTON_SIZES = CONTROL_SIZES;
export type ButtonSize = (typeof BUTTON_SIZES)[number];
export type { ButtonWeight };

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
  /**
   * Raw CSS colour to tint the leading/trailing icon. Omit it and the icon
   * inherits the button's text colour (icons paint with `currentColor`), so
   * the glyph always matches the label; set it to override just the glyph.
   */
  iconColor?: string;
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

// `disabled:opacity-50` is applied conditionally rather than living here:
// `loading` also sets the disabled attribute (to block clicks), and dimming a
// loading control to 50% fades the spinner along with it — the one element
// that needs to stay visible.
// `DEFAULT_TRIGGER_CORNER` (not a local `rounded-md`) so a Button next to an
// Input is the same box — Input already uses `rounded-lg`.
const baseClasses = `inline-flex items-center justify-center ${DEFAULT_TRIGGER_CORNER} transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed select-none`;

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
  getControlSizeTokens,
  DEFAULT_TRIGGER_CORNER,
} from "../theme/Theme";
import { iconAccentHover, iconAccentRing } from "../theme/ButtonTypes";
import { useClassAttrs } from "../utils/attrsUtils";
import {
  getGlassChromeClasses,
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

const sizeConfig = computed(() => getControlSizeTokens(props.size));
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
// Accent means "the parent owns the fill": drop the variant's fill and draw
// only the accent ring + hover. True for icon mode and for a text Button
// alike (it used to be dead outside icon mode).
const accentClasses = computed(() =>
  props.accent
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
// The variant's own colour classes are dropped for glass (they paint an
// opaque fill), so the chrome — text colour, rim, focus ring — has to come
// from here or the control ends up with none of it.
const glassClasses = computed(() =>
  isGlass.value
    ? classNames(
        "backdrop-blur-sm",
        getGlassFillClass(props.color, props.glassOpacity),
        getGlassVibrancyClass(props.vibrancy),
        getGlassChromeClasses(props.color),
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
     !props.loading && "disabled:opacity-50",
      sizeConfig.value.gap,
      isIconMode.value ? sizeConfig.value.iconOnly : sizeConfig.value.text,
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
    "inline-flex animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none",
    sizeConfig.value.spinner,
  ),
);

const isDisabled = computed(() => props.disabled ?? false);
const srOnlyContent = computed(
  () => restAttrs.value["aria-label"] as string | undefined,
);

// Icons paint with `currentColor`, so by default they inherit the button's
// text colour and the glyph always matches the label. An `iconColor` tints
// only the glyph by wrapping it in a span that carries the colour.
const iconWrapClass = "inline-flex shrink-0 items-center";
const iconStyle = computed(() =>
  props.iconColor ? { color: props.iconColor } : undefined,
);
const leadingIconNodes = computed(() =>
  renderIconFn(
    props.leadingIcon,
    props.size as IconSize,
    classNames("flex-shrink-0", sizeConfig.value.icon),
  ),
);
const trailingIconNodes = computed(() =>
  renderIconFn(
    props.trailingIcon,
    props.size as IconSize,
    classNames("flex-shrink-0", sizeConfig.value.icon),
  ),
);

const buttonBindings = computed(() => {
  // A `<button>` inside a `<form>` is `type="submit"` by default, which made
  // every unspec'd Button submit the form. Default to "button"; an explicit
  // `type="submit"|"reset"` still wins, anything else falls back to "button".
  const { type, ...rest } = restAttrs.value;
  const resolvedType: "button" | "reset" | "submit" =
    type === "submit" || type === "reset" ? type : "button";
  return {
    class: computedClassName.value,
    type: resolvedType,
    disabled: isDisabled.value || props.loading,
    "data-variant": props.variant,
    "data-color": props.color,
    "data-size": props.size,
    "data-glass": isGlass.value,
    "aria-busy": props.loading || undefined,
    ...rest,
  };
});
</script>

<template>
  <!--
    TooltipWrapper renders its child unchanged when `text` is absent, so the
    button is written once instead of duplicated in tooltip/non-tooltip
    branches (the duplication is how the two drift apart).
  -->
  <TooltipWrapper :text="tooltip" :position="tooltipPosition">
    <button ref="el" v-bind="buttonBindings">
      <div
        v-if="specularOverlayClasses"
        :class="specularOverlayClasses"
        aria-hidden="true"
      />
      <span v-if="loading" :class="spinnerClass" aria-hidden="true" />
      <template v-else>
        <span
          v-if="leadingIcon && iconStyle"
          :class="iconWrapClass"
          :style="iconStyle"
        >
          <VNodeRenderer :nodes="leadingIconNodes" />
        </span>
        <VNodeRenderer v-else-if="leadingIcon" :nodes="leadingIconNodes" />
        <span v-if="isIconMode" class="sr-only">{{
          srOnlyContent || "Button"
        }}</span>
        <slot v-else />
        <span
          v-if="trailingIcon && iconStyle"
          :class="iconWrapClass"
          :style="iconStyle"
        >
          <VNodeRenderer :nodes="trailingIconNodes" />
        </span>
        <VNodeRenderer v-else-if="trailingIcon" :nodes="trailingIconNodes" />
      </template>
    </button>
  </TooltipWrapper>
</template>
