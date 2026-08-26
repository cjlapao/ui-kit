import { Chart } from "@cjlapao/ui-kit";
import { comboTarget } from "../data";

/**
 * Target vs actual — a target line with the actual results as scatter
 * markers on the same band months (markers land on the band centers).
 */
export function ComboTargetActual() {
  return (
    <Chart.Svg height={440} ariaLabel="Monthly target versus actual units">
      <Chart.Title
        title="Monthly target vs actual"
        subtitle="The solid line is the plan; the markers are the actual monthly units"
      />
      <Chart.Line
        data={comboTarget}
        name="Target"
        categoryXField="month"
        valueYField="target"
        color="#94a3b8"
        showMarkers={false}
        lineStrokeWidth={2}
      />
      <Chart.Scatter
        data={comboTarget}
        name="Actual"
        xField="month"
        yField="actual"
        minSize={9}
      />
      <Chart.XAxis label="Month" />
      <Chart.YAxis label="Units" tickCount={7} />
      <Chart.Legend />
      <Chart.Tooltip
        itemFormat={(v, name) =>
          name === "Target" ? `${v} (plan)` : `${v} units`
        }
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default ComboTargetActual;
