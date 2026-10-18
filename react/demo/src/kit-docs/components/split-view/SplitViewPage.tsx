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
import { SplitViewPlayground } from "./SplitViewPlayground";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import SubItems from "./examples/SubItems";
import subItemsCode from "./examples/SubItems.tsx?raw";
import Loaders from "./examples/Loaders";
import loadersCode from "./examples/Loaders.tsx?raw";

export const SplitViewPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
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
        title="Sub-items and the new-item dot"
        description="subContent expands a row in place; subItems renders structured child rows that carry the same hover-revealed overflow menu. With autoExpand=false a caret separates selecting from drilling in, and showHighlightIndicator={false} keeps a highlighted row's tint while dropping its pulsing dot."
        code={subItemsCode}
        filename="SubItems.tsx"
      >
        <SubItems />
      </ExampleCard>
      <ExampleCard
        title="Loaders"
        description="The three treatments, skeleton by default — shaped like the two panes so the list keeps its width and the layout does not jump when the data lands."
        code={loadersCode}
        filename="Loaders.tsx"
      >
        <Loaders />
      </ExampleCard>
      <ExampleCard
        title="Tones"
        description="Generated from the palette. The literal map aliased both neutral and stone to one object, so stone silently rendered neutral and border-l-stone-600 was never emitted."
        code={tonesCode}
        filename="Tones.tsx"
      >
        <Tones />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          A row is a real control — <C>role="button"</C>, Enter/Space, focus
          ring and all — and the active one carries <C>aria-current="true"</C>,
          so selection is announced, not just painted in the accent border.
          Disabled rows say <C>aria-disabled</C>. Sub-content carets report
          <C>aria-expanded</C>, the collapse chevron names itself, and the
          loading/error/empty messages are catalog strings. Honest limits: the
          list is a stack of buttons, not a <C>listbox</C> — the number of rows
          is not announced — and there are no arrow keys, so the list is walked
          with Tab.
        </p>
        <A11yCode filename="Semantics.tsx" code={SEMANTICS_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          Tab reaches every row, the search field, the expand carets, the
          collapse chevron and (when resizable) the divider — which is an ARIA
          separator with a keyboard story of its own. Enter or Space selects a
          row; when <code>autoExpand=&#123;false&#125;</code> that separates
          <em>selecting</em> from <em>drilling in</em>, and the caret is a
          second control with its own stop. The empty detail pane renders no tab
          stops beyond the list.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Everything built-in — the search placeholder, the loading label, the
          error pair with its Retry button, both empties, the collapse and
          expand labels — is catalog-resolved (<C>kit.splitview.*</C>, five
          locales), and a <code>searchPlaceholder</code> set by the caller still
          wins over the default. Rows, headers and detail content are the
          caller&rsquo;s and pass through untouched; want a whole new language?
          Layer <C>kit.splitview.*</C> keys in your own catalogs — the i18n page
          shows the override live.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "items",
          type: "SplitViewItem[]",
          description:
            "The rows: id, title, subtitle, optional subContent (in-place expand), highlight (accent tint + dot), disabled. Each row — and each sub-item — may carry a menu.",
        },
        {
          name: "items[].menu",
          type: "DropdownMenuOption[]",
          description:
            "Overflow entries for the row, opened from the three-dots button revealed on hover. Rendered through the kit DropdownMenu — viewport collision detection included.",
        },
        {
          name: "items[].subItems",
          type: "SplitViewItem[]",
          description:
            "Structured child rows under an expanded row — with a lighter hover tint than the parent and the same menu affordance as any row.",
        },
        {
          name: "items[].onClick",
          type: "(item) => void",
          description:
            "Makes a sub-item row its own button and fires on click. Top-level rows select through onChange instead.",
        },
        {
          name: "menuVisibility",
          type: '"hover" | "always"',
          default: '"hover"',
          description:
            "Whether the rows\' three-dots buttons sit in the rail permanently or appear on hover (they always stay visible while their menu is open).",
        },
        {
          name: "onMenuSelect",
          type: "(item, option) => void",
          description:
            "Fired for any option picked in a row's or sub-row's menu.",
        },
        {
          name: "value / defaultValue / onChange",
          type: "string / string / (id, item) => void",
          description:
            "Controlled or self-owned selection; onChange reports the item, not just the id.",
        },
        {
          name: "listTitle / listActions",
          type: "ReactNode",
          description:
            "Label above the rows (a count in the title is conventional — LIBRARIES (3)) and buttons beside the search field.",
        },
        {
          name: "searchPlaceholder / searchVariant",
          type: "string / InputVariant",
          description: (
            <>
              The placeholder defaults to <C>kit.splitview.search</C>; the
              field&rsquo;s surface defaults from <C>variant</C> so it belongs
              to its pane.
            </>
          ),
        },
        {
          name: "listWidth",
          type: "string",
          description:
            "A Tailwind width class, or the initial px value when resizable.",
        },
        {
          name: "variant",
          type: "SurfaceVariant",
          default: "elevated",
          description:
            "The Panel surface family, elevated as everywhere else. The list pane tints translucently over the variant rather than filling it.",
        },
        {
          name: "surfaceTone",
          type: 'TrueColor | "auto"',
          default: "neutral",
          description: (
            <>
              Tone of the <em>surface</em>; <code>"auto"</code> follows the
              accent. It always paints the divider between the panes, and
              colours the surface with whatever treatment the variant has for a
              tone — tinted fill, glass wash, coloured rule — except{" "}
              <code>elevated</code> (white by design) and <code>default</code>,
              whose rim is deliberately tone-free.
            </>
          ),
        },
        {
          name: "tone",
          type: "TrueColor",
          default: "blue",
          description:
            "Accent for the active row, resizer and search focus. `color` is its deprecated alias.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: '"md"',
          description:
            "The shared control scale (xs → xl): row padding and type. The built-in empty/error states follow the shared pane map, so they stay quieter than the panes' own chrome.",
        },
        {
          name: "collapsible / collapsed / defaultCollapsed / onCollapsedChange",
          type: "boolean flags + (b) => void",
          description:
            "Shrink the list to a chevron rail; controlled or self-owned, reported either way.",
        },
        {
          name: "resizable / minListWidth / maxListWidth",
          type: "boolean / number / number",
          default: "false / 180 / 75%",
          description:
            "Drag the divider; the separator announces the width and takes arrow keys.",
        },
        {
          name: "panelHeader / panelHeaderProps",
          type: "ReactNode | fn",
          description:
            "Above the detail pane — static or derived per active item; panelHeaderProps (dynamic PageHeader-like slots) takes precedence.",
        },
        {
          name: "emptyState / panelEmptyState",
          type: "ReactNode",
          description: (
            <>
              No rows match the filter / nothing is selected — both default to
              tone-aware EmptyStates; <C>null</C> renders nothing at all.
            </>
          ),
        },
        {
          name: "loading / loaderType / loadingProgress / loadingState",
          type: "boolean / skeleton|spinner|progress / 0–100 / ReactNode",
          default: "— / skeleton",
          description:
            "The skeleton is shaped like the two panes, so the layout does not jump when data lands.",
        },
        {
          name: "error / errorState / onRetry",
          type: "ReactNode / ReactNode / () => void",
          description:
            "A string error becomes the EmptyState subtitle; onRetry adds the translated Retry action.",
        },
        {
          name: "autoExpand",
          type: "boolean",
          default: "true",
          description: (
            <>
              false splits select from drill: rows only highlight, and the
              row&rsquo;s caret — the <C>aria-expanded</C> control — opens the
              detail.
            </>
          ),
        },
        {
          name: "showHighlightIndicator",
          type: "boolean",
          default: "true",
          description:
            "The pulsing dot on highlighted rows. Off keeps the accent tint and drops the notification cue.",
        },
        {
          name: "expandedValue / onExpand",
          type: "string / (id, item) => void",
          description:
            "Controlled expansion — only meaningful with autoExpand={false}, where the caret owns it.",
        },
        {
          name: "panelScrollable",
          type: "boolean",
          default: "true",
          description:
            "false hands overflow to panels that manage their own scroll (sticky-header tables), avoiding double scrollbars.",
        },
        {
          name: "borderLeft / className / listClassName / panelClassName",
          type: "string",
          description:
            "A hairline from adjacent chrome (a side menu, say) and per-part class passthroughs.",
        },
      ]}
    />
  </div>
);

const SEMANTICS_CODE = `// Rows are buttons with current-state; carets are separate controls.
<div role="button" tabIndex={0} aria-current="true">…</div>   // active row
<button aria-expanded={open} aria-label="Collapse details" /> // caret`;

export default SplitViewPage;
