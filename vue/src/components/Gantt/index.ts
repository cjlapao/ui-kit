/**
 * Gantt — public surface (Vue kit).
 *
 * The `Gantt` component plus the framework-agnostic engine values/types
 * (re-exported from `common/gantt`) so consumers can import the data model
 * from one place:
 *
 * ```vue
 * <script setup>
 * import { Gantt, sampleGantt } from "@cjlapao/ui-kit-vue";
 * </script>
 * ```
 */

export { default as Gantt } from "./Gantt.vue";
export type {
  GanttProps,
  GanttEmits,
  GanttVariant,
  GanttCorner,
  GanttPadding,
} from "./Gantt.vue";
export { mergeGanttLabels } from "./labels";

// Engine values.
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

// Engine types.
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
  TrueColor,
} from "../../../../common/gantt";
