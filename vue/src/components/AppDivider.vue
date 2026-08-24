<script lang="ts">
import type { ControlSize, TrueColor } from "../theme/Theme";

export type AppDividerOrientation = "vertical" | "horizontal";
export type AppDividerLabelPosition = "start" | "center" | "end";

export const APP_DIVIDER_VARIANTS = [
  "solid",
  "dashed",
  "dotted",
  "gradient",
] as const;
export type AppDividerVariant = (typeof APP_DIVIDER_VARIANTS)[number];

export interface AppDividerProps {
  /**
   * Which way the rule runs. Stays `vertical` by default — this component was
   * written for header sections and every existing call site relies on it.
   * @default "vertical"
   */
  orientation?: AppDividerOrientation;
  /** @default "solid" */
  variant?: AppDividerVariant;
  /**
   * Accent colour. Omit it and the rule takes a neutral divider colour that
   * works on both light and dark surfaces.
   */
  tone?: TrueColor;
  /** Line thickness on the shared control scale. @default "xs" */
  size?: ControlSize;
  /** Space either side of the rule. @default "sm" */
  spacing?: "none" | ControlSize;
  /**
   * Length along the rule's own axis — height when vertical, width when
   * horizontal. Defaults to `1.5rem` vertical, full width horizontal.
   */
  length?: number | string;
  /** Text set into the rule. The default slot overrides it. */
  label?: string;
  /** @default "center" */
  labelPosition?: AppDividerLabelPosition;
  /**
   * Hidden from assistive technology. Defaults to true for an unlabelled rule,
   * which is decoration; a labelled one is announced as a separator.
   */
  decorative?: boolean;

  /** @deprecated Use `length`. */
  height?: number | string;
  /** @deprecated Use `size`, or pass a number of pixels. */
  width?: number;
  /** @deprecated Use `spacing`. */
  margin?: number | string;
}

/**
 * Line thickness in CSS pixels.
 *
 * Applied inline rather than through `border-{n}` classes: Tailwind's border
 * ladder jumps 1 → 2 → 4 → 8, which is far too coarse for a rule. The previous
 * version used `w-[1.2px]`, a fractional width that rounds unpredictably.
 */
const THICKNESS: Record<ControlSize, number> = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
};

/** Margin along the divider's cross axis. */
const SPACING: Record<
  "none" | ControlSize,
  { vertical: string; horizontal: string }
> = {
  none: { vertical: "", horizontal: "" },
  xs: { vertical: "mx-1", horizontal: "my-1" },
  sm: { vertical: "mx-2", horizontal: "my-2" },
  md: { vertical: "mx-3", horizontal: "my-3" },
  lg: { vertical: "mx-4", horizontal: "my-4" },
  xl: { vertical: "mx-6", horizontal: "my-6" },
};

const toCss = (value: number | string): string =>
  typeof value === "number" ? `${value}px` : value;
</script>

<script setup lang="ts">
import { computed, useSlots } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "AppDivider", inheritAttrs: false });

const props = withDefaults(defineProps<AppDividerProps>(), {
  orientation: "vertical",
  variant: "solid",
  size: "xs",
  spacing: "sm",
  labelPosition: "center",
});

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();

const isVertical = computed(() => props.orientation === "vertical");
const hasLabel = computed(() => Boolean(props.label || slots.default));

// `height`, `width` and `margin` were declared in the props interface and
// never read — three documented props that did nothing at all. They are
// honoured now, as aliases of the replacements.
const resolvedLength = computed(
  () => props.length ?? props.height ?? (isVertical.value ? "1.5rem" : "100%"),
);
const thickness = computed(
  () => props.width ?? THICKNESS[props.size] ?? THICKNESS.xs,
);

const spacingClass = computed(() =>
  props.margin === undefined
    ? (SPACING[props.spacing] ?? SPACING.sm)[
        isVertical.value ? "vertical" : "horizontal"
      ]
    : "",
);

const isDecorative = computed(() => props.decorative ?? !hasLabel.value);

const rootStyle = computed(() => ({
  ...(isVertical.value
    ? { height: toCss(resolvedLength.value) }
    : { width: toCss(resolvedLength.value) }),
  ...(props.margin === undefined
    ? {}
    : isVertical.value
      ? { marginInline: toCss(props.margin) }
      : { marginBlock: toCss(props.margin) }),
}));

const lineStyle = computed(() => {
  if (props.variant === "gradient") {
    return {
      // Built from Tailwind's own colour custom properties rather than a
      // `via-{tone}-400` class, so every tone works without a safelist entry.
      backgroundImage: `linear-gradient(${
        isVertical.value ? "to bottom" : "to right"
      }, transparent, var(--color-${props.tone ?? "neutral"}-400), transparent)`,
      ...(isVertical.value
        ? { width: `${thickness.value}px` }
        : { height: `${thickness.value}px` }),
    };
  }
  return {
    borderStyle: props.variant,
    ...(isVertical.value
      ? { borderLeftWidth: `${thickness.value}px`, borderTopWidth: "0" }
      : { borderTopWidth: `${thickness.value}px`, borderLeftWidth: "0" }),
  };
});

const lineClass = computed(() =>
  classNames(
    // The line has to fill its wrapper along the rule's own axis. With only
    // `self-stretch` a horizontal rule was a zero-width span and painted
    // nothing at all.
    "shrink-0",
    isVertical.value ? "self-stretch" : "w-full",
    props.variant !== "gradient" &&
      (props.tone
        ? // A deliberately toned rule should be visible: `-300 / -500/25` was
        // the *hairline outline* pairing and all but vanished on a dark card.
        `border-${props.tone}-400 dark:border-${props.tone}-500`
        : "border-neutral-200 dark:border-neutral-700"),
  ),
);

const rootClass = computed(() =>
  classNames(
    "flex items-center",
    isVertical.value ? "flex-col" : "flex-row",
    spacingClass.value,
    classAttr.value,
  ),
);

/** A start- or end-positioned label keeps a short stub on the far side. */
const grow = computed(() =>
  props.labelPosition === "start"
    ? ["shrink-0 basis-4", "flex-1"]
    : props.labelPosition === "end"
      ? ["flex-1", "shrink-0 basis-4"]
      : ["flex-1", "flex-1"],
);
</script>

<template>
  <div
    v-bind="restAttrs"
    :role="isDecorative ? undefined : 'separator'"
    :aria-orientation="isDecorative ? undefined : orientation"
    :aria-hidden="isDecorative || undefined"
    :class="rootClass"
    :style="rootStyle"
  >
    <template v-if="hasLabel">
      <span :class="classNames('flex', grow[0])">
        <span aria-hidden="true" :class="lineClass" :style="lineStyle" />
      </span>
      <span
        :class="
          classNames(
            'shrink-0 text-xs font-medium text-neutral-500 dark:text-neutral-400',
            isVertical ? 'py-1' : 'px-2',
          )
        "
      >
        <slot>{{ label }}</slot>
      </span>
      <span :class="classNames('flex', grow[1])">
        <span aria-hidden="true" :class="lineClass" :style="lineStyle" />
      </span>
    </template>
    <span v-else class="flex flex-1">
      <span aria-hidden="true" :class="lineClass" :style="lineStyle" />
    </span>
  </div>
</template>
