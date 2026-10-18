import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
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
        description="The `variant` treatments from `Button`'s vocabulary that make sense for a track. `tone` takes any of the palette tones."
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
    <PropsTable
      props={[
        {
          name: "value / defaultValue",
          type: "SliderValue | null",
          description:
            "A number — or a `[min, max]` pair in range mode. Uncontrolled defaults to the bounds (`[min, max]` in range mode).",
        },
        {
          name: "onChange / onSlideEnd",
          type: "(value: SliderValue) => void",
          description:
            "`onChange` fires on every move — drag, track click, keyboard; `onSlideEnd` once when a pointer drag is released.",
        },
        {
          name: "min / max / step",
          type: "number",
          default: "0 / 100 / 1",
          description:
            "The value axis. Everything snaps to the step grid; non-finite values fall back to the defaults.",
        },
        {
          name: "range",
          type: "boolean",
          default: "false",
          description:
            "Two handles that cannot cross, picking a `[min, max]` pair.",
        },
        {
          name: "minStepsBetweenHandles",
          type: "number",
          default: "0",
          description:
            "Range mode: the handles may not come closer than this many steps apart.",
        },
        {
          name: "orientation",
          type: "Orientation",
          default: '"horizontal"',
          description:
            "The shared orientation family; vertical grows a `h-64` default unless a height is given.",
        },
        {
          name: "variant",
          type: "SliderVariant",
          default: '"solid"',
          description:
            "The same eight treatments `Button` offers, resolved through the shared slider token map.",
        },
        {
          name: "tone",
          type: "TrueColor",
          default: '"blue"',
          description:
            "Fill and handle colour. `color` still works as a deprecated alias — the kit standardized on `tone`.",
        },
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          description:
            "Paints fill, handle and focus ring with the error colour.",
        },
        {
          name: "disabled / disabledMinHandle / disabledMaxHandle",
          type: "boolean",
          default: "false",
          description:
            "Whole-control freeze, or a single range handle frozen while the other stays live — frozen handles leave the tab order.",
        },
        {
          name: "readOnly",
          type: "boolean",
          default: "false",
          description:
            "Focusable but not editable — announced via `aria-readonly`, visually unchanged.",
        },
        {
          name: "ariaLabel",
          type: "string",
          default: '"Slider" (`kit.slider.label`)',
          description:
            "Names the handle(s). In range mode it flows into the translated phrases — &ldquo;Volume min&rdquo; / &ldquo;Volume max&rdquo;.",
        },
        {
          name: "className / ref",
          type: "string / Ref<HTMLDivElement>",
          description: "Land on the root.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          Each handle is a real <C>role="slider"</C> with <C>aria-valuemin</C>/
          <C>aria-valuemax</C>/<C>aria-valuenow</C> and <C>aria-orientation</C>{" "}
          — range mode is two sliders, named through the catalog
          (&ldquo;Minimum&rdquo;/&ldquo;Maximum&rdquo;, or the translated phrase
          around an <C>ariaLabel</C>). <C>readOnly</C>
          announces <C>aria-readonly</C> without pretending the handle is gone;
          frozen handles get <C>aria-disabled</C> and leave the tab order. The
          fill and track are decoration.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          The standard slider key set, all of it: <C>ArrowLeft</C>/
          <C>ArrowRight</C> and <C>ArrowDown</C>/<C>ArrowUp</C> step (so both
          axes work regardless of orientation), <C>PageDown</C>/<C>PageUp</C>{" "}
          jump ten steps, <C>Home</C>/<C>End</C> go to the bounds. A track click
          drags the nearest handle — and focus parks on that handle, so the
          keyboard story continues from where the pointer left off.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          The handle names ride the catalog in five locales —
          <C>kit.slider.label</C> plus <C>kit.slider.min</C>/<C>max</C> for bare
          range handles and <C>minOf</C>/<C>maxOf</C> when the caller named the
          group (<C>Lautstärke: Mindestwert</C>). No English glue is ever bolted
          onto a user-provided name. What stays put: the number itself —{" "}
          <C>aria-valuenow</C> is spoken raw (there is no
          <C>aria-valuetext</C> hook to the handles), so carry a unit in the
          <C>ariaLabel</C> instead — &ldquo;Volume, percent&rdquo;.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default SliderPage;
