import { Chart } from "@cjlapao/ui-kit";
import { treemapContinents } from "../data";

/**
 * Basic treemap — one squarified tile per category on a uniform color,
 * centered labels. The largest values take the top-left; small remainders
 * shrink into thin slivers.
 */
export function TreemapContinents() {
  return (
    <Chart.Svg height={440} ariaLabel="Continent land area treemap">
      <Chart.Title
        title="Continent land area"
        subtitle="Squarified treemap of relative land mass — area is proportional to value, so Asia dwarfs Oceania."
      />
      <Chart.Treemap data={treemapContinents} color="#7dd3fc" gap={2} />
      <Chart.Tooltip
        rows={(item) => {
          const t = item.item as { name: string; value: number };
          const total = treemapContinents.reduce((a, b) => a + b.value, 0);
          return [
            { label: "Continent", value: t.name },
            {
              label: "Share",
              value: `${((t.value / total) * 100).toFixed(1)}%`,
              color: "#38bdf8",
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default TreemapContinents;
