import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { EmptyStatePlayground } from "./EmptyStatePlayground";
import NoResults from "./examples/NoResults";
import noResultsCode from "./examples/NoResults.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import VariantGallery from "./examples/VariantGallery";
import variantGalleryCode from "./examples/VariantGallery.tsx?raw";
import GlassAndPlain from "./examples/GlassAndPlain";
import glassAndPlainCode from "./examples/GlassAndPlain.tsx?raw";

export const EmptyStatePage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Empty State"
      description="The placeholder shown when there is nothing to display. It renders a Panel, so it inherits every surface variant, tone, corner and padding — plus a dashed rule for a slot waiting to be filled."
    />
    <EmptyStatePlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="No results"
        description="The canonical search state, with a custom footer of two buttons in place of the generated action."
        code={noResultsCode}
        filename="NoResults.tsx"
      >
        <NoResults />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="One size prop drives the icon, the type scale, the gaps and the action button — everything moves together."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Variant gallery"
        description="Every surface treatment at once, plus plain — no card at all, for a panel the app already owns."
        code={variantGalleryCode}
        filename="VariantGallery.tsx"
      >
        <VariantGallery />
      </ExampleCard>
      <ExampleCard
        title="Glass and plain"
        description="The glass variant on a glass panel over a gradient, and plain sitting inside an outlined panel."
        code={glassAndPlainCode}
        filename="GlassAndPlain.tsx"
      >
        <GlassAndPlain />
      </ExampleCard>
    </section>
  </div>
);

export default EmptyStatePage;
