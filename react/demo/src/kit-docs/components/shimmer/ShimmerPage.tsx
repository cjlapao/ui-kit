import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ShimmerPlayground } from "./ShimmerPlayground";
import ThinkingLabel from "./examples/ThinkingLabel";
import thinkingLabelCode from "./examples/ThinkingLabel.tsx?raw";
import Speeds from "./examples/Speeds";
import speedsCode from "./examples/Speeds.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import Typography from "./examples/Typography";
import typographyCode from "./examples/Typography.tsx?raw";

export const ShimmerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Shimmer"
      description="A light sweep across waiting text — the chat 'thinking…' effect. It inherits the surrounding text color or runs in any of the 21 kit tones, at three preset speeds, and stays solid readable text under reduced motion."
    />
    <ShimmerPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Thinking label"
        description="The canonical chat use case: a row shimmers 'Thinking…' while the answer is pending (role='status'), then swaps to the static copy. Replay to run it again."
        code={thinkingLabelCode}
        filename="ThinkingLabel.tsx"
      >
        <ThinkingLabel />
      </ExampleCard>
      <ExampleCard
        title="Speeds"
        description="The three sweep periods side by side — slow 3.2s, normal 2s and fast 1.2s per pass."
        code={speedsCode}
        filename="Speeds.tsx"
      >
        <Speeds />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="The full 21-tone scale — each highlight is derived from its own color, plus an inherit row that follows the surrounding text."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
      <ExampleCard
        title="Typography"
        description="The sweep at eyebrow, body and heading sizes — and mid-paragraph, where the inline span keeps the sentence flowing around it."
        code={typographyCode}
        filename="Typography.tsx"
      >
        <Typography />
      </ExampleCard>
    </section>
  </div>
);

export default ShimmerPage;
