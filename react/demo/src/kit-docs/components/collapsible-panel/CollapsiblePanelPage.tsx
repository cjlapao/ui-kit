import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { CollapsiblePanelPlayground } from "./CollapsiblePanelPlayground";
import DeploymentLogs from "./examples/DeploymentLogs";
import deploymentLogsCode from "./examples/DeploymentLogs.tsx?raw";
import BuildConfiguration from "./examples/BuildConfiguration";
import buildConfigurationCode from "./examples/BuildConfiguration.tsx?raw";
import Accordion from "./examples/Accordion";
import accordionCode from "./examples/Accordion.tsx?raw";

export const CollapsiblePanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Collapsible Panel"
      description="Accordion-style panel built on Panel, so it takes every container surface, tone, corner and padding. Controlled or uncontrolled, with a header action, a scrollable content cap and independent ids per panel."
    />
    <CollapsiblePanelPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Deployment logs"
        description="An open panel with a subtitle and a header action. The log output exceeds `contentMaxHeight`, so the body scrolls instead of growing."
        code={deploymentLogsCode}
        filename="DeploymentLogs.tsx"
      >
        <DeploymentLogs />
      </ExampleCard>
      <ExampleCard
        title="Build configuration"
        description="Uncontrolled and collapsed: `defaultExpanded` sets the starting state, and each panel keeps its own ids, so several can coexist."
        code={buildConfigurationCode}
        filename="BuildConfiguration.tsx"
      >
        <BuildConfiguration />
      </ExampleCard>
      <ExampleCard
        title="Accordion"
        description="Three uncontrolled panels stacked — each toggles independently, and their header ids stay distinct."
        code={accordionCode}
        filename="Accordion.tsx"
      >
        <Accordion />
      </ExampleCard>
    </section>
  </div>
);

export default CollapsiblePanelPage;
