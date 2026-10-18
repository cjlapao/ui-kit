import { DEFAULT_GANTT_LABELS } from "../../../../common/gantt";
import type { GanttLabels } from "../../../../common/gantt";

/** Merge user copy overrides with the Gantt defaults. */
export function mergeGanttLabels(overrides?: Partial<GanttLabels>): GanttLabels {
  return { ...DEFAULT_GANTT_LABELS, ...overrides };
}
