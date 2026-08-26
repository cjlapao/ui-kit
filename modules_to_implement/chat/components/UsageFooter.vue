<template>
  <div
    class="flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-200/80 bg-slate-50/60 px-4 py-2 text-xs text-slate-500 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-400"
    data-testid="usage-footer"
  >
    <span>prompt {{ totals.promptTokens }}</span>
    <span>completion {{ totals.completionTokens }}</span>
    <span>total {{ totals.totalTokens }}</span>
    <span>cost {{ totals.cost.toFixed(4) }}</span>
    <span>max ctx {{ contextSize }}</span>
    <span>{{ totals.requests }} req</span>
    <button
      class="ml-auto text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
      @click="store.clearStorageWarning()"
    >
      dismiss warning
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { chatUsageTotal, chatContextSize } from "../usage";
import { useChatStore } from "../store";
import type { Chat } from "../types";

const props = defineProps<{ chat: Chat | null }>();
const store = useChatStore();
const totals = computed(() => chatUsageTotal(props.chat));
const contextSize = computed(() => chatContextSize(props.chat));
</script>
