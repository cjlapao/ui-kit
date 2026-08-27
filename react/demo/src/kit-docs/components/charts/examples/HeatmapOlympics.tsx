import { Chart } from "@cjlapao/ui-kit";
import {
  heatOlympics,
  heatOlympicsRows,
  heatOlympicsCols,
} from "../data";

/**
 * Olympic medal table — 10 sports × 10 nations, sequential
 * pale-yellow → orange scale. Sports/nation combos with no medals are
 * null cells (left dark) and skipped by the tooltip.
 */
export function HeatmapOlympics() {
  return (
    <Chart.Svg height={560} ariaLabel="Olympic medal table">
      <Chart.Title
        title="Olympic medal table"
        subtitle="Medals per sport and nation across the Games. Empty slots are combinations with no medals."
      />
      <Chart.Heatmap
        data={heatOlympics}
        rows={heatOlympicsRows}
        cols={heatOlympicsCols}
        colorStops={["#fef9c3", "#fde047", "#f97316"]}
        domain={[0, 18]}
        nullColor="rgba(100, 116, 139, 0.14)"
        valueLabels
        valueLabelFormat={(v) => String(v)}
        cellGap={3}
        cornerRadius={3}
        legendTicks={3}
        rowLabelWidth={90}
      />
      <Chart.Tooltip
        rows={(item) => {
          const cell = item.item as { row: string; col: string; value: number };
          return [
            { label: "Sport", value: cell.row },
            {
              label: "Medals",
              value: String(cell.value),
              color: "#f97316",
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default HeatmapOlympics;
