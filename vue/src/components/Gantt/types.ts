import type { GanttLinkPoint, TrueColor } from "../../../../common/gantt";

/** A rubber-band path preview for an in-flight dependency drag. */
export interface GanttRubberPreview {
  d: string;
  color: TrueColor;
  /** Arrowhead polygon (present when the pointer is over a target bar). */
  arrow?: string;
  /** Port anchors: source right edge and the target left edge / pointer. */
  from: GanttLinkPoint;
  to: GanttLinkPoint;
}
