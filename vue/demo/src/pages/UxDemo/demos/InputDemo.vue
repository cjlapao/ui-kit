<script setup lang="ts">
import { ref } from "vue";
import { Input, Toggle, MultiToggle } from "@cjlapao/ui-kit-vue";
import type { ButtonColor } from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import { colorOptions } from "../constants";

const inputSize = ref<"sm" | "md" | "lg">("md");
const inputTone = ref<ButtonColor>("blue");
const inputValidation = ref<"none" | "error" | "success">("none");
const inputDisabled = ref(false);
const inputLeadingIcon = ref(true);
const inputTrailingIcon = ref(false);
const inputUnstyled = ref(false);

const sizeOptions = [
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
];

const validationOptions = [
  { label: "None", value: "none" },
  { label: "Error", value: "error" },
  { label: "Success", value: "success" },
];

const toggleItems = [
  { label: "Leading icon", state: inputLeadingIcon },
  { label: "Trailing icon", state: inputTrailingIcon },
  { label: "Disabled", state: inputDisabled },
  { label: "Unstyled", state: inputUnstyled },
];
</script>

<template>
  <PlaygroundSection
    title="Inputs"
    label="[Input]"
    description="Text inputs with validation, icons, and tones."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex flex-col gap-2">
            <span>Size</span>
            <MultiToggle
              full-width
              :options="sizeOptions"
              :model-value="inputSize"
              size="sm"
              @update:model-value="inputSize = $event as 'sm' | 'md' | 'lg'"
            />
          </label>
          <label class="flex flex-col gap-2">
            <span>Tone</span>
            <MultiToggle
              full-width
              :options="colorOptions"
              :model-value="inputTone"
              size="sm"
              @update:model-value="inputTone = $event as ButtonColor"
            />
          </label>
        </div>
        <label class="flex flex-col gap-2">
          <span>Validation</span>
          <MultiToggle
            full-width
            :options="validationOptions"
            :model-value="inputValidation"
            size="sm"
            @update:model-value="
              inputValidation = $event as 'none' | 'error' | 'success'
            "
          />
        </label>
        <div class="grid gap-2 md:grid-cols-4">
          <label
            v-for="item in toggleItems"
            :key="item.label"
            class="flex items-center justify-between"
          >
            <span>{{ item.label }}</span>
            <Toggle size="sm" v-model="item.state.value" />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <div class="space-y-3">
        <Input
          :size="inputSize"
          :tone="inputTone"
          :validation-status="inputValidation"
          :leading-icon="inputLeadingIcon ? 'Search' : undefined"
          :trailing-icon="inputTrailingIcon ? 'Notification' : undefined"
          placeholder="Search or command"
          :disabled="inputDisabled"
          :unstyled="inputUnstyled"
        />
        <Input tone="blue" placeholder="Inline unstyled input" unstyled />
      </div>
    </template>
  </PlaygroundSection>
</template>
