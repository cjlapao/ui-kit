import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { MultiSelectPillsPlayground } from "./MultiSelectPillsPlayground";
import ResourceFilter from "./examples/ResourceFilter";
import resourceFilterCode from "./examples/ResourceFilter.tsx?raw";
import SingleChoice from "./examples/SingleChoice";
import singleChoiceCode from "./examples/SingleChoice.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import UncontrolledAndGlass from "./examples/UncontrolledAndGlass";
import uncontrolledAndGlassCode from "./examples/UncontrolledAndGlass.tsx?raw";

export const MultiSelectPillsPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Multi Select Pills"
      description="A row of pills used as a checkbox or radio group. It renders the kit's Pill, so it inherits every variant, tone, size and corner — including the glass pair."
    />
    <MultiSelectPillsPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Resource filter"
        description="The canonical case: a multi-select of what to include, with icons and counts, and a live readout of what a form submit would carry."
        code={resourceFilterCode}
        filename="ResourceFilter.tsx"
      >
        <ResourceFilter />
      </ExampleCard>
      <ExampleCard
        title="Single choice"
        description="Single mode behaves like a radio group — picking another swaps the selection, and a check mark keeps the state out of colour alone."
        code={singleChoiceCode}
        filename="SingleChoice.tsx"
      >
        <SingleChoice />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="A required single choice that can't be emptied, and a whole group disabled with one option disabled per-option."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Uncontrolled and glass"
        description="An uncontrolled group that keeps its own state, and the glass variants sitting on a glass panel."
        code={uncontrolledAndGlassCode}
        filename="UncontrolledAndGlass.tsx"
      >
        <UncontrolledAndGlass />
      </ExampleCard>
    </section>
  </div>
);

export default MultiSelectPillsPage;
