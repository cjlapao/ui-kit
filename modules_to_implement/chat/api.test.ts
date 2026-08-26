import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { streamChatCompletion } from "./api";
import type { ModelInfo, Usage } from "./types";

const model: ModelInfo = {
  name: "M",
  modelSlug: "my-slug",
  endpoint: "http://litellm.local",
  apiKey: "secret",
};

const richModel: ModelInfo = {
  name: "Rich",
  modelSlug: "rich",
  endpoint: "http://litellm.local",
  apiKey: "secret",
  maxContext: 1000,
  inputCostPerMToken: 1,
  outputCostPerMToken: 2,
  hasReasoning: true,
  hasThinkingEffort: true,
  thinkingEfforts: ["low", "medium", "high"],
  params: { temperature: 0.7, top_p: 0.95, top_k: 20, min_p: 0, presence_penalty: 0, repetition_penalty: 1.0 },
};

function sseStream(lines: string[]): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  let i = 0;
  return new ReadableStream({
    pull(controller) {
      if (i < lines.length) controller.enqueue(enc.encode(lines[i++]));
      else controller.close();
    },
  });
}

const helloStream = () =>
  sseStream([
    'data: {"choices":[{"delta":{"content":"Hel"}}]}\n\n',
    'data: {"choices":[{"delta":{"content":"lo"}}]}\n\n',
    'data: {"choices":[{"delta":{}}],"usage":{"prompt_tokens":10,"completion_tokens":2,"total_tokens":12,"cost":0.5}}\n\n',
    "data: [DONE]\n\n",
  ]);

const reasoningStream = () =>
  sseStream([
    'data: {"choices":[{"delta":{"reasoning_content":"let me"}}]}\n\n',
    'data: {"choices":[{"delta":{"reasoning_content":" think"}}]}\n\n',
    'data: {"choices":[{"delta":{"content":"42"}}]}\n\n',
    'data: {"choices":[{"delta":{}}],"usage":{"prompt_tokens":10,"completion_tokens":2,"total_tokens":12}}\n\n',
    "data: [DONE]\n\n",
  ]);

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("streamChatCompletion", () => {
  it("streams tokens and captures usage, resolving done", async () => {
    const fetchMock = vi.fn(async () => new Response(helloStream(), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const tokens: string[] = [];
    let usage: Usage | undefined;
    const result = await streamChatCompletion({
      model,
      messages: [{ role: "user", content: "hi" }],
      signal: new AbortController().signal,
      onToken: (t) => tokens.push(t),
      onUsage: (u) => (usage = u),
    });

    expect(result).toEqual({ status: "done" });
    expect(tokens.join("")).toBe("Hello");
    expect(usage).toMatchObject({ prompt_tokens: 10, total_tokens: 12 });
  });

  it("routes reasoning_content to onReasoning and content to onToken", async () => {
    const fetchMock = vi.fn(async () => new Response(reasoningStream(), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const tokens: string[] = [];
    const reasons: string[] = [];
    const result = await streamChatCompletion({
      model,
      messages: [{ role: "user", content: "hi" }],
      signal: new AbortController().signal,
      onToken: (t) => tokens.push(t),
      onReasoning: (t) => reasons.push(t),
    });
    expect(result.status).toBe("done");
    expect(reasons.join("")).toBe("let me think");
    expect(tokens.join("")).toBe("42");
  });

  it("sends the active model slug, full history, and auth header", async () => {
    const fetchMock = vi.fn(async () => new Response(helloStream(), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await streamChatCompletion({
      model,
      messages: [
        { role: "user", content: "one" },
        { role: "assistant", content: "two" },
      ],
      signal: new AbortController().signal,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("http://litellm.local/chat/completions");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer secret");
    const body = JSON.parse(init.body as string);
    expect(body.model).toBe("my-slug");
    expect(body.stream).toBe(true);
    expect(body.stream_options).toEqual({ include_usage: true });
    expect(body.messages).toEqual([
      { role: "user", content: "one" },
      { role: "assistant", content: "two" },
    ]);
  });

  it("sends sampling params, enable_thinking and reasoning_effort for a reasoning model", async () => {
    const fetchMock = vi.fn(async () => new Response(helloStream(), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await streamChatCompletion({
      model: richModel,
      messages: [{ role: "user", content: "hi" }],
      signal: new AbortController().signal,
      thinking: true,
      thinkingEffort: "high",
    });
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(body.temperature).toBe(0.7);
    expect(body.top_p).toBe(0.95);
    expect(body.top_k).toBe(20);
    expect(body.min_p).toBe(0);
    expect(body.presence_penalty).toBe(0);
    expect(body.repetition_penalty).toBe(1.0);
    expect(body.chat_template_kwargs).toEqual({ enable_thinking: true });
    expect(body.reasoning_effort).toBe("high");
  });

  it("omits enable_thinking when thinking is off but still sends a default reasoning_effort", async () => {
    const fetchMock = vi.fn(async () => new Response(helloStream(), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await streamChatCompletion({
      model: richModel,
      messages: [{ role: "user", content: "hi" }],
      signal: new AbortController().signal,
      thinking: false,
    });
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(body.chat_template_kwargs).toBeUndefined();
    expect(body.reasoning_effort).toBe("low"); // first of thinkingEfforts
  });

  it("passes engine-specific profile keys (e.g. num_ctx) through to the endpoint", async () => {
    const fetchMock = vi.fn(async () => new Response(helloStream(), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await streamChatCompletion({
      model: { ...model, params: { temperature: 0.6, num_ctx: 8192 } },
      messages: [{ role: "user", content: "hi" }],
      signal: new AbortController().signal,
    });
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(body.temperature).toBe(0.6);
    expect(body.num_ctx).toBe(8192);
  });

  it("sends no extra body fields for a model without params/reasoning/effort", async () => {
    const fetchMock = vi.fn(async () => new Response(helloStream(), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await streamChatCompletion({
      model,
      messages: [{ role: "user", content: "hi" }],
      signal: new AbortController().signal,
    });
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(body.temperature).toBeUndefined();
    expect(body.top_p).toBeUndefined();
    expect(body.chat_template_kwargs).toBeUndefined();
    expect(body.reasoning_effort).toBeUndefined();
  });

  it("treats an endpoint that already ends with /chat/completions as-is", async () => {
    const fetchMock = vi.fn(async () => new Response(helloStream(), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await streamChatCompletion({
      model: { ...model, endpoint: "http://x/v1/chat/completions" },
      messages: [],
      signal: new AbortController().signal,
    });
    expect((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[0]).toBe(
      "http://x/v1/chat/completions",
    );
  });

  it("returns a readable error on non-2xx", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("invalid key", { status: 401, statusText: "Unauthorized" })),
    );
    const result = await streamChatCompletion({
      model,
      messages: [],
      signal: new AbortController().signal,
    });
    expect(result.status).toBe("error");
    if (result.status === "error") {
      expect(result.error).toContain("401");
      expect(result.error).toContain("invalid key");
    }
  });

  it("surfaces a 403 agent_disabled body as the disabled signal (SPEC-004 §2)", async () => {
    const payload = {
      error: "agent_disabled",
      message: { title: "T", body: "B", support_hint: "H" },
      effective_at: "2026-08-25T11:59:00Z",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify(payload), { status: 403, statusText: "Forbidden" })),
    );
    const result = await streamChatCompletion({
      model,
      messages: [],
      signal: new AbortController().signal,
    });
    expect(result.status).toBe("error");
    if (result.status === "error") {
      expect(result.agentDisabledPayload).toEqual(payload);
      expect(result.error).toContain("403");
    }
  });

  it("does not set the disabled signal for other 403 bodies", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("forbidden", { status: 403, statusText: "Forbidden" })),
    );
    const result = await streamChatCompletion({
      model,
      messages: [],
      signal: new AbortController().signal,
    });
    expect(result.status).toBe("error");
    if (result.status === "error") {
      expect(result.agentDisabledPayload).toBeUndefined();
    }
  });

  it("resolves aborted when the request is cancelled", async () => {
    const fetchMock = vi.fn(async (_u: string, init?: RequestInit) => {
      if (init?.signal?.aborted) {
        const e = new Error("aborted");
        e.name = "AbortError";
        throw e;
      }
      return new Response(helloStream(), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);
    const ctrl = new AbortController();
    ctrl.abort();
    const result = await streamChatCompletion({
      model,
      messages: [],
      signal: ctrl.signal,
    });
    expect(result).toEqual({ status: "aborted" });
  });

  it("keeps partial text and reports an error when the stream breaks mid-way", async () => {
    const enc = new TextEncoder();
    let first = true;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        if (first) {
          first = false;
          controller.enqueue(enc.encode('data: {"choices":[{"delta":{"content":"part"}}]}\n\n'));
        } else {
          controller.error(new Error("socket closed"));
        }
      },
    });
    vi.stubGlobal("fetch", vi.fn(async () => new Response(stream, { status: 200 })));
    const tokens: string[] = [];
    const result = await streamChatCompletion({
      model,
      messages: [],
      signal: new AbortController().signal,
      onToken: (t) => tokens.push(t),
    });
    expect(tokens.join("")).toBe("part");
    expect(result.status).toBe("error");
  });
});
