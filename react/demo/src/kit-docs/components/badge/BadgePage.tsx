import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { BadgePlayground } from "./BadgePlayground";
import Counts from "./examples/Counts";
import countsCode from "./examples/Counts.tsx?raw";
import Dots from "./examples/Dots";
import dotsCode from "./examples/Dots.tsx?raw";
import EveryVariant from "./examples/EveryVariant";
import everyVariantCode from "./examples/EveryVariant.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import Overflow from "./examples/Overflow";
import overflowCode from "./examples/Overflow.tsx?raw";
import OnIconButtons from "./examples/OnIconButtons";
import onIconButtonsCode from "./examples/OnIconButtons.tsx?raw";
import RingOverlap from "./examples/RingOverlap";
import ringOverlapCode from "./examples/RingOverlap.tsx?raw";

export const BadgePage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Badge"
      description="Counts and status indicators. Three variants, the full tone set, five sizes, a ring that keeps it legible where it overlaps something, and a pulse for attention."
    />
    <BadgePlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Counts"
        description="Plain counts with maxCount overflow and an opt-in zero state."
        code={countsCode}
        filename="Counts.tsx"
      >
        <Counts />
      </ExampleCard>
      <ExampleCard
        title="Dots"
        description="State without a number — the dot is decorative unless given a label."
        code={dotsCode}
        filename="Dots.tsx"
      >
        <Dots />
      </ExampleCard>
      <ExampleCard
        title="Every variant"
        description="Solid, soft and outline at one tone and size."
        code={everyVariantCode}
        filename="EveryVariant.tsx"
      >
        <EveryVariant />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="All 21 true colours, solid at sm."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared xs–xl scale, count and dot at each step."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Overflow"
        description="maxCount collapses to “99+”, and a non-numeric value passes straight through."
        code={overflowCode}
        filename="Overflow.tsx"
      >
        <Overflow />
      </ExampleCard>
      <ExampleCard
        title="On icon buttons"
        description="The notification pattern: a corner count, and a status dot, anchored to the control."
        code={onIconButtonsCode}
        filename="OnIconButtons.tsx"
      >
        <OnIconButtons />
      </ExampleCard>
      <ExampleCard
        title="Ring overlap"
        description="The ring is painted in the page background colour, so the badge stays legible where it overlaps something."
        code={ringOverlapCode}
        filename="RingOverlap.tsx"
      >
        <RingOverlap />
      </ExampleCard>
    </section>
  </div>
);

export default BadgePage;
