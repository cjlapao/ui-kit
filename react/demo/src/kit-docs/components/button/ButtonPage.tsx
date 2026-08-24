import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ButtonPlayground } from "./ButtonPlayground";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import Icons from "./examples/Icons";
import iconsCode from "./examples/Icons.tsx?raw";
import AllTones from "./examples/AllTones";
import allTonesCode from "./examples/AllTones.tsx?raw";
import Active from "./examples/Active";
import activeCode from "./examples/Active.tsx?raw";

export const ButtonPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Button"
      description="The primary action control. Eight variants, five sizes, four label weights and every true color — plus loading, disabled and icon states, all on one component."
    />
    <ButtonPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Variants"
        description="From the loudest solid primary to a nearly invisible clear button."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="The shared control scale, from xs for dense toolbars up to xl for empty states."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="Loading keeps the spinner bright while blocking input; disabled dims the label and the control."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Icons"
        description="Leading and trailing icons from the registry by name, and the icon-only variant for compact toolbars."
        code={iconsCode}
        filename="Icons.tsx"
      >
        <Icons />
      </ExampleCard>
      <ExampleCard
        title="All tones"
        description="Every one of the 21 true colours as a solid button, fixed size."
        code={allTonesCode}
        filename="AllTones.tsx"
      >
        <AllTones />
      </ExampleCard>
      <ExampleCard
        title="Pressed"
        description="The active prop is the persistent “on” state — a toggle that stays lit, distinct from the hover and focus styles."
        code={activeCode}
        filename="Active.tsx"
      >
        <Active />
      </ExampleCard>
    </section>
  </div>
);

export default ButtonPage;
