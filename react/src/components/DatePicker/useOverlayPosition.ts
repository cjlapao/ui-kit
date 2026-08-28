import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type RefObject,
} from "react";
import { resolveOverlayZIndex } from "../../../../common/utils/overlayZIndex";

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

/**
 * Ceiling for the overlay width. The calendar content (a 7-column day grid of
 * 32px cells) is ~248px at the default size; letting the panel stretch to the
 * input's width — PrimeVue's `minWidth` behaviour — leaves the fixed day
 * cells floating in a sparse table on wide fields. 320px (Tailwind `w-80`)
 * still lets the panel match medium-width inputs, and keeps the grid tight
 * beyond that.
 */
const MAX_WIDTH = 320;

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
    // `getBoundingClientRect` reports the *transformed* box, and during
    // enter/leave the overlay is scaled (0.93) — the first measurement would
    // see a 7 %-smaller panel and clamp/flip against the wrong size. Read the
    // layout size instead; jsdom has no layout (offsets are 0), and the
    // mocked bbox is already untransformed, so the fallback is exact there.
    const panelWidth = panel.offsetWidth || panelRect.width;
    const panelHeight = panel.offsetHeight || panelRect.height;
    const boundary = resolveBoundaryBounds(anchor);
    const zIndex = resolveOverlayZIndex(anchor);
    const offset = 4;
    const minMargin = 8;

    // The panel keeps its natural width unless the input is wider — PrimeVue
    // does the same (`minWidth: input outer width`) — but the stretch is
    // capped: beyond MAX_WIDTH the day grid would just be sparse columns.
    const width = Math.min(
      Math.max(anchorRect.width, panelWidth),
      MAX_WIDTH,
      boundary.width - minMargin * 2,
    );
    const height = panelHeight;

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
