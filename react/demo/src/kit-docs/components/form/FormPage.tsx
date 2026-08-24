import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { FormPlayground } from "./FormPlayground";
import AccountForm from "./examples/AccountForm";
import accountFormCode from "./examples/AccountForm.tsx?raw";
import Sections from "./examples/Sections";
import sectionsCode from "./examples/Sections.tsx?raw";
import Layouts from "./examples/Layouts";
import layoutsCode from "./examples/Layouts.tsx?raw";
import InlineFields from "./examples/InlineFields";
import inlineFieldsCode from "./examples/InlineFields.tsx?raw";
import FieldStates from "./examples/FieldStates";
import fieldStatesCode from "./examples/FieldStates.tsx?raw";

export const FormPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Form"
      description={`Three primitives that build a form: \`FormSection\` is a Panel with a header, body and footer; \`FormLayout\` is the responsive grid inside it; \`FormField\` wires a label, description, hint and error to one control — setting its id, pointing the label at it, and adding aria-invalid whenever an error is present.`}
    />
    <FormPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Account form"
        description="All three together: a section with a header and action footer, a two-column layout for the short fields, and a single-column row for the bio."
        code={accountFormCode}
        filename="AccountForm.tsx"
      >
        <AccountForm />
      </ExampleCard>
      <ExampleCard
        title="Section surfaces"
        description="A FormSection takes the full Panel surface set, so a form can be a card, a tonal block or glass — the heading and divider follow the surface."
        code={sectionsCode}
        filename="Sections.tsx"
      >
        <Sections />
      </ExampleCard>
      <ExampleCard
        title="Column counts"
        description={`\`columns\` goes from 1 to 4 and is responsive — every count collapses to a single column on narrow screens. Rows align to the top so a field with help text does not push its neighbours' labels.`}
        code={layoutsCode}
        filename="Layouts.tsx"
      >
        <Layouts />
      </ExampleCard>
      <ExampleCard
        title="Inline fields"
        description="`layout` puts the label in its own column on wide screens; the description and any `labelAction` move under the label where there is room."
        code={inlineFieldsCode}
        filename="InlineFields.tsx"
      >
        <InlineFields />
      </ExampleCard>
      <ExampleCard
        title="Field states"
        description="An `error` implies the invalid state and replaces the hint; `validationStatus` can also be set to `success` on its own, and `required` adds the asterisk while `optionalLabel` marks the inverse."
        code={fieldStatesCode}
        filename="FieldStates.tsx"
      >
        <FieldStates />
      </ExampleCard>
    </section>
  </div>
);

export default FormPage;
