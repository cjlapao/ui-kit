/**
 * useTaskBoardDrag — pointer (mouse, pen, touch) drag for TaskBoard cards.
 *
 * The Gantt / SmartGrid drag system: press past a 4px threshold (or hold
 * `TOUCH_GRAB_DELAY_MS` on touch, so a swipe still scrolls) lifts the card
 * into a floating clone; the card itself stays in the flow as a dashed
 * placeholder, and the live order re-derives through `applyMove` so the other
 * cards slide while you move. The target is the bucket under the pointer
 * (`[data-bucket]`) and the midpoint rule over its cards; engine rules
 * (`validateMove`) mark an invalid bucket instead of previewing into it.
 *
 * Drop → `onCommit(move)`, or, with `onBeforeMove`, a pending state that keeps
 * the preview until the guard answers. Refused or thrown → nothing is
 * emitted and the card is back where it was, because nothing was ever
 * committed.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import {
  applyMove,
  resolveDropIndex,
  validateMove,
  type TaskBoardCard,
  type TaskBoardColumn,
  type TaskBoardLane,
  type TaskBoardMove,
  type TaskBoardSlot,
} from "../../../../common/taskboard";

export const DRAG_THRESHOLD_PX = 4;
export const TOUCH_GRAB_DELAY_MS = 250;
/** A touch that wanders this far before the hold completes is a scroll. */
const TOUCH_SLOP_PX = 8;
const AUTO_SCROLL_EDGE = 48;
const AUTO_SCROLL_MAX = 16;

export interface TaskBoardDragState {
  cardId: string;
  from: TaskBoardSlot;
  to: TaskBoardSlot | null;
  valid: boolean;
  x: number;
  y: number;
  grabOffset: { x: number; y: number };
  width: number;
  /** A keyboard grab — no clone, the card moves slot by slot. */
  keyboard?: boolean;
}

export interface UseTaskBoardDragOptions {
  cards: TaskBoardCard[];
  columns: TaskBoardColumn[];
  /** Lanes of the lane view (undefined on a columns board). */
  lanes?: TaskBoardLane[];
  editable: boolean;
  heldBy?: Map<string, string>;
  selfId?: string;
  /** Board-wide default for `column.maxItems`. */
  maxItems?: number;
  onBeforeMove?: (move: TaskBoardMove) => boolean | Promise<boolean>;
  onCommit: (move: TaskBoardMove) => void;
  /** Fired when a drag lifts, before any target is resolved. */
  onDragStart?: (cardId: string) => void;
  /** Fired whenever the resolved target slot changes (null = off the board). */
  onDragTarget?: (cardId: string, slot: TaskBoardSlot | null) => void;
  /** Fired when a drag ends either way. */
  onDragEnd?: (cardId: string, dropped: boolean) => void;
}

interface Press {
  cardId: string;
  from: TaskBoardSlot;
  startX: number;
  startY: number;
  touch: boolean;
  /** Touch: the hold elapsed, the next move lifts the card. */
  armed: boolean;
  timer: ReturnType<typeof setTimeout> | null;
  grabOffset: { x: number; y: number };
  width: number;
}

const sameSlot = (a: TaskBoardSlot, b: TaskBoardSlot) =>
  a.column === b.column && a.lane === b.lane && a.index === b.index;

function bucketOf(el: Element | null): { column: string; lane: string | null; el: Element } | null {
  // A whole column / lane cell is a drop zone — the header, the add button
  // and the empty space under the last card resolve to its bucket.
  const bucket = el?.closest("[data-bucket]") ?? el?.closest("[data-drop-zone]")?.querySelector("[data-bucket]");
  if (!bucket) return null;
  const column = bucket.getAttribute("data-bucket-column");
  const lane = bucket.getAttribute("data-bucket-lane");
  return column === null ? null : { column, lane: lane || null, el: bucket };
}

export function useTaskBoardDrag(opts: UseTaskBoardDragOptions) {
  const [drag, setDrag] = useState<TaskBoardDragState | null>(null);
  const [pending, setPending] = useState<TaskBoardMove | null>(null);

  // Everything the window listeners read lives in refs, so a re-render (a
  // remote commit landing mid-drag) never tears down an active gesture.
  const optsRef = useRef(opts);
  optsRef.current = opts;
  const dragRef = useRef<TaskBoardDragState | null>(null);
  const pressRef = useRef<Press | null>(null);
  const suppressClickRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  /** body's own user-select, restored when a pointer drag ends. */
  const userSelectRef = useRef<string | null>(null);

  const setDragState = useCallback((next: TaskBoardDragState | null) => {
    dragRef.current = next;
    setDrag(next);
  }, []);

  const ctxFor = () => {
    const o = optsRef.current;
    return { cards: o.cards, columns: o.columns, lanes: o.lanes, heldBy: o.heldBy, selfId: o.selfId, maxItems: o.maxItems };
  };

  const resolveTarget = useCallback((x: number, y: number) => {
    const d = dragRef.current;
    if (!d) return;
    const hit = bucketOf(document.elementFromPoint?.(x, y) ?? null);
    let to: TaskBoardSlot | null = null;
    let valid = false;
    if (hit) {
      const rects = [...hit.el.querySelectorAll("[data-card-id]")].map((n) => {
        const r = n.getBoundingClientRect();
        return { id: n.getAttribute("data-card-id")!, top: r.top, height: r.height };
      });
      const current =
        d.to && d.to.column === hit.column && d.to.lane === hit.lane ? d.to.index : null;
      const index = resolveDropIndex(rects, y, d.cardId, current);
      to = { column: hit.column, lane: hit.lane, index };
      valid = validateMove(ctxFor(), { cardId: d.cardId, from: d.from, to }).ok;
    }
    const changed = !d.to !== !to || (d.to && to && !sameSlot(d.to, to)) || d.valid !== valid;
    setDragState({ ...d, x, y, to, valid });
    if (changed) optsRef.current.onDragTarget?.(d.cardId, valid ? to : null);
  }, [setDragState]);

  const autoScroll = useCallback(() => {
    rafRef.current = null;
    if (!dragRef.current) return;
    const { x, y } = pointerRef.current;
    let scrolled = false;
    for (const frame of document.querySelectorAll<HTMLElement>("[data-taskboard-scroll]")) {
      // A ScrollArea frame scrolls through its viewport, not itself.
      const el = frame.matches('[data-slot="scrollarea"]')
        ? frame.querySelector<HTMLElement>(':scope > [data-slot="scrollarea-viewport"]')
        : frame;
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
      const speed = (d: number) => Math.ceil(((AUTO_SCROLL_EDGE - d) / AUTO_SCROLL_EDGE) * AUTO_SCROLL_MAX);
      let dx = 0;
      let dy = 0;
      if (x - r.left < AUTO_SCROLL_EDGE) dx = -speed(x - r.left);
      else if (r.right - x < AUTO_SCROLL_EDGE) dx = speed(r.right - x);
      if (y - r.top < AUTO_SCROLL_EDGE) dy = -speed(y - r.top);
      else if (r.bottom - y < AUTO_SCROLL_EDGE) dy = speed(r.bottom - y);
      if (dx && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += dx;
        scrolled = true;
      }
      if (dy && el.scrollHeight > el.clientHeight) {
        el.scrollTop += dy;
        scrolled = true;
      }
    }
    if (scrolled) {
      resolveTarget(x, y);
      rafRef.current = requestAnimationFrame(autoScroll);
    }
  }, [resolveTarget]);

  const endGesture = useCallback(() => {
    const p = pressRef.current;
    if (p?.timer) clearTimeout(p.timer);
    pressRef.current = null;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (userSelectRef.current !== null) {
      document.body.style.userSelect = userSelectRef.current;
      userSelectRef.current = null;
    }
  }, []);

  const cancel = useCallback(
    (_reason?: string) => {
      const d = dragRef.current;
      endGesture();
      if (d) {
        setDragState(null);
        optsRef.current.onDragEnd?.(d.cardId, false);
      }
    },
    [endGesture, setDragState],
  );

  /** End the drag at its current target. Resolves true when the move was committed. */
  const finish = useCallback(async (): Promise<boolean> => {
    const d = dragRef.current;
    endGesture();
    if (!d) return false;
    setDragState(null);
    if (!d.keyboard) {
      suppressClickRef.current = true;
      setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
    const o = optsRef.current;
    if (!d.to || !d.valid || sameSlot(d.from, d.to)) {
      o.onDragEnd?.(d.cardId, false);
      return false;
    }
    const move: TaskBoardMove = { cardId: d.cardId, from: d.from, to: d.to };
    if (!o.onBeforeMove) {
      o.onCommit(move);
      o.onDragEnd?.(d.cardId, true);
      return true;
    }
    setPending(move);
    let ok = false;
    try {
      ok = await o.onBeforeMove(move);
    } catch {
      ok = false;
    }
    setPending(null);
    if (ok) optsRef.current.onCommit(move);
    optsRef.current.onDragEnd?.(d.cardId, ok);
    return ok;
  }, [endGesture, setDragState]);

  /** Keyboard: pick a card up in place. False when it may not move. */
  const keyboardGrab = useCallback(
    (card: TaskBoardCard, from: TaskBoardSlot): boolean => {
      const o = optsRef.current;
      if (!o.editable || card.locked || dragRef.current) return false;
      const holder = o.heldBy?.get(card.id);
      if (holder && holder !== o.selfId) return false;
      setDragState({ cardId: card.id, from, to: from, valid: true, x: 0, y: 0, grabOffset: { x: 0, y: 0 }, width: 0, keyboard: true });
      o.onDragStart?.(card.id);
      o.onDragTarget?.(card.id, from);
      return true;
    },
    [setDragState],
  );

  /** Keyboard: move the held card to an (already validated) slot. */
  const keyboardMove = useCallback(
    (to: TaskBoardSlot) => {
      const d = dragRef.current;
      if (!d) return;
      setDragState({ ...d, to, valid: true });
      optsRef.current.onDragTarget?.(d.cardId, to);
    },
    [setDragState],
  );

  const lift = useCallback(
    (p: Press, x: number, y: number) => {
      // A pointer drag sweeps across text — keep the page from selecting it.
      if (userSelectRef.current === null) {
        userSelectRef.current = document.body.style.userSelect;
        document.body.style.userSelect = "none";
      }
      window.getSelection?.()?.removeAllRanges();
      setDragState({
        cardId: p.cardId,
        from: p.from,
        to: p.from,
        valid: true,
        x,
        y,
        grabOffset: p.grabOffset,
        width: p.width,
      });
      optsRef.current.onDragStart?.(p.cardId);
      resolveTarget(x, y);
    },
    [resolveTarget, setDragState],
  );

  const onWindowMove = useCallback(
    (e: PointerEvent) => {
      const p = pressRef.current;
      if (!p) return;
      const { clientX: x, clientY: y } = e;
      pointerRef.current = { x, y };
      if (!dragRef.current) {
        const dist = Math.hypot(x - p.startX, y - p.startY);
        if (p.touch) {
          if (!p.armed) {
            if (dist > TOUCH_SLOP_PX) endGesture();
            return;
          }
          lift(p, x, y);
          return;
        }
        if (dist < DRAG_THRESHOLD_PX) return;
        lift(p, x, y);
        return;
      }
      resolveTarget(x, y);
      if (rafRef.current === null && typeof requestAnimationFrame === "function") {
        rafRef.current = requestAnimationFrame(autoScroll);
      }
    },
    [autoScroll, endGesture, lift, resolveTarget],
  );

  const startPress = useCallback(
    (card: TaskBoardCard, from: TaskBoardSlot, e: React.PointerEvent<HTMLElement>) => {
      const o = optsRef.current;
      if (!o.editable || e.button !== 0 || card.locked) return;
      const holder = o.heldBy?.get(card.id);
      if (holder && holder !== o.selfId) return;
      endGesture();
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.pointerType === "touch";
      const press: Press = {
        cardId: card.id,
        from,
        startX: e.clientX,
        startY: e.clientY,
        touch,
        armed: false,
        timer: null,
        grabOffset: { x: e.clientX - rect.left, y: e.clientY - rect.top },
        width: rect.width,
      };
      if (touch) {
        press.timer = setTimeout(() => {
          press.armed = true;
          press.timer = null;
        }, TOUCH_GRAB_DELAY_MS);
      }
      pressRef.current = press;
      pointerRef.current = { x: e.clientX, y: e.clientY };

      const onUp = () => {
        if (dragRef.current) void finish();
        else endGesture();
      };
      const onCancel = () => cancel("pointercancel");
      const onKey = (k: KeyboardEvent) => {
        if (k.key === "Escape" && dragRef.current) {
          k.preventDefault();
          cancel("escape");
        }
      };
      // Once a touch drag is live, the page must not scroll under it.
      const onTouchMove = (t: TouchEvent) => {
        if (dragRef.current) t.preventDefault();
      };
      window.addEventListener("pointermove", onWindowMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
      window.addEventListener("keydown", onKey);
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      cleanupRef.current = () => {
        window.removeEventListener("pointermove", onWindowMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("touchmove", onTouchMove);
      };
    },
    [cancel, endGesture, finish, onWindowMove],
  );

  // A dragged card that vanished from the data (deleted remotely) ends the drag.
  useEffect(() => {
    const d = dragRef.current;
    if (d && !opts.cards.some((c) => c.id === d.cardId)) cancel("removed");
  }, [opts.cards, cancel]);

  useEffect(() => () => endGesture(), [endGesture]);

  const previewCards = useMemo(() => {
    const { cards, columns, lanes } = opts;
    if (pending) return applyMove(cards, pending, columns, lanes);
    if (drag?.to && drag.valid) return applyMove(cards, { cardId: drag.cardId, from: drag.from, to: drag.to }, columns, lanes);
    return cards;
  }, [opts.cards, opts.columns, opts.lanes, drag, pending]);

  const cardHandlers = useCallback(
    (card: TaskBoardCard, from: TaskBoardSlot): React.HTMLAttributes<HTMLDivElement> => ({
      onPointerDown: (e) => startPress(card, from, e),
      onClickCapture: (e) => {
        if (suppressClickRef.current) {
          suppressClickRef.current = false;
          e.preventDefault();
          e.stopPropagation();
        }
      },
    }),
    [startPress],
  );

  return { drag, pending, previewCards, cardHandlers, cancel, finish, keyboardGrab, keyboardMove };
}
