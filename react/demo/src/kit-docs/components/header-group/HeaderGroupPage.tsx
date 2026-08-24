import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { HeaderGroupPlayground } from "./HeaderGroupPlayground";
import ToolbarHero from "./examples/ToolbarHero";
import toolbarHeroCode from "./examples/ToolbarHero.tsx?raw";
import GapLadder from "./examples/GapLadder";
import gapLadderCode from "./examples/GapLadder.tsx?raw";
import LoneGroup from "./examples/LoneGroup";
import loneGroupCode from "./examples/LoneGroup.tsx?raw";
import TonedSeparators from "./examples/TonedSeparators";
import tonedSeparatorsCode from "./examples/TonedSeparators.tsx?raw";

export const HeaderGroupPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Header Group"
      description="Clusters related header controls. Adjacent groups get a separator automatically — a lone group never draws one."
    />
    <HeaderGroupPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Toolbar"
        description="Four clusters — navigation, view, alerts and actions — in a single header bar, separated between adjacent groups."
        code={toolbarHeroCode}
        filename="ToolbarHero.tsx"
      >
        <ToolbarHero />
      </ExampleCard>
      <ExampleCard
        title="Gap ladder"
        description="Every gap size on the same three groups. The separator shares the gap's custom property, so it stays centred at each step."
        code={gapLadderCode}
        filename="GapLadder.tsx"
      >
        <GapLadder />
      </ExampleCard>
      <ExampleCard
        title="Lone group"
        description="A single group draws no leading rule; add a second and the rule appears between them."
        code={loneGroupCode}
        filename="LoneGroup.tsx"
      >
        <LoneGroup />
      </ExampleCard>
      <ExampleCard
        title="Toned separators"
        description="Untoned the rule follows the surface — light, dark and glass. A tone sets it to that colour."
        code={tonedSeparatorsCode}
        filename="TonedSeparators.tsx"
      >
        <TonedSeparators />
      </ExampleCard>
    </section>
  </div>
);

export default HeaderGroupPage;
