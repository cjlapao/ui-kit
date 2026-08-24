import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { DetailItemCardPlayground } from "./DetailItemCardPlayground";
import ServiceList from "./examples/ServiceList";
import serviceListCode from "./examples/ServiceList.tsx?raw";
import BadgeAlignments from "./examples/BadgeAlignments";
import badgeAlignmentsCode from "./examples/BadgeAlignments.tsx?raw";
import CardStates from "./examples/CardStates";
import cardStatesCode from "./examples/CardStates.tsx?raw";

export const DetailItemCardPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Detail Item Card"
      description="A list row with an optional expandable detail. Plain by default; give it a variant and it becomes a real card. Clickable rows are keyboard-reachable buttons."
    />
    <DetailItemCardPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Service list"
        description="The canonical case: plain rows with icon, badges and an expandable detail inside one card — the first row open by default."
        code={serviceListCode}
        filename="ServiceList.tsx"
      >
        <ServiceList />
      </ExampleCard>
      <ExampleCard
        title="Badge alignments"
        description="The badges can sit to the right of the row, or wrap below it — left-aligned or pushed to the end."
        code={badgeAlignmentsCode}
        filename="BadgeAlignments.tsx"
      >
        <BadgeAlignments />
      </ExampleCard>
      <ExampleCard
        title="Card states"
        description="A clickable card that records the selection, a disabled card, and a row with no detail — so no toggle is shown."
        code={cardStatesCode}
        filename="CardStates.tsx"
      >
        <CardStates />
      </ExampleCard>
    </section>
  </div>
);

export default DetailItemCardPage;
