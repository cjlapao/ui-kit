<script setup lang="ts">
import { computed, ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  DynamicFormField,
  MultiToggle,
  Panel,
  Select,
  Toggle,
  CapsuleBlueprintValueType,
} from "@cjlapao/ui-kit-vue";
import type {
  CapsuleBlueprintParameter,
  ControlSize,
  DynamicFormFieldValue,
  DynamicFormFieldVariant,
  InputVariant,
  SurfaceCorner,
  TrueColor,
} from "@cjlapao/ui-kit-vue";
import {
  controlSizeOptions,
  dynamicFormFieldVariantOptions,
  inputVariantOptions,
  panelCornerOptions,
  trueColorOptions,
} from "../constants";

/** One parameter of each value type a blueprint can declare. */
const PARAMETERS: CapsuleBlueprintParameter[] = [
  {
    name: "Service name",
    key: "service_name",
    value_type: CapsuleBlueprintValueType.String,
    is_required: true,
    hint: "Lowercase, no spaces.",
    help: "The name the service registers under. It is used in DNS, so it has to be unique within the environment and cannot be changed after the first deploy.",
  },
  { name: "Replicas", key: "replicas", value_type: CapsuleBlueprintValueType.Int, hint: "How many instances to run." },
  { name: "API token", key: "api_token", value_type: CapsuleBlueprintValueType.String, is_secret: true, hint: "Stored encrypted." },
  { name: "Enable TLS", key: "tls", value_type: CapsuleBlueprintValueType.Boolean, hint: "Terminate HTTPS at the ingress." },
  {
    name: "Region",
    key: "region",
    value_type: CapsuleBlueprintValueType.Select,
    options: [
      { key: "eu-west-1", label: "Ireland" },
      { key: "us-east-1", label: "N. Virginia" },
    ],
    hint: "Where the workload runs.",
  },
  { name: "Allowed origins", key: "origins", value_type: CapsuleBlueprintValueType.List, hint: "One origin per line." },
  { name: "Environment", key: "env", value_type: CapsuleBlueprintValueType.Map, hint: "Injected into the container." },
];

const paramOptions = PARAMETERS.map((p) => ({
  label: `${p.name} (${p.value_type})`,
  value: p.key,
}));

const paramKey = ref(PARAMETERS[0].key);
const values = ref<Record<string, DynamicFormFieldValue>>({});

const size = ref<ControlSize>("md");
const variant = ref<DynamicFormFieldVariant>("outlined");
const inputVariant = ref<InputVariant>("flat");
const tone = ref<TrueColor>("neutral");
const corner = ref<SurfaceCorner>("rounded-xl");

const showError = ref(false);
// Seeded from the parameter and resynced when it changes, so the toggle starts
// out telling the truth about the one on screen.
const required = ref(
  PARAMETERS[0].is_required ?? PARAMETERS[0].required ?? false,
);
const disabled = ref(false);
const readOnly = ref(false);
const onGlass = ref(false);

const stateToggles = [
  { label: "Required", model: required },
  { label: "Error", model: showError },
  { label: "Disabled", model: disabled },
  { label: "Read-only", model: readOnly },
  { label: "On a glass panel", model: onGlass },
];

const onParamChange = (key: string) => {
  paramKey.value = key;
  const next = PARAMETERS.find((p) => p.key === key);
  required.value = next?.is_required ?? next?.required ?? false;
};

const parameter = computed(() => {
  const base = PARAMETERS.find((p) => p.key === paramKey.value)!;
  // Authoritative, not OR'd with the parameter's own flag — that could only
  // ever add `required`, so switching it off left the marker in place on any
  // parameter that declared it.
  return { ...base, is_required: required.value, required: required.value };
});

const onChange = (
  _service: string,
  key: string,
  value: DynamicFormFieldValue,
) => {
  values.value = { ...values.value, [key]: value };
};
</script>

<template>
  <PlaygroundSection
    title="Dynamic Form Field"
    label="[DynamicFormField]"
    description="One blueprint parameter, rendered as the control its value type calls for. The label, required marker, hint and error all come from FormField, and the card takes every Panel surface plus plain."
  >
    <template #controls>
      <div class="grid gap-3 md:grid-cols-3">
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Parameter</span>
          <Select
            size="sm"
            :options="paramOptions"
            :model-value="paramKey"
            @update:model-value="onParamChange(String($event))"
          />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Size</span>
          <MultiToggle
            full-width
            size="sm"
            :options="controlSizeOptions"
            :model-value="size"
            @update:model-value="size = $event as ControlSize"
          />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Variant</span>
          <Select
            size="sm"
            :options="dynamicFormFieldVariantOptions"
            :model-value="variant"
            @update:model-value="variant = $event as DynamicFormFieldVariant"
          />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Entry style</span>
          <Select
            size="sm"
            :options="inputVariantOptions"
            :model-value="inputVariant"
            @update:model-value="inputVariant = $event as InputVariant"
          />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Tone</span>
          <Select
            size="sm"
            :options="trueColorOptions"
            :model-value="tone"
            @update:model-value="tone = $event as TrueColor"
          />
        </label>
        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Corner</span>
          <Select
            size="sm"
            :options="panelCornerOptions"
            :model-value="corner"
            @update:model-value="corner = $event as SurfaceCorner"
          />
        </label>
      </div>

      <div class="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
        <Toggle
          v-for="t in stateToggles"
          :key="t.label"
          size="sm"
          :label="t.label"
          v-model="t.model.value"
        />
      </div>
    </template>

    <template #preview>
      <div
        class="space-y-6 rounded-2xl p-4"
        :class="
          onGlass
            ? 'bg-gradient-to-br from-sky-200 via-violet-200 to-rose-200 dark:from-sky-900 dark:via-violet-900 dark:to-rose-900'
            : ''
        "
      >
        <div class="flex max-w-lg flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Current settings
          </span>
          <DynamicFormField
            :parameter="parameter"
            :value="values[paramKey]"
            :size="size"
            :variant="variant"
            :input-variant="inputVariant"
            :tone="tone"
            :corner="corner"
            :disabled="disabled"
            :read-only="readOnly"
            :error="showError ? 'That value is not accepted.' : undefined"
            @change="onChange"
          />
          <span class="text-xs opacity-60">
            Value: <code>{{ JSON.stringify(values[paramKey] ?? null) }}</code>
          </span>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Every value type
          </span>
          <div class="grid gap-3 lg:grid-cols-2">
            <DynamicFormField
              v-for="p in PARAMETERS"
              :key="p.key"
              :parameter="p"
              :value="values[p.key]"
              @change="onChange"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            A form, not a stack of boxes — variant="plain"
          </span>
          <Panel variant="outlined" padding="lg" title="Deploy settings">
            <div class="flex flex-col gap-4">
              <DynamicFormField
                v-for="p in PARAMETERS.slice(0, 5)"
                :key="p.key"
                :parameter="p"
                variant="plain"
                size="sm"
                :value="values[p.key]"
                @change="onChange"
              />
            </div>
          </Panel>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>
