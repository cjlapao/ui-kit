import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ProgressPlayground } from "./ProgressPlayground";
import EveryMotion from "./examples/EveryMotion";
import everyMotionCode from "./examples/EveryMotion.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import Indeterminate from "./examples/Indeterminate";
import indeterminateCode from "./examples/Indeterminate.tsx?raw";
import CustomRange from "./examples/CustomRange";
import customRangeCode from "./examples/CustomRange.tsx?raw";

export const ProgressPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Progress"
      description="A determinate or indeterminate progress bar. Size and tone come from the shared scales; the motion overlays are driven by classes so a reduced-motion preference can switch them off."
    />
    <ProgressPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Every motion"
        description="All six overlays — none, shimmer, pulse, shimmer-pulse, stripes and stripes-shimmer — at the same value."
        code={everyMotionCode}
        filename="EveryMotion.tsx"
      >
        <EveryMotion />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared control scale — the track runs from a hairline to a chunky bar."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Indeterminate"
        description="Extent unknown, so the bar sweeps and no percentage is shown — and no aria-valuenow is published."
        code={indeterminateCode}
        filename="Indeterminate.tsx"
      >
        <Indeterminate />
      </ExampleCard>
      <ExampleCard
        title="Custom range"
        description="An arbitrary min–max with its own units, formatted for the label and for aria-valuetext."
        code={customRangeCode}
        filename="CustomRange.tsx"
      >
        <CustomRange />
      </ExampleCard>
    </section>
  </div>
);

export default ProgressPage;
