import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ProgressSpinnerPlayground } from "./ProgressSpinnerPlayground";
import Indeterminate from "./examples/Indeterminate";
import indeterminateCode from "./examples/Indeterminate.tsx?raw";
import Determinate from "./examples/Determinate";
import determinateCode from "./examples/Determinate.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";
import Custom from "./examples/Custom";
import customCode from "./examples/Custom.tsx?raw";
import WithStatCard from "./examples/WithStatCard";
import withStatCardCode from "./examples/WithStatCard.tsx?raw";

export const ProgressSpinnerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Progress Spinner"
      description="A circular process status indicator — an animated ring when the work has no measurable end, a filled arc with a centre readout when it does. One component, two ARIA modes, on the shared control scale."
    />
    <ProgressSpinnerPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Indeterminate"
        description={'Omit `value` for the classic chasing-arc animation. The ring reads as a status region announcing its `ariaLabel` (default "Loading"); the whole tempo is one prop — `animationDuration`.'}
        code={indeterminateCode}
        filename="Indeterminate.tsx"
      >
        <Indeterminate />
      </ExampleCard>
      <ExampleCard
        title="Determinate"
        description={'Pass a `value` and the ring becomes a filled arc with a centre percentage readout, announced through `aria-valuenow` and friends. The arc animates smoothly between values; `showValue={false}` hides the readout.'}
        code={determinateCode}
        filename="Determinate.tsx"
      >
        <Determinate />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description={'The shared control scale — `xs` through `xl` — so a spinner lines up with the Button or Spinner next to it at every size. The stroke weight is kept in physical px, not viewBox units, so "normal" is the same thickness everywhere.'}
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="Tones"
        description="Any of the 21 kit tones. The arc reads the tone's own CSS variable and the idle track is derived from it with `color-mix`, so a tone can never render as another colour."
        code={tonesCode}
        filename="Tones.tsx"
      >
        <Tones />
      </ExampleCard>
      <ExampleCard
        title="Custom"
        description="`min`/`max` for a range that is not 0-100, `thickness` for the ring weight, `animationDuration` for the tempo, and `showValue` for the readout."
        code={customCode}
        filename="Custom.tsx"
      >
        <Custom />
      </ExampleCard>
      <ExampleCard
        title="With Stat Card"
        description={'The PrimeVue showcase, straight from the kit: a dark emerald `gradient` `StatCard` with a big white 100% value, and `progress` pinning a same-tone indeterminate spinner to the bottom-right corner — the title row rides its free-form slot on the same row. The dark wash is what lets the light arc read.'}
        code={withStatCardCode}
        filename="WithStatCard.tsx"
      >
        <WithStatCard />
      </ExampleCard>
    </section>
  </div>
);

export default ProgressSpinnerPage;
