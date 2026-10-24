/**
 * useTaskBoardKeyboard — focus, selection and keyboard moves for TaskBoard.
 *
 * - Roving tab stop: one card is tabbable; arrows walk the board (up/down in
 *   a bucket, left/right across columns, Alt+up/down across lanes).
 * - Space grabs a card; arrows then move it through valid slots only
 *   (`keyboardTarget`), Space drops, Escape cancels. Every step is announced
 *   through the board's polite live region.
 * - Click selects, Ctrl/⌘-click toggles, Shift-click selects a range in the
 *   bucket. A modifier click only selects — it does not open the card.
 * - RTL boards swap Left/Right.
 */

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import {
  bucketCards,
  bucketKey,
  keyboardTarget,
  type KeyboardDirection,
  type TaskBoardCard,
  type TaskBoardColumn,
  type TaskBoardLane,
  type TaskBoardSlot,
} from "../../../../common/taskboard";
import type { TaskBoardText } from "./labels";
import type { TaskBoardContextMenuPayload } from "./context";
import type { TaskBoardDragState } from "./useTaskBoardDrag";

export interface UseTaskBoardKeyboardOptions {
  rootRef: React.RefObject<HTMLElement | null>;
  cards: TaskBoardCard[];
  /** Cards in their on-screen order (the live preview). */
  viewCards: TaskBoardCard[];
  columns: TaskBoardColumn[];
  lanes?: TaskBoardLane[];
  heldBy?: Map<string, string>;
  selfId?: string;
  /** Board-wide default for `column.maxItems`. */
  maxItems?: number;
  text: TaskBoardText;
  drag: TaskBoardDragState | null;
  keyboardGrab: (card: TaskBoardCard, from: TaskBoardSlot) => boolean;
  keyboardMove: (to: TaskBoardSlot) => void;
  finish: () => Promise<boolean>;
  cancel: (reason?: string) => void;
  onCardContextMenu?: (payload: TaskBoardContextMenuPayload) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

const isRtl = (el: Element | null) => el?.closest("[dir]")?.getAttribute("dir") === "rtl";

export function useTaskBoardKeyboard(o: UseTaskBoardKeyboardOptions) {
  const { rootRef, cards, viewCards, columns, lanes, text, drag } = o;
  const [message, setMessage] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ownSelection, setOwnSelection] = useState<string[]>([]);
  const selection = o.selectedIds ?? ownSelection;
  const anchorRef = useRef<string | null>(null);
  const refocusRef = useRef<string | null>(null);

  const viewBuckets = useMemo(() => bucketCards(viewCards, columns, lanes), [viewCards, columns, lanes]);
  // The tab stop: the focused card, else the first card on screen.
  const firstId = useMemo(() => {
    for (const cards of viewBuckets.values()) if (cards.length) return cards[0].id;
    return null;
  }, [viewBuckets]);
  const tabStop = activeId && viewCards.some((c) => c.id === activeId) ? activeId : firstId;

  // Refocus a card after it re-mounted in another bucket (keyboard moves).
  useLayoutEffect(() => {
    const id = refocusRef.current;
    if (!id) return;
    refocusRef.current = null;
    rootRef.current?.querySelector<HTMLElement>(`[data-card-id="${CSS.escape(id)}"]`)?.focus();
  });

  const announce = useCallback((s: string) => setMessage(s), []);
  const columnTitle = useCallback((id: string) => columns.find((c) => c.id === id)?.title ?? id, [columns]);

  const announceSlot = useCallback(
    (cardId: string, to: TaskBoardSlot) => {
      const others = bucketCards(cards.filter((c) => c.id !== cardId), columns, lanes);
      const total = (others.get(bucketKey(to.column, to.lane))?.length ?? 0) + 1;
      const values = { column: columnTitle(to.column), index: to.index + 1, total };
      const lane = to.lane ? lanes?.find((l) => l.id === to.lane)?.title : undefined;
      announce(lane ? text("movedLane", { ...values, lane }) : text("moved", values));
    },
    [announce, cards, columns, lanes, columnTitle, text],
  );

  const setSelection = useCallback(
    (ids: string[]) => {
      if (o.selectedIds === undefined) setOwnSelection(ids);
      o.onSelectionChange?.(ids);
    },
    [o],
  );

  /** Focus navigation through the DOM, in on-screen order. */
  const focusStep = useCallback(
    (from: HTMLElement, dir: KeyboardDirection) => {
      const root = rootRef.current;
      const bucket = from.closest<HTMLElement>("[data-bucket]");
      if (!root || !bucket) return;
      const inBucket = [...bucket.querySelectorAll<HTMLElement>("[data-card-id]")];
      const i = inBucket.indexOf(from);
      let target: HTMLElement | undefined;
      if (dir === "up" || dir === "down") {
        target = inBucket[i + (dir === "down" ? 1 : -1)];
      } else {
        const across = dir === "left" || dir === "right";
        const attr = across ? "data-bucket-lane" : "data-bucket-column";
        const value = bucket.getAttribute(attr) ?? "";
        const row = [...root.querySelectorAll<HTMLElement>(`[data-bucket][${attr}="${CSS.escape(value)}"]`)];
        const step = dir === "right" || dir === "lane-down" ? 1 : -1;
        for (let b = row.indexOf(bucket) + step; b >= 0 && b < row.length; b += step) {
          const list = row[b].querySelectorAll<HTMLElement>("[data-card-id]");
          if (list.length) {
            target = list[Math.min(i, list.length - 1)];
            break;
          }
        }
      }
      target?.focus();
    },
    [rootRef],
  );

  const keyDirection = (e: React.KeyboardEvent, el: Element): KeyboardDirection | null => {
    const rtl = isRtl(el);
    switch (e.key) {
      case "ArrowUp":
        return e.altKey ? "lane-up" : "up";
      case "ArrowDown":
        return e.altKey ? "lane-down" : "down";
      case "ArrowLeft":
        return rtl ? "right" : "left";
      case "ArrowRight":
        return rtl ? "left" : "right";
      default:
        return null;
    }
  };

  const cardProps = useCallback(
    (card: TaskBoardCard, slot: TaskBoardSlot): React.HTMLAttributes<HTMLDivElement> => ({
      tabIndex: card.id === tabStop ? 0 : -1,
      onFocus: () => setActiveId(card.id),
      onClick: (e) => {
        const ids = selection;
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          anchorRef.current = card.id;
          setSelection(ids.includes(card.id) ? ids.filter((x) => x !== card.id) : [...ids, card.id]);
          return;
        }
        if (e.shiftKey && anchorRef.current) {
          e.preventDefault();
          const list = viewBuckets.get(bucketKey(slot.column, slot.lane)) ?? [];
          const a = list.findIndex((c) => c.id === anchorRef.current);
          const b = list.findIndex((c) => c.id === card.id);
          if (a !== -1 && b !== -1) {
            const range = list.slice(Math.min(a, b), Math.max(a, b) + 1).map((c) => c.id);
            setSelection([...ids.filter((x) => !range.includes(x)), ...range]);
            return;
          }
        }
        anchorRef.current = card.id;
        setSelection([card.id]);
      },
      onKeyDown: (e) => {
        const grabbed = drag?.keyboard && drag.cardId === card.id;
        const el = e.currentTarget;
        if (grabbed) {
          const dir = keyDirection(e, el);
          if (dir) {
            e.preventDefault();
            const to = keyboardTarget(
              { cards, columns, lanes, heldBy: o.heldBy, selfId: o.selfId, maxItems: o.maxItems },
              drag.to ?? drag.from,
              card.id,
              dir,
            );
            if (to) {
              o.keyboardMove(to);
              refocusRef.current = card.id;
              announceSlot(card.id, to);
            }
          } else if (e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            const target = drag.to ?? drag.from;
            refocusRef.current = card.id;
            announce(text("dropped", { title: card.title, column: columnTitle(target.column) }));
            void o.finish().then((ok) => {
              if (!ok && (target.column !== drag.from.column || target.lane !== drag.from.lane || target.index !== drag.from.index)) {
                announce(text("cancelled"));
              }
            });
          } else if (e.key === "Escape") {
            e.preventDefault();
            refocusRef.current = card.id;
            o.cancel("escape");
            announce(text("cancelled"));
          } else if (e.key === "Tab") {
            // Leaving the card must not strand the grab — teammates would see
            // the card locked for as long as this tab stays open.
            o.cancel("blur");
            announce(text("cancelled"));
          } else if (e.key === "Enter") {
            // Enter must not open the editor mid-move.
            e.preventDefault();
          }
          return;
        }
        if (e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          if (o.keyboardGrab(card, slot)) {
            refocusRef.current = card.id;
            announce(text("grabbed", { title: card.title }));
          }
          return;
        }
        if ((e.key === "F10" && e.shiftKey) || e.key === "ContextMenu") {
          if (!o.onCardContextMenu) return;
          e.preventDefault();
          const r = el.getBoundingClientRect();
          o.onCardContextMenu({
            card,
            column: slot.column,
            lane: slot.lane,
            index: slot.index,
            x: r.left + r.width / 2,
            y: r.top + r.height / 2,
            event: e,
          });
          return;
        }
        const dir = keyDirection(e, el);
        if (dir) {
          e.preventDefault();
          focusStep(el, dir);
        }
      },
    }),
    [tabStop, selection, setSelection, viewBuckets, drag, cards, columns, lanes, o, announceSlot, announce, text, columnTitle, focusStep],
  );

  return { cardProps, message, selection, announce };
}
