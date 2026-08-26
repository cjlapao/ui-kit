import { isTauri, invoke } from "@tauri-apps/api/core";
import type { ChatModelDto, ModelInfo } from "./types";

/**
 * The chat model list is served by the local agent over the Unix socket:
 * GET /v1/models/chat returns the unified list of models the chat UI can use
 * right now (cloud-enabled + local-active), including the endpoint, credentials
 * and sampling profile the browser streams completions against.
 */

/**
 * Map one raw /v1/models/chat entry to a chat-ready {@link ModelInfo}.
 *
 * The backend's `params.profile` object is the sampling surface the UI
 * prefills into the request body (temperature, top_p, num_ctx, ...), so it
 * flattens directly into `params` — engine numeric/boolean entries pass through
 * to the endpoint as-is.
 */
export function toModelInfo(dto: ChatModelDto): ModelInfo {
  const info: ModelInfo = {
    name: dto.name,
    modelSlug: dto.modelSlug,
    endpoint: dto.endpoint,
    apiKey: dto.apiKey ?? "",
  };

  if (dto.maxContext != null) info.maxContext = dto.maxContext;
  if (dto.maxOutputTokens != null) info.maxOutputTokens = dto.maxOutputTokens;
  if (dto.inputCostPerMToken != null) info.inputCostPerMToken = dto.inputCostPerMToken;
  if (dto.outputCostPerMToken != null) info.outputCostPerMToken = dto.outputCostPerMToken;
  info.hasReasoning = dto.hasReasoning ?? false;
  info.hasThinkingEffort = dto.hasThinkingEffort ?? false;

  const profile = dto.params?.profile;
  if (profile && typeof profile === "object") info.params = { ...profile };

  if (dto.scope) info.scope = dto.scope;
  if (dto.engine) info.engine = dto.engine;
  if (dto.reason) info.reason = dto.reason;

  return info;
}

/**
 * Fetch the chat model list from the agent.
 *
 * Throws when the list cannot be fetched (outside Tauri there is no Rust
 * backend to reach the socket at all; inside Tauri the socket error is
 * surfaced). The store catches and exposes the failure as `modelsError`.
 */
export async function fetchChatModels(): Promise<ModelInfo[]> {
  if (!isTauri()) {
    throw new Error("Chat models are served by the local agent — run the app inside Tauri");
  }

  const dtos = await invoke<ChatModelDto[]>("chat_models");
  if (!Array.isArray(dtos)) {
    throw new Error("The agent returned an invalid model list");
  }
  return dtos.map(toModelInfo);
}
