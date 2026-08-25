import { Chart } from "@cjlapao/ui-kit";
import { readinessData, readinessGoal } from "../data";

export default function Radar() {
  return (
    <Chart.Svg height={480}>
      <Chart.Title
        title="Enterprise readiness gaps"
        subtitle="Launch build, target bar, and buyer benchmark expose the gates that still block enterprise rollout."
      />
      <Chart.Radar
        data={readinessData}
        name="Launch build"
        valueYField="launch"
        color="#8b5cf6"
        fillOpacity={0.22}
      />
      <Chart.Radar
        data={readinessData}
        name="Target bar"
        valueYField="target"
        color="#2dd4bf"
        lineDash={[6, 4]}
        fillOpacity={0.1}
        goal={readinessGoal}
        goalLabel={`Launch-ready ≥ ${readinessGoal} pts`}
      />
      <Chart.Radar
        data={readinessData}
        name="Buyer benchmark"
        valueYField="benchmark"
        color="#fbbf24"
        fillOpacity={0.14}
      />
      <Chart.RadarAxis
        rings={4}
        domainMax={100}
        tickFormat={(t) => `${t} pts`}
      />
      <Chart.Legend />
      <Chart.Tooltip />
      <Chart.Hover />
    </Chart.Svg>
  );
}
