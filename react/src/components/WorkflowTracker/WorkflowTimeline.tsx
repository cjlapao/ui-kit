import React from "react";
import classNames from "classnames";

import Progress from "../Progress";
import TooltipWrapper from "../TooltipWrapper";
import Popover, { type PopoverProps } from "../Popover";
import ScrollArea from "../ScrollArea";
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
  type WorkflowPalette,
} from "./statusTokens";
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
            <WorkflowStatusNode status={status} palette={palette} size="sm" />
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
  controls?: React.ReactNode;
  hasCollapseToggle?: boolean;
  renderStepPopover?: (step: WorkflowStep) => React.ReactNode;
  stepPopoverProps?: Omit<PopoverProps, "trigger" | "children">;
  collapsed?: boolean;
  fillHeight?: boolean;
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
  onStepAction?: (stepId: string, actionId: string) => void;
}

/** Progress header, the vertical timeline, and the legend footer. */
export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({
  controls,
  hasCollapseToggle = false,
  renderStepPopover,
  stepPopoverProps,
  collapsed = false,
  fillHeight = false,
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
  onStepAction,
}) => {
  const isEmpty = steps.length === 0;

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

      {/* Timeline */}
      <ScrollArea
        variant="hover"
        className={fillHeight ? "min-h-0 flex-1" : undefined}
        contentClassName={classNames(
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
                    className={collapsed ? undefined : "mt-0.5"}
                  />
                  {collapsed && (
                    <span className="sr-only">
                      {step.label} — {labels.statuses[status]}
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

              const popupContent = collapsed
                ? renderStepPopover?.(step)
                : undefined;
              const row = onStepSelect ? (
                <button
                  type="button"
                  onClick={() => onStepSelect(step.id)}
                  className={classNames(
                    "relative flex text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-neutral-500",
                    collapsed
                      ? "h-9 w-9 items-center justify-center rounded-xl"
                      : "w-full items-start gap-3 rounded-sm",
                    collapsed &&
                      isActive &&
                      "bg-neutral-200 dark:bg-neutral-700",
                  )}
                >
                  {rowContent}
                </button>
              ) : (
                <div
                  // Keyboard focus reveals the tooltip on a read-only compact node.
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                  tabIndex={collapsed ? 0 : undefined}
                  className={classNames(
                    "relative flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
                    collapsed
                      ? "h-9 w-9 items-center justify-center rounded-xl"
                      : "w-full items-start gap-3 rounded-sm",
                    collapsed &&
                      isActive &&
                      "bg-neutral-200 dark:bg-neutral-700",
                  )}
                >
                  {rowContent}
                </div>
              );

              return (
                <li
                  key={step.id}
                  className={classNames(
                    "relative",
                    !isLast && (collapsed ? "pb-2" : "pb-5"),
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {collapsed && isActive && (
                    <span
                      aria-hidden="true"
                      className={`absolute -left-2 top-1.5 h-6 w-1 rounded-r-full bg-${palette.accent}-600`}
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
                    {popupContent != null && popupContent !== false ? (
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
                            ? `${typeof step.label === "string" || typeof step.label === "number" ? step.label : `${labels.step} ${index + 1}`} — ${labels.statuses[status]}`
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
                  {!collapsed && (
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
        {controls != null && controls !== false && (
          <div
            className={classNames(
              "mt-4 border-t pt-4",
              surfaces.border,
              (loading || isEmpty) && (collapsed ? "px-2 pb-4" : "px-5 pb-5"),
            )}
          >
            {controls}
          </div>
        )}
      </ScrollArea>

      {/* Legend */}
      {showLegend && !isEmpty && !collapsed && (
        <div
          className={classNames(
            "mt-auto shrink-0 border-t px-5 py-4",
            surfaces.border,
          )}
        >
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
