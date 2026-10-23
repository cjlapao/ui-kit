import { useState } from "react";
import { Button, Globe, Pill, TaskBoard, sampleTaskBoard } from "@cjlapao/ui-kit";

/**
 * The swimlane view: columns crossed with regions. Cards cross lanes freely,
 * each lane collapses on its own, and the compact card preset fits a dense
 * dispatch board. "New job" and the per-cell + both go through `onAddCard`.
 */
const sample = sampleTaskBoard.fieldOps();

export default function FieldOperations() {
  const [cards, setCards] = useState(sample.cards);
  const [lanes, setLanes] = useState(sample.lanes!);

  const addJob = (column = "intake", lane: string | null = lanes[0].id) =>
    setCards((cs) => [
      ...cs,
      { id: `job-${cs.length + 1}`, title: "New service job", column, lane: lane ?? undefined, priority: "medium", points: 1 },
    ]);

  const active = cards.filter((c) => c.column === "onsite" || c.column === "scheduled").length;
  const critical = cards.filter((c) => c.priority === "critical").length;

  return (
    <div className="w-full">
      <TaskBoard
        layout="lanes"
        cardLayout="compact"
        size="sm"
        color="emerald"
        cards={cards}
        columns={sample.columns}
        lanes={lanes}
        priorities={sample.priorities}
        onCardsChange={setCards}
        onLanesChange={setLanes}
        onAddCard={({ column, lane }) => addJob(column, lane)}
        icon={<Globe className="h-5 w-5" />}
        title="FieldOps Dispatch"
        subtitle="Regional service lanes · Today"
        summary={
          <>
            <Pill size="sm" variant="soft" tone="slate">{lanes.length} regions</Pill>
            <Pill size="sm" variant="soft" tone="sky">{active} active jobs</Pill>
            <Pill size="sm" variant="soft" tone="rose">{critical} priority</Pill>
          </>
        }
        actions={
          <Button size="sm" color="emerald" leadingIcon="Add" onClick={() => addJob()}>
            New job
          </Button>
        }
        height={560}
      />
    </div>
  );
}
