import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PasswordInputPlayground } from "./PasswordInputPlayground";
import AsInput from "./examples/AsInput";
import asInputCode from "./examples/AsInput.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const PasswordInputPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Password Input"
      description="An Input that masks its value, with a reveal toggle in the trailing slot. It is the same control: every variant, size, tone, validation state, icon and native attribute behaves identically, and the field markup is asserted to match a bare Input at the same settings."
    />
    <PasswordInputPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="It is an Input" description="Each row pairs the two at identical settings. The field markup is byte-identical in the tests — the only differences you should see are the mask and the eye." code={asInputCode} filename="AsInput.tsx"><AsInput /></ExampleCard>
      <ExampleCard title="Sizes" description="The reveal glyph is a registry icon, so it scales with the field. It used to be a raw component with a hardcoded `w-4 h-4` that stayed 16px at every size." code={sizesCode} filename="Sizes.tsx"><Sizes /></ExampleCard>
      <ExampleCard title="When the toggle is offered" description="Not on a disabled or read-only field — it used to stay live there, so a password the user could not edit could still be read back." code={statesCode} filename="States.tsx"><States /></ExampleCard>
    </section>
  </div>
);

export default PasswordInputPage;
