import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
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
        description="The gradient variant puts a coloured halo behind the field that brightens on focus; `glowIntensity` sets how prominent it is."
        code={gradientGlowCode}
        filename="GradientGlow.tsx"
      >
        <GradientGlow />
      </ExampleCard>
    </section>
  </div>
);

export default TextareaPage;
