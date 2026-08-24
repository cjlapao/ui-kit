import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { SliderPlayground } from "./SliderPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Step from "./examples/Step";
import stepCode from "./examples/Step.tsx?raw";
import Range from "./examples/Range";
import rangeCode from "./examples/Range.tsx?raw";
import HandlesDistance from "./examples/HandlesDistance";
import handlesDistanceCode from "./examples/HandlesDistance.tsx?raw";
import Vertical from "./examples/Vertical";
import verticalCode from "./examples/Vertical.tsx?raw";
import Disabled from "./examples/Disabled";
import disabledCode from "./examples/Disabled.tsx?raw";
import Controlled from "./examples/Controlled";
import controlledCode from "./examples/Controlled.tsx?raw";
import ValueChange from "./examples/ValueChange";
import valueChangeCode from "./examples/ValueChange.tsx?raw";
import Filter from "./examples/Filter";
import filterCode from "./examples/Filter.tsx?raw";

export const SliderPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Slider"
      description="Drag a handle along a track — solid, soft, outline, ghost and glass variants, range mode, steps, vertical layout and full keyboard support."
    />
    <SliderPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="Uncontrolled, with the value set by `defaultValue`. The handle can be dragged, or focused and moved with the keyboard."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Variants"
        description={`The \`variant\` treatments from \`Button\`'s vocabulary that make sense for a track. \`color\` takes any of the 21 palette tones.`}
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Step"
        description="The size of each movement is defined with `step` — values snap to the step grid."
        code={stepCode}
        filename="Step.tsx"
      >
        <Step />
      </ExampleCard>
      <ExampleCard
        title="Range"
        description="`range` adds a second handle, and the value becomes a `[min, max]` pair."
        code={rangeCode}
        filename="Range.tsx"
      >
        <Range />
      </ExampleCard>
      <ExampleCard
        title="Handles Distance"
        description="`minStepsBetweenHandles` keeps the two range handles a minimum number of steps apart."
        code={handlesDistanceCode}
        filename="HandlesDistance.tsx"
      >
        <HandlesDistance />
      </ExampleCard>
      <ExampleCard
        title="Vertical"
        description={`orientation="vertical" turns the track into a column — a natural fit for equalizer-style controls.`}
        code={verticalCode}
        filename="Vertical.tsx"
      >
        <Vertical />
      </ExampleCard>
      <ExampleCard
        title="Disabled"
        description="`disabled` freezes the whole slider; `disabledMinHandle` / `disabledMaxHandle` freeze a single range handle."
        code={disabledCode}
        filename="Disabled.tsx"
      >
        <Disabled />
      </ExampleCard>
      <ExampleCard
        title="Controlled"
        description="The slider and a number input share one state, so either can drive the value."
        code={controlledCode}
        filename="Controlled.tsx"
      >
        <Controlled />
      </ExampleCard>
      <ExampleCard
        title="Value Change"
        description="`onChange` fires while the value moves; `onSlideEnd` fires once when the drag is released."
        code={valueChangeCode}
        filename="ValueChange.tsx"
      >
        <ValueChange />
      </ExampleCard>
      <ExampleCard
        title="Filter"
        description="Multiple sliders driving a CSS filter — the image updates as each handle moves."
        code={filterCode}
        filename="Filter.tsx"
      >
        <Filter />
      </ExampleCard>
    </section>
  </div>
);

export default SliderPage;
