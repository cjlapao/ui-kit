import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { TogglePlayground } from "./TogglePlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Icons from "./examples/Icons";
import iconsCode from "./examples/Icons.tsx?raw";
import Labeled from "./examples/Labeled";
import labeledCode from "./examples/Labeled.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import Disabled from "./examples/Disabled";
import disabledCode from "./examples/Disabled.tsx?raw";

export const TogglePage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Toggle"
      description="A switch for a single on/off setting. Five treatments from Button's vocabulary — solid, soft, outline, ghost and glass — labels and descriptions live with the control, and the whole row is the click target. Works uncontrolled out of the box."
    />
    <TogglePlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="Uncontrolled: defaultChecked seeds the state and the control toggles on its own."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Variants"
        description={`The five \`variant\` treatments from \`Button\`'s vocabulary — each row shows the off and the on state. The off-state track is neutral in every variant; the on-state fill carries the treatment. \`color\` takes any of the 21 palette tones.`}
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Icons"
        description="`iconOn` and `iconOff` each live in the half of the track the thumb is not in — `iconOn` on the left (visible while checked), `iconOff` on the right (visible while unchecked) — centered in that half with breathing room to both the thumb and the wall, scaled to the toggle's size, and cross-fading with the thumb."
        code={iconsCode}
        filename="Icons.tsx"
      >
        <Icons />
      </ExampleCard>
      <ExampleCard
        title="Labeled"
        description="A label plus a description, stacked under the label or inline beside it."
        code={labeledCode}
        filename="Labeled.tsx"
      >
        <Labeled />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="Five sizes — the shared control scale every input, button and search bar offers — from dense settings lists to onboarding screens. The thumb always travels the full track, landing flush against the far wall."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="Disabled"
        description="Both disabled states stay legible — the position, not the fill, carries the meaning."
        code={disabledCode}
        filename="Disabled.tsx"
      >
        <Disabled />
      </ExampleCard>
    </section>
  </div>
);

export default TogglePage;
