<script setup lang="ts">
import { computed, normalizeClass, useAttrs } from "vue";
import { type IconName, iconRegistry } from "../icons/registry";
import { mergeClassTokens, hasExplicitSize } from "../utils/iconUtils";
import type { IconSize } from "../types/Icon";

export interface CustomIconProps {
  /** Name of the icon to display */
  icon: IconName;
  /** Alternative text for accessibility */
  alt?: string;
  /** Size of the icon in pixels */
  customSize?: number | string;
  /** Size of the icon: xs, sm, md, lg, xl */
  size?: IconSize;
  /** Whether the icon should use color or be monochrome */
  colored?: boolean;
  /** Primary color to use for the icon */
  color?: string;
  /** Hover color for the icon */
  hoverColor?: string;
}

defineOptions({ name: "CustomIcon", inheritAttrs: false });

const props = withDefaults(defineProps<CustomIconProps>(), {
  alt: "",
  size: "md",
  colored: false,
});

const SIZE_CLASS_MAP: Record<IconSize, string> = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-7 w-7",
  xl: "h-8 w-8",
};

const attrs = useAttrs();

const attrClass = computed(() => normalizeClass(attrs.class) || "");

const restAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});

const iconComponent = computed(() => iconRegistry[props.icon]);

const dimension = computed(() => {
  if (!props.customSize) {
    return undefined;
  }
  if (typeof props.customSize === "number") {
    return `${props.customSize}px`;
  }
  return props.customSize;
});

const baseStyle = computed(() => {
  const style: Record<string, string> = {};
  if (dimension.value) {
    style.width = dimension.value;
    style.height = dimension.value;
  }
  if (props.color && !props.colored) {
    style["--icon-color"] = props.color;
  }
  if (props.hoverColor && !props.colored) {
    style["--icon-hover-color"] = props.hoverColor;
  }
  return style;
});

const fallbackSizeClass = computed(() =>
  !dimension.value && !hasExplicitSize(attrClass.value)
    ? SIZE_CLASS_MAP[props.size]
    : undefined,
);

const iconClass = computed(() =>
  mergeClassTokens(
    "inline-flex items-center justify-center flex-shrink-0 [&>svg]:h-full [&>svg]:w-full",
    !props.colored ? "fill-current" : "",
    fallbackSizeClass.value,
    attrClass.value,
  ),
);
</script>

<template>
  <span
    v-if="!iconComponent"
    :class="`flex items-center justify-center rounded bg-neutral-100 text-xs font-bold uppercase text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 ${attrClass}`"
    :style="baseStyle"
    v-bind="restAttrs"
  >
    {{ icon?.charAt(0) || "?" }}
  </span>
  <span v-else :class="iconClass" :style="baseStyle" v-bind="restAttrs">
    <component :is="iconComponent" class="w-full h-full" :aria-label="alt" />
  </span>
</template>
