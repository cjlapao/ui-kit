import { Chart } from "@cjlapao/ui-kit";
import { waterfallEu } from "../data";

const KIND_COLORS: Record<string, string> = {
  revenue: "#10b981",
  spending: "#f43f5e",
  total: "#818cf8",
};

/**
 * EU-27 government revenue and spending, 2022 — a classic bridge: the
 * total-revenue marker anchors the spending steps, and the closing
 * deficit total sits below the baseline. Colors route by the `kind`
 * field via the per-datum color accessor.
 */
export function WaterfallEu() {
  const fmt = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
  return (
    <Chart.Svg height={460} ariaLabel="EU-27 government revenue and spending 2022">
      <Chart.Title
        title="EU-27 Government Revenue and Spending, 2022"
        subtitle="Percentage of GDP · Source: Eurostat General Government Finance Statistics"
      />
      <Chart.Waterfall
        data={waterfallEu}
        categoryXField="name"
        valueYField="value"
        totalField="isTotal"
        color={(r) => KIND_COLORS[(r as { kind?: string }).kind ?? ""] ?? "#818cf8"}
        valueLabelFormat={fmt}
      />
      <Chart.Annotation
        x="Net deficit"
        y={-3.4}
        title="Above Maastricht 3% reference"
        value="Deficit: 3.4% of GDP"
        tone="red"
      />
      <Chart.XAxis />
      <Chart.YAxis />
      <Chart.Tooltip
        rows={(item) => {
          const row = waterfallEu[item.index ?? 0];
          return [
            { label: "Contribution", value: fmt(row.value) },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default WaterfallEu;
