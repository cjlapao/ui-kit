import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import Button from "./Button";
import Panel from "./Panel";
import Spinner from "./Spinner";
import { useSurfaceText } from "../contexts/SurfaceContext";
import {
  DEFAULT_SURFACE_CORNER,
  getSurfacePaddingClass,
} from "../theme/Theme";
import type { ControlSize, TrueColor } from "../theme/Theme";
import type {
  PanelCorner,
  PanelPadding,
  PanelSpecularMode,
  PanelVariant,
} from "./Panel";
import type { GlassOpacity, GlassVibrancy } from "../theme/glass";

/** Every container surface, plus `plain` for use inside a card that exists. */
export type InfiniteScrollPanelVariant = PanelVariant | "plain";

/**
 * How the items are arranged.
 *
 * - `list`    — one column, reading order preserved
 * - `grid`    — responsive columns, reading order preserved (left to right)
 * - `masonry` — responsive columns, rows spanned to the item's height
 * - `columns` — balanced columns filled top-to-bottom, so reading order runs
 *               *down* each column rather than across
 *
 * Replaces the `masonry` / `useFixedColumns` boolean pair, which could express
 * four states of which only three meant anything and hid the reading-order
 * trade-off behind a name that did not mention it.
 */
export type InfiniteScrollLayout = "list" | "grid" | "masonry" | "columns";

const GAP_CLASSES: Record<ControlSize, string> = {
  xs: "gap-1.5",
  sm: "gap-2.5",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

/** Grid row unit for the masonry span maths. */
const MASONRY_ROW_PX = 8;

/** Thin scrollbar, the same treatment Panel's body uses. */
const SCROLLBAR =
  "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-transparent";

export interface InfiniteScrollPanelProps<T> {
  items: T[];
  /** True while the *first* page is loading. */
  isLoading?: boolean;
  hasMore: boolean;
  /**
   * Awaited when more items are needed. Rejections are surfaced as a retry
   * state rather than swallowed into the console.
   */
  onLoadMore: () => Promise<void>;
  renderItem: (item: T, index: number) => React.ReactNode;
  /**
   * Stable key per item. Defaults to the index, which is safe only while the
   * list is append-only.
   */
  getItemKey?: (item: T, index: number) => React.Key;

  // ── Layout ────────────────────────────────────────────────────────────────
  /** @default "masonry" */
  layout?: InfiniteScrollLayout;
  /** Narrowest a column may get before the count drops. @default 300 */
  minColumnWidth?: number;
  maxColumns?: number;
  /** Explicit `grid-template-columns`, overriding the computed one. */
  columnTemplate?: string;
  /** Space between items. @default "md" */
  gap?: ControlSize;

  // ── Fetching ──────────────────────────────────────────────────────────────
  /**
   * How far below the viewport the sentinel is observed, in pixels. Used to be
   * `threshold`, which was multiplied by a magic 50 *and* reused as an item
   * count — two different meanings for one prop.
   * @default 320
   */
  rootMargin?: number;
  /**
   * Keep fetching until at least this many items are loaded, so a short first
   * page still fills the panel. @default 0
   */
  minItems?: number;

  // ── States ────────────────────────────────────────────────────────────────
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  /** Shown once `hasMore` is false and there is something to show. */
  endComponent?: React.ReactNode;
  /** Copy for the built-in end marker. @default "You have reached the end" */
  endMessage?: React.ReactNode;
  /** Copy for the built-in empty state. @default "No items found" */
  emptyMessage?: React.ReactNode;
  /** Called when `onLoadMore` rejects, in addition to the retry state. */
  onError?: (error: unknown) => void;

  // ── Surface ───────────────────────────────────────────────────────────────
  /** @default "plain" — this is usually dropped into a card the app owns. */
  variant?: InfiniteScrollPanelVariant;
  tone?: TrueColor;
  corner?: PanelCorner;
  padding?: PanelPadding;
  glassOpacity?: GlassOpacity;
  vibrancy?: GlassVibrancy;
  specularMode?: PanelSpecularMode;
  /** Fixed height for the scroll area. Otherwise it fills its parent. */
  height?: number | string;
  className?: string;
  /** Class for the scrolling element itself. */
  bodyClassName?: string;
}

interface ScrollBodyProps<T>
  extends Omit<
    InfiniteScrollPanelProps<T>,
    "variant" | "corner" | "glassOpacity" | "vibrancy" | "specularMode" | "className"
  > {
  tone: TrueColor;
}

/**
 * Split out so it can read the surface context `Panel` publishes — a component
 * cannot consume a provider it renders itself.
 */
function ScrollBody<T>({
  items,
  isLoading = false,
  hasMore,
  onLoadMore,
  renderItem,
  getItemKey,
  layout = "masonry",
  minColumnWidth = 300,
  maxColumns,
  columnTemplate,
  gap = "md",
  rootMargin = 320,
  minItems = 0,
  loadingComponent,
  emptyComponent,
  endComponent,
  endMessage = "You have reached the end",
  emptyMessage = "No items found",
  onError,
  tone,
  padding = "none",
  height,
  bodyClassName,
}: ScrollBodyProps<T>) {
  const surface = useSurfaceText();

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [columnCount, setColumnCount] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  const busy = isLoading || isLoadingMore;

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setError(null);
    try {
      await onLoadMore();
    } catch (caught) {
      // Was `console.error` and nothing else, so a failed page looked exactly
      // like the end of the list.
      setError(caught ?? new Error("Failed to load more items"));
      onError?.(caught);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, onLoadMore, onError]);

  // ── Sentinel ──────────────────────────────────────────────────────────────
  // An IntersectionObserver, not a debounced scroll handler comparing
  // `getBoundingClientRect`s. The old approach missed fast scrolls, fired on
  // every resize, and could not see the sentinel at all inside a nested
  // scroller that had not scrolled yet.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = containerRef.current;
    if (!sentinel || !root || !hasMore || error) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !busy) {
          void loadMore();
        }
      },
      { root, rootMargin: `0px 0px ${rootMargin}px 0px`, threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, error, busy, rootMargin, loadMore]);

  // Keeps fetching while the panel is under-filled.
  useEffect(() => {
    if (!hasMore || busy || error) return;
    if (items.length < minItems) void loadMore();
  }, [items.length, minItems, hasMore, busy, error, loadMore]);

  // ── Columns ───────────────────────────────────────────────────────────────
  const usesColumns = layout !== "list";

  useLayoutEffect(() => {
    if (!usesColumns) {
      setColumnCount(1);
      return undefined;
    }
    const element = containerRef.current;
    if (!element) return undefined;

    const measure = () => {
      const gapPx = 16;
      const available = element.clientWidth;
      const fits = Math.max(
        1,
        Math.floor((available + gapPx) / (minColumnWidth + gapPx)),
      );
      setColumnCount(maxColumns ? Math.min(fits, maxColumns) : fits);
    };

    measure();
    // A ResizeObserver on the panel, not a window resize listener: the panel
    // is often in a resizable split and the window never changes size.
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [usesColumns, minColumnWidth, maxColumns]);

  // ── Masonry spans ─────────────────────────────────────────────────────────
  const recomputeSpans = useCallback(() => {
    if (layout !== "masonry") return;
    const grid = gridRef.current;
    if (!grid) return;
    const rowGap = parseFloat(window.getComputedStyle(grid).rowGap || "0");
    for (const element of itemRefs.current) {
      if (!element) continue;
      const span = Math.max(
        1,
        Math.ceil(
          (element.getBoundingClientRect().height + rowGap) /
            (MASONRY_ROW_PX + rowGap),
        ),
      );
      const next = `span ${span}`;
      if (element.style.gridRowEnd !== next) element.style.gridRowEnd = next;
    }
  }, [layout]);

  useLayoutEffect(() => {
    // Stale refs when the list shrinks would otherwise be measured forever.
    itemRefs.current.length = items.length;
    if (layout !== "masonry") return undefined;

    recomputeSpans();
    const observer = new ResizeObserver(recomputeSpans);
    for (const element of itemRefs.current) {
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [items, layout, recomputeSpans]);

  // ── Layout classes ────────────────────────────────────────────────────────
  const gridStyle = useMemo<React.CSSProperties>(() => {
    if (!usesColumns) return {};
    if (columnTemplate) return { gridTemplateColumns: columnTemplate };
    // Inline, not `grid-cols-{n}` classes: the old version had a hand-written
    // ladder that stopped at 5, so a sixth column silently became one column.
    return {
      gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
      ...(layout === "masonry"
        ? { gridAutoRows: `${MASONRY_ROW_PX}px` }
        : {}),
    };
  }, [usesColumns, columnTemplate, columnCount, layout]);

  /** Balanced buckets, filled top-to-bottom within each column. */
  const buckets = useMemo(() => {
    if (layout !== "columns") return [];
    return Array.from({ length: columnCount }, (_, column) =>
      items
        .map((item, index) => ({ item, index }))
        .filter(({ index }) => index % columnCount === column),
    );
  }, [layout, items, columnCount]);

  const gapClass = GAP_CLASSES[gap] ?? GAP_CLASSES.md;

  const body = (() => {
    if (items.length === 0) {
      if (isLoading) {
        return (
          <div className="flex min-h-40 items-center justify-center p-8">
            {loadingComponent ?? <Spinner color={tone} size="lg" variant="segments" />}
          </div>
        );
      }
      return (
        emptyComponent ?? (
          <div
            className={classNames(
              "flex min-h-40 items-center justify-center p-12 text-center text-sm",
              surface.muted,
            )}
          >
            {emptyMessage}
          </div>
        )
      );
    }

    if (layout === "columns") {
      return (
        <div className={classNames("grid", gapClass)} style={gridStyle}>
          {buckets.map((bucket, column) => (
            <div key={column} className={classNames("flex flex-col", gapClass)}>
              {bucket.map(({ item, index }) => (
                <div key={getItemKey?.(item, index) ?? index}>
                  {renderItem(item, index)}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        ref={gridRef}
        className={classNames(
          layout === "list" ? "flex flex-col" : "grid items-start",
          gapClass,
        )}
        style={gridStyle}
      >
        {items.map((item, index) => (
          <div
            key={getItemKey?.(item, index) ?? index}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    );
  })();

  const footer = (() => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="text-sm text-rose-600 dark:text-rose-400">
            Could not load more items.
          </span>
          <Button
            size="sm"
            variant="outline"
            color={tone}
            leadingIcon="Refresh"
            onClick={() => {
              setError(null);
              void loadMore();
            }}
          >
            Try again
          </Button>
        </div>
      );
    }

    if (hasMore) {
      return (
        <div className="flex items-center justify-center p-8">
          {loadingComponent ?? (
            <div className="flex flex-col items-center justify-center gap-3">
              <Spinner color={tone} size="lg" variant="segments" thickness="thick" />
              <span className={classNames("text-sm", surface.muted)}>
                Loading more...
              </span>
            </div>
          )}
        </div>
      );
    }

    if (items.length === 0) return null;

    // The list used to just stop, with no signal that it was finished.
    return (
      endComponent ?? (
        <div
          className={classNames(
            "flex items-center justify-center p-6 text-center text-xs",
            surface.muted,
          )}
        >
          {endMessage}
        </div>
      )
    );
  })();

  return (
    <div
      ref={containerRef}
      className={classNames(
        "relative flex h-full min-h-0 flex-col overflow-y-auto overflow-x-hidden",
        // The inset lives on the scrolling element, not on the Panel around
        // it. A browser draws a scrollbar at the *scroller's* border edge, so
        // padding the Panel instead left the bar floating inside the card with
        // a strip of card still visible to its right.
        getSurfacePaddingClass(padding),
        // `scrollbar-thin scrollbar-track-*` came from the tailwind-scrollbar
        // plugin, which this kit does not install — every one of those classes
        // was inert.
        SCROLLBAR,
        bodyClassName,
      )}
      style={height === undefined ? undefined : { height }}
      aria-busy={busy}
    >
      {body}
      {/* Always rendered while more may arrive, so the observer has something
          to watch even before the first scroll. */}
      {(hasMore || Boolean(error)) && <div ref={sentinelRef} aria-hidden="true" />}
      {footer}
    </div>
  );
}

export function InfiniteScrollPanel<T>({
  variant = "plain",
  tone = "blue",
  corner = DEFAULT_SURFACE_CORNER,
  padding = "none",
  glassOpacity,
  vibrancy,
  specularMode,
  className,
  ...rest
}: InfiniteScrollPanelProps<T>) {
  const body = <ScrollBody<T> tone={tone} padding={padding} {...rest} />;

  if (variant === "plain") {
    return <div className={classNames("h-full min-h-0", className)}>{body}</div>;
  }

  return (
    <Panel
      variant={variant}
      tone={tone}
      corner={corner}
      glassOpacity={glassOpacity}
      vibrancy={vibrancy}
      specularMode={specularMode}
      // No inset here: the scrolling body owns it, so its scrollbar reaches
      // the card's edge.
      padding="none"
      // The panel does not scroll; the body inside it does.
      scrollable={false}
      className={className}
    >
      {body}
    </Panel>
  );
}

export default InfiniteScrollPanel;
