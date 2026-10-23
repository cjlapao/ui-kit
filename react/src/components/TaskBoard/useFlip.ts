/**
 * useFlip — slide reordered elements into place (FLIP: First, Last, Invert,
 * Play). Every `[data-flip-key]` element under the root is measured on each
 * render; when `orderKey` changes, each element that moved starts drawn at
 * its old x (an inverse transform) and transitions to its new one.
 *
 * `offsetLeft` is used rather than `getBoundingClientRect`, so scrolling and
 * a transform already in flight never read as movement. Skipped under
 * `prefers-reduced-motion`.
 */

import { useLayoutEffect, useRef } from "react";
import { COLLAPSE_MS } from "./usePresence";

export function useFlip(rootRef: React.RefObject<HTMLElement | null>, orderKey: string): void {
  const positions = useRef(new Map<string, number>());
  const lastKey = useRef(orderKey);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reorder = lastKey.current !== orderKey;
    lastKey.current = orderKey;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const next = new Map<string, number>();
    for (const el of root.querySelectorAll<HTMLElement>("[data-flip-key]")) {
      const key = el.getAttribute("data-flip-key")!;
      const x = el.offsetLeft;
      next.set(key, x);
      const before = positions.current.get(key);
      if (!reorder || reduce || before === undefined || before === x) continue;
      // Invert: draw it where it was, with no transition…
      el.style.transition = "none";
      el.style.transform = `translateX(${before - x}px)`;
      // …then play: let it slide home. The inline transition is removed after,
      // so the element's own class transitions (width) come back.
      requestAnimationFrame(() => {
        el.style.transition = `transform ${COLLAPSE_MS}ms ease-out`;
        el.style.transform = "";
        window.setTimeout(() => {
          if (el.style.transform === "") el.style.transition = "";
        }, COLLAPSE_MS + 50);
      });
    }
    positions.current = next;
  });
}
