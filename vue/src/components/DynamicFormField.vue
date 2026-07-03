<script lang="ts">
import type { CapsuleBlueprintParameter } from "../types/CapsuleBlueprint";

type DynamicValue = string | boolean;

export interface DynamicFormFieldProps {
  parameter: CapsuleBlueprintParameter;
  value: DynamicValue;
  error?: string;
  isVisible?: boolean;
}

const normalizeOptions = (
  options: CapsuleBlueprintParameter["options"],
): Array<{ id: string; label: string; value: string }> => {
  if (!options) {
    return [];
  }
  if (Array.isArray(options)) {
    return options.map((option, index) => {
      if (typeof option === "string") {
        return {
          id: `opt-${index}-${option}`,
          label: option,
          value: option,
        };
      }
      return {
        id: `opt-${index}-${option.key ?? option.value}`,
        label: String(option.value ?? option.key ?? ""),
        value: String(option.key ?? option.value ?? ""),
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
import { computed } from "vue";
import classNames from "classnames";
import { CapsuleBlueprintValueType } from "../types/CapsuleBlueprint";
import CollapsibleHelpText from "./CollapsibleHelpText.vue";
import Input from "./Input.vue";
import Checkbox from "./Checkbox.vue";
import Select from "./Select.vue";
import { useClassAttrs } from "../utils/attrsUtils";

defineOptions({ name: "DynamicFormField", inheritAttrs: false });

const props = withDefaults(defineProps<DynamicFormFieldProps>(), {
  isVisible: true,
});

const emit = defineEmits<{
  change: [
    serviceName: string,
    key: string,
    value: DynamicValue,
    triggerDependencyEvaluation?: boolean,
  ];
}>();

const { classAttr, restAttrs } = useClassAttrs();

const normalizedOptions = computed(() =>
  normalizeOptions(props.parameter.options),
);

const handleChange = (fieldValue: DynamicValue, trigger?: boolean) => {
  emit(
    "change",
    props.parameter.service_name || "global",
    props.parameter.key,
    fieldValue,
    trigger ?? true,
  );
};

const handleBlur = () => {
  const hasDependencies =
    props.parameter.depends_on && props.parameter.depends_on.length > 0;
  if (
    hasDependencies &&
    props.parameter.value_type === CapsuleBlueprintValueType.String
  ) {
    handleChange(props.value, true);
  }
};

const isTextField = computed(
  () =>
    props.parameter.value_type === CapsuleBlueprintValueType.String ||
    props.parameter.value_type === CapsuleBlueprintValueType.Int,
);

const textFieldType = computed<"text" | "password" | "number">(() => {
  if (props.parameter.value_type === CapsuleBlueprintValueType.Int) {
    return "number";
  }
  return props.parameter.is_secret ? "password" : "text";
});

const textFieldClass = computed(() =>
  classNames("w-full space-y-1", classAttr.value),
);
</script>

<template>
  <div
    v-if="isVisible && parameter.value_type"
    class="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50"
    v-bind="restAttrs"
  >
    <div v-if="isTextField" :class="textFieldClass">
      <label
        class="block text-sm font-medium text-neutral-700 dark:text-neutral-200"
      >
        {{ parameter.name
        }}<span v-if="parameter.is_required" class="ml-1 text-rose-500">*</span>
      </label>
      <Input
        class="w-full"
        :type="textFieldType"
        :model-value="String(value ?? '')"
        :required="parameter.is_required"
        :validation-status="error ? 'error' : 'none'"
        @update:model-value="(v: string) => handleChange(v)"
        @blur="handleBlur"
      />
      <p
        v-if="error || parameter.hint"
        :class="`text-xs ${error ? 'text-rose-500' : 'text-neutral-500'}`"
      >
        {{ error || parameter.hint }}
      </p>
    </div>

    <Checkbox
      v-else-if="parameter.value_type === CapsuleBlueprintValueType.Boolean"
      :model-value="Boolean(value)"
      :label="parameter.name"
      :description="parameter.hint"
      @update:model-value="(v: boolean) => handleChange(v)"
    />

    <div
      v-else-if="parameter.value_type === CapsuleBlueprintValueType.Select"
      class="w-full space-y-1"
    >
      <label
        class="block text-sm font-medium text-neutral-700 dark:text-neutral-200"
      >
        {{ parameter.name
        }}<span v-if="parameter.is_required" class="ml-1 text-rose-500">*</span>
      </label>
      <Select
        :model-value="String(value ?? '')"
        :required="parameter.is_required"
        :validation-status="error ? 'error' : 'none'"
        @update:model-value="(v: string) => handleChange(v ?? '')"
      >
        <option
          v-for="option in normalizedOptions"
          :key="option.id"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </Select>
      <p
        v-if="error || parameter.hint"
        :class="`text-xs ${error ? 'text-rose-500' : 'text-neutral-500'}`"
      >
        {{ error || parameter.hint }}
      </p>
    </div>

    <CollapsibleHelpText
      v-if="parameter.help"
      title="What is this?"
      :text="parameter.help"
      tone="emerald"
      :max-length="180"
      show-icon
    />
  </div>
</template>
