import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { InputPlayground } from "./InputPlayground";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Labeled from "./examples/Labeled";
import labeledCode from "./examples/Labeled.tsx?raw";
import Validation from "./examples/Validation";
import validationCode from "./examples/Validation.tsx?raw";
import Icons from "./examples/Icons";
import iconsCode from "./examples/Icons.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import Password from "./examples/Password";
import passwordCode from "./examples/Password.tsx?raw";

export const InputPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Input"
      description="The text field. Surface, size and tone all come from the shared scales, so it lines up with the SearchBar, Select and Button beside it. Pair with FormField for labels, hints and errors."
    />
    <InputPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Variants"
        description="Six surfaces for the same control — from a flat field in a dense form to a glowing gradient on a landing page."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Labeled"
        description="FormField wires the label to the input, and carries the description and hint copy."
        code={labeledCode}
        filename="Labeled.tsx"
      >
        <Labeled />
      </ExampleCard>
      <ExampleCard
        title="Validation"
        description="The validation status paints the field; FormField explains why, in the right place."
        code={validationCode}
        filename="Validation.tsx"
      >
        <Validation />
      </ExampleCard>
      <ExampleCard
        title="Icons"
        description="Registry icons by name, leading or trailing — search fields and password inputs in particular."
        code={iconsCode}
        filename="Icons.tsx"
      >
        <Icons />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared xs–xl scale — height, text and icon size step together."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="All 21 true colours — focus one to see its border and ring."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
      <ExampleCard
        title="Password"
        description="PasswordInput is the same field with a built-in reveal toggle."
        code={passwordCode}
        filename="Password.tsx"
      >
        <Password />
      </ExampleCard>
    </section>
  </div>
);

export default InputPage;
