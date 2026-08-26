import { Chart } from "@cjlapao/ui-kit";
import { waterfallCarbon } from "../data";

/**
 * Global Carbon Budget 2022 — a horizontal waterfall: fossil sources
 * accumulate to the gross-emissions total, the sinks float down from it,
 * and the atmospheric growth closes the bridge. A dashed reference line
 * marks the 1.5°C annual budget.
 */
export function WaterfallCarbon() {
  const fmt = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}`;
  return (
    <Chart.Svg
      height={460}
      margin={{ left: 110 }}
      ariaLabel="Global carbon budget 2022"
    >
      <Chart.Title
        title="Global Carbon Budget 2022 — sources, sinks, net accumulation"
        subtitle="Values in gigatonnes of CO₂ per year · Source: Global Carbon Project, Global Carbon Budget 2023"
      />
      <Chart.Waterfall
        data={waterfallCarbon}
        orientation="horizontal"
        categoryXField="name"
        valueYField="value"
        totalField="isTotal"
        color={(r) => (r as { color?: string }).color ?? "#fb7185"}
        valueLabelFormat={fmt}
      />
      <Chart.ReferenceLine
        x={5.7}
        color="#60a5fa"
        label="1.5°C annual budget (5.7)"
        labelPosition="start"
      />
      <Chart.Annotation
        x="Gross emissions"
        y={41.2}
        title="Gross emissions 41.2 GtCO₂/yr"
        value="7× over 1.5°C budget"
        tone="red"
      />
      <Chart.XAxis />
      <Chart.YAxis />
      <Chart.Tooltip
        rows={(item) => {
          const row = waterfallCarbon[item.index ?? 0];
          const share = ((Math.abs(row.value) / 41.2) * 100).toFixed(0);
          return [
            { label: "Contribution", value: `${row.value > 0 ? "+" : ""}${row.value.toFixed(1)} GtCO₂/yr` },
            { label: "Share of gross", value: `${share}%` },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default WaterfallCarbon;
