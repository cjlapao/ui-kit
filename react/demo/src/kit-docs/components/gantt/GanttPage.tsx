import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { GanttPlayground } from "./GanttPlayground";
import DefaultExample from "./examples/Default";
import defaultCode from "./examples/Default.tsx?raw";
import DependenciesExample from "./examples/Dependencies";
import dependenciesCode from "./examples/Dependencies.tsx?raw";
import GroupsExample from "./examples/Groups";
import groupsCode from "./examples/Groups.tsx?raw";
import MilestonesExample from "./examples/Milestones";
import milestonesCode from "./examples/Milestones.tsx?raw";
import LanesExample from "./examples/Lanes";
import lanesCode from "./examples/Lanes.tsx?raw";

export const GanttPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Gantt Chart"
      description="A fully interactive, feature-rich Gantt. Drag bars to move, drag the edges to resize, drag the right-edge handle to draw a dependency, drag the row grip to reorder, and drag the progress knob to set percent complete. Swimlanes group rows into collapsible bands, parent tasks roll up their children's span and progress, and a multi-scale header (day → week → month → quarter) stays anchored as you zoom with the toolbar or Ctrl/Cmd + scroll."
    />
    <GanttPlayground />

    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>

      <ExampleCard
        title="Full sample"
        description="Three swimlanes, two parent groups with roll-up progress, a milestone, and eight dependencies. Everything is editable out of the box: drag a bar, resize an edge, reorder a row, or draw a dependency from a bar's right handle."
        code={defaultCode}
        filename="Default.tsx"
      >
        <DefaultExample />
      </ExampleCard>

      <ExampleCard
        title="Dependency types"
        description="Every connector reads *source's right → target's left* — a task's **left** port is where its **parents** (predecessors) plug in and its **right** port is where its **children** (successors) plug out. The four constraint types (`fs`, `ff`, `ss`, `sf`) still show: `ff`/`sf` render dashed and hovering a connector names the exact type, while an optional `color` tints one edge. Overlapping tasks route through the clear space between their rows instead of folding back over the bars. Click an arrow to select it, then press Delete to remove it."
        code={dependenciesCode}
        filename="Dependencies.tsx"
      >
        <DependenciesExample />
      </ExampleCard>

      <ExampleCard
        title="Groups & roll-up"
        description="Children reference a `parent`, indent under it, and drive its roll-up: the parent bar spans the children's span and its progress is the duration-weighted average. Click the caret to collapse a group — the children hide but the roll-up bar and its progress stay put."
        code={groupsCode}
        filename="Groups.tsx"
      >
        <GroupsExample />
      </ExampleCard>

      <ExampleCard
        title="Milestones & per-task colour"
        description="`type: 'milestone'` collapses a bar to a single diamond at its date for deadlines that carry no duration. Per-task `color` is honoured independently of the chart's accent, so a mix of colours reads as a status map without extra props."
        code={milestonesCode}
        filename="Milestones.tsx"
      >
        <MilestonesExample />
      </ExampleCard>

      <ExampleCard
        title="Swimlanes & reorder"
        description="`lanes` group rows into bands with a title header each, and are the unit for drag-to-reorder: the grip on the left of a row reorders within its lane only, so a swimlane stays a coherent block. Lanes can be collapsed from their header too."
        code={lanesCode}
        filename="Lanes.tsx"
      >
        <LanesExample />
      </ExampleCard>
    </section>
  </div>
);

export default GanttPage;
