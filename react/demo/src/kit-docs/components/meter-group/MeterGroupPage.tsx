/**
 * DEPRECATED — no longer registered in `registry.ts`, so this page is not
 * reachable from the kit-docs nav.
 *
 * `MeterGroup` was absorbed by `MultiProgressBar`; everything demonstrated
 * here now lives on the `/multi-progress-bar` page. The files are kept so the
 * change is easy to reverse, and will be deleted with the component.
 */
import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { MeterGroupPlayground } from "./MeterGroupPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import MinMax from "./examples/MinMax";
import minMaxCode from "./examples/MinMax.tsx?raw";
import Vertical from "./examples/Vertical";
import verticalCode from "./examples/Vertical.tsx?raw";
import Labels from "./examples/Labels";
import labelsCode from "./examples/Labels.tsx?raw";
import Icons from "./examples/Icons";
import iconsCode from "./examples/Icons.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const MeterGroupPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Meter Group"
      description="A group of process status indicators — labelled segments of a shared range, per-segment tones, horizontal or vertical, with a labelled breakdown list and full state treatment."
    />
    <MeterGroupPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="One segment per item, each a labelled share of the range. Per-item `color` sets the segment tone; the label list shows each share as a rounded percent."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Min / Max"
        description="`min` and `max` bound the range (default 0-100). Segments are sized as a share of the range, so a custom max rescales every percent."
        code={minMaxCode}
        filename="MinMax.tsx"
      >
        <MinMax />
      </ExampleCard>
      <ExampleCard
        title="Vertical"
        description={'orientation="vertical" turns the bar into a vertical track — `height` sets its length and the labels move to the side, stacked with `labelOrientation="vertical"`. Labels always sit on the cross axis: above/below for a horizontal bar, left/right for a vertical one.'}
        code={verticalCode}
        filename="Vertical.tsx"
      >
        <Vertical />
      </ExampleCard>
      <ExampleCard
        title="Labels"
        description="`labelPosition` places the breakdown on the cross axis of the bar — above or below when horizontal, to the left or right when vertical — and `labelOrientation` lays the list out horizontally or vertically."
        code={labelsCode}
        filename="Labels.tsx"
      >
        <Labels />
      </ExampleCard>
      <ExampleCard
        title="Icons"
        description="An `icon` on an item renders before its label in the segment tone, in place of the colour marker."
        code={iconsCode}
        filename="Icons.tsx"
      >
        <Icons />
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

export default MeterGroupPage;
