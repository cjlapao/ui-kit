import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { StatusSpinnerPlayground } from "./StatusSpinnerPlayground";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import OnGlass from "./examples/OnGlass";
import onGlassCode from "./examples/OnGlass.tsx?raw";

export const StatusSpinnerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Status Spinner"
      description="A spinner with a glowing centre dot for async states. The ring rides the shared control scale, so it lines up with the Spinner or Button beside it; the tone is any of the 21 true colours, and the label is announced once, in the surface's own copy colour."
    />
    <StatusSpinnerPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Size ladder"
        description="The shared control scale — from a 16 px hairline ring to a 40 px one."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Async states"
        description="Working and idle share a tone; terminal states pick their own. Finished work stops spinning."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="All 21 true colours, each with its own centre dot and glow."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
      <ExampleCard
        title="On glass"
        description="The label takes its colour from the surface it sits on; the unlabelled ring announces “Loading”."
        code={onGlassCode}
        filename="OnGlass.tsx"
      >
        <OnGlass />
      </ExampleCard>
    </section>
  </div>
);

export default StatusSpinnerPage;
