<template>
  <div class="flex items-end gap-2 border-t border-slate-200/80 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-slate-900/60">
    <textarea
      v-model="text"
      :disabled="store.streaming"
      rows="1"
      placeholder="Message the assistant…"
      class="flex-1 resize-none rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 disabled:opacity-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
      data-testid="composer-input"
      @keydown="onKey"
    ></textarea>
    <button
      v-if="store.streaming"
      class="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-700"
      data-testid="composer-stop"
      @click="store.stop()"
    >
      Stop
    </button>
    <button
      v-else
      :disabled="!text.trim()"
      class="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
      data-testid="composer-send"
      @click="submit"
    >
      Send
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useChatStore } from "../store";

const store = useChatStore();
const text = ref("");

function submit(): void {
  const value = text.value.trim();
  if (!value || store.streaming) return;
  void store.send(value);
  text.value = "";
}

function onKey(e: KeyboardEvent): void {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    submit();
  }
}
</script>
