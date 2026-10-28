import { useState } from "react";
import { Button, CustomIcon, StackCarousel } from "@cjlapao/ui-kit";

export const TASKS = [
  { id: "review", title: "Review the workspace", description: "Three files are ready for your review. Open the diff before approving the next step.", icon: "Folder" },
  { id: "build", title: "Build completed", description: "The production build passed and the preview is ready.", icon: "Verified" },
  { id: "survey", title: "Survey findings", description: "The team found two opportunities to simplify onboarding.", extra: "Keep the project context visible while you compare the suggestions. This card is taller to demonstrate how the stack adjusts to its active content.", icon: "Search" },
  { id: "release", title: "Prepare the release", description: "Check the release notes and choose a deployment window.", icon: "Rocket" },
  { id: "archive", title: "Archive completed work", description: "Everything is saved. Your workspace is ready for the next project.", icon: "Library" },
];

export function TaskContent({ task }: { task: typeof TASKS[number] }) {
  const [viewed, setViewed] = useState(false);
  return <div className="flex items-start gap-3">
    <CustomIcon icon={task.icon} tone="blue" size="sm" className="mt-0.5" />
    <div className="min-w-0 flex-1 space-y-3">
      <h3 className="text-sm font-semibold">{task.title}</h3>
      <p className="text-sm leading-6 opacity-80">{task.description}</p>
      {task.extra && <p className="text-sm leading-6 opacity-80">{task.extra}</p>}
      <Button size="xs" variant="outline" onClick={() => setViewed(value => !value)}>{viewed ? "Details reviewed" : "Review details"}</Button>
    </div>
  </div>;
}

export default function Tasks() {
  const [activeIndex, setActiveIndex] = useState(0);
  return <div className="w-full max-w-lg py-3">
    <StackCarousel items={TASKS} getItemKey={task => task.id} getItemLabel={task => task.title}
      activeIndex={activeIndex} onActiveIndexChange={setActiveIndex}
      renderItem={task => <TaskContent task={task} />} />
  </div>;
}
