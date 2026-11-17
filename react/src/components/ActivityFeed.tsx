import { getSurfaceAccentColor } from "../theme/Theme";
import type { SurfaceTone } from "../theme/Theme";
import { useMemo, useRef, useState } from "react";
import classNames from "classnames";
import Button, { type ButtonVariant } from "./Button";
import EmptyState from "./EmptyState";
import MultiToggle from "./MultiToggle";
import Panel, { SkeletonBar } from "./Panel";
import Pill from "./Pill";
import ScrollArea from "./ScrollArea";
import Spinner from "./Spinner";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import {
  getTrueColorDotClass,
  SURFACE_TO_BUTTON_VARIANT,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "../theme";

/** One entry in the feed. */
export interface ActivityFeedItem {
  id: string;
  /** What happened, in one line. */
  title: string;
  /** Supporting copy. */
  description?: string;
  /** A monospaced reference — a PR number, a ticket id. */
  code?: string;
  /** Who did it. */
  actor?: string;
  /** Pre-formatted ("3m ago", "09:12") — feeds rarely want live clocks. */
  timestamp: string;
  /** Status dot tone. @default "neutral" */
  tone?: TrueColor;
  /** Group this entry belongs to. Filters match it (falling back to `tone`). */
  category?: string;
  /** Entries this one aggregates — rendered as a count badge. */
  count?: number;
  /**
   * Makes the row clickable — pointer cursor and a hover wash, the same
   * treatment the Table gives its rows.
   */
  onClick?: () => void;
}

/** A feed filter; the value `"all"` always matches. */
export interface ActivityFeedFilter {
  label: string;
  value: string;
}

export interface ActivityFeedProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "color"> {
  /** @default "Recent activity" */
  title?: string;
  items: ActivityFeedItem[];
  /** Filter segment control; an "All" segment is prepended for you. */
  filters?: ActivityFeedFilter[];
  /** @default "all" */
  defaultFilter?: string;
  onFilterChange?: (value: string) => void;
  /** A pill beside the title (a source name, a state). */
  tag?: string;
  /** Trailing header link (to the full log). */
  linkLabel?: string;
  onLink?: () => void;
  /**
   * The link's button variant. Follows the card's own `variant` by default —
   * an outlined card offers an outlined button.
   * @default SURFACE_TO_BUTTON_VARIANT[variant]
   */
  ctaVariant?: ButtonVariant;
  /**
   * The Load-more button variant. Follows the card's own `variant` by default.
   * @default SURFACE_TO_BUTTON_VARIANT[variant]
   */
  loadMoreVariant?: ButtonVariant;
  /**
   * The filter's track variant — the same surface vocabulary the card wears.
   * Follows the card's own `variant`, so the track reads as a slice of the card.
   * @default variant
   */
  filterVariant?: SurfaceVariant;
  /**
   * The tone the filter track and selected segment wear. Falls back to
   * `controlsTone`, then to the card's accent — name it only when the filter
   * should carry a different tone than the buttons and pill around it.
   */
  filterTone?: TrueColor;
  /** Tail button; rendered only when both are provided. */
  onLoadMore?: () => void | Promise<void>;
  hasMore?: boolean;
  /**
   * How the next page is requested.
   *
   * `"scroll"` (default) is infinite — the kit's shared `useInfiniteScroll`
   * watch: a sentinel at the feed's end is observed inside the capped
   * `ScrollArea` with a `rootMargin` lookahead, so the next page is already
   * in flight while the current one is being read, and it keeps filling
   * until the viewport is full. It needs `maxHeight` — an uncapped feed has
   * no scroller to watch, and degrades to the button. `"button"` is the
   * explicit Load-more tail.
   * @default "scroll"
   */
  loadMode?: "scroll" | "button";
  /** How far below the fold the sentinel is watched, in px. @default 320 */
  rootMargin?: number;
  /**
   * Keep fetching until at least this many rows are loaded, so a short page
   * still fills the capped body. @default 0
   */
  minItems?: number;
  /** Change when the underlying dataset is replaced wholesale (a refetch). */
  scrollResetKey?: string | number;
  /** Fires when a page fetch rejects, alongside the inline retry state. */
  onError?: (error: unknown) => void;
  /**
   * The tone the controls wear — filter track, tag pill, CTA and Load-more.
   * By default they follow the card's own accent, and an untoned card leaves
   * them at each control's default (blue); name a tone here to pick,
   * including `neutral` for a deliberately grey control set the fallback
   * alone cannot reach.
   */
  controlsTone?: TrueColor;
  /**
   * Draws the feed's own shape in placeholder ink while the events are in
   * flight — same row rhythm, nothing jumps when they land.
   * @default false
   */
  loading?: boolean;
  /** @default "Load more" */
  loadMoreLabel?: string;
  /** Shown in the header when the caller knows the true total. */
  totalCount?: number;
  /**
   * Caps the feed's body and lets it scroll — a px number or any CSS
   * length. Unset, the feed grows to its full height exactly as before; set,
   * the rows (and the loading skeleton) scroll inside the card, with a right
   * gutter appearing when the bar does, while the header, filters and
   * Load-more stay pinned outside.
   */
  maxHeight?: number | string;
  /** Surface, as every card in the kit takes it. @default "outlined" */
  variant?: SurfaceVariant;
  /** @default "neutral" */
  tone?: SurfaceTone;
  /** @default "md" */
  padding?: SurfacePadding;
  corner?: SurfaceCorner;
}

/**
 * The audit log as a living feed: newest first, toned dots for what
 * happened, a segment control for who or what kind, and a tail that says
 * there is more. Rows are dense on purpose — feeds are skimmed, not read.
 */
export const ActivityFeed = ({
  title = "Recent activity",
  items,
  filters = [],
  defaultFilter = "all",
  onFilterChange,
  tag = "",
  linkLabel = "",
  onLink,
  ctaVariant,
  loadMoreVariant,
  filterVariant,
  filterTone,
  onLoadMore,
  hasMore = false,
  loadMode = "scroll",
  rootMargin,
  minItems,
  scrollResetKey,
  onError,
  controlsTone,
  loading = false,
  loadMoreLabel = "Load more",
  totalCount,
  maxHeight,
  variant = "outlined",
  tone: surfaceTone = "none",
  padding = "md",
  corner,
  className = "",
  ...rest
}: ActivityFeedProps) => {
  const tone = getSurfaceAccentColor(surfaceTone);
  // The controls' accent, once. Unset inherits each control's own default —
  // `undefined` on a neutral card, so Button and MultiToggle keep their blue,
  // exactly as before. The pill needs a concrete tone, so it spells the same
  // fallback the hardcoded `blue` used to.
  const controlColor = controlsTone ?? (tone === "neutral" ? undefined : tone);
  const pillTone = controlsTone ?? (tone === "neutral" ? "blue" : tone);
  // The filter sits one level below `controlsTone` in the chain: give it a
  // tone of its own and only the filter moves.
  const filterColor = filterTone ?? controlColor;
  const [active, setActive] = useState(defaultFilter);

  const options = useMemo(
    () => [{ label: "All", value: "all" }, ...filters],
    [filters],
  );

  const visible = useMemo(
    () =>
      active === "all"
        ? items
        : items.filter((item) => (item.category ?? item.tone) === active),
    [items, active],
  );

  const pick = (value: string) => {
    setActive(value);
    onFilterChange?.(value);
  };

  // Infinite loading rides the kit's shared `useInfiniteScroll` — the same
  // watch the Table and `InfiniteScrollPanel` run: a sentinel observed inside
  // the ScrollArea's viewport with a `rootMargin` lookahead, so a page is
  // already in flight before the reader reaches the end, and the under-fill
  // pass keeps fetching until the body is full. It only engages with a
  // capped body — an uncapped feed has no scroller to watch, and the
  // Load-more button covers it.
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const infinite = loadMode === "scroll" && maxHeight !== undefined && !!onLoadMore;
  const scroll = useInfiniteScroll({
    rootRef: viewportRef,
    sentinelRef,
    hasMore: infinite && hasMore,
    isLoading: loading,
    onLoadMore: async () => {
      await onLoadMore?.();
    },
    itemCount: visible.length,
    minItems,
    rootMargin,
    // Switching filters swaps the dataset, and the watch resets with it.
    resetKey: `${active}:${scrollResetKey ?? ""}`,
    onError,
  });

  // The scroll tail: a bare spinner while a page is in flight, a one-line
  // retry on failure. Silent on success — the rows just arrive.
  const scrollTail = infinite ? (
    <>
      <div ref={sentinelRef} aria-hidden="true" />
      {scroll.error ? (
        <div
          data-slot="activity-feed-scroll-error"
          className="flex items-center justify-center gap-2 py-2 text-xs text-rose-600 dark:text-rose-400"
        >
          Couldn't load more
          <Button size="xs" variant="link" onClick={() => void scroll.loadMore()}>
            Try again
          </Button>
        </div>
      ) : scroll.isLoadingMore ? (
        <div
          data-slot="activity-feed-scroll-loading"
          className="flex justify-center py-2"
          role="status"
          aria-label="Loading more"
        >
          <Spinner size="xs" color={controlColor} />
        </div>
      ) : null}
    </>
  ) : null;

  // The row's content, shared by the plain and clickable branches — the `li`
  // itself is the only thing that differs.
  const rowBody = (item: ActivityFeedItem) => (
    <>
      <span
        className={classNames(
          getTrueColorDotClass(item.tone ?? (tone === "neutral" ? "neutral" : tone)),
          "mt-1.5 size-2 shrink-0 rounded-full",
        )}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="min-w-0 truncate text-sm font-medium">
            {item.actor && (
              <span className="font-semibold">{item.actor} </span>
            )}
            {item.title}
          </span>
          {item.count !== undefined && item.count > 1 && (
            <Pill size="sm" tone="neutral">
              ×{item.count}
            </Pill>
          )}
        </div>
        {item.description && (
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            {item.description}
          </p>
        )}
        {item.code && (
          <code className="mt-1 inline-block rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] tracking-tighter text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {item.code}
          </code>
        )}
      </div>
      <time className="shrink-0 pt-0.5 text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
        {item.timestamp}
      </time>
    </>
  );

  // The body is built before the layout so the three states — rows, skeleton
  // and empty — share one scroller when `maxHeight` caps the card. Swapping
  // states never resizes the card or drops the scroll area around them, and
  // the Load-more button stays outside, pinned under the card: you scroll the
  // feed, not the affordance.
  const body = loading ? (
    <div
      className="flex flex-col divide-y divide-neutral-100 animate-pulse motion-reduce:animate-none dark:divide-neutral-800"
      aria-hidden="true"
    >
      {Array.from({ length: Math.min(Math.max(items.length, 3), 6) }).map(
        (_, index) => (
          <div key={index} className="flex items-center gap-3 py-3 first:pt-1 last:pb-0">
            <SkeletonBar className="size-2 shrink-0 rounded-full" height="h-2" />
            <SkeletonBar className="h-3 flex-1" width={`${74 - index * 8}%`} />
            <SkeletonBar className="h-3 w-10 shrink-0" />
          </div>
        ),
      )}
    </div>
  ) : visible.length === 0 ? (
    <EmptyState
      icon="Log"
      title="Nothing here"
      subtitle="No events match this filter yet."
    />
  ) : (
    <ol className="divide-y divide-neutral-100 dark:divide-neutral-800">
      {visible.map((item) =>
        item.onClick ? (
          // A clickable row is a control: like `StatCard`'s clickable body it
          // carries the button semantics and the Enter/Space keys. The role
          // is spelled literally on this branch — a computed attribute reads
          // as an unknown `li` to the a11y resolver, and to tooling generally.
          // The rule bans listitem→button outright; here the row *is* the
          // affordance, the same stance `StatCard` takes for its whole-card
          // click, and the `ol` still announces the count of events.
          <li
            key={item.id}
            /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role */
            role="button"
            tabIndex={0}
            onClick={item.onClick}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                item.onClick?.();
              }
            }}
            className={classNames(
              "flex items-start gap-3 px-2 py-3 first:pt-1 last:pb-0",
              // The Table's clickable-row grammar: cursor plus a soft wash,
              // with the scroller's own focus ring for the keyboard path.
              "cursor-pointer transition-colors duration-150 ease-out hover:bg-neutral-50 dark:hover:bg-neutral-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400",
            )}
          >
            {rowBody(item)}
          </li>
        ) : (
          <li key={item.id} className="flex items-start gap-3 px-2 py-3 first:pt-1 last:pb-0">
            {rowBody(item)}
          </li>
        ),
      )}
    </ol>
  );

  return (
    <Panel
      {...rest}
      variant={variant}
      tone={surfaceTone}
      padding={padding}
      corner={corner}
      className={classNames("w-full", className)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="text-sm font-semibold">{title}</h3>
          {tag && !loading && (
            <Pill tone={pillTone} size="sm">
              {tag}
            </Pill>
          )}
          <span
            className={classNames(
              "text-xs text-neutral-500 dark:text-neutral-400",
              loading && "invisible",
            )}
            aria-hidden={loading || undefined}
          >
            {totalCount ?? visible.length}
            {totalCount !== undefined && filters.length > 0 && active !== "all"
              ? ` of ${totalCount}`
              : ""}{" "}
            {totalCount !== undefined && totalCount !== 1 ? "events" : "event"}
          </span>
          {linkLabel && !loading && (
            <Button
              variant={ctaVariant ?? SURFACE_TO_BUTTON_VARIANT[variant]}
              color={controlColor}
              size="sm"
              className="ms-auto"
              trailingIcon="ChevronRight"
              onClick={onLink}
            >
              {linkLabel}
            </Button>
          )}
        </div>

        {filters.length > 0 && !loading && (
          <MultiToggle
            options={options}
            value={active}
            onChange={pick}
            variant={filterVariant ?? variant}
            size="sm"
            tone={filterColor}
          />
        )}

        {maxHeight === undefined ? (
          body
        ) : (
          <ScrollArea
            horizontal={false}
            viewportRef={viewportRef}
            style={{
              maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
            }}
          >
            {body}
            {scrollTail}
          </ScrollArea>
        )}

        {/* The button tail: explicit `"button"` mode, or an uncapped feed
            where scroll mode has no scroller to watch. */}
        {hasMore && onLoadMore && !loading && !infinite && (
          <Button
            variant={loadMoreVariant ?? SURFACE_TO_BUTTON_VARIANT[variant]}
            color={controlColor}
            size="sm"
            className="self-center"
            onClick={onLoadMore}
          >
            {loadMoreLabel}
          </Button>
        )}
      </div>
    </Panel>
  );
};

ActivityFeed.displayName = "ActivityFeed";

export default ActivityFeed;
