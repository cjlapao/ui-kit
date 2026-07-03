<script setup lang="ts">
import { CustomIcon } from "@cjlapao/ui-kit-vue";
import PlaygroundSection from "../PlaygroundSection.vue";
</script>

<template>
  <PlaygroundSection
    title="Custom Icon"
    label="[CustomIcon]"
    description="Renders icons from the registry (SVG or Image)."
  >
    <template #controls>
      <div class="text-sm text-neutral-500">
        No interactive controls for this component.
      </div>
    </template>
    <template #preview>
      <div class="flex flex-wrap gap-8">
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold text-neutral-500">Sizes</span>
          <div class="flex items-end gap-2">
            <CustomIcon icon="Notification" size="xs" />
            <CustomIcon icon="Notification" size="sm" />
            <CustomIcon icon="Notification" size="md" />
            <CustomIcon icon="Notification" size="lg" />
            <CustomIcon icon="Notification" size="xl" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold text-neutral-500">
            Coloring
          </span>
          <div class="flex gap-2">
            <CustomIcon icon="Notification" size="md" class="text-blue-500" />
            <CustomIcon
              icon="Notification"
              size="md"
              class="text-emerald-500"
            />
            <CustomIcon icon="Notification" size="md" class="text-rose-500" />
            <CustomIcon icon="Notification" size="md" colored />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold text-neutral-500">
            Fallback
          </span>
          <div class="flex gap-2">
            <CustomIcon icon="Send" size="md" />
          </div>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>
