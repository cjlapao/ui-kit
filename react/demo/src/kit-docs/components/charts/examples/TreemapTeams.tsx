import { Chart } from "@cjlapao/ui-kit";
import { treemapTeams } from "../data";

/**
 * Grouped treemap — `groupField` clusters tiles into one squarified
 * region per group (by group total), each with an uppercase header band.
 * Hovering a header shows the group total; hovering a tile shows the
 * team.
 */
export function TreemapTeams() {
  return (
    <Chart.Svg height={480} ariaLabel="Team headcount by department">
      <Chart.Title
        title="Headcount by department"
        subtitle="One region per department with an uppercase header; Engineering sums to 123 people."
      />
      <Chart.Treemap data={treemapTeams} groupField="group" gap={3} />
      <Chart.Tooltip
        rows={(item) => {
          const t = item.item as {
            group?: string;
            name: string;
            value: number;
          };
          if (!t) {
            // group header hit: item is null, the value is the group total
            return [
              { label: "Department", value: String(item.name ?? "") },
              {
                label: "Headcount",
                value: String(item.value ?? ""),
                color: "#38bdf8",
              },
            ];
          }
          const total = treemapTeams
            .filter((r) => r.group === t.group)
            .reduce((a, b) => a + b.value, 0);
          return [
            { label: "Team", value: t.name },
            { label: "Department", value: t.group ?? "" },
            {
              label: "Headcount",
              value: `${t.value} of ${total}`,
              color: "#38bdf8",
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default TreemapTeams;
