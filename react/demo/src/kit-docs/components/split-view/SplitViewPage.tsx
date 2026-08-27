import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { SplitViewPlayground } from "./SplitViewPlayground";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import SubItems from "./examples/SubItems";
import subItemsCode from "./examples/SubItems.tsx?raw";
import Loaders from "./examples/Loaders";
import loadersCode from "./examples/Loaders.tsx?raw";

export const SplitViewPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Split View"
      description="A searchable list beside a detail pane, optionally collapsible and drag-resizable. It takes the same surface family as Panel, the built-in search follows that surface, and rows can carry sub-items that expand in place. With a single visible item it drops the list entirely and shows the detail alone."
    />
    <SplitViewPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Variants" description="The Panel surface family. The list pane is tinted translucently rather than filled, so it composites over the variant instead of replacing it — the detail pane used to be a bare bg-white with no dark-mode partner." code={variantsCode} filename="Variants.tsx"><Variants /></ExampleCard>
      <ExampleCard title="Sub-items and the new-item dot" description="subContent expands a row in place. With autoExpand=false a caret separates selecting from drilling in, and showHighlightIndicator={false} keeps a highlighted row's tint while dropping its pulsing dot." code={subItemsCode} filename="SubItems.tsx"><SubItems /></ExampleCard>
      <ExampleCard title="Loaders" description="The three treatments, skeleton by default — shaped like the two panes so the list keeps its width and the layout does not jump when the data lands." code={loadersCode} filename="Loaders.tsx"><Loaders /></ExampleCard>
      <ExampleCard title="Tones" description="Generated from the palette. The literal map aliased both neutral and stone to one object, so stone silently rendered neutral and border-l-stone-600 was never emitted." code={tonesCode} filename="Tones.tsx"><Tones /></ExampleCard>
    </section>
  </div>
);

export default SplitViewPage;
