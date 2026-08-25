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
  createTimeScale,
  DEFAULT_SERIES_PALETTE,
  isTimeDomain,
  prefersReducedMotion,
  resolveColor,
  toDate,
} from "../engine/index";
import type {
  AnyScale,
  ChartLayout,
  ContinuousScale,
  HoverState,
} from "../engine/types";
import { useTheme } from "../../../hooks/useTheme";
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
  Bar: ComponentType<any>;
  Pie: ComponentType<any>;
  Candlestick: ComponentType<any>;
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
    if (d.type === "pie") continue;
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
      !hidden.has(d.id) &&
      (d.yAccessor !== undefined ||
        (d.type === "candlestick" && d.lowAccessor !== undefined)),
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
    if (d.type === "bar") hasBar = true;
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
  error,
  ariaLabel,
  children,
  hostRef,
  renderer,
}: ChartRootProps & { renderer: ChartRenderer; hostRef: Ref<ChartHandle> }) {
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
    (d) => d.type !== "pie",
  );
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
      summary.hasCaption,
      showXAxis,
      showYAxis,
      needsRightYAxis,
    ],
  );
  const area = layout.chartArea;

  // ── Scales ─────────────────────────────────────────────────────────────────
  const xDomainValues = useMemo(
    () => collectXValues(cartesianSeries),
    [cartesianSeries],
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
    return createLinearScale({
      domain: [Math.min(...nums), Math.max(...nums)],
      range,
    });
  }, [
    hasCartesian,
    xDomainValues,
    xIsTime,
    area,
    summary.xAxisTickCount,
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
  const yScale: ContinuousScale | null = useMemo(
    () =>
      showYAxis
        ? createLinearScale({
            domain: leftYDomain,
            range: [area.y + area.height, area.y],
            nice: !summary.yAxisLeft.domain,
          })
        : null,
    [showYAxis, leftYDomain, area, summary.yAxisLeft.domain],
  );
  const rightSeries = useMemo(
    () => cartesianSeries.filter((d) => d.yFieldAxis === "right"),
    [cartesianSeries],
  );
  const rightYScale: ContinuousScale | null = useMemo(() => {
    if (!needsRightYAxis || rightSeries.length === 0) return null;
    const [lo, hi] = computeYDomain(rightSeries, hiddenIds);
    return createLinearScale({
      domain: [lo, hi],
      range: [area.y + area.height, area.y],
    });
  }, [needsRightYAxis, rightSeries, hiddenIds, area]);

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
          t === reg.Candlestick)
      ) {
        const state = series[k];
        if (state) map.set(c, state);
        k += 1;
      }
    }
    return map;
  }, [elements, series, reg]);

  const [progress, setProgress] = useState(animationsDisabled ? 1 : 0);
  const progressRef = useRef(progress);
  const settled = progress >= 1;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawFnsRef = useRef<Map<string, ChartDrawFn>>(new Map());
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
    for (const fn of drawFnsRef.current.values()) fn(ctx, state);
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
    (id: string, fn: ChartDrawFn) => {
      drawFnsRef.current.set(id, fn);
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
      const cartVisible = visible.filter((s) => s.descriptor.type !== "pie");

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

      if (cartVisible.length === 0 || !xScale || !yScale) return null;

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
            const v = d.yAccessor?.(d.data[i], i);
            if (v === null || v === undefined || !Number.isFinite(v as number))
              continue;
            const val = v as number;
            const vs =
              d.yFieldAxis === "right" && rightYScale ? rightYScale : yScale;
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
          x: band.center(bestCat),
          items,
          rawX: bestCat,
          y: items[0].y,
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
          const v =
            d.type === "candlestick"
              ? d.closeAccessor?.(d.data[i], i)
              : d.yAccessor?.(d.data[i], i);
          if (v === null || v === undefined || !Number.isFinite(v as number))
            continue;
          const val = v as number;
          const vs =
            d.yFieldAxis === "right" && rightYScale ? rightYScale : yScale;
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
      };
    },
    [series, xScale, yScale, rightYScale, xIsCategorical, area],
  );

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
        return;
      }
      setHover(computeHover(px, py));
    },
    [hoverEnabled, computeHover, area],
  );
  const handlePointerLeave = useCallback(() => setHover(null), []);

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
      if (d.type === "pie") continue;
      const vs =
        d.yFieldAxis === "right" && rightYScale ? rightYScale : yScale;
      if (!vs) continue;
      for (let i = d.data.length - 1; i >= 0; i--) {
        const v =
          d.type === "candlestick"
            ? d.closeAccessor?.(d.data[i], i)
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
  }, [series, xScale, yScale, rightYScale]);

  const isEmpty =
    summary.series.length === 0 ||
    summary.series.every((d) => d.data.length === 0);

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
      yScale,
      rightYScale,
      theme: tokens,
      isDark: themeName === "dark",
      themeName,
      progress,
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
      piePresentations: piePresentationsRef.current,
    }),
    [
      renderer,
      width,
      height,
      area,
      layout,
      xScale,
      xIsTime,
      yScale,
      rightYScale,
      tokens,
      themeName,
      progress,
      animationsDisabled,
      series,
      hiddenIds,
      toggleSeries,
      summary.hasLegend,
      hover,
      hoverEnabled,
      summary.tooltipMode,
      redrawNonce,
      requestRedraw,
      registerDraw,
      unregisterDraw,
      summary.title,
      seriesEndpoints,
      seriesTokens,
    ],
  );

  // ── Split children: plot marks (svg/canvas) vs HTML overlays ──────────────
  const plotChildren: ReactNode[] = [];
  const titleEl: ReactNode[] = [];
  const legendEl: ReactNode[] = [];
  const captionEl: ReactNode[] = [];
  const tooltipEl: ReactNode[] = [];
  const dataLabelsEl: ReactNode[] = [];
  const pieCenterEl: ReactNode[] = [];
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
    else if (el.type === reg?.Hover) {
      // Hover renders null — kept out of the plot layer.
    } else if (
      el.type === reg?.Line ||
      el.type === reg?.Bar ||
      el.type === reg?.Pie ||
      el.type === reg?.Candlestick
    ) {
      // Stamp the series with its element identity (see seriesTokens).
      plotChildren.push(
        cloneElement(c as ReactElement<Record<string, unknown>>, {
          __chartSeriesToken: c,
        }),
      );
    } else {
      plotChildren.push(c);
    }
  }

  const aria = summary.title ?? ariaLabel ?? "Chart";
  const loadingNode =
    typeof loading === "object" && loading !== null
      ? loading
      : loading
        ? defaultLoadingNode
        : null;
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
      style={{ position: "relative", width: "100%", height, overflow: "hidden" }}
    >
      <ChartContextProvider value={ctxValue}>
        {renderer === "svg" ? (
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={aria}
            style={{ display: "block" }}
          >
            {plotChildren}
            {hover && (
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
        {titleEl.length > 0 && (
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
        {legendEl.length > 0 && (
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
        {dataLabelsEl}
        {pieCenterEl}
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

        {/* States */}
        {loadingNode !== null && (
          <div style={stateOverlayStyle}>{loadingNode}</div>
        )}
        {errorNode !== null && <div style={stateOverlayStyle}>{errorNode}</div>}
        {!loadingNode && !errorNode && isEmpty && (
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

const defaultLoadingNode = (
  <span
    style={{
      width: 22,
      height: 22,
      border: "2px solid rgba(148,163,184,.3)",
      borderTopColor: "rgba(148,163,184,.9)",
      borderRadius: "50%",
      display: "inline-block",
      animation: "dsh-chart-spin 0.8s linear infinite",
    }}
  />
);

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
