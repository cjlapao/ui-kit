import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ComboboxPlayground } from "./ComboboxPlayground";
import Basics from "./examples/Basics";
import basicsCode from "./examples/Basics.tsx?raw";
import RichOptions from "./examples/RichOptions";
import richOptionsCode from "./examples/RichOptions.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const ComboboxPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Combobox"
      description="A text field that suggests without preventing: the list filters as you type, and whatever you leave in the field is the value. It renders `Input`, so the box, the sizes, the entry variants and the validation ring are the ones every other control in the kit uses — and it follows the ARIA combobox pattern, so the whole list is reachable from the keyboard."
    />
    <ComboboxPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basics"
        description="`onChange` fires on every keystroke — the field is free text. `onSelect` fires only when a row is actually chosen, which is usually the one to act on."
        code={basicsCode}
        filename="Basics.tsx"
      >
        <Basics />
      </ExampleCard>
      <ExampleCard
        title="Rich options"
        description="An option can be a bare string or an object with a label, a description, an icon and a disabled flag. The keyboard cursor steps over a disabled row rather than landing on it and refusing."
        code={richOptionsCode}
        filename="RichOptions.tsx"
      >
        <RichOptions />
      </ExampleCard>
      <ExampleCard
        title="Variants and sizes"
        description="Rendering `Input` rather than a second field implementation means every entry variant and every control size come for free, and the box lines up with the Button beside it."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="`validationStatus` is the kit's one field-status scale — it used to be declared six separate times across the form controls. `loading`, `disabled` and `readOnly` complete the set."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
    </section>
  </div>
);

export default ComboboxPage;
