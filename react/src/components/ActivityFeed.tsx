import { getSurfaceAccentColor } from "../theme/Theme";
import type { SurfaceTone } from "../theme/Theme";
import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import classNames from "classnames";
import Button, { type ButtonVariant } from "./Button";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import MultiToggle from "./MultiToggle";
import Panel, { SkeletonBar } from "./Panel";
import Pill from "./Pill";
import ScrollArea from "./ScrollArea";
import Spinner from "./Spinner";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useKitT } from "../i18n";
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
   * Makes the row clickable. The row is a Panel, and this becomes its card
   * action: pointer cursor, toned hover wash, focus ring, `role="button"`,
   * tabIndex and Enter/Space — the Panel API, not copied row classes.
   */
  onClick?: () => void;
  /**
   * Marks the row as the current one. The row's Panel takes the Panel API's
   * `active`: a 2px inset rim in the row's hue plus a light tone-tinted
   * fill, layered under the hover wash rather than replacing it.
   */
  active?: boolean;
  /**
   * Asks for the reader's attention. The row's Panel takes the Panel API's
   * `pulse`: a glow swelling inward from the row's own rim in the same hue
   * the selection rim would wear, following the corner radius and spilling
   * into no layout.
   */
  attention?: boolean;
  /**
   * Overrides the hue that attention wears — the Panel's own override,
   * handed to the row Panel's `borderColor`: `borderColor ?? tone` with the
   * kit's blue as floor, and the selection rim shares the hue, so an active
   * and pulsing row always agrees. Unset follows the row's tone. On bordered
   * row variants the hairline follows the override too, as it does on any
   * Panel given a `borderColor`.
   */
  attentionTone?: TrueColor;
  /**
   * Replaces the row's entire content. Set and the dot, actor, title,
   * description, code and timestamp all stop being drawn — the node you
   * give is rendered inside the row instead, for complex UI the fixed
   * layout can't express. The row itself stays the kit's: the same Panel,
   * so the same `xs` inset, dividers and — with `onClick` — hover, focus
   * and click behaviour. `undefined` or `null` draws the default row.
   */
  body?: ReactNode;
}

/** A feed filter; the value `"all"` always matches. */
export interface ActivityFeedFilter {
  label: string;
  value: string;
}

/**
 * The three loading styles a feed can show, matching Table and Panel.
 * `"spinner"` and `"progress"` draw a Loader overlay pinned to the feed
 * body; `"skeleton"` replaces the body with pulsing placeholders.
 */
export type ActivityFeedLoaderType = "spinner" | "progress" | "skeleton";

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
   * flight — same row rhythm, nothing jumps when they land. The style is
   * `loaderType`'s call.
   * @default false
   */
  loading?: boolean;
  /**
   * Style of the loading indicator, matching Table and Panel:
   * - `"spinner"` / `"progress"` — a Loader overlay pinned to the feed
   *   body: the rows (or the empty state) stay beneath it while the
   *   header, tag and filters hold their places, so nothing jumps when
   *   the events land.
   * - `"skeleton"` — the body is replaced by pulsing placeholders shaped
   *   like the feed's own rows.
   * @default "skeleton"
   */
  loaderType?: ActivityFeedLoaderType;
  /** The bar fill for `loaderType="progress"`, 0–100. */
  loaderProgress?: number;
  /** The label the spinner/progress overlay publishes. */
  loadingMessage?: string;
  /**
   * Placeholder rows drawn by `loaderType="skeleton"`. Unset follows the
   * pending page — `min(max(items.length, 3), 6)`.
   */
  skeletonRows?: number;
  /** @default "Load more" */
  loadMoreLabel?: string;
  /** Shown in the header when the caller knows the true total. */
  totalCount?: number;
  /**
   * The word that follows the header count. Unset, the count reads
   * `<n> events` — or `<n> of <totalCount> events` while a filter is
   * applied — with the noun singular at one. A string substitutes the noun
   * verbatim, so `countLabel="deprecation"` reads `1 deprecation` and
   * `countLabel="deployments"` reads `9 deployments`; the kit never
   * pluralises your noun, and the `<n> of <total>` form stays available.
   * Pass `""` for the number alone, or `false` to drop the count from the
   * header entirely — the title, tag and link then stand alone.
   */
  countLabel?: string | false;
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
  /**
   * The surface every template row's Panel wears. @default "none"
   */
  rowVariant?: SurfaceVariant;
  /**
   * The tone every template row's Panel wears. Unset follows the feed's
   * own `tone`, so rows wear the card's hue (and its toned hover wash).
   */
  rowTone?: SurfaceTone;
  /**
   * The corner every template row's Panel wears.
   * @default "rounded" — the corner scale's xs step
   */
  rowCorner?: SurfaceCorner;
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
  loaderType = "skeleton",
  loaderProgress,
  loadingMessage,
  skeletonRows,
  loadMoreLabel = "Load more",
  totalCount,
  countLabel,
  maxHeight,
  variant = "outlined",
  tone: surfaceTone = "none",
  padding = "md",
  corner,
  rowVariant = "none",
  rowTone,
  rowCorner = "rounded",
  className = "",
  ...rest
}: ActivityFeedProps) => {
  const t = useKitT();
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

  // The header count: the caller's true total when it knows one, else what
  // the feed is actually drawing.
  const count = totalCount ?? visible.length;

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

  // The row's content, dropped into the template row's Panel. An item
  // `body` replaces the whole content; the Panel stays, so custom rows keep
  // the feed's row grammar — and its hover, focus and click behaviour.
  const rowBody = (item: ActivityFeedItem) =>
    item.body != null ? (
      item.body
    ) : (
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
  // Only the skeleton mode replaces content; spinner/progress keep the real
  // rows and controls in place beneath the Loader overlay, so the card's
  // shape holds from the first frame to the last.
  const showSkeleton = loading && loaderType === "skeleton";
  // Placeholder count: the caller's say-so, or a read on the pending page.
  const skeletonRowCount = Math.max(
    1,
    skeletonRows ?? Math.min(Math.max(items.length, 3), 6),
  );
  const body = showSkeleton ? (
    // A placeholder shaped like the feed itself: dot, title bar on the
    // Table's width ladder, a description line on alternate rows, a code
    // chip on every third, and the time bar pinned right — skim it and
    // you'd read a real feed half-written.
    <div
      className="flex flex-col divide-y divide-neutral-100 animate-pulse motion-reduce:animate-none dark:divide-neutral-800"
      aria-hidden="true"
    >
      {Array.from({ length: skeletonRowCount }).map((_, index) => (
        <div key={index} className="flex items-start gap-3 px-2 py-3 first:pt-1 last:pb-0">
          <SkeletonBar className="mt-1.5 size-2 shrink-0 rounded-full" height="h-2" />
          <div className="min-w-0 flex-1">
            <SkeletonBar width={`${[100, 83, 80, 75][index % 4]}%`} />
            {index % 2 === 0 && (
              <SkeletonBar
                className="mt-1.5"
                height="h-2"
                width={`${[66, 74, 58, 70][index % 4]}%`}
              />
            )}
            {index % 3 === 2 && (
              <SkeletonBar className="mt-2 w-12" />
            )}
          </div>
          <SkeletonBar className="mt-0.5 h-3 w-10 shrink-0" />
        </div>
      ))}
    </div>
  ) : visible.length === 0 ? (
    <EmptyState
      icon="Log"
      title="Nothing here"
      subtitle="No events match this filter yet."
    />
  ) : (
    <ol
      className={classNames(
        // On the shared `none` surface the list's own dividers draw the
        // lines between rows. Give the rows a surface of their own and
        // those lines get in the way — they'd cut straight through each
        // row's Panel — so they make way for a little vertical air
        // instead, matching the `xs` inset the rows carry.
        rowVariant === "none"
          ? "divide-y divide-neutral-100 dark:divide-neutral-800"
          : "space-y-2",
      )}
    >
      {visible.map((item) => (
        // The template row is a Panel, not hand-rolled chrome: `rowVariant`
        // (default `none`), `rowTone` (default: the component's own tone)
        // and `rowCorner` (default `rounded`, the corner scale's xs step)
        // on `xs` padding. Hover, focus and activation come from the Panel
        // API rather than copied row classes — an `onClick` alone makes the
        // row a guarded button (role, tabIndex, Enter/Space, the focus ring
        // and the toned hover wash), and a click that belongs to a nested
        // control — the link, a custom body's buttons — stays that
        // control's, which the old hand-rolled role="button" li got wrong:
        // it fired the row alongside.
        <li key={item.id}>
          <Panel
            variant={rowVariant}
            tone={rowTone ?? surfaceTone}
            corner={rowCorner}
            padding="xs"
            onClick={item.onClick}
            active={item.active}
            pulse={item.attention}
            borderColor={item.attentionTone}
          >
            <div className="flex items-start gap-3">{rowBody(item)}</div>
          </Panel>
        </li>
      ))}
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
          {countLabel !== false && (
            <span
              className={classNames(
                "text-xs text-neutral-500 dark:text-neutral-400",
                loading && "invisible",
              )}
              aria-hidden={loading || undefined}
            >
              {count}
              {totalCount !== undefined && filters.length > 0 && active !== "all"
                ? ` of ${totalCount}`
                : ""}
              {typeof countLabel === "string"
                ? countLabel && ` ${countLabel}`
                : ` ${count === 1 ? "event" : "events"}`}
            </span>
          )}
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

        {/* Spinner/progress modes pin the Loader to this wrapper, not the
            ScrollArea below — inside a scroll container an `absolute
            inset-0` overlay scrolls away with the content (Table's rule).
            `skeleton` never reaches the overlay branch. */}
        <div className="relative" aria-busy={loading || undefined}>
          {loading && loaderType !== "skeleton" && (
            <Loader
              overlay
              variant={loaderType === "progress" ? "progress" : "spinner"}
              size="lg"
              label={loadingMessage ?? t("kit.spinner.loading")}
              progress={loaderProgress}
              color={controlColor}
              className="rounded-none"
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
        </div>

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
