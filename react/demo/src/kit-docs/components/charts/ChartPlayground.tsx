import { useEffect, useMemo, useState } from "react";
import { Chart, EASING_PRESETS, MultiToggle } from "@cjlapao/ui-kit";
import type { ChartAnimationType } from "@cjlapao/ui-kit";
import type {
  BarMode,
  CandlestickVariant,
  ChartAnimation,
  LineCurve,
  MarkerShape,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  chartBarCornerOptions,
  chartBarModeOptions,
  chartCandleVariantOptions,
  chartCurveOptions,
  chartFillOptions,
  chartGridFadeOptions,
  chartGridOptions,
  chartHeightOptions,
  chartPolarGridStyleOptions,
  chartPolarInnerRadiusOptions,
  chartPolarModeOptions,
  chartPolarRadiusOptions,
  chartPolarShapeOptions,
  chartPolarSortOptions,
  chartPolarBorderOptions,
  chartKindOptions,
  chartGaugeSpanOptions,
  chartGaugeValueOptions,
  chartGaugeInnerOptions,
  chartGaugeZoneOptions,
  chartGaugeTickOptions,
  chartGaugeTargetOptions,
  chartNightStartOptions,
  chartNightInnerOptions,
  chartScatterShapeOptions,
  chartScatterHitRadiusOptions,
  chartScatterOpacityOptions,
  chartScatterFillOptions,
  chartScatterMinSizeOptions,
  chartScatterMaxSizeOptions,
  chartScatterBrightnessOptions,
  chartScatterDimOptions,
  chartScatterRadiusOptions,
  chartScatterBorderOptions,
  chartLegendPositionOptions,
  chartPieCornerOptions,
  chartPieGapOptions,
  chartPieLabelOptions,
  chartSelectedOptions,
  chartRendererOptions,
  chartSegmentGapOptions,
  chartSweepOptions,
  chartValuesOptions,
} from "../../shared/options";
import {
  lineMetrics,
  piePlans,
  candleDays,
  barQuarterly,
  corridorData,
  type CorridorPoint,
  readinessData,
  type ReadinessPoint,
  workflowData,
  type WorkflowPoint,
  monacoData,
  type MonacoPoint,
  scatterAlpha,
  scatterBeta,
  scatterGamma,
  nightingaleTornado,
  waterfallArr,
  comboMonthly,
  heatCommute,
  heatCommuteRows,
  heatCommuteCols,
  treemapContinents,
  treemapStocks,
  treemapTeams,
} from "./data";

type Kind =
  | "line"
  | "bar"
  | "pie"
  | "candlestick"
  | "range"
  | "radar"
  | "polar"
  | "scatter"
  | "gauge"
  | "nightingale"
  | "waterfall"
  | "combo"
  | "heatmap"
  | "treemap";
type FillMode = "flat" | "gradient" | "off";
type Sweep = "full" | "270" | "180";
type GridStyle = "solid" | "dashed" | "off";
type ValuesMode = "popup" | "y-axis" | "both";

const SWEEP_ANGLES: Record<Sweep, { start: number; sweep: number }> = {
  full: { start: 0, sweep: Math.PI * 2 },
  // 90° opening at the bottom (classic gauge)
  "270": { start: Math.PI / 4, sweep: Math.PI * 1.5 },
  // top semicircle
  "180": { start: (Math.PI * 3) / 2, sweep: Math.PI },
};

// ── Streaming (playground) ───────────────────────────────────────────────────
// Injects a new data point every 5 s and slides the window once the max is
// reached, so the update animation keeps running. Values are a
// mean-reverting random walk (drift back toward the middle of the range with
// jitter) so the series moves up and down instead of drifting off.

const r1 = (v: number) => Math.round(v * 10) / 10;
const DAY_MS = 86_400_000;

function walk(
  last: number,
  mid: number,
  vol: number,
  min: number,
  max: number,
): number {
  const next = last + (mid - last) * 0.08 + (Math.random() - 0.5) * vol * 2;
  return r1(Math.min(max, Math.max(min, next)));
}

const MAX_LINE = lineMetrics.length;
const MAX_CANDLE = candleDays.length;
const MAX_BAR = 12;
const MAX_CORRIDOR = corridorData.length;

/** Keep a workflow sector's counts inside a sane weekly-run window. */
function workflowWalk(p: WorkflowPoint): WorkflowPoint {
  return {
    sector: p.sector,
    autonomous: Math.round(walk(p.autonomous, 30, 10, 8, 52)),
    assisted: Math.round(walk(p.assisted, 15, 6, 4, 26)),
    manual: Math.round(walk(p.manual, 8, 4, 2, 16)),
  };
}

/** Keep a GP sector's lap times inside a sane window (s). */
function monacoWalk(p: MonacoPoint): MonacoPoint {
  return {
    sector: p.sector,
    redBull: r1(walk(p.redBull, 79, 3, 66, 92)),
    ferrari: r1(walk(p.ferrari, 79, 3, 66, 92)),
    mercedes: r1(walk(p.mercedes, 79, 3, 66, 92)),
  };
}

/** Keep a readiness score inside a sane gate window (pts). */
function readinessWalk(p: ReadinessPoint): ReadinessPoint {
  return {
    axis: p.axis,
    launch: Math.round(walk(p.launch, 70, 14, 35, 99)),
    target: Math.round(walk(p.target, 90, 8, 70, 100)),
    benchmark: Math.round(walk(p.benchmark, 80, 10, 45, 100)),
  };
}

/** Keep a corridor point inside a sane latency window (ms). */
function corridorWalk(last: CorridorPoint): CorridorPoint {
  const avg = walk(last.avg, 165, 22, 110, 245);
  const t = last.time.getTime() + 30 * 60 * 1000;
  return {
    time: new Date(t),
    avg,
    opMin: Math.round(avg - (18 + Math.random() * 10)),
    opMax: Math.round(avg + (22 + Math.random() * 10)),
    envMin: Math.round(avg - (38 + Math.random() * 16)),
    envMax: Math.round(avg + (50 + Math.random() * 30)),
  };
}

interface ChartPlaygroundProps {
  /** Lock the playground to one chart kind (per-type docs pages). */
  fixedKind?: Kind;
}

/** Split revenue into three stackable layers for the combo playground. */
const comboStackRows = comboMonthly.map((r) => {
  const base = Math.round(r.revenue * 0.55);
  const growth = Math.round(r.revenue * 0.3);
  return {
    month: r.month,
    base,
    growth,
    renewal: r.revenue - base - growth,
  };
});

export const ChartPlayground = ({ fixedKind }: ChartPlaygroundProps) => {
  const [renderer, setRenderer] = useState<"svg" | "canvas">("svg");
  const [kindState, setKind] = useState<Kind>(fixedKind ?? "line");
  const kind = fixedKind ?? kindState;
  const [curve, setCurve] = useState<LineCurve>("smooth");
  const [height, setHeight] = useState(380);
  const [showFill, setShowFill] = useState(true);
  const [axesMode, setAxesMode] = useState<"all" | "labels" | "none">("all");
  const [lgLoading, setLgLoading] = useState(false);
  const [lgType, setLgType] = useState<"skeleton" | "spinner" | "progress">(
    "skeleton",
  );
  const [showMarkers, setShowMarkers] = useState(false);
  const [areaGradient, setAreaGradient] = useState(false);
  const [valuesMode, setValuesMode] = useState<ValuesMode>("popup");
  const [grid, setGrid] = useState<GridStyle>("solid");
  const [gridFade, setGridFade] = useState("1");
  const [barMode, setBarMode] = useState<BarMode>("group");
  const [barCorner, setBarCorner] = useState(0);
  const [segmentGap, setSegmentGap] = useState(0);
  const [donut, setDonut] = useState(true);
  const [pieGap, setPieGap] = useState(0);
  const [pieCorner, setPieCorner] = useState(0);
  const [pieLabelMin, setPieLabelMin] = useState(5);
  const [sweep, setSweep] = useState<Sweep>("full");
  const [candleVariant, setCandleVariant] = useState<CandlestickVariant>(
    "candle",
  );
  const [candleSelected, setCandleSelected] = useState(true);
  const [legendPosition, setLegendPosition] = useState<"top" | "bottom">(
    "top",
  );
  const [animated, setAnimated] = useState(true);
  const [easing, setEasing] = useState<string>("easeOutQuart");
  const [animType, setAnimType] = useState<string>("grow");
  const [streaming, setStreaming] = useState(false);
  const [metrics, setMetrics] = useState(lineMetrics);
  const [quarters, setQuarters] = useState(barQuarterly);
  const [candles, setCandles] = useState(candleDays);
  const [corridor, setCorridor] = useState(corridorData);
  const [readiness, setReadiness] = useState(readinessData);
  const [fillMode, setFillMode] = useState<FillMode>("gradient");
  const [polarMode, setPolarMode] = useState<"group" | "stack">("group");
  const [polarInner, setPolarInner] = useState(0);
  const [polarSort, setPolarSort] = useState<"none" | "asc" | "desc">("none");
  const [polarRadius, setPolarRadius] = useState(0);
  const [polarBorder, setPolarBorder] = useState(0);
  const [polarShape, setPolarShape] = useState<"circle" | "polygon">("circle");
  const [polarGridStyle, setPolarGridStyle] = useState<
    "solid" | "dashed" | "dotted"
  >("solid");
  const [scatterShapes, setScatterShapes] = useState<Record<string, boolean>>(
    { "1": true, "2": true, "3": true },
  );
  const [scatterMarker, setScatterMarker] = useState<MarkerShape>("circle");
  const [scatterHitRadius, setScatterHitRadius] = useState("2");
  const [scatterOpacity, setScatterOpacity] = useState("1");
  const [scatterFill, setScatterFill] = useState("0.7");
  const [scatterBubble, setScatterBubble] = useState(true);
  const [scatterMin, setScatterMin] = useState("6");
  const [scatterMax, setScatterMax] = useState("30");
  const [scatterBorder, setScatterBorder] = useState("0");
  const [scatterBrightness, setScatterBrightness] = useState("1.1");
  const [scatterDim, setScatterDim] = useState("0.35");
  const [scatterHoverRadius, setScatterHoverRadius] = useState("1.3");
  const [gaugeValue, setGaugeValue] = useState("75");
  const [gaugeSpan, setGaugeSpan] = useState("270");
  const [gaugeInner, setGaugeInner] = useState("0.78");
  const [gaugeZones, setGaugeZones] = useState("ramp");
  const [gaugeTicks, setGaugeTicks] = useState("40");
  const [gaugeTarget, setGaugeTarget] = useState("90");
  const [nightStart, setNightStart] = useState("0");
  const [nightInner, setNightInner] = useState("0.3");
  const [nightGap, setNightGap] = useState("1");
  const [nightLabels, setNightLabels] = useState(true);
  const [nightTicks, setNightTicks] = useState(false);
  const [nightBands, setNightBands] = useState(false);
  const [nightPeak, setNightPeak] = useState(false);
  const [wfOrientation, setWfOrientation] = useState("vertical");
  const [wfConnectors, setWfConnectors] = useState(true);
  const [wfLabels, setWfLabels] = useState(true);
  const [comboSecondary, setComboSecondary] = useState<"line" | "scatter" | "off">("line");
  const [comboRightAxis, setComboRightAxis] = useState(false);
  const [comboStack, setComboStack] = useState(false);
  const [comboDashed, setComboDashed] = useState(false);
  const [comboArea, setComboArea] = useState(false);
  const [hmPalette, setHmPalette] = useState<"ocean" | "warm" | "gold" | "diverging">("warm");
  const [hmLabels, setHmLabels] = useState(true);
  const [hmLegend, setHmLegend] = useState(true);
  const [hmRadius, setHmRadius] = useState<number>(6);
  const [tmPalette, setTmPalette] = useState<"flat" | "palette" | "stocks">(
    "palette",
  );
  const [tmGrouped, setTmGrouped] = useState(false);
  const [tmCorner, setTmCorner] = useState(false);
  const [workflow, setWorkflow] = useState(workflowData);
  const [monaco, setMonaco] = useState(monacoData);

  // Streaming: every 5 s inject a new point at the end of each streamable
  // series and drop the oldest once the window max is reached.
  useEffect(() => {
    if (!streaming) return;
    const id = setInterval(() => {
      setMetrics((d) => {
        const last = d[d.length - 1];
        const prev = d[d.length - 2] ?? last;
        const step = last.date.getTime() - prev.date.getTime() || 7 * DAY_MS;
        const next = {
          date: new Date(last.date.getTime() + step),
          arr: walk(last.arr, 200, 22, 60, 330),
          activation: walk(last.activation, 55, 8, 30, 85),
          retention: walk(last.retention, 75, 5, 55, 92),
          risk: walk(last.risk, 95, 12, 55, 140),
        };
        return d.length >= MAX_LINE ? [...d.slice(1), next] : [...d, next];
      });
      setQuarters((d) => {
        const last = d[d.length - 1];
        const num = last ? Number(last.category.slice(1)) : 4;
        const revenue = Math.round(walk(last?.revenue ?? 520, 520, 90, 300, 800));
        const profit = Math.round(revenue * (0.26 + Math.random() * 0.16));
        const next = {
          category: `Q${num + 1}`,
          revenue,
          profit,
          cost: Math.max(0, revenue - profit),
        };
        return d.length >= MAX_BAR ? [...d.slice(1), next] : [...d, next];
      });
      setCandles((d) => {
        const last = d[d.length - 1];
        let t = last.date.getTime() + DAY_MS;
        // next trading day (skip weekends)
        while (
          (new Date(t).getUTCDay() === 0 || new Date(t).getUTCDay() === 6) &&
          t - last.date.getTime() < 8 * DAY_MS
        ) {
          t += DAY_MS;
        }
        const open = last.close;
        const close =
          open +
          (Math.random() < 0.5 ? -1 : 1) * (0.4 + Math.random() * 1.8) +
          (Math.random() - 0.5) * 2.4;
        const next = {
          date: new Date(t),
          open: r1(open),
          close: r1(Math.max(5, close)),
          high: r1(Math.max(open, close) + Math.random() * 1.6),
          low: r1(Math.max(4, Math.min(open, close) - Math.random() * 1.6)),
        };
        return d.length >= MAX_CANDLE
          ? [...d.slice(1), next]
          : [...d, next];
      });
      setCorridor((d) => {
        const next = corridorWalk(d[d.length - 1]);
        return d.length >= MAX_CORRIDOR
          ? [...d.slice(1), next]
          : [...d, next];
      });
      setReadiness((d) => d.map(readinessWalk));
      setWorkflow((d) => d.map(workflowWalk));
      setMonaco((d) => d.map(monacoWalk));
    }, 5000);
    return () => clearInterval(id);
  }, [streaming]);

  const animation: ChartAnimation = useMemo(
    () =>
      animated
        ? { duration: 900, easing, type: animType as ChartAnimationType }
        : false,
    [animated, easing, animType],
  );

  const Root = renderer === "svg" ? Chart.Svg : Chart.Canvas;

  const stacked = barMode !== "group";
  const angles = SWEEP_ANGLES[sweep];
  const gridProps = {
    grid: grid === "off" ? false : undefined,
    gridDash: grid === "dashed" ? ("dashed" as const) : ("solid" as const),
    gridOpacity: Number(gridFade),
    axisLine: axesMode === "labels" ? (false as const) : undefined,
  };

  const preview = (
    <div className="w-full max-w-4xl">
      <Root
        // The key includes the animation state so changing the easing (or
        // toggling Animate) remounts the chart and replays the entrance —
        // otherwise the new easing only applies to an animation that never
        // runs, and the change would be invisible.
        key={`${renderer}-${kind}-${height}-${easing}-${animType}-${animated ? 1 : 0}`}
        height={height}
        animation={animation}
        loading={lgLoading || undefined}
        loaderType={lgType}
        axes={axesMode === "none" ? false : undefined}
        hoverDim={kind === "scatter" ? Number(scatterDim) : undefined}
        ariaLabel="Playground chart"
      >
        <Chart.Title
          title={
            kind === "line"
              ? "Growth metrics"
              : kind === "bar"
                ? "Quarterly P&L"
                : kind === "pie"
                  ? "Plan mix"
                  : kind === "polar"
                    ? "Workflow adoption"
                    : kind === "scatter"
                      ? "Signal clusters"
                      : kind === "gauge"
                        ? "Fleet utilization"
                        : kind === "nightingale"
                          ? "Tornadoes by month"
                          : kind === "waterfall"
                          ? "ARR bridge by driver"
                          : kind === "combo"
                            ? "Revenue combo"
                            : kind === "heatmap"
                              ? "Commute intensity"
                              : kind === "treemap"
                                ? tmGrouped
                                  ? "Headcount by department"
                                  : tmPalette === "stocks"
                                    ? "Big-cap market cap"
                                    : "Continent land area"
                              : "Trading days"
          }
          subtitle={renderer === "canvas" ? "Canvas renderer" : "SVG renderer"}
        />
        {kind === "line" && (
          <>
            <Chart.Line
              data={metrics}
              name="Expansion ARR"
              color="violet"
              valueYField="arr"
              curve={curve}
              fillOpacity={showFill ? 0.35 : 0}
              areaGradient={showFill && areaGradient}
              lineStrokeWidth={2.5}
              showMarkers={showMarkers}
            />
            <Chart.Line
              data={metrics}
              name="Week 8 retention"
              color="emerald"
              valueYField="retention"
              curve={curve}
              lineStyle="dashed"
              showMarkers={showMarkers}
            />
            <Chart.Line
              data={metrics}
              name="Support risk"
              color="red"
              valueYField="risk"
              curve={curve}
              lineStyle="dotted"
              showMarkers={showMarkers}
            />
            <Chart.XAxis {...gridProps} />
            <Chart.YAxis domain={[50, 350]} tickCount={6} {...gridProps} />
          </>
        )}
        {kind === "bar" && (
          <>
            <Chart.Bar
              data={quarters}
              name="Revenue"
              valueYField="revenue"
              color="violet"
              mode={barMode}
              stackId={stacked ? "pg" : undefined}
              cornerRadius={barCorner}
              segmentGap={segmentGap}
            />
            <Chart.Bar
              data={quarters}
              name="Profit"
              valueYField="profit"
              color="emerald"
              mode={barMode}
              stackId={stacked ? "pg" : undefined}
              cornerRadius={barCorner}
              segmentGap={segmentGap}
            />
            <Chart.XAxis {...gridProps} />
            <Chart.YAxis tickCount={5} {...gridProps} />
          </>
        )}
        {kind === "pie" && (
          <Chart.Pie
            data={piePlans}
            name="Plan mix"
            innerRadius={donut ? 0.6 : 0}
            startAngle={angles.start}
            sweepAngle={angles.sweep}
            padAngle={pieGap}
            cornerRadius={pieCorner}
            showPercentLabels={pieLabelMin > 0}
            minPercentLabel={pieLabelMin}
          />
        )}
        {kind === "candlestick" && (
          <>
            <Chart.Candlestick
              data={candles}
              name="Index"
              variant={candleVariant}
              highlightSelected={candleSelected}
            />
            <Chart.XAxis {...gridProps} />
            <Chart.YAxis tickCount={5} {...gridProps} />
          </>
        )}
        {kind === "range" && (
          <>
            <Chart.RangeArea
              data={corridor}
              name="Full envelope"
              categoryXField="time"
              minYField="envMin"
              maxYField="envMax"
              color="violet"
              curve="smooth"
              fillStyle={fillMode === "off" ? "flat" : fillMode}
              fillOpacity={fillMode === "off" ? 0 : 0.45}
            />
            <Chart.RangeArea
              data={corridor}
              name="Operating band"
              categoryXField="time"
              minYField="opMin"
              maxYField="opMax"
              color="blue"
              curve="smooth"
              fillStyle={fillMode === "off" ? "flat" : fillMode}
              fillOpacity={fillMode === "off" ? 0 : 0.55}
            />
            <Chart.Line
              data={corridor}
              name="Average response"
              categoryXField="time"
              valueYField="avg"
              color="emerald"
              curve="smooth"
              lineStrokeWidth={2.5}
              showMarkers
              markerSize={2.5}
            />
            <Chart.XAxis {...gridProps} tickCount={12} />
            <Chart.YAxis
              tickCount={6}
              format={(t) => `${t} ms`}
              {...gridProps}
            />
          </>
        )}
        {kind === "radar" && (
          <>
            <Chart.Radar
              data={readiness}
              name="Launch build"
              valueYField="launch"
              color="violet"
              fillStyle={fillMode === "off" ? "flat" : fillMode}
              fillOpacity={fillMode === "off" ? 0 : 0.22}
            />
            <Chart.Radar
              data={readiness}
              name="Target bar"
              valueYField="target"
              color="teal"
              lineDash={[6, 4]}
              fillStyle={fillMode === "off" ? "flat" : fillMode}
              fillOpacity={fillMode === "off" ? 0 : 0.1}
              goal={80}
              goalLabel="Launch-ready ≥ 80 pts"
            />
            <Chart.Radar
              data={readiness}
              name="Buyer benchmark"
              valueYField="benchmark"
              color="amber"
              fillStyle={fillMode === "off" ? "flat" : fillMode}
              fillOpacity={fillMode === "off" ? 0 : 0.14}
            />
            <Chart.RadarAxis
              rings={4}
              domainMax={100}
              tickFormat={(t) => `${t} pts`}
            />
          </>
        )}
        {kind === "polar" && (
          <>
            {polarMode === "group" ? (
              <>
                <Chart.Polar
                  data={monaco}
                  name="Red Bull"
                  categoryField="sector"
                  valueYField="redBull"
                  color="blue"
                  mode="group"
                  innerRadius={polarInner}
                  segmentRadius={polarRadius}
                  borderWidth={polarBorder}
                />
                <Chart.Polar
                  data={monaco}
                  name="Ferrari"
                  categoryField="sector"
                  valueYField="ferrari"
                  color="red"
                  mode="group"
                  innerRadius={polarInner}
                  segmentRadius={polarRadius}
                  borderWidth={polarBorder}
                />
                <Chart.Polar
                  data={monaco}
                  name="Mercedes"
                  categoryField="sector"
                  valueYField="mercedes"
                  color="emerald"
                  mode="group"
                  innerRadius={polarInner}
                  segmentRadius={polarRadius}
                  borderWidth={polarBorder}
                />
              </>
            ) : (
              <>
                <Chart.Polar
                  data={workflow}
                  name="Autonomous"
                  categoryField="sector"
                  valueYField="autonomous"
                  color="cyan"
                  mode="stack"
                  innerRadius={polarInner}
                  segmentRadius={polarRadius}
                  borderWidth={polarBorder}
                />
                <Chart.Polar
                  data={workflow}
                  name="Assisted"
                  categoryField="sector"
                  valueYField="assisted"
                  color="purple"
                  mode="stack"
                  innerRadius={polarInner}
                  segmentRadius={polarRadius}
                  borderWidth={polarBorder}
                />
                <Chart.Polar
                  data={workflow}
                  name="Manual"
                  categoryField="sector"
                  valueYField="manual"
                  color="amber"
                  mode="stack"
                  innerRadius={polarInner}
                  segmentRadius={polarRadius}
                  borderWidth={polarBorder}
                />
              </>
            )}
            <Chart.PolarAxis
              gridShape={polarShape}
              gridStyle={polarGridStyle}
              gridOpacity={Number(gridFade)}
              sort={polarSort}
            />
          </>
        )}
        {kind === "scatter" && (
          <>
            {scatterShapes["1"] && (
              <Chart.Scatter
                data={scatterAlpha}
                name="Alpha"
                xField="x"
                yField="y"
                sizeField={scatterBubble ? "size" : undefined}
                minSize={Number(scatterMin)}
                maxSize={Number(scatterMax)}
                color="#8b5cf6"
                markerShape={scatterMarker}
                opacity={Number(scatterOpacity)}
                fillOpacity={Number(scatterFill)}
                borderWidth={Number(scatterBorder)}
                pointHitRadius={Number(scatterHitRadius)}
                hoverRadiusMultiplier={Number(scatterHoverRadius)}
                hoverBrightness={Number(scatterBrightness)}
              />
            )}
            {scatterShapes["2"] && (
              <Chart.Scatter
                data={scatterBeta}
                name="Beta"
                xField="x"
                yField="y"
                sizeField={scatterBubble ? "size" : undefined}
                minSize={Number(scatterMin)}
                maxSize={Number(scatterMax)}
                color="#34d399"
                markerShape={scatterMarker}
                opacity={Number(scatterOpacity)}
                fillOpacity={Number(scatterFill)}
                borderWidth={Number(scatterBorder)}
                pointHitRadius={Number(scatterHitRadius)}
                hoverRadiusMultiplier={Number(scatterHoverRadius)}
                hoverBrightness={Number(scatterBrightness)}
              />
            )}
            {scatterShapes["3"] && (
              <Chart.Scatter
                data={scatterGamma}
                name="Gamma"
                xField="x"
                yField="y"
                sizeField={scatterBubble ? "size" : undefined}
                minSize={Number(scatterMin)}
                maxSize={Number(scatterMax)}
                color="#60a5fa"
                markerShape={scatterMarker}
                opacity={Number(scatterOpacity)}
                fillOpacity={Number(scatterFill)}
                borderWidth={Number(scatterBorder)}
                pointHitRadius={Number(scatterHitRadius)}
                hoverRadiusMultiplier={Number(scatterHoverRadius)}
                hoverBrightness={Number(scatterBrightness)}
              />
            )}
            <Chart.XAxis label="X" tickCount={8} {...gridProps} />
            <Chart.YAxis label="Y" tickCount={6} {...gridProps} />
          </>
        )}
        {kind === "gauge" && (
          <>
            <Chart.Gauge
              name="Fleet utilization"
              value={Number(gaugeValue)}
              min={0}
              max={100}
              arcSpan={
                gaugeSpan === "180"
                  ? Math.PI
                  : gaugeSpan === "360"
                    ? Math.PI * 2
                    : 1.5 * Math.PI
              }
              startAngle={gaugeSpan === "180" ? Math.PI : undefined}
              innerRadius={Number(gaugeInner)}
              zones={
                gaugeZones === "single"
                  ? undefined
                  : gaugeZones === "bands"
                    ? [
                        { from: 0, to: 50, color: "#10b981" },
                        { from: 50, to: 80, color: "#fbbf24" },
                        { from: 80, to: 100, color: "#ef4444" },
                      ]
                    : [
                        { from: 0, to: 45, color: "#10b981" },
                        { from: 45, to: 70, color: "#fbbf24" },
                        { from: 70, to: 100, color: "#ef4444" },
                      ]
              }
              ticks={
                gaugeTicks === "0"
                  ? undefined
                  : {
                      count: Number(gaugeTicks),
                      majorEvery: 5,
                      length: 9,
                    }
              }
              target={gaugeTarget === "off" ? undefined : Number(gaugeTarget)}
              targetLabel={
                gaugeTarget === "off" ? undefined : `Target ${gaugeTarget}%`
              }
            />
            <Chart.PieCenter
              title="Utilization"
              value={`${gaugeValue}%`}
              subtitle="of capacity"
            />
          </>
        )}
        {kind === "nightingale" && (
          <>
            <Chart.Pie
              data={nightingaleTornado}
              name="Tornadoes"
              categoryField="name"
              valueField="value"
              nightingale
              innerRadius={Number(nightInner)}
              startAngle={Number(nightStart) * (Math.PI / 180)}
              padAngle={nightGap === "0" ? 0 : Number(nightGap) / 100}
              showLabels={nightLabels}
              nightingaleTicks={nightTicks}
              nightingaleBands={
                nightBands
                  ? [
                      { from: 9, to: 0, color: "#60a5fa" },
                      { from: 1, to: 2, color: "#f59e0b" },
                      { from: 3, to: 5, color: "#f43f5e" },
                      { from: 6, to: 8, color: "#f59e0b" },
                    ]
                  : undefined
              }
              peakLabel={nightPeak ? "PEAK" : undefined}
            />
            <Chart.PieCenter
              title="Annual average"
              value="498"
              subtitle="tornadoes / month"
            />
          </>
        )}
        {kind === "waterfall" && (
          <>
            <Chart.Waterfall
              data={waterfallArr}
              name="ARR bridge"
              categoryXField="name"
              valueYField="value"
              totalField="isTotal"
              orientation={wfOrientation as "vertical" | "horizontal"}
              connectors={wfConnectors}
              valueLabels={wfLabels}
              cornerRadius={4}
            />
          </>
        )}
        {kind === "combo" && (
          <>
            <Chart.Bar
              data={comboStack ? comboStackRows : comboMonthly}
              name={comboStack ? "Base" : "Revenue"}
              categoryXField="month"
              valueYField={comboStack ? "base" : "revenue"}
              mode={comboStack ? "stack" : "group"}
              stackId={comboStack ? "comboPg" : undefined}
              cornerRadius={3}
            />
            {comboStack && (
              <>
                <Chart.Bar
                  data={comboStackRows}
                  name="Growth"
                  categoryXField="month"
                  valueYField="growth"
                  mode="stack"
                  stackId="comboPg"
                />
                <Chart.Bar
                  data={comboStackRows}
                  name="Renewal"
                  categoryXField="month"
                  valueYField="renewal"
                  mode="stack"
                  stackId="comboPg"
                  color="emerald"
                />
                <Chart.Line
                  data={comboMonthly}
                  name="Total"
                  categoryXField="month"
                  valueYField="revenue"
                  color="orange"
                  showMarkers
                  lineStrokeWidth={2.5}
                />
              </>
            )}
            {!comboStack && comboSecondary === "line" && (
              <Chart.Line
                data={comboMonthly}
                name={comboRightAxis ? "Mean temperature" : "Budget"}
                categoryXField="month"
                valueYField={comboRightAxis ? "temperature" : "budget"}
                yFieldAxis={comboRightAxis ? "right" : "left"}
                color={comboRightAxis ? "orange" : "violet"}
                lineStyle={comboDashed ? "dashed" : "solid"}
                fillOpacity={comboArea ? 0.18 : 0}
                showMarkers={comboRightAxis}
              />
            )}
            {!comboStack && comboSecondary === "scatter" && (
              <Chart.Scatter
                data={comboMonthly}
                name="Budget"
                xField="month"
                yField={comboRightAxis ? "temperature" : "budget"}
                yFieldAxis={comboRightAxis ? "right" : "left"}
                minSize={5}
              />
            )}
          </>
        )}
        {kind === "heatmap" && (
          <Chart.Heatmap
            data={heatCommute}
            rows={heatCommuteRows}
            cols={heatCommuteCols}
            colorStops={
              hmPalette === "ocean"
                ? ["#dbeafe", "#3b82f6", "#7c3aed"]
                : hmPalette === "warm"
                  ? ["#fff7ed", "#fb923c", "#dc2626"]
                  : hmPalette === "gold"
                    ? ["#fef9c3", "#fde047", "#f59e0b"]
                    : ["#3b82f6", "#e2e8f0", "#dc2626"]
            }
            domain={[0, 50]}
            valueLabels={hmLabels}
            valueLabelFormat={(v) => String(v)}
            cornerRadius={hmRadius}
            showLegend={hmLegend}
            cellGap={3}
            rowLabelWidth={56}
          />
        )}

        {kind === "treemap" && (
          <Chart.Treemap
            data={
              tmGrouped
                ? treemapTeams
                : tmPalette === "stocks"
                  ? treemapStocks
                  : treemapContinents
            }
            groupField={tmGrouped ? "group" : undefined}
            color={tmPalette === "flat" ? "#7dd3fc" : undefined}
            colors={
              tmPalette === "stocks"
                ? [
                    "#33547a",
                    "#3b5ba8",
                    "#2c6e75",
                    "#2f6b6d",
                    "#356a58",
                    "#4a5578",
                  ]
                : undefined
            }
            deltaField={tmPalette === "stocks" ? "delta" : undefined}
            valueLabels={tmCorner || tmPalette === "stocks"}
            valueLabelFormat={
              tmPalette === "stocks"
                ? (v: number) => `$${v}T`
                : undefined
            }
            gap={3}
          />
        )}
        <Chart.Legend
          position={
            kind === "nightingale" ||
            (kind === "combo" && (comboStack || comboSecondary !== "off"))
              ? "bottom"
              : legendPosition
          }
        />
        {(valuesMode === "popup" || valuesMode === "both") && (
          <Chart.Tooltip
            mode="shared"
            rows={
              kind === "waterfall"
                ? (item) => {
                    const row = (waterfallArr[item.index ?? 0] ?? {}) as {
                      name?: string;
                      value?: number;
                    };
                    const v = row.value ?? 0;
                    return [
                      {
                        label: "Step",
                        value: `${v >= 0 ? "+" : ""}$${v}M`,
                        color: v >= 0 ? "#10b981" : "#f43f5e",
                      },
                    ];
                  }
                : undefined
            }
            itemFormat={
              kind === "combo"
                ? (v, name) =>
                    name === "Mean temperature"
                      ? `${v}°C`
                      : `$${(v / 1000).toFixed(0)}K`
                : undefined
            }
          />
        )}
        {(valuesMode === "y-axis" || valuesMode === "both") && (
          <Chart.AxisBadges mode="hover" />
        )}
        <Chart.Hover />
      </Root>
    </div>
  );

  return (
    <PlaygroundPanel
      controls={
        <ControlAccordion
          groups={[
            {
              id: "core",
              title: "Core",
              controls: (
                <>
                  <Control label="Renderer">
                    <MultiToggle
                      size="sm"
                      fullWidth
                      options={chartRendererOptions}
                      value={renderer}
                      onChange={(v) => setRenderer(v as "svg" | "canvas")}
                    />
                  </Control>
                  <ToggleRow
                    label="Loading"
                    checked={lgLoading}
                    onChange={setLgLoading}
                  />
                  <Control label="Loader type">
                    <MultiToggle
                      size="sm"
                      fullWidth
                      options={[
                        { label: "Skeleton", value: "skeleton" },
                        { label: "Spinner", value: "spinner" },
                        { label: "Progress", value: "progress" },
                      ]}
                      value={lgType}
                      onChange={(v) =>
                        setLgType(v as "skeleton" | "spinner" | "progress")
                      }
                    />
                  </Control>
                </>
              ),
            },
            ...(!fixedKind
              ? [
                  {
                    id: "chart-type",
                    title: "Chart type",
                    controls: (
                      <Control label="Chart">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartKindOptions}
                          value={kind}
                          onChange={(v) => setKind(v as Kind)}
                        />
                      </Control>
                    ),
                  },
                ]
              : []),
            {
              id: "series",
              title: "Series",
              controls: (
                <>
                  {kind === "line" && (
                    <>
                      <SelectControl
                        label="Curve"
                        options={chartCurveOptions}
                        value={curve}
                        onChange={(v) => setCurve(v as LineCurve)}
                      />
                      <ToggleRow label="Area fill" checked={showFill} onChange={setShowFill} />
                      {showFill && (
                        <ToggleRow
                          label="Area gradient"
                          checked={areaGradient}
                          onChange={setAreaGradient}
                        />
                      )}
                      <ToggleRow
                        label="Markers"
                        checked={showMarkers}
                        onChange={setShowMarkers}
                      />
                      <Control label="Values">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartValuesOptions}
                          value={valuesMode}
                          onChange={(v) => setValuesMode(v as ValuesMode)}
                        />
                      </Control>
                    </>
                  )}
                  {kind === "bar" && (
                    <>
                      <Control label="Mode">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartBarModeOptions}
                          value={barMode}
                          onChange={(v) => setBarMode(v as BarMode)}
                        />
                      </Control>
                      <Control label="Corner">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartBarCornerOptions}
                          value={String(barCorner)}
                          onChange={(v) => setBarCorner(Number(v))}
                        />
                      </Control>
                      {stacked && (
                        <Control label="Segment gap">
                          <MultiToggle
                            size="sm"
                            fullWidth
                            options={chartSegmentGapOptions}
                            value={String(segmentGap)}
                            onChange={(v) => setSegmentGap(Number(v))}
                          />
                        </Control>
                      )}
                    </>
                  )}
                  {kind === "pie" && (
                    <>
                      <ToggleRow label="Donut" checked={donut} onChange={setDonut} />
                      <Control label="Slice gap">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartPieGapOptions}
                          value={String(pieGap)}
                          onChange={(v) => setPieGap(Number(v))}
                        />
                      </Control>
                      <Control label="Corner">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartPieCornerOptions}
                          value={String(pieCorner)}
                          onChange={(v) => setPieCorner(Number(v))}
                        />
                      </Control>
                      <Control label="Slice %">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartPieLabelOptions}
                          value={String(pieLabelMin)}
                          onChange={(v) => setPieLabelMin(Number(v))}
                        />
                      </Control>
                      {donut && (
                        <Control label="Sweep">
                          <MultiToggle
                            size="sm"
                            fullWidth
                            options={chartSweepOptions}
                            value={sweep}
                            onChange={(v) => {
                              const next = v as Sweep;
                              setSweep(next);
                              if (next !== "full") setDonut(true);
                            }}
                          />
                        </Control>
                      )}
                    </>
                  )}
                  {kind === "candlestick" && (
                    <Control label="Variant">
                      <MultiToggle
                        size="sm"
                        fullWidth
                        options={chartCandleVariantOptions}
                        value={candleVariant}
                        onChange={(v) => setCandleVariant(v as CandlestickVariant)}
                      />
                    </Control>
                  )}
                  {kind === "candlestick" && (
                    <Control label="Selected">
                      <MultiToggle
                        size="sm"
                        fullWidth
                        options={chartSelectedOptions}
                        value={candleSelected ? "1" : "0"}
                        onChange={(v) => setCandleSelected(v === "1")}
                      />
                    </Control>
                  )}
                  {(kind === "range" || kind === "radar") && (
                    <Control label="Fill">
                      <MultiToggle
                        size="sm"
                        fullWidth
                        options={chartFillOptions}
                        value={fillMode}
                        onChange={(v) => setFillMode(v as FillMode)}
                      />
                    </Control>
                  )}
                  {kind === "gauge" && (
                    <>
                      <Control label="Value">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartGaugeValueOptions}
                          value={gaugeValue}
                          onChange={(v) => setGaugeValue(v)}
                        />
                      </Control>
                      <Control label="Arc span">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartGaugeSpanOptions}
                          value={gaugeSpan}
                          onChange={(v) => setGaugeSpan(v)}
                        />
                      </Control>
                      <Control label="Thickness">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartGaugeInnerOptions}
                          value={gaugeInner}
                          onChange={(v) => setGaugeInner(v)}
                        />
                      </Control>
                      <Control label="Zones">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartGaugeZoneOptions}
                          value={gaugeZones}
                          onChange={(v) => setGaugeZones(v)}
                        />
                      </Control>
                      <Control label="Ticks">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartGaugeTickOptions}
                          value={gaugeTicks}
                          onChange={(v) => setGaugeTicks(v)}
                        />
                      </Control>
                      <Control label="Target">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartGaugeTargetOptions}
                          value={gaugeTarget}
                          onChange={(v) => setGaugeTarget(v)}
                        />
                      </Control>
                    </>
                  )}
                  {kind === "nightingale" && (
                    <>
                      <Control label="Start angle">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartNightStartOptions}
                          value={nightStart}
                          onChange={(v) => setNightStart(v)}
                        />
                      </Control>
                      <Control label="Hub">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartNightInnerOptions}
                          value={nightInner}
                          onChange={(v) => setNightInner(v)}
                        />
                      </Control>
                      <Control label="Slice gap">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartPieGapOptions}
                          value={String(nightGap)}
                          onChange={(v) => setNightGap(v)}
                        />
                      </Control>
                      <ToggleRow
                        label="Month labels"
                        checked={nightLabels}
                        onChange={setNightLabels}
                      />
                      <ToggleRow
                        label="Slice ticks"
                        checked={nightTicks}
                        onChange={setNightTicks}
                      />
                      <ToggleRow
                        label="Season bands"
                        checked={nightBands}
                        onChange={setNightBands}
                      />
                      <ToggleRow
                        label="Peak label"
                        checked={nightPeak}
                        onChange={setNightPeak}
                      />
                    </>
                  )}
                  {kind === "waterfall" && (
                    <>
                      <Control label="Orientation">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={[
                            { label: "Vertical", value: "vertical" },
                            { label: "Horizontal", value: "horizontal" },
                          ]}
                          value={wfOrientation}
                          onChange={(v) => setWfOrientation(v)}
                        />
                      </Control>
                      <ToggleRow
                        label="Connectors"
                        checked={wfConnectors}
                        onChange={setWfConnectors}
                      />
                      <ToggleRow
                        label="Value labels"
                        checked={wfLabels}
                        onChange={setWfLabels}
                      />
                    </>
                  )}
                  {kind === "combo" && (
                    <>
                      <Control label="Secondary series">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={[
                            { label: "Line", value: "line" },
                            { label: "Scatter", value: "scatter" },
                            { label: "Off", value: "off" },
                          ]}
                          value={comboSecondary}
                          onChange={(v) => setComboSecondary(v as "line" | "scatter" | "off")}
                        />
                      </Control>
                      <ToggleRow
                        label="Right axis (°C)"
                        checked={comboRightAxis}
                        onChange={setComboRightAxis}
                      />
                      <ToggleRow
                        label="Stack bars + total"
                        checked={comboStack}
                        onChange={setComboStack}
                      />
                      <ToggleRow
                        label="Dashed line"
                        checked={comboDashed}
                        onChange={setComboDashed}
                      />
                      <ToggleRow
                        label="Line area"
                        checked={comboArea}
                        onChange={setComboArea}
                      />
                    </>
                  )}
                  {kind === "heatmap" && (
                    <>
                      <Control label="Palette">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={[
                            { label: "Warm", value: "warm" },
                            { label: "Ocean", value: "ocean" },
                            { label: "Gold", value: "gold" },
                            { label: "Diverging", value: "diverging" },
                          ]}
                          value={hmPalette}
                          onChange={(v) =>
                            setHmPalette(v as "ocean" | "warm" | "gold" | "diverging")
                          }
                        />
                      </Control>
                      <ToggleRow
                        label="Value labels"
                        checked={hmLabels}
                        onChange={setHmLabels}
                      />
                      <ToggleRow label="Legend" checked={hmLegend} onChange={setHmLegend} />
                      <Control label="Cell radius">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={[
                            { label: "0", value: "0" },
                            { label: "3", value: "3" },
                            { label: "6", value: "6" },
                            { label: "10", value: "10" },
                          ]}
                          value={String(hmRadius)}
                          onChange={(v) => setHmRadius(Number(v))}
                        />
                      </Control>
                    </>
                  )}
                  {kind === "treemap" && (
                    <>
                      <Control label="Colors">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={[
                            { label: "Flat", value: "flat" },
                            { label: "Palette", value: "palette" },
                            { label: "Stocks", value: "stocks" },
                          ]}
                          value={tmPalette}
                          onChange={(v) => setTmPalette(v as "flat" | "palette" | "stocks")}
                        />
                      </Control>
                      <ToggleRow
                        label="Grouped (by department)"
                        checked={tmGrouped}
                        onChange={setTmGrouped}
                      />
                      <ToggleRow
                        label="Corner values"
                        checked={tmCorner}
                        onChange={setTmCorner}
                      />
                    </>
                  )}
                  {kind === "scatter" && (
                    <>
                      <ToggleRow
                        label="Series 1 · Alpha"
                        checked={scatterShapes["1"]}
                        onChange={(v) => setScatterShapes((s) => ({ ...s, "1": v }))}
                      />
                      <ToggleRow
                        label="Series 2 · Beta"
                        checked={scatterShapes["2"]}
                        onChange={(v) => setScatterShapes((s) => ({ ...s, "2": v }))}
                      />
                      <ToggleRow
                        label="Series 3 · Gamma"
                        checked={scatterShapes["3"]}
                        onChange={(v) => setScatterShapes((s) => ({ ...s, "3": v }))}
                      />
                      <SelectControl
                        label="Marker shape"
                        options={chartScatterShapeOptions}
                        value={scatterMarker}
                        onChange={(v) => setScatterMarker(v as MarkerShape)}
                      />
                      <ToggleRow
                        label="Bubble (size field)"
                        checked={scatterBubble}
                        onChange={setScatterBubble}
                      />
                      {scatterBubble && (
                        <>
                          <Control label="Min size">
                            <MultiToggle
                              size="sm"
                              fullWidth
                              options={chartScatterMinSizeOptions}
                              value={scatterMin}
                              onChange={(v) => setScatterMin(v)}
                            />
                          </Control>
                          <Control label="Max size">
                            <MultiToggle
                              size="sm"
                              fullWidth
                              options={chartScatterMaxSizeOptions}
                              value={scatterMax}
                              onChange={(v) => setScatterMax(v)}
                            />
                          </Control>
                        </>
                      )}
                      <Control label="Hit radius">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartScatterHitRadiusOptions}
                          value={scatterHitRadius}
                          onChange={(v) => setScatterHitRadius(v)}
                        />
                      </Control>
                      <Control label="Point opacity">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartScatterOpacityOptions}
                          value={scatterOpacity}
                          onChange={(v) => setScatterOpacity(v)}
                        />
                      </Control>
                      <Control label="Fill opacity">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartScatterFillOptions}
                          value={scatterFill}
                          onChange={(v) => setScatterFill(v)}
                        />
                      </Control>
                      <Control label="Border width">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartScatterBorderOptions}
                          value={scatterBorder}
                          onChange={(v) => setScatterBorder(v)}
                        />
                      </Control>
                      <Control label="Hover brightness">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartScatterBrightnessOptions}
                          value={scatterBrightness}
                          onChange={(v) => setScatterBrightness(v)}
                        />
                      </Control>
                      <Control label="Hover dim">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartScatterDimOptions}
                          value={scatterDim}
                          onChange={(v) => setScatterDim(v)}
                        />
                      </Control>
                      <Control label="Hover radius ×">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartScatterRadiusOptions}
                          value={scatterHoverRadius}
                          onChange={(v) => setScatterHoverRadius(v)}
                        />
                      </Control>
                    </>
                  )}
                  {kind === "polar" && (
                    <>
                      <Control label="Mode">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartPolarModeOptions}
                          value={polarMode}
                          onChange={(v) => setPolarMode(v as "group" | "stack")}
                        />
                      </Control>
                      <Control label="Inner radius">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartPolarInnerRadiusOptions}
                          value={String(polarInner)}
                          onChange={(v) => setPolarInner(Number(v))}
                        />
                      </Control>
                      <SelectControl
                        label="Sort"
                        options={chartPolarSortOptions}
                        value={polarSort}
                        onChange={(v) => setPolarSort(v as "none" | "asc" | "desc")}
                      />
                      <Control label="Segment radius">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartPolarRadiusOptions}
                          value={String(polarRadius)}
                          onChange={(v) => setPolarRadius(Number(v))}
                        />
                      </Control>
                      <Control label="Border">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartPolarBorderOptions}
                          value={String(polarBorder)}
                          onChange={(v) => setPolarBorder(Number(v))}
                        />
                      </Control>
                      <Control label="Grid shape">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartPolarShapeOptions}
                          value={polarShape}
                          onChange={(v) => setPolarShape(v as "circle" | "polygon")}
                        />
                      </Control>
                      <Control label="Grid style">
                        <MultiToggle
                          size="sm"
                          fullWidth
                          options={chartPolarGridStyleOptions}
                          value={polarGridStyle}
                          onChange={(v) =>
                            setPolarGridStyle(v as "solid" | "dashed" | "dotted")
                          }
                        />
                      </Control>
                    </>
                  )}
                </>
              ),
            },
            ...(kind !== "pie"
              ? [
                  {
                    id: "grid-axes",
                    title: "Grid & axes",
                    controls: (
                      <>
                        <Control label="Grid">
                          <MultiToggle
                            size="sm"
                            fullWidth
                            options={chartGridOptions}
                            value={grid}
                            onChange={(v) => setGrid(v as GridStyle)}
                          />
                        </Control>
                        <Control label="Axes">
                          <MultiToggle
                            size="sm"
                            fullWidth
                            options={[
                              { label: "All", value: "all" },
                              { label: "Labels", value: "labels" },
                              { label: "None", value: "none" },
                            ]}
                            value={axesMode}
                            onChange={(v) =>
                              setAxesMode(v as "all" | "labels" | "none")
                            }
                          />
                        </Control>
                        <Control label="Grid fade">
                          <MultiToggle
                            size="sm"
                            fullWidth
                            options={chartGridFadeOptions}
                            value={gridFade}
                            onChange={setGridFade}
                          />
                        </Control>
                      </>
                    ),
                  },
                ]
              : []),
            {
              id: "layout",
              title: "Layout",
              controls: (
                <>
                  <Control label="Height">
                    <MultiToggle
                      size="sm"
                      options={chartHeightOptions}
                      value={String(height)}
                      onChange={(v) => setHeight(Number(v))}
                    />
                  </Control>
                  <Control label="Legend">
                    <MultiToggle
                      size="sm"
                      fullWidth
                      options={chartLegendPositionOptions}
                      value={legendPosition}
                      onChange={(v) => setLegendPosition(v as "top" | "bottom")}
                    />
                  </Control>
                </>
              ),
            },
            {
              id: "animation",
              title: "Animation & interactivity",
              controls: (
                <>
                  <ToggleRow label="Animate" checked={animated} onChange={setAnimated} />
                  {animated && (
                    <>
                      <SelectControl
                        label="Animation"
                        options={[
                          { label: "Grow (default)", value: "grow" },
                          { label: "Radial", value: "radial" },
                          { label: "Sweep", value: "sweep" },
                          { label: "Fade", value: "fade" },
                        ]}
                        value={animType}
                        onChange={setAnimType}
                      />
                      <SelectControl
                        label="Easing"
                        options={EASING_PRESETS.map((e) => ({ label: e, value: e }))}
                        value={easing}
                        onChange={setEasing}
                      />
                    </>
                  )}
                  {kind !== "pie" && (
                    <ToggleRow
                      label="Streaming (5 s)"
                      checked={streaming}
                      onChange={setStreaming}
                    />
                  )}
                </>
              ),
            },
          ]}
        />
      }
      preview={preview}
      previewClassName="bg-neutral-50/60 dark:bg-neutral-950/40"
    />
  );
};
