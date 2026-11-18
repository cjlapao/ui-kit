/**
 * TaskBoardHeader — the Gantt-style header strip: icon tile, title with its
 * subtitle, the app's summary pills, the presence avatars (an AvatarGroup,
 * `+N` unfolds the rest) and actions.
 */

import React from "react";
import classNames from "classnames";
import { peerColor, type TaskBoardUser } from "../../../../common/taskboard";
import { getSurfaceVariantClasses, type SurfaceVariant } from "../../theme/Theme";
import AvatarGroup from "../AvatarGroup";
import { useTaskBoard } from "./context";

export interface TaskBoardHeaderProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  summary?: React.ReactNode;
  actions?: React.ReactNode;
  /** Everyone on the board right now, local user first. */
  people?: TaskBoardUser[];
  variant: SurfaceVariant;
}

const MAX_AVATARS = 5;
const hasNode = (v: unknown) => v != null && v !== false;

export const TaskBoardHeader: React.FC<TaskBoardHeaderProps> = ({
  icon,
  title,
  subtitle,
  summary,
  actions,
  people,
  variant,
}) => {
  const { surface, text } = useTaskBoard();
  return (
    <div
      data-taskboard-header
      className={classNames("flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-3", surface.divider)}
    >
      {hasNode(icon) && (
        <div
          className={classNames(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            getSurfaceVariantClasses(variant, "neutral"),
            surface.body,
          )}
        >
          {icon}
        </div>
      )}
      {(hasNode(title) || hasNode(subtitle)) && (
        <div className="min-w-0">
          {hasNode(title) && (
            <div className={classNames("truncate text-lg font-bold leading-tight", surface.heading)}>{title}</div>
          )}
          {hasNode(subtitle) && <div className={classNames("truncate text-xs", surface.muted)}>{subtitle}</div>}
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2">{hasNode(summary) && summary}</div>
      {people && people.length > 0 && (
        <AvatarGroup
          data-taskboard-people
          role="group"
          aria-label={text("online", { count: people.length })}
          className="shrink-0"
          size="sm"
          maxVisible={MAX_AVATARS}
          items={people.map((p) => ({
            name: p.name,
            image: p.avatarUrl,
            tone: p.color ?? peerColor(p.id),
          }))}
        />
      )}
      {hasNode(actions) && <div className="flex items-center gap-1">{actions}</div>}
    </div>
  );
};
