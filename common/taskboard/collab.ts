/**
 * TaskBoard collaboration — the ephemeral "who holds what, and where is it
 * heading" channel.
 *
 * Card *data* never travels here: after a drop the app commits through its
 * own backend and every client receives the new `cards`. The transport only
 * carries presence and drag intent, so any pub/sub room (WebSocket, Supabase
 * Realtime, Firebase, Liveblocks, BroadcastChannel) fits in a few lines.
 *
 * Lock arbitration is a pure reducer that every client runs over the same
 * events, so they all agree on the holder without a server: the earliest
 * `grab` wins (`at`, ties broken by `userId`), and a holder that goes quiet
 * for `LOCK_TTL_MS` loses the lock.
 */

import type { TaskBoardSlot, TaskBoardUser } from "./types";

/** How often a client announces itself. */
export const PRESENCE_HEARTBEAT_MS = 5000;
/** A peer (and its holds) silent this long is gone — covers a closed laptop mid-drag. */
export const LOCK_TTL_MS = 8000;
/** Minimum gap between published hover events (≤ 20 Hz). */
export const HOVER_THROTTLE_MS = 50;

export type TaskBoardCollabEvent =
  | { type: "presence"; user: TaskBoardUser; at: number }
  | { type: "leave"; userId: string; at: number }
  | { type: "grab"; userId: string; cardId: string; at: number }
  | {
      type: "hover";
      userId: string;
      cardId: string;
      column: string;
      lane: string | null;
      index: number;
      at: number;
    }
  | { type: "release"; userId: string; cardId: string; dropped: boolean; at: number };

/** Anything that can publish an event and deliver everyone else's. */
export interface TaskBoardTransport {
  publish(event: TaskBoardCollabEvent): void;
  /** Returns the unsubscribe function. */
  subscribe(handler: (event: TaskBoardCollabEvent) => void): () => void;
}

export interface TaskBoardHold {
  userId: string;
  /** The grab's own timestamp — the arbitration key. */
  at: number;
  /** Local receive time of the holder's last sign of life. */
  seen: number;
  /** Where the holder is currently pointing the card. */
  hover?: TaskBoardSlot;
}

export interface PresenceState {
  peers: Map<string, { user: TaskBoardUser; lastSeen: number }>;
  holds: Map<string, TaskBoardHold>;
}

export function emptyPresence(): PresenceState {
  return { peers: new Map(), holds: new Map() };
}

const isStr = (v: unknown): v is string => typeof v === "string";
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** Narrow untrusted input (it came off a network) to a well-formed event. */
export function parseCollabEvent(raw: unknown): TaskBoardCollabEvent | null {
  if (!raw || typeof raw !== "object") return null;
  const e = raw as Record<string, unknown>;
  if (!isNum(e.at)) return null;
  switch (e.type) {
    case "presence": {
      const u = e.user as Record<string, unknown> | undefined;
      return u && isStr(u.id) && isStr(u.name) ? (e as TaskBoardCollabEvent) : null;
    }
    case "leave":
      return isStr(e.userId) ? (e as TaskBoardCollabEvent) : null;
    case "grab":
      return isStr(e.userId) && isStr(e.cardId) ? (e as TaskBoardCollabEvent) : null;
    case "release":
      return isStr(e.userId) && isStr(e.cardId) ? (e as TaskBoardCollabEvent) : null;
    case "hover":
      return isStr(e.userId) &&
        isStr(e.cardId) &&
        isStr(e.column) &&
        (e.lane === null || isStr(e.lane)) &&
        isNum(e.index)
        ? (e as TaskBoardCollabEvent)
        : null;
    default:
      return null;
  }
}

function touchPeer(state: PresenceState, userId: string, now: number): PresenceState["peers"] {
  const peer = state.peers.get(userId);
  if (!peer) return state.peers;
  const peers = new Map(state.peers);
  peers.set(userId, { ...peer, lastSeen: now });
  return peers;
}

/** Earlier grab wins; an equal timestamp goes to the lower user id. */
function beats(a: { userId: string; at: number }, b: { userId: string; at: number }): boolean {
  return a.at < b.at || (a.at === b.at && a.userId < b.userId);
}

/**
 * Fold one event into the presence state. Pure; malformed or unknown events
 * return the same reference, so callers can bail out of a re-render.
 */
export function presenceReducer(state: PresenceState, raw: unknown, now: number): PresenceState {
  const event = parseCollabEvent(raw);
  if (!event) return state;

  switch (event.type) {
    case "presence": {
      const peers = new Map(state.peers);
      peers.set(event.user.id, { user: event.user, lastSeen: now });
      let holds = state.holds;
      for (const [cardId, h] of state.holds) {
        if (h.userId !== event.user.id) continue;
        if (holds === state.holds) holds = new Map(state.holds);
        holds.set(cardId, { ...h, seen: now });
      }
      return { peers, holds };
    }
    case "leave": {
      const peers = new Map(state.peers);
      peers.delete(event.userId);
      const holds = new Map(state.holds);
      for (const [cardId, h] of state.holds) if (h.userId === event.userId) holds.delete(cardId);
      return { peers, holds };
    }
    case "grab": {
      const current = state.holds.get(event.cardId);
      if (current && current.userId !== event.userId && !beats(event, current)) {
        return { ...state, peers: touchPeer(state, event.userId, now) };
      }
      const holds = new Map(state.holds);
      holds.set(event.cardId, { userId: event.userId, at: event.at, seen: now });
      return { peers: touchPeer(state, event.userId, now), holds };
    }
    case "hover": {
      const current = state.holds.get(event.cardId);
      if (!current || current.userId !== event.userId) return state;
      const holds = new Map(state.holds);
      holds.set(event.cardId, {
        ...current,
        seen: now,
        hover: { column: event.column, lane: event.lane, index: event.index },
      });
      return { peers: touchPeer(state, event.userId, now), holds };
    }
    case "release": {
      const current = state.holds.get(event.cardId);
      if (!current || current.userId !== event.userId) return state;
      const holds = new Map(state.holds);
      holds.delete(event.cardId);
      return { peers: touchPeer(state, event.userId, now), holds };
    }
  }
}

/** Drop peers and holds that have been silent for longer than `LOCK_TTL_MS`. */
export function expirePresence(state: PresenceState, now: number): PresenceState {
  let peers = state.peers;
  let holds = state.holds;
  for (const [id, p] of state.peers) {
    if (now - p.lastSeen <= LOCK_TTL_MS) continue;
    if (peers === state.peers) peers = new Map(state.peers);
    peers.delete(id);
  }
  for (const [cardId, h] of state.holds) {
    if (now - h.seen <= LOCK_TTL_MS) continue;
    if (holds === state.holds) holds = new Map(state.holds);
    holds.delete(cardId);
  }
  return peers === state.peers && holds === state.holds ? state : { peers, holds };
}

export function holderOf(state: PresenceState, cardId: string): string | null {
  return state.holds.get(cardId)?.userId ?? null;
}

/**
 * Reference transport: syncs tabs of the same browser over a
 * `BroadcastChannel` — no server, so the collaboration layer can be tried by
 * opening the page twice. A channel never receives its own messages.
 */
export function createBroadcastChannelTransport(
  roomId: string,
): TaskBoardTransport & { close(): void } {
  const channel = new BroadcastChannel(`taskboard:${roomId}`);
  const handlers = new Set<(event: TaskBoardCollabEvent) => void>();
  // Teardown order is not ours to pick (StrictMode remounts, an app closing
  // the room before the board says goodbye) — a closed channel goes quiet.
  let closed = false;
  channel.onmessage = (e: MessageEvent) => {
    for (const h of handlers) h(e.data as TaskBoardCollabEvent);
  };
  return {
    publish: (event) => {
      if (!closed) channel.postMessage(event);
    },
    subscribe(handler) {
      handlers.add(handler);
      return () => {
        handlers.delete(handler);
      };
    },
    close() {
      closed = true;
      handlers.clear();
      channel.close();
    },
  };
}
