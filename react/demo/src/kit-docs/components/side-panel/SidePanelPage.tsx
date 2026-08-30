import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { SidePanelPlayground } from "./SidePanelPlayground";
import Sides from "./examples/Sides";
import sidesCode from "./examples/Sides.tsx?raw";
import Floating from "./examples/Floating";
import floatingCode from "./examples/Floating.tsx?raw";

export const SidePanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Side Panel"
      description="A panel docked to either edge of its container. It overlays rather than occupying a column, so opening it never reflows the content beside it, and it can be drag-resized. Takes SideMenu's surface family — a docked panel and a docked menu are the same object — plus the kit's tone and size scales."
    />
    <SidePanelPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Either edge"
        description="side='right' or 'left'. It is absolutely positioned, so it fills the container it is placed in and needs a positioned ancestor."
        code={sidesCode}
        filename="Sides.tsx"
      >
        <Sides />
      </ExampleCard>
      <ExampleCard
        title="Floating and inset"
        description="floating and floating-glass lift the panel off the top and bottom while it stays flush to its edge, rounding only the two corners that face the content. The inset prop sets that on any variant; radius sizes the corners."
        code={floatingCode}
        filename="Floating.tsx"
      >
        <Floating />
      </ExampleCard>
    </section>
  </div>
);

export default SidePanelPage;
