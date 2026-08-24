import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { InputGroupPlayground } from "./InputGroupPlayground";
import UrlBuilder from "./examples/UrlBuilder";
import urlBuilderCode from "./examples/UrlBuilder.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import Compound from "./examples/Compound";
import compoundCode from "./examples/Compound.tsx?raw";

export const InputGroupPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Input Group"
      description="A field with addons welded to its edges. The group owns the box — its children render unstyled — so it takes the same surface, size and tone scales as the Input inside it."
    />
    <InputGroupPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="URL builder"
        description="The canonical case: a protocol prefix and a domain suffix welded to a field, so the user only types the middle."
        code={urlBuilderCode}
        filename="UrlBuilder.tsx"
      >
        <UrlBuilder />
      </ExampleCard>
      <ExampleCard
        title="Every variant"
        description="All six surfaces — the group owns the box, so the addon fill and focus edge follow the same tone tokens as a standalone Input."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared control scale — the addon's padding and type track the field at every step."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Compound"
        description="More than a field inside: an unstyled Select as a unit picker, and a solid Button as a submit."
        code={compoundCode}
        filename="Compound.tsx"
      >
        <Compound />
      </ExampleCard>
    </section>
  </div>
);

export default InputGroupPage;
