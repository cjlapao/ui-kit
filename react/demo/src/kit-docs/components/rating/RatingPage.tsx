import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { RatingPlayground } from "./RatingPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import HalfStars from "./examples/HalfStars";
import halfStarsCode from "./examples/HalfStars.tsx?raw";
import Controlled from "./examples/Controlled";
import controlledCode from "./examples/Controlled.tsx?raw";
import StarCount from "./examples/StarCount";
import starCountCode from "./examples/StarCount.tsx?raw";
import Vertical from "./examples/Vertical";
import verticalCode from "./examples/Vertical.tsx?raw";
import CustomIcons from "./examples/CustomIcons";
import customIconsCode from "./examples/CustomIcons.tsx?raw";
import Emoji from "./examples/Emoji";
import emojiCode from "./examples/Emoji.tsx?raw";
import ReadOnly from "./examples/ReadOnly";
import readOnlyCode from "./examples/ReadOnly.tsx?raw";
import Disabled from "./examples/Disabled";
import disabledCode from "./examples/Disabled.tsx?raw";
import Sample from "./examples/Sample";
import sampleCode from "./examples/Sample.tsx?raw";

export const RatingPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Rating"
      description="Star-based selection — typed or clicked, with half stars, hover preview, tones, sizes, vertical layout and custom icons."
    />
    <RatingPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="Uncontrolled, with the value set by `defaultValue`. Clicking a star updates the rating and the stars ahead of it light up."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Half Stars"
        description="`allowHalf` splits every star into two half values, so a rating can land on 2.5 or 3.5."
        code={halfStarsCode}
        filename="HalfStars.tsx"
      >
        <HalfStars />
      </ExampleCard>
      <ExampleCard
        title="Controlled"
        description="Drive the rating from your own state — the buttons snap it to exact values and `onChange` follows along."
        code={controlledCode}
        filename="Controlled.tsx"
      >
        <Controlled />
      </ExampleCard>
      <ExampleCard
        title="Star Count"
        description="The number of stars to display is set with `stars`."
        code={starCountCode}
        filename="StarCount.tsx"
      >
        <StarCount />
      </ExampleCard>
      <ExampleCard
        title="Vertical"
        description={`orientation="vertical" stacks the stars for tight side-by-side layouts.`}
        code={verticalCode}
        filename="Vertical.tsx"
      >
        <Vertical />
      </ExampleCard>
      <ExampleCard
        title="Custom Icons"
        description="`onIcon` and `offIcon` swap the star for any registry icon, element or per-position function."
        code={customIconsCode}
        filename="CustomIcons.tsx"
      >
        <CustomIcons />
      </ExampleCard>
      <ExampleCard
        title="Emoji"
        description="A function icon computes each star's content from its index — lit faces in full colour, unlit ones dimmed and greyed."
        code={emojiCode}
        filename="Emoji.tsx"
      >
        <Emoji />
      </ExampleCard>
      <ExampleCard
        title="Read Only"
        description="`readOnly` shows the value as a non-interactive display — the stars leave the tab order and cannot be changed."
        code={readOnlyCode}
        filename="ReadOnly.tsx"
      >
        <ReadOnly />
      </ExampleCard>
      <ExampleCard
        title="Disabled"
        description="`disabled` freezes the rating — the existing value stays visible but untouchable."
        code={disabledCode}
        filename="Disabled.tsx"
      >
        <Disabled />
      </ExampleCard>
      <ExampleCard
        title="Sample"
        description="A support sign-off: the value readout and submit action unlock only once a rating is given."
        code={sampleCode}
        filename="Sample.tsx"
      >
        <Sample />
      </ExampleCard>
    </section>
  </div>
);

export default RatingPage;
