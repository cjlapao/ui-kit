import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { MetricBarPlayground } from "./MetricBarPlayground";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";

export const MetricBarPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Metric Bar"
      description="A labelled progress row: caption on the left, free-form reading on the right, bar underneath. It renders Progress rather than drawing its own header, so the caption becomes the bar's accessible name."
    />
    <MetricBarPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Sizes" description="The full shared control scale. The component used to pin the bar underneath it to `sm`." code={sizesCode} filename="Sizes.tsx"><Sizes /></ExampleCard>
      <ExampleCard title="Tones" description="Any tone from the shared scale — it previously accepted only a `SpinnerColor`." code={tonesCode} filename="Tones.tsx"><Tones /></ExampleCard>
    </section>
  </div>
);

export default MetricBarPage;
