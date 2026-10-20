import React, { useMemo } from "react";
import classNames from "classnames";

import Panel from "../Panel";
import WorkflowDetailPanel from "./WorkflowDetailPanel";
import {
  buildCardProps,
  resolveLabels,
  useWorkflowChrome,
  type WorkflowTrackerStyleProps,
} from "./chrome";
import { resolveActiveStep } from "./derive";
import { sampleWorkflow } from "./sampleWorkflow";
import type { WorkflowData, WorkflowTrackerLabels } from "./types";

export interface WorkflowTrackerStepDetailsProps
  extends WorkflowTrackerStyleProps {
  /** The whole view. Defaults to the bundled `sampleWorkflow` fixture. */
  data?: WorkflowData;
  /** Swaps the card for its skeleton placeholder. */
  loading?: boolean;
  /** Partial copy overrides. */
  labels?: Partial<WorkflowTrackerLabels>;
  /**
   * Advanced: classes the composite forwards for its grid mechanics
   * (fill-mode stretch). Prefer `className` for everyday styling.
   */
  cardClassName?: string;
  /** When provided, sub-step rows become buttons. */
  onSubStepSelect?: (stepId: string, subStepId: string) => void;
  /** When provided, the active step's `actions` render as quick-action buttons. */
  onStepAction?: (stepId: string, actionId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The active step's card — "Step n of m" header with badge and elapsed,
 * description, meta row, sub-steps table and quick actions — as a
 * standalone consumable. The active step is resolved from `data` with the
 * same fallback rule the composite uses (explicit id, else the first
 * in-progress step, else the first step).
 */
export const WorkflowTrackerStepDetails: React.FC<WorkflowTrackerStepDetailsProps> =
  ({
    data = sampleWorkflow,
    loading = false,
    labels: labelOverrides,
    cardClassName,
    onSubStepSelect,
    onStepAction,
    className,
    style,
    ...styleProps
  }) => {
    const steps = data?.steps ?? [];
    const { palette, surfaces } = useWorkflowChrome(styleProps);
    const labels = useMemo(
      () => resolveLabels(labelOverrides),
      [labelOverrides],
    );
    const cardProps = buildCardProps(styleProps);

    const active = useMemo(
      () => resolveActiveStep(steps, data?.activeStepId),
      [steps, data?.activeStepId],
    );

    return (
      <Panel
        {...cardProps}
        className={classNames(className, cardClassName)}
        style={style}
      >
        <WorkflowDetailPanel
          active={active}
          totalSteps={steps.length}
          palette={palette}
          surfaces={surfaces}
          labels={labels}
          loading={loading}
          onSubStepSelect={onSubStepSelect}
          onStepAction={onStepAction}
        />
      </Panel>
    );
  };

export default WorkflowTrackerStepDetails;
