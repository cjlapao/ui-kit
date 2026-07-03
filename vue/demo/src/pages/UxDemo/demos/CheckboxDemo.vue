<script setup lang="ts">
import { ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import { Checkbox, MultiToggle, Toggle } from "@cjlapao/ui-kit-vue";
import type { ThemeColor } from "@cjlapao/ui-kit-vue";
import { colorOptions } from "../constants";

type CheckboxColor = ThemeColor;

const checkboxSizeOptions = [
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
];

const checkboxAlignOptions = [
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

const checkboxDescriptionOptions = [
  { label: "Stacked", value: "bottom" },
  { label: "Inline", value: "inline" },
];

const checkboxColor = ref<CheckboxColor>("blue");
const checkboxSize = ref<"sm" | "md" | "lg">("md");
const checkboxAlign = ref<"left" | "right">("left");
const checkboxDescriptionPlacement = ref<"bottom" | "inline">("bottom");
const checkboxLabel = ref(true);
const checkboxDescription = ref(true);
const checkboxIndeterminate = ref(false);
const checkboxDisabled = ref(false);
const checkboxChecked = ref(true);

const checkboxToggleItems = [
  { label: "Show label", model: checkboxLabel },
  { label: "Show description", model: checkboxDescription },
  { label: "Indeterminate", model: checkboxIndeterminate },
  { label: "Disabled", model: checkboxDisabled },
];
</script>

<template>
  <PlaygroundSection
    title="Checkbox"
    label="[Checkbox]"
    description="Accessible checkbox with description layouts."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <label class="flex flex-col gap-2">
          <span>Color</span>
          <MultiToggle
            full-width
            :options="colorOptions"
            :model-value="checkboxColor"
            size="sm"
            @update:model-value="checkboxColor = $event as CheckboxColor"
          />
        </label>
        <div class="grid gap-3 md:grid-cols-3">
          <label class="flex flex-col gap-2">
            <span>Size</span>
            <MultiToggle
              full-width
              :options="checkboxSizeOptions"
              :model-value="checkboxSize"
              size="sm"
              @update:model-value="checkboxSize = $event as 'sm' | 'md' | 'lg'"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Align</span>
            <MultiToggle
              full-width
              :options="checkboxAlignOptions"
              :model-value="checkboxAlign"
              size="sm"
              @update:model-value="checkboxAlign = $event as 'left' | 'right'"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Description</span>
            <MultiToggle
              full-width
              :options="checkboxDescriptionOptions"
              :model-value="checkboxDescriptionPlacement"
              size="sm"
              @update:model-value="
                checkboxDescriptionPlacement = $event as 'bottom' | 'inline'
              "
            />
          </label>
        </div>
        <div class="grid gap-2 md:grid-cols-3">
          <label
            v-for="item in checkboxToggleItems"
            :key="item.label"
            class="flex items-center justify-between"
          >
            <span>{{ item.label }}</span>
            <Toggle size="sm" v-model="item.model.value" />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <div class="space-y-3">
        <Checkbox
          :label="checkboxLabel ? 'Subscribe to release notes' : undefined"
          :description="
            checkboxDescription
              ? 'We will send important product updates occasionally.'
              : undefined
          "
          :description-placement="checkboxDescriptionPlacement"
          :size="checkboxSize"
          :color="checkboxColor"
          :indeterminate="checkboxIndeterminate"
          :control-align="checkboxAlign"
          :disabled="checkboxDisabled"
          v-model="checkboxChecked"
        />
        <Checkbox label="I agree to the terms" color="emerald" size="lg" />
      </div>
    </template>
  </PlaygroundSection>
</template>
