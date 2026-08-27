import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { StepperPlayground } from "./StepperPlayground";
import Vertical from "./examples/Vertical";
import verticalCode from "./examples/Vertical.tsx?raw";
import Connectors from "./examples/Connectors";
import connectorsCode from "./examples/Connectors.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import Loaders from "./examples/Loaders";
import loadersCode from "./examples/Loaders.tsx?raw";

export const StepperPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Stepper"
      description="A multi-step workflow on the shared panel surface — clickable steps with a line or progress connector, the full tone set, per-step and whole-stepper loaders (including a skeleton), an optional progress bar, and both orientations."
    />
    <StepperPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Vertical"
        description="The same workflow stacked — each step carries its own copy beside the node rail."
        code={verticalCode}
        filename="Vertical.tsx"
      >
        <Vertical />
      </ExampleCard>
      <ExampleCard
        title="Connectors"
        description="progress fills edge-to-edge up to the active step; line is a static track with a gap around every node; none drops the line entirely."
        code={connectorsCode}
        filename="Connectors.tsx"
      >
        <Connectors />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="The full 21-colour tone set — the node fill, the completed connector and the active ring all track the tone."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
      <ExampleCard
        title="Loaders"
        description="spinner and progress overlay the content; skeleton replaces it with pulsing discs and lines."
        code={loadersCode}
        filename="Loaders.tsx"
      >
        <Loaders />
      </ExampleCard>
    </section>
  </div>
);

export default StepperPage;
