import type { ControlSize } from "../theme/Theme";

export interface ContentActionsLayoutProps {
  /** Space between regions and between actions. Defaults to md. */
  gap?: ControlSize;
  /** Vertical alignment of the two regions. Defaults to start. */
  align?: "start" | "center" | "end";
  contentClassName?: string;
  actionsClassName?: string;
}

export const CONTENT_ACTIONS_GAPS: Record<ControlSize, string> = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
  xl: "gap-6",
};
export const CONTENT_ACTIONS_ALIGN = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
} as const;
