<script lang="ts">
// ── Types ─────────────────────────────────────────────────────────────────────

export type InfoRowSize = "xs" | "sm" | "md" | "lg";

export type InfoRowPadding =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

export interface InfoRowProps {
  /** Row label (left side). Use the `label` slot for composed/styled labels. */
  label?: string;
  /**
   * Override label text size independently from `size`.
   * When omitted the shared `size` prop drives label size.
   */
  labelSize?: InfoRowSize;
  /**
   * Extra classes for the label span — use for custom colour, weight, etc.
   * e.g. `labelClassName="text-emerald-600 font-semibold"`
   */
  labelClassName?: string;
  /**
   * Fixed width class for the label column (e.g. `"w-32"`).
   * Defaults to a size-appropriate width (`w-16` / `w-20` / `w-24` / `w-28`).
   * Pass `""` to let the label size naturally.
   */
  labelWidth?: string;
  /**
   * Row value (right side).
   * - `string` / `number` — rendered as text, copy button enabled automatically.
   * - `boolean` — rendered as "Yes" / "No" with copy enabled.
   * - `value` slot — rendered as-is, copy button suppressed.
   * - `null` / `undefined` / `''` — treated as empty (see `hideIfEmpty`).
   */
  value?: string | number | boolean | null;
  /**
   * Override value text size independently from `size`.
   * When omitted the shared `size` prop drives value size.
   */
  valueSize?: InfoRowSize;
  /**
   * Extra classes for the value span — use for custom colour, weight, etc.
   * e.g. `valueClassName="text-sky-500"`
   */
  valueClassName?: string;
  /** Controls both label and value text size when individual overrides are absent. Defaults to `'md'`. */
  size?: InfoRowSize;
  /**
   * Vertical padding override. Accepts the full size scale including `'none'`.
   * When omitted, padding is derived from `size` (xs→py-1, sm→py-1.5, md→py-2, lg→py-2.5).
   */
  padding?: InfoRowPadding;
  /**
   * Show a copy-to-clipboard button.
   * Defaults to `true` — shown automatically when the resolved value is a string or number.
   * Pass `false` to suppress the button entirely.
   */
  copyable?: boolean;
  /**
   * Render the value in a monospace font.
   * Shorthand for `valueClassName="font-mono"`.
   */
  mono?: boolean;
  /**
   * Hide the row entirely when `value` is `null`, `undefined`, or `''`.
   * Defaults to `true`. Set to `false` to show the `emptyText` placeholder instead.
   */
  hideIfEmpty?: boolean;
  /**
   * Placeholder text shown when `hideIfEmpty` is `false` and the value is empty.
   * Defaults to `'—'`.
   */
  emptyText?: string;
  /**
   * Allow the value to wrap to multiple lines instead of truncating.
   * Defaults to `false`.
   */
  wrap?: boolean;
  /**
   * Show a tooltip with the full value when the text is truncated.
   * Only active when `wrap` is `false` and the value is a string or number.
   * Defaults to `true`.
   */
  tooltipOnTruncate?: boolean;
  /** Remove the bottom border (e.g. for the last row when handled externally). */
  noBorder?: boolean;
  /**
   * Remove the default horizontal padding (`px-3`/`px-4`).
   * Useful when the parent already provides horizontal spacing.
   */
  noPadding?: boolean;
  /**
   * Add a subtle hover background and rounded corners (matches classic detail-panel row style).
   * Defaults to `false`.
   */
  hoverable?: boolean;
}

// ── Size tokens ───────────────────────────────────────────────────────────────

type SizeToken = {
  defaultPadding: string;
  horizontalPadding: string;
  defaultLabelWidth: string;
  text: string;
};

const sizeTokens: Record<InfoRowSize, SizeToken> = {
  xs: {
    defaultPadding: "py-1",
    horizontalPadding: "px-3",
    defaultLabelWidth: "w-16",
    text: "text-[10px]",
  },
  sm: {
    defaultPadding: "py-1.5",
    horizontalPadding: "px-3",
    defaultLabelWidth: "w-20",
    text: "text-xs",
  },
  md: {
    defaultPadding: "py-2",
    horizontalPadding: "px-4",
    defaultLabelWidth: "w-24",
    text: "text-sm",
  },
  lg: {
    defaultPadding: "py-2.5",
    horizontalPadding: "px-4",
    defaultLabelWidth: "w-28",
    text: "text-base",
  },
};

// ── Padding tokens ────────────────────────────────────────────────────────────

const paddingTokens: Record<InfoRowPadding, string> = {
  none: "py-0",
  xs: "py-0.5",
  sm: "py-1.5",
  md: "py-2",
  lg: "py-2.5",
  xl: "py-4",
  "2xl": "py-5",
  "3xl": "py-6",
};

// ── Value normalisation ───────────────────────────────────────────────────────

type NormalisedValue = {
  display: string | number | null;
  copyText: string | null;
  isEmpty: boolean;
};

function normaliseValue(
  value: string | number | boolean | null | undefined,
): NormalisedValue {
  if (value === undefined || value === null || value === "") {
    return { display: null, copyText: null, isEmpty: true };
  }
  if (typeof value === "boolean") {
    const text = value ? "Yes" : "No";
    return { display: text, copyText: text, isEmpty: false };
  }
  if (typeof value === "string" || typeof value === "number") {
    return { display: value, copyText: String(value), isEmpty: false };
  }
  return { display: value, copyText: null, isEmpty: false };
}
</script>

<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "InfoRow", inheritAttrs: false });

const props = withDefaults(defineProps<InfoRowProps>(), {
  size: "md",
  copyable: true,
  mono: false,
  hideIfEmpty: true,
  emptyText: "—",
  wrap: false,
  tooltipOnTruncate: true,
  noBorder: false,
  noPadding: false,
  hoverable: false,
});

const { classAttr, restAttrs } = useClassAttrs();
const slots = useSlots();

const copied = ref(false);
const tooltipVisible = ref(false);
const valueRef = ref<HTMLSpanElement | null>(null);

// A `value` slot behaves like a ReactNode value: rendered as-is, copy suppressed.
const hasValueSlot = computed(() => !!slots["value"]);
const normalised = computed<NormalisedValue>(() =>
  hasValueSlot.value
    ? { display: null, copyText: null, isEmpty: false }
    : normaliseValue(props.value),
);

const isHidden = computed(() => normalised.value.isEmpty && props.hideIfEmpty);

const tokens = computed(() => sizeTokens[props.size]);
const labelTokens = computed(() => sizeTokens[props.labelSize ?? props.size]);
const valueTokens = computed(() => sizeTokens[props.valueSize ?? props.size]);
const rowPadding = computed(() =>
  props.padding !== undefined
    ? paddingTokens[props.padding]
    : tokens.value.defaultPadding,
);
const showCopy = computed(
  () =>
    props.copyable &&
    normalised.value.copyText !== null &&
    !normalised.value.isEmpty,
);
const canTooltip = computed(
  () =>
    props.tooltipOnTruncate && !props.wrap && normalised.value.copyText !== null,
);
// Smart layout: label caps at 30% of row width, value gets the rest.
// Falls back to fixed-width flex when an explicit labelWidth is provided.
const useSmartLayout = computed(() => props.labelWidth === undefined);

const handleCopy = () => {
  const copyText = normalised.value.copyText;
  if (!copyText || copied.value) return;
  void navigator.clipboard.writeText(copyText).then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1600);
  });
};

const handleMouseEnter = () => {
  if (!canTooltip.value || !valueRef.value) return;
  if (valueRef.value.scrollWidth > valueRef.value.offsetWidth) {
    tooltipVisible.value = true;
  }
};

const handleMouseLeave = () => {
  tooltipVisible.value = false;
};

const rowClass = computed(() =>
  classNames(
    "group flex items-center gap-3 transition-colors duration-300",
    rowPadding.value,
    !props.noPadding && tokens.value.horizontalPadding,
    props.hoverable && "rounded-md mx-1",
    props.hoverable &&
      !copied.value &&
      "hover:bg-neutral-50 dark:hover:bg-neutral-800/50",
    !props.noBorder &&
      !props.hoverable &&
      "border-b border-neutral-100 dark:border-neutral-800 last:border-0",
    copied.value && "bg-emerald-50/60 dark:bg-emerald-950/20",
    copied.value && props.hoverable && "animate-copied-flash",
    classAttr.value,
  ),
);

const labelClass = computed(() =>
  classNames(
    labelTokens.value.text,
    "text-neutral-500 dark:text-neutral-400",
    useSmartLayout.value
      ? "shrink-0 min-w-0 truncate"
      : `grow shrink-0 ${props.labelWidth ?? tokens.value.defaultLabelWidth}`,
    props.labelClassName,
  ),
);

const valueClass = computed(() =>
  classNames(
    valueTokens.value.text,
    "font-medium",
    props.wrap ? "wrap-break-word whitespace-normal text-right" : "truncate",
    normalised.value.isEmpty
      ? "text-neutral-400 dark:text-neutral-600"
      : "text-neutral-800 dark:text-neutral-200",
    props.mono && "font-mono",
    props.valueClassName,
  ),
);

const tooltipClass = classNames(
  "pointer-events-none absolute bottom-full right-0 z-50 mb-1.5",
  "max-w-xs break-all rounded-md px-2.5 py-1.5",
  "bg-neutral-900 dark:bg-neutral-700 text-white text-xs leading-snug",
  "shadow-lg",
  // fade-in
  "animate-[fadeIn_120ms_ease-out]",
);

const tooltipArrowClass = classNames(
  "absolute top-full right-3",
  "border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-700",
);

const copyButtonClass = computed(() =>
  classNames(
    "shrink-0 rounded-md p-1 transition-all duration-200",
    copied.value
      ? [
          "opacity-100 scale-110",
          "text-emerald-500 dark:text-emerald-400",
          "bg-emerald-100 dark:bg-emerald-950/40",
        ]
      : [
          "opacity-0 translate-x-1",
          "group-hover:opacity-100 group-hover:translate-x-0",
          "text-neutral-400 dark:text-neutral-500",
          "hover:text-neutral-600 dark:hover:text-neutral-300",
          "hover:bg-neutral-100 dark:hover:bg-neutral-800",
        ],
  ),
);

const copyIconWrapperClass = computed(() =>
  classNames(
    "block transition-all duration-200",
    copied.value ? "scale-110" : "scale-100",
  ),
);
</script>

<template>
  <div v-if="!isHidden" :class="rowClass" v-bind="restAttrs">
    <!-- Label — natural content width, capped at 30%; fixed width when labelWidth is explicit -->
    <span
      :class="labelClass"
      :style="useSmartLayout ? { maxWidth: '30%' } : undefined"
    >
      <slot name="label">{{ label }}</slot>
    </span>

    <!-- Value + copy button — fills remaining space -->
    <div
      class="relative flex flex-1 items-center justify-end gap-1 min-w-0"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <span ref="valueRef" :class="valueClass">
        <slot name="value">{{
          normalised.isEmpty ? emptyText : normalised.display
        }}</slot>
      </span>

      <div
        v-if="tooltipVisible && normalised.copyText"
        role="tooltip"
        :class="tooltipClass"
      >
        {{ normalised.copyText }}
        <!-- arrow -->
        <span :class="tooltipArrowClass" />
      </div>

      <button
        v-if="showCopy"
        type="button"
        :title="copied ? 'Copied!' : 'Copy to clipboard'"
        :aria-label="copied ? 'Copied!' : 'Copy to clipboard'"
        :class="copyButtonClass"
        @click="handleCopy"
      >
        <span :class="copyIconWrapperClass">
          <svg
            v-if="copied"
            class="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            :stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg
            v-else
            class="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            :stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>
