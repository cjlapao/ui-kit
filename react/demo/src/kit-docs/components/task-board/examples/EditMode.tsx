import { useState } from "react";
import { Button, TaskBoard, sampleTaskBoard } from "@cjlapao/ui-kit";

/**
 * The app owns the switch — here a header button. In edit mode each column
 * header gets a grip (drag it, or Space / arrows / Space) and an "Add column"
 * slot follows the last column; both come back through `onColumnsChange`.
 */
const sample = sampleTaskBoard.roadmap();

export default function EditMode() {
  const [cards, setCards] = useState(sample.cards);
  const [columns, setColumns] = useState(sample.columns);
  const [editing, setEditing] = useState(false);
  return (
    <div className="w-full">
      <TaskBoard
        cards={cards}
        columns={columns}
        priorities={sample.priorities}
        onCardsChange={setCards}
        onColumnsChange={setColumns}
        editMode={editing}
        title="Horizon Roadmap"
        subtitle={editing ? "Editing the layout — drag a grip to reorder" : "Q3 launch command center"}
        actions={
          <Button size="sm" variant={editing ? "solid" : "soft"} onClick={() => setEditing((e) => !e)}>
            {editing ? "Done" : "Edit board"}
          </Button>
        }
        size="sm"
        height={460}
      />
    </div>
  );
}
