import type { Chat, Message, ModelInfo, Usage } from "./types";

/** Aggregated usage + cost across a set of messages (stored metadata, for later analysis). */
export interface UsageTotals {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  requests: number;
}

const toNum = (v: unknown): number =>
  typeof v === "number" && Number.isFinite(v) ? v : 0;

export function emptyTotals(): UsageTotals {
  return {
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    cost: 0,
    requests: 0,
  };
}

/** Sum usage across a collection of messages, skipping messages without usage. */
export function messagesUsageTotal(messages: Message[] | undefined): UsageTotals {
  const totals = emptyTotals();
  if (!messages) return totals;
  for (const m of messages) {
    const u = m.usage;
    if (!u) continue;
    totals.requests += 1;
    totals.promptTokens += toNum(u.prompt_tokens);
    totals.completionTokens += toNum(u.completion_tokens);
    totals.totalTokens += toNum(u.total_tokens);
    totals.cost += toNum(u.cost);
  }
  return totals;
}

/** Sum usage across a chat. */
export function chatUsageTotal(chat: Pick<Chat, "messages"> | null | undefined): UsageTotals {
  return messagesUsageTotal(chat?.messages);
}

/**
 * Largest prompt context observed in a chat. `prompt_tokens` reflects the full history sent
 * on that turn, so the max is the biggest context window the model has seen.
 */
export function chatContextSize(chat: Pick<Chat, "messages"> | null | undefined): number {
  if (!chat) return 0;
  let max = 0;
  for (const m of chat.messages) {
    const u: Usage | undefined = m.usage;
    if (u) max = Math.max(max, toNum(u.prompt_tokens));
  }
  return max;
}

/**
 * Current context occupancy in tokens: `prompt_tokens` from the most recent turn that reported
 * it — i.e. how full the context window is right now. Falls back to the max observed.
 */
export function chatCurrentContextTokens(messages: Message[] | undefined): number {
  if (!messages) return 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    const pt = toNum(messages[i]?.usage?.prompt_tokens);
    if (pt > 0) return pt;
  }
  let max = 0;
  for (const m of messages) max = Math.max(max, toNum(m.usage?.prompt_tokens));
  return max;
}

/** Estimated USD cost for a usage object from a model's per-million-token rates. */
export function estimateUsageCost(usage: Usage, model: ModelInfo): number {
  const inPerM = model.inputCostPerMToken ?? 0;
  const outPerM = model.outputCostPerMToken ?? 0;
  const prompt = toNum(usage.prompt_tokens);
  const completion = toNum(usage.completion_tokens);
  return (prompt * inPerM + completion * outPerM) / 1_000_000;
}
