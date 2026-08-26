/**
 * Series description — the root inspects its children and builds these
 * descriptors (data access, resolved colors, layout flags). The series
 * components consume the same shape via the context, so prop → accessor
 * mapping lives in exactly one place.
 */
import { Fragment, type ReactElement, type ReactNode } from "react";
import { readAccessor, type Accessor } from "../engine/types";
import { computeWaterfallSteps, type WaterfallLayer } from "../engine/series/waterfall";
import { resolveColor } from "../engine/theme";
import { DASH_PATTERNS, getDashPattern } from "./dash";
import type {
  BarSeriesProps,
  CandlestickSeriesProps,
  LineSeriesProps,
  PieSeriesProps,
  PolarSeriesProps,
  RangeAreaSeriesProps,
  RadarSeriesProps,
  ScatterSeriesProps,
  SeriesDescriptor,
} from "./props";

/**
 * Wrap a field accessor (string name or callback) into the closure shape
 * the descriptors carry: (item, index) → value.
 */
function fieldAccessor<T, R>(
  field: Accessor<T, R> | undefined,
  fallback: string,
): (item: unknown, index: number) => R {
  const acc: Accessor<T, R> = (field ?? fallback) as Accessor<T, R>;
  return (item: unknown, index: number) => readAccessor(acc, item as T, index);
}

// Markers for identifying children by type (compared via `type ===` below).
export interface ChartChildIdentity {
  kind:
    | "series.line"
    | "series.bar"
    | "series.pie"
    | "series.candlestick"
    | "feature";
}

/**
 * Normalize a series' x accessor output into a sort/comparison key.
 * Time series compare as ms; categories as strings; numbers as-is.
 */
export function xKey(
  x: number | Date | string,
  isTime: boolean,
): number | string {
  if (isTime) {
    const t = x instanceof Date ? x.getTime() : new Date(x as number | string).getTime();
    return Number.isFinite(t) ? t : NaN;
  }
  if (typeof x === "string") return x;
  return typeof x === "number" ? x : String(x);
}

/**
 * Recursively flatten children, unwrapping fragments and arrays. React 19
 * keeps fragments as opaque elements — `Array#flat` and `Children.toArray`
 * do not descend into them — so consumers wrapping series in `<>…</>` or
 * conditional groups would otherwise be invisible to the root.
 */
export function flattenChartChildren(children: ReactNode): ReactNode[] {
  const out: ReactNode[] = [];
  const visit = (node: ReactNode): void => {
    if (Array.isArray(node)) {
      for (const child of node) visit(child);
      return;
    }
    if (node !== null && typeof node === "object") {
      const el = node as { type?: unknown; props?: { children?: ReactNode } };
      if (el.type === Fragment && el.props?.children != null) {
        visit(el.props.children);
        return;
      }
    }
    if (node !== null && node !== undefined) out.push(node);
  };
  visit(children);
  return out;
}

/**
 * Default x-field detection: "category" when present on the first item,
 * otherwise "date" (the common time-series shape), else "category".
 */
function defaultXField(data: unknown[]): string {
  const first = data[0];
  if (first && typeof first === "object") {
    const obj = first as Record<string, unknown>;
    if ("category" in obj) return "category";
    if ("date" in obj) return "date";
    // Numeric (or ISO/time) x data: a first-class "x" field. Without this
    // the accessor fell back to `category`, was undefined for every row,
    // and cartesian series silently rendered nothing.
    if ("x" in obj) return "x";
  }
  return "category";
}

/**
 * Build a SeriesDescriptor from a series element's props.
 * `kind` is the element's component type (the registry knows it); `paletteIndex`
 * is assigned by the caller (series order).
 */
export function describeSeries(
  el: ReactElement<Record<string, unknown>>,
  index: number,
  paletteIndex: number,
  kind:
    | "line"
    | "bar"
    | "pie"
    | "candlestick"
    | "rangeArea"
    | "radar"
    | "polar"
    | "scatter"
    | "gauge"
    | "waterfall",
): SeriesDescriptor {
  const p = el.props;
  const id = (p.id as string | undefined) ?? `series-${index}`;
  const name = p.name as string | undefined;
  const data = (p.data as unknown[]) ?? [];
  const animation = p.animation as SeriesDescriptor["animation"];

  // Candlestick.
  if (kind === "candlestick") {
    const cp = p as unknown as CandlestickSeriesProps<never>;
    const openField = cp.openField ?? "open";
    const highField = cp.highField ?? "high";
    const lowField = cp.lowField ?? "low";
    const closeField = cp.closeField ?? "close";
    const categoryXField = cp.categoryXField ?? defaultXField(data);
    return {
      id,
      type: "candlestick",
      name,
      // {up, down} colors are consumed by the component itself; the
      // palette color below backs the legend swatch.
      color: undefined,
      paletteIndex,
      data,
      xAccessor: fieldAccessor<never, number | Date | string>(
        categoryXField as Accessor<never, number | Date | string> | string,
        String(categoryXField),
      ),
      openAccessor: fieldAccessor<never, number>(
        openField as Accessor<never, number> | string,
        String(openField),
      ),
      highAccessor: fieldAccessor<never, number>(
        highField as Accessor<never, number> | string,
        String(highField),
      ),
      lowAccessor: fieldAccessor<never, number>(
        lowField as Accessor<never, number> | string,
        String(lowField),
      ),
      closeAccessor: fieldAccessor<never, number>(
        closeField as Accessor<never, number> | string,
        String(closeField),
      ),
      candleVariant: cp.variant,
      candleBodyWidth: cp.bodyWidth,
      candleHighlightSelected: cp.highlightSelected ?? true,
      animation,
    };
  }

  // Pie: no cartesian x/value fields.
  if (kind === "pie") {
    const pp = p as unknown as PieSeriesProps<never>;
    const valueField = pp.valueField ?? "value";
    const categoryField = pp.categoryField ?? "name";
    const valueAccessor = fieldAccessor<never, number>(
      valueField as Accessor<never, number> | string,
      String(valueField),
    );
    const categoryAccessor = fieldAccessor<never, string>(
      categoryField as Accessor<never, string> | string,
      String(categoryField),
    );
    return {
      id,
      type: "pie",
      name,
      color: pp.color,
      paletteIndex,
      data,
      xAccessor: (item, i) => categoryAccessor(item, i),
      yAccessor: (item, i) => valueAccessor(item, i) ?? 0,
      valueField: (item, i) => valueAccessor(item, i),
      categoryField: (item, i) => categoryAccessor(item, i),
      innerRadius: pp.innerRadius ?? 0,
      pieStartAngle: pp.startAngle,
      pieSweepAngle: pp.sweepAngle,
      piePadAngle: pp.padAngle,
      pieCornerRadius: pp.cornerRadius,
      pieColors: pp.colors,
      piePercentLabels: pp.showPercentLabels ?? false,
      pieMinPercentLabel: pp.minPercentLabel ?? 5,
      pieNightingale: pp.nightingale ?? false,
      pieShowLabels: pp.showLabels ?? pp.nightingale ?? false,
      pieNightingaleTicks: pp.nightingaleTicks,
      pieNightingaleBands: pp.nightingaleBands,
      piePeakLabel: pp.peakLabel,
      pieOuterRadius: pp.outerRadius,
      animation,
    };
  }

  // Gauge: a single value on an arc track (pie-family, no data array).
  if (kind === "gauge") {
    const gp = p as unknown as import("./props").GaugeSeriesProps;
    return {
      id,
      type: "gauge",
      name,
      color: gp.color,
      paletteIndex,
      data: [],
      xAccessor: (_item: unknown, _i: number) => "",
      yAccessor: () => gp.value ?? 0,
      gaugeValue: gp.value,
      gaugeMin: gp.min ?? 0,
      gaugeMax: gp.max ?? 100,
      gaugeArcSpan: gp.arcSpan,
      gaugeStartAngle: gp.startAngle,
      gaugeInnerRadius: gp.innerRadius ?? 0.78,
      gaugeZones: gp.zones,
      gaugeTicks: gp.ticks,
      gaugeTarget: gp.target,
      gaugeTargetLabel: gp.targetLabel,
      animation,
    };
  }

  // Waterfall: categorical x, running-total spans.
  if (kind === "waterfall") {
    const wp = p as unknown as import("./props").WaterfallSeriesProps<never>;
    const categoryXField = wp.categoryXField ?? "category";
    const valueYField = wp.valueYField ?? "value";
    const xAccessor = fieldAccessor<never, string | number>(
      categoryXField as Accessor<never, string | number> | string,
      String(categoryXField),
    );
    const totalPred:
      | ((item: unknown, index: number) => boolean)
      | undefined =
      typeof wp.totalField === "function"
        ? (wp.totalField as (item: unknown, index: number) => boolean)
        : typeof wp.totalField === "string"
          ? (item: unknown) =>
              Boolean(
                (item as Record<string, unknown>)?.[wp.totalField as string],
              )
          : undefined;
    const { steps, spans } = computeWaterfallSteps<unknown>({
      data,
      categoryField: (item, i) => xAccessor(item, i),
      valueField: (item, i) => {
        const v = fieldAccessor<never, number | null | undefined>(
          valueYField as Accessor<never, number | null | undefined> | string,
          String(valueYField),
        )(item, i);
        return v ?? 0;
      },
      totalField: totalPred,
      layersField: wp.layersField as
        | ((item: unknown, index: number) => WaterfallLayer[])
        | undefined,
    });
    return {
      id,
      type: "waterfall",
      name,
      color: typeof wp.color === "function" ? undefined : wp.color,
      paletteIndex,
      data,
      xAccessor: (item, i) => xAccessor(item, i),
      yAccessor: (_item, i) => steps[i]?.delta ?? 0,
      waterfallOrientation: wp.orientation ?? "vertical",
      waterfallColors: wp.colors,
      waterfallColorAccessor:
        typeof wp.color === "function"
          ? (item, i) => (wp.color as (i: unknown, n: number) => string)(item, i)
          : undefined,
      waterfallValueLabels: wp.valueLabels ?? true,
      waterfallValueLabelFormat: wp.valueLabelFormat as
        | ((delta: number, item: unknown, index: number) => string)
        | undefined,
      waterfallConnectors: wp.connectors ?? false,
      waterfallCornerRadius: wp.cornerRadius,
      waterfallSpans: spans,
      waterfallLayers: steps.map((st) =>
        st.layers
          ? st.layers.map((l) => ({
              name: l.name,
              value: l.value,
              color: l.color,
            }))
          : [],
      ),
      waterfallKinds: steps.map((st) =>
        st.total ? "total" : st.delta < 0 ? "down" : "up",
      ),
      animation,
    };
  }

  // Bar: categorical x (grouped/stacked modes).
  const mode = p.mode as SeriesDescriptor["barMode"] | undefined;
  const isBar =
    kind === "bar" &&
    (mode === undefined || mode === "group" || mode === "stack" || mode === "percent");

  if (isBar) {
    const bp = p as unknown as BarSeriesProps<never>;
    const categoryXField = bp.categoryXField ?? "category";
    const valueYField = bp.valueYField ?? "value";
    const xAccessor = fieldAccessor<never, string | number>(
      categoryXField as Accessor<never, string | number> | string,
      String(categoryXField),
    );
    const yAccessor = fieldAccessor<never, number | null | undefined>(
      valueYField as Accessor<never, number | null | undefined> | string,
      String(valueYField),
    );
    return {
      id,
      type: "bar",
      name,
      color: bp.color,
      paletteIndex,
      data,
      xAccessor: (item, i) => xAccessor(item, i),
      yAccessor: (item, i) => yAccessor(item, i) ?? 0,
      barMode: mode ?? "group",
      stackId: bp.stackId ?? "default",
      orientation: bp.orientation ?? "vertical",
      cornerRadius: bp.cornerRadius,
      segmentGap: bp.segmentGap,
      animation,
    };
  }

  // Range area: a band between two fields.
  if (kind === "rangeArea") {
    const rp = p as unknown as RangeAreaSeriesProps<never>;
    const minField = rp.minYField ?? "min";
    const maxField = rp.maxYField ?? "max";
    const categoryXField = rp.categoryXField ?? defaultXField(data);
    return {
      id,
      type: "rangeArea",
      name,
      color: rp.color,
      paletteIndex,
      data,
      xAccessor: fieldAccessor<never, number | Date | string>(
        categoryXField as Accessor<never, number | Date | string> | string,
        String(categoryXField),
      ),
      rangeMinAccessor: fieldAccessor<never, number | null | undefined>(
        minField as Accessor<never, number | null | undefined> | string,
        String(minField),
      ),
      rangeMaxAccessor: fieldAccessor<never, number | null | undefined>(
        maxField as Accessor<never, number | null | undefined> | string,
        String(maxField),
      ),
      curve: rp.curve ?? "linear",
      rangeShowEdges: rp.showEdges ?? true,
      rangeEdgeStrokeWidth: rp.edgeStrokeWidth ?? 2,
      connectNulls: rp.connectNulls ?? "gap",
      yFieldAxis: rp.yFieldAxis ?? "left",
      maxDataPoints: rp.maxDataPoints,
      fillStyle: rp.fillStyle ?? "gradient",
      fillColor: rp.fillColor,
      fillOpacity: rp.fillOpacity ?? 0.4,
      fillDirection: rp.fillDirection ?? "vertical",
      animation,
    };
  }

  // Radar: one polygon per series on a shared axis set.
  if (kind === "radar") {
    const rp = p as unknown as RadarSeriesProps<never>;
    const axisField = rp.axisField ?? "axis";
    const valueField = rp.valueYField ?? "value";
    return {
      id,
      type: "radar",
      name,
      color: rp.color,
      paletteIndex,
      data,
      // Radar is not cartesian — xAccessor is unused, keep it inert.
      xAccessor: () => 0,
      radarAccessor: fieldAccessor<never, number | null | undefined>(
        valueField as Accessor<never, number | null | undefined> | string,
        String(valueField),
      ),
      radarAxisAccessor: fieldAccessor<never, string>(
        axisField as Accessor<never, string> | string,
        String(axisField),
      ),
      lineDash: rp.lineDash ?? null,
      lineStrokeWidth: rp.lineStrokeWidth ?? 2,
      radarShowMarkers: rp.showMarkers ?? true,
      markerSize: rp.markerSize ?? 3,
      radarGoal: rp.goal,
      radarGoalLabel: rp.goalLabel,
      fillStyle: rp.fillStyle ?? "flat",
      fillColor: rp.fillColor,
      fillOpacity: rp.fillOpacity ?? 0.18,
      animation,
    };
  }

  // Polar (rose): one annular-segment ring per series on a shared category set.
  if (kind === "polar") {
    const pp = p as unknown as PolarSeriesProps<never>;
    const catField = pp.categoryField ?? "category";
    const valField = pp.valueYField ?? "value";
    return {
      id,
      type: "polar",
      name,
      color: pp.color,
      paletteIndex,
      data,
      // Polar is not cartesian — xAccessor is unused, keep it inert.
      xAccessor: () => 0,
      polarAccessor: fieldAccessor<never, number | null | undefined>(
        valField as Accessor<never, number | null | undefined> | string,
        String(valField),
      ),
      polarCategoryAccessor: fieldAccessor<never, string>(
        catField as Accessor<never, string> | string,
        String(catField),
      ),
      polarMode: pp.mode ?? "group",
      polarInnerRadius: pp.innerRadius ?? 0,
      polarSegmentGap: pp.segmentGap,
      polarSegmentRadius: pp.segmentRadius ?? 0,
      polarBorderWidth: pp.borderWidth ?? 0,
      polarShowLabels: pp.showLabels ?? true,
      polarHoverBrightness: pp.hoverBrightness ?? 1.1,
      polarHoverOffset: pp.hoverOffset ?? 4,
      animation,
    };
  }

  // Scatter / bubble: two numeric (or time) fields + an optional size field.
  if (kind === "scatter") {
    const sp = p as unknown as ScatterSeriesProps<never>;
    const xField = sp.xField ?? "x";
    const yField = sp.yField ?? "y";
    return {
      id,
      type: "scatter",
      name,
      color: sp.color,
      paletteIndex,
      data,
      xAccessor: fieldAccessor<never, number | Date | string>(
        xField as Accessor<never, number | Date | string> | string,
        String(xField),
      ),
      yAccessor: fieldAccessor<never, number | null | undefined>(
        yField as Accessor<never, number | null | undefined> | string,
        String(yField),
      ),
      scatterSizeAccessor: sp.sizeField
        ? fieldAccessor<never, number | null | undefined>(
            sp.sizeField as Accessor<never, number | null | undefined> | string,
            String(sp.sizeField),
          )
        : undefined,
      scatterMinSize: sp.minSize,
      scatterMaxSize: sp.maxSize,
      scatterOpacity: sp.opacity,
      scatterBorderWidth: sp.borderWidth ?? 0,
      scatterBorderColor: sp.borderColor,
      scatterHitRadius: sp.pointHitRadius ?? 2,
      scatterHoverRadiusMultiplier: sp.hoverRadiusMultiplier,
      scatterHoverSize: sp.hoverSize,
      scatterHoverBrightness: sp.hoverBrightness,
      scatterHoverBackground: sp.hoverBackgroundColor ?? "auto",
      scatterHoverBorderWidth: sp.hoverBorderWidth ?? 0,
      scatterHoverBorderColor: sp.hoverBorderColor,
      fillOpacity: sp.fillOpacity,
      markerShape: sp.markerShape,
      yFieldAxis: sp.yFieldAxis,
      animation,
    };
  }

  // Line (default): cartesian x + y.
  const lp = p as unknown as LineSeriesProps<never>;
  const categoryXField = lp.categoryXField ?? defaultXField(data);
  const valueYField = lp.valueYField ?? "value";
  const xAccessor = fieldAccessor<never, number | Date | string>(
    categoryXField as Accessor<never, number | Date | string> | string,
    String(categoryXField),
  );
  const yAccessor = fieldAccessor<never, number | null | undefined>(
    valueYField as Accessor<never, number | null | undefined> | string,
    String(valueYField),
  );
  const lineDash = lp.lineDash ?? (lp.lineStyle && lp.lineStyle !== "solid" ? getDashPattern(lp.lineStyle) : null);

  return {
    id,
    type: "line",
    name,
    color: lp.color,
    paletteIndex,
    data,
    xAccessor,
    yAccessor: (item, i) => yAccessor(item, i),
    curve: lp.curve ?? "linear",
    fillOpacity: lp.fillOpacity ?? 0,
    areaGradient: lp.areaGradient ?? false,
    // areaGradient is a deprecated alias: it wins over an explicit style.
    fillStyle:
      lp.areaGradient === true
        ? "gradient"
        : lp.fillStyle ?? "flat",
    fillColor: lp.fillColor,
    fillDirection: lp.fillDirection ?? "vertical",
    fillBaseline: lp.fillBaseline ?? "zero",
    fillBaselineAccessor:
      lp.fillBaseline === "field"
        ? fieldAccessor<never, number | null | undefined>(
            (lp.fillBaselineField ?? "min") as
              | Accessor<never, number | null | undefined>
              | string,
            String(lp.fillBaselineField ?? "min"),
          )
        : undefined,
    lineStrokeWidth: lp.lineStrokeWidth ?? 2,
    lineDash,
    showMarkers: lp.showMarkers ?? false,
    markerShape: lp.markerShape ?? "circle",
    markerSize: lp.markerSize ?? 3.5,
    connectNulls: lp.connectNulls ?? "gap",
    yFieldAxis: lp.yFieldAxis ?? "left",
    maxDataPoints: lp.maxDataPoints,
    animation,
  };
}

/**
 * Inspect children: return series descriptors + layout flags for feature
 * children (axes, legend, tooltip, hover, title, caption).
 */
export interface ChartChildrenSummary {
  series: SeriesDescriptor[];
  hasXAxis: boolean;
  xAxisTickCount?: number;
  yAxisLeft: { tickCount?: number; domain?: [number, number]; label?: string; grid: boolean; format?: (t: number) => string; log?: boolean };
  yAxisRight: boolean;
  /** Log-10 right y scale (from <Chart.YAxis axis="right" log>). */
  yAxisRightLog?: boolean;
  /** Log-10 x scale (from <Chart.XAxis log>). */
  xAxisLog?: boolean;
  hasLegend: boolean;
  legendOrientation: "horizontal" | "vertical";
  legendPosition: "top" | "bottom";
  tooltipMode: "shared" | "follow" | "crosshair";
  hoverEnabled: boolean;
  hasHover: boolean;
  hasTitle: boolean;
  title?: string;
  subtitle?: string;
  hasCaption: boolean;
  hasReferenceLine: boolean;
  hasReferenceBand: boolean;
  hasAnnotation: boolean;
  hasDataLabels: boolean;
  /** Radar grid config (from <Chart.RadarAxis>). */
  radarAxis?: {
    rings?: number;
    domainMax?: number;
    tickFormat?: (value: number) => string;
    showAxisLabels?: boolean;
    gridStyle?: "solid" | "dashed" | "dotted";
    gridWidth?: number;
    gridColor?: string;
    gridOpacity?: number;
  };
  /** Polar grid config (from <Chart.PolarAxis>). */
  polarAxis?: {
    gridShape?: "circle" | "polygon";
    gridLines?: number;
    gridStyle?: "solid" | "dashed" | "dotted";
    gridWidth?: number;
    gridColor?: string;
    gridOpacity?: number;
    showTickLabels?: boolean;
    tickFormat?: (value: number) => string;
    domainMax?: number;
    sort?: "none" | "desc" | "asc";
  };
  seriesCount: number;
}

export function summarizeChildren(
  children: ReactNode,
  // type discriminators are passed in by the root (avoids circular imports)
  types: {
    Line: React.ComponentType | (new () => unknown);
    Bar: React.ComponentType | (new () => unknown);
    Pie: React.ComponentType | (new () => unknown);
    Candlestick: React.ComponentType | (new () => unknown);
    RangeArea: React.ComponentType | (new () => unknown);
    Radar: React.ComponentType | (new () => unknown);
    RadarAxis: React.ComponentType | (new () => unknown);
    Polar: React.ComponentType | (new () => unknown);
    PolarAxis: React.ComponentType | (new () => unknown);
    Scatter: React.ComponentType | (new () => unknown);
    Gauge: React.ComponentType | (new () => unknown);
    Waterfall: React.ComponentType | (new () => unknown);
    XAxis: React.ComponentType | (new () => unknown);
    YAxis: React.ComponentType | (new () => unknown);
    Legend: React.ComponentType | (new () => unknown);
    Tooltip: React.ComponentType | (new () => unknown);
    Hover: React.ComponentType | (new () => unknown);
    Title: React.ComponentType | (new () => unknown);
    Caption: React.ComponentType | (new () => unknown);
    ReferenceLine: React.ComponentType | (new () => unknown);
    ReferenceBand: React.ComponentType | (new () => unknown);
    Annotation: React.ComponentType | (new () => unknown);
    DataLabels: React.ComponentType | (new () => unknown);
  },
): ChartChildrenSummary {
  // flattenChartChildren unwraps fragments, arrays and conditional groups —
  // the root's split loop uses the same helper, so both see an identical list.
  const elements = flattenChartChildren(children);

  const summary: ChartChildrenSummary = {
    series: [],
    hasXAxis: false,
    yAxisLeft: { grid: true },
    yAxisRight: false,
    hasLegend: false,
    legendOrientation: "horizontal",
    legendPosition: "top",
    tooltipMode: "shared",
    hoverEnabled: false,
    hasHover: false,
    hasTitle: false,
    hasCaption: false,
    hasReferenceLine: false,
    hasReferenceBand: false,
    hasAnnotation: false,
    hasDataLabels: false,
    seriesCount: 0,
  };

  let paletteIndex = 0;
  const elementsFlat = elements.filter(
    (c): c is ReactElement =>
      typeof c === "object" && c !== null && "$$typeof" in c,
  );

  for (const el of elementsFlat) {
    const t = el.type;
    if (
      t === types.Line ||
      t === types.Bar ||
      t === types.Pie ||
      t === types.Candlestick ||
      t === types.RangeArea ||
      t === types.Radar ||
      t === types.Polar ||
      t === types.Scatter ||
      t === types.Gauge ||
      t === types.Waterfall
    ) {
      const kind:
        | "line"
        | "bar"
        | "pie"
        | "candlestick"
        | "rangeArea"
        | "radar"
        | "polar"
        | "scatter"
        | "gauge"
        | "waterfall" =
        t === types.Waterfall
          ? "waterfall"
          : t === types.Bar
          ? "bar"
          : t === types.Pie
            ? "pie"
            : t === types.Candlestick
              ? "candlestick"
              : t === types.RangeArea
                ? "rangeArea"
                : t === types.Radar
                  ? "radar"
                  : t === types.Polar
                    ? "polar"
                    : t === types.Scatter
                      ? "scatter"
                      : t === types.Gauge
                        ? "gauge"
                        : t === types.Waterfall
                          ? "waterfall"
                          : "line";
      summary.series.push(
        describeSeries(
          el as ReactElement<Record<string, unknown>>,
          summary.series.length,
          paletteIndex++,
          kind,
        ),
      );
      continue;
    }
    const props = (el.props ?? {}) as Record<string, unknown>;
    if (t === types.XAxis) {
      summary.hasXAxis = true;
      summary.xAxisTickCount = props.tickCount as number | undefined;
      summary.xAxisLog = props.log as boolean | undefined;
      continue;
    }
    if (t === types.RadarAxis) {
      summary.radarAxis = {
        rings: props.rings as number | undefined,
        domainMax: props.domainMax as number | undefined,
        tickFormat: props.tickFormat as
          | ((value: number) => string)
          | undefined,
        showAxisLabels: props.showAxisLabels as boolean | undefined,
        gridStyle: props.gridStyle as "solid" | "dashed" | "dotted" | undefined,
        gridWidth: props.gridWidth as number | undefined,
        gridColor: props.gridColor as string | undefined,
        gridOpacity: props.gridOpacity as number | undefined,
      };
      continue;
    }
    if (t === types.PolarAxis) {
      summary.polarAxis = {
        gridShape: props.gridShape as "circle" | "polygon" | undefined,
        gridLines: props.gridLines as number | undefined,
        gridStyle: props.gridStyle as "solid" | "dashed" | "dotted" | undefined,
        gridWidth: props.gridWidth as number | undefined,
        gridColor: props.gridColor as string | undefined,
        gridOpacity: props.gridOpacity as number | undefined,
        showTickLabels: props.showTickLabels as boolean | undefined,
        tickFormat: props.tickFormat as ((value: number) => string) | undefined,
        domainMax: props.domainMax as number | undefined,
        sort: props.sort as "none" | "desc" | "asc" | undefined,
      };
      continue;
    }
    if (t === types.YAxis) {
      const axis = (props.axis as "left" | "right") ?? "left";
      if (axis === "right") {
        summary.yAxisRight = true;
        summary.yAxisRightLog = props.log as boolean | undefined;
      } else {
        summary.yAxisLeft = {
          tickCount: props.tickCount as number | undefined,
          domain: props.domain as [number, number] | undefined,
          label: props.label as string | undefined,
          grid: props.grid !== false,
          format: props.format as ((t: number) => string) | undefined,
          log: props.log as boolean | undefined,
        };
      }
      continue;
    }
    if (t === types.Legend) {
      summary.hasLegend = true;
      summary.legendOrientation = (props.orientation as
        | "horizontal"
        | "vertical") ?? "horizontal";
      summary.legendPosition =
        props.position === "bottom" ? "bottom" : "top";
      continue;
    }
    if (t === types.Tooltip) {
      summary.tooltipMode = (props.mode as
        | "shared"
        | "follow"
        | "crosshair") ?? "shared";
      continue;
    }
    if (t === types.Hover) {
      summary.hasHover = true;
      summary.hoverEnabled = true;
      continue;
    }
    if (t === types.Title) {
      summary.hasTitle = true;
      summary.title = props.title as string | undefined;
      summary.subtitle = props.subtitle as string | undefined;
      continue;
    }
    if (t === types.Caption) {
      summary.hasCaption = true;
      continue;
    }
    if (t === types.ReferenceLine) summary.hasReferenceLine = true;
    if (t === types.ReferenceBand) summary.hasReferenceBand = true;
    if (t === types.Annotation) summary.hasAnnotation = true;
    if (t === types.DataLabels) summary.hasDataLabels = true;
  }

  summary.seriesCount = summary.series.length;
  return summary;
}

/** Resolve palette colors for all series (stable by paletteIndex). */
export function resolveSeriesColors(
  descriptors: SeriesDescriptor[],
  palette: string[],
): { color: string; fillColor: string }[] {
  return descriptors.map((d) => {
    const resolved = resolveColor(d.color, d.paletteIndex, palette);
    return { color: resolved.stroke, fillColor: resolved.fill };
  });
}

export { DASH_PATTERNS };
