import React, { useState, useMemo } from "react";
import classNames from "classnames";
import StatCard, { type StatCardProps } from "./StatCard";
import { useSurfaceText } from "../contexts/SurfaceContext";
import type { ControlSize, TrueColor } from "../theme";
import { getColorPaletteNames } from "../theme";

export interface StatChartItem {
  label: string;
  value: number;
  /** Omit to auto-assign from the theme palette. */
  color?: TrueColor;
  /**
   * @deprecated Never safelisted. The class was built from two interpolations
   * (`text-${color}-${intensity}`), and only the `-500` step is emitted for
   * every tone — any other value silently rendered no colour at all.
   */
  intensity?: string;
  onClick?: () => void;
}

export interface StatChartDataset {
  id: string | number;
  label: string;
  centerLabel: string;
  items: StatChartItem[];
}

/**
 * `StatCard` whose body is a navigable donut with a legend. Every base prop
 * applies unchanged; `data` is the only addition.
 */
export interface StatChartTileProps
  extends Omit<StatCardProps, "body" | "value" | "subtitle"> {
  data: StatChartDataset[];
  /** Overrides the donut diameter the card's `size` implies, in px. */
  chartSize?: number;

  /** @deprecated Use `label`. */
  title?: React.ReactNode;
  /** @deprecated Use `tone`. */
  color?: TrueColor;
}

/**
 * Donut geometry and copy scale per card size. The chart was a fixed 192px
 * with a `text-4xl` centre at every size, so an `xs` tile drew the same donut
 * as an `xl` one.
 */
const CHART_TOKENS: Record<
  ControlSize,
  { chart: number; stroke: number; total: string; center: string; legend: string }
> = {
  xs: { chart: 120, stroke: 9, total: "text-xl", center: "text-[10px]", legend: "text-[10px]" },
  sm: { chart: 150, stroke: 10, total: "text-2xl", center: "text-xs", legend: "text-[11px]" },
  md: { chart: 192, stroke: 12, total: "text-4xl", center: "text-sm", legend: "text-xs" },
  lg: { chart: 224, stroke: 14, total: "text-5xl", center: "text-sm", legend: "text-sm" },
  xl: { chart: 256, stroke: 16, total: "text-6xl", center: "text-base", legend: "text-sm" },
};

/** One dataset's donut, split out so it can read the surrounding surface tokens. */
const Donut: React.FC<{
  dataset: StatChartDataset;
  tokens: (typeof CHART_TOKENS)[ControlSize];
  chartSize?: number;
  onGradient: boolean;
}> = ({ dataset, tokens, chartSize, onGradient }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const text = useSurfaceText();

  const resolvedItems = useMemo(() => {
    const palette = getColorPaletteNames(dataset.items.length);
    return dataset.items.map((item, i) => ({
      ...item,
      color: (item.color ?? palette[i]) as TrueColor,
    }));
  }, [dataset]);

  const total = useMemo(
    () => dataset.items.reduce((acc, item) => acc + item.value, 0),
    [dataset],
  );

  const box = chartSize ?? tokens.chart;
  // The viewBox is the drawing space; `box` is the rendered size. Keeping them
  // equal means the stroke width is in the same units either way.
  const strokeWidth = tokens.stroke;
  const radius = (box - strokeWidth) / 2 - 1;
  const circumference = radius * 2 * Math.PI;

  let cumulativePercent = 0;
  const segments =
    total === 0
      ? [
          {
            label: "",
            value: 0,
            color: "neutral" as TrueColor,
            dashArray: `${circumference} ${circumference}`,
            dashOffset: 0,
            onClick: undefined,
          },
        ]
      : resolvedItems.map((item) => {
          const percent = item.value / total;
          const dashArray = `${circumference * percent} ${circumference}`;
          const dashOffset = -circumference * cumulativePercent;
          cumulativePercent += percent;
          return { ...item, dashArray, dashOffset };
        });

  const segmentCircle = (
    segment: (typeof segments)[number],
    idx: number,
    hovered: boolean,
  ) => (
    <circle
      key={idx}
      className={classNames(
        total === 0
          ? "text-neutral-200 dark:text-neutral-700"
          : `text-${segment.color}-500`,
        "origin-center transition-all duration-300 ease-out",
        hovered && "scale-110 cursor-pointer opacity-90 drop-shadow-lg",
        total > 0 &&
          !hovered &&
          "cursor-pointer hover:scale-110 hover:opacity-90 hover:drop-shadow-lg",
      )}
      strokeWidth={strokeWidth}
      strokeDasharray={segment.dashArray}
      strokeDashoffset={segment.dashOffset}
      strokeLinecap={total > 0 ? "round" : undefined}
      stroke="currentColor"
      fill="none"
      r={radius}
      cx={box / 2}
      cy={box / 2}
      onMouseEnter={() => total > 0 && setHoveredIndex(idx)}
      onMouseLeave={() => setHoveredIndex(null)}
      onClick={(e) => {
        if (total > 0 && segment.onClick) {
          e.stopPropagation();
          segment.onClick();
        }
      }}
    >
      {total > 0 && (
        <title>
          {segment.label}: {segment.value}
        </title>
      )}
    </circle>
  );

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex flex-1 items-center justify-center">
        <svg
          // A donut with no role and no name is invisible to a screen reader;
          // the values existed only in per-segment <title>s.
          role="img"
          aria-label={`${dataset.label}: ${resolvedItems
            .map((i) => `${i.label} ${i.value}`)
            .join(", ")}`}
          className="-rotate-90 transform overflow-visible"
          width={box}
          height={box}
          viewBox={`0 0 ${box} ${box}`}
        >
          <circle
            className={
              onGradient
                ? "text-white/15"
                : "text-neutral-100 dark:text-neutral-800"
            }
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="none"
            r={radius}
            cx={box / 2}
            cy={box / 2}
          />
          {segments.map((segment, idx) =>
            idx === hoveredIndex && total > 0
              ? null
              : segmentCircle(segment, idx, false),
          )}
          {/* The hovered segment is drawn last so its scale-up sits on top. */}
          {hoveredIndex !== null &&
            total > 0 &&
            segments[hoveredIndex] &&
            segmentCircle(segments[hoveredIndex], hoveredIndex, true)}
        </svg>

        <div className="absolute flex max-w-[60%] flex-col items-center justify-center text-center">
          <span
            className={classNames(
              "mb-1 font-bold leading-none",
              tokens.total,
              onGradient ? "text-white" : text.heading,
            )}
          >
            {total}
          </span>
          <span
            className={classNames(
              "font-medium leading-tight",
              tokens.center,
              onGradient ? "text-white/70" : text.muted,
            )}
          >
            {dataset.centerLabel}
          </span>
        </div>
      </div>

      {total > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 px-2">
          {resolvedItems.map((item, idx) => (
            // Clickable legend rows are activatable (WCAG 2.1.1): the row
            // carries rich content a native <button> cannot hold, so the
            // button role + tabindex + Enter/Space is the APG pattern.
            <div
              key={idx}
              className={classNames(
                "group flex min-w-0 items-center justify-between",
                item.onClick
                  ? "-mx-1 cursor-pointer rounded px-1 hover:bg-black/5 focus-visible:bg-black/5 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-400 dark:hover:bg-white/5 dark:focus-visible:bg-white/5 dark:focus-visible:ring-neutral-500"
                  : "cursor-default",
              )}
              title={`${item.label}: ${item.value}`}
              role={item.onClick ? "button" : undefined}
              tabIndex={item.onClick ? 0 : undefined}
              aria-label={`${item.label}: ${item.value}`}
              onClick={() => item.onClick?.()}
              onKeyDown={(event) => {
                if (!item.onClick) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  item.onClick?.();
                }
              }}
            >
              <div className="mr-2 flex min-w-0 items-center">
                <div
                  className={`mr-2 h-2.5 w-2.5 flex-none rounded-full bg-${item.color}-500`}
                />
                <span
                  className={classNames(
                    "truncate transition-colors",
                    tokens.legend,
                    onGradient ? "text-white/80" : text.body,
                  )}
                >
                  {item.label}
                </span>
              </div>
              <span
                className={classNames(
                  "flex-none font-bold",
                  tokens.legend,
                  onGradient ? "text-white" : text.heading,
                )}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatChartTile: React.FC<StatChartTileProps> = ({
  data,
  chartSize,
  title,
  color,
  label,
  tone,
  size = "md",
  gradient = false,
  ...rest
}) => {
  const tokens = CHART_TOKENS[size] ?? CHART_TOKENS.md;
  return (
    <StatCard
      {...rest}
      label={label ?? title}
      tone={tone ?? color}
      size={size}
      gradient={gradient}
      // The dataset stepper used to be this component's own prev/next header.
      // It is the base card's `pages` now, so every Stat variant gets it and
      // the clamping lives in one place.
      pages={data.map((dataset) => ({
        id: dataset.id,
        title: dataset.label,
        body: (
          <Donut
            dataset={dataset}
            tokens={tokens}
            chartSize={chartSize}
            onGradient={gradient}
          />
        ),
      }))}
    />
  );
};

StatChartTile.displayName = "StatChartTile";

export default StatChartTile;
