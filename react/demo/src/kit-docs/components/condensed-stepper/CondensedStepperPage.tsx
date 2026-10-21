import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { CondensedStepperPlayground } from "./CondensedStepperPlayground";
import RunCards from "./examples/RunCards";
import runCardsCode from "./examples/RunCards.tsx?raw";

export const CondensedStepperPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="CondensedStepper"
      description="The stepper that fits on one line: the current step anchored in the middle, the walked steps compressed left, the queue compressed right — and each flank an accordion on ExpandableButton's spring table. Hover to peek, click to pin, Esc to close; the flanks are exclusive and the centre pill squishes to make room. The card and the panel are the same component — the container decides how much condenses, never the behaviour."
    />
    <CondensedStepperPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Run cards"
        description="Card size (size='sm'): three runs of the same component — idle-ready, gate-halted (the rose ring is the error status speaking, not a bespoke border), and a longer queue folded into +N."
        code={runCardsCode}
        filename="RunCards.tsx"
      >
        <RunCards />
      </ExampleCard>
    </section>
  </div>
);

export default CondensedStepperPage;
