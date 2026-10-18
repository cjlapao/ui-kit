import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { MultiProgressBarPlayground } from "./MultiProgressBarPlayground";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import Orientation from "./examples/Orientation";
import orientationCode from "./examples/Orientation.tsx?raw";
import Icons from "./examples/Icons";
import iconsCode from "./examples/Icons.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const MultiProgressBarPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Multi Progress Bar"
      description="A stacked breakdown bar: one quantity split into labelled shares. Hovering a segment dims the others and follows the cursor with its value, and the meter publishes its range and names every slice, so the numbers are reachable without a pointer. This absorbed MeterGroup, which drew the same picture without the hover behaviour."
    />
    <MultiProgressBarPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Tones" description="A series takes a `tone` from the shared palette, or is auto-assigned from it. It used to take a raw Tailwind class, which could not be dimmed or safelisted with the rest." code={tonesCode} filename="Tones.tsx"><Tones /></ExampleCard>
      <ExampleCard title="Sizes" description="The full shared control scale. The bar had no size prop at all — its track was pinned at `h-2.5`." code={sizesCode} filename="Sizes.tsx"><Sizes /></ExampleCard>
      <ExampleCard
        title="Orientation and legend placement"
        description="Horizontal or vertical, legend before or after the bar and laid out as a row or a column. `height` sets a vertical track's length, `barSize` its thickness. All from MeterGroup."
        code={orientationCode}
        filename="Orientation.tsx"
      >
        <Orientation />
      </ExampleCard>
      <ExampleCard
        title="Icons in the legend"
        description="A series can carry an icon shown instead of the colour dot, for when the tone alone does not say what the segment means."
        code={iconsCode}
        filename="Icons.tsx"
      >
        <Icons />
      </ExampleCard>
      <ExampleCard
        title="Loading, error and empty"
        description="The skeleton is shaped like the bar and its legend, so the block does not change height when the data lands."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
    </section>
  </div>
);

export default MultiProgressBarPage;
