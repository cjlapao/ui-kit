import React from "react";
import classNames from "classnames";
import Progress, { type ProgressProps } from "./Progress";
import type { ControlSize, TrueColor } from "../theme/Theme";

export interface MetricBarProps
  extends Omit<
    ProgressProps,
    // Owned by this component: the caption is `label`, and the right-hand text
    // is `value` (free-form, not a formatted percentage).
    "label" | "formatValue" | "showValue" | "color" | "children" | "value"
  > {
  /** Caption on the left. Also becomes the bar's accessible name. */
  label: React.ReactNode;
  /**
   * Free-form reading shown on the right — "12 / 20 GB", "4 runs", "87%".
   * This is display text, not the bar's geometry: `percentage` drives the fill.
   */
  value?: React.ReactNode;
  /** Fill percentage, 0–100. */
  percentage: number;
  /** @default "blue" */
  color?: TrueColor;
  /** Alias for `color`, matching the rest of the kit. */
  tone?: TrueColor;
  /** @default "sm" */
  size?: ControlSize;
}

/**
 * A labelled progress row: caption on the left, reading on the right, bar
 * underneath.
 *
 * It renders `Progress` rather than drawing its own header. The hand-rolled
 * one published no accessible name, so the `role="progressbar"` underneath it
 * was announced as just "progress bar" — `Progress` already wires its `label`
 * as `aria-labelledby`. That also brings the whole size ladder, every tone and
 * the motion props, none of which this component used to expose.
 */
export const MetricBar: React.FC<MetricBarProps> = ({
  label,
  value,
  percentage,
  color,
  tone,
  size = "sm",
  className,
  ...rest
}) => (
  <Progress
    {...rest}
    value={percentage}
    label={label}
    // `showValue` puts the reading in Progress's own header row; `formatValue`
    // replaces the computed percentage with the caller's text when they gave
    // one, and falls back to the percentage when they did not.
    showValue={value !== undefined}
    formatValue={value !== undefined ? () => String(value) : undefined}
    size={size}
    color={tone ?? color ?? "blue"}
    className={classNames("w-full", className)}
  />
);

MetricBar.displayName = "MetricBar";
export default MetricBar;
