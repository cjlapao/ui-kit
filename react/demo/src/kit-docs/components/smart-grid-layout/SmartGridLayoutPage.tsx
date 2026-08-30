import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { SmartGridLayoutPlayground } from "./SmartGridLayoutPlayground";
import Persistence from "./examples/Persistence";
import persistenceCode from "./examples/Persistence.tsx?raw";
import Editing from "./examples/Editing";
import editingCode from "./examples/Editing.tsx?raw";
import Embedded from "./examples/Embedded";
import embeddedCode from "./examples/Embedded.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Resilience from "./examples/Resilience";
import resilienceCode from "./examples/Resilience.tsx?raw";

export const SmartGridLayoutPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Smart Grid Layout"
      description="A dashboard builder: sections and tiles dragged into place, columns and row heights resized inline, a drop zone that removes a tile, undo/redo, and a layout that saves itself. It draws no surface of its own by default, so it sits inside whatever container the page already has; the same Panel surface family is there when you want one, alongside the kit's tone and size scales and Table's storageKey persistence model."
    />
    <SmartGridLayoutPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Editing"
        description="Drag a tile to move it, or onto the top-left zone to remove it. Drag a section by its handle, click a title to rename, drag a divider to resize a column. Undo and redo are in the toolbar and on Ctrl+Z."
        code={editingCode}
        filename="Editing.tsx"
      >
        <Editing />
      </ExampleCard>
      <ExampleCard
        title="Plain by default"
        description="No background, border, shadow or padding, so the grid drops into a container that already has its own. Drawing a second panel here produced a grey slab over the host's background."
        code={embeddedCode}
        filename="Embedded.tsx"
      >
        <Embedded />
      </ExampleCard>
      <ExampleCard
        title="Persistence"
        description="storageKey is the whole opt-in. Edit the layout, reload the page, and it comes back. Reset layout clears the stored key and returns to the default."
        code={persistenceCode}
        filename="Persistence.tsx"
      >
        <Persistence />
      </ExampleCard>
      <ExampleCard
        title="A failing tile is contained"
        description="Each tile is wrapped in its own error boundary. One throwing tile shows a fallback naming itself; the rest of the dashboard keeps working, where before it would have taken the whole page down."
        code={resilienceCode}
        filename="Resilience.tsx"
      >
        <Resilience />
      </ExampleCard>
      <ExampleCard
        title="Variants and tones"
        description="The Panel surface family, plus the split between the edit accent and the surface tone. The accent came from a hand-written map covering 10 tones out of 21; the other eleven silently rendered blue."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
    </section>
  </div>
);

export default SmartGridLayoutPage;
