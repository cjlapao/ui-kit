<script lang="ts">
import type { TrueColor } from "../theme/Theme";

export type StatusSpinnerIntent = TrueColor;
export type StatusSpinnerSize = "xs" | "sm" | "md" | "lg";

const SIZE_TOKENS: Record<
  StatusSpinnerSize,
  { wrapper: string; dot: string; border: string }
> = {
  xs: { wrapper: "h-4 w-4", dot: "h-1.5 w-1.5", border: "border-[1.5px]" },
  sm: { wrapper: "h-5 w-5", dot: "h-2 w-2", border: "border-[2px]" },
  md: { wrapper: "h-6 w-6", dot: "h-2.5 w-2.5", border: "border-[2.5px]" },
  lg: { wrapper: "h-8 w-8", dot: "h-3 w-3", border: "border-[3px]" },
};

const INTENT_TOKENS: Record<
  TrueColor,
  { dot: string; accent: string; track: string }
> = {
  red: {
    dot: "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.7)]",
    accent: "rgb(248,113,113)",
    track: "rgba(248,113,113,0.28)",
  },
  orange: {
    dot: "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.7)]",
    accent: "rgb(251,146,60)",
    track: "rgba(251,146,60,0.28)",
  },
  amber: {
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]",
    accent: "rgb(251,191,36)",
    track: "rgba(251,191,36,0.3)",
  },
  yellow: {
    dot: "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.7)]",
    accent: "rgb(250,204,21)",
    track: "rgba(250,204,21,0.3)",
  },
  lime: {
    dot: "bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.7)]",
    accent: "rgb(163,230,53)",
    track: "rgba(163,230,53,0.28)",
  },
  green: {
    dot: "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]",
    accent: "rgb(74,222,128)",
    track: "rgba(74,222,128,0.28)",
  },
  emerald: {
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.65)]",
    accent: "rgb(16,185,129)",
    track: "rgba(16,185,129,0.23)",
  },
  teal: {
    dot: "bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.65)]",
    accent: "rgb(45,212,191)",
    track: "rgba(45,212,191,0.25)",
  },
  cyan: {
    dot: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.65)]",
    accent: "rgb(34,211,238)",
    track: "rgba(34,211,238,0.25)",
  },
  sky: {
    dot: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.65)]",
    accent: "rgb(56,189,248)",
    track: "rgba(56,189,248,0.25)",
  },
  blue: {
    dot: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.65)]",
    accent: "rgb(96,165,250)",
    track: "rgba(96,165,250,0.25)",
  },
  indigo: {
    dot: "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.65)]",
    accent: "rgb(129,140,248)",
    track: "rgba(129,140,248,0.25)",
  },
  violet: {
    dot: "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.65)]",
    accent: "rgb(167,139,250)",
    track: "rgba(167,139,250,0.25)",
  },
  purple: {
    dot: "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.65)]",
    accent: "rgb(192,132,252)",
    track: "rgba(192,132,252,0.25)",
  },
  fuchsia: {
    dot: "bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.65)]",
    accent: "rgb(217,70,239)",
    track: "rgba(217,70,239,0.25)",
  },
  rose: {
    dot: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.7)]",
    accent: "rgb(251,113,133)",
    track: "rgba(251,113,133,0.28)",
  },
  slate: {
    dot: "bg-slate-400 shadow-[0_0_6px_rgba(148,163,184,0.55)] dark:bg-slate-300",
    accent: "rgb(148,163,184)",
    track: "rgba(148,163,184,0.25)",
  },
  gray: {
    dot: "bg-gray-400 shadow-[0_0_6px_rgba(156,163,175,0.55)] dark:bg-gray-300",
    accent: "rgb(156,163,175)",
    track: "rgba(156,163,175,0.25)",
  },
  zinc: {
    dot: "bg-zinc-400 shadow-[0_0_6px_rgba(161,161,170,0.55)] dark:bg-zinc-300",
    accent: "rgb(161,161,170)",
    track: "rgba(161,161,170,0.25)",
  },
  neutral: {
    dot: "bg-neutral-400 shadow-[0_0_6px_rgba(163,163,163,0.55)] dark:bg-neutral-300",
    accent: "rgb(163,163,163)",
    track: "rgba(163,163,163,0.25)",
  },
  stone: {
    dot: "bg-stone-400 shadow-[0_0_6px_rgba(168,160,152,0.55)] dark:bg-stone-300",
    accent: "rgb(168,160,152)",
    track: "rgba(168,160,152,0.25)",
  },
};

export interface StatusSpinnerProps {
  intent?: StatusSpinnerIntent;
  size?: StatusSpinnerSize;
  animated?: boolean;
  label?: string;
}
</script>

<script setup lang="ts">
import { computed, ref, type CSSProperties } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "StatusSpinner", inheritAttrs: false });

const props = withDefaults(defineProps<StatusSpinnerProps>(), {
  intent: "blue",
  size: "md",
  animated: true,
});

const { classAttr, restAttrs } = useClassAttrs();

const el = ref<HTMLSpanElement | null>(null);
defineExpose({ el });

const palette = computed(() => INTENT_TOKENS[props.intent] ?? INTENT_TOKENS.blue);
const sizeToken = computed(() => SIZE_TOKENS[props.size] ?? SIZE_TOKENS.md);

const spinnerStyle = computed<CSSProperties>(() =>
  props.animated
    ? {
        borderTopColor: palette.value.accent,
        borderRightColor: palette.value.track,
        borderBottomColor: palette.value.track,
        borderLeftColor: palette.value.track,
      }
    : {
        borderColor: palette.value.track,
      },
);

const rootClass = computed(() =>
  classNames("inline-flex items-center gap-2", classAttr.value),
);

const ringClass = computed(() =>
  classNames(
    "absolute inset-0 rounded-full border-solid border-transparent transition-all duration-200 ease-out",
    sizeToken.value.border,
    props.animated && "animate-spin motion-reduce:animate-none",
  ),
);

const dotClass = computed(() =>
  classNames(
    "relative rounded-full ring-1 ring-white/40 transition-shadow duration-200 dark:ring-black/40",
    sizeToken.value.dot,
    palette.value.dot,
  ),
);
</script>

<template>
  <span ref="el" :class="rootClass" v-bind="restAttrs">
    <span
      :class="
        classNames(
          'relative inline-flex shrink-0 items-center justify-center',
          sizeToken.wrapper,
        )
      "
      role="status"
      aria-live="polite"
    >
      <span :class="ringClass" :style="spinnerStyle" />
      <span :class="dotClass" />
    </span>
    <span
      v-if="label"
      class="text-xs font-medium text-neutral-600 dark:text-neutral-300"
    >
      {{ label }}
    </span>
    <span class="sr-only">{{ label ?? "Loading status" }}</span>
  </span>
</template>
