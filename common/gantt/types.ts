/**
 * Gantt — framework-agnostic data model.
 *
 * The shape mirrors the best-in-class libraries (dhtmlxGantt, Bryntum Gantt,
 * Syncfusion Gantt): a flat `tasks[]` with an optional `parent` id forming the
 * hierarchy, a `links[]` array for dependencies, and optional `lanes[]`
 * (swimlanes) that group rows. All dates travel as ISO-8601 strings; the
 * engine normalises them to epoch-ms internally.
 */

import type { TrueColor } from "../theme/Theme";
import type { GanttPt } from "./drag";
export type { TrueColor };

/** A date accepted anywhere the model takes one: ISO string or Date. */
export type GanttDate = string | Date | number;

/**
 * Task kinds.
 * - `task` — a regular duration bar.
 * - `project` — a group header task; its bar spans its children and its
 *   progress is the roll-up of its descendants.
 * - `milestone` — zero-duration, rendered as a diamond.
 */
export type GanttTaskType = "task" | "project" | "milestone";

/** Dependency types (standard project-management relations). */
export type GanttLinkType = "fs" | "ff" | "sf" | "ss";

export interface GanttTask {
  id: string;
  name: string;
  /** Task start (ISO date / datetime, or Date, or epoch ms). */
  start: GanttDate;
  /** Task end — exclusive-style is fine; a milestone may equal `start`. */
  end: GanttDate;
  /** Completion, 0..1. Omitted = 0. */
  progress?: number;
  /** Defaults to `task`. */
  type?: GanttTaskType;
  /** Parent task id for hierarchy. Omitted/null = top level. */
  parent?: string | null;
  /** Swimlane / group id — see `GanttLane`. Omitted = default lane. */
  lane?: string | null;
  /** Bar colour. Defaults to the Gantt's `color` prop. */
  color?: TrueColor;
  /** Row collapsed/expanded (children hidden). Defaults to expanded. */
  open?: boolean;
  /** Optional owner label (rendered in a column when provided). */
  owner?: string;
  /** Optional short badge text (rendered in a column when provided). */
  badge?: string;
  /** Badge tone. */
  badgeColor?: TrueColor;
  /** Extra cell values for user-defined columns (`columns[].key`). */
  values?: Record<string, string | number | boolean | null | undefined>;
  /** Disable drag/resize/link for this task. */
  locked?: boolean;
  /** Extra data carried through events untouched. */
  [key: string]: unknown;
}

export interface GanttLink {
  id?: string;
  /** Task id the dependency points from. */
  source: string;
  /** Task id the dependency points to. */
  target: string;
  /** Defaults to `fs` (finish-to-start). */
  type?: GanttLinkType;
  /** Arrow colour. Defaults to the Gantt's `color` prop. */
  color?: TrueColor;
  [key: string]: unknown;
}

/** A swimlane (lane / group band) the tasks can be assigned to via `task.lane`. */
export interface GanttLane {
  id: string;
  label: string;
  /** Lane band colour. Defaults to `neutral`. */
  color?: TrueColor;
  /** Optional second line under the label. */
  description?: string;
  /** Lane collapsed (rows hidden). Defaults to expanded. */
  open?: boolean;
}

/**
 * A left-panel table column. `key` resolves against
 * `task.name` / `task.owner` / `task.badge` / `task.values[key]`.
 */
export interface GanttColumn {
  key: string;
  title: string;
  /** Column header tone. Defaults to `neutral`. */
  tone?: TrueColor;
  /** CSS width, e.g. `"180px"`. Defaults to `"160px"`. */
  width?: string;
  /** Cell content alignment. */
  align?: "left" | "center" | "right";
  /**
   * Custom cell renderer key: `"text"` | `"progress"` | `"owner"` |
   * `"badge"`. Defaults to `"text"`.
   */
  kind?: "text" | "progress" | "owner" | "badge";
  /**
   * When false, this column cannot be resized even when `resizableColumns`
   * is set on the Gantt. Defaults to true.
   */
  resizable?: boolean;
}

/** Snap targets for drag operations. */
export type GanttSnap = "none" | "hour" | "day" | "week";

/**
 * Zoom, expressed as pixels per day. Presets (see `GANTT_ZOOM_PRESETS`):
 * `day` = 48, `week` = 16, `month` = 5, `quarter` = 1.6. Continuous values in
 * between are valid — the time scale re-derives its header levels for any.
 */
export type GanttZoom = number;

export interface GANTT_ZOOM_PRESET {
  label: string;
  /** px per day */
  value: number;
}

/** Discrete zoom presets for the toolbar. */
export const GANTT_ZOOM_PRESETS: GANTT_ZOOM_PRESET[] = [
  { label: "Day", value: 48 },
  { label: "Week", value: 16 },
  { label: "Month", value: 5 },
  { label: "Quarter", value: 1.6 },
];

/** Inclusive zoom bounds applied to wheel/button zoom. */
export const GANTT_MIN_ZOOM = 0.4;
export const GANTT_MAX_ZOOM = 96;

/** Time scale header column. */
export interface GanttTimeColumn {
  id: string;
  /** e.g. "Jan 2026", "Q1", "12", "W03" */
  label: string;
  /** e.g. "Jan", "2026", "Mon" — sub-label for two-line headers. */
  subLabel?: string;
  /** Epoch ms of column start (exclusive of anything before). */
  start: number;
  /** Epoch ms of column end (exclusive). */
  end: number;
  /** Rendered width in px. */
  width: number;
}

/** A resolved time scale level (one row of headers). */
export interface GanttTimeScaleLevel {
  /** Stable level id: "year" | "quarter" | "month" | "week" | "day" */
  id: string;
  columns: GanttTimeColumn[];
}

/** A flattened, renderable row in the row model. */
export interface GanttRow {
  key: string;
  /** Task rows reference the task; group rows reference their lane. */
  task?: GanttTask;
  lane?: GanttLane;
  isGroup: boolean;
  /** Hierarchy depth (0 = top level). */
  depth: number;
  /** Number of descendant rows (for group indentation spans). */
  childCount: number;
  /** Row height in px (groups can be shorter). */
  height: number;
  /** Top offset from the top of the row area (excl. header), px. */
  top: number;
  /** Cumulative roll-up progress for group/project rows (0..1). */
  progress?: number;
}

/** Geometry needed to draw dependency arrows. */
export interface GanttBarGeometry {
  taskId: string;
  /** Left offset of the bar within the timeline, px. */
  left: number;
  /** Bar width, px (0 for milestones — drawn at `left`). */
  width: number;
  /** Row top, px (relative to the row area). */
  top: number;
  /** Row height, px. */
  height: number;
  /** Milestones are diamonds centred on their date. */
  milestone: boolean;
}

/** A point in the link layer's coordinate space (origin = timeline origin). */
export interface GanttLinkPoint {
  x: number;
  y: number;
}

/** A resolved dependency arrow path in timeline pixel space. */
export interface GanttLinkPath {
  link: GanttLink;
  /** SVG path `d` in the link layer's coordinate space (origin = timeline origin). */
  d: string;
  /**
   * The route polyline (pre-corner-rounding) the same `d` is derived from —
   * in the link layer's coordinate space. Kept on the path so hit-testing
   * (`pickLinkAt`) can measure pointer distance without parsing path data.
   */
  points: GanttPt[];
  /**
   * Arrowhead polygon points (SVG `<polygon points>`), or undefined when the
   * approach is too short for a head. Computed in the engine so the
   * framework layer never has to parse paths.
   */
  arrow?: string;
  /** Source port — the point on the source bar's edge the connector leaves. */
  from: GanttLinkPoint;
  /** Target port — the point on the target bar's edge the arrowhead lands on. */
  to: GanttLinkPoint;
  color?: TrueColor;
  type: GanttLinkType;
}

/** Label overrides for every string the Gantt renders. */
export interface GanttLabels {
  loading: string;
  empty: string;
  today: string;
  select: string;
  move: string;
  resize: string;
  link: string;
  progress: string;
  duration: string;
  task: string;
}

export const DEFAULT_GANTT_LABELS: GanttLabels = {
  loading: "Loading timeline…",
  empty: "No tasks to display",
  today: "Today",
  select: "Select task",
  move: "Move task",
  resize: "Resize task",
  link: "Create dependency",
  progress: "Adjust progress",
  duration: "Duration",
  task: "Task",
};
