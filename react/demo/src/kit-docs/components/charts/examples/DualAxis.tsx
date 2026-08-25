import { Chart } from "@cjlapao/ui-kit";
import { lineMetrics } from "../data";

/**
 * Two value axes from one series list — the left axis carries the indexed
 * metrics, the right axis an absolute dollar scale for the ARR line.
 */
export default function DualAxis() {
  const dollars = lineMetrics.map((p) => ({
    date: p.date,
    value: Math.round(p.arr * 4800),
  }));
  return (
    <div className="w-full max-w-4xl">
      <Chart.Svg height={340}>
        <Chart.Title title="Dual y-axes" subtitle="Indexed metrics · dollar scale" />
        <Chart.Line
          data={dollars}
          name="ARR ($)"
          color="violet"
          curve="smooth"
          yFieldAxis="right"
          fillOpacity={0.25}
        />
        <Chart.Line
          data={lineMetrics}
          name="Activation (index)"
          color="emerald"
          valueYField="activation"
          curve="smooth"
          lineStyle="dashed"
        />
        <Chart.XAxis />
        <Chart.YAxis label="Index" domain={[50, 350]} />
        <Chart.YAxis axis="right" label="ARR ($k)" format={(t) => `$${(t / 1000).toFixed(0)}k`} />
        <Chart.Legend />
        <Chart.Tooltip mode="shared" itemFormat={(v, name) => (name === "ARR ($)" ? `$${(v / 1000).toFixed(0)}k` : String(v))} />
        <Chart.Hover />
      </Chart.Svg>
    </div>
  );
}
