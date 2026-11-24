import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PanelPlayground } from "./PanelPlayground";
import MediaHeader from "./examples/MediaHeader";
import mediaHeaderCode from "./examples/MediaHeader.tsx?raw";
import Variants from "./examples/Variants";
import Transparency from "./examples/Transparency";
import variantsCode from "./examples/Variants.tsx?raw";
import MediaPlacements from "./examples/MediaPlacements";
import mediaPlacementsCode from "./examples/MediaPlacements.tsx?raw";
import Loaders from "./examples/Loaders";
import loadersCode from "./examples/Loaders.tsx?raw";
import Glass from "./examples/Glass";
import glassCode from "./examples/Glass.tsx?raw";
import Clickable from "./examples/Clickable";
import clickableCode from "./examples/Clickable.tsx?raw";
import Hues from "./examples/Hues";
import huesCode from "./examples/Hues.tsx?raw";
import NestedSurfaces from "./examples/NestedSurfaces";
import nestedSurfacesCode from "./examples/NestedSurfaces.tsx?raw";

export const PanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Panel"
      description="The shared container: nine surface treatments, media in four placements, badges, action buttons, decorations and loaders. Its standing look is the kit's container standard — the elevated variant, no tint by default, sm padding and the medium corner — and every other surface component takes its defaults from here. It also publishes a surface context, so nested content like FormField hints picks up copy that reads on the card it sits on — including glass."
    />
    <PanelPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Media header card"
        description="The full anatomy: media on top, a badge, title, subtitle, description, body copy and a row of actions."
        code={mediaHeaderCode}
        filename="MediaHeader.tsx"
      >
        <MediaHeader />
      </ExampleCard>
      <ExampleCard
        title="All surfaces"
        description="Nine shared variants. Glass, liquid-glass and subtle keep their translucent defaults; the other variants have opaque backgrounds."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard title="Background transparency" description="transparency accepts none, low, medium and high. High preserves each variant's original alpha; none is opaque while preserving its tint. Only the background changes. Glass, liquid-glass and subtle default to high; other variants default to none. Existing glassOpacity presets still determine the glass fill at high." filename="Transparency.tsx" code={`<Panel variant="tonal" transparency="none">Opaque by default</Panel>
<Panel variant="tonal" transparency="high">Original transparency</Panel>
<Panel variant="glass" transparency="low">Less transparent glass</Panel>`}>
        <Transparency />
      </ExampleCard>
      <ExampleCard title="Nested surfaces" description="Matching simple, tonal, subtle, glass and liquid-glass panels automatically take a subtle background step. Set nestedSurface to false to keep the original fill. A card that sits on the neutral page itself — where fill and background agree and it disappears — takes the same first step with raisedSurface." filename="NestedSurfaces.tsx" code={nestedSurfacesCode}>
        <NestedSurfaces />
      </ExampleCard>
      <ExampleCard
        title="Media placements"
        description={`\`mediaPlacement\` puts the media on top, on the start or end side, or as a full-bleed overlay that the copy sits on.`}
        code={mediaPlacementsCode}
        filename="MediaPlacements.tsx"
      >
        <MediaPlacements />
      </ExampleCard>
      <ExampleCard
        title="Loaders"
        description="`loading` swaps the content for a spinner, a progress bar or a skeleton shaped like the card's real slots."
        code={loadersCode}
        filename="Loaders.tsx"
      >
        <Loaders />
      </ExampleCard>
      <ExampleCard
        title="A clickable card"
        description={`Pass an \`onClick\` and the card becomes a real control: \`role="button"\`, a tab stop, Enter and Space, and a tone-coloured inset focus ring. A click that lands on a control inside the card — the card's own \`actions\`, a button, a link, a field — belongs to that control and never activates the card; \`data-panel-no-click\` extends that to widgets with no semantics of their own. \`clickable={false}\` keeps the click and the guard but drops the button, which is what a card whose body owns the interaction wants.`}
        code={clickableCode}
        filename="Clickable.tsx"
      >
        <Clickable />
      </ExampleCard>
      <ExampleCard
        title="Hues of its own"
        description="`activeTone` dresses the whole selected state — the 2px inset rim and the wash under it — in a hue the card does not wear; `pulseTone` does the same for the attention glow. Left unset they agree with the card (`borderColor`, then `tone`, then the kit's blue), and the glow follows the selection, so a card that is both selected and pulsing still says one thing in one colour. The chosen card's hover asks the selection as well: put the pointer on the fifth card and the wash arrives in the hue its rim already wears, while the unchosen cards keep hovering in their own tone — the follow belongs to the state, not to the hue. `hoverColor` overrules that, which is also the way back for a card that should keep hovering in its brand hue. The resting surface stays on `tone`, and `borderColor` stays the border."
        code={huesCode}
        filename="Hues.tsx"
      >
        <Hues />
      </ExampleCard>
      <ExampleCard
        title="Liquid glass"
        description="The translucent variant over a photo-like backdrop; `specularMode` sets how light reflects off the top edge — a classic bevel, a full halo, or none."
        code={glassCode}
        filename="Glass.tsx"
      >
        <Glass />
      </ExampleCard>
    </section>
  </div>
);

export default PanelPage;
