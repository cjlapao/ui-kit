import React, { useMemo } from "react";
import classNames from "classnames";

import Panel from "../Panel";
import WorkflowSummaryCard from "./WorkflowSummaryCard";
import {
  buildCardProps,
  resolveLabels,
  useWorkflowChrome,
  type WorkflowTrackerStyleProps,
} from "./chrome";
import { getAttentionSteps, getSkippedSteps } from "./derive";
import { sampleWorkflow } from "./sampleWorkflow";
import type { WorkflowData, WorkflowTrackerLabels } from "./types";

export interface WorkflowTrackerRollupsProps extends WorkflowTrackerStyleProps {
  /** The whole view. Defaults to the bundled `sampleWorkflow` fixture. */
  data?: WorkflowData;
  /** Hides the roll-ups while the surrounding view is loading. */
  loading?: boolean;
  /** Partial copy overrides (`labels.needsAttention` / `labels.skippedSteps`). */
  labels?: Partial<WorkflowTrackerLabels>;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The "Needs attention" / "Skipped steps" roll-up grid as a standalone
 * consumable — the same two derived cards the composite stacks under the
 * step details, in the same 1→2-column container grid. Both lists are
 * derived from `data`; the grid renders nothing while `loading` or when no
 * step qualifies (no empty shells). Rows are static roll-ups, never
 * interactive — action affordances live on the steps themselves
 * (`actions` + `onStepAction`).
 */
export const WorkflowTrackerRollups: React.FC<WorkflowTrackerRollupsProps> = ({
  data = sampleWorkflow,
  loading = false,
  labels: labelOverrides,
  className,
  style,
  ...styleProps
}) => {
  const steps = data?.steps ?? [];
  const { palette, surfaces } = useWorkflowChrome(styleProps);
  const labels = useMemo(() => resolveLabels(labelOverrides), [labelOverrides]);
  const cardProps = buildCardProps(styleProps);

  const attentionSteps = useMemo(() => getAttentionSteps(steps), [steps]);
  const skippedSteps = useMemo(() => getSkippedSteps(steps), [steps]);

  if (loading || (attentionSteps.length === 0 && skippedSteps.length === 0)) {
    return null;
  }

  return (
    <div
      className={classNames("grid grid-cols-1 gap-5 @xl:grid-cols-2", className)}
      style={style}
    >
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
  );
};

export default WorkflowTrackerRollups;
