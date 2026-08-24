<script lang="ts">
import type { ControlSize, TrueColor } from "../theme/Theme";

export const BADGE_VARIANTS = ["solid", "soft", "outline"] as const;
export type BadgeVariant = (typeof BADGE_VARIANTS)[number];
export type BadgeSize = ControlSize;

export interface BadgeProps {
  /** Content to display inside the badge. */
  count?: number | string;
  /** Show only a dot indicator, with no count. */
  dot?: boolean;
  /** Max count to display before showing "+". @default 99 */
  maxCount?: number;
  /**
   * Render a `0` instead of nothing. A zero count is hidden by default, which
   * is usually right for a notification badge and wrong for a tally.
   */
  showZero?: boolean;
  /** @default "neutral" */
  tone?: TrueColor;
  /** @default "solid" */
  variant?: BadgeVariant;
  /** @default "sm" */
  size?: BadgeSize;
  /**
   * A ring in the page background colour, so the badge stays legible where it
   * overlaps an icon or avatar. Turn it off when the badge sits on its own.
   * @default true
   */
  ring?: boolean;
  /** Draws attention with a pinging halo. Respects `prefers-reduced-motion`. */
  pulse?: boolean;
  /**
   * What assistive technology announces, in place of the digits. Without it
   * the digits themselves are the accessible content.
   */
  label?: string;
  /**
   * Hide from assistive technology entirely. Defaults to true for a dot, which
   * carries no value of its own, and false for a count.
   */
  decorative?: boolean;
}

type BadgeSizeTokens = {
  /** Minimum box for a count badge — it grows with wider content. */
  box: string;
  text: string;
  padding: string;
  /** Diameter of the dot form. */
  dot: string;
};

const SIZES: Record<BadgeSize, BadgeSizeTokens> = {
  xs: {
    box: "min-h-3.5 min-w-3.5",
    text: "text-[9px]",
    padding: "px-1",
    dot: "h-1.5 w-1.5",
  },
  // `sm` is the shape the component had before it took a size prop, so
  // existing call sites keep their exact footprint.
  sm: {
    box: "min-h-4.5 min-w-4.5",
    text: "text-[10px]",
    padding: "px-1.5",
    dot: "h-2 w-2",
  },
  md: {
    box: "min-h-5 min-w-5",
    text: "text-[11px]",
    padding: "px-1.5",
    dot: "h-2.5 w-2.5",
  },
  lg: {
    box: "min-h-6 min-w-6",
    text: "text-xs",
    padding: "px-2",
    dot: "h-3 w-3",
  },
  xl: {
    box: "min-h-7 min-w-7",
    text: "text-sm",
    padding: "px-2",
    dot: "h-3.5 w-3.5",
  },
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import { getBadgeColorClasses, getPillColorClasses } from "../theme/Theme";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "Badge", inheritAttrs: false });

const props = withDefaults(defineProps<BadgeProps>(), {
  dot: false,
  maxCount: 99,
  showZero: false,
  tone: "neutral",
  variant: "solid",
  size: "sm",
  ring: true,
  pulse: false,
});

const { classAttr, restAttrs } = useClassAttrs();

const isHidden = computed(
  () => !props.dot && props.count === 0 && !props.showZero,
);

const sizeToken = computed(() => SIZES[props.size] ?? SIZES.sm);

/**
 * `solid` keeps the badge's own token — it is the only one of the three with a
 * dark-mode step tuned for a small filled pill. `soft` and `outline` come from
 * the shared Pill tokens rather than a second hand-written pair.
 */
const colorClass = computed(() => {
  if (props.variant === "solid") return getBadgeColorClasses(props.tone);
  const pill = getPillColorClasses(props.tone, props.variant);
  return classNames(pill.base, pill.border);
});

// A ring only reads against whatever is behind the badge, so it is painted in
// the page background colour rather than a tone.
const ringClass = computed(() =>
  props.ring
    ? "border border-white/80 dark:border-neutral-900/60"
    : "border border-transparent",
);

const displayValue = computed(() => {
  if (props.count === undefined) return "";
  const numeric =
    typeof props.count === "string" ? Number(props.count) : props.count;
  const overflowed =
    typeof numeric === "number" &&
    Number.isFinite(numeric) &&
    numeric > props.maxCount;
  return overflowed ? `${props.maxCount}+` : props.count;
});

const isDecorative = computed(() => props.decorative ?? props.dot);
// With a `label` the badge is announced as that instead of its digits, so the
// visual content is hidden to avoid reading both. Without one the digits *are*
// the accessible content — no duplicate copy in the DOM.
const labelled = computed(() => !isDecorative.value && Boolean(props.label));

const dotClass = computed(() =>
  classNames(
    // The dot *is* the badge. It used to be an 18px transparent box with an
    // 8px dot inside it, so `ring` drew a visible circle around nothing and
    // the footprint never matched the dot you could see.
    "relative inline-block shrink-0 rounded-full",
    sizeToken.value.dot,
    colorClass.value,
    ringClass.value,
    classAttr.value,
  ),
);

const countClass = computed(() =>
  classNames(
    "relative inline-grid place-items-center rounded-full text-center font-semibold leading-none tabular-nums",
    sizeToken.value.box,
    sizeToken.value.text,
    sizeToken.value.padding,
    colorClass.value,
    ringClass.value,
    classAttr.value,
  ),
);

const pulseClass = computed(() =>
  classNames(
    "absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:animate-none",
    colorClass.value,
  ),
);
</script>

<!-- Badge component for displaying notification counts or indicators -->
<template>
  <span
    v-if="!isHidden && dot"
    v-bind="restAttrs"
    :class="dotClass"
    :aria-hidden="isDecorative || undefined"
    :role="labelled ? 'img' : undefined"
    :aria-label="labelled ? label : undefined"
  >
    <span v-if="pulse" aria-hidden="true" :class="pulseClass" />
  </span>
  <span
    v-else-if="!isHidden"
    v-bind="restAttrs"
    :class="countClass"
    :aria-hidden="isDecorative || undefined"
    :role="labelled ? 'img' : undefined"
    :aria-label="labelled ? label : undefined"
  >
    <span v-if="pulse" aria-hidden="true" :class="pulseClass" />
    <!-- `.badge-count` trims the line box to cap-height/baseline so the digits
         sit on the circle's centre rather than ~0.3px below it. -->
    <span class="badge-count relative" :aria-hidden="labelled || undefined">
      <slot>{{ displayValue }}</slot>
    </span>
  </span>
</template>
