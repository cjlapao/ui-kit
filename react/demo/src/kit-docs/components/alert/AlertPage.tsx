import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { AlertPlayground } from "./AlertPlayground";
import Intents from "./examples/Intents";
import intentsCode from "./examples/Intents.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import IconAlignment from "./examples/IconAlignment";
import iconAlignmentCode from "./examples/IconAlignment.tsx?raw";
import BodyOnly from "./examples/BodyOnly";
import bodyOnlyCode from "./examples/BodyOnly.tsx?raw";
import WithActions from "./examples/WithActions";
import withActionsCode from "./examples/WithActions.tsx?raw";

export const AlertPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Alert"
      description="Semantic callouts for things that need attention. The intent decides tone, icon and screen-reader politeness; the variant decides surface; the icon can sit at the top, the middle or the bottom; actions put the fix next to the problem."
    />
    <AlertPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Intents"
        description="info, success, warning, danger and neutral — each with its own tone and default icon."
        code={intentsCode}
        filename="Intents.tsx"
      >
        <Intents />
      </ExampleCard>
      <ExampleCard
        title="Variants"
        description="subtle, solid, outline, glass and liquid-glass, from a quiet note to a floating overlay."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Icon alignment"
        description="The glyph sits at the top of the copy, dead-centre, or on the baseline — it only reads on a long body."
        code={iconAlignmentCode}
        filename="IconAlignment.tsx"
      >
        <IconAlignment />
      </ExampleCard>
      <ExampleCard
        title="Body only"
        description="No title — the content comes through children."
        code={bodyOnlyCode}
        filename="BodyOnly.tsx"
      >
        <BodyOnly />
      </ExampleCard>
      <ExampleCard
        title="With actions"
        description="A dismissible alert that also offers the next step. Dismiss it, then bring it back."
        code={withActionsCode}
        filename="WithActions.tsx"
      >
        <WithActions />
      </ExampleCard>
    </section>
  </div>
);

export default AlertPage;
