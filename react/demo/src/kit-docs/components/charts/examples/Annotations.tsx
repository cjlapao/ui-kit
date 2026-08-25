import { Chart } from "@cjlapao/ui-kit";
import { lineMetrics } from "../data";

/** Reference lines, bands and callout cards on a single smooth series. */
export default function Annotations() {
  const target = lineMetrics[55];
  return (
    <div className="w-full max-w-4xl">
      <Chart.Svg height={340}>
        <Chart.Title title="Annotations" subtitle="Bands, rules and callouts" />
        <Chart.Line
          data={lineMetrics}
          name="Expansion ARR"
          color="violet"
          valueYField="arr"
          curve="smooth"
          fillOpacity={0.2}
        />
        <Chart.ReferenceBand
          x1={lineMetrics[20].date}
          x2={lineMetrics[40].date}
          color="teal"
          opacity={0.12}
          label="Slow quarter"
        />
        <Chart.ReferenceLine y={120} label="Milestone 120" color="emerald" />
        <Chart.ReferenceLine x={lineMetrics[43].date} color="violet" />
        <Chart.Annotation
          x={lineMetrics[45].date}
          y={lineMetrics[45].arr}
          tone="violet"
          title="Pricing lift"
          value="+105 pts"
          leaderLine
        />
        <Chart.Annotation
          x={target.date}
          y={target.arr}
          tone="sky"
          title="Enterprise ramp"
          value="200+ index"
          placement="bottom"
        />
        <Chart.XAxis />
        <Chart.YAxis tickCount={5} />
      </Chart.Svg>
    </div>
  );
}
