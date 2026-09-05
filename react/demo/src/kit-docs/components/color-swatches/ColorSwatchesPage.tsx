import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ColorSwatchesPlayground } from "./ColorSwatchesPlayground";
import TrueColors from "./examples/TrueColors";
import trueColorsCode from "./examples/TrueColors.tsx?raw";
import Condensed from "./examples/Condensed";
import condensedCode from "./examples/Condensed.tsx?raw";
import ExpandOnHover from "./examples/ExpandOnHover";
import expandOnHoverCode from "./examples/ExpandOnHover.tsx?raw";

export const ColorSwatchesPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Color Swatches"
      description="Colours on display: a strip of dots for the theme's tones, condensed into an overlapping stack behind a +N chip when the count (or the container width) outgrows the row, and expanded — height first, dots popping in left to right — into the full palette. A new control of the kit, built to show the twenty-one TrueColors without any page becoming a colour chart."
    />
    <ColorSwatchesPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="True Colors" description="Every tone, sized to be seen, names revealed with the expansion." code={trueColorsCode} filename="TrueColors.tsx"><TrueColors /></ExampleCard>
      <ExampleCard title="Condensed" description="Four dots and a +17: the whole palette keeping one line until the chip is clicked." code={condensedCode} filename="Condensed.tsx"><Condensed /></ExampleCard>
      <ExampleCard title="Expand On Hover" description={`expandOn="hover" for strips with room around them — opened by the pointer, folded by its leaving, chip still there for keyboard and touch.`} code={expandOnHoverCode} filename="ExpandOnHover.tsx"><ExpandOnHover /></ExampleCard>
    </section>
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">API</h2>
      <div className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        <p>
          Props are <code>colors</code> (defaults to the kit's{" "}
          <code>TRUE_COLORS</code> — zero props shows the whole palette),{" "}
          <code>size</code> on the shared control scale, <code>padding</code>{" "}
          on the container one, <code>maxVisible</code>, <code>expandOn</code>{" "}
          (<code>click</code> / <code>hover</code>), <code>defaultExpanded</code>,{" "}
          <code>shape</code> and <code>showNames</code>; everything else lands
          on the root. Condensing has two triggers — too many dots for{" "}
          <code>maxVisible</code>, or a measured row too narrow for them.
          Expansion is one layout unfolding: the same container clipped to a
          single line opens to its measured height while the stacked dots
          spread apart, the rest pop in one by one, and the labels fade up —
          nothing replaces anything, and the whole set stays in the DOM
          either way: screen readers read every colour whether or not{" "}
          <em>you</em> have clicked yet.
        </p>
      </div>
    </section>
  </div>
);

export default ColorSwatchesPage;
