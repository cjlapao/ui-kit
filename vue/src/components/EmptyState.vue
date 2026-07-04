<script lang="ts">
import type { VNode } from "vue";
import type {
  ButtonVariant,
  ButtonSize,
  ButtonColor,
} from "./Button.vue";
import type { IconSize } from "../types/Icon";
import type { ThemeSize, ThemeColor } from "../theme/Theme";

export type TextSize = "xs" | "sm" | "md" | "lg" | "xl";

const iconSizes: Record<IconSize, string> = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const textSizes: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-2xl",
};

/** Accepts all theme colors. The original five semantic names (neutral/info/success/warning/danger) are preserved unchanged. */
export type EmptyStateTone = ThemeColor;

// ── Color resolution (mirrors Theme.ts) ────────────────────────────────────

const resolveColor = (color: ThemeColor): string => {
  switch (color) {
    case "brand":
      return "blue";
    case "info":
      return "sky";
    case "success":
      return "emerald";
    case "warning":
      return "amber";
    case "danger":
      return "rose";
    case "theme":
      return "neutral";
    case "parallels":
      return "red";
    default:
      return color;
  }
};

type ToneConfig = { border: string; text: string; bg: string; icon: string };

// ── Preserved original semantic entries (static strings — Tailwind picks these up directly) ──

const semanticTones: Partial<Record<ThemeColor, ToneConfig>> = {
  neutral: {
    border: "border-slate-300/70 dark:border-slate-700/60",
    text: "text-slate-600 dark:text-slate-300",
    bg: "bg-white/80 dark:bg-slate-900/40",
    icon: "text-slate-400 dark:text-slate-500",
  },
  info: {
    border: "border-blue-300/60 dark:border-blue-500/40",
    text: "text-blue-700 dark:text-blue-200",
    bg: "bg-blue-50/60 dark:bg-blue-950/20",
    icon: "text-blue-500 dark:text-blue-300",
  },
  success: {
    border: "border-emerald-300/60 dark:border-emerald-500/40",
    text: "text-emerald-700 dark:text-emerald-200",
    bg: "bg-emerald-50/60 dark:bg-emerald-950/20",
    icon: "text-emerald-500 dark:text-emerald-300",
  },
  warning: {
    border: "border-amber-300/60 dark:border-amber-500/40",
    text: "text-amber-700 dark:text-amber-200",
    bg: "bg-amber-50/60 dark:bg-amber-950/20",
    icon: "text-amber-500 dark:text-amber-300",
  },
  danger: {
    border: "border-rose-300/60 dark:border-rose-500/40",
    text: "text-rose-700 dark:text-rose-200",
    bg: "bg-rose-50/60 dark:bg-rose-950/20",
    icon: "text-rose-500 dark:text-rose-300",
  },
  parallels: {
    border: "border-red-300/60 dark:border-red-500/40",
    text: "text-red-700 dark:text-red-200",
    bg: "bg-red-50/60 dark:bg-red-950/20",
    icon: "text-red-500 dark:text-red-300",
  },
  brand: {
    border: "border-blue-300/60 dark:border-blue-500/40",
    text: "text-blue-700 dark:text-blue-200",
    bg: "bg-blue-50/60 dark:bg-blue-950/20",
    icon: "text-blue-500 dark:text-blue-300",
  },
  theme: {
    border: "border-slate-300/60 dark:border-slate-500/40",
    text: "text-slate-700 dark:text-slate-200",
    bg: "bg-slate-50/60 dark:bg-slate-950/20",
    icon: "text-slate-500 dark:text-slate-300",
  },
  white: {
    border: "border-slate-300/60 dark:border-slate-500/40",
    text: "text-slate-700 dark:text-slate-200",
    bg: "bg-slate-50/60 dark:bg-slate-950/20",
    icon: "text-slate-500 dark:text-slate-300",
  },
};

const sizes: Record<ThemeSize, string> = {
  xs: "h-[30%] w-[30%]",
  sm: "h-[35%] w-[35%]",
  md: "h-[40%] w-[40%]",
  lg: "h-[45%] w-[45%]",
  xl: "h-[50%] w-[50%]",
  xxl: "h-[55%] w-[55%]",
  xxxl: "h-[60%] w-[60%]",
  full: "h-full w-full",
  "2xl": "h-[65%] w-[65%]",
  "3xl": "h-[70%] w-[70%]",
};

// ── Dynamic builder for all other ThemeColor values ────────────────────────
// Uses only class patterns already declared in tailwind-safelist.ts:
//   border-{c}-200            (border200)
//   dark:border-{c}-500/40    (darkBorder500_40)
//   text-{c}-700              (text700)
//   dark:text-{c}-200         (darkText200)
//   bg-{c}-50/80              (bg50_80)
//   dark:bg-{c}-500/10        (darkBg500_10)
//   text-{c}-500              (text500)
//   dark:text-{c}-300         (darkText300)

function buildToneClasses(color: ThemeColor): ToneConfig {
  if (semanticTones[color]) return semanticTones[color]!;
  if (color === "white" || color === "theme") return semanticTones.neutral!;

  const c = resolveColor(color);
  return {
    border: `border-${c}-200 dark:border-${c}-500/40`,
    text: `text-${c}-700 dark:text-${c}-200`,
    bg: `bg-${c}-50/80 dark:bg-${c}-500/10`,
    icon: `text-${c}-500 dark:text-${c}-300`,
  };
}

// ── Props ───────────────────────────────────────────────────────────────────

export interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: ButtonVariant;
  actionColor?: ButtonColor;
  icon?: string | VNode;
  iconSize?: IconSize;
  iconColor?: ThemeColor;
  textSize?: TextSize;
  showIcon?: boolean;
  tone?: EmptyStateTone;
  disableBorder?: boolean;
  transparentBackground?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  actionSize?: ButtonSize;
  actionLeadingIcon?: string | VNode;
  size?: ThemeSize;
}
</script>

<script setup lang="ts">
import { computed, isVNode, useSlots } from "vue";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import { useClassAttrs } from "../utils/attrsUtils";
import Button from "./Button.vue";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "EmptyState", inheritAttrs: false });

const props = withDefaults(defineProps<EmptyStateProps>(), {
  actionVariant: "soft",
  actionColor: "blue",
  icon: "Plus",
  iconSize: "xl",
  textSize: "md",
  showIcon: true,
  tone: "neutral",
  fullWidth: false,
  fullHeight: false,
  actionSize: "sm",
  size: "md",
  disableBorder: false,
  transparentBackground: false,
});

const slots = useSlots();
const { classAttr, restAttrs } = useClassAttrs();
const renderIcon = useIconRenderer();

const palette = computed(() => buildToneClasses(props.tone));

// lets make the subtitle text size smaller than the title text size
const subtitleTextSize = computed<TextSize>(() =>
  props.textSize === "xs"
    ? "xs"
    : props.textSize === "sm"
      ? "xs"
      : props.textSize === "md"
        ? "sm"
        : props.textSize === "lg"
          ? "md"
          : "lg",
);

const iconPallete = computed(() =>
  !props.iconColor ? palette.value : buildToneClasses(props.iconColor),
);

const rootClass = computed(() =>
  classNames(
    "flex flex-col items-center justify-center gap-1 rounded-3xl px-6 py-10 text-center transition",
    !props.disableBorder && "border-2 border-dashed shadow-sm",
    palette.value.border,
    !props.transparentBackground && palette.value.bg,
    sizes[props.size],
    props.fullWidth && "w-full",
    props.fullHeight && "h-full",
    classAttr.value,
  ),
);

const iconWrapperClass = computed(() =>
  classNames("p-2 dark:bg-white/5", iconPallete.value.icon),
);

const iconNodes = computed(() =>
  isVNode(props.icon)
    ? props.icon
    : renderIcon(props.icon, props.iconSize, iconSizes[props.iconSize]),
);

const titleClass = computed(() =>
  classNames(textSizes[props.textSize], "font-semibold", palette.value.text),
);

const subtitleClass = computed(() =>
  classNames(
    textSizes[subtitleTextSize.value],
    "leading-relaxed break-all",
    palette.value.text,
  ),
);

const hasSubtitle = computed(() => !!props.subtitle || !!slots.subtitle);
</script>

<template>
  <section :class="rootClass" v-bind="restAttrs">
    <div v-if="showIcon" :class="iconWrapperClass">
      <VNodeRenderer :nodes="iconNodes" />
    </div>
    <div class="space-y-1">
      <p :class="titleClass">
        <slot name="title">{{ title }}</slot>
      </p>
      <p v-if="hasSubtitle" :class="subtitleClass">
        <slot name="subtitle">{{ subtitle }}</slot>
      </p>
    </div>
    <div v-if="actionLabel && onAction" class="mt-4">
      <Button
        :size="actionSize"
        :variant="actionVariant"
        :color="actionColor"
        :leading-icon="actionLeadingIcon"
        @click="onAction?.()"
      >
        {{ actionLabel }}
      </Button>
    </div>
  </section>
</template>
