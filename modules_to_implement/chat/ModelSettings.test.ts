import { render, screen, fireEvent, cleanup } from "@testing-library/vue";
import { describe, it, expect, afterEach } from "vitest";
import ModelSettings from "./components/ModelSettings.vue";
import { CHAT_STORE_KEY, createChatStore, type ChatStreamResult } from "./store";
import { LocalStorageChatStorage, MemoryStorage } from "./storage";
import type { ModelInfo } from "./types";

afterEach(cleanup);

const done = async (): Promise<ChatStreamResult> => ({ status: "done" });

function makeStore(model: ModelInfo): ReturnType<typeof createChatStore> {
  return createChatStore({
    storage: new LocalStorageChatStorage(new MemoryStorage()),
    modelList: [model],
    streamFn: done,
    persistIntervalMs: 1000,
  });
}

describe("ModelSettings", () => {
  it("renders thinking + effort for a capable model and updates the store", async () => {
    const store = makeStore({
      name: "T",
      modelSlug: "t",
      endpoint: "e",
      apiKey: "k",
      hasReasoning: true,
      hasThinkingEffort: true,
      thinkingEfforts: ["low", "high"],
    });
    await store.init();
    render(ModelSettings, { global: { provide: { [CHAT_STORE_KEY]: store } } });

    const toggle = screen.getByTestId("thinking-toggle") as HTMLInputElement;
    const select = screen.getByTestId("effort-select") as HTMLSelectElement;
    expect(toggle).toBeInTheDocument();
    expect(select).toBeInTheDocument();
    expect(toggle.checked).toBe(true); // default ON for reasoning models

    fireEvent.change(toggle, { target: { checked: false } });
    expect(store.activeThinking).toBe(false);

    fireEvent.change(select, { target: { value: "high" } });
    expect(store.activeThinkingEffort).toBe("high");

    expect(Array.from(select.options).map((o) => o.value)).toEqual(["low", "high"]);
  });

  it("renders nothing for a model with no capabilities", async () => {
    const store = makeStore({ name: "P", modelSlug: "p", endpoint: "e", apiKey: "k" });
    await store.init();
    render(ModelSettings, { global: { provide: { [CHAT_STORE_KEY]: store } } });
    expect(screen.queryByTestId("model-settings")).toBeNull();
    expect(screen.queryByTestId("thinking-toggle")).toBeNull();
    expect(screen.queryByTestId("effort-select")).toBeNull();
  });

  it("shows only the effort control for a model with effort but no reasoning", async () => {
    const store = makeStore({
      name: "E",
      modelSlug: "e",
      endpoint: "e",
      apiKey: "k",
      hasThinkingEffort: true,
      thinkingEfforts: ["medium"],
    });
    await store.init();
    render(ModelSettings, { global: { provide: { [CHAT_STORE_KEY]: store } } });
    expect(screen.queryByTestId("thinking-toggle")).toBeNull();
    const select = screen.getByTestId("effort-select") as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(Array.from(select.options).map((o) => o.value)).toEqual(["medium"]);
  });
});
