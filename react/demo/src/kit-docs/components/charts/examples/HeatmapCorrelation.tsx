import { Chart } from "@cjlapao/ui-kit";
import { heatCorrelation, heatCorrelationRows } from "../data";

/**
 * S&P 500 sector correlation matrix — a 9×9 diverging matrix with a
 * value + strength-tier label in every cell (INDEP / WEAK / MOD /
 * STRONG) and a 0 / 0.5 / 1 legend.
 */
function tier(v: number): string | null {
  if (v >= 0.75) return "STRONG";
  if (v >= 0.6) return "MOD";
  if (v >= 0.45) return "WEAK";
  return "INDEP";
}

export function HeatmapCorrelation() {
  return (
    <Chart.Svg height={560} ariaLabel="Sector correlation matrix">
      <Chart.Title
        title="S&P 500 sector correlation"
        subtitle="Pairwise trailing-12-month return correlation across the nine GICS sectors. Diverging scale: pale = weak, deep blue/purple = strong."
      />
      <Chart.Heatmap
        data={heatCorrelation}
        rows={heatCorrelationRows}
        cols={heatCorrelationRows}
        colorStops={["#ffffff", "#67e8f9", "#3b82f6", "#7c3aed"]}
        domain={[0, 1]}
        valueLabels
        valueLabelFormat={(v) => v.toFixed(2)}
        tierLabel={(v) => (v === 1 ? "SELF" : tier(v))}
        cellGap={2}
        cornerRadius={2}
        legendTicks={3}
        rowLabelWidth={110}
      />
      <Chart.Tooltip
        rows={(item) => {
          const cell = item.item as { row: string; col: string; value: number };
          return [
            { label: "Sector pair", value: `${cell.row} × ${cell.col}` },
            {
              label: "Correlation",
              value: cell.value.toFixed(2),
              color: cell.value >= 0.6 ? "#10b981" : "#f59e0b",
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default HeatmapCorrelation;
