import { useState } from "react";
import { MultiToggle, TaskBoard, sampleTaskBoard } from "@cjlapao/ui-kit";

/**
 * Loading shows a skeleton shaped like the board (columns of card blocks);
 * error swaps the columns for a message and a Retry; an empty board keeps its
 * columns — so "Add card" stays reachable — and says why it is empty.
 */
const sample = sampleTaskBoard.roadmap();
const STATES = [
  { label: "Ready", value: "ready" },
  { label: "Loading", value: "loading" },
  { label: "Empty", value: "empty" },
  { label: "Error", value: "error" },
];

export default function States() {
  const [state, setState] = useState("loading");
  return (
    <div className="flex w-full flex-col gap-3">
      <MultiToggle size="sm" options={STATES} value={state} onChange={setState} />
      <TaskBoard
        cards={state === "empty" ? [] : sample.cards}
        columns={sample.columns}
        priorities={sample.priorities}
        loading={state === "loading"}
        error={state === "error" ? "The board service did not answer." : undefined}
        onRetry={() => setState("loading")}
        onAddCard={() => setState("ready")}
        emptyState="Nothing planned yet — add the first initiative to any column."
        title="Horizon Roadmap"
        size="sm"
        height={400}
      />
    </div>
  );
}
