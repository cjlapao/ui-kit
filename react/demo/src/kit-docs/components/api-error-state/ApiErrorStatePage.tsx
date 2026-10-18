import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ApiErrorStatePlayground } from "./ApiErrorStatePlayground";
import Kinds from "./examples/Kinds";
import kindsCode from "./examples/Kinds.tsx?raw";
import Overrides from "./examples/Overrides";
import overridesCode from "./examples/Overrides.tsx?raw";
import Retry from "./examples/Retry";
import retryCode from "./examples/Retry.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";

export const ApiErrorStatePage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="API Error State"
      description="The failure twin of Empty State: the same surfaces, sizes and tones, with the copy and the glyph chosen from what actually went wrong. A `kind` resolves the tone, the icon, the wording and whether retrying is even worth offering — and anything you state explicitly still wins."
    />
    <ApiErrorStatePlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Kinds"
        description="`kind` is what went wrong, and it picks the tone, the glyph and the copy from one table — the same reasoning as `Alert`'s `intent`. It also decides whether a retry is offered: a refusal does not clear by pressing a button, so `forbidden` and `notFound` get none."
        code={kindsCode}
        filename="Kinds.tsx"
      >
        <Kinds />
      </ExampleCard>
      <ExampleCard
        title="Overrides"
        description="Everything the kind decides is a default. `tone`, `icon`, `title` and `subtitle` are ordinary props — they used to be hardcoded and hidden behind the wrapper, so a permission error had to be painted rose and drawn as a disconnected cloud."
        code={overridesCode}
        filename="Overrides.tsx"
      >
        <Overrides />
      </ExampleCard>
      <ExampleCard
        title="Retrying"
        description="`retrying` puts the action in its loading state and blocks it, so a slow request cannot be fired twice by an impatient second press."
        code={retryCode}
        filename="Retry.tsx"
      >
        <Retry />
      </ExampleCard>
      <ExampleCard
        title="Variants"
        description="It renders `EmptyState`, so it inherits every container surface plus `plain` — for an error dropped inside a card the app already owns, which used to need `disableBorder` and `transparentBackground` set together."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
    </section>
  </div>
);

export default ApiErrorStatePage;
