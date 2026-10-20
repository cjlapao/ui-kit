import React, { useMemo } from "react";
import classNames from "classnames";

import WorkflowDetailsCard from "./WorkflowDetailsCard";
import { buildCardProps, resolveLabels } from "./chrome";
import { resolveActiveStep } from "./derive";
import { sampleWorkflow } from "./sampleWorkflow";
import type { WorkflowData, WorkflowTrackerLabels } from "./types";
import type { WorkflowTrackerStyleProps } from "./chrome";

export interface WorkflowTrackerDetailsProps
  extends WorkflowTrackerStyleProps {
  /** The whole view. Defaults to the bundled `sampleWorkflow` fixture. */
  data?: WorkflowData;
  /** Hides the card while the surrounding view is loading. */
  loading?: boolean;
  /** Partial copy overrides (`labels.details` names the scroll region). */
  labels?: Partial<WorkflowTrackerLabels>;
  /**
   * Advanced: classes the composite forwards for its grid mechanics
   * (fill-mode stretch). Prefer `className` for everyday styling.
   */
  cardClassName?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The scrollable details body — whatever the caller attached to the active
 * step as `details` — as a standalone consumable. Same mount rule as the
 * composite: nothing renders (not even the card shell) while loading or
 * when the resolved active step has no non-empty `details`.
 */
export const WorkflowTrackerDetails: React.FC<WorkflowTrackerDetailsProps> = ({
  data = sampleWorkflow,
  loading = false,
  labels: labelOverrides,
  cardClassName,
  className,
  style,
  ...styleProps
}) => {
  const steps = data?.steps ?? [];
  const labels = useMemo(() => resolveLabels(labelOverrides), [labelOverrides]);
  const cardProps = buildCardProps(styleProps);

  const active = useMemo(
    () => resolveActiveStep(steps, data?.activeStepId),
    [steps, data?.activeStepId],
  );

  const details = active?.step.details;
  if (loading || details == null || details === "") return null;

  return (
    <WorkflowDetailsCard
      details={details}
      ariaLabel={labels.details}
      cardProps={cardProps}
      className={classNames(className, cardClassName)}
      style={style}
    />
  );
};

export default WorkflowTrackerDetails;
