import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ScrollAreaPlayground } from "./ScrollAreaPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Horizontal from "./examples/Horizontal";
import horizontalCode from "./examples/Horizontal.tsx?raw";
import BothScrollbars from "./examples/BothScrollbars";
import bothScrollbarsCode from "./examples/BothScrollbars.tsx?raw";
import ScrollFade from "./examples/ScrollFade";
import scrollFadeCode from "./examples/ScrollFade.tsx?raw";

export const ScrollAreaPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Scroll Area"
      description="A scrollable region whose scrollbars are drawn by the kit instead of the browser — PrimeVue's ScrollArea. Scrolling itself stays completely native (wheel, touch, keyboard), so behaviour never surprises anyone; only the thin overlay bars are ours, sized by the visible fraction and shown only when wanted."
    />
    <ScrollAreaPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Basic" description="The classic list: bars invisible until hovered or scrolled (the `auto` default), and the same thin rounded look the kit's native scrollbar hack faked webkit-only for years." code={basicCode} filename="Basic.tsx"><Basic /></ExampleCard>
      <ExampleCard title="Horizontal" description="Wide content brings the horizontal bar up on the same rules as the vertical one." code={horizontalCode} filename="Horizontal.tsx"><Horizontal /></ExampleCard>
      <ExampleCard title="Both Scrollbars" description="Overflow on both axes gets both bars and a corner square where they meet — a sticky header riding the vertical scroll while the columns slide under it." code={bothScrollbarsCode} filename="BothScrollbars.tsx"><BothScrollbars /></ExampleCard>
      <ExampleCard title="Scroll Fade" description="`mask` fades the content at the edges it can scroll toward, so a clipped row reads as clipped instead of finished." code={scrollFadeCode} filename="ScrollFade.tsx"><ScrollFade /></ExampleCard>
    </section>
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">API</h2>
      <div className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        <p>
          Props are <code>variant</code> (<code>auto</code> by default —{" "}
          <code>hover</code> / <code>scroll</code> / <code>always</code> /{" "}
          <code>hidden</code>), <code>mask</code> for the edge fade, and{" "}
          <code>contentClassName</code> for the scrolling box; the height is
          just <code>className</code>, like <code>Panel</code> scrollables.
          Everything else lands on the root. Accessibility mirrors the
          viewport: it joins the tab order only while content overflows, so
          arrows / Page / Home / End scroll it natively, and each bar is a{" "}
          <code>role="scrollbar"</code> with <code>aria-controls</code> and a
          live <code>aria-valuenow</code>. Where the kit used to repeat a{" "}
          <code>[&amp;::-webkit-scrollbar]</code> string (which only Chrome
          honoured), this is the scroll surface to migrate to.
        </p>
      </div>
    </section>
  </div>
);

export default ScrollAreaPage;
