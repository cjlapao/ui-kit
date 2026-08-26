<template>
  <div class="relative min-h-0 flex-1">
    <div
      ref="scrollEl"
      class="h-full overflow-y-auto overscroll-contain"
      data-testid="message-scroll"
    >
      <div :style="{ height: `${topSpacer}px` }" aria-hidden="true"></div>
      <div class="flex flex-col gap-3 px-4 py-4">
        <div v-for="w in windowMessages" :key="w.index" :data-msg-index="w.index">
          <MessageBubble :message="w.message" />
        </div>
      </div>
      <div :style="{ height: `${bottomSpacer}px` }" aria-hidden="true"></div>
    </div>
    <JumpToBottomButton :visible="showJump" @jump="jumpToBottom" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, toRef } from "vue";
import MessageBubble from "./MessageBubble.vue";
import JumpToBottomButton from "./JumpToBottomButton.vue";
import { useMessageWindow } from "../useMessageWindow";
import type { Message } from "../types";

const props = defineProps<{ messages: Message[] }>();
const messages = toRef(props, "messages");
const scrollEl = ref<HTMLElement | null>(null);

const { windowMessages, topSpacer, bottomSpacer, showJump, bindScroll, jumpToBottom, dispose } =
  useMessageWindow(messages, { targetCount: 25 });

onMounted(() => bindScroll(() => scrollEl.value));
onBeforeUnmount(dispose);
</script>
