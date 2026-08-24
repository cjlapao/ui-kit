import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PillPlayground } from "./PillPlayground";
import StatusBoard from "./examples/StatusBoard";
import statusBoardCode from "./examples/StatusBoard.tsx?raw";
import VariantsAndTones from "./examples/VariantsAndTones";
import variantsAndTonesCode from "./examples/VariantsAndTones.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import InteractiveTags from "./examples/InteractiveTags";
import interactiveTagsCode from "./examples/InteractiveTags.tsx?raw";

export const PillPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Pill"
      description="Small labels for status and metadata. Three opaque variants plus two glass ones, the full tone set, optional icons, a remove button, and a bare status dot."
    />
    <PillPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Status board"
        description="A row of service states — filled, icon-led, outlined and a bare dot — each carrying its own tone."
        code={statusBoardCode}
        filename="StatusBoard.tsx"
      >
        <StatusBoard />
      </ExampleCard>
      <ExampleCard
        title="Variants and tones"
        description="All five variants side by side, then the full tone palette at once."
        code={variantsAndTonesCode}
        filename="VariantsAndTones.tsx"
      >
        <VariantsAndTones />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="Pill and dot across the whole size scale — and a pill dot lines up with a Badge dot at the same size."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Interactive tags"
        description="Removable tags (removing never activates the pill), a clickable pill, a disabled one, a truncated label and a labelled dot."
        code={interactiveTagsCode}
        filename="InteractiveTags.tsx"
      >
        <InteractiveTags />
      </ExampleCard>
    </section>
  </div>
);

export default PillPage;
