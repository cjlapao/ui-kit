/**
 * Public prop types for the Chart compound components.
 *
 * Names mirror the PrimeUI Pro compound API (categoryXField, valueYField,
 * fillOpacity, curve, …) so the two systems read the same.
 */
import type { ReactNode } from "react";
import type {
  Accessor,
  ChartAnimation,
  ChartColor,
  ChartMargins,
  ConnectNulls,
  LineCurve,
  MarkerShape,
} from "../engine/types";
import type { BarMode, BarOrientation } from "../engine/series/bar";

// ── Series ───────────────────────────────────────────────────────────────────

export interface LineSeriesProps<T = unknown> {
  data: T[];
  /** x-axis field (Date / number / string). Defaults to "category". */
  categoryXField?: Accessor<T, number | Date | string>;
  /** y value field. Null/undefined breaks the line. Defaults to "value". */
  valueYField?: Accessor<T, number | null | undefined>;
  /** Series name (legend, tooltip). */
  name?: string;
  /** Stable series id — defaults to an auto index. */
  id?: string;
  /** Tone name, hex, or gradient. */
  color?: ChartColor;
  /** Line interpolation. Defaults to "linear". */
  curve?: LineCurve;
  /** > 0 fills the area under the line (0.35 ≈ the reference demo). */
  fillOpacity?: number;
  /**
   * Fade the area fill from the series color (top) to transparent
   * (baseline) instead of a flat fill. Requires `fillOpacity > 0`.
   */
  areaGradient?: boolean;
  /** Stroke width in px. Default 2. */
  lineStrokeWidth?: number;
  /** Named dash styles. lineDash overrides when set. */
  lineStyle?: "solid" | "dashed" | "dotted";
  /** Custom dash pattern, e.g. [6, 4]. */
  lineDash?: number[];
  showMarkers?: boolean;
  markerShape?: MarkerShape;
  /** Marker radius in px. Default 3.5. */
  markerSize?: number;
  /** How to treat null values. Default "gap". */
  connectNulls?: ConnectNulls;
  /** "right" draws the series on the second y-axis. */
  yFieldAxis?: "left" | "right";
  /** Cap on plotted points (stride-decimated). */
  maxDataPoints?: number;
  /** Per-series entrance/update animation override. */
  animation?: ChartAnimation;
}

export interface BarSeriesProps<T = unknown> {
  data: T[];
  /** Category field. Defaults to "category". */
  categoryXField?: Accessor<T, string | number>;
  /** Value field. Defaults to "value". */
  valueYField?: Accessor<T, number>;
  name?: string;
  id?: string;
  color?: ChartColor;
  /** Layout. Default "group". */
  mode?: BarMode;
  /** Series sharing a stackId stack together (stack/percent). Default "default". */
  stackId?: string;
  orientation?: BarOrientation;
  /** Rounded bar corners in px (clamped to half the bar's width/height). */
  cornerRadius?: number;
  /** Pixel gap between stacked segments (stack/percent modes). */
  segmentGap?: number;
  animation?: ChartAnimation;
}

export interface PieSeriesProps<T = unknown> {
  data: T[];
  /** Value field. Default "value". */
  valueField?: Accessor<T, number>;
  /** Category/label field. Default "name". */
  categoryField?: Accessor<T, string>;
  name?: string;
  id?: string;
  /** Single color for all slices (labels keep the palette). */
  color?: ChartColor;
  /** Per-slice colors (cycled). */
  colors?: ChartColor[];
  /** Donut cutout as a 0–1 ratio of the outer radius. Default 0 (pie). */
  innerRadius?: number;
  /** Start angle in radians (d3 convention: 0 = 12 o'clock). */
  startAngle?: number;
  /** Sweep in radians. Default 2π. */
  sweepAngle?: number;
  /** Angular gap between slices in radians. Default 0. */
  padAngle?: number;
  /** Slice corner radius in px (clamped to the ring width / 2). Default 0. */
  cornerRadius?: number;
  /** Show percentage labels inside the slices. Default false. */
  showPercentLabels?: boolean;
  /**
   * Only label slices whose share of the total is at least this percent
   * (e.g. 5 = ≥5%). Default 5.
   */
  minPercentLabel?: number;
  animation?: ChartAnimation;
  /** Center content (donut). Rendered above the chart. */
  children?: ReactNode;
}

export interface PieCenterProps {
  /** Small caps label above the value (e.g. "ARR MIX"). */
  title?: string;
  /** Value shown when no slice is hovered. Default: formatted total. */
  value?: string | number;
  /** Small line under the value (e.g. "6 plans tracked"). */
  subtitle?: string;
  /** Formats the default (total) and hovered slice values. */
  valueFormatter?: (value: number) => string;
  /** Percent line under the hovered slice value. Defaults to "xx% of total". */
  hoverSubtitle?: (slice: { name: string; value: number; percent: number }) => string;
  /** Full custom body (replaces the default layout). */
  render?: (state: {
    hovered: { name: string; value: number; color: string; percent: number } | null;
    total: number;
  }) => ReactNode;
}

export type CandlestickVariant = "candle" | "hollow" | "ohlc";

export interface CandlestickSeriesProps<T = unknown> {
  data: T[];
  /** Time field. Defaults to "date". */
  categoryXField?: Accessor<T, number | Date | string>;
  openField?: Accessor<T, number>;
  highField?: Accessor<T, number>;
  lowField?: Accessor<T, number>;
  closeField?: Accessor<T, number>;
  name?: string;
  id?: string;
  /** Direction colors (defaults: emerald up / red down). */
  color?: { up?: ChartColor; down?: ChartColor };
  variant?: CandlestickVariant;
  /** Body width in px. Default: 60% of the step. */
  bodyWidth?: number;
  animation?: ChartAnimation;
}

// ── Axes ─────────────────────────────────────────────────────────────────────

export interface XAxisProps {
  /** Override the tick count. */
  tickCount?: number;
  /** Axis title. */
  label?: string;
  /** Horizontal gridlines. Default true (cartesian charts). */
  grid?: boolean;
  /** Custom tick formatter (linear: number → string; time: Date → string). */
  format?: (tick: number | Date) => string;
}

export interface YAxisProps {
  /** "right" renders the second y-axis. */
  axis?: "left" | "right";
  /** Fixed domain, e.g. [50, 350]. Auto-computed when omitted. */
  domain?: [number, number];
  tickCount?: number;
  label?: string;
  /** Horizontal gridlines. Default true. */
  grid?: boolean;
  /** Gridline stroke style. Default "solid". */
  gridDash?: "solid" | "dashed";
  /** Gridline opacity 0–1 (intensity). Default 1. */
  gridOpacity?: number;
  /** Tick labels + the domain line. Default true. */
  labels?: boolean;
  format?: (tick: number) => string;
}

// ── Overlays ─────────────────────────────────────────────────────────────────

export type TooltipMode = "shared" | "follow" | "crosshair";

export interface TooltipProps {
  /** Default "shared". */
  mode?: TooltipMode;
  /** Per-item value formatter. */
  itemFormat?: (value: number, name: string) => string;
  /** Time header formatter. Defaults to the full date. */
  headerFormat?: (rawX: number | Date | string) => string;
  /** Custom card body (overrides the default list). */
  children?: ReactNode;
}

export interface HoverProps {
  /** Callback with the hovered items. */
  onHover?: (state: unknown) => void;
}

export interface AxisBadgesProps {
  /**
   * "hover" — pills only while the pointer is over the plot, showing each
   * series' value at the hovered crosshair position.
   * "endpoints" — pills always visible at the last value of each series.
   * "both" — endpoint pills when idle, swapping to the hovered values
   * while hovering. Default "hover".
   */
  mode?: "hover" | "endpoints" | "both";
}

export interface LegendProps {
  /** Horizontal (default, top) or vertical (right). */
  orientation?: "horizontal" | "vertical";
  /** Where the legend sits. Default "top". */
  position?: "top" | "bottom";
  /** Custom entry content (swatch + label). */
  renderEntry?: (entry: {
    id: string;
    name: string;
    color: string;
    hidden: boolean;
    swatch: "line" | "area" | "bar" | "circle" | "candle";
    dash?: number[];
  }) => ReactNode;
}

export type DataLabelPosition = "last" | "all" | "none";

export interface DataLabelsProps {
  /** Which points get labels. Default "none". */
  position?: DataLabelPosition;
  /** Value formatter. Default: the raw value. */
  formatter?: (value: number, seriesName?: string) => string;
  /** "margin-left" places last-point labels in the left margin (badges). */
  anchor?: "auto" | "margin-left";
  /** Custom label node per point. */
  render?: (point: {
    seriesId: string;
    seriesName?: string;
    color: string;
    value: number;
    x: number;
    y: number;
    isLast: boolean;
  }) => ReactNode;
}

// ── Title / caption ──────────────────────────────────────────────────────────

export interface TitleProps {
  title?: string;
  subtitle?: string;
  /** Center the header (demos do). Default true. */
  centered?: boolean;
  children?: ReactNode;
}

export interface CaptionProps {
  text?: string;
  children?: ReactNode;
}

// ── Reference marks ──────────────────────────────────────────────────────────

export interface ReferenceLineProps {
  /** x value (number | Date | string category). */
  x?: number | Date | string;
  /** y value. */
  y?: number;
  color?: string;
  /** Dash pattern. Default [4, 4]. */
  dash?: number[];
  label?: string;
  /** Label placement. */
  labelPosition?: "start" | "end" | "center";
}

export interface ReferenceBandProps {
  x1?: number | Date | string;
  x2?: number | Date | string;
  y1?: number;
  y2?: number;
  /** Tone name or hex. */
  color?: string;
  /** Fill opacity. Default 0.1. */
  opacity?: number;
  /** Pill label at the band's top (phase windows). */
  label?: string;
}

export interface AnnotationProps {
  /** Marker point (data values). */
  x?: number | Date | string;
  y?: number;
  /** Tone name or hex for the marker + value row. */
  tone?: string;
  /** Card title row. */
  title?: string;
  /** Card value row (toned). */
  value?: string;
  /** Dashed leader line from the dot to the card. Default true. */
  leaderLine?: boolean;
  /** Card placement; "auto" flips near edges. */
  placement?: "auto" | "top" | "bottom" | "left" | "right";
}

// ── Root ─────────────────────────────────────────────────────────────────────

export interface ChartRootProps {
  /** Chart height in px. Default 400. Width follows the container. */
  height?: number;
  margin?: ChartMargins;
  /** "auto" follows the kit theme. Default "auto". */
  theme?: "auto" | "light" | "dark";
  /** Animation config; false disables all animations. */
  animation?: ChartAnimation;
  /** Loading state (boolean → built-in spinner, node → custom). */
  loading?: boolean | ReactNode;
  /** Error state (boolean → built-in message, node → custom). */
  error?: boolean | ReactNode;
  /** aria-label when no Chart.Title is present. */
  ariaLabel?: string;
  children: ReactNode;
}

// ── Handle exposed via ref ───────────────────────────────────────────────────

export interface ChartHandle {
  /** Re-read children props and repaint once (imperative, like PrimeUI). */
  redraw(): void;
}

// ── Internal descriptors (engine-facing) ────────────────────────────────────

export interface SeriesDescriptor {
  id: string;
  type: "line" | "bar" | "pie" | "candlestick";
  name?: string;
  color?: ChartColor;
  paletteIndex: number;
  data: unknown[];
  xAccessor: (item: unknown, index: number) => number | Date | string;
  yAccessor?: (item: unknown, index: number) => number | null | undefined;
  // line
  curve?: LineCurve;
  fillOpacity?: number;
  areaGradient?: boolean;
  lineStrokeWidth?: number;
  lineDash?: number[] | null;
  showMarkers?: boolean;
  markerShape?: MarkerShape;
  markerSize?: number;
  connectNulls?: ConnectNulls;
  yFieldAxis?: "left" | "right";
  maxDataPoints?: number;
  // bar
  barMode?: BarMode;
  stackId?: string;
  orientation?: BarOrientation;
  cornerRadius?: number;
  segmentGap?: number;
  // pie
  valueField?: (item: unknown, index: number) => number;
  categoryField?: (item: unknown, index: number) => string;
  innerRadius?: number;
  pieStartAngle?: number;
  pieSweepAngle?: number;
  piePadAngle?: number;
  pieCornerRadius?: number;
  pieColors?: ChartColor[];
  piePercentLabels?: boolean;
  pieMinPercentLabel?: number;
  // candlestick
  openAccessor?: (item: unknown, index: number) => number;
  highAccessor?: (item: unknown, index: number) => number;
  lowAccessor?: (item: unknown, index: number) => number;
  closeAccessor?: (item: unknown, index: number) => number;
  candleVariant?: CandlestickVariant;
  candleBodyWidth?: number;
  // animation
  animation?: ChartAnimation;
}
