<template>
  <div class="flex h-full w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <ChatRail :open="railOpen" class="border-r border-slate-200/80 dark:border-white/10" @close="railOpen = false" />
    <main class="relative flex min-w-0 flex-1 flex-col">
      <ChatViewer :show-usage="showUsage" />
      <button
        v-if="!railOpen"
        class="absolute left-3 top-3 z-20 rounded-lg border border-slate-200/80 bg-white/90 px-2.5 py-1.5 text-sm hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800/90 dark:hover:bg-slate-700"
        title="Open chat list"
        data-testid="open-rail"
        @click="railOpen = true"
      >
        ☰
      </button>
      <!-- SPEC-004 §4.1: the last response is finishing while the app waits
           to move to the Disabled screen — don't blank the screen mid-sentence. -->
      <div
        v-if="agentDisabled && store.streaming"
        class="absolute top-3 left-1/2 z-20 -translate-x-1/2 rounded-lg border border-red-400/50 bg-red-500/10 px-3 py-2 text-xs text-red-300 dark:text-red-300"
        data-testid="disabled-last-response"
      >
        {{ LAST_RESPONSE_NOTE }}
      </div>
      <div
        v-if="store.modelsError"
        class="absolute bottom-14 left-1/2 z-20 flex max-w-[85%] -translate-x-1/2 items-center gap-3 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-2 text-xs text-amber-200 dark:text-amber-200"
        data-testid="models-warning"
      >
        <span class="min-w-0 truncate" :title="store.modelsError">{{ store.modelsError }}</span>
        <button
          class="shrink-0 font-medium underline hover:opacity-75"
          data-testid="models-retry"
          @click="retryModels"
        >
          Retry
        </button>
      </div>
      <div
        v-if="store.storageWarning"
        class="absolute bottom-3 left-1/2 z-20 max-w-[80%] -translate-x-1/2 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-2 text-xs text-amber-200 dark:text-amber-200"
        data-testid="storage-warning"
      >
        {{ store.storageWarning }}
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import ChatRail from "./ChatRail.vue";
import ChatViewer from "./ChatViewer.vue";
import { useChatStore } from "../store";
import { agentDisabled, LAST_RESPONSE_NOTE } from "../../lib/agentDisabled";

defineProps<{ showUsage?: boolean }>();
const store = useChatStore();
const railOpen = ref(true);

onMounted(() => {
  void store.init();
});

/** Re-fetch the model list from the agent (retry banner). */
async function retryModels(): Promise<void> {
  await store.refreshModels();
}
</script>
