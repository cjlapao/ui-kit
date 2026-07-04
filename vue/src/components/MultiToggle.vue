<script lang="ts">
import type { CSSProperties, VNode } from "vue";
import type { ThemeColor } from "../theme/Theme";

export type MultiToggleSize = "sm" | "md" | "lg";
export type MultiToggleShape =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full";
export type MultiToggleVariant = "theme" | "solid" | "soft";

type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

export type MultiToggleOptionWidth = number | LiteralUnion<"auto">;
export type MultiToggleActiveWidthStrategy = "auto" | "max";

export interface MultiToggleOption {
  value: string;
  label?: string | number | VNode;
  icon?: string | VNode;
  disabled?: boolean;
  width?: MultiToggleOptionWidth;
}

export interface MultiToggleProps {
  options: MultiToggleOption[];
  modelValue: string;
  rounded?: MultiToggleShape;

  size?: MultiToggleSize;
  color?: ThemeColor;
  fullWidth?: boolean;
  showOnlyActiveLabel?: boolean;
  truncateOverflow?: boolean;
  adaptiveWidth?: boolean;
  optionMaxWidth?: number | string;
  activeWidthStrategy?: MultiToggleActiveWidthStrategy;
  variant?: MultiToggleVariant;
  /** When set, overrides the active option's text color with this color's active-text token. */
  accentColor?: ThemeColor;
  disabled?: boolean;
}

const toneTokens: Record<
  ThemeColor,
  { activeText: string; indicator: string; hover: string }
> = {
  parallels: {
    activeText: "text-rose-700 dark:text-rose-200",
    indicator:
      "bg-rose-500/15 dark:bg-rose-400/20 border border-rose-400/40 dark:border-rose-300/20",
    hover: "hover:text-rose-600 dark:hover:text-rose-300",
  },
  brand: {
    activeText: "text-rose-700 dark:text-rose-200",
    indicator:
      "bg-rose-500/15 dark:bg-rose-400/20 border border-rose-400/40 dark:border-rose-300/20",
    hover: "hover:text-rose-600 dark:hover:text-rose-300",
  },
  theme: {
    activeText: "text-rose-700 dark:text-rose-200",
    indicator:
      "bg-rose-500/15 dark:bg-rose-400/20 border border-rose-400/40 dark:border-rose-300/20",
    hover: "hover:text-rose-600 dark:hover:text-rose-300",
  },
  red: {
    activeText: "text-rose-700 dark:text-rose-200",
    indicator:
      "bg-rose-500/15 dark:bg-rose-400/20 border border-rose-400/40 dark:border-rose-300/20",
    hover: "hover:text-rose-600 dark:hover:text-rose-300",
  },
  orange: {
    activeText: "text-orange-700 dark:text-orange-200",
    indicator:
      "bg-orange-500/15 dark:bg-orange-400/20 border border-orange-400/40 dark:border-orange-300/20",
    hover: "hover:text-orange-600 dark:hover:text-orange-300",
  },
  amber: {
    activeText: "text-amber-700 dark:text-amber-200",
    indicator:
      "bg-amber-500/15 dark:bg-amber-400/20 border border-amber-400/40 dark:border-amber-300/20",
    hover: "hover:text-amber-600 dark:hover:text-amber-300",
  },
  yellow: {
    activeText: "text-yellow-700 dark:text-yellow-200",
    indicator:
      "bg-yellow-500/15 dark:bg-yellow-400/20 border border-yellow-400/40 dark:border-yellow-300/20",
    hover: "hover:text-yellow-600 dark:hover:text-yellow-300",
  },
  lime: {
    activeText: "text-lime-700 dark:text-lime-200",
    indicator:
      "bg-lime-500/15 dark:bg-lime-400/20 border border-lime-400/40 dark:border-lime-300/20",
    hover: "hover:text-lime-600 dark:hover:text-lime-300",
  },
  green: {
    activeText: "text-emerald-700 dark:text-emerald-200",
    indicator:
      "bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-400/40 dark:border-emerald-300/20",
    hover: "hover:text-emerald-600 dark:hover:text-emerald-300",
  },
  emerald: {
    activeText: "text-emerald-700 dark:text-emerald-200",
    indicator:
      "bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-400/40 dark:border-emerald-300/20",
    hover: "hover:text-emerald-600 dark:hover:text-emerald-300",
  },
  teal: {
    activeText: "text-teal-700 dark:text-teal-200",
    indicator:
      "bg-teal-500/15 dark:bg-teal-400/20 border border-teal-400/40 dark:border-teal-300/20",
    hover: "hover:text-teal-600 dark:hover:text-teal-300",
  },
  cyan: {
    activeText: "text-cyan-700 dark:text-cyan-200",
    indicator:
      "bg-cyan-500/15 dark:bg-cyan-400/20 border border-cyan-400/40 dark:border-cyan-300/20",
    hover: "hover:text-cyan-600 dark:hover:text-cyan-300",
  },
  sky: {
    activeText: "text-sky-700 dark:text-sky-200",
    indicator:
      "bg-sky-500/15 dark:bg-sky-400/20 border border-sky-400/40 dark:border-sky-300/20",
    hover: "hover:text-sky-600 dark:hover:text-sky-300",
  },
  blue: {
    activeText: "text-blue-700 dark:text-blue-200",
    indicator:
      "bg-blue-500/15 dark:bg-blue-400/20 border border-blue-400/40 dark:border-blue-300/20",
    hover: "hover:text-blue-600 dark:hover:text-blue-300",
  },
  indigo: {
    activeText: "text-indigo-700 dark:text-indigo-200",
    indicator:
      "bg-indigo-500/15 dark:bg-indigo-400/20 border border-indigo-400/40 dark:border-indigo-300/20",
    hover: "hover:text-indigo-600 dark:hover:text-indigo-300",
  },
  violet: {
    activeText: "text-violet-700 dark:text-violet-200",
    indicator:
      "bg-violet-500/15 dark:bg-violet-400/20 border border-violet-400/40 dark:border-violet-300/20",
    hover: "hover:text-violet-600 dark:hover:text-violet-300",
  },
  purple: {
    activeText: "text-purple-700 dark:text-purple-200",
    indicator:
      "bg-purple-500/15 dark:bg-purple-400/20 border border-purple-400/40 dark:border-purple-300/20",
    hover: "hover:text-purple-600 dark:hover:text-purple-300",
  },
  fuchsia: {
    activeText: "text-fuchsia-700 dark:text-fuchsia-200",
    indicator:
      "bg-fuchsia-500/15 dark:bg-fuchsia-400/20 border border-fuchsia-400/40 dark:border-fuchsia-300/20",
    hover: "hover:text-fuchsia-600 dark:hover:text-fuchsia-300",
  },
  pink: {
    activeText: "text-pink-700 dark:text-pink-200",
    indicator:
      "bg-pink-500/15 dark:bg-pink-400/20 border border-pink-400/40 dark:border-pink-300/20",
    hover: "hover:text-pink-600 dark:hover:text-pink-300",
  },
  rose: {
    activeText: "text-rose-700 dark:text-rose-200",
    indicator:
      "bg-rose-500/15 dark:bg-rose-400/20 border border-rose-400/40 dark:border-rose-300/20",
    hover: "hover:text-rose-600 dark:hover:text-rose-300",
  },
  slate: {
    activeText: "text-slate-700 dark:text-slate-200",
    indicator:
      "bg-slate-500/15 dark:bg-slate-400/20 border border-slate-400/40 dark:border-slate-300/20",
    hover: "hover:text-slate-600 dark:hover:text-slate-300",
  },
  gray: {
    activeText: "text-gray-700 dark:text-gray-200",
    indicator:
      "bg-gray-500/15 dark:bg-gray-400/20 border border-gray-400/40 dark:border-gray-300/20",
    hover: "hover:text-gray-600 dark:hover:text-gray-300",
  },
  zinc: {
    activeText: "text-zinc-700 dark:text-zinc-200",
    indicator:
      "bg-zinc-500/15 dark:bg-zinc-400/20 border border-zinc-400/40 dark:border-zinc-300/20",
    hover: "hover:text-zinc-600 dark:hover:text-zinc-300",
  },
  neutral: {
    activeText: "text-neutral-700 dark:text-neutral-200",
    indicator:
      "bg-neutral-500/15 dark:bg-neutral-400/20 border border-neutral-400/40 dark:border-neutral-300/20",
    hover: "hover:text-neutral-600 dark:hover:text-neutral-300",
  },
  stone: {
    activeText: "text-stone-700 dark:text-stone-200",
    indicator:
      "bg-stone-500/15 dark:bg-stone-400/20 border border-stone-400/40 dark:border-stone-300/20",
    hover: "hover:text-stone-600 dark:hover:text-stone-300",
  },
  white: {
    activeText: "text-slate-700 dark:text-slate-200",
    indicator:
      "bg-slate-400/15 dark:bg-slate-300/20 border border-slate-300/40 dark:border-slate-200/20",
    hover: "hover:text-slate-600 dark:hover:text-slate-300",
  },
  info: {
    activeText: "text-sky-700 dark:text-sky-200",
    indicator:
      "bg-sky-500/15 dark:bg-sky-400/20 border border-sky-400/40 dark:border-sky-300/20",
    hover: "hover:text-sky-600 dark:hover:text-sky-300",
  },
  success: {
    activeText: "text-emerald-700 dark:text-emerald-200",
    indicator:
      "bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-400/40 dark:border-emerald-300/20",
    hover: "hover:text-emerald-600 dark:hover:text-emerald-300",
  },
  warning: {
    activeText: "text-yellow-700 dark:text-yellow-200",
    indicator:
      "bg-yellow-500/15 dark:bg-yellow-400/20 border border-yellow-400/40 dark:border-yellow-300/20",
    hover: "hover:text-yellow-600 dark:hover:text-yellow-300",
  },
  danger: {
    activeText: "text-rose-700 dark:text-rose-200",
    indicator:
      "bg-rose-500/15 dark:bg-rose-400/20 border border-rose-400/40 dark:border-rose-300/20",
    hover: "hover:text-rose-600 dark:hover:text-rose-300",
  },
};

const sizeTokens: Record<
  MultiToggleSize,
  {
    track: string;
    indicatorInset: string;
    cell: string;
    gap: string;
    label: string;
    icon: string;
    paddingY: string;
  }
> = {
  sm: {
    track: "h-8 text-xs",
    indicatorInset: "inset-y-[0px]",
    cell: "px-2 py-1",
    gap: "gap-1",
    label: "text-xs",
    icon: "h-4 w-4",
    paddingY: "py-0.5",
  },
  md: {
    track: "h-9 text-sm",
    indicatorInset: "inset-y-[0px]",
    cell: "px-2.5 py-1.5",
    gap: "gap-1.5",
    label: "text-sm",
    icon: "h-5 w-5",
    paddingY: "py-0.5",
  },
  lg: {
    track: "h-11 text-base",
    indicatorInset: "inset-y-[0px]",
    cell: "px-3.5 py-2",
    gap: "gap-2",
    label: "text-base",
    icon: "h-6 w-6",
    paddingY: "py-0.5",
  },
};

const CONTAINER_HORIZONTAL_PADDING = 2;
const INDICATOR_MARGIN = 1;

const computeInset = (segmentWidth: number) => {
  if (segmentWidth <= 0) {
    return 0;
  }
  const proportional = segmentWidth / 16;
  return Math.min(INDICATOR_MARGIN, proportional);
};

const toCssDimension = (value?: number | string | null): string | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "number") {
    return `${value}px`;
  }

  return value;
};

const measurementContainerStyle: CSSProperties = {
  position: "absolute",
  visibility: "hidden",
  pointerEvents: "none",
  whiteSpace: "nowrap",
  height: 0,
  overflow: "hidden",
};
</script>

<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type ComponentPublicInstance,
} from "vue";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import { getMultiToggleVariantTokens } from "../theme/Theme";
import type { IconSize } from "../types/Icon";
import { useClassAttrs } from "../utils/attrsUtils";
import VNodeRenderer from "./internal/VNodeRenderer";

defineOptions({ name: "MultiToggle", inheritAttrs: false });

const props = withDefaults(defineProps<MultiToggleProps>(), {
  size: "md",
  color: "blue",
  fullWidth: false,
  showOnlyActiveLabel: false,
  adaptiveWidth: false,
  rounded: "lg",
  activeWidthStrategy: "auto",
  variant: "theme",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}>();

const { classAttr, restAttrs } = useClassAttrs();
const renderIconFn = useIconRenderer();

const containerRef = ref<HTMLDivElement | null>(null);
const optionRefs: Array<HTMLButtonElement | null> = [];
const measurementRefs: Array<HTMLDivElement | null> = [];

const setOptionRef = (
  el: Element | ComponentPublicInstance | null,
  index: number,
) => {
  optionRefs[index] = (el as HTMLButtonElement | null) ?? null;
};

const setMeasurementRef = (
  el: Element | ComponentPublicInstance | null,
  index: number,
) => {
  measurementRefs[index] = (el as HTMLDivElement | null) ?? null;
};

const hasCustomWidths = computed(
  () =>
    props.adaptiveWidth ||
    props.options.some((option) => option.width !== undefined),
);
const indicatorInlineStyle = ref<CSSProperties | undefined>();
const maxOptionWidth = ref<number | undefined>();
const parsedOptionMaxWidth = computed(() =>
  toCssDimension(props.optionMaxWidth),
);
const shouldLockToMaxWidth = computed(
  () => hasCustomWidths.value && props.activeWidthStrategy === "max",
);
const controlRounded = computed(() =>
  props.rounded === "none"
    ? ""
    : props.rounded === "xs"
      ? "rounded-xs"
      : props.rounded === "sm"
        ? "rounded-sm"
        : props.rounded === "md"
          ? "rounded-md"
          : props.rounded === "lg"
            ? "rounded-lg"
            : props.rounded === "xl"
              ? "rounded-xl"
              : "rounded-full",
);

// Inner indicator is inset by p-0.5 (2px), so use one step smaller radius
// to preserve consistent visual gap between track edge and indicator corners.
const indicatorRounded = computed(() =>
  props.rounded === "none" || props.rounded === "xs"
    ? ""
    : props.rounded === "sm"
      ? "rounded-xs"
      : props.rounded === "md"
        ? "rounded-sm"
        : props.rounded === "lg"
          ? "rounded-md"
          : props.rounded === "xl"
            ? "rounded-lg"
            : "rounded-full",
);

const optionCount = computed(() => props.options.length ?? 0);
const activeIndex = computed(() =>
  Math.max(
    0,
    props.options.findIndex((option) => option.value === props.modelValue),
  ),
);
const sizeStyles = computed(() => sizeTokens[props.size] ?? sizeTokens.md);
const colorStyles = computed(() => toneTokens[props.color] ?? toneTokens.theme);
const variantTokens = computed(() => getMultiToggleVariantTokens(props.color));
const isVariantMode = computed(
  () => props.variant === "solid" || props.variant === "soft",
);
const activeTextClass = computed(() =>
  props.accentColor
    ? isVariantMode.value
      ? getMultiToggleVariantTokens(props.accentColor).activeText
      : (toneTokens[props.accentColor] ?? toneTokens.theme).activeText
    : isVariantMode.value
      ? variantTokens.value.activeText
      : colorStyles.value.activeText,
);
const usesSegmentLayout = computed(
  () => !hasCustomWidths.value && !shouldLockToMaxWidth.value,
);

const indicatorStyle = computed<CSSProperties>(() => {
  const segmentExpression = `(100% - ${CONTAINER_HORIZONTAL_PADDING * 2}px) / ${optionCount.value}`;
  const margin = INDICATOR_MARGIN;

  if (usesSegmentLayout.value) {
    return {
      width: `calc(${segmentExpression} - ${margin * 2}px)`,
      transform: `translateX(calc(${CONTAINER_HORIZONTAL_PADDING}px + ${activeIndex.value} * (${segmentExpression}) + ${margin}px))`,
    };
  }

  const widthPercent = 100 / optionCount.value;
  return {
    width: `calc(${widthPercent}% - ${margin * 2}px)`,
    transform: `translateX(calc(${activeIndex.value} * (100% / ${optionCount.value}) + ${margin}px))`,
  };
});

const updateIndicatorPosition = () => {
  const container = containerRef.value;
  const activeButton = optionRefs[activeIndex.value];

  if (!container || !activeButton) {
    return;
  }

  const containerStyles = window.getComputedStyle(container);
  const paddingLeft = parseFloat(containerStyles?.paddingLeft ?? "0") || 0;
  const paddingRight = parseFloat(containerStyles?.paddingRight ?? "0") || 0;
  const containerInnerWidth = Math.max(
    0,
    container.clientWidth - paddingLeft - paddingRight,
  );

  if (usesSegmentLayout.value) {
    const segmentWidth = containerInnerWidth / optionCount.value;
    const inset = computeInset(segmentWidth);
    const indicatorWidth = Math.max(0, segmentWidth - inset * 2);
    const offset = paddingLeft + activeIndex.value * segmentWidth + inset;
    indicatorInlineStyle.value = {
      width: `${indicatorWidth}px`,
      transform: `translateX(${offset}px)`,
    };
    return;
  }

  const baseWidth =
    shouldLockToMaxWidth.value && maxOptionWidth.value
      ? maxOptionWidth.value
      : activeButton.offsetWidth;
  const inset = computeInset(baseWidth);
  const indicatorWidth = Math.max(
    0,
    Math.min(baseWidth, containerInnerWidth) - inset * 2,
  );
  // offsetLeft is relative to the container's border-box edge (same as `absolute left-0`),
  // so do NOT subtract paddingLeft — that would shift the pill left and create unequal gutters.
  let offset = activeButton.offsetLeft + inset;
  const maxOffset = Math.max(
    inset,
    container.clientWidth - indicatorWidth - inset,
  );
  offset = Math.min(Math.max(offset, inset), maxOffset);

  indicatorInlineStyle.value = {
    width: `${indicatorWidth}px`,
    transform: `translateX(${offset}px)`,
  };
};

const optionsSignature = computed(() =>
  props.options
    .map((option) => {
      const labelSignature =
        typeof option.label === "string"
          ? option.label
          : option.label !== undefined
            ? "node"
            : "";
      return `${option.value}:${option.width ?? ""}:${labelSignature}`;
    })
    .join("|"),
);

const measureMaxWidth = () => {
  optionRefs.length = optionCount.value;
  measurementRefs.length = optionCount.value;

  if (!shouldLockToMaxWidth.value) {
    maxOptionWidth.value = undefined;
    return;
  }

  const container = containerRef.value;
  if (!container) {
    return;
  }

  const containerStyles = window.getComputedStyle(container);
  const paddingLeft = parseFloat(containerStyles?.paddingLeft ?? "0") || 0;
  const paddingRight = parseFloat(containerStyles?.paddingRight ?? "0") || 0;
  const containerInnerWidth = Math.max(
    0,
    container.clientWidth - paddingLeft - paddingRight,
  );

  const widths = measurementRefs.map((node) => node?.offsetWidth ?? 0);
  const largestWidth = widths.reduce(
    (currentMax, width) => (width > currentMax ? width : currentMax),
    0,
  );
  const constrainedWidth = Math.min(largestWidth, containerInnerWidth);

  maxOptionWidth.value = constrainedWidth || undefined;
};

let resizeObserver: ResizeObserver | undefined;

const handleWindowResize = () => {
  updateIndicatorPosition();
};

const attachResizeObserver = () => {
  resizeObserver?.disconnect();
  resizeObserver = undefined;

  if (typeof ResizeObserver === "undefined") {
    return;
  }

  resizeObserver = new ResizeObserver(() => {
    updateIndicatorPosition();
  });

  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }

  optionRefs.forEach((button) => {
    if (button) {
      resizeObserver?.observe(button);
    }
  });
};

watch(
  [
    shouldLockToMaxWidth,
    optionsSignature,
    () => props.size,
    () => props.optionMaxWidth,
  ],
  () => {
    measureMaxWidth();
  },
  { flush: "post" },
);

watch(
  [
    optionsSignature,
    () => props.optionMaxWidth,
    activeIndex,
    shouldLockToMaxWidth,
    maxOptionWidth,
    optionCount,
    usesSegmentLayout,
  ],
  () => {
    updateIndicatorPosition();
    attachResizeObserver();
  },
  { flush: "post" },
);

onMounted(() => {
  if (typeof window === "undefined") {
    return;
  }

  measureMaxWidth();
  updateIndicatorPosition();
  attachResizeObserver();
  window.addEventListener("resize", handleWindowResize);
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", handleWindowResize);
  }
  resizeObserver?.disconnect();
});

const shouldTruncate = computed(() => props.truncateOverflow ?? true);
const computedIndicatorStyle = computed(
  () => indicatorInlineStyle.value ?? indicatorStyle.value,
);

const containerClass = computed(() =>
  classNames(
    "relative inline-flex select-none items-center p-0.5",
    isVariantMode.value
      ? "bg-neutral-100 dark:bg-neutral-700"
      : "bg-neutral-100 shadow-inner dark:bg-neutral-600",
    controlRounded.value,
    sizeStyles.value.track,
    props.fullWidth && "w-full",
    props.disabled && "opacity-60 cursor-not-allowed",
    classAttr.value,
  ),
);

const indicatorWrapperClass = computed(() =>
  classNames(
    "pointer-events-none absolute left-0 flex items-center justify-center transition-transform duration-200 ease-out",
    sizeStyles.value.indicatorInset,
    sizeStyles.value.paddingY,
  ),
);

const indicatorClass = computed(() =>
  classNames(
    "h-full w-full",
    indicatorRounded.value,
    props.variant === "solid" && "bg-white dark:bg-neutral-800 shadow-sm",
    props.variant === "soft" && variantTokens.value.softIndicator,
    props.variant === "theme" && colorStyles.value.indicator,
  ),
);

const measurementStyle = (option: MultiToggleOption): CSSProperties => {
  const style: CSSProperties = {};
  if (option.width && option.width !== "auto") {
    const targetWidth = toCssDimension(option.width);
    if (targetWidth) {
      style.width = targetWidth;
    }
  }
  if (parsedOptionMaxWidth.value) {
    style.maxWidth = parsedOptionMaxWidth.value;
  }
  return style;
};

const isOptionDisabled = (option: MultiToggleOption) =>
  props.disabled || option.disabled;

const optionClass = (option: MultiToggleOption) => {
  const isActive = option.value === props.modelValue;
  const optionDisabled = isOptionDisabled(option);
  return classNames(
    "relative z-[1] flex min-w-0 items-center justify-center transition-colors duration-150",
    controlRounded.value,
    sizeStyles.value.cell,
    sizeStyles.value.gap,
    hasCustomWidths.value ? "flex-none" : "flex-1",
    optionDisabled
      ? "text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
      : classNames(
          "cursor-pointer",
          isActive
            ? activeTextClass.value
            : "text-neutral-600 dark:text-neutral-300",
          isVariantMode.value
            ? variantTokens.value.hover
            : colorStyles.value.hover,
        ),
  );
};

const optionStyle = (option: MultiToggleOption): CSSProperties | undefined => {
  const isActive = option.value === props.modelValue;
  const applyCustomWidth =
    hasCustomWidths.value && (!props.showOnlyActiveLabel || isActive);
  const customWidthValue =
    option.width !== undefined
      ? option.width
      : props.adaptiveWidth && applyCustomWidth
        ? "auto"
        : undefined;
  let buttonStyle: CSSProperties | undefined;

  if (applyCustomWidth) {
    buttonStyle = {
      flex: "0 1 auto",
      minWidth: 0,
    };

    if (customWidthValue && customWidthValue !== "auto") {
      const targetWidth = toCssDimension(customWidthValue);
      if (targetWidth) {
        buttonStyle.flex = "0 0 auto";
        buttonStyle.width = targetWidth;
      }
    }

    if (parsedOptionMaxWidth.value) {
      buttonStyle.maxWidth = parsedOptionMaxWidth.value;
    }
  }

  if (shouldLockToMaxWidth.value && isActive && maxOptionWidth.value) {
    if (!buttonStyle) {
      buttonStyle = {
        flex: "0 0 auto",
        minWidth: 0,
      };
    } else {
      buttonStyle.flex = "0 0 auto";
    }
    buttonStyle.width = `${maxOptionWidth.value}px`;
    if (parsedOptionMaxWidth.value) {
      buttonStyle.maxWidth = parsedOptionMaxWidth.value;
    }
  }

  return buttonStyle;
};

const handleSelect = (option: MultiToggleOption) => {
  if (isOptionDisabled(option) || option.value === props.modelValue) {
    return;
  }
  emit("update:modelValue", option.value);
  emit("change", option.value);
};
</script>

<template>
  <div
    ref="containerRef"
    :class="containerClass"
    role="radiogroup"
    :aria-disabled="disabled"
  >
    <span :class="indicatorWrapperClass" :style="computedIndicatorStyle">
      <span :class="indicatorClass" />
    </span>

    <div
      v-if="shouldLockToMaxWidth"
      aria-hidden="true"
      :style="measurementContainerStyle"
    >
      <div
        v-for="(option, index) in options"
        :key="`measure-${option.value}`"
        :ref="(el) => setMeasurementRef(el, index)"
        :class="
          classNames(
            'inline-flex min-w-0 items-center justify-center rounded-full',
            sizeStyles.cell,
            sizeStyles.gap,
          )
        "
        :style="measurementStyle(option)"
      >
        <span
          :class="
            classNames(
              'flex min-w-0 items-center justify-center',
              sizeStyles.gap,
            )
          "
        >
          <VNodeRenderer
            v-if="option.icon"
            :nodes="
              renderIconFn(option.icon, size as IconSize, sizeStyles.icon)
            "
          />
          <span
            v-if="option.label"
            :class="classNames(sizeStyles.label, 'min-w-0')"
          >
            <VNodeRenderer :nodes="option.label" />
          </span>
        </span>
      </div>
    </div>

    <button
      v-for="(option, index) in options"
      :key="option.value"
      :ref="(el) => setOptionRef(el, index)"
      type="button"
      :class="optionClass(option)"
      :disabled="isOptionDisabled(option)"
      :aria-pressed="option.value === modelValue"
      role="radio"
      :aria-checked="option.value === modelValue"
      :tabindex="
        isOptionDisabled(option) ? -1 : option.value === modelValue ? 0 : -1
      "
      v-bind="restAttrs"
      :style="optionStyle(option)"
      @click="handleSelect(option)"
    >
      <span
        :class="
          classNames('flex min-w-0 items-center justify-center', sizeStyles.gap)
        "
      >
        <VNodeRenderer
          v-if="option.icon"
          :nodes="renderIconFn(option.icon, size as IconSize, sizeStyles.icon)"
        />
        <span
          v-if="option.label && (!showOnlyActiveLabel || option.value === modelValue)"
          :class="
            classNames(
              sizeStyles.label,
              'min-w-0 px-1 text-center leading-tight block',
              shouldTruncate ? 'truncate' : 'whitespace-nowrap',
            )
          "
          :title="
            shouldTruncate && typeof option.label === 'string'
              ? option.label
              : undefined
          "
        >
          <VNodeRenderer :nodes="option.label" />
        </span>
      </span>
    </button>
  </div>
</template>
