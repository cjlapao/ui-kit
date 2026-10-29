import React, { useMemo } from "react";
import classNames from "classnames";

import {
  DEFAULT_SURFACE_CORNER,
  getSurfaceCornerClass,
} from "../../theme/Theme";
import Pill from "../Pill";
import WorkflowTrackerRail from "./WorkflowTrackerRail";
import WorkflowTrackerStepDetails from "./WorkflowTrackerStepDetails";
import WorkflowTrackerDetails from "./WorkflowTrackerDetails";
import WorkflowTrackerRollups from "./WorkflowTrackerRollups";
import { resolveLabels, useWorkflowChrome } from "./chrome";
import { sampleWorkflow } from "./sampleWorkflow";
import { WorkflowHeaderSkeleton } from "./WorkflowSkeleton";
import type { WorkflowTrackerProps } from "./types";

/**
 * Multi-step workflow/pipeline status view: a vertical timeline of steps on the
 * left, the active step's detail (with sub-steps) on the right, and roll-up
 * cards for flagged and skipped steps underneath.
 *
 * A layout of the same standalone parts the kit exports individually —
 * `WorkflowTrackerRail`, `WorkflowTrackerStepDetails`, `WorkflowTrackerDetails`
 * and `WorkflowTrackerRollups` — so using a part on its own renders
 * identically to the same panel here.
 *
 * Everything is driven by `data` — progress, tallies, sub-step counters and the
 * two roll-up lists are derived, never passed in. Read-only unless
 * `onStepSelect` / `onSubStepSelect` / `onStepAction` are supplied.
 */
export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({
  data = sampleWorkflow,
  accentColor = "blue",
  attentionColor = "rose",
  blockedColor = "amber",
  failedColor = "red",
  customStatuses,
  mutedColor = "neutral",
  variant = "outlined",
  cardTone = "neutral",
  translucentSurfaces,
  glassOpacity = "light",
  vibrancy,
  specularMode,
  corner = DEFAULT_SURFACE_CORNER,
  iconCorner = DEFAULT_SURFACE_CORNER,
  padding = "none",
  maxWidth = 1180,
  railWidth = 360,
  stickyRail = false,
  fillHeight = false,
  fillHeightOffset = 0,
  loading = false,
  loadingRows = 6,
  emptyState,
  showHeader = true,
  showLegend = true,
  labels: labelOverrides,
  onStepSelect,
  disableFutureSteps = false,
  onSubStepSelect,
  onStepAction,
  className,
  style,
  ...rest
}) => {
  const styleProps = {
    accentColor,
    attentionColor,
    blockedColor,
    failedColor,
    customStatuses,
    mutedColor,
    variant,
    cardTone,
    corner,
    glassOpacity,
    vibrancy,
    specularMode,
    padding,
    translucentSurfaces,
  };

  // The composite still owns its own chrome: the page header and the live
  // pill sit outside the parts.
  const { surfaces } = useWorkflowChrome(styleProps);
  const labels = useMemo(() => resolveLabels(labelOverrides), [labelOverrides]);

  const railStyle = {
    "--wt-rail-width":
      typeof railWidth === "number" ? `${railWidth}px` : railWidth,
    "--wt-fill-offset":
      typeof fillHeightOffset === "number"
        ? `${fillHeightOffset}px`
        : fillHeightOffset,
  } as React.CSSProperties;

  return (
    <div
      className={classNames("@container w-full", className)}
      style={{ maxWidth, ...railStyle, ...style }}
      aria-busy={loading || undefined}
      {...rest}
    >
      {showHeader && loading && (
        <WorkflowHeaderSkeleton
          hasIcon={Boolean(data?.icon)}
          iconCorner={iconCorner}
        />
      )}
      {showHeader && !loading && (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {data?.icon && (
              // `overflow-hidden` plus the shared corner class clips whatever
              // the caller passes, so an <img> needs no rounding of its own.
              <span
                className={classNames(
                  "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden [&>img]:h-full [&>img]:w-full [&>img]:object-cover",
                  getSurfaceCornerClass(iconCorner),
                  surfaces.chip,
                )}
              >
                {data.icon}
              </span>
            )}
            <div className="min-w-0">
              {data?.eyebrow && (
                <p
                  className={classNames(
                    "text-[11px] font-semibold uppercase tracking-widest",
                    surfaces.faintText,
                  )}
                >
                  {data.eyebrow}
                </p>
              )}
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                {data?.title}
              </h2>
            </div>
          </div>
          {data?.live && (
            <Pill
              size="md"
              tone={mutedColor}
              variant="outline"
              className={classNames("tracking-wide", surfaces.chip)}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  "mr-2 inline-block h-1.5 w-1.5 rounded-full",
                  `bg-${accentColor}-500 dark:bg-${accentColor}-400`,
                )}
              />
              {labels.live}
            </Pill>
          )}
        </header>
      )}

      {/* Container queries, not viewport ones: the tracker is often dropped
          into a column narrower than the page. In fill mode the grid claims
          the viewport height from the `@4xl` breakpoint up (stacked layouts
          keep scrolling with the page) and both columns stretch so the
          details card can absorb the leftover space. */}
      <div
        className={classNames(
          "grid grid-cols-1 items-start gap-5 @4xl:grid-cols-[var(--wt-rail-width)_minmax(0,1fr)]",
          fillHeight && "@4xl:h-[calc(100dvh-var(--wt-fill-offset))]",
        )}
      >
        <WorkflowTrackerRail
          {...styleProps}
          data={data}
          loading={loading}
          loadingRows={loadingRows}
          showLegend={showLegend}
          emptyState={emptyState}
          labels={labelOverrides}
          // A scrollable rail body only matters once the column height is
          // fixed; stickiness and that fixed height are mutually exclusive,
          // so `stickyRail` stands down while the rail scrolls in place.
          cardScrollable={fillHeight}
          cardClassName={classNames(
            stickyRail && !fillHeight && "@4xl:sticky @4xl:top-6",
            fillHeight && "@4xl:min-h-0 @4xl:self-stretch",
          )}
          onStepSelect={onStepSelect}
          disableFutureSteps={disableFutureSteps}
          onSubStepSelect={onSubStepSelect}
          onStepAction={onStepAction}
        />

        <div
          className={classNames(
            "@container flex min-w-0 flex-col gap-5",
            fillHeight && "@4xl:min-h-0 @4xl:self-stretch",
          )}
        >
          <WorkflowTrackerStepDetails
            {...styleProps}
            data={data}
            loading={loading}
            labels={labelOverrides}
            onSubStepSelect={onSubStepSelect}
            onStepAction={onStepAction}
          />

          <WorkflowTrackerDetails
            {...styleProps}
            data={data}
            loading={loading}
            labels={labelOverrides}
          />

          <WorkflowTrackerRollups
            {...styleProps}
            data={data}
            loading={loading}
            labels={labelOverrides}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowTracker;
