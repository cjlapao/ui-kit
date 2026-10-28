import { useState } from "react";
import { WorkflowTrackerRail, type WorkflowData } from "@cjlapao/ui-kit";
import { ToggleRow } from "../../../shared/PlaygroundPanel";

export default function LockedStages() {
  const [locked, setLocked] = useState(true);
  const [activeStepId, setActiveStepId] = useState("build");
  const data: WorkflowData = {
    title: "Release pipeline", activeStepId,
    steps: [
      { id: "prepare", label: "Prepare", status: "done" },
      { id: "build", label: "Build", status: "running" },
      { id: "review", label: "Review", status: "not_started", meta: "Waiting for the build" },
      { id: "deploy", label: "Deploy", status: "not_started" },
      { id: "archive", label: "Archive", status: "done", disabled: true, meta: "Explicitly disabled by the app" },
    ],
  };
  return <div className="w-full max-w-sm space-y-4">
    <ToggleRow label="Disable future stages" checked={locked} onChange={setLocked} />
    <WorkflowTrackerRail data={data} collapsible disableFutureSteps={locked} onStepSelect={setActiveStepId}
      renderStepPopover={step => <span>{step.label}</span>} />
    <p className="text-xs text-neutral-600 dark:text-neutral-400">Try both expanded and collapsed views. Running and completed stages stay selectable; Archive is always disabled.</p>
  </div>;
}
