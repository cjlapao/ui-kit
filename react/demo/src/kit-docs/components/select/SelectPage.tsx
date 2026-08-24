import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { SelectPlayground } from "./SelectPlayground";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const SelectPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Select"
      description="The native dropdown, with the platform caret replaced by the kit's. Surface, size and tone come from the shared scales, so it lines up with the Input and SearchBar beside it."
    />
    <SelectPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Every variant"
        description="All six surfaces at the same size, so a Select lines up with the Input and SearchBar beside it."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared control scale — xs to xl — the same steps Input and SearchBar run on."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="Focus one to see its border and ring; the tone tokens are generated from the palette, not hand-written."
        code={tonesCode}
        filename="Tones.tsx"
      >
        <Tones />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="Validation, disabled, a leading icon, a hidden caret and multiple selection."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
    </section>
  </div>
);

export default SelectPage;
