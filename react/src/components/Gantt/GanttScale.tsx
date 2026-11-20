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
      {levels.map((level, li) => {
        // A level is span-managed when the engine merges labels across
        // columns (the hour tier). Unlabeled columns still draw their grid
        // line; labeled ones float the text centered over the whole group,
        // escaping the narrow column box (positioned content paints above
        // the later columns' backgrounds).
        const spanned = level.columns.some((c) => c.labelSpan != null);
        const labelColors =
          li === 0
            ? "text-neutral-700 dark:text-neutral-200"
            : "text-neutral-500 dark:text-neutral-400";
        return (
          <div
            key={level.id}
            className={classNames("flex w-full", li === 0 ? "shrink-0" : "min-h-0 flex-1")}
            style={li === 0 ? { height: coarseHeight } : undefined}
          >
            {level.columns.map((col) => (
              <div
                key={col.id}
                className={classNames(
                  "flex shrink-0 flex-col items-center justify-center border-r",
                  !spanned && "overflow-hidden",
                  col.labelSpan != null && "relative",
                  col.major
                    ? "border-neutral-400 dark:border-neutral-600"
                    : "border-neutral-200/70 dark:border-neutral-800/70",
                  li === 0 ? "bg-neutral-50/60 dark:bg-neutral-800/40" : "bg-white dark:bg-neutral-900",
                )}
                // Calendar-true width (same geometry as the body grid lines), so
                // the scale columns line up with the grid columns below.
                style={{ width: col.width }}
                {...(col.labelSpan != null ? { "data-gantt-label-span": col.labelSpan } : {})}
              >
                {col.labelSpan != null ? (
                  <span
                    className={classNames(
                      "pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-semibold uppercase leading-none tracking-wide",
                      labelColors,
                    )}
                    // Center of the merged group, measured from this column's left edge.
                    style={{ left: col.width / 2 + ((col.labelSpan - 1) * col.width) / 2, top: "50%" }}
                  >
                    {col.label}
                  </span>
                ) : spanned ? null : (
                  <>
                    <span
                      className={classNames(
                        "max-w-full truncate px-1 text-[10px] font-semibold uppercase leading-none tracking-wide",
                        labelColors,
                      )}
                    >
                      {col.label}
                    </span>
                    {col.subLabel != null && (
                      <span className="max-w-full truncate px-1 text-[9px] font-medium leading-none text-neutral-400 dark:text-neutral-500">
                        {col.subLabel}
                      </span>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

GanttScale.displayName = "GanttScale";
