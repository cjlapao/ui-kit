import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { DropdownButtonPlayground } from "./DropdownButtonPlayground";
import EveryVariant from "./examples/EveryVariant";
import everyVariantCode from "./examples/EveryVariant.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import SplitVersusSingle from "./examples/SplitVersusSingle";
import splitVersusSingleCode from "./examples/SplitVersusSingle.tsx?raw";

export const DropdownButtonPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Dropdown Button"
      description="A Button with an optional caret trigger that opens a menu. The trigger keeps the full Button language — variant, size and tone — while the menu takes its positioning from DropdownMenu, and an empty menu hides the caret entirely."
    />
    <DropdownButtonPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Every variant"
        description="All button variants at one tone and size, each with a working menu."
        code={everyVariantCode}
        filename="EveryVariant.tsx"
      >
        <EveryVariant />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared control scale, solid blue."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="All 21 true colours, solid at one size."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
      <ExampleCard
        title="Split versus single"
        description="The default split trigger, the collapsed single trigger, and an empty menu that hides the caret."
        code={splitVersusSingleCode}
        filename="SplitVersusSingle.tsx"
      >
        <SplitVersusSingle />
      </ExampleCard>
    </section>
  </div>
);

export default DropdownButtonPage;
