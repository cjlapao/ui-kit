import { useMemo, useState } from "react";
import { Chart, EASING_PRESETS, MultiToggle } from "@cjlapao/ui-kit";
import type { ChartAnimation, LineCurve } from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  chartCurveOptions,
  chartHeightOptions,
  chartKindOptions,
  chartRendererOptions,
} from "../../shared/options";
import { lineMetrics, piePlans, candleDays, barQuarterly } from "./data";

type Kind = "line" | "bar" | "pie" | "candlestick";

export const ChartPlayground = () => {
  const [renderer, setRenderer] = useState<"svg" | "canvas">("svg");
  const [kind, setKind] = useState<Kind>("line");
  const [curve, setCurve] = useState<LineCurve>("smooth");
  const [height, setHeight] = useState(380);
  const [showFill, setShowFill] = useState(true);
  const [donut, setDonut] = useState(true);
  const [animated, setAnimated] = useState(true);
  const [easing, setEasing] = useState<string>("easeOutQuart");

  const animation: ChartAnimation = useMemo(
    () => (animated ? { duration: 900, easing } : false),
    [animated, easing],
  );

  const Root = renderer === "svg" ? Chart.Svg : Chart.Canvas;

  const preview = (
    <div className="w-full max-w-4xl">
      <Root
        key={`${renderer}-${kind}-${height}`}
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
              lineStrokeWidth={2.5}
            />
            <Chart.Line
              data={lineMetrics}
              name="Week 8 retention"
              color="emerald"
              valueYField="retention"
              curve={curve}
              lineStyle="dashed"
            />
            <Chart.Line
              data={lineMetrics}
              name="Support risk"
              color="red"
              valueYField="risk"
              curve={curve}
              lineStyle="dotted"
            />
            <Chart.XAxis />
            <Chart.YAxis domain={[50, 350]} tickCount={6} />
          </>
        )}
        {kind === "bar" && (
          <>
            <Chart.Bar data={barQuarterly} name="Revenue" valueYField="revenue" color="violet" />
            <Chart.Bar data={barQuarterly} name="Profit" valueYField="profit" color="emerald" />
            <Chart.XAxis />
            <Chart.YAxis tickCount={5} />
          </>
        )}
        {kind === "pie" && (
          <Chart.Pie
            data={piePlans}
            name="Plan mix"
            innerRadius={donut ? 0.6 : 0}
          />
        )}
        {kind === "candlestick" && (
          <>
            <Chart.Candlestick data={candleDays} name="Index" />
            <Chart.XAxis />
            <Chart.YAxis tickCount={5} />
          </>
        )}
        <Chart.Legend />
        <Chart.Tooltip mode="shared" />
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
          </>
        )}
        {kind === "pie" && (
          <ToggleRow label="Donut" checked={donut} onChange={setDonut} />
        )}
        <Control label="Height">
          <MultiToggle
            size="sm"
            options={chartHeightOptions}
            value={String(height)}
            onChange={(v) => setHeight(Number(v))}
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
