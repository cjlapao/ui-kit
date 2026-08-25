import { Chart } from "@cjlapao/ui-kit";
import { arrPlans, arrPlanColors, arrTotal } from "../data";

/**
 * Plan mix by ARR (the PrimeUI donut reference): six plan slices with
 * percent labels, a center readout that tracks slice hover, and a bottom
 * legend whose toggles isolate slices.
 */
export default function PieDonut() {
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-4">
      <Chart.Svg height={440}>
        <Chart.Title
          title="Plan mix by ARR"
          subtitle="Annual recurring revenue is split by plan, with slice hover updating the center readout and legend toggles for isolation"
        />
        <Chart.Pie
          data={arrPlans}
          name="Plan mix"
          valueField="value"
          categoryField="name"
          colors={arrPlanColors}
          innerRadius={0.62}
          padAngle={0.02}
          cornerRadius={6}
        />
        <Chart.PieCenter
          title="ARR MIX"
          value={arrTotal}
          subtitle={`${arrPlans.length} plans tracked`}
          valueFormatter={(v) => `$${(v / 1000).toFixed(2)}M`}
          hoverSubtitle={(s) =>
            `$${(s.value / 1000).toFixed(2)}M · ${Math.round(s.percent)}%`
          }
        />
        <Chart.DataLabels
          position="all"
          formatter={(v) => `${Math.round((v / arrTotal) * 100)}%`}
        />
        <Chart.Legend position="bottom" />
        <Chart.Tooltip mode="shared" />
        <Chart.Hover />
      </Chart.Svg>
    </div>
  );
}
