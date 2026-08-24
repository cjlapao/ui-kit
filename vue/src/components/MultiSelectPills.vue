<script lang="ts">
import type { ControlSize, TrueColor } from "../theme/Theme";
import type { GlassOpacity, GlassVibrancy, SpecularMode } from "../theme/glass";
import type { PillCorner, PillVariant } from "./Pill.vue";

export type MultiSelectPillOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  /** Icon shown inside the pill. A registry name. */
  icon?: string;
};

export interface MultiSelectPillsProps {
  /** Used as the name for the generated hidden inputs (e.g. `${name}[]`). */
  name: string;
  /** Options rendered as pills. */
  options: MultiSelectPillOption[];
  /** Optional legend displayed above the pill list. */
  legend?: string;
  /** Optional helper text rendered below the legend. */
  description?: string;
  /** Current selected values when using the component in a controlled way. */
  modelValue?: string[];
  /** Default selected values for uncontrolled usage. */
  defaultValue?: string[];
  /** Disable the whole control. */
  disabled?: boolean;
  /** Size of the pills, on the shared control scale. @default "sm" */
  size?: ControlSize;
  /** Theme colour of a selected pill. @default "blue" */
  color?: TrueColor;
  /** Corner rounding of the pills. @default "full" */
  rounded?: PillCorner;
  /** Gap between pills, on the shared control scale. @default "sm" */
  gap?: ControlSize;
  /** Selection behaviour. @default "multiple" */
  selectionMode?: "multiple" | "single";
  /** Variant of a selected pill. @default "solid" */
  variant?: PillVariant;
  /** Variant of an unselected pill. @default "outline" */
  unselectedVariant?: PillVariant;
  /**
   * In single-select mode, whether clicking the selected pill clears it.
   * @default true
   */
  allowDeselect?: boolean;
  /**
   * Swap a selected option's icon for a check mark, so selection is not
   * signalled by colour alone — the `neutral` end of the tone scale barely
   * changes between the two states. Options with no icon of their own gain
   * one when selected, which does shift the row slightly.
   * @default false
   */
  checkmark?: boolean;
  /** Glass fill transparency, when a glass variant is used. */
  glassOpacity?: GlassOpacity;
  /** Backdrop vibrancy, when a glass variant is used. */
  vibrancy?: GlassVibrancy;
  /** Specular highlight, when a glass variant is used. */
  specularMode?: SpecularMode;
}

/** Space between pills. */
const GAP_CLASSES: Record<ControlSize, string> = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
  xl: "gap-6",
};
</script>

<script setup lang="ts">
import { computed, ref, useId, useSlots } from "vue";
import classNames from "classnames";
import Pill from "./Pill.vue";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "MultiSelectPills", inheritAttrs: false });

const props = withDefaults(defineProps<MultiSelectPillsProps>(), {
  defaultValue: () => [],
  disabled: false,
  size: "sm",
  color: "blue",
  rounded: "full",
  gap: "sm",
  selectionMode: "multiple",
  variant: "solid",
  unselectedVariant: "outline",
  allowDeselect: true,
  checkmark: false,
});

const emit = defineEmits<{
  "update:modelValue": [selectedValues: string[]];
  /** Called whenever the selected values change. */
  change: [selectedValues: string[]];
}>();

const { classAttr, restAttrs } = useClassAttrs();
const slots = useSlots();

const generatedId = useId();
const isControlled = computed(() => props.modelValue !== undefined);

const internalSelected = ref<string[]>(props.defaultValue);

// Two watchers used to sit here and both were wrong. One mirrored
// `modelValue` into `internalSelected` when *controlled* — but only the
// uncontrolled branch ever reads it, so it could not have an effect either
// way. The other re-applied `defaultValue` whenever its identity changed,
// which silently threw away the user's selection every time a parent
// re-rendered with an inline `:default-value="[]"`. (React had the same
// second one, and there the fresh array per render made it an infinite render
// loop.) `defaultValue` is the initial value, exactly as it is on an
// `<input>`, so the ref's initialiser is the whole implementation.

const selectedValues = computed(() =>
  isControlled.value ? (props.modelValue ?? []) : internalSelected.value,
);
const selectedSet = computed(() => new Set(selectedValues.value));

const gapClass = computed(() => GAP_CLASSES[props.gap] ?? GAP_CLASSES.sm);

const hasLegend = computed(() => !!(props.legend || slots.legend));
const hasDescription = computed(
  () => !!(props.description || slots.description),
);

const isOptionDisabled = (option: MultiSelectPillOption) =>
  props.disabled || Boolean(option.disabled);

const handleToggle = (option: MultiSelectPillOption) => {
  if (isOptionDisabled(option)) return;

  const isAlreadySelected = selectedSet.value.has(option.value);
  let nextSelected: string[];

  if (props.selectionMode === "single") {
    // Without `allowDeselect` a single-select group cannot be emptied by
    // clicking, which is what a required choice usually wants.
    nextSelected =
      isAlreadySelected && props.allowDeselect ? [] : [option.value];
  } else {
    nextSelected = isAlreadySelected
      ? selectedValues.value.filter((item) => item !== option.value)
      : [...selectedValues.value, option.value];
  }

  if (!isControlled.value) internalSelected.value = nextSelected;
  emit("update:modelValue", nextSelected);
  emit("change", nextSelected);
};

const fieldsetClass = computed(() =>
  classNames("flex flex-col", classAttr.value),
);
</script>

<template>
  <fieldset :class="fieldsetClass" :disabled="disabled" v-bind="restAttrs">
    <legend
      v-if="hasLegend"
      :class="
        classNames(
          'text-sm font-medium text-neutral-900 dark:text-neutral-100',
          !hasDescription && 'pb-3',
        )
      "
    >
      <slot name="legend">{{ legend }}</slot>
    </legend>
    <p
      v-if="hasDescription"
      class="pb-2 text-xs text-neutral-600 dark:text-neutral-300"
    >
      <slot name="description">{{ description }}</slot>
    </p>

    <div :class="classNames('flex flex-wrap', gapClass)">
      <template v-for="(option, index) in options" :key="option.value">
        <!-- Carries the value to a form submit only. The Pill beside it owns
             the semantics, so this is hidden from assistive tech rather than
             announced a second time. `readonly` was also inert here — it does
             nothing on a checkbox. -->
        <input
          :id="`${generatedId}-${name}-${index}`"
          type="checkbox"
          :name="`${name}[]`"
          :value="option.value"
          :checked="selectedSet.has(option.value)"
          class="sr-only"
          tabindex="-1"
          aria-hidden="true"
        />
        <!-- Renders the kit's own Pill rather than a second implementation of
             one. The old inline version carried a hand-written 21-colour map
             in which `red` painted rose and `green` painted emerald. -->
        <Pill
          :tone="color"
          :variant="
            selectedSet.has(option.value) ? variant : unselectedVariant
          "
          :size="size"
          :corner="rounded"
          :icon="
            selectedSet.has(option.value) && checkmark ? 'Check' : option.icon
          "
          :disabled="isOptionDisabled(option)"
          :glass-opacity="glassOpacity"
          :vibrancy="vibrancy"
          :specular-mode="specularMode"
          clickable
          :aria-pressed="selectedSet.has(option.value)"
          :aria-disabled="isOptionDisabled(option) || undefined"
          @click="handleToggle(option)"
        >
          {{ option.label }}
          <span
            v-if="option.description"
            class="ml-2 text-xs opacity-70"
          >
            {{ option.description }}
          </span>
        </Pill>
      </template>
    </div>
  </fieldset>
</template>
