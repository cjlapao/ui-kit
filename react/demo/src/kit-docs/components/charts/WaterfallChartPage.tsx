import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ChartPlayground } from "./ChartPlayground";
import WaterfallEu from "./examples/WaterfallEu";
import WaterfallCarbon from "./examples/WaterfallCarbon";
import WaterfallEbitda from "./examples/WaterfallEbitda";
import WaterfallArr from "./examples/WaterfallArr";
import euCode from "./examples/WaterfallEu.tsx?raw";
import carbonCode from "./examples/WaterfallCarbon.tsx?raw";
import ebitdaCode from "./examples/WaterfallEbitda.tsx?raw";
import arrCode from "./examples/WaterfallArr.tsx?raw";

export const WaterfallChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Waterfall"
      description="Bridge analysis on the bar engine: delta steps that accumulate a running total, with total markers anchored at the baseline. Vertical or horizontal, signed data labels, dashed running-total connectors, stacked layers per step, and reference lines."
    />
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Playground
      </h2>
      <ChartPlayground fixedKind="waterfall" />
    </section>
    <ExampleCard
      title="EU-27 government revenue and spending"
      description="A classic bridge: the total-revenue marker anchors the spending steps and the closing deficit total sits below the baseline. Colors route by the kind field."
      code={euCode}
      filename="WaterfallEu.tsx"
    >
      <WaterfallEu />
    </ExampleCard>
    <ExampleCard
      title="Global carbon budget 2022"
      description="Horizontal orientation: fossil sources accumulate to the gross total, the sinks float down from it, and a dashed reference line marks the 1.5°C budget."
      code={carbonCode}
      filename="WaterfallCarbon.tsx"
    >
      <WaterfallCarbon />
    </ExampleCard>
    <ExampleCard
      title="FY 2023 EBITDA bridge"
      description="Stacked waterfall: each step carries a core and an incremental layer; the running total accumulates the combined values. Break-even reference line at zero."
      code={ebitdaCode}
      filename="WaterfallEbitda.tsx"
    >
      <WaterfallEbitda />
    </ExampleCard>
    <ExampleCard
      title="ARR bridge by driver"
      description="Floating steps with dashed running-total connectors, Open/Closing ARR totals, and dashed reference lines at the Open and Close levels."
      code={arrCode}
      filename="WaterfallArr.tsx"
    >
      <WaterfallArr />
    </ExampleCard>
  </div>
);

export default WaterfallChartPage;
