import { useState } from "react";
import { TaskBoard, type TaskBoardCard, type TaskBoardColumn } from "@cjlapao/ui-kit";

/**
 * `tone` is per card — here it marks the kind of work, so a bug reads as a
 * bug from across the room. `columnCorner` rounds the column wells on the
 * container scale; `corner` rounds the board itself.
 */
const COLUMNS: TaskBoardColumn[] = [
  { id: "todo", title: "To do", color: "slate" },
  { id: "doing", title: "Doing", color: "sky" },
  { id: "done", title: "Done", color: "emerald" },
];

const CARDS: TaskBoardCard[] = [
  { id: "1", column: "todo", title: "Crash on empty workspace", tone: "rose", tags: ["bug"] },
  { id: "2", column: "todo", title: "Bulk archive", tone: "sky", tags: ["feature"] },
  { id: "3", column: "todo", title: "Rename 'Spaces' to 'Teams'", tone: "amber", tags: ["copy"] },
  { id: "4", column: "doing", title: "Timezone drift in reports", tone: "rose", tags: ["bug"] },
  { id: "5", column: "doing", title: "Saved filters", tone: "sky", tags: ["feature"] },
  { id: "6", column: "done", title: "Upgrade the date library", tone: "violet", tags: ["chore"] },
  { id: "7", column: "done", title: "Keyboard shortcuts sheet", tone: "sky", tags: ["feature"] },
];

export default function CardTones() {
  const [cards, setCards] = useState(CARDS);
  return (
    <div className="w-full">
      <TaskBoard
        cards={cards}
        columns={COLUMNS}
        onCardsChange={setCards}
        size="sm"
        corner="rounded-md"
        columnCorner="rounded-sm"
        height={360}
      />
    </div>
  );
}
