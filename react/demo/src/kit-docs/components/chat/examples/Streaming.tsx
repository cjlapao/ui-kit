import { Chat, createLocalChatStorage } from "@cjlapao/ui-kit";

/**
 * Streaming against a stand-in endpoint. The wire protocol is OpenAI's —
 * `POST {baseUrl}/chat/completions` with SSE deltas — so pointing
 * `baseUrl`/`apiKey` at any compatible gateway is the whole integration.
 * This example stubs `fetch` with a scripted reply to stay offline.
 */
const storage = createLocalChatStorage({ prefix: "demo.chat.stream" });

if (!(globalThis as Record<string, unknown>).__demoModelStubbed) {
  (globalThis as Record<string, unknown>).__demoModelStubbed = true;
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    if (String(input).endsWith("/models")) {
      return new Response(JSON.stringify({ data: [{ id: "demo-nova" }] }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    const body = [
      "The ", "quick ", "brown ", "fox ", "jumps ", "— ", "streamed, ", "token ", "by ", "token.",
    ].map((t) => `data: ${JSON.stringify({ choices: [{ delta: { content: t } }] })}\n`);
    body.push(
      `data: ${JSON.stringify({ choices: [], usage: { prompt_tokens: 12, completion_tokens: 13, total_tokens: 25 } })}\n`,
      "data: [DONE]\n",
    );
    const stream = new ReadableStream({
      start(controller) {
        for (const line of body) controller.enqueue(new TextEncoder().encode(line));
        controller.close();
      },
    });
    return new Response(stream);
  }) as typeof fetch;
}

export default function Streaming() {
  return (
    <Chat
      storage={storage}
      baseUrl="https://demo.invalid"
      models={[{ id: "demo-nova" }]}
      height={420}
    />
  );
}
