<script lang="ts">
// ── Types ─────────────────────────────────────────────────────────────────────

export type SectionCardVariant = "glass" | "elevated" | "subtle" | "flat";
export type SectionCardSize = "sm" | "md" | "lg";

export interface SectionCardProps {
  /** Section heading displayed above the content area. */
  title: string;
  titleClassName?: string;
  /**
   * Visual treatment of the card container.
   * - `glass`    — frosted glass (default)
   * - `elevated` — white/dark surface with shadow
   * - `subtle`   — very light tinted background, no border
   * - `flat`     — no background or border; title + content only
   */
  variant?: SectionCardVariant;
  /** Body padding size. Defaults to 'md'. */
  size?: SectionCardSize;
  /** Blur the body content (e.g. to indicate unavailable data). */
  blur?: boolean;
  bodyClassName?: string;
}

// ── Style tokens ──────────────────────────────────────────────────────────────

const variantStyles: Record<SectionCardVariant, string> = {
  glass: [
    "bg-white/95 dark:bg-neutral-900/90",
    "backdrop-blur-xl",
    "border border-neutral-200 dark:border-neutral-800",
    "rounded-xl",
  ].join(" "),
  elevated: [
    "bg-white dark:bg-neutral-900",
    "border border-neutral-200 dark:border-neutral-800",
    "shadow-sm",
    "rounded-xl",
  ].join(" "),
  subtle: ["bg-neutral-50 dark:bg-neutral-800/50", "rounded-xl"].join(" "),
  flat: "",
};

const sizeTokens: Record<SectionCardSize, { header: string; body: string }> = {
  sm: { header: "px-4 pt-2.5 pb-1.5", body: "px-4 pb-3" },
  md: { header: "px-6 pt-3 pb-2", body: "px-6 pb-4" },
  lg: { header: "px-8 pt-4 pb-2", body: "px-8 pb-6" },
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "SectionCard", inheritAttrs: false });

const props = withDefaults(defineProps<SectionCardProps>(), {
  variant: "glass",
  size: "md",
  blur: false,
});

const { classAttr, restAttrs } = useClassAttrs();

const tokens = computed(() => sizeTokens[props.size]);

const rootClass = computed(() =>
  classNames("overflow-hidden", variantStyles[props.variant], classAttr.value),
);

const titleClass = computed(() =>
  classNames(
    "text-[10px] font-semibold uppercase tracking-widest",
    "text-neutral-400 dark:text-neutral-500",
    props.titleClassName,
  ),
);

const bodyClass = computed(() =>
  classNames(tokens.value.body, props.blur && "blur-xs", props.bodyClassName),
);
</script>

<template>
  <div :class="rootClass" v-bind="restAttrs">
    <!-- Section heading -->
    <div :class="tokens.header">
      <div class="flex items-center justify-between">
        <span :class="titleClass">
          {{ title }}
        </span>
        <div v-if="$slots.actions"><slot name="actions" /></div>
      </div>
    </div>

    <!-- Body -->
    <div :class="bodyClass">
      <slot />
    </div>
  </div>
</template>
