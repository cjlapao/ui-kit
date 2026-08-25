import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ChartPlayground } from "./ChartPlayground";
import PieDonut from "./examples/PieDonut";
import pieDonutCode from "./examples/PieDonut.tsx?raw";

export const PieChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Pie & Donut"
      description="Pie, donut and gauge sweeps with slice gaps, rounded segments, in-slice percent labels, hover pop-out and a center display for the donut."
    />
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Playground
      </h2>
      <ChartPlayground fixedKind="pie" />
    </section>
    <ExampleCard
      title="Pie & donut"
      description="A donut with percent data labels beside a flat pie with a vertical legend."
      code={pieDonutCode}
      filename="PieDonut.tsx"
    >
      <PieDonut />
    </ExampleCard>
  </div>
);

export default PieChartPage;
