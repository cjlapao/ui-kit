import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { AccordionPlayground } from "./AccordionPlayground";
import CloudRegions from "./examples/CloudRegions";
import cloudRegionsCode from "./examples/CloudRegions.tsx?raw";
import Faq from "./examples/Faq";
import faqCode from "./examples/Faq.tsx?raw";
import GlassSettings from "./examples/GlassSettings";
import glassSettingsCode from "./examples/GlassSettings.tsx?raw";

export const AccordionPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Accordion"
      description="A stacked disclosure list built on Panel — every container surface, tone, corner and padding, on the shared control size. Independent ids per instance, inert collapsed content, arrow-key navigation and per-row loaders."
    />
    <AccordionPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Cloud regions"
        description="Dense rows with icons, badges and a per-row refresh action. The action's click never toggles the row, and the row shows its own loader while it refreshes."
        code={cloudRegionsCode}
        filename="CloudRegions.tsx"
      >
        <CloudRegions />
      </ExampleCard>
      <ExampleCard
        title="Faq"
        description="Plain rows in the outlined surface — one open by default, the rest collapsed and inert."
        code={faqCode}
        filename="Faq.tsx"
      >
        <Faq />
      </ExampleCard>
      <ExampleCard
        title="Glass settings"
        description="A glass accordion over a busy backdrop: the surface tints with the tone and the copy keeps its contrast from the surface's text tokens."
        code={glassSettingsCode}
        filename="GlassSettings.tsx"
      >
        <GlassSettings />
      </ExampleCard>
    </section>
  </div>
);

export default AccordionPage;
