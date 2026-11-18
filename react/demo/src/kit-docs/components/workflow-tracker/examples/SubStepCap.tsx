import {
  WorkflowTrackerRail,
  type WorkflowData,
  type WorkflowSubStep,
} from "@cjlapao/ui-kit";

// The agent-run shape: one long build step whose tool calls pile up as
// sub-steps. Past the cap they fold away.
//
// Left: `scroll` + the default `reverse` order — the box opens on the
// newest tail (scrolled to the bottom), capped at the height of the first
// page; scrolling up reveals the past, page by page, without the rows
// under the viewport ever jumping.
//
// Right: `button` + `forward` order — the chronological reading: open on
// the oldest head, each `Show N more` click reveals one more page of the
// future, and `Show less` folds back.
const statuses: WorkflowSubStep["status"][] = [
  "done",
  "done",
  "done",
  "running",
  "failed",
];

const buildSteps = (count: number): WorkflowSubStep[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `call-${index + 1}`,
    label:
      index % 3 === 0
        ? `bash: npm test -- --filter pkg-${index + 1}`
        : index % 3 === 1
          ? `read: src/components/Widget${index + 1}.tsx`
          : `write: src/components/Widget${index + 1}.test.tsx`,
    status:
      index === count - 1
        ? "running"
        : statuses[index % statuses.length],
  }));

const data = (subSteps: WorkflowSubStep[]): WorkflowData => ({
  title: "Nightly build",
  activeStepId: "build",
  steps: [
    { id: "checkout", label: "Checkout", status: "done" },
    {
      id: "build",
      label: "build",
      status: "running",
      badge: "RUNNING",
      meta: "1 agent · 5m 50s · 26 calls",
      subSteps,
    },
    { id: "publish", label: "Publish", status: "not_started" },
  ],
});

export default function SubStepCap() {
  return (
    <div className="flex w-full flex-wrap gap-4">
      <WorkflowTrackerRail
        data={data(buildSteps(18))}
        maxVisibleSubSteps={4}
        subStepLoadMode="scroll"
        style={{ width: 340 }}
      />
      <WorkflowTrackerRail
        data={data(buildSteps(18))}
        maxVisibleSubSteps={4}
        subStepLoadMode="button"
        subStepOrder="forward"
        style={{ width: 340 }}
      />
    </div>
  );
}
