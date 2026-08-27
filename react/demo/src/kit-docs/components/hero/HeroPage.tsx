import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { HeroPlayground } from "./HeroPlayground";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import Gradient from "./examples/Gradient";
import gradientCode from "./examples/Gradient.tsx?raw";

export const HeroPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Hero"
      description="A banner: an icon, a heading and a supporting line, on a saturated gradient or on any of the kit's container surfaces. The gradient runs between the tone's own 700 and 800 shades, read from Tailwind's palette variables — which is what keeps its white copy above the kit's measured contrast floor."
    />
    <HeroPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Every tone"
        description="Each stays in its own tone. The table this replaces mapped every tone to a *different* one's gradient — `sky` painted sky→indigo, `red` painted red→rose — and its light stop was `-400`, where white measures 2.94:1 on yellow."
        code={tonesCode}
        filename="Tones.tsx"
      >
        <Tones />
      </ExampleCard>
      <ExampleCard
        title="Variants"
        description="`gradient` is the saturated band; every other variant is a `Panel`, so it brings its own fill, ring and glass props, and its copy comes from the surface rather than being forced to white."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="Title, subtitle and the icon chip move together on the shared control scale. The subtitle's own scale used to stop at `md`, and the chip was pinned at 48px whatever the type did."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="Stops and glow"
        description="The stops are overridable, and a halo sits behind the band at the chosen intensity — inset within reserved padding so an ancestor with `overflow: auto` cannot clip it."
        code={gradientCode}
        filename="Gradient.tsx"
      >
        <Gradient />
      </ExampleCard>
    </section>
  </div>
);

export default HeroPage;
