import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11yCode,
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { SmartGridLayoutPlayground } from "./SmartGridLayoutPlayground";
import Persistence from "./examples/Persistence";
import persistenceCode from "./examples/Persistence.tsx?raw";
import Editing from "./examples/Editing";
import editingCode from "./examples/Editing.tsx?raw";
import Embedded from "./examples/Embedded";
import embeddedCode from "./examples/Embedded.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Resilience from "./examples/Resilience";
import resilienceCode from "./examples/Resilience.tsx?raw";

export const SmartGridLayoutPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Smart Grid Layout"
      description="A dashboard builder: sections and tiles dragged into place, columns and row heights resized inline, a drop zone that removes a tile, undo/redo, and a layout that saves itself. It draws no surface of its own by default, so it sits inside whatever container the page already has; the same Panel surface family is there when you want one, alongside the kit's tone and size scales and Table's storageKey persistence model."
    />
    <SmartGridLayoutPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Editing"
        description="Drag a tile to move it, or onto the top-left zone to remove it. Drag a section by its handle, click a title to rename, drag a divider to resize a column. Undo and redo are in the toolbar and on Ctrl+Z."
        code={editingCode}
        filename="Editing.tsx"
      >
        <Editing />
      </ExampleCard>
      <ExampleCard
        title="Plain by default"
        description="No background, border, shadow or padding, so the grid drops into a container that already has its own. Drawing a second panel here produced a grey slab over the host's background."
        code={embeddedCode}
        filename="Embedded.tsx"
      >
        <Embedded />
      </ExampleCard>
      <ExampleCard
        title="Persistence"
        description="storageKey is the whole opt-in. Edit the layout, reload the page, and it comes back. Reset layout clears the stored key and returns to the default."
        code={persistenceCode}
        filename="Persistence.tsx"
      >
        <Persistence />
      </ExampleCard>
      <ExampleCard
        title="A failing tile is contained"
        description="Each tile is wrapped in its own error boundary. One throwing tile shows a fallback naming itself; the rest of the dashboard keeps working, where before it would have taken the whole page down."
        code={resilienceCode}
        filename="Resilience.tsx"
      >
        <Resilience />
      </ExampleCard>
      <ExampleCard
        title="Variants and tones"
        description="The Panel surface family, plus the split between the edit accent and the surface tone. The accent came from a hand-written map covering 10 tones out of 21; the other eleven silently rendered blue."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          In edit mode a tile <em>is</em> a button — <C>role="button"</C>, in
          the tab order, with a teaching hint
          (&ldquo;Press&nbsp;Enter&nbsp;to&nbsp;lift, then the arrow keys to
          move it&rdquo;) as its description. Everything that happens narrates
          through a polite live region: lifted, moved, placed, undone, removed,
          reset. Read-only mode strips the roles and tab stops, so a viewer
          hears a plain list of tiles, not a field of buttons.
        </p>
        <A11yCode filename="Semantics.tsx" code={SEMANTICS_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          Dragging is not the only path — every gesture has a keyboard
          equivalent: Space or Enter lifts a tile, arrows walk it across rows
          and columns, Enter places it and Escape cancels back to the pre-lift
          layout. Section handles reorder with arrows, column and row spacers
          are <C>role="separator"</C> resized with arrows, and undo/redo ride
          Ctrl+Z / Ctrl+Shift+Z. In read-only mode nothing is focusable that
          does anything.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Everything the grid says comes from the catalog — toolbar, drop zone,
          resize hints, the lift-and-place narration, all 56 keys, shipped for
          en, de, fr, es and pt. Tile <em>content</em> is the caller&rsquo;s and
          passes through untouched; the layout itself is a spatial model —
          coordinates, not language.
        </p>
        <p>
          To translate it into more, layer <C>kit.smartgrid.*</C> keys into your{" "}
          <C>I18nProvider</C> catalogs: resolution runs user&nbsp;→&nbsp;kit
          →&nbsp;en&nbsp;→&nbsp;key, so{" "}
          <code>"kit.smartgrid.done": "Fertig"</code> replaces that one word and
          everything you leave unnamed keeps the kit&rsquo;s translation. The
          i18n page under <em>Internationalization</em> in the menu shows it
          live, including scoping an override to a subtree.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "items",
          type: "SmartGridItemDefinition[]",
          description:
            "The catalogue of tiles the layout can place — title, content, span, and the error boundary's name.",
        },
        {
          name: "defaultLayout",
          type: "SmartGridSectionDefinition[]",
          description:
            "Sections, rows and entries rendered when nothing is restored from storage.",
        },
        {
          name: "persistedLayout / onLayoutChange",
          type: "State / (state) => void",
          description: (
            <>
              The manual persistence pair — restore a state object, react to
              edits. Or set <C>storageKey</C> and let the component own both.
            </>
          ),
        },
        {
          name: "maxColumns",
          type: "number | {base, sm, md, lg, xl}",
          default: "12",
          description:
            "Per-breakpoint counts, measured against the container (a grid in a split pane is narrower than the viewport). One number was the only option once — every tile a sliver on a phone.",
        },
        {
          name: "variant",
          type: 'PanelVariant | "plain"',
          default: "plain",
          description:
            "Plain by design: the host container owns the frame. The Panel surface family is there when the grid stands alone.",
        },
        {
          name: "surfaceTone",
          type: "TrueColor",
          default: "neutral",
          description: (
            <>
              Tone of the <em>surface</em>, separate from the edit <C>tone</C> —
              a dashboard tinted in the accent is a lot of colour.
            </>
          ),
        },
        {
          name: "tone",
          type: "TrueColor",
          default: "blue",
          description:
            "Edit accent: tile outlines, drop indicators, resize handles. `editThemeColor` is its deprecated alias.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: "md",
          description: "Grid gap, tile padding and the row-height unit.",
        },
        {
          name: "controlVariant",
          type: "ButtonVariant",
          description: (
            <>
              Surface of the editor&rsquo;s own controls; follows <C>variant</C>{" "}
              unless set — a plain dashboard over a photograph wants glass
              controls.
            </>
          ),
        },
        {
          name: "readOnly",
          type: "boolean",
          default: "false",
          description:
            "No toolbar, no handles, no edit mode at all — distinct from isEditMode={false}, which keeps the machinery mounted.",
        },
        {
          name: "isEditMode / defaultEditMode / onEditModeChange",
          type: "boolean / boolean / (b) => void",
          description:
            "Controlled or self-owned edit mode; the change callback fires either way, so a host can ask the grid to leave.",
        },
        {
          name: "historyLimit",
          type: "number",
          default: "50",
          description:
            "Undo steps per edit session; 0 removes undo/redo from the toolbar entirely.",
        },
        {
          name: "onTileError",
          type: "(error, title) => void",
          description:
            "A throwing tile is replaced by a named fallback and reported here; the dashboard survives.",
        },
        {
          name: "storageKey / storagePrefix / storage",
          type: "string / string / GridStorageAdapter",
          description: (
            <>
              Table&rsquo;s persistence model: opt in with a key, restored on
              mount under <code>ui-kit:grid</code>:key by default, over any
              adapter.
            </>
          ),
        },
        {
          name: "autoSave / autoSaveDebounceMs",
          type: "boolean / number",
          default: "true / 400",
          description:
            "Debounced writes — resize drags update the layout on every mousemove; unthrottled serialising would run dozens of times a second.",
        },
      ]}
    />
  </div>
);

const SEMANTICS_CODE = `// Edit mode is where the buttons are; a viewer sees content.
<SmartGridLayout items={items} defaultLayout={layout} readOnly />
<SmartGridLayout items={items} defaultLayout={layout}
  isEditMode onEditModeChange={setEditing} />`;

export default SmartGridLayoutPage;
