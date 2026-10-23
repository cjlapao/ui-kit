import { useState } from "react";
import { TaskBoard, type TaskBoardCard, type TaskBoardColumn, type TaskBoardMove } from "@cjlapao/ui-kit";

/**
 * Rules run in the engine before anything moves, so a refused slot never
 * lights up as a target:
 * - Ready only accepts cards from Backlog (`accepts`).
 * - Building has a WIP limit of 3 — full, it refuses newcomers.
 * - Shipped is `locked`: nothing goes in, nothing comes out.
 * - Review is guarded by `onBeforeMove`: an 800 ms "approval" that refuses
 *   any card with nobody assigned. The card waits in its new slot, then
 *   either stays or goes back on its own — no rollback code.
 */
const COLUMNS: TaskBoardColumn[] = [
  { id: "backlog", title: "Backlog", color: "slate" },
  { id: "ready", title: "Ready", color: "sky", accepts: ["backlog"] },
  { id: "building", title: "Building", color: "amber", wipLimit: 3 },
  { id: "review", title: "Review", color: "violet" },
  { id: "shipped", title: "Shipped", color: "emerald", locked: true },
];

const owner = { id: "lb", name: "Lena Brandt", color: "teal" as const };

const CARDS: TaskBoardCard[] = [
  { id: "a", column: "backlog", title: "Rate-limit public API", assignees: [owner] },
  { id: "b", column: "backlog", title: "Rotate signing keys" },
  { id: "c", column: "ready", title: "Billing webhooks retry", assignees: [owner] },
  { id: "d", column: "building", title: "Org-level SSO", assignees: [owner] },
  { id: "e", column: "building", title: "CSV export" },
  { id: "f", column: "building", title: "Audit log search", assignees: [owner] },
  { id: "g", column: "shipped", title: "Usage dashboard", assignees: [owner] },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Rules() {
  const [cards, setCards] = useState(CARDS);
  const [note, setNote] = useState("Drag a card — refused targets turn red.");

  const guard = async (move: TaskBoardMove) => {
    if (move.to.column !== "review") return true;
    const card = cards.find((c) => c.id === move.cardId);
    setNote(`Asking for approval to review "${card?.title}"…`);
    await wait(800);
    const ok = Boolean(card?.assignees?.length);
    setNote(ok ? "Approved." : `Refused: "${card?.title}" needs an owner before review.`);
    return ok;
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <TaskBoard
        cards={cards}
        columns={COLUMNS}
        onCardsChange={setCards}
        onBeforeMove={guard}
        size="sm"
        variant="outlined"
        height={420}
      />
      <p aria-live="polite" className="text-xs text-neutral-500 dark:text-neutral-400">
        {note}
      </p>
    </div>
  );
}
