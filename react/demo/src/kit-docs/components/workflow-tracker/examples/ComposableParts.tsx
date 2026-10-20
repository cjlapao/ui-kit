import { useState } from "react";
import {
  sampleWorkflow,
  WorkflowTrackerDetails,
  WorkflowTrackerRail,
  WorkflowTrackerRollups,
  WorkflowTrackerStepDetails,
} from "@cjlapao/ui-kit";
import type { WorkflowData } from "@cjlapao/ui-kit";

/**
 * The composite is a layout of the same four parts exported individually:
 * the rail, the step details, the scrollable details body and the roll-up
 * grid. They are stateless — one `activeStepId` in the parent's state
 * drives all of them, so they can be drawn wherever the page wants them.
 */
export default function ComposableParts() {
  const [activeStepId, setActiveStepId] = useState<string | undefined>(
    "insurance_certificates",
  );
  const [lastAction, setLastAction] = useState<string | null>(null);

  const data: WorkflowData = { ...sampleWorkflow, activeStepId };

  return (
    <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-start">
      {/* The rail, as a compact sidebar card. */}
      <div className="w-full xl:w-80 xl:shrink-0">
        <WorkflowTrackerRail
          data={data}
          showLegend={false}
          onStepSelect={setActiveStepId}
          onStepAction={(stepId, actionId) =>
            setLastAction(`"${actionId}" on step "${stepId}"`)
          }
        />
      </div>

      {/* Step details and the details body, stacked wherever they fit. */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <WorkflowTrackerStepDetails
          data={data}
          onStepAction={(stepId, actionId) =>
            setLastAction(`"${actionId}" on step "${stepId}"`)
          }
        />
        <WorkflowTrackerDetails data={data} />
        <WorkflowTrackerRollups data={data} />
        {lastAction && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {lastAction}
          </p>
        )}
      </div>
    </div>
  );
}
