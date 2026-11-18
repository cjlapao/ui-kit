import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
export type ScrollAreaVariant =
  | "auto"
  | "hover"
  | "scroll"
  | "always"
  | "hidden";

/** Controlled vertical scrolling for an engine that renders its own viewport.
 * Sizes and offset may use pixels or logical units (e.g. terminal rows). */
export interface ScrollAreaVirtualScroll {
  contentSize: number;
  viewportSize: number;
  offset: number;
  onScroll: (offset: number) => void;
}

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Use the kit's scrollbar to control a virtual viewport. Horizontal scrolling
   * is disabled; the child engine owns wheel/keyboard handling and rendering. */
  virtualScroll?: ScrollAreaVirtualScroll;
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
   * Whether the region can scroll sideways. A region that scrolls on one
   * axis only — a nav list, a text column — should say so: content wider
   * than the viewport is then clipped instead of reachable, and `scrollWidth`
   * still reports it either way, so a bar drawn for it would scroll nothing.
   * @default true
   */
  horizontal?: boolean;
  /** Whether the region can scroll vertically. @default true */
  vertical?: boolean;
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
  /** Classes for the scrolling viewport itself — the element that actually
   * carries `overflow: auto`. For the caller that has to reach the scroller's
   * behaviour (an `overscroll-contain`, say, so a wheel at the end of the
   * content does not chain to the page). */
  viewportClassName?: string;
  /** Forwarded to the scrolling viewport, so a caller that drives the scroll
   * position programmatically — pan, zoom anchoring, scroll-into-view — gets
   * the element that scrolls, not the frame around it. */
  viewportRef?: React.Ref<HTMLDivElement>;
  /** The scrollable content. Give the area a height — or a maximum height —
   * with `className`; a `max-h` frame works because the viewport inherits
   * that cap and scrolls inside it instead of silently growing past it. */
  children?: ReactNode;
}

/** The smallest a thumb ever gets, so it stays grabbable on huge content. */
const MIN_THUMB = 24;
/** How long after the last scroll event a `scroll`/`auto` bar lingers. */
const SCROLL_LINGER_MS = 800;
/** How far the edge fade reaches into the content when `mask` is on. */
export const SCROLLAREA_MASK_FADE_PX = 24; // the 1.5rem below
const MASK_FADE = `${SCROLLAREA_MASK_FADE_PX / 16}rem`;
/** The content's permanent right inset, reserving the overlay bar's lane —
 *  exported so a caller that pads its own content can pay the lane back. */
export const SCROLLAREA_LANE_PX = 10; // mirrors the `pr-2.5` below

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
  virtualScroll,
  variant = "auto",
  mask = false,
  horizontal = true,
  vertical = true,
  tabIndex = 0,
  contentClassName,
  viewportClassName,
  viewportRef: viewportRefProp,
  children,
  className = "",
  ...rest
}: ScrollAreaProps) => {
  horizontal = horizontal && !virtualScroll;
  vertical = vertical || !!virtualScroll;
  const viewportId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  // The internal ref drives the thumbs; a caller's ref has to see the same
  // element, so both are attached — a forwarded ref of one's own would make
  // the component lose its own scrollbars.
  const setViewportRef = useCallback(
    (el: HTMLDivElement | null) => {
      viewportRef.current = el;
      if (typeof viewportRefProp === "function") viewportRefProp(el);
      else if (viewportRefProp)
        (
          viewportRefProp as React.MutableRefObject<HTMLDivElement | null>
        ).current = el;
    },
    [viewportRefProp],
  );
  const contentRef = useRef<HTMLDivElement>(null);
  const yTrackRef = useRef<HTMLDivElement>(null);
  const xTrackRef = useRef<HTMLDivElement>(null);
  const lingerTimer = useRef<number | undefined>(undefined);

  const [overflow, setOverflow] = useState({ x: false, y: false });
  const [thumbY, setThumbY] = useState<ThumbMetrics>(FITTING_THUMB);
  const [thumbX, setThumbX] = useState<ThumbMetrics>(FITTING_THUMB);
  const [hovered, setHovered] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const dragging = useRef<{
    axis: "x" | "y";
    pointer: number;
    scroll: number;
    ratio: number;
  } | null>(null);

  /**
   * The virtual-scroll fields as stable primitives, captured once per render.
   * A host passing `virtualScroll={{ offset, contentSize, viewportSize }}`
   * as an inline literal gets a fresh OBJECT every render; depending on that
   * object would rebuild the memoised measurements — and with them the
   * ResizeObserver subscription — on every host render, forcing a full
   * re-measure each time. The values are what the measurements actually
   * read; the identity is noise.
   */
  const virtual = virtualScroll != null;
  const virtualViewport = virtualScroll?.viewportSize ?? 0;
  const virtualContent = virtualScroll?.contentSize ?? 0;
  const virtualOffset = virtualScroll?.offset ?? 0;

  const thumb = useCallback(
    (
      viewport: HTMLDivElement,
      track: HTMLDivElement | null,
      axis: "x" | "y",
    ): ThumbMetrics => {
      const viewportSize =
        axis === "y" && virtual
          ? virtualViewport
          : axis === "y"
            ? viewport.clientHeight
            : viewport.clientWidth;
      const contentSize =
        axis === "y" && virtual
          ? virtualContent
          : axis === "y"
            ? viewport.scrollHeight
            : viewport.scrollWidth;
      const trackSize =
        (track
          ? axis === "y"
            ? track.clientHeight
            : track.clientWidth
          : viewportSize) || 1;
      const scrollable = contentSize - viewportSize;
      if (scrollable <= (virtual ? 0 : 1)) return FITTING_THUMB;
      const size = Math.max(
        MIN_THUMB,
        (viewportSize / contentSize) * trackSize,
      );
      const position =
        axis === "y" && virtual
          ? virtualOffset
          : axis === "y"
            ? viewport.scrollTop
            : viewport.scrollLeft;
      return {
        size,
        offset: (position / scrollable) * (trackSize - size),
        ratio: position / scrollable,
      };
    },
    [virtual, virtualViewport, virtualContent, virtualOffset],
  );

  /** Same metrics ⇒ same thumb. Object identity is the render signal. */
  const sameMetrics = (a: ThumbMetrics, b: ThumbMetrics) =>
    a.size === b.size && a.offset === b.offset && a.ratio === b.ratio;

  const update = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    // `scrollWidth` reports content clipped by `overflow-x: hidden` just as
    // loudly as content that can actually be scrolled to, so a sideways-locked
    // region has to be told off here: measuring it would draw a bar over an
    // axis with nothing to scroll.
    const nextX = horizontal && viewport.scrollWidth - viewport.clientWidth > 1;
    const nextY = vertical && (virtual
      ? virtualContent > virtualViewport
      : viewport.scrollHeight - viewport.clientHeight > 1);
    // Guarded by value, reusing the previous object when unchanged: the
    // ResizeObserver fires on any resize *nearby* — a panel collapsing
    // elsewhere on the page re-runs this callback with geometry that is
    // frequently identical — and handing `setState` a fresh object every
    // time re-rendered the whole area on frames where nothing moved. Same
    // values return the same object and React bails the render out entirely.
    setOverflow((prev) =>
      prev.x === nextX && prev.y === nextY ? prev : { x: nextX, y: nextY },
    );
    const nextYThumb = vertical ? thumb(viewport, yTrackRef.current, "y") : FITTING_THUMB;
    setThumbY((prev) => (sameMetrics(prev, nextYThumb) ? prev : nextYThumb));
    const nextXThumb = horizontal
      ? thumb(viewport, xTrackRef.current, "x")
      : FITTING_THUMB;
    setThumbX((prev) => (sameMetrics(prev, nextXThumb) ? prev : nextXThumb));
  }, [thumb, horizontal, vertical, virtual, virtualContent, virtualViewport]);

  // The latest `update`, read through a ref, so the observer subscription
  // below is built exactly once — `update`'s identity changing (a genuine
  // value change, a `horizontal` flip) must never tear down and rebuild the
  // observer; the ref always sees the current one.
  const updateRef = useRef(update);
  useEffect(() => {
    updateRef.current = update;
  });

  // Re-measure on any size change, of the frame or of the content inside it.
  // No ResizeObserver (jsdom, old engines) means falling back to window
  // resizes alone; the scroll handler keeps the thumbs honest meanwhile.
  // The observer watches viewport AND content, so two callbacks per frame is
  // normal — they coalesce into one rAF-batched `update()`, which also keeps
  // this callback off the forced-layout path inside a panel's sweep.
  useEffect(() => {
    updateRef.current();
    let observer: ResizeObserver | undefined;
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        updateRef.current();
      });
    };
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(schedule);
      if (viewportRef.current) observer.observe(viewportRef.current);
      if (contentRef.current) observer.observe(contentRef.current);
    } else {
      window.addEventListener("resize", schedule);
    }
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => () => window.clearTimeout(lingerTimer.current), []);

  const handleScroll = () => {
    update();
    setScrolling(true);
    window.clearTimeout(lingerTimer.current);
    lingerTimer.current = window.setTimeout(
      () => setScrolling(false),
      SCROLL_LINGER_MS,
    );
  };

  const previousVirtualOffset = useRef(virtualScroll?.offset);
  useEffect(() => {
    if (previousVirtualOffset.current === virtualScroll?.offset) return;
    previousVirtualOffset.current = virtualScroll?.offset;
    if (!virtualScroll) return;
    setScrolling(true);
    window.clearTimeout(lingerTimer.current);
    lingerTimer.current = window.setTimeout(
      () => setScrolling(false),
      SCROLL_LINGER_MS,
    );
  }, [virtualScroll]);

  const visible = (overflows: boolean) => {
    if (!overflows || variant === "hidden") return false;
    if (variant === "always") return true;
    if (variant === "hover") return hovered;
    if (variant === "scroll") return scrolling;
    return hovered || scrolling; // auto
  };
  const yVisible = visible(overflow.y);
  const xVisible = visible(overflow.x);

  const startDrag =
    (axis: "x" | "y") => (event: React.PointerEvent<HTMLDivElement>) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      const track = axis === "y" ? yTrackRef.current : xTrackRef.current;
      const metrics = axis === "y" ? thumbY : thumbX;
      const travel =
        (track ? (axis === "y" ? track.clientHeight : track.clientWidth) : 0) -
        metrics.size;
      const scrollable =
        axis === "y" && virtualScroll
          ? virtualScroll.contentSize - virtualScroll.viewportSize
          : (axis === "y" ? viewport.scrollHeight : viewport.scrollWidth) -
            (axis === "y" ? viewport.clientHeight : viewport.clientWidth);
      dragging.current = {
        axis,
        pointer: axis === "y" ? event.clientY : event.clientX,
        scroll:
          axis === "y" && virtualScroll
            ? virtualScroll.offset
            : axis === "y"
              ? viewport.scrollTop
              : viewport.scrollLeft,
        ratio: travel > 0 ? scrollable / travel : 0,
      };
    };

  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragging.current;
    const viewport = viewportRef.current;
    if (!drag || !viewport) return;
    const pointer = drag.axis === "y" ? event.clientY : event.clientX;
    const delta = (pointer - drag.pointer) * drag.ratio;
    if (drag.axis === "y" && virtualScroll)
      virtualScroll.onScroll(
        Math.max(
          0,
          Math.min(
            virtualScroll.contentSize - virtualScroll.viewportSize,
            drag.scroll + delta,
          ),
        ),
      );
    else if (drag.axis === "y") viewport.scrollTop = drag.scroll + delta;
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
        ref={setViewportRef}
        id={viewportId}
        data-slot="scrollarea-viewport"
        tabIndex={overflow.x || overflow.y ? tabIndex : -1}
        data-overflow-x={overflow.x ? "" : undefined}
        data-overflow-y={overflow.y ? "" : undefined}
        onScroll={handleScroll}
        // The clamp is inline, not a class: the viewport's own
        // `overflow-auto` would otherwise compete with it in the cascade,
        // and a lost contest would leave an axis that scrolls with no bar.
        style={{
          ...maskStyle(),
          ...(virtualScroll ? { overflow: "hidden" } : null),
          ...(horizontal ? null : { overflowX: "hidden" as const }),
          ...(vertical ? null : { overflowY: "hidden" as const }),
        }}
        className={classNames(
          "relative z-0 h-full w-full max-h-[inherit] overflow-auto rounded-[inherit] outline-none",
          // `max-height: inherit` is what makes a `max-h-*` frame work: a
          // percentage height would resolve against an auto-height parent
          // and the viewport would simply grow past the frame's cap, get
          // clipped by `overflow-hidden` and never learn it was scrollable.
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400",
          viewportClassName,
        )}
      >
        <div
          ref={contentRef}
          data-slot="scrollarea-content"
          className={classNames(
            virtualScroll ? "h-full min-w-full" : "table min-w-full",
            // The overlay bar's lane is reserved in the content *always*:
            // the auto/hover bar appears on gesture, and a gutter tied to
            // its visibility would jog the text sideways on every scroll.
            // A constant 10px inset is the calmer contract — the thumb then
            // never sits on the caller's content, or its hover state.
            "pr-2.5",
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>

      {vertical && <div
        data-slot="scrollarea-scrollbar"
        data-orientation="vertical"
        data-state={yVisible ? "visible" : "hidden"}
        role="scrollbar"
        aria-controls={viewportId}
        aria-orientation="vertical"
        aria-label="Vertical scroll"
        aria-valuenow={Math.round(thumbY.ratio * 100)}
        className={classNames(
          BAR_BASE,
          "right-0 top-0 h-full w-2.5 flex-col border-x border-transparent p-[3px]",
        )}
      >
        <div ref={yTrackRef} className="relative h-full w-full">
          <div
            data-slot="scrollarea-handle"
            style={{
              height: thumbY.size,
              transform: `translateY(${thumbY.offset}px)`,
            }}
            onPointerDown={startDrag("y")}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className={classNames(THUMB_BASE, "w-full")}
          />
        </div>
      </div>}

      {/* The sideways bar is not there at all when the axis is locked — a
          `role="scrollbar"` that scrolls nothing is a promise the region
          cannot keep, for the pointer and for a screen reader alike. */}
      {horizontal && (
        <div
          data-slot="scrollarea-scrollbar"
          data-orientation="horizontal"
          data-state={xVisible ? "visible" : "hidden"}
          role="scrollbar"
          aria-controls={viewportId}
          aria-orientation="horizontal"
          aria-label="Horizontal scroll"
          aria-valuenow={Math.round(thumbX.ratio * 100)}
          className={classNames(
            BAR_BASE,
            "bottom-0 left-0 h-2.5 w-full flex-row border-y border-transparent p-[3px]",
          )}
        >
          <div ref={xTrackRef} className="relative h-full w-full">
            <div
              data-slot="scrollarea-handle"
              style={{
                width: thumbX.size,
                transform: `translateX(${thumbX.offset}px)`,
              }}
              onPointerDown={startDrag("x")}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className={classNames(THUMB_BASE, "h-full")}
            />
          </div>
        </div>
      )}

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
