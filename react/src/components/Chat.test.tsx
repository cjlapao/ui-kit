import { afterEach, describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chat from "./Chat";
import { createLocalChatStorage, type ChatMessage } from "../chat";

const memory = () => {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  };
};

const sendText = async (text: string) => {
  const box = await screen.findByLabelText("Message");
  fireEvent.change(box, { target: { value: text } });
  fireEvent.click(screen.getByRole("button", { name: /Send/ }));
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Chat", () => {
  it("starts on a quiet welcome and a New chat action", async () => {
    const { container } = render(<Chat storage={createLocalChatStorage({ storage: memory() })} />);
    expect(await screen.findByText("Chat, self-sustained")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /New chat/ }));
    await waitFor(() =>
      expect(container.querySelector("textarea")).toBeInTheDocument(),
    );
  });

  it("sends a message and — with no endpoint — surfaces an honest error bubble", async () => {
    render(<Chat storage={createLocalChatStorage({ storage: memory() })} />);
    fireEvent.click(await screen.findByRole("button", { name: /New chat/ }));
    await sendText("hello there");
    expect(await screen.findByText("hello there")).toBeInTheDocument();
    expect(await screen.findByText(/does not answer/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("persists across mounts on the same storage", async () => {
    const bag = memory();
    const first = render(<Chat storage={createLocalChatStorage({ storage: bag })} />);
    fireEvent.click(await screen.findByRole("button", { name: /New chat/ }));
    await sendText("remember me");
    await screen.findByText("remember me");
    first.unmount();

    render(<Chat storage={createLocalChatStorage({ storage: bag })} />);
    // The rail row (title + preview) and the reopened transcript — same storage.
    await waitFor(() => expect(screen.getAllByText("remember me").length).toBeGreaterThanOrEqual(2));
  });

  it("groups chats under folders created from the rail", async () => {
    render(<Chat storage={createLocalChatStorage({ storage: memory() })} />);
    await screen.findByText("Chat, self-sustained");
    fireEvent.click(screen.getByRole("button", { name: "New folder" }));
    const input = await screen.findByPlaceholderText("Folder name");
    fireEvent.change(input, { target: { value: "Research" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(await screen.findByText("Research")).toBeInTheDocument();
  });

  it("streams an assistant reply from an OpenAI-compatible endpoint", async () => {
    const body = [
      "data: " + JSON.stringify({ choices: [{ delta: { content: "Hello" } }] }) + "\n",
      "data: " +
        JSON.stringify({ choices: [{ delta: { content: ", human" } }] }) +
        "\n",
      "data: " +
        JSON.stringify({ choices: [], usage: { prompt_tokens: 9, completion_tokens: 2, total_tokens: 11 } }) +
        "\n",
      "data: [DONE]\n",
    ].join("");
    const bytes = new TextEncoder().encode(body);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => "",
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
    render(
      <Chat
        storage={createLocalChatStorage({ storage: memory() })}
        baseUrl="https://api.test"
        apiKey="k"
        models={[{ id: "test-model" }]}
      />,
    );
    fireEvent.click(await screen.findByRole("button", { name: /New chat/ }));
    await sendText("hi");
    await waitFor(() => expect(screen.getAllByText(/Hello, human/).length).toBeGreaterThan(0));
    await waitFor(() => expect(screen.getAllByText(/↑9 ↓2/).length).toBeGreaterThan(0));
  });

  it("reports events to the onEvent seam", async () => {
    const onEvent = vi.fn();
    render(<Chat storage={createLocalChatStorage({ storage: memory() })} onEvent={onEvent} />);
    fireEvent.click(await screen.findByRole("button", { name: /New chat/ }));
    await sendText("ping");
    await waitFor(() =>
      expect(onEvent.mock.calls.map(([e]) => (e as { type: string }).type)).toEqual(
        expect.arrayContaining(["chat-created", "message-sent", "stream-error", "message-received"]),
      ),
    );
    const received = onEvent.mock.calls.find(([e]) => (e as { type: string }).type === "message-received")?.[0] as {
      message: ChatMessage;
    };
    expect(received.message.role).toBe("assistant");
  });
});
