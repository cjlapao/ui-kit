import { Chart } from "@cjlapao/ui-kit";
import { lineMetrics } from "../data";

/** Curve interpolation, line styles and markers on one shared dataset. */
export default function LineCurves() {
  return (
    <div className="w-full max-w-4xl">
      <Chart.Svg height={340}>
        <Chart.Title title="Curve, dash & markers" />
        <Chart.Line
          data={lineMetrics}
          name="Linear"
          color="violet"
          valueYField="arr"
          curve="linear"
          maxDataPoints={16}
        />
        <Chart.Line
          data={lineMetrics}
          name="Smooth"
          color="sky"
          valueYField="arr"
          curve="smooth"
          lineStyle="dashed"
          maxDataPoints={16}
        />
        <Chart.Line
          data={lineMetrics}
          name="Step"
          color="emerald"
          valueYField="arr"
          curve="step"
          lineStyle="dotted"
          showMarkers
          markerShape="square"
          maxDataPoints={16}
        />
        <Chart.XAxis />
        <Chart.YAxis tickCount={5} />
        <Chart.Legend />
        <Chart.Tooltip />
        <Chart.Hover />
      </Chart.Svg>
    </div>
  );
}
