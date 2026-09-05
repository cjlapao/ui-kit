import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import classNames from "classnames";

/**
 * When the virtual scrollbars show themselves — PrimeVue's `variant`:
 * - `auto` (the default): while the pointer is over the area or while it is
 *   being scrolled — the macOS overlay behaviour, invisible until wanted.
 * - `hover`: only while the pointer is over the area.
 * - `scroll`: while scrolling; fades out a moment after the last event.
 * - `always`: whenever the content overflows that axis.
 * - `hidden`: never — the content still scrolls, nothing is drawn.
 */
export type ScrollAreaVariant = "auto" | "hover" | "scroll" | "always" | "hidden";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Bar visibility behaviour.
   * @default "auto"
   */
  variant?: ScrollAreaVariant;
  /**
   * Fade the content at the edges it can scroll toward, so a clipped row
   * reads as clipped instead of finished.
   * @default false
   */
  mask?: boolean;
  /**
   * Tab order entry for the scrollable viewport — keyboard users scroll the
   * focused area with the arrows / Page / Home / End keys natively. Ignored
   * (the viewport leaves the tab order) when the content fits.
   * @default 0
   */
  tabIndex?: number;
  /** Classes for the content wrapper, for the rare caller that needs the
   * scrolling box itself styled apart from the frame. */
  contentClassName?: string;
  /** The scrollable content. Give the area a height with `className`. */
  children?: ReactNode;
}

/** The smallest a thumb ever gets, so it stays grabbable on huge content. */
const MIN_THUMB = 24;
/** How long after the last scroll event a `scroll`/`auto` bar lingers. */
const SCROLL_LINGER_MS = 800;
/** How far the edge fade reaches into the content when `mask` is on. */
const MASK_FADE = "1.5rem";

const BAR_BASE =
  "absolute select-none touch-none opacity-100 transition-opacity duration-200 ease-out data-[state=hidden]:pointer-events-none data-[state=hidden]:opacity-0";
const THUMB_BASE =
  "absolute left-0 top-0 cursor-grab rounded-full bg-neutral-300 transition-colors active:cursor-grabbing dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500";

interface ThumbMetrics {
  size: number;
  offset: number;
  /** 0..1 position, for `aria-valuenow`. */
  ratio: number;
}

const FITTING_THUMB: ThumbMetrics = { size: 0, offset: 0, ratio: 0 };

/**
 * A scrollable region with custom overlay scrollbars — PrimeVue's ScrollArea:
 * the native scrollbar is hidden (scrolling itself stays completely native,
 * so wheel, touch and keyboard all behave exactly as browsers do), and thin
 * virtual bars track the content instead, sized by the visible fraction and
 * shown per the `variant`. Same on every browser, unlike styling the native
 * scrollbar — the kit's `[&::-webkit-scrollbar]` string only ever worked
 * where `-webkit-` is a lie we tell Chrome; Firefox kept its default bar.
 *
 * The viewport joins the tab order only while something actually
 * overflows — a region that fits has no business one tab deep.
 */
export const ScrollArea = ({
  variant = "auto",
  mask = false,
  tabIndex = 0,
  contentClassName,
  children,
  className = "",
  ...rest
}: ScrollAreaProps) => {
  const viewportId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const yTrackRef = useRef<HTMLDivElement>(null);
  const xTrackRef = useRef<HTMLDivElement>(null);
  const lingerTimer = useRef<number | undefined>(undefined);

  const [overflow, setOverflow] = useState({ x: false, y: false });
  const [thumbY, setThumbY] = useState<ThumbMetrics>(FITTING_THUMB);
  const [thumbX, setThumbX] = useState<ThumbMetrics>(FITTING_THUMB);
  const [hovered, setHovered] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const dragging = useRef<{ axis: "x" | "y"; pointer: number; scroll: number; ratio: number } | null>(null);

  const thumb = useCallback((viewport: HTMLDivElement, track: HTMLDivElement | null, axis: "x" | "y"): ThumbMetrics => {
    const viewportSize = axis === "y" ? viewport.clientHeight : viewport.clientWidth;
    const contentSize = axis === "y" ? viewport.scrollHeight : viewport.scrollWidth;
    const trackSize = (track ? (axis === "y" ? track.clientHeight : track.clientWidth) : viewportSize) || 1;
    const scrollable = contentSize - viewportSize;
    if (scrollable <= 1) return FITTING_THUMB;
    const size = Math.max(MIN_THUMB, (viewportSize / contentSize) * trackSize);
    const position = axis === "y" ? viewport.scrollTop : viewport.scrollLeft;
    return {
      size,
      offset: (position / scrollable) * (trackSize - size),
      ratio: position / scrollable,
    };
  }, []);

  const update = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    setOverflow({
      x: viewport.scrollWidth - viewport.clientWidth > 1,
      y: viewport.scrollHeight - viewport.clientHeight > 1,
    });
    setThumbY(thumb(viewport, yTrackRef.current, "y"));
    setThumbX(thumb(viewport, xTrackRef.current, "x"));
  }, [thumb]);

  // Re-measure on any size change, of the frame or of the content inside it.
  // No ResizeObserver (jsdom, old engines) means falling back to window
  // resizes alone; the scroll handler keeps the thumbs honest meanwhile.
  useEffect(() => {
    update();
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(update);
      if (viewportRef.current) observer.observe(viewportRef.current);
      if (contentRef.current) observer.observe(contentRef.current);
    } else {
      window.addEventListener("resize", update);
    }
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [update]);

  useEffect(() => () => window.clearTimeout(lingerTimer.current), []);

  const handleScroll = () => {
    update();
    setScrolling(true);
    window.clearTimeout(lingerTimer.current);
    lingerTimer.current = window.setTimeout(() => setScrolling(false), SCROLL_LINGER_MS);
  };

  const visible = (overflows: boolean) => {
    if (!overflows || variant === "hidden") return false;
    if (variant === "always") return true;
    if (variant === "hover") return hovered;
    if (variant === "scroll") return scrolling;
    return hovered || scrolling; // auto
  };
  const yVisible = visible(overflow.y);
  const xVisible = visible(overflow.x);

  const startDrag = (axis: "x" | "y") => (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const track = axis === "y" ? yTrackRef.current : xTrackRef.current;
    const metrics = axis === "y" ? thumbY : thumbX;
    const travel = (track ? (axis === "y" ? track.clientHeight : track.clientWidth) : 0) - metrics.size;
    const scrollable = (axis === "y" ? viewport.scrollHeight : viewport.scrollWidth) -
      (axis === "y" ? viewport.clientHeight : viewport.clientWidth);
    dragging.current = {
      axis,
      pointer: axis === "y" ? event.clientY : event.clientX,
      scroll: axis === "y" ? viewport.scrollTop : viewport.scrollLeft,
      ratio: travel > 0 ? scrollable / travel : 0,
    };
  };

  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragging.current;
    const viewport = viewportRef.current;
    if (!drag || !viewport) return;
    const pointer = drag.axis === "y" ? event.clientY : event.clientX;
    const delta = (pointer - drag.pointer) * drag.ratio;
    if (drag.axis === "y") viewport.scrollTop = drag.scroll + delta;
    else viewport.scrollLeft = drag.scroll + delta;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const maskStyle = (): React.CSSProperties | undefined => {
    if (!mask || (!overflow.x && !overflow.y)) return undefined;
    const images: string[] = [];
    if (overflow.y) {
      images.push(
        `linear-gradient(to bottom, transparent 0, #000 ${MASK_FADE}, #000 calc(100% - ${MASK_FADE}), transparent 100%)`,
      );
    }
    if (overflow.x) {
      images.push(
        `linear-gradient(to right, transparent 0, #000 ${MASK_FADE}, #000 calc(100% - ${MASK_FADE}), transparent 100%)`,
      );
    }
    return {
      maskImage: images.join(", "),
      WebkitMaskImage: images.join(", "),
      ...(images.length > 1
        ? { maskComposite: "intersect", WebkitMaskComposite: "source-in" }
        : null),
    };
  };

  return (
    <div
      {...rest}
      className={classNames("relative overflow-hidden", className)}
      data-slot="scrollarea"
      data-variant={variant}
      onPointerEnter={(event) => {
        setHovered(true);
        rest.onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        setHovered(false);
        rest.onPointerLeave?.(event);
      }}
    >
      <div
        ref={viewportRef}
        id={viewportId}
        data-slot="scrollarea-viewport"
        tabIndex={overflow.x || overflow.y ? tabIndex : -1}
        data-overflow-x={overflow.x ? "" : undefined}
        data-overflow-y={overflow.y ? "" : undefined}
        onScroll={handleScroll}
        style={maskStyle()}
        className={classNames(
          "h-full w-full overflow-auto rounded-[inherit] outline-none",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400",
        )}
      >
        <div
          ref={contentRef}
          data-slot="scrollarea-content"
          className={classNames("table min-w-full", contentClassName)}
        >
          {children}
        </div>
      </div>

      <div
        data-slot="scrollarea-scrollbar"
        data-orientation="vertical"
        data-state={yVisible ? "visible" : "hidden"}
        role="scrollbar"
        aria-controls={viewportId}
        aria-orientation="vertical"
        aria-label="Vertical scroll"
        aria-valuenow={Math.round(thumbY.ratio * 100)}
        className={classNames(BAR_BASE, "right-0 top-0 h-full w-2.5 flex-col border-x border-transparent p-[3px]")}
      >
        <div ref={yTrackRef} className="relative h-full w-full">
          <div
            data-slot="scrollarea-handle"
            style={{ height: thumbY.size, transform: `translateY(${thumbY.offset}px)` }}
            onPointerDown={startDrag("y")}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className={classNames(THUMB_BASE, "w-full")}
          />
        </div>
      </div>

      <div
        data-slot="scrollarea-scrollbar"
        data-orientation="horizontal"
        data-state={xVisible ? "visible" : "hidden"}
        role="scrollbar"
        aria-controls={viewportId}
        aria-orientation="horizontal"
        aria-label="Horizontal scroll"
        aria-valuenow={Math.round(thumbX.ratio * 100)}
        className={classNames(BAR_BASE, "bottom-0 left-0 h-2.5 w-full flex-row border-y border-transparent p-[3px]")}
      >
        <div ref={xTrackRef} className="relative h-full w-full">
          <div
            data-slot="scrollarea-handle"
            style={{ width: thumbX.size, transform: `translateX(${thumbX.offset}px)` }}
            onPointerDown={startDrag("x")}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className={classNames(THUMB_BASE, "h-full")}
          />
        </div>
      </div>

      {/* The square where two bars meet — only there when both are. */}
      <div
        data-slot="scrollarea-corner"
        data-state={xVisible && yVisible ? "visible" : "hidden"}
        className="absolute bottom-0 right-0 z-10 size-2.5 bg-transparent data-[state=hidden]:hidden"
      />
    </div>
  );
};

ScrollArea.displayName = "ScrollArea";

export default ScrollArea;
