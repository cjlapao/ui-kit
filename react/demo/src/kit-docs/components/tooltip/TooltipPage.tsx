import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { TooltipPlayground } from "./TooltipPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Position from "./examples/Position";
import positionCode from "./examples/Position.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Collision from "./examples/Collision";
import collisionCode from "./examples/Collision.tsx?raw";
import Delay from "./examples/Delay";
import delayCode from "./examples/Delay.tsx?raw";
import IconButtons from "./examples/IconButtons";
import iconButtonsCode from "./examples/IconButtons.tsx?raw";

export const TooltipPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Tooltip"
      description="A hover-and-focus hint rendered in a portal — zero impact on layout. It takes a preferred side and flips when there is no room, clamps inside the viewport, and slides its caret to keep pointing at the trigger. The geometry is shared with the Vue kit and tested as pure math."
    />
    <TooltipPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="Wrap a trigger and pass the hint text. The tooltip shows after a 500ms hover delay."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Position"
        description="Anchor the hint above or below the trigger with the position prop."
        code={positionCode}
        filename="Position.tsx"
      >
        <Position />
      </ExampleCard>
      <ExampleCard
        title="Both looks"
        description="`surface` follows the theme; `inverted` contrasts against the page. It used to be dark in both themes, with no light appearance at all — toggle the page theme to compare."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Collision handling"
        description="All four ask for `top`; only the ones with room get it. Collision is measured against the viewport by default — tick the box to constrain it to the dashed area instead, which is what makes the flipping visible here and what you want inside a scroll container or modal."
        code={collisionCode}
        filename="Collision.tsx"
      >
        <Collision />
      </ExampleCard>
      <ExampleCard
        title="Delay"
        description="Tune how long the user must hover before the hint appears."
        code={delayCode}
        filename="Delay.tsx"
      >
        <Delay />
      </ExampleCard>
      <ExampleCard
        title="On icon buttons"
        description="The classic use case: labelling icon-only controls that carry no text of their own."
        code={iconButtonsCode}
        filename="IconButtons.tsx"
      >
        <IconButtons />
      </ExampleCard>
    </section>
  </div>
);

export default TooltipPage;
