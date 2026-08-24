import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ModalPlayground } from "./ModalPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import WithActions from "./examples/WithActions";
import withActionsCode from "./examples/WithActions.tsx?raw";
import Headless from "./examples/Headless";
import headlessCode from "./examples/Headless.tsx?raw";
import Maximized from "./examples/Maximized";
import maximizedCode from "./examples/Maximized.tsx?raw";
import InACorner from "./examples/InACorner";
import inACornerCode from "./examples/InACorner.tsx?raw";
import Glass from "./examples/Glass";
import glassCode from "./examples/Glass.tsx?raw";

export const ModalPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Modal"
      description="A dialog that behaves like a window — draggable by its header, placeable in any corner, able to fill the screen — and that owns attention: focus is trapped, Escape and the backdrop close it, and focus returns to the trigger."
    />
    <ModalPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="A simple information dialog with a title, a description and a body."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="With actions"
        description="A destructive confirmation: alertdialog semantics, a warning icon and the decision in the footer."
        code={withActionsCode}
        filename="WithActions.tsx"
      >
        <WithActions />
      </ExampleCard>
      <ExampleCard
        title="Headless"
        description="The header is dropped entirely — the dialog has to provide its own way out."
        code={headlessCode}
        filename="Headless.tsx"
      >
        <Headless />
      </ExampleCard>
      <ExampleCard
        title="Maximized"
        description="Opens filling the viewport; the restore button shrinks it back without closing."
        code={maximizedCode}
        filename="Maximized.tsx"
      >
        <Maximized />
      </ExampleCard>
      <ExampleCard
        title="In a corner"
        description="position places the dialog in any of nine spots before any drag."
        code={inACornerCode}
        filename="InACorner.tsx"
      >
        <InACorner />
      </ExampleCard>
      <ExampleCard
        title="Glass"
        description="The see-through surface variants let the app behind the dialog stay visible."
        code={glassCode}
        filename="Glass.tsx"
      >
        <Glass />
      </ExampleCard>
    </section>
  </div>
);

export default ModalPage;
