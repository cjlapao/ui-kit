import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PopoverPlayground } from "./PopoverPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import RichContent from "./examples/RichContent";
import richContentCode from "./examples/RichContent.tsx?raw";
import EverySurface from "./examples/EverySurface";
import everySurfaceCode from "./examples/EverySurface.tsx?raw";
import BubbleIndicator from "./examples/BubbleIndicator";
import bubbleIndicatorCode from "./examples/BubbleIndicator.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import PlacementFlip from "./examples/PlacementFlip";
import placementFlipCode from "./examples/PlacementFlip.tsx?raw";
import LoadingStates from "./examples/LoadingStates";
import loadingStatesCode from "./examples/LoadingStates.tsx?raw";
import Controlled from "./examples/Controlled";
import controlledCode from "./examples/Controlled.tsx?raw";
import NonDismissable from "./examples/NonDismissable";
import nonDismissableCode from "./examples/NonDismissable.tsx?raw";

export const PopoverPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Popover"
      description="A floating panel anchored to any trigger — an arrow (or a detached bubble dot) that tracks the trigger through every clamp, all eight container surfaces with glass and liquid-glass, flip-aware placement, dismissable/Escape control, and the shared loader set."
    />
    <PopoverPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="A toggle button opens a small elevated panel. It closes on outside click or Escape, and the trigger carries aria-haspopup / aria-expanded / aria-controls."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Rich content"
        description="The panel is a real Panel, so it takes any content: an icon chip, a heading, copy and a row of actions — styled by the tone, capped by maxWidth."
        code={richContentCode}
        filename="RichContent.tsx"
      >
        <RichContent />
      </ExampleCard>
      <ExampleCard
        title="Every surface"
        description="All eight SURFACE_VARIANTS, including glass and liquid-glass over the backdrop — the arrow wears the same edge chrome as the panel it points from."
        code={everySurfaceCode}
        filename="EverySurface.tsx"
        previewClassName="bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900"
      >
        <EverySurface />
      </ExampleCard>
      <ExampleCard
        title="Bubble indicator"
        description={"arrow=\"bubble\" replaces the speech-bubble arrow with a detached dot floating in the trigger↔panel gap — a bead of the panel's own surface, edge left unbroken. Each pair shows the two indicators on the same surface."}
        code={bubbleIndicatorCode}
        filename="BubbleIndicator.tsx"
        previewClassName="bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900"
      >
        <BubbleIndicator />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="The full 21-colour tone set. Each trigger opens a popover whose surface and arrow carry its own tone."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
      <ExampleCard
        title="Placement & flip"
        description="The explicit sides always land on that side. The auto trigger at the foot of the 85 vh card never has room below it, so it flips up — the arrow keeps pointing at the trigger through the flip."
        code={placementFlipCode}
        filename="PlacementFlip.tsx"
      >
        <PlacementFlip />
      </ExampleCard>
      <ExampleCard
        title="Loading & skeleton"
        description="The shared loader language: a spinner overlay, a progress overlay with a known extent, and a skeleton that replaces the copy — a slow fetch never flashes empty text."
        code={loadingStatesCode}
        filename="LoadingStates.tsx"
      >
        <LoadingStates />
      </ExampleCard>
      <ExampleCard
        title="Controlled"
        description="visible is owned by the parent; the trigger, outside clicks and Escape all ask through onOpenChange, while onShow / onHide report the actual lifecycle."
        code={controlledCode}
        filename="Controlled.tsx"
      >
        <Controlled />
      </ExampleCard>
      <ExampleCard
        title="Non-dismissable"
        description="dismissable={false}: clicking outside leaves the panel open. Only the trigger or Escape closes it — PrimeVue's non-dismissable popover."
        code={nonDismissableCode}
        filename="NonDismissable.tsx"
      >
        <NonDismissable />
      </ExampleCard>
    </section>
  </div>
);

export default PopoverPage;
