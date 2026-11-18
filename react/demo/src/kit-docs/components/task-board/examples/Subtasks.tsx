import { useState } from "react";
import { Button, TaskBoard, type TaskBoardCard, type TaskBoardColumn } from "@cjlapao/ui-kit";

/**
 * `subtasks` ride on the card and read as a DotStepper row: one dot per
 * sub task (done · active · pending · error), a `done/total` fraction, and
 * `subtaskMaxVisible` dots max — the rest stack behind a tooltip. A plain
 * `done: true/false` list is enough: the first unchecked sub task becomes
 * the active dot. Explicit `status` wins when you track real states.
 */
const COLUMNS: TaskBoardColumn[] = [
  { id: "todo", title: "To do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];

const CARDS: TaskBoardCard[] = [
  {
    id: "s1",
    column: "doing",
    title: "Payments v2 rollout",
    subtasks: [
      { id: "s1a", title: "Schema migration", done: true },
      { id: "s1b", title: "Dual-write shim", done: true },
      { id: "s1c", title: "Read-path switch" },
      { id: "s1d", title: "Backfill job" },
      { id: "s1e", title: "Kill the legacy table" },
      { id: "s1f", title: "Update runbook" },
      { id: "s1g", title: "Vendor webhooks" },
      { id: "s1h", title: "Load test at 3× peak" },
    ],
  },
  {
    id: "s2",
    column: "doing",
    title: "Import speed audit",
    subtasks: [
      { id: "s2a", title: "Profile the parser", status: "completed" },
      { id: "s2b", title: "Chunked inserts", status: "error" },
      { id: "s2c", title: "Parallel workers" },
      { id: "s2d", title: "Re-bench the suite" },
    ],
  },
  {
    id: "s3",
    column: "todo",
    title: "Weekly digest email",
    subtasks: [
      { id: "s3a", title: "Draft the template", done: true },
      { id: "s3b", title: "Quiet-hours logic" },
      { id: "s3c", title: "Unsubscribe copy" },
    ],
  },
  {
    id: "s4",
    column: "done",
    title: "Retire the beta flag",
    subtasks: [
      { id: "s4a", title: "Flip the default", done: true },
      { id: "s4b", title: "Drop the flag reads", done: true },
      { id: "s4c", title: "Announce", done: true },
      { id: "s4d", title: "Purge old code", done: true },
    ],
  },
];

export default function Subtasks() {
  const [cards, setCards] = useState(CARDS);
  const [maxVisible, setMaxVisible] = useState(3);
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-1.5" role="group" aria-label="Dots per card">
        {[2, 3, 4, 6].map((n) => (
          <Button
            key={n}
            size="xs"
            variant={maxVisible === n ? "solid" : "outline"}
            onClick={() => setMaxVisible(n)}
            aria-pressed={maxVisible === n}
          >
            {n} dots
          </Button>
        ))}
        <span className="text-xs text-neutral-500 dark:text-neutral-400">— the rest stack into a tooltip.</span>
      </div>
      <TaskBoard cards={cards} columns={COLUMNS} onCardsChange={setCards} subtaskMaxVisible={maxVisible} size="sm" height={380} />
    </div>
  );
}
