import { describe, it, expect } from "vitest";
import { estimateUsageCost, chatCurrentContextTokens } from "./usage";
import type { Message, ModelInfo } from "./types";

const msg = (usage?: Message["usage"]): Message => ({
  id: "m",
  role: "user",
  content: "x",
  createdAt: "1970-01-01T00:00:00.000Z",
  usage,
});

describe("estimateUsageCost", () => {
  it("computes USD cost from per-million rates", () => {
    const m: ModelInfo = {
      name: "M",
      modelSlug: "m",
      endpoint: "e",
      apiKey: "k",
      inputCostPerMToken: 2,
      outputCostPerMToken: 4,
    };
    expect(estimateUsageCost({ prompt_tokens: 1000, completion_tokens: 500 }, m)).toBeCloseTo(
      0.004,
      6,
    );
    expect(
      estimateUsageCost({ prompt_tokens: 1_000_000, completion_tokens: 1_000_000 }, m),
    ).toBeCloseTo(6, 6);
  });

  it("returns 0 when the model has no rates configured", () => {
    const m: ModelInfo = { name: "M", modelSlug: "m", endpoint: "e", apiKey: "k" };
    expect(estimateUsageCost({ prompt_tokens: 100, completion_tokens: 100 }, m)).toBe(0);
  });
});

describe("chatCurrentContextTokens", () => {
  it("uses the most recent prompt_tokens", () => {
    const messages = [msg({ prompt_tokens: 100 }), msg({ prompt_tokens: 500 }), msg({ prompt_tokens: 400 })];
    expect(chatCurrentContextTokens(messages)).toBe(400);
  });

  it("skips trailing messages without usage", () => {
    const messages = [msg({ prompt_tokens: 100 }), msg(undefined)];
    expect(chatCurrentContextTokens(messages)).toBe(100);
  });

  it("is 0 when there is no usage at all", () => {
    expect(chatCurrentContextTokens([msg(undefined)])).toBe(0);
  });

  it("is 0 for an empty list", () => {
    expect(chatCurrentContextTokens([])).toBe(0);
  });
});
