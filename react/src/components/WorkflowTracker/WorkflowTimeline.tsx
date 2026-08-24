import React from "react";
import classNames from "classnames";

import Progress from "../Progress";
import { WorkflowRailSkeleton } from "./WorkflowSkeleton";
import WorkflowStatusNode from "./WorkflowStatusNode";
import { SectionTitle, Tally, WorkflowBadge, WorkflowPlaceholder } from "./parts";
import { getStatusTokens, normalizeStatus, type WorkflowPalette } from "./statusTokens";
import type { WorkflowSurfaceTokens } from "./surfaces";
import type { WorkflowTallies } from "./derive";
import type {
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

const LEGEND_ORDER: WorkflowStatus[] = [
  "done",
  "in_progress",
  "skipped",
  "blocked",
  "attention",
  "not_started",
];

interface NestedSubStepsProps {
  stepId: string;
  subSteps: WorkflowSubStep[];
  palette: WorkflowPalette;
  surfaces: WorkflowSurfaceTokens;
  onSubStepSelect?: (stepId: string, subStepId: string) => void;
}

/**
 * Compact mirror of the detail panel's table — nodes and labels only, no
 * badges or durations.
 */
const NestedSubSteps: React.FC<NestedSubStepsProps> = ({
  stepId,
  subSteps,
  palette,
  surfaces,
  onSubStepSelect,
}) => (
  <div
    className={classNames("mt-3 rounded-lg p-3", surfaces.nestedBox)}
    style={{ marginLeft: NESTED_INDENT }}
  >
    <ul className="space-y-2.5">
      {subSteps.map((subStep) => {
        const status = normalizeStatus(subStep.status);
        const isActive = status === "running" || status === "in_progress";
        const content = (
          <>
            <WorkflowStatusNode
              status={status}
              palette={palette}
              size="sm"
            />
            <span
              className={classNames(
                "text-sm",
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
                className="flex w-full items-center gap-2.5 rounded-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-neutral-500"
              >
                {content}
              </button>
            ) : (
              <div className="flex items-center gap-2.5">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  </div>
);

export interface WorkflowTimelineProps {
  steps: WorkflowStep[];
  activeStepId?: string;
  palette: WorkflowPalette;
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
}

/** Progress header, the vertical timeline, and the legend footer. */
export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({
  steps,
  activeStepId,
  palette,
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
}) => {
  if (loading) {
    return <WorkflowRailSkeleton rows={loadingRows} />;
  }

  const isEmpty = steps.length === 0;

  const tallyEntries = [
    { count: tallies.done, label: labels.done },
    { count: tallies.skipped, label: labels.skipped },
    { count: tallies.flagged, label: labels.flagged },
    { count: tallies.remaining, label: labels.remaining },
  ].filter((entry) => entry.count > 0);

  return (
    <div className="flex flex-col">
      {/* Progress header — pointless with nothing to measure. */}
      {!isEmpty && (
      <div className={classNames("border-b px-5 pb-4 pt-5", surfaces.border)}>
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

      {/* Timeline */}
      <div className={classNames(isEmpty ? "" : "px-5 py-5")}>
        {isEmpty ? (
          (emptyState ?? (
            <WorkflowPlaceholder
              title={labels.empty}
              subtitle={labels.emptySubtitle}
              palette={palette}
              surfaces={surfaces}
            />
          ))
        ) : (
          <ol className="m-0 list-none p-0">
            {steps.map((step, index) => {
              const status = normalizeStatus(step.status);
              const tokens = getStatusTokens(status, palette);
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
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
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

              return (
                <li
                  key={step.id}
                  className={classNames("relative", !isLast && "pb-5")}
                  aria-current={isActive ? "step" : undefined}
                >
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className={classNames(
                        "absolute bottom-0",
                        tokens.connectorDashed
                          ? `border-l-2 border-dashed ${tokens.connector}`
                          : `w-0.5 rounded-full ${tokens.connector}`,
                      )}
                      style={{ left: CONNECTOR_LEFT, top: CONNECTOR_TOP }}
                    />
                  )}
                  {onStepSelect ? (
                    <button
                      type="button"
                      onClick={() => onStepSelect(step.id)}
                      className="flex w-full items-start gap-3 rounded-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-neutral-500"
                    >
                      {rowContent}
                    </button>
                  ) : (
                    <div className="flex items-start gap-3">{rowContent}</div>
                  )}
                  {nested && (
                    <NestedSubSteps
                      stepId={step.id}
                      subSteps={nested}
                      palette={palette}
                      surfaces={surfaces}
                      onSubStepSelect={onSubStepSelect}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* Legend */}
      {showLegend && !isEmpty && (
        <div className={classNames("mt-auto border-t px-5 py-4", surfaces.border)}>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {LEGEND_ORDER.map((status) => (
              <li key={status} className="flex items-center gap-2">
                <WorkflowStatusNode
                  status={status}
                  palette={palette}
                  size="sm"
                />
                <span className={classNames("text-xs", surfaces.mutedText)}>
                  {labels.statuses[status]}
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
