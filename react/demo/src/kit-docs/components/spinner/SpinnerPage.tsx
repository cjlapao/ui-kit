import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { SpinnerPlayground } from "./SpinnerPlayground";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import VariantsAndThicknesses from "./examples/VariantsAndThicknesses";
import variantsAndThicknessesCode from "./examples/VariantsAndThicknesses.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import OnGlass from "./examples/OnGlass";
import onGlassCode from "./examples/OnGlass.tsx?raw";

export const SpinnerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Spinner"
      description="An indeterminate ring. Size comes from the shared control scale so it lines up with the Button beside it; the label is announced once and takes its copy colour from the surface it sits on."
    />
    <SpinnerPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Size ladder"
        description="The shared control scale — the ring runs from a 16 px hairline to a 40 px one."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Variants and thicknesses"
        description="Solid versus segments, each at the three border weights."
        code={variantsAndThicknessesCode}
        filename="VariantsAndThicknesses.tsx"
      >
        <VariantsAndThicknesses />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="All 21 true colours on the same sm ring."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
      <ExampleCard
        title="On glass"
        description="The label takes its colour from the surface it sits on; the second ring has no label, so it announces “Loading”."
        code={onGlassCode}
        filename="OnGlass.tsx"
      >
        <OnGlass />
      </ExampleCard>
    </section>
  </div>
);

export default SpinnerPage;
