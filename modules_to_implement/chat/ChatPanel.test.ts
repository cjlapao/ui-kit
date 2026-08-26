import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/vue";
import { describe, it, expect, afterEach } from "vitest";
import ChatPanel from "./components/ChatPanel.vue";
import {
  CHAT_STORE_KEY,
  createChatStore,
  type ChatStreamParams,
  type ChatStreamResult,
} from "./store";
import { LocalStorageChatStorage, MemoryStorage } from "./storage";
import { agentDisabled, clearAgentDisabled, setAgentDisabled } from "../lib/agentDisabled";
import type { ModelInfo } from "./types";

const models: ModelInfo[] = [
  { name: "Model A", modelSlug: "alpha", endpoint: "http://a", apiKey: "k" },
  { name: "Model B", modelSlug: "beta", endpoint: "http://b", apiKey: "k" },
];

function makeTestStore(
  stream: (p: ChatStreamParams) => Promise<ChatStreamResult>,
): ReturnType<typeof createChatStore> {
  return createChatStore({
    storage: new LocalStorageChatStorage(new MemoryStorage()),
    modelList: models,
    streamFn: stream,
    persistIntervalMs: 1000,
  });
}

afterEach(cleanup);

describe("ChatPanel integration", () => {
  it("renders the model list and streams an assistant reply, hiding usage", async () => {
    const calls: { modelSlug: string; history: { role: string; content: string }[] }[] = [];
    const stream: (p: ChatStreamParams) => Promise<ChatStreamResult> = async (p) => {
      calls.push({
        modelSlug: p.model.modelSlug,
        history: p.messages.map((m) => ({ role: m.role, content: m.content })),
      });
      p.onToken("He");
      p.onToken("llo");
      p.onUsage({ prompt_tokens: 98712, completion_tokens: 45, total_tokens: 98757 });
      return { status: "done" };
    };
    const store = makeTestStore(stream);
    render(ChatPanel, { global: { provide: { [CHAT_STORE_KEY]: store } } });

    expect(screen.getByText("Model A")).toBeInTheDocument();
    expect(screen.getByText("Model B")).toBeInTheDocument();

    // store.init() runs in onMounted — wait until the active chat exists before sending.
    await waitFor(() => expect(store.activeChat).toBeTruthy());

    const input = screen.getByTestId("composer-input") as HTMLTextAreaElement;
    fireEvent.input(input, { target: { value: "hi there" } });
    fireEvent.click(screen.getByTestId("composer-send"));

    await waitFor(
      () => expect(screen.getAllByText("hi there").length).toBeGreaterThanOrEqual(3),
    );
    await waitFor(() => expect(screen.getByText("Hello")).toBeInTheDocument());
    await waitFor(() => expect(store.streaming).toBe(false));

    expect(calls.length).toBe(1);
    expect(calls[0].modelSlug).toBe("alpha");
    const msgs = store.activeChat!.messages;
    const assistant = msgs[msgs.length - 1]!;
    expect(assistant.role).toBe("assistant");
    expect(assistant.content).toBe("Hello");
    expect(assistant.usage?.prompt_tokens).toBe(98712); // stored
    // usage metadata is stored but never rendered in the bubble
    expect(document.body.textContent).not.toContain("98712");
    expect(document.body.textContent).not.toContain("98757");
  });

  it("switching the model changes the next request's model field", async () => {
    const seen: string[] = [];
    const stream: (p: ChatStreamParams) => Promise<ChatStreamResult> = async (p) => {
      seen.push(p.model.modelSlug);
      p.onToken("ok");
      p.onUsage({ total_tokens: 1 });
      return { status: "done" };
    };
    const store = makeTestStore(stream);
    render(ChatPanel, { global: { provide: { [CHAT_STORE_KEY]: store } } });
    await waitFor(() => expect(store.activeChat).toBeTruthy());

    const input = screen.getByTestId("composer-input") as HTMLTextAreaElement;
    fireEvent.input(input, { target: { value: "first" } });
    fireEvent.click(screen.getByTestId("composer-send"));
    await waitFor(() => expect(store.streaming).toBe(false));
    expect(seen).toEqual(["alpha"]);

    fireEvent.change(screen.getByTestId("model-select"), { target: { value: "beta" } });
    fireEvent.input(input, { target: { value: "second" } });
    fireEvent.click(screen.getByTestId("composer-send"));
    await waitFor(() => expect(store.streaming).toBe(false));
    expect(seen).toEqual(["alpha", "beta"]);
  });

  it("shows an error bubble on a failing request", async () => {
    const stream: (p: ChatStreamParams) => Promise<ChatStreamResult> = async () => ({
      status: "error",
      error: "503 upstream down",
    });
    const store = makeTestStore(stream);
    render(ChatPanel, { global: { provide: { [CHAT_STORE_KEY]: store } } });
    await waitFor(() => expect(store.activeChat).toBeTruthy());

    const input = screen.getByTestId("composer-input") as HTMLTextAreaElement;
    fireEvent.input(input, { target: { value: "boom" } });
    fireEvent.click(screen.getByTestId("composer-send"));
    await waitFor(() => expect(store.streaming).toBe(false));

    expect(screen.getByText("503 upstream down")).toBeInTheDocument();
    const msgs = store.activeChat!.messages;
    const assistant = msgs[msgs.length - 1]!;
    expect(assistant.status).toBe("error");
    expect(assistant.error).toBe("503 upstream down");
  });

  it("shows the context gauge and model settings for a capable model, updating after a reply", async () => {
    const stream: (p: ChatStreamParams) => Promise<ChatStreamResult> = async (p) => {
      p.onToken("ok");
      p.onUsage({ prompt_tokens: 3200, completion_tokens: 100, total_tokens: 3300 });
      return { status: "done" };
    };
    const store = createChatStore({
      storage: new LocalStorageChatStorage(new MemoryStorage()),
      modelList: [
        {
          name: "Cap",
          modelSlug: "cap",
          endpoint: "e",
          apiKey: "k",
          maxContext: 8000,
          hasReasoning: true,
          hasThinkingEffort: true,
        },
      ],
      streamFn: stream,
      persistIntervalMs: 1000,
    });
    render(ChatPanel, { global: { provide: { [CHAT_STORE_KEY]: store } } });

    // store.init() runs in onMounted (async flush), so wait for the active model to resolve.
    await waitFor(() => expect(screen.getByTestId("model-settings")).toBeInTheDocument());
    expect(screen.getByTestId("thinking-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("effort-select")).toBeInTheDocument();

    const input = screen.getByTestId("composer-input") as HTMLTextAreaElement;
    fireEvent.input(input, { target: { value: "hi" } });
    fireEvent.click(screen.getByTestId("composer-send"));
    await waitFor(() => expect(store.streaming).toBe(false));

    // gauge: 3200 / 8000 = 40%
    expect(screen.getByTestId("context-gauge")).toBeInTheDocument();
    expect(screen.getByTestId("context-percent").textContent?.trim()).toBe("40%");
  });

  it("shows the last-response note while a stream is in flight after the agent is disabled (SPEC-004 §4.1)", async () => {
    // A stream that emits a token and then hangs — simulating "mid-stream".
    const stream: (p: ChatStreamParams) => Promise<ChatStreamResult> = (p) => {
      p.onToken("partial ");
      return new Promise<ChatStreamResult>(() => {}); // never settles
    };
    const store = makeTestStore(stream);
    render(ChatPanel, { global: { provide: { [CHAT_STORE_KEY]: store } } });
    await waitFor(() => expect(store.activeChat).toBeTruthy());

    const input = screen.getByTestId("composer-input") as HTMLTextAreaElement;
    fireEvent.input(input, { target: { value: "hi" } });
    fireEvent.click(screen.getByTestId("composer-send"));
    await waitFor(() => expect(store.streaming).toBe(true));

    // Not disabled yet -> no note.
    expect(screen.queryByTestId("disabled-last-response")).toBeNull();

    // Kill switch lands mid-stream -> the note appears, the screen is not blanked.
    setAgentDisabled({ message: { title: "T", body: "B" } });
    await waitFor(() =>
      expect(screen.getByTestId("disabled-last-response")).toBeInTheDocument(),
    );
    // The in-flight message is still on screen — not blanked mid-sentence.
    expect(document.body.textContent).toContain("partial");

    clearAgentDisabled();
    expect(agentDisabled.value).toBeNull();
  });
});
