import { useState } from "react";
import { Gantt, type GanttLink, type GanttTask } from "@cjlapao/ui-kit";

const INITIAL_TASKS: GanttTask[] = [
  { id: "brief", name: "Brief", start: "2026-08-03", end: "2026-08-07", progress: 1, color: "violet" },
  { id: "security", name: "Security review", start: "2026-08-17", end: "2026-08-21", progress: 0.4, color: "amber" },
  { id: "prototype", name: "Prototype", start: "2026-08-08", end: "2026-08-11", progress: 0.8, color: "cyan" },
  { id: "release", name: "Release", start: "2026-08-22", end: "2026-08-26", progress: 0, color: "emerald" },
  { id: "copy", name: "Copy review", start: "2026-08-05", end: "2026-08-09", progress: 0.7, color: "rose" },
  { id: "legal", name: "Legal approval", start: "2026-08-18", end: "2026-08-23", progress: 0.2, color: "slate" },
  { id: "qa", name: "QA pass", start: "2026-08-12", end: "2026-08-16", progress: 0.3, color: "blue" },
  { id: "launch", name: "Launch gate", start: "2026-08-27", end: "2026-08-27", type: "milestone", color: "emerald" },
];

const INITIAL_LINKS: GanttLink[] = [
  { id: "brief-release", source: "brief", target: "release", type: "fs", color: "violet" },
  { id: "security-prototype", source: "security", target: "prototype", type: "fs", color: "amber" },
  { id: "copy-legal", source: "copy", target: "legal", type: "fs", color: "rose" },
  { id: "prototype-legal", source: "prototype", target: "legal", type: "fs", color: "cyan" },
  { id: "qa-release", source: "qa", target: "release", type: "fs", color: "blue" },
  { id: "legal-launch", source: "legal", target: "launch", type: "fs", color: "slate" },
  { id: "release-launch", source: "release", target: "launch", type: "fs", color: "emerald" },
];

export default function DenseRoutingExample() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [links, setLinks] = useState(INITIAL_LINKS);

  return (
    <div className="w-full">
      <Gantt
        tasks={tasks}
        links={links}
        color="blue"
        snap="day"
        height={430}
        resizableColumns
        onTasksChange={setTasks}
        onLinksChange={setLinks}
      />
    </div>
  );
}
