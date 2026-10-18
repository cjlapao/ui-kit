import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip as RechartsTooltip,
} from "recharts";
import StatCard from "./StatCard";
import type { StatCardProps } from "./StatCard";
import { useSurfaceText } from "../contexts/SurfaceContext";
import { useIsDarkMode } from "../hooks/useIsDarkMode";
import type { ControlSize, TrueColor } from "../theme";
import type { PanelVariant } from "./Panel";
import { getColorPaletteNames } from "../theme";

export interface StatGraphSeries {
  key: string;
  label: string;
  /** Omit to auto-assign from the theme palette. */
  color?: TrueColor;
}

/** Which chart the tile draws. */
export const STAT_GRAPH_CHART_TYPES = ["bar", "sparkline"] as const;
export type StatGraphChartType = (typeof STAT_GRAPH_CHART_TYPES)[number];

/**
 * `StatCard` whose body is a chart. Every base prop applies unchanged —
 * including `variant`, `progress`, `trend`, `meta` and `footer`, all of which
 * this component used to strip off.
 *
 * `variant` here means the Panel surface, as it does on every other card. The
 * chart kind moved to `chartType`, because the two had collided: this
 * component declared `variant: "bar" | "sparkline"` and omitted the base
 * card's `variant`, so a graph tile was the one Stat component that could not
 * be given a surface.
 */
export interface StatGraphTileProps extends Omit<StatCardProps, "body" | "variant"> {
  data: any[];
  series: StatGraphSeries[];
  /** Which chart to draw. @default "bar" */
  chartType?: StatGraphChartType;
  /**
   * The Panel surface, as on every other card. Still accepts `"bar"` and
   * `"sparkline"` so existing call sites keep working — those are read as
   * `chartType` and the surface falls back to its default.
   */
  variant?: PanelVariant | StatGraphChartType;
  height?: number;
  showLegend?: boolean;
  showAxes?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  /** Y-axis domain for sparkline. Defaults to [0, 'auto']. Use ['auto', 'auto'] for auto-scaling. */
  yDomain?: [number | string, number | string];
  /** Enable chart enter/update animation. Keep disabled for high-frequency realtime updates. */
  chartAnimation?: boolean;
  /** Animation duration when chartAnimation is enabled. */
  chartAnimationDuration?: number;
  /** Optional cap for rendered data points to reduce chart redraw work. */
  maxDataPoints?: number;

  /** @deprecated Use `label`. */
  title?: React.ReactNode;
  /** @deprecated Use `tone`. */
  color?: TrueColor;
}

/** The sparkline's own readout scale, so it tracks the card's `size`. */
const SPARK_VALUE: Record<ControlSize, string> = {
  xs: "text-lg",
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-4xl",
  xl: "text-5xl",
};

const isChartType = (value: unknown): value is StatGraphChartType =>
  value === "bar" || value === "sparkline";

// ── Portal tooltip (same approach as MultiProgressBar) ────────────────────────

interface TooltipState {
  x: number;
  y: number;
  payload: any[];
  label: string;
}

interface TooltipSnapshot {
  x: number;
  y: number;
  label: string;
  keys: string;
  values: string;
}

function PortalTooltip({
  tooltip,
  series,
  getColor,
}: {
  tooltip: TooltipState | null;
  series: StatGraphSeries[];
  getColor: (color: string) => string;
}) {
  if (!tooltip || tooltip.payload.length === 0) return null;

  return createPortal(
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: tooltip.x,
        top: tooltip.y,
        transform: "translate(-50%, calc(-100% - 12px))",
      }}
    >
      <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl ring-1 ring-black/10 dark:ring-black/5 min-w-[100px]">
        {tooltip.payload.map((entry: any) => {
          const s = series.find((s) => s.key === entry.dataKey);
          return (
            <div key={entry.dataKey} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: entry.fill ?? getColor(s?.color ?? "blue"),
                }}
              />
              <span className="font-semibold">{entry.value}</span>
              {s && (
                <span className="text-neutral-400 dark:text-neutral-500">
                  {s.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {/* Arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-[5px] border-x-transparent border-t-[5px] border-t-neutral-900 dark:border-t-white" />
    </div>,
    document.body,
  );
}

// Recharts custom content — renders nothing; we use it only to intercept hover state
function SilentTooltipContent() {
  return null;
}

// ── StatGraphTile ─────────────────────────────────────────────────────────────

const StatGraphTile: React.FC<StatGraphTileProps> = ({
  data,
  variant,
  chartType,
  series,
  height = 200,
  showLegend = true,
  showAxes = true,
  showGrid = true,
  showTooltip = true,
  yDomain = [0, "auto"],
  chartAnimation = true,
  chartAnimationDuration = 250,
  maxDataPoints = 0,
  title,
  color,
  label,
  tone,
  size = "md",
  gradient = false,
  actions,
  ...props
}) => {
  // `variant` used to *be* the chart kind. Read it as one when it holds one of
  // those two values, so old call sites keep drawing the chart they asked for
  // while the surface falls back to Panel's default.
  const resolvedChartType: StatGraphChartType =
    chartType ?? (isChartType(variant) ? variant : "bar");
  const surfaceVariant = isChartType(variant) ? undefined : variant;
  const resolvedTone = tone ?? color;
  const text = useSurfaceText();
  const isDark = useIsDarkMode();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipFrameRef = useRef<number | null>(null);
  const tooltipSnapshotRef = useRef<TooltipSnapshot | null>(null);

  useEffect(() => {
    return () => {
      if (tooltipFrameRef.current != null) {
        cancelAnimationFrame(tooltipFrameRef.current);
      }
    };
  }, []);

  // Graph colors helper
  const getColor = useCallback((color: string) => {
const colorMap: Record<string, string> = {
    // Spectrum colors (Tailwind 500 hex values)
    red: "#ef4444",
    orange: "#f97316",
    amber: "#f59e0b",
    yellow: "#eab308",
    lime: "#84cc16",
    green: "#22c55e",
    emerald: "#10b981",
    teal: "#14b8a6",
    cyan: "#06b6d4",
    sky: "#0ea5e9",
    blue: "#3b82f6",
    indigo: "#6366f1",
    violet: "#8b5cf6",
    purple: "#a855f7",
    fuchsia: "#d946ef",
    pink: "#ec4899",
    rose: "#f43f5e",
    slate: "#64748b",
    gray: "#6b7280",
    zinc: "#71717a",
    neutral: "#737373",
    stone: "#78716c",
  };
    return colorMap[color] || "#3b82f6";
  }, []);

  const resolvedSeries = useMemo(() => {
    const palette = getColorPaletteNames(series.length);
    return series.map((s, i) => ({
      ...s,
      color: (s.color ?? palette[i]) as TrueColor,
    }));
  }, [series]);

  const chartData = useMemo(() => {
    if (!maxDataPoints || maxDataPoints <= 0 || data.length <= maxDataPoints)
      return data;
    return data.slice(-maxDataPoints);
  }, [data, maxDataPoints]);

  const queueTooltipUpdate = useCallback((next: TooltipState | null) => {
    if (tooltipFrameRef.current != null) {
      cancelAnimationFrame(tooltipFrameRef.current);
    }

    tooltipFrameRef.current = requestAnimationFrame(() => {
      tooltipFrameRef.current = null;

      if (!next) {
        if (tooltipSnapshotRef.current === null) return;
        tooltipSnapshotRef.current = null;
        setTooltip(null);
        return;
      }

      const snapshot: TooltipSnapshot = {
        x: next.x,
        y: next.y,
        label: next.label,
        keys: next.payload
          .map((entry: any) => String(entry.dataKey ?? ""))
          .join("|"),
        values: next.payload
          .map((entry: any) => String(entry.value ?? ""))
          .join("|"),
      };

      const prev = tooltipSnapshotRef.current;
      if (
        prev &&
        prev.x === snapshot.x &&
        prev.y === snapshot.y &&
        prev.label === snapshot.label &&
        prev.keys === snapshot.keys &&
        prev.values === snapshot.values
      ) {
        return;
      }

      tooltipSnapshotRef.current = snapshot;
      setTooltip(next);
    });
  }, []);

  // Custom Recharts tooltip renderer — silently tracks hover position/payload into portal state
  const rechartsTooltipContent = useCallback(
    ({ active, payload, label, coordinate }: any) => {
      if (!showTooltip) return null;
      if (active && payload && payload.length > 0 && coordinate) {
        const wrapperEl = wrapperRef.current;
        if (wrapperEl) {
          const rect = wrapperEl.getBoundingClientRect();
          const absX = rect.left + (coordinate.x ?? 0);
          const absY = rect.top + (coordinate.y ?? 0);
          queueTooltipUpdate({ x: absX, y: absY, payload, label: label ?? "" });
        }
      } else {
        queueTooltipUpdate(null);
      }
      return <SilentTooltipContent />;
    },
    [showTooltip, queueTooltipUpdate],
  );

  // Legend (bar only)
  const customActions = useMemo(() => {
    if (!showLegend || resolvedChartType !== "bar") return null;
    return (
      <div className="flex items-center space-x-4">
        {resolvedSeries.map((s) => (
          <div key={s.key} className="flex items-center">
            <div
              className="w-2.5 h-2.5 rounded-full mr-2"
              style={{ backgroundColor: getColor(s.color) }}
            />
            <span
              className={classNames(
                "text-xs font-medium",
                gradient ? "text-white/70" : text.muted,
              )}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    );
  }, [showLegend, resolvedChartType, resolvedSeries, getColor, gradient, text.muted]);

  // Recharts writes these into presentation attributes, where a `dark:`
  // utility has no effect — so both were light-mode values on every card,
  // including dark ones and gradient washes.
  const axisColor = gradient
    ? "rgba(255,255,255,0.7)"
    : isDark
      ? "#94a3b8"
      : "#64748b";
  const gridColor = gradient
    ? "rgba(255,255,255,0.2)"
    : isDark
      ? "#334155"
      : "#e2e8f0";

  const renderChart = () => {
    if (resolvedChartType === "bar") {
      return (
        <div
          ref={wrapperRef}
          className="relative"
          onMouseLeave={() => queueTooltipUpdate(null)}
        >
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={chartData}
              barSize={8}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={gridColor}
                  opacity={0.5}
                />
              )}
              {showAxes && (
                <>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: axisColor, fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: axisColor, fontSize: 12 }}
                  />
                </>
              )}
              <RechartsTooltip
                content={rechartsTooltipContent}
                cursor={{ fill: "rgba(100,116,139,0.05)" }}
                isAnimationActive={false}
              />
              {resolvedSeries.map((s) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  fill={getColor(s.color)}
                  radius={[4, 4, 4, 4]}
                  isAnimationActive={chartAnimation}
                  animationDuration={
                    chartAnimation ? chartAnimationDuration : 0
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <PortalTooltip
            tooltip={tooltip}
            series={resolvedSeries}
            getColor={getColor}
          />
        </div>
      );
    }

    if (resolvedChartType === "sparkline") {
      return (
        <div
          ref={wrapperRef}
          className="relative"
          onMouseLeave={() => queueTooltipUpdate(null)}
        >
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={chartData}>
              <YAxis domain={yDomain} hide />
              <Line
                type="monotone"
                dataKey={resolvedSeries[0].key}
                stroke={getColor(resolvedSeries[0].color)}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
                isAnimationActive={chartAnimation}
                animationDuration={chartAnimation ? chartAnimationDuration : 0}
              />
              {showTooltip && (
                <RechartsTooltip
                  content={rechartsTooltipContent}
                  cursor={false}
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
          <PortalTooltip
            tooltip={tooltip}
            series={resolvedSeries}
            getColor={getColor}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <StatCard
      {...props}
      label={label ?? title}
      tone={resolvedTone}
      size={size}
      gradient={gradient}
      variant={surfaceVariant}
      actions={customActions ?? actions}
      body={
        <div className="flex h-full w-full flex-col">
          {resolvedChartType === "sparkline" && (
            <div className="mt-2 mb-4 px-1">
              {renderChart()}
              <div className="mt-4">
                <div
                  className={classNames(
                    "font-bold",
                    SPARK_VALUE[size] ?? SPARK_VALUE.md,
                    gradient ? "text-white" : text.heading,
                  )}
                >
                  {props.value}
                </div>
                {props.subtitle && (
                  <div
                    className={classNames(
                      "mt-1 text-sm",
                      gradient ? "text-white/70" : text.muted,
                    )}
                  >
                    {props.subtitle}
                  </div>
                )}
              </div>
            </div>
          )}
          {resolvedChartType === "bar" && (
            <div className="mt-4">{renderChart()}</div>
          )}
        </div>
      }
    />
  );
};

StatGraphTile.displayName = "StatGraphTile";

export default StatGraphTile;
