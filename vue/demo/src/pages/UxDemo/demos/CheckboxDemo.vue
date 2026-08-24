<script setup lang="ts">
import { computed, ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import {
  Checkbox,
  Input,
  MultiToggle,
  Panel,
  Select,
  Toggle,
  CONTROL_SIZES,
  TRUE_COLORS,
} from "@cjlapao/ui-kit-vue";
import type {
  CheckboxAlign,
  CheckboxDescriptionPlacement,
  CheckboxSize,
  CheckboxValidationStatus,
  CheckboxVariant,
  TrueColor,
} from "@cjlapao/ui-kit-vue";
import {
  checkboxAlignOptions,
  checkboxDescriptionPlacementOptions,
  checkboxValidationOptions,
  controlSizeOptions,
  inputVariantOptions,
  trueColorOptions,
} from "../constants";

const color = ref<TrueColor>("blue");
const size = ref<CheckboxSize>("md");
const variant = ref<CheckboxVariant>("flat");
const controlAlign = ref<CheckboxAlign>("left");
const descriptionPlacement = ref<CheckboxDescriptionPlacement>("bottom");
const validationStatus = ref<CheckboxValidationStatus>("none");

const label = ref("Accept the terms");
const description = ref("You can withdraw consent at any time.");
const validationMessage = ref("This field is required");

const showLabel = ref(true);
const showDescription = ref(true);
const checked = ref(true);
const indeterminate = ref(false);
const disabled = ref(false);
const required = ref(false);
const fullWidth = ref(false);
const onGlass = ref(false);

/** A tri-state parent driving three children — what `indeterminate` is for. */
const items = ref([true, false, false]);
const childLabels = ["Containers", "Images", "Volumes"];
const checkedCount = computed(() => items.value.filter(Boolean).length);
const allChecked = computed(() => checkedCount.value === items.value.length);
const someChecked = computed(
  () => checkedCount.value > 0 && checkedCount.value < items.value.length,
);
const setAll = (value: boolean) => {
  items.value = items.value.map(() => value);
};

const stateToggles = [
  { label: "Label", model: showLabel },
  { label: "Description", model: showDescription },
  { label: "Required", model: required },
  { label: "Disabled", model: disabled },
  { label: "Full width", model: fullWidth },
  { label: "On a glass panel", model: onGlass },
];

const handleChecked = (value: boolean) => {
  checked.value = value;
  indeterminate.value = false;
};
</script>

<template>
  <PlaygroundSection
    title="Checkbox"
    label="[Checkbox]"
    description="A drawn checkbox — the box, tick and dash are the kit's own, so they follow the tone in both themes. The native input is still underneath, keeping focus, keyboard behaviour and form participation."
  >
    <template #controls>
      <div class="space-y-5 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Tone
            </span>
            <Select
              :model-value="color"
              @update:model-value="color = $event as TrueColor"
            >
              <option
                v-for="option in trueColorOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </Select>
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Size
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="controlSizeOptions"
              :model-value="size"
              @update:model-value="size = $event as CheckboxSize"
            />
          </label>
        </div>

        <label class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide opacity-70">
            Variant — the same surfaces Input and SearchBar offer
          </span>
          <MultiToggle
            full-width
            size="sm"
            :options="inputVariantOptions"
            :model-value="variant"
            @update:model-value="variant = $event as CheckboxVariant"
          />
        </label>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Control side
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="checkboxAlignOptions"
              :model-value="controlAlign"
              @update:model-value="controlAlign = $event as CheckboxAlign"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Description placement
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="checkboxDescriptionPlacementOptions"
              :model-value="descriptionPlacement"
              @update:model-value="
                descriptionPlacement = $event as CheckboxDescriptionPlacement
              "
            />
          </label>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Label
            </span>
            <Input v-model="label" />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Description
            </span>
            <Input v-model="description" />
          </label>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Validation
            </span>
            <MultiToggle
              full-width
              size="sm"
              :options="checkboxValidationOptions"
              :model-value="validationStatus"
              @update:model-value="
                validationStatus = $event as CheckboxValidationStatus
              "
            />
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-medium uppercase tracking-wide opacity-70">
              Validation message
            </span>
            <Input
              v-model="validationMessage"
              :disabled="validationStatus === 'none'"
            />
          </label>
        </div>

        <div class="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          <Toggle
            size="sm"
            label="Checked"
            :model-value="checked"
            @update:model-value="handleChecked($event)"
          />
          <Toggle size="sm" label="Indeterminate" v-model="indeterminate" />
          <Toggle
            v-for="toggle in stateToggles"
            :key="toggle.label"
            size="sm"
            :label="toggle.label"
            v-model="toggle.model.value"
          />
        </div>

        <p class="text-xs opacity-70">
          <strong>Indeterminate</strong> wins over checked, as it does on the
          native control, and is announced as
          <code>aria-checked="mixed"</code>. The checked fill steps to
          <code>-700</code> in light and <code>-400</code> in dark so the tick
          clears WCAG contrast on every tone — on <strong>yellow</strong> or
          <strong>lime</strong> a white tick on the usual <code>-600</code> fill
          measures under 3:1.
        </p>
      </div>
    </template>

    <template #preview>
      <div class="p-4">
        <Panel
          :variant="onGlass ? 'liquid-glass' : 'outlined'"
          :tone="onGlass ? color : 'neutral'"
          padding="md"
        >
          <div class="space-y-6">
            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Current settings
              </span>
              <Checkbox
                :color="color"
                :size="size"
                :variant="variant"
                :control-align="controlAlign"
                :description-placement="descriptionPlacement"
                :label="showLabel ? label : undefined"
                :description="showDescription ? description : undefined"
                :model-value="checked"
                :indeterminate="indeterminate"
                :required="required"
                :disabled="disabled"
                :full-width="fullWidth"
                :validation-status="validationStatus"
                :validation-message="
                  validationStatus === 'none' ? undefined : validationMessage
                "
                @update:model-value="handleChecked($event)"
              />
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Tri-state — a parent driving its children
              </span>
              <div class="space-y-2">
                <Checkbox
                  :color="color"
                  :size="size"
                  :variant="variant"
                  label="All resources"
                  :description="`${checkedCount} of ${items.length} selected`"
                  :model-value="allChecked"
                  :indeterminate="someChecked"
                  @update:model-value="setAll($event)"
                />
                <div class="ml-6 space-y-1.5">
                  <Checkbox
                    v-for="(childLabel, index) in childLabels"
                    :key="childLabel"
                    :color="color"
                    :size="size"
                    :variant="variant"
                    :label="childLabel"
                    :model-value="items[index]"
                    @update:model-value="items[index] = $event"
                  />
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Every state
              </span>
              <div class="flex flex-wrap gap-x-8 gap-y-3">
                <Checkbox
                  :color="color"
                  :size="size"
                  :variant="variant"
                  label="Unchecked"
                />
                <Checkbox
                  :color="color"
                  :size="size"
                  :variant="variant"
                  label="Checked"
                  :model-value="true"
                />
                <Checkbox
                  :color="color"
                  :size="size"
                  :variant="variant"
                  label="Indeterminate"
                  indeterminate
                />
                <Checkbox
                  :color="color"
                  :size="size"
                  :variant="variant"
                  label="Disabled"
                  disabled
                />
                <Checkbox
                  :color="color"
                  :size="size"
                  :variant="variant"
                  label="Disabled + checked"
                  disabled
                  :model-value="true"
                />
                <Checkbox
                  :color="color"
                  :size="size"
                  :variant="variant"
                  label="Required"
                  required
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Size ladder
              </span>
              <div class="space-y-2">
                <Checkbox
                  v-for="each in CONTROL_SIZES"
                  :key="each"
                  :color="color"
                  :size="each"
                  :variant="variant"
                  :model-value="true"
                  :label="`Size ${each}`"
                  description="The box sits on the label's cap height at every step."
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span
                class="text-[11px] font-semibold uppercase tracking-wide opacity-60"
              >
                Every tone — the tick must stay legible on the fill in both
                themes
              </span>
              <div class="grid gap-x-6 gap-y-2 md:grid-cols-3 xl:grid-cols-4">
                <div
                  v-for="each in TRUE_COLORS"
                  :key="each"
                  class="flex items-center gap-3"
                >
                  <Checkbox
                    :color="each"
                    :size="size"
                    :variant="variant"
                    :model-value="true"
                    :label="each"
                  />
                  <Checkbox
                    :color="each"
                    :size="size"
                    :variant="variant"
                    indeterminate
                  />
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </template>
  </PlaygroundSection>
</template>
