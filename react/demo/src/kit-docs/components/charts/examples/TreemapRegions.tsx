import { Chart } from "@cjlapao/ui-kit";
import { treemapContinents } from "../data";

/**
 * Palette treemap — the same data with one hue per tile from the series
 * palette (no `color` prop), so each category stays visually distinct.
 */
export function TreemapRegions() {
  return (
    <Chart.Svg height={440} ariaLabel="Continent treemap with palette">
      <Chart.Title
        title="Continent land area, palette colors"
        subtitle="Drop the uniform color and each tile takes its hue from the series palette, in data order."
      />
      <Chart.Treemap data={treemapContinents} gap={2} />
      <Chart.Tooltip
        rows={(item) => {
          const t = item.item as { name: string; value: number };
          const total = treemapContinents.reduce((a, b) => a + b.value, 0);
          return [
            { label: "Continent", value: t.name },
            {
              label: "Share",
              value: `${((t.value / total) * 100).toFixed(1)}%`,
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default TreemapRegions;
