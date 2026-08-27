import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { TagPickerPlayground } from "./TagPickerPlayground";
import Create from "./examples/Create";
import createCode from "./examples/Create.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const TagPickerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Tag Picker"
      description="A multi-select that renders its selection as removable pills, with optional free-text creation. Arrow keys and Enter drive the list; Backspace on an empty query removes the last tag."
    />
    <TagPickerPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Variants" description="Every InputVariant the other fields offer. The trigger painted a hardcoded white box before, so none of these were reachable." code={variantsCode} filename="Variants.tsx"><Variants /></ExampleCard>
      <ExampleCard title="Loading, disabled, read-only and error" description="Loading disables the trigger as well as showing the spinner — there is nothing to pick yet. Read-only dims rather than repainting the surface, which used to turn a glass trigger into a grey slab." code={statesCode} filename="States.tsx"><States /></ExampleCard>
      <ExampleCard title="Creating values" description="A query matching nothing offers a create row, and values added this session are flagged so the user can see what they just did." code={createCode} filename="Create.tsx"><Create /></ExampleCard>
    </section>
  </div>
);

export default TagPickerPage;
