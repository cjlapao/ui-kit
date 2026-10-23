/**
 * TaskBoardRemoteGhosts — where each teammate is about to drop the card they
 * hold. A fixed overlay portaled above the board: it is measured against the
 * buckets but never inserted into them, so a peer's drag cannot move a
 * single pixel of your own layout (or your own drag's target).
 */

import React, { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import {
  bucketKey,
  getTaskBoardPeerTokens,
  peerColor,
  type PresenceState,
  type TaskBoardCard,
  type TaskBoardUser,
} from "../../../../common/taskboard";

interface Ghost {
  key: string;
  peer: TaskBoardUser;
  bucket: string;
  title: string;
  top: number;
  left: number;
  width: number;
}

export interface TaskBoardRemoteGhostsProps {
  rootRef: React.RefObject<HTMLElement | null>;
  holds: PresenceState["holds"];
  selfId?: string;
  cards: TaskBoardCard[];
  userById: (id: string) => TaskBoardUser;
}

const GHOST_HEIGHT = 40;

export const TaskBoardRemoteGhosts: React.FC<TaskBoardRemoteGhostsProps> = ({ rootRef, holds, selfId, cards, userById }) => {
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const [tick, setTick] = useState(0);

  // Re-measure when the board scrolls or the window resizes.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const bump = () => setTick((t) => t + 1);
    root.addEventListener("scroll", bump, true);
    window.addEventListener("resize", bump);
    return () => {
      root.removeEventListener("scroll", bump, true);
      window.removeEventListener("resize", bump);
    };
  }, [rootRef]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const next: Ghost[] = [];
    for (const [cardId, hold] of holds) {
      if (hold.userId === selfId || !hold.hover) continue;
      const key = bucketKey(hold.hover.column, hold.hover.lane);
      const bucket = root.querySelector<HTMLElement>(`[data-bucket="${CSS.escape(key)}"]`);
      if (!bucket) continue;
      // The held card still sits in its old slot on my board — skip it.
      const list = [...bucket.querySelectorAll<HTMLElement>("[data-card-id]")].filter(
        (el) => el.getAttribute("data-card-id") !== cardId,
      );
      const b = bucket.getBoundingClientRect();
      const at = list[hold.hover.index];
      const prev = list[list.length - 1];
      const top = at
        ? at.getBoundingClientRect().top - GHOST_HEIGHT / 2
        : prev
          ? prev.getBoundingClientRect().bottom + 4
          : b.top;
      next.push({
        key: `${hold.userId}:${cardId}`,
        peer: userById(hold.userId),
        bucket: key,
        title: cards.find((c) => c.id === cardId)?.title ?? "",
        top,
        left: b.left,
        width: b.width,
      });
    }
    setGhosts(next);
  }, [rootRef, holds, selfId, cards, userById, tick]);

  if (!ghosts.length || typeof document === "undefined") return null;
  return createPortal(
    <>
      {ghosts.map((g) => {
        const tokens = getTaskBoardPeerTokens(g.peer.color ?? peerColor(g.peer.id));
        return (
          <div
            key={g.key}
            data-taskboard-ghost
            data-peer-id={g.peer.id}
            data-ghost-bucket={g.bucket}
            aria-hidden="true"
            className={classNames(
              "pointer-events-none fixed z-[900] flex items-center rounded-lg border-2 border-dashed px-3 text-xs font-medium shadow-sm backdrop-blur-sm transition-transform duration-150 ease-out motion-reduce:transition-none",
              tokens.ghost,
            )}
            style={{ top: 0, left: 0, width: g.width, height: GHOST_HEIGHT, transform: `translate3d(${g.left}px, ${g.top}px, 0)` }}
          >
            <span className="truncate opacity-80">{g.title}</span>
            <span className={classNames("absolute -top-2.5 right-2 rounded px-1.5 py-0.5 text-[10px] leading-none", tokens.label)}>
              {g.peer.name}
            </span>
          </div>
        );
      })}
    </>,
    document.body,
  );
};
