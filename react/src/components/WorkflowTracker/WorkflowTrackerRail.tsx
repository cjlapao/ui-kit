import React, { useMemo } from "react";
import classNames from "classnames";

import Panel from "../Panel";
import WorkflowTimeline from "./WorkflowTimeline";
import {
  buildCardProps,
  resolveLabels,
  useWorkflowChrome,
  type WorkflowTrackerStyleProps,
} from "./chrome";
import { computeProgress, computeTallies, resolveActiveStep } from "./derive";
import { sampleWorkflow } from "./sampleWorkflow";
import type { WorkflowData, WorkflowTrackerLabels } from "./types";

export interface WorkflowTrackerRailProps extends WorkflowTrackerStyleProps {
  /** The whole view. Defaults to the bundled `sampleWorkflow` fixture. */
  data?: WorkflowData;
  /** Swaps the rail for its skeleton placeholder. */
  loading?: boolean;
  /** Rows in the rail skeleton. @default 6 */
  loadingRows?: number;
  /** @default true */
  showLegend?: boolean;
  /** Replaces the built-in placeholder shown when `steps` is empty. */
  emptyState?: React.ReactNode;
  /** Partial copy overrides. */
  labels?: Partial<WorkflowTrackerLabels>;
  /**
   * Advanced: classes the composite forwards for its grid mechanics (sticky
   * rail, fill-mode stretch). Prefer `className` for everyday styling.
   */
  cardClassName?: string;
  /**
   * Advanced: scroll the rail body inside its card — the composite turns
   * this on in `fillHeight` mode so a long rail never pushes the page.
   */
  cardScrollable?: boolean;
  /** When provided, timeline rows become buttons. */
  onStepSelect?: (stepId: string) => void;
  /** When provided, the active step's nested sub-step rows become buttons. */
  onSubStepSelect?: (stepId: string, subStepId: string) => void;
  /** When provided, steps' `actions` render as quick-action buttons. */
  onStepAction?: (stepId: string, actionId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The tracker's "main" panel — progress header, vertical timeline with the
 * active step's nested sub-steps, and the legend — as a standalone
 * consumable. It derives progress, tallies and the active step (with the
 * same fallback rule as the composite) from `data`, and stays stateless:
 * the parent owns `data.activeStepId`.
 */
export const WorkflowTrackerRail: React.FC<WorkflowTrackerRailProps> = ({
  data = sampleWorkflow,
  loading = false,
  loadingRows = 6,
  showLegend = true,
  emptyState,
  labels: labelOverrides,
  cardClassName,
  cardScrollable,
  onStepSelect,
  onSubStepSelect,
  onStepAction,
  className,
  style,
  ...styleProps
}) => {
  const steps = data?.steps ?? [];
  const { palette, surfaces } = useWorkflowChrome(styleProps);
  const labels = useMemo(() => resolveLabels(labelOverrides), [labelOverrides]);
  const cardProps = buildCardProps(styleProps);

  const active = useMemo(
    () => resolveActiveStep(steps, data?.activeStepId),
    [steps, data?.activeStepId],
  );
  const progress = useMemo(() => computeProgress(steps), [steps]);
  const tallies = useMemo(() => computeTallies(steps), [steps]);

  return (
    <Panel
      {...cardProps}
      scrollable={cardScrollable ?? false}
      className={classNames(className, cardClassName)}
      style={style}
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
        onStepAction={onStepAction}
      />
    </Panel>
  );
};

export default WorkflowTrackerRail;
