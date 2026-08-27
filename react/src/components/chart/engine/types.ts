/**
 * Core types for the chart engine.
 *
 * Everything in `engine/` is framework-agnostic plain TypeScript: no React,
 * no DOM (except the `matchMedia` guard in animation.ts, which is SSR-safe).
 * The React surface in `react/` maps component props onto these types.
 */

// ── Colors ───────────────────────────────────────────────────────────────────

/** A gradient stop inside a {@link GradientColor}. */
export interface GradientStop {
  /** 0–1 position along the gradient axis. */
  offset: number;
  /** Any CSS color. */
  color: string;
  /** 0–1 alpha; defaults to 1. */
  opacity?: number;
}

/**
 * A linear gradient defined in normalized coordinates (0–1).
 * Matches PrimeUI's gradient color shape.
 */
export interface GradientColor {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stops: GradientStop[];
}

/**
 * A chart color: a hex string, a kit TrueColor name ("purple"), or a
 * gradient object.
 */
export type ChartColor = string | GradientColor;

/** The resolved, renderer-ready form of a {@link ChartColor}. */
export interface ResolvedColor {
  /** CSS color for strokes and solid fills. */
  stroke: string;
  /** CSS color for solid fills (equals stroke for non-gradients). */
  fill: string;
  /** Present when the input was a gradient. */
  gradient?: GradientColor;
  /** True when the color is a gradient. */
  isGradient: boolean;
  /** The base (non-gradient) color — used for markers, legends, tooltips. */
  base: string;
}

// ── Area fill ────────────────────────────────────────────────────────────────

/**
 * A shared area-fill spec usable by any area-capable series (line with
 * fill, range area, …).
 */
export interface ChartAreaFill {
  /**
   * Flat (solid color at an opacity) or a gradient fading to transparent.
   * Default "flat".
   */
  style: "flat" | "gradient";
  /** Fill color (defaults to the series color when unset). */
  color?: string;
  /**
   * 0–1. Flat mode: solid opacity. Gradient mode: opacity at the start of
   * the gradient (the end is always fully transparent).
   */
  opacity: number;
  /** Gradient direction. Default "vertical" (top → bottom). */
  direction: "vertical" | "horizontal";
}

// ── Data access ──────────────────────────────────────────────────────────────

/**
 * Bind a field of a data item to a series. Accepts a field name (string) or
 * a callback, mirroring PrimeUI's accessor model.
 */
export type Accessor<T, R> = string | ((item: T, index: number) => R);

/** Resolve an accessor against a data item. */
export function readAccessor<T, R>(
  accessor: Accessor<T, R>,
  item: T,
  index: number,
): R {
  if (typeof accessor === "function") return accessor(item, index);
  return (item as Record<string, R>)[accessor];
}

// ── Animation ────────────────────────────────────────────────────────────────

export type EasingFn = (t: number) => number;

/**
 * An easing name: one of the built-in presets or a custom name registered
 * via `registerEasing`. (Plain string so custom names type-check.)
 */
export type EasingName = string;

/**
 * Animation config for a chart root or a single series. `false` disables
 * every animation (entrance, update, exit) — for high-frequency updates.
 */
export type ChartAnimationType =
  /**
   * Default entrance per series type: bars grow from the baseline, lines
   * draw in, pie slices sweep, polar/radar grow radially.
   */
  | "grow"
  /**
   * Radial growth from the inner radius / center, every section at the
   * same time (the polar default; applied to polar, pie and radar).
   * Cartesian series fall back to {@link grow}.
   */
  | "radial"
  /**
   * Angular sweep reveal for polar and pie (clockwise from 12 o'clock);
   * a left-to-right wipe for cartesian series; radar falls back to
   * {@link radial}.
   */
  | "sweep"
  /** Plain opacity fade-in at full geometry, every series type. */
  | "fade";

export type ChartAnimation =
  | false
  | {
      /** Milliseconds. Defaults to 1000. */
      duration?: number;
      /** Preset name (see {@link EASING_PRESETS}) or a custom registered name. */
      easing?: string;
      /**
       * Entrance style. Only affects the entrance (and re-mounts) — data
       * updates always morph between the previous and the new geometry.
       * Defaults to "grow".
       */
      type?: ChartAnimationType;
    };

// ── Layout ───────────────────────────────────────────────────────────────────

export interface ChartMargins {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface ChartArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResolvedMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ChartLayout {
  width: number;
  height: number;
  margin: ResolvedMargins;
  /** The plot rectangle inside axes, title and legend. */
  chartArea: ChartArea;
  /** Reserved pixel height for the title/subtitle block (0 when absent). */
  titleHeight: number;
  /** Reserved pixel height for the legend row (0 when absent). */
  legendHeight: number;
  /** Reserved pixel height for the caption block (0 when absent). */
  captionHeight: number;
}

// ── Theme ────────────────────────────────────────────────────────────────────

/**
 * Visual tokens for one color scheme. Colors are plain CSS values (the chart
 * paints via SVG attributes / canvas fillStyle, never Tailwind classes).
 */
export interface ChartThemeTokens {
  /** Axis tick labels and axis titles. */
  textColor: string;
  /** Secondary copy (caption, muted labels). */
  subtleText: string;
  /** Chart title text. */
  titleText: string;
  /** Subtitle text. */
  subtitleText: string;
  /** Gridlines. */
  gridColor: string;
  /** Axis domain lines. */
  axisColor: string;
  /** Tooltip surface. */
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  tooltipSubtleText: string;
  /** Annotation callout card. */
  annotationBg: string;
  annotationBorder: string;
  /** Reference-band pill label background. */
  bandLabelBg: string;
  /** Data-label badge background (custom renderers usually override). */
  badgeBg: string;
  /** Empty-state placeholder. */
  emptyText: string;
  /** Crosshair line. */
  crosshairColor: string;
}

export type ChartThemeMode = "light" | "dark";

// ── Scales ───────────────────────────────────────────────────────────────────

/** A continuous (linear, log or time) scale. */
export interface ContinuousScale {
  type: "linear" | "log" | "time";
  /** Map a data value to a pixel. */
  map(value: number | Date): number;
  /** Map a pixel back to a data value (used by hover snapping). */
  invert(pixel: number): number | Date;
  /** "Nice" tick values in the domain. */
  ticks(count?: number): (number | Date)[];
  domain: [number | Date, number | Date];
  range: [number, number];
}

/** A categorical (band or point) scale. */
export interface CategoricalScale {
  type: "band" | "point";
  /** Start pixel of a category band (band) or its center (point). */
  map(category: string): number;
  /** Band thickness in px (band scales). */
  bandWidth: number;
  /** Center pixel of a category (both kinds). */
  center(category: string): number;
  domain: string[];
  range: [number, number];
}

export type AnyScale = ContinuousScale | CategoricalScale;

// ── Series geometry ──────────────────────────────────────────────────────────

export type LineCurve =
  | "linear"
  | "smooth"
  | "spline"
  | "step"
  | "step-before"
  | "step-after";

export type ConnectNulls = "gap" | "connect" | "zero";

export type MarkerShape = "circle" | "square" | "triangle" | "diamond" | "cross" | "star";

/** A single plotted point of a line/area series. */
export interface LinePoint {
  /** Pixel x. */
  x: number;
  /** Pixel y. */
  y: number;
  /** The source value. */
  value: number;
  /** The raw data item. */
  item: unknown;
  /** Index into the source data array. */
  index: number;
}

export interface LineGeometry {
  /** Plottable (non-null) points, in data order. */
  points: LinePoint[];
  /** SVG path for the line (sub-paths separated on gaps). */
  linePath: string;
  /**
   * SVG path for the area under the line — closed to `baselineY` by
   * default, or to a second (baseline-field) curve when one was supplied.
   */
  areaPath: string;
  first: LinePoint | null;
  last: LinePoint | null;
}

export interface RangeAreaPoint {
  /** Pixel x. */
  x: number;
  /** Pixel y of the lower (min) edge. */
  yMin: number;
  /** Pixel y of the upper (max) edge. */
  yMax: number;
  /** Source min value. */
  min: number;
  /** Source max value. */
  max: number;
  item: unknown;
  index: number;
}

export interface RangeAreaGeometry {
  /** SVG path for the closed band between the two edges. */
  bandPath: string;
  /** SVG path of the upper (max) edge. */
  upperPath: string;
  /** SVG path of the lower (min) edge. */
  lowerPath: string;
  /** Solid (non-gap) points, in data order. */
  points: RangeAreaPoint[];
  first: RangeAreaPoint | null;
  last: RangeAreaPoint | null;
}

export interface BarGeometry {
  bars: {
    x: number;
    y: number;
    width: number;
    height: number;
    value: number;
    item: unknown;
    index: number;
  }[];
  /** Pixel y (or x when horizontal) of the zero line. */
  baseline: number;
}

export interface PieSlice {
  index: number;
  item: unknown;
  value: number;
  startAngle: number;
  endAngle: number;
  /** SVG path for the (possibly donut) slice. */
  path: string;
  /** Mid-angle, for label placement. */
  labelAngle: number;
  /**
   * Per-slice outer radius. Equals the geometry's outerRadius except for
   * nightingale (rose) slices, whose radius encodes the value.
   */
  sliceRadius: number;
  /** Unit-ish offset (4px) for the hover pop-out. */
  popOffset: { dx: number; dy: number };
}

export interface PieGeometry {
  slices: PieSlice[];
  total: number;
  cx: number;
  cy: number;
  outerRadius: number;
  innerRadius: number;
  /** Pad applied to the slice paths (radians) — for animated generators. */
  padAngle: number;
  /** Clamped slice corner radius (px) — for animated generators. */
  cornerRadius: number;
}

export interface CandleGeometry {
  x: number;
  openY: number;
  highY: number;
  lowY: number;
  closeY: number;
  bodyTop: number;
  bodyHeight: number;
  direction: "up" | "down" | "flat";
  /** Body width in px. */
  bodyWidth: number;
  item: unknown;
  index: number;
}

// ── Hover / tooltip ──────────────────────────────────────────────────────────

export interface HoverItem {
  seriesId: string;
  name?: string;
  color: string;
  value: number;
  /**
   * Upper end of a ranged value (range-area series: the max edge). When
   * present, tooltips render `value–valueMax`.
   */
  valueMax?: number;
  /** Pixel y of this item's mark. */
  y: number;
  item: unknown;
  /** Index of the datum within the series' data array (slice for pies). */
  index?: number;
  /**
   * Bookkeeping-only entry (e.g. a scatter dim tag): components use it to
   * apply hoverDim, but tooltips and other chrome skip it.
   */
  hidden?: boolean;
}

export interface HoverState {
  /** Pixel x of the snapped category. */
  x: number;
  items: HoverItem[];
  /** The raw x value (Date for time axes, string for categories) at this position. */
  rawX?: number | Date | string;
  /** Pixel y of the primary (first) item — for the horizontal crosshair. */
  y?: number;
  /** Pixel y of the pointer itself — for cursor-following chrome. */
  pointerY?: number;
  /** Pixel x of the pointer itself — for cursor-following chrome. */
  pointerX?: number;
}

// ── Radar ────────────────────────────────────────────────────────────────────

/** One plotted radar point (a series value on one axis). */
export interface RadarPoint {
  x: number;
  y: number;
  value: number;
  /** Axis index (0 = 12 o'clock, clockwise). */
  axis: number;
  item: unknown;
  index: number;
}

/** A radar series' plotted shape. */
export interface RadarGeometry {
  points: RadarPoint[];
  /** Closed polygon (`M…Z`), or open sub-paths when the series has gaps. */
  linePath: string;
  /** Path used for the polygon fill (same as linePath). */
  fillPath: string;
  hasGaps: boolean;
  first: RadarPoint | null;
  last: RadarPoint | null;
}

/** Shared radar grid (rings, spokes, labels). */
export interface RadarGrid {
  cx: number;
  cy: number;
  /** Outer radius in px. */
  R: number;
  /** Ring boundary values (inner → outer). */
  ringValues: number[];
  /** Closed polygon path per ring (inner → outer). */
  ringPaths: string[];
  spokes: { x1: number; y1: number; x2: number; y2: number; label: string; angle: number }[];
  /** Tick labels along the first (top) axis. */
  tickLabels: { x: number; y: number; text: string }[];
}

/** Radar layout shared with the series (published by the root). */
export interface RadarLayout {
  cx: number;
  cy: number;
  R: number;
  domainMax: number;
  axisCount: number;
  /** Axis labels in order (0 = 12 o'clock). */
  axes: string[];
}


/** One annular sector of a polar (rose) chart. */
export interface PolarSegment {
  /** Sector path (rounded annular wedge). */
  path: string;
  /** Sector angle span (radians). */
  a0: number;
  a1: number;
  midAngle: number;
  rInner: number;
  rOuter: number;
  value: number;
  categoryIndex: number;
  seriesId: string;
  seriesIndex: number;
}

/** Computed polar geometry for one series. */
export interface PolarGeometry {
  segments: PolarSegment[];
  mode: "group" | "stack";
  /** Category count. */
  n: number;
}

/** Shared polar grid (rings, spokes, tick labels). */
export interface PolarGrid {
  cx: number;
  cy: number;
  R: number;
  ringValues: number[];
  ringPaths: string[];
  spokes: { x1: number; y1: number; x2: number; y2: number; label: string; angle: number }[];
  /** Tick labels along the first (top) axis. */
  tickLabels: { x: number; y: number; text: string }[];
}

/** Polar layout shared with the series (published by the root). */
export interface PolarLayout {
  cx: number;
  cy: number;
  R: number;
  innerR: number;
  domainMax: number;
  valueMax: number;
  /** Category labels in order (0 = 12 o'clock). */
  categories: string[];
  /** Display order → data row index (all series share row order). */
  categoryOrder: number[];
  /** Sort order applied to categories. */
  sort: "none" | "desc" | "asc";
  /** Mode of the FIRST polar series (drives valueMax derivation). */
  mode: "group" | "stack";
  /** Segment corner radius (px). */
  segmentRadius: number;
  /** Band gap (px) for stack mode. */
  bandGap: number;
  /** Angular gap (radians) between slots. */
  gapAngle: number;
  /** Per-category totals across all polar series (drives the shared stack scale). */
  categoryTotals: number[];
}
