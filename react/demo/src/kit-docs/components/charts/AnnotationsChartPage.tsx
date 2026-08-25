import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import Annotations from "./examples/Annotations";
import annotationsCode from "./examples/Annotations.tsx?raw";

export const AnnotationsChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Reference & Callouts"
      description="Cross-cutting chart chrome that works on any cartesian type: reference bands for phase windows, dashed reference lines with labels, milestone labels and annotation callouts with leader lines."
    />
    <ExampleCard
      title="Annotations"
      description="Reference bands, dashed rules and annotation callouts with leader lines."
      code={annotationsCode}
      filename="Annotations.tsx"
    >
      <Annotations />
    </ExampleCard>
  </div>
);

export default AnnotationsChartPage;
