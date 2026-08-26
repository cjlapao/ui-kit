import { Chart } from "@cjlapao/ui-kit";
import { waterfallEbitda } from "../data";

/**
 * FY 2023 EBITDA bridge — a stacked waterfall: each step carries a core
 * (darker) and an incremental (lighter) layer; the running total
 * accumulates the combined values and the break-even reference line
 * sits at zero.
 */
export function WaterfallEbitda() {
  const fmt = (v: number) => (v >= 0 ? `+$${Math.round(v)}M` : `-$${Math.round(-v)}M`);
  return (
    <Chart.Svg height={460} ariaLabel="FY 2023 EBITDA bridge">
      <Chart.Title
        title="FY 2023 EBITDA Bridge — Core & Incremental Drivers"
        subtitle="P&L bridge in $M · bars split into core (darker) and incremental (lighter) drivers"
      />
      <Chart.Waterfall
        data={waterfallEbitda}
        categoryXField="name"
        totalField="isTotal"
        cornerRadius={4}
        valueLabelFormat={fmt}
        layersField={(r) => {
          const row = r as { core: number; incr: number; isTotal?: boolean };
          return [
          { name: "Core", value: row.core, color: row.isTotal ? "#818cf8" : row.core >= 0 ? "#059669" : "#dc2626" },
          { name: "Incremental", value: row.incr, color: row.isTotal ? "#a5b4fc" : row.core >= 0 ? "#34d399" : "#f87171" },
          ];
        }}
        valueYField="core"
      />
      <Chart.ReferenceLine y={0} label="Break-even" color="#94a3b8" />
      <Chart.XAxis />
      <Chart.YAxis />
      <Chart.Tooltip
        rows={(item) => {
          const row = waterfallEbitda[item.index ?? 0];
          const total = row.core + row.incr;
          return [
            { label: "Core", value: `$${row.core}M` },
            { label: "Incremental", value: `$${row.incr}M` },
            { label: "Total", value: `${total > 0 ? "+" : ""}$${total}M` },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default WaterfallEbitda;
