import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import LineReference from "./examples/LineReference";
import lineReferenceCode from "./examples/LineReference.tsx?raw";
import LineCurves from "./examples/LineCurves";
import lineCurvesCode from "./examples/LineCurves.tsx?raw";
import DualAxis from "./examples/DualAxis";
import dualAxisCode from "./examples/DualAxis.tsx?raw";

export const LineChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Line"
      description="Line series: linear, smooth and step interpolation, dashed/dotted styles, square markers, area fills with gradient and dual y-axes — all with entrance and update animations."
    />
    <ExampleCard
      title="Growth metrics"
      description="The reference chart: four indexed series, three phase windows, an indexed baseline, the pricing-lift crosshair, two callouts and end-of-series badges."
      code={lineReferenceCode}
      filename="LineReference.tsx"
    >
      <LineReference />
    </ExampleCard>
    <ExampleCard
      title="Curves, dashes & markers"
      description="Linear, smooth and step interpolation plus dashed/dotted styles and square markers."
      code={lineCurvesCode}
      filename="LineCurves.tsx"
    >
      <LineCurves />
    </ExampleCard>
    <ExampleCard
      title="Dual y-axes"
      description="The same data set on an index scale (left) and a dollar scale (right) — series opt in with yFieldAxis."
      code={dualAxisCode}
      filename="DualAxis.tsx"
    >
      <DualAxis />
    </ExampleCard>
  </div>
);

export default LineChartPage;
