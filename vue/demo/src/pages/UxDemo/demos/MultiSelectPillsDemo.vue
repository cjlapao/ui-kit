<script setup lang="ts">
import { ref } from "vue";
import { MultiSelectPills, Select } from "@cjlapao/ui-kit-vue";

import PlaygroundSection from "../PlaygroundSection.vue";

type PillsColor = "indigo" | "blue" | "emerald" | "amber" | "rose";
type PillsSize = "xs" | "sm" | "base" | "lg";

const selected = ref<string[]>(["option1"]);
const selectionMode = ref<"multiple" | "single">("multiple");
const color = ref<PillsColor>("indigo");
const size = ref<PillsSize>("sm");
const disabled = ref(false);

const options = [
  { value: "option1", label: "Option 1", description: "Desc 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3", disabled: true },
  { value: "option4", label: "Option 4" },
];
</script>

<template>
  <PlaygroundSection
    title="Multi Select Pills"
    label="[MultiSelectPills]"
    description="A group of pill-shaped buttons for selection."
  >
    <template #controls>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-neutral-500">
            Selection Mode
          </label>
          <Select
            :model-value="selectionMode"
            @update:model-value="
              selectionMode = $event as 'multiple' | 'single'
            "
          >
            <option value="multiple">Multiple</option>
            <option value="single">Single</option>
          </Select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-neutral-500">Color</label>
          <Select
            :model-value="color"
            @update:model-value="color = $event as PillsColor"
          >
            <option value="indigo">Indigo</option>
            <option value="blue">Blue</option>
            <option value="emerald">Emerald</option>
            <option value="rose">Rose</option>
            <option value="amber">Amber</option>
          </Select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-neutral-500">Size</label>
          <Select
            :model-value="size"
            @update:model-value="size = $event as PillsSize"
          >
            <option value="xs">XS</option>
            <option value="sm">SM</option>
            <option value="base">Base</option>
            <option value="lg">LG</option>
          </Select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-neutral-500">State</label>
          <div class="flex items-center gap-2">
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="disabled" />
              Disabled
            </label>
          </div>
        </div>
      </div>
    </template>
    <template #preview>
      <div class="flex items-center justify-center p-8">
        <MultiSelectPills
          name="demo-pills"
          :options="options"
          v-model="selected"
          :selection-mode="selectionMode"
          :color="color"
          :size="size"
          :disabled="disabled"
          legend="Select Options"
        />
      </div>
    </template>
  </PlaygroundSection>
</template>
