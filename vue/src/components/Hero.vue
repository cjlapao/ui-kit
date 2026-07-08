<script lang="ts">
import type { VNode } from "vue";
import type { IconName } from "../icons/registry";
import type { TrueColor } from "../theme";
import type { PanelDecoration } from "./Panel.vue";

// ── Types ─────────────────────────────────────────────────────────────────────

export type HeroTitleSize = "xs" | "sm" | "md" | "lg" | "xl";
export type HeroSubtitleSize = "xs" | "sm" | "md";
export type HeroPadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export interface HeroProps {
  /** Main heading text. */
  title?: string;
  /** Supporting text rendered below the title at lower opacity. */
  subtitle?: string;
  /** Icon name from the registry, or a pre-built element. When omitted the icon slot is not rendered. */
  icon?: IconName | VNode;
  /** Colour tone — drives the gradient background. Defaults to `"blue"`. */
  tone?: TrueColor;
  /** Size of the title text. Colour is always white. Defaults to `"sm"`. */
  titleSize?: HeroTitleSize;
  /** Size of the subtitle text. Colour is always white/75. Defaults to `"xs"`. */
  subtitleSize?: HeroSubtitleSize;
  /** Internal padding. Defaults to `"none"`. */
  padding?: HeroPadding;
  /** Whether to apply `rounded-xl` corner rounding. Defaults to `true`. */
  rounded?: boolean;
  /**
   * Decorative layer inside the banner:
   * - `"shapes"`   — three floating circles at low white opacity
   * - `"gradient"` — a diagonal white-to-transparent light wash
   * - `"both"`     — circles + wash (default)
   * - `"none"`     — no decoration
   */
  decoration?: PanelDecoration;
}

// ── Static gradient map ────────────────────────────────────────────────────────
// All values are complete, literal Tailwind class strings so the JIT scanner
// includes them without needing a safelist entry.

const toneGradient: Record<TrueColor, string> = {
  red: "from-red-500 to-rose-600",
  orange: "from-orange-400 to-orange-600",
  amber: "from-amber-400 to-orange-500",
  yellow: "from-yellow-400 to-amber-500",
  lime: "from-lime-500 to-green-600",
  green: "from-green-500 to-emerald-600",
  emerald: "from-emerald-500 to-teal-600",
  teal: "from-teal-500 to-cyan-600",
  cyan: "from-cyan-400 to-sky-500",
  sky: "from-sky-400 to-indigo-500",
  blue: "from-blue-500 to-indigo-600",
  indigo: "from-indigo-500 to-violet-600",
  violet: "from-violet-500 to-purple-600",
  purple: "from-purple-500 to-fuchsia-600",
  fuchsia: "from-fuchsia-500 to-pink-600",
  rose: "from-rose-500 to-red-600",
  slate: "from-slate-600 to-slate-800",
  gray: "from-gray-600 to-gray-800",
  zinc: "from-zinc-600 to-zinc-800",
  neutral: "from-neutral-600 to-neutral-800",
  stone: "from-stone-600 to-stone-800",
};

// ── Size maps ─────────────────────────────────────────────────────────────────

const titleSizeMap: Record<HeroTitleSize, string> = {
  xs: "text-xs font-bold",
  sm: "text-sm font-bold",
  md: "text-base font-bold",
  lg: "text-lg font-semibold",
  xl: "text-xl font-semibold",
};

const subtitleSizeMap: Record<HeroSubtitleSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
};

const paddingMap: Record<HeroPadding, string> = {
  none: "p-0",
  xs: "p-2",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
  xl: "p-9",
};
</script>

<script setup lang="ts">
import { computed, useSlots } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";
import CustomIcon from "./CustomIcon.vue";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "Hero", inheritAttrs: false });

const props = withDefaults(defineProps<HeroProps>(), {
  tone: "blue",
  titleSize: "sm",
  subtitleSize: "xs",
  padding: "sm",
  rounded: true,
  decoration: "both",
});

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();

const showShapes = computed(
  () => props.decoration === "shapes" || props.decoration === "both",
);
const showGradient = computed(
  () => props.decoration === "gradient" || props.decoration === "both",
);

const rootClass = computed(() =>
  classNames(
    "relative overflow-hidden flex items-center gap-4 bg-linear-to-br shadow-lg",
    toneGradient[props.tone],
    paddingMap[props.padding],
    props.rounded && "rounded-xl",
    classAttr.value,
  ),
);

const titleClass = computed(() =>
  classNames("text-white leading-tight", titleSizeMap[props.titleSize]),
);

const subtitleClass = computed(() =>
  classNames(
    "text-white/75 mt-0.5 leading-relaxed",
    subtitleSizeMap[props.subtitleSize],
  ),
);

const hasSubtitle = computed(() => !!props.subtitle || !!slots.subtitle);
</script>

<template>
  <div :class="rootClass" v-bind="restAttrs">
    <!-- Decoration: floating circles at white/10 opacity — same intensity on all tones -->
    <template v-if="showShapes">
      <div
        class="pointer-events-none absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/10"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -left-8 -bottom-10 w-36 h-36 rounded-full bg-white/10 opacity-70"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute right-10 bottom-8 w-16 h-16 rounded-full bg-white/10 opacity-50"
        aria-hidden="true"
      />
    </template>

    <!-- Decoration: diagonal light wash for depth -->
    <div
      v-if="showGradient"
      class="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/10 to-transparent"
      aria-hidden="true"
    />

    <!-- Icon container -->
    <div
      v-if="icon"
      class="relative shrink-0 w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner"
    >
      <CustomIcon
        v-if="typeof icon === 'string'"
        :icon="icon"
        class="w-6 h-6 text-white"
      />
      <VNodeRenderer v-else :nodes="icon" />
    </div>

    <!-- Text -->
    <div class="relative min-w-0 flex-1">
      <p :class="titleClass">
        <slot name="title">{{ title }}</slot>
      </p>
      <p v-if="hasSubtitle" :class="subtitleClass">
        <slot name="subtitle">{{ subtitle }}</slot>
      </p>
    </div>
  </div>
</template>
