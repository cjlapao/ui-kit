import { describe, it, expect } from "vitest";
import {
  createChatStore,
  type ChatStreamParams,
  type ChatStreamResult,
} from "./store";
import { LocalStorageChatStorage, MemoryStorage } from "./storage";
import type { ModelInfo, ThinkingEffort } from "./types";

const models: ModelInfo[] = [
  { name: "A", modelSlug: "a", endpoint: "http://a", apiKey: "k" },
  { name: "B", modelSlug: "b", endpoint: "http://b", apiKey: "k" },
];

const defaultStream: (p: ChatStreamParams) => Promise<ChatStreamResult> = async (p) => {
  p.onToken("Hi ");
  p.onToken("there");
  p.onUsage({ prompt_tokens: 5, completion_tokens: 2, total_tokens: 7, cost: 0.01 });
  return { status: "done" };
};

function makeStore(
  stream: (p: ChatStreamParams) => Promise<ChatStreamResult> = defaultStream,
): ReturnType<typeof createChatStore> {
  return createChatStore({
    storage: new LocalStorageChatStorage(new MemoryStorage()),
    modelList: models,
    streamFn: stream,
    persistIntervalMs: 1000,
  });
}

describe("createChatStore", () => {
  it("init creates a single active chat when storage is empty", async () => {
    const store = makeStore();
    await store.init();
    expect(store.hasChats).toBe(true);
    expect(store.metaList.length).toBe(1);
    expect(store.activeId).toBe(store.metaList[0].id);
    expect(store.activeChat?.modelSlug).toBe("a");
  });

  it("send appends a user + assistant turn, accumulates text, and stores usage", async () => {
    const store = makeStore();
    await store.init();
    await store.send("hello world");

    const chat = store.activeChat!;
    expect(chat.messages.length).toBe(2);
    expect(chat.messages[0].role).toBe("user");
    expect(chat.messages[0].content).toBe("hello world");
    const assistant = chat.messages[1];
    expect(assistant.role).toBe("assistant");
    expect(assistant.content).toBe("Hi there");
    expect(assistant.status).toBe("done");
    expect(assistant.usage?.prompt_tokens).toBe(5);
    expect(assistant.usage?.cost).toBe(0.01);
    // title auto-derived from the first user message
    expect(chat.title).toBe("hello world");
  });

  it("captures reasoning_content into the assistant message", async () => {
    const stream: (p: ChatStreamParams) => Promise<ChatStreamResult> = async (p) => {
      p.onReasoning("thinking… ");
      p.onReasoning("done");
      p.onToken("answer");
      p.onUsage({ total_tokens: 1 });
      return { status: "done" };
    };
    const store = makeStore(stream);
    await store.init();
    await store.send("hi");
    const msgs = store.activeChat!.messages;
    const assistant = msgs[msgs.length - 1]!;
    expect(assistant.reasoning).toBe("thinking… done");
    expect(assistant.content).toBe("answer");
  });

  it("switching model changes the next request's model", async () => {
    const seen: string[] = [];
    const stream: (p: ChatStreamParams) => Promise<ChatStreamResult> = async (p) => {
      seen.push(p.model.modelSlug);
      p.onToken("ok");
      p.onUsage({ total_tokens: 1 });
      return { status: "done" };
    };
    const store = makeStore(stream);
    await store.init();

    await store.send("first");
    expect(seen).toEqual(["a"]);
    expect(store.activeModelSlug).toBe("a");

    store.setModel("b");
    await store.send("second");
    expect(seen).toEqual(["a", "b"]);
    expect(store.activeModelSlug).toBe("b");
  });

  it("sends the full history to the endpoint on the second turn", async () => {
    const histories: { role: string; content: string }[][] = [];
    const stream: (p: ChatStreamParams) => Promise<ChatStreamResult> = async (p) => {
      histories.push(p.messages.map((m) => ({ role: m.role, content: m.content })));
      p.onToken("r");
      p.onUsage({ total_tokens: 1 });
      return { status: "done" };
    };
    const store = makeStore(stream);
    await store.init();
    await store.send("q1");
    await store.send("q2");
    // second request includes both turns (user + assistant + new user)
    expect(histories[1]).toEqual([
      { role: "user", content: "q1" },
      { role: "assistant", content: "r" },
      { role: "user", content: "q2" },
    ]);
  });

  it("stop() aborts an in-flight stream and finalizes partial text as done", async () => {
    const stream: (p: ChatStreamParams) => Promise<ChatStreamResult> = (p) =>
      new Promise<ChatStreamResult>((resolve) => {
        p.onToken("partial");
        p.signal.addEventListener("abort", () => resolve({ status: "aborted" }));
      });
    const store = makeStore(stream);
    await store.init();
    const pending = store.send("hi");
    expect(store.streaming).toBe(true);
    store.stop();
    await pending;
    const msgs = store.activeChat!.messages;
    const last = msgs[msgs.length - 1]!;
    expect(last.content).toBe("partial");
    expect(last.status).toBe("done");
    expect(store.streaming).toBe(false);
  });

  it("rename and delete update the rail and active selection", async () => {
    const store = makeStore();
    await store.init();
    const first = store.metaList[0].id;
    const secondId = store.newChat();
    expect(store.metaList.length).toBe(2);

    store.renameChat(first, "Renamed One");
    expect(store.metaList.find((m) => m.id === first)?.title).toBe("Renamed One");

    // rename then delete the (active) second chat; active falls back to the first
    expect(store.activeId).toBe(secondId);
    store.deleteChat(secondId);
    expect(store.metaList.length).toBe(1);
    expect(store.activeId).toBe(first);
    expect(store.activeChat?.messages).toEqual([]);
  });
});

const thinkingModels: ModelInfo[] = [
  {
    name: "T",
    modelSlug: "t",
    endpoint: "http://t",
    apiKey: "k",
    maxContext: 100,
    inputCostPerMToken: 2,
    outputCostPerMToken: 4,
    hasReasoning: true,
    hasThinkingEffort: true,
    thinkingEfforts: ["low", "high", "xhigh"],
    params: { temperature: 0.5 },
  },
];

function makeThinkingStore(
  stream?: (p: ChatStreamParams) => Promise<ChatStreamResult>,
): ReturnType<typeof createChatStore> {
  return createChatStore({
    storage: new LocalStorageChatStorage(new MemoryStorage()),
    modelList: thinkingModels,
    streamFn:
      stream ??
      (async (p) => {
        p.onToken("ok");
        p.onUsage({ total_tokens: 1 });
        return { status: "done" };
      }),
    persistIntervalMs: 1000,
  });
}

describe("thinking / effort / cost fallback", () => {
  it("sends thinking ON by default and the first effort level for a reasoning model", async () => {
    const seen: { thinking?: boolean; effort?: ThinkingEffort | null }[] = [];
    const store = makeThinkingStore(async (p) => {
      seen.push({ thinking: p.thinking, effort: p.thinkingEffort });
      p.onToken("ok");
      p.onUsage({ total_tokens: 1 });
      return { status: "done" };
    });
    await store.init();
    await store.send("q");
    expect(seen[0]).toEqual({ thinking: true, effort: "low" });
  });

  it("reflects setThinking(false) on the next request", async () => {
    const seen: boolean[] = [];
    const store = makeThinkingStore(async (p) => {
      seen.push(!!p.thinking);
      p.onToken("ok");
      p.onUsage({ total_tokens: 1 });
      return { status: "done" };
    });
    await store.init();
    store.setThinking(false);
    expect(store.activeThinking).toBe(false);
    await store.send("q");
    expect(seen).toEqual([false]);
  });

  it("reflects a selected thinking effort on the next request", async () => {
    const seen: (ThinkingEffort | null | undefined)[] = [];
    const store = makeThinkingStore(async (p) => {
      seen.push(p.thinkingEffort);
      p.onToken("ok");
      p.onUsage({ total_tokens: 1 });
      return { status: "done" };
    });
    await store.init();
    store.setThinkingEffort("xhigh");
    expect(store.activeThinkingEffort).toBe("xhigh");
    await store.send("q");
    expect(seen).toEqual(["xhigh"]);
  });

  it("gates thinking/effort off for a model without the capability", async () => {
    const plain: ModelInfo = { name: "P", modelSlug: "p", endpoint: "http://p", apiKey: "k" };
    const seen: { thinking?: boolean; effort?: ThinkingEffort | null }[] = [];
    const store = createChatStore({
      storage: new LocalStorageChatStorage(new MemoryStorage()),
      modelList: [plain],
      streamFn: async (p) => {
        seen.push({ thinking: p.thinking, effort: p.thinkingEffort });
        p.onToken("ok");
        p.onUsage({ total_tokens: 1 });
        return { status: "done" };
      },
      persistIntervalMs: 1000,
    });
    await store.init();
    expect(store.activeThinking).toBe(false);
    expect(store.activeThinkingEffort).toBeNull();
    store.setThinking(true); // no-op: model has no reasoning
    expect(store.activeThinking).toBe(false);
    await store.send("q");
    expect(seen[0].thinking).toBe(false);
    expect(seen[0].effort).toBeNull();
  });

  it("falls back to per-million rates when the API returns no cost", async () => {
    const store = makeThinkingStore(async (p) => {
      p.onToken("ok");
      p.onUsage({ prompt_tokens: 1000, completion_tokens: 500, total_tokens: 1500 });
      return { status: "done" };
    });
    await store.init();
    await store.send("q");
    const msgs = store.activeChat!.messages;
    const assistant = msgs[msgs.length - 1]!;
    // (1000 * $2 + 500 * $4) / 1e6 = 0.002 + 0.002
    expect(assistant.usage?.cost).toBeCloseTo(0.004, 6);
  });

  it("uses the API-reported cost over the estimate when present", async () => {
    const store = makeThinkingStore(async (p) => {
      p.onToken("ok");
      p.onUsage({ prompt_tokens: 1000, completion_tokens: 500, total_tokens: 1500, cost: 0.123 });
      return { status: "done" };
    });
    await store.init();
    await store.send("q");
    const msgs = store.activeChat!.messages;
    expect(msgs[msgs.length - 1]!.usage?.cost).toBe(0.123);
  });
});

describe("model list from the agent", () => {
  function makeAgentStore(opts: {
    loader?: () => Promise<ModelInfo[]>;
    stream?: (p: ChatStreamParams) => Promise<ChatStreamResult>;
  } = {}): {
    store: ReturnType<typeof createChatStore>;
    storage: LocalStorageChatStorage;
  } {
    const storage = new LocalStorageChatStorage(new MemoryStorage());
    const store = createChatStore({
      storage,
      modelsLoader: opts.loader ?? (async () => models),
      streamFn: opts.stream ?? defaultStream,
      persistIntervalMs: 1000,
    });
    return { store, storage };
  }

  it("init loads the model list from the loader and uses the first model for new chats", async () => {
    let calls = 0;
    const { store } = makeAgentStore({
      loader: async () => {
        calls += 1;
        return models;
      },
    });
    await store.init();
    expect(calls).toBe(1);
    expect(store.models.map((m) => m.modelSlug)).toEqual(["a", "b"]);
    expect(store.modelsError).toBeNull();
    expect(store.activeChat?.modelSlug).toBe("a");
  });

  it("exposes modelsError when the loader fails and send() reports it in an error bubble", async () => {
    const { store } = makeAgentStore({
      loader: () => Promise.reject(new Error("agent socket unavailable")),
    });
    await store.init();
    expect(store.models).toEqual([]);
    expect(store.modelsError).toBe("agent socket unavailable");

    await store.send("hi");
    const msgs = store.activeChat!.messages;
    const last = msgs[msgs.length - 1]!;
    expect(last.status).toBe("error");
    expect(last.error).toContain("agent socket unavailable");
  });

  it("exposes modelsError when the agent reports an empty model list", async () => {
    const { store } = makeAgentStore({ loader: async () => [] });
    await store.init();
    expect(store.modelsError).toBe("The agent reported no chat models");

    await store.send("hi");
    const last = store.activeChat!.messages[store.activeChat!.messages.length - 1]!;
    expect(last.status).toBe("error");
    expect(last.error).toContain("no chat models");
  });

  it("refreshModels() re-fetches the list and clears the error on success", async () => {
    let list: ModelInfo[] = [];
    const { store } = makeAgentStore({ loader: async () => list });
    await store.init();
    expect(store.modelsError).toBe("The agent reported no chat models");

    list = models;
    await store.refreshModels();
    expect(store.models.map((m) => m.modelSlug)).toEqual(["a", "b"]);
    expect(store.modelsError).toBeNull();
  });

  it("points a chat with a retired model slug at the first available model", async () => {
    const { store, storage } = makeAgentStore();
    const ts = new Date().toISOString();
    const meta = {
      id: "c1",
      title: "Old chat",
      createdAt: ts,
      updatedAt: ts,
      modelSlug: "retired-model",
    };
    await storage.saveIndex([meta]);
    await storage.saveChat({ ...meta, messages: [] });

    await store.init();
    expect(store.activeId).toBe("c1");
    expect(store.activeChat?.modelSlug).toBe("a");
  });

  it("normalizes a retired slug when switching to an older chat", async () => {
    const { store, storage } = makeAgentStore();
    const ts = new Date().toISOString();
    const oldMeta = {
      id: "old",
      title: "Old chat",
      createdAt: ts,
      updatedAt: ts,
      modelSlug: "retired-model",
    };
    const newMeta = {
      id: "new",
      title: "New chat",
      createdAt: ts,
      updatedAt: ts,
      modelSlug: "a",
    };
    await storage.saveIndex([newMeta, oldMeta]);
    await storage.saveChat({ ...newMeta, messages: [] });
    await storage.saveChat({ ...oldMeta, messages: [] });

    await store.init();
    await store.switchChat("old");
    expect(store.activeChat?.modelSlug).toBe("a");
  });
});

describe("thinking-stage timing", () => {
  function timedStore(
    stream: (p: ChatStreamParams) => Promise<ChatStreamResult>,
  ): ReturnType<typeof createChatStore> {
    let t = 1_000_000;
    // +1s per call so the relative order of reasoning start vs. answer start is observable.
    const tick = () => (t += 1000);
    return createChatStore({
      storage: new LocalStorageChatStorage(new MemoryStorage()),
      modelList: models,
      streamFn: stream,
      persistIntervalMs: 1000,
      now: tick,
    });
  }

  const lastAssistant = (store: ReturnType<typeof createChatStore>) => {
    const msgs = store.activeChat!.messages;
    return msgs[msgs.length - 1]!;
  };

  it("opens on the first reasoning token and closes on the first answer token", async () => {
    const store = timedStore(async (p) => {
      p.onReasoning("a");
      p.onReasoning("b");
      p.onToken("answer");
      p.onUsage({ total_tokens: 1 });
      return { status: "done" };
    });
    await store.init();
    await store.send("hi");

    const assistant = lastAssistant(store);
    expect(assistant.reasoning).toBe("ab");
    expect(assistant.thinkingStartedAt).toBeDefined();
    expect(assistant.thinkingEndedAt).toBeDefined();
    expect(assistant.thinkingEndedAt!).toBeGreaterThan(assistant.thinkingStartedAt!);
    // One clock tick separates the first reasoning token from the first answer token.
    expect(assistant.thinkingEndedAt! - assistant.thinkingStartedAt!).toBe(1000);
  });

  it("closes the stage at stream end when reasoning never produced an answer", async () => {
    const store = timedStore((p) =>
      new Promise<ChatStreamResult>((resolve) => {
        p.onReasoning("still thinking");
        p.signal.addEventListener("abort", () => resolve({ status: "aborted" }));
      }),
    );
    await store.init();
    const pending = store.send("hi");
    expect(store.streaming).toBe(true);
    store.stop();
    await pending;

    const assistant = lastAssistant(store);
    expect(assistant.reasoning).toContain("still thinking");
    expect(assistant.thinkingStartedAt).toBeDefined();
    expect(assistant.thinkingEndedAt).toBeDefined();
    expect(assistant.thinkingEndedAt!).toBeGreaterThanOrEqual(assistant.thinkingStartedAt!);
  });

  it("sets no thinking timestamps when the model streams no reasoning", async () => {
    const store = timedStore(async (p) => {
      p.onToken("answer");
      p.onUsage({ total_tokens: 1 });
      return { status: "done" };
    });
    await store.init();
    await store.send("hi");

    const assistant = lastAssistant(store);
    expect(assistant.reasoning).toBeUndefined();
    expect(assistant.thinkingStartedAt).toBeUndefined();
    expect(assistant.thinkingEndedAt).toBeUndefined();
  });
});

describe("SPEC-004: agent disabled while chatting", () => {
  const lastAssistant = (store: ReturnType<typeof createChatStore>) => {
    const msgs = store.activeChat!.messages;
    return msgs[msgs.length - 1]!;
  };

  it("switches to the disabled state when the proxy refuses with 403 agent_disabled", async () => {
    const { agentDisabled, clearAgentDisabled } = await import("../lib/agentDisabled");
    clearAgentDisabled();

    const disabledStream: (p: ChatStreamParams) => Promise<ChatStreamResult> = async () => ({
      status: "error",
      error: "Request failed (403 Forbidden)",
      agentDisabledPayload: {
        error: "agent_disabled",
        message: { title: "This agent has been disabled", body: "Body text" },
        effective_at: "2026-08-25T11:59:00Z",
      },
    });
    const store = makeStore(disabledStream);
    await store.init();
    await store.send("hi");

    const assistant = lastAssistant(store);
    expect(assistant.status).toBe("error");
    expect(agentDisabled.value).not.toBeNull();
    expect(agentDisabled.value?.title).toBe("This agent has been disabled");
    expect(agentDisabled.value?.body).toBe("Body text");
    expect(agentDisabled.value?.effectiveAt).toBe("2026-08-25T11:59:00Z");
    clearAgentDisabled();
  });

  it("leaves the disabled state untouched for ordinary stream errors", async () => {
    const { agentDisabled, clearAgentDisabled } = await import("../lib/agentDisabled");
    clearAgentDisabled();

    const store = makeStore(async () => ({
      status: "error",
      error: "Request failed (500 Internal Server Error)",
    }));
    await store.init();
    await store.send("hi");

    expect(lastAssistant(store).status).toBe("error");
    expect(agentDisabled.value).toBeNull();
  });
});
