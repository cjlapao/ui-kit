import { Chart } from "@cjlapao/ui-kit";
import { waterfallArr } from "../data";

/**
 * ARR bridge by driver — a floating waterfall with dashed running-total
 * connectors: the Open ARR total starts the bridge, the drivers float,
 * and the Closing ARR total closes it. Dashed reference lines mark the
 * Open and Close levels.
 */
export function WaterfallArr() {
  const fmt = (v: number) => `${v > 0 ? "+" : ""}$${v}M`;
  return (
    <Chart.Svg height={460} ariaLabel="ARR bridge by driver">
      <Chart.Title
        title="ARR bridge by driver"
        subtitle="Quarterly ARR moves through expansion, pricing, usage, churn, credits, and reserve pressure before the forecast closes."
      />
      <Chart.Waterfall
        data={waterfallArr}
        categoryXField="name"
        valueYField="value"
        totalField="isTotal"
        connectors
        cornerRadius={4}
        valueLabelFormat={fmt}
      />
      <Chart.ReferenceLine y={420} color="#64748b" label="Open" labelPosition="start" />
      <Chart.ReferenceLine y={448} color="#60a5fa" label="Close" labelPosition="end" />
      <Chart.Annotation
        x="Closing ARR"
        y={448}
        title="NET CHANGE"
        value="+$28M to $448M"
      />
      <Chart.XAxis />
      <Chart.YAxis />
      <Chart.Tooltip
        rows={(item) => {
          const row = waterfallArr[item.index ?? 0];
          return [
            {
              label: "Step",
              value: `${row.value > 0 ? "+" : ""}$${row.value}M`,
              color: row.value >= 0 ? "#10b981" : "#f43f5e",
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default WaterfallArr;
