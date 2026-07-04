<script lang="ts">
import type { VNode } from "vue";
import type { BadgeProps } from "./Badge.vue";
import type { IconButtonProps } from "./IconButton.vue";

type BadgePosition = "top-start" | "top-end" | "bottom-start" | "bottom-end";

const POSITION_CLASSES: Record<BadgePosition, string> = {
  "top-start": "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
  "top-end": "top-0 right-0 translate-x-1/2 -translate-y-1/2",
  "bottom-start": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  "bottom-end": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
};

export interface BadgeIconProps extends IconButtonProps {
  /**
   * Optional custom badge node. When provided, overrides count/dot rendering.
   */
  badgeContent?: string | VNode;
  /**
   * Numeric badge count. Ignored when `badgeContent` is supplied.
   */
  badgeCount?: number;
  /**
   * Show a small dot indicator instead of a number. Ignored when `badgeContent` is supplied.
   */
  badgeDot?: boolean;
  /**
   * Tailwind position for the badge relative to the button.
   */
  badgePosition?: BadgePosition;
  /**
   * Additional props forwarded to the underlying `Badge`.
   */
  badgeProps?: Omit<BadgeProps, "count" | "dot">;
  /**
   * Extra class applied to the outer wrapper span.
   */
  wrapperClassName?: string;
  /**
   * Expands the control to fill the available width.
   */
  fullWidth?: boolean;
}
</script>

<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";
import Badge from "./Badge.vue";
import IconButton from "./IconButton.vue";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "BadgeIcon", inheritAttrs: false });

const props = withDefaults(defineProps<BadgeIconProps>(), {
  badgeDot: false,
  badgePosition: "top-end",
  fullWidth: false,
  accent: true,
  // Booleans passed through to IconButton keep its own defaults when unset.
  loading: undefined,
  disabled: undefined,
});

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();

const iconButtonRef = ref<InstanceType<typeof IconButton> | null>(null);
const el = computed(() => iconButtonRef.value?.el ?? null);
defineExpose({ el });

const showBadge = computed(() => {
  if (props.badgeContent || slots.badgeContent) {
    return true;
  }
  if (props.badgeDot) {
    return true;
  }
  if (typeof props.badgeCount === "number" && props.badgeCount !== 0) {
    return true;
  }
  return false;
});

const wrapperClass = computed(() =>
  classNames(
    "relative inline-flex",
    props.fullWidth && "w-full",
    props.wrapperClassName,
  ),
);

const buttonClass = computed(() =>
  classNames(props.fullWidth && "w-full", classAttr.value),
);

const badgeWrapperClass = computed(() =>
  classNames(
    "pointer-events-none absolute",
    POSITION_CLASSES[props.badgePosition],
  ),
);

const iconButtonBindings = computed(() => {
  const {
    badgeContent: _badgeContent,
    badgeCount: _badgeCount,
    badgeDot: _badgeDot,
    badgePosition: _badgePosition,
    badgeProps: _badgeProps,
    wrapperClassName: _wrapperClassName,
    fullWidth: _fullWidth,
    ...iconButtonProps
  } = props;
  return { ...iconButtonProps, ...restAttrs.value };
});
</script>

<template>
  <span :class="wrapperClass">
    <IconButton
      ref="iconButtonRef"
      :class="buttonClass"
      v-bind="iconButtonBindings"
    />
    <span v-if="showBadge" :class="badgeWrapperClass">
      <slot name="badgeContent">
        <VNodeRenderer v-if="badgeContent" :nodes="badgeContent" />
        <Badge v-else :count="badgeCount" :dot="badgeDot" v-bind="badgeProps" />
      </slot>
    </span>
  </span>
</template>
