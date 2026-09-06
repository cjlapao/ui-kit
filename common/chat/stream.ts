/**
 * The streaming transport: an OpenAI-compatible `/chat/completions`
 * endpoint, SSE deltas in, tokens out. Framework-free — both kits wrap it
 * in their own reactivity.
 */
import type { ChatMessage, ChatModel, ChatRole, ChatUsage } from "./types";

export interface StreamRequestMessage {
  role: ChatRole;
  content: string;
}

export interface StreamChatCompletionParams {
  baseUrl: string;
  apiKey?: string;
  model: string;
  messages: StreamRequestMessage[];
  signal: AbortSignal;
  temperature?: number;
  maxTokens?: number;
  onToken: (token: string) => void;
  onReasoning?: (token: string) => void;
  onUsage?: (usage: ChatUsage) => void;
  fetch?: typeof fetch;
}

export type StreamResult =
  | { status: "done" }
  | { status: "aborted" }
  | { status: "error"; error: string };

interface SseChunk {
  choices?: { delta?: { content?: string; reasoning_content?: string }; message?: { content?: string } }[];
  usage?: ChatUsage;
}

const describe = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : typeof err === "string" ? err : fallback;

export async function streamChatCompletion(
  params: StreamChatCompletionParams,
): Promise<StreamResult> {
  const doFetch = params.fetch ?? ((...args: Parameters<typeof fetch>) => fetch(...args));
  const url = `${params.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const body: Record<string, unknown> = {
    model: params.model,
    messages: params.messages,
    stream: true,
    stream_options: { include_usage: true },
  };
  if (params.temperature !== undefined) body.temperature = params.temperature;
  if (params.maxTokens !== undefined) body.max_tokens = params.maxTokens;

  let response: Response;
  try {
    response = await doFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(params.apiKey ? { Authorization: `Bearer ${params.apiKey}` } : {}),
      },
      body: JSON.stringify(body),
      signal: params.signal,
    });
  } catch (err) {
    if (params.signal.aborted) return { status: "aborted" };
    return { status: "error", error: describe(err, "Network request failed") };
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return {
      status: "error",
      error: `Request failed (${response.status} ${response.statusText})${detail ? `: ${detail.slice(0, 500)}` : ""}`,
    };
  }
  if (!response.body) return { status: "error", error: "Response had no body to stream" };

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let sawDone = false;

  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let cut: number;
      while ((cut = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, cut).replace(/\r$/, "");
        buffer = buffer.slice(cut + 1);
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") {
          sawDone = true;
          break;
        }
        if (!data) continue;
        let chunk: SseChunk;
        try {
          chunk = JSON.parse(data) as SseChunk;
        } catch {
          continue;
        }
        if (chunk.usage) params.onUsage?.(chunk.usage);
        const choice = chunk.choices?.[0];
        const reasoning = choice?.delta?.reasoning_content;
        if (reasoning && params.onReasoning) params.onReasoning(reasoning);
        const token = choice?.delta?.content;
        if (token) params.onToken(token);
      }
      if (sawDone) break;
    }
  } catch (err) {
    if (params.signal.aborted) return { status: "aborted" };
    return { status: "error", error: describe(err, "Stream interrupted") };
  }
  void sawDone;
  return { status: "done" };
}

/**
 * `GET {base}/models`, tolerant of the shapes in the wild. The result
 * feeds the model picker; failures resolve to an empty list, never throw —
 * a chat with a dead models endpoint is still a chat.
 */
export async function fetchChatModels(
  baseUrl: string,
  options: { apiKey?: string; fetch?: typeof fetch } = {},
): Promise<ChatModel[]> {
  const doFetch = options.fetch ?? ((...args: Parameters<typeof fetch>) => fetch(...args));
  try {
    const response = await doFetch(`${baseUrl.replace(/\/$/, "")}/models`, {
      headers: options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : undefined,
    });
    if (!response.ok) return [];
    const json = (await response.json()) as Record<string, unknown>;
    const rows = (json.data ?? json.value ?? json.items ?? []) as unknown[];
    return rows
      .map((row): ChatModel | null => {
        if (typeof row === "string") return { id: row };
        if (row && typeof row === "object") {
          const r = row as Record<string, unknown>;
          const id = (r.id ?? r.name ?? r.modelSlug) as string | undefined;
          if (!id) return null;
          return { id, label: (r.alias ?? r.label) as string | undefined, contextWindow: r.context_length as number | undefined };
        }
        return null;
      })
      .filter((m): m is ChatModel => Boolean(m));
  } catch {
    return [];
  }
}

/** The transcript as the wire wants it — finished turns only. */
export const toRequestMessages = (messages: ChatMessage[]): StreamRequestMessage[] =>
  messages
    .filter((m) => m.status === "done" && m.role !== "system")
    .map((m) => ({ role: m.role, content: m.content }));
