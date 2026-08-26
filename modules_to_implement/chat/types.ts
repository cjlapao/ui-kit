export type Role = "system" | "user" | "assistant";

export type MessageStatus = "streaming" | "done" | "error";

/** Levels a reasoning model may accept for `reasoning_effort`. */
export type ThinkingEffort = "low" | "medium" | "high" | "xhigh";

/** Default levels offered when a model has thinking effort but none are configured. */
export const DEFAULT_THINKING_EFFORTS: readonly ThinkingEffort[] = [
  "low",
  "medium",
  "high",
  "xhigh",
];

/**
 * Sampling / generation parameters sent with the request body.
 * `top_k`, `min_p` and `repetition_penalty` are non-OpenAI fields passed through by LiteLLM/vLLM.
 * The index signature keeps engine-specific extras from the backend profile
 * (e.g. `num_ctx` for Ollama) so they pass through to the endpoint untouched.
 */
export interface ModelParams {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  min_p?: number;
  presence_penalty?: number;
  repetition_penalty?: number;
  [key: string]: unknown;
}

/** Token/usage metadata returned by the API. Stored separately, never rendered in the bubble. */
export interface Usage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  cost?: number;
  [key: string]: unknown;
}

/** A single chat turn. `content` (and optional `reasoning`) are rendered in the bubble. */
export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
  /** Chain-of-thought streamed in `reasoning_content` by reasoning models. */
  reasoning?: string;
  /** Epoch ms when the first reasoning token arrived — start of the thinking stage. */
  thinkingStartedAt?: number;
  /** Epoch ms when the thinking stage finished (first answer token, or the stream ending). */
  thinkingEndedAt?: number;
  modelSlug?: string;
  usage?: Usage;
  status?: MessageStatus;
  error?: string;
}

/** A full conversation persisted in a per-chat storage blob. */
export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  modelSlug: string;
  /** Per-chat reasoning settings (persisted). Inert if the active model doesn't support them. */
  thinking?: boolean;
  thinkingEffort?: ThinkingEffort;
  messages: Message[];
}

/** Lightweight chat record kept in the localStorage index for a fast, searchable rail. */
export interface ChatMeta {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  modelSlug: string;
}

/** A selectable model backed by an OpenAI-compatible endpoint, served by the agent. */
export interface ModelInfo {
  name: string;
  modelSlug: string;
  endpoint: string;
  /** Bearer key for the endpoint; empty for local models. */
  apiKey: string;
  /** Maximum context window in tokens. Drives the context gauge. */
  maxContext?: number;
  /** Model's output token limit reported by the agent. */
  maxOutputTokens?: number;
  /** USD cost per 1,000,000 input tokens (fallback when the API returns no cost). */
  inputCostPerMToken?: number;
  /** USD cost per 1,000,000 output tokens (fallback when the API returns no cost). */
  outputCostPerMToken?: number;
  /** Model produces reasoning / chain-of-thought (adds `chat_template_kwargs.enable_thinking`). */
  hasReasoning?: boolean;
  /** Model supports a selectable thinking effort (adds `reasoning_effort`). */
  hasThinkingEffort?: boolean;
  /** Levels offered when `hasThinkingEffort` is set. Defaults to `DEFAULT_THINKING_EFFORTS`. */
  thinkingEfforts?: ThinkingEffort[];
  /** Sampling / generation parameters sent with the request. */
  params?: ModelParams;
  /** Where the model is served: "cloud" | "local". */
  scope?: string;
  /** Local only: engine slug (e.g. "ollama"). */
  engine?: string;
  /** Why the model is available ("cloud-enabled" | "local-active"). */
  reason?: string;
}

/**
 * One entry of GET /v1/models/chat on the agent (camelCase, as the Go
 * ChatModel DTO serializes it). Mapped to {@link ModelInfo} by modelsApi.
 */
export interface ChatModelDto {
  /** Agent-side identity (for lifecycle calls: /v1/models/{id}/...). */
  id?: string;
  slug?: string;
  /** What the UI sends as the model identifier to the endpoint. */
  modelSlug: string;
  name: string;
  /** "cloud" | "local". */
  scope?: string;
  /** OpenAI-compatible base URL to call for chat completions. */
  endpoint: string;
  maxContext?: number;
  maxOutputTokens?: number;
  /** USD cost per 1,000,000 tokens; 0 for local models. */
  inputCostPerMToken?: number;
  outputCostPerMToken?: number;
  hasReasoning?: boolean;
  hasThinkingEffort?: boolean;
  params?: {
    maxTokens?: number;
    /** Sampling profile: temperature, top_p, num_ctx, ... */
    profile?: Record<string, unknown>;
    /** Profile keys the UI is allowed to tune. */
    overridableProfileKeys?: string[];
  };
  /** Cloud only: provider key resolved from the OS secret store. */
  apiKey?: string;
  /** Local only: engine slug + port the model serves on. */
  engine?: string;
  port?: number;
  capabilities?: string[];
  /** Why the model is available ("cloud-enabled" | "local-active"). */
  reason?: string;
}
