<script lang="ts">
// ── Types ─────────────────────────────────────────────────────────────────────

export type SectionSize = "xs" | "sm" | "md" | "lg";

export type SectionVariant =
  /** Bold neutral title, no extra decoration (clean default). */
  | "default"
  /** Lighter muted title — lower visual weight. */
  | "subtle"
  /** Tiny all-caps + wide letter-spacing (matches standard detail-panel style). */
  | "uppercase"
  /** Same as `default` but with a bottom border separating header from body. */
  | "bordered"
  /** Subtle filled background on the header strip. */
  | "filled";

export interface SectionProps {
  /** Section heading. */
  title?: string;
  /** Optional secondary line below the title. */
  subtitle?: string;
  /** Controls header padding and title/subtitle font size. Defaults to `'md'`. */
  size?: SectionSize;
  /** Visual style of the section header. Defaults to `'uppercase'`. */
  variant?: SectionVariant;
  /**
   * Override title text size independently from `size`.
   * Accepts any Tailwind text-size class, e.g. `"text-xs"` or `"text-sm"`.
   */
  titleSize?: string;
  /**
   * Override title text colour / weight independently from `variant`.
   * e.g. `"text-sky-600 font-bold"`
   * Merged after variant styles so it wins on conflicts.
   */
  titleColor?: string;
  /**
   * Override subtitle text size independently from `size`.
   * e.g. `"text-[10px]"`
   */
  subtitleSize?: string;
  /**
   * Override subtitle text colour / weight.
   * e.g. `"text-neutral-600 dark:text-neutral-300"`
   */
  subtitleColor?: string;
  /** Extra classes for the title span. */
  titleClassName?: string;
  /** Extra classes for the subtitle span. */
  subtitleClassName?: string;
  /** Extra classes for the body wrapper div. */
  bodyClassName?: string;
  /** Extra classes for the header wrapper div. */
  headerClassName?: string;
  /** Whether to remove all padding from the section. */
  noPadding?: boolean;
}

// ── Tokens ────────────────────────────────────────────────────────────────────

type SizeToken = {
  headerPadding: string;
  title: string;
  subtitle: string;
  body: string;
};

const sizeTokens: Record<SectionSize, SizeToken> = {
  xs: {
    headerPadding: "px-3 pt-2 pb-1",
    title: "text-[9px]",
    subtitle: "text-[9px]",
    body: "space-y-0",
  },
  sm: {
    headerPadding: "px-4 pt-2.5 pb-1",
    title: "text-[10px]",
    subtitle: "text-[10px]",
    body: "space-y-0.5",
  },
  md: {
    headerPadding: "px-4 pt-3 pb-2",
    title: "text-[10px]",
    subtitle: "text-xs",
    body: "space-y-0.5",
  },
  lg: {
    headerPadding: "px-4 pt-3.5 pb-2.5",
    title: "text-xs",
    subtitle: "text-xs",
    body: "space-y-1",
  },
};

// Applied to the title <span>
const titleVariantStyles: Record<SectionVariant, string> = {
  default: "font-semibold text-neutral-600 dark:text-neutral-300",
  subtle: "font-medium text-neutral-400 dark:text-neutral-500",
  uppercase:
    "font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",
  bordered: "font-semibold text-neutral-600 dark:text-neutral-300",
  filled: "font-semibold text-neutral-700 dark:text-neutral-200",
};

// Applied to the header container <div>
const headerVariantStyles: Record<SectionVariant, string> = {
  default: "",
  subtle: "",
  uppercase: "",
  bordered: "border-b border-neutral-100 dark:border-neutral-800",
  filled: "bg-neutral-50 dark:bg-neutral-800/50",
};
</script>

<script setup lang="ts">
import { computed, useSlots } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "Section", inheritAttrs: false });

const props = withDefaults(defineProps<SectionProps>(), {
  size: "md",
  variant: "uppercase",
  noPadding: false,
});

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();

const tokens = computed(() => sizeTokens[props.size]);

const rootClass = computed(() => classNames("flex flex-col", classAttr.value));

const headerClass = computed(() =>
  classNames(
    "flex items-center justify-between",
    props.noPadding ? "px-0 pt-0 pb-0" : tokens.value.headerPadding,
    headerVariantStyles[props.variant],
    props.headerClassName,
  ),
);

const titleClass = computed(() =>
  classNames(
    props.titleSize ?? tokens.value.title,
    titleVariantStyles[props.variant],
    props.titleColor,
    props.titleClassName,
  ),
);

const subtitleClass = computed(() =>
  classNames(
    props.subtitleSize ?? tokens.value.subtitle,
    props.subtitleColor ?? "text-neutral-400 dark:text-neutral-500",
    props.subtitleClassName,
  ),
);

const bodyClass = computed(() =>
  classNames(tokens.value.body, props.bodyClassName),
);

const hasSubtitle = computed(() => !!props.subtitle || !!slots.subtitle);
</script>

<template>
  <div :class="rootClass" v-bind="restAttrs">
    <!-- Header -->
    <div :class="headerClass">
      <div class="flex flex-col gap-0.5 min-w-0">
        <span :class="titleClass">
          <slot name="title">{{ title }}</slot>
        </span>
        <span v-if="hasSubtitle" :class="subtitleClass">
          <slot name="subtitle">{{ subtitle }}</slot>
        </span>
      </div>

      <div v-if="$slots.actions" class="flex items-center gap-1 shrink-0">
        <slot name="actions" />
      </div>
    </div>

    <!-- Body -->
    <div v-if="$slots.default" :class="bodyClass"><slot /></div>
  </div>
</template>
