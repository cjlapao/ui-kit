/**
 * GanttScale — the multi-level time header.
 *
 * Levels are coarse→fine (e.g. month → day); the fine level's columns are
 * the grid lines of the body. Each column carries its true calendar width,
 * so a February is visibly narrower than a March at any zoom.
 */

import React from "react";
import classNames from "classnames";
import type { GanttTimeScaleLevel } from "../../../../common/gantt";

interface GanttScaleProps {
  levels: GanttTimeScaleLevel[];
  height: number;
}

export const GanttScale: React.FC<GanttScaleProps> = ({ levels, height }) => {
  if (levels.length === 0) {
    return <div style={{ height }} />;
  }
  // Coarse level gets the top band; the fine level the taller bottom band.
  const coarseHeight = levels.length > 1 ? 24 : height;

  return (
    <div className="flex h-full w-full flex-col">
      {levels.map((level, li) => (
        <div
          key={level.id}
          className={classNames("flex w-full", li === 0 ? "shrink-0" : "min-h-0 flex-1")}
          style={li === 0 ? { height: coarseHeight } : undefined}
        >
          {level.columns.map((col) => (
            <div
              key={col.id}
              className={classNames(
                "flex shrink-0 flex-col items-center justify-center overflow-hidden border-r border-neutral-200/70 dark:border-neutral-800/70",
                li === 0 ? "bg-neutral-50/60 dark:bg-neutral-800/40" : "bg-white dark:bg-neutral-900",
              )}
              // Calendar-true width (same geometry as the body grid lines), so
              // the scale columns line up with the grid columns below.
              style={{ width: col.width }}
            >
              <span
                className={classNames(
                  "max-w-full truncate px-1 text-[10px] font-semibold uppercase leading-none tracking-wide",
                  li === 0
                    ? "text-neutral-700 dark:text-neutral-200"
                    : "text-neutral-500 dark:text-neutral-400",
                )}
              >
                {col.label}
              </span>
              {col.subLabel != null && (
                <span className="max-w-full truncate px-1 text-[9px] font-medium leading-none text-neutral-400 dark:text-neutral-500">
                  {col.subLabel}
                </span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

GanttScale.displayName = "GanttScale";
