import React from "react";
import classNames from "classnames";
import {
  DEFAULT_SURFACE_CORNER,
  getSurfaceCornerClass,
} from "../../theme/Theme";
import type { PanelCorner } from "../Panel";

/** One shimmering placeholder bar. Widths are passed as inline styles so no
 *  arbitrary Tailwind values are needed. */
const Bar: React.FC<{ width: string; className?: string }> = ({
  width,
  className,
}) => (
  <span
    className={classNames(
      "block h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800",
      className,
    )}
    style={{ width }}
  />
);

const Dot: React.FC = () => (
  <span className="h-5 w-5 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-800" />
);

/** Placeholder eyebrow + title, so `loading` never shows the default fixture. */
export const WorkflowHeaderSkeleton: React.FC<{
  /** Reserves the title mark, so the header does not shift when it arrives. */
  hasIcon?: boolean;
  iconCorner?: PanelCorner;
}> = ({ hasIcon = false, iconCorner = DEFAULT_SURFACE_CORNER }) => (
  <div className="mb-5 flex animate-pulse flex-wrap items-start justify-between gap-3 motion-reduce:animate-none">
    <div className="flex items-center gap-3">
      {hasIcon && (
        <Bar
          width="3rem"
          className={classNames("h-12", getSurfaceCornerClass(iconCorner))}
        />
      )}
      <div className="space-y-3">
        <Bar width="11rem" className="h-2" />
        <Bar width="16rem" className="h-6" />
      </div>
    </div>
    <Bar width="9rem" className="h-6 rounded-full" />
  </div>
);

/** Placeholder timeline: progress header plus `rows` step rows. */
export const WorkflowRailSkeleton: React.FC<{ rows?: number }> = ({
  rows = 6,
}) => (
  <div className="animate-pulse motion-reduce:animate-none">
    <div className="border-b border-neutral-200 px-5 pb-4 pt-5 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <Bar width="4.5rem" />
        <Bar width="2rem" />
      </div>
      <span className="mt-3 block h-1 w-full rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <Bar width="80%" className="mt-3" />
    </div>
    <div className="space-y-5 px-5 py-5">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-start gap-3">
          <Dot />
          <div className="flex-1 space-y-2">
            <Bar width={index % 2 === 0 ? "62%" : "48%"} />
            <Bar width="34%" className="h-2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/** Placeholder detail card: header, meta row, three sub-step rows. */
export const WorkflowDetailSkeleton: React.FC = () => (
  <div className="animate-pulse motion-reduce:animate-none">
    <div className="space-y-4 px-5 pb-6 pt-5 sm:px-6">
      <div className="flex items-center justify-between">
        <Bar width="6rem" />
        <Bar width="4rem" />
      </div>
      <Bar width="45%" className="h-5" />
      <div className="space-y-2">
        <Bar width="92%" className="h-2" />
        <Bar width="70%" className="h-2" />
      </div>
      <div className="flex gap-10 pt-2">
        <Bar width="5rem" />
        <Bar width="6rem" />
        <Bar width="4rem" />
      </div>
    </div>
    <div className="border-y border-neutral-200 bg-neutral-50 px-5 py-3 dark:border-neutral-800 dark:bg-white/5 sm:px-6">
      <Bar width="5rem" />
    </div>
    <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 px-5 py-4 sm:px-6">
          <Dot />
          <Bar width={index === 1 ? "38%" : "30%"} />
          <span className="flex-1" />
          <Bar width="3rem" />
        </div>
      ))}
    </div>
  </div>
);
