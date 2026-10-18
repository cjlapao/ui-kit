import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

/**
 * Viewport-boundary placement for a PORTALED popup, extracted from the
 * math `Picker`, `TagPicker` and `DropdownMenu` each carried as their own
 * copy. A popup rendered with `createPortal(document.body)` is a `<body>`
 * child, so the boundary is the viewport, full stop - nothing in the
 * anchor's clipping chain (a rounded `Panel` shell's `overflow-hidden`, a
 * body scroller) can clip it, and clamping against that chain only
 * pretends the popup must stay inside it; inside a panel host that parked
 * popups over their fields instead of below them.
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

const resolveZIndex = (anchor: HTMLElement): number => {
  let node: HTMLElement | null = anchor;
  let highest: number | null = null;
  while (node && node !== document.body) {
    const z = getComputedStyle(node).zIndex;
    if (z && z !== "auto") {
      const n = Number(z);
      if (Number.isFinite(n))
        highest = highest === null ? n : Math.max(highest, n);
    }
    node = node.parentElement;
  }
  // A portal leaves its anchor's stacking context behind, so the popup has
  // to carry the highest z-index on the anchor's chain with it.
  return (highest ?? 0) + 20;
};

export interface AnchoredPopupPosition {
  /** `position: fixed` styles for the portal wrapper; undefined before the
   * first measure, when the caller should keep the popup invisible. */
  style: CSSProperties | undefined;
  /** Height left for the content between the popup's edge and the nearest
   * viewport boundary - what a list should hand its ScrollArea. */
  maxHeight: number;
}

export const useAnchoredPopupPosition = ({
  open,
  anchorRef,
  popupRef,
  maxHeight: maxHeightCap = 280,
  matchAnchorWidth = true,
}: {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  popupRef: RefObject<HTMLElement | null>;
  /** Ceiling for the content height before the popup scrolls. */
  maxHeight?: number;
  /** Grow to the anchor's width when the anchor is wider (fields do). */
  matchAnchorWidth?: boolean;
}): AnchoredPopupPosition => {
  const [style, setStyle] = useState<CSSProperties | undefined>(undefined);
  const [contentMaxHeight, setContentMaxHeight] = useState(maxHeightCap);

  const updatePosition = useCallback(() => {
    if (!open || !anchorRef.current || !popupRef.current) return;

    const anchorRect = anchorRef.current.getBoundingClientRect();
    const menuRect = popupRef.current.getBoundingClientRect();
    // `getBoundingClientRect` reports the transformed box; the popup is
    // measured mid-animation too, so prefer the honest layout size.
    const menuWidth = popupRef.current.offsetWidth || menuRect.width;
    const menuHeight = popupRef.current.offsetHeight || menuRect.height;
    const boundary = viewportBounds();
    const zIndex = resolveZIndex(anchorRef.current);
    const offset = 4;
    const minMargin = 8;

    const computedWidth = Math.min(
      Math.max(matchAnchorWidth ? anchorRect.width : 0, menuWidth),
      boundary.width - minMargin * 2,
    );
    const computedHeight = menuHeight;

    const belowTop = anchorRect.bottom + offset;
    const aboveTop = anchorRect.top - offset - computedHeight;

    const overflowFor = (top: number) =>
      Math.max(0, boundary.top + minMargin - top) +
      Math.max(0, top + computedHeight - (boundary.bottom - minMargin));

    const isTopSide = overflowFor(aboveTop) < overflowFor(belowTop);
    const rawTop = isTopSide ? aboveTop : belowTop;
    const clampedTop = Math.min(
      Math.max(rawTop, boundary.top + minMargin),
      Math.max(
        boundary.top + minMargin,
        boundary.bottom - computedHeight - minMargin,
      ),
    );

    const availableSpace = isTopSide
      ? Math.max(120, anchorRect.top - offset - (boundary.top + minMargin))
      : Math.max(120, boundary.bottom - minMargin - belowTop);
    const nextMaxHeight = Math.min(maxHeightCap, availableSpace);

    const startLeft = anchorRect.left;
    const clampedLeft = Math.min(
      Math.max(startLeft, boundary.left + minMargin),
      Math.max(
        boundary.left + minMargin,
        boundary.right - computedWidth - minMargin,
      ),
    );

    setContentMaxHeight(Math.max(120, nextMaxHeight));
    setStyle({
      position: "fixed",
      top: clampedTop,
      left: clampedLeft,
      width: computedWidth,
      zIndex,
    });
  }, [open, anchorRef, popupRef, maxHeightCap, matchAnchorWidth]);

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
      if (popupRef.current) ro.observe(popupRef.current);
    }
    schedule();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      ro?.disconnect();
    };
  }, [open, updatePosition, anchorRef, popupRef]);

  return { style, maxHeight: contentMaxHeight };
};
