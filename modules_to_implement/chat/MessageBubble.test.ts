import { render, screen, fireEvent, cleanup } from "@testing-library/vue";
import { nextTick } from "vue";
import { describe, it, expect, afterEach } from "vitest";
import MessageBubble from "./components/MessageBubble.vue";
import type { Message } from "./types";

afterEach(cleanup);

function msg(overrides: Partial<Message> & { role: Message["role"] }): Message {
  return { id: "m1", content: "Answer", createdAt: "1970-01-01T00:00:00.000Z", ...overrides };
}

describe("MessageBubble", () => {
  it("renders the thinking block collapsed by default", () => {
    render(MessageBubble, {
      props: { message: msg({ role: "assistant", reasoning: "chain of thought", status: "done" }) },
    });

    expect(screen.getByTestId("reasoning-block")).toBeInTheDocument();
    const toggle = screen.getByTestId("reasoning-toggle");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByTestId("reasoning-label").textContent?.trim()).toBe("Thinking");

    // Content is mounted but hidden until expanded.
    const content = screen.getByTestId("reasoning-content");
    expect(content).toBeInTheDocument();
    expect(content).not.toBeVisible();
  });

  it("expands and collapses on toggle", async () => {
    render(MessageBubble, {
      props: { message: msg({ role: "assistant", reasoning: "reasoning text", status: "done" }) },
    });

    const toggle = screen.getByTestId("reasoning-toggle");
    const content = screen.getByTestId("reasoning-content");

    fireEvent.click(toggle);
    await nextTick();
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(content).toBeVisible();
    expect(screen.getByTestId("reasoning-text").textContent).toContain("reasoning text");

    fireEvent.click(toggle);
    await nextTick();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(content).not.toBeVisible();
  });

  it("keeps the label animated and collapsible while streaming", async () => {
    const { rerender } = render(MessageBubble, {
      props: { message: msg({ role: "assistant", reasoning: "so far", status: "streaming" }) },
    });

    expect(screen.getByTestId("reasoning-label")).toHaveClass("thinking-label");

    // Toggling works mid-stream; the growing reasoning re-renders in place.
    const toggle = screen.getByTestId("reasoning-toggle");
    fireEvent.click(toggle);
    await nextTick();
    expect(screen.getByTestId("reasoning-content")).toBeVisible();

    rerender({ message: msg({ role: "assistant", reasoning: "so far and more", status: "streaming" }) });
    await nextTick();
    expect(screen.getByTestId("reasoning-content")).toBeVisible();
    expect(screen.getByTestId("reasoning-text").textContent).toContain("so far and more");
    expect(screen.getByTestId("reasoning-label")).toHaveClass("thinking-label");
  });

  it("stops animating the label once the turn is done", () => {
    render(MessageBubble, {
      props: { message: msg({ role: "assistant", reasoning: "thought", status: "done" }) },
    });

    const label = screen.getByTestId("reasoning-label");
    expect(label).not.toHaveClass("thinking-label");
    expect(label).toHaveClass("text-slate-500");
  });

  it("does not render a thinking block for user messages", () => {
    render(MessageBubble, {
      props: { message: msg({ role: "user", content: "hi", status: "done" }) },
    });

    expect(screen.queryByTestId("reasoning-block")).toBeNull();
    expect(screen.queryByTestId("reasoning-toggle")).toBeNull();
  });

  it("shows the animated thinking container while waiting (no reasoning yet)", () => {
    render(MessageBubble, {
      props: { message: msg({ role: "assistant", content: "", status: "streaming" }) },
    });

    expect(screen.getByTestId("reasoning-block")).toBeInTheDocument();
    // The word is the animated indicator and the container is collapsible before reasoning arrives.
    expect(screen.getByTestId("reasoning-label")).toHaveClass("thinking-label");
    expect(screen.getByTestId("reasoning-toggle")).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByTestId("reasoning-content")).not.toBeVisible();
  });

  it("keeps the same animated thinking container as reasoning tokens arrive", async () => {
    const { rerender } = render(MessageBubble, {
      props: { message: msg({ role: "assistant", content: "", status: "streaming" }) },
    });

    // Waiting: container present and animated.
    expect(screen.getByTestId("reasoning-block")).toBeInTheDocument();
    expect(screen.getByTestId("reasoning-label")).toHaveClass("thinking-label");

    // Reasoning starts: the same container persists (does not disappear) and stays animated.
    rerender({
      message: msg({ role: "assistant", content: "", reasoning: "step one", status: "streaming" }),
    });
    await nextTick();
    expect(screen.getByTestId("reasoning-block")).toBeInTheDocument();
    expect(screen.getByTestId("reasoning-label")).toHaveClass("thinking-label");
    expect(screen.getByTestId("reasoning-text").textContent).toContain("step one");
  });

  it("keeps the thinking container visible while content streams", () => {
    render(MessageBubble, {
      props: {
        message: msg({
          role: "assistant",
          content: "Answer text",
          reasoning: "thought",
          status: "streaming",
        }),
      },
    });

    expect(screen.getByTestId("reasoning-block")).toBeInTheDocument();
  });

  it("hides the thinking container once done with no reasoning", () => {
    render(MessageBubble, {
      props: { message: msg({ role: "assistant", content: "hello", status: "done" }) },
    });

    expect(screen.queryByTestId("reasoning-block")).toBeNull();
  });

  it("keeps the shimmer 'Thinking' while still inside the thinking stage", () => {
    render(MessageBubble, {
      props: {
        message: msg({
          role: "assistant",
          content: "",
          reasoning: "still in progress",
          status: "streaming",
          thinkingStartedAt: 1000,
        }),
      },
    });

    const label = screen.getByTestId("reasoning-label");
    expect(label).toHaveClass("thinking-label");
    expect(label.textContent?.trim()).toBe("Thinking");
  });

  it("swaps to a static 'Thought for <duration>' once the stage closes while answering", () => {
    render(MessageBubble, {
      props: {
        message: msg({
          role: "assistant",
          content: "Answer",
          reasoning: "thought",
          status: "streaming",
          thinkingStartedAt: 1000,
          thinkingEndedAt: 3000,
        }),
      },
    });

    const label = screen.getByTestId("reasoning-label");
    expect(label).not.toHaveClass("thinking-label");
    expect(label).toHaveClass("text-slate-500");
    expect(label.textContent?.trim()).toBe("Thought for 2s");
  });

  it("settles on a static 'Thought for <duration>' for a completed reasoning message", () => {
    render(MessageBubble, {
      props: {
        message: msg({
          role: "assistant",
          content: "Answer",
          reasoning: "thought",
          status: "done",
          thinkingStartedAt: 1000,
          thinkingEndedAt: 79000,
        }),
      },
    });

    const label = screen.getByTestId("reasoning-label");
    expect(label).not.toHaveClass("thinking-label");
    expect(label.textContent?.trim()).toBe("Thought for 1m 18s");
  });

  it("transitions shimmer -> duration in place when the answer begins", async () => {
    const { rerender } = render(MessageBubble, {
      props: {
        message: msg({
          role: "assistant",
          content: "",
          reasoning: "step one",
          status: "streaming",
          thinkingStartedAt: 1000,
        }),
      },
    });

    expect(screen.getByTestId("reasoning-label").textContent?.trim()).toBe("Thinking");
    expect(screen.getByTestId("reasoning-label")).toHaveClass("thinking-label");

    // First answer token closes the stage on the same mounted instance.
    rerender({
      message: msg({
        role: "assistant",
        content: "A",
        reasoning: "step one",
        status: "streaming",
        thinkingStartedAt: 1000,
        thinkingEndedAt: 6000,
      }),
    });
    await nextTick();

    const label = screen.getByTestId("reasoning-label");
    expect(label).not.toHaveClass("thinking-label");
    expect(label.textContent?.trim()).toBe("Thought for 5s");
  });
});

