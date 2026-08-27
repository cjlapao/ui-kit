import { Chart } from "@cjlapao/ui-kit";
import { treemapStocks } from "../data";

/**
 * Stock tiles — the corner-value layout: title top-left, a signed delta
 * pill (▲ green / ▼ red) under it, and the market cap in the bottom-left
 * corner. Muted blue/indigo/teal fills via an explicit `colors` array.
 */
export function TreemapStocks() {
  return (
    <Chart.Svg height={460} ariaLabel="Big-cap market cap treemap">
      <Chart.Title
        title="Big-cap market cap"
        subtitle="Tile area is market cap; the corner value and day-move pill pack the rest of the story into each tile."
      />
      <Chart.Treemap
        data={treemapStocks}
        categoryField="symbol"
        valueField="value"
        deltaField="delta"
        deltaFormat={(v) => `${Math.abs(v)}%`}
        valueLabels
        valueLabelFormat={(v) => `$${v}T`}
        colors={["#33547a", "#3b5ba8", "#2c6e75", "#2f6b6d", "#356a58", "#4a5578"]}
        gap={3}
      />
      <Chart.Tooltip
        rows={(item) => {
          const t = item.item as {
            symbol: string;
            value: number;
            delta: number;
          };
          return [
            { label: "Symbol", value: t.symbol },
            { label: "Market cap", value: `$${t.value}T` },
            {
              label: "Day change",
              value: `${t.delta > 0 ? "+" : ""}${t.delta}%`,
              color: t.delta >= 0 ? "#10b981" : "#ef4444",
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default TreemapStocks;
