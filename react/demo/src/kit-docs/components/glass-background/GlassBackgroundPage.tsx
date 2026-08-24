import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { GlassBackgroundPlayground } from "./GlassBackgroundPlayground";
import SignInForm from "./examples/SignInForm";
import signInFormCode from "./examples/SignInForm.tsx?raw";
import Directions from "./examples/Directions";
import directionsCode from "./examples/Directions.tsx?raw";
import Palettes from "./examples/Palettes";
import palettesCode from "./examples/Palettes.tsx?raw";
import Shimmer from "./examples/Shimmer";
import shimmerCode from "./examples/Shimmer.tsx?raw";
import AmbientOff from "./examples/AmbientOff";
import ambientOffCode from "./examples/AmbientOff.tsx?raw";

export const GlassBackgroundPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Glass Background"
      description="A full-bleed gradient layer that sits behind glass surfaces. Pick a primary, secondary and deep color, steer the gradient in eight directions, and layer ambient glows or a slow shimmer on top. By default it fills the nearest positioned ancestor; switch it to fixed for a page-level backdrop."
    />
    <GlassBackgroundPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Sign-in form"
        description="The classic case: a liquid-glass panel floating on the gradient, with the ambient glow breathing behind it."
        code={signInFormCode}
        filename="SignInForm.tsx"
      >
        <SignInForm />
      </ExampleCard>
      <ExampleCard
        title="Eight directions"
        description={`\`direction\` maps to a CSS gradient angle — \`t\`, \`tr\`, \`r\`, \`br\`, \`b\`, \`bl\`, \`l\`, \`tl\`. Bottom-right (\`br\`) is the default.`}
        code={directionsCode}
        filename="Directions.tsx"
      >
        <Directions />
      </ExampleCard>
      <ExampleCard
        title="Palettes"
        description="`colorSecondary` and `colorDeep` override the middle and final gradient stops. Omit either and a neighboring hue is derived from `color` automatically."
        code={palettesCode}
        filename="Palettes.tsx"
      >
        <Palettes />
      </ExampleCard>
      <ExampleCard
        title="Shimmer"
        description="`shimmer` adds a slow-moving light band across the surface — subtle enough to sit under glass, off by default."
        code={shimmerCode}
        filename="Shimmer.tsx"
      >
        <Shimmer />
      </ExampleCard>
      <ExampleCard
        title="Ambient off"
        description="`ambient` (default on) renders two large blurred glow circles in the primary color behind the content. Turn it off for a flatter, quieter gradient."
        code={ambientOffCode}
        filename="AmbientOff.tsx"
      >
        <AmbientOff />
      </ExampleCard>
    </section>
  </div>
);

export default GlassBackgroundPage;
