import React, { useId } from "react";
import classNames from "classnames";
import { hasTextColor } from "../theme/Theme";

import { getLoaderProgressColors } from "../theme/Theme";
import type { ControlSize, TrueColor } from "../theme/Theme";

/** The shared control scale, so a bar lines up with the controls around it. */
export type ProgressSize = ControlSize;

export const PROGRESS_MOTIONS = [
  "none",
  "shimmer",
  "pulse",
  "shimmer-pulse",
  "stripes",
  "stripes-shimmer",
] as const;
export type ProgressMotion = (typeof PROGRESS_MOTIONS)[number];

export const PROGRESS_MOTION_SPEEDS = ["slow", "normal", "fast"] as const;
export type ProgressMotionSpeed = (typeof PROGRESS_MOTION_SPEEDS)[number];

export const PROGRESS_MOTION_DIRECTIONS = ["forward", "reverse"] as const;
export type ProgressMotionDirection =
  (typeof PROGRESS_MOTION_DIRECTIONS)[number];

export const PROGRESS_CORNERS = ["full", "rounded", "none"] as const;
export type ProgressCorner = (typeof PROGRESS_CORNERS)[number];

export interface ProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  /** Current value, clamped between `min` and `max`. @default 0 */
  value?: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /**
   * Work is happening but its extent is unknown — the bar sweeps instead of
   * filling. `value` is ignored, and no `aria-valuenow` is published, which is
   * what tells assistive technology the progress is indeterminate.
   */
  indeterminate?: boolean;
  /** @default "md" */
  size?: ProgressSize;
  /** @default "blue" */
  color?: TrueColor;
  /** Alias for `color`, matching the input family's `tone`. */
  tone?: TrueColor;
  /** @default "full" */
  corner?: ProgressCorner;
  motion?: ProgressMotion;
  /** @default "normal" */
  motionSpeed?: ProgressMotionSpeed;
  /** @default "forward" */
  motionDirection?: ProgressMotionDirection;
  /**
   * Caption above the bar. Also becomes the bar's accessible name — a
   * `role="progressbar"` with no name is announced as just "progress bar".
   */
  label?: React.ReactNode;
  /** Show the value beside the label. @default false */
  showValue?: boolean;
  /**
   * Formats the displayed value and `aria-valuetext`. Defaults to a percentage
   * of the `min`–`max` range.
   */
  formatValue?: (value: number, percent: number) => string;
  /** Classes for the track. */
  className?: string;
  /** Classes for the filled bar. */
  barClassName?: string;
  /**
   * Classes for the caption. The default is a neutral pair, which disappears
   * on a saturated or gradient surface — pass the surface's own copy colour
   * there.
   */
  labelClassName?: string;
  /** Classes for the value readout. Same reasoning as `labelClassName`. */
  valueClassName?: string;
  /**
   * @deprecated Use `motion="shimmer"` or `motion="none"`.
   */
  showShimmer?: boolean;
}

const HEIGHTS: Record<ProgressSize, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
  xl: "h-4",
};

const CORNERS: Record<ProgressCorner, string> = {
  full: "rounded-full",
  rounded: "rounded-sm",
  none: "rounded-none",
};

const SPEEDS: Record<ProgressMotionSpeed, string> = {
  slow: "2.4s",
  normal: "1.8s",
  fast: "1.2s",
};

/** The indeterminate sweep reads better a little slower than the shimmer. */
const INDETERMINATE_SPEEDS: Record<ProgressMotionSpeed, string> = {
  slow: "2.6s",
  normal: "1.9s",
  fast: "1.3s",
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      min = 0,
      max = 100,
      indeterminate = false,
      size = "md",
      color,
      tone,
      corner = "full",
      motion,
      motionSpeed = "normal",
      motionDirection = "forward",
      label,
      showValue = false,
      formatValue,
      className,
      barClassName,
      labelClassName,
      valueClassName,
      showShimmer = true,
      ...rest
    },
    ref,
  ) => {
    const labelId = useId();

    const effectiveColor = color ?? tone ?? "blue";
    const palette = getLoaderProgressColors(effectiveColor);
    const trackHeight = HEIGHTS[size] ?? HEIGHTS.md;
    const cornerClass = CORNERS[corner] ?? CORNERS.full;

    // A zero-width range would divide by zero; treat it as "no progress".
    const span = max - min;
    const clampedValue = Math.min(max, Math.max(min, value));
    const percent =
      span > 0 ? Math.min(100, Math.max(0, ((clampedValue - min) / span) * 100)) : 0;

    const resolvedMotion: ProgressMotion =
      motion ?? (showShimmer ? "shimmer" : "none");
    const showShimmerOverlay =
      !indeterminate &&
      (resolvedMotion === "shimmer" ||
        resolvedMotion === "shimmer-pulse" ||
        resolvedMotion === "stripes-shimmer");
    const showStripesOverlay =
      resolvedMotion === "stripes" || resolvedMotion === "stripes-shimmer";
    const pulseBar =
      !indeterminate &&
      (resolvedMotion === "pulse" || resolvedMotion === "shimmer-pulse");

    // Custom properties rather than an inline `animation` shorthand: a
    // `prefers-reduced-motion` media query cannot override an inline style, so
    // the old version animated regardless of the user's setting.
    const motionVars = {
      "--progress-duration": indeterminate
        ? INDETERMINATE_SPEEDS[motionSpeed] ?? INDETERMINATE_SPEEDS.normal
        : SPEEDS[motionSpeed] ?? SPEEDS.normal,
      "--progress-direction":
        motionDirection === "reverse" ? "reverse" : "normal",
    } as React.CSSProperties;

    const display = formatValue
      ? formatValue(clampedValue, percent)
      : `${Math.round(percent)}%`;

    const hasHeader = label !== undefined || showValue;
    const ariaLabelledBy = label !== undefined ? labelId : undefined;

    const track = (
      <div
        ref={hasHeader ? undefined : ref}
        className={classNames(
          "relative w-full overflow-hidden shadow-inner",
          trackHeight,
          cornerClass,
          palette.track,
          hasHeader ? undefined : className,
        )}
        style={motionVars}
        role="progressbar"
        // Omitted entirely when indeterminate — that absence is the signal.
        aria-valuenow={indeterminate ? undefined : clampedValue}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={indeterminate ? undefined : display}
        aria-labelledby={ariaLabelledBy}
        {...(hasHeader ? {} : rest)}
      >
        <div
          className={classNames(
            "relative h-full overflow-hidden",
            cornerClass,
            palette.bar,
            indeterminate
              ? "progress-indeterminate absolute inset-y-0"
              : "transition-[width] duration-300 ease-out",
            pulseBar && "animate-pulse",
            barClassName,
          )}
          style={indeterminate ? undefined : { width: `${percent}%` }}
        >
          {showShimmerOverlay && (
            <span
              aria-hidden="true"
              className="progress-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"
            />
          )}
          {showStripesOverlay && (
            <span
              aria-hidden="true"
              className="progress-stripes absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 12px, transparent 12px, transparent 24px)",
                backgroundSize: "34px 34px",
              }}
            />
          )}
        </div>
      </div>
    );

    if (!hasHeader) return track;

    return (
      <div ref={ref} className={classNames("w-full", className)} {...rest}>
        {/* `justify-end` with no label: `justify-between` has a single child
            there, which parks a lone percentage at the *start* of the row
            instead of over the end of the bar it describes. */}
        <div
          className={classNames(
            "mb-1.5 flex items-baseline gap-3",
            label === undefined ? "justify-end" : "justify-between",
          )}
        >
          {label !== undefined && (
            <span
              id={labelId}
              className={classNames(
                "text-xs font-medium",
                !hasTextColor(labelClassName) &&
                  "text-neutral-700 dark:text-neutral-200",
                labelClassName,
              )}
            >
              {label}
            </span>
          )}
          {showValue && (
            <span
              className={classNames(
                "text-xs tabular-nums",
                !hasTextColor(valueClassName) &&
                  "text-neutral-500 dark:text-neutral-400",
                valueClassName,
              )}
            >
              {indeterminate ? "…" : display}
            </span>
          )}
        </div>
        {track}
      </div>
    );
  },
);

Progress.displayName = "Progress";

export default Progress;
