<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Select,
  Toggle,
  MultiToggle,
  type ButtonColor,
} from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import { colorOptions } from "../constants";

const selectTone = ref<ButtonColor>("blue");
const selectSize = ref<"sm" | "md" | "lg">("md");
const selectValidation = ref<"none" | "error" | "success">("none");
const selectLeadingIcon = ref(false);
const selectHideCaret = ref(false);
const selectDisabled = ref(false);
const selectValue = ref("option-1");

const selectToggleOptions = computed(() => [
  {
    label: "Leading icon",
    value: selectLeadingIcon.value,
    setter: (checked: boolean) => (selectLeadingIcon.value = checked),
  },
  {
    label: "Hide caret",
    value: selectHideCaret.value,
    setter: (checked: boolean) => (selectHideCaret.value = checked),
  },
  {
    label: "Disabled",
    value: selectDisabled.value,
    setter: (checked: boolean) => (selectDisabled.value = checked),
  },
]);
</script>

<template>
  <PlaygroundSection
    title="Select"
    label="[Select]"
    description="Styled select dropdown with icon support."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Size</span>
            <MultiToggle
              full-width
              :options="[
                { label: 'SM', value: 'sm' },
                { label: 'MD', value: 'md' },
                { label: 'LG', value: 'lg' },
              ]"
              :model-value="selectSize"
              size="sm"
              @update:model-value="
                (value: string) => (selectSize = value as 'sm' | 'md' | 'lg')
              "
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Tone</span>
            <MultiToggle
              full-width
              :options="colorOptions"
              :model-value="selectTone"
              size="sm"
              @update:model-value="
                (value: string) => (selectTone = value as ButtonColor)
              "
            />
          </label>
        </div>
        <label class="flex flex-col gap-2">
          <span>Validation</span>
          <MultiToggle
            full-width
            :options="[
              { label: 'None', value: 'none' },
              { label: 'Error', value: 'error' },
              { label: 'Success', value: 'success' },
            ]"
            :model-value="selectValidation"
            size="sm"
            @update:model-value="
              (value: string) =>
                (selectValidation = value as 'none' | 'error' | 'success')
            "
          />
        </label>
        <div class="grid gap-2 md:grid-cols-4">
          <label
            v-for="item in selectToggleOptions"
            :key="item.label"
            class="flex items-center justify-between"
          >
            <span>{{ item.label }}</span>
            <Toggle
              size="sm"
              :model-value="item.value"
              @update:model-value="item.setter"
            />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <div class="space-y-3">
        <Select
          v-model="selectValue"
          :size="selectSize"
          :tone="selectTone"
          :validation-status="selectValidation"
          :leading-icon="selectLeadingIcon ? 'Globe' : undefined"
          :hide-caret="selectHideCaret"
          :disabled="selectDisabled"
          placeholder="Pick a region"
        >
          <option value="us">United States</option>
          <option value="eu">Europe</option>
          <option value="apac">Asia Pacific</option>
        </Select>
        <Select multiple placeholder="Multi select" size="md">
          <option value="one">One</option>
          <option value="two">Two</option>
          <option value="three">Three</option>
        </Select>
      </div>
    </template>
  </PlaygroundSection>
</template>
