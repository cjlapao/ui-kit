import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ChartPlayground } from "./ChartPlayground";
import BarModes from "./examples/BarModes";
import barModesCode from "./examples/BarModes.tsx?raw";

export const BarChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Bar"
      description="Bar/column series in grouped, stacked and percent modes over one data set — the mode is a single prop. Corner radii follow the shared surface scale, and segment gaps separate stacked pieces."
    />
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Playground
      </h2>
      <ChartPlayground fixedKind="bar" />
    </section>
    <ExampleCard
      title="Bar modes"
      description="Grouped, stacked and percent bars over one quarterly P&L — the mode is a single prop."
      code={barModesCode}
      filename="BarModes.tsx"
    >
      <BarModes />
    </ExampleCard>
  </div>
);

export default BarChartPage;
