import { useEffect, useMemo, useState } from "react";
import {
  Pill,
  TaskBoard,
  createBroadcastChannelTransport,
  peerColor,
  sampleTaskBoard,
  type TaskBoardCard,
  type TaskBoardUser,
} from "@cjlapao/ui-kit";

/**
 * Two channels, two jobs — the split the board is built around:
 *
 * - `transport` (the board's) carries only who holds which card and where it
 *   is heading. Any pub/sub room fits; this one is a BroadcastChannel, so
 *   tabs of this browser are the "teammates".
 * - The cards themselves are the app's data. After a drop the app saves
 *   them its own way — here a second BroadcastChannel stands in for the
 *   backend, so every tab ends up with the same cards.
 */
const sample = sampleTaskBoard.roadmap();
const NAMES = ["Ana", "Ben", "Chloé", "Dev", "Eli", "Femi", "Gus", "Hana"];
const ROOM = "kit-docs-demo";

export default function LiveCollaboration() {
  const me = useMemo<TaskBoardUser>(() => {
    const id = `tab-${Math.random().toString(36).slice(2, 8)}`;
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    return { id, name, color: peerColor(id) };
  }, []);
  const [cards, setCards] = useState<TaskBoardCard[]>(sample.cards);
  const [transport, setTransport] = useState<ReturnType<typeof createBroadcastChannelTransport>>();
  const [data, setData] = useState<BroadcastChannel>();

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const t = createBroadcastChannelTransport(ROOM);
    const d = new BroadcastChannel(`${ROOM}:cards`);
    d.onmessage = (e: MessageEvent<TaskBoardCard[]>) => setCards(e.data);
    setTransport(t);
    setData(d);
    return () => {
      t.close();
      d.close();
    };
  }, []);

  return (
    <div className="w-full">
      <TaskBoard
        cards={cards}
        columns={sample.columns}
        priorities={sample.priorities}
        onCardsChange={(next) => {
          setCards(next);
          data?.postMessage(next);
        }}
        transport={transport}
        currentUser={me}
        title="Live board"
        subtitle="Open this page in a second tab and drag a card"
        summary={
          <Pill size="sm" variant="soft" tone={me.color}>
            You are {me.name}
          </Pill>
        }
        height={520}
      />
    </div>
  );
}
