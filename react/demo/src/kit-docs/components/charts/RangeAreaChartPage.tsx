import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ChartPlayground } from "./ChartPlayground";
import RangeArea from "./examples/RangeArea";
import rangeAreaCode from "./examples/RangeArea.tsx?raw";

export const RangeAreaChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Range Area"
      description="A band between a lower (min) and an upper (max) curve, both smoothed independently — the classic min–max corridor. Fills use the shared area-fill system: a flat color at an opacity, or a gradient fading to transparent."
    />
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Playground
      </h2>
      <ChartPlayground fixedKind="range" />
    </section>
    <ExampleCard
      title="Checkout response corridor"
      description="A min–max latency envelope tracks launch traffic, forecast drift, and the p95 guardrail in one continuous view — bands, guardrail rule, risk zones, callouts and a derived volatility row in the tooltip."
      code={rangeAreaCode}
      filename="RangeArea.tsx"
    >
      <RangeArea />
    </ExampleCard>
  </div>
);

export default RangeAreaChartPage;
