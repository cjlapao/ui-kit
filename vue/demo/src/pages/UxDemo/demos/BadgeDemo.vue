<script setup lang="ts">
import PlaygroundSection from "../PlaygroundSection.vue";
import { Badge } from "@cjlapao/ui-kit-vue";
import type { ThemeColor } from "@cjlapao/ui-kit-vue";

// The React demo (typechecked with @ts-nocheck) passes "primary"/"secondary",
// which are not part of ThemeColor — keep the same runtime values here.
const primaryTone = "primary" as ThemeColor;
const secondaryTone = "secondary" as ThemeColor;
</script>

<template>
  <PlaygroundSection
    title="Badge"
    label="[Badge]"
    description="Notification counts or status indicators."
  >
    <template #controls>
      <div class="text-sm text-neutral-500">
        No interactive controls for this component.
      </div>
    </template>
    <template #preview>
      <div class="flex flex-wrap gap-4">
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold text-neutral-500">
            Variants
          </span>
          <div class="flex gap-2">
            <Badge :count="5" :tone="primaryTone" />
            <Badge :count="5" :tone="secondaryTone" />
            <Badge :count="5" tone="success" />
            <Badge :count="5" tone="danger" />
            <Badge :count="5" tone="warning" />
            <Badge :count="5" tone="info" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold text-neutral-500">Dot</span>
          <div class="flex gap-2">
            <div class="relative inline-flex">
              <div class="h-8 w-8 rounded bg-neutral-200 dark:bg-neutral-700"></div>
              <span class="absolute -top-1 -right-1">
                <Badge dot tone="danger" />
              </span>
            </div>
            <div class="relative inline-flex">
              <div class="h-8 w-8 rounded bg-neutral-200 dark:bg-neutral-700"></div>
              <span class="absolute -top-1 -right-1">
                <Badge dot tone="success" />
              </span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold text-neutral-500">
            Max Count
          </span>
          <div class="flex gap-2">
            <Badge :count="100" :max-count="99" tone="danger" />
            <Badge :count="1000" :max-count="999" :tone="primaryTone" />
          </div>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>
