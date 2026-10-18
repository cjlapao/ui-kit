import React from "react";
import classNames from "classnames";
import StatCard, { type StatCardProps } from "./StatCard";
import { useSurfaceText } from "../contexts/SurfaceContext";
import type { TrueColor } from "../theme";

export interface StatCountTileBreakdown {
  label: string;
  value: string | number;
  /** Tints the figure. Falls back to the body colour. */
  color?: TrueColor;
}

/**
 * `StatCard` plus a breakdown list. Every base prop applies unchanged; the
 * only addition is `breakdown`.
 *
 * The one default it changes is `size`, which starts at `xl` — the headline
 * count was a hardcoded `text-5xl` before, and `xl` on the shared scale is
 * that same 5xl, now dialable.
 */
export interface StatCountTileProps extends Omit<StatCardProps, "children"> {
  /** Rows under the count: a label and a figure each. */
  breakdown?: StatCountTileBreakdown[];

  /** @deprecated Use `label`. */
  title?: React.ReactNode;
  /** @deprecated Use `value`. */
  count?: React.ReactNode;
  /** @deprecated Use `tone`. */
  color?: TrueColor;
  /** @deprecated Use `labelTone` and `valueTone`. */
  textColor?: TrueColor;
  /** @deprecated Use `hoverEffect`. */
  withHoverEffect?: boolean;
  /** @deprecated Use `spinnerTone`. */
  spinnerColor?: TrueColor;
  /** @deprecated Use `error`. `variant` on the error object was never read. */
  errorVariant?: "text" | "badge";
}

/** The breakdown rows, split out so they can read the surface tokens. */
const Breakdown: React.FC<{
  items: StatCountTileBreakdown[];
  onGradient: boolean;
}> = ({ items, onGradient }) => {
  const text = useSurfaceText();
  return (
    <div className="mt-auto space-y-3 pt-4">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between text-sm">
          <span
            className={classNames(
              "font-medium",
              onGradient ? "text-white/70" : text.muted,
            )}
          >
            {item.label}
          </span>
          <span
            className={classNames(
              "font-semibold",
              item.color
                ? `text-${item.color}-600 dark:text-${item.color}-400`
                : onGradient
                  ? "text-white"
                  : text.body,
            )}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * A big headline count with an optional breakdown list.
 *
 * It used to be a third parallel copy of the same card — its own `Panel`, its
 * own decoration corner, its own error block, its own loading overlay. Now it
 * is a `StatCard` with the breakdown in `children`.
 */
export const StatCountTile: React.FC<StatCountTileProps> = ({
  breakdown,
  // Deprecated aliases.
  title,
  count,
  color,
  textColor,
  withHoverEffect,
  spinnerColor,
  errorVariant: _errorVariant,
  // Modern names win wherever both are given.
  label,
  value,
  tone,
  labelTone,
  valueTone,
  hoverEffect,
  spinnerTone,
  size = "xl",
  gradient = false,
  ...rest
}) => (
  <StatCard
    {...rest}
    label={label ?? title}
    value={value ?? count}
    tone={tone ?? color}
    labelTone={labelTone ?? textColor}
    valueTone={valueTone ?? textColor}
    hoverEffect={hoverEffect ?? withHoverEffect}
    spinnerTone={spinnerTone ?? spinnerColor}
    size={size}
    gradient={gradient}
  >
    {breakdown && breakdown.length > 0 ? (
      // The rows carry their own copy colour, which a gradient wash would
      // otherwise bury — the base card only recolours the copy it owns.
      <Breakdown items={breakdown} onGradient={gradient} />
    ) : undefined}
  </StatCard>
);

StatCountTile.displayName = "StatCountTile";

export default StatCountTile;
