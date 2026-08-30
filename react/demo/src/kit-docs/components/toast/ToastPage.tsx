import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ToastPlayground } from "./ToastPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Severities from "./examples/Severities";
import severitiesCode from "./examples/Severities.tsx?raw";
import StackedAndExpanded from "./examples/StackedAndExpanded";
import stackedAndExpandedCode from "./examples/StackedAndExpanded.tsx?raw";
import EveryPosition from "./examples/EveryPosition";
import everyPositionCode from "./examples/EveryPosition.tsx?raw";
import ProgressAndLoading from "./examples/ProgressAndLoading";
import progressAndLoadingCode from "./examples/ProgressAndLoading.tsx?raw";
import StickyAndGroups from "./examples/StickyAndGroups";
import stickyAndGroupsCode from "./examples/StickyAndGroups.tsx?raw";
import Surfaces from "./examples/Surfaces";
import surfacesCode from "./examples/Surfaces.tsx?raw";
import ActionsAndCustom from "./examples/ActionsAndCustom";
import actionsAndCustomCode from "./examples/ActionsAndCustom.tsx?raw";

export const ToastPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Toast"
      description="Transient notifications with the kit's alert-family surface. A stack of glass cards pins to a page corner: the newest sits in front, the older ones peek out behind it as a deck — and on hover (or focus) the deck fans out to full height. Auto-dismiss timers pause while the deck is engaged, and every card can be swiped away."
    />
    <ToastPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="One provider, one viewport, one hook call — the toast takes care of its own lifetime."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Severities"
        description="The shared alert-intent scale: the intent picks tone, icon and whether the announcement is polite or assertive."
        code={severitiesCode}
        filename="Severities.tsx"
      >
        <Severities />
      </ExampleCard>
      <ExampleCard
        title="Stacked and expanded"
        description="The signature behaviour: a clipped deck that fans out on hover, and an expanded mode that keeps the fan-out permanent."
        code={stackedAndExpandedCode}
        filename="StackedAndExpanded.tsx"
      >
        <StackedAndExpanded />
      </ExampleCard>
      <ExampleCard
        title="Every position"
        description="All seven anchor points, two rem from every edge — cards slide in from the edge they sit on."
        code={everyPositionCode}
        filename="EveryPosition.tsx"
      >
        <EveryPosition />
      </ExampleCard>
      <ExampleCard
        title="Progress and loading"
        description="A live toast: a spinner and a progress bar while work runs, updated in place by toast.update, then the same card turns green."
        code={progressAndLoadingCode}
        filename="ProgressAndLoading.tsx"
      >
        <ProgressAndLoading />
      </ExampleCard>
      <ExampleCard
        title="Sticky and groups"
        description="Sticky toasts opt out of the timer; a group tag lets one call clear a whole batch at once."
        code={stickyAndGroupsCode}
        filename="StickyAndGroups.tsx"
      >
        <StickyAndGroups />
      </ExampleCard>
      <ExampleCard
        title="Surfaces"
        description="The same five Alert surfaces — subtle, solid, outline, glass and liquid-glass — driven by the same token table."
        code={surfacesCode}
        filename="Surfaces.tsx"
      >
        <Surfaces />
      </ExampleCard>
      <ExampleCard
        title="Actions and custom"
        description="A clickable card body, an action row, and a custom icon — action clicks stop propagation."
        code={actionsAndCustomCode}
        filename="ActionsAndCustom.tsx"
      >
        <ActionsAndCustom />
      </ExampleCard>
    </section>
  </div>
);

export default ToastPage;
