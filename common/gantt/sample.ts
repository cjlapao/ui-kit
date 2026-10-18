/**
 * Gantt sample project — a small product release with three swimlanes,
 * hierarchy, milestones, dependencies and mixed colours. Dates are anchored
 * to "today" so the demo always shows a live-looking plan around the
 * today-marker.
 */

import type { GanttLane, GanttLink, GanttTask } from "./types";
import { addDays, msToIso, startOfDay } from "./time";

export const sampleGanttLanes: GanttLane[] = [
  { id: "design", label: "Design", color: "violet", description: "UX & visual" },
  { id: "eng", label: "Engineering", color: "blue", description: "Build & QA" },
  { id: "launch", label: "Launch", color: "emerald", description: "Ship it" },
];

export function sampleGanttTasks(now: Date = new Date()): GanttTask[] {
  const d = (offset: number) => msToIso(addDays(startOfDay(now.getTime()), offset));

  return [
    // ── Design lane ───────────────────────────────────────────────
    {
      id: "research",
      name: "User research",
      lane: "design",
      start: d(-12),
      end: d(-7),
      progress: 1,
      color: "violet",
      owner: "Mira",
    },
    {
      id: "wireframes",
      name: "Wireframes",
      lane: "design",
      start: d(-9),
      end: d(-3),
      progress: 1,
      color: "violet",
      owner: "Mira",
    },
    {
      id: "visual",
      name: "Visual design",
      lane: "design",
      start: d(-5),
      end: d(3),
      progress: 0.65,
      color: "purple",
      owner: "Jonas",
    },
    {
      id: "visual-tokens",
      name: "Design tokens",
      lane: "design",
      parent: "visual",
      start: d(-4),
      end: d(-1),
      progress: 1,
      color: "purple",
      owner: "Jonas",
    },
    {
      id: "visual-flow",
      name: "Flow mockups",
      lane: "design",
      parent: "visual",
      start: d(-2),
      end: d(2),
      progress: 0.5,
      color: "purple",
      owner: "Jonas",
    },

    // ── Engineering lane ──────────────────────────────────────────
    {
      id: "api",
      name: "API contracts",
      lane: "eng",
      start: d(-4),
      end: d(1),
      progress: 1,
      color: "blue",
      owner: "Aiko",
    },
    {
      id: "webapp",
      name: "Web app",
      lane: "eng",
      start: d(0),
      end: d(12),
      progress: 0.3,
      color: "blue",
      owner: "Aiko",
    },
    {
      id: "webapp-shell",
      name: "App shell",
      lane: "eng",
      parent: "webapp",
      start: d(0),
      end: d(4),
      progress: 0.9,
      color: "sky",
      owner: "Aiko",
    },
    {
      id: "webapp-screens",
      name: "Screens",
      lane: "eng",
      parent: "webapp",
      start: d(3),
      end: d(9),
      progress: 0.2,
      color: "sky",
      owner: "Petra",
    },
    {
      id: "webapp-polish",
      name: "Polish & a11y",
      lane: "eng",
      parent: "webapp",
      start: d(8),
      end: d(12),
      progress: 0,
      color: "sky",
      owner: "Petra",
    },
    {
      id: "qa",
      name: "QA pass",
      lane: "eng",
      start: d(10),
      end: d(14),
      progress: 0,
      color: "cyan",
      owner: "Sam",
    },

    // ── Launch lane ───────────────────────────────────────────────
    {
      id: "docs",
      name: "Docs & changelog",
      lane: "launch",
      start: d(6),
      end: d(11),
      progress: 0,
      color: "emerald",
      owner: "Mira",
    },
    {
      id: "beta",
      name: "Beta",
      lane: "launch",
      start: d(12),
      end: d(15),
      progress: 0,
      color: "teal",
      owner: "Sam",
    },
    {
      id: "ship",
      name: "GA release",
      lane: "launch",
      type: "milestone",
      start: d(16),
      end: d(16),
      color: "emerald",
      owner: "All",
    },
  ];
}

export function sampleGanttLinks(): GanttLink[] {
  return [
    { id: "l1", source: "research", target: "wireframes", type: "fs" },
    { id: "l2", source: "wireframes", target: "visual", type: "fs" },
    { id: "l3", source: "api", target: "webapp", type: "fs" },
    { id: "l4", source: "visual", target: "webapp", type: "ff", color: "violet" },
    { id: "l5", source: "webapp", target: "qa", type: "fs" },
    { id: "l6", source: "qa", target: "beta", type: "fs" },
    { id: "l7", source: "docs", target: "beta", type: "ss", color: "emerald" },
    { id: "l8", source: "beta", target: "ship", type: "fs" },
  ];
}

export const sampleGantt = {
  lanes: sampleGanttLanes,
  tasks: sampleGanttTasks,
  links: sampleGanttLinks,
};
