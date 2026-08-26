import type { ModelInfo, Role, ThinkingEffort, Usage } from "./types";
import { DEFAULT_THINKING_EFFORTS } from "./types";

/** The request message shape sent to the OpenAI-compatible endpoint. */
export interface RequestMessage {
  role: Role;
  content: string;
}

export interface StreamParams {
  model: ModelInfo;
  messages: RequestMessage[];
  signal: AbortSignal;
  /** When true and the model has reasoning, sends `chat_template_kwargs.enable_thinking`. */
  thinking?: boolean;
  /** When set and the model has thinking effort, sends `reasoning_effort`. */
  thinkingEffort?: ThinkingEffort | null;
  onToken?: (token: string) => void;
  onReasoning?: (token: string) => void;
  onUsage?: (usage: Usage) => void;
}

/**
 * Builds the model-specific "extra body" fields: sampling params (always), plus
 * `chat_template_kwargs.enable_thinking` when reasoning is on and `reasoning_effort`
 * when the model supports it. Returns `{}` for a model with none of these configured.
 *
 * Sampling params come from the model's profile (served by the agent), so every
 * numeric/boolean entry passes through to the endpoint as-is — including
 * engine-specific keys like `num_ctx` that are not part of the OpenAI schema.
 */
function buildExtraBody(
  model: ModelInfo,
  thinking: boolean | undefined,
  effort: ThinkingEffort | null | undefined,
): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  const p = model.params;
  if (p) {
    for (const [key, value] of Object.entries(p)) {
      if (typeof value === "number" || typeof value === "boolean") body[key] = value;
    }
  }

  if (model.hasReasoning && thinking) body.chat_template_kwargs = { enable_thinking: true };

  if (model.hasThinkingEffort) {
    const efforts = model.thinkingEfforts ?? DEFAULT_THINKING_EFFORTS;
    const chosen = effort && efforts.includes(effort) ? effort : efforts[0];
    if (chosen) body.reasoning_effort = chosen;
  }
  return body;
}

/** Terminal outcome of a single stream. Text is delivered incrementally via `onToken`. */
export type StreamResult =
  | { status: "done" }
  | { status: "aborted" }
  | {
      status: "error";
      error: string;
      /**
       * SPEC-004 §2 fallback: set when the request was refused with
       * 403 + `error: "agent_disabled"` (grain killed while chatting).
       */
      agentDisabledPayload?: unknown;
    };

function buildUrl(endpoint: string): string {
  const base = endpoint.replace(/\/+$/, "");
  if (!base) return base;
  return /\/chat\/completions$/i.test(base) ? base : `${base}/chat/completions`;
}

interface SseChoice {
  delta?: { content?: unknown; reasoning_content?: unknown };
  message?: { content?: unknown; reasoning_content?: unknown };
}

interface SseChunk {
  choices?: SseChoice[];
  usage?: Usage;
}

function describeError(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    if (err.name === "AbortError") return fallback;
    return err.message || fallback;
  }
  return fallback;
}

/**
 * Streams a chat completion from an OpenAI-compatible endpoint.
 * - POST {endpoint}/chat/completions with stream:true and include_usage:true
 * - appends each delta to onToken; captures the usage chunk via onUsage
 * - resolves with done / aborted / error (text is already delivered incrementally)
 */
export async function streamChatCompletion(params: StreamParams): Promise<StreamResult> {
  const { model, messages, signal, onToken, onReasoning, onUsage, thinking, thinkingEffort } = params;
  const url = buildUrl(model.endpoint);
  const body: Record<string, unknown> = {
    model: model.modelSlug,
    messages,
    stream: true,
    stream_options: { include_usage: true },
    ...buildExtraBody(model, thinking, thinkingEffort),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${model.apiKey}`,
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (signal.aborted) return { status: "aborted" };
    return { status: "error", error: describeError(err, "Network request failed") };
  }

  if (!response.ok) {
    let detail = "";
    let agentDisabledPayload: unknown;
    try {
      const text = await response.text();
      detail = text ? `: ${text.slice(0, 500)}` : "";
      // SPEC-004 §2: the agent proxy refuses inference for a killed grain
      // with 403 + `error/code: "agent_disabled"` — surface that as the
      // disabled signal (the UI switches to the Disabled screen, not an error).
      if (response.status === 403 && text) {
        try {
          const parsed = JSON.parse(text) as { error?: string; code?: string };
          if (parsed && (parsed.error === "agent_disabled" || parsed.code === "agent_disabled")) {
            agentDisabledPayload = parsed;
          }
        } catch {
          /* not JSON — plain error */
        }
      }
    } catch {
      /* ignore */
    }
    return {
      status: "error",
      error: `Request failed (${response.status} ${response.statusText})${detail}`,
      ...(agentDisabledPayload !== undefined ? { agentDisabledPayload } : {}),
    };
  }

  if (!response.body) {
    return { status: "error", error: "Response had no body to stream" };
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let sawDone = false;

  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let newline: number;
      while ((newline = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, newline).replace(/\r$/, "");
        buffer = buffer.slice(newline + 1);
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") {
          sawDone = true;
          break;
        }
        if (!data) continue;
        let payload: SseChunk;
        try {
          payload = JSON.parse(data) as SseChunk;
        } catch {
          continue;
        }
        if (payload.usage) onUsage?.(payload.usage);
        const choice = payload.choices?.[0];
        const reasoning = choice?.delta?.reasoning_content ?? choice?.message?.reasoning_content;
        if (typeof reasoning === "string" && reasoning.length > 0 && onReasoning) onReasoning(reasoning);
        const content = choice?.delta?.content ?? choice?.message?.content;
        if (typeof content === "string" && content.length > 0 && onToken) onToken(content);
      }
      if (sawDone) break;
    }
  } catch (err) {
    if (signal.aborted) return { status: "aborted" };
    return { status: "error", error: describeError(err, "Stream interrupted") };
  }

  return { status: "done" };
}
