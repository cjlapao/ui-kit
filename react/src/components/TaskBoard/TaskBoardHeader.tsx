/**
 * TaskBoardHeader — the Gantt-style header strip: icon tile, title with its
 * subtitle, the app's summary pills, the presence avatar stack and actions.
 */

import React from "react";
import classNames from "classnames";
import { peerColor, type TaskBoardUser } from "../../../../common/taskboard";
import { getSurfaceVariantClasses, type SurfaceVariant } from "../../theme/Theme";
import UserAvatar from "../UserAvatar";
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
  const shown = people?.slice(0, MAX_AVATARS) ?? [];
  const extra = (people?.length ?? 0) - shown.length;
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
      {shown.length > 0 && (
        <div
          data-taskboard-people
          role="group"
          aria-label={text("online", { count: people!.length })}
          className="flex items-center -space-x-2"
        >
          {shown.map((p) => (
            <UserAvatar
              key={p.id}
              user={{ name: p.name, avatarUrl: p.avatarUrl }}
              tone={p.color ?? peerColor(p.id)}
              size="sm"
              title={p.name}
              className="ring-2 ring-white dark:ring-neutral-900"
            />
          ))}
          {extra > 0 && <UserAvatar label={`+${extra}`} size="sm" className="ring-2 ring-white dark:ring-neutral-900" />}
        </div>
      )}
      {hasNode(actions) && <div className="flex items-center gap-1">{actions}</div>}
    </div>
  );
};
