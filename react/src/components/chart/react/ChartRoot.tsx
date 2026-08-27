/**
 * Chart roots — <Chart.Svg> and <Chart.Canvas>.
 *
 * The root does the heavy lifting for its children:
 *
 * 1. measures the container (ResizeObserver) and computes the layout,
 * 2. inspects children (series + feature components) via
 *    {@link summarizeChildren},
 * 3. computes x/y domains and scales,
 * 4. runs the entrance/update animation (shared progress),
 * 5. handles pointer hover (snapped categories / pie slices),
 * 6. provides the context every mark renders from.
 *
 * SVG mode re-renders the tree per frame; canvas mode keeps progress in a
 * ref and repaints through registered draw functions (no React churn).
 */
import {
  cloneElement,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ComponentType,
  CSSProperties,
  Key,
  PointerEvent as ReactPointerEvent,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import {
  createAnimator,
  getChartTheme,
  computeLayout,
  createBandScale,
  createLinearScale,
  createLogScale,
  layoutAnnotationCards,
  type AnnotationCardRect,
  createTimeScale,
  computeRadarGrid,
  DEFAULT_SERIES_PALETTE,
  isTimeDomain,
  niceRadarMax,
  prefersReducedMotion,
  resolveColor,
  toDate,
  computePolarGeometry,
  computePolarGrid,
  gridDashArray,
  gridLineDash,
  hitTestPolar,
  computeScatterGeometry,
  hitTestScatter,
  nicePolarMax,
  resolveGrid,
  computeHeatmapLayout,
  computeTreemapLayout,
  hitTestTreemap,
} from "../engine/index";
import type {
  AnyScale,
  CategoricalScale,
  ChartAnimationType,
  ChartLayout,
  ContinuousScale,
  HoverState,
  PolarLayout,
  RadarLayout,
} from "../engine/types";
import { useTheme } from "../../../hooks/useTheme";
import { useChartGroup } from "./ChartGroup";
import Loader from "../../Loader";
import { ChartSkeleton } from "./series/ChartSkeleton";

import {
  ChartContextProvider,
  type ChartDrawFn,
  type ChartRenderer,
  type ChartThemeMode,
  type SeriesState,
} from "./ChartContext";
import {
  flattenChartChildren,
  summarizeChildren,
  resolveSeriesColors,
  type ChartChildrenSummary,
} from "./series-utils";
import type { ChartHandle, ChartRootProps } from "./props";

// Feature component types are registered by index.ts to avoid a circular
// import (the root needs the types to split children; the components need
// useChart from this file's context module).
export interface ChildTypeRegistry {
  Line: ComponentType<any>;
  Radar: ComponentType<any>;
  RadarAxis: ComponentType<any>;
  Polar: ComponentType<any>;
  PolarAxis: ComponentType<any>;
  Scatter: ComponentType<any>;
  Gauge: ComponentType<any>;
  Waterfall: ComponentType<any>;
  Heatmap: ComponentType<any>;
  Treemap: ComponentType<any>;
  Bar: ComponentType<any>;
  Pie: ComponentType<any>;
  Candlestick: ComponentType<any>;
  RangeArea: ComponentType<any>;
  XAxis: ComponentType<any>;
  YAxis: ComponentType<any>;
  Legend: ComponentType<any>;
  Tooltip: ComponentType<any>;
  Hover: ComponentType<any>;
  Title: ComponentType<any>;
  Caption: ComponentType<any>;
  ReferenceLine: ComponentType<any>;
  ReferenceBand: ComponentType<any>;
  Annotation: ComponentType<any>;
  DataLabels: ComponentType<any>;
  PieCenter: ComponentType<any>;
  PolarCenter: ComponentType<any>;
  AxisBadges: ComponentType<any>;
}

let registry: ChildTypeRegistry | null = null;
/** index.ts registers the concrete component types once at import. */
export function setChartRegistry(r: ChildTypeRegistry): void {
  registry = r;
}
function getRegistry(): ChildTypeRegistry | null {
  return registry;
}

const EMPTY_SUMMARY: ChartChildrenSummary = {
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

// ── Domain computation ───────────────────────────────────────────────────────

function collectXValues(descriptors: ChartChildrenSummary["series"]): (
  | number
  | Date
  | string
)[] {
  const out: (number | Date | string)[] = [];
  for (const d of descriptors) {
    if (
      d.type === "pie" ||
      d.type === "radar" ||
      d.type === "polar" ||
      d.type === "gauge" ||
      d.type === "heatmap" ||
      d.type === "treemap"
    )
      continue;
    for (let i = 0; i < d.data.length; i++) {
      const v = d.xAccessor(d.data[i], i);
      if (v !== null && v !== undefined && v !== "") out.push(v);
    }
  }
  return out;
}

/** Ordered, de-duplicated categories (first-seen order). */
function orderedCategories(values: (number | Date | string)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of values) {
    const s = String(v);
    if (!seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }
  return out;
}

/** y-domain for a set of series (visible only), with per-type defaults. */
function computeYDomain(
  descriptors: ChartChildrenSummary["series"],
  hidden: ReadonlySet<string>,
  override?: [number, number],
): [number, number] {
  if (override) return override;
  const visible = descriptors.filter(
    (d) =>
      d.type !== "pie" &&
      d.type !== "radar" &&
      d.type !== "polar" &&
      d.type !== "gauge" &&
      !hidden.has(d.id) &&
      (d.yAccessor !== undefined ||
        (d.type === "candlestick" && d.lowAccessor !== undefined) ||
        (d.type === "rangeArea" && d.rangeMinAccessor !== undefined)),
  );
  if (visible.length === 0) return [0, 1];
  let min = Infinity;
  let max = -Infinity;
  let hasBar = false;
  // Stacked bar groups contribute their per-category TOTALS to the domain —
  // individual series values only reach ~1/5 of the stacked height, so
  // using them clips the stack tops.
  const stackGroups = new Map<string, ChartChildrenSummary["series"]>();
  for (const d of visible) {
    if (d.type === "bar" && d.barMode && d.barMode !== "group") {
      const key = d.stackId ?? "default";
      const list = stackGroups.get(key) ?? [];
      list.push(d);
      stackGroups.set(key, list);
    }
  }
  for (const d of visible) {
    if (d.type === "bar" || d.type === "waterfall") hasBar = true;
    if (d.type === "candlestick" && d.lowAccessor && d.highAccessor) {
      // Candles span low→high per point.
      for (let i = 0; i < d.data.length; i++) {
        const lo = d.lowAccessor(d.data[i], i);
        const hi = d.highAccessor(d.data[i], i);
        for (const v of [lo, hi]) {
          if (v === null || v === undefined || !Number.isFinite(v as number))
            continue;
          min = Math.min(min, v as number);
          max = Math.max(max, v as number);
        }
      }
      continue;
    }
    if (d.type === "waterfall" && d.waterfallSpans) {
      // Waterfall bars span the running-total range, not the deltas —
      // feed the spans (and the zero baseline) into the domain.
      for (const [lo, hi] of d.waterfallSpans) {
        min = Math.min(min, lo);
        max = Math.max(max, hi);
      }
      continue;
    }
    const stackGroup =
      d.type === "bar" && d.barMode && d.barMode !== "group"
        ? stackGroups.get(d.stackId ?? "default")
        : undefined;
    if (stackGroup && stackGroup.length > 0) {
      // First series of the group feeds the totals; the rest are skipped.
      if (d !== stackGroup[0]) continue;
      const percent = d.barMode === "percent";
      const n = Math.max(...stackGroup.map((s) => s.data.length));
      for (let i = 0; i < n; i++) {
        let total = 0;
        for (const s of stackGroup) {
          const v = s.data[i] != null && s.yAccessor ? s.yAccessor(s.data[i], i) : 0;
          total += Number.isFinite(v as number) ? (v as number) : 0;
        }
        min = Math.min(min, percent ? 0 : total);
        max = Math.max(max, percent ? 100 : total);
      }
      continue;
    }
    for (let i = 0; i < d.data.length; i++) {
      if (d.type === "rangeArea" && d.rangeMinAccessor && d.rangeMaxAccessor) {
        // Bands span min→max per point (like candles span low→high).
        const lo = d.rangeMinAccessor(d.data[i], i);
        const hi = d.rangeMaxAccessor(d.data[i], i);
        for (const v of [lo, hi]) {
          if (v === null || v === undefined || !Number.isFinite(v as number))
            continue;
          min = Math.min(min, v as number);
          max = Math.max(max, v as number);
        }
        continue;
      }
      const v = d.yAccessor!(d.data[i], i);
      if (v === null || v === undefined || !Number.isFinite(v as number)) continue;
      min = Math.min(min, v as number);
      max = Math.max(max, v as number);
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
  if (min === max) {
    min -= 1;
    max += 1;
  }
  if (hasBar) {
    // Bars anchor at zero when the data is all positive/negative.
    if (min > 0) min = 0;
    if (max < 0) max = 0;
  } else {
    // Lines/candles: 5% breathing room.
    const pad = (max - min) * 0.05;
    min -= pad;
    max += pad;
  }
  return [min, max];
}

// ── Hover helpers ────────────────────────────────────────────────────────────

function nearestIndex(sorted: number[], target: number): number {
  if (sorted.length === 0) return -1;
  let lo = 0;
  let hi = sorted.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  if (
    lo > 0 &&
    Math.abs(sorted[lo - 1] - target) <= Math.abs(sorted[lo] - target)
  ) {
    return lo - 1;
  }
  return lo;
}

// ── Component ────────────────────────────────────────────────────────────────

export function ChartRootImpl({
  height: heightProp,
  margin,
  theme: themeMode,
  animation,
  loading,
  loaderType = "skeleton",
  loaderTitle,
  loaderMessage,
  loaderProgress,
  loaderColor,
  error,
  ariaLabel,
  hoverDim,
  sync,
  children,
  hostRef,
  renderer,
}: ChartRootProps & { renderer: ChartRenderer; hostRef: Ref<ChartHandle> }) {
  const hoverDimValue = Math.max(0, Math.min(1, hoverDim ?? 1));
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const height = heightProp ?? 400;
  const { effectiveTheme } = useTheme();

  // ── Container size ─────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setWidth(w);
    };
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, []);

  // ── Children summary ───────────────────────────────────────────────────────
  const reg = getRegistry();
  const summary = useMemo(
    () => (reg ? summarizeChildren(children, reg) : EMPTY_SUMMARY),
    // children identity changes when the parent re-renders — that is the
    // trigger we want (prop changes flow through).
    [children, reg],
  );

  const cartesianSeries = summary.series.filter(
    (d) =>
      d.type !== "pie" &&
      d.type !== "radar" &&
      d.type !== "polar" &&
      d.type !== "gauge" &&
      d.type !== "heatmap" &&
      d.type !== "treemap",
  );
  /**
   * Transposed cartesian: a horizontal waterfall carries its values on the
   * x axis and its categories on a band y axis.
   */
  const transposed =
    cartesianSeries.some(
      (d) => d.type === "waterfall" && d.waterfallOrientation === "horizontal",
    );
  const radarSeries = summary.series.filter((d) => d.type === "radar");
  const hasRadar = radarSeries.length > 0;
  const polarSeries = summary.series.filter((d) => d.type === "polar");
  const hasPolar = polarSeries.length > 0;
  const hasCartesian = cartesianSeries.length > 0;
  const showXAxis = hasCartesian || summary.hasXAxis;
  const showYAxis = hasCartesian;
  const needsRightYAxis =
    summary.yAxisRight ||
    cartesianSeries.some((d) => d.yFieldAxis === "right");

  // ── Legend visibility state ────────────────────────────────────────────────
  const [hiddenIds, setHiddenIds] = useState<ReadonlySet<string>>(
    () => new Set<string>(),
  );
  const toggleSeries = useCallback((id: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // ── Theme ──────────────────────────────────────────────────────────────────
  const themeName: ChartThemeMode =
    themeMode === "light" || themeMode === "dark" ? themeMode : effectiveTheme;
  const tokens = useMemo(() => getChartTheme(themeName), [themeName]);

  // ── Layout ─────────────────────────────────────────────────────────────────
  const layout: ChartLayout = useMemo(
    () =>
      computeLayout({
        width,
        height,
        margin,
        hasTitle: summary.hasTitle,
        hasSubtitle: summary.hasTitle && !!summary.subtitle,
        hasLegend: summary.hasLegend,
        legendPosition: summary.legendPosition,
        hasCaption: summary.hasCaption,
        hasXAxis: showXAxis,
        hasYAxis: showYAxis,
        hasRightYAxis: needsRightYAxis,
      }),
    [
      width,
      height,
      margin,
      summary.hasTitle,
      summary.hasTitle && !!summary.subtitle,
      summary.hasLegend,
      summary.legendPosition,
      summary.hasCaption,
      showXAxis,
      showYAxis,
      needsRightYAxis,
    ],
  );
  const area = layout.chartArea;
  // Heatmap: self-contained grid — compute the layout (gutters, cell
  // sizes) for drawing and hover hit-testing.
  const heatmapSeries = useMemo(
    () => summary.series.filter((d) => d.type === "heatmap"),
    [summary.series],
  );
  const heatmapLayout = useMemo(() => {
    const me = heatmapSeries[0];
    if (!me) return null;
    const rows = me.heatmapRows ?? [];
    const cols = me.heatmapCols ?? [];
    const rowLabels = me.heatmapRowLabels ?? true;
    const longest = rowLabels ? Math.max(0, ...rows.map((r) => r.length)) : 0;
    const gutter =
      me.heatmapRowLabelWidth ?? (rowLabels ? longest * 6.4 + 10 : 0);
    const layout = computeHeatmapLayout({
      area: { x: area.x, y: area.y, width: area.width, height: area.height },
      rowLabelWidth: gutter,
      colsCount: cols.length,
      rowsCount: rows.length,
      showColLabels: me.heatmapColLabels ?? true,
      showLegend: me.heatmapShowLegend ?? true,
    });
    return { descriptor: me, rows, cols, layout, gutter };
  }, [heatmapSeries, area]);



  // Treemap: self-contained squarified layout for drawing + hover.
  const treemapSeries = useMemo(
    () => summary.series.filter((d) => d.type === "treemap"),
    [summary.series],
  );
  const treemapLayout = useMemo(() => {
    const me = treemapSeries[0];
    if (!me || !me.treemapItems?.length) return null;
    const items = me.treemapItems;
    const grouped = (me.treemapGroups?.length ?? 0) > 0;
    const hh = me.treemapGroupHeaderHeight ?? 18;
    const groups: { name: string; values: number[] }[] = grouped
      ? (me.treemapGroups ?? []).map((g) => ({
          name: g,
          values: items
            .filter((it) => it.group === g)
            .map((it) => it.value),
        }))
      : [{ name: me.name ?? "Treemap", values: items.map((it) => it.value) }];
    const layout = computeTreemapLayout(
      { x: area.x, y: area.y, width: area.width, height: area.height },
      groups,
      grouped ? hh : 0,
    );
    const groupDataIdx: number[][] = groups.map((g) => {
      if (!grouped) return items.map((_, i) => i);
      const out: number[] = [];
      items.forEach((it, i) => {
        if (it.group === g.name) out.push(i);
      });
      return out;
    });
    return { descriptor: me, items, grouped, layout, groupDataIdx };
  }, [treemapSeries, area]);

  // ── Radar layout (shared polar space) ─────────────────────────────────────
  // The radar center/radius live in the plot area; rings and spokes are
  // computed once and shared by the grid layer and every radar series.
  const radarLayout = useMemo<RadarLayout | null>(() => {
    if (!hasRadar || area.width <= 0 || area.height <= 0) return null;
    const first = radarSeries[0];
    const axes: string[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < first.data.length; i++) {
      const a = String(first.radarAxisAccessor?.(first.data[i], i) ?? i);
      if (!seen.has(a)) {
        seen.add(a);
        axes.push(a);
      }
    }
    if (axes.length < 3) return null; // need ≥3 axes for a polygon
    const cx = area.x + area.width / 2;
    const cy = area.y + area.height / 2;
    const R = Math.max(10, Math.min(area.width, area.height) / 2 - 48);
    const cfg = summary.radarAxis;
    const rings = cfg?.rings ?? 4;
    let domainMax = cfg?.domainMax;
    if (!Number.isFinite(domainMax) || (domainMax as number) <= 0) {
      let max = 0;
      for (const d of radarSeries) {
        for (let i = 0; i < d.data.length; i++) {
          const v = d.radarAccessor?.(d.data[i], i);
          if (v !== null && v !== undefined && Number.isFinite(v as number))
            max = Math.max(max, v as number);
        }
      }
      domainMax = niceRadarMax(max, rings);
    }
    return {
      cx,
      cy,
      R,
      domainMax: domainMax as number,
      axisCount: axes.length,
      axes,
    };
  }, [hasRadar, area, radarSeries, summary.radarAxis]);

  const radarGrid = useMemo(() => {
    if (!radarLayout) return null;
    return computeRadarGrid({
      axes: radarLayout.axes,
      cx: radarLayout.cx,
      cy: radarLayout.cy,
      R: radarLayout.R,
      rings: summary.radarAxis?.rings ?? 4,
      domainMax: radarLayout.domainMax,
      format: summary.radarAxis?.tickFormat,
    });
  }, [radarLayout, summary.radarAxis]);

  // The polar center/radius/labels live in the plot area; rings and spokes
  // are computed once and shared by the grid layer and every polar series.
  const polarLayout = useMemo<PolarLayout | null>(() => {
    if (!hasPolar || area.width <= 0 || area.height <= 0) return null;
    const first = polarSeries[0];
    const cats: { label: string; index: number }[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < first.data.length; i++) {
      const label = String(
        first.polarCategoryAccessor?.(first.data[i], i) ?? i,
      );
      if (!seen.has(label)) {
        seen.add(label);
        cats.push({ label, index: i });
      }
    }
    if (cats.length < 2) return null; // need ≥2 categories
    const cx = area.x + area.width / 2;
    const cy = area.y + area.height / 2;
    const R = Math.max(10, Math.min(area.width, area.height) / 2 - 56);
    const cfg = summary.polarAxis;
    const mode = first.polarMode ?? "group";
    const rings = cfg?.gridLines ?? 4;
    // Category totals (all polar series) drive sort + the stack scale.
    const totals = cats.map((c) => {
      let t = 0;
      for (const d of polarSeries) {
        const v = d.polarAccessor?.(d.data[c.index], c.index);
        if (v !== null && v !== undefined && Number.isFinite(v as number))
          t += v as number;
      }
      return t;
    });
    let order = cats.map((_, i) => i);
    const sort = cfg?.sort ?? "none";
    if (sort === "desc")
      order = order.slice().sort((a, b) => totals[b] - totals[a]);
    else if (sort === "asc")
      order = order.slice().sort((a, b) => totals[a] - totals[b]);
    const categories = order.map((i) => cats[i].label);
    const categoryOrder = order.map((i) => cats[i].index);
    // Cross-series totals per DISPLAYED category (shared stack scale).
    const categoryTotals = order.map((_, j) => {
      const dataIdx = categoryOrder[j];
      let t = 0;
      for (const d of polarSeries) {
        const v = d.polarAccessor?.(d.data[dataIdx], dataIdx);
        if (v !== null && v !== undefined && Number.isFinite(v as number))
          t += v as number;
      }
      return t;
    });
    let domainMax = cfg?.domainMax;
    if (!Number.isFinite(domainMax) || (domainMax as number) <= 0) {
      let max = 0;
      for (const d of polarSeries) {
        for (let i = 0; i < d.data.length; i++) {
          const v = d.polarAccessor?.(d.data[i], i);
          if (v !== null && v !== undefined && Number.isFinite(v as number))
            max = Math.max(max, v as number);
        }
      }
      if (mode === "stack") {
        // Stack mode scales on the max category total.
        max = Math.max(max, ...totals);
      }
      domainMax = nicePolarMax(max, rings);
    }
    const innerR =
      Math.max(
        ...polarSeries.map(
          (d) => Math.max(0, Math.min(0.95, d.polarInnerRadius ?? 0)),
        ),
        0,
      ) * R;
    const gapPx = first.polarSegmentGap ?? 3;
    return {
      cx,
      cy,
      R,
      innerR,
      domainMax: domainMax as number,
      valueMax: domainMax as number,
      categories,
      categoryOrder,
      sort,
      mode,
      segmentRadius: first.polarSegmentRadius ?? 0,
      bandGap: 3,
      gapAngle: Math.max(0.008, gapPx / R),
      categoryTotals,
    };
  }, [hasPolar, area, polarSeries, summary.polarAxis]);

  const polarGrid = useMemo(() => {
    if (!polarLayout) return null;
    return computePolarGrid({
      categories: polarLayout.categories,
      cx: polarLayout.cx,
      cy: polarLayout.cy,
      R: polarLayout.R,
      rings: summary.polarAxis?.gridLines ?? 4,
      domainMax: polarLayout.domainMax,
      shape: summary.polarAxis?.gridShape ?? "circle",
      format: summary.polarAxis?.tickFormat,
      innerR: polarLayout.innerR,
    });
  }, [polarLayout, summary.polarAxis]);

  // Resolved grid styles (shared GridSpec) for the radial grids.
  const radarGridSpec = useMemo(
    () =>
      resolveGrid(
        {
          gridStyle: summary.radarAxis?.gridStyle,
          gridWidth: summary.radarAxis?.gridWidth,
          gridOpacity: summary.radarAxis?.gridOpacity,
          gridColor: summary.radarAxis?.gridColor,
        },
        tokens.gridColor,
      ),
    [summary.radarAxis, tokens.gridColor],
  );
  const polarGridSpec = useMemo(
    () =>
      resolveGrid(
        {
          gridStyle: summary.polarAxis?.gridStyle,
          gridWidth: summary.polarAxis?.gridWidth,
          gridOpacity: summary.polarAxis?.gridOpacity,
          gridColor: summary.polarAxis?.gridColor,
        },
        tokens.gridColor,
      ),
    [summary.polarAxis, tokens.gridColor],
  );

  // ── Scales ─────────────────────────────────────────────────────────────────
  const xDomainValues = useMemo(
    () => {
      if (transposed) {
        // Values live on the x axis: feed the waterfall spans (running
        // totals) into the numeric domain.
        const vals: number[] = [];
        for (const d of cartesianSeries) {
          if (d.type !== "waterfall" || d.waterfallOrientation !== "horizontal")
            continue;
          for (const [lo, hi] of d.waterfallSpans ?? []) vals.push(lo, hi);
        }
        return vals;
      }
      return collectXValues(cartesianSeries);
    },
    [cartesianSeries, transposed],
  );
  const xIsTime = isTimeDomain(xDomainValues);

  const xScale: AnyScale | null = useMemo(() => {
    if (!hasCartesian || xDomainValues.length === 0) return null;
    const range: [number, number] = [area.x, area.x + area.width];
    if (xIsTime) {
      const ms = xDomainValues.map((v) => toDate(v)?.getTime() ?? NaN);
      const finite = ms.filter((m) => Number.isFinite(m));
      if (finite.length === 0) return null;
      return createTimeScale({
        domain: [
          new Date(Math.min(...finite)),
          new Date(Math.max(...finite)),
        ],
        range,
        tickCount: summary.xAxisTickCount,
      });
    }
    if (xDomainValues.every((v) => typeof v === "string")) {
      return createBandScale({
        categories: orderedCategories(xDomainValues),
        range,
      });
    }
    const nums = xDomainValues.map((v) => Number(v));
    // Log-10 x (numeric domains only; time/categorical fall through).
    if (summary.xAxisLog) {
      const pos = nums.filter((v) => Number.isFinite(v) && v > 0);
      if (pos.length > 0) {
        return createLogScale({
          domain: [Math.min(...pos), Math.max(...pos)],
          range,
          tickCount: summary.xAxisTickCount,
        });
      }
    }
    return createLinearScale({
      domain: [Math.min(...nums), Math.max(...nums)],
      range,
      nice: transposed,
    });
  }, [
    hasCartesian,
    xDomainValues,
    xIsTime,
    area,
    summary.xAxisTickCount,
    summary.xAxisLog,
    transposed,
  ]);

  const xIsCategorical = xScale !== null && "bandWidth" in xScale;

  const leftYDomain = useMemo(
    () =>
      computeYDomain(
        cartesianSeries.filter((d) => d.yFieldAxis !== "right"),
        hiddenIds,
        summary.yAxisLeft.domain,
      ),
    [cartesianSeries, hiddenIds, summary.yAxisLeft.domain],
  );
  const yScale: ContinuousScale | CategoricalScale | null = useMemo(() => {
    if (!showYAxis) return null;
    if (transposed) {
      // Categories ride the y axis, in data order.
      const cats: string[] = [];
      for (const d of cartesianSeries) {
        if (d.type !== "waterfall" || d.waterfallOrientation !== "horizontal")
          continue;
        for (let i = 0; i < d.data.length; i++) {
          const c = String(d.xAccessor(d.data[i], i));
          if (!cats.includes(c)) cats.push(c);
        }
      }
      return createBandScale({
        categories: cats,
        range: [area.y, area.y + area.height],
      });
    }
    const range: [number, number] = [area.y + area.height, area.y];
    // Log-10 y: the domain must be strictly positive — clamp a zero/negative
    // lower bound (bars pin min to 0) to 10% of the top of the domain.
    if (summary.yAxisLeft.log) {
      const [lo0, hi] = leftYDomain;
      if (hi > 0) {
        return createLogScale({
          domain: [lo0 > 0 ? lo0 : hi * 0.1, hi],
          range,
          tickCount: summary.yAxisLeft.tickCount,
        });
      }
    }
    return createLinearScale({
      domain: leftYDomain,
      range,
      nice: !summary.yAxisLeft.domain,
    });
  }, [
    showYAxis,
    leftYDomain,
    area,
    summary.yAxisLeft.domain,
    summary.yAxisLeft.log,
    summary.yAxisLeft.tickCount,
    transposed,
    cartesianSeries,
  ]);
  /** Continuous view of the y scale (null when a band scale is present). */
  const yCont: ContinuousScale | null =
    yScale !== null && !("bandWidth" in yScale)
      ? (yScale as ContinuousScale)
      : null;

  const rightSeries = useMemo(
    () => cartesianSeries.filter((d) => d.yFieldAxis === "right"),
    [cartesianSeries],
  );
  const rightYScale: ContinuousScale | null = useMemo(() => {
    if (!needsRightYAxis || rightSeries.length === 0) return null;
    const range: [number, number] = [area.y + area.height, area.y];
    if (summary.yAxisRightLog) {
      const [lo0, hi] = computeYDomain(rightSeries, hiddenIds);
      if (hi > 0) {
        return createLogScale({ domain: [lo0 > 0 ? lo0 : hi * 0.1, hi], range });
      }
    }
    const [lo, hi] = computeYDomain(rightSeries, hiddenIds);
    return createLinearScale({
      domain: [lo, hi],
      range,
    });
  }, [needsRightYAxis, rightSeries, hiddenIds, area, summary.yAxisRightLog]);

  // ── Scatter layout (settled point geometry per series, for hit tests) ─────
  const scatterSeries = useMemo(
    () => summary.series.filter((d) => d.type === "scatter"),
    [summary.series],
  );
  const hasScatter = scatterSeries.length > 0;
  const scatterLayout = useMemo(() => {
    if (!hasScatter || !xScale || !yScale) return null;
    return scatterSeries.map((d) => {
      const vs =
        d.yFieldAxis === "right" && rightYScale ? rightYScale : yScale!;
      const geometry = computeScatterGeometry({
        data: d.data,
        xAccessor: d.xAccessor,
        yAccessor: d.yAccessor ?? (() => null),
        sizeAccessor: d.scatterSizeAccessor,
        xScale,
        yScale: vs as ContinuousScale,
        minSize: d.scatterMinSize,
        maxSize: d.scatterMaxSize,
      });
      return {
        id: d.id,
        geometry,
        hitRadius: d.scatterHitRadius ?? 2,
      };
    });
  }, [
    hasScatter,
    scatterSeries,
    xScale,
    yScale,
    rightYScale,
  ]);


  // ── Series state ───────────────────────────────────────────────────────────
  const series: SeriesState[] = useMemo(
    () =>
      summary.series.map((d) => {
        const [colors] = resolveSeriesColors([d], DEFAULT_SERIES_PALETTE);
        return { descriptor: d, ...colors, hidden: hiddenIds.has(d.id) };
      }),
    [summary.series, hiddenIds],
  );

  // ── Animation ──────────────────────────────────────────────────────────────
  const animationsDisabled = animation === false || prefersReducedMotion();
  const duration = animation ? (animation.duration ?? 1000) : 1000;
  const easingName = animation ? (animation.easing ?? "easeOutQuart") : "linear";
  const animType: ChartAnimationType =
    typeof animation === "object" && animation !== null
      ? animation.type ?? "grow"
      : "grow";

  // ── Series element tokens ─────────────────────────────────────────────────
  // Several series may share one data array (or a type), which makes
  // descriptor matching by id/data ambiguous. The root resolves this
  // authoritatively: it stamps each series element (via cloneElement) with
  // its own element object as `__chartSeriesToken`, and the series
  // components look their state up through this map.
  const elements = flattenChartChildren(children);
  const seriesTokens = useMemo(() => {
    const map = new Map<object, SeriesState>();
    let k = 0;
    for (const c of elements) {
      if (typeof c !== "object" || c === null) continue;
      const t = (c as { type?: unknown }).type;
      if (
        reg &&
        (t === reg.Line ||
          t === reg.Bar ||
          t === reg.Pie ||
          t === reg.Candlestick ||
          t === reg.RangeArea ||
          t === reg.Radar ||
          t === reg.Polar)
      ) {
        const state = series[k];
        if (state) map.set(c, state);
        k += 1;
      }
    }
    return map;
  }, [elements, series, reg]);

  // ── Annotation layout ────────────────────────────────────────────────────
  // Resolves every callout card position in one pass so cards never
  // overlap; the Annotation components look their own rect up by the
  // element identity the root stamped below.
  const annotationLayout = useMemo(() => {
    const map = new Map<object, AnnotationCardRect | null>();
    if (!reg || !reg.Annotation) return map;
    const inputs: Array<{
      el: object;
      px: number;
      py: number;
      placement: "auto" | "top" | "bottom" | "left" | "right";
      cardW: number;
    }> = [];
    for (const c of elements) {
      if (typeof c !== "object" || c === null) continue;
      if ((c as { type?: unknown }).type !== reg.Annotation) continue;
      const p = (c as ReactElement<Record<string, unknown>>).props;
      const x = p.x as number | Date | string | undefined;
      const y = p.y as number | undefined;
      let px: number | null = null;
      let py: number | null = null;
      if (transposed) {
        // Transposed: x prop = category (band y axis), y prop = value (x axis).
        if (x !== undefined && yScale && "bandWidth" in yScale) {
          py = yScale.center(String(x));
        }
        if (y !== undefined && xScale && !("bandWidth" in xScale)) {
          px = (xScale as ContinuousScale).map(y);
        }
      } else {
        if (x !== undefined && xScale) {
          px = "bandWidth" in xScale
            ? xScale.center(String(x))
            : (xScale as ContinuousScale).map(x as never);
        }
        if (y !== undefined && yScale && !("bandWidth" in yScale)) {
          py = (yScale as ContinuousScale).map(y);
        }
      }
      if (px === null || !Number.isFinite(px) || py === null || !Number.isFinite(py)) {
        map.set(c, null);
        continue;
      }
      inputs.push({
        el: c,
        px,
        py,
        placement: (p.placement as "auto" | "top" | "bottom" | "left" | "right") ?? "auto",
        cardW:
          20 +
          Math.max(
            String(p.title ?? "").length,
            String(p.value ?? "").length,
          ) * 7.2,
      });
    }
    const rects = layoutAnnotationCards(inputs, {
      area,
      width,
      height,
    });
    inputs.forEach((inp, i) => {
      map.set(inp.el, rects[i] ?? null);
    });
    return map;
  }, [elements, reg, xScale, yScale, area, width, height, transposed]);

  const [progress, setProgress] = useState(animationsDisabled ? 1 : 0);
  const progressRef = useRef(progress);
  const settled = progress >= 1;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawFnsRef = useRef<
    Map<string, { fn: ChartDrawFn; layer: "back" | "front" }>
  >(new Map());
  const piePresentationsRef = useRef<
    Map<string, import("./ChartContext").PiePresentation>
  >(new Map());
  const drawOnceRef = useRef<() => void>(() => {});
  const rafRef = useRef<number | null>(null);
  const [redrawNonce, setRedrawNonce] = useState(0);

  drawOnceRef.current = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const w = Math.round(width * dpr);
    const h = Math.round(height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const state = { progress: progressRef.current, width, height };
    const entries = [...drawFnsRef.current.entries()];
    for (const e of entries.filter(([, d]) => d.layer === "back"))
      e[1].fn(ctx, state);
    for (const e of entries.filter(([, d]) => d.layer === "front"))
      e[1].fn(ctx, state);
  };

  const scheduleCanvasDraw = useCallback(() => {
    if (renderer !== "canvas") return;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      drawOnceRef.current();
    });
  }, [renderer]);

  const registerDraw = useCallback(
    (id: string, fn: ChartDrawFn, layer: "back" | "front" = "front") => {
      drawFnsRef.current.set(id, { fn, layer });
      scheduleCanvasDraw();
    },
    [scheduleCanvasDraw],
  );
  const unregisterDraw = useCallback(
    (id: string) => {
      drawFnsRef.current.delete(id);
      scheduleCanvasDraw();
    },
    [scheduleCanvasDraw],
  );

  // Canvas: paint the shared radar grid (rings, spokes, labels) in the back
  // layer, ahead of the series polygons.
  useEffect(() => {
    if (!radarGrid || renderer !== "canvas") return;
    const g = radarGrid;
    const showLabels = summary.radarAxis?.showAxisLabels !== false;
    const spec = radarGridSpec;
    registerDraw(
      "radar-grid",
      (c) => {
        c.save();
        c.lineWidth = spec.width;
        c.strokeStyle = spec.color;
        c.globalAlpha = spec.opacity;
        c.setLineDash(gridLineDash(spec.style));
        for (const d of g.ringPaths) {
          c.stroke(new Path2D(d));
        }
        c.setLineDash([]);
        c.globalAlpha = 0.55 * spec.opacity;
        c.beginPath();
        for (const sp of g.spokes) {
          c.moveTo(sp.x1, sp.y1);
          c.lineTo(sp.x2, sp.y2);
        }
        c.stroke();
        c.globalAlpha = spec.opacity;
        c.font = "10px sans-serif";
        c.fillStyle = tokens.subtleText;
        c.textAlign = "right";
        c.textBaseline = "middle";
        for (const t of g.tickLabels) c.fillText(t.text, t.x, t.y);
        if (showLabels) {
          c.font = "11px sans-serif";
          c.fillStyle = tokens.textColor;
          for (const sp of g.spokes) {
            const cos = Math.cos(sp.angle);
            const sin = Math.sin(sp.angle);
            const lx = g.cx + (g.R + 14) * cos;
            const ly = g.cy + (g.R + 14) * sin;
            c.textAlign = Math.abs(cos) < 0.3 ? "center" : cos > 0 ? "left" : "right";
            c.textBaseline = Math.abs(sin) < 0.3 ? "middle" : sin > 0 ? "top" : "bottom";
            c.fillText(sp.label, lx, ly);
          }
        }
        c.globalAlpha = 1;
        c.restore();
      },
      "back",
    );
    return () => unregisterDraw("radar-grid");
  }, [radarGrid, renderer, registerDraw, unregisterDraw, tokens, summary.radarAxis, radarGridSpec]);

  // Canvas: paint the shared polar grid (rings, spokes, labels) in the back
  // layer, ahead of the segment marks.
  useEffect(() => {
    if (!polarGrid || !polarLayout || renderer !== "canvas") return;
    const g = polarGrid;
    const showTickLabels = summary.polarAxis?.showTickLabels === true;
    const showLabels =
      polarSeries[0]?.polarShowLabels !== false && polarSeries.length > 0;
    const spec = polarGridSpec;
    registerDraw(
      "polar-grid",
      (c) => {
        c.save();
        c.lineWidth = spec.width;
        c.strokeStyle = spec.color;
        c.globalAlpha = spec.opacity;
        c.setLineDash(gridLineDash(spec.style));
        for (const d of g.ringPaths) {
          c.stroke(new Path2D(d));
        }
        c.setLineDash([]);
        c.globalAlpha = 0.55 * spec.opacity;
        c.beginPath();
        for (const sp of g.spokes) {
          c.moveTo(sp.x1, sp.y1);
          c.lineTo(sp.x2, sp.y2);
        }
        c.stroke();
        if (showTickLabels) {
          c.globalAlpha = spec.opacity;
          c.font = "10px sans-serif";
          c.fillStyle = tokens.subtleText;
          c.textAlign = "right";
          c.textBaseline = "middle";
          for (const t of g.tickLabels) c.fillText(t.text, t.x, t.y);
        }
        if (showLabels) {
          c.globalAlpha = 1;
          c.font = "11px sans-serif";
          c.fillStyle = tokens.textColor;
          for (const sp of g.spokes) {
            const cos = Math.cos(sp.angle);
            const sin = Math.sin(sp.angle);
            const lx = g.cx + (g.R + 14) * cos;
            const ly = g.cy + (g.R + 14) * sin;
            c.textAlign = Math.abs(cos) < 0.3 ? "center" : cos > 0 ? "left" : "right";
            c.textBaseline = Math.abs(sin) < 0.3 ? "middle" : sin > 0 ? "top" : "bottom";
            c.fillText(sp.label, lx, ly);
          }
        }
        c.restore();
      },
      "back",
    );
    return () => unregisterDraw("polar-grid");
  }, [polarGrid, polarLayout, renderer, registerDraw, unregisterDraw, tokens, summary.polarAxis, polarGridSpec, polarSeries]);
  const requestRedraw = useCallback(() => setRedrawNonce((n) => n + 1), []);

  useImperativeHandle(
    hostRef,
    () => ({ redraw: requestRedraw }),
    [requestRedraw],
  );

  const animatorRef = useRef<{ start: () => void; cancel: () => void } | null>(null);
  const runAnimation = useCallback(
    (immediate: boolean) => {
      animatorRef.current?.cancel();
      if (immediate) {
        progressRef.current = 1;
        setProgress(1);
        scheduleCanvasDraw();
        return;
      }
      const anim = createAnimator({
        duration,
        easing: easingName,
        onFrame: (p) => {
          progressRef.current = p;
          if (renderer === "svg") setProgress(p);
          else scheduleCanvasDraw();
        },
        onDone: () => {
          progressRef.current = 1;
          setProgress(1);
          scheduleCanvasDraw();
        },
      });
      animatorRef.current = anim;
      anim.start();
    },
    [duration, easingName, renderer, scheduleCanvasDraw],
  );

  // Cheap data signature (length + first/last item + visibility) that gates
  // the update animation; geometry itself is always recomputed fresh.
  const dataSig = useMemo(() => {
    const parts = summary.series.map((d) => {
      const a = d.data;
      return `${d.id}:${a.length}:${JSON.stringify(a[0] ?? null)}:${JSON.stringify(
        a.length ? a[a.length - 1] : null,
      )}`;
    });
    return parts.join("|") + "##" + Array.from(hiddenIds).sort().join(",");
  }, [summary.series, hiddenIds]);

  useEffect(() => {
    runAnimation(animationsDisabled);
  }, [dataSig, animationsDisabled, runAnimation]);

  useEffect(() => () => animatorRef.current?.cancel(), []);

  // Canvas: repaint on every relevant change (and at settle).
  const [hover, setHover] = useState<HoverState | null>(null);

  // ── Group sync (Chart.Group + sync prop) ─────────────────────────────────
  const group = useChartGroup();
  const syncId = useId();
  const syncing = Boolean(sync && group);
  const lastSyncedRef = useRef<string | number | null>(undefined);
  // refs to the latest values so the registered `apply` never goes stale
  // (computeHover is assigned below, after its declaration)
  const computeHoverRef = useRef<
    ((px: number, py: number) => HoverState | null) | null
  >(null);
  const xScaleRef = useRef(xScale);
  xScaleRef.current = xScale;
  const areaRef = useRef(area);
  areaRef.current = area;

  const broadcastSync = useCallback(
    (rawX: string | number | null) => {
      if (!group || !syncing) return;
      if (rawX === lastSyncedRef.current) return;
      lastSyncedRef.current = rawX;
      group.broadcast(rawX, syncId);
    },
    [group, syncing, syncId],
  );

  const applySync = useCallback(
    (rawX: string | number | null) => {
      if (rawX == null) {
        setHover(null);
        return;
      }
      const xs = xScaleRef.current;
      const a = areaRef.current;
      if (!xs || !a) return;
      let px: number | null = null;
      if ("bandWidth" in xs) {
        const cat = String(rawX);
        if (xs.domain.includes(cat)) px = xs.center(cat);
      } else {
        const num = typeof rawX === "number" ? rawX : Number(rawX);
        if (Number.isFinite(num)) px = (xs as ContinuousScale).map(num as never);
      }
      if (px == null) return;
      const fn = computeHoverRef.current;
      if (!fn) return;
      setHover(fn(px, a.y + a.height / 2));
    },
    [],
  );

  useEffect(() => {
    if (!group || !syncing) return;
    group.register(syncId, applySync);
    return () => group.unregister(syncId);
  }, [group, syncing, syncId, applySync]);

  useEffect(() => {
    if (renderer === "canvas") scheduleCanvasDraw();
  }, [
    renderer,
    settled,
    width,
    height,
    redrawNonce,
    hiddenIds,
    themeName,
    hover,
    scheduleCanvasDraw,
  ]);

  // ── Hover ──────────────────────────────────────────────────────────────────
  const computeHover = useCallback(
    (px: number, py: number): HoverState | null => {
      const visible = series.filter((s) => !s.hidden);
      if (visible.length === 0) return null;

      const pieVisible = visible.filter((s) => s.descriptor.type === "pie");
      const gaugeVisible = visible.filter((s) => s.descriptor.type === "gauge");
      const heatmapVisible = visible.filter(
        (s) => s.descriptor.type === "heatmap",
      );
      const treemapVisible = visible.filter(
        (s) => s.descriptor.type === "treemap",
      );
      const radarVisible = visible.filter(
        (s) => s.descriptor.type === "radar",
      );
      const polarVisible = visible.filter(
        (s) => s.descriptor.type === "polar",
      );
      const cartVisible = visible.filter(
        (s) =>
          s.descriptor.type !== "pie" &&
          s.descriptor.type !== "gauge" &&
          s.descriptor.type !== "radar" &&
          s.descriptor.type !== "polar" &&
          s.descriptor.type !== "heatmap" &&
          s.descriptor.type !== "treemap",
      );
      // Radar charts: snap to the nearest axis, one row per series.
      if (
        radarVisible.length > 0 &&
        cartVisible.length === 0 &&
        radarLayout
      ) {
        const { cx, cy, R, domainMax, axisCount, axes } = radarLayout;
        const dx = px - cx;
        const dy = py - cy;
        if (Math.hypot(dx, dy) > R * 1.15) return null;
        const step = (Math.PI * 2) / axisCount;
        let rel = Math.atan2(dy, dx) + Math.PI / 2;
        while (rel < 0) rel += Math.PI * 2;
        while (rel >= Math.PI * 2) rel -= Math.PI * 2;
        const idx =
          ((Math.round(rel / step) % axisCount) + axisCount) % axisCount;
        const a = -Math.PI / 2 + idx * step;
        const items: HoverState["items"] = [];
        for (const s of radarVisible) {
          const d = s.descriptor;
          const row = d.data[idx];
          const v = d.radarAccessor?.(row, idx);
          if (v === null || v === undefined || !Number.isFinite(v as number))
            continue;
          const r = Math.max(0, Math.min(1, (v as number) / domainMax)) * R;
          items.push({
            seriesId: d.id,
            name: d.name,
            color: s.color,
            value: v as number,
            y: cy + r * Math.sin(a),
            item: row,
            index: idx,
          });
        }
        if (items.length === 0) return null;
        return {
          x: cx + R * Math.cos(a),
          y: cy + R * Math.sin(a),
          pointerX: px,
          pointerY: py,
          rawX: axes[idx],
          items,
        };
      }

      // Polar charts: exact segment hit test, one row per series.
      if (polarVisible.length > 0 && cartVisible.length === 0 && polarLayout) {
        const { cx, cy, R, categories, categoryOrder, valueMax, innerR, mode } =
          polarLayout;
        if (Math.hypot(px - cx, py - cy) > R * 1.15) return null;
        const geometry = computePolarGeometry({
          categories,
          series: polarVisible.map((s) => ({
            id: s.descriptor.id,
            values: s.descriptor.data.map((item, i) => {
              const v = s.descriptor.polarAccessor?.(item, i);
              return v === undefined ? null : v;
            }),
          })),
          mode,
          cx,
          cy,
          R,
          innerR,
          valueMax,
          maxTotal: Math.max(
            ...polarLayout.categoryTotals,
            0,
          ),
          gapAngle: polarLayout.gapAngle,
          bandGap: polarLayout.bandGap,
          segmentRadius: 0,
        });
        const hit = hitTestPolar(geometry.segments, px, py, cx, cy);
        if (!hit) return null;
        const dataIdx = categoryOrder[hit.categoryIndex];
        const yMid =
          cy + ((hit.rInner + hit.rOuter) / 2) * Math.sin(hit.midAngle);
        const items: HoverState["items"] = [];
        // Every series of the hovered category gets a row (tooltip lists
        // them all); the pointer-hit series is tagged as the "hovered"
        // one (seriesId = its id) and the others are prefixed so hoverDim
        // fades exactly the non-hit series while the Tooltip keeps the
        // clean series names via `name`.
        for (const s of polarVisible) {
          const d = s.descriptor;
          const row = d.data[dataIdx];
          const v = d.polarAccessor?.(row, dataIdx);
          if (v === null || v === undefined || !Number.isFinite(v as number))
            continue;
          const isHit = d.id === hit.seriesId;
          items.push({
            seriesId: isHit ? d.id : `polar-dim:${d.id}`,
            name: d.name,
            color: s.color,
            value: v as number,
            y: yMid,
            item: row,
            index: dataIdx,
          });
        }
        if (items.length === 0) return null;
        return {
          x: cx + ((hit.rInner + hit.rOuter) / 2) * Math.cos(hit.midAngle),
          y: yMid,
          pointerX: px,
          pointerY: py,
          rawX: categories[hit.categoryIndex],
          items,
        };
      }

      // Scatter charts: nearest-point hit test (scatter-only charts;
      // mixed charts keep the line/bar snapping behaviour below).
      const scatterVisible = visible.filter(
        (s) => s.descriptor.type === "scatter",
      );
      if (
        scatterVisible.length > 0 &&
        cartVisible.length === scatterVisible.length &&
        xScale &&
        yScale &&
        scatterLayout
      ) {
        let best: {
          seriesId: string;
          name?: string;
          color: string;
          point: { x: number; y: number; r: number };
          value: number;
          item: unknown;
          index: number;
          dataIdx: number;
        } | null = null;
        let bestDist = Infinity;
        for (const s of scatterVisible) {
          const entry = scatterLayout.find((e) => e.id === s.descriptor.id);
          if (!entry || s.hidden) continue;
          const idx = hitTestScatter(
            entry.geometry.points,
            px,
            py,
            entry.hitRadius,
          );
          if (idx === null) continue;
          const d = s.descriptor;
          // entry.geometry skips rows with a missing y — map the plotted
          // index back to the data row via the y accessor.
          let dataIdx = -1;
          let plotted = 0;
          for (let i = 0; i < d.data.length && dataIdx < 0; i++) {
            const v = d.yAccessor?.(d.data[i], i);
            if (v === null || v === undefined || !Number.isFinite(v as number))
              continue;
            if (plotted === idx) dataIdx = i;
            plotted++;
          }
          if (dataIdx < 0) continue;
          const pt = entry.geometry.points[idx];
          const dist = Math.hypot(px - pt.x, py - pt.y);
          if (dist < bestDist) {
            bestDist = dist;
            best = {
              seriesId: s.descriptor.id,
              name: s.descriptor.name,
              color: s.color,
              point: pt,
              value: d.yAccessor?.(d.data[dataIdx], dataIdx) as number ?? 0,
              item: d.data[dataIdx],
              index: idx,
              dataIdx,
            };
          }
        }
        if (!best) return null;
        const items: HoverState["items"] = [];
        // The hit row is the only tooltip row; the other series get
        // bookkeeping-only dim tags (hidden rows) so the hoverDim pattern
        // fades exactly the non-hit series.
        for (const s of scatterVisible) {
          const isHit = s.descriptor.id === best.seriesId;
          if (isHit) {
            items.push({
              seriesId: best.seriesId,
              name: best.name,
              color: best.color,
              value: best.value,
              y: best.point.y,
              item: best.item,
              index: best.index,
            });
          } else {
            items.push({
              seriesId: `scatter-dim:${s.descriptor.id}`,
              color: s.color,
              value: 0,
              y: best.point.y,
              item: null,
              hidden: true,
            });
          }
        }
        const hitSeries = visible.find(
          (v) => v.descriptor.id === best.seriesId,
        );
        return {
          x: best.point.x,
          y: best.point.y,
          pointerX: px,
          pointerY: py,
          rawX: hitSeries
            ? hitSeries.descriptor.xAccessor(
                hitSeries.descriptor.data[best.dataIdx],
                best.dataIdx,
              )
            : undefined,
          items,
        };
      }

      // Gauge: ring-band hit test (one row — the value).
      if (gaugeVisible.length > 0 && cartVisible.length === 0) {
        const s = gaugeVisible[0];
        const d = s.descriptor;
        const cx = area.x + area.width / 2;
        const cy = area.y + area.height / 2;
        const outer = Math.min(area.width, area.height) / 2 - 8;
        const inner = outer * (d.gaugeInnerRadius ?? 0.78);
        const dist = Math.hypot(px - cx, py - cy);
        if (dist < inner * 0.9 || dist > outer * 1.1) return null;
        let angle = Math.atan2(px - cx, -(py - cy));
        if (angle < 0) angle += Math.PI * 2;
        const start = d.gaugeStartAngle ?? Math.PI + (Math.PI * 2 - (d.gaugeArcSpan ?? 1.5 * Math.PI)) / 2;
        const sweep = d.gaugeArcSpan ?? 1.5 * Math.PI;
        let a = angle - start;
        while (a < 0) a += Math.PI * 2;
        while (a >= Math.PI * 2) a -= Math.PI * 2;
        if (a > sweep) return null;
        return {
          x: px,
          y: py,
          pointerX: px,
          pointerY: py,
          items: [
            {
              seriesId: d.id,
              name: d.name,
              color: s.color,
              value: d.gaugeValue ?? 0,
              y: py,
              item: null,
              index: 0,
            },
          ],
          rawX: undefined,
        };
      }

      // Radial charts: angle-based slice hit test.
      if (pieVisible.length > 0 && cartVisible.length === 0) {
        const s = pieVisible[0];
        const cx = area.x + area.width / 2;
        const cy = area.y + area.height / 2;
        const dx = px - cx;
        const dy = py - cy;
        const dist = Math.hypot(dx, dy);
        const outer = Math.min(area.width, area.height) / 2 - 8;
        if (dist > outer) return null;
        let angle = Math.atan2(dx, -dy); // d3 convention: 0 up, clockwise
        if (angle < 0) angle += Math.PI * 2;
        const start = s.descriptor.pieStartAngle ?? 0;
        const sweep = s.descriptor.pieSweepAngle ?? Math.PI * 2;
        let a = angle - start;
        while (a < 0) a += Math.PI * 2;
        while (a >= Math.PI * 2) a -= Math.PI * 2;
        if (a > sweep) return null;
        const values = s.descriptor.data.map((item, i) =>
          s.descriptor.valueField ? s.descriptor.valueField(item, i) : 0,
        );
        const total = values.reduce(
          (acc, v) => acc + (Number.isFinite(v) ? v : 0),
          0,
        );
        if (total <= 0) return null;
        let acc = 0;
        for (let i = 0; i < values.length; i++) {
          const frac = (Number.isFinite(values[i]) ? values[i] : 0) / total;
          acc += frac;
          // Slice i spans the cumulative fraction of the sweep.
          if (a <= acc * sweep + 1e-9) {
            return {
              x: px,
              y: py,
              pointerX: px,
              pointerY: py,
              rawX:
                s.descriptor.categoryField?.(s.descriptor.data[i], i) ??
                s.descriptor.name,
              items: [
                {
                  seriesId: s.descriptor.id,
                  name: s.descriptor.name,
                  color: s.color,
                  value: values[i] ?? 0,
                  y: py,
                  item: s.descriptor.data[i],
                  index: i,
                },
              ],
            };
          }
        }
        return null;
      }

      // Heatmap: hit-test the cell grid (self-contained charts only).
      if (heatmapVisible.length > 0 && cartVisible.length === 0) {
        const s = heatmapVisible[0];
        const d = s.descriptor;
        if (!heatmapLayout) return null;
        const { rows, cols, layout } = heatmapLayout;
        if (px < layout.gridX || px > layout.gridX + layout.gridW) return null;
        if (py < layout.gridY || py > layout.gridY + layout.gridH) return null;
        const colIdx = Math.min(
          Math.floor((px - layout.gridX) / layout.cellW),
          cols.length - 1,
        );
        const rowIdx = Math.min(
          Math.floor((py - layout.gridY) / layout.cellH),
          rows.length - 1,
        );
        const cell =
          d.heatmapCells?.[rowIdx * cols.length + colIdx] ?? null;
        if (!cell || cell.value === null) return null;
        return {
          x: layout.gridX + (colIdx + 0.5) * layout.cellW,
          y: layout.gridY + (rowIdx + 0.5) * layout.cellH,
          pointerX: px,
          pointerY: py,
          rawX: cell.col,
          items: [
            {
              seriesId: d.id,
              name: d.name ?? cell.row,
              color: s.color,
              value: cell.value,
              y: layout.gridY + (rowIdx + 0.5) * layout.cellH,
              item: cell.data,
              index: cell.index,
            },
          ],
        };
      }

      // Treemap: point-in-rect hit test (self-contained charts only).
      if (treemapVisible.length > 0 && cartVisible.length === 0) {
        const s = treemapVisible[0];
        const d = s.descriptor;
        if (!treemapLayout) return null;
        const hit = hitTestTreemap(treemapLayout.layout, px, py);
        if (!hit) return null;
        const g = treemapLayout.layout.groups[hit.group];
        if (hit.tile === -1) {
          // Group header: one row with the group total.
          const total = treemapLayout.items
            .filter((it) => it.group === g.name)
            .reduce((a, b) => a + b.value, 0);
          return {
            x: g.rect.x + g.rect.width / 2,
            y: g.rect.y + g.headerH / 2,
            pointerX: px,
            pointerY: py,
            rawX: g.name,
            items: [
              {
                seriesId: d.id,
                name: d.name ?? g.name,
                color: s.color,
                value: total,
                y: g.rect.y + g.headerH / 2,
                item: null,
                index: -1,
              },
            ],
          };
        }
        const dataIdx = treemapLayout.groupDataIdx[hit.group][hit.tile];
        const it = treemapLayout.items[dataIdx];
        const c = g.tiles[hit.tile];
        return {
          x: c.x + c.width / 2,
          y: c.y + c.height / 2,
          pointerX: px,
          pointerY: py,
          rawX: it.label,
          items: [
            {
              seriesId: d.id,
              name: d.name ?? it.label,
              color: s.color,
              value: it.value,
              y: c.y + c.height / 2,
              item: d.data[dataIdx],
              index: dataIdx,
            },
          ],
        };
      }

      if (cartVisible.length === 0 || !xScale || !yScale) return null;

      // Transposed: snap the pointer's y to the nearest band category.
      if (transposed && "bandWidth" in yScale) {
        const bandY = yScale;
        let bestCat: string | null = null;
        let bestDist = Infinity;
        for (const cat of bandY.domain) {
          const dd = Math.abs(bandY.center(cat) - py);
          if (dd < bestDist) {
            bestDist = dd;
            bestCat = cat;
          }
        }
        if (bestCat === null || bestDist > bandY.bandWidth) return null;
        const items = cartVisible.flatMap((s) => {
          const d = s.descriptor;
          if (d.type !== "waterfall") return [];
          for (let i = 0; i < d.data.length; i++) {
            if (String(d.xAccessor(d.data[i], i)) !== bestCat) continue;
            const v = d.yAccessor?.(d.data[i], i);
            if (v === null || v === undefined || !Number.isFinite(v as number))
              continue;
            return [
              {
                seriesId: d.id,
                name: d.name,
                color: s.color,
                value: v as number,
                y: bandY.center(bestCat),
                item: d.data[i],
                index: i,
              },
            ];
          }
          return [];
        });
        if (items.length === 0) return null;
        return {
          x: px,
          items,
          rawX: bestCat,
          y: bandY.center(bestCat),
          pointerX: px,
          pointerY: py,
        };
      }

      // Categorical: snap to the nearest band center.
      if (xIsCategorical) {
        const band = xScale;
        let bestCat: string | null = null;
        let bestDist = Infinity;
        for (const cat of band.domain) {
          const d = Math.abs(band.center(cat) - px);
          if (d < bestDist) {
            bestDist = d;
            bestCat = cat;
          }
        }
        if (bestCat === null || bestDist > band.bandWidth) return null;
        const items = cartVisible.flatMap((s) => {
          const d = s.descriptor;
          for (let i = 0; i < d.data.length; i++) {
            if (String(d.xAccessor(d.data[i], i)) !== bestCat) continue;
            if (
              d.type === "rangeArea" &&
              d.rangeMinAccessor &&
              d.rangeMaxAccessor
            ) {
              const lo = d.rangeMinAccessor(d.data[i], i);
              const hi = d.rangeMaxAccessor(d.data[i], i);
              if (
                lo === null ||
                lo === undefined ||
                hi === null ||
                hi === undefined ||
                !Number.isFinite(lo as number) ||
                !Number.isFinite(hi as number)
              )
                continue;
              const val = lo as number;
              const valMax = hi as number;
              const vs =
                (d.yFieldAxis === "right" && rightYScale ? rightYScale : yCont) as
                  ContinuousScale;
              return [
                {
                  seriesId: d.id,
                  name: d.name,
                  color: s.color,
                  value: val,
                  valueMax: valMax,
                  y: vs.map((val + valMax) / 2),
                  item: d.data[i],
                  index: i,
                },
              ];
            }
            const v = d.yAccessor?.(d.data[i], i);
            if (v === null || v === undefined || !Number.isFinite(v as number))
              continue;
            const val = v as number;
            const vs =
              (d.yFieldAxis === "right" && rightYScale
                ? rightYScale
                : yCont) as ContinuousScale;
            return [
              {
                seriesId: d.id,
                name: d.name,
                color: s.color,
                value: val,
                y: vs.map(val),
                item: d.data[i],
                index: i,
              },
            ];
          }
          return [];
        });
        if (items.length === 0) return null;
        return {
          x: band.center(bestCat),
          items,
          rawX: bestCat,
          y: items[0].y,
          pointerX: px,
          pointerY: py,
        };
      }

      // Time / numeric: snap to the nearest x value (sorted union).
      const cont = xScale;
      const toNum = (v: number | Date | string): number =>
        cont.type === "time"
          ? v instanceof Date
            ? v.getTime()
            : new Date(v as number | string).getTime()
          : Number(v);
      const seen = new Set<number>();
      const allX: number[] = [];
      for (const s of cartVisible) {
        const d = s.descriptor;
        for (let i = 0; i < d.data.length; i++) {
          const raw = d.xAccessor(d.data[i], i);
          if (raw === null || raw === undefined) continue;
          const m = toNum(raw);
          if (!Number.isFinite(m) || seen.has(m)) continue;
          seen.add(m);
          allX.push(m);
        }
      }
      if (allX.length === 0) return null;
      allX.sort((a, b) => a - b);
      const pxVal = Number(cont.invert(px));
      const idx = nearestIndex(allX, pxVal);
      const snapped = allX[idx];
      const items = cartVisible.flatMap((s) => {
        const d = s.descriptor;
        for (let i = 0; i < d.data.length; i++) {
          const raw = d.xAccessor(d.data[i], i);
          if (raw === null || raw === undefined) continue;
          if (Math.abs(toNum(raw) - snapped) > 1e-6) continue;
          if (
            d.type === "rangeArea" &&
            d.rangeMinAccessor &&
            d.rangeMaxAccessor
          ) {
            const lo = d.rangeMinAccessor(d.data[i], i);
            const hi = d.rangeMaxAccessor(d.data[i], i);
            if (
              lo === null ||
              lo === undefined ||
              hi === null ||
              hi === undefined ||
              !Number.isFinite(lo as number) ||
              !Number.isFinite(hi as number)
            )
              continue;
            const val = lo as number;
            const valMax = hi as number;
            const vs =
              (d.yFieldAxis === "right" && rightYScale
                ? rightYScale
                : yCont) as ContinuousScale;
            return [
              {
                seriesId: d.id,
                name: d.name,
                color: s.color,
                value: val,
                valueMax: valMax,
                y: vs.map((val + valMax) / 2),
                item: d.data[i],
              },
            ];
          }
          const v =
            d.type === "candlestick"
              ? d.closeAccessor?.(d.data[i], i)
              : d.yAccessor?.(d.data[i], i);
          if (v === null || v === undefined || !Number.isFinite(v as number))
            continue;
          const val = v as number;
          const vs =
            (d.yFieldAxis === "right" && rightYScale
              ? rightYScale
              : yCont) as ContinuousScale;
          return [
            {
              seriesId: d.id,
              name: d.name,
              color: s.color,
              value: val,
              y: vs.map(val),
              item: d.data[i],
            },
          ];
        }
        return [];
      });
      if (items.length === 0) return null;
      return {
        x: cont.map(snapped),
        items,
        rawX: cont.type === "time" ? new Date(snapped) : snapped,
        y: items[0].y,
        pointerX: px,
        pointerY: py,
      };
    },
    [series, xScale, yScale, rightYScale, xIsCategorical, area, transposed],
  );
  computeHoverRef.current = computeHover;

  const hoverEnabled = summary.hoverEnabled;
  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<SVGRectElement | HTMLCanvasElement>) => {
      if (!hoverEnabled) return;
      // Coordinates must be relative to the SVG/CANVAS ORIGIN (the whole
      // chart box), not the hover layer's own box — the rect sits at the
      // plot area's origin inside the svg.
      const target = e.currentTarget as Element;
      const root =
        target instanceof SVGSVGElement
          ? target
          : ((target as SVGElement).ownerSVGElement ?? target);
      const rect = root.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      if (
        px < area.x ||
        px > area.x + area.width ||
        py < area.y ||
        py > area.y + area.height
      ) {
        setHover(null);
        broadcastSync(null);
        return;
      }
      const h = computeHover(px, py);
      setHover(h);
      broadcastSync(
        h?.rawX instanceof Date
          ? h.rawX.getTime()
          : typeof h?.rawX === "string" || typeof h?.rawX === "number"
            ? h.rawX
            : null,
      );
    },
    [hoverEnabled, computeHover, area, broadcastSync],
  );
  const handlePointerLeave = useCallback(() => {
    setHover(null);
    broadcastSync(null);
  }, [broadcastSync]);

  // ── Series endpoints (last-value badges / callouts) ────────────────────────
  const seriesEndpoints = useMemo(() => {
    const out: {
      id: string;
      name?: string;
      color: string;
      value: number;
      x: number;
      y: number;
    }[] = [];
    if (!xScale || !yScale) return out;
    for (const s of series) {
      if (s.hidden) continue;
      const d = s.descriptor;
      if (
        d.type === "pie" ||
        d.type === "gauge" ||
        d.type === "heatmap" ||
        d.type === "treemap"
      )
        continue;
      if (transposed && d.type === "waterfall") continue;
      const vs =
        (d.yFieldAxis === "right" && rightYScale ? rightYScale : yCont) as
          ContinuousScale;
      if (!vs) continue;
      for (let i = d.data.length - 1; i >= 0; i--) {
        const v =
          d.type === "candlestick"
            ? d.closeAccessor?.(d.data[i], i)
            : d.type === "rangeArea"
              ? d.rangeMaxAccessor?.(d.data[i], i)
              : d.yAccessor?.(d.data[i], i);
        const raw = d.xAccessor(d.data[i], i);
        if (
          raw === null ||
          raw === undefined ||
          v === null ||
          v === undefined ||
          !Number.isFinite(v as number)
        )
          continue;
        out.push({
          id: d.id,
          name: d.name,
          color: s.color,
          value: v as number,
          x: xScale.map(raw as never),
          y: vs.map(v as number),
        });
        break;
      }
    }
    return out;
  }, [series, xScale, yScale, rightYScale, transposed, heatmapLayout, treemapLayout]);

  const isEmpty =
    summary.series.length === 0 ||
    summary.series.every(
      (d) => (d.type === "gauge" ? false : d.data.length === 0),
    );

  // ── Context value ──────────────────────────────────────────────────────────
  const ctxValue = useMemo(
    () => ({
      renderer,
      width,
      height,
      area,
      layout,
      xScale,
      xIsTime,
      transposed,
      yScale,
      rightYScale,
      theme: tokens,
      isDark: themeName === "dark",
      themeName,
      progress,
      dataSig,
      animationsDisabled,
      series,
      hiddenIds,
      toggleSeries,
      legendPresent: summary.hasLegend,
      hover,
      setHover,
      hoverEnabled,
      tooltipMode: summary.tooltipMode,
      redrawNonce,
      requestRedraw,
      registerDraw,
      unregisterDraw,
      title: summary.title,
      seriesEndpoints,
      seriesTokens,
      annotationLayout,
      piePresentations: piePresentationsRef.current,
      radar: radarLayout,
      polar: polarLayout,
      hoverDim: hoverDimValue,
      animType,
    }),
    [
      renderer,
      width,
      height,
      area,
      layout,
      xScale,
      xIsTime,
      transposed,
      yScale,
      rightYScale,
      tokens,
      themeName,
      progress,
      dataSig,
      animationsDisabled,
      series,
      hiddenIds,
      toggleSeries,
      summary.hasLegend,
      hover,
      hoverEnabled,
      summary.tooltipMode,
      animType,

      redrawNonce,
      requestRedraw,
      registerDraw,
      unregisterDraw,
      summary.title,
      seriesEndpoints,
      seriesTokens,
      annotationLayout,
    ],
  );

  // ── Split children: plot marks (svg/canvas) vs HTML overlays ──────────────
  const plotChildren: ReactNode[] = [];
  // Back layer: axes + grid + reference bands render before the series so
  // they never paint over the marks (SVG: document order; canvas: the draw
  // loop runs "back" layer fns first).
  const backChildren: ReactNode[] = [];
  const titleEl: ReactNode[] = [];
  const legendEl: ReactNode[] = [];
  const captionEl: ReactNode[] = [];
  const tooltipEl: ReactNode[] = [];
  const dataLabelsEl: ReactNode[] = [];
  const pieCenterEl: ReactNode[] = [];
  const polarCenterEl: ReactNode[] = [];
  let annotationIndex = 0;
  const axisBadgesEl: ReactNode[] = [];
  for (const c of elements) {
    if (typeof c !== "object" || c === null || !("$typeof" in c || "$$typeof" in c)) {
      if (c !== undefined && c !== null) plotChildren.push(c);
      continue;
    }
    const el = c as { type: ComponentType; key: Key | null | undefined };
    if (el.type === reg?.Title) titleEl.push(c);
    else if (el.type === reg?.Legend) legendEl.push(c);
    else if (el.type === reg?.Caption) captionEl.push(c);
    else if (el.type === reg?.Tooltip) tooltipEl.push(c);
    else if (el.type === reg?.DataLabels) dataLabelsEl.push(c);
    else if (el.type === reg?.PieCenter) pieCenterEl.push(c);
    else if (el.type === reg?.PolarCenter) polarCenterEl.push(c);
    else if (el.type === reg?.AxisBadges) axisBadgesEl.push(c);
    else if (el.type === reg?.Hover) {
      // Hover renders null — kept out of the plot layer.
    } else if (
      el.type === reg?.Line ||
      el.type === reg?.Bar ||
      el.type === reg?.Pie ||
      el.type === reg?.Candlestick ||
      el.type === reg?.RangeArea ||
      el.type === reg?.Radar ||
      el.type === reg?.Polar ||
      el.type === reg?.Gauge ||
      el.type === reg?.Waterfall ||
      el.type === reg?.Heatmap ||
      el.type === reg?.Treemap
    ) {
      // Stamp the series with its element identity (see seriesTokens).
      plotChildren.push(
        cloneElement(c as ReactElement<Record<string, unknown>>, {
          __chartSeriesToken: c,
        }),
      );
    } else if (el.type === reg?.RadarAxis || el.type === reg?.PolarAxis) {
      // Consumed by the root's shared grid — never rendered as a child.
    } else if (
      el.type === reg?.XAxis ||
      el.type === reg?.YAxis ||
      el.type === reg?.ReferenceBand
    ) {
      backChildren.push(c);
    } else if (el.type === reg?.Annotation) {
      // Stamp element identity (resolved-position lookup) and a stable
      // index (stable canvas draw ids).
      annotationIndex += 1;
      plotChildren.push(
        cloneElement(c as ReactElement<Record<string, unknown>>, {
          __chartAnnotationToken: c,
          __chartAnnotationIndex: annotationIndex,
        }),
      );
    } else {
      plotChildren.push(c);
    }
  }

  const aria = summary.title ?? ariaLabel ?? "Chart";

  // ── Loading / skeleton states ────────────────────────────────────────────
  const isDark = themeName === "dark";
  const boolLoading = loading === true;
  const showSkeleton = boolLoading && loaderType === "skeleton";
  if (boolLoading) ensureChartKeyframes();
  const skeletonBarColor = isDark
    ? "rgba(203,213,225,0.14)"
    : "rgba(100,116,139,0.18)";
  const skeletonPlotColor = isDark
    ? "rgba(203,213,225,0.05)"
    : "rgba(100,116,139,0.06)";

  // A boolean `loading` is handled by `loaderType` (skeleton/spinner/
  // progress); only a custom node reaches the legacy state overlay.
  const loadingNode =
    typeof loading === "object" && loading !== null ? loading : null;
  const loaderOverlay =
    boolLoading && loaderType !== "skeleton" ? (
      <Loader
        overlay
        variant={loaderType}
        title={loaderTitle}
        label={loaderMessage}
        progress={loaderProgress}
        color={loaderColor ?? "blue"}
      />
    ) : null;

  const errorNode =
    typeof error === "object" && error !== null
      ? error
      : typeof error === "string"
        ? (
            <span style={{ color: "#f87171", fontSize: 13 }}>{error}</span>
          )
        : error
          ? defaultErrorNode
          : null;

  const m = layout.margin;
  const titleTop = m.top;
  const titleBlockH = Math.max(layout.titleHeight, 1);
  const legendTop = m.top + layout.titleHeight;

  return (
    <div
      ref={containerRef}
      aria-busy={boolLoading || undefined}
      style={{ position: "relative", width: "100%", height, overflow: "hidden" }}
    >
      <ChartContextProvider value={ctxValue}>
        {showSkeleton ? (
          <ChartSkeleton
            hasTitle={summary.hasTitle}
            hasSubtitle={summary.hasTitle && !!summary.subtitle}
            hasLegend={summary.hasLegend}
            legendPosition={summary.legendPosition}
            barColor={skeletonBarColor}
            plotColor={skeletonPlotColor}
          />
        ) : renderer === "svg" ? (
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={aria}
            style={{ display: "block" }}
          >
            {backChildren}
            {/* Radar grid: rings, spokes, axis + tick labels. */}
            {radarGrid && (
              <g data-chart-layer="radar-grid" pointerEvents="none">
                {radarGrid.ringPaths.map((d, i) => (
                  <path
                    key={`ring-${i}`}
                    d={d}
                    fill="none"
                    stroke={radarGridSpec.color}
                    strokeWidth={radarGridSpec.width}
                    strokeDasharray={gridDashArray(radarGridSpec.style)}
                    opacity={radarGridSpec.opacity}
                  />
                ))}
                {radarGrid.spokes.map((sp, i) => (
                  <line
                    key={`spoke-${i}`}
                    x1={sp.x1}
                    y1={sp.y1}
                    x2={sp.x2}
                    y2={sp.y2}
                    stroke={radarGridSpec.color}
                    strokeWidth={radarGridSpec.width}
                    strokeDasharray={gridDashArray(radarGridSpec.style)}
                    opacity={0.55 * radarGridSpec.opacity}
                  />
                ))}
                {summary.radarAxis?.showAxisLabels !== false &&
                  radarGrid.spokes.map((sp, i) => {
                    const cos = Math.cos(sp.angle);
                    const sin = Math.sin(sp.angle);
                    const lx = radarGrid.cx + (radarGrid.R + 14) * cos;
                    const ly = radarGrid.cy + (radarGrid.R + 14) * sin;
                    return (
                      <text
                        key={`axis-${i}`}
                        x={lx}
                        y={ly}
                        textAnchor={
                          Math.abs(cos) < 0.3
                            ? "middle"
                            : cos > 0
                              ? "start"
                              : "end"
                        }
                        dominantBaseline={
                          Math.abs(sin) < 0.3
                            ? "middle"
                            : sin > 0
                              ? "hanging"
                              : "auto"
                        }
                        fontSize={11}
                        fill={tokens.textColor}
                      >
                        {sp.label}
                      </text>
                    );
                  })}
                {radarGrid.tickLabels.map((t, i) => (
                  <text
                    key={`tick-${i}`}
                    x={t.x}
                    y={t.y}
                    fontSize={10}
                    fill={tokens.subtleText}
                    textAnchor="end"
                  >
                    {t.text}
                  </text>
                ))}
              </g>
            )}
            {/* Polar grid: rings, spokes, category + tick labels. */}
            {polarGrid && (
              <g data-chart-layer="polar-grid" pointerEvents="none">
                {polarGrid.ringPaths.map((d, i) => (
                  <path
                    key={`ring-${i}`}
                    d={d}
                    fill="none"
                    stroke={polarGridSpec.color}
                    strokeWidth={polarGridSpec.width}
                    strokeDasharray={gridDashArray(polarGridSpec.style)}
                    opacity={polarGridSpec.opacity}
                  />
                ))}
                {polarGrid.spokes.map((sp, i) => (
                  <line
                    key={`spoke-${i}`}
                    x1={sp.x1}
                    y1={sp.y1}
                    x2={sp.x2}
                    y2={sp.y2}
                    stroke={polarGridSpec.color}
                    strokeWidth={polarGridSpec.width}
                    strokeDasharray={gridDashArray(polarGridSpec.style)}
                    opacity={0.55 * polarGridSpec.opacity}
                  />
                ))}
                {summary.polarAxis?.showTickLabels === true &&
                  polarGrid.tickLabels.map((t, i) => (
                    <text
                      key={`tick-${i}`}
                      x={t.x}
                      y={t.y}
                      fontSize={10}
                      fill={tokens.subtleText}
                      textAnchor="end"
                    >
                      {t.text}
                    </text>
                  ))}
                {polarSeries[0]?.polarShowLabels !== false &&
                  polarGrid.spokes.map((sp, i) => {
                    const cos = Math.cos(sp.angle);
                    const sin = Math.sin(sp.angle);
                    const lx = polarGrid.cx + (polarGrid.R + 14) * cos;
                    const ly = polarGrid.cy + (polarGrid.R + 14) * sin;
                    return (
                      <text
                        key={`cat-${i}`}
                        x={lx}
                        y={ly}
                        textAnchor={
                          Math.abs(cos) < 0.3
                            ? "middle"
                            : cos > 0
                              ? "start"
                              : "end"
                        }
                        dominantBaseline={
                          Math.abs(sin) < 0.3
                            ? "middle"
                            : sin > 0
                              ? "hanging"
                              : "auto"
                        }
                        fontSize={11}
                        fill={tokens.textColor}
                      >
                        {sp.label}
                      </text>
                    );
                  })}
              </g>
            )}
            {/*
              Crosshair sits in the back layer: above the grid but below the
              series marks, so the hover dots always paint over it.
            */}
            {/* Cartesian-only: non-cartesian charts (pie/nightingale,
                gauge, heatmap, treemap) have no x-axis to crosshair. */}
            {hover && !radarLayout && !polarLayout && xScale && yScale && (
              <line
                x1={hover.x}
                x2={hover.x}
                y1={area.y}
                y2={area.y + area.height}
                stroke={tokens.crosshairColor}
                strokeWidth={1}
                strokeDasharray="3 3"
                pointerEvents="none"
              />
            )}
            {plotChildren}
            {hoverEnabled && (
              <rect
                x={area.x}
                y={area.y}
                width={area.width}
                height={area.height}
                fill="transparent"
                style={{ cursor: "crosshair" }}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
              />
            )}
          </svg>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={aria}
              style={{
                display: "block",
                cursor: hoverEnabled ? "crosshair" : "default",
              }}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            />
            {/*
              Plot children mount here too: every mark renders null in canvas
              mode, but their effects register the canvas draw functions.
            */}
            {plotChildren}
          </>
        )}

        {/* HTML overlays — positioned from the layout, both renderers */}
        {!showSkeleton && titleEl.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: titleTop,
              left: m.left,
              right: m.right,
              height: titleBlockH,
              pointerEvents: "none",
            }}
          >
            {titleEl}
          </div>
        )}
        {!showSkeleton && legendEl.length > 0 && (
          <div
            style={
              summary.legendOrientation === "vertical"
                ? {
                    position: "absolute",
                    top: legendTop,
                    right: m.right,
                    maxHeight: Math.max(layout.legendHeight, 1),
                  }
                : {
                    position: "absolute",
                    left: m.left,
                    right: m.right,
                    height: Math.max(layout.legendHeight, 1),
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    ...(summary.legendPosition === "bottom"
                      ? { bottom: m.bottom + layout.captionHeight }
                      : { top: legendTop }),
                  }
            }
          >
            {legendEl}
          </div>
        )}
        {tooltipEl}
        {axisBadgesEl}
        {dataLabelsEl}
        {pieCenterEl}
        {polarCenterEl}
        {captionEl.length > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: m.bottom,
              left: m.left,
              right: m.right,
              height: Math.max(layout.captionHeight, 1),
              pointerEvents: "none",
            }}
          >
            {captionEl}
          </div>
        )}

        {loaderOverlay}
        {/* States */}
        {loadingNode !== null && (
          <div style={stateOverlayStyle}>{loadingNode}</div>
        )}
        {errorNode !== null && <div style={stateOverlayStyle}>{errorNode}</div>}
        {!loadingNode && !errorNode && !showSkeleton && isEmpty && (
          <div style={{ ...stateOverlayStyle, color: tokens.emptyText, fontSize: 13 }}>
            No data
          </div>
        )}
      </ChartContextProvider>
    </div>
  );
}

const stateOverlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 13,
};

let keyframesInjected = false;
/**
 * Inject the chart keyframes once. `dsh-chart-spin` was historically
 * referenced by the default spinner but never defined anywhere, so the
 * boolean loading state rendered a static ring.
 */
function ensureChartKeyframes() {
  if (keyframesInjected || typeof document === "undefined") return;
  const el = document.getElementById("dsh-chart-keyframes");
  if (el) {
    keyframesInjected = true;
    return;
  }
  const style = document.createElement("style");
  style.id = "dsh-chart-keyframes";
  style.textContent =
    "@keyframes dsh-chart-spin { to { transform: rotate(360deg); } }" +
    "@keyframes dsh-chart-pulse { 0%,100% { opacity: 1; } 50% { opacity: .55; } }" +
    "@media (prefers-reduced-motion: reduce) { .dsh-chart-anim, [data-chart-loading] { animation: none !important; } }";
  document.head.appendChild(style);
  keyframesInjected = true;
}



const defaultErrorNode = (
  <span style={{ color: "#f87171", fontSize: 13 }}>Chart failed to render</span>
);

// ── Public components ────────────────────────────────────────────────────────

export const ChartSvg = forwardRef<ChartHandle, ChartRootProps>(
  (props, ref) => (
    <ChartRootImpl {...props} renderer="svg" hostRef={ref} />
  ),
);

export const ChartCanvas = forwardRef<ChartHandle, ChartRootProps>(
  (props, ref) => (
    <ChartRootImpl {...props} renderer="canvas" hostRef={ref} />
  ),
);

ChartSvg.displayName = "Chart.Svg";
ChartCanvas.displayName = "Chart.Canvas";

// re-exported for index convenience
export { resolveColor };
