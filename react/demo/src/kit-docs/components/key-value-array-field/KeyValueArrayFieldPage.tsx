import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { KeyValueArrayFieldPlayground } from "./KeyValueArrayFieldPlayground";
import EnvironmentVariables from "./examples/EnvironmentVariables";
import environmentVariablesCode from "./examples/EnvironmentVariables.tsx?raw";
import DuplicateKeys from "./examples/DuplicateKeys";
import duplicateKeysCode from "./examples/DuplicateKeys.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const KeyValueArrayFieldPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Key/Value Array"
      description="Collect arbitrary metadata pairs. Renders a Panel, so it takes every container surface, and its inputs take every input surface — with duplicate-key flagging, a row cap and collapsible help."
    />
    <KeyValueArrayFieldPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Environment variables"
        description="The canonical case: a hint under the label, collapsible help, and a few seeded pairs. Add, edit and remove rows freely."
        code={environmentVariablesCode}
        filename="EnvironmentVariables.tsx"
      >
        <EnvironmentVariables />
      </ExampleCard>
      <ExampleCard
        title="Duplicate keys"
        description="Two rows share the key `region` — both are flagged, because the second would silently win when the map is serialised."
        code={duplicateKeysCode}
        filename="DuplicateKeys.tsx"
      >
        <DuplicateKeys />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="The empty placeholder with a custom message, and a field capped at three rows — the add button disables at the limit — with a field-level error."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
    </section>
  </div>
);

export default KeyValueArrayFieldPage;
