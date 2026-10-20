import React from "react";
import classNames from "classnames";

import Panel from "../Panel";
import ScrollArea from "../ScrollArea";
import type { PanelProps } from "../Panel";

export interface WorkflowDetailsCardProps {
  /** Free-form content from `WorkflowStep.details`; the tracker only frames it. */
  details: React.ReactNode;
  /** Accessible name of the scrollable region. */
  ariaLabel: string;
  /** Shared card treatment, identical to the sibling cards. */
  cardProps: PanelProps;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Second card in the right column: whatever the caller attached to the active
 * step as `details`, framed like its siblings and wrapped in a `ScrollArea`.
 *
 * `flex-1` + `flexBody` make it absorb the leftover height of the column in
 * `fillHeight` mode — the height chain resolves because `Panel`'s section is
 * already `flex min-h-0` and `ScrollArea`'s viewport inherits the resolved
 * height (`overflow-hidden` on the frame zeroes its automatic minimum size,
 * so the card can shrink below its content). With the column at auto height
 * the percentage basis behaves as `auto`, the card simply sits at content
 * height and the scroll area stays inert.
 */
export const WorkflowDetailsCard: React.FC<WorkflowDetailsCardProps> = ({
  details,
  ariaLabel,
  cardProps,
  className,
  style,
}) => (
  <Panel
    {...cardProps}
    flexBody
    className={classNames("flex-1", className)}
    style={style}
  >
    <ScrollArea className="h-full" mask role="region" aria-label={ariaLabel}>
      {details}
    </ScrollArea>
  </Panel>
);

export default WorkflowDetailsCard;
