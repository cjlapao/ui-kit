<script lang="ts">
import type { ControlSize, TrueColor } from "../theme/Theme";

export interface HeaderGroupProps {
  /** Space between this group and the one before it. @default "sm" */
  gap?: ControlSize;
  /** Space between the items inside this group. @default "xs" */
  itemGap?: ControlSize;
  /** Draw a separator when this group follows another. @default true */
  divider?: boolean;
  /**
   * Colour of that separator. Omit it and the rule is a fraction of the
   * surrounding text colour, which adapts to the surface.
   */
  tone?: TrueColor;
  /** Accessible name for the group. */
  label?: string;
}

/** Space between adjacent groups, in CSS pixels. */
const GAP_PX: Record<ControlSize, number> = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

/** Space between the items inside one group. */
const ITEM_GAP: Record<ControlSize, string> = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
  xl: "gap-6",
};

/**
 * The separator is a `::before` on the *second* of two adjacent groups, so a
 * lone group never draws a leading rule and no wrapper element is needed
 * between them. Both the gap and the separator's offset read the same custom
 * property, so changing `gap` cannot leave the rule off-centre — they were
 * previously a hardcoded `ml-2` and `left-[-4px]` kept in sync by hand.
 */
const SEPARATOR = [
  "[&+&]:ml-[var(--header-group-gap)]",
  "[&+&::before]:content-['']",
  "[&+&::before]:absolute",
  "[&+&::before]:left-[calc(var(--header-group-gap)/-2)]",
  "[&+&::before]:top-1/2",
  "[&+&::before]:-translate-y-1/2",
  "[&+&::before]:h-1/2",
  "[&+&::before]:w-px",
  "[&+&::before]:bg-[var(--header-group-divider)]",
].join(" ");
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "HeaderGroup", inheritAttrs: false });

const props = withDefaults(defineProps<HeaderGroupProps>(), {
  gap: "sm",
  itemGap: "xs",
  divider: true,
});

const { classAttr, restAttrs } = useClassAttrs();

const rootClass = computed(() =>
  classNames(
    "relative flex h-full items-center",
    // Was `text-black dark:text-white`, which ignores the surface it sits on.
    "text-neutral-900 dark:text-neutral-100",
    props.divider && SEPARATOR,
    classAttr.value,
  ),
);

const rootStyle = computed(() => ({
  "--header-group-gap": `${GAP_PX[props.gap] ?? GAP_PX.sm}px`,
  // Built from Tailwind's own colour custom properties, so every tone works
  // without needing a safelist entry *inside* an arbitrary variant. Untoned,
  // the rule is a fraction of the surrounding text colour — the old flat
  // `bg-neutral-300` had no dark partner and all but vanished on a dark header.
  "--header-group-divider": props.tone
    ? `var(--color-${props.tone}-400)`
    : "color-mix(in srgb, currentColor 25%, transparent)",
}));

const innerClass = computed(() =>
  classNames("flex items-center px-1", ITEM_GAP[props.itemGap] ?? ITEM_GAP.xs),
);
</script>

<template>
  <!-- `role="group"` because that is what this is — a related cluster of
       header controls. It had no semantics at all. -->
  <div
    v-bind="restAttrs"
    role="group"
    :aria-label="label"
    :class="rootClass"
    :style="rootStyle"
  >
    <div :class="innerClass">
      <slot />
    </div>
  </div>
</template>
