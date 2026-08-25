import { useEffect, useMemo, useState } from "react";
import { Chart, EASING_PRESETS, MultiToggle } from "@cjlapao/ui-kit";
import type {
  BarMode,
  CandlestickVariant,
  ChartAnimation,
  LineCurve,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  chartBarCornerOptions,
  chartBarModeOptions,
  chartCandleVariantOptions,
  chartCurveOptions,
  chartFillOptions,
  chartGridFadeOptions,
  chartGridOptions,
  chartHeightOptions,
  chartKindOptions,
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
} from "./data";

type Kind = "line" | "bar" | "pie" | "candlestick" | "range";
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

export const ChartPlayground = ({ fixedKind }: ChartPlaygroundProps) => {
  const [renderer, setRenderer] = useState<"svg" | "canvas">("svg");
  const [kindState, setKind] = useState<Kind>(fixedKind ?? "line");
  const kind = fixedKind ?? kindState;
  const [curve, setCurve] = useState<LineCurve>("smooth");
  const [height, setHeight] = useState(380);
  const [showFill, setShowFill] = useState(true);
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
  const [streaming, setStreaming] = useState(false);
  const [metrics, setMetrics] = useState(lineMetrics);
  const [quarters, setQuarters] = useState(barQuarterly);
  const [candles, setCandles] = useState(candleDays);
  const [corridor, setCorridor] = useState(corridorData);
  const [fillMode, setFillMode] = useState<FillMode>("gradient");

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
    }, 5000);
    return () => clearInterval(id);
  }, [streaming]);

  const animation: ChartAnimation = useMemo(
    () => (animated ? { duration: 900, easing } : false),
    [animated, easing],
  );

  const Root = renderer === "svg" ? Chart.Svg : Chart.Canvas;

  const stacked = barMode !== "group";
  const angles = SWEEP_ANGLES[sweep];
  const gridProps = {
    grid: grid === "off" ? false : undefined,
    gridDash: grid === "dashed" ? ("dashed" as const) : ("solid" as const),
    gridOpacity: Number(gridFade),
  };

  const preview = (
    <div className="w-full max-w-4xl">
      <Root
        // The key includes the animation state so changing the easing (or
        // toggling Animate) remounts the chart and replays the entrance —
        // otherwise the new easing only applies to an animation that never
        // runs, and the change would be invisible.
        key={`${renderer}-${kind}-${height}-${easing}-${animated ? 1 : 0}`}
        height={height}
        animation={animation}
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
        <Chart.Legend position={legendPosition} />
        {(valuesMode === "popup" || valuesMode === "both") && (
          <Chart.Tooltip mode="shared" />
        )}
        {(valuesMode === "y-axis" || valuesMode === "both") && (
          <Chart.AxisBadges mode="hover" />
        )}
        <Chart.Hover />
      </Root>
    </div>
  );

  return (
    <PlaygroundPanel controls={
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
        {!fixedKind && (
          <Control label="Chart">
            <MultiToggle
              size="sm"
              fullWidth
              options={chartKindOptions}
              value={kind}
              onChange={(v) => setKind(v as Kind)}
            />
          </Control>
        )}
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
        {kind === "range" && (
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
        {kind !== "pie" && (
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
        )}
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
        <ToggleRow label="Animate" checked={animated} onChange={setAnimated} />
        {animated && (
          <SelectControl
            label="Easing"
            options={EASING_PRESETS.map((e) => ({ label: e, value: e }))}
            value={easing}
            onChange={setEasing}
          />
        )}
        {kind !== "pie" && (
          <ToggleRow
            label="Streaming (5 s)"
            checked={streaming}
            onChange={setStreaming}
          />
        )}
      </>
    } preview={preview} previewClassName="bg-neutral-50/60 dark:bg-neutral-950/40" />
  );
};
