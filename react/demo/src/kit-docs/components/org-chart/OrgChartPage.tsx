import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { OrgChartPlayground } from "./OrgChartPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Collapsible from "./examples/Collapsible";
import collapsibleCode from "./examples/Collapsible.tsx?raw";
import Controlled from "./examples/Controlled";
import controlledCode from "./examples/Controlled.tsx?raw";
import Custom from "./examples/Custom";
import customCode from "./examples/Custom.tsx?raw";
import Single from "./examples/Single";
import singleCode from "./examples/Single.tsx?raw";
import Multiple from "./examples/Multiple";
import multipleCode from "./examples/Multiple.tsx?raw";
import Checkbox from "./examples/Checkbox";
import checkboxCode from "./examples/Checkbox.tsx?raw";

export const OrgChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Organization Chart"
      description="Hierarchical org data laid out as a branching diagram — collapsible nodes with child-count badges, single, multiple and checkbox (cascading) selection, and custom node content."
    />
    <OrgChartPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="The hierarchy from the nodes collection, fully expanded and not collapsible."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Collapsible"
        description="Branches collapse from the toggle on the card; the badge shows how many children are hidden."
        code={collapsibleCode}
        filename="Collapsible.tsx"
      >
        <Collapsible />
      </ExampleCard>
      <ExampleCard
        title="Controlled"
        description="Drive the expanded state from your own expandedIds, and expand or collapse everything in one click."
        code={controlledCode}
        filename="Controlled.tsx"
      >
        <Controlled />
      </ExampleCard>
      <ExampleCard
        title="Custom content"
        description="renderNode replaces the icon/label content while the card structure, selection styling and collapse toggle stay."
        code={customCode}
        filename="Custom.tsx"
      >
        <Custom />
      </ExampleCard>
      <ExampleCard
        title="Selection — single"
        description="With selectionMode set to single, exactly one node stays selected and the selection is managed through selectedIds."
        code={singleCode}
        filename="Single.tsx"
      >
        <Single />
      </ExampleCard>
      <ExampleCard
        title="Selection — multiple"
        description="Clicking a node adds or removes it from the selection, independently of every other node."
        code={multipleCode}
        filename="Multiple.tsx"
      >
        <Multiple />
      </ExampleCard>
      <ExampleCard
        title="Selection — checkbox"
        description="Checkbox selection cascades to the whole branch; ancestors read as mixed while only some descendants are checked."
        code={checkboxCode}
        filename="Checkbox.tsx"
      >
        <Checkbox />
      </ExampleCard>
    </section>
  </div>
);

export default OrgChartPage;
