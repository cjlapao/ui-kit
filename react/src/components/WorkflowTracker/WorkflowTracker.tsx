import React, { useMemo } from "react";
import classNames from "classnames";

import Panel from "../Panel";
import {
  DEFAULT_SURFACE_CORNER,
  getSurfaceCornerClass,
} from "../../theme/Theme";
import Pill from "../Pill";
import WorkflowTimeline from "./WorkflowTimeline";
import WorkflowDetailPanel from "./WorkflowDetailPanel";
import WorkflowSummaryCard from "./WorkflowSummaryCard";
import { sampleWorkflow } from "./sampleWorkflow";
import { WorkflowHeaderSkeleton } from "./WorkflowSkeleton";
import type { WorkflowPalette } from "./statusTokens";
import { getSurfaceTokens, isTranslucentVariant } from "./surfaces";
import {
  computeProgress,
  computeTallies,
  getAttentionSteps,
  getSkippedSteps,
  resolveActiveStep,
} from "./derive";
import type { WorkflowTrackerLabels, WorkflowTrackerProps } from "./types";

const DEFAULT_LABELS: WorkflowTrackerLabels = {
  progress: "Progress",
  done: "done",
  skipped: "skipped",
  flagged: "flagged",
  remaining: "remaining",
  step: "Step",
  of: "of",
  elapsed: "Elapsed",
  owner: "Owner",
  started: "Started",
  sla: "SLA",
  subSteps: "Sub-steps",
  accepted: "accepted",
  open: "open",
  needsAttention: "Needs attention",
  skippedSteps: "Skipped steps",
  live: "LIVE · read-only view",
  empty: "No steps yet",
  emptySubtitle: "Steps appear here as soon as the workflow starts.",
  noActiveStep: "No step selected",
  statuses: {
    done: "Done",
    in_progress: "In progress",
    running: "Running",
    skipped: "Skipped",
    blocked: "Blocked",
    attention: "Attention",
    not_started: "Not started",
  },
};

/**
 * Multi-step workflow/pipeline status view: a vertical timeline of steps on the
 * left, the active step's detail (with sub-steps) on the right, and roll-up
 * cards for flagged and skipped steps underneath.
 *
 * Everything is driven by `data` — progress, tallies, sub-step counters and the
 * two roll-up lists are derived here, never passed in. Read-only unless
 * `onStepSelect` / `onSubStepSelect` are supplied.
 */
export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({
  data = sampleWorkflow,
  accentColor = "blue",
  attentionColor = "rose",
  blockedColor = "amber",
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
  loading = false,
  loadingRows = 6,
  emptyState,
  showHeader = true,
  showLegend = true,
  labels: labelOverrides,
  onStepSelect,
  onSubStepSelect,
  className,
  style,
  ...rest
}) => {
  const steps = data?.steps ?? [];

  // Glass cards need translucent inner surfaces; anything opaque reads as a
  // hole punched in the card. Derived from `variant` unless overridden.
  const translucent = translucentSurfaces ?? isTranslucentVariant(variant);
  const surfaces = useMemo(
    () => getSurfaceTokens(translucent),
    [translucent],
  );

  const palette = useMemo<WorkflowPalette>(
    () => ({
      accent: accentColor,
      attention: attentionColor,
      blocked: blockedColor,
      muted: mutedColor,
      translucent,
    }),
    [accentColor, attentionColor, blockedColor, mutedColor, translucent],
  );

  const labels = useMemo<WorkflowTrackerLabels>(
    () => ({
      ...DEFAULT_LABELS,
      ...labelOverrides,
      statuses: {
        ...DEFAULT_LABELS.statuses,
        ...labelOverrides?.statuses,
      },
    }),
    [labelOverrides],
  );

  const progress = useMemo(() => computeProgress(steps), [steps]);
  const tallies = useMemo(() => computeTallies(steps), [steps]);
  const active = useMemo(
    () => resolveActiveStep(steps, data?.activeStepId),
    [steps, data?.activeStepId],
  );
  const attentionSteps = useMemo(() => getAttentionSteps(steps), [steps]);
  const skippedSteps = useMemo(() => getSkippedSteps(steps), [steps]);

  const cardProps = {
    variant,
    tone: cardTone,
    corner,
    glassOpacity,
    vibrancy,
    specularMode,
    padding,
    scrollable: false,
  };

  const railStyle = {
    "--wt-rail-width":
      typeof railWidth === "number" ? `${railWidth}px` : railWidth,
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
          into a column narrower than the page. */}
      <div className="grid grid-cols-1 items-start gap-5 @4xl:grid-cols-[var(--wt-rail-width)_minmax(0,1fr)]">
        <Panel
          {...cardProps}
          className={classNames(stickyRail && "@4xl:sticky @4xl:top-6")}
        >
          <WorkflowTimeline
            steps={steps}
            activeStepId={active?.step.id}
            palette={palette}
            surfaces={surfaces}
            labels={labels}
            progress={progress}
            tallies={tallies}
            showLegend={showLegend && !loading}
            loading={loading}
            loadingRows={loadingRows}
            emptyState={emptyState}
            onStepSelect={onStepSelect}
            onSubStepSelect={onSubStepSelect}
          />
        </Panel>

        <div className="@container flex min-w-0 flex-col gap-5">
          <Panel {...cardProps}>
            <WorkflowDetailPanel
              active={active}
              totalSteps={steps.length}
              palette={palette}
              surfaces={surfaces}
              labels={labels}
              loading={loading}
              onSubStepSelect={onSubStepSelect}
            />
          </Panel>

          {!loading && (attentionSteps.length > 0 || skippedSteps.length > 0) && (
            <div className="grid grid-cols-1 gap-5 @xl:grid-cols-2">
              {attentionSteps.length > 0 && (
                <Panel {...cardProps}>
                  <WorkflowSummaryCard
                    title={labels.needsAttention}
                    steps={attentionSteps}
                    palette={palette}
                    surfaces={surfaces}
                  />
                </Panel>
              )}
              {skippedSteps.length > 0 && (
                <Panel {...cardProps}>
                  <WorkflowSummaryCard
                    title={labels.skippedSteps}
                    steps={skippedSteps}
                    palette={palette}
                    surfaces={surfaces}
                  />
                </Panel>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowTracker;
