import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { WorkflowTrackerPlayground } from "./WorkflowTrackerPlayground";
import VendorOnboarding from "./examples/VendorOnboarding";
import vendorOnboardingCode from "./examples/VendorOnboarding.tsx?raw";
import ReleasePipeline from "./examples/ReleasePipeline";
import releasePipelineCode from "./examples/ReleasePipeline.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const WorkflowTrackerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Workflow Tracker"
      description="A pipeline tracker driven by one data object: a status timeline rail, a detail panel for the active step with sub-steps, and roll-up cards for progress, flagged and skipped steps."
    />
    <WorkflowTrackerPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Vendor onboarding"
        description="The bundled sampleWorkflow: a live pipeline with a blocked step, an attention flag and an in-progress step whose sub-steps fill the detail panel. Rows are buttons — the parent owns `data.activeStepId`."
        code={vendorOnboardingCode}
        filename="VendorOnboarding.tsx"
      >
        <VendorOnboarding />
      </ExampleCard>
      <ExampleCard
        title="Release pipeline"
        description="The same data shape in another domain — a CI release pipeline with running sub-steps, a skipped stage, an attention flag and a blocked approval."
        code={releasePipelineCode}
        filename="ReleasePipeline.tsx"
      >
        <ReleasePipeline />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="Empty steps show the built-in placeholder; `loading` swaps the rail and cards for skeletons."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
    </section>
  </div>
);

export default WorkflowTrackerPage;
