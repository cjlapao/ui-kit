<script setup lang="ts">
import { ref } from "vue";
import { InputGroup, Input, MultiToggle, Toggle } from "@cjlapao/ui-kit-vue";
import type { ButtonColor } from "@cjlapao/ui-kit-vue";
import { colorOptions } from "../constants";
import PlaygroundSection from "../PlaygroundSection.vue";

const inputGroupTone = ref<ButtonColor>("blue");
const inputGroupSize = ref<"sm" | "md" | "lg">("md");
const inputGroupLeading = ref(true);
const inputGroupTrailing = ref(true);

const sizeOptions = [
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
];
</script>

<template>
  <PlaygroundSection
    title="Input Group"
    label="[InputGroup]"
    description="Chain inputs with addons for prefixes/suffixes."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <label class="flex flex-col gap-2">
          <span>Tone</span>
          <MultiToggle
            full-width
            :options="colorOptions"
            :model-value="inputGroupTone"
            size="sm"
            @update:model-value="inputGroupTone = $event as ButtonColor"
          />
        </label>
        <label class="flex flex-col gap-2">
          <span>Size</span>
          <MultiToggle
            full-width
            :options="sizeOptions"
            :model-value="inputGroupSize"
            size="sm"
            @update:model-value="inputGroupSize = $event as 'sm' | 'md' | 'lg'"
          />
        </label>
        <div class="grid gap-2 md:grid-cols-2">
          <label class="flex items-center justify-between">
            <span>Leading addon</span>
            <Toggle size="sm" v-model="inputGroupLeading" />
          </label>
          <label class="flex items-center justify-between">
            <span>Trailing addon</span>
            <Toggle size="sm" v-model="inputGroupTrailing" />
          </label>
        </div>
      </div>
    </template>
    <template #preview>
      <InputGroup
        :tone="inputGroupTone"
        :size="inputGroupSize"
        :leading-addon="inputGroupLeading ? 'https://' : undefined"
        :trailing-addon="inputGroupTrailing ? '.example.com' : undefined"
      >
        <Input placeholder="workspace" />
      </InputGroup>
    </template>
  </PlaygroundSection>
</template>
