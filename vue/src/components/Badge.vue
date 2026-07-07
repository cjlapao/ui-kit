<script lang="ts">
import type { TrueColor } from "../theme/Theme";

export interface BadgeProps {
  /**
   * Content to display inside the badge
   */
  count?: number | string;

  /**
   * Show only a dot indicator (no count)
   */
  dot?: boolean;

  /**
   * Max count to display before showing "+"
   * @default 99
   */
  maxCount?: number;

  /**
   * Badge color variant
   * @default "neutral"
   */
  tone?: TrueColor;
}
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import { getBadgeColorClasses } from "../theme/Theme";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "Badge", inheritAttrs: false });

const props = withDefaults(defineProps<BadgeProps>(), {
  dot: false,
  maxCount: 99,
  tone: "neutral",
});

const { classAttr, restAttrs } = useClassAttrs();

const isHidden = computed(() => props.count === 0 && !props.dot);

const colorClass = computed(() => getBadgeColorClasses(props.tone));

const displayValue = computed(() =>
  props.count !== undefined
    ? Number(props.count) > props.maxCount
      ? `${props.maxCount}+`
      : props.count
    : "",
);

const badgeClasses = computed(() =>
  classNames(
    "inline-grid place-items-center text-center rounded-full text-[10px] font-semibold leading-4",
    "min-h-[1.125rem] min-w-[1.125rem] border border-white/80 dark:border-neutral-900/60",
    props.dot ? "px-1 py-1 bg-transparent text-transparent" : "px-1.5",
    !props.dot && colorClass.value,
    classAttr.value,
  ),
);

const dotClasses = computed(() =>
  classNames("block h-2 w-2 rounded-full", colorClass.value),
);
</script>

<!-- Badge component for displaying notification counts or indicators -->
<template>
  <span
    v-if="!isHidden && dot"
    :class="badgeClasses"
    aria-hidden="true"
    v-bind="restAttrs"
  >
    <span :class="dotClasses" aria-hidden="true" />
  </span>
  <span
    v-else-if="!isHidden"
    :class="badgeClasses"
    aria-hidden="true"
    v-bind="restAttrs"
  >
    {{ displayValue }}
  </span>
</template>
