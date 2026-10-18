import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11yCode,
  A11ySection,
  A11yTopic,
  C,
  KeyboardSupportTable,
  PropsTable,
} from "../../shared/A11ySections";
import { TextareaPlayground } from "./TextareaPlayground";
import Description from "./examples/Description";
import descriptionCode from "./examples/Description.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import ValidationStates from "./examples/ValidationStates";
import validationStatesCode from "./examples/ValidationStates.tsx?raw";
import ResizeModes from "./examples/ResizeModes";
import resizeModesCode from "./examples/ResizeModes.tsx?raw";
import CharacterCount from "./examples/CharacterCount";
import characterCountCode from "./examples/CharacterCount.tsx?raw";
import GradientGlow from "./examples/GradientGlow";
import gradientGlowCode from "./examples/GradientGlow.tsx?raw";

export const TextareaPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Textarea"
      description="A multi-line text input with the same surfaces, sizes and focus treatment as Input, plus a built-in label, status-aware help text and a character counter. Help text is linked to the field with aria-describedby, and its colour follows the validation state."
    />
    <TextareaPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Description field"
        description="The everyday form field: label, help text and a live `used / maxLength` counter under the control."
        code={descriptionCode}
        filename="Description.tsx"
      >
        <Description />
      </ExampleCard>
      <ExampleCard
        title="All variants"
        description={`The shared input variant set — \`flat\`, \`elevated\`, \`ghost\`, \`underline\`, \`glass\`, \`gradient\` — so a Textarea never looks out of place next to an Input.`}
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Validation states"
        description="`validationStatus` tints the border and ring, and the help text under the field follows the state — error in rose, success in emerald."
        code={validationStatesCode}
        filename="ValidationStates.tsx"
      >
        <ValidationStates />
      </ExampleCard>
      <ExampleCard
        title="Resize modes"
        description={`\`resize\` maps straight onto the CSS resize property — \`none\`, \`vertical\` (default), \`horizontal\` or \`both\`.`}
        code={resizeModesCode}
        filename="ResizeModes.tsx"
      >
        <ResizeModes />
      </ExampleCard>
      <ExampleCard
        title="Character count"
        description="`showCount` needs `maxLength`; the counter turns red the moment the value hits the limit."
        code={characterCountCode}
        filename="CharacterCount.tsx"
      >
        <CharacterCount />
      </ExampleCard>
      <ExampleCard
        title="Gradient glow"
        description={`The gradient variant glows with a two-lobe shadow — the tone\'s 600 shade from the left, its 400 from the right — brightening on focus; \`glowIntensity\` sets the shadow\'s geometry.`}
        code={gradientGlowCode}
        filename="GradientGlow.tsx"
      >
        <GradientGlow />
      </ExampleCard>
    </section>

    <PropsTable
      props={[
        {
          name: "size",
          type: '"xs" | "sm" | "md" | "lg" | "xl"',
          default: '"md"',
          description: "Control height and padding, on the shared size scale.",
        },
        {
          name: "variant",
          type: '"flat" | "elevated" | "ghost" | "underline" | "glass" | "gradient"',
          default: '"elevated"',
          description: "Surface treatment, identical to Input's variant set.",
        },
        {
          name: "tone",
          type: "TrueColor",
          default: '"blue"',
          description: "Accent colour of the focus indicator.",
        },
        {
          name: "validationStatus",
          type: '"none" | "error" | "success"',
          default: '"none"',
          description:
            "Tints border, ring and help text; error also sets aria-invalid.",
        },
        {
          name: "resize",
          type: '"none" | "vertical" | "horizontal" | "both"',
          default: '"vertical"',
          description: "Maps straight onto the CSS resize property.",
        },
        {
          name: "label",
          type: "ReactNode",
          description:
            "Rendered above the control, wired with htmlFor to a generated id.",
        },
        {
          name: "helpText",
          type: "ReactNode",
          description:
            "Shown under the field and linked with aria-describedby.",
        },
        {
          name: "showCount",
          type: "boolean",
          default: "false",
          description:
            "used/maxLength counter under the field; needs maxLength. Turns red at the limit.",
        },
        {
          name: "maxLength",
          type: "number",
          description:
            "Hard character limit; enables the counter when paired with showCount.",
        },
        {
          name: "fullWidth",
          type: "boolean",
          default: "true",
          description: "Stretch to the container's full width.",
        },
        {
          name: "gradientFrom",
          type: "string",
          description:
            "Gradient glow start colour. Defaults to the tone's 600 shade.",
        },
        {
          name: "gradientTo",
          type: "string",
          description:
            "Gradient glow end colour. Defaults to the tone's 400 shade.",
        },
        {
          name: "glowIntensity",
          type: '"subtle" | "soft" | "medium" | "strong"',
          default: '"subtle"',
          description: "How prominent the gradient glow is.",
        },
        {
          name: "…rest",
          type: "React.TextareaHTMLAttributes",
          description:
            "Everything else (id, placeholder, dir, aria-*, value/defaultValue, handlers) spreads onto the native <textarea>.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          <C>Textarea</C> renders a native <C>&lt;textarea&gt;</C> element, so
          it already carries the implicit textbox role and every screen reader's
          native announcement. What the field is <em>for</em> has to come from
          you, and there are three equally good ways to say it: the <C>label</C>{" "}
          prop (wired to the control with <C>htmlFor</C> and a generated id), a
          separate <C>&lt;label htmlFor&gt;</C> paired with an <C>id</C> you
          pass, or <C>aria-labelledby</C> / <C>aria-label</C> when the name
          lives in another element. Help text is announced automatically — it is
          linked with <C>aria-describedby</C> — and{" "}
          <C>validationStatus="error"</C> sets <C>aria-invalid</C> so the error
          rides along with the field name.
        </p>
        <A11yCode filename="Labeling.tsx" code={LABELING_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          The component adds no key handling of its own — everything below is
          the native element doing its job, which is exactly what screen reader
          and power users expect from a multi-line field.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: <>Moves focus to the field.</>,
            },
            {
              keys: ["shift", "tab"],
              action: <>Moves focus out of the field, backwards.</>,
            },
            {
              keys: ["enter"],
              action: (
                <>
                  Inserts a newline — multi-line by design, nothing is submitted
                  (submit is the enclosing <C>&lt;form&gt;</C>'s business).
                </>
              ),
            },
            {
              keys: ["↑", "↓"],
              action: (
                <>
                  Moves the caret — native selection and editing keys all work.
                </>
              ),
            },
          ]}
        />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The component itself speaks no strings: <C>label</C>, <C>helpText</C>,{" "}
          <C>placeholder</C> and any ARIA names are props you feed from your
          translations. The character counter is the only text it draws, and it
          is digits only (<C>12/200</C>, tabular figures), so nothing there
          needs localising. Text direction comes from the document — pass{" "}
          <C>dir</C> like any other prop and it lands on the{" "}
          <C>&lt;textarea&gt;</C>.
        </p>
      </A11yTopic>
    </A11ySection>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          <C>Textarea</C> renders a native <C>&lt;textarea&gt;</C> element, so
          it already carries the implicit textbox role and every screen reader's
          native announcement. What the field is <em>for</em> has to come from
          you, and there are three equally good ways to say it: the <C>label</C>{" "}
          prop (wired to the control with <C>htmlFor</C> and a generated id), a
          separate <C>&lt;label htmlFor&gt;</C> paired with an <C>id</C> you
          pass, or <C>aria-labelledby</C> / <C>aria-label</C> when the name
          lives in another element. Help text is announced automatically — it is
          linked with <C>aria-describedby</C> — and{" "}
          <C>validationStatus="error"</C> sets <C>aria-invalid</C> so the error
          rides along with the field name.
        </p>
        <A11yCode filename="Labeling.tsx" code={LABELING_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          The component adds no key handling of its own — everything below is
          the native element doing its job, which is exactly what screen reader
          and power users expect from a multi-line field.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: <>Moves focus to the field.</>,
            },
            {
              keys: ["shift", "tab"],
              action: <>Moves focus out of the field, backwards.</>,
            },
            {
              keys: ["enter"],
              action: (
                <>
                  Inserts a newline — multi-line by design, nothing is submitted
                  (submit is the enclosing <C>&lt;form&gt;</C>'s business).
                </>
              ),
            },
            {
              keys: ["↑", "↓"],
              action: (
                <>
                  Moves the caret — native selection and editing keys all work.
                </>
              ),
            },
          ]}
        />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The component itself speaks no strings: <C>label</C>, <C>helpText</C>,{" "}
          <C>placeholder</C> and any ARIA names are props you feed from your
          translations. The character counter is the only text it draws, and it
          is digits only (<C>12/200</C>, tabular figures), so nothing there
          needs localising. Text direction comes from the document — pass{" "}
          <C>dir</C> like any other prop and it lands on the{" "}
          <C>&lt;textarea&gt;</C>.
        </p>
      </A11yTopic>
    </A11ySection>
    <p className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
      The label is part of the component when you pass it — a real{" "}
      <C>&lt;label htmlFor&gt;</C> against a generated id, no FormField required
      — and everything the wrapper does not claim spreads onto the native{" "}
      <C>&lt;textarea&gt;</C>, which is also what <C>forwardRef</C> hands out.
    </p>
  </div>
);

const LABELING_CODE = `// The built-in way — label element wired to the control with a generated id.
<Textarea label="Address" />

// Or bring your own label element, with an id you control.
<label htmlFor="address-2">Address</label>
<Textarea id="address-2" />

// Or name it from another element — or directly.
<Textarea aria-labelledby="address-summary" />
<Textarea aria-label="Address" />
`;

export default TextareaPage;
