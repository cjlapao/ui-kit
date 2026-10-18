import React, { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { getColorPaletteNames } from "../theme";
import { useSurfaceText } from "../contexts/SurfaceContext";
import { useIconRenderer } from "../contexts/IconContext";
import EmptyState from "./EmptyState";
import {
  ORIENTATIONS,
  hasTextColor,
  type ControlSize,
  type Orientation,
  type TrueColor,
} from "../theme/Theme";
import type { IconRenderer } from "../types/Icon";

export const MULTI_PROGRESS_ORIENTATIONS = ORIENTATIONS;
export type MultiProgressBarOrientation = Orientation;
export type MultiProgressBarLabelPosition = "start" | "end";

export interface MultiProgressBarSeries {
  key: string;
  label: string;
  labelClassName?: string;
  value: number;
  /** Accent for this segment. Omit to auto-assign from the theme palette. */
  tone?: TrueColor;
  /**
   * @deprecated Use `tone`. A raw class here cannot be dimmed or safelisted
   * with the rest, and callers were passing shades the palette never emits.
   */
  color?: string;
  /** Custom formatted value shown in the legend; falls back to `value`. */
  displayValue?: React.ReactNode;
  /** Icon shown in the legend instead of the colour dot. */
  icon?: Parameters<IconRenderer>[0];
}

export interface MultiProgressBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  /** Heading above the bar. */
  label?: string;
  labelClassName?: string;
  secondaryLabel?: React.ReactNode;
  secondaryLabelClassName?: string;
  totalLabel?: React.ReactNode;
  series: MultiProgressBarSeries[];

  /** Lower boundary of the range. @default 0 */
  min?: number;
  /** Upper boundary of the range. Falls back to `total`, then 100. */
  max?: number;
  /** @deprecated Use `max`. Kept so existing call sites keep working. */
  total?: number;

  /** @default "md" */
  size?: ControlSize;
  /**
   * Exact bar thickness in px, overriding the one `size` implies. Bar *width*
   * when vertical.
   */
  barSize?: number;
  /** @default "horizontal" */
  orientation?: MultiProgressBarOrientation;
  /** Track length for vertical bars. @default "200px" */
  height?: string | number;

  /** Where the legend sits relative to the bar. @default "end" */
  labelPosition?: MultiProgressBarLabelPosition;
  /** How the legend lays its rows out. @default "horizontal" */
  labelOrientation?: MultiProgressBarOrientation;
  /** Show the legend. @default true */
  showLabels?: boolean;
  /** @deprecated Use `showLabels={false}`. */
  hideLegend?: boolean;
  /** Show each segment's share as a percentage in the legend. @default false */
  showPercent?: boolean;

  /** Accessible name for the meter. Falls back to `label`. */
  ariaLabel?: string;

  /** Show a skeleton shaped like the bar instead of the content. */
  loading?: boolean;
  /** Custom loading content, replacing the skeleton. */
  loadingState?: React.ReactNode;
  /** Show an error state in place of the content; a string is the message. */
  error?: React.ReactNode | null;
  /** Custom error content. */
  errorState?: React.ReactNode;
  /** Message shown when `series` is empty. @default "No items to display." */
  emptyMessage?: string;
  /** Custom empty content. */
  emptyState?: React.ReactNode;

  className?: string;
}

interface TooltipState {
  key: string;
  x: number;
  y: number;
}

const SIZE_TOKENS: Record<
  ControlSize,
  { track: number; label: string; meta: string; dot: string; dotActive: string }
> = {
  xs: { track: 6, label: "text-xs", meta: "text-[10px]", dot: "w-1.5 h-1.5", dotActive: "w-2 h-2" },
  sm: { track: 8, label: "text-xs", meta: "text-[11px]", dot: "w-2 h-2", dotActive: "w-2.5 h-2.5" },
  md: { track: 10, label: "text-sm", meta: "text-xs", dot: "w-2 h-2", dotActive: "w-3 h-3" },
  lg: { track: 12, label: "text-base", meta: "text-sm", dot: "w-2.5 h-2.5", dotActive: "w-3.5 h-3.5" },
  xl: { track: 16, label: "text-lg", meta: "text-base", dot: "w-3 h-3", dotActive: "w-4 h-4" },
};

const SKELETON =
  "animate-pulse bg-black/10 motion-reduce:animate-none dark:bg-white/10";

const toPx = (value: string | number): string =>
  typeof value === "number" ? `${value}px` : value;

/**
 * A stacked breakdown bar: one quantity split into labelled shares.
 *
 * This absorbed `MeterGroup`, which drew the same picture without the hover
 * behaviour. Everything that component could do — an explicit `min`/`max`
 * range, vertical orientation, legend placement and direction, per-item icons,
 * loading / error / empty states, and `role="meter"` semantics — lives here
 * now, alongside the segment dimming and cursor-tracking tooltip this one
 * already had.
 */
const MultiProgressBar: React.FC<MultiProgressBarProps> = ({
  label,
  labelClassName,
  secondaryLabel,
  secondaryLabelClassName,
  totalLabel,
  series,
  min = 0,
  max,
  total,
  size = "md",
  barSize,
  orientation = "horizontal",
  height = "200px",
  labelPosition = "end",
  labelOrientation = "horizontal",
  showLabels = true,
  hideLegend = false,
  showPercent = false,
  ariaLabel,
  loading = false,
  loadingState,
  error,
  errorState,
  emptyMessage = "No items to display.",
  emptyState,
  className,
  ...rest
}) => {
  const text = useSurfaceText();
  const renderIcon = useIconRenderer();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const tokens = SIZE_TOKENS[size] ?? SIZE_TOKENS.md;
  const thickness = barSize ?? tokens.track;
  const isVertical = orientation === "vertical";
  const legendVisible = showLabels && !hideLegend;

  const resolvedSeries = useMemo(() => {
    const palette = getColorPaletteNames(series.length);
    return series.map((s, i) => {
      const tone = s.tone ?? palette[i];
      return {
        ...s,
        // A raw `color` class still wins, so existing call sites keep working.
        fill: s.color ?? `bg-${tone}-500`,
        tint: `text-${tone}-600 dark:text-${tone}-400`,
      };
    });
  }, [series]);

  // `total` is the old name for the upper bound.
  const upper = max ?? total ?? 100;
  // A degenerate range would divide by zero; pin it to 1 so the share stays finite.
  const range = upper - min || 1;

  const sum = series.reduce(
    (acc, s) => acc + (Number.isFinite(s.value) ? s.value : 0),
    0,
  );

  const segments = useMemo(() => {
    const raw = resolvedSeries
      .filter((s) => s.value > 0)
      .map((s) => {
        const p = ((s.value - min) / range) * 100;
        return {
          ...s,
          pct: Math.max(0, Math.min(100, Number.isFinite(p) ? p : 0)),
        };
      });
    // Segments are stacked, so their shares cannot exceed the track. When the
    // values overflow the range, scale them down together rather than letting
    // the last ones fall off the end.
    const totalPct = raw.reduce((acc, s) => acc + s.pct, 0);
    const factor = totalPct > 100 ? 100 / totalPct : 1;
    return raw.map((s) => ({ ...s, pct: s.pct * factor }));
  }, [resolvedSeries, min, range]);

  const handleSegmentEnter = (key: string, e: React.MouseEvent) => {
    setHoveredKey(key);
    setTooltip({ key, x: e.clientX, y: e.clientY });
  };
  const handleSegmentMove = (key: string, e: React.MouseEvent) => {
    setTooltip({ key, x: e.clientX, y: e.clientY });
  };
  const handleSegmentLeave = () => {
    setHoveredKey(null);
    setTooltip(null);
  };

  const tooltipSegment = tooltip
    ? segments.find((s) => s.key === tooltip.key)
    : null;

  // A stacked bar is a breakdown of one quantity, so it is a `meter` — and the
  // value text names every slice, because the numbers otherwise exist only
  // inside a hover tooltip.
  const summary = segments
    .map((s) => `${s.label}: ${s.value} (${s.pct.toFixed(1)}%)`)
    .join(", ");

  const legend = legendVisible && (
    <ol
      aria-label="Breakdown"
      className={classNames(
        "flex gap-x-4 gap-y-1.5",
        tokens.meta,
        labelOrientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
      )}
    >
      {resolvedSeries.map((s) => {
        const isActive = hoveredKey === s.key;
        const isDimmed = hoveredKey !== null && !isActive;
        const pct = segments.find((seg) => seg.key === s.key)?.pct ?? 0;

        return (
          <li
            key={s.key}
            className={classNames(
              "flex cursor-pointer select-none items-center gap-1.5 whitespace-nowrap",
              "transition-all duration-200",
              isActive ? text.heading : isDimmed ? "opacity-40" : text.muted,
            )}
            onMouseEnter={() => setHoveredKey(s.key)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            {s.icon ? (
              <span className={classNames("flex items-center", s.tint)}>
                {renderIcon(s.icon, "sm")}
              </span>
            ) : (
              /* Dot — grows and glows on hover */
              <span
                aria-hidden="true"
                className={classNames(
                  "inline-block shrink-0 rounded-full transition-all duration-200",
                  s.fill,
                  isActive
                    ? classNames(tokens.dotActive, "shadow-md brightness-110")
                    : tokens.dot,
                  isDimmed && "opacity-30",
                )}
              />
            )}
            <span
              className={classNames(
                "font-semibold transition-colors duration-200",
                isActive ? text.heading : text.body,
              )}
            >
              {s.displayValue ?? s.value}
            </span>
            {s.label}
            {showPercent && (
              <span className={text.muted}>({Math.round(pct)}%)</span>
            )}
          </li>
        );
      })}
    </ol>
  );

  const bar = (
    <div
      ref={barRef}
      className={classNames(
        "relative overflow-hidden rounded-full bg-black/10 shadow-inner dark:bg-white/10",
        isVertical ? "shrink-0" : "w-full",
      )}
      style={
        isVertical
          ? { width: thickness, height: toPx(height) }
          : { height: thickness }
      }
    >
      <div
        className={classNames(
          "flex h-full w-full",
          isVertical ? "flex-col" : "flex-row",
        )}
      >
        {segments.map((s) => {
          const isActive = hoveredKey === s.key;
          const isDimmed = hoveredKey !== null && !isActive;
          return (
            <div
              key={s.key}
              aria-hidden="true"
              data-meter-segment
              className={classNames(
                "shrink-0 grow-0 cursor-pointer transition-all duration-200 ease-out",
                isVertical ? "w-full" : "h-full",
                s.fill,
                isActive && "brightness-110",
                isDimmed && "opacity-25",
              )}
              style={
                isVertical ? { height: `${s.pct}%` } : { width: `${s.pct}%` }
              }
              onMouseEnter={(e) => handleSegmentEnter(s.key, e)}
              onMouseMove={(e) => handleSegmentMove(s.key, e)}
              onMouseLeave={handleSegmentLeave}
            />
          );
        })}
      </div>
    </div>
  );

  const skeletonChips = resolvedSeries.length > 0 && (
    <div
      className={classNames(
        "flex gap-2",
        labelOrientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
      )}
    >
      {resolvedSeries.map((s) => (
        <div key={s.key} className="flex items-center gap-1.5">
          <div className={classNames("h-2 w-2 rounded-full", SKELETON)} />
          <div className={classNames("h-3 w-20 rounded", SKELETON)} />
        </div>
      ))}
    </div>
  );

  const skeleton = (
    <div
      className={classNames(
        "flex gap-3",
        // Mirrors the content layout — legend on the cross axis.
        isVertical ? "flex-row items-center" : "flex-col items-stretch",
      )}
    >
      {labelPosition === "start" ? skeletonChips : null}
      <div
        className={classNames(
          "relative overflow-hidden rounded-full",
          SKELETON,
          isVertical ? "shrink-0" : "w-full",
        )}
        style={
          isVertical
            ? { width: thickness, height: toPx(height) }
            : { height: thickness }
        }
      />
      {labelPosition === "end" ? skeletonChips : null}
    </div>
  );

  const content = loading ? (
    (loadingState ?? skeleton)
  ) : error ? (
    (errorState ?? (
      <EmptyState
        variant="plain"
        icon="Error"
        iconColor="rose"
        title="Something went wrong"
        subtitle={
          typeof error === "string" ? error : "An unexpected error occurred."
        }
        showIcon
      />
    ))
  ) : series.length === 0 ? (
    (emptyState ?? (
      <EmptyState variant="plain" icon="ViewGrid" title={emptyMessage} showIcon />
    ))
  ) : (
    <div
      className={classNames(
        "flex gap-3",
        // The legend sits on the cross axis: a horizontal bar has it above or
        // below, a vertical bar has it to the side.
        isVertical ? "flex-row items-center" : "flex-col items-stretch",
        labelPosition === "start" &&
          (isVertical ? "flex-row-reverse" : "flex-col-reverse"),
      )}
    >
      {bar}
      {legend}
    </div>
  );

  const hasHeader =
    label != null || secondaryLabel != null || totalLabel != null;

  return (
    <div
      role="meter"
      aria-label={ariaLabel ?? label ?? "Breakdown"}
      aria-valuemin={min}
      aria-valuemax={upper}
      aria-valuenow={sum}
      aria-valuetext={summary || undefined}
      aria-busy={loading || undefined}
      data-orientation={orientation}
      className={classNames("w-full", className)}
      {...rest}
    >
      {hasHeader && (
        <div className="mb-2 flex items-start justify-between">
          <div className="flex flex-col">
            {label != null && (
              <span
                className={classNames(
                  tokens.label,
                  "font-semibold",
                  !hasTextColor(labelClassName) && text.heading,
                  labelClassName,
                )}
              >
                {label}
              </span>
            )}
            {secondaryLabel && (
              <span
                className={classNames(
                  tokens.meta,
                  "mt-0.5",
                  !hasTextColor(secondaryLabelClassName) && text.muted,
                  secondaryLabelClassName,
                )}
              >
                {secondaryLabel}
              </span>
            )}
          </div>
          {totalLabel && (
            <span
              className={classNames(tokens.meta, "font-medium", text.muted)}
            >
              {totalLabel}
            </span>
          )}
        </div>
      )}

      {content}

      {/* Tooltip — rendered in a portal so no ancestor overflow:hidden can clip it */}
      {tooltip &&
        tooltipSegment &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[9999]"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, calc(-100% - 12px))",
            }}
          >
            <div className="whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white shadow-xl ring-1 ring-black/10 dark:bg-white dark:text-neutral-900 dark:ring-black/5">
              <p className="font-semibold leading-tight">
                {tooltipSegment.label}
              </p>
              <p className="mt-0.5 text-neutral-400 dark:text-neutral-500">
                {tooltipSegment.displayValue ?? tooltipSegment.value}
                <span className="mx-1 opacity-40">·</span>
                {tooltipSegment.pct.toFixed(1)}%
              </p>
            </div>
            {/* Arrow */}
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-neutral-900 dark:border-t-white" />
          </div>,
          document.body,
        )}
    </div>
  );
};

MultiProgressBar.displayName = "MultiProgressBar";

export default MultiProgressBar;
