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
import type { HeatmapCellDatum } from "../engine/series/heatmap";
import type { GridStyle } from "../engine/grid";
import type { BarMode, BarOrientation } from "../engine/series/bar";

// ── Series ───────────────────────────────────────────────────────────────────

// ── Shared area fill ─────────────────────────────────────────────────────────

/**
 * Shared fill props for area-capable series (line with fill, range area).
 * Either a flat color at an opacity or a gradient fading to transparent.
 */
export interface AreaFillProps {
  /**
   * Fill style: flat solid color, or a gradient fading to transparent.
   * Default "flat".
   */
  fillStyle?: "flat" | "gradient";
  /** Fill color; defaults to the series color. */
  fillColor?: string;
  /**
   * 0–1. Flat mode: solid opacity. Gradient mode: starting opacity (the
   * end of the gradient is always fully transparent).
   */
  fillOpacity?: number;
  /** Gradient direction. Default "vertical". */
  fillDirection?: "vertical" | "horizontal";
}

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
   * @deprecated Use `fillStyle="gradient"` (requires `fillOpacity > 0`).
   * Fade the area fill from the series color (top) to transparent
   * (baseline) instead of a flat fill.
   */
  areaGradient?: boolean;
  /** Fill style (flat / gradient). Default "flat". */
  fillStyle?: "flat" | "gradient";
  /** Fill color; defaults to the series color. */
  fillColor?: string;
  /** Gradient direction. Default "vertical". */
  fillDirection?: "vertical" | "horizontal";
  /**
   * Where the area fill closes. "zero" (default) closes to the axis
   * baseline; "field" closes to another field's curve (fill between two
   * lines, via `fillBaselineField`). Requires `fillOpacity > 0`.
   */
  fillBaseline?: "zero" | "field";
  /** The second line's field for `fillBaseline="field"`. */
  fillBaselineField?: Accessor<T, number | null | undefined>;
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

export interface WaterfallColors {
  /** Positive deltas. Default: green. */
  up?: string;
  /** Negative deltas. Default: rose. */
  down?: string;
  /** Total bars. Default: indigo. */
  total?: string;
}

export interface WaterfallLayer {
  name: string;
  value: number;
  color?: string;
}

export interface WaterfallSeriesProps<T = unknown> {
  data: T[];
  /** Category field. Default "category". */
  categoryXField?: Accessor<T, string | number>;
  /** Step value field. Default "value". */
  valueYField?: Accessor<T, number>;
  /**
   * Marks total steps (bars anchored at zero that reset the running
   * total to their value). Accepts a field name (truthy test) or a
   * predicate.
   */
  totalField?: string | ((item: T, index: number) => boolean);
  /**
   * Stacked layers per step; the step value is their sum and the
   * running total accumulates the combined value.
   */
  layersField?: Accessor<T, WaterfallLayer[]>;
  /** Layout. Default "vertical". */
  orientation?: "vertical" | "horizontal";
  /** Color routing by contribution type (per-datum `color` wins). */
  colors?: WaterfallColors;
  /** Per-datum explicit color. */
  color?: Accessor<T, string> | ChartColor;
  /** Signed value labels. Default true. */
  valueLabels?: boolean;
  /** Label formatter. Default: signed value. */
  valueLabelFormat?: (delta: number, item: T, index: number) => string;
  /** Dashed running-total connectors between bars. */
  connectors?: boolean;
  /** Rounded bar corners in px. */
  cornerRadius?: number;
  name?: string;
  id?: string;
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
  /**
   * Nightingale (rose) mode: equal slice angles, each slice's radius
   * encodes its value (smallest at the hub, largest at the outer ring).
   * Implies outside category labels.
   */
  nightingale?: boolean;
  /** Show outside category labels (name + value with a leader spoke). Default: on for nightingale. */
  showLabels?: boolean;
  /**
   * Nightingale only: per-slice colored radial ticks just outside the ring.
   */
  nightingaleTicks?: boolean;
  /**
   * Nightingale only: rounded group arcs outside the ring. `from`/`to` are
   * inclusive slice indices; the arc spans that slice range.
   */
  nightingaleBands?: { from: number; to: number; color: string }[];
  /**
   * Nightingale only: bold label centered in the max-value slice
   * (default "PEAK"). Omit to disable.
   */
  peakLabel?: string;
  /**
   * Ring size as a 0–1 ratio of the available plot radius (default 1).
   * Lower it to give outside labels / captions headroom.
   */
  outerRadius?: number;
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

export interface GaugeTicksOptions {
  /** Number of tick intervals across the span. Default 20. */
  count?: number;
  /** Every Nth tick is a major (longer) tick. Default 5. */
  majorEvery?: number;
  /** Tick length in px outside the arc. Default 8. */
  length?: number;
}

export interface GaugeSeriesProps {
  /** The current reading. */
  value: number;
  /** Minimum value of the span. Default 0. */
  min?: number;
  /** Maximum value of the span. Default 100. */
  max?: number;
  name?: string;
  id?: string;
  /** Fallback color when no zones cover a span. */
  color?: ChartColor;
  /**
   * Sweep in radians. Default 270° (1.5π); the gap is centered at 6 o'clock
   * unless `startAngle` is given.
   */
  arcSpan?: number;
  /** Start angle in radians (d3 convention: 0 = 12 o'clock). */
  startAngle?: number;
  /** Donut cutout as a 0–1 ratio of the outer radius. Default 0.78. */
  innerRadius?: number;
  /**
   * Color stops in value space. Rendered as subdivided segments with color
   * interpolation at zone boundaries — narrow zones read as a smooth ramp,
   * wide single-color zones stay flat.
   */
  zones?: Array<{ from: number; to: number; color: string }>;
  /** Tick marks outside the arc. Absent = no ticks. */
  ticks?: GaugeTicksOptions;
  /** Marker dot on the arc at this value. */
  target?: number;
  /** Label rendered outside the target marker. */
  targetLabel?: string;
  animation?: ChartAnimation;
}

export type CandlestickVariant = "candle" | "hollow" | "ohlc";

export interface RangeAreaSeriesProps<T = unknown> {
  data: T[];
  /** x-axis field (Date / number / string). Defaults to "category". */
  categoryXField?: Accessor<T, number | Date | string>;
  /** Lower (min) edge field. Defaults to "min". */
  minYField?: Accessor<T, number | null | undefined>;
  /** Upper (max) edge field. Defaults to "max". */
  maxYField?: Accessor<T, number | null | undefined>;
  /** Series name (legend, tooltip). */
  name?: string;
  /** Stable series id — defaults to an auto index. */
  id?: string;
  /** Tone name, hex, or gradient. */
  color?: ChartColor;
  /** Edge interpolation. Defaults to "linear". */
  curve?: LineCurve;
  /** Stroke the band edges in the series color. Default true. */
  showEdges?: boolean;
  /** Edge stroke width in px. Default 2. */
  edgeStrokeWidth?: number;
  /** How to treat missing edges (gaps). Default "gap". */
  connectNulls?: ConnectNulls;
  /** "right" draws the series on the second y-axis. */
  yFieldAxis?: "left" | "right";
  /** Cap on plotted points (stride-decimated). */
  maxDataPoints?: number;
  /** Fill style (flat / gradient). Default "gradient". */
  fillStyle?: "flat" | "gradient";
  /** Fill color; defaults to the series color. */
  fillColor?: string;
  /** 0–1. Flat: solid opacity. Gradient: starting opacity. Default 0.4. */
  fillOpacity?: number;
  /** Gradient direction. Default "vertical". */
  fillDirection?: "vertical" | "horizontal";
  /** Per-series entrance/update animation override. */
  animation?: ChartAnimation;
}

/**
 * Radar (spider) chart series — one polygon per series on a shared axis
 * set (derived from all radar children's data).
 */
export interface RadarSeriesProps<T = unknown> {
  data: T[];
  /** Axis (category) field — one row per axis. Defaults to "axis". */
  axisField?: Accessor<T, string>;
  /** Value field for this series. Required. */
  valueYField?: Accessor<T, number | null | undefined>;
  /** Series name (legend, tooltip). */
  name?: string;
  /** Stable series id — defaults to an auto index. */
  id?: string;
  /** Tone name, hex, or gradient. */
  color?: ChartColor;
  /** Dash pattern for the polygon outline, e.g. [6, 4]. */
  lineDash?: number[];
  /** Outline stroke width in px. Default 2. */
  lineStrokeWidth?: number;
  /** Point markers on the vertices. Default true. */
  showMarkers?: boolean;
  /** Marker radius in px. Default 3. */
  markerSize?: number;
  /**
   * A goal value: a dot on the first axis at `goal` with `goalLabel`
   * beside it (series-colored) — e.g. "Launch-ready ≥ 80 pts".
   */
  goal?: number;
  goalLabel?: string;
  /**
   * Fill style: flat solid color, or a radial gradient (edge opacity →
   * transparent at the center). Default "flat".
   */
  fillStyle?: "flat" | "gradient";
  /** Fill color; defaults to the series color. */
  fillColor?: string;
  /** 0–1 polygon fill opacity. Default 0.18. */
  fillOpacity?: number;
  /** Per-series entrance/update animation override. */
  animation?: ChartAnimation;
}

/** Shared radar grid configuration. */
export interface RadarAxisProps {
  /** Number of concentric rings. Default 4. */
  rings?: number;
  /** Outer ring value; defaults to a nice max of the radar values. */
  domainMax?: number;
  /** Ring tick label format, e.g. (t) => `${t} pts`. */
  tickFormat?: (value: number) => string;
  /** Draw the axis name labels around the perimeter. Default true. */
  showAxisLabels?: boolean;
  /** Ring stroke style. Default "solid". */
  gridStyle?: GridStyle;
  /** Ring stroke width in px. Default 1. */
  gridWidth?: number;
  /** Ring stroke color. Default: theme grid color. */
  gridColor?: string;
  /** Ring opacity 0–1. Default 1. */
  gridOpacity?: number;
}

/** Shared polar grid configuration (root-consumed, renders null). */
export interface PolarAxisProps {
  /** Ring shape. Default "circle". */
  gridShape?: "circle" | "polygon";
  /** Number of concentric rings. Default 4. */
  gridLines?: number;
  /** Ring stroke style. Default "solid". */
  gridStyle?: GridStyle;
  /** Ring stroke width in px. Default 1. */
  gridWidth?: number;
  /** Ring stroke color. Default: theme grid color. */
  gridColor?: string;
  /** Ring opacity 0–1. Default 1. */
  gridOpacity?: number;
  /** Value labels on the rings (top axis). Default false. */
  showTickLabels?: boolean;
  /** Ring tick label format. */
  tickFormat?: (value: number) => string;
  /** Outer ring value; defaults to a nice max of the polar values. */
  domainMax?: number;
  /** Sort categories by value. Default "none". */
  sort?: "none" | "desc" | "asc";
}

/** One polar (rose) series. */
export interface PolarSeriesProps<T = unknown> {
  data: T[];
  /** Category field. Default "category". */
  categoryField?: Accessor<T, string | number>;
  /** Value field. Default "value". */
  valueYField?: Accessor<T, number>;
  name?: string;
  id?: string;
  color?: ChartColor;
  /** "group" = side-by-side sub-arcs; "stack" = radial stack. Default "group". */
  mode?: "group" | "stack";
  /** Hole radius as a fraction of the outer radius (0–1). Default 0. */
  innerRadius?: number;
  /** Angular gap between segments (px at the outer radius). Default auto (3). */
  segmentGap?: number;
  /** Segment corner radius (px). Default 0. */
  segmentRadius?: number;
  /** Segment outline width (px), series color. Default 0. */
  borderWidth?: number;
  /** Perimeter category labels. Default true. */
  showLabels?: boolean;
  /** Hovered segment brightness. Default 1.1. */
  hoverBrightness?: number;
  /** Hovered segment radial pop (px). Default 4. */
  hoverOffset?: number;
  /** Per-series entrance/update animation override. */
  animation?: ChartAnimation;
}

export interface PolarCenterProps {
  /** Small caps label above the value (e.g. "AUTONOMOUS SHARE"). */
  title?: string;
  /** Value shown when no segment is hovered. */
  value?: string | number;
  /** Small line under the value. */
  subtitle?: string;
  /** Formats the default (numeric) value. */
  valueFormatter?: (value: number) => string;
  /** Full custom body. */
  render?: (state: {
      hovered: { name: string; value: number; color: string } | null
    }) => ReactNode;
}

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
  /**
   * Highlight the hovered candle (lighter color, wider body) with a
   * close-price pill above its wick. Default true.
   */
  highlightSelected?: boolean;
  animation?: ChartAnimation;
}

// ── Scatter / Bubble ─────────────────────────────────────────────────────────

export interface HeatmapAnnotation {
  /** Row category the pill is anchored to. */
  row: string;
  /** Column category the pill is anchored to. */
  col: string;
  label: string;
  tone?: "red" | "amber" | "neutral";
}

export interface HeatmapSeriesProps<T = unknown> {
  data: T[];
  /** Explicit row (y) categories in display order. Derived from the data when omitted. */
  rows?: string[];
  /** Explicit column (x) categories in display order. Derived from the data when omitted. */
  cols?: string[];
  /** Row category field. Default "row". */
  categoryYField?: Accessor<T, string | number>;
  /** Column category field. Default "col". */
  categoryXField?: Accessor<T, string | number>;
  /** Cell value field. Missing/non-finite values render as null cells. Default "value". */
  valueField?: Accessor<T, number>;
  /**
   * Color scale stops (2+ hex colors). Values map linearly (RGB) across
   * the stops over `domain`.
   * @default ["#dbeafe", "#3b82f6", "#7c3aed"]
   */
  colorStops?: string[];
  /** Value range for the color scale. Default: data min/max. */
  domain?: [number, number];
  /** Fill for missing (null) cells. Omit to leave them empty. */
  nullColor?: string;
  /** Draw the value inside each cell. Default false. */
  valueLabels?: boolean;
  /** Value label formatter. Default: 2 decimals. */
  valueLabelFormat?: (value: number, item: unknown, index: number) => string;
  /** Optional second-line tier label under the value (e.g. WEAK / MOD / STRONG). */
  tierLabel?: (value: number, item: unknown, index: number) => string | null;
  /** Gap between cells in px. Default 3. */
  cellGap?: number;
  /** Cell corner radius in px. Default 3. */
  cornerRadius?: number;
  /** Show row labels in the left gutter. Default true. */
  rowLabels?: boolean;
  /** Show column labels below the grid. Default true. */
  colLabels?: boolean;
  /** Width of the row-label gutter in px. Default: heuristic from the labels. */
  rowLabelWidth?: number;
  /** Draw the gradient legend bar under the grid. Default true. */
  showLegend?: boolean;
  /** Legend tick count (evenly spaced over the domain). Default 3. */
  legendTicks?: number;
  /** Cell-anchored pills (e.g. callouts on a specific row/col). */
  annotations?: HeatmapAnnotation[];
  name?: string;
  id?: string;
  color?: ChartColor;
  animation?: boolean | "grow" | "fade";
}

export interface TreemapSeriesProps<T = unknown> {
  data: T[];
  /** Tile label field. Default "name". */
  categoryField?: Accessor<T, string | number>;
  /** Tile value field. Default "value". */
  valueField?: Accessor<T, number>;
  /**
   * Group field. When set, tiles cluster into regions — one squarified
   * region per group (by group total) with an uppercase header band.
   */
  groupField?: Accessor<T, string | number>;
  /** Uniform fill for all tiles (beats palette). */
  color?: ChartColor;
  /** Per-tile fills, by tile (data) order. */
  colors?: ChartColor[];
  /** Per-tile fill callback. */
  colorAccessor?: (item: unknown, index: number) => string | undefined;
  /** Show tile labels. Default true. */
  showLabels?: boolean;
  /** Tile label formatter. */
  labelFormat?: (label: string, item: unknown, index: number) => string;
  /**
   * Draw the value in the bottom-left corner (stock-tile style); the
   * title moves to the top-left. Default false.
   */
  valueLabels?: boolean;
  /** Value label formatter. Default: String(v). */
  valueLabelFormat?: (value: number, item: unknown, index: number) => string;
  /**
   * Signed numeric field → a delta pill under the title (▲ green /
   * ▼ red). Missing or 0 → no pill.
   */
  deltaField?: Accessor<T, number>;
  /** Delta pill text (the glyph is drawn, the sign is not). Default `${Math.abs(v)}%`. */
  deltaFormat?: (value: number, item: unknown, index: number) => string;
  /** Gap between tiles in px. Default 2. */
  gap?: number;
  /** Tile corner radius in px. Default 0. */
  cornerRadius?: number;
  /** Group header band height in px. Default 18. */
  groupHeaderHeight?: number;
  name?: string;
  id?: string;
  animation?: boolean | "grow" | "fade";
}

export interface ScatterSeriesProps<T = unknown> {
  data: T[];
  /** x field (number | Date). Defaults to "x". */
  xField?: Accessor<T, number | Date | string>;
  /** y field (number). Defaults to "y". */
  yField?: Accessor<T, number>;
  /**
   * Size field (bubble mode). When set, radii scale area-proportionally
   * between `minSize` and `maxSize`; when omitted all dots render at
   * `minSize`.
   */
  sizeField?: Accessor<T, number>;
  /** Smallest marker radius in px. Default 6. */
  minSize?: number;
  /** Largest marker radius in px (bubble mode). Default 30. */
  maxSize?: number;
  name?: string;
  id?: string;
  color?: ChartColor;
  /** Plot on the right y-axis instead of the left. */
  yFieldAxis?: "left" | "right";
  /** Marker shape. Default "circle". */
  markerShape?: MarkerShape;
  /** Point opacity 0–1. Default 1. */
  opacity?: number;
  /** Point fill opacity 0–1. Default 1. */
  fillOpacity?: number;
  /** Point border width in px. Default 0. */
  borderWidth?: number;
  /** Point border color. Default: a darker shade of the series color. */
  borderColor?: string;
  /** Extra hit radius in px around each point. Default 2. */
  pointHitRadius?: number;
  /** Hovered-point growth factor. Default 1.3. */
  hoverRadiusMultiplier?: number;
  /**
   * Explicit hovered-point radius in px — overrides
   * `hoverRadiusMultiplier` when set.
   */
  hoverSize?: number;
  /** Hovered-point brightness (1 = off). Default 1.1. */
  hoverBrightness?: number;
  /**
   * Hovered-point fill: "auto" keeps the series color, or a hex/`hsl()`
   * override. Default "auto".
   */
  hoverBackgroundColor?: "auto" | string;
  /** Hovered-point border width in px. Default 0. */
  hoverBorderWidth?: number;
  /** Hovered-point border color. Default: a lighter shade of the fill. */
  hoverBorderColor?: string;
  animation?: ChartAnimation;
}

// ── Axes ─────────────────────────────────────────────────────────────────────

export interface XAxisProps {
  /** Override the tick count. */
  tickCount?: number;
  /** Axis title. */
  label?: string;
  /** Vertical gridlines. Default true (cartesian, non-categorical). */
  grid?: boolean;
  /** Gridline stroke style. Default "solid". */
  gridDash?: "solid" | "dashed";
  /** Gridline stroke style (solid | dashed | dotted). Absorbs gridDash. */
  gridStyle?: GridStyle;
  /** Gridline stroke width in px. Default 1. */
  gridWidth?: number;
  /** Gridline color. Default: theme grid color. */
  gridColor?: string;
  /** Gridline opacity 0–1 (intensity). Default 1. */
  gridOpacity?: number;
  /** Log-10 scale (numeric domains only). Default false. */
  log?: boolean;
  /** Custom tick formatter (linear: number → string; time: Date → string). */
  format?: (tick: number | Date) => string;
  /** The solid domain line under the ticks. Default true. */
  axisLine?: boolean;
  /** Tick labels. Default true. */
  labels?: boolean;
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
  /** Gridline stroke style (solid | dashed | dotted). Absorbs gridDash. */
  gridStyle?: GridStyle;
  /** Gridline stroke width in px. Default 1. */
  gridWidth?: number;
  /** Gridline color. Default: theme grid color. */
  gridColor?: string;
  /** Gridline opacity 0–1 (intensity). Default 1. */
  gridOpacity?: number;
  /** Log-10 scale (positive domains only). Default false. */
  log?: boolean;
  /** Tick labels (text only). Default true. */
  labels?: boolean;
  /** The solid domain line. Default true. */
  axisLine?: boolean;
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
  /**
   * Custom per-item rows (replaces the single formatted-value row).
   * `item.item` is the raw data row; use it to compute deltas/context.
   */
  rows?: (item: import("../engine/types").HoverItem) => {
    label: string;
    value: string;
    color?: string;
  }[];
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
  /**
   * Second endpoint. When BOTH `x2` and `y2` are given the line is drawn
   * as a two-point (sloped) segment from (x, y) to (x2, y2) in data
   * values — e.g. ROI diagonals on log-log axes.
   */
  x2?: number | Date | string;
  y2?: number;
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
  /**
   * Opacity (0–1) for non-hovered series while a tooltip is active.
   * Default 1 (off). Applies to every chart type.
   */
  hoverDim?: number;
  /**
   * Cartesian axis chrome master switch ("tile mode"). When false:
   * axis children render nothing and the plot area reclaims the
   * reserved axis margins (full-area plot). Scales, hover and
   * tooltips are unaffected. Default true.
   */
  axes?: boolean;
  /**
   * Built-in loader kind, used when `loading` is `true`.
   * - "skeleton" — a chart-shaped pulsing placeholder replaces the
   *   chart (default; the data is unknown, so there is nothing to
   *   render beneath)
   * - "spinner" / "progress" — the chart renders beneath a kit
   *   <Loader> overlay (title/message/progress/color props apply)
   */
  loaderType?: "skeleton" | "spinner" | "progress";
  /** Overlay title line (spinner/progress loader kinds). */
  loaderTitle?: ReactNode;
  /** Overlay label line (spinner/progress loader kinds). */
  loaderMessage?: ReactNode;
  /** Progress value for the progress loader kind. Default 0. */
  loaderProgress?: number;
  /** Spinner/progress tone. Default "blue". */
  loaderColor?: import("../../Spinner").SpinnerColor;
  /**
   * Opt in to hover sync with sibling `sync` charts inside a
   * `Chart.Group`: hovering this chart drives crosshair + tooltip on
   * the others at the same category, and vice versa. Sync is keyed on
   * the shared categorical x value, not pixels. Only cartesian
   * members participate; non-cartesian series (pie, gauge, heatmap,
   * treemap) keep local hover.
   */
  sync?: boolean;
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
  type:
    | "line"
    | "bar"
    | "pie"
    | "candlestick"
    | "rangeArea"
    | "radar"
    | "polar"
    | "scatter"
    | "gauge"
    | "waterfall"
    | "heatmap"
    | "treemap";
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
  /** Resolved fill style (areaGradient aliases fold into this). */
  fillStyle?: "flat" | "gradient";
  fillColor?: string;
  fillDirection?: "vertical" | "horizontal";
  fillBaseline?: "zero" | "field";
  fillBaselineAccessor?: (item: unknown, index: number) => number | null | undefined;
  lineStrokeWidth?: number;
  lineDash?: number[] | null;
  showMarkers?: boolean;
  markerShape?: MarkerShape;
  markerSize?: number;
  connectNulls?: ConnectNulls;
  yFieldAxis?: "left" | "right";
  maxDataPoints?: number;
  // rangeArea
  rangeMinAccessor?: (item: unknown, index: number) => number | null | undefined;
  rangeMaxAccessor?: (item: unknown, index: number) => number | null | undefined;
  rangeShowEdges?: boolean;
  rangeEdgeStrokeWidth?: number;
  // radar
  /** Value accessor for a radar series (one value per axis). */
  radarAccessor?: (item: unknown, index: number) => number | null | undefined;
  /** Axis (category) accessor for a radar series. */
  radarAxisAccessor?: (item: unknown, index: number) => string;
  /** Goal marker value (dot on the first axis). */
  radarGoal?: number;
  radarGoalLabel?: string;
  radarShowMarkers?: boolean;
  // polar
  /** Value accessor for a polar series (one value per category). */
  polarAccessor?: (item: unknown, index: number) => number | null | undefined;
  /** Category accessor for a polar series. */
  polarCategoryAccessor?: (item: unknown, index: number) => string;
  polarMode?: "group" | "stack";
  polarInnerRadius?: number;
  polarSegmentGap?: number;
  polarSegmentRadius?: number;
  polarBorderWidth?: number;
  polarShowLabels?: boolean;
  polarHoverBrightness?: number;
  polarHoverOffset?: number;
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
  // nightingale (rose pie)
  pieNightingale?: boolean;
  pieShowLabels?: boolean;
  pieNightingaleTicks?: boolean;
  pieNightingaleBands?: { from: number; to: number; color: string }[];
  piePeakLabel?: string;
  pieOuterRadius?: number;

  // waterfall
  waterfallOrientation?: "vertical" | "horizontal";
  waterfallColors?: { up?: string; down?: string; total?: string };
  waterfallColorAccessor?: (item: unknown, index: number) => string | undefined;
  waterfallValueLabels?: boolean;
  waterfallValueLabelFormat?: (
    delta: number,
    item: unknown,
    index: number,
  ) => string;
  waterfallConnectors?: boolean;
  waterfallCornerRadius?: number;
  /** Per-step [lo, hi] spans in value space (y-domain). */
  waterfallSpans?: [number, number][];
  /** Per-step layers (name/value/color) for stacked waterfalls. */
  waterfallLayers?: {
    name: string;
    value: number;
    color?: string;
  }[][];
  /** Per-step flags: total / delta sign, for color routing + labels. */
  waterfallKinds?: ("total" | "up" | "down")[];
  // heatmap
  heatmapRows?: string[];
  heatmapCols?: string[];
  heatmapColorStops?: string[];
  heatmapDomain?: [number, number];
  heatmapNullColor?: string;
  heatmapValueLabels?: boolean;
  heatmapValueLabelFormat?: (
    value: number,
    item: unknown,
    index: number,
  ) => string;
  heatmapTierLabel?: (
    value: number,
    item: unknown,
    index: number,
  ) => string | null;
  heatmapCellGap?: number;
  heatmapCornerRadius?: number;
  heatmapRowLabels?: boolean;
  heatmapColLabels?: boolean;
  heatmapRowLabelWidth?: number;
  heatmapShowLegend?: boolean;
  heatmapLegendTicks?: number;
  heatmapAnnotations?: HeatmapAnnotation[];
  /** Grid layout filled by the root (origin/sizes for hover + drawing). */
  heatmapLayout?: {
    gridX: number;
    gridY: number;
    gridW: number;
    gridH: number;
    cellW: number;
    cellH: number;
    legendY: number | null;
    legendH: number;
  };
  /** Cell value range for the color scale (filled by the root). */
  heatmapRange?: [number, number];
  /** Row-major cell grid (filled by describeSeries). */
  heatmapCells?: HeatmapCellDatum[];
  // treemap
  treemapLabelAccessor?: (item: unknown, index: number) => string;
  treemapGroupAccessor?: (item: unknown, index: number) => string;
  treemapColor?: string;
  treemapColors?: string[];
  treemapColorAccessor?: (item: unknown, index: number) => string | undefined;
  treemapShowLabels?: boolean;
  treemapLabelFormat?: (label: string, item: unknown, index: number) => string;
  treemapValueLabels?: boolean;
  treemapValueLabelFormat?: (value: number, item: unknown, index: number) => string;
  treemapDeltaAccessor?: (item: unknown, index: number) => number | null | undefined;
  treemapDeltaFormat?: (value: number, item: unknown, index: number) => string;
  treemapGap?: number;
  treemapCornerRadius?: number;
  treemapGroupHeaderHeight?: number;
  /** Resolved tile items in data order (filled by describeSeries). */
  treemapItems?: { label: string; value: number; group?: string }[];
  /** Group names in first-seen order (filled by describeSeries). */
  treemapGroups?: string[];
  // gauge
  gaugeValue?: number;
  gaugeMin?: number;
  gaugeMax?: number;
  gaugeArcSpan?: number;
  gaugeStartAngle?: number;
  gaugeInnerRadius?: number;
  gaugeZones?: { from: number; to: number; color: string }[];
  gaugeTicks?: { count?: number; majorEvery?: number; length?: number };
  gaugeTarget?: number;
  gaugeTargetLabel?: string;
  // candlestick
  openAccessor?: (item: unknown, index: number) => number;
  highAccessor?: (item: unknown, index: number) => number;
  lowAccessor?: (item: unknown, index: number) => number;
  closeAccessor?: (item: unknown, index: number) => number;
  candleVariant?: CandlestickVariant;
  candleBodyWidth?: number;
  candleHighlightSelected?: boolean;
  // scatter
  /** Size accessor (bubble mode); undefined = uniform dots. */
  scatterSizeAccessor?: (item: unknown, index: number) => number | null | undefined;
  scatterMinSize?: number;
  scatterMaxSize?: number;
  scatterOpacity?: number;
  scatterBorderWidth?: number;
  scatterBorderColor?: string;
  scatterHitRadius?: number;
  scatterHoverRadiusMultiplier?: number;
  scatterHoverSize?: number;
  scatterHoverBrightness?: number;
  /** "auto" | hex override for the hovered point fill. */
  scatterHoverBackground?: "auto" | string;
  scatterHoverBorderWidth?: number;
  scatterHoverBorderColor?: string;
  // animation
  animation?: ChartAnimation;
}
