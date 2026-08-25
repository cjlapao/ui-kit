import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ChartPlayground } from "./ChartPlayground";
import Radar from "./examples/Radar";
import radarCode from "./examples/Radar.tsx?raw";

export const RadarChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Radar"
      description="A spider chart: one polygon per series on a shared set of axes, with polygon grid rings, vertex markers, dashed outlines, and a per-axis goal marker. Fills reuse the shared fill system — flat, or a radial gradient fading to the center."
    />
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Playground
      </h2>
      <ChartPlayground fixedKind="radar" />
    </section>
    <ExampleCard
      title="Enterprise readiness gaps"
      description="Launch build, target bar, and buyer benchmark expose the gates that still block enterprise rollout — three polygons, a dashed target, unit-labeled rings, and a launch-ready goal marker."
      code={radarCode}
      filename="Radar.tsx"
    >
      <Radar />
    </ExampleCard>
  </div>
);

export default RadarChartPage;
