/**
 * useTaskBoardCollab — binds a `TaskBoardTransport` to the board.
 *
 * Folds every peer event (and every local one) through the pure
 * `presenceReducer`, so all clients arbitrate holds the same way; heartbeats
 * presence; expires silent peers; publishes this client's grab / hover /
 * release around its own drags; and says goodbye on unmount and `pagehide`.
 * Without a transport and a current user it does nothing — no timers.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  HOVER_THROTTLE_MS,
  PRESENCE_HEARTBEAT_MS,
  emptyPresence,
  expirePresence,
  presenceReducer,
  type PresenceState,
  type TaskBoardCollabEvent,
  type TaskBoardSlot,
  type TaskBoardTransport,
  type TaskBoardUser,
} from "../../../../common/taskboard";

const EXPIRE_TICK_MS = 1000;

export interface TaskBoardCollab {
  presence: PresenceState;
  /** Everyone else on the board. */
  peers: TaskBoardUser[];
  /** cardId → userId of its holder (yourself included). */
  heldBy: Map<string, string>;
  userById: (id: string) => TaskBoardUser;
  grab: (cardId: string) => void;
  hover: (cardId: string, slot: TaskBoardSlot) => void;
  release: (cardId: string, dropped: boolean) => void;
}

export function useTaskBoardCollab(transport?: TaskBoardTransport, currentUser?: TaskBoardUser): TaskBoardCollab {
  const [presence, setPresence] = useState<PresenceState>(emptyPresence);
  const active = Boolean(transport && currentUser);
  const mountedRef = useRef(false);
  const userRef = useRef(currentUser);
  userRef.current = currentUser;
  const hoverRef = useRef<{ last: number; timer: ReturnType<typeof setTimeout> | null }>({ last: 0, timer: null });

  const apply = useCallback((event: unknown) => {
    if (!mountedRef.current) return;
    const now = Date.now();
    setPresence((s) => presenceReducer(s, event, now));
  }, []);

  /** Publish to peers and fold into our own state — we never receive our own events. */
  const send = useCallback(
    (event: TaskBoardCollabEvent) => {
      if (!transport) return;
      safePublish(transport, event);
      apply(event);
    },
    [transport, apply],
  );

  const userId = currentUser?.id;
  useEffect(() => {
    if (!transport || !userId) return;
    mountedRef.current = true;
    const hello = () => {
      const user = userRef.current;
      if (user) send({ type: "presence", user, at: Date.now() });
    };
    // Answer a newcomer at once, so they learn who is already here without
    // waiting up to a heartbeat. A known peer is not answered — no echo loop.
    const known = new Set<string>();
    const unsubscribe = transport.subscribe((event) => {
      if (!mountedRef.current) return;
      const e = event as Partial<TaskBoardCollabEvent> & { user?: { id?: unknown } };
      if (e?.type === "presence" && typeof e.user?.id === "string" && e.user.id !== userId) {
        if (!known.has(e.user.id)) {
          known.add(e.user.id);
          hello();
        }
      } else if (e?.type === "leave" && typeof (e as { userId?: unknown }).userId === "string") {
        known.delete((e as { userId: string }).userId);
      }
      apply(event);
    });
    const bye = () => safePublish(transport, { type: "leave", userId, at: Date.now() });
    hello();
    const heartbeat = setInterval(hello, PRESENCE_HEARTBEAT_MS);
    const expire = setInterval(() => {
      if (mountedRef.current) setPresence((s) => expirePresence(s, Date.now()));
    }, EXPIRE_TICK_MS);
    window.addEventListener("pagehide", bye);
    const hover = hoverRef.current;
    return () => {
      mountedRef.current = false;
      clearInterval(heartbeat);
      clearInterval(expire);
      if (hover.timer) clearTimeout(hover.timer);
      window.removeEventListener("pagehide", bye);
      bye();
      unsubscribe();
      setPresence(emptyPresence());
    };
  }, [transport, userId, apply, send]);

  const grab = useCallback(
    (cardId: string) => {
      if (userId) send({ type: "grab", userId, cardId, at: Date.now() });
    },
    [send, userId],
  );

  const hover = useCallback(
    (cardId: string, slot: TaskBoardSlot) => {
      if (!userId) return;
      const h = hoverRef.current;
      const fire = () => {
        h.last = Date.now();
        h.timer = null;
        send({ type: "hover", userId, cardId, column: slot.column, lane: slot.lane, index: slot.index, at: h.last });
      };
      if (h.timer) clearTimeout(h.timer);
      const wait = HOVER_THROTTLE_MS - (Date.now() - h.last);
      // Leading edge now, trailing edge later — the last position always lands.
      if (wait <= 0) fire();
      else h.timer = setTimeout(fire, wait);
    },
    [send, userId],
  );

  const release = useCallback(
    (cardId: string, dropped: boolean) => {
      if (!userId) return;
      const h = hoverRef.current;
      if (h.timer) clearTimeout(h.timer);
      h.timer = null;
      send({ type: "release", userId, cardId, dropped, at: Date.now() });
    },
    [send, userId],
  );

  const peers = useMemo(
    () => [...presence.peers.values()].map((p) => p.user).filter((u) => u.id !== userId),
    [presence.peers, userId],
  );
  const heldBy = useMemo(() => {
    const m = new Map<string, string>();
    for (const [cardId, h] of presence.holds) m.set(cardId, h.userId);
    return m;
  }, [presence.holds]);
  const userById = useCallback(
    (id: string): TaskBoardUser => presence.peers.get(id)?.user ?? { id, name: id },
    [presence.peers],
  );

  return active
    ? { presence, peers, heldBy, userById, grab, hover, release }
    : { presence, peers: [], heldBy, userById, grab: noop, hover: noop, release: noop };
}

function noop() {}

/**
 * A transport is the app's — a socket that has closed may throw on send.
 * Presence is best-effort: a lost event is covered by the heartbeat and the
 * lock TTL, so it must never take the board down with it.
 */
function safePublish(transport: TaskBoardTransport, event: TaskBoardCollabEvent) {
  try {
    transport.publish(event);
  } catch {
    // Dropped on purpose — see above.
  }
}
