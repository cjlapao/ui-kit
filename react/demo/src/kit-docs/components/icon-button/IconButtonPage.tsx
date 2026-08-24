import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { IconButtonPlayground } from "./IconButtonPlayground";
import EveryVariant from "./examples/EveryVariant";
import everyVariantCode from "./examples/EveryVariant.tsx?raw";
import SizeAndCorner from "./examples/SizeAndCorner";
import sizeAndCornerCode from "./examples/SizeAndCorner.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import Glass from "./examples/Glass";
import glassCode from "./examples/Glass.tsx?raw";

export const IconButtonPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Icon Button"
      description="A square icon-only control. The full Button palette — variant, size, tone — plus corner radius, loading, accent and icon tint, glass fill with specular highlights, and a styled tooltip."
    />
    <IconButtonPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Every variant"
        description="All button variants at one tone and size."
        code={everyVariantCode}
        filename="EveryVariant.tsx"
      >
        <EveryVariant />
      </ExampleCard>
      <ExampleCard
        title="Size and corner"
        description="The shared control scale, then the four corner radii at lg."
        code={sizeAndCornerCode}
        filename="SizeAndCorner.tsx"
      >
        <SizeAndCorner />
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
        title="States"
        description="Default, loading, disabled, accent, a tinted icon and a tooltip — hover and press these."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Glass"
        description="The glass variant with the three specular highlight modes on a coloured backdrop."
        code={glassCode}
        filename="Glass.tsx"
      >
        <Glass />
      </ExampleCard>
    </section>
  </div>
);

export default IconButtonPage;
