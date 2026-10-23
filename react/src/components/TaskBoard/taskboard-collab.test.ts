import { describe, it, expect, afterEach, vi } from "vitest";
import {
  LOCK_TTL_MS,
  createBroadcastChannelTransport,
  emptyPresence,
  expirePresence,
  holderOf,
  presenceReducer,
  type PresenceState,
  type TaskBoardCollabEvent,
} from "../../../../common/taskboard";

const A = { id: "a", name: "Ana" };
const B = { id: "b", name: "Ben" };
const run = (events: unknown[], now = 1000, start: PresenceState = emptyPresence()) =>
  events.reduce<PresenceState>((s, e) => presenceReducer(s, e, now), start);

const grab = (userId: string, at: number): TaskBoardCollabEvent => ({ type: "grab", userId, cardId: "c1", at });

describe("presenceReducer", () => {
  it("earliest grab wins regardless of arrival order", () => {
    expect(holderOf(run([grab("b", 10), grab("a", 5)]), "c1")).toBe("a");
    expect(holderOf(run([grab("a", 5), grab("b", 10)]), "c1")).toBe("a");
  });

  it("tie on at breaks by userId", () => {
    expect(holderOf(run([grab("b", 5), grab("a", 5)]), "c1")).toBe("a");
    expect(holderOf(run([grab("a", 5), grab("b", 5)]), "c1")).toBe("a");
  });

  it("hover from a non-holder is ignored", () => {
    const s = run([
      grab("a", 5),
      { type: "hover", userId: "b", cardId: "c1", column: "x", lane: null, index: 0, at: 6 },
    ]);
    expect(s.holds.get("c1")!.hover).toBeUndefined();
  });

  it("hover from the holder records the target slot", () => {
    const s = run([
      grab("a", 5),
      { type: "hover", userId: "a", cardId: "c1", column: "x", lane: "l", index: 2, at: 6 },
    ]);
    expect(s.holds.get("c1")!.hover).toEqual({ column: "x", lane: "l", index: 2 });
  });

  it("release clears the hold", () => {
    const s = run([grab("a", 5), { type: "release", userId: "a", cardId: "c1", dropped: true, at: 7 }]);
    expect(holderOf(s, "c1")).toBeNull();
  });

  it("release from a non-holder does not clear the hold", () => {
    const s = run([grab("a", 5), { type: "release", userId: "b", cardId: "c1", dropped: false, at: 7 }]);
    expect(holderOf(s, "c1")).toBe("a");
  });

  it("leave clears every hold of that user and the peer", () => {
    const s = run([
      { type: "presence", user: A, at: 1 },
      grab("a", 5),
      { type: "grab", userId: "a", cardId: "c2", at: 6 },
      { type: "leave", userId: "a", at: 9 },
    ]);
    expect(holderOf(s, "c1")).toBeNull();
    expect(holderOf(s, "c2")).toBeNull();
    expect(s.peers.has("a")).toBe(false);
  });

  it("presence registers a peer", () => {
    const s = run([{ type: "presence", user: B, at: 1 }]);
    expect(s.peers.get("b")!.user.name).toBe("Ben");
  });

  it("unknown or malformed events return the same state reference", () => {
    const s0 = emptyPresence();
    expect(presenceReducer(s0, { type: "zap" }, 1)).toBe(s0);
    expect(presenceReducer(s0, null, 1)).toBe(s0);
    expect(presenceReducer(s0, 42, 1)).toBe(s0);
    expect(presenceReducer(s0, { type: "grab", userId: 3 }, 1)).toBe(s0);
  });
});

describe("expirePresence", () => {
  it("a silent holder expires after LOCK_TTL_MS", () => {
    const s = run([grab("a", 5)], 100);
    expect(holderOf(expirePresence(s, 100 + LOCK_TTL_MS - 1), "c1")).toBe("a");
    expect(holderOf(expirePresence(s, 100 + LOCK_TTL_MS + 1), "c1")).toBeNull();
  });

  it("a hover keeps the hold alive", () => {
    let s = run([grab("a", 5)], 100);
    s = presenceReducer(s, { type: "hover", userId: "a", cardId: "c1", column: "x", lane: null, index: 0, at: 7 }, 5000);
    expect(holderOf(expirePresence(s, 100 + LOCK_TTL_MS + 1), "c1")).toBe("a");
  });

  it("returns the same reference when nothing expired", () => {
    const s = run([grab("a", 5)], 100);
    expect(expirePresence(s, 200)).toBe(s);
  });
});

describe("createBroadcastChannelTransport", () => {
  const original = (globalThis as { BroadcastChannel?: unknown }).BroadcastChannel;
  afterEach(() => {
    (globalThis as { BroadcastChannel?: unknown }).BroadcastChannel = original;
  });

  it("delivers to a second instance and unsubscribes on close", () => {
    const channels = new Set<FakeChannel>();
    class FakeChannel {
      onmessage: ((e: { data: unknown }) => void) | null = null;
      constructor(public name: string) {
        channels.add(this);
      }
      postMessage(data: unknown) {
        for (const c of channels) if (c !== this && c.name === this.name) c.onmessage?.({ data });
      }
      close() {
        channels.delete(this);
      }
    }
    (globalThis as { BroadcastChannel?: unknown }).BroadcastChannel = FakeChannel;

    const t1 = createBroadcastChannelTransport("room");
    const t2 = createBroadcastChannelTransport("room");
    const got = vi.fn();
    const off = t2.subscribe(got);
    const ev: TaskBoardCollabEvent = { type: "presence", user: A, at: 1 };
    t1.publish(ev);
    expect(got).toHaveBeenCalledWith(ev);

    off();
    t1.publish(ev);
    expect(got).toHaveBeenCalledTimes(1);
    t2.close();
    t1.close();
    expect(channels.size).toBe(0);
  });

  it("publish after close is a no-op, not a throw (StrictMode tears down in any order)", () => {
    class ClosingChannel {
      onmessage: ((e: { data: unknown }) => void) | null = null;
      closed = false;
      constructor(public name: string) {}
      postMessage() {
        if (this.closed) throw new DOMException("Channel is closed", "InvalidStateError");
      }
      close() {
        this.closed = true;
      }
    }
    (globalThis as { BroadcastChannel?: unknown }).BroadcastChannel = ClosingChannel;
    const t = createBroadcastChannelTransport("room");
    t.close();
    expect(() => t.publish({ type: "leave", userId: "a", at: 1 })).not.toThrow();
  });
});
