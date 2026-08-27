/**
 * Chart loading skeleton — a chart-shaped pulsing placeholder rendered
 * in place of the chart while `loading` is true and
 * `loaderType="skeleton"` (the default). Plain inline styles, matching
 * the chart's self-contained styling (no Tailwind).
 */
import React from "react";

export interface ChartSkeletonProps {
  hasTitle: boolean;
  hasSubtitle: boolean;
  hasLegend: boolean;
  legendPosition?: "top" | "right" | "bottom" | "left";
  /** Muted bar color (theme-derived). */
  barColor: string;
  /** Lighter plot-rect fill. */
  plotColor: string;
}

const BAR_RADIUS = 999;

const Bar: React.FC<{
  width?: string | number;
  height: number;
  color: string;
  radius?: number;
}> = ({ width = "100%", height, color, radius = BAR_RADIUS }) => (
  <span
    style={{
      display: "block",
      width,
      height,
      borderRadius: radius,
      background: color,
      flexShrink: 0,
    }}
  />
);

/**
 * Placeholder shaped like a chart: optional title/subtitle bars, an
 * optional legend pill row, and a plot rectangle with gridline bars.
 * Keeps the chart's total height so the page layout doesn't jump.
 */
export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  hasTitle,
  hasSubtitle,
  hasLegend,
  legendPosition = "top",
  barColor,
  plotColor,
}) => {
  const horizontalLegend =
    hasLegend && (legendPosition === "top" || legendPosition === "bottom");
  return (
    <div
      data-chart-loading="skeleton"
      aria-hidden="true"
      className="dsh-chart-anim"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "14px 16px",
        animation: "dsh-chart-pulse 1.6s ease-in-out infinite",
      }}
    >
      {(hasTitle || hasSubtitle) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {hasTitle && <Bar width="55%" height={16} color={barColor} />}
          {hasSubtitle && <Bar width="35%" height={11} color={barColor} />}
        </div>
      )}
      {horizontalLegend && (
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent:
              legendPosition === "top" ? "flex-end" : "flex-end",
          }}
        >
          {[64, 48, 56].map((w, i) => (
            <Bar key={i} width={w} height={9} color={barColor} />
          ))}
        </div>
      )}
      <div
        style={{
          position: "relative",
          flex: 1,
          borderRadius: 8,
          background: plotColor,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          padding: "0 8px",
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <Bar key={i} width="100%" height={2} color={barColor} radius={1} />
        ))}
        <Bar width="100%" height={2} color={barColor} radius={1} />
      </div>
    </div>
  );
};

ChartSkeleton.displayName = "ChartSkeleton";
