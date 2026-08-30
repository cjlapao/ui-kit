import React from "react";
import classNames from "classnames";
import Panel, { PanelProps } from "./Panel";
import IconButton from "./IconButton";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import { useSurfaceText } from "../contexts/SurfaceContext";
import { useKitT } from "../i18n";
import { usePager } from "../hooks/usePager";
import type { ControlSize, TrueColor } from "../theme/Theme";

// ── Types ────────────────────────────────────────────────────────────────────

/**
 * The kit's three loader treatments, with `skeleton` the default — a
 * placeholder shaped like the panel's own content keeps the block at its real
 * height, where a spinner collapses it and the page jumps when the data lands.
 */
export const PAGED_PANEL_LOADERS = ["skeleton", "spinner", "progress"] as const;
export type PagedPanelLoader = (typeof PAGED_PANEL_LOADERS)[number];

export interface PagedPanelProps
  // `loading`, `loaderType` and `progress` are owned here: Panel's loader
  // knows nothing about the header/page split, and in `bare` mode there is no
  // Panel at all for it to live on.
  extends Omit<
    PanelProps,
    "title" | "loading" | "loaderType" | "progress" | "loadingState"
  > {
  /** One entry per page — rendered one at a time. */
  pages: React.ReactNode[];
  /**
   * Static title shown in the header, OR an array of per-page titles.
   * When an array is supplied its length should match `pages`.
   */
  title?: React.ReactNode | React.ReactNode[];
  /** Optional subtitle shown below the title (static). */
  subtitle?: React.ReactNode;
  /** Replaces the page with a loading treatment. */
  loading?: boolean;
  /** How `loading` is drawn. @default "skeleton" */
  loaderType?: PagedPanelLoader;
  /** Determinate value for `loaderType="progress"`, 0–100. */
  progress?: number;
  /** Copy shown beside the spinner or progress bar. */
  loadingLabel?: React.ReactNode;
  /** Custom loading content, replacing all of the above. */
  loadingState?: React.ReactNode;
  /** Replaces the page with an error message. */
  error?: string | null;
  /** Rendered when there are no pages. Defaults to a plain `EmptyState`. */
  emptyState?: React.ReactNode;
  /** Copy for the default empty state. @default "No data available." */
  emptyMessage?: string;
  /** Accent for the nav buttons. @default "blue" */
  tone?: TrueColor;
  /** Scale of the nav buttons and header type. @default "md" */
  size?: ControlSize;
  /**
   * Controlled page index. Omit for uncontrolled paging.
   */
  page?: number;
  /** Fires whenever the visible page changes. */
  onPageChange?: (page: number) => void;
  /**
   * Render without the Panel wrapper (no border, background or shadow). Use
   * when embedding inside a Panel the app already owns.
   */
  bare?: boolean;
}

const SKELETON =
  "animate-pulse bg-black/10 motion-reduce:animate-none dark:bg-white/10";

const SIZE_TOKENS: Record<
  ControlSize,
  { title: string; subtitle: string; counter: string; pad: string; icon: ControlSize }
> = {
  xs: { title: "text-xs", subtitle: "text-[10px]", counter: "text-[10px]", pad: "px-3 py-2", icon: "xs" },
  sm: { title: "text-xs", subtitle: "text-[11px]", counter: "text-[11px]", pad: "px-3 py-2", icon: "xs" },
  md: { title: "text-sm", subtitle: "text-xs", counter: "text-[11px]", pad: "px-4 py-3", icon: "sm" },
  lg: { title: "text-base", subtitle: "text-sm", counter: "text-xs", pad: "px-5 py-3.5", icon: "md" },
  xl: { title: "text-lg", subtitle: "text-base", counter: "text-sm", pad: "px-6 py-4", icon: "md" },
};

// ── Body ─────────────────────────────────────────────────────────────────────

/**
 * Split out so it can read `useSurfaceText()` — a component cannot consume a
 * provider it renders itself, and the non-`bare` path renders the `Panel` that
 * publishes it.
 */
const PagedPanelBody: React.FC<{
  pages: React.ReactNode[];
  resolvedTitle: React.ReactNode;
  subtitle: React.ReactNode;
  error?: string | null;
  emptyState?: React.ReactNode;
  emptyMessage: string;
  tone: TrueColor;
  size: ControlSize;
  current: number;
  total: number;
  loading?: boolean;
  loaderType: PagedPanelLoader;
  progress?: number;
  loadingLabel?: React.ReactNode;
  loadingState?: React.ReactNode;
  onPrev: () => void;
  onNext: () => void;
}> = ({
  pages,
  resolvedTitle,
  subtitle,
  error,
  emptyState,
  emptyMessage,
  tone,
  size,
  current,
  total,
  loading,
  loaderType,
  progress,
  loadingLabel,
  loadingState,
  onPrev,
  onNext,
}) => {
  const text = useSurfaceText();
  const tokens = SIZE_TOKENS[size] ?? SIZE_TOKENS.md;
  const showNav = total > 1;
  const showHeader = resolvedTitle != null || subtitle != null || showNav;

  return (
    <>
      {showHeader && (
        <div
          className={classNames(
            "flex items-center gap-2 border-b",
            tokens.pad,
            text.divider,
          )}
        >
          {/* Left nav slot — fixed width so the title stays centred */}
          <div className="shrink-0">
            {showNav && (
              <IconButton
                icon="ArrowChevronLeft"
                variant="ghost"
                color={tone}
                size={tokens.icon}
                srLabel="Previous page"
                tooltip="Previous page"
                disabled={current === 0}
                onClick={onPrev}
              />
            )}
          </div>

          {/* Centre: title + subtitle + page indicator */}
          <div className="flex-1 text-center min-w-0">
            {resolvedTitle != null && (
              <div
                className={classNames(
                  "font-semibold leading-snug truncate",
                  tokens.title,
                  text.heading,
                )}
              >
                {resolvedTitle}
              </div>
            )}
            {subtitle != null && (
              <div
                className={classNames(
                  "mt-0.5 truncate",
                  tokens.subtitle,
                  text.muted,
                )}
              >
                {subtitle}
              </div>
            )}
            {showNav && (
              // Polite, so paging announces the new position instead of
              // leaving a screen reader with no idea the content changed.
              <div
                role="status"
                aria-live="polite"
                className={classNames(
                  "mt-0.5 tabular-nums",
                  tokens.counter,
                  text.muted,
                )}
              >
                {current + 1} / {total}
              </div>
            )}
          </div>

          {/* Right nav slot */}
          <div className="shrink-0">
            {showNav && (
              <IconButton
                icon="ArrowChevronRight"
                variant="ghost"
                color={tone}
                size={tokens.icon}
                srLabel="Next page"
                tooltip="Next page"
                disabled={current === total - 1}
                onClick={onNext}
              />
            )}
          </div>
        </div>
      )}

      <div className="h-full w-full p-4 flex items-center justify-center">
        {loading ? (
          (loadingState ?? (
            loaderType === "skeleton" ? (
              // Shaped like a page: a couple of copy lines at the width real
              // content tends to occupy, so the panel keeps its height and
              // nothing jumps when the page arrives.
              <div className="flex w-full flex-col gap-3" aria-hidden="true">
                <div className={classNames(SKELETON, "h-3 w-3/4 rounded")} />
                <div className={classNames(SKELETON, "h-3 w-full rounded")} />
                <div className={classNames(SKELETON, "h-3 w-5/6 rounded")} />
              </div>
            ) : (
              <Loader
                variant={loaderType}
                size={size === "xs" || size === "sm" ? "sm" : "md"}
                color={tone}
                progress={progress}
                label={loadingLabel}
              />
            )
          ))
        ) : error ? (
          <EmptyState
            variant="plain"
            icon="Error"
            iconColor="rose"
            title="Something went wrong"
            subtitle={error}
            showIcon
          />
        ) : total === 0 && !loading ? (
          (emptyState ?? (
            <EmptyState
              variant="plain"
              icon="Info"
              title={emptyMessage}
              showIcon
              tone={tone}
            />
          ))
        ) : (
          pages[current]
        )}
      </div>
    </>
  );
};

// ── Component ────────────────────────────────────────────────────────────────

const PagedPanel: React.FC<PagedPanelProps> = ({
  pages,
  title,
  subtitle,
  error,
  emptyState,
  emptyMessage,
  tone = "blue",
  size = "md",
  page,
  onPageChange,
  bare = false,
  loading = false,
  loaderType = "skeleton",
  progress,
  loadingLabel,
  loadingState,
  ...rest
}) => {
  const t = useKitT();
  // The index, the clamp when `pages` shrinks under a reload, and the
  // effect-based resync (a render-phase `setState` makes React re-run the
  // component and warn) all live in `usePager` now — shared with `StatCard`,
  // which grew paging of its own.
  const pager = usePager({ count: pages.length, page, onPageChange });
  const { page: current, total } = pager;

  const resolvedTitle = Array.isArray(title) ? title[current] : title;

  const body = (
    <PagedPanelBody
      pages={pages}
      resolvedTitle={resolvedTitle}
      subtitle={subtitle}
      error={error}
      emptyState={emptyState}
      emptyMessage={emptyMessage ?? t("kit.pagedpanel.empty")}
      tone={tone}
      size={size}
      current={current}
      total={total}
      loading={loading}
      loaderType={loaderType}
      progress={progress}
      loadingLabel={loadingLabel}
      loadingState={loadingState}
      onPrev={pager.prev}
      onNext={pager.next}
    />
  );

  if (bare) {
    return (
      <div className={classNames("relative overflow-hidden", rest.className)}>
        {body}
      </div>
    );
  }

  return (
    <Panel
      {...rest}
      tone={tone}
      padding="none"
      bodyClassName={total === 0 && !loading ? "h-full" : ""}
      className={classNames("relative overflow-hidden", rest.className)}
    >
      {body}
    </Panel>
  );
};

export default PagedPanel;
