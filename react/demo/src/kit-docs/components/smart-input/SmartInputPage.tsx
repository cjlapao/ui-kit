import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { SmartInputPlayground } from "./SmartInputPlayground";
import EnvironmentConfig from "./examples/EnvironmentConfig";
import environmentConfigCode from "./examples/EnvironmentConfig.tsx?raw";
import MissingVariables from "./examples/MissingVariables";
import missingVariablesCode from "./examples/MissingVariables.tsx?raw";
import CustomResolver from "./examples/CustomResolver";
import customResolverCode from "./examples/CustomResolver.tsx?raw";

export const SmartInputPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Smart Input"
      description={`A value that can embed variable tokens. Click to edit, press + — or type {{ — to open the picker, and toggle the eye to swap every token for what it resolves to. SmartValue is the read-only twin.`}
    />
    <SmartInputPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Environment config"
        description={`The canonical case: caller-owned variable groups, a URL built from tokens, and the read-only SmartValue twin below it. Press + to insert, or type {{ to autocomplete.`}
        code={environmentConfigCode}
        filename="EnvironmentConfig.tsx"
      >
        <EnvironmentConfig />
      </ExampleCard>
      <ExampleCard
        title="Missing variables"
        description="A runtime variable that only resolves when the thing runs, and an unknown name that is flagged and counted in the missing badge."
        code={missingVariablesCode}
        filename="MissingVariables.tsx"
      >
        <MissingVariables />
      </ExampleCard>
      <ExampleCard
        title="Custom resolver"
        description="Product rules — a build id, the flags enabled for this run — live in a caller-supplied resolver rather than in the groups."
        code={customResolverCode}
        filename="CustomResolver.tsx"
      >
        <CustomResolver />
      </ExampleCard>
    </section>
  </div>
);

export default SmartInputPage;
