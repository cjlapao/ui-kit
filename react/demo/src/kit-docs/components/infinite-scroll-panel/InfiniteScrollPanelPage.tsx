import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { InfiniteScrollPanelPlayground } from "./InfiniteScrollPanelPlayground";
import MasonryFeed from "./examples/MasonryFeed";
import masonryFeedCode from "./examples/MasonryFeed.tsx?raw";
import Layouts from "./examples/Layouts";
import layoutsCode from "./examples/Layouts.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const InfiniteScrollPanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Infinite Scroll Panel"
      description="A scrolling list that fetches the next page as the end comes into view, with masonry, grid, balanced-column and list layouts — plus first-load, empty, end and retry states."
    />
    <InfiniteScrollPanelPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Masonry feed"
        description="The canonical case: pages of uneven-height cards load as you scroll, and a custom end marker appears once the feed is exhausted."
        code={masonryFeedCode}
        filename="MasonryFeed.tsx"
      >
        <MasonryFeed />
      </ExampleCard>
      <ExampleCard
        title="The four layouts"
        description="The same twelve items in masonry, grid, columns and list. Grid reads left to right; columns fills each column top-to-bottom, so reading order runs down."
        code={layoutsCode}
        filename="Layouts.tsx"
      >
        <Layouts />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="The empty state with a custom message, the first-page spinner, and the end-of-list marker."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
    </section>
  </div>
);

export default InfiniteScrollPanelPage;
