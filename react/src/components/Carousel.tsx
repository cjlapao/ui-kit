import classNames from "classnames";
import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ORIENTATIONS, TRUE_COLORS } from "../theme/Theme";
import type { Orientation, TrueColor } from "../theme/Theme";
import { useIconRenderer } from "../contexts/IconContext";
import EmptyState from "./EmptyState";

export const CAROUSEL_ORIENTATIONS = ORIENTATIONS;
export type CarouselOrientation = Orientation;

/** The slide animation's duration — the wrap snap timer must outlive it. */
const TRANSITION_MS = 500;
/** How far a touch must travel along the axis to count as a swipe. */
const SWIPE_THRESHOLD = 20;

export interface CarouselResponsiveOption {
  /** The largest window width, in px, at which this option applies. */
  breakpoint: number;
  /** How many items to show while this option applies. */
  numVisible?: number;
  /** How many items to scroll per navigation while this option applies. */
  numScroll?: number;
}

export interface CarouselProps<T = ReactNode>
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  /** The content that slides through the viewport. */
  items: readonly T[];
  /** Draws an item. Omit it when `items` are already ready-made nodes. */
  renderItem?: (item: T, index: number) => ReactNode;
  /** Index of the first page shown. Control it to drive the carousel yourself. */
  page?: number;
  /** Initial page when uncontrolled. @default 0 */
  defaultPage?: number;
  /** Fires on every page change — navigators, indicators, swipes and autoplay. */
  onPageChange?: (page: number) => void;
  /** How many items are visible at once. @default 1 */
  numVisible?: number;
  /** How many items one navigation advances. @default 1 */
  numScroll?: number;
  /**
   * Per-breakpoint overrides. The first option whose `breakpoint` is at
   * least the window width applies.
   */
  responsiveOptions?: CarouselResponsiveOption[];
  /** @default "horizontal" */
  orientation?: CarouselOrientation;
  /** Viewport height in vertical layouts. @default "300px" */
  viewportHeight?: string | number;
  /**
   * Infinite scrolling — navigating past either end flows through clones and
   * wraps to the other side. Autoplay turns this on implicitly.
   * @default false
   */
  circular?: boolean;
  /**
   * Milliseconds between automatic advances; `0` (the default) disables
   * autoplay. A manual navigation pauses it for the component's lifetime,
   * matching PrimeVue.
   */
  autoplayInterval?: number;
  /** Show the previous/next buttons. @default true */
  showNavigators?: boolean;
  /** Show the indicator dots. @default true */
  showIndicators?: boolean;
  /** Tint of the navigators and the active indicator. @default "blue" */
  color?: TrueColor;
  /** Space between slides, in px. @default 8 */
  gap?: number;
  /** Content rendered above the track. */
  header?: ReactNode;
  /** Content rendered below the indicators. */
  footer?: ReactNode;
  /** Accessible name for the carousel region. @default "Carousel" */
  ariaLabel?: string;
  /** Accessible name for the previous button. @default "Previous page" */
  prevLabel?: string;
  /** Accessible name for the next button. @default "Next page" */
  nextLabel?: string;
  /** Show a skeleton shaped like the carousel instead of the content. */
  loading?: boolean;
  /** Custom loading content, replacing the skeleton. */
  loadingState?: ReactNode;
  /** Show an error state in place of the content; a string is the message. */
  error?: ReactNode | null;
  /** Custom error content. */
  errorState?: ReactNode;
  /** Message shown when `items` is empty. @default "No items to display." */
  emptyMessage?: string;
  /** Custom empty content. */
  emptyState?: ReactNode;
}

// ── Tone tokens ───────────────────────────────────────────────────────────────
// Generated from the shared TrueColor list, the same way `Rating` builds its,
// so a new tone in the theme reaches the carousel without a hand-typed entry.

type CarouselToneTokens = {
  /** Fill of the active indicator. */
  activeDot: string;
  /** The navigator's glyph tint on hover. */
  navHover: string;
  /** The wash behind a hovered navigator. */
  navHoverBg: string;
  /** The focus-ring colour of navigators and indicators. */
  ring: string;
};

const buildToneTokens = (color: TrueColor): CarouselToneTokens => ({
  activeDot: `bg-${color}-500 dark:bg-${color}-400`,
  navHover: `hover:text-${color}-600 dark:hover:text-${color}-400`,
  navHoverBg: `hover:bg-${color}-100 dark:hover:bg-${color}-500/10`,
  ring: `focus-visible:ring-${color}-400`,
});

const TONE_TOKENS: Record<TrueColor, CarouselToneTokens> = Object.fromEntries(
  TRUE_COLORS.map((color) => [color, buildToneTokens(color)]),
) as Record<TrueColor, CarouselToneTokens>;

const getToneTokens = (color: TrueColor): CarouselToneTokens =>
  TONE_TOKENS[color] ?? TONE_TOKENS.blue;

const clampInt = (value: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, Math.floor(Number.isFinite(value) ? value : lo)));

const mod = (n: number, m: number) => ((n % m) + m) % m;

const toPx = (value: string | number): string =>
  typeof value === "number" ? `${value}px` : value;

const SKELETON =
  "animate-pulse bg-black/10 motion-reduce:animate-none dark:bg-white/10";

export function Carousel<T = ReactNode>({
  items,
  renderItem,
  page,
  defaultPage,
  onPageChange,
  numVisible = 1,
  numScroll = 1,
  responsiveOptions,
  orientation = "horizontal",
  viewportHeight = "300px",
  circular = false,
  autoplayInterval = 0,
  showNavigators = true,
  showIndicators = true,
  color = "blue",
  gap = 8,
  header,
  footer,
  ariaLabel = "Carousel",
  prevLabel = "Previous page",
  nextLabel = "Next page",
  loading = false,
  loadingState,
  error,
  errorState,
  emptyMessage = "No items to display.",
  emptyState,
  className,
  ...rest
}: CarouselProps<T>): ReactNode {
  const isVertical = orientation === "vertical";
  const renderIcon = useIconRenderer();
  const tokens = getToneTokens(color);

  // ── Geometry (responsive-aware) ───────────────────────────────────────────

  const len = items.length;
  const baseNv = Math.max(1, Math.floor(Number.isFinite(numVisible) ? numVisible : 1));
  const baseNs = Math.max(1, Math.floor(Number.isFinite(numScroll) ? numScroll : 1));

  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window === "undefined" ? 0 : window.innerWidth,
  );
  useEffect(() => {
    if (!responsiveOptions?.length) return;
    const onResize = () => setWindowWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [responsiveOptions]);

  const sortedOptions = useMemo(
    () =>
      (responsiveOptions ?? []).slice().sort((a, b) => a.breakpoint - b.breakpoint),
    [responsiveOptions],
  );
  const matched = sortedOptions.find((o) => windowWidth <= o.breakpoint);
  const nv = Math.max(1, Math.floor(matched?.numVisible ?? baseNv));
  const ns = Math.max(1, Math.floor(matched?.numScroll ?? baseNs));

  const maxShift = Math.max(0, len - nv);
  const totalPages = len >= nv ? Math.max(1, Math.ceil((len - nv) / ns) + 1) : 0;
  // Autoplay only works when there is somewhere to go; while it is on the
  // carousel must be circular or it would stall at the last page.
  const isCircular = (circular || autoplayInterval > 0) && len > nv;

  // ── Page + physical position ──────────────────────────────────────────────
  //
  // `safePage` is the logical page. `physical` is where the track actually
  // sits, in item units (negative = shifted forward). In circular mode the
  // rendered list carries a clone of the last `nv` items at the front and a
  // clone of the first `nv` at the back, so the real pages sit at
  // `-(nv + shift)` and the wrap destinations sit at `-(len + nv)` (the head
  // clones showing page 0) and `0` (the tail clones showing the last page).
  // A wrap animates to its destination, then — once the 500ms animation has
  // had time to finish — snaps (transition off) back to the real position of
  // the page now visible. The clones show identical content, so the snap is
  // invisible; it re-anchors the track so the next step stays in range.

  const isControlled = page !== undefined;
  const initialPage = clampInt(
    (isControlled ? page : defaultPage) ?? 0,
    0,
    Math.max(0, totalPages - 1),
  );
  const [innerPage, setInnerPage] = useState(initialPage);
  const safePage = clampInt(
    (isControlled ? page : innerPage) ?? 0,
    0,
    Math.max(0, totalPages - 1),
  );

  const pageToShift = (p: number): number => {
    const pp = clampInt(p, 0, Math.max(0, totalPages - 1));
    const base = Math.min(pp * ns, maxShift);
    return isCircular ? -(nv + base) : -base;
  };

  const [physical, setPhysical] = useState(() => pageToShift(initialPage));
  const [animated, setAnimated] = useState(false);
  const [paused, setPaused] = useState(false);
  const [wrap, setWrap] = useState<{ navId: number; target: number } | null>(
    null,
  );
  const navIdRef = useRef(0);

  const commit = (next: number, source: "manual" | "auto") => {
    if (source === "manual") setPaused(true);
    if (!isControlled) setInnerPage(next);
    onPageChange?.(next);
  };

  const stepPage = (pageDir: 1 | -1, source: "manual" | "auto") => {
    if (totalPages === 0) return;
    const id = ++navIdRef.current;
    let next = safePage + pageDir;
    if (isCircular) {
      if (next === totalPages) {
        next = 0;
        if (!isControlled) {
          setWrap({ navId: id, target: pageToShift(0) });
          setPhysical(-(len + nv));
        }
      } else if (next < 0) {
        next = totalPages - 1;
        if (!isControlled) {
          setWrap({ navId: id, target: pageToShift(totalPages - 1) });
          setPhysical(0);
        }
      } else if (!isControlled) {
        setWrap(null);
        setPhysical(pageToShift(next));
      }
    } else {
      next = clampInt(next, 0, totalPages - 1);
      if (next === safePage) return;
      if (!isControlled) {
        setWrap(null);
        setPhysical(pageToShift(next));
      }
    }
    setAnimated(true);
    commit(next, source);
  };

  const goToPage = (target: number, source: "manual" | "auto") => {
    if (totalPages === 0) return;
    const clamped = clampInt(target, 0, totalPages - 1);
    if (clamped === safePage) return;
    navIdRef.current += 1;
    if (!isControlled) {
      setWrap(null);
      setPhysical(pageToShift(clamped));
      setAnimated(true);
    }
    commit(clamped, source);
  };

  // After a wrap animation completes, snap to the real position of the page
  // now visible. A newer navigation (any navId bump) supersedes the snap.
  useEffect(() => {
    if (!wrap) return;
    const timer = setTimeout(() => {
      if (navIdRef.current !== wrap.navId) return;
      setAnimated(false);
      setPhysical(wrap.target);
      setWrap(null);
    }, TRANSITION_MS + 50);
    return () => clearTimeout(timer);
  }, [wrap]);

  // The geometry changed (items, a responsive breakpoint, the circular
  // toggle): re-anchor the track without animating.
  const geometryKey = `${nv}|${ns}|${len}|${isCircular}`;
  const prevGeometryRef = useRef(geometryKey);
  useEffect(() => {
    if (prevGeometryRef.current === geometryKey) return;
    prevGeometryRef.current = geometryKey;
    navIdRef.current += 1;
    setWrap(null);
    setAnimated(false);
    setPhysical(pageToShift(safePage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometryKey]);

  // An external (controlled) page change animates to the new page.
  const lastExternalPageRef = useRef(page);
  useEffect(() => {
    if (page === undefined || lastExternalPageRef.current === page) return;
    lastExternalPageRef.current = page;
    navIdRef.current += 1;
    setWrap(null);
    setPhysical(pageToShift(clampInt(page, 0, Math.max(0, totalPages - 1))));
    setAnimated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ── Autoplay ──────────────────────────────────────────────────────────────

  const stepRef = useRef(stepPage);
  stepRef.current = stepPage;
  useEffect(() => {
    if (!autoplayInterval || autoplayInterval <= 0 || paused || totalPages === 0)
      return;
    const timer = setInterval(
      () => stepRef.current(1, "auto"),
      autoplayInterval,
    );
    return () => clearInterval(timer);
  }, [autoplayInterval, paused, totalPages]);

  // ── Indicators: roving tabindex + keyboard ────────────────────────────────

  const [rovingIndex, setRovingIndex] = useState(safePage);
  useEffect(() => {
    setRovingIndex(safePage);
  }, [safePage]);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onIndicatorKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const { key } = event;
    if (key === "Tab") {
      // A tab away and back should land on the dot of the page shown.
      event.preventDefault();
      setRovingIndex(safePage);
      dotRefs.current[safePage]?.focus();
      return;
    }
    const forward = key === "ArrowRight" || (isVertical && key === "ArrowDown");
    const backward = key === "ArrowLeft" || (isVertical && key === "ArrowUp");
    if (forward || backward || key === "Home" || key === "End") {
      event.preventDefault();
      const next = forward
        ? rovingIndex + 1
        : backward
          ? rovingIndex - 1
          : key === "Home"
            ? 0
            : totalPages - 1;
      const clamped = clampInt(next, 0, Math.max(0, totalPages - 1));
      setRovingIndex(clamped);
      dotRefs.current[clamped]?.focus();
      return;
    }
    // The remaining arrows/page keys would scroll the page behind the
    // carousel; swallow them while the indicators hold focus.
    if (
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      key === "PageUp" ||
      key === "PageDown"
    ) {
      event.preventDefault();
    }
  };

  // ── Swipe (touch only) ────────────────────────────────────────────────────

  const swipeRef = useRef<{ x: number; y: number; pointerId: number } | null>(
    null,
  );
  const onViewportPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;
    swipeRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onViewportPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeRef.current;
    if (!start || start.pointerId !== event.pointerId) return;
    swipeRef.current = null;
    const delta = isVertical
      ? event.clientY - start.y
      : event.clientX - start.x;
    if (Math.abs(delta) <= SWIPE_THRESHOLD) return;
    // "Forward" = content moves in the flow direction (reveals items ahead):
    // horizontal = leftward swipe, vertical = downward swipe.
    const forward = isVertical ? delta > 0 : delta < 0;
    stepPage(forward ? 1 : -1, "manual");
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const backwardDisabled =
    totalPages === 0 || (!isCircular && safePage === 0);
  const forwardDisabled =
    totalPages === 0 || (!isCircular && safePage === totalPages - 1);

  const itemContent = (item: T, index: number): ReactNode =>
    renderItem ? renderItem(item, index) : (item as ReactNode);

  const itemStyle: CSSProperties = {
    flex: `0 0 ${100 / nv}%`,
    ...(isVertical
      ? { paddingTop: gap / 2, paddingBottom: gap / 2 }
      : { paddingLeft: gap / 2, paddingRight: gap / 2 }),
  };

  const transform = isVertical
    ? `translate3d(0, ${physical * (100 / nv)}%, 0)`
    : `translate3d(${physical * (100 / nv)}%, 0, 0)`;

  // Which real items are in the window right now, for the off-screen items'
  // `aria-hidden` and the `data-carousel-active` flag. In circular mode the
  // track carries tail/head clones, so the window wraps through the clone
  // layout (modulo arithmetic). In non-circular mode there are no clones and
  // the visible block is simply the nv items starting at the current offset.
  const visibleSet = new Set<number>();
  const visibleCount = Math.min(nv, len);
  if (isCircular) {
    for (let k = 0; k < visibleCount; k++) {
      visibleSet.add(mod(-physical - nv + k, len));
    }
  } else {
    const startOffset = Math.abs(physical);
    for (let k = 0; k < visibleCount; k++) {
      visibleSet.add(startOffset + k);
    }
  }

  const track = (
    <div
      className="relative w-full overflow-hidden"
      style={isVertical ? { height: toPx(viewportHeight) } : undefined}
      onPointerDown={onViewportPointerDown}
      onPointerUp={onViewportPointerUp}
      onPointerCancel={() => {
        swipeRef.current = null;
      }}
    >
      <div
        className={classNames(
          "flex",
          isVertical ? "flex-col" : "flex-row",
          animated &&
            "transition-transform duration-500 ease-in-out motion-reduce:transition-none",
        )}
        style={{ transform }}
        aria-live={autoplayInterval > 0 ? "polite" : "off"}
      >
        {isCircular &&
          items.slice(-nv).map((item, index) => (
            <div
              key={`tail-clone-${index}`}
              aria-hidden="true"
              className="shrink-0 grow-0"
              style={itemStyle}
            >
              {itemContent(item, index)}
            </div>
          ))}
        {items.map((item, index) => (
          <div
            key={index}
            role="group"
            aria-label={`Slide ${index + 1} of ${len}`}
            aria-hidden={!visibleSet.has(index) || undefined}
            data-carousel-active={visibleSet.has(index) || undefined}
            className="shrink-0 grow-0"
            style={itemStyle}
          >
            {itemContent(item, index)}
          </div>
        ))}
        {isCircular &&
          items.slice(0, nv).map((item, index) => (
            <div
              key={`head-clone-${index}`}
              aria-hidden="true"
              className="shrink-0 grow-0"
              style={itemStyle}
            >
              {itemContent(item, index)}
            </div>
          ))}
      </div>
    </div>
  );

  const navButton = (dir: "prev" | "next") => {
    const disabled = dir === "prev" ? backwardDisabled : forwardDisabled;
    const icon = isVertical
      ? dir === "prev"
        ? "ArrowUp"
        : "ArrowDown"
      : dir === "prev"
        ? "ChevronLeft"
        : "ChevronRight";
    return (
      <button
        type="button"
        aria-label={dir === "prev" ? prevLabel : nextLabel}
        disabled={disabled}
        onClick={() => stepPage(dir === "prev" ? -1 : 1, "manual")}
        className={classNames(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          "bg-white/80 text-neutral-500 shadow-sm backdrop-blur-sm",
          "dark:bg-neutral-900/70 dark:text-neutral-400",
          "transition-colors focus-visible:outline-none focus-visible:ring-2",
          tokens.navHover,
          tokens.navHoverBg,
          tokens.ring,
          "disabled:pointer-events-none disabled:opacity-40",
        )}
      >
        {renderIcon(icon, "sm", "h-4 w-4 flex-shrink-0")}
      </button>
    );
  };

  const skeletonChip = (
    <div
      aria-hidden="true"
      className={classNames("h-8 w-8 rounded-full", SKELETON)}
    />
  );

  const skeleton = (
    <div className="flex w-full flex-col gap-2">
      {isVertical && showNavigators && (
        <div className="flex justify-center">{skeletonChip}</div>
      )}
      <div
        className={classNames(
          "relative w-full overflow-hidden",
          !isVertical && "flex items-center",
        )}
        style={isVertical ? { height: toPx(viewportHeight) } : undefined}
      >
        {isVertical ? (
          <div className="flex h-full flex-col">
            {Array.from({ length: nv }, (_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className={classNames("rounded-lg", SKELETON)}
                style={{
                  flex: `0 0 ${100 / nv}%`,
                  paddingTop: gap / 2,
                  paddingBottom: gap / 2,
                }}
              />
            ))}
          </div>
        ) : (
          <>
            {showNavigators && (
              <div className="absolute left-1 top-1/2 z-10 -translate-y-1/2">
                {skeletonChip}
              </div>
            )}
            <div className="flex">
              {Array.from({ length: nv }, (_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className={classNames("h-60 rounded-lg", SKELETON)}
                  style={{
                    flex: `0 0 ${100 / nv}%`,
                    paddingLeft: gap / 2,
                    paddingRight: gap / 2,
                  }}
                />
              ))}
            </div>
            {showNavigators && (
              <div className="absolute right-1 top-1/2 z-10 -translate-y-1/2">
                {skeletonChip}
              </div>
            )}
          </>
        )}
      </div>
      {isVertical && showNavigators && (
        <div className="flex justify-center">{skeletonChip}</div>
      )}
      {showIndicators && (
        <ul
          aria-hidden="true"
          className="flex items-center justify-center gap-1.5"
        >
          {Array.from({ length: Math.min(Math.max(1, nv), 5) }, (_, i) => (
            <li
              key={i}
              className={classNames(
                "h-1.5 w-1.5 rounded-full",
                SKELETON,
              )}
            />
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      data-orientation={orientation}
      data-color={color}
      data-circular={isCircular || undefined}
      className={classNames("w-full", className)}
      {...rest}
    >
      {header && <div className="mb-2">{header}</div>}

      {loading ? (
        loadingState ?? skeleton
      ) : error ? (
        errorState ?? (
          <EmptyState
            icon="Error"
            tone="rose"
            title="Something went wrong"
            subtitle={
              typeof error === "string"
                ? error
                : "An unexpected error occurred."
            }
          />
        )
      ) : len === 0 ? (
        emptyState ?? <EmptyState icon="ViewGrid" title={emptyMessage} />
      ) : (
        <>
          {isVertical ? (
            <div className="flex w-full flex-col items-center gap-1">
              {showNavigators && navButton("prev")}
              {track}
              {showNavigators && navButton("next")}
            </div>
          ) : (
            <div className="relative flex w-full items-center">
              {showNavigators && (
                <div className="absolute left-1 top-1/2 z-10 -translate-y-1/2">
                  {navButton("prev")}
                </div>
              )}
              {track}
              {showNavigators && (
                <div className="absolute right-1 top-1/2 z-10 -translate-y-1/2">
                  {navButton("next")}
                </div>
              )}
            </div>
          )}

          {showIndicators && (
            <ul
              aria-label="Slides"
              onKeyDown={onIndicatorKeyDown}
              className="mt-2 flex items-center justify-center gap-1.5"
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className="flex items-center justify-center">
                  <button
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    type="button"
                    tabIndex={i === rovingIndex ? 0 : -1}
                    aria-label={`Page ${i + 1}`}
                    aria-current={i === safePage ? "page" : undefined}
                    onClick={() => goToPage(i, "manual")}
                    className={classNames(
                      "h-1.5 w-1.5 rounded-full transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                      tokens.ring,
                      i === safePage
                        ? tokens.activeDot
                        : "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500",
                    )}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {footer && <div className="mt-2">{footer}</div>}
    </div>
  );
}

export default Carousel;
