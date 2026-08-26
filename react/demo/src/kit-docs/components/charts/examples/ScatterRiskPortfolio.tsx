import { Chart } from "@cjlapao/ui-kit";
import { riskExpansion, riskMonitor, riskRecovery } from "../data";

/**
 * Revenue risk portfolio — adoption depth vs renewal pressure. Bubble
 * area = ARR; the shaded bands and dashed rules segment the playbooks.
 */
export default function ScatterRiskPortfolio() {
  return (
    <Chart.Svg height={440} hoverDim={0.35}>
      <Chart.Title
        title="Revenue risk portfolio"
        subtitle="Each bubble is an account: position shows adoption depth and renewal pressure, size shows ARR, color shows the next playbook."
      />
      <Chart.Scatter
        data={riskRecovery}
        name="Recovery"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={7}
        maxSize={34}
        color="#f87171"
        fillOpacity={0.8}
      />
      <Chart.Scatter
        data={riskMonitor}
        name="Monitor"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={7}
        maxSize={34}
        color="#8b5cf6"
        fillOpacity={0.8}
      />
      <Chart.Scatter
        data={riskExpansion}
        name="Expansion"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={7}
        maxSize={34}
        color="#2dd4bf"
        fillOpacity={0.8}
      />
      <Chart.ReferenceBand
        x1={32}
        x2={62}
        y1={55}
        y2={88}
        color="red"
        opacity={0.1}
      />
      <Chart.ReferenceBand
        x1={72}
        x2={98}
        y1={15}
        y2={45}
        color="teal"
        opacity={0.1}
      />
      <Chart.ReferenceLine y={55} label="Pressure ceiling" color="red" />
      <Chart.ReferenceLine x={70} label="Adoption target" />
      <Chart.Annotation
        x={52}
        y={74}
        tone="red"
        title="renewal save"
        placement="right"
      />
      <Chart.Annotation
        x={81}
        y={24}
        tone="teal"
        title="expansion lane"
        placement="left"
      />
      <Chart.XAxis label="Adoption depth" format={(t) => `${t}%`} />
      <Chart.YAxis label="Renewal pressure" tickCount={6} format={(t) => `${t}%`} />
      <Chart.Legend />
      <Chart.Tooltip />
      <Chart.Hover />
    </Chart.Svg>
  );
}
