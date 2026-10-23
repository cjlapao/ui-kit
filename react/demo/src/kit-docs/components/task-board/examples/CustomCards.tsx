import { useState } from "react";
import { TaskBoard, sampleTaskBoard, type TaskBoardCard } from "@cjlapao/ui-kit";

/**
 * `renderCard` replaces a card's body; the shell around it — drag, focus,
 * selection, the teammate ring — stays the board's. The second argument
 * says what state the card is in, so the body can react to it.
 */
const sample = sampleTaskBoard.roadmap();

function ProgressCard({ card, dragging }: { card: TaskBoardCard; dragging: boolean }) {
  const done = card.checklist ? card.checklist.done / card.checklist.total : 0;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{card.title}</span>
        {dragging && <span className="text-[10px] uppercase tracking-wide text-sky-600">moving</span>}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div className="h-full rounded-full bg-sky-500" style={{ width: `${Math.round(done * 100)}%` }} />
      </div>
      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
        {card.checklist ? `${card.checklist.done} of ${card.checklist.total} tasks` : "No checklist"}
      </span>
    </div>
  );
}

export default function CustomCards() {
  const [cards, setCards] = useState(sample.cards.filter((c) => c.column !== "blocked"));
  return (
    <div className="w-full">
      <TaskBoard
        cards={cards}
        columns={sample.columns.filter((c) => c.id !== "blocked")}
        onCardsChange={setCards}
        renderCard={(card, state) => <ProgressCard card={card} dragging={state.dragging} />}
        color="sky"
        size="sm"
        height={460}
      />
    </div>
  );
}
