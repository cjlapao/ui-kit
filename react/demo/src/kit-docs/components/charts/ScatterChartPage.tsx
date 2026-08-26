import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ChartPlayground } from "./ChartPlayground";
import ScatterRiskPortfolio from "./examples/ScatterRiskPortfolio";
import ScatterMoore from "./examples/ScatterMoore";
import ScatterRoi from "./examples/ScatterRoi";
import ScatterTech from "./examples/ScatterTech";
import scatterRiskCode from "./examples/ScatterRiskPortfolio.tsx?raw";
import scatterMooreCode from "./examples/ScatterMoore.tsx?raw";
import scatterRoiCode from "./examples/ScatterRoi.tsx?raw";
import scatterTechCode from "./examples/ScatterTech.tsx?raw";

export const ScatterChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Scatter & Bubble"
      description="One marker per datum on shared x/y scales — linear, log or time. A size field turns dots into area-proportional bubbles, markers take any shape, and the hovered point grows, brightens and can restyle its fill and border while the other series dim. Axes accept a `log` scale for power-law data, and reference lines can span two data points for sloped rules (ROI diagonals, trend lines)."
    />
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Playground
      </h2>
      <ChartPlayground fixedKind="scatter" />
    </section>
    <ExampleCard
      title="Revenue risk portfolio"
      description="Adoption depth vs renewal pressure: bubble area carries ARR, shaded bands and dashed rules segment the playbooks, and annotation callouts name the two lanes worth acting on."
      code={scatterRiskCode}
      filename="ScatterRiskPortfolio.tsx"
    >
      <ScatterRiskPortfolio />
    </ExampleCard>
    <ExampleCard
      title="Moore's Law — transistor count, 1971–2024"
      description="A log y-axis flattens the 2×-per-2-years trend into a straight line. The dashed diagonal is a two-point reference line, and the callouts mark the 1M / 1B barrier chips and the latest silicon."
      code={scatterMooreCode}
      filename="ScatterMoore.tsx"
    >
      <ScatterMoore />
    </ExampleCard>
    <ExampleCard
      title="Blockbuster ROI — budget vs gross"
      description="Log-log axes collapse constant-ROI films into straight parallels, so the 5× and 10× reference lines read as a grid of performance. Bubble size is the franchise footprint."
      code={scatterRoiCode}
      filename="ScatterRoi.tsx"
    >
      <ScatterRoi />
    </ExampleCard>
    <ExampleCard
      title="US tech profitability by sub-industry"
      description="Revenue against net margin for four sub-industries. The teal band shades the high-margin zone and the dashed rule is the 19.4 % industry average; negative-margin players sit below the zero line."
      code={scatterTechCode}
      filename="ScatterTech.tsx"
    >
      <ScatterTech />
    </ExampleCard>
  </div>
);

export default ScatterChartPage;
