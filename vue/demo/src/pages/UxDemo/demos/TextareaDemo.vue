<script setup lang="ts">
import { ref } from "vue";
import {
  Textarea,
  Select,
  Toggle,
  type ButtonColor,
} from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import { colorOptions } from "../constants";

const textareaSize = ref<"sm" | "md" | "lg">("md");
const textareaTone = ref<ButtonColor>("blue");
const textareaValidation = ref<"none" | "error" | "success">("none");
const textareaResize = ref<"none" | "vertical" | "horizontal" | "both">(
  "vertical",
);
const textareaDisabled = ref(false);
</script>

<template>
  <PlaygroundSection
    title="Textarea"
    label="[Textarea]"
    description="A multi-line text input control."
  >
    <template #controls>
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-neutral-500">
              Size
            </label>
            <Select
              :model-value="textareaSize"
              @update:model-value="
                (value: string) => (textareaSize = value as 'sm' | 'md' | 'lg')
              "
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </Select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-neutral-500">
              Tone
            </label>
            <Select
              :model-value="textareaTone"
              @update:model-value="
                (value: string) => (textareaTone = value as ButtonColor)
              "
            >
              <option
                v-for="opt in colorOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </Select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-neutral-500">
              Validation
            </label>
            <Select
              :model-value="textareaValidation"
              @update:model-value="
                (value: string) =>
                  (textareaValidation = value as 'none' | 'error' | 'success')
              "
            >
              <option value="none">None</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </Select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-neutral-500">
              Resize
            </label>
            <Select
              :model-value="textareaResize"
              @update:model-value="
                (value: string) =>
                  (textareaResize = value as
                    | 'none'
                    | 'both'
                    | 'horizontal'
                    | 'vertical')
              "
            >
              <option value="none">None</option>
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
              <option value="both">Both</option>
            </Select>
          </div>
        </div>
        <div class="flex flex-wrap gap-4">
          <Toggle label="Disabled" v-model="textareaDisabled" />
        </div>
      </div>
    </template>
    <template #preview>
      <div class="w-full max-w-md">
        <Textarea
          placeholder="Enter your text here..."
          :size="textareaSize"
          :tone="textareaTone"
          :validation-status="textareaValidation"
          :resize="textareaResize"
          :disabled="textareaDisabled"
        />
      </div>
    </template>
  </PlaygroundSection>
</template>
