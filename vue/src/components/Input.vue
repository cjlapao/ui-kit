<script lang="ts">
import type { VNode } from "vue";
import type { ButtonColor } from "./Button.vue";
import type { ThemeColor } from "../theme/Theme";

type InputValidationStatus = "none" | "error" | "success";
type InputSize = "sm" | "md" | "lg";
export type InputVariant = "flat" | "elevated" | "ghost" | "underline";

const sizeStyles: Record<
  InputSize,
  {
    input: string;
    leadingPadding: string;
    trailingPadding: string;
    icon?: string;
    iconLeft: string;
    iconRight: string;
    iconSize: string;
  }
> = {
  sm: {
    input: "px-3 py-1.5 text-sm",
    leadingPadding: "pl-8",
    trailingPadding: "pr-8",
    iconSize: "h-3.5 w-3.5",
    iconLeft: "left-2.5",
    iconRight: "right-2.5",
  },
  md: {
    input: "px-3.5 py-2.5 text-sm",
    leadingPadding: "pl-10",
    trailingPadding: "pr-10",
    iconSize: "h-4 w-4",
    iconLeft: "left-3.5",
    iconRight: "right-3.5",
  },
  lg: {
    input: "px-4 py-3 text-base",
    leadingPadding: "pl-11",
    trailingPadding: "pr-11",
    iconSize: "h-5 w-5",
    iconLeft: "left-4",
    iconRight: "right-4",
  },
};

type InputToneTokens = {
  /** Full focus indicator: colored border + glow ring. Used by flat / elevated / ghost variants. */
  focusRing: string;
  /** Border-only focus indicator: no ring. Used by the underline variant. */
  focusBorder: string;
  icon: string;
};

const toneTokens: Partial<Record<ThemeColor, InputToneTokens>> = {
  parallels: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    focusBorder: "focus:border-rose-500",
    icon: "text-rose-500 dark:text-rose-300",
  },
  brand: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    focusBorder: "focus:border-rose-500",
    icon: "text-rose-500 dark:text-rose-300",
  },
  theme: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    focusBorder: "focus:border-rose-500",
    icon: "text-rose-500 dark:text-rose-300",
  },
  red: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    focusBorder: "focus:border-rose-500",
    icon: "text-rose-500 dark:text-rose-300",
  },
  orange: {
    focusRing: "focus:border-orange-400 focus:ring-2 focus:ring-orange-400/60",
    focusBorder: "focus:border-orange-500",
    icon: "text-orange-500 dark:text-orange-300",
  },
  amber: {
    focusRing: "focus:border-amber-400 focus:ring-2 focus:ring-amber-400/60",
    focusBorder: "focus:border-amber-500",
    icon: "text-amber-500 dark:text-amber-300",
  },
  yellow: {
    focusRing: "focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/60",
    focusBorder: "focus:border-yellow-500",
    icon: "text-yellow-500 dark:text-yellow-300",
  },
  lime: {
    focusRing: "focus:border-lime-400 focus:ring-2 focus:ring-lime-400/60",
    focusBorder: "focus:border-lime-500",
    icon: "text-lime-500 dark:text-lime-300",
  },
  green: {
    focusRing:
      "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60",
    focusBorder: "focus:border-emerald-500",
    icon: "text-emerald-500 dark:text-emerald-300",
  },
  emerald: {
    focusRing:
      "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60",
    focusBorder: "focus:border-emerald-500",
    icon: "text-emerald-500 dark:text-emerald-300",
  },
  teal: {
    focusRing: "focus:border-teal-400 focus:ring-2 focus:ring-teal-400/60",
    focusBorder: "focus:border-teal-500",
    icon: "text-teal-500 dark:text-teal-300",
  },
  cyan: {
    focusRing: "focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/60",
    focusBorder: "focus:border-cyan-500",
    icon: "text-cyan-500 dark:text-cyan-300",
  },
  sky: {
    focusRing: "focus:border-sky-400 focus:ring-2 focus:ring-sky-400/60",
    focusBorder: "focus:border-sky-500",
    icon: "text-sky-500 dark:text-sky-300",
  },
  blue: {
    focusRing: "focus:border-blue-400 focus:ring-2 focus:ring-blue-400/60",
    focusBorder: "focus:border-blue-500",
    icon: "text-blue-500 dark:text-blue-300",
  },
  indigo: {
    focusRing: "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/60",
    focusBorder: "focus:border-indigo-500",
    icon: "text-indigo-500 dark:text-indigo-300",
  },
  violet: {
    focusRing: "focus:border-violet-400 focus:ring-2 focus:ring-violet-400/60",
    focusBorder: "focus:border-violet-500",
    icon: "text-violet-500 dark:text-violet-300",
  },
  purple: {
    focusRing: "focus:border-purple-400 focus:ring-2 focus:ring-purple-400/60",
    focusBorder: "focus:border-purple-500",
    icon: "text-purple-500 dark:text-purple-300",
  },
  fuchsia: {
    focusRing:
      "focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/60",
    focusBorder: "focus:border-fuchsia-500",
    icon: "text-fuchsia-500 dark:text-fuchsia-300",
  },
  pink: {
    focusRing: "focus:border-pink-400 focus:ring-2 focus:ring-pink-400/60",
    focusBorder: "focus:border-pink-500",
    icon: "text-pink-500 dark:text-pink-300",
  },
  rose: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    focusBorder: "focus:border-rose-500",
    icon: "text-rose-500 dark:text-rose-300",
  },
  slate: {
    focusRing: "focus:border-slate-500 focus:ring-2 focus:ring-slate-500/60",
    focusBorder: "focus:border-slate-600",
    icon: "text-slate-500 dark:text-slate-200",
  },
  gray: {
    focusRing: "focus:border-gray-400 focus:ring-2 focus:ring-gray-400/60",
    focusBorder: "focus:border-gray-500",
    icon: "text-gray-500 dark:text-gray-300",
  },
  zinc: {
    focusRing: "focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/60",
    focusBorder: "focus:border-zinc-500",
    icon: "text-zinc-500 dark:text-zinc-300",
  },
  neutral: {
    focusRing:
      "focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/60 dark:focus:border-neutral-500 dark:focus:ring-neutral-500/60",
    focusBorder: "focus:border-neutral-600 dark:focus:border-neutral-400",
    icon: "text-neutral-500 dark:text-neutral-300",
  },
  stone: {
    focusRing: "focus:border-stone-400 focus:ring-2 focus:ring-stone-400/60",
    focusBorder: "focus:border-stone-500",
    icon: "text-stone-500 dark:text-stone-300",
  },
  white: {
    focusRing: "focus:border-slate-400 focus:ring-2 focus:ring-slate-400/60",
    focusBorder: "focus:border-slate-500",
    icon: "text-slate-400 dark:text-slate-200",
  },
  info: {
    focusRing: "focus:border-sky-400 focus:ring-2 focus:ring-sky-400/60",
    focusBorder: "focus:border-sky-500",
    icon: "text-sky-500 dark:text-sky-300",
  },
  success: {
    focusRing:
      "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60",
    focusBorder: "focus:border-emerald-500",
    icon: "text-emerald-500 dark:text-emerald-300",
  },
  warning: {
    focusRing: "focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/60",
    focusBorder: "focus:border-yellow-500",
    icon: "text-yellow-500 dark:text-yellow-300",
  },
  danger: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    focusBorder: "focus:border-rose-500",
    icon: "text-rose-500 dark:text-rose-300",
  },
};

const statusClasses: Record<Exclude<InputValidationStatus, "none">, string> = {
  error:
    "border-rose-500 focus:border-rose-500 focus:ring-rose-500/60 text-neutral-900 placeholder:text-neutral-400 dark:border-rose-400 dark:focus:border-rose-400 dark:focus:ring-rose-400/60 dark:text-neutral-100",
  success:
    "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/60 text-neutral-900 placeholder:text-neutral-400 dark:border-emerald-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/60 dark:text-neutral-100",
};

const unstyledStatusClasses: Record<
  Exclude<InputValidationStatus, "none">,
  string
> = {
  error: "text-neutral-900 dark:text-neutral-100",
  success: "text-neutral-900 dark:text-neutral-100",
};

const disabledClasses =
  "disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400 dark:disabled:border-neutral-700 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500";

/**
 * Visual surface variants:
 *
 * flat      — clean thin border, no shadow. Best for most form contexts. (default)
 * elevated  — adds a subtle drop shadow; stands out against low-contrast backgrounds.
 * ghost     — transparent border at rest; border and ring reveal on hover, focus, or validation.
 *             Great for inline editing or dense layouts.
 * underline — bottom border only; no background fill. Minimalist / inline editing style.
 *             Focus shows the accent border colour; no glow ring.
 */
const variantStyles: Record<InputVariant, string> = {
  flat: "rounded-lg border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900",
  elevated:
    "rounded-lg border border-neutral-300 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900",
  ghost:
    "rounded-lg border border-transparent bg-neutral-100/80 hover:border-neutral-300 hover:bg-white dark:bg-neutral-800/60 dark:hover:border-neutral-600 dark:hover:bg-neutral-800",
  underline:
    "rounded-none border-0 border-b border-neutral-300 bg-transparent px-0 transition-colors dark:border-neutral-600",
};

type IconRenderer = string | VNode;

export interface InputProps {
  /** Current value of the input (v-model). */
  modelValue?: string;
  size?: InputSize;
  tone?: ButtonColor;
  /** Visual surface style. Defaults to `flat`. */
  variant?: InputVariant;
  validationStatus?: InputValidationStatus;
  leadingIcon?: IconRenderer;
  trailingIcon?: IconRenderer;
  /** When provided, the trailing icon renders as an interactive button instead of a static decoration. */
  onTrailingIconClick?: (event: MouseEvent) => void;
  wrapperClassName?: string;
  unstyled?: boolean;
  fullHeight?: boolean;
  disabled?: boolean;
}

export type InputValidationStatusType = InputValidationStatus;
</script>

<script setup lang="ts">
import {
  cloneVNode,
  computed,
  h,
  isVNode,
  normalizeClass,
  ref,
  type VNodeChild,
} from "vue";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "Input", inheritAttrs: false, __UI_INPUT: true });

const props = withDefaults(defineProps<InputProps>(), {
  size: "md",
  tone: "blue",
  variant: "flat",
  validationStatus: "none",
  unstyled: false,
  fullHeight: false,
});

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const { classAttr, restAttrs } = useClassAttrs();
const renderIcon = useIconRenderer();

const el = ref<HTMLInputElement | null>(null);
defineExpose({ el });

const sizeToken = computed(() => sizeStyles[props.size] ?? sizeStyles.md);
const tokens = computed(
  () => (toneTokens[props.tone] ?? toneTokens.theme) as InputToneTokens,
);
const hasLeadingIcon = computed(() => Boolean(props.leadingIcon));
const hasTrailingIcon = computed(() => Boolean(props.trailingIcon));
const isUnstyled = computed(() => props.unstyled);

const renderVisual = (
  visual: IconRenderer | undefined,
  iconClassName: string,
): VNodeChild => {
  if (!visual) {
    return null;
  }
  if (typeof visual === "string") {
    return renderIcon(visual, undefined, iconClassName);
  }
  if (isVNode(visual)) {
    const clone = cloneVNode(visual);
    clone.props = {
      ...(clone.props ?? {}),
      class: classNames(
        iconClassName,
        normalizeClass(visual.props?.class) || undefined,
      ),
    };
    return clone;
  }
  return h("span", { class: iconClassName }, [visual]);
};

const baseInputClasses = computed(() =>
  classNames(
    "block w-full text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500",
    sizeToken.value.input,
    !isUnstyled.value && variantStyles[props.variant],
    disabledClasses,
    hasLeadingIcon.value && sizeToken.value.leadingPadding,
    hasTrailingIcon.value && sizeToken.value.trailingPadding,
    classAttr.value,
  ),
);

const unstyledClasses = computed(() =>
  isUnstyled.value
    ? classNames(
        "border-0 bg-transparent focus:border-transparent focus:ring-0 dark:bg-transparent",
        sizeToken.value.input,
        hasLeadingIcon.value && sizeToken.value.leadingPadding,
        hasTrailingIcon.value && sizeToken.value.trailingPadding,
      )
    : "",
);

const statusClass = computed(() =>
  props.validationStatus !== "none"
    ? isUnstyled.value
      ? unstyledStatusClasses[props.validationStatus]
      : statusClasses[props.validationStatus]
    : undefined,
);

const mergedInputClasses = computed(() =>
  classNames(
    isUnstyled.value ? unstyledClasses.value : baseInputClasses.value,
    !isUnstyled.value &&
      (props.variant === "underline"
        ? tokens.value.focusBorder
        : tokens.value.focusRing),
    props.fullHeight && "h-full",
  ),
);

const inputClass = computed(() =>
  classNames(mergedInputClasses.value, statusClass.value),
);

const renderIconWrapper = (
  visual: IconRenderer | undefined,
  position: "left" | "right",
  onClick?: (event: MouseEvent) => void,
): VNodeChild => {
  if (!visual) {
    return null;
  }
  const positionClass =
    position === "left" ? sizeToken.value.iconLeft : sizeToken.value.iconRight;
  if (onClick) {
    return h(
      "button",
      {
        type: "button",
        tabindex: -1,
        onClick,
        class: classNames(
          "absolute flex items-center justify-center rounded",
          positionClass,
          sizeToken.value.iconSize,
          tokens.value.icon,
          props.validationStatus === "error" &&
            "text-rose-500 dark:text-rose-400",
          props.validationStatus === "success" &&
            "text-emerald-500 dark:text-emerald-400",
          "cursor-pointer p-0.5 transition-colors duration-150 hover:text-neutral-700 dark:hover:text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-current",
        ),
      },
      [renderVisual(visual, sizeToken.value.iconSize)],
    );
  }
  const iconClassName = classNames(
    "pointer-events-none absolute flex items-center justify-center text-neutral-400 dark:text-neutral-500",
    positionClass,
    sizeToken.value.iconSize,
    tokens.value.icon,
    props.validationStatus === "error" && "text-rose-500 dark:text-rose-400",
    props.validationStatus === "success" &&
      "text-emerald-500 dark:text-emerald-400",
  );
  return h("span", { class: iconClassName }, [
    renderVisual(visual, sizeToken.value.iconSize),
  ]);
};

const wrapperClasses = computed(() =>
  classNames(
    "relative flex w-full items-center",
    props.disabled && "opacity-70",
    props.fullHeight && "h-full",
    props.wrapperClassName,
  ),
);

const ariaInvalid = computed(() =>
  props.validationStatus === "error"
    ? "true"
    : (restAttrs.value["aria-invalid"] as
        | boolean
        | "true"
        | "false"
        | "grammar"
        | "spelling"
        | undefined),
);

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>

<template>
  <span :class="wrapperClasses">
    <VNodeRenderer
      v-if="leadingIcon"
      :nodes="renderIconWrapper(leadingIcon, 'left')"
    />
    <input
      ref="el"
      v-bind="restAttrs"
      :class="inputClass"
      :value="modelValue"
      :disabled="disabled"
      :aria-invalid="ariaInvalid"
      @input="onInput"
    />
    <VNodeRenderer
      v-if="trailingIcon"
      :nodes="renderIconWrapper(trailingIcon, 'right', onTrailingIconClick)"
    />
  </span>
</template>
