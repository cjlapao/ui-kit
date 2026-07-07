<script lang="ts">
import type { TrueColor } from "../theme/Theme";

type TextareaSize = "sm" | "md" | "lg";
type TextareaValidationStatus = "none" | "error" | "success";
type TextareaResize = "none" | "vertical" | "horizontal" | "both";

const sizeTokens: Record<
  TextareaSize,
  { padding: string; text: string; minHeight: string }
> = {
  sm: { padding: "px-3 py-2", text: "text-sm", minHeight: "min-h-[6rem]" },
  md: { padding: "px-3.5 py-2.5", text: "text-sm", minHeight: "min-h-[7rem]" },
  lg: { padding: "px-4 py-3", text: "text-base", minHeight: "min-h-[8rem]" },
};

type ToneTokens = {
  focusRing: string;
  border: string;
  darkBorder: string;
  background: string;
  darkBackground: string;
};

const toneTokens: Partial<Record<TrueColor, ToneTokens>> = {
  indigo: {
    focusRing: "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900",
  },
  blue: {
    focusRing: "focus:border-blue-400 focus:ring-2 focus:ring-blue-400/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900",
  },
  emerald: {
    focusRing:
      "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900",
  },
  amber: {
    focusRing: "focus:border-amber-400 focus:ring-2 focus:ring-amber-400/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900",
  },
  rose: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900",
  },
  slate: {
    focusRing: "focus:border-slate-500 focus:ring-2 focus:ring-slate-500/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900",
  },
  neutral: {
    focusRing: "focus:border-slate-500 focus:ring-2 focus:ring-slate-500/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900",
  },
};

const statusClasses: Record<
  Exclude<TextareaValidationStatus, "none">,
  string
> = {
  error:
    "border-rose-500 focus:border-rose-500 focus:ring-rose-500/60 text-neutral-900 dark:border-rose-400 dark:focus:border-rose-400 dark:focus:ring-rose-400/60 dark:text-neutral-100",
  success:
    "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/60 text-neutral-900 dark:border-emerald-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/60 dark:text-neutral-100",
};

const disabledClasses =
  "disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400 dark:disabled:border-neutral-700 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500";

export interface TextareaProps {
  /** Current value of the textarea (v-model). */
  modelValue?: string;
  size?: TextareaSize;
  tone?: TrueColor;
  validationStatus?: TextareaValidationStatus;
  resize?: TextareaResize;
  helpText?: string;
}

const resizeClasses: Record<TextareaResize, string> = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "Textarea", inheritAttrs: false, __UI_INPUT: true });

const props = withDefaults(defineProps<TextareaProps>(), {
  size: "md",
  tone: "neutral",
  validationStatus: "none",
  resize: "vertical",
});

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const { classAttr, restAttrs } = useClassAttrs();

const el = ref<HTMLTextAreaElement | null>(null);
defineExpose({ el });

const sizeToken = computed(() => sizeTokens[props.size] ?? sizeTokens.md);
const tokens = computed(
  () => (toneTokens[props.tone] ?? toneTokens.neutral) as ToneTokens,
);
const resizeClass = computed(
  () => resizeClasses[props.resize] ?? resizeClasses.vertical,
);

const classes = computed(() =>
  classNames(
    "block w-full rounded-lg border bg-white text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500",
    sizeToken.value.padding,
    sizeToken.value.text,
    sizeToken.value.minHeight,
    tokens.value.border,
    tokens.value.darkBorder,
    tokens.value.background,
    tokens.value.darkBackground,
    tokens.value.focusRing,
    disabledClasses,
    resizeClass.value,
    props.validationStatus !== "none"
      ? statusClasses[props.validationStatus]
      : null,
    classAttr.value,
  ),
);

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLTextAreaElement).value);
};
</script>

<template>
  <textarea
    ref="el"
    v-bind="restAttrs"
    :class="classes"
    :value="modelValue"
    @input="onInput"
  />
</template>
