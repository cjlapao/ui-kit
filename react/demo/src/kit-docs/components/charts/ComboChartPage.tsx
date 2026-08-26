import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ChartPlayground } from "./ChartPlayground";
import ComboRevenue from "./examples/ComboRevenue";
import ComboDualAxis from "./examples/ComboDualAxis";
import ComboOrders from "./examples/ComboOrders";
import ComboCloud from "./examples/ComboCloud";
import ComboRegression from "./examples/ComboRegression";
import ComboTargetActual from "./examples/ComboTargetActual";
import revenueCode from "./examples/ComboRevenue.tsx?raw";
import dualAxisCode from "./examples/ComboDualAxis.tsx?raw";
import ordersCode from "./examples/ComboOrders.tsx?raw";
import cloudCode from "./examples/ComboCloud.tsx?raw";
import regressionCode from "./examples/ComboRegression.tsx?raw";
import targetCode from "./examples/ComboTargetActual.tsx?raw";

export const ComboChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Combo"
      description="Mix bar, line and scatter series in one plot: shared or dual y-axes, stacked bars with a total line, moving averages, regression reference lines, and markers landing on the same band positions as line vertices. No special component — the cartesian series share the scales."
    />
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Playground
      </h2>
      <ChartPlayground fixedKind="combo" />
    </section>
    <ExampleCard
      title="Revenue vs budget"
      description="The simplest combo: bars with a dashed target line on the shared axis."
      code={revenueCode}
      filename="ComboRevenue.tsx"
    >
      <ComboRevenue />
    </ExampleCard>
    <ExampleCard
      title="Dual y-axes"
      description="Bars in TWh on the left axis with the temperature line on a second, formatted right axis."
      code={dualAxisCode}
      filename="ComboDualAxis.tsx"
    >
      <ComboDualAxis />
    </ExampleCard>
    <ExampleCard
      title="Orders with 3-month average"
      description="A trailing moving average over the bars with a soft area fill; hovering one series dims the other."
      code={ordersCode}
      filename="ComboOrders.tsx"
    >
      <ComboOrders />
    </ExampleCard>
    <ExampleCard
      title="Stacked bars with total line"
      description="Three stacked services per quarter with the quarterly total drawn as a line overlay."
      code={cloudCode}
      filename="ComboCloud.tsx"
    >
      <ComboCloud />
    </ExampleCard>
    <ExampleCard
      title="Scatter with regression line"
      description="Points on numeric axes with a dashed two-point reference line as the linear fit."
      code={regressionCode}
      filename="ComboRegression.tsx"
    >
      <ComboRegression />
    </ExampleCard>
    <ExampleCard
      title="Target line with actual markers"
      description="A target line and scatter markers on the same band months — markers land on the band centers, exactly on the line's vertices."
      code={targetCode}
      filename="ComboTargetActual.tsx"
    >
      <ComboTargetActual />
    </ExampleCard>
  </div>
);

export default ComboChartPage;
