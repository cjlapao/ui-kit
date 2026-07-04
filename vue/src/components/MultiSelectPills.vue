<script lang="ts">
import type { ThemeColor } from "../theme/Theme";

export type MultiSelectPillOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export interface MultiSelectPillsProps {
  /**
   * Used as the name for the generated hidden inputs (e.g. `${name}[]`).
   */
  name: string;
  /**
   * Options rendered as pills.
   */
  options: MultiSelectPillOption[];
  /**
   * Optional legend displayed above the pill list.
   */
  legend?: string;
  /**
   * Optional helper text rendered below the legend.
   */
  description?: string;
  /**
   * Current selected values when using the component in a controlled way.
   */
  modelValue?: string[];
  /**
   * Default selected values for uncontrolled usage.
   */
  defaultValue?: string[];
  /**
   * Disable the whole control.
   */
  disabled?: boolean;
  /**
   * Tailwind size token controlling text size and padding.
   */
  size?: "xs" | "sm" | "base" | "lg";
  /**
   * Theme color used when a pill is selected.
   * Accepts any ThemeColor value. Defaults to "blue".
   */
  color?: ThemeColor;
  /**
   * Border radius of the pills.
   * Defaults to "full" (fully rounded).
   */
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  /**
   * Gap between pills.
   * Defaults to "2".
   */
  gap?: "1" | "1.5" | "2" | "3" | "4";
  /**
   * Selection behaviour. Defaults to multi-select.
   */
  selectionMode?: "multiple" | "single";
}

// ── Maps ──────────────────────────────────────────────────────────────────────

const sizeMap = {
  xs: { text: "text-xs", padding: "px-2 py-1" },
  sm: { text: "text-sm", padding: "px-3 py-1.5" },
  base: { text: "text-base", padding: "px-4 py-2" },
  lg: { text: "text-lg", padding: "px-5 py-2.5" },
} as const;

const roundedMap = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
} as const;

const gapMap = {
  "1": "gap-1",
  "1.5": "gap-1.5",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
} as const;

const colorTokens: Record<ThemeColor, { selected: string; ring: string }> = {
  parallels: {
    selected:
      "border-rose-500 bg-rose-500 text-white dark:bg-rose-500 dark:border-rose-500",
    ring: "focus-visible:ring-rose-400",
  },
  brand: {
    selected:
      "border-rose-500 bg-rose-500 text-white dark:bg-rose-500 dark:border-rose-500",
    ring: "focus-visible:ring-rose-400",
  },
  theme: {
    selected:
      "border-rose-500 bg-rose-500 text-white dark:bg-rose-500 dark:border-rose-500",
    ring: "focus-visible:ring-rose-400",
  },
  red: {
    selected:
      "border-rose-500 bg-rose-500 text-white dark:bg-rose-500 dark:border-rose-500",
    ring: "focus-visible:ring-rose-400",
  },
  orange: {
    selected:
      "border-orange-500 bg-orange-500 text-white dark:bg-orange-500 dark:border-orange-500",
    ring: "focus-visible:ring-orange-400",
  },
  amber: {
    selected:
      "border-amber-500 bg-amber-500 text-white dark:bg-amber-400 dark:border-amber-400",
    ring: "focus-visible:ring-amber-400",
  },
  yellow: {
    selected:
      "border-yellow-500 bg-yellow-500 text-white dark:bg-yellow-400 dark:border-yellow-400",
    ring: "focus-visible:ring-yellow-400",
  },
  lime: {
    selected:
      "border-lime-500 bg-lime-500 text-white dark:bg-lime-500 dark:border-lime-500",
    ring: "focus-visible:ring-lime-400",
  },
  green: {
    selected:
      "border-emerald-600 bg-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500",
    ring: "focus-visible:ring-emerald-400",
  },
  emerald: {
    selected:
      "border-emerald-600 bg-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500",
    ring: "focus-visible:ring-emerald-400",
  },
  teal: {
    selected:
      "border-teal-500 bg-teal-500 text-white dark:bg-teal-500 dark:border-teal-500",
    ring: "focus-visible:ring-teal-400",
  },
  cyan: {
    selected:
      "border-cyan-500 bg-cyan-500 text-white dark:bg-cyan-500 dark:border-cyan-500",
    ring: "focus-visible:ring-cyan-400",
  },
  sky: {
    selected:
      "border-sky-500 bg-sky-500 text-white dark:bg-sky-500 dark:border-sky-500",
    ring: "focus-visible:ring-sky-400",
  },
  blue: {
    selected:
      "border-blue-500 bg-blue-500 text-white dark:bg-blue-500 dark:border-blue-500",
    ring: "focus-visible:ring-blue-400",
  },
  indigo: {
    selected:
      "border-indigo-600 bg-indigo-600 text-white dark:bg-indigo-500 dark:border-indigo-500",
    ring: "focus-visible:ring-indigo-400",
  },
  violet: {
    selected:
      "border-violet-500 bg-violet-500 text-white dark:bg-violet-500 dark:border-violet-500",
    ring: "focus-visible:ring-violet-400",
  },
  purple: {
    selected:
      "border-purple-500 bg-purple-500 text-white dark:bg-purple-500 dark:border-purple-500",
    ring: "focus-visible:ring-purple-400",
  },
  fuchsia: {
    selected:
      "border-fuchsia-500 bg-fuchsia-500 text-white dark:bg-fuchsia-500 dark:border-fuchsia-500",
    ring: "focus-visible:ring-fuchsia-400",
  },
  pink: {
    selected:
      "border-pink-500 bg-pink-500 text-white dark:bg-pink-500 dark:border-pink-500",
    ring: "focus-visible:ring-pink-400",
  },
  rose: {
    selected:
      "border-rose-500 bg-rose-500 text-white dark:bg-rose-500 dark:border-rose-500",
    ring: "focus-visible:ring-rose-400",
  },
  slate: {
    selected:
      "border-slate-600 bg-slate-600 text-white dark:bg-slate-500 dark:border-slate-500",
    ring: "focus-visible:ring-slate-400",
  },
  gray: {
    selected:
      "border-gray-600 bg-gray-600 text-white dark:bg-gray-500 dark:border-gray-500",
    ring: "focus-visible:ring-gray-400",
  },
  zinc: {
    selected:
      "border-zinc-600 bg-zinc-600 text-white dark:bg-zinc-500 dark:border-zinc-500",
    ring: "focus-visible:ring-zinc-400",
  },
  neutral: {
    selected:
      "border-neutral-600 bg-neutral-600 text-white dark:bg-neutral-500 dark:border-neutral-500",
    ring: "focus-visible:ring-neutral-400",
  },
  stone: {
    selected:
      "border-stone-600 bg-stone-600 text-white dark:bg-stone-500 dark:border-stone-500",
    ring: "focus-visible:ring-stone-400",
  },
  white: {
    selected:
      "border-slate-400 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200",
    ring: "focus-visible:ring-slate-300",
  },
  info: {
    selected:
      "border-sky-500 bg-sky-500 text-white dark:bg-sky-500 dark:border-sky-500",
    ring: "focus-visible:ring-sky-400",
  },
  success: {
    selected:
      "border-emerald-600 bg-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500",
    ring: "focus-visible:ring-emerald-400",
  },
  warning: {
    selected:
      "border-amber-500 bg-amber-500 text-white dark:bg-amber-400 dark:border-amber-400",
    ring: "focus-visible:ring-amber-400",
  },
  danger: {
    selected:
      "border-rose-500 bg-rose-500 text-white dark:bg-rose-500 dark:border-rose-500",
    ring: "focus-visible:ring-rose-400",
  },
};
</script>

<script setup lang="ts">
import { computed, ref, useId, useSlots, watch } from "vue";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "MultiSelectPills", inheritAttrs: false });

const props = withDefaults(defineProps<MultiSelectPillsProps>(), {
  defaultValue: () => [],
  disabled: false,
  size: "sm",
  color: "blue",
  rounded: "full",
  gap: "2",
  selectionMode: "multiple",
});

const emit = defineEmits<{
  "update:modelValue": [selectedValues: string[]];
  /**
   * Called whenever the selected values change.
   */
  change: [selectedValues: string[]];
}>();

const { classAttr, restAttrs } = useClassAttrs();
const slots = useSlots();

const generatedId = useId();
const isControlled = computed(() => props.modelValue !== undefined);

const internalSelected = ref<string[]>(props.defaultValue);

watch(
  () => props.modelValue,
  (value) => {
    if (!isControlled.value) return;
    internalSelected.value = value ?? [];
  },
);

watch(
  () => props.defaultValue,
  (defaultValue) => {
    if (isControlled.value) return;
    internalSelected.value = defaultValue;
  },
);

const selectedValues = computed(() =>
  isControlled.value ? (props.modelValue ?? []) : internalSelected.value,
);
const selectedSet = computed(() => new Set(selectedValues.value));

const sizeClasses = computed(() => sizeMap[props.size]);
const roundedClass = computed(() => roundedMap[props.rounded]);
const gapClass = computed(() => gapMap[props.gap]);
const colorClasses = computed(
  () => colorTokens[props.color] ?? colorTokens.blue,
);

const hasLegend = computed(() => !!(props.legend || slots.legend));
const hasDescription = computed(
  () => !!(props.description || slots.description),
);

const handleToggle = (
  optionValue: string,
  optionDisabled: boolean | undefined,
) => {
  if (props.disabled || optionDisabled) return;

  const isAlreadySelected = selectedSet.value.has(optionValue);
  let nextSelected: string[];

  if (props.selectionMode === "single") {
    nextSelected = isAlreadySelected ? [] : [optionValue];
  } else {
    nextSelected = isAlreadySelected
      ? selectedValues.value.filter((item) => item !== optionValue)
      : [...selectedValues.value, optionValue];
  }

  if (!isControlled.value) internalSelected.value = nextSelected;
  emit("update:modelValue", nextSelected);
  emit("change", nextSelected);
};

const fieldsetClass = computed(() =>
  ["flex flex-col", classAttr.value ?? ""].filter(Boolean).join(" "),
);

const pillClass = (isSelected: boolean, isOptionDisabled: boolean) =>
  [
    "inline-flex items-center border font-medium transition focus:outline-none focus-visible:ring-2",
    sizeClasses.value.text,
    sizeClasses.value.padding,
    roundedClass.value,
    isSelected
      ? colorClasses.value.selected
      : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:border-neutral-600",
    props.disabled || isOptionDisabled
      ? "cursor-not-allowed opacity-60"
      : "cursor-pointer",
    colorClasses.value.ring,
  ]
    .filter(Boolean)
    .join(" ");
</script>

<template>
  <fieldset :class="fieldsetClass" :disabled="disabled" v-bind="restAttrs">
    <legend
      v-if="hasLegend"
      :class="`text-sm font-medium text-neutral-800 dark:text-neutral-200 ${!hasDescription ? 'pb-3' : ''}`"
    >
      <slot name="legend">{{ legend }}</slot>
    </legend>
    <p
      v-if="hasDescription"
      class="text-xs text-neutral-500 dark:text-neutral-400 pb-2"
    >
      <slot name="description">{{ description }}</slot>
    </p>

    <div :class="`flex flex-wrap ${gapClass}`">
      <template v-for="(option, index) in options" :key="option.value">
        <input
          type="checkbox"
          :id="`${generatedId}-${name}-${index}`"
          :name="`${name}[]`"
          :value="option.value"
          :checked="selectedSet.has(option.value)"
          readonly
          class="sr-only"
          tabindex="-1"
        />
        <button
          type="button"
          :class="pillClass(selectedSet.has(option.value), option.disabled ?? false)"
          :aria-pressed="selectedSet.has(option.value)"
          :aria-disabled="disabled || (option.disabled ?? false)"
          :disabled="disabled || (option.disabled ?? false)"
          @click="handleToggle(option.value, option.disabled)"
        >
          {{ option.label }}
          <span
            v-if="option.description"
            class="ml-2 text-xs text-neutral-500 dark:text-neutral-400"
          >
            {{ option.description }}
          </span>
        </button>
      </template>
    </div>
  </fieldset>
</template>
