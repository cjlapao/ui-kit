import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type RefObject,
} from "react";

/**
 * Fixed positioning for a portaled overlay, mirroring `Picker`/`DropdownMenu`
 * so every kit overlay behaves the same: the panel is `position: fixed` and
 * placed against the nearest *clipping* ancestor (or the viewport), with a
 * z-index that stacks above whatever the anchor sits inside, and a flip above
 * the anchor when there is more room up top.
 *
 * Deliberate deviation from PrimeVue: scroll and resize *reposition* the
 * overlay instead of closing it — closing a date picker because the page
 * scrolled is the behaviour its own source analysis calls out as surprising.
 */

type RectBounds = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

const viewportBounds = (): RectBounds => ({
  top: 0,
  left: 0,
  right: window.innerWidth,
  bottom: window.innerHeight,
  width: window.innerWidth,
  height: window.innerHeight,
});

const isClippingParent = (el: HTMLElement): boolean =>
  /(auto|scroll|hidden|clip)/.test(
    [
      getComputedStyle(el).overflow,
      getComputedStyle(el).overflowX,
      getComputedStyle(el).overflowY,
    ].join(" "),
  );

const resolveBoundaryBounds = (anchor: HTMLElement): RectBounds => {
  let node: HTMLElement | null = anchor.parentElement;
  while (node && node !== document.body) {
    if (isClippingParent(node)) {
      const r = node.getBoundingClientRect();
      return {
        top: r.top,
        left: r.left,
        right: r.right,
        bottom: r.bottom,
        width: r.width,
        height: r.height,
      };
    }
    node = node.parentElement;
  }
  return viewportBounds();
};

const resolveZIndex = (anchor: HTMLElement): number => {
  let node: HTMLElement | null = anchor;
  let highest: number | null = null;
  while (node && node !== document.body) {
    const z = getComputedStyle(node).zIndex;
    if (z && z !== "auto") {
      const n = Number(z);
      if (Number.isFinite(n)) {
        highest = highest === null ? n : Math.max(highest, n);
      }
    }
    node = node.parentElement;
  }
  return Math.max(1, (highest ?? 20) + 1);
};

export const useOverlayPosition = (
  anchorRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>,
  open: boolean,
) => {
  const [style, setStyle] = useState<React.CSSProperties | undefined>(
    undefined,
  );

  const updatePosition = useCallback(() => {
    if (!open) return;
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;

    const anchorRect = anchor.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const boundary = resolveBoundaryBounds(anchor);
    const zIndex = resolveZIndex(anchor);
    const offset = 4;
    const minMargin = 8;

    // The panel keeps its natural width unless the input is wider — PrimeVue
    // does the same (`minWidth: input outer width`).
    const width = Math.min(
      Math.max(anchorRect.width, panelRect.width),
      boundary.width - minMargin * 2,
    );
    const height = panelRect.height;

    const belowTop = anchorRect.bottom + offset;
    const aboveTop = anchorRect.top - offset - height;

    const overflowFor = (top: number) =>
      Math.max(0, boundary.top + minMargin - top) +
      Math.max(0, top + height - (boundary.bottom - minMargin));

    const isTopSide = overflowFor(aboveTop) < overflowFor(belowTop);
    const rawTop = isTopSide ? aboveTop : belowTop;
    const clampedTop = Math.min(
      Math.max(rawTop, boundary.top + minMargin),
      Math.max(boundary.top + minMargin, boundary.bottom - height - minMargin),
    );
    const clampedLeft = Math.min(
      Math.max(anchorRect.left, boundary.left + minMargin),
      Math.max(boundary.left + minMargin, boundary.right - width - minMargin),
    );

    setStyle({
      position: "fixed",
      top: clampedTop,
      left: clampedLeft,
      width,
      zIndex,
    });
  }, [open, anchorRef, panelRef]);

  // Place before paint once the panel has measured.
  useLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  useEffect(() => {
    if (!open) {
      setStyle(undefined);
      return;
    }
    let frame = 0;
    const schedule = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        updatePosition();
        frame = 0;
      });
    };
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(schedule)
        : undefined;
    if (ro) {
      if (anchorRef.current) ro.observe(anchorRef.current);
      if (panelRef.current) ro.observe(panelRef.current);
    }
    schedule();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      ro?.disconnect();
    };
  }, [open, updatePosition, anchorRef, panelRef]);

  return style;
};
