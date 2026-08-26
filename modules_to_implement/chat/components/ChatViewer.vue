<template>
  <div class="flex h-full min-w-0 flex-col">
    <header class="flex flex-wrap items-center justify-between gap-x-2 gap-y-2 border-b border-slate-200/80 px-4 py-2.5 dark:border-white/10">
      <h2 class="min-w-0 flex-1 truncate text-sm font-semibold" data-testid="chat-title">
        {{ title }}
      </h2>
      <div class="flex items-center gap-2">
        <ContextGauge :used="usedTokens" :max="maxContext" />
        <ModelSelector />
      </div>
    </header>

    <ModelSettings />

    <MessageList
      v-if="store.activeChatMessages.length"
      :messages="store.activeChatMessages"
    />
    <div
      v-else
      class="flex flex-1 items-center justify-center px-6 text-center text-sm text-slate-500 dark:text-slate-500"
    >
      No messages yet — send something to start.
    </div>

    <Composer />
    <UsageFooter v-if="showUsage" :chat="store.activeChat" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ModelSelector from "./ModelSelector.vue";
import ModelSettings from "./ModelSettings.vue";
import ContextGauge from "./ContextGauge.vue";
import MessageList from "./MessageList.vue";
import Composer from "./Composer.vue";
import UsageFooter from "./UsageFooter.vue";
import { useChatStore } from "../store";
import { chatCurrentContextTokens } from "../usage";

defineProps<{ showUsage?: boolean }>();
const store = useChatStore();
const title = computed(() => store.activeChat?.title ?? "Chat");
const usedTokens = computed(() => chatCurrentContextTokens(store.activeChatMessages));
const maxContext = computed(() => store.activeModel?.maxContext ?? 0);
</script>
