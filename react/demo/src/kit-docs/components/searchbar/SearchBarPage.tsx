import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { SearchBarPlayground } from "./SearchBarPlayground";
import Toolbar from "./examples/Toolbar";
import toolbarCode from "./examples/Toolbar.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import GlowIntensities from "./examples/GlowIntensities";
import glowIntensitiesCode from "./examples/GlowIntensities.tsx?raw";
import CustomGlow from "./examples/CustomGlow";
import customGlowCode from "./examples/CustomGlow.tsx?raw";
import ManualSearch from "./examples/ManualSearch";
import manualSearchCode from "./examples/ManualSearch.tsx?raw";
import InGlassPanel from "./examples/InGlassPanel";
import inGlassPanelCode from "./examples/InGlassPanel.tsx?raw";
import Loading from "./examples/Loading";
import loadingCode from "./examples/Loading.tsx?raw";

export const SearchBarPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Search Bar"
      description="A debounced search input that shares its surface, size and accent with Input and Textarea, plus a gradient variant with a focus-reactive glow. While you type, onSearch fires debounceMs after the last keystroke; Enter fires immediately, Escape clears, and an inline clear button appears as soon as there is text."
    />
    <SearchBarPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard title="Loading" description="The leading glyph becomes a spinner and the bar reports aria-busy. The input stays enabled — unlike a Picker, whose trigger is disabled while loading because there is nothing to pick yet." code={loadingCode} filename="Loading.tsx"><Loading /></ExampleCard>
      <ExampleCard
        title="In a toolbar"
        description="The everyday case: a bar in a header, with a live readout of the last query so you can see the debounce working."
        code={toolbarCode}
        filename="Toolbar.tsx"
      >
        <Toolbar />
      </ExampleCard>
      <ExampleCard
        title="All variants"
        description={`The shared input variant set — \`flat\`, \`elevated\`, \`ghost\`, \`underline\`, \`glass\`, \`gradient\` — so a SearchBar never looks out of place next to an Input.`}
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Glow intensities"
        description={`\`glowIntensity\` steers the gradient variant's halo from a barely-there hint of colour to a bold, wide glow. The glow brightens while the bar is focused.`}
        code={glowIntensitiesCode}
        filename="GlowIntensities.tsx"
      >
        <GlowIntensities />
      </ExampleCard>
      <ExampleCard
        title="Custom glow colors"
        description={`Leave \`gradientFrom\` and \`gradientTo\` blank and they are derived from the accent colour's 600 and 400 shades; set either to take over the halo.`}
        code={customGlowCode}
        filename="CustomGlow.tsx"
      >
        <CustomGlow />
      </ExampleCard>
      <ExampleCard
        title="Manual search"
        description="`autoSearch` off: typing never fires, Enter submits, Escape (or the clear button) resets. The query lands in your handler the moment you press Enter."
        code={manualSearchCode}
        filename="ManualSearch.tsx"
      >
        <ManualSearch />
      </ExampleCard>
      <ExampleCard
        title="Inside a glass panel"
        description="The focus ring is inset, so a Panel with an overflow-clipped body cannot shear it off — the bar stays crisp inside glass."
        code={inGlassPanelCode}
        filename="InGlassPanel.tsx"
      >
        <InGlassPanel />
      </ExampleCard>
    </section>
  </div>
);

export default SearchBarPage;
