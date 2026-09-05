/**
 * Gantt — public surface.
 *
 * The `Gantt` component plus the framework-agnostic engine types (re-exported
 * from `common/gantt`) so consumers can import the data model from one place:
 *
 * ```tsx
 * import { Gantt, sampleGantt, type GanttTask, type GanttLane } from "@cjlapao/ui-kit";
 * ```
 */

export { Gantt, mergeGanttLabels } from "./Gantt";
export type { GanttProps, GanttVariant, GanttCorner, GanttPadding } from "./Gantt";

// Re-export the engine's public types/values so the data model is one import.
export {
  sampleGantt,
  sampleGanttLanes,
  sampleGanttTasks,
  sampleGanttLinks,
  GANTT_ZOOM_PRESETS,
  GANTT_MIN_ZOOM,
  GANTT_MAX_ZOOM,
  DEFAULT_GANTT_LABELS,
} from "../../../../common/gantt";
export type {
  GanttTask,
  GanttLink,
  GanttLane,
  GanttColumn,
  GanttSnap,
  GanttLabels,
  GanttDate,
  GanttTaskType,
  GanttLinkType,
  GanttZoom,
} from "../../../../common/gantt";
