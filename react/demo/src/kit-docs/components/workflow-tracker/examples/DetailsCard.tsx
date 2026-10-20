import { useState } from "react";
import { WorkflowTracker } from "@cjlapao/ui-kit";
import type { WorkflowStep } from "@cjlapao/ui-kit";

/** Chips row shared by the details nodes. */
const Artifacts = ({ files }: { files: string[] }) => (
  <div>
    <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
      Artifacts and changes
    </p>
    <ul className="mt-2 flex flex-wrap gap-2">
      {files.map((file) => (
        <li
          key={file}
          className="rounded-full border border-emerald-200 px-2.5 py-0.5 text-xs text-emerald-700 dark:border-emerald-800 dark:text-emerald-300"
        >
          {file}
        </li>
      ))}
    </ul>
  </div>
);

const steps: WorkflowStep[] = [
  {
    id: "survey",
    label: "survey",
    status: "done",
    badge: "ok",
    meta: "Cost $0.001262 · Step time 13s",
    elapsed: "13s",
    description: "Model step · Outcome: ok · Produces: SURVEY.md",
    details: (
      <div className="space-y-4 px-5 py-4 sm:px-6">
        <div className="grid grid-cols-2 gap-x-10 gap-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Status
            </p>
            <p className="mt-1 text-sm text-neutral-800 dark:text-neutral-100">
              done · ok
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Cost
            </p>
            <p className="mt-1 text-sm tabular-nums text-neutral-800 dark:text-neutral-100">
              $0.001262
            </p>
          </div>
        </div>
        <Artifacts files={["SURVEY.md"]} />
      </div>
    ),
  },
  {
    id: "approve",
    label: "approve",
    status: "attention",
    badge: "Waiting",
    meta: "No model cost · queued 40m",
    elapsed: "40m",
    description: "Human gate · Outcome: pending",
    actions: [
      { id: "approve", label: "Approve", tone: "emerald" },
      { id: "decline", label: "Decline", tone: "rose" },
    ],
    details: (
      <p className="px-5 py-4 text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:px-6">
        The run owner is deciding on the digest. The gate carries no model
        cost and its wall time is measured by the runner, not the step.
        Approving releases the queued summarise step.
      </p>
    ),
  },
  {
    id: "summarise",
    label: "summarise",
    status: "not_started",
    meta: "Queued behind the gate",
    description: "Model step · Produces: SUMMARY.md",
    details: (
      <div className="space-y-4 px-5 py-4 sm:px-6">
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          Will stream the digest from SURVEY.md once the gate approves. The
          final artifact appears in the list below when the model finishes.
        </p>
        <Artifacts files={["SURVEY.md", "SUMMARY.md (queued)"]} />
      </div>
    ),
  },
];

export default function DetailsCard() {
  // The parent owns the active step; whichever one it picks shows its
  // `details` node in the scrollable card below the step card. The gate's
  // quick actions come from `actions` + `onStepAction` — supplied here,
  // so they render in the rail row and the step card header.
  const [activeStepId, setActiveStepId] = useState("approve");
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className="w-full">
      <WorkflowTracker
        data={{
          eyebrow: "MODEL RUN · REQ-8841",
          title: "Quarterly digest",
          live: true,
          activeStepId,
          steps,
        }}
        accentColor="emerald"
        onStepSelect={setActiveStepId}
        onStepAction={(stepId, actionId) =>
          setLastAction(`"${actionId}" on step "${stepId}"`)
        }
      />
      {lastAction && (
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {lastAction}
        </p>
      )}
    </div>
  );
}
