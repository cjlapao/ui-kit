import { useMemo, useState } from "react";
import classNames from "classnames";
import Button, { type ButtonVariant } from "./Button";
import EmptyState from "./EmptyState";
import MultiToggle from "./MultiToggle";
import Panel, { SkeletonBar } from "./Panel";
import Pill from "./Pill";
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
  /** Tail button; rendered only when both are provided. */
  onLoadMore?: () => void;
  hasMore?: boolean;
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
  /** Surface, as every card in the kit takes it. @default "outlined" */
  variant?: SurfaceVariant;
  /** @default "neutral" */
  tone?: TrueColor;
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
  onLoadMore,
  hasMore = false,
  loading = false,
  loadMoreLabel = "Load more",
  totalCount,
  variant = "outlined",
  tone = "neutral",
  padding = "md",
  corner,
  className = "",
  ...rest
}: ActivityFeedProps) => {
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

  return (
    <Panel
      {...rest}
      variant={variant}
      tone={tone}
      padding={padding}
      corner={corner}
      className={classNames("w-full", className)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="text-sm font-semibold">{title}</h3>
          {tag && !loading && (
            <Pill tone={tone === "neutral" ? "blue" : tone} size="sm">
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
              color={tone === "neutral" ? undefined : tone}
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
            tone={tone === "neutral" ? undefined : tone}
          />
        )}

        {loading ? (
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
            {visible.map((item) => (
              <li key={item.id} className="flex items-start gap-3 py-3 first:pt-1 last:pb-0">
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
              </li>
            ))}
          </ol>
        )}

        {hasMore && onLoadMore && !loading && (
          <Button
            variant={loadMoreVariant ?? SURFACE_TO_BUTTON_VARIANT[variant]}
            color={tone === "neutral" ? undefined : tone}
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
