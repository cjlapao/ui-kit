import { describe, it, expect, vi, beforeEach } from "vitest";
import { isTauri, invoke } from "@tauri-apps/api/core";
import { fetchChatModels, toModelInfo } from "./modelsApi";
import type { ChatModelDto } from "./types";

vi.mock("@tauri-apps/api/core", () => ({
  isTauri: vi.fn(() => true),
  invoke: vi.fn(),
}));

const mockIsTauri = vi.mocked(isTauri);
const mockInvoke = vi.mocked(invoke);

// Exact payload shape of GET /v1/models/chat (Go ChatModel DTO, camelCase).
const CLOUD_DTO: ChatModelDto = {
  id: "cloud-1",
  slug: "openai-gpt-4o",
  modelSlug: "gpt-4o",
  name: "OpenAI GPT-4o",
  scope: "cloud",
  endpoint: "https://api.openai.com/v1",
  maxContext: 128000,
  maxOutputTokens: 4096,
  inputCostPerMToken: 2.5,
  outputCostPerMToken: 10.0,
  hasReasoning: false,
  hasThinkingEffort: false,
  params: { maxTokens: 4096, profile: { temperature: 0.7 } },
  apiKey: "sk-…",
  reason: "cloud-enabled",
};

const LOCAL_DTO: ChatModelDto = {
  id: "local-1",
  slug: "ollama-llama-3-1-8b",
  modelSlug: "llama3.1:8b",
  name: "Ollama Llama 3.1 8B",
  scope: "local",
  endpoint: "http://127.0.0.1:11434/v1",
  maxContext: 8192,
  maxOutputTokens: 4096,
  inputCostPerMToken: 0,
  outputCostPerMToken: 0,
  hasReasoning: false,
  hasThinkingEffort: false,
  params: {
    maxTokens: 4096,
    profile: { num_ctx: 8192, temperature: 0.6 },
    overridableProfileKeys: ["temperature", "num_ctx"],
  },
  engine: "ollama",
  port: 11434,
  reason: "local-active",
};

beforeEach(() => {
  vi.clearAllMocks();
  mockIsTauri.mockReturnValue(true);
});

describe("toModelInfo", () => {
  it("maps a cloud model entry (key, costs, profile)", () => {
    const info = toModelInfo(CLOUD_DTO);
    expect(info).toEqual({
      name: "OpenAI GPT-4o",
      modelSlug: "gpt-4o",
      endpoint: "https://api.openai.com/v1",
      apiKey: "sk-…",
      maxContext: 128000,
      maxOutputTokens: 4096,
      inputCostPerMToken: 2.5,
      outputCostPerMToken: 10.0,
      hasReasoning: false,
      hasThinkingEffort: false,
      params: { temperature: 0.7 },
      scope: "cloud",
      reason: "cloud-enabled",
    });
  });

  it("maps a local model entry (no key, engine, engine-specific profile keys)", () => {
    const info = toModelInfo(LOCAL_DTO);
    expect(info.name).toBe("Ollama Llama 3.1 8B");
    expect(info.modelSlug).toBe("llama3.1:8b");
    expect(info.endpoint).toBe("http://127.0.0.1:11434/v1");
    expect(info.apiKey).toBe("");
    expect(info.scope).toBe("local");
    expect(info.engine).toBe("ollama");
    // profile flattens into params, including the engine-specific num_ctx
    expect(info.params).toEqual({ num_ctx: 8192, temperature: 0.6 });
    expect(info.inputCostPerMToken).toBe(0);
    expect(info.outputCostPerMToken).toBe(0);
  });

  it("tolerates a minimal entry without params", () => {
    const info = toModelInfo({ modelSlug: "m", name: "M", endpoint: "http://e" });
    expect(info).toEqual({
      name: "M",
      modelSlug: "m",
      endpoint: "http://e",
      apiKey: "",
      hasReasoning: false,
      hasThinkingEffort: false,
    });
    expect(info.params).toBeUndefined();
  });
});

describe("fetchChatModels", () => {
  it("invokes chat_models and maps every entry", async () => {
    mockInvoke.mockResolvedValue([CLOUD_DTO, LOCAL_DTO]);

    const models = await fetchChatModels();

    expect(mockInvoke).toHaveBeenCalledWith("chat_models");
    expect(models.map((m) => m.modelSlug)).toEqual(["gpt-4o", "llama3.1:8b"]);
    expect(models[0]?.apiKey).toBe("sk-…");
    expect(models[1]?.engine).toBe("ollama");
  });

  it("resolves an empty list when the agent has no chat models", async () => {
    mockInvoke.mockResolvedValue([]);
    await expect(fetchChatModels()).resolves.toEqual([]);
  });

  it("throws when the agent returns a non-array", async () => {
    mockInvoke.mockResolvedValue({ models: [] });
    await expect(fetchChatModels()).rejects.toThrow("invalid model list");
  });

  it("throws with the socket error message when the command fails", async () => {
    mockInvoke.mockRejectedValue(new Error("Failed to connect to socket /tmp/x.sock: refused"));
    await expect(fetchChatModels()).rejects.toThrow("Failed to connect to socket");
  });

  it("throws outside Tauri (no Rust backend to reach the socket)", async () => {
    mockIsTauri.mockReturnValue(false);
    await expect(fetchChatModels()).rejects.toThrow("local agent");
    expect(mockInvoke).not.toHaveBeenCalled();
  });
});
