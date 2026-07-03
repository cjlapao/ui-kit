<script setup lang="ts">
import { ref } from "vue";
import { BadgeIcon, Input, Select, Toggle } from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";

type BadgePosition = "top-start" | "top-end" | "bottom-start" | "bottom-end";

const badgeIconCount = ref(5);
const badgeIconPosition = ref<BadgePosition>("top-end");
const badgeIconDot = ref(false);

const noop = () => {};
</script>

<template>
  <PlaygroundSection
    title="BadgeIcon"
    label="[BadgeIcon]"
    description="An icon button with a badge indicator."
  >
    <template #controls>
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-neutral-500">
              Badge Count
            </label>
            <Input
              type="number"
              :model-value="badgeIconCount.toString()"
              @update:model-value="badgeIconCount = Number($event)"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-neutral-500">
              Position
            </label>
            <Select
              :model-value="badgeIconPosition"
              @update:model-value="badgeIconPosition = $event as BadgePosition"
            >
              <option value="top-start">Top Start</option>
              <option value="top-end">Top End</option>
              <option value="bottom-start">Bottom Start</option>
              <option value="bottom-end">Bottom End</option>
            </Select>
          </div>
        </div>
        <div class="flex flex-wrap gap-4">
          <Toggle label="Dot Only" v-model="badgeIconDot" />
        </div>
      </div>
    </template>
    <template #preview>
      <div class="flex items-center justify-center gap-8 p-8">
        <BadgeIcon
          icon="Notification"
          :badge-count="badgeIconCount"
          :badge-dot="badgeIconDot"
          :badge-position="badgeIconPosition"
          @click="noop"
        />
        <BadgeIcon
          icon="Chat"
          :badge-count="badgeIconCount"
          :badge-dot="badgeIconDot"
          :badge-position="badgeIconPosition"
          color="emerald"
          @click="noop"
        />
      </div>
    </template>
  </PlaygroundSection>
</template>
