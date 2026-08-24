import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { CheckboxPlayground } from "./CheckboxPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import WithDescription from "./examples/WithDescription";
import withDescriptionCode from "./examples/WithDescription.tsx?raw";
import SelectAll from "./examples/SelectAll";
import selectAllCode from "./examples/SelectAll.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";

export const CheckboxPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Checkbox"
      description="A drawn checkbox — the box, tick and dash are the kit's own, so they follow the tone in both themes. The native input is still underneath, keeping focus, keyboard behaviour and form participation."
    />
    <CheckboxPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="A row of options, each an independent checkbox."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="With description"
        description="Explain the consequence of the choice right where the decision is made."
        code={withDescriptionCode}
        filename="WithDescription.tsx"
      >
        <WithDescription />
      </ExampleCard>
      <ExampleCard
        title="Select all"
        description="A tri-state parent driving its children — the indeterminate dash appears while some, but not all, are checked."
        code={selectAllCode}
        filename="SelectAll.tsx"
      >
        <SelectAll />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="Disabled rows keep their state visible; indeterminate marks a parent with mixed children."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared xs–xl scale — the box sits on the label's cap height at every step."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="All 21 true colours, checked and indeterminate — the tick must stay legible on the fill in both themes."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
    </section>
  </div>
);

export default CheckboxPage;
