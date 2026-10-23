/**
 * TaskBoard fixtures — the two reference boards: a product roadmap (columns)
 * and a field-operations dispatch board (swimlanes). Every call returns fresh
 * arrays so demos can mutate their own copy.
 */

import type {
  TaskBoardCard,
  TaskBoardColumn,
  TaskBoardLane,
  TaskBoardPriority,
  TaskBoardUser,
} from "./types";

export interface TaskBoardSample {
  columns: TaskBoardColumn[];
  lanes?: TaskBoardLane[];
  cards: TaskBoardCard[];
  priorities: TaskBoardPriority[];
  users: TaskBoardUser[];
}

const ROADMAP_USERS: TaskBoardUser[] = [
  { id: "sw", name: "Sara Walsh", color: "indigo" },
  { id: "jc", name: "Jonah Cole", color: "teal" },
  { id: "mg", name: "Maya Grant", color: "indigo" },
  { id: "ak", name: "Arjun Kapoor", color: "violet" },
  { id: "lb", name: "Lena Brandt", color: "teal" },
  { id: "rp", name: "Rui Pereira", color: "orange" },
];

const FIELD_USERS: TaskBoardUser[] = [
  { id: "nk", name: "Nadia Khan", color: "rose" },
  { id: "ml", name: "Marco Lund", color: "orange" },
  { id: "ps", name: "Priya Shah", color: "violet" },
  { id: "ob", name: "Owen Baker", color: "blue" },
  { id: "er", name: "Elif Reyes", color: "amber" },
  { id: "vc", name: "Victor Chen", color: "amber" },
  { id: "mp", name: "Mia Park", color: "green" },
  { id: "sc", name: "Sofia Costa", color: "fuchsia" },
];

const u = (list: TaskBoardUser[], id: string) => list.find((x) => x.id === id)!;

function roadmap(): TaskBoardSample {
  const R = (id: string) => u(ROADMAP_USERS, id);
  const year = new Date().getFullYear();
  const d = (m: number, day: number) => new Date(year, m - 1, day).toISOString().slice(0, 10);
  return {
    priorities: [
      { id: "p1", label: "P1", color: "red" },
      { id: "p2", label: "P2", color: "orange" },
      { id: "p3", label: "P3", color: "blue" },
      { id: "p4", label: "P4", color: "slate" },
    ],
    users: ROADMAP_USERS.map((x) => ({ ...x })),
    columns: [
      { id: "ideas", title: "Ideas", color: "blue" },
      { id: "discovery", title: "Discovery", color: "blue" },
      { id: "ready", title: "Ready", color: "blue" },
      { id: "building", title: "Building", color: "amber", wipLimit: 5 },
      { id: "blocked", title: "Blocked", color: "red" },
    ],
    cards: [
      { id: "r1", column: "ideas", title: "Persona-based onboarding paths", tags: ["activation", "research"], priority: "p2", description: "Branch the first-run flow by role.", assignees: [R("sw")] },
      { id: "r2", column: "ideas", title: "Usage-based pricing meters", tags: ["billing", "platform"], priority: "p1", checklist: { done: 2, total: 5 }, due: d(11, 6), assignees: [R("jc")] },
      { id: "r3", column: "ideas", title: "Enterprise SSO buying signal", tags: ["enterprise", "research"], priority: "p3", description: "Track SSO page visits per account." },
      { id: "r4", column: "ideas", title: "AI summary opt-in", tags: ["research", "platform"], priority: "p4", description: "Workspace-level toggle." },
      { id: "r5", column: "discovery", title: "Mobile trial activation", tags: [{ label: "mobile", color: "fuchsia" }, "activation"], priority: "p2", checklist: { done: 1, total: 3 }, due: d(10, 30), assignees: [R("mg")] },
      { id: "r6", column: "discovery", title: "Account health score", tags: ["analytics", "growth"], priority: "p3", description: "Blend usage, seats and tickets.", assignees: [R("ak")] },
      { id: "r7", column: "discovery", title: "Partner API discovery", tags: ["platform"], priority: "p4" },
      { id: "r8", column: "ready", title: "Customer import wizard", tags: ["activation", "platform"], priority: "p3", assignees: [R("lb")] },
      { id: "r9", column: "ready", title: "Self-serve plan downgrade", tags: ["billing", "trust"], priority: "p2", description: "Keep data, drop seats.", due: d(10, 28), assignees: [R("rp")] },
      { id: "r10", column: "ready", title: "Warehouse sync beta", tags: ["analytics", "enterprise"], priority: "p1", due: d(11, 2), assignees: [R("jc")] },
      { id: "r11", column: "building", title: "Checkout recovery campaign", tags: ["checkout", "growth"], priority: "p1", checklist: { done: 3, total: 5 }, due: d(10, 26), assignees: [R("sw")] },
      { id: "r12", column: "building", title: "Admin audit log", tags: ["enterprise", "trust"], priority: "p2", checklist: { done: 1, total: 3 }, description: "Every admin action, exportable.", assignees: [R("lb")] },
      { id: "r13", column: "building", title: "Saved dashboard templates", tags: ["analytics", "platform"], priority: "p3", assignees: [R("jc")] },
      { id: "r14", column: "building", title: "Expansion signal pipeline", tags: ["analytics", "growth"], priority: "p3", due: d(10, 29), assignees: [R("ak")] },
      { id: "r15", column: "blocked", title: "App store review fixes", tags: ["checkout", "mobile"], priority: "p2", assignees: [R("mg")] },
      { id: "r16", column: "blocked", title: "Data residency (EU)", tags: ["enterprise"], priority: "p3", description: "Waiting on legal sign-off." },
    ],
  };
}

function fieldOps(): TaskBoardSample {
  const F = (id: string) => u(FIELD_USERS, id);
  return {
    priorities: [
      { id: "critical", label: "Critical", color: "red" },
      { id: "high", label: "High", color: "orange" },
      { id: "medium", label: "Medium", color: "blue" },
      { id: "low", label: "Low", color: "slate" },
    ],
    users: FIELD_USERS.map((x) => ({ ...x })),
    columns: [
      { id: "intake", title: "Intake" },
      { id: "scheduled", title: "Scheduled" },
      { id: "onsite", title: "On site" },
      { id: "review", title: "Review" },
      { id: "closed", title: "Closed" },
    ],
    lanes: [
      { id: "north", title: "North Region" },
      { id: "downtown", title: "Downtown Retail" },
      { id: "airport", title: "Airport Terminal" },
      { id: "harbor", title: "Harbor Logistics" },
    ],
    cards: [
      { id: "f1", lane: "north", column: "intake", title: "Quote backup generator service", priority: "medium", points: 2, tags: ["quote"], assignees: [F("ps")] },
      { id: "f2", lane: "north", column: "scheduled", title: "Replace freezer controller", priority: "high", points: 2, tags: ["cold-chain"], assignees: [F("nk")] },
      { id: "f3", lane: "north", column: "onsite", title: "Investigate gate sensor loop", priority: "critical", points: 3, tags: ["access"], assignees: [F("ml")] },
      { id: "f4", lane: "north", column: "onsite", title: "Refit loading dock camera", priority: "high", points: 5, tags: ["security"], assignees: [F("nk")] },
      { id: "f5", lane: "north", column: "review", title: "Verify night crew handoff", priority: "medium", points: 1, tags: ["handoff"], assignees: [F("sc")] },
      { id: "f6", lane: "north", column: "closed", title: "Close HVAC inspection", priority: "low", points: 1, tags: ["hvac"], assignees: [F("ob")] },
      { id: "f7", lane: "downtown", column: "intake", title: "Book signage replacement", priority: "high", points: 2, tags: ["retail"], assignees: [F("er")] },
      { id: "f8", lane: "downtown", column: "intake", title: "Repair stockroom door strike", priority: "high", points: 2, tags: ["access"], assignees: [F("vc")] },
      { id: "f9", lane: "downtown", column: "scheduled", title: "Stage weekend cleaning crew", priority: "medium", points: 1, tags: ["crew"], assignees: [F("vc")] },
      { id: "f10", lane: "downtown", column: "onsite", title: "Escalator brake fault", priority: "critical", points: 3, tags: ["safety"], assignees: [F("ob")] },
      { id: "f11", lane: "downtown", column: "review", title: "Approve storefront glass work", priority: "critical", points: 2, tags: ["vendor"], assignees: [F("ob")] },
      { id: "f12", lane: "downtown", column: "closed", title: "Close retrofit lighting", priority: "medium", points: 2, tags: ["lighting"], assignees: [F("er")] },
      { id: "f13", lane: "airport", column: "intake", title: "Triage baggage belt alarm", priority: "critical", points: 5, tags: ["baggage"], assignees: [F("mp")] },
      { id: "f14", lane: "airport", column: "onsite", title: "Repair kiosk printer cluster", priority: "high", points: 2, tags: ["kiosk"], assignees: [F("mp")] },
      { id: "f15", lane: "airport", column: "closed", title: "Close alarm panel audit", priority: "high", points: 1, tags: ["alarm"], assignees: [F("ps")] },
      { id: "f16", lane: "harbor", column: "scheduled", title: "Calibrate crane load cells", priority: "high", points: 3, tags: ["crane"], assignees: [F("ml")] },
      { id: "f17", lane: "harbor", column: "review", title: "Sign off reefer plug repair", priority: "medium", points: 2, tags: ["cold-chain"], assignees: [F("nk")] },
    ],
  };
}

export const sampleTaskBoard = { roadmap, fieldOps };
