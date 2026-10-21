import React from "react";
import { CondensedStepper, type StepperStep } from "@cjlapao/ui-kit";

const strip = (
  done: number,
  total: number,
  active: string,
  opts: { error?: boolean; futureLabel?: string } = {},
): StepperStep[] => [
  ...Array.from({ length: done }, (_, i) => ({
    id: `d${i}`,
    title: `Step ${i + 1}`,
    status: "completed" as const,
  })),
  { id: "act", title: active, status: opts.error ? ("error" as const) : undefined },
  ...Array.from({ length: Math.max(0, total - done - 1) }, (_, i) => ({
    id: `p${i}`,
    title: `Next ${i + 1}`,
  })),
];

/**
 * The card row from the mocks: the same strip at card size, three states of
 * the same component — idle-ready, gate-halted (the rose ring is the error
 * status, not a bespoke border), and a longer queue folded into `+N`.
 */
const RunCards: React.FC = () => (
  <div className="grid gap-4 sm:grid-cols-3">
    {(
      [
        {
          name: "Test QA",
          meta: "saved project",
          steps: strip(1, 4, "Verify Tests"),
          actionLabel: undefined,
          pastSummary: undefined,
          foot: "idle · ready",
        },
        {
          name: "aeon-qa-workspace",
          meta: "recorded workspace",
          steps: strip(8, 11, "Approve Gate", { error: true }),
          actionLabel: "Action Required",
          pastSummary: "8 passed · 1m",
          foot: "1 loop · 1 blocked",
        },
        {
          name: "new_agents",
          meta: "recorded workspace",
          steps: strip(3, 9, "Process Batch"),
          actionLabel: undefined,
          pastSummary: undefined,
          foot: "2 loops · daemon linked",
        },
      ] as const
    ).map((card) => (
      <div
        key={card.name}
        className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            {card.meta}
          </p>
          <p className="truncate text-sm font-bold">{card.name}</p>
        </div>
        <CondensedStepper
          steps={card.steps}
          size="sm"
          variant="card"
          actionLabel={card.actionLabel}
          pastSummary={card.pastSummary}
          maxSteps={3}
        />
        <p className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
          {card.foot}
        </p>
      </div>
    ))}
  </div>
);

export default RunCards;
