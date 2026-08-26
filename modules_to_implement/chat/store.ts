import { computed, inject, reactive } from "vue";
import type { Chat, ChatMeta, Message, ModelInfo, ThinkingEffort, Usage } from "./types";
import { DEFAULT_THINKING_EFFORTS } from "./types";
import { ApiChatStorage, type ChatStorage } from "./storage";
import { streamChatCompletion, type RequestMessage } from "./api";
import { setAgentDisabled } from "../lib/agentDisabled";
import { estimateUsageCost } from "./usage";
import { fetchChatModels } from "./modelsApi";

export const CHAT_STORE_KEY = Symbol("chat.store");

export interface ChatStreamParams {
  model: ModelInfo;
  messages: RequestMessage[];
  signal: AbortSignal;
  thinking?: boolean;
  thinkingEffort?: ThinkingEffort | null;
  onToken: (token: string) => void;
  onReasoning: (token: string) => void;
  onUsage: (usage: Usage) => void;
}

export type ChatStreamResult =
  | { status: "done" }
  | { status: "aborted" }
  | {
      status: "error";
      error: string;
      /** SPEC-004 §2: proxy refused the request — grain killed mid-chat. */
      agentDisabledPayload?: unknown;
    };

type ChatStreamFn = (params: ChatStreamParams) => Promise<ChatStreamResult>;

export interface CreateChatStoreOptions {
  storage?: ChatStorage;
  /**
   * Static model list seed. When set, it is used as-is and the agent is not
   * queried (tests). Omit to load the list from the agent on init().
   */
  modelList?: ModelInfo[];
  /** Loads the model list from the agent. Defaults to fetchChatModels(). */
  modelsLoader?: () => Promise<ModelInfo[]>;
  streamFn?: ChatStreamFn;
  now?: () => number;
  uid?: () => string;
  defaultTitle?: string;
  persistIntervalMs?: number;
}

export interface ChatStore {
  readonly models: ModelInfo[];
  /** Set when the model list cannot be loaded from the agent (or is empty). */
  readonly modelsError: string | null;
  readonly metaList: ChatMeta[];
  readonly filteredMetaList: ChatMeta[];
  readonly activeId: string | null;
  readonly activeChat: Chat | null;
  readonly activeChatMessages: Message[];
  readonly activeModelSlug: string;
  readonly search: string;
  readonly streaming: boolean;
  readonly streamingChatId: string | null;
  readonly storageWarning: string | null;
  readonly hasChats: boolean;
  readonly isStreamingActiveChat: boolean;
  readonly activeModel: ModelInfo | null;
  readonly activeThinking: boolean;
  readonly activeThinkingEffort: ThinkingEffort | null;

  init(): Promise<void>;
  /** Re-fetch the chat model list from the agent (used by the retry banner). */
  refreshModels(): Promise<void>;
  newChat(): string;
  switchChat(id: string): Promise<void>;
  deleteChat(id: string): void;
  renameChat(id: string, title: string): void;
  setModel(slug: string): void;
  setThinking(on: boolean): void;
  setThinkingEffort(effort: ThinkingEffort | null): void;
  setSearch(query: string): void;
  send(text: string): Promise<void>;
  stop(): void;
  clearStorageWarning(): void;
  dispose(): void;
}

const defaultUid = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

function deriveTitle(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "New chat";
  return clean.length > 42 ? `${clean.slice(0, 42).trim()}…` : clean;
}

const metaOf = (chat: Chat): ChatMeta => ({
  id: chat.id,
  title: chat.title,
  createdAt: chat.createdAt,
  updatedAt: chat.updatedAt,
  modelSlug: chat.modelSlug,
});

export function createChatStore(options: CreateChatStoreOptions = {}): ChatStore {
  const storage = options.storage ?? new ApiChatStorage();
  // The model list comes from the agent (GET /v1/models/chat) unless a static
  // one is injected — then the loader simply resolves the injected list.
  const modelsLoader =
    options.modelsLoader ??
    (() => {
      const list = options.modelList;
      return list ? Promise.resolve(list) : fetchChatModels();
    });
  const streamFn: ChatStreamFn = options.streamFn ?? ((p) => streamChatCompletion(p));
  const now = options.now ?? (() => Date.now());
  // ISO 8601 (RFC3339) counterpart of `now`, derived from the same injectable
  // clock so tests that inject `now` also control ISO output.
  const nowIso = () => new Date(now()).toISOString();
  const uid = options.uid ?? defaultUid;
  const defaultTitle = options.defaultTitle ?? "New chat";
  const persistIntervalMs = options.persistIntervalMs ?? 500;

  const state = reactive({
    chatsMeta: [] as ChatMeta[],
    chats: {} as Record<string, Chat>,
    // Seeded with the injected list (tests); otherwise empty until init()
    // fetches from the agent.
    models: options.modelList ?? ([] as ModelInfo[]),
    modelsError: null as string | null,
    activeId: null as string | null,
    search: "",
    streaming: false,
    streamingChatId: null as string | null,
    storageWarning: null as string | null,
  });

  let activeAbort: AbortController | null = null;
  let persistTimer: ReturnType<typeof setTimeout> | null = null;

  const resolveModel = (slug: string): ModelInfo | undefined =>
    state.models.find((m) => m.modelSlug === slug) ?? state.models[0];

  // --- persistence ---
  function clearPersistTimer(): void {
    if (persistTimer) {
      clearTimeout(persistTimer);
      persistTimer = null;
    }
  }

  function syncMetaFor(chat: Chat): void {
    const idx = state.chatsMeta.findIndex((m) => m.id === chat.id);
    const meta = metaOf(chat);
    if (idx === -1) state.chatsMeta = [meta, ...state.chatsMeta];
    else state.chatsMeta[idx] = meta;
  }

  async function writeChat(chat: Chat): Promise<void> {
    const res = await storage.saveChat(chat);
    if (!res.ok) state.storageWarning = res.message || "Could not save chat";
    syncMetaFor(chat);
    const idxRes = await storage.saveIndex(state.chatsMeta);
    if (!idxRes.ok) state.storageWarning = idxRes.message || "Could not save chat list";
  }

  function schedulePersist(chatId: string): void {
    if (persistTimer) return;
    persistTimer = setTimeout(async () => {
      persistTimer = null;
      const chat = state.chats[chatId];
      if (chat) await writeChat(chat);
    }, persistIntervalMs);
  }

  function ensureActiveChat(): void {
    if (state.activeId && state.chats[state.activeId]) return;
    const first = state.chatsMeta[0];
    if (first) {
      state.activeId = first.id;
    } else {
      newChat();
    }
  }

  // --- actions ---

  /** Fetch the chat model list from the agent and store it (with error state). */
  async function loadModels(): Promise<void> {
    try {
      const models = await modelsLoader();
      state.models = models;
      state.modelsError = models.length === 0 ? "The agent reported no chat models" : null;
    } catch (err) {
      state.models = [];
      state.modelsError = err instanceof Error ? err.message : String(err);
    }
  }

  async function init(): Promise<void> {
    // Load the model list in parallel with the chat index — both come from the
    // agent and the active-chat default below only needs the models.
    const modelsPromise = loadModels();

    state.chatsMeta = await storage.loadIndex();
    state.chatsMeta = [...state.chatsMeta].sort((a, b) =>
      b.updatedAt < a.updatedAt ? -1 : b.updatedAt > a.updatedAt ? 1 : 0,
    );

    // Hydrate all chats from the API in the background
    await Promise.allSettled(
      state.chatsMeta.map((m) => storage.loadChat(m.id).then((chat) => {
        if (chat) state.chats[chat.id] = chat;
      })),
    );

    await modelsPromise;
    ensureActiveChat();
    // A chat may reference a model that is no longer offered (agent restarted,
    // model disabled) — point it at the first available model so the selector
    // and the next request agree.
    const active = state.activeId ? state.chats[state.activeId] : undefined;
    if (active && state.models.length > 0 && !state.models.some((m) => m.modelSlug === active.modelSlug)) {
      active.modelSlug = state.models[0]!.modelSlug;
    }
  }

  function newChat(): string {
    clearPersistTimer();
    if (state.streaming) activeAbort?.abort();
    const ts = nowIso();
    const chat: Chat = {
      id: uid(),
      title: defaultTitle,
      createdAt: ts,
      updatedAt: ts,
      modelSlug: state.models[0]?.modelSlug ?? "",
      messages: [],
    };
    state.chats[chat.id] = chat;
    state.chatsMeta = [metaOf(chat), ...state.chatsMeta];
    state.activeId = chat.id;
    writeChat(chat);
    return chat.id;
  }

  async function switchChat(id: string): Promise<void> {
    clearPersistTimer();
    if (state.streaming && state.streamingChatId !== id) {
      // Abort any in-flight stream for the other chat before hydrating (avoids cross-talk).
      activeAbort?.abort();
    }
    
    // Load chat from API if not already hydrated
    if (!state.chats[id]) {
      const loaded = await storage.loadChat(id);
      if (loaded) state.chats[id] = loaded;
    }

    state.activeId = id;
    // Same normalization as init(): a stale model slug would leave the selector blank.
    const chat = state.chats[id];
    if (chat && state.models.length > 0 && !state.models.some((m) => m.modelSlug === chat.modelSlug)) {
      chat.modelSlug = state.models[0]!.modelSlug;
    }
  }

  function deleteChat(id: string): void {
    clearPersistTimer();
    if (state.streamingChatId === id) activeAbort?.abort();
    storage.deleteChat(id);
    state.chatsMeta = state.chatsMeta.filter((m) => m.id !== id);
    delete state.chats[id];
    storage.saveIndex(state.chatsMeta);
    if (state.activeId === id) {
      const next = state.chatsMeta[0];
      if (next) {
        state.activeId = next.id;
      } else {
        state.activeId = null;
        newChat();
      }
    }
  }

  function renameChat(id: string, title: string): void {
    const chat = state.chats[id];
    if (!chat) return;
    const clean = title.trim();
    if (!clean) return;
    chat.title = clean;
    chat.updatedAt = nowIso();
    // Reflect the title in the rail immediately; writeChat persists (and re-syncs).
    syncMetaFor(chat);
    writeChat(chat);
  }

  function setModel(slug: string): void {
    const chat = state.chats[state.activeId as string];
    if (!chat) return;
    chat.modelSlug = slug;
    chat.updatedAt = nowIso();
    writeChat(chat);
  }

  function setThinking(on: boolean): void {
    const chat = state.activeId ? state.chats[state.activeId] : undefined;
    if (!chat || !activeModel.value?.hasReasoning) return;
    chat.thinking = on;
    chat.updatedAt = nowIso();
    writeChat(chat);
  }

  function setThinkingEffort(effort: ThinkingEffort | null): void {
    const chat = state.activeId ? state.chats[state.activeId] : undefined;
    if (!chat || !activeModel.value?.hasThinkingEffort) return;
    chat.thinkingEffort = effort ?? undefined;
    chat.updatedAt = nowIso();
    writeChat(chat);
  }

  function setSearch(query: string): void {
    state.search = query;
  }

  async function send(text: string): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed || state.streaming) return;
    const chat = state.chats[state.activeId as string];
    if (!chat) return;

    const model = resolveModel(chat.modelSlug);
    if (!model) {
      const err: Message = {
        id: uid(),
        role: "assistant",
        content: "",
        createdAt: nowIso(),
        status: "error",
        error:
          state.modelsError ??
          "No chat models available. The model list is served by the local agent — check it is running and retry.",
      };
      chat.messages.push(err);
      return;
    }

    const ts = nowIso();
    const userMsg: Message = { id: uid(), role: "user", content: trimmed, createdAt: ts };
    chat.messages.push(userMsg);
    chat.updatedAt = ts;
    if (!chat.title || chat.title === defaultTitle) chat.title = deriveTitle(trimmed);

    const id = uid();
    chat.messages.push({
      id,
      role: "assistant",
      content: "",
      createdAt: ts,
      modelSlug: model.modelSlug,
      status: "streaming",
    });
    // Read back through the reactive array so all mutations below trigger re-renders.
    const liveAssistant = chat.messages[chat.messages.length - 1];

    const history: RequestMessage[] = chat.messages
      .filter((m) => m.id !== id && m.content.trim().length > 0)
      .map((m) => ({ role: m.role, content: m.content }));

    state.streaming = true;
    state.streamingChatId = chat.id;
    const controller = new AbortController();
    activeAbort = controller;
    schedulePersist(chat.id);

    try {
      const result = await streamFn({
        model,
        messages: history,
        signal: controller.signal,
        thinking: activeThinking.value,
        thinkingEffort: activeThinkingEffort.value,
        onToken: (token) => {
          liveAssistant.content += token;
          // The first answer token closes the thinking stage: from here on the label
          // reads as a finished "Thought for <duration>" instead of the live shimmer.
          if (liveAssistant.thinkingStartedAt != null && liveAssistant.thinkingEndedAt == null) {
            liveAssistant.thinkingEndedAt = now();
          }
        },
        onReasoning: (token) => {
          // The first reasoning token opens the thinking stage (starts the clock).
          if (liveAssistant.thinkingStartedAt == null) liveAssistant.thinkingStartedAt = now();
          liveAssistant.reasoning = (liveAssistant.reasoning ?? "") + token;
        },
        onUsage: (usage) => {
          // Fall back to the model's per-million rates when the API didn't report a cost.
          if (usage.cost == null && (model.inputCostPerMToken != null || model.outputCostPerMToken != null)) {
            usage = { ...usage, cost: estimateUsageCost(usage, model) };
          }
          liveAssistant.usage = usage;
          liveAssistant.modelSlug = model.modelSlug;
        },
      });

      if (result.status === "error") {
        liveAssistant.status = "error";
        liveAssistant.error = result.error;
        // SPEC-004 §2: the agent refused inference because the grain was
        // killed — switch to the Disabled screen instead of just an error.
        if (result.agentDisabledPayload !== undefined) {
          setAgentDisabled(result.agentDisabledPayload);
        }
      } else {
        // done OR aborted -> finalize the partial text as a completed turn
        liveAssistant.status = liveAssistant.content ? "done" : "error";
        if (!liveAssistant.content) liveAssistant.error = "No response received";
      }
    } finally {
      activeAbort = null;
      state.streaming = false;
      state.streamingChatId = null;
      clearPersistTimer();
      // If the stage opened but no answer token ever closed it (aborted/errored mid-think),
      // close it now so the label settles on "Thought for <duration>" instead of shimmering.
      if (liveAssistant.thinkingStartedAt != null && liveAssistant.thinkingEndedAt == null) {
        liveAssistant.thinkingEndedAt = now();
      }
      chat.updatedAt = nowIso();
      writeChat(chat);
    }
  }

  function stop(): void {
    if (activeAbort) activeAbort.abort();
  }

  function clearStorageWarning(): void {
    state.storageWarning = null;
  }

  function dispose(): void {
    clearPersistTimer();
    activeAbort?.abort();
    activeAbort = null;
  }

  // --- derived state ---
  const metaList = computed(() => state.chatsMeta);
  const filteredMetaList = computed(() => {
    const q = state.search.trim().toLowerCase();
    if (!q) return state.chatsMeta;
    return state.chatsMeta.filter((m) => m.title.toLowerCase().includes(q));
  });
  const activeChat = computed(() =>
    state.activeId ? state.chats[state.activeId] ?? null : null,
  );
  const activeChatMessages = computed(() => activeChat.value?.messages ?? []);
  const activeModelSlug = computed(
    () => activeChat.value?.modelSlug ?? state.models[0]?.modelSlug ?? "",
  );
  const hasChats = computed(() => state.chatsMeta.length > 0);
  const isStreamingActiveChat = computed(
    () => state.streaming && state.streamingChatId === state.activeId,
  );
  const activeModel = computed((): ModelInfo | null => {
    const chat = state.activeId ? state.chats[state.activeId] : undefined;
    if (!chat) return null;
    return state.models.find((m) => m.modelSlug === chat.modelSlug) ?? null;
  });
  /** Effective thinking flag: defaults ON for reasoning models; OFF otherwise. */
  const activeThinking = computed((): boolean => {
    const m = activeModel.value;
    if (!m?.hasReasoning) return false;
    return state.activeId ? state.chats[state.activeId]?.thinking ?? true : false;
  });
  /** Effective thinking effort: the model's first level unless a valid stored choice exists. */
  const activeThinkingEffort = computed((): ThinkingEffort | null => {
    const m = activeModel.value;
    if (!m?.hasThinkingEffort) return null;
    const efforts: ThinkingEffort[] = m.thinkingEfforts ?? [...DEFAULT_THINKING_EFFORTS];
    const stored = state.activeId ? state.chats[state.activeId]?.thinkingEffort : undefined;
    return stored && efforts.includes(stored) ? stored : efforts[0] ?? null;
  });

  // Wrap in `reactive` so the ComputedRef fields auto-unwrap to plain values in templates.
  return reactive({
    models: computed(() => state.models),
    modelsError: computed(() => state.modelsError),
    metaList,
    filteredMetaList,
    activeId: computed(() => state.activeId),
    activeChat,
    activeChatMessages,
    activeModelSlug,
    activeModel,
    activeThinking,
    activeThinkingEffort,
    search: computed(() => state.search),
    streaming: computed(() => state.streaming),
    streamingChatId: computed(() => state.streamingChatId),
    storageWarning: computed(() => state.storageWarning),
    hasChats,
    isStreamingActiveChat,
    init,
    refreshModels: loadModels,
    newChat,
    switchChat,
    deleteChat,
    renameChat,
    setModel,
    setThinking,
    setThinkingEffort,
    setSearch,
    send,
    stop,
    clearStorageWarning,
    dispose,
  }) as ChatStore;
}

/** Default singleton used by the app when no store is injected (demo page). */
export const defaultChatStore: ChatStore = createChatStore();

/** Injected store; falls back to the singleton. Call inside `<script setup>`. */
export function useChatStore(): ChatStore {
  const injected = inject<ChatStore | null>(CHAT_STORE_KEY, null);
  return injected ?? defaultChatStore;
}
