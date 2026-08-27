import { Chart } from "@cjlapao/ui-kit";
import { heatCohort, heatCohortRows, heatCohortCols } from "../data";

/**
 * SaaS cohort retention — 11 monthly cohorts × M0–M11, triangular
 * (newer cohorts have shorter histories, so the lower-left is null).
 * Three-stop red → yellow → teal scale, and a red annotation pill
 * calling out the M0 → M1 activation cliff on the newest cohort.
 */
export function HeatmapCohort() {
  return (
    <Chart.Svg height={560} ariaLabel="Cohort retention">
      <Chart.Title
        title="Cohort retention"
        subtitle="Monthly sign-up cohorts tracked through M11. Retention drops hardest in the first month after activation."
      />
      <Chart.Heatmap
        data={heatCohort}
        rows={heatCohortRows}
        cols={heatCohortCols}
        colorStops={["#fca5a5", "#fde047", "#2dd4bf"]}
        domain={[0, 100]}
        valueLabels
        valueLabelFormat={(v) => `${v}%`}
        cellGap={2}
        cornerRadius={2}
        legendTicks={3}
        rowLabelWidth={92}
        annotations={[
          {
            row: "Nov 2024",
            col: "M1",
            label: "Activation cliff: M0 → M1",
            tone: "red",
          },
        ]}
      />
      <Chart.Tooltip
        rows={(item) => {
          const cell = item.item as { row: string; col: string; value: number };
          const prev =
            cell.col === "M1"
              ? 100
              : (() => {
                  const j = parseInt(cell.col.slice(1), 10);
                  const v = heatCohort.find(
                    (c) => c.row === cell.row && c.col === `M${j - 1}`,
                  )?.value;
                  return v ?? 100;
                })();
          const delta = cell.value - prev;
          return [
            { label: "Cohort", value: cell.row },
            { label: `Retention ${cell.col}`, value: `${cell.value}%` },
            {
              label: "MoM",
              value: `${delta >= 0 ? "+" : ""}${delta}pp`,
              color: delta >= 0 ? "#10b981" : "#ef4444",
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default HeatmapCohort;
