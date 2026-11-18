import { useWorkflowFooterResize } from "./useWorkflowFooterResize";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";

import Progress from "../Progress";
import TooltipWrapper from "../TooltipWrapper";
import Popover, { type PopoverProps } from "../Popover";
import ScrollArea from "../ScrollArea";
import Button from "../Button";
import Spinner from "../Spinner";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { WorkflowRailSkeleton } from "./WorkflowSkeleton";
import WorkflowStatusNode from "./WorkflowStatusNode";
import WorkflowQuickActions from "./WorkflowQuickActions";
import {
  SectionTitle,
  Tally,
  WorkflowBadge,
  WorkflowPlaceholder,
} from "./parts";
import {
  getStatusTokens,
  normalizeStatus,
  resolveStatusLabel,
  type WorkflowPalette,
} from "./statusTokens";
import type { WorkflowSurfaceTokens } from "./surfaces";
import type { WorkflowTallies } from "./derive";
import type {
  WorkflowCustomStatusMap,
  WorkflowStatus,
  WorkflowStep,
  WorkflowSubStep,
  WorkflowTrackerLabels,
} from "./types";

/** Node is `h-5` (20px) wide; the connector is 2px, so it centres at 9px. */
const CONNECTOR_LEFT = 9;
/** Node height plus a 4px breathing gap. */
const CONNECTOR_TOP = 24;
/** Node width plus the row gap — keeps nested content on the label's edge. */
const NESTED_INDENT = 32;
/** How far below the fold the sub-step sentinel is watched, in px — the
 * box is a few rows tall, so the `ActivityFeed`'s 320 lookahead would
 * pre-fetch nearly the whole list on the first paint. */
const SUB_STEP_ROOT_MARGIN = 120;

const LEGEND_ORDER: WorkflowStatus[] = [
  "done",
  "in_progress",
  "skipped",
  "blocked",
  "attention",
  "failed",
  "not_started",
];

interface NestedSubStepsProps {
  stepId: string;
  subSteps: WorkflowSubStep[];
  /** Rows shown before the rest fold away; unset or past the count shows all. */
  maxVisible?: number;
  /** How the rows past `maxVisible` are revealed. @default "scroll" */
  loadMode?: "scroll" | "button";
  /** Which end the first page keeps. @default "reverse" */
  order?: "reverse" | "forward";
  palette: WorkflowPalette;
  customStatuses?: WorkflowCustomStatusMap;
  surfaces: WorkflowSurfaceTokens;
  labels: WorkflowTrackerLabels;
  onSubStepSelect?: (stepId: string, subStepId: string) => void;
}

/**
 * Compact mirror of the detail panel's table — nodes and labels only, no
 * badges or durations.
 *
 * Past `maxVisible` the box takes one of two shapes, both riding the same
 * `visibleCount` slice: `"scroll"` caps the box at the measured height of
 * the first page (frozen once, so revealed pages scroll inside it instead
 * of pushing the rail open) and watches a sentinel inside the `ScrollArea`
 * with the kit's shared `useInfiniteScroll`; `"button"` grows the box in
 * place, one page per Show more click (the label counts the rows it will
 * add), and Show less folds back to the first page — a control the scroll
 * shape has no use for, where the scroll itself does the folding. With no
 * `IntersectionObserver` to watch, scroll mode degrades to the button —
 * the tail is the honest fallback when there is no scroller to drive.
 *
 * `order="reverse"` (default) is the live-run reading: the LAST rows are
 * the current ones, so the first page is the newest tail, the box opens
 * scrolled to the bottom, and both tails reveal the PAST — the sentinel
 * sits at the top, prepend-anchored so the rows under the viewport never
 * jump, and rows appended while the reader is at the bottom keep it
 * pinned there. `"forward"` keeps the chronological reading: the first
 * page is the oldest head and the tails reveal the future.
 *
 * Labels are one line with an ellipsis — the box is narrow and a live run
 * writes long paths; a wrapping row's own block would outgrow the rail
 * (the `ScrollArea` clips sideways for exactly that reason).
 */
const NestedSubSteps: React.FC<NestedSubStepsProps> = ({
  stepId,
  subSteps,
  maxVisible,
  loadMode = "scroll",
  order = "reverse",
  palette,
  customStatuses,
  surfaces,
  labels,
  onSubStepSelect,
}) => {
  const total = subSteps.length;
  const capped = maxVisible !== undefined && maxVisible > 0 && maxVisible < total;
  const [visibleCount, setVisibleCount] = useState(maxVisible ?? total);
  const shownCount = Math.min(visibleCount, total);
  const visible = subSteps.slice(
    order === "reverse" ? total - shownCount : 0,
    order === "reverse" ? total : shownCount,
  );
  const hasMore = capped && shownCount < total;

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [frozenMaxPx, setFrozenMaxPx] = useState<number | null>(null);
  const hasObserver = typeof IntersectionObserver !== "undefined";
  const scrolls = capped && loadMode === "scroll" && hasObserver;
  const reverse = order === "reverse";

  // Re-cap when the caller changes the cap live (a playground knob, a
  // setting): the slice snaps to the new first page. Growing appends never
  // touch `maxVisible`, so a live run's new rows still respect it.
  const capRef = useRef(maxVisible);
  useEffect(() => {
    if (capRef.current === maxVisible) return;
    capRef.current = maxVisible;
    setVisibleCount(
      maxVisible !== undefined && maxVisible > 0
        ? Math.min(maxVisible, total)
        : total,
    );
    setFrozenMaxPx(null);
  }, [maxVisible, total]);

  // Freeze the box at the natural height of the first page: measured once,
  // before the cap is applied, from layout (never the transformed box), and
  // only while it is non-zero — an element that is not laid out has no
  // height worth caching. Revealed pages then scroll inside that height
  // instead of growing the rail.
  useLayoutEffect(() => {
    if (!scrolls || frozenMaxPx != null) return;
    const height = listRef.current?.offsetHeight ?? 0;
    if (height > 0) setFrozenMaxPx(height);
  }, [scrolls, frozenMaxPx]);

  // Reverse mode anchors the VIEWPORT, not the scroll box: a revealed page
  // lands ABOVE the reading position, so scrollTop has to shift by exactly
  // the growth — otherwise the rows under the reader jump down by a page.
  const anchorRef = useRef<number | null>(null);
  useLayoutEffect(() => {
    const before = anchorRef.current;
    if (before == null) return;
    anchorRef.current = null;
    const vp = viewportRef.current;
    if (vp) vp.scrollTop += vp.scrollHeight - before;
  }, [shownCount]);

  // …and the box opens at the bottom — the newest tail is its whole point.
  const bottomedRef = useRef(false);
  useLayoutEffect(() => {
    if (!scrolls || !reverse || bottomedRef.current || frozenMaxPx == null) return;
    const vp = viewportRef.current;
    if (vp) {
      vp.scrollTop = vp.scrollHeight;
      bottomedRef.current = true;
    }
  }, [scrolls, reverse, frozenMaxPx]);

  // Track whether the reader sits at the tail (within a few px)…
  const atBottomRef = useRef(true);
  useEffect(() => {
    if (!scrolls || !reverse) return;
    const vp = viewportRef.current;
    if (!vp) return;
    const onScroll = () => {
      atBottomRef.current =
        vp.scrollHeight - vp.scrollTop - vp.clientHeight <= 8;
    };
    vp.addEventListener("scroll", onScroll, { passive: true });
    return () => vp.removeEventListener("scroll", onScroll);
  }, [scrolls, reverse]);

  // …so live rows appended to a newest-first run behave: the reader at the
  // bottom follows the newest row, one further up keeps their reading
  // position (the loaded window shifts by the append; nothing moves).
  // …so live rows appended to a newest-first run behave: the box keeps
  // showing the newest rows (the window slides when folded, grows when the
  // reader has revealed past the fold), and a reader at the bottom is
  // pinned to the newest row.
  const prevTotalRef = useRef(total);
  useLayoutEffect(() => {
    const delta = total - prevTotalRef.current;
    const prevTotal = prevTotalRef.current;
    prevTotalRef.current = total;
    if (delta <= 0 || !reverse) return;
    setVisibleCount((count) =>
      count >= prevTotal || maxVisible === undefined || count > maxVisible
        ? count + delta
        : count,
    );
    const vp = viewportRef.current;
    if (vp && atBottomRef.current) vp.scrollTop = vp.scrollHeight;
  }, [total, reverse, maxVisible]);

  const scroll = useInfiniteScroll({
    rootRef: viewportRef,
    sentinelRef,
    hasMore: scrolls && hasMore,
    itemCount: shownCount,
    rootMargin: SUB_STEP_ROOT_MARGIN,
    onLoadMore: async () => {
      // The "page" is a slice of data the consumer already handed us —
      // loading it is a synchronous reveal; the shared hook still owns the
      // sentinel, the lock and the under-fill pass.
      if (reverse) anchorRef.current = viewportRef.current?.scrollHeight ?? null;
      setVisibleCount((count) =>
        Math.min(count + (maxVisible ?? total), total),
      );
    },
  });

  // One list element for both shapes; the measurement ref is inert when
  // nothing reads it (uncapped, collapsed or button mode).
  const list = (
    <ul ref={listRef} className="space-y-2.5">
      {visible.map((subStep) => {
        const status = normalizeStatus(subStep.status, customStatuses);
        const isActive = status === "running" || status === "in_progress";
        const content = (
          <>
            <WorkflowStatusNode status={status} palette={palette} customStatuses={customStatuses} size="sm" />
            <span
              className={classNames(
                "min-w-0 flex-1 truncate text-sm",
                isActive
                  ? "font-semibold text-neutral-900 dark:text-white"
                  : "text-neutral-600 dark:text-neutral-300",
              )}
            >
              {subStep.label}
            </span>
          </>
        );

        return (
          <li key={subStep.id}>
            {onSubStepSelect ? (
              <button
                type="button"
                onClick={() => onSubStepSelect(stepId, subStep.id)}
                className="flex w-full min-w-0 items-center gap-2.5 rounded-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-neutral-500"
              >
                {content}
              </button>
            ) : (
              <div className="flex w-full min-w-0 items-center gap-2.5">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );

  // The infinite-scroll tail — sentinel and its status row — sits at the
  // end being revealed: the top for the past (reverse), the bottom for
  // the future (forward).
  const scrollTail = (
    <>
      <div ref={sentinelRef} aria-hidden="true" />
      {scroll.error ? (
        <div
          data-slot="workflow-substeps-scroll-error"
          className={classNames(
            "flex items-center justify-center gap-2 text-xs text-rose-600 dark:text-rose-400",
            reverse ? "mb-2" : "mt-2",
          )}
        >
          {labels.loadMoreError}
          <Button size="xs" variant="link" onClick={() => void scroll.loadMore()}>
            Try again
          </Button>
        </div>
      ) : scroll.isLoadingMore ? (
        <div
          data-slot="workflow-substeps-scroll-loading"
          className={classNames("flex justify-center py-1", reverse ? "mb-1" : "mt-1")}
          role="status"
          aria-label={labels.loadingMore}
        >
          <Spinner size="xs" color={palette.accent} />
        </div>
      ) : null}
    </>
  );

  // The explicit tail reveals one page per click and counts what it will
  // add — "Show 10 more" on a hundred-item run with a cap of ten.
  const remaining = total - shownCount;
  const buttonTail = hasMore ? (
    <div className="mt-2 flex justify-center">
      <Button
        size="xs"
        variant="link"
        color={palette.accent}
        onClick={() =>
          setVisibleCount((count) =>
            Math.min(count + (maxVisible ?? total), total),
          )
        }
      >
        {labels.showMore.replace(
          "{count}",
          String(Math.min(maxVisible ?? remaining, remaining)),
        )}
      </Button>
    </div>
  ) : capped ? (
    <div className="mt-2 flex justify-center">
      <Button
        size="xs"
        variant="link"
        color={palette.accent}
        onClick={() => setVisibleCount(maxVisible ?? total)}
      >
        {labels.showLess}
      </Button>
    </div>
  ) : null;

  return (
    <div
      className={classNames("mt-3 overflow-hidden rounded-lg p-3", surfaces.nestedBox)}
      style={{ marginLeft: NESTED_INDENT }}
    >
      {scrolls ? (
        <ScrollArea
          variant="hover"
          horizontal={false}
          viewportRef={viewportRef}
          style={
            frozenMaxPx != null ? { maxHeight: frozenMaxPx } : undefined
          }
          viewportClassName="overscroll-contain"
          contentClassName="table-fixed w-full"
        >
          {/* No Show less in here: the scroll itself is the reading model —
              revealed history folds away by scrolling, not by a button. */}
          <div>
            {reverse && scrollTail}
            {list}
            {!reverse && scrollTail}
          </div>
        </ScrollArea>
      ) : (
        <>
          {list}
          {hasMore || capped ? buttonTail : null}
        </>
      )}
    </div>
  );
};

export interface WorkflowTimelineProps {
  disableFutureSteps?: boolean;
  controls?: React.ReactNode;
  controlsHeader?: React.ReactNode;
  footerResizable?: boolean;
  defaultFooterHeight?: number;
  footerHeight?: number;
  onFooterHeightChange?: (height: number) => void;
  footerLabel?: string;
  footerResizeLabel?: string;
  hasCollapseToggle?: boolean;
  renderStepPopover?: (step: WorkflowStep) => React.ReactNode;
  stepPopoverProps?: Omit<PopoverProps, "trigger" | "children">;
  collapsed?: boolean;
  side?: "left" | "right";
  fillHeight?: boolean;
  steps: WorkflowStep[];
  activeStepId?: string;
  /** Active step's nested box: rows before the rest fold away. */
  maxVisibleSubSteps?: number;
  /** How the rows past `maxVisibleSubSteps` are revealed. @default "scroll" */
  subStepLoadMode?: "scroll" | "button";
  /** Which end of the list the first page keeps. @default "reverse" */
  subStepOrder?: "reverse" | "forward";
  palette: WorkflowPalette;
  customStatuses?: WorkflowCustomStatusMap;
  surfaces: WorkflowSurfaceTokens;
  labels: WorkflowTrackerLabels;
  progress: number;
  tallies: WorkflowTallies;
  showLegend: boolean;
  loading: boolean;
  loadingRows: number;
  emptyState?: React.ReactNode;
  onStepSelect?: (stepId: string) => void;
  onSubStepSelect?: (stepId: string, subStepId: string) => void;
  onStepAction?: (stepId: string, actionId: string) => void;
}

/** Progress header, the vertical timeline, and the legend footer. */
export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({
  disableFutureSteps = false,
  controls,
  controlsHeader,
  footerResizable = false,
  defaultFooterHeight = 30,
  footerHeight,
  onFooterHeightChange,
  footerLabel = "Workflow footer",
  footerResizeLabel = "Resize workflow footer",
  hasCollapseToggle = false,
  renderStepPopover,
  stepPopoverProps,
  collapsed = false,
  side = "left",
  fillHeight = false,
  steps,
  activeStepId,
  maxVisibleSubSteps,
  subStepLoadMode = "scroll",
  subStepOrder = "reverse",
  palette,
  customStatuses,
  surfaces,
  labels,
  progress,
  tallies,
  showLegend,
  loading,
  loadingRows,
  emptyState,
  onStepSelect,
  onSubStepSelect,
  onStepAction,
}) => {
  const isEmpty = steps.length === 0;
  const hasFooterHeader = controlsHeader != null && controlsHeader !== false;
  const hasFooter = (controls != null && controls !== false) || hasFooterHeader;
  const resizableFooter = footerResizable && fillHeight && hasFooter;
  const footer = useWorkflowFooterResize({
    height: footerHeight, defaultHeight: defaultFooterHeight,
    onChange: onFooterHeightChange, enabled: resizableFooter,
  });

  const tallyEntries = [
    { count: tallies.done, label: labels.done },
    { count: tallies.skipped, label: labels.skipped },
    { count: tallies.flagged, label: labels.flagged },
    { count: tallies.remaining, label: labels.remaining },
  ].filter((entry) => entry.count > 0);

  return (
    <div
      className={classNames("flex flex-col", fillHeight && "min-h-0 flex-1")}
    >
      {/* Progress header — pointless with nothing to measure. */}
      {!loading && !isEmpty && collapsed && (
        <div
          className={classNames(
            "mx-2 flex shrink-0 justify-center border-b pb-3 pt-1",
            surfaces.border,
          )}
        >
          <span
            role="progressbar"
            aria-label={labels.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-valuetext={`${progress}%`}
            className={`rounded px-1 py-0.5 text-[10px] font-semibold tabular-nums bg-${palette.accent}-100 text-${palette.accent}-700 dark:bg-${palette.accent}-900 dark:text-${palette.accent}-200`}
          >
            {progress}%
          </span>
        </div>
      )}
      {!loading && !isEmpty && !collapsed && (
        <div
          className={classNames(
            "shrink-0 border-b px-5 pb-4 pt-5",
            hasCollapseToggle && "pr-14",
            surfaces.border,
          )}
        >
          <div className="flex items-baseline justify-between gap-3">
            <SectionTitle surfaces={surfaces}>{labels.progress}</SectionTitle>
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              {progress}%
            </span>
          </div>
          {/* Progress' own track token uses an unsafelisted opacity class, so the
            track colour is set here. */}
          <Progress
            className={classNames(
              "mt-2",
              surfaces.translucent
                ? "bg-white/40 dark:bg-white/15"
                : "bg-neutral-200 dark:bg-neutral-700",
            )}
            value={progress}
            size="xs"
            color={palette.accent}
            motion="none"
          />
          {tallyEntries.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              {tallyEntries.map((entry, index) => (
                <React.Fragment key={entry.label}>
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="text-neutral-300 dark:text-neutral-600"
                    >
                      ·
                    </span>
                  )}
                  <Tally
                    count={entry.count}
                    label={entry.label}
                    surfaces={surfaces}
                  />
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}

      {/* The two panes share a bounded body; neither scrolls the other. */}
      <div ref={footer.bodyRef} className={classNames("flex min-h-0 flex-col", fillHeight && "flex-1", footer.dragging && "select-none")}>
      {/* Timeline */}
      {/* Timeline — a vertical list: sideways scrolling is never useful here,
          and leaving the axis open lets the reserved scrollbar lane show a
          bar that scrolls nothing (or a few px of gutter). */}
      <ScrollArea
        variant="hover"
        horizontal={false}
        className={fillHeight ? "min-h-0 flex-1" : undefined}
        style={fillHeight ? { flex: `${hasFooter ? 100 - footer.percentage : 100} 1 0%` } : undefined}
        viewportClassName="overscroll-contain"
        contentClassName={classNames(
          // The rail is a vertical list: the content table must size to the
          // viewport, never to the widest row. Without this, one long
          // unbreakable label sets the table's min-content width wider than
          // the card (the row's truncation cannot help — a table sizes from
          // descendants' min-content), and the scroller — or the card's own
          // edge, clipped — eats the rows.
          "table-fixed w-full",
          !loading && !isEmpty && (collapsed ? "px-2 py-4" : "px-5 py-5"),
        )}
      >
        {loading ? (
          <WorkflowRailSkeleton rows={loadingRows} collapsed={collapsed} />
        ) : isEmpty ? (
          collapsed ? (
            <span className="sr-only">{labels.empty}</span>
          ) : (
            (emptyState ?? (
              <WorkflowPlaceholder
                title={labels.empty}
                subtitle={labels.emptySubtitle}
                palette={palette}
                surfaces={surfaces}
              />
            ))
          )
        ) : (
          <ol className="m-0 list-none p-0">
            {steps.map((step, index) => {
              const status = normalizeStatus(step.status, customStatuses);
              const disabled = Boolean(step.disabled || (disableFutureSteps && status === "not_started"));
              const tokens = getStatusTokens(status, palette, customStatuses);
              const isActive = step.id === activeStepId;
              const isLast = index === steps.length - 1;
              const nested =
                isActive && step.subSteps && step.subSteps.length > 0
                  ? step.subSteps
                  : undefined;

              const rowContent = (
                <>
                  <WorkflowStatusNode
                    status={status}
                    palette={palette}
                    customStatuses={customStatuses}
                    size={collapsed ? "sm" : "md"}
                    className={collapsed ? undefined : "mt-0.5"}
                  />
                  {collapsed && (
                    <span className="sr-only">
                      {step.label} — {resolveStatusLabel(status, labels, customStatuses)}
                    </span>
                  )}
                  <div
                    aria-hidden={collapsed || undefined}
                    className={classNames(
                      "min-w-0 transition-opacity duration-200 motion-reduce:transition-none",
                      collapsed
                        ? "invisible absolute w-0 overflow-hidden opacity-0"
                        : "flex-1 opacity-100",
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={classNames(
                          "text-sm",
                          isActive
                            ? "font-semibold text-neutral-900 dark:text-white"
                            : "font-medium text-neutral-700 dark:text-neutral-200",
                        )}
                      >
                        {step.label}
                      </span>
                      {step.badge && (
                        <WorkflowBadge
                          status={status}
                          palette={palette}
                          customStatuses={customStatuses}
                          tone={step.badgeTone}
                        >
                          {step.badge}
                        </WorkflowBadge>
                      )}
                    </div>
                    {step.meta && (
                      <p
                        className={classNames(
                          "mt-1 text-xs leading-5",
                          surfaces.mutedText,
                        )}
                      >
                        {step.meta}
                      </p>
                    )}
                  </div>
                </>
              );

              const popupContent = collapsed && !disabled
                ? renderStepPopover?.(step)
                : undefined;
              const row = onStepSelect ? (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => { if (!disabled) onStepSelect(step.id); }}
                  className={classNames(
                    "relative flex text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500",
                    collapsed ? "focus-visible:ring-inset" : "focus-visible:ring-offset-2",
                    collapsed
                      ? "h-9 w-9 items-center justify-center rounded-xl"
                      : "w-full items-start gap-3 rounded-sm",
                    collapsed && !disabled && "transition-colors hover:bg-neutral-100 dark:hover:bg-white/5",
                    disabled && "pointer-events-none cursor-default",
                  )}
                >
                  {rowContent}
                </button>
              ) : (
                <div
                  // Keyboard focus reveals the tooltip on a read-only compact node.
                  tabIndex={collapsed && !disabled ? 0 : undefined}
                  aria-disabled={disabled || undefined}
                  className={classNames(
                    "relative flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500",
                    collapsed && "focus-visible:ring-inset",
                    collapsed
                      ? "h-9 w-9 items-center justify-center rounded-xl"
                      : "w-full items-start gap-3 rounded-sm",
                    collapsed && !disabled && "transition-colors hover:bg-neutral-100 dark:hover:bg-white/5",
                    disabled && "pointer-events-none cursor-default",
                  )}
                >
                  {rowContent}
                </div>
              );

              return (
                <li
                  key={step.id}
                  data-disabled={disabled || undefined}
                  className={classNames(
                    "relative",
                    !isLast && (collapsed ? "pb-2" : "pb-5"),
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {collapsed && isActive && (
                    <span
                      aria-hidden="true"
                      data-workflow-selection-marker
                      style={{ position: "absolute", pointerEvents: "none" }}
                      className={classNames(
                        `absolute top-1.5 h-6 w-1 bg-${palette.accent}-600`,
                        side === "left" ? "-left-2 rounded-r-full" : "-right-2 rounded-l-full",
                      )}
                    />
                  )}
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className={classNames(
                        "absolute bottom-0",
                        tokens.connectorDashed
                          ? `border-l-2 border-dashed ${tokens.connector}`
                          : `w-0.5 rounded-full ${tokens.connector}`,
                      )}
                      style={{
                        left: collapsed ? "calc(50% - 1px)" : CONNECTOR_LEFT,
                        top: collapsed ? 32 : CONNECTOR_TOP,
                      }}
                    />
                  )}
                  <div
                    className={collapsed ? "flex justify-center" : undefined}
                  >
                    {disabled ? row : popupContent != null && popupContent !== false ? (
                      <Popover
                        {...stepPopoverProps}
                        placement={stepPopoverProps?.placement ?? "right"}
                        triggerMode="hover"
                        closeOnTriggerClick={Boolean(onStepSelect)}
                        trigger={row}
                      >
                        {popupContent}
                      </Popover>
                    ) : (
                      <TooltipWrapper
                        position="right"
                        text={
                          collapsed
                            ? `${typeof step.label === "string" || typeof step.label === "number" ? step.label : `${labels.step} ${index + 1}`} — ${resolveStatusLabel(status, labels, customStatuses)}`
                            : undefined
                        }
                      >
                        {row}
                      </TooltipWrapper>
                    )}
                  </div>
                  {/* Quick actions live outside the row's <button> — they
                      are siblings in the <li>, so a gate never nests a
                      button inside a button and the label stays the row's
                      click target. `ml-8` matches NESTED_INDENT, aligning
                      them to the label's edge. */}
                  {!collapsed && !disabled && (
                    <WorkflowQuickActions
                      stepId={step.id}
                      actions={step.actions ?? []}
                      palette={palette}
                      groupLabel={labels.quickActions}
                      onAction={onStepAction}
                      className="ml-8 mt-2"
                    />
                  )}
                  {!collapsed && nested && (
                    <NestedSubSteps
                      stepId={step.id}
                      subSteps={nested}
                      maxVisible={maxVisibleSubSteps}
                      loadMode={subStepLoadMode}
                      order={subStepOrder}
                      palette={palette}
                      customStatuses={customStatuses}
                      surfaces={surfaces}
                      labels={labels}
                      onSubStepSelect={disabled ? undefined : onSubStepSelect}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </ScrollArea>
      {resizableFooter && <div
        {...footer.handleProps}
        aria-label={footerResizeLabel}
        className={classNames("group relative flex h-3 shrink-0 touch-none cursor-row-resize items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-400", surfaces.border)}
      >
        <span aria-hidden="true" className={classNames("pointer-events-none absolute inset-x-0 top-1/2 border-t", surfaces.border)} />
        <span aria-hidden="true" className={classNames("relative h-1 w-10 rounded-full bg-neutral-400 transition-opacity dark:bg-neutral-500", footer.dragging ? "opacity-100" : "opacity-40 group-hover:opacity-100 group-focus-visible:opacity-100")} />
      </div>}
      {hasFooter && <div
        id={footer.footerId}
        role="region"
        aria-label={footerLabel}
        className={classNames("flex min-h-0 flex-col overflow-hidden", !resizableFooter && "border-t", surfaces.border)}
        style={fillHeight ? { flex: `${footer.percentage} 1 0%` } : undefined}
      >
        {hasFooterHeader && <div className={classNames("shrink-0 pb-3 pt-4", collapsed ? "px-2" : "px-5")}>
          {controlsHeader}
        </div>}
        <ScrollArea
          variant="hover"
          horizontal={false}
          className={fillHeight ? "min-h-0 flex-1" : undefined}
          viewportClassName="overscroll-contain"
          contentClassName={classNames("table-fixed w-full", collapsed ? "px-2 pb-4" : "px-5 pb-4", !hasFooterHeader && "pt-4")}
        >
          {controls}
        </ScrollArea>
      </div>}

      </div>

      {/* Legend */}
      {showLegend && !isEmpty && !collapsed && (
        <div
          className={classNames(
            "mt-auto shrink-0 border-t px-5 py-4",
            surfaces.border,
          )}
        >
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {[...LEGEND_ORDER, ...Object.keys(customStatuses ?? {})].map((status) => (
              <li key={status} className="flex items-center gap-2">
                <WorkflowStatusNode
                  status={status}
                  palette={palette}
                  customStatuses={customStatuses}
                  size="sm"
                />
                <span className={classNames("text-xs", surfaces.mutedText)}>
                  {resolveStatusLabel(status, labels, customStatuses)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorkflowTimeline;
