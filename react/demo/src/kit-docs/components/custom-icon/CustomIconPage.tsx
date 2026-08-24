import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { CustomIconPlayground } from "./CustomIconPlayground";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import Tinting from "./examples/Tinting";
import tintingCode from "./examples/Tinting.tsx?raw";
import ButtonMode from "./examples/ButtonMode";
import buttonModeCode from "./examples/ButtonMode.tsx?raw";
import Fallback from "./examples/Fallback";
import fallbackCode from "./examples/Fallback.tsx?raw";

export const CustomIconPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Custom Icon"
      description="Renders any icon in the registry. Tinted with a theme tone or a raw colour; clickable icons render as real buttons, and a missing name falls back to a size-preserving monogram."
    />
    <CustomIconPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Size ladder"
        description="The shared control scale from a 16px hairline icon to 32px, plus an explicit pixel override with customSize."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Tinting"
        description="Theme tones, a raw colour that wins over tone (with a hover colour), and colored, which keeps the icon's own colours."
        code={tintingCode}
        filename="Tinting.tsx"
      >
        <Tinting />
      </ExampleCard>
      <ExampleCard
        title="Button mode"
        description="onClick turns the icon into a real, keyboard-reachable button — with a disabled state, and spin for in-flight actions."
        code={buttonModeCode}
        filename="ButtonMode.tsx"
      >
        <ButtonMode />
      </ExampleCard>
      <ExampleCard
        title="Unknown icon"
        description="A name that is not in the registry falls back to a monogram that keeps the requested size."
        code={fallbackCode}
        filename="Fallback.tsx"
      >
        <Fallback />
      </ExampleCard>
    </section>
  </div>
);

export default CustomIconPage;
