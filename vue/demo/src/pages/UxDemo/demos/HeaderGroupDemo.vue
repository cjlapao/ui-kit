<script setup lang="ts">
import { ref } from "vue";
import { HeaderGroup, Input, CustomIcon } from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";

const itemCount = ref(3);
</script>

<template>
  <PlaygroundSection
    title="Header Group"
    label="[HeaderGroup]"
    description="A container for header elements with automatic separators between groups."
  >
    <template #controls>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-neutral-500">
            Item Count
          </label>
          <Input
            type="number"
            :model-value="itemCount.toString()"
            min="1"
            max="5"
            @update:model-value="itemCount = Number($event)"
          />
        </div>
      </div>
    </template>
    <template #preview>
      <div
        class="flex h-12 items-center rounded border border-neutral-200 bg-white px-4 dark:border-neutral-700 dark:bg-neutral-800"
      >
        <HeaderGroup v-for="(_, i) in Array.from({ length: itemCount })" :key="i">
          <div class="flex items-center gap-2 px-2">
            <CustomIcon icon="Notification" class="text-blue-500" />
            <span class="text-sm font-medium">Group {{ i + 1 }}</span>
          </div>
        </HeaderGroup>
      </div>
    </template>
  </PlaygroundSection>
</template>
