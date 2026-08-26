<template>
  <label
    class="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/60 px-2 py-1 dark:border-white/10 dark:bg-slate-800/60"
    :title="store.modelsError ?? undefined"
    data-testid="model-selector"
  >
    <span class="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Model</span>
    <select
      v-if="store.models.length > 0"
      :value="store.activeModelSlug"
      :disabled="store.streaming"
      class="max-w-[10rem] bg-transparent text-sm text-slate-900 outline-none disabled:opacity-50 dark:text-slate-100"
      data-testid="model-select"
      @change="onChange"
    >
      <option v-for="m in store.models" :key="m.modelSlug" :value="m.modelSlug">
        {{ m.name }}{{ m.scope ? ` (${m.scope})` : "" }}
      </option>
    </select>
    <span
      v-else
      class="max-w-[10rem] truncate text-sm italic text-slate-400 dark:text-slate-500"
      data-testid="model-select-empty"
    >
      {{ store.modelsError ? "No models available" : "Loading models…" }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { useChatStore } from "../store";

const store = useChatStore();

const onChange = (e: Event) => {
  store.setModel((e.target as HTMLSelectElement).value);
};
</script>
