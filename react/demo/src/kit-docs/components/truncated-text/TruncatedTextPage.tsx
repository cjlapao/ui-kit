import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { TruncatedTextPlayground } from "./TruncatedTextPlayground";
import Truncation from "./examples/Truncation";
import truncationCode from "./examples/Truncation.tsx?raw";

export const TruncatedTextPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Truncated Text"
      description="Text that ellipsises when it overflows and reveals the full string in a tooltip when it does. It measures with a ResizeObserver, so it reacts to the container changing rather than only to the text."
    />
    <TruncatedTextPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Only when cut off" description="The tooltip and the tab stop both appear only while the text is actually truncated — so a page of short labels gains no dead tab stops, and a cut-off one is reachable from the keyboard." code={truncationCode} filename="Truncation.tsx"><Truncation /></ExampleCard>
    </section>
  </div>
);

export default TruncatedTextPage;
