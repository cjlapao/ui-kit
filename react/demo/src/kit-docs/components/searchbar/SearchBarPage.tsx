import React from "react";
import {
  A11ySection,
  A11yTopic,
  Kbd,
  PropsTable,
} from "../../shared/A11ySections";
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
      <ExampleCard
        title="Loading"
        description="The leading glyph becomes a spinner and the bar reports aria-busy. The input stays enabled — unlike a Picker, whose trigger is disabled while loading because there is nothing to pick yet."
        code={loadingCode}
        filename="Loading.tsx"
      >
        <Loading />
      </ExampleCard>
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
    <PropsTable
      props={[
        {
          name: "onSearch",
          type: "(query, signal?) => void",
          description:
            'Required. Fires debounceMs after the last keystroke, or the moment Enter is pressed. An emptied field fires `""`; `signal` aborts a query a newer one superseded — pass it to `fetch` and stale results never land on top of fresh ones.',
        },
        {
          name: "debounceMs / autoSearch",
          type: "number / boolean",
          default: "400 / true",
          description:
            "`autoSearch={false}` switches to manual mode: typing never fires, Enter submits, Escape (or the clear button) resets.",
        },
        {
          name: "onClear / shouldClear",
          type: "() => void / boolean",
          description:
            "`onClear` fires when the clear button or Escape empties the field — and focus stays in the input, ready for the next query. `shouldClear` empties it from outside, imperatively.",
        },
        {
          name: "placeholder",
          type: "string",
          default: "translated (`kit.searchbar.placeholder`)",
          description:
            "Passing a literal opts out of the catalog translation — leave it out for the kit default.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          description:
            "The leading glyph becomes a spinner and the bar reports `aria-busy`. The input deliberately stays enabled — a search you cannot keep typing in fights the debounce.",
        },
        {
          name: "variant / size / color",
          type: "InputVariant / ControlSize / TrueColor",
          default: '"elevated" / "md" / "blue"',
          description:
            "The shared surface set, size ladder and 21-tone palette — byte-identical with Input and Textarea via the theme. Here the tone prop is called `color`.",
        },
        {
          name: "glowIntensity / gradientFrom / gradientTo",
          type: "GlowIntensity / string",
          default: '"subtle" / tone 600 / tone 400',
          description:
            "The gradient glow: a two-lobe shadow that brightens while the bar is focused. Intensity sets the shadow&rsquo;s geometry; the reach is sized into the component&rsquo;s own box.",
        },
        {
          name: "leadingIcon / initialValue / disabled / className",
          type: "string | ReactElement / string / boolean / string",
          description:
            "`leadingIcon` takes the `Search` glyph by default — it is the element the spinner replaces. `className` lands on the bar (the padded glow wrapper, in the gradient variant).",
        },
      ]}
    />
    <p className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
      Unlike <code>Input</code>, SearchBar does <em>not</em> spread unknown
      props onto its inner <code>&lt;input&gt;</code> — it renders the input
      itself and exposes everything through its own props, so anything not
      listed above is dropped, not silently forwarded.
    </p>
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The bar wraps a native <code>&lt;input&gt;</code> — role, value and
          typing announcements are the browser&rsquo;s. The clear button is a
          real <code>&lt;button&gt;</code> with a translated name (
          <code>kit.searchbar.clearAria</code>), and while a search is in flight
          the bar announces <code>aria-busy="true"</code> — the spinner itself
          is <code>aria-hidden</code>. One honest gap: the field has no{" "}
          <code>aria-label</code> prop and spreads nothing, so the announced
          name falls back to the placeholder — a weak convention. Give the
          placeholder real words (not a prompt like &ldquo;Search...&rdquo; when
          the context is narrower), or pair the bar with a visible heading /{" "}
          <code>aria-label</code>ed landmark.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          <Kbd>Enter</Kbd> fires <code>onSearch</code> immediately, skipping the
          debounce; <Kbd>Escape</Kbd> clears the field and keeps focus in it;
          the clear button joins the tab order only when there is something to
          clear. Typing during a running search is a first-class state — the
          spinner and debounce never block keystrokes.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          Two strings ride the catalog — <code>kit.searchbar.clearAria</code>{" "}
          (&ldquo;Clear search&rdquo;) and{" "}
          <code>kit.searchbar.placeholder</code> (the default placeholder) — and
          the English values are byte-identical to the old hardcoded literals,
          so a no-provider render is unchanged. A caller-supplied{" "}
          <code>placeholder</code> intentionally wins over the translated
          default — translate it in your own catalog.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default SearchBarPage;
