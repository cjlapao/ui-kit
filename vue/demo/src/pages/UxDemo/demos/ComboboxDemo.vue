<script setup lang="ts">
import { ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  Combobox,
  MultiToggle,
  Select,
  Toggle,
  INPUT_VARIANTS,
  VALIDATION_STATUSES,
} from "@cjlapao/ui-kit-vue";
import type {
  ComboboxOption,
  ComboboxValidationStatus,
  ComboboxVariant,
  ControlSize,
  TrueColor,
} from "@cjlapao/ui-kit-vue";
import {
  controlSizeOptions,
  inputVariantOptions,
  trueColorOptions,
  validationStatusOptions,
} from "../constants";

const OPTIONS: ComboboxOption[] = [
  { value: "eu-west-1", label: "Ireland", description: "eu-west-1", icon: "Globe" },
  { value: "eu-central-1", label: "Frankfurt", description: "eu-central-1", icon: "Globe" },
  { value: "us-east-1", label: "N. Virginia", description: "us-east-1", icon: "Globe" },
  { value: "us-west-2", label: "Oregon", description: "us-west-2", icon: "Globe" },
  { value: "ap-northeast-1", label: "Tokyo", description: "ap-northeast-1", icon: "Globe" },
  {
    value: "ap-southeast-2",
    label: "Sydney",
    description: "Not enabled for this account",
    icon: "Globe",
    disabled: true,
  },
];

const value = ref("");
const picked = ref<string | null>(null);

const size = ref<ControlSize>("md");
const variant = ref<ComboboxVariant>("flat");
const tone = ref<TrueColor>("blue");
const validationStatus = ref<ComboboxValidationStatus>("none");

const disabled = ref(false);
const readOnly = ref(false);
const loading = ref(false);
const clearable = ref(true);
const withIcon = ref(true);
const onGlass = ref(false);

const stateToggles = [
  { label: "Loading", model: loading },
  { label: "Disabled", model: disabled },
  { label: "Read-only", model: readOnly },
  { label: "Clearable", model: clearable },
  { label: "Leading icon", model: withIcon },
  { label: "On a glass panel", model: onGlass },
];
</script>

<template>
  <PlaygroundSection
    title="Combobox"
    label="[Combobox]"
    description="A text field that suggests without preventing. It renders Input, so the box, the sizes and the entry variants are the kit's own — and it follows the ARIA combobox pattern, so the whole list is reachable from the keyboard."
  >
    <template #controls>
      <div class="grid gap-3 md:grid-cols-4">
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
            :options="inputVariantOptions"
            :model-value="variant"
            @update:model-value="variant = $event as ComboboxVariant"
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
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">Validation</span>
          <MultiToggle
            full-width
            size="sm"
            :options="validationStatusOptions"
            :model-value="validationStatus"
            @update:model-value="validationStatus = $event as ComboboxValidationStatus"
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
        <div class="flex max-w-md flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Current settings
          </span>
          <Combobox
            :options="OPTIONS"
            :value="value"
            :size="size"
            :variant="variant"
            :tone="tone"
            :validation-status="validationStatus"
            :disabled="disabled"
            :read-only="readOnly"
            :loading="loading"
            :clearable="clearable"
            :leading-icon="withIcon ? 'Search' : undefined"
            placeholder="Search regions…"
            @update:value="value = $event"
            @select="picked = $event.value"
          />
          <span class="text-xs opacity-60">
            Typed: <code>{{ value || "—" }}</code> · Chosen:
            <code>{{ picked ?? "—" }}</code>
          </span>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Every entry variant
          </span>
          <div class="grid gap-3 sm:grid-cols-2">
            <label v-for="v in INPUT_VARIANTS" :key="v" class="flex flex-col gap-1">
              <span class="text-[11px] uppercase tracking-wide opacity-50">{{ v }}</span>
              <Combobox
                :options="['Alpha', 'Beta', 'Gamma']"
                :variant="v"
                placeholder="Type to filter…"
              />
            </label>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            Every validation status
          </span>
          <div class="grid gap-3 sm:grid-cols-3">
            <label v-for="s in VALIDATION_STATUSES" :key="s" class="flex flex-col gap-1">
              <span class="text-[11px] uppercase tracking-wide opacity-50">{{ s }}</span>
              <Combobox
                :options="['Alpha', 'Beta', 'Gamma']"
                :validation-status="s"
                placeholder="Type to filter…"
              />
            </label>
          </div>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>
