import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ChartPlayground } from "./ChartPlayground";
import TreemapContinents from "./examples/TreemapContinents";
import TreemapRegions from "./examples/TreemapRegions";
import TreemapStocks from "./examples/TreemapStocks";
import TreemapTeams from "./examples/TreemapTeams";
import continentsCode from "./examples/TreemapContinents.tsx?raw";
import regionsCode from "./examples/TreemapRegions.tsx?raw";
import stocksCode from "./examples/TreemapStocks.tsx?raw";
import teamsCode from "./examples/TreemapTeams.tsx?raw";

export const TreemapChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Treemap"
      description="A self-contained grid of squarified tiles — area is proportional to value, no cartesian scales. Uniform or palette fills, stock-style corner tiles with delta pills, and grouped regions with uppercase headers."
    />
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Playground
      </h2>
      <ChartPlayground fixedKind="treemap" />
    </section>
    <ExampleCard
      title="Continent land area"
      description="The classic flat treemap: one squarified tile per category on a uniform color, largest value top-left."
      code={continentsCode}
      filename="TreemapContinents.tsx"
    >
      <TreemapContinents />
    </ExampleCard>
    <ExampleCard
      title="Palette colors"
      description="Same data, one hue per tile from the series palette — drop `color` and every category stays distinct."
      code={regionsCode}
      filename="TreemapRegions.tsx"
    >
      <TreemapRegions />
    </ExampleCard>
    <ExampleCard
      title="Big-cap market cap"
      description="Stock-tile layout: title top-left, ▲/▼ day-move pill, and the corner value — `deltaField` + `valueLabels`."
      code={stocksCode}
      filename="TreemapStocks.tsx"
    >
      <TreemapStocks />
    </ExampleCard>
    <ExampleCard
      title="Headcount by department"
      description="`groupField` clusters tiles into regions with uppercase headers; hovering a header shows the group total."
      code={teamsCode}
      filename="TreemapTeams.tsx"
    >
      <TreemapTeams />
    </ExampleCard>
  </div>
);

export default TreemapChartPage;
