<script lang="ts">
import type { VNode } from "vue";
import type { ThemeColor } from "../theme/Theme";

export type PillVariant = "solid" | "soft" | "outline";
export type PillSize = "xs" | "sm" | "md" | "lg";
export type PillTone = ThemeColor;

const sizeStyles: Record<PillSize, string> = {
  xs: "text-[11px] h-4 px-2",
  sm: "text-[12px] h-5 px-2.5",
  md: "text-xs h-6 px-3",
  lg: "text-sm h-7 px-4",
};

export interface PillProps {
  tone?: PillTone;
  variant?: PillVariant;
  size?: PillSize;
  uppercase?: boolean;
  icon?: string | VNode;
  dot?: boolean;
}
</script>

<script setup lang="ts">
import { computed, useSlots } from "vue";
import classNames from "classnames";
import { getPillColorClasses } from "../theme/Theme";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "Pill", inheritAttrs: false });

const props = withDefaults(defineProps<PillProps>(), {
  tone: "info",
  variant: "soft",
  size: "md",
  uppercase: false,
  dot: false,
});

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();

const toneTokens = computed(() => getPillColorClasses(props.tone, props.variant));
const sizeToken = computed(() => sizeStyles[props.size]);

const pillClasses = computed(() =>
  classNames(
    "inline-flex items-center justify-center rounded-full  leading-none",
    sizeToken.value,
    toneTokens.value.base,
    toneTokens.value.border,
    props.uppercase && "uppercase tracking-wide",
    props.dot && "px-0 h-2 w-2 min-w-[0.5rem]",
    props.dot && "rounded-full",
    classAttr.value,
  ),
);

const hasIcon = computed(() => Boolean(props.icon) || Boolean(slots.icon));
</script>

<template>
  <span :class="pillClasses" v-bind="restAttrs">
    <span v-if="hasIcon && !dot" class="mr-1.5 flex items-center text-inherit">
      <slot name="icon"><VNodeRenderer :nodes="icon" /></slot>
    </span>
    <slot v-if="!dot" />
  </span>
</template>
