/**
 * TaskBoardSkeleton — the loading placeholder, shaped like the board: column
 * wells with a header bar and a few card blocks of varying height.
 */

import React from "react";
import classNames from "classnames";

const CARD_HEIGHTS = [[72, 96, 64], [88, 64], [64, 104, 72], [96, 72, 88, 64], [72]];

export const TaskBoardSkeleton: React.FC<{
  columns: number;
  columnWidth: number;
  wellSurface: string;
  cornerClass: string;
}> = ({ columns, columnWidth, wellSurface, cornerClass }) => (
  <div data-taskboard-skeleton aria-hidden="true" className="flex min-h-0 flex-1 gap-3 overflow-hidden p-3">
    {Array.from({ length: Math.max(1, columns) }, (_, i) => (
      <div
        key={i}
        style={{ width: columnWidth }}
        className={classNames("flex shrink-0 flex-col gap-2 p-3", cornerClass, wellSurface)}
      >
        <div className="mb-1 h-3.5 w-24 animate-pulse rounded bg-black/10 motion-reduce:animate-none dark:bg-white/10" />
        {CARD_HEIGHTS[i % CARD_HEIGHTS.length].map((h, j) => (
          <div
            key={j}
            style={{ height: h }}
            className="animate-pulse rounded-lg bg-black/[0.06] motion-reduce:animate-none dark:bg-white/[0.08]"
          />
        ))}
      </div>
    ))}
  </div>
);
