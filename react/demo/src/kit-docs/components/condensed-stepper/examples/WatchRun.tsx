import React, { useState } from "react";
import { CondensedStepper, type StepperStep } from "@cjlapao/ui-kit";

/**
 * The honest flanks and the conveyor, in motion: pin the left flank and
 * press ▶ — the quiet motif (three ticks, two dots) never moves, the
 * summary counts the truth, and the revealed six nearest the anchor
 * slide one notch: the newcomer springs in, the oldest drifts out.
 */
const STEPS: StepperStep[] = [
  { id: "setup", title: "Setup", status: "completed" },
  { id: "fetch", title: "Fetch issues", status: "completed" },
  { id: "plan", title: "Plan", status: "completed" },
  { id: "pr", title: "Create PR", status: "completed" },
  { id: "code", title: "Create code", status: "completed" },
  { id: "tests", title: "Unit tests", status: "completed" },
  { id: "lint", title: "Lint", status: "completed" },
  { id: "sec", title: "Secure code", status: "completed" },
  { id: "deps", title: "Scan deps", status: "completed" },
  { id: "gate", title: "Approve Gate", status: "error" },
  { id: "sign", title: "Sign Key" },
  { id: "deploy", title: "Deploy" },
];

const WatchRun: React.FC = () => {
  const [current, setCurrent] = useState(9);
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
        <button
          type="button"
          aria-label="Undo one step"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          className="cursor-pointer rounded-md border border-neutral-200 px-2 py-0.5 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          ◀
        </button>
        <span className="w-16 text-center tabular-nums">
          step {current + 1} / {STEPS.length}
        </span>
        <button
          type="button"
          aria-label="Complete one step"
          onClick={() => setCurrent((c) => Math.min(STEPS.length - 1, c + 1))}
          className="cursor-pointer rounded-md border border-neutral-200 px-2 py-0.5 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          ▶
        </button>
        <span className="ml-auto hidden sm:inline">
          pin the left flank, then press ▶ — the six walk
        </span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-dashed border-neutral-300 px-4 py-5 dark:border-neutral-700">
        <CondensedStepper
          steps={STEPS}
          currentIndex={current}
          actionLabel="Action Required"
        />
      </div>
    </div>
  );
};

export default WatchRun;
