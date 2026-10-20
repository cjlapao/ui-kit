import React from "react";
import classNames from "classnames";

import Button from "../Button";
import type { WorkflowAction } from "./types";
import type { WorkflowPalette } from "./statusTokens";

export interface WorkflowQuickActionsProps {
  /** Owner of the actions; forwarded with every click. */
  stepId: string;
  actions: WorkflowAction[];
  palette: WorkflowPalette;
  /** Accessible name of the group, from `labels.quickActions`. */
  groupLabel: string;
  /** Without it the tracker stays read-only: nothing renders. */
  onAction?: (stepId: string, actionId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The one place quick actions are rendered, so the rail and the step detail
 * card can never drift: uniform quiet pills — kit `Button size="xs"
 * variant="soft"`, tinted per action (defaulting to the accent). No new
 * button styling here; every visual decision belongs to `Button` and the
 * palette.
 */
export const WorkflowQuickActions: React.FC<WorkflowQuickActionsProps> = ({
  stepId,
  actions,
  palette,
  groupLabel,
  onAction,
  className,
  style,
}) => {
  if (!onAction || actions.length === 0) return null;

  return (
    <div
      role="group"
      aria-label={groupLabel}
      className={classNames("flex flex-wrap gap-1.5", className)}
      style={style}
    >
      {actions.map((action) => (
        <Button
          key={action.id}
          size="xs"
          weight="medium"
          variant={action.variant ?? "soft"}
          color={action.tone ?? palette.accent}
          leadingIcon={action.leadingIcon}
          disabled={action.disabled}
          onClick={() => onAction(stepId, action.id)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default WorkflowQuickActions;
