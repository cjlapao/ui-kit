import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { StatTilePlayground } from "./StatTilePlayground";
import Family from "./examples/Family";
import familyCode from "./examples/Family.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const StatTilePage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Stat Tiles"
      description="The metric-tile family, all built on StatCard. Every tile inherits StatCardProps in full — variant, tone, size, padding, corner, decoration, label and value tone and scale, progress, loader, trend, meta, footer — and adds one thing of its own: a breakdown, rings, a donut, a chart, an ECG trace. Pick the variant in the playground; the controls below it are the base card's, shared with that page."
    />
    <StatTilePlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="The family" description="Six variants under one set of base props. They share StatCard's surface, header, trend and states, so a dashboard mixing them stays consistent." code={familyCode} filename="Family.tsx"><Family /></ExampleCard>
      <ExampleCard title="Loading, error and progress" description="All three come from the base card, so they behave identically on a tile whose body is a chart. The retry is a real Button and the bar a real Progress with an accessible name — previously a hardcoded-blue anchor-like button and two roleless divs." code={statesCode} filename="States.tsx"><States /></ExampleCard>
    </section>
  </div>
);

export default StatTilePage;
