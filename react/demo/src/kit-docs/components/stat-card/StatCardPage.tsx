import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import Typography from "./examples/Typography";
import typographyCode from "./examples/Typography.tsx?raw";
import Progress from "./examples/Progress";
import progressCode from "./examples/Progress.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import { StatCardPlayground } from "./StatCardPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import WithIcon from "./examples/WithIcon";
import withIconCode from "./examples/WithIcon.tsx?raw";
import Gradient from "./examples/Gradient";
import gradientCode from "./examples/Gradient.tsx?raw";
import WithProgress from "./examples/WithProgress";
import withProgressCode from "./examples/WithProgress.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Health from "./examples/Health";
import healthCode from "./examples/Health.tsx?raw";
import Paged from "./examples/Paged";
import pagedCode from "./examples/Paged.tsx?raw";

export const StatCardPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Stat Card"
      description="A metric in a card — label, big value, optional trend pill, icon chip, optional progress, and a full-size surface underneath. Every Panel variant, tone and corner works; `gradient` paints the surface itself."
    />
    <StatCardPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard title="Loading and error" description="The three loader treatments, skeleton by default and shaped like the card so the grid keeps its layout — the spinner and progress types cover the card instead, keeping the previous value readable underneath." code={statesCode} filename="States.tsx"><States /></ExampleCard>
      <ExampleCard title="Progress: spinner or bar" description="One feature, two renderings. The bar spans the full width at the bottom; `syncValueToProgress` drives it from the card's own figure so a percentage is written once." code={progressCode} filename="Progress.tsx"><Progress /></ExampleCard>
      <ExampleCard title="Label and value typography" description="Each carries its own tone and type scale, falling back to the card's `size`. They used to share one `valueTone`, so a muted label over a coloured figure — the common case — was impossible." code={typographyCode} filename="Typography.tsx"><Typography /></ExampleCard>
      <ExampleCard
        title="Basic"
        description="A label, a value, and a trend pill. The trend's direction picks its tone — up is emerald, down is rose, neutral is slate."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="With Icon"
        description={'An `icon` renders in a toned chip. Without `iconTone` the chip falls back to the card\'s own `tone`; with one, it overrides it.'}
        code={withIconCode}
        filename="WithIcon.tsx"
      >
        <WithIcon />
      </ExampleCard>
      <ExampleCard
        title="Gradient"
        description={'`gradient` paints the surface with a dark diagonal `tone` wash (950 → 800 → 700, the PrimeVue showcase look) and switches the copy to white. On translucent variants the stops step down to 60% alpha so the backdrop blur stays visible — the third card is a `liquid-glass` Panel wearing the same wash.'}
        code={gradientCode}
        filename="Gradient.tsx"
      >
        <Gradient />
      </ExampleCard>
      <ExampleCard
        title="With Progress"
        description={'`progress` pins a `ProgressSpinner` to the bottom-right corner, tinted by the card\'s `tone` and sized to it. Bare `progress` is indeterminate; a number is a clamped determinate value. Works on plain cards too — the third card has no `gradient`.'}
        code={withProgressCode}
        filename="WithProgress.tsx"
      >
        <WithProgress />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="The full control scale — `xs` through `xl` — steps the value font, chip, icon and trend pill together. `sm`/`md`/`lg` keep the metrics they always had."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="Variants"
        description="Every Panel surface works as the card's base — `elevated`, `outlined`, `glass`, `liquid-glass` — with its tone applied on top. `gradient` and `variant` compose: the variant keeps its shadow, ring and blur while the wash replaces the fill."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Paging"
        description={'`pages` turns any Stat card into a paged one — prev / next arrows with the page title between them. Each page overrides the card while it shows and falls back to it for anything left out. Add `page` + `onPageChange` to control it, `loopPages` to wrap, `pagerPlacement="bottom"` to pin the strip under the content.'}
        code={pagedCode}
        filename="Paged.tsx"
      >
        <Paged />
      </ExampleCard>
      <ExampleCard
        title="Health strip"
        description={'The ECG strip is its own component now: `StatHealthCard` is a `StatCard` with the monitor as its body, so every card prop still applies. `state` follows `healthy`, `warning`, `unhealthy`; `bpm` sets the tempo.'}
        code={healthCode}
        filename="Health.tsx"
      >
        <Health />
      </ExampleCard>
    </section>
  </div>
);

export default StatCardPage;
