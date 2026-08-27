import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { MultiTogglePlayground } from "./MultiTogglePlayground";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";

export const MultiTogglePage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Multi Toggle"
      description="A segmented control — a radiogroup with a sliding indicator. The track takes the same eight surface variants as Panel, so it sits flush beside a card; the indicator is its own scale. Arrow keys, Home and End move the selection and skip disabled options."
    />
    <MultiTogglePlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Track variants and indicators" description="The track is a surface, so it takes the Panel family — each toggle here is paired with the Panel it matches. The indicator is separate: it is what the old `theme | solid | soft` variant was really describing." code={variantsCode} filename="Variants.tsx"><Variants /></ExampleCard>
      <ExampleCard title="Sizes" description="The full shared control scale. It used to declare its own `sm | md | lg`, so a toggle could not line up with the `xs` or `xl` Button beside it." code={sizesCode} filename="Sizes.tsx"><Sizes /></ExampleCard>
      <ExampleCard title="Tones" description="Generated from the theme. The 21-entry map this replaced had `green` painting emerald classes and `red` painting rose, so those two tones rendered as their neighbours." code={tonesCode} filename="Tones.tsx"><Tones /></ExampleCard>
    </section>
  </div>
);

export default MultiTogglePage;
