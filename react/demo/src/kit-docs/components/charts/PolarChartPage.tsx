import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ChartPlayground } from "./ChartPlayground";
import PolarStacked from "./examples/PolarStacked";
import PolarGrouped from "./examples/PolarGrouped";
import polarStackedCode from "./examples/PolarStacked.tsx?raw";
import polarGroupedCode from "./examples/PolarGrouped.tsx?raw";

export const PolarChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Polar"
      description="A rose / nightingale chart: one annular segment per category per series, fanned out from the center. Segments can sit side-by-side (grouped) or stack radially (stacked) on a shared total scale, with circular or polygonal grid rings, rounded segment corners, and a center readout."
    />
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Playground
      </h2>
      <ChartPlayground fixedKind="polar" />
    </section>
    <ExampleCard
      title="AI workflow adoption map"
      description="Twelve product-workflow sectors stacked radially by how much of the work a person did — the center callout surfaces the 59 % autonomous share while the perimeter labels name every sector."
      code={polarStackedCode}
      filename="PolarStacked.tsx"
    >
      <PolarStacked />
    </ExampleCard>
    <ExampleCard
      title="Monaco Grand Prix — sector performance by team"
      description="Eight sectors with three teams side-by-side: rounded segment corners, a dashed polygon grid, second-formatted ticks, and a GP-branded center."
      code={polarGroupedCode}
      filename="PolarGrouped.tsx"
    >
      <PolarGrouped />
    </ExampleCard>
  </div>
);

export default PolarChartPage;
