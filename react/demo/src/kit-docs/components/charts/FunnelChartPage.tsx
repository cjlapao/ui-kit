import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ChartPlayground } from "./ChartPlayground";
import FunnelBasic from "./examples/FunnelBasic";
import FunnelMulti from "./examples/FunnelMulti";
import basicCode from "./examples/FunnelBasic.tsx?raw";
import multiCode from "./examples/FunnelMulti.tsx?raw";

export const FunnelChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Funnel"
      description="A self-contained conversion funnel — up to 6 stages, width proportional to value. Bright trapezoids with darker auto-derived connectors and a bottom arrow, values inside, conversion % between stages, stage names on dotted leaders."
    />
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Playground
      </h2>
      <ChartPlayground fixedKind="funnel" />
    </section>
    <ExampleCard
      title="Performance funnel"
      description="Per-stage colors with conversion rates between stages; the small tail stages hit the min-width clamp so labels stay legible."
      code={multiCode}
      filename="FunnelMulti.tsx"
    >
      <FunnelMulti />
    </ExampleCard>
    <ExampleCard
      title="Single color"
      description="One `color` prop paints every stage — the connectors and arrow are derived darker versions of it."
      code={basicCode}
      filename="FunnelBasic.tsx"
    >
      <FunnelBasic />
    </ExampleCard>
  </div>
);

export default FunnelChartPage;
