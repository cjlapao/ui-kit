import { Chart } from "@cjlapao/ui-kit";
import { heatCommute, heatCommuteRows, heatCommuteCols } from "../data";

/**
 * Commute intensity — 7 days × 6 hour bands, warm sequential scale with
 * no legend (the grid + labels carry the story on their own).
 */
export function HeatmapCommute() {
  return (
    <Chart.Svg height={440} ariaLabel="Commute intensity">
      <Chart.Title
        title="Commute intensity by day and hour"
        subtitle="Share of daily trips per hour band. Weekday peaks stack up on the 08–10 and 16–18 bands; the weekend flips to midday."
      />
      <Chart.Heatmap
        data={heatCommute}
        rows={heatCommuteRows}
        cols={heatCommuteCols}
        colorStops={["#fff7ed", "#fb923c", "#dc2626"]}
        domain={[0, 46]}
        valueLabels
        valueLabelFormat={(v) => String(v)}
        cellGap={4}
        cornerRadius={6}
        showLegend={false}
        rowLabelWidth={60}
      />
      <Chart.Tooltip
        rows={(item) => {
          const cell = item.item as { row: string; col: string; value: number };
          return [
            { label: "Day", value: cell.row },
            { label: "Hour band", value: cell.col },
            {
              label: "Share of trips",
              value: `${cell.value}%`,
              color: "#dc2626",
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default HeatmapCommute;
