import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11yCode,
  A11ySection,
  A11yTopic,
  C,
  KeyboardSupportTable,
  PropsTable,
  type KeyboardBinding,
  type PropDoc,
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

/**
 * Every row here was read out of `SmartGridLayout.tsx`, and three of them say so
 * because the component's own comments say otherwise: `surfaceTone` defaults to
 * `none` and not to the `neutral` its JSDoc claims, `size` reaches the grid's gap
 * but not the tiles' padding, and `autoSave={false}` leaves no way to save.
 */
export const SMARTGRID_PROPS: PropDoc[] = [
  {
    name: "items",
    type: "SmartGridItemDefinition[]",
    description: (
      <>
        The catalogue of tiles the layout may place — required. <C>render</C>{" "}
        runs inside a boundary of its own, and an entry with{" "}
        <C>active: false</C> is skipped with a <C>console.warn</C>, not silenced
        (:40-51,:681-686).
      </>
    ),
  },
  {
    name: "defaultLayout",
    type: "SmartGridSectionDefinition[]",
    description: (
      <>
        Sections, rows and entries — required. A row names tiles by{" "}
        <C>id</C>, never by position; an id missing from <C>items</C> warns once
        and is skipped, and a row left with nothing renderable shows the{" "}
        <C>emptyRow</C> placeholder (:78-88,:674-679,:4170-4202).
      </>
    ),
  },
  {
    name: "persistedLayout / onLayoutChange",
    type: "SmartGridLayoutState | null / (layout) => void",
    description: (
      <>
        The manual half of persistence, for a host that keeps layouts itself. An
        explicit <C>persistedLayout</C> wins over what is in storage (:1039) and
        only <C>version: 3</C> is accepted (:722). <C>onLayoutChange</C> fires on
        an edit, an undo, a redo, a reset, a cancelled grab and on the mouseup
        that ends a resize — never during the drag itself (:1472,:1515,:2832,:3074).
      </>
    ),
  },
  {
    name: "maxColumns",
    type: "number | {base, sm, md, lg, xl}",
    default: "12",
    description: (
      <>
        Per-breakpoint counts measured against the <em>container</em>, not the
        viewport, so a grid in a split pane gets the columns that fit it
        (:967-989). A map falls <em>down</em> the scale —{" "}
        <C>{`{ base: 4, lg: 12 }`}</C> is four columns until 1024px rather than
        nothing (:231-249) — and any count is clamped to at least 1, so{" "}
        <C>maxColumns={0}</C> is one column, not zero (:238).
      </>
    ),
  },
  {
    name: "variant",
    type: 'PanelVariant | "plain"',
    default: "plain",
    description: (
      <>
        Plain by design: the host container owns the frame. <C>plain</C> forces no
        surface classes, no root padding, and the higher-contrast copy the
        translucent surfaces use, because <C>neutral-500</C> over a photograph is
        unreadable (:992-1002).
      </>
    ),
  },
  {
    name: "surfaceTone",
    type: "SurfaceTone",
    default: "none",
    description: (
      <>
        Tone of the <em>surface</em>, kept separate from the edit <C>tone</C>. Its
        JSDoc announces <C>"neutral"</C> (:120) while the destructure is{" "}
        <C>"none"</C> (:949) — the code is the one that matches this
        component&rsquo;s plain-by-default story, so that is what the default is.
        Only consulted when <C>variant</C> is not plain (:992-994).
      </>
    ),
  },
  {
    name: "tone",
    type: "TrueColor",
    default: "blue",
    description: (
      <>
        Edit accent — tile outlines, drop indicators, resize handles — resolved as{" "}
        <C>tone ?? editThemeColor ?? &quot;blue&quot;</C> (:965). Two exceptions
        are worth knowing: the row&rsquo;s add button still reads the deprecated{" "}
        <C>editThemeColor</C> directly (:4640), so a dashboard that sets only{" "}
        <C>tone</C> has exactly one uncoloured control; and spacer tiles are blue
        whatever the accent is (:4241).
      </>
    ),
  },
  {
    name: "size",
    type: "ControlSize",
    default: "md",
    description: (
      <>
        The grid&rsquo;s gap, row gap and own padding (:392-451,:1002). It is not
        the tile padding either: a row hard-codes <C>gap-2 p-2</C> (:3897) — and it
        is not the row-height unit, whose token (<C>SIZE_TOKENS.rowUnit</C>) is
        never read; rows always measure against <C>ROW_SPAN_SIZE</C> 100 (:285).
      </>
    ),
  },
  {
    name: "controlVariant",
    type: "ButtonVariant",
    description: (
      <>
        Surface for the editor&rsquo;s own controls, independent of the body: it
        follows <C>variant</C> through a map and falls back to{" "}
        <C>outline</C> (:358-371,:1004-1005). The item palette ignores it — always{" "}
        <C>glass</C> / <C>sidebar</C> (:3468-3475) — and row and section icon
        buttons are pinned to <C>ghost</C> whatever the surface is (:347-356),
        except the empty-row trash button, which reads the editor&rsquo;s variant
        and so comes out glass on glass (:4181-4183).
      </>
    ),
  },
  {
    name: "readOnly",
    type: "boolean",
    default: "false",
    description: (
      <>
        Not <C>isEditMode={false}</C>: this forbids editing rather than pausing it.
        Edit mode is forced off, the toolbar is not rendered, and the tiles lose
        their roles and tab stops (:1285-1287,:3191,:4268-4283).
      </>
    ),
  },
  {
    name: "isEditMode / defaultEditMode / onEditModeChange",
    type: "boolean / boolean / (b) => void",
    default: "— / false / —",
    description: (
      <>
        Controlled only while <C>isEditMode</C> is not <C>undefined</C> (:1282);{" "}
        <C>defaultEditMode</C> is the uncontrolled starting state (:956).{" "}
        <C>onEditModeChange</C> fires whichever way the state is owned (:1292) —
        and controlling <C>isEditMode</C> <em>without</em> it takes the whole
        toolbar away, because a button whose result nobody can hear is not offered
        (:3188-3192).
      </>
    ),
  },
  {
    name: "historyLimit",
    type: "number",
    default: "50",
    description: (
      <>
        Undo steps within an edit session. The keydown listener is bound only while
        editing and above zero, and <C>0</C> removes the undo and redo buttons with
        it (:954,:1560-1569).
      </>
    ),
  },
  {
    name: "onTileError",
    type: "(error, title) => void",
    description: (
      <>
        A tile that throws is replaced by a fallback naming itself and reported
        here; the rest of the dashboard keeps working. The boundary is per tile, so
        one bad widget no longer takes the page down (:4587-4592).
      </>
    ),
  },
  {
    name: "storageKey / storagePrefix / storage",
    type: "string / string / GridStorageAdapter",
    default: "— / ui-kit:grid / safe localStorage",
    description: (
      <>
        Table&rsquo;s persistence model, and the whole opt-in: the composed key is{" "}
        <C>{`{prefix}:{storageKey}`}</C> (:1015-1020) and the layout is read{" "}
        <em>once per key, on mount</em> (:1029-1038). The default adapter never
        throws — a blocked or private-mode <C>localStorage</C> reads as nothing and
        writes are swallowed (safeStorage.ts:27-60); a custom <C>storage</C> that
        throws is not protected, because it is yours (:1011-1014).
      </>
    ),
  },
  {
    name: "autoSave / autoSaveDebounceMs",
    type: "boolean / number",
    default: "true / 400",
    description: (
      <>
        Writes are debounced and last-write-wins, which is the only reason a
        resize drag does not serialise the dashboard on every mousemove
        (:1434-1442). The JSDoc&rsquo;s promise — restore on mount and{" "}
        <C>save only when you call onLayoutChange yourself</C> (:187-188) — is not
        kept: with <C>autoSave={false}</C> there is no save handle, no flush, and
        no other path to storage.
      </>
    ),
  },
  {
    name: "className",
    type: "string",
    description: (
      <>
        Appended to the grid&rsquo;s root column (:945). The frame still belongs to
        the host: <C>plain</C> deliberately draws none of its own (:992-1002).
      </>
    ),
  },
  {
    name: "…no others",
    type: "",
    description: (
      <>
        <C>editThemeColor</C> (:109-110) is <C>tone</C>&rsquo;s deprecated alias and
        is honoured at :965 — and, by an oversight, at :4640. Every other name on{" "}
        <C>SmartGridLayoutProps</C> has a row above; the layout types{" "}
        (<C>SmartGridItemDefinition</C>, <C>SmartGridSectionDefinition</C>,{" "}
        <C>SmartGridRowDefinition</C>, <C>SmartGridLayoutState</C>) are the shapes
        the two data views print.
      </>
    ),
  },
];

const KEYBOARD: KeyboardBinding[] = [
  {
    keys: ["Tab"],
    action: (
      <>
        One stop per tile, per column separator, per row-height handle and per
        section handle — all of them exist only while editing, and read-only mode
        removes them (:4268-4283,:4409-4419,:4681-4694,:3574-3575).
      </>
    ),
  },
  {
    keys: ["Enter", "Space"],
    action: (
      <>
        Lift the focused tile; the same two keys place it again (:2900-2904).
        Nothing stops their bubbling from a focused column handle, so activating a
        separator also lifts the tile behind it (:2926-2938).
      </>
    ),
  },
  {
    keys: ["←", "→"],
    action: (
      <>
        Move the <em>grabbed</em> tile within its row (:2906-2917), or nudge a
        focused column separator&rsquo;s span by one (:2705-2744). A tile that is
        not grabbed ignores the arrows.
      </>
    ),
  },
  {
    keys: ["↑", "↓"],
    action: (
      <>
        Move the grabbed tile between rows; reorder a section from its{" "}
        <C>⠿</C> handle (:3611-3622); resize a row from its height handle
        (:4672-4679).
      </>
    ),
  },
  {
    keys: ["Esc"],
    action: (
      <>
        Cancel the grab and put the pre-lift snapshot back, reporting the change
        (:2907-2910,:2826-2835). In the palette it closes it
        (SmartGridItemPalette.tsx:101-106); in a section title it abandons the
        rename (:3537-3549).
      </>
    ),
  },
  {
    keys: ["Ctrl", "Z"],
    action: (
      <>
        Undo — and <C>Ctrl+Shift+Z</C> redo, with <C>Cmd</C> accepted instead of{" "}
        <C>Ctrl</C>. The listener is on <C>window</C>, bound only while editing and
        only while <C>historyLimit</C> is above zero (:1560-1569).
      </>
    ),
  },
  {
    keys: ["Enter"],
    action: (
      <>
        In a section title, commit the rename — trimmed, or the translated untitled label — and blur
        commits too (:3529-3542).
      </>
    ),
  },
  {
    keys: ["Enter", "Space", "on a section handle"],
    action: (
      <>
        Nothing. The handle announces itself as a button (<C>role="button"</C>,{" "}
        <C>tabIndex={0}</C>, :3574-3575) but listens only for the arrows
        (:3611-3622), so a screen reader is told to activate a control that cannot
        be activated.
      </>
    ),
  },
  {
    keys: ["—"],
    action: (
      <>
        Nothing — and this one has no workaround. Removing a tile is possible only
        by dragging it onto the drop zone,
        it is driven by <C>onDrop</C> alone, and it is <C>aria-hidden</C>{" "}
        (:3319,:3343). Keyboard users can move, resize, undo and reset, but not
        delete.
      </>
    ),
  },
];

const SEMANTICS_CODE = `// Edit mode is where the buttons are; a viewer hears content.
<SmartGridLayout items={items} defaultLayout={layout} readOnly />
<SmartGridLayout items={items} defaultLayout={layout}
  isEditMode onEditModeChange={setEditing} />`;

const NARRATION_CODE = `// Every edit is spoken by one polite region (:3295-3302), and the
// same words are re-announced because a listener will not repeat them
// unless the text changes (:1157-1160).
announce(t("kit.smartgrid.lifted", { title }));   // "Active capsules lifted"
announce(t("kit.smartgrid.placed", { title }));   // "… placed"
announce(t("kit.smartgrid.moveCancelled"));        // Esc, restoring the snapshot`;

const I18N_CODE = `// Layer one word over the built-in catalog: resolution runs
// user → kit → en → key, so everything unnamed keeps its translation.
<I18nProvider catalogs={{ de: { "kit.smartgrid.done": "Fertig" } }}>
  <Dashboard />
</I18nProvider>`;

const RTL_CODE = `// There is no dir branch in this component — not one read of \`dir\`
// — so a mirrored page has to mirror the layout itself.
// Insertion is decided physically: getBoundingClientRect().left + width / 2
// (:1204-1212,:4303-4308), and the handles sit at \`left-full\` /
// \`left-1/2 -translate-x-1/2\` (:4416,:4618).`;

export const SmartGridLayoutPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
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
          In edit mode a tile <em>is</em> a button — <C>role="button"</C>, in the
          tab order, named by the item&rsquo;s title and described by the teaching
          hint &ldquo;press Enter to lift, then the arrow keys to move it&rdquo;
          (:4463-4478). Everything that happens is narrated through a single polite
          live region (:3295-3302): lifted, moved, placed, undone, redone, removed,
          reset, plus the quieter &ldquo;edge of row&rdquo; and &ldquo;top
          row&rdquo; when an arrow has nowhere left to go (:2860,:2876-2879).
        </p>
        <p>
          Two things a screen reader will not tell you are worth knowing from here.
          The lifted state is carried by <C>aria-grabbed</C> (:4270,:4465), an
          attribute deprecated in ARIA 1.0 that most screen readers ignore — the
          spoken <C>lifted</C>/<C>placed</C> pair is what actually communicates it.
          And read-only mode is the quiet one: the roles, the tab stops and the
          labels are all gated on edit mode (:4268-4283), so a viewer hears a list
          of tiles and nothing else.
        </p>
        <A11yCode filename="Semantics.tsx" code={SEMANTICS_CODE} />
        <A11yCode filename="Narration.ts" code={NARRATION_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          Dragging is not the only path — lifting, walking, placing, cancelling,
          resizing and undoing all have key equivalents. Two of the rows below say
          <em> nothing</em>, and they are the rows that matter: they are where this
          component has a keyboard affordance it does not implement.
        </p>
        <KeyboardSupportTable bindings={KEYBOARD} />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The chrome comes from the catalog: 56 keys under <C>kit.smartgrid.*</C>{" "}
          — toolbar labels, drop-zone copy, resize hints, the lift-and-place
          narration — shipped for en, es, fr, de and pt (en.ts:441-509, de.ts:418,
          fr.ts:420, es.ts:417, pt.ts:416), read through <C>useKitT</C> (:964).
          Resolution runs user → kit → en → key, so one override replaces one word
          and everything unnamed keeps the kit&rsquo;s translation.
        </p>
        <p>
          &ldquo;Everything it says&rdquo; is nearly true, and the exceptions are
          worth naming: the fallback tile title <C>Item</C> (:1166), the spacer
          tile&rsquo;s title <C>Spacer</C> (:3717) and the handle glyph{" "}
          <C>⠿</C> (:3625) are written in the file, and the tile boundary&rsquo;s
          &ldquo;This tile failed to render.&rdquo; plus the palette&rsquo;s footer
          sentence are written in their own components
          (SmartGridTileBoundary.tsx, SmartGridItemPalette.tsx:125-127). The
          layout itself is spatial data at <C>version: 3</C>, not language
          (:90-93).
        </p>
        <p>
          There is no right-to-left story. Nothing reads <C>dir</C>, the drop
          position is decided by <C>getBoundingClientRect().left</C> plus half the
          width (:1204-1212 — the arithmetic, not the file, is LTR), and the resize
          handles are pinned with <C>left-full</C> and{" "}
          <C>left-1/2 -translate-x-1/2</C> (:4416,:4618). A mirrored host gets a
          mirrored page and a left-to-right dashboard; the column order follows the
          writing mode, the insertion previews do not.
        </p>
        <A11yCode filename="CatalogOverride.tsx" code={I18N_CODE} />
        <A11yCode filename="Directionality.tsx" code={RTL_CODE} />
      </A11yTopic>

      <A11yTopic title="What the grid keeps for itself">
        <p>
          Several props the surface suggests are decided elsewhere.{" "}
          <C>readOnly</C> overrules whatever <C>isEditMode</C> says (:1285-1287); a{" "}
          <C>plain</C> variant overrules <C>surfaceTone</C> and the root padding
          (:992-1002); every toolbar and row button is <C>size=&quot;xs&quot;</C>{" "}
          (:3377,:3402,:3659,:4637) and every row icon button is{" "}
          <C>ghost</C> (:347-356); the palette is always <C>glass</C>/
          <C>sidebar</C> (:3468-3475); spacer tiles are blue regardless of{" "}
          <C>tone</C> (:4241). Spans and heights are clamped on the way in — a span
          to <C>1…maxColumns</C> (:484-487), a row to <C>1…12</C> (:662-665) — and
          section ids are slugged and de-duplicated with a <C>_1</C>, <C>_2</C>{" "}
          suffix, so two sections called &ldquo;Untitled&rdquo; do not collide
          (:457-474).
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable props={SMARTGRID_PROPS} />
  </div>
);

export default SmartGridLayoutPage;
