import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { TagPanelPlayground } from "./TagPanelPlayground";
import Overflow from "./examples/Overflow";
import overflowCode from "./examples/Overflow.tsx?raw";

export const TagPanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Tag Panel"
      description="A titled group of pills with a collapse limit. The header's scale and the pills' scale are separate props — they used to share one, so a SectionSize reached a Pill that expects a PillSize."
    />
    <TagPanelPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Overflow and empty" description="The +N control is a real Button; it used to be a bare button wrapping a Pill, a nested interactive with no focus ring. The empty case is an EmptyState, not italic grey text." code={overflowCode} filename="Overflow.tsx"><Overflow /></ExampleCard>
    </section>
  </div>
);

export default TagPanelPage;
