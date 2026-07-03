<script setup lang="ts">
import { ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import { InfiniteScrollPanel, Toggle, Button } from "@cjlapao/ui-kit-vue";

const infiniteItems = ref<number[]>(Array.from({ length: 20 }, (_, i) => i));
const infiniteHasMore = ref(true);
const infiniteIsLoading = ref(false);
const infiniteMasonry = ref(true);
const infiniteFixedColumns = ref(false);

const loadMoreInfiniteItems = async () => {
  if (infiniteIsLoading.value) return;
  infiniteIsLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1500));
  infiniteItems.value = [
    ...infiniteItems.value,
    ...Array.from({ length: 10 }, (_, i) => infiniteItems.value.length + i),
  ];
  infiniteIsLoading.value = false;
  if (infiniteItems.value.length > 100) {
    infiniteHasMore.value = false;
  }
};

const resetItems = () => {
  infiniteItems.value = Array.from({ length: 20 }, (_, i) => i);
  infiniteHasMore.value = true;
};
</script>

<template>
  <PlaygroundSection
    title="Infinite Scroll Panel"
    label="[InfiniteScrollPanel]"
    description="Scrollable container with masonry layout and auto-loading."
  >
    <template #controls>
      <div class="space-y-4 text-sm">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="flex items-center justify-between">
            <span>Masonry</span>
            <Toggle
              size="sm"
              v-model="infiniteMasonry"
              :disabled="infiniteFixedColumns"
            />
          </label>
          <label class="flex items-center justify-between">
            <span>Fixed Columns</span>
            <Toggle size="sm" v-model="infiniteFixedColumns" />
          </label>
        </div>
        <div class="flex items-center justify-between">
          <span>Has More</span>
          <Toggle size="sm" v-model="infiniteHasMore" />
        </div>
        <div class="flex items-center justify-between">
          <span>Reset Data</span>
          <Button size="xs" variant="soft" @click="resetItems">
            Reset
          </Button>
        </div>
      </div>
    </template>
    <template #preview>
      <div
        class="h-[500px] w-full rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50"
      >
        <InfiniteScrollPanel
          :items="infiniteItems"
          :is-loading="infiniteIsLoading"
          :has-more="infiniteHasMore"
          :on-load-more="loadMoreInfiniteItems"
          :masonry="infiniteMasonry"
          :use-fixed-columns="infiniteFixedColumns"
        >
          <template #renderItem="{ item }">
            <div
              class="w-full rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
              :style="{ height: `${100 + ((item as number) % 5) * 40}px` }"
            >
              <div class="mb-2 font-semibold">Item {{ item }}</div>
              <div class="text-xs text-neutral-500">
                Height: {{ 100 + ((item as number) % 5) * 40 }}px
              </div>
            </div>
          </template>
        </InfiniteScrollPanel>
      </div>
    </template>
  </PlaygroundSection>
</template>
