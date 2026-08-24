import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { TimelinePanelPlayground } from "./TimelinePanelPlayground";
import Snapshots from "./examples/Snapshots";
import snapshotsCode from "./examples/Snapshots.tsx?raw";
import DeploymentHistory from "./examples/DeploymentHistory";
import deploymentHistoryCode from "./examples/DeploymentHistory.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const TimelinePanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Timeline Panel"
      description="A Panel with a vertical timeline: an SVG trunk and L-shaped branch connectors, root and current-state anchors, nested depth, inline actions and an overflow menu, plus skeleton, spinner and progress loaders and an empty state."
    />
    <TimelinePanelPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Snapshots"
        description="The full anatomy: a root anchor, nested branches at depth 1 and 2, a current-state anchor, inline action buttons and the overflow (⋮) menu."
        code={snapshotsCode}
        filename="Snapshots.tsx"
      >
        <Snapshots />
      </ExampleCard>
      <ExampleCard
        title="Deployment history"
        description="`showTrunkDots` drops a dot on the solid trunk between anchors, and the header takes a plain ReactNode instead of a button."
        code={deploymentHistoryCode}
        filename="DeploymentHistory.tsx"
      >
        <DeploymentHistory />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="The empty message, a skeleton shaped like the timeline itself, and a spinner overlay while refreshing over existing items."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
    </section>
  </div>
);

export default TimelinePanelPage;
