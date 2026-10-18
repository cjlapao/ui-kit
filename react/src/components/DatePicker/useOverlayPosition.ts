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

/**
 * The boundary is the viewport, full stop — and that is not laziness, it is
 * what a *portaled* overlay is. The hook only ever places the
 * `appendTo="body"` overlay, which is a `<body>` child: nothing in the
 * anchor's clipping chain (a rounded `Panel` shell's `overflow-hidden`, a
 * body scroller, a scroll container) can clip it, so clamping against that
 * chain only *pretends* the overlay must stay inside it. Walking the chain
 * and intersecting was a direct port of the in-flow Picker/DropdownMenu
 * math — and inside a `Panel` it parked the calendar against the card's
 * corner instead of below the field, which is the coordinate bug the portal
 * mode showed. `appendTo="self"` is CSS-placed in flow position and never
 * reaches this hook.
 *
 * Shared with `Popover`, which portals the same way and had the same chain
 * walk. `Picker`, `DropdownMenu` and `MegaMenu` keep theirs: they are
 * in-flow inside their clipping container, where the walk is the point.
 */
const resolveBoundaryBounds = (): RectBounds => viewportBounds();

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
    // `offsetHeight` (not `clientHeight`): client excludes the border, so
    // on a borderless jsdom element it reads 0 where offset is the honest
    // layout number — and in a browser the difference here is only chrome.
    const panelHeight = panel.offsetHeight || panelRect.height;
    const boundary = resolveBoundaryBounds();
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
