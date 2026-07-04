<script setup lang="ts">
import { ref } from "vue";
import { DetailItemCard, Input, Select, Pill } from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";

const title = ref("Example Item");
const subtitle = ref("Subtitle information");
const description = ref("This is a description of the item.");
const badgesAlignment = ref<"bottom" | "right" | "bottom-end">("right");
</script>

<template>
  <PlaygroundSection
    title="Detail Item Card"
    label="[DetailItemCard]"
    description="A list item with expandable details and badge support."
  >
    <template #controls>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-neutral-500">
            Title
          </label>
          <Input v-model="title" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-neutral-500">
            Subtitle
          </label>
          <Input v-model="subtitle" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-neutral-500">
            Description
          </label>
          <Input v-model="description" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-neutral-500">
            Badges Alignment
          </label>
          <Select
            :model-value="badgesAlignment"
            @update:model-value="
              badgesAlignment = $event as 'bottom' | 'right' | 'bottom-end'
            "
          >
            <option value="right">Right</option>
            <option value="bottom">Bottom</option>
            <option value="bottom-end">Bottom End</option>
          </Select>
        </div>
      </div>
    </template>
    <template #preview>
      <div
        class="w-full max-w-md rounded border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800"
      >
        <DetailItemCard
          :title="title"
          :subtitle="subtitle"
          :description="description"
          :badges-alignment="badgesAlignment"
        >
          <template #badges>
            <Pill tone="success" size="xs">Badge 1</Pill>
            <Pill tone="warning" size="xs">Badge 2</Pill>
          </template>
          <div class="p-4 text-sm text-neutral-600 dark:text-neutral-300">
            This is the expandable content area. You can put any content here.
          </div>
        </DetailItemCard>
      </div>
    </template>
  </PlaygroundSection>
</template>
