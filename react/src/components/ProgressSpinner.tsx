import classNames from "classnames";
import { hasTextColor } from "../theme/Theme";
import React from "react";
import {
  getProgressSpinnerToneTokens,
  type ControlSize,
  type TrueColor,
} from "../theme/Theme";
import type { SpinnerThickness } from "./Spinner";

/**
 * The shared control scale, so a progress spinner lines up with the `Spinner`
 * and `Button` next to it instead of speaking its own size language.
 */
export type ProgressSpinnerSize = ControlSize;
export type ProgressSpinnerColor = TrueColor;

export interface ProgressSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Classes for the percentage readout inside the ring. */
  valueClassName?: string;
  /**
   * Progress value. Omit it for an indeterminate spinner — the two modes are
   * the same component with different ARIA, the way `role="progressbar"` is
   * specified. Values outside `[min, max]` are clamped.
   */
  value?: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default "md" */
  size?: ProgressSpinnerSize;
  /** @default "blue" */
  color?: ProgressSpinnerColor;
  /** @default "normal" */
  thickness?: SpinnerThickness;
  /**
   * One revolution in indeterminate mode. The dash animation runs at 3/4 of
   * this, so a single value sets the whole tempo.
   * @default "2s"
   */
  animationDuration?: string;
  /** Centre percentage readout, determinate mode only. @default true */
  showValue?: boolean;
  /** @default "Loading" */
  ariaLabel?: string;
}

const VIEWBOX = 50;
const CENTER = VIEWBOX / 2;

/**
 * The centre readout. Sits *inside* the ring, so it stays well under the
 * control size — at xl the ring's clear diameter is ~31px and a 14px
 * "100%" already crowds it.
 */
const sizeTokens: Record<
  ProgressSpinnerSize,
  { diameter: string; px: number; value: string }
> = {
  // The rings grew with the readout: a 6px percentage inside a 16px ring was
  // unreadable at any distance, and the point of a determinate spinner is the
  // number.
  xs: { diameter: "h-6 w-6", px: 24, value: "text-[8px]" },
  sm: { diameter: "h-8 w-8", px: 32, value: "text-[9px]" },
  md: { diameter: "h-10 w-10", px: 40, value: "text-[11px]" },
  lg: { diameter: "h-12 w-12", px: 48, value: "text-sm" },
  xl: { diameter: "h-14 w-14", px: 56, value: "text-base" },
};

/**
 * Rendered stroke in px, matching `Spinner`'s border map size-for-size so the
 * two rings sit side by side at identical weight.
 */
const strokePx: Record<ProgressSpinnerSize, Record<SpinnerThickness, number>> = {
  xs: { thin: 1, normal: 2, thick: 4 },
  sm: { thin: 1.5, normal: 2, thick: 4 },
  md: { thin: 3, normal: 3.5, thick: 4.5 },
  lg: { thin: 3.5, normal: 4, thick: 5 },
  xl: { thin: 4, normal: 4.5, thick: 5.5 },
};

const ProgressSpinner = React.forwardRef<HTMLDivElement, ProgressSpinnerProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      size = "md",
      color = "blue",
      thickness = "normal",
      animationDuration = "2s",
      showValue = true,
      ariaLabel = "Loading",
      className,
      valueClassName,
      style,
      ...rest
    },
    ref,
  ) => {
    const geometry = sizeTokens[size] ?? sizeTokens.md;
    const width = (strokePx[size] ?? strokePx.md)[thickness] ?? 4;

    // The SVG scales with the container, so convert the px width into viewBox
    // units — otherwise "normal" would be a different physical weight at every
    // size. Pull the radius in to match, or the thick strokes clip at the edge.
    const strokeWidth = (width * VIEWBOX) / geometry.px;
    const radius = CENTER - strokeWidth / 2 - 0.5;
    const circumference = 2 * Math.PI * radius;

    const tone = getProgressSpinnerToneTokens(color);

    const span = max - min;
    const clamped =
      value !== undefined ? Math.min(Math.max(value, min), max) : min;
    const determinate = value !== undefined;
    const percent = span > 0 ? ((clamped - min) / span) * 100 : 0;

    const track = (
      <circle
        cx={CENTER}
        cy={CENTER}
        r={radius}
        fill="none"
        stroke={tone.track}
        strokeWidth={strokeWidth}
      />
    );

    const arc = determinate ? (
      <circle
        cx={CENTER}
        cy={CENTER}
        r={radius}
        fill="none"
        stroke={tone.arc}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${(percent / 100) * circumference} ${circumference}`}
        transform={`rotate(-90 ${CENTER} ${CENTER})`}
        style={{ transition: "stroke-dasharray 200ms ease-out" }}
      />
    ) : (
      <circle
        className="progress-spinner-dash"
        cx={CENTER}
        cy={CENTER}
        r={radius}
        fill="none"
        stroke={tone.arc}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    );

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={determinate ? min : undefined}
        aria-valuemax={determinate ? max : undefined}
        aria-valuenow={determinate ? clamped : undefined}
        aria-valuetext={determinate ? `${Math.round(percent)}%` : undefined}
        className={classNames(
          "relative inline-flex",
          geometry.diameter,
          className,
        )}
        style={style}
        {...rest}
      >
        <svg
          aria-hidden="true"
          className={classNames(
            "block h-full w-full",
            !determinate && "progress-spinner-rotate",
          )}
          style={
            {
              "--progress-spinner-duration": animationDuration,
            } as React.CSSProperties
          }
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        >
          {track}
          {arc}
        </svg>
        {determinate && showValue && (
          <span
            className={classNames(
              "absolute inset-0 flex items-center justify-center font-semibold tabular-nums",
              // The default neutral pair is invisible on a saturated or
              // gradient surface; `valueClassName` lets the caller supply the
              // surface's own copy colour.
              !hasTextColor(valueClassName) &&
                "text-neutral-700 dark:text-neutral-200",
              geometry.value,
              valueClassName,
            )}
          >
            {Math.round(percent)}%
          </span>
        )}
      </div>
    );
  },
);

ProgressSpinner.displayName = "ProgressSpinner";

export default ProgressSpinner;
