<script lang="ts">
import type { CSSProperties, VNode } from "vue";
import {
  SURFACE_VARIANTS,
  type ControlSize,
  type SurfaceVariant,
  type TrueColor,
} from "../theme/Theme";

/**
 * The shared control scale. Was a component-local `sm | md | lg`, so a toggle
 * could not line up with the `xs` or `xl` Button beside it.
 */
export type MultiToggleSize = ControlSize;
export type MultiToggleShape =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full";
/**
 * The track is a surface, so it takes the **Panel family** — the same eight
 * variants, reading identically beside a `Panel` at the same tone.
 *
 * This replaces a component-local `theme | solid | soft`, which described the
 * *indicator* rather than the track and had no relationship to anything else
 * in the kit.
 */
export const MULTI_TOGGLE_VARIANTS = SURFACE_VARIANTS;
export type MultiToggleVariant = SurfaceVariant;

/**
 * How the active segment is drawn. This is what the old `variant` union was
 * actually describing, now separated from the track's surface.
 */
export const MULTI_TOGGLE_INDICATORS = ["solid", "soft", "tonal"] as const;
export type MultiToggleIndicator = (typeof MULTI_TOGGLE_INDICATORS)[number];

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
  color?: TrueColor;
  fullWidth?: boolean;
  showOnlyActiveLabel?: boolean;
  truncateOverflow?: boolean;
  adaptiveWidth?: boolean;
  optionMaxWidth?: number | string;
  activeWidthStrategy?: MultiToggleActiveWidthStrategy;
  /** The track's surface, from the Panel family. @default "subtle" */
  variant?: MultiToggleVariant;
  /** How the active segment is drawn. @default "solid" */
  indicator?: MultiToggleIndicator;
  /** Accent for the indicator, the active label and the focus ring. @default "blue" */
  tone?: TrueColor;
  /** Overrides the active option's text tone. */
  accentTone?: TrueColor;
  /** @deprecated Use `accentTone`. */
  accentColor?: TrueColor;
  disabled?: boolean;
}

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
  xs: {
    track: "h-7 text-[11px]",
    indicatorInset: "inset-y-[0px]",
    cell: "px-1.5 py-0.5",
    gap: "gap-1",
    label: "text-[11px]",
    icon: "h-3.5 w-3.5",
    paddingY: "py-0.5",
  },
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
  xl: {
    track: "h-12 text-lg",
    indicatorInset: "inset-y-[0px]",
    cell: "px-4 py-2.5",
    gap: "gap-2.5",
    label: "text-lg",
    icon: "h-7 w-7",
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
import {
  getMultiToggleVariantTokens,
  getSurfaceTextTokens,
  getSurfaceTriggerTokens,
  getSurfaceVariantClasses,
} from "../theme/Theme";
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
  variant: "subtle",
  indicator: "solid",
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
// `color` is the old name for `tone`.
const resolvedTone = computed(() => props.tone ?? props.color ?? "blue");
const resolvedAccent = computed(
  () => props.accentTone ?? props.accentColor ?? resolvedTone.value,
);
const variantTokens = computed(() =>
  getMultiToggleVariantTokens(resolvedTone.value),
);
const trigger = computed(() => getSurfaceTriggerTokens(resolvedTone.value));
// The track is a surface, so its copy colour comes from the surface — a
// hardcoded `text-neutral-600` is unreadable on `glass` over a photo.
const surfaceText = computed(() => getSurfaceTextTokens(props.variant));
const trackClasses = computed(() =>
  getSurfaceVariantClasses(props.variant, resolvedTone.value),
);

/**
 * The active pill. All three carry a tone-following edge: a white pill on a
 * light track with only a soft shadow is nearly invisible — the selection read
 * as "the blue label" rather than as a moved pill.
 *
 * `solid` is the crispest (a raised card with a full-strength hairline),
 * `soft` tints the fill, `tonal` is the most washed.
 */
const indicatorClasses = computed(() => {
  const t = resolvedTone.value;
  return {
    solid: `bg-white shadow-md border border-${t}-300 dark:bg-neutral-800 dark:border-${t}-500/50`,
    soft: `${variantTokens.value.softIndicator} border border-${t}-300 dark:border-${t}-500/25`,
    tonal: `bg-${t}-500/15 dark:bg-${t}-400/20 border border-${t}-400/40 dark:border-${t}-300/20`,
  }[props.indicator];
});
const activeTextClass = computed(
  () => getMultiToggleVariantTokens(resolvedAccent.value).activeText,
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
    trackClasses.value,
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
    indicatorClasses.value,
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
    trigger.value.focusRing,
    optionDisabled
      ? classNames(surfaceText.value.muted, "cursor-not-allowed opacity-60")
      : classNames(
          "cursor-pointer",
          isActive ? activeTextClass.value : surfaceText.value.body,
          variantTokens.value.hover,
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

/**
 * Arrow-key navigation. The component already used a roving tabindex (only the
 * active option is tabbable) but handled no keys, so a keyboard user could
 * reach the group and then had no way to change the selection — the one
 * interaction a radiogroup exists for.
 */
const handleKeyDown = (event: KeyboardEvent) => {
  const step =
    event.key === "ArrowRight" || event.key === "ArrowDown"
      ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : 0;
  if (step === 0 && event.key !== "Home" && event.key !== "End") return;
  event.preventDefault();

  const selectable = props.options
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => !isOptionDisabled(option));
  if (selectable.length === 0) return;

  const commit = (target: { option: MultiToggleOption; index: number }) => {
    emit("update:modelValue", target.option.value);
    emit("change", target.option.value);
    optionRefs[target.index]?.focus();
  };

  if (event.key === "Home" || event.key === "End") {
    commit(event.key === "Home" ? selectable[0] : selectable[selectable.length - 1]);
    return;
  }

  const current = selectable.findIndex(({ index }) => index === activeIndex.value);
  // Wraps at both ends, which is what the radiogroup pattern specifies.
  commit(selectable[(current + step + selectable.length) % selectable.length]);
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
    v-bind="restAttrs"
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
      role="radio"
      :aria-checked="option.value === modelValue"
      :tabindex="
        isOptionDisabled(option) ? -1 : option.value === modelValue ? 0 : -1
      "
      :style="optionStyle(option)"
      @click="handleSelect(option)"
      @keydown="handleKeyDown"
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
