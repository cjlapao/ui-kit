import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PanelPlayground } from "./PanelPlayground";
import MediaHeader from "./examples/MediaHeader";
import mediaHeaderCode from "./examples/MediaHeader.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import MediaPlacements from "./examples/MediaPlacements";
import mediaPlacementsCode from "./examples/MediaPlacements.tsx?raw";
import Loaders from "./examples/Loaders";
import loadersCode from "./examples/Loaders.tsx?raw";
import Glass from "./examples/Glass";
import glassCode from "./examples/Glass.tsx?raw";

export const PanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Panel"
      description="The shared container: eight surface treatments, media in four placements, badges, action buttons, decorations and loaders. It also publishes a surface context, so nested content like FormField hints picks up copy that reads on the card it sits on — including glass."
    />
    <PanelPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Media header card"
        description="The full anatomy: media on top, a badge, title, subtitle, description, body copy and a row of actions."
        code={mediaHeaderCode}
        filename="MediaHeader.tsx"
      >
        <MediaHeader />
      </ExampleCard>
      <ExampleCard
        title="All surfaces"
        description="The eight variants over a gradient backdrop, so the see-through ones (default, glass, liquid-glass) show what they actually composite against."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Media placements"
        description={`\`mediaPlacement\` puts the media on top, on the start or end side, or as a full-bleed overlay that the copy sits on.`}
        code={mediaPlacementsCode}
        filename="MediaPlacements.tsx"
      >
        <MediaPlacements />
      </ExampleCard>
      <ExampleCard
        title="Loaders"
        description="`loading` swaps the content for a spinner, a progress bar or a skeleton shaped like the card's real slots."
        code={loadersCode}
        filename="Loaders.tsx"
      >
        <Loaders />
      </ExampleCard>
      <ExampleCard
        title="Liquid glass"
        description="The translucent variant over a photo-like backdrop; `specularMode` sets how light reflects off the top edge — a classic bevel, a full halo, or none."
        code={glassCode}
        filename="Glass.tsx"
      >
        <Glass />
      </ExampleCard>
    </section>
  </div>
);

export default PanelPage;
