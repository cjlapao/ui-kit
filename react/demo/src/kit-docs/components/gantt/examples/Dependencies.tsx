import { Gantt, type GanttLink, type GanttTask } from "@cjlapao/ui-kit";

/**
 * All four dependency types on one chart. Every connector reads "source's
 * right → target's left" (left port = parents/predecessors, right port =
 * children/successors); the type is shown by the line style (`ff` and `sf`
 * render dashed) and the tooltip. An optional `color` overrides the accent for
 * a single edge.
 */
const TASKS: GanttTask[] = [
  { id: "a", name: "Kickoff", start: "2026-08-03", end: "2026-08-07", color: "violet", progress: 1 },
  { id: "b", name: "Prototype", start: "2026-08-07", end: "2026-08-14", color: "blue", progress: 0.6 },
  { id: "c", name: "Review", start: "2026-08-14", end: "2026-08-21", color: "blue", progress: 0 },
  { id: "d", name: "Handoff", start: "2026-08-21", end: "2026-08-28", color: "emerald", progress: 0 },
];

const LINKS: GanttLink[] = [
  { id: "fs", source: "a", target: "b", type: "fs" },
  { id: "ff", source: "b", target: "c", type: "ff" },
  { id: "ss", source: "c", target: "d", type: "ss", color: "amber" },
  { id: "sf", source: "a", target: "c", type: "sf", color: "rose" },
];

export default function DependenciesExample() {
  return (
    <div className="w-full">
      <Gantt tasks={TASKS} links={LINKS} color="slate" snap="day" height={300} />
    </div>
  );
}
