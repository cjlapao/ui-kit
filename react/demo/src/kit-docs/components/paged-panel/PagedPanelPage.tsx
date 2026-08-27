import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PagedPanelPlayground } from "./PagedPanelPlayground";
import Loading from "./examples/Loading";
import loadingCode from "./examples/Loading.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const PagedPanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Paged Panel"
      description="A Panel that shows one page at a time, with a centred header and nav either side. The title can be static or one per page; the position counter is announced politely, so paging is not a silent content swap."
    />
    <PagedPanelPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Loading" description="The kit's three treatments, skeleton by default. The skeleton is shaped like a page so the panel keeps its height, and the header stays put in every case — a paged panel that collapses to a bare spinner loses its nav and its position." code={loadingCode} filename="Loading.tsx"><Loading /></ExampleCard>
      <ExampleCard title="Empty and error" description="Both are real EmptyStates. They used to be bare paragraphs with no glyph and no structure." code={statesCode} filename="States.tsx"><States /></ExampleCard>
    </section>
  </div>
);

export default PagedPanelPage;
