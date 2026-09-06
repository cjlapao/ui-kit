import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Chat from "./Chat.vue";
import { createLocalChatStorage } from "../chat";

const memory = () => {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  };
};

const sendText = async (wrapper: ReturnType<typeof mount>, text: string) => {
  const box = wrapper.find("textarea[aria-label='Message']");
  await box.setValue(text);
  const send = wrapper.findAll("button").find((b) => b.text().trim() === "Send");
  await send!.trigger("click");
  await flushPromises();
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Chat", () => {
  it("starts on a quiet welcome and a New chat action", async () => {
    const wrapper = mount(Chat, {
      props: { storage: createLocalChatStorage({ storage: memory() }) },
      attachTo: document.body,
    });
    await flushPromises();
    expect(wrapper.text()).toContain("Chat, self-sustained");
    await wrapper.findAll("button").find((b) => b.text().trim() === "New chat")!.trigger("click");
    await flushPromises();
    expect(wrapper.find("textarea").exists()).toBe(true);
    wrapper.unmount();
  });

  it("sends a message and — with no endpoint — surfaces an honest error bubble", async () => {
    const wrapper = mount(Chat, {
      props: { storage: createLocalChatStorage({ storage: memory() }) },
      attachTo: document.body,
    });
    await flushPromises();
    await wrapper.findAll("button").find((b) => b.text().trim() === "New chat")!.trigger("click");
    await flushPromises();
    await sendText(wrapper, "hello there");
    expect(wrapper.text()).toContain("hello there");
    expect(wrapper.text()).toContain("does not answer");
    expect(wrapper.text()).toContain("Retry");
    wrapper.unmount();
  });

  it("persists across mounts on the same storage", async () => {
    const bag = memory();
    const first = mount(Chat, {
      props: { storage: createLocalChatStorage({ storage: bag }) },
      attachTo: document.body,
    });
    await flushPromises();
    await first.findAll("button").find((b) => b.text().trim() === "New chat")!.trigger("click");
    await flushPromises();
    await sendText(first, "remember me");
    first.unmount();

    const second = mount(Chat, {
      props: { storage: createLocalChatStorage({ storage: bag }) },
      attachTo: document.body,
    });
    await flushPromises();
    // Rail row and reopened transcript both speak of it.
    expect(second.text().split("remember me").length - 1).toBeGreaterThanOrEqual(2);
    second.unmount();
  });

  it("groups chats under folders created from the rail", async () => {
    const wrapper = mount(Chat, {
      props: { storage: createLocalChatStorage({ storage: memory() }) },
      attachTo: document.body,
    });
    await flushPromises();
    await wrapper.find("button[aria-label='New folder']").trigger("click");
    await wrapper.find("input[placeholder='Folder name']").setValue("Research");
    await wrapper.find("input[placeholder='Folder name']").trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(wrapper.text()).toContain("Research");
    wrapper.unmount();
  });

  it("streams an assistant reply from an OpenAI-compatible endpoint", async () => {
    const body =
      `data: ${JSON.stringify({ choices: [{ delta: { content: "Hello" } }] })}\n` +
      `data: ${JSON.stringify({ choices: [{ delta: { content: ", human" } }] })}\n` +
      `data: ${JSON.stringify({ choices: [], usage: { prompt_tokens: 9, completion_tokens: 2, total_tokens: 11 } })}\n` +
      "data:n";
    const bytes = new TextEncoder().encode(body);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => "",
        json: async () => ({}),
        body: {
          getReader: () => {
            let served = false;
            return {
              read: async () =>
                served
                  ? { done: true, value: undefined }
                  : ((served = true), { done: false, value: bytes }),
            };
          },
        },
      })),
    );
    const wrapper = mount(Chat, {
      props: {
        storage: createLocalChatStorage({ storage: memory() }),
        baseUrl: "https://api.test",
        apiKey: "k",
        models: [{ id: "test-model" }],
      },
      attachTo: document.body,
    });
    await flushPromises();
    await wrapper.findAll("button").find((b) => b.text().trim() === "New chat")!.trigger("click");
    await flushPromises();
    await sendText(wrapper, "hi");
    await flushPromises();
    expect(wrapper.text()).toContain("Hello, human");
    expect(wrapper.text()).toContain("↑9 ↓2");
    wrapper.unmount();
  });

  it("reports events through the event seam", async () => {
    const wrapper = mount(Chat, {
      props: { storage: createLocalChatStorage({ storage: memory() }) },
      attachTo: document.body,
    });
    await flushPromises();
    await wrapper.findAll("button").find((b) => b.text().trim() === "New chat")!.trigger("click");
    await flushPromises();
    await sendText(wrapper, "ping");
    const types = wrapper.emitted("event")?.map(([e]) => (e as { type: string }).type) ?? [];
    expect(types).toEqual(
      expect.arrayContaining(["chat-created", "message-sent", "stream-error", "message-received"]),
    );
    wrapper.unmount();
  });
});
