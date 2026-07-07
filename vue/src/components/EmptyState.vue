<script lang="ts">
import type { VNode } from "vue";
import type {
  ButtonVariant,
  ButtonSize,
  ButtonColor,
} from "./Button.vue";
import type { IconSize } from "../types/Icon";
import type { Size, TrueColor } from "../theme/Theme";

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
export type EmptyStateTone = TrueColor;

// ── Color resolution (mirrors Theme.ts) ────────────────────────────────────

const resolveColor = (color: TrueColor): string => color;

type ToneConfig = { border: string; text: string; bg: string; icon: string };

// ── Preserved original semantic entries (static strings — Tailwind picks these up directly) ──

const semanticTones: Partial<Record<TrueColor, ToneConfig>> = {
  neutral: {
    border: "border-slate-300/70 dark:border-slate-700/60",
    text: "text-slate-600 dark:text-slate-300",
    bg: "bg-white/80 dark:bg-slate-900/40",
    icon: "text-slate-400 dark:text-slate-500",
  },
};

const sizes: Record<Size, string> = {
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

// ── Dynamic builder for all other TrueColor values ────────────────────────
// Uses only class patterns already declared in tailwind-safelist.ts:
//   border-{c}-200            (border200)
//   dark:border-{c}-500/40    (darkBorder500_40)
//   text-{c}-700              (text700)
//   dark:text-{c}-200         (darkText200)
//   bg-{c}-50/80              (bg50_80)
//   dark:bg-{c}-500/10        (darkBg500_10)
//   text-{c}-500              (text500)
//   dark:text-{c}-300         (darkText300)

function buildToneClasses(color: TrueColor): ToneConfig {
  if (semanticTones[color]) return semanticTones[color]!;
  if (color === "neutral") return semanticTones.neutral!;

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
  iconColor?: TrueColor;
  textSize?: TextSize;
  showIcon?: boolean;
  tone?: EmptyStateTone;
  disableBorder?: boolean;
  transparentBackground?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  actionSize?: ButtonSize;
  actionLeadingIcon?: string | VNode;
  size?: Size;
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
