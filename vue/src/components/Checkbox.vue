<script lang="ts">
import {
  getCheckboxControlTokens,
  getCheckboxVariantTokens,
  type ControlSize,
  type InputVariant,
  type TrueColor,
} from "../theme/Theme";

export const CHECKBOX_DESCRIPTION_PLACEMENTS = ["bottom", "inline"] as const;
export type CheckboxDescriptionPlacement =
  (typeof CHECKBOX_DESCRIPTION_PLACEMENTS)[number];

export const CHECKBOX_ALIGNS = ["left", "right"] as const;
export type CheckboxAlign = (typeof CHECKBOX_ALIGNS)[number];

export const CHECKBOX_VALIDATION_STATUSES = [
  "none",
  "error",
  "success",
] as const;
export type CheckboxValidationStatus =
  (typeof CHECKBOX_VALIDATION_STATUSES)[number];

/** Aliased so a change to the shared control scale reaches Checkbox. */
export type CheckboxSize = ControlSize;

/**
 * The same surface scale `Input` and `SearchBar` use, so a checkbox in a form
 * matches the fields beside it.
 */
export type CheckboxVariant = InputVariant;

export interface CheckboxProps {
  /** Controlled checked state (v-model). */
  modelValue?: boolean;
  id?: string;
  /** Label rendered next to the control. */
  label?: string;
  /** Secondary copy, under the label or beside it. */
  description?: string;
  /** @default "bottom" */
  descriptionPlacement?: CheckboxDescriptionPlacement;
  /** @default "md" */
  size?: CheckboxSize;
  /**
   * Surface treatment of the box, on the shared input scale. @default "flat"
   */
  variant?: CheckboxVariant;
  /** @default "blue" */
  /**
   * Accent colour. Every other control in the kit names this `tone` with
   * `color` as the alias; `Checkbox` had only `color`, so a form written
   * against the shared name silently fell back to blue.
   * @default "blue"
   */
  tone?: TrueColor;
  /** Alias for `tone`. */
  color?: TrueColor;
  /** Native tri-state. Also announced as `aria-checked="mixed"`. */
  indeterminate?: boolean;
  /** Stretch the row to the available width. */
  fullWidth?: boolean;
  /** Which side the box sits on. @default "left" */
  controlAlign?: CheckboxAlign;
  /**
   * Validation state, matching `Input`'s. `error` also sets `aria-invalid`.
   * @default "none"
   */
  validationStatus?: CheckboxValidationStatus;
  /** Message shown under the row, tinted by `validationStatus`. */
  validationMessage?: string;
  /** Marks the label with an asterisk and sets `required` on the input. */
  required?: boolean;
  disabled?: boolean;
  /** Applied to the visible box, not the (visually hidden) input. */
  inputClassName?: string;
}

type CheckboxSizeTokens = {
  gap: string;
  control: string;
  /** Tick/dash glyph, inset inside the box. */
  glyph: string;
  label: string;
  description: string;
  /** Nudges the box onto the label's cap height. */
  controlOffset: string;
};

const SIZE_STYLES: Record<CheckboxSize, CheckboxSizeTokens> = {
  xs: {
    gap: "gap-1.5",
    control: "h-3.5 w-3.5 rounded-sm",
    glyph: "h-2.5 w-2.5",
    label: "text-xs",
    description: "text-xs",
    controlOffset: "mt-px",
  },
  sm: {
    gap: "gap-2",
    control: "h-4 w-4 rounded",
    glyph: "h-3 w-3",
    label: "text-sm",
    description: "text-xs",
    controlOffset: "mt-0.5",
  },
  md: {
    gap: "gap-2.5",
    control: "h-5 w-5 rounded-md",
    glyph: "h-3.5 w-3.5",
    // `text-md` is not a Tailwind class — this row silently had no type size.
    label: "text-base",
    description: "text-sm",
    controlOffset: "mt-0.5",
  },
  lg: {
    gap: "gap-3",
    control: "h-6 w-6 rounded-md",
    glyph: "h-4 w-4",
    label: "text-lg",
    description: "text-base",
    // `mt-0.2` is not a Tailwind value either, so this was no offset at all.
    controlOffset: "mt-0.5",
  },
  xl: {
    gap: "gap-3.5",
    control: "h-7 w-7 rounded-lg",
    glyph: "h-5 w-5",
    label: "text-xl",
    description: "text-lg",
    controlOffset: "mt-1",
  },
};
</script>

<script setup lang="ts">
import { computed, ref, useId, watchEffect } from "vue";
import classNames from "classnames";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "Checkbox", inheritAttrs: false });

const props = withDefaults(defineProps<CheckboxProps>(), {
  descriptionPlacement: "bottom",
  size: "md",
  variant: "flat",
  // Left unset: `tone` is the primary and falls back to blue itself, so a
  // default here would beat a caller who passed only `tone`.
  indeterminate: false,
  fullWidth: false,
  controlAlign: "left",
  validationStatus: "none",
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "change", event: Event): void;
}>();

const slots = defineSlots<{
  label?: () => unknown;
  description?: () => unknown;
}>();

const { classAttr, restAttrs } = useClassAttrs();

const generatedId = useId();
const controlId = computed(() => props.id ?? generatedId);

const el = ref<HTMLInputElement | null>(null);
defineExpose({ el });

watchEffect(
  () => {
    if (!el.value) return;
    el.value.indeterminate = Boolean(props.indeterminate);
  },
  { flush: "post" },
);

const hasLabel = computed(() => Boolean(props.label) || Boolean(slots.label));
const hasDescription = computed(
  () => Boolean(props.description) || Boolean(slots.description),
);
const descriptionId = computed(() =>
  hasDescription.value ? `${controlId.value}-description` : undefined,
);
const messageId = computed(() =>
  props.validationMessage ? `${controlId.value}-message` : undefined,
);
const describedBy = computed(
  () =>
    [descriptionId.value, messageId.value].filter(Boolean).join(" ") ||
    undefined,
);

const sizeStyles = computed(() => SIZE_STYLES[props.size] ?? SIZE_STYLES.md);
const accent = computed<TrueColor>(() => props.tone ?? props.color ?? "blue");
const tokens = computed(() => getCheckboxControlTokens(accent.value));
const surface = computed(() => getCheckboxVariantTokens(props.variant));
const hasError = computed(() => props.validationStatus === "error");

const controlWrapperClass = computed(() =>
  classNames(
    "relative inline-block shrink-0",
    sizeStyles.value.control,
    sizeStyles.value.controlOffset,
  ),
);

const boxClass = computed(() =>
  classNames(
    "pointer-events-none absolute inset-0 rounded-[inherit] border-2 transition-colors duration-150",
    surface.value.fill,
    // The error border replaces the variant's outright rather than layering
    // over it — two plain `border-{c}` classes are the same specificity, so the
    // winner would be emission order.
    hasError.value
      ? "border-rose-400 dark:border-rose-500"
      : classNames(surface.value.border, surface.value.hover),
    tokens.value.checked,
    tokens.value.ring,
    "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-neutral-900",
    // Border only. A `peer-disabled:bg-neutral-100` here is a same-specificity
    // fight with `peer-checked:bg-{tone}-700`, and it won — so a disabled
    // *checked* box lost its fill and its white tick vanished against the grey.
    // The row's `opacity-60` already says "disabled".
    "peer-disabled:border-neutral-200 dark:peer-disabled:border-neutral-700",
    props.inputClassName,
  ),
);

const checkGlyphClass = computed(() =>
  classNames(
    // Only one glyph is ever shown, and `indeterminate` wins — which is what
    // the native control does.
    "pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-150 peer-checked:opacity-100 peer-indeterminate:opacity-0",
    tokens.value.glyph,
  ),
);

const dashGlyphClass = computed(() =>
  classNames(
    "pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-150 peer-indeterminate:opacity-100",
    tokens.value.glyph,
  ),
);

/**
 * Vue has no `SurfaceProvider`, so these are the solid-surface tokens spelled
 * out rather than read from the surface the way React's do. Vue is a step
 * behind here: copy on a glass card will not step up in contrast.
 */
const labelTextClass = computed(() =>
  classNames(
    sizeStyles.value.label,
    "font-medium text-neutral-900 dark:text-neutral-100",
  ),
);

const descriptionClass = computed(() =>
  classNames(
    sizeStyles.value.description,
    props.descriptionPlacement === "bottom" && "block",
    "text-neutral-500 dark:text-neutral-400",
  ),
);

const textNodeClass = computed(() =>
  classNames(
    "min-w-0",
    props.descriptionPlacement === "inline"
      ? "flex flex-wrap items-center gap-x-1.5"
      : "flex flex-col gap-0.5",
  ),
);

const rootClass = computed(() =>
  classNames("inline-flex flex-col", props.fullWidth && "flex w-full", classAttr.value),
);

const labelClass = computed(() =>
  classNames(
    "group flex items-start",
    props.controlAlign === "right" && "flex-row-reverse justify-between",
    sizeStyles.value.gap,
    props.fullWidth && "w-full",
    props.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
  ),
);

const messageClass = computed(() =>
  classNames(
    "mt-1 block",
    sizeStyles.value.description,
    hasError.value && "text-rose-500 dark:text-rose-400",
    props.validationStatus === "success" &&
      "text-emerald-600 dark:text-emerald-400",
    props.validationStatus === "none" && "text-neutral-500 dark:text-neutral-400",
  ),
);

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.checked);
  emit("change", e);
};
</script>

<template>
  <span :class="rootClass">
    <label :class="labelClass">
      <span :class="controlWrapperClass">
        <!-- Visually hidden but still the real control: it keeps focus,
             keyboard behaviour, form participation and the `:checked` /
             `:indeterminate` state the box beside it is drawn from. -->
        <input
          :id="controlId"
          ref="el"
          type="checkbox"
          class="peer absolute inset-0 h-full w-full cursor-[inherit] appearance-none rounded-[inherit] opacity-0"
          :aria-describedby="describedBy"
          :aria-invalid="hasError || undefined"
          :aria-checked="indeterminate ? 'mixed' : undefined"
          :disabled="disabled"
          :required="required"
          :checked="modelValue"
          v-bind="restAttrs"
          @change="handleChange"
        />
        <!-- Every one of these is a *sibling* of the input. `peer-*` compiles
             to a general-sibling selector (`.peer:checked ~ …`), so a glyph
             nested inside the box would never have matched. -->
        <span aria-hidden="true" :class="boxClass" />
        <span aria-hidden="true" :class="checkGlyphClass">
          <svg
            :class="sizeStyles.glyph"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            :stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
          </svg>
        </span>
        <span aria-hidden="true" :class="dashGlyphClass">
          <svg
            :class="sizeStyles.glyph"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            :stroke-width="2.5"
            stroke-linecap="round"
          >
            <path d="M4 8h8" />
          </svg>
        </span>
      </span>

      <span v-if="hasLabel || hasDescription" :class="textNodeClass">
        <span v-if="hasLabel" :class="labelTextClass">
          <slot name="label">{{ label }}</slot>
          <span
            v-if="required"
            aria-hidden="true"
            class="ml-0.5 text-rose-500 dark:text-rose-400"
            >*</span
          >
        </span>
        <span v-if="hasDescription" :id="descriptionId" :class="descriptionClass">
          <slot name="description">{{ description }}</slot>
        </span>
      </span>
    </label>

    <span v-if="validationMessage" :id="messageId" :class="messageClass">
      {{ validationMessage }}
    </span>
  </span>
</template>
