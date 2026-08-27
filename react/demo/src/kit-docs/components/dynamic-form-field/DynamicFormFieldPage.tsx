import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { DynamicFormFieldPlayground } from "./DynamicFormFieldPlayground";
import ValueTypes from "./examples/ValueTypes";
import valueTypesCode from "./examples/ValueTypes.tsx?raw";
import PlainForm from "./examples/PlainForm";
import plainFormCode from "./examples/PlainForm.tsx?raw";
import Validation from "./examples/Validation";
import validationCode from "./examples/Validation.tsx?raw";

export const DynamicFormFieldPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Dynamic Form Field"
      description="One blueprint parameter, rendered as the control its value type calls for — text, secret, number, checkbox, select, list or key/value map. The label, the required marker, the hint and the error all come from `FormField`, and the card around it takes every Panel surface plus `plain`."
    />
    <DynamicFormFieldPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Every value type"
        description="`List` renders a line-per-entry textarea and `Map` renders the kit's key/value editor — the two types that used to fall through to nothing and draw an empty bordered card."
        code={valueTypesCode}
        filename="ValueTypes.tsx"
      >
        <ValueTypes />
      </ExampleCard>
      <ExampleCard
        title="A form, not a stack of boxes"
        description="`variant='plain'` drops the per-field card so a whole parameter set reads as one surface. Every field used to force its own bordered card with no way to turn it off."
        code={plainFormCode}
        filename="PlainForm.tsx"
      >
        <PlainForm />
      </ExampleCard>
      <ExampleCard
        title="Required and errors"
        description="The label, marker, hint and error come from `FormField` rather than being hand-rolled per branch — which is why the error now shows for a checkbox, where the old boolean branch rendered none at all."
        code={validationCode}
        filename="Validation.tsx"
      >
        <Validation />
      </ExampleCard>
    </section>
  </div>
);

export default DynamicFormFieldPage;
