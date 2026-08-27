<script lang="ts">
import {
  SURFACE_VARIANTS,
  type ControlSize,
  type InputVariant,
  type SurfaceCorner,
  type SurfacePadding,
  type TrueColor,
} from "../theme/Theme";
import type { KeyValuePair } from "./KeyValueArrayField.vue";
import type { CapsuleBlueprintParameter } from "../../../common/types/CapsuleBlueprint";

/**
 * Every container surface, plus `plain` for a field dropped into a form the
 * app already frames. A form of these used to force one bordered card per
 * parameter, with no way to turn it off.
 */
export const DYNAMIC_FORM_FIELD_VARIANTS = [
  ...SURFACE_VARIANTS,
  "plain",
] as const;
export type DynamicFormFieldVariant =
  (typeof DYNAMIC_FORM_FIELD_VARIANTS)[number];

/**
 * Everything a blueprint parameter can hold.
 *
 * `string | boolean` before this, which is why `List` and `Map` could not be
 * rendered at all — the two value types that fell through to an empty card.
 */
export type DynamicFormFieldValue =
  | string
  | number
  | boolean
  | string[]
  | KeyValuePair[];

export interface DynamicFormFieldOption {
  id: string;
  label: string;
  value: string;
}

export interface DynamicFormFieldProps {
  parameter: CapsuleBlueprintParameter;
  value?: DynamicFormFieldValue;
  error?: string;
  isVisible?: boolean;
  /** Scale of the control, its label and its notes. @default "md" */
  size?: ControlSize;
  /** Surface of the card around the field. @default "outlined" */
  variant?: DynamicFormFieldVariant;
  tone?: TrueColor;
  corner?: SurfaceCorner;
  /** @default "md" */
  padding?: SurfacePadding;
  /** Entry style of the control itself. @default "flat" */
  inputVariant?: InputVariant;
  disabled?: boolean;
  readOnly?: boolean;
  /** Heading of the expanding help block. @default "What is this?" */
  helpTitle?: string;
  /** Tone of that block. Defaults to the field's own tone. */
  helpTone?: TrueColor;
  /** Rows shown by a free-form `List` before it scrolls. @default 4 */
  listRows?: number;
}

/**
 * Options come off a blueprint in three shapes, all typed `any`.
 *
 * `{ label }` is accepted alongside `{ value }` because that is what most
 * callers write; the original mapping — label from `value`, value from `key` —
 * is kept so existing blueprints keep resolving the same way.
 */
export const normalizeOptions = (
  options: CapsuleBlueprintParameter["options"],
): DynamicFormFieldOption[] => {
  if (!options) return [];
  if (Array.isArray(options)) {
    return options.map((option, index) => {
      if (typeof option === "string") {
        return { id: `opt-${index}-${option}`, label: option, value: option };
      }
      const value = String(option.key ?? option.value ?? "");
      return {
        id: `opt-${index}-${value}`,
        label: String(option.label ?? option.value ?? option.key ?? ""),
        value,
      };
    });
  }
  return Object.entries(options).map(([key, label], index) => ({
    id: `opt-${index}-${key}`,
    label: String(label),
    value: key,
  }));
};
</script>

<script setup lang="ts">
import { computed, useId } from "vue";
import Checkbox from "./Checkbox.vue";
import CollapsibleHelpText from "./CollapsibleHelpText.vue";
import FormField from "./FormField.vue";
import Input from "./Input.vue";
import KeyValueArrayField from "./KeyValueArrayField.vue";
import Panel from "./Panel.vue";
import Select from "./Select.vue";
import Textarea from "./Textarea.vue";
import { DEFAULT_SURFACE_CORNER } from "../theme/Theme";
import { CapsuleBlueprintValueType } from "../../../common/types/CapsuleBlueprint";

/**
 * One blueprint parameter, rendered as the control its type calls for.
 *
 * The label, the required marker, the hint and the error all come from
 * `FormField` rather than being hand-rolled per branch — they were written out
 * twice, inconsistently, and the boolean branch had no error rendering at all,
 * so a failed checkbox validated silently.
 */
defineOptions({ name: "DynamicFormField", inheritAttrs: false });

const props = withDefaults(defineProps<DynamicFormFieldProps>(), {
  isVisible: true,
  size: "md",
  variant: "outlined",
  tone: "neutral",
  corner: DEFAULT_SURFACE_CORNER,
  padding: "md",
  inputVariant: "flat",
  disabled: false,
  readOnly: false,
  helpTitle: "What is this?",
  listRows: 4,
});

const emit = defineEmits<{
  change: [
    serviceName: string,
    key: string,
    value: DynamicFormFieldValue,
    triggerDependencyEvaluation: boolean,
  ];
}>();

const generatedId = useId();
const fieldId = computed(() => `${generatedId}-${props.parameter.key}`);

// The blueprint type carries both spellings; only one was ever read, so a
// parameter using `required` got no marker and no `required` attribute.
const required = computed(
  () => props.parameter.is_required ?? props.parameter.required ?? false,
);

const normalizedOptions = computed(() => normalizeOptions(props.parameter.options));

const validationStatus = computed(() => (props.error ? "error" : "none"));

const handleChange = (value: DynamicFormFieldValue, trigger = true) => {
  if (props.disabled || props.readOnly) return;
  emit(
    "change",
    props.parameter.service_name || "global",
    props.parameter.key,
    value,
    trigger,
  );
};

const handleBlur = () => {
  const hasDependencies = (props.parameter.depends_on?.length ?? 0) > 0;
  // Was `String` only, so an `Int` parameter that other fields depend on never
  // re-evaluated them on blur.
  const isText =
    props.parameter.value_type === CapsuleBlueprintValueType.String ||
    props.parameter.value_type === CapsuleBlueprintValueType.Int;
  if (hasDependencies && isText) handleChange(props.value ?? "", true);
};

const valueType = computed(() => props.parameter.value_type);
const isTextField = computed(
  () =>
    valueType.value === CapsuleBlueprintValueType.String ||
    valueType.value === CapsuleBlueprintValueType.Int,
);
const isCheckbox = computed(
  () => valueType.value === CapsuleBlueprintValueType.Boolean,
);
const isSelect = computed(
  () => valueType.value === CapsuleBlueprintValueType.Select,
);
const isList = computed(
  () => valueType.value === CapsuleBlueprintValueType.List,
);
const isKeyValue = computed(
  () => valueType.value === CapsuleBlueprintValueType.Map,
);

const textFieldType = computed<"text" | "password" | "number">(() =>
  valueType.value === CapsuleBlueprintValueType.Int
    ? "number"
    : props.parameter.is_secret
      ? "password"
      : "text",
);

/**
 * A value type the kit does not render is nothing to draw — the old version
 * still wrapped it in a bordered card, so an unrecognised parameter showed up
 * as an empty box.
 */
const isRenderable = computed(
  () =>
    props.isVisible &&
    Boolean(valueType.value) &&
    (isTextField.value ||
      isCheckbox.value ||
      isSelect.value ||
      isList.value ||
      isKeyValue.value),
);

const isPlain = computed(() => props.variant === "plain");

const pairs = computed<KeyValuePair[]>(() =>
  Array.isArray(props.value) &&
  (props.value.length === 0 || typeof props.value[0] === "object")
    ? (props.value as KeyValuePair[])
    : [],
);

const lines = computed(() =>
  Array.isArray(props.value)
    ? (props.value as string[]).join("\n")
    : String(props.value ?? ""),
);

const onListInput = (next: string) =>
  handleChange(next.split("\n").filter((line) => line !== ""));

const onNumberInput = (next: string) =>
  handleChange(textFieldType.value === "number" && next !== "" ? Number(next) : next);
</script>

<template>
  <component
    :is="isPlain ? 'div' : Panel"
    v-if="isRenderable"
    v-bind="
      isPlain
        ? { class: 'flex w-full flex-col gap-2' }
        : {
            class: 'w-full',
            variant,
            tone,
            corner,
            padding,
            bodyClassName: 'flex flex-col gap-2',
            scrollable: false,
          }
    "
  >
    <!-- The checkbox carries its own label and description; duplicating them
         in the FormField would announce the field twice. -->
    <KeyValueArrayField
      v-if="isKeyValue"
      :label="parameter.name"
      :hint="parameter.hint"
      :error="error"
      :model-value="pairs"
      @update:model-value="handleChange($event)"
    />

    <FormField
      v-else
      :label="isCheckbox ? undefined : parameter.name"
      :label-for="fieldId"
      :hint="isCheckbox ? undefined : parameter.hint"
      :error="error"
      :required="isCheckbox ? undefined : required"
      :size="size"
    >
      <Input
        v-if="isTextField"
        :id="fieldId"
        :type="textFieldType"
        :model-value="String(value ?? '')"
        :size="size"
        :tone="tone"
        :variant="inputVariant"
        :disabled="disabled"
        :readonly="readOnly"
        :required="required"
        :validation-status="validationStatus"
        @update:model-value="onNumberInput(String($event))"
        @blur="handleBlur"
      />

      <Checkbox
        v-else-if="isCheckbox"
        :id="fieldId"
        :model-value="Boolean(value)"
        :label="parameter.name"
        :description="parameter.hint"
        :required="required"
        :disabled="disabled || readOnly"
        :size="size"
        :tone="tone"
        :validation-status="validationStatus"
        @update:model-value="handleChange(Boolean($event))"
      />

      <Select
        v-else-if="isSelect"
        :id="fieldId"
        :model-value="String(value ?? '')"
        :size="size"
        :tone="tone"
        :variant="inputVariant"
        :disabled="disabled"
        :required="required"
        :validation-status="validationStatus"
        :placeholder="required ? undefined : 'Select…'"
        @update:model-value="handleChange(String($event ?? ''))"
      >
        <option
          v-for="option in normalizedOptions"
          :key="option.id"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </Select>

      <Textarea
        v-else-if="isList"
        :id="fieldId"
        :model-value="lines"
        :rows="listRows"
        :size="size"
        :tone="tone"
        :variant="inputVariant"
        :disabled="disabled"
        :readonly="readOnly"
        :required="required"
        :validation-status="validationStatus"
        placeholder="One entry per line"
        @update:model-value="onListInput(String($event))"
        @blur="handleBlur"
      />
    </FormField>

    <CollapsibleHelpText
      v-if="parameter.help"
      :title="helpTitle"
      :text="parameter.help"
      :tone="helpTone ?? tone"
      :max-length="180"
      show-icon
    />
  </component>
</template>
