import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { CustomColorSwatchesPlayground } from "./CustomColorSwatchesPlayground";
import Single from "./examples/Single";
import singleCode from "./examples/Single.tsx?raw";
import Dual from "./examples/Dual";
import dualCode from "./examples/Dual.tsx?raw";
import Preselected from "./examples/Preselected";
import preselectedCode from "./examples/Preselected.tsx?raw";
import Disabled from "./examples/Disabled";
import disabledCode from "./examples/Disabled.tsx?raw";
import SavedLoaded from "./examples/SavedLoaded";
import savedLoadedCode from "./examples/SavedLoaded.tsx?raw";

export const CustomColorSwatchesPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Custom Color Swatches"
      description="A palette you can leave: the tone dots double as a door to your own colour. Single mode picks one — a tone, or whatever the OS picker returns, which joins the strip as its own swatch. Dual mode paints each choice as a filled pill and labels it with its hex, in an ink the kit computes to stay readable; click the chosen pill and the hex popover hands you the pen — pick the text colour by tone, or by colour, or hand it back to Auto."
    />
    <CustomColorSwatchesPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Single" description="One colour, tone or custom: the rainbow + opens the native picker and its answer joins the row, painted with itself." code={singleCode} filename="Single.tsx"><Single /></ExampleCard>
      <ExampleCard title="Dual" description="Filled pills carrying their own hex — the ink is auto-computed until you click the chosen pill and override it from the popover." code={dualCode} filename="Dual.tsx"><Dual /></ExampleCard>
      <ExampleCard title="Preselected" description="A custom border arriving pre-chosen, its text overridden to a palette tone — the dotted underline marks an ink the kit did not pick." code={preselectedCode} filename="Preselected.tsx"><Preselected /></ExampleCard>
      <ExampleCard title="Disabled" description="Inert but still legible: both modes read their value, nothing clicks, the group is aria-disabled." code={disabledCode} filename="Disabled.tsx"><Disabled /></ExampleCard>
      <ExampleCard title="Saved & loaded" description="Custom colours stay: commit one and it pins as its own pill — click to select, click again to re-edit, × (or right-click) to forget. storageKey persists them; extraColors loads brand swatches the consumer owns, deduped against the palette and never persisted." code={savedLoadedCode} filename="SavedLoaded.tsx"><SavedLoaded /></ExampleCard>
    </section>
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">API</h2>
      <div className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        <p>
          Props are <code>mode</code> (<code>single</code> / <code>dual</code>),{" "}
          <code>colors</code> (defaults to the kit's <code>TRUE_COLORS</code>),{" "}
          <code>size</code> on the shared control scale, <code>value</code> /{" "}
          <code>defaultValue</code> / <code>onChange</code>,{" "}
          <code>defaultCustomHex</code> (the picker's seed,{" "}
          <code>#6366f1</code> by default) and <code>disabled</code>; everything
          else lands on the root. A value is <code>{"{ tone, hex }"}</code> in
          single mode — <code>tone</code> being a palette tone or{" "}
          <code>"custom"</code> — and <code>{"{ border, text }"}</code> in dual,{" "}
          <code>text</code> being <code>{"{ mode: \"auto\" }"}</code> until the
          popover overrides it with a hex. Auto ink is chosen on the OKLCH
          ladder of the border's own tone first — an on-palette colour that
          keeps the family looking deliberate — falling back to a continuous
          same-hue sweep and, at the ends, plain white or black; a contrast
          override that fails is allowed without complaint: it is the user's
          pen, not the kit's. Pills expand for their hex on hover, focus and
          selection (instantly under reduced motion), the hex fading in only
          once there is room — a collapsed pill reads as a clean colour dot.
          The selected pill's ring is the fill itself, same hue, pulled to a
          lightness that reads on the surface — deepened in light mode, lifted
          in dark. The popover anchors to
          the pill it belongs to, closes on Escape — focus going home — and on
          any press outside. A pick is revocable: a press off the row calls it
          off, and in single mode clicking the chosen dot again does too —{" "}
          <code>onChange</code> reports <code>null</code> either way.
        </p>
        <p className="mt-4">
          Custom colours stay. Anything committed from the rainbow door pins
          itself as a saved pill of its own — newest first, capped at twelve,
          never lost when another swatch takes the selection. Click a saved
          pill to select it, click it again to open its native picker and
          re-edit it (the edit saves in place; landing on another saved colour
          merges them), and × at its trailing edge — or a right-click, or a
          long-press — forgets it, clearing the selection silently if that
          pill held it. <code>storageKey</code> persists the list under{" "}
          <code>ui-kit:swatches:{"{key}"}</code> through a versioned envelope
          (swap <code>storagePrefix</code> to move the namespace, inject{" "}
          <code>storage</code> to swap the adapter); without it saves live for
          the session only. <code>onCustomColorsChange</code> observes the
          list either way. <code>extraColors</code> loads the consumer's own
          hexes or tones into the row — after the palette, before the saved
          pills and the door, deduped against both, never persisted. The door
          itself always reads as a door: rainbow, empty, seeding from{" "}
          <code>defaultCustomHex</code> then the last colour used. Saves line
          up in the order they were added — oldest left, newest last, beside
          the door; re-adding an existing colour promotes it to newest, a
          plain edit keeps its place. A long row can fold the way{" "}
          <code>ColorSwatches</code> does: set <code>maxVisible</code> and
          the strip condenses to its first swatches plus the neutral{" "}
          <code>+N</code> chip — click it, or pass{" "}
          <code>expandOn: "hover"</code> to unfold on pointer-enter — a
          hover-opened row folds back a second after the pointer leaves, and
          re-entering within the beat calls the fold off; the chosen colour
          always keeps a slot, and <code>defaultExpanded</code> starts the
          row whole.
        </p>
      </div>
    </section>
  </div>
);

export default CustomColorSwatchesPage;
