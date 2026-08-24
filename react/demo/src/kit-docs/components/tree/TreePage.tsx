import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { TreePlayground } from "./TreePlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Controlled from "./examples/Controlled";
import controlledCode from "./examples/Controlled.tsx?raw";
import Single from "./examples/Single";
import singleCode from "./examples/Single.tsx?raw";
import Multiple from "./examples/Multiple";
import multipleCode from "./examples/Multiple.tsx?raw";
import Checkbox from "./examples/Checkbox";
import checkboxCode from "./examples/Checkbox.tsx?raw";
import Filter from "./examples/Filter";
import filterCode from "./examples/Filter.tsx?raw";
import Keyboard from "./examples/Keyboard";
import keyboardCode from "./examples/Keyboard.tsx?raw";
import Empty from "./examples/Empty";
import emptyCode from "./examples/Empty.tsx?raw";

export const TreePage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Tree"
      description="Hierarchical data with expand/collapse branches, single, multiple and checkbox selection (with derived partial state), a case-insensitive filter and full roving-keyboard navigation."
    />
    <TreePlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="Expand and collapse branches from the chevron; the row itself carries the selection."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Controlled"
        description="Drive expansion from your own state with expandedIds, and expand or collapse everything in one click."
        code={controlledCode}
        filename="Controlled.tsx"
      >
        <Controlled />
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
        description="Click adds and removes nodes from the selection without any modifier key."
        code={multipleCode}
        filename="Multiple.tsx"
      >
        <Multiple />
      </ExampleCard>
      <ExampleCard
        title="Selection — checkbox"
        description="Checkbox rows with the partial state: a parent reads as mixed while only some children are checked, and as checked once every child is."
        code={checkboxCode}
        filename="Checkbox.tsx"
      >
        <Checkbox />
      </ExampleCard>
      <ExampleCard
        title="Filter"
        description="A case-insensitive substring match on labels; branches containing a match are shown expanded while the filter is active."
        code={filterCode}
        filename="Filter.tsx"
      >
        <Filter />
      </ExampleCard>
      <ExampleCard
        title="Keyboard"
        description="Tab into the tree, then navigate with the arrow keys — Enter and Space select the focused node."
        code={keyboardCode}
        filename="Keyboard.tsx"
      >
        <Keyboard />
      </ExampleCard>
      <ExampleCard
        title="Empty"
        description="A friendly placeholder when there is nothing to show — it also appears when the filter matches no nodes."
        code={emptyCode}
        filename="Empty.tsx"
      >
        <Empty />
      </ExampleCard>
    </section>
  </div>
);

export default TreePage;
