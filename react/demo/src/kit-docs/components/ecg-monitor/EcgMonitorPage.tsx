import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { EcgMonitorPlayground } from "./EcgMonitorPlayground";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import FullWidthGrid from "./examples/FullWidthGrid";
import fullWidthGridCode from "./examples/FullWidthGrid.tsx?raw";
import CustomLine from "./examples/CustomLine";
import customLineCode from "./examples/CustomLine.tsx?raw";

export const EcgMonitorPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="ECG Monitor"
      description="A canvas ECG trace for service health — a steady rhythm when healthy, a jittered one when degraded, a flatline when down. The trace redraws every animation frame and falls back to a static frame under prefers-reduced-motion."
    />
    <EcgMonitorPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="States"
        description="The three health states side by side — one trace generator, three rhythms and colours."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Full width with grid"
        description="useFullWidth stretches the trace to its container; showGrid adds the ECG-paper lines behind it."
        code={fullWidthGridCode}
        filename="FullWidthGrid.tsx"
      >
        <FullWidthGrid />
      </ExampleCard>
      <ExampleCard
        title="Custom line"
        description="Override the state colour with lineColor and push the glow and stroke weight for a bolder readout."
        code={customLineCode}
        filename="CustomLine.tsx"
      >
        <CustomLine />
      </ExampleCard>
    </section>
  </div>
);

export default EcgMonitorPage;
