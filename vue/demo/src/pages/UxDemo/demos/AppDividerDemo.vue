<script setup lang="ts">
import PlaygroundSection from "../PlaygroundSection.vue";
import { AppDivider } from "@cjlapao/ui-kit-vue";
</script>

<template>
  <PlaygroundSection
    title="App Divider"
    label="[AppDivider]"
    description="Vertical divider for separating header sections."
  >
    <template #controls>
      <div class="text-sm text-neutral-500">
        No interactive controls for this component.
      </div>
    </template>
    <template #preview>
      <div
        class="flex h-16 items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800"
      >
        <span>Item 1</span>
        <AppDivider />
        <span>Item 2</span>
        <AppDivider />
        <span>Item 3</span>
      </div>
    </template>
  </PlaygroundSection>
</template>
