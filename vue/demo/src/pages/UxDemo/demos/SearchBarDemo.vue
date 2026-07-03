<script setup lang="ts">
import { ref } from "vue";
import PlaygroundSection from "../PlaygroundSection.vue";
import { SearchBar, Input, Toggle, Button } from "@cjlapao/ui-kit-vue";

const searchBarPlaceholder = ref("Search...");
const searchBarDebounce = ref(400);
const searchBarAutoSearch = ref(true);
const searchBarDisabled = ref(false);
const searchBarShouldClear = ref(false);
const searchBarLastQuery = ref("");

const triggerClear = () => {
  searchBarShouldClear.value = true;
  setTimeout(() => (searchBarShouldClear.value = false), 100);
};
</script>

<template>
  <PlaygroundSection
    title="SearchBar"
    label="[SearchBar]"
    description="A search input with debounce and clear functionality."
  >
    <template #controls>
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-neutral-500">
              Placeholder
            </label>
            <Input v-model="searchBarPlaceholder" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-neutral-500">
              Debounce (ms)
            </label>
            <Input
              type="number"
              :model-value="searchBarDebounce.toString()"
              @update:model-value="searchBarDebounce = Number($event)"
            />
          </div>
        </div>
        <div class="flex flex-wrap gap-4">
          <Toggle label="Auto Search" v-model="searchBarAutoSearch" />
          <Toggle label="Disabled" v-model="searchBarDisabled" />
          <Button size="sm" @click="triggerClear">Clear Search</Button>
        </div>
      </div>
    </template>
    <template #preview>
      <div class="flex flex-col gap-4 w-full max-w-md">
        <SearchBar
          :placeholder="searchBarPlaceholder"
          :debounce-ms="searchBarDebounce"
          :auto-search="searchBarAutoSearch"
          :disabled="searchBarDisabled"
          :should-clear="searchBarShouldClear"
          @search="(query: string) => (searchBarLastQuery = query)"
        />
        <div class="text-sm text-neutral-500">
          Last search query:
          <span class="font-semibold text-neutral-900 dark:text-neutral-100">
            {{ searchBarLastQuery || "(none)" }}
          </span>
        </div>
      </div>
    </template>
  </PlaygroundSection>
</template>
