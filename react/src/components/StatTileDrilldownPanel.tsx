import React from "react";
import classNames from "classnames";
import InfiniteScrollPanel from "./InfiniteScrollPanel";
import { Pill } from "./Pill";
import { CustomIcon } from "./CustomIcon";
import Button from "./Button";
import { SkeletonBar } from "./Panel";
import { usePagedFetcher, type PagedFetcher } from "../hooks/usePagedFetcher";
import {
  getSurfaceAccentColor,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceTone,
  type SurfaceVariant,
} from "../theme/Theme";
import { getPillColorClasses, type TrueColor } from "../theme";
import type { IconName } from "../icons/registry";

/**
 * A drilldown row: what the built-in renderer knows how to draw. Apps extend
 * it with their own fields and take over drawing with `renderItem`.
 */
export interface StatCardDrilldownItem {
  id: string | number;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: IconName;
  /** Tints this row's icon chip and count pill; falls back to the card's tone. */
  tone?: TrueColor;
  /** Right-aligned count pill. Omit for none. */
  count?: number;
}

/** One page, as the app's endpoint reports it. */
export interface StatCardDrilldownPage<T> {
  items: T[];
  hasMore: boolean;
  /** Shown as the header's count chip when given. */
  total?: number;
}

/**
 * The whole drilldown, as the `drilldown` prop on `StatCard`. Pagination is
 * the kit's job: `fetchItems` is the app's endpoint, page state, lazy first
 * load, skeleton, load-more and retry all live here.
 */
export interface StatCardDrilldown<T = StatCardDrilldownItem> {
  /** The app's page endpoint. 0-based `page`; honour `signal`. */
  fetchItems: PagedFetcher<T>;
  /** @default 20 */
  pageSize?: number;
  /** Header title. @default the card's `label`. */
  title?: React.ReactNode;
  /** Fixed footer below the list — e.g. a "View all alerts" link. */
  footer?: React.ReactNode;
  /** Row activation. Rows render as real buttons when given. */
  onItemClick?: (item: T, index: number) => void;
  /** Replaces the built-in row. The pagination chrome stays the kit's. */
  renderItem?: (item: T, index: number) => React.ReactNode;
  /** @default 320 */
  minWidth?: number;
  /** @default 520, still clamped to the viewport by the overlay. */
  maxWidth?: number;
  /** Scroll-area height. @default 420, clamped to the viewport. */
  maxHeight?: number;
  /** Preferred side for the overlay. @default "auto" */
  placement?: "auto" | "top" | "bottom" | "left" | "right";
  /** Follow the arrow indicator. @default true */
  arrow?: boolean;
  /**
   * Open the panel at the tile's full width instead of sizing it to its
   * content. `minWidth` still floors it (and defaults to none here); the
   * `maxWidth` cap still clamps. @default false
   */
  matchTileWidth?: boolean;
  /**
   * Open the menu at exactly this width (px) — for menus meant to fill an
   * area far wider than the tile. If the viewport runs short on the side
   * `align` keeps free, the menu narrows to the room that is left instead
   * of sliding away.
   */
  width?: number;
  /**
   * Which edge of the tile a wider-than-tile menu keeps aligned: `start`
   * the left edges, `center` centres the menu on the tile, `end` the right
   * edges. The menu adapts its width to the kept side; it never moves off
   * the edge it was told to stay on. @default "start"
   */
  align?: "start" | "center" | "end";
  /**
   * Floor for the list area's height (px), so one page — or none — still
   * opens a menu with presence. The `maxHeight` cap wins over it.
   * @default 0
   */
  minHeight?: number;
  /** The overlay's surface treatment. @default "elevated" */
  variant?: SurfaceVariant;
  /** The overlay's corner radius. @default "rounded-sm" */
  corner?: SurfaceCorner;
  /** Inset around the panel inside the overlay. @default "none" */
  padding?: SurfacePadding;
  /** Change to abort, clear and refetch from page 0 while open. */
  reloadKey?: string | number;
  emptyMessage?: React.ReactNode;
  endMessage?: React.ReactNode;
  /** Fires on every open/close intent (trigger click, outside click, Escape). */
  onOpenChange?: (open: boolean) => void;
}

export interface StatTileDrilldownPanelProps<T> extends StatCardDrilldown<T> {
  /** The Popover's open state — gates the lazy first page. */
  open: boolean;
  /** The card's surface tone, echoed onto the panel's accents. */
  tone?: SurfaceTone;
  className?: string;
}

/** Per-page stagger, capped so a long list does not cascade for seconds. */
const STAGGER_MS = 24;
const STAGGER_STEPS = 12;

const rowDelay = (index: number): React.CSSProperties => ({
  animationDelay: `${(index % STAGGER_STEPS) * STAGGER_MS}ms`,
});

const SkeletonRows: React.FC<{ rows: number }> = ({ rows }) => (
  <div className="flex flex-col p-2" aria-hidden="true">
    {Array.from({ length: rows }).map((_, index) => (
      <div
        key={index}
        className="flex items-center gap-3 rounded-md px-3 py-2.5"
      >
        <div className="h-8 w-8 flex-none rounded-lg bg-black/10 motion-reduce:animate-none dark:bg-white/10 animate-pulse" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <SkeletonBar width="60%" height="h-3" />
          <SkeletonBar width="35%" height="h-2.5" />
        </div>
        <SkeletonBar width="1.75rem" height="h-4" className="rounded-full" />
      </div>
    ))}
  </div>
);

/**
 * The list a drilldown tile opens: fixed header (title + total), an
 * `InfiniteScrollPanel` fed by the app's fetcher, optional fixed footer.
 * Rendered inside `Popover` by `StatCard`; solid `elevated` surface and the
 * enter/leave overlay motion are the overlay's.
 */
export function StatTileDrilldownPanel<T extends StatCardDrilldownItem = StatCardDrilldownItem>({
  open,
  tone,
  className,
  title,
  footer,
  onItemClick,
  renderItem,
  // Popover chrome — StatCard forwards these to the overlay; destructured
  // here only so they do not leak into the fetcher's options.
  matchTileWidth,
  width,
  align,
  variant,
  corner,
  padding,
  minWidth = matchTileWidth ? 0 : 320,
  maxWidth = 520,
  maxHeight = 420,
  minHeight = 0,
  emptyMessage = "Nothing to show",
  endMessage = "You're all caught up",
  ...fetcher
}: StatTileDrilldownPanelProps<T>) {
  const { items, total, hasMore, isLoading, error, loadMore, reload } =
    usePagedFetcher<T>({ ...fetcher, enabled: open });

  const accent = getSurfaceAccentColor(tone ?? "none") ?? "blue";

  const defaultRenderItem = (item: T, index: number): React.ReactNode => {
    const chip = getPillColorClasses(item.tone ?? accent, "soft");
    const content = (
      <>
        {item.icon && (
          <span
            className={classNames(
              "inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg",
              chip.base,
              chip.border,
            )}
          >
            <CustomIcon icon={item.icon} size="sm" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-neutral-900 dark:text-white">
            {item.title}
          </span>
          {item.subtitle && (
            <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
              {item.subtitle}
            </span>
          )}
        </span>
        {typeof item.count === "number" && (
          <Pill tone={item.tone ?? accent} size="xs" variant="soft">
            {item.count}
          </Pill>
        )}
      </>
    );
    const rowClass =
      "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500";
    return (
      <div className="stat-drilldown-row" style={rowDelay(index)}>
        {onItemClick ? (
          <button
            type="button"
            className={classNames(
              rowClass,
              "hover:bg-black/5 dark:hover:bg-white/10",
            )}
            onClick={() => onItemClick(item, index)}
          >
            {content}
          </button>
        ) : (
          <div className={rowClass}>{content}</div>
        )}
      </div>
    );
  };

  const body = (() => {
    if (isLoading) {
      return <SkeletonRows rows={4} />;
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
          <CustomIcon
            icon="Warning"
            size="lg"
            className="text-amber-500 dark:text-amber-400"
          />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Couldn&apos;t load the items.
          </p>
          <Button
            size="sm"
            variant="outline"
            color={accent}
            leadingIcon="Refresh"
            onClick={reload}
          >
            Try again
          </Button>
        </div>
      );
    }
    return (
      <InfiniteScrollPanel<T>
        items={items}
        hasMore={hasMore}
        onLoadMore={loadMore}
        renderItem={renderItem ?? defaultRenderItem}
        getItemKey={(item, index) => item.id ?? index}
        layout="list"
        gap="xs"
        variant="plain"
        tone={tone}
        height={
          typeof window === "undefined"
            ? maxHeight
            : Math.min(maxHeight, Math.round(window.innerHeight * 0.55) - 96)
        }
        minHeight={minHeight}
        emptyMessage={emptyMessage}
        endMessage={endMessage}
      />
    );
  })();

  return (
    <div
      className={classNames("stat-drilldown-panel flex min-w-0 flex-col", className)}
      // An explicit width is the overlay's business — the panel just fills
      // it, floor and cap out of the way.
      style={width != null ? { minWidth: 0, maxWidth: "none" } : { minWidth, maxWidth }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3 dark:border-white/10">
        <span className="min-w-0 truncate text-sm font-semibold text-neutral-900 dark:text-white">
          {title}
        </span>
        {typeof total === "number" && (
          <Pill tone={accent} size="xs" variant="soft">
            {total}
          </Pill>
        )}
      </div>
      {/* A fixed-height list: the header and footer stay, the rows scroll. */}
      {body}
      {footer && (
        <div className="border-t border-black/10 px-4 py-3 dark:border-white/10">
          {footer}
        </div>
      )}
    </div>
  );
}

StatTileDrilldownPanel.displayName = "StatTileDrilldownPanel";

export default StatTileDrilldownPanel;
