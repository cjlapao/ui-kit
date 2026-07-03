<script setup lang="ts">
import { ref } from "vue";
import { DynamicImg, Select } from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";

const size = ref<"xs" | "sm" | "md" | "lg" | "xl">("md");
// Simple SVG base64 for testing (a circle)
const base64 = ref(
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIC8+PC9zdmc+",
);
</script>

<template>
  <PlaygroundSection
    title="Dynamic Image"
    label="[DynamicImg]"
    description="Renders base64 encoded SVGs or Images with dynamic styling."
  >
    <template #controls>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-neutral-500">
            Size
          </label>
          <Select
            :model-value="size"
            @update:model-value="
              size = $event as 'xs' | 'sm' | 'md' | 'lg' | 'xl'
            "
          >
            <option value="xs">XS</option>
            <option value="sm">SM</option>
            <option value="md">MD</option>
            <option value="lg">LG</option>
            <option value="xl">XL</option>
          </Select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-neutral-500">
            Base64 Content
          </label>
          <textarea
            class="h-24 w-full rounded border border-neutral-300 p-2 text-xs dark:border-neutral-600 dark:bg-neutral-800"
            v-model="base64"
          />
        </div>
      </div>
    </template>
    <template #preview>
      <div class="flex items-center justify-center p-8">
        <DynamicImg :base64="base64" :size="size" />
      </div>
    </template>
  </PlaygroundSection>
</template>
