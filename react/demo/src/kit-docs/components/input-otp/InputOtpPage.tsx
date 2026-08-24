import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { InputOtpPlayground } from "./InputOtpPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Controlled from "./examples/Controlled";
import controlledCode from "./examples/Controlled.tsx?raw";
import Mask from "./examples/Mask";
import maskCode from "./examples/Mask.tsx?raw";
import IntegerOnly from "./examples/IntegerOnly";
import integerOnlyCode from "./examples/IntegerOnly.tsx?raw";
import Filled from "./examples/Filled";
import filledCode from "./examples/Filled.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import Disabled from "./examples/Disabled";
import disabledCode from "./examples/Disabled.tsx?raw";
import Custom from "./examples/Custom";
import customCode from "./examples/Custom.tsx?raw";
import Sample from "./examples/Sample";
import sampleCode from "./examples/Sample.tsx?raw";

export const InputOtpPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Input OTP"
      description="Single-character cells for one-time codes — typed, pasted or autocompleted, with masking, integer-only input and an onComplete callback."
    />
    <InputOtpPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="Uncontrolled, with the cell count set by `length`. Each cell takes one character and focus advances as you type."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Controlled"
        description="Drive the code from your own state — the value readout and reset button follow `onChange`."
        code={controlledCode}
        filename="Controlled.tsx"
      >
        <Controlled />
      </ExampleCard>
      <ExampleCard
        title="Mask"
        description="`mask` switches the cells to password inputs so the characters are hidden behind the browser's mask."
        code={maskCode}
        filename="Mask.tsx"
      >
        <Mask />
      </ExampleCard>
      <ExampleCard
        title="Integer Only"
        description="`integerOnly` filters everything but 0–9 and hints a numeric keyboard to mobile browsers."
        code={integerOnlyCode}
        filename="IntegerOnly.tsx"
      >
        <IntegerOnly />
      </ExampleCard>
      <ExampleCard
        title="Filled"
        description="The `filled` variant trades the outline for a higher-emphasis surface."
        code={filledCode}
        filename="Filled.tsx"
      >
        <Filled />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="Small, medium and large on the shared control scale, so an OTP lines up with the inputs beside it."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="Disabled"
        description="`disabled` freezes the cells — the existing code stays visible but untouchable."
        code={disabledCode}
        filename="Disabled.tsx"
      >
        <Disabled />
      </ExampleCard>
      <ExampleCard
        title="Custom"
        description="`renderCell` replaces the default box. Spread the provided `inputProps` onto your own `<input>` to keep the value, events and aria wiring."
        code={customCode}
        filename="Custom.tsx"
      >
        <Custom />
      </ExampleCard>
      <ExampleCard
        title="Sample"
        description="A sign-in flow: a 6-digit code, a resend action and a submit button that unlocks only when the code is complete."
        code={sampleCode}
        filename="Sample.tsx"
      >
        <Sample />
      </ExampleCard>
    </section>
  </div>
);

export default InputOtpPage;
