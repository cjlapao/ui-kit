import React from "react";
import classNames from "classnames";

import WorkflowStatusNode from "./WorkflowStatusNode";
import { WorkflowDetailSkeleton } from "./WorkflowSkeleton";
import {
  MetaField,
  SectionMeta,
  SectionTitle,
  WorkflowBadge,
  WorkflowPlaceholder,
} from "./parts";
import { normalizeStatus, type WorkflowPalette } from "./statusTokens";
import { getRowHighlight, type WorkflowSurfaceTokens } from "./surfaces";
import { computeSubSummary, type ResolvedActiveStep } from "./derive";
import type { WorkflowTrackerLabels } from "./types";

export interface WorkflowDetailPanelProps {
  active?: ResolvedActiveStep;
  totalSteps: number;
  palette: WorkflowPalette;
  surfaces: WorkflowSurfaceTokens;
  labels: WorkflowTrackerLabels;
  loading: boolean;
  onSubStepSelect?: (stepId: string, subStepId: string) => void;
}

/** Header, meta row and sub-step table for the resolved active step. */
export const WorkflowDetailPanel: React.FC<WorkflowDetailPanelProps> = ({
  active,
  totalSteps,
  palette,
  surfaces,
  labels,
  loading,
  onSubStepSelect,
}) => {
  if (loading) {
    return <WorkflowDetailSkeleton />;
  }

  if (!active) {
    return (
      <WorkflowPlaceholder
        title={labels.noActiveStep}
        palette={palette}
        surfaces={surfaces}
      />
    );
  }

  const { step, index } = active;
  const status = normalizeStatus(step.status);
  const subSteps = step.subSteps ?? [];
  const summary = computeSubSummary(subSteps);
  const metaFields = [
    step.owner ? { label: labels.owner, value: step.owner } : undefined,
    step.startedAt ? { label: labels.started, value: step.startedAt } : undefined,
    step.sla ? { label: labels.sla, value: step.sla } : undefined,
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  return (
    <div className="flex flex-col">
      <div className="px-5 pb-6 pt-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <SectionTitle surfaces={surfaces}>
              {labels.step} {index} {labels.of} {totalSteps}
            </SectionTitle>
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
          {step.elapsed && (
            <SectionMeta surfaces={surfaces}>
              {labels.elapsed} {step.elapsed}
            </SectionMeta>
          )}
        </div>

        <h3 className="mt-3 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
          {step.label}
        </h3>

        {step.description && (
          <p
            className={classNames(
              "mt-2 max-w-3xl text-sm leading-6",
              surfaces.mutedText,
            )}
          >
            {step.description}
          </p>
        )}

        {metaFields.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
            {metaFields.map((field) => (
              <MetaField
                key={field.label}
                label={field.label}
                value={field.value}
                surfaces={surfaces}
              />
            ))}
          </div>
        )}
      </div>

      {subSteps.length > 0 && (
        <>
          <div
            className={classNames(
              "flex flex-wrap items-center justify-between gap-2 border-y px-5 py-2.5 sm:px-6",
              surfaces.border,
              surfaces.strip,
            )}
          >
            <SectionTitle surfaces={surfaces}>{labels.subSteps}</SectionTitle>
            <SectionMeta surfaces={surfaces}>
              {summary.accepted} {labels.accepted} · {summary.skipped}{" "}
              {labels.skipped} · {summary.open} {labels.open}
            </SectionMeta>
          </div>

          <ul
            className={classNames(
              "m-0 list-none divide-y p-0",
              surfaces.divider,
            )}
          >
            {subSteps.map((subStep) => {
              const subStatus = normalizeStatus(subStep.status);
              const isRunning = subStatus === "running";

              const rowContent = (
                <>
                  <WorkflowStatusNode status={subStatus} palette={palette} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                      {subStep.label}
                    </p>
                    {subStep.note && (
                      <p
                        className={classNames(
                          "mt-0.5 text-xs leading-5",
                          surfaces.mutedText,
                        )}
                      >
                        {subStep.note}
                      </p>
                    )}
                  </div>
                  {subStep.badge && (
                    <WorkflowBadge
                      status={subStatus}
                      palette={palette}
                      tone={subStep.badgeTone}
                    >
                      {subStep.badge}
                    </WorkflowBadge>
                  )}
                  <span
                    className={classNames(
                      "w-10 shrink-0 text-right text-xs tabular-nums",
                      surfaces.faintText,
                    )}
                  >
                    {subStep.duration ?? "—"}
                  </span>
                </>
              );

              const rowClasses = classNames(
                "flex w-full items-center gap-3 px-5 py-3 text-left sm:px-6",
                isRunning &&
                  getRowHighlight(palette.accent, surfaces.translucent),
              );

              return (
                <li key={subStep.id}>
                  {onSubStepSelect ? (
                    <button
                      type="button"
                      onClick={() => onSubStepSelect(step.id, subStep.id)}
                      className={classNames(
                        rowClasses,
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500",
                      )}
                    >
                      {rowContent}
                    </button>
                  ) : (
                    <div className={rowClasses}>{rowContent}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default WorkflowDetailPanel;
