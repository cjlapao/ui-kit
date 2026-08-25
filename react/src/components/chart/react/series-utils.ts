/**
 * Series description — the root inspects its children and builds these
 * descriptors (data access, resolved colors, layout flags). The series
 * components consume the same shape via the context, so prop → accessor
 * mapping lives in exactly one place.
 */
import type { ReactElement, ReactNode } from "react";
import { readAccessor, type Accessor } from "../engine/types";
import { resolveColor } from "../engine/theme";
import { DASH_PATTERNS, getDashPattern } from "./dash";
import type {
  BarSeriesProps,
  CandlestickSeriesProps,
  LineSeriesProps,
  PieSeriesProps,
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
 * Default x-field detection: "category" when present on the first item,
 * otherwise "date" (the common time-series shape), else "category".
 */
function defaultXField(data: unknown[]): string {
  const first = data[0];
  if (first && typeof first === "object") {
    const obj = first as Record<string, unknown>;
    if ("category" in obj) return "category";
    if ("date" in obj) return "date";
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
  kind: "line" | "bar" | "pie" | "candlestick",
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
      pieColors: pp.colors,
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
  yAxisLeft: { tickCount?: number; domain?: [number, number]; label?: string; grid: boolean; format?: (t: number) => string };
  yAxisRight: boolean;
  hasLegend: boolean;
  legendOrientation: "horizontal" | "vertical";
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
  const elements = (
    Array.isArray(children) ? children : [children]
  ).flat(Infinity) as ReactNode[];

  const summary: ChartChildrenSummary = {
    series: [],
    hasXAxis: false,
    yAxisLeft: { grid: true },
    yAxisRight: false,
    hasLegend: false,
    legendOrientation: "horizontal",
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
      t === types.Candlestick
    ) {
      const kind: "line" | "bar" | "pie" | "candlestick" =
        t === types.Bar
          ? "bar"
          : t === types.Pie
            ? "pie"
            : t === types.Candlestick
              ? "candlestick"
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
      continue;
    }
    if (t === types.YAxis) {
      const axis = (props.axis as "left" | "right") ?? "left";
      if (axis === "right") {
        summary.yAxisRight = true;
      } else {
        summary.yAxisLeft = {
          tickCount: props.tickCount as number | undefined,
          domain: props.domain as [number, number] | undefined,
          label: props.label as string | undefined,
          grid: props.grid !== false,
          format: props.format as ((t: number) => string) | undefined,
        };
      }
      continue;
    }
    if (t === types.Legend) {
      summary.hasLegend = true;
      summary.legendOrientation = (props.orientation as
        | "horizontal"
        | "vertical") ?? "horizontal";
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
