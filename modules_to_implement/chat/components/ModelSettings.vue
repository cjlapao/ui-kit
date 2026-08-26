<template>
  <div
    v-if="showThinking || showEffort"
    class="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-slate-200/80 bg-slate-50/40 px-4 py-2 text-xs dark:border-white/10 dark:bg-slate-900/40"
    data-testid="model-settings"
  >
    <label v-if="showThinking" class="flex cursor-pointer items-center gap-1.5 text-slate-700 dark:text-slate-300">
      <span class="uppercase tracking-wide text-slate-500 dark:text-slate-500">Thinking</span>
      <input
        type="checkbox"
        :checked="store.activeThinking"
        :disabled="store.streaming"
        class="h-4 w-4 accent-blue-500"
        data-testid="thinking-toggle"
        @change="onThinking"
      />
    </label>

    <label v-if="showEffort" class="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
      <span class="uppercase tracking-wide text-slate-500 dark:text-slate-500">Effort</span>
      <select
        :value="store.activeThinkingEffort"
        :disabled="store.streaming"
        class="bg-slate-100 px-1.5 py-0.5 text-slate-900 outline-none disabled:opacity-50 dark:bg-slate-800 dark:text-slate-100"
        data-testid="effort-select"
        @change="onEffort"
      >
        <option v-for="e in efforts" :key="e" :value="e">
          {{ e }}
        </option>
      </select>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useChatStore } from "../store";
import { DEFAULT_THINKING_EFFORTS, type ThinkingEffort } from "../types";

const store = useChatStore();

const showThinking = computed(() => !!store.activeModel?.hasReasoning);
const showEffort = computed(() => !!store.activeModel?.hasThinkingEffort);
const efforts = computed<ThinkingEffort[]>(
  () => store.activeModel?.thinkingEfforts ?? [...DEFAULT_THINKING_EFFORTS],
);

function onThinking(e: Event): void {
  store.setThinking((e.target as HTMLInputElement).checked);
}
function onEffort(e: Event): void {
  store.setThinkingEffort((e.target as HTMLSelectElement).value as ThinkingEffort);
}
</script>
