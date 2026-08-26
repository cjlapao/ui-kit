<template>
  <div class="flex" :class="isUser ? 'justify-end' : 'justify-start'">
    <div
      class="max-w-[85%] rounded-2xl px-4 py-2.5"
      :class="
        isUser
          ? 'rounded-br-sm bg-blue-600 text-white'
          : 'rounded-bl-sm border border-slate-200/80 bg-white text-slate-900 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100'
      "
      data-testid="message-bubble"
    >
      <div v-if="isUser" class="whitespace-pre-wrap break-words">{{ message.content }}</div>
      <div v-else>
        <div
          v-if="isThinking"
          class="mb-2 overflow-hidden rounded-md border border-slate-200/80 bg-slate-100 dark:border-white/10 dark:bg-black/20"
          data-testid="reasoning-block"
        >
          <button
            type="button"
            class="flex w-full items-center gap-2 px-3 py-2 text-left"
            data-testid="reasoning-toggle"
            :aria-expanded="reasoningExpanded ? 'true' : 'false'"
            @click="reasoningExpanded = !reasoningExpanded"
          >
            <span
              class="text-xs font-semibold uppercase tracking-wider"
              :class="isThinkingActive ? 'thinking-label' : 'text-slate-500 dark:text-slate-400'"
              data-testid="reasoning-label"
            >
              {{ label }}
            </span>
            <svg
              class="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 motion-reduce:transform-none"
              :class="reasoningExpanded ? 'rotate-90' : ''"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>
          <div
            v-show="reasoningExpanded && !!message.reasoning"
            class="px-3 pb-2.5"
            data-testid="reasoning-content"
          >
            <Markdown :content="message.reasoning ?? ''" data-testid="reasoning-text" />
          </div>
        </div>
        <Markdown :content="message.content" />
        <span
          v-if="message.status === 'streaming'"
          class="mt-2 inline-block h-4 w-2 animate-pulse bg-slate-400 align-middle dark:bg-slate-500"
        ></span>
        <p
          v-if="message.status === 'error' && message.error"
          class="mt-2 text-xs text-red-500 dark:text-red-400"
          data-testid="message-error"
        >
          {{ message.error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Markdown from "./Markdown.vue";
import type { Message } from "../types";
import { formatThinkingDuration } from "../thinking";

const props = defineProps<{ message: Message }>();
const isUser = computed(() => props.message.role === "user");
const isStreaming = computed(() => props.message.status === "streaming");
const isThinking = computed(() => isStreaming.value || !!props.message.reasoning);

const thinkingMs = computed(() => {
  const start = props.message.thinkingStartedAt;
  const end = props.message.thinkingEndedAt;
  if (start == null || end == null) return null;
  return Math.max(0, end - start);
});

const isThinkingActive = computed(() => isStreaming.value && thinkingMs.value == null);

const label = computed(() =>
  thinkingMs.value != null ? `Thought for ${formatThinkingDuration(thinkingMs.value)}` : "Thinking",
);

const reasoningExpanded = ref(false);
</script>
