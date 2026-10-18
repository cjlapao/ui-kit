<script lang="ts">
import type { ChatEvent, ChatMessage, ChatModel, ChatStorage } from "../chat";
import type { SurfacePadding, TrueColor } from "../theme";

export interface ChatProps {
  /**
   * The persistence contract — bring your own.
   * @default createLocalChatStorage()
   */
  storage?: ChatStorage;
  /** Streaming endpoint (OpenAI-compatible). Without it the chat archives but never answers. */
  baseUrl?: string;
  apiKey?: string;
  defaultModel?: string;
  /** Pin the picker's list; `false` hides the picker; omit to discover `baseUrl/models`. */
  models?: ChatModel[] | false;
  /** Messages fetched per page, both ways. @default 50 */
  pageSize?: number;
  /** Message ceiling kept in memory — older ones live in storage only. @default 200 */
  keepInMemory?: number;
  /** @default 480 */
  height?: number | string;
  /** @default true */
  showRail?: boolean;
  /** @default "Send a message…" */
  placeholder?: string;
  /** Every observable thing that happens (also emitted as `event`). */
  onEvent?: (event: ChatEvent) => void;
  /** @default "outlined" */
  variant?: "outlined" | "subtle" | "elevated" | "tonal" | "glass";
  /** @default "neutral" */
  tone?: TrueColor;
  /** @default "none" */
  padding?: SurfacePadding;
}
</script>

<script setup lang="ts">
/**
 * Chat, self-sustained: it owns its rail, its folders, its storage and its
 * streaming. Given nothing it runs on localStorage; given a `baseUrl` it
 * streams real completions and can page transcripts over an OData-flavoured
 * REST store (`createRestChatStorage`). Only `keepInMemory` messages live in
 * memory — the rest stay in storage, fetched a page at a time as you ask for
 * earlier history. Chats belong to folders or to the Unfiled shelf; folders
 * are their own thing with their own CRUD. The `message` slot and the
 * `storage`/`onEvent` props are the growth seams.
 */
import { computed, onBeforeUnmount, onMounted, reactive, ref, shallowRef, watch } from "vue";
import classNames from "classnames";
import Button from "./Button.vue";
import CustomIcon from "./CustomIcon.vue";
import DropdownMenu, { type DropdownMenuOption } from "./DropdownMenu.vue";
import EmptyState from "./EmptyState.vue";
import IconButton from "./IconButton.vue";
import Input from "./Input.vue";
import Panel from "./Panel.vue";
import Pill from "./Pill.vue";
import ScrollArea from "./ScrollArea.vue";
import Select from "./Select.vue";
import Spinner from "./Spinner.vue";
import UserAvatar from "./UserAvatar.vue";
import { useClassAttrs } from "../utils/attrsUtils";
import {
  createLocalChatStorage,
  fetchChatModels,
  newId,
  renderChatMarkdown,
  streamChatCompletion,
  toRequestMessages,
  usageTotals,
  type ChatFolder,
  type ChatMeta,
  type ChatUsage,
} from "../chat";
import { getTrueColorTextClass } from "../theme";

defineOptions({ name: "Chat", inheritAttrs: false });

const props = withDefaults(defineProps<ChatProps>(), {
  storage: undefined,
  baseUrl: undefined,
  apiKey: undefined,
  defaultModel: "",
  models: undefined,
  pageSize: 50,
  keepInMemory: 200,
  height: 480,
  showRail: true,
  placeholder: "Send a message…",
  onEvent: undefined,
  variant: "outlined",
  tone: "neutral",
  padding: "none",
});

const emit = defineEmits<{ (event: "event", payload: ChatEvent): void }>();

const { classAttr, restAttrs } = useClassAttrs();

const store: ChatStorage = props.storage ?? createLocalChatStorage();

const folders = ref<ChatFolder[]>([]);
const chats = ref<ChatMeta[]>([]);
const activeId = ref<string | null>(null);
const messages = ref<ChatMessage[]>([]);
const windowRange = reactive({ start: 0, total: 0 });
const hasOlder = ref(false);
const loadingEarlier = ref(false);
const streaming = ref(false);
const storageError = ref<string | null>(null);
const modelList = ref<ChatModel[]>(Array.isArray(props.models) ? props.models : []);
const model = ref(props.defaultModel);

const railOpen = ref(props.showRail);
const renamingChatId = ref<string | null>(null);
const renamingFolderId = ref<string | null>(null);
const addingFolder = ref(false);
const menuChat = shallowRef<{ id: string; anchor: HTMLElement } | null>(null);
const menuFolder = shallowRef<{ id: string; anchor: HTMLElement } | null>(null);
const draft = ref("");
const newFolderDraft = ref("");
const renameFolderDraft = ref("");
const renameChatDraft = ref("");
const showJump = ref(false);
const stick = ref(true);
const copied = ref(false);
let copyTimer: ReturnType<typeof setTimeout> | undefined;
let abort: AbortController | null = null;

const areaRef = ref<HTMLElement | null>(null);
const composerRef = ref<HTMLTextAreaElement | null>(null);

const viewport = () =>
  areaRef.value?.querySelector('[data-slot="scrollarea-viewport"]') as HTMLElement | null;

const fire = (event: ChatEvent) => {
  props.onEvent?.(event);
  emit("event", event);
};

const fail = (err: unknown) => {
  const error = err instanceof Error ? err.message : String(err);
  storageError.value = error;
  fire({ type: "storage-error", error });
};

const refreshChats = async (): Promise<ChatMeta[]> => {
  try {
    const page = await store.listChats({ top: 200 });
    chats.value = page.items;
    return page.items;
  } catch (err) {
    fail(err);
    return [];
  }
};

const refreshFolders = async () => {
  try {
    folders.value = await store.listFolders();
  } catch (err) {
    fail(err);
  }
};

const openChat = async (id: string) => {
  try {
    const record = await store.getChat(id);
    if (!record) {
      await refreshChats();
      return;
    }
    const total = record.messages.length;
    const start = Math.max(0, total - props.keepInMemory);
    windowRange.start = start;
    windowRange.total = total;
    messages.value = record.messages.slice(start);
    hasOlder.value = start > 0;
    activeId.value = id;
    if (record.model) model.value = record.model;
    fire({ type: "chat-selected", id });
    stick.value = true;
  } catch (err) {
    fail(err);
  }
};

onMounted(() => {
  void (async () => {
    await refreshFolders();
    const list = await refreshChats();
    if (list.length > 0) await openChat(list[0].id);
    if (props.models === undefined && props.baseUrl) {
      const found = await fetchChatModels(props.baseUrl, { apiKey: props.apiKey });
      if (found.length > 0) {
        modelList.value = found;
        if (!model.value) model.value = found[0].id;
      }
    }
  })();
});

onBeforeUnmount(() => {
  abort?.abort();
  clearTimeout(copyTimer);
});

const loadEarlier = async () => {
  if (!activeId.value || windowRange.start <= 0) return;
  loadingEarlier.value = true;
  try {
    const take = Math.min(props.pageSize, windowRange.start);
    const page = await store.listMessages(activeId.value, { skip: windowRange.start - take, top: take });
    const anchor = viewport();
    const before = anchor?.scrollHeight ?? 0;
    messages.value = [...page.items, ...messages.value];
    windowRange.start -= take;
    hasOlder.value = windowRange.start > 0;
    requestAnimationFrame(() => {
      if (anchor) anchor.scrollTop = anchor.scrollHeight - before;
    });
  } catch (err) {
    fail(err);
  } finally {
    loadingEarlier.value = false;
  }
};

const createChat = async (folderId?: string | null): Promise<string | null> => {
  try {
    const record = await store.createChat({ folderId, model: model.value });
    const { messages: _dropped, ...meta } = record;
    chats.value = [meta, ...chats.value];
    activeId.value = record.id;
    windowRange.start = 0;
    windowRange.total = 0;
    messages.value = [];
    hasOlder.value = false;
    fire({ type: "chat-created", chat: record });
    return record.id;
  } catch (err) {
    fail(err);
    return null;
  }
};

const deleteChat = async (id: string) => {
  try {
    await store.deleteChat(id);
    fire({ type: "chat-deleted", id });
    const list = await refreshChats();
    if (activeId.value === id) {
      if (list[0]) await openChat(list[0].id);
      else {
        activeId.value = null;
        messages.value = [];
        windowRange.start = 0;
        windowRange.total = 0;
        hasOlder.value = false;
      }
    }
  } catch (err) {
    fail(err);
  }
};

const patchChat = async (id: string, patch: { title?: string; folderId?: string | null; model?: string }) => {
  try {
    await store.updateChat({ id, ...patch });
    if (patch.folderId !== undefined) fire({ type: "chat-moved", id, folderId: patch.folderId });
    await refreshChats();
  } catch (err) {
    fail(err);
  }
};

const saveFolder = async (name: string, id?: string) => {
  if (!name.trim()) return;
  try {
    await store.saveFolder({ id, name: name.trim() });
    await refreshFolders();
  } catch (err) {
    fail(err);
  }
};

const deleteFolder = async (id: string) => {
  try {
    await store.deleteFolder(id);
    await Promise.all([refreshFolders(), refreshChats()]);
  } catch (err) {
    fail(err);
  }
};

const send = async (text: string) => {
  const content = text.trim();
  if (!content || streaming.value) return;
  draft.value = "";
  let chatId = activeId.value;
  if (!chatId) chatId = await createChat();
  if (!chatId) return;

  const user: ChatMessage = {
    id: newId(),
    chatId,
    role: "user",
    content,
    createdAt: new Date().toISOString(),
    status: "done",
  };
  stick.value = true;
  const next = [...messages.value, user];
  const trimmed = next.slice(-props.keepInMemory);
  windowRange.start += next.length - trimmed.length;
  windowRange.total += 1;
  hasOlder.value = windowRange.start > 0;
  messages.value = trimmed;
  fire({ type: "message-sent", message: user });
  void store.appendMessage(chatId, user).catch(fail);

  const pending: ChatMessage = {
    id: newId(),
    chatId,
    role: "assistant",
    content: "",
    createdAt: new Date().toISOString(),
    status: "streaming",
    model: model.value,
  };
  messages.value = [...messages.value, pending];
  streaming.value = true;
  storageError.value = null;

  abort = new AbortController();
  const signal = abort.signal;
  let streamed = "";
  let reasoned = "";
  let usage: ChatUsage | undefined;

  const transcript = [...messages.value.slice(0, -1), user];
  const result = props.baseUrl
    ? await streamChatCompletion({
        baseUrl: props.baseUrl,
        apiKey: props.apiKey,
        model: model.value,
        messages: toRequestMessages(transcript),
        signal,
        onToken: (token) => {
          streamed += token;
          if (streaming.value) patchPending(pending.id, { content: streamed });
        },
        onReasoning: (token) => {
          reasoned += token;
          if (streaming.value) patchPending(pending.id, { reasoning: reasoned });
        },
        onUsage: (u) => {
          usage = u;
        },
      })
    : ({ status: "error", error: "No endpoint is wired to this chat — it stores, but does not answer." } as const);

  streaming.value = false;
  abort = null;
  const settled: ChatMessage =
    result.status === "error"
      ? { ...pending, status: "error", error: result.error, ...(reasoned ? { reasoning: reasoned } : {}) }
      : {
          ...pending,
          status: "done",
          content: streamed || "(stopped)",
          ...(reasoned ? { reasoning: reasoned } : {}),
          ...(usage ? { usage } : {}),
        };
  patchPending(pending.id, settled, true);
  if (result.status === "error") fire({ type: "stream-error", error: result.error });
  else if (result.status === "aborted") fire({ type: "stream-aborted" });
  fire({ type: "message-received", message: settled });
  void store.appendMessage(chatId, settled).catch(fail);
  void refreshChats();
};

/** Replace the streaming placeholder in place, reactively. */
function patchPending(id: string, patch: Partial<ChatMessage>, replace = false) {
  const list = messages.value;
  const idx = list.findIndex((m) => m.id === id);
  if (idx < 0) return;
  const target = [...list];
  target[idx] = replace ? ({ ...patch } as ChatMessage) : { ...list[idx], ...patch };
  messages.value = target;
}

const retryLast = async () => {
  const lastUser = [...messages.value].reverse().find((m) => m.role === "user");
  if (!lastUser) return;
  messages.value = messages.value.filter((m) => !(m.status === "error" && m.role === "assistant"));
  await send(lastUser.content);
};

// Stick-to-bottom scrolling. The viewport element comes and goes with the
// message list (the empty state replaces it), so the listener travels with it.
let boundViewport: HTMLElement | null = null;
const onAreaScroll = () => {
  const vp = viewport();
  if (!vp) return;
  const distance = vp.scrollHeight - vp.scrollTop - vp.clientHeight;
  stick.value = distance < 80;
  showJump.value = distance > 240;
};

watch(
  messages,
  () => {
    const vp = viewport();
    if (vp !== boundViewport) {
      boundViewport?.removeEventListener("scroll", onAreaScroll);
      boundViewport = vp;
      vp?.addEventListener("scroll", onAreaScroll, { passive: true });
    }
    if (stick.value) scrollToBottom();
  },
  { flush: "post" },
);

const scrollToBottom = () => {
  const vp = viewport();
  if (vp) vp.scrollTop = vp.scrollHeight;
};

// Copy delegation for code blocks.
const onListClick = (event: MouseEvent) => {
  const pre = (event.target as HTMLElement).closest("pre");
  const code = pre?.querySelector("code");
  if (!code) return;
  void navigator.clipboard?.writeText(code.textContent ?? "");
  copied.value = true;
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => (copied.value = false), 1200);
};

const totals = computed(() => usageTotals(messages.value));
const activeChat = computed(() => chats.value.find((c) => c.id === activeId.value));
const activeFolderOfActive = computed(() =>
  folders.value.find((f) => f.id === activeChat.value?.folderId),
);
const byFolder = computed(() =>
  folders.value.map((folder) => ({ folder, chats: chats.value.filter((c) => c.folderId === folder.id) })),
);
const unfiled = computed(() =>
  chats.value.filter((c) => !c.folderId || !folders.value.some((f) => f.id === c.folderId)),
);

const chatMenuItems = computed<DropdownMenuOption[]>(() =>
  menuChat.value
    ? [
        { value: "rename", label: "Rename", icon: "Edit" },
        ...folders.value.map((f) => ({ value: `move:${f.id}`, label: `Move to ${f.name}` })),
        { value: "move:", label: "Move to Unfiled" },
        { value: "delete", label: "Delete", icon: "Trash", danger: true },
      ]
    : [],
);

const onChatMenu = (item: DropdownMenuOption) => {
  const id = menuChat.value?.id;
  menuChat.value = null;
  if (!id) return;
  if (item.value === "rename") renamingChatId.value = id;
  else if (item.value === "delete") void deleteChat(id);
  else if (item.value.startsWith("move:")) void patchChat(id, { folderId: item.value.slice(5) || null });
};

const folderMenuItems: DropdownMenuOption[] = [
  { value: "rename", label: "Rename", icon: "Edit" },
  { value: "new", label: "New chat here", icon: "Add" },
  { value: "delete", label: "Delete folder", icon: "Trash", danger: true },
];

const onFolderMenu = (item: DropdownMenuOption) => {
  const id = menuFolder.value?.id;
  menuFolder.value = null;
  if (!id) return;
  if (item.value === "rename") {
    renameFolderDraft.value = folders.value.find((f) => f.id === id)?.name ?? "";
    renamingFolderId.value = id;
  } else if (item.value === "new") void createChat(id);
  else if (item.value === "delete") void deleteFolder(id);
};

const grow = (el: HTMLTextAreaElement | null) => {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
};

const formatTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

const bubbleHtml = (message: ChatMessage) => renderChatMarkdown(message.content);
</script>

<template>
  <Panel
    v-bind="restAttrs"
    :variant="variant"
    :tone="tone"
    :padding="padding"
    :class="classNames('relative overflow-hidden', classAttr)"
    :style="{ height: typeof height === 'number' ? `${height}px` : height }"
  >
    <div class="flex h-full min-h-0">
      <aside
        v-if="railOpen"
        class="flex w-60 min-h-0 shrink-0 flex-col gap-1 border-e border-neutral-200 p-2 dark:border-neutral-800"
      >
        <div class="flex items-center gap-1.5">
          <Button variant="soft" size="sm" leading-icon="Add" class="flex-1" @click="createChat(null)">
            New chat
          </Button>
          <IconButton
            variant="ghost"
            size="sm"
            icon="Library"
            aria-label="New folder"
            @click="addingFolder = !addingFolder"
          />
        </div>
        <Input
          v-if="addingFolder"
          v-model="newFolderDraft"
          size="sm"
          autofocus
          placeholder="Folder name"
          @keydown.enter="
            saveFolder(newFolderDraft);
            addingFolder = false;
            newFolderDraft = '';
          "
          @keydown.escape="addingFolder = false"
        />
        <div class="mt-1 min-h-0 flex-1 overflow-y-auto">
          <div v-for="{ folder, chats: inFolder } in byFolder" :key="folder.id" class="mb-1">
            <div class="flex items-center gap-1 px-1.5 pt-2">
              <CustomIcon
                icon="Library"
                :class="classNames('size-3 shrink-0', getTrueColorTextClass(folder.tone ?? 'blue'))"
              />
              <button
                v-if="renamingFolderId !== folder.id"
                class="min-w-0 flex-1 truncate text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                :title="`New chat in ${folder.name}`"
                @click="createChat(folder.id)"
              >
                {{ folder.name }}
              </button>
              <Input
                v-else
                v-model="renameFolderDraft"
                size="sm"
                autofocus
                @keydown.enter="
                  saveFolder(renameFolderDraft || folder.name, folder.id);
                  renamingFolderId = null;
                "
                @keydown.escape="renamingFolderId = null"
              />
              <IconButton
                variant="ghost"
                size="xs"
                icon="Dots"
                :aria-label="`${folder.name} actions`"
                @click="
                  menuFolder = { id: folder.id, anchor: $event.currentTarget as HTMLElement };
                  renameFolderDraft = folder.name;
                "
              />
            </div>
            <div
              v-for="chat in inFolder"
              :key="chat.id"
              :class="
                classNames(
                  'group flex items-center gap-1 rounded-lg px-2 py-1.5',
                  chat.id === activeId
                    ? 'bg-neutral-100 dark:bg-neutral-800'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/60',
                )
              "
            >
              <button v-if="renamingChatId !== chat.id" class="min-w-0 flex-1 text-left" @click="openChat(chat.id)">
                <div class="truncate text-[13px] font-medium">{{ chat.title }}</div>
                <div v-if="chat.preview" class="truncate text-[11px] text-neutral-400 dark:text-neutral-500">
                  {{ chat.preview }}
                </div>
              </button>
              <Input
                v-else
                v-model="renameChatDraft"
                size="sm"
                autofocus
                class="my-0.5"
                @keydown.enter="
                  patchChat(chat.id, { title: renameChatDraft || chat.title });
                  renamingChatId = null;
                "
                @keydown.escape="renamingChatId = null"
              />
              <IconButton
                variant="ghost"
                size="xs"
                icon="Dots"
                :aria-label="`${chat.title} actions`"
                class="opacity-0 group-hover:opacity-100 focus:opacity-100"
                @click="menuChat = { id: chat.id, anchor: $event.currentTarget as HTMLElement }"
              />
            </div>
          </div>
          <div v-if="unfiled.length" class="mb-1">
            <div
              v-if="byFolder.length"
              class="px-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
            >
              Unfiled
            </div>
            <div
              v-for="chat in unfiled"
              :key="chat.id"
              :class="
                classNames(
                  'group flex items-center gap-1 rounded-lg px-2 py-1.5',
                  chat.id === activeId
                    ? 'bg-neutral-100 dark:bg-neutral-800'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/60',
                )
              "
            >
              <button v-if="renamingChatId !== chat.id" class="min-w-0 flex-1 text-left" @click="openChat(chat.id)">
                <div class="truncate text-[13px] font-medium">{{ chat.title }}</div>
                <div v-if="chat.preview" class="truncate text-[11px] text-neutral-400 dark:text-neutral-500">
                  {{ chat.preview }}
                </div>
              </button>
              <Input
                v-else
                v-model="renameChatDraft"
                size="sm"
                autofocus
                class="my-0.5"
                @keydown.enter="
                  patchChat(chat.id, { title: renameChatDraft || chat.title });
                  renamingChatId = null;
                "
                @keydown.escape="renamingChatId = null"
              />
              <IconButton
                variant="ghost"
                size="xs"
                icon="Dots"
                :aria-label="`${chat.title} actions`"
                class="opacity-0 group-hover:opacity-100 focus:opacity-100"
                @click="menuChat = { id: chat.id, anchor: $event.currentTarget as HTMLElement }"
              />
            </div>
          </div>
          <p v-if="!chats.length" class="px-1.5 py-3 text-xs text-neutral-400 dark:text-neutral-500">
            No chats yet — start one.
          </p>
        </div>
      </aside>

      <main class="flex min-w-0 flex-1 flex-col">
        <header class="flex h-11 shrink-0 items-center gap-2 border-b border-neutral-200 px-2 dark:border-neutral-800">
          <IconButton
            v-if="showRail"
            variant="ghost"
            size="sm"
            icon="ViewRows"
            :aria-label="railOpen ? 'Hide chat list' : 'Show chat list'"
            class="text-neutral-400 dark:text-neutral-500"
            @click="railOpen = !railOpen"
          />
          <template v-if="activeChat">
            <span class="min-w-0 truncate text-sm font-medium">{{ activeChat.title }}</span>
            <IconButton
              variant="ghost"
              size="xs"
              icon="Edit"
              aria-label="Rename chat"
              @click="
                renameChatDraft = activeChat.title;
                renamingChatId = activeChat.id;
              "
            />
            <Pill v-if="activeFolderOfActive" size="sm" :tone="activeFolderOfActive.tone ?? 'blue'">
              {{ activeFolderOfActive.name }}
            </Pill>
          </template>
          <div class="ms-auto flex items-center gap-2">
            <Select
              v-if="models !== false && modelList.length"
              size="sm"
              class="w-44"
              :model-value="model"
              @update:model-value="
                (v: string) => {
                  model = v;
                  if (activeId) patchChat(activeId, { model: v });
                }
              "
            >
              <option v-for="m in modelList" :key="m.id" :value="m.id">{{ m.label ?? m.id }}</option>
            </Select>
          </div>
        </header>

        <div ref="areaRef" class="relative min-h-0 flex-1" @click="onListClick">
          <div v-if="!messages.length" class="flex h-full items-center justify-center">
            <EmptyState
              icon="Chat"
              :title="activeChat ? 'An empty thread' : 'Chat, self-sustained'"
              :subtitle="
                activeChat
                  ? 'Say something — it will be remembered.'
                  : 'Local by default, REST when wired. Folders, paging, streaming — all in, none required.'
              "
            >
              <template v-if="!activeChat" #actions>
                <Button size="sm" leading-icon="Add" @click="createChat(null)">Start a chat</Button>
              </template>
            </EmptyState>
          </div>
          <ScrollArea v-else class="h-full" mask>
            <div class="flex flex-col gap-3 px-4 py-3">
              <div v-if="hasOlder" class="flex justify-center">
                <Button variant="soft" size="sm" :loading="loadingEarlier" @click="loadEarlier">
                  Load earlier messages
                </Button>
              </div>
              <div
                v-for="(message, index) in messages"
                :key="message.id"
                :class="classNames('flex items-end gap-2', message.role === 'user' ? 'flex-row-reverse' : '')"
              >
                <UserAvatar size="xs" :user="{ name: message.role === 'user' ? 'You' : 'Assistant' }" />
                <slot name="message" :message="message" :streaming="streaming && index === messages.length - 1">
                  <div
                    :class="
                      classNames(
                        'max-w-[80%] min-w-0 rounded-2xl px-3.5 py-2 text-sm leading-6',
                        message.role === 'user'
                          ? 'rounded-br-md bg-blue-600 text-white'
                          : 'rounded-bl-md bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100',
                        message.status === 'error' &&
                          'bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-900',
                      )
                    "
                  >
                    <template v-if="message.role === 'user'">
                      <span class="whitespace-pre-wrap break-words">{{ message.content }}</span>
                    </template>
                    <template v-else>
                      <details
                        v-if="message.reasoning"
                        class="mb-1.5 text-xs text-neutral-500 dark:text-neutral-400"
                      >
                        <summary class="cursor-pointer select-none">Thinking</summary>
                        <div class="mt-1 whitespace-pre-wrap border-l-2 border-neutral-300 pl-2 dark:border-neutral-600">
                          {{ message.reasoning }}
                        </div>
                      </details>
                      <div
                        v-if="message.content"
                        class="break-words"
                        v-html="bubbleHtml(message)"
                      />
                      <span
                        v-else-if="streaming && index === messages.length - 1"
                        class="flex items-center gap-1 py-1"
                        aria-label="Thinking"
                      >
                        <Spinner size="xs" />
                      </span>
                      <span
                        v-if="streaming && index === messages.length - 1 && message.content"
                        class="ml-0.5 inline-block h-4 w-2 animate-pulse bg-current align-middle"
                        aria-hidden="true"
                      />
                      <div v-if="message.status === 'error'" class="mt-1 flex items-center gap-2 text-xs">
                        <span class="min-w-0 flex-1 truncate opacity-80">{{ message.error }}</span>
                        <Button variant="link" size="sm" @click="retryLast">Retry</Button>
                      </div>
                    </template>
                    <div
                      :class="
                        classNames(
                          'mt-0.5 flex items-center gap-2 text-[10px]',
                          message.role === 'user' ? 'text-blue-200' : 'text-neutral-400 dark:text-neutral-500',
                        )
                      "
                    >
                      <span>{{ formatTime(message.createdAt) }}</span>
                      <span v-if="message.usage?.total_tokens !== undefined" class="font-mono tabular-nums">
                        ↑{{ compact(message.usage.prompt_tokens ?? 0) }}
                        ↓{{ compact(message.usage.completion_tokens ?? 0) }}</span
                      >
                    </div>
                  </div>
                </slot>
              </div>
            </div>
          </ScrollArea>
          <IconButton
            v-if="showJump"
            rounded="full"
            variant="soft"
            size="sm"
            icon="ArrowDown"
            aria-label="Jump to latest"
            class="absolute bottom-3 left-1/2 -translate-x-1/2 shadow-lg"
            @click="
              stick = true;
              scrollToBottom();
            "
          />
          <Pill v-if="copied" size="sm" tone="green" class="absolute right-3 top-3 shadow">Copied</Pill>
        </div>

        <div
          v-if="storageError"
          class="flex items-center gap-2 border-t border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          <span class="min-w-0 flex-1 truncate">{{ storageError }}</span>
          <Button variant="link" size="sm" class="text-red-700 dark:text-red-300" @click="storageError = null">
            Dismiss
          </Button>
        </div>

        <div class="shrink-0 border-t border-neutral-200 p-2 dark:border-neutral-800">
          <div class="flex items-end gap-2">
            <textarea
              ref="composerRef"
              rows="1"
              :value="draft"
              :placeholder="placeholder"
              aria-label="Message"
              class="max-h-40 min-h-[2.25rem] w-full flex-1 resize-none rounded-xl bg-neutral-100 px-3 py-2 text-sm outline-none ring-blue-500/40 transition focus:bg-white focus:ring-2 dark:bg-neutral-800 dark:focus:bg-neutral-800"
              @input="
                draft = ($event.target as HTMLTextAreaElement).value;
                grow($event.target as HTMLTextAreaElement);
              "
              @keydown.enter.exact.prevent="
                send(draft);
                grow(composerRef);
              "
            />
            <Button v-if="streaming" variant="soft" size="sm" leading-icon="Stop" @click="abort?.abort()">
              Stop
            </Button>
            <Button v-else variant="solid" size="sm" leading-icon="Send" :disabled="!draft.trim()" @click="send(draft)">
              Send
            </Button>
          </div>
          <div
            v-if="totals.requests > 0"
            class="mt-1 flex items-center gap-2 px-1 font-mono text-[10px] tabular-nums tracking-tighter text-neutral-400 dark:text-neutral-500"
          >
            <span>↑{{ compact(totals.promptTokens) }}</span>
            <span>↓{{ compact(totals.completionTokens) }}</span>
            <span v-if="totals.cost > 0">${{ totals.cost.toFixed(3) }}</span>
            <span>{{ totals.requests }} req</span>
          </div>
        </div>
      </main>
    </div>

    <DropdownMenu
      v-if="menuChat"
      :anchor-ref="menuChat.anchor"
      :open="true"
      :items="chatMenuItems"
      @select="onChatMenu"
    />
    <DropdownMenu
      v-if="menuFolder"
      :anchor-ref="menuFolder.anchor"
      :open="true"
      :items="folderMenuItems"
      @select="onFolderMenu"
    />
  </Panel>
</template>
