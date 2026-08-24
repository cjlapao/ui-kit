<script lang="ts">
import type { VNode } from "vue";
import type { ButtonColor, ButtonSize, ButtonVariant } from "./Button.vue";
import type { SpinnerColor } from "./Spinner.vue";
import type { TooltipPosition } from "./Tooltip.vue";
import type {
  GlassVibrancy,
  GlassOpacity,
  SpecularMode,
} from "../../../common/theme/glass";

type IconButtonRounded = "md" | "lg" | "xl" | "full";

const roundedMap: Record<IconButtonRounded, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

// `disabled:opacity-50` is applied conditionally rather than living here:
// `loading` also sets the disabled attribute (to block clicks), and dimming a
// loading control to 50% fades the spinner along with it — the one element
// that needs to stay visible.
const baseClasses =
  "inline-flex items-center justify-center select-none transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed";

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
  /**
   * Raw CSS colour to tint the icon. Omit it and the icon inherits the
   * button's text colour (icons paint with `currentColor`), so the glyph
   * always matches; set it to override just the icon.
   */
  iconColor?: string;
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
import {
  getButtonColorClasses,
  getControlSizeTokens,
} from "../theme/Theme";
import { iconAccentHover, iconAccentRing } from "../theme/ButtonTypes";
import type { IconSize } from "../types/Icon";
import { useClassAttrs } from "../utils/attrsUtils";
import {
  getGlassChromeClasses,
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

const sizeConfig = computed(() => getControlSizeTokens(props.size));
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

const dimensionClass = computed(
  () => props.customSizeClass ?? sizeConfig.value.box,
);
const spinnerColorToken = computed<SpinnerColor>(
  () => props.spinnerColor ?? (props.color as SpinnerColor),
);

const computedClassName = computed(() =>
   classNames(
     baseClasses,
     !props.loading && "disabled:opacity-50",
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

// The icon paints with `currentColor`, so by default it inherits the button's
// text colour and the glyph always matches. An `iconColor` tints only the
// glyph by wrapping it in a span that carries the colour.
const iconStyle = computed(() =>
  props.iconColor ? { color: props.iconColor } : undefined,
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

const buttonBindings = computed(() => {
  // `type="button"` by default — see Button: the native default is "submit",
  // which made an unspec'd icon button submit its form. An explicit
  // `type="submit"|"reset"` still wins, anything else falls back to "button".
  const { type, ...rest } = otherAttrs.value;
  const resolvedType: "button" | "reset" | "submit" =
    type === "submit" || type === "reset" ? type : "button";
  return {
    class: computedClassName.value,
    type: resolvedType,
    "data-variant": props.variant,
    "data-color": props.color,
    "data-size": props.size,
    "data-glass": isGlass.value,
    disabled: props.disabled || props.loading,
    "aria-label": computedAriaLabel.value,
    title: computedTitle.value,
    ...rest,
  };
});
</script>

<template>
  <!-- TooltipWrapper renders its child unchanged when `text` is absent, so the
       button is written once instead of duplicated in tooltip/non-tooltip
       branches. -->
  <TooltipWrapper :text="tooltip" :position="tooltipPosition">
    <button ref="el" v-bind="buttonBindings">
      <div
        v-if="specularOverlayClasses"
        :class="specularOverlayClasses"
        aria-hidden="true"
      />
      <Spinner
        v-if="loading"
        :size="sizeConfig.spinnerSize"
        :color="spinnerColorToken"
        :variant="spinnerVariant"
        aria-hidden="true"
      />
      <span
        v-else-if="iconStyle"
        class="inline-flex shrink-0 items-center"
        :style="iconStyle"
      >
        <VNodeRenderer :nodes="iconContent" />
      </span>
      <VNodeRenderer v-else :nodes="iconContent" />
      <span class="sr-only">
        {{ srLabel || ariaLabelAttr || "Icon button" }}
      </span>
    </button>
  </TooltipWrapper>
</template>
