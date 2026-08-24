import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { AppDividerPlayground } from "./AppDividerPlayground";
import HeaderSections from "./examples/HeaderSections";
import headerSectionsCode from "./examples/HeaderSections.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Thicknesses from "./examples/Thicknesses";
import thicknessesCode from "./examples/Thicknesses.tsx?raw";
import LabelPositions from "./examples/LabelPositions";
import labelPositionsCode from "./examples/LabelPositions.tsx?raw";

export const AppDividerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="App Divider"
      description="A rule between sections — vertical or horizontal, optionally labelled. Takes the surrounding surface's divider colour unless given a tone, so it adapts on glass."
    />
    <AppDividerPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Header sections"
        description="The canonical case: vertical rules between toolbar items, and a labelled horizontal rule between two sign-in options. A labelled divider is announced as a separator."
        code={headerSectionsCode}
        filename="HeaderSections.tsx"
      >
        <HeaderSections />
      </ExampleCard>
      <ExampleCard
        title="Variants"
        description="Solid, dashed, dotted, and gradient — the gradient fades out at both ends."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Thicknesses"
        description="The shared control scale as line thickness, from a 1px hairline to 6px."
        code={thicknessesCode}
        filename="Thicknesses.tsx"
      >
        <Thicknesses />
      </ExampleCard>
      <ExampleCard
        title="Label positions"
        description="The label can sit at the start, the center, or the end of the rule — start and end keep a short stub on the far side."
        code={labelPositionsCode}
        filename="LabelPositions.tsx"
      >
        <LabelPositions />
      </ExampleCard>
    </section>
  </div>
);

export default AppDividerPage;
