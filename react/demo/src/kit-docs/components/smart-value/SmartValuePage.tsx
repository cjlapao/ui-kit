import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { SmartValuePlayground } from "./SmartValuePlayground";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const SmartValuePage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Smart Value"
      description="The read-only twin of SmartInput: a value's tokens rendered as badges, with a toggle between the token and what it resolves to. Both render through SmartValueParts, so they cannot drift."
    />
    <SmartValuePlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Resolution states" description="A resolved value, a declared-but-empty one, and a token that does not exist. The last two used to render identically, so a typo looked the same as an unset default." code={statesCode} filename="States.tsx"><States /></ExampleCard>
    </section>
  </div>
);

export default SmartValuePage;
