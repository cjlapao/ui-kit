import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { DynamicImgPlayground } from "./DynamicImgPlayground";
import SanitisedSources from "./examples/SanitisedSources";
import sanitisedSourcesCode from "./examples/SanitisedSources.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import Recolouring from "./examples/Recolouring";
import recolouringCode from "./examples/Recolouring.tsx?raw";
import Accessibility from "./examples/Accessibility";
import accessibilityCode from "./examples/Accessibility.tsx?raw";

export const DynamicImgPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Dynamic Image"
      description="Renders a data URL or raw SVG markup. SVG is sanitised against an allowlist before it is injected, then recoloured to follow the theme."
    />
    <DynamicImgPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Sanitised sources"
        description="Seven sources at once: the fill and gradient follow the tone, the outline keeps its strokes, the raster renders in an inert img, the hostile SVG is stripped down to its safe path, and the non-image falls back to an icon."
        code={sanitisedSourcesCode}
        filename="SanitisedSources.tsx"
      >
        <SanitisedSources />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The same mark across the whole size scale — raster images respect it too."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Recolouring"
        description="Theme tone, raw fill, raw stroke, and colored to keep an SVG's own palette."
        code={recolouringCode}
        filename="Recolouring.tsx"
      >
        <Recolouring />
      </ExampleCard>
      <ExampleCard
        title="Accessibility"
        description="alt makes it a named image, omitting alt marks it decorative, title adds a tooltip, and rejected markup renders the fallback icon."
        code={accessibilityCode}
        filename="Accessibility.tsx"
      >
        <Accessibility />
      </ExampleCard>
    </section>
  </div>
);

export default DynamicImgPage;
