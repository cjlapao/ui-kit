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
import { SplitViewPlayground } from "./SplitViewPlayground";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";
import SubItems from "./examples/SubItems";
import subItemsCode from "./examples/SubItems.tsx?raw";
import Loaders from "./examples/Loaders";
import loadersCode from "./examples/Loaders.tsx?raw";

/**
 * Every row here was read out of `SplitView.tsx`. Five of them say so out loud
 * because the component disagrees with itself: `surfaceTone` opens at `"none"`
 * where its JSDoc promises `"neutral"` (:211 vs :450), `raisedSurface` is
 * documented as reaching the body Panel and there is no body Panel (:311,:1526-1533),
 * `autoHideList` is read only as a term its neighbour already implies
 * (:233-234,:579), `items[].tags` is declared and never rendered (:123), and a
 * row's `actions` have no keyboard route to them at all (:1286-1292).
 */
export const SPLITVIEW_PROPS: PropDoc[] = [
  {
    name: "items",
    type: "SplitViewItem[]",
    description: (
      <>
        The rows — required. A row is <C>{"{id, label, subtitle, icon, panel}"}</C>{" "}
        plus whatever it carries: <C>menu</C>, <C>actions</C>, <C>badges</C>,{" "}
        <C>highlight</C>, <C>disabled</C>, <C>hidden</C>, <C>subItems</C>,{" "}
        <C>subContent</C>, <C>onClick</C> (:85-129). <C>id</C> is what{" "}
        <C>value</C> matches and what <C>onChange</C> reports.
      </>
    ),
  },
  {
    name: "items[].panel",
    type: "ReactNode",
    description: (
      <>
        The detail body for that row. With none, the row still selects and the pane
        falls through to <C>panelEmptyState</C> — which is what that prop is for
        when something is selected (:1532).
      </>
    ),
  },
  {
    name: "items[].hidden",
    type: "boolean",
    description: (
      <>
        Filtered out of <C>visibleItems</C> before anything else reads the array
        (:573), so a hidden row cannot be reached by search or click — and because
        the active row is looked up in that filtered list, <C>value</C> naming a
        hidden id selects nothing and the pane shows the no-selection state (:669).
      </>
    ),
  },
  {
    name: "items[].disabled",
    type: "boolean",
    description: (
      <>
        <C>aria-disabled</C>, <C>tabIndex=&#123;-1&#125;</C>, <C>pointer-events-none</C>{" "}
        and a muted surface (:1189-1204) — and the handler drops the click as well,
        so the guard does not depend on the CSS being applied (:677,:1190).
      </>
    ),
  },
  {
    name: "items[].menu",
    type: "DropdownMenuOption[]",
    description: (
      <>
        <C>{"{label, value, description?, icon?, disabled?, danger?}"}</C>{" "}
        (DropdownMenu.tsx:18-25, accepted at :111), opened from the
        row&rsquo;s three-dots button. That button is <C>opacity-0</C> until the row is
        hovered <em>or</em> focused inside it, so Tab does find it (:542-552).
      </>
    ),
  },
  {
    name: "items[].actions",
    type: "ReactNode",
    description: (
      <>
        Custom buttons on the right of a row, revealed by{" "}
        <C>group-hover/item</C> only — there is no <C>focus-within</C> in that class
        list, unlike the overflow menu&rsquo;s wrapper, so nothing on a keyboard ever
        makes them visible or reachable (:1286-1292). In detail-only mode they are
        promoted into the header instead, where they are painted and clickable
        (:753-760,:883).
      </>
    ),
  },
  {
    name: "items[].subItems",
    type: "SplitViewItem[]",
    description: (
      <>
        Structured child rows under an expanded parent. A child renders as a{" "}
        <C>button</C> only when it has an <C>onClick</C>; without one it is a plain{" "}
        <C>div</C> — no role, no <C>tabIndex</C>, unreachable by keyboard, however
        clickable it looks (:1411-1419).
      </>
    ),
  },
  {
    name: "items[].subContent",
    type: "ReactNode",
    description: (
      <>
        Anything, expanded in place under the parent row. With{" "}
        <C>autoExpand=&#123;false&#125;</C> it is also what earns the row a caret —
        the caret&rsquo;s condition is <C>subContent !== undefined</C>, not{" "}
        <C>subItems</C> (:1183-1184,:1315-1327).
      </>
    ),
  },
  {
    name: "items[].badges",
    type: "SplitViewItemBadge[]",
    description: (
      <>
        <C>{"{label, tone?, variant?}"}</C> (:79-83); a missing tone is{" "}
        <C>&quot;sky&quot;</C> and a missing variant <C>&quot;soft&quot;</C>{" "}
        (:702-720). Unlike the header&rsquo;s tags, these do render.
      </>
    ),
  },
  {
    name: "value / defaultValue / onChange",
    type: "string / string / (id, item) => void",
    description: (
      <>
        Controlled or self-owned selection. With neither, the first{" "}
        <em>visible</em> row is selected on mount (:581-583). Passing <C>value</C> pins
        the picture — <C>setInternalValue</C> is skipped — but <C>onChange</C> keeps
        firing on every click, so a controlled list still reports the rows the reader
        activated (:584,:677-683).
      </>
    ),
  },
  {
    name: "onMenuSelect",
    type: "(item, option) => void",
    description: (
      <>
        Fires for any option picked in a row&rsquo;s or sub-row&rsquo;s menu (:183).
        It is the only signal the menus give; the entries themselves are data.
      </>
    ),
  },
  {
    name: "listTitle / listActions",
    type: "ReactNode",
    description: (
      <>
        An <C>&lt;h3&gt;</C> above the rows and buttons beside the search field
        (:1123-1146). Both are inside the list&rsquo;s header row, so{" "}
        <C>collapsible</C> with the list folded hides them — the rail keeps only its
        expand button (:1107-1119).
      </>
    ),
  },
  {
    name: "searchPlaceholder",
    type: "string",
    description: (
      <>
        Overrides the catalog&rsquo;s <C>kit.splitview.search</C> (:1157). The search
        matches <C>label</C> and <C>subtitle</C> only, and only when they are strings
        — a row whose label is an element can never be found by it (:656-663).
      </>
    ),
  },
  {
    name: "searchVariant",
    type: "InputVariant",
    description: (
      <>
        The field&rsquo;s own surface. Unset, a table maps it from <C>variant</C>:
        glass and liquid-glass to <C>glass</C>, the tone-carrying variants to{" "}
        <C>ghost</C>, and <C>none</C>/<C>outlined</C>/<C>simple</C>/<C>default</C> to{" "}
        <C>flat</C> — so <C>outlined</C> does <em>not</em> give you an outlined field
        (:67-77,:570-571).
      </>
    ),
  },
  {
    name: "menuVisibility",
    type: '"hover" | "always"',
    default: '"hover"',
    description: (
      <>
        <C>&quot;always&quot;</C> pins the dots buttons at <C>opacity-100</C>;{" "}
        <C>&quot;hover&quot;</C> leaves them hidden until the row is hovered or their
        own menu has focus (:542-552).
      </>
    ),
  },
  {
    name: "showHighlightIndicator",
    type: "boolean",
    default: "true",
    description: (
      <>
        The pulsing dot on <C>highlight</C>ed rows; the dot is <C>animate-pulse</C>{" "}
        unless the row is the active one, and turning this off keeps the tint without
        the cue (:1294-1302).
      </>
    ),
  },
  {
    name: "collapsible / collapsed / defaultCollapsed / onCollapsedChange",
    type: "boolean flags + (b) => void",
    description: (
      <>
        Fold the list to a 48px rail (:890-894). <C>collapsed</C> is controlled, so a
        page that sets it without <C>onCollapsedChange</C> has a rail that answers
        nothing (:598-609). The two IconButtons&rsquo; <C>tooltip</C> strings —{" "}
        <C>&quot;Expand View&quot;</C>, <C>&quot;Collapse View&quot;</C> — are
        hardcoded English even though their <C>aria-label</C> is a catalog string
        (:1110-1118,:1138-1145).
      </>
    ),
  },
  {
    name: "resizable / minListWidth / maxListWidth",
    type: "boolean / number / number",
    default: "false / 180 / 75%",
    description: (
      <>
        The divider becomes a <C>role=&quot;separator&quot;</C> from{" "}
        <C>useResizable</C>, with <C>aria-valuenow/min/max</C> and arrow keys that
        step 20px (useResizable:106-136). <C>maxListWidth</C> wins outright when set;
        otherwise the cap is 75% of the container&rsquo;s <C>offsetWidth</C> — or 600
        when there is nothing to measure, which is what a jsdom test sees
        (:614-621,:635).
      </>
    ),
  },
  {
    name: "listWidth",
    type: "string",
    description: (
      <>
        A Tailwind class while the divider is fixed (<C>w-72</C> otherwise,:699-700),
        a pixel value once it is <C>resizable</C>: the seed runs through{" "}
        <C>parseInt</C> and falls back to 288 when it reads NaN, so{" "}
        <C>&quot;w-96&quot;</C> opens the pane at 288px whatever it looks like
        (:622-623,:632-636).
      </>
    ),
  },
  {
    name: "variant",
    type: "SplitViewVariant",
    default: '"elevated"',
    description: (
      <>
        The <C>Panel</C> surface family, by alias — <C>SPLIT_VIEW_VARIANTS</C> is{" "}
        <C>SURFACE_VARIANTS</C> itself (:51,:449). The list pane tints translucently
        over it rather than filling it.
      </>
    ),
  },
  {
    name: "surfaceTone",
    type: 'SurfaceTone | "auto"',
    default: '"none" (:450), not the "neutral" its JSDoc announces (:211)',
    description: (
      <>
        Tone of the <em>surface</em>, kept apart from <C>tone</C>, the accent;{" "}
        <C>&quot;auto&quot;</C> copies the accent (:487-488). The comment argues for
        grey and the code ships untoned — pick one deliberately rather than by
        omission.
      </>
    ),
  },
  {
    name: "tone",
    type: "TrueColor",
    default: '"blue"',
    description: (
      <>
        Accent for the active row, the resizer, the search focus and every built-in
        state. <C>color</C> is its deprecated alias and both are read in one line:{" "}
        <C>tone ?? color ?? &quot;blue&quot;</C> (:195-196,:485).
      </>
    ),
  },
  {
    name: "size",
    type: "ControlSize",
    default: '"md"',
    description: (
      <>
        The shared scale, <C>xs</C> → <C>xl</C> (:43,:452): row padding, icon size and
        type. The built-in search downshifts it a step (<C>lg</C> becomes{" "}
        <C>md</C>,:1161) and the built-in empty/error states inherit their own quieter
        scale from it (:519-520).
      </>
    ),
  },
  {
    name: "raisedSurface",
    type: "boolean",
    default: "false",
    description: (
      <>
        Documented as forwarded &ldquo;to the body Panel&rdquo; (:311) — the detail
        body is a plain <C>div</C> with an overflow class (:1526-1533), so the only{" "}
        <C>Panel</C> it reaches is the header-details one (:830).
      </>
    ),
  },
  {
    name: "borderLeft",
    type: "boolean",
    default: "false",
    description: "A hairline on the container, for a SplitView butted against a side menu (:300-301,:1004,:1068).",
  },
  {
    name: "panelHeader / panelHeaderProps",
    type: "ReactNode | (item) => ReactNode / SplitViewPanelHeaderProps | (item) => …",
    description: (
      <>
        Above the detail pane: <C>{"{icon, title, subtitle, actions, body, search, bottomActions, headerDetails, helper}"}</C>, and every one of those may also be a function of the active row (:128,:153-175,:722-730).{" "}
        <C>panelHeaderProps</C> wins outright — setting both is not a merge, the
        custom node is simply never rendered (:875-879).
      </>
    ),
  },
  {
    name: "panelHeaderProps.headerDetails",
    type: "SplitViewHeaderDetails",
    description: (
      <>
        <C>{"{title, subtitle, description, tags}"}</C> (:130-135) rendered as a
        details block in the header (:817-860). It is the only place a row list of
        tags paints: <C>items[].tags</C> is declared (:123) and read nowhere in the
        component.
      </>
    ),
  },
  {
    name: "emptyState",
    type: "ReactNode",
    description: (
      <>
        The list when the filter matches nothing. Its fallback is the hardcoded
        English <C>&quot;No items found&quot;</C> (:1177) — not the catalog pair{" "}
        <C>noItems</C>/<C>noItemsSubtitle</C> that the detail pane&rsquo;s fallback
        uses (:1046-1047).
      </>
    ),
  },
  {
    name: "panelEmptyState",
    type: "ReactNode | null",
    description: (
      <>
        No row selected: an EmptyState on <C>kit.splitview.noSelection</C> /{" "}
        <C>noSelectionSubtitle</C> (:1538-1547). Also the fallback for a selected row
        with no <C>panel</C> (:1532). <C>null</C> renders an empty pane rather than a
        message (:1536).
      </>
    ),
  },
  {
    name: "loading / loaderType / loadingProgress / loadingState",
    type: "boolean / skeleton | spinner | progress / 0–100 / ReactNode",
    default: "false / \"skeleton\"",
    description: (
      <>
        <C>skeleton</C> <em>replaces</em> both panes and is <C>aria-hidden</C>, with no
        polite region anywhere saying the view is loading (:909-935,:994); the other
        two cover the content with a blur (:945-962). <C>loadingProgress</C> is handed
        straight to <C>Loader</C> with no default of its own (:957), and{" "}
        <C>loadingState</C> replaces whichever one would have drawn (:951).
      </>
    ),
  },
  {
    name: "error / errorState / onRetry",
    type: "ReactNode / ReactNode / () => void",
    description: (
      <>
        Any truthy <C>error</C> paints a covering EmptyState; a <em>string</em>{" "}
        becomes its subtitle, anything else falls back to{" "}
        <C>kit.splitview.errorSubtitle</C> (:966-979). <C>onRetry</C> is what puts the
        translated Retry button there at all (:980) — without it the reader has a
        message and no way out.
      </>
    ),
  },
  {
    name: "autoExpand / expandedValue / onExpand",
    type: "boolean / string / (id, item) => void",
    description: (
      <>
        <C>autoExpand=&#123;false&#125;</C> splits selecting from drilling: a row click
        only paints the accent and the caret opens the pane (:684-688,:1320-1328).{" "}
        <C>expandedValue</C> and <C>onExpand</C> only mean something in that mode, and
        the caret is drawn only for a row with <C>subContent</C> (:1183-1184).
      </>
    ),
  },
  {
    name: "panelScrollable",
    type: "boolean",
    default: "true",
    description: (
      <>
        <C>false</C> switches the detail body from <C>overflow-y-auto</C> to{" "}
        <C>overflow-hidden</C> for content that scrolls itself — in both the detail
        pane and the single-item view (:1034,:1529).
      </>
    ),
  },
  {
    name: "autoHideList",
    type: "boolean",
    default: "true (:454)",
    description: (
      <>
        Deprecated and inert: it is read (:579) as the middle term of{" "}
        <C>shouldHideList</C>, but the term beside it already tests{" "}
        <C>visibleItems.length === 1</C> (:574,:578), so no value of this prop can
        change the outcome. One visible row is detail-only on its own
        (:880-887,:1017-1039), and <C>visibleItems</C> has already dropped hidden
        rows by then (:573).
      </>
    ),
  },
  {
    name: "className / listClassName / panelClassName",
    type: "string",
    description: (
      <>
        Per-part passthroughs (:252-257,:1104,:1518). The component emits no{" "}
        <C>data-*</C> hook of its own, so these are the only handles a test has on the
        parts.
      </>
    ),
  },
  {
    name: "…",
    type: "—",
    description: (
      <>
        What is left is declared and never read. On a row: <C>tags</C> (:123) —
        nothing renders it, only <C>headerDetails.tags</C> does (:781,:857-860). On a
        child row: <C>icon</C>, <C>subtitle</C>, <C>badges</C> and <C>panel</C> are all
        ignored, because a sub-row renders <C>label</C> and consults{" "}
        <C>onClick</C>, <C>disabled</C> and <C>menu</C> and nothing else
        (:1411-1446). Among the top-level props the rows above already carry{" "}
        <C>defaultValue</C>, <C>onChange</C>, <C>color</C>, <C>defaultCollapsed</C>{" "}
        and <C>errorState</C>; nothing else in <C>SplitViewProps</C> (:176-325)
        changes what renders.
      </>
    ),
  },
];

const KEYBOARD: KeyboardBinding[] = [
  {
    keys: ["Tab"],
    action: (
      <>
        Every row is its own stop, plus the search field, each row&rsquo;s overflow
        button, the sub-content caret and the collapse button. There is no roving
        tabindex, so a 200-row list is 200 stops (:1188-1204).
      </>
    ),
  },
  {
    keys: ["Enter", "Space"],
    action: (
      <>
        On a focused row, selects it — the row is <C>role=&quot;button&quot;</C> with
        its own <C>onKeyDown</C> (:1196-1204). A child row answers them only when it
        has an <C>onClick</C>; the other half of that branch is a <C>div</C> that
        cannot be focused (:1411-1419).
      </>
    ),
  },
  {
    keys: ["ArrowRight", "ArrowLeft"],
    action: (
      <>
        Only with <C>resizable</C>, and only on the focused separator: ±20px, clamped
        by <C>minListWidth</C> and the 75% cap (useResizable:106-111). No other key is
        handled — there is no Home, no End, and no arrow navigation between rows.
      </>
    ),
  },
  {
    keys: ["Enter"],
    action: (
      <>
        In the search field, commits the term immediately instead of waiting out the
        400ms debounce (SearchBar.tsx:142,:257-261).
      </>
    ),
  },
  {
    keys: ["Escape"],
    action: (
      <>
        In the search field, clears it (SearchBar.tsx:252-256). In an open row menu,{" "}
        <C>Escape</C> closes that menu and hands focus back to its dots button
        (DropdownMenu.tsx:160,:119,:204). Nothing here closes the list or the pane.
      </>
    ),
  },
  {
    keys: ["ArrowUp", "ArrowDown", "Home", "End"],
    action: (
      <>
        Inside an open row menu only — the kit <C>DropdownMenu</C> owns them
        (DropdownMenu.tsx:241-253). The row list itself has no arrow-key contract.
      </>
    ),
  },
  {
    keys: ["Mouse"],
    action: (
      <>
        A row&rsquo;s <C>actions</C> are <C>opacity-0</C> under{" "}
        <C>group-hover/item</C> with no focus reveal, so they are a mouse-only feature
        as shipped (:1286-1292). The overflow dots, by contrast, also reveal on{" "}
        <C>focus-within</C> (:547).
      </>
    ),
  },
];

const SEMANTICS_CODE = `// A row is a button with current-state; the caret is its own control.
<div role="button" tabIndex={0} aria-current="true" aria-disabled={false}>…</div>
<button aria-expanded={open} aria-label="Collapse details" />   // :1315-1327
<div role="separator" tabIndex={0} aria-orientation="vertical"
     aria-valuenow={288} aria-valuemin={180} aria-valuemax={600} /> // resizable

// There is no listbox, no aria-selected and no aria-live anywhere in it.`;

const I18N_CODE = `// Fourteen keys, five locales — common/i18n/builtIn/{en,de,fr,es,pt}.ts:418-434
kit.splitview.moreOptions      // the dots button's tooltip + aria-label (:559-560)
kit.splitview.search           // the placeholder, only when none is passed (:1157)
kit.splitview.expandList       // the rail's aria-label — its tooltip is hardcoded (:1110)
kit.splitview.collapseList     // ditto (:1138)
kit.splitview.expandDetails    // the sub-content caret's aria-label (:1318-1326)
kit.splitview.collapseDetails
kit.splitview.retry            // the error EmptyState's action label (:980)
kit.splitview.errorTitle / .errorSubtitle / .loading / .pleaseWait
kit.splitview.noItems / .noItemsSubtitle / .noSelection / .noSelectionSubtitle`;

export const SplitViewPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Split View"
      description="A searchable list beside a detail pane, optionally collapsible and drag-resizable. It takes the same surface family as Panel, the built-in search follows that surface, and rows can carry sub-items that expand in place. With a single visible item it drops the list entirely and shows the detail alone."
    />
    <SplitViewPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Variants"
        description="The Panel surface family. The list pane is tinted translucently rather than filled, so it composites over the variant instead of replacing it — the detail pane used to be a bare bg-white with no dark-mode partner."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Tones"
        description="Generated from the palette. The literal map aliased both neutral and stone to one object, so stone silently rendered neutral and border-l-stone-600 was never emitted."
        code={tonesCode}
        filename="Tones.tsx"
      >
        <Tones />
      </ExampleCard>
      <ExampleCard
        title="Sub-items and the new-item dot"
        description="subContent expands a row in place; subItems renders structured child rows that carry the same hover-revealed overflow menu. With autoExpand=false a caret separates selecting from drilling in, and showHighlightIndicator={false} keeps a highlighted row's tint while dropping its pulsing dot."
        code={subItemsCode}
        filename="SubItems.tsx"
      >
        <SubItems />
      </ExampleCard>
      <ExampleCard
        title="Loaders"
        description="The three treatments, skeleton by default — shaped like the two panes so the list keeps its width and the layout does not jump when the data lands. The other two are overlays over a measured layout that is still there underneath."
        code={loadersCode}
        filename="Loaders.tsx"
      >
        <Loaders />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          A row is a real control — <C>role=&quot;button&quot;</C> with{" "}
          <C>tabIndex</C>, Enter and Space, and the active one carries{" "}
          <C>aria-current=&quot;true&quot;</C> (:1188-1204,:1192). There is no{" "}
          <C>role=&quot;listbox&quot;</C>, no <C>aria-selected</C> and no count, so a
          screen reader hears a wall of buttons and infers nothing about the shape of
          the list. <C>aria-disabled</C> is honest about disabled rows (:1191); the
          carets and the collapse buttons name themselves from the catalog
          (:1110-1118,:1315-1327); the separator announces its width to the tenth
          pixel (:1490). What nothing announces is loading: the skeleton is{" "}
          <C>aria-hidden</C> and there is no polite region anywhere (:910,:994), and a
          filter that empties the list changes text in a plain <C>div</C> (:1177).
        </p>
        <A11yCode filename="Semantics.tsx" code={SEMANTICS_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          Tab reaches the whole component and nothing navigates within it: the list is
          one stop per row, the divider is reachable when <C>resizable</C>, and every
          arrow-key story is somebody else&rsquo;s — the separator&rsquo;s belongs to{" "}
          <C>useResizable</C>, the menu&rsquo;s to <C>DropdownMenu</C>, the search
          field&rsquo;s to <C>SearchBar</C>. Two things are keyboard-unreachable as
          shipped: a row&rsquo;s <C>actions</C>, and any child row without an{" "}
          <C>onClick</C>.
        </p>
        <KeyboardSupportTable bindings={KEYBOARD} />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Fourteen <C>kit.splitview.*</C> keys carry the built-in chrome across the
          five shipped catalogs (<C>common/i18n/builtIn/&#123;en,de,fr,es,pt&#125;.ts</C>,
          en :418-434): the search placeholder, the dots button&rsquo;s label, the two
          caret labels, the collapse pair&rsquo;s <C>aria-label</C>, the loading pair
          and the error pair, Retry, and both empty states. Resolution runs through{" "}
          <C>useKitT</C>, so a catalog layer over those keys restates the component in
          any language. Three strings escape it: the two collapse{" "}
          <C>tooltip</C>s — <C>&quot;Expand View&quot;</C> and{" "}
          <C>&quot;Collapse View&quot;</C> — are written inline (:1110,:1138) and are
          what a mouse user sees, and <C>&quot;No items found&quot;</C> is the{" "}
          <C>emptyState</C> fallback (:1177), bypassing the catalog entries that do
          exist for it. Rows, headers and detail bodies are the consumer&rsquo;s and
          pass through untouched.
        </p>
        <A11yCode filename="i18n.ts" code={I18N_CODE} />
      </A11yTopic>
    </A11ySection>

    <PropsTable props={SPLITVIEW_PROPS} />
  </div>
);

export default SplitViewPage;
