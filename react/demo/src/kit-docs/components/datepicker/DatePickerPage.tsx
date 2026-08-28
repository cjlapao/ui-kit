import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { DatePickerPlayground } from "./DatePickerPlayground";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import SingleAndRange from "./examples/SingleAndRange";
import singleAndRangeCode from "./examples/SingleAndRange.tsx?raw";
import Constraints from "./examples/Constraints";
import constraintsCode from "./examples/Constraints.tsx?raw";
import Inline from "./examples/Inline";
import inlineCode from "./examples/Inline.tsx?raw";
import Validation from "./examples/Validation";
import validationCode from "./examples/Validation.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import FormFieldExample from "./examples/FormField";
import formFieldCode from "./examples/FormField.tsx?raw";

export const DatePickerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="DatePicker"
      description="The date field. A text input that parses formatted dates, paired with a real Panel calendar: single and range selection, month and year views, constraints, keyboard navigation and the shared size, tone and variant scales."
    />
    <DatePickerPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Variants"
        description="The six field surfaces — the calendar panel is a real Panel with its own surface scale."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Single and range"
        description="Single picks a day; range picks a window. A second pick before the start restarts the range, PrimeVue-style."
        code={singleAndRangeCode}
        filename="SingleAndRange.tsx"
      >
        <SingleAndRange />
      </ExampleCard>
      <ExampleCard
        title="Constraints"
        description="min/max windows, disabled weekdays and predicate-disabled days. Out-of-constraint cells are disabled, not hidden."
        code={constraintsCode}
        filename="Constraints.tsx"
      >
        <Constraints />
      </ExampleCard>
      <ExampleCard
        title="Inline"
        description="The calendar rendered in place — no input, no overlay, no portal."
        code={inlineCode}
        filename="Inline.tsx"
      >
        <Inline />
      </ExampleCard>
      <ExampleCard
        title="Validation"
        description="The shared validation status paints the field and publishes aria-invalid; unparseable text is flagged and reset on blur."
        code={validationCode}
        filename="Validation.tsx"
      >
        <Validation />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared xs–xl scale — the field and its calendar line up with every other control."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="All 21 true colours — the selected day takes the tone's solid fill, in light and dark."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
      <ExampleCard
        title="FormField"
        description="Labels, descriptions and the field, wired the same way as every other form control."
        code={formFieldCode}
        filename="FormField.tsx"
      >
        <FormFieldExample />
      </ExampleCard>
    </section>
  </div>
);

export default DatePickerPage;
