import { Chart } from "@cjlapao/ui-kit";
import { piePlans } from "../data";

/** Donut with a centre total, percent labels and a side legend. */
export default function PieDonut() {
  const total = piePlans.reduce((sum, p) => sum + p.value, 0);
  return (
    <div className="flex w-full max-w-4xl items-center justify-center gap-10">
      <Chart.Svg height={320}>
        <Chart.Pie data={piePlans} name="Plan mix" innerRadius={0.6} />
        <Chart.DataLabels
          position="all"
          formatter={(v) => `${Math.round((v / total) * 100)}%`}
        />
      </Chart.Svg>
      <Chart.Svg height={320}>
        <Chart.Pie data={piePlans} name="Plan mix" />
        <Chart.Legend orientation="vertical" />
      </Chart.Svg>
    </div>
  );
}
