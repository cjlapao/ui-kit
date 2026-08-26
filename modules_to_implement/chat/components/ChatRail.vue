<template>
  <aside
    class="flex h-full flex-col overflow-hidden border-slate-200/80 transition-[width] duration-200 dark:border-white/10"
    :class="open ? 'w-64' : 'w-0'"
    data-testid="chat-rail"
  >
    <div class="flex min-w-[16rem] flex-col gap-2 border-b border-slate-200/80 p-3 dark:border-white/10">
      <div class="flex gap-2">
        <button
          class="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium hover:bg-blue-700"
          data-testid="new-chat"
          @click="store.newChat()"
        >
          + New
        </button>
        <button
          class="rounded-lg bg-slate-100 px-2 py-2 text-sm hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
          title="Collapse rail"
          data-testid="close-rail"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>
      <input
        v-model="q"
        class="w-full rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
        placeholder="Search chats…"
        data-testid="chat-search"
        @input="store.setSearch(q)"
      />
    </div>

    <ul class="flex-1 overflow-y-auto py-1" data-testid="chat-list">
      <li
        v-for="m in store.filteredMetaList"
        :key="m.id"
        class="group flex cursor-pointer items-center gap-1 border-l-2 py-2 pl-2 pr-1"
        :class="
          m.id === store.activeId ? 'border-blue-500 bg-blue-50/50 dark:bg-white/5' : 'border-transparent hover:bg-slate-100 dark:hover:bg-white/5'
        "
        @click="select(m.id)"
      >
        <template v-if="editingId === m.id">
          <input
            v-model="draft"
            class="w-full rounded border border-blue-500 bg-slate-100 px-2 py-1 text-sm text-slate-900 outline-none dark:bg-slate-800 dark:text-slate-100"
            data-testid="rename-input"
            @keydown.enter.prevent="commitRename(m.id)"
            @keydown.esc.prevent="cancelRename"
            @blur="commitRename(m.id)"
          />
        </template>
        <template v-else>
          <div class="flex min-w-0 flex-1 flex-col">
            <span class="truncate text-sm dark:text-slate-200" data-testid="chat-title-item">{{ m.title }}</span>
            <span class="truncate text-[11px] text-slate-500 dark:text-slate-500">
              {{ formatDate(m.updatedAt) }} · {{ modelLabel(m.modelSlug) }}
            </span>
          </div>
          <button
            class="shrink-0 rounded p-1 text-slate-400 opacity-0 hover:text-slate-700 group-hover:opacity-100 dark:text-slate-500 dark:hover:text-white"
            title="Rename"
            data-testid="rename-btn"
            @click.stop="startRename(m)"
          >
            ✎
          </button>
          <button
            class="shrink-0 rounded p-1 text-slate-400 opacity-0 hover:text-red-500 group-hover:opacity-100 dark:text-slate-500 dark:hover:text-red-400"
            title="Delete"
            data-testid="delete-btn"
            @click.stop="store.deleteChat(m.id)"
          >
            🗑
          </button>
        </template>
      </li>
      <li
        v-if="store.filteredMetaList.length === 0"
        class="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-500"
      >
        No chats
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import { useChatStore } from "../store";
import type { ChatMeta } from "../types";

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: "close"): void }>();

const store = useChatStore();
const q = ref("");
const editingId = ref<string | null>(null);
const draft = ref("");

function select(id: string): void {
  if (id !== store.activeId) void store.switchChat(id);
}

function startRename(m: ChatMeta): void {
  editingId.value = m.id;
  draft.value = m.title;
  nextTick(() => {
    const el = document.querySelector<HTMLInputElement>('[data-testid="rename-input"]');
    el?.focus();
    el?.select();
  });
}

function commitRename(id: string): void {
  if (editingId.value !== id) return;
  if (draft.value.trim()) store.renameChat(id, draft.value);
  cancelRename();
}

function cancelRename(): void {
  editingId.value = null;
  draft.value = "";
}

function modelLabel(slug: string): string {
  return store.models.find((m) => m.modelSlug === slug)?.name ?? slug;
}

function formatDate(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}
</script>
