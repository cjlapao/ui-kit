import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { LoaderPlayground } from "./LoaderPlayground";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import DeterminateVersusIndeterminate from "./examples/DeterminateVersusIndeterminate";
import determinateVersusIndeterminateCode from "./examples/DeterminateVersusIndeterminate.tsx?raw";
import OverlayScrimVersusGlass from "./examples/OverlayScrimVersusGlass";
import overlayScrimVersusGlassCode from "./examples/OverlayScrimVersusGlass.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";

export const LoaderPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Loader"
      description="A loading state that can be a spinner, a progress bar, or an overlay covering its card. Size comes from the shared control scale and drives the ring, the bar, and the type together; the glass overlay takes its fill from the shared theme."
    />
    <LoaderPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Size ladder"
        description="The shared control scale drives the ring, the bar, and the type together."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Determinate versus indeterminate"
        description="The same bar with and without a known extent — the indeterminate one sweeps and publishes no aria-valuenow."
        code={determinateVersusIndeterminateCode}
        filename="DeterminateVersusIndeterminate.tsx"
      >
        <DeterminateVersusIndeterminate />
      </ExampleCard>
      <ExampleCard
        title="Overlay — scrim versus glass"
        description="The overlay covers the nearest positioned ancestor; the glass one takes its fill and blur from the shared theme."
        code={overlayScrimVersusGlassCode}
        filename="OverlayScrimVersusGlass.tsx"
      >
        <OverlayScrimVersusGlass />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="All 21 true colours on the same sm loader."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
    </section>
  </div>
);

export default LoaderPage;
