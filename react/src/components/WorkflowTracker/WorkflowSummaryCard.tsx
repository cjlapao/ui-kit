import React from "react";
import classNames from "classnames";

import WorkflowStatusNode from "./WorkflowStatusNode";
import { SectionTitle } from "./parts";
import { normalizeStatus, type WorkflowPalette } from "./statusTokens";
import type { WorkflowSurfaceTokens } from "./surfaces";
import type { WorkflowStep } from "./types";

export interface WorkflowSummaryCardProps {
  title: React.ReactNode;
  steps: WorkflowStep[];
  palette: WorkflowPalette;
  surfaces: WorkflowSurfaceTokens;
}

/**
 * "Needs attention" / "Skipped steps" roll-up. Callers hide the card when the
 * list is empty rather than rendering an empty shell.
 */
export const WorkflowSummaryCard: React.FC<WorkflowSummaryCardProps> = ({
  title,
  steps,
  palette,
  surfaces,
}) => (
  <div className="px-5 py-4">
    <SectionTitle surfaces={surfaces}>{title}</SectionTitle>
    <ul className="mt-3 space-y-3">
      {steps.map((step) => (
        <li key={step.id} className="flex items-start gap-3">
          <WorkflowStatusNode
            status={normalizeStatus(step.status)}
            palette={palette}
            className="mt-0.5"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
              {step.label}
            </p>
            {step.meta && (
              <p
                className={classNames(
                  "mt-0.5 text-xs leading-5",
                  surfaces.mutedText,
                )}
              >
                {step.meta}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default WorkflowSummaryCard;
