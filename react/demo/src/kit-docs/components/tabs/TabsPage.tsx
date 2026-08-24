import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { TabsPlayground } from "./TabsPlayground";
import EveryVariant from "./examples/EveryVariant";
import everyVariantCode from "./examples/EveryVariant.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import Orientation from "./examples/Orientation";
import orientationCode from "./examples/Orientation.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import Glass from "./examples/Glass";
import glassCode from "./examples/Glass.tsx?raw";

export const TabsPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Tabs"
      description="Switch between panes with icons, descriptions, badges and contextual actions pinned to the active tab. Seven variants — including glass and liquid glass — plus size, tone, orientation, justify and scroll-fade controls."
    />
    <TabsPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Every variant"
        description="All seven variants at one tone and size, on a backdrop so the glass fills have something to blur."
        code={everyVariantCode}
        filename="EveryVariant.tsx"
      >
        <EveryVariant />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared sm / md / lg scale with icons, underline variant."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="All 21 true colours, underline at sm."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
      <ExampleCard
        title="Orientation"
        description="The same soft bar running horizontally and vertically."
        code={orientationCode}
        filename="Orientation.tsx"
      >
        <Orientation />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="Icon, description, badge, a disabled tab and contextual actions on the active tab."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Glass"
        description="Glass with a classic highlight and liquid glass with a halo — the active tab carries a tone ring."
        code={glassCode}
        filename="Glass.tsx"
      >
        <Glass />
      </ExampleCard>
    </section>
  </div>
);

export default TabsPage;
