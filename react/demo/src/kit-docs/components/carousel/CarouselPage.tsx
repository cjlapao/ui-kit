import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { CarouselPlayground } from "./CarouselPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import MultipleVisible from "./examples/MultipleVisible";
import multipleVisibleCode from "./examples/MultipleVisible.tsx?raw";
import Circular from "./examples/Circular";
import circularCode from "./examples/Circular.tsx?raw";
import Vertical from "./examples/Vertical";
import verticalCode from "./examples/Vertical.tsx?raw";
import Autoplay from "./examples/Autoplay";
import autoplayCode from "./examples/Autoplay.tsx?raw";
import Custom from "./examples/Custom";
import customCode from "./examples/Custom.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const CarouselPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Carousel"
      description="A sliding gallery of items — one or many visible at a time, circular wrap with invisible snap, autoplay, vertical orientation, responsive breakpoints, swipe support and full tone matrix."
    />
    <CarouselPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="Uncontrolled, one item visible at a time. Navigate with the arrows or the indicator dots."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Multiple visible"
        description="`numVisible` shows more than one item at a time; `numScroll` controls how many items move per navigation."
        code={multipleVisibleCode}
        filename="MultipleVisible.tsx"
      >
        <MultipleVisible />
      </ExampleCard>
      <ExampleCard
        title="Circular"
        description="`circular` enables infinite wrapping. The track uses clones at both ends so the wrap is invisible — the content is identical, so the snap-back after the animation is not perceived."
        code={circularCode}
        filename="Circular.tsx"
      >
        <Circular />
      </ExampleCard>
      <ExampleCard
        title="Vertical"
        description={'orientation="vertical" turns the carousel into a vertical stack, with viewportHeight controlling the visible area.'}
        code={verticalCode}
        filename="Vertical.tsx"
      >
        <Vertical />
      </ExampleCard>
      <ExampleCard
        title="Autoplay"
        description="`autoplayInterval` advances the carousel automatically. Any manual navigation (click, swipe, or dot) pauses the autoplay for the component's lifetime."
        code={autoplayCode}
        filename="Autoplay.tsx"
      >
        <Autoplay />
      </ExampleCard>
      <ExampleCard
        title="Custom"
        description="`header`, `footer`, and `renderItem` let you fully customize the layout. The items can be any data shape — here, products with images and prices."
        code={customCode}
        filename="Custom.tsx"
      >
        <Custom />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="`loading` shows a skeleton, `error` shows an error state, and an empty `items` array shows the empty state. All three can be customized with `loadingState`, `errorState`, and `emptyState`."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
    </section>
  </div>
);

export default CarouselPage;
