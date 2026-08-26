import { Chart } from "@cjlapao/ui-kit";
import { workflowData } from "../data";

export default function PolarStacked() {
  return (
    <Chart.Svg height={520} hoverDim={0.45}>
      <Chart.Title
        title="AI workflow adoption"
        subtitle="Weekly runs per sector, stacked by how much a person did"
      />
      <Chart.Polar
        data={workflowData}
        name="Autonomous"
        categoryField="sector"
        valueYField="autonomous"
        color="cyan"
        mode="stack"
      />
      <Chart.Polar
        data={workflowData}
        name="Assisted"
        categoryField="sector"
        valueYField="assisted"
        color="purple"
        mode="stack"
      />
      <Chart.Polar
        data={workflowData}
        name="Manual"
        categoryField="sector"
        valueYField="manual"
        color="amber"
        mode="stack"
      />
      <Chart.PolarAxis gridShape="circle" gridLines={5} showTickLabels />
      <Chart.PolarCenter
        title="Autonomous share"
        value="59%"
        subtitle="of all weekly runs"
      />
      <Chart.Legend />
      <Chart.Tooltip />
      <Chart.Hover />
    </Chart.Svg>
  );
}
