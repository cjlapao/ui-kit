import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ChartPlayground } from "./ChartPlayground";
import HeatmapCorrelation from "./examples/HeatmapCorrelation";
import HeatmapOlympics from "./examples/HeatmapOlympics";
import HeatmapCohort from "./examples/HeatmapCohort";
import HeatmapCommute from "./examples/HeatmapCommute";
import correlationCode from "./examples/HeatmapCorrelation.tsx?raw";
import olympicsCode from "./examples/HeatmapOlympics.tsx?raw";
import cohortCode from "./examples/HeatmapCohort.tsx?raw";
import commuteCode from "./examples/HeatmapCommute.tsx?raw";

export const HeatmapChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Heatmap"
      description="A self-contained grid of value-colored cells — no cartesian scales. Multi-stop color scales, null cells, value and tier labels, a gradient legend, and cell-anchored annotation pills."
    />
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Playground
      </h2>
      <ChartPlayground fixedKind="heatmap" />
    </section>
    <ExampleCard
      title="Sector correlation matrix"
      description="9×9 diverging matrix with per-cell value + strength tier (INDEP / WEAK / MOD / STRONG) and a 0–1 legend."
      code={correlationCode}
      filename="HeatmapCorrelation.tsx"
    >
      <HeatmapCorrelation />
    </ExampleCard>
    <ExampleCard
      title="Olympic medal table"
      description="10 sports × 10 nations on a sequential pale-yellow → orange scale; combinations without medals are null cells."
      code={olympicsCode}
      filename="HeatmapOlympics.tsx"
    >
      <HeatmapOlympics />
    </ExampleCard>
    <ExampleCard
      title="Cohort retention"
      description="11 cohorts × M0–M11 on a triangular null grid, red → yellow → teal, with a red annotation pill on the M0 → M1 activation cliff."
      code={cohortCode}
      filename="HeatmapCohort.tsx"
    >
      <HeatmapCohort />
    </ExampleCard>
    <ExampleCard
      title="Commute intensity"
      description="Weekday vs weekend hour-band intensity on a warm sequential scale — legend off, the grid tells the story."
      code={commuteCode}
      filename="HeatmapCommute.tsx"
    >
      <HeatmapCommute />
    </ExampleCard>
  </div>
);

export default HeatmapChartPage;
