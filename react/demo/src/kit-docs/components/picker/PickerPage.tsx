import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PickerPlayground } from "./PickerPlayground";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const PickerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Picker"
      description="A searchable single- or multi-select over rich rows — icon, title, subtitle, description and pills. The list is portaled and flips above the trigger when there is no room below."
    />
    <PickerPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Variants" description="Every InputVariant the other fields offer. The trigger painted a hardcoded white box before, so none of these were reachable." code={variantsCode} filename="Variants.tsx"><Variants /></ExampleCard>
      <ExampleCard title="Loading, disabled and error" description="All three come from the shared field system, so a Picker and an Input agree on them. The loading row's chevron now sits at the trailing edge — it used to sit against the word Loading." code={statesCode} filename="States.tsx"><States /></ExampleCard>
      <ExampleCard title="Tones" description="Generated from the palette. The literal map this replaced spelled red as rose and green as emerald — and since those literals were also what Tailwind scanned, the correct classes had never been emitted." code={tonesCode} filename="Tones.tsx"><Tones /></ExampleCard>
    </section>
  </div>
);

export default PickerPage;
