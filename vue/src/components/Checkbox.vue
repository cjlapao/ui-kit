<script lang="ts">
import type { TrueColor, Size } from "../theme/Theme";

type CheckboxDescriptionPlacement = "bottom" | "inline";
type CheckboxAlign = "left" | "right";

export interface CheckboxProps {
  /** Controlled checked state (v-model). */
  modelValue?: boolean;
  id?: string;
  /**
   * Optional label rendered next to the checkbox control.
   */
  label?: string;
  /**
   * Optional description displayed under the label.
   */
  description?: string;
  /**
   * Controls if the description is stacked under the label (default) or inline beside it.
   */
  descriptionPlacement?: CheckboxDescriptionPlacement;
  /**
   * Adjusts checkbox dimensions and typography.
   */
  size?: Size;
  /**
   * Accent color applied to the checkbox.
   */
  color?: TrueColor;
  /**
   * Enables the native indeterminate visual state.
   */
  indeterminate?: boolean;
  /**
   * When true the container will stretch to the available width.
   */
  fullWidth?: boolean;
  /**
   * Renders the checkbox control on the left (default) or right side of the label block.
   */
  controlAlign?: CheckboxAlign;
  disabled?: boolean;
  /**
   * Additional classes applied directly to the input element.
   */
  inputClassName?: string;
}

const sizeTokens: Record<Size,
  {
    gap: string;
    control: string;
    label: string;
    description: string;
    descriptionOffset: string;
    checkboxOffset: string;
  }
> = {
  xs: {
    gap: "gap-1",
    control: "h-3 w-3",
    label: "text-xs",
    description: "text-xs",
    descriptionOffset: "",
    checkboxOffset: "mt-0.5",
  },
  sm: {
    gap: "gap-1.5",
    control: "h-4 w-4",
    label: "text-sm",
    description: "text-xs",
    descriptionOffset: "",
    checkboxOffset: "mt-1",
  },
  md: {
    gap: "gap-1.5",
    control: "h-5 w-5",
    label: "text-md",
    description: "text-xs",
    descriptionOffset: "mt-0.5",
    checkboxOffset: "mt-0.5",
  },
  lg: {
    gap: "gap-1.5",
    control: "h-6 w-6",
    label: "text-base",
    description: "text-sm",
    descriptionOffset: "mt-1",
    checkboxOffset: "mt-0.2",
  },
  xl: {
    gap: "gap-2",
    control: "h-7 w-7",
    label: "text-lg",
    description: "text-sm",
    descriptionOffset: "mt-1.5",
    checkboxOffset: "mt-0.5",
  },
  xxl: {
    gap: "gap-2.5",
    control: "h-8 w-8",
    label: "text-xl",
    description: "text-sm",
    descriptionOffset: "mt-2",
    checkboxOffset: "mt-0.5",
  },
  xxxl: {
    gap: "gap-2.5",
    control: "h-8 w-8",
    label: "text-xl",
    description: "text-sm",
    descriptionOffset: "mt-2",
    checkboxOffset: "mt-0.5",
  },
  "2xl": {
    gap: "gap-2.5",
    control: "h-8 w-8",
    label: "text-xl",
    description: "text-sm",
    descriptionOffset: "mt-2",
    checkboxOffset: "mt-0.5",
  },
  "3xl": {
    gap: "gap-2.5",
    control: "h-8 w-8",
    label: "text-xl",
    description: "text-sm",
    descriptionOffset: "mt-2",
    checkboxOffset: "mt-0.5",
  },
  full: {
    gap: "gap-2.5",
    control: "h-8 w-8",
    label: "text-xl",
    description: "text-sm",
    descriptionOffset: "mt-2",
    checkboxOffset: "mt-0.5",
  },
};
</script>

<script setup lang="ts">
/**
 * Accessible checkbox control styled exclusively with Tailwind utilities.
 */
import { computed, ref, useId, watchEffect } from "vue";
import classNames from "classnames";
import { getCheckboxColorClasses } from "../theme/Theme";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "Checkbox", inheritAttrs: false });

const props = withDefaults(defineProps<CheckboxProps>(), {
  descriptionPlacement: "bottom",
  size: "md",
  color: "blue",
  indeterminate: false,
  fullWidth: false,
  controlAlign: "left",
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

const sizeStyles = computed(() => sizeTokens[props.size] ?? sizeTokens.md);
const colorStyles = computed(() => getCheckboxColorClasses(props.color));

const inputClass = computed(() =>
  classNames(
    `peer ${sizeStyles.value.checkboxOffset} shrink-0 rounded border border-neutral-300 bg-white text-white transition-colors duration-150`,
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "checked:border-transparent hover:border-neutral-400",
    "dark:border-neutral-600 dark:bg-neutral-900 dark:hover:border-neutral-500",
    "disabled:border-neutral-200 disabled:bg-neutral-100 disabled:hover:border-neutral-200",
    sizeStyles.value.control,
    colorStyles.value,
    props.inputClassName,
  ),
);

const inlineDescriptionClass = computed(() =>
  classNames(
    sizeStyles.value.description,
    "text-neutral-500 dark:text-neutral-400",
    props.disabled && "text-neutral-400 dark:text-neutral-500",
  ),
);

const stackedDescriptionClass = computed(() =>
  classNames(
    sizeStyles.value.description,
    sizeStyles.value.descriptionOffset,
    "block text-neutral-500 dark:text-neutral-400",
    props.disabled && "text-neutral-400 dark:text-neutral-500",
  ),
);

const labelTextClass = computed(() =>
  classNames(
    sizeStyles.value.label,
    "font-medium text-neutral-900 dark:text-neutral-100",
    props.disabled && "text-neutral-500 dark:text-neutral-400",
  ),
);

const textNodeClass = computed(() =>
  classNames(
    "min-w-0",
    props.descriptionPlacement === "inline" &&
      hasLabel.value &&
      "flex flex-wrap items-center gap-1",
    props.descriptionPlacement === "inline" &&
      !hasLabel.value &&
      "flex items-center",
  ),
);

const rootClass = computed(() =>
  classNames(
    "group flex items-start",
    props.controlAlign === "right" && "flex-row-reverse",
    sizeStyles.value.gap,
    props.fullWidth && "w-full",
    props.disabled && "cursor-not-allowed opacity-60",
    !props.disabled && "cursor-pointer",
    classAttr.value,
  ),
);

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.checked);
  emit("change", e);
};
</script>

<template>
  <label :class="rootClass">
    <input
      :id="controlId"
      ref="el"
      type="checkbox"
      :aria-describedby="descriptionId"
      :disabled="disabled"
      :checked="modelValue"
      :class="inputClass"
      v-bind="restAttrs"
      @change="handleChange"
    />
    <span v-if="hasLabel || hasDescription" :class="textNodeClass">
      <span v-if="hasLabel" :class="labelTextClass">
        <slot name="label">{{ label }}</slot>
      </span>
      <span
        v-if="hasDescription && descriptionPlacement === 'inline'"
        :id="descriptionId"
        :class="inlineDescriptionClass"
      >
        <slot name="description">{{ description }}</slot>
      </span>
      <span
        v-else-if="hasDescription"
        :id="descriptionId"
        :class="stackedDescriptionClass"
      >
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
  </label>
</template>
