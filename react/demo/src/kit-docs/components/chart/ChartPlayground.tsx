import { useMemo, useState } from "react";
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
import { lineMetrics, piePlans, candleDays, barQuarterly } from "./data";

type Kind = "line" | "bar" | "pie" | "candlestick";
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

export const ChartPlayground = () => {
  const [renderer, setRenderer] = useState<"svg" | "canvas">("svg");
  const [kind, setKind] = useState<Kind>("line");
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
              data={lineMetrics}
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
              data={lineMetrics}
              name="Week 8 retention"
              color="emerald"
              valueYField="retention"
              curve={curve}
              lineStyle="dashed"
              showMarkers={showMarkers}
            />
            <Chart.Line
              data={lineMetrics}
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
              data={barQuarterly}
              name="Revenue"
              valueYField="revenue"
              color="violet"
              mode={barMode}
              stackId={stacked ? "pg" : undefined}
              cornerRadius={barCorner}
              segmentGap={segmentGap}
            />
            <Chart.Bar
              data={barQuarterly}
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
              data={candleDays}
              name="Index"
              variant={candleVariant}
              highlightSelected={candleSelected}
            />
            <Chart.XAxis {...gridProps} />
            <Chart.YAxis tickCount={5} {...gridProps} />
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
        <Control label="Chart">
          <MultiToggle
            size="sm"
            fullWidth
            options={chartKindOptions}
            value={kind}
            onChange={(v) => setKind(v as Kind)}
          />
        </Control>
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
      </>
    } preview={preview} previewClassName="bg-neutral-50/60 dark:bg-neutral-950/40" />
  );
};
