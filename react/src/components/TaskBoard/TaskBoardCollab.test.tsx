import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import {
  TaskBoard,
  sampleTaskBoard,
  LOCK_TTL_MS,
  type TaskBoardCollabEvent,
  type TaskBoardProps,
  type TaskBoardTransport,
} from "./index";

const roadmap = sampleTaskBoard.roadmap();
const ME = { id: "me", name: "Carla Mendes" };
const BEN = { id: "ben", name: "Ben Ito" };
const cardEl = (id: string) => document.querySelector(`[data-card-id="${id}"]`) as HTMLElement;

function fakeTransport() {
  const handlers = new Set<(e: TaskBoardCollabEvent) => void>();
  const published: TaskBoardCollabEvent[] = [];
  const transport: TaskBoardTransport = {
    publish: (e) => published.push(e),
    subscribe: (h) => {
      handlers.add(h);
      return () => handlers.delete(h);
    },
  };
  const emit = (e: unknown) =>
    act(() => {
      for (const h of handlers) h(e as TaskBoardCollabEvent);
    });
  return { transport, published, handlers, emit };
}

function renderBoard(t: ReturnType<typeof fakeTransport>, props: Partial<TaskBoardProps> = {}) {
  const onCardsChange = vi.fn();
  const utils = render(
    <TaskBoard
      cards={roadmap.cards}
      columns={roadmap.columns}
      onCardsChange={onCardsChange}
      transport={t.transport}
      currentUser={ME}
      title="Board"
      {...props}
    />,
  );
  return { ...utils, onCardsChange };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("TaskBoard collaboration", () => {
  it("a peer's grab locks the card: aria-disabled, no pointer or keyboard grab", () => {
    const t = fakeTransport();
    renderBoard(t);
    t.emit({ type: "presence", user: BEN, at: Date.now() });
    t.emit({ type: "grab", userId: "ben", cardId: "r1", at: Date.now() });
    const card = cardEl("r1");
    expect(card.getAttribute("aria-disabled")).toBe("true");
    expect(card.getAttribute("data-held-by")).toBe("ben");
    expect(card.getAttribute("title")).toBe("Ben Ito is moving this");

    fireEvent.pointerDown(card, { clientX: 10, clientY: 10, button: 0 });
    fireEvent(window, new PointerEvent("pointermove", { clientX: 200, clientY: 200 }));
    expect(document.querySelector("[data-taskboard-clone]")).toBeNull();
    fireEvent(window, new PointerEvent("pointerup", { clientX: 200, clientY: 200 }));

    fireEvent.keyDown(cardEl("r1"), { key: " " });
    expect(cardEl("r1").getAttribute("data-grabbed")).toBeNull();
  });

  it("a peer's hover renders a ghost with their name in the target bucket", () => {
    const t = fakeTransport();
    renderBoard(t);
    t.emit({ type: "presence", user: BEN, at: 1 });
    t.emit({ type: "grab", userId: "ben", cardId: "r1", at: 1 });
    t.emit({ type: "hover", userId: "ben", cardId: "r1", column: "discovery", lane: null, index: 0, at: 2 });
    const ghost = document.querySelector('[data-taskboard-ghost][data-peer-id="ben"]') as HTMLElement;
    expect(ghost).toBeTruthy();
    expect(ghost.getAttribute("data-ghost-bucket")).toBe("discovery::");
    expect(ghost.textContent).toContain("Ben Ito");
    // The ghost is an overlay — my own layout is untouched.
    expect([...document.querySelectorAll('[data-bucket="discovery::"] [data-card-id]')].length).toBe(3);
  });

  it("an earlier peer grab during my drag cancels my drag and emits nothing", () => {
    const t = fakeTransport();
    const { onCardsChange } = renderBoard(t);
    t.emit({ type: "presence", user: BEN, at: 1 });
    fireEvent.keyDown(cardEl("r1"), { key: " " });
    fireEvent.keyDown(cardEl("r1"), { key: "ArrowRight" });
    expect(cardEl("r1").getAttribute("data-grabbed")).toBe("true");
    // Ben's grab carries an earlier timestamp than mine — he wins everywhere.
    t.emit({ type: "grab", userId: "ben", cardId: "r1", at: 0 });
    expect(cardEl("r1").getAttribute("data-grabbed")).toBeNull();
    expect(cardEl("r1").closest("[data-bucket]")!.getAttribute("data-bucket")).toBe("ideas::");
    expect(onCardsChange).not.toHaveBeenCalled();
    expect(document.body.textContent).toContain("Ben Ito has this");
  });

  it("a peer silent for longer than LOCK_TTL_MS releases the lock", () => {
    vi.useFakeTimers();
    const t = fakeTransport();
    renderBoard(t);
    t.emit({ type: "presence", user: BEN, at: Date.now() });
    t.emit({ type: "grab", userId: "ben", cardId: "r1", at: Date.now() });
    expect(cardEl("r1").getAttribute("aria-disabled")).toBe("true");
    act(() => {
      vi.advanceTimersByTime(LOCK_TTL_MS + 1500);
    });
    expect(cardEl("r1").getAttribute("aria-disabled")).toBeNull();
  });

  it("publishes presence, then grab / hover / release around a local move", () => {
    const t = fakeTransport();
    renderBoard(t);
    fireEvent.keyDown(cardEl("r1"), { key: " " });
    fireEvent.keyDown(cardEl("r1"), { key: "ArrowRight" });
    fireEvent.keyDown(cardEl("r1"), { key: " " });
    const types = t.published.map((e) => e.type);
    expect(types[0]).toBe("presence");
    const grab = types.indexOf("grab");
    const hover = types.indexOf("hover", grab);
    const release = types.indexOf("release", hover);
    expect(grab).toBeGreaterThan(0);
    expect(hover).toBeGreaterThan(grab);
    expect(release).toBeGreaterThan(hover);
    const last = t.published[release] as Extract<TaskBoardCollabEvent, { type: "release" }>;
    expect(last).toMatchObject({ userId: "me", cardId: "r1", dropped: true });
  });

  it("unmount publishes leave, unsubscribes, and ignores later events", () => {
    const t = fakeTransport();
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const { unmount } = renderBoard(t);
    const handler = [...t.handlers][0];
    unmount();
    expect(t.published[t.published.length - 1]).toMatchObject({ type: "leave", userId: "me" });
    expect(t.handlers.size).toBe(0);
    handler({ type: "grab", userId: "ben", cardId: "r1", at: 1 });
    expect(errors).not.toHaveBeenCalled();
    errors.mockRestore();
  });

  it("a transport that throws on publish (closed socket) never crashes the board", () => {
    const t = fakeTransport();
    const { unmount } = renderBoard(t);
    t.transport.publish = () => {
      throw new Error("Channel is closed");
    };
    expect(() => fireEvent.keyDown(cardEl("r1"), { key: " " })).not.toThrow();
    expect(() => unmount()).not.toThrow();
  });

  it("malformed and unknown events are ignored", () => {
    const t = fakeTransport();
    renderBoard(t);
    t.emit({ type: "zap" });
    t.emit(null);
    t.emit({ type: "grab", cardId: 7 });
    expect(cardEl("r1").getAttribute("aria-disabled")).toBeNull();
  });

  it("answers a newcomer's presence at once, so they see who is here without waiting for a heartbeat", () => {
    const t = fakeTransport();
    renderBoard(t);
    const before = t.published.filter((e) => e.type === "presence").length;
    t.emit({ type: "presence", user: BEN, at: 1 });
    expect(t.published.filter((e) => e.type === "presence").length).toBe(before + 1);
    // A peer already known is not answered again — no echo loop.
    t.emit({ type: "presence", user: BEN, at: 2 });
    expect(t.published.filter((e) => e.type === "presence").length).toBe(before + 1);
  });

  it("the header lists who is on the board", () => {
    const t = fakeTransport();
    renderBoard(t);
    t.emit({ type: "presence", user: BEN, at: 1 });
    const people = document.querySelector("[data-taskboard-people]") as HTMLElement;
    expect(people.getAttribute("aria-label")).toBe("2 online");
  });

  it("without a transport nothing runs — collaboration adds no timers", () => {
    vi.useFakeTimers();
    // Baseline: the board's own timers (ScrollArea measuring, etc.).
    const plain = render(<TaskBoard cards={roadmap.cards} columns={roadmap.columns} />);
    const baseline = vi.getTimerCount();
    plain.unmount();
    vi.clearAllTimers();
    render(<TaskBoard cards={roadmap.cards} columns={roadmap.columns} currentUser={ME} />);
    expect(vi.getTimerCount()).toBe(baseline);
  });
});
