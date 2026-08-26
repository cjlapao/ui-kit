import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ChartPlayground } from "./ChartPlayground";
import NightingaleTornado from "./examples/NightingaleTornado";
import NightingalePrecipitation from "./examples/NightingalePrecipitation";
import tornadoCode from "./examples/NightingaleTornado.tsx?raw";
import precipCode from "./examples/NightingalePrecipitation.tsx?raw";

export const NightingaleChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Nightingale"
      description="A rose where the angles are equal and the radii carry the value: the smallest slice ends at the hub, the largest reaches the outer ring. A mode of the pie — set nightingale on Chart.Pie and every pie feature (colors, gaps, corner, center, tooltip) carries over."
    />
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Playground
      </h2>
      <ChartPlayground fixedKind="nightingale" />
    </section>
    <ExampleCard
      title="US tornado climatology by month"
      description="Twelve equal 30° wedges whose depths map the 1991–2020 monthly averages — the Apr–Jun peak bulges to the outer ring while quiet months hug the hub. Outside labels name each month with its average count."
      code={tornadoCode}
      filename="NightingaleTornado.tsx"
    >
      <NightingaleTornado />
    </ExampleCard>
    <ExampleCard
      title="US average monthly precipitation"
      description="January anchored at 12 o'clock (startAngle −π/12), seasonal hues across the year, and the annual average in the center. Each petal's depth is the month's inches."
      code={precipCode}
      filename="NightingalePrecipitation.tsx"
    >
      <NightingalePrecipitation />
    </ExampleCard>
  </div>
);

export default NightingaleChartPage;
