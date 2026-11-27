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
import { TagPanelPlayground } from "./TagPanelPlayground";
import Overflow from "./examples/Overflow";
import overflowCode from "./examples/Overflow.tsx?raw";

export const TAGPANEL_PROPS: PropDoc[] = [
  {
    name: "tags",
    type: "TagPanelTag[]",
    description: (
      <>
        Required. Each entry is read for <C>label</C> plus optional <C>tone</C>{" "}
        (default <C>"neutral"</C>, :24-25 — not Pill&rsquo;s own{" "}
        <C>"blue"</C>, Pill.tsx:128), <C>variant</C> (default{" "}
        <C>"soft"</C>, :26-27), <C>size</C> (falls back to the panel&rsquo;s{" "}
        <C>tagSize</C>, :28-29), <C>icon</C> (:30-31) and <C>children</C>{" "}
        (falls back to <C>label</C>, :210). <C>id</C> is the React key, falling
        back to <C>label-i</C> (:255,:305). Anything else on the entry is never
        read.
      </>
    ),
  },
  {
    name: "title / subtitle",
    type: "ReactNode",
    description: (
      <>
        The header, drawn by <C>Section</C> (:217-224). The gate is{" "}
        <C>title != null</C> (:216), so omitting <C>title</C> hides the header
        while <C>title=&quot;&quot;</C> still draws one — an empty string is not
        an omission here.
      </>
    ),
  },
  {
    name: "tagLimit",
    type: "number",
    default: "5",
    description: (
      <>
        Pills shown before the <C>+N</C> chip folds the rest (:96,:139).{" "}
        <C>0</C> — or any limit at or above the count — shows everything and
        draws no chip at all (:44,:139).
      </>
    ),
  },
  {
    name: "overflowTone",
    type: "TrueColor",
    default: '"neutral"',
    description: (
      <>
        The chip&rsquo;s own tone (:97,:285). With no chip there is nothing to
        tone, and the number it carries is in the accessible name, not the
        colour (:271-277).
      </>
    ),
  },
  {
    name: "tagSize",
    type: "PillSize",
    default: '"sm"',
    description: (
      <>
        The pills&rsquo; scale (:102). Separate from <C>size</C>, which is the
        header&rsquo;s: the two were one prop until a <C>SectionSize</C> reached
        a Pill reading a <C>PillSize</C> (:57-63). A tag with its own{" "}
        <C>size</C> wins (:207).
      </>
    ),
  },
  {
    name: "size",
    type: "SectionSize",
    default: '"md" (from Section)',
    description: (
      <>
        Header padding and font size. TagPanel passes it through unset
        (:101,:221), so the default is <C>Section</C>&rsquo;s (Section.tsx:127) —
        and it also picks the empty state&rsquo;s scale through{" "}
        <C>PANE_EMPTY_STATE_SIZE</C> (:245, Theme.ts:1690-1696: <C>md</C>{" "}
        becomes <C>xs</C>).
      </>
    ),
  },
  {
    name: "variant",
    type: "SectionVariant",
    default: '"uppercase" (from Section)',
    description: (
      <>
        Header style — <C>default</C>, <C>subtle</C>, <C>uppercase</C>,{" "}
        <C>bordered</C>, <C>filled</C> (Section.tsx:8-19, default at :128).
      </>
    ),
  },
  {
    name: "noPadding",
    type: "boolean",
    default: "false",
    description: (
      <>
        Header padding off (:70-71,:223; <C>Section</C> then uses{" "}
        <C>px-0 pt-0 pb-0</C>, Section.tsx:149).
      </>
    ),
  },
  {
    name: "actions",
    type: "ReactNode",
    description: (
      <>
        Right side of the header. Handed straight to <C>Section</C> (:54,:220) —
        the panel adds nothing, and with no header it has nowhere to go.
      </>
    ),
  },
  {
    name: "emptyState",
    type: "ReactNode",
    description: (
      <>
        Replaces the default empty block entirely, copy included (:50,:242). The
        default is an <C>EmptyState variant=&quot;plain&quot;</C> at the shared
        pane scale (:243-247).
      </>
    ),
  },
  {
    name: "emptyMessage",
    type: "string",
    default: 't("kit.tagpanel.empty") — "No tags"',
    description: (
      <>
        Read with <C>??</C>, not <C>||</C> (:246): the translated copy is the
        fallback only for <C>undefined</C>, so <C>emptyMessage=&quot;&quot;</C>{" "}
        renders an <C>EmptyState</C> with no title at all.
      </>
    ),
  },
  {
    name: "className / bodyClassName",
    type: "string / string",
    description: (
      <>
        The root, a plain flex column (:67,:215), and the pill row (:69,:233-236).
        Both land as written — unlike <C>Panel</C>, this component owns neither.
      </>
    ),
  },
  {
    name: "…no others",
    type: "—",
    description: (
      <>
        That is the whole API. <C>TagPanel</C> forwards nothing to{" "}
        <C>Section</C> beyond the six it names (:217-224) and nothing to{" "}
        <C>Pill</C> beyond the per-tag fields (:203-212), so a prop outside this
        table does nothing at all.
      </>
    ),
  },
];

const KEYBOARD: KeyboardBinding[] = [
  {
    keys: ["Tab", "Shift+Tab"],
    action: (
      <>
        One stop for the whole panel: the <C>+N</C> chip — and only when there is
        a fold. The pills are <C>span</C>s around a Pill that renders a{" "}
        <C>span</C> (Pill.tsx:201), and the <C>role=&quot;group&quot;</C> region
        is not focusable (:228-237).
      </>
    ),
  },
  {
    keys: ["Enter", "Space"],
    action: (
      <>
        Toggle the fold. The chip is a real <C>button</C> with{" "}
        <C>type=&quot;button&quot;</C> (:266-268), so this is the browser, not the
        kit — and it never submits an enclosing form.
      </>
    ),
  },
  {
    keys: ["←", "→"],
    action: (
      <>
        Nothing. There is no key handling in the component at all —{" "}
        <C>onKeyDown</C> does not appear in its 321 lines — and a fold has no
        inside to move through.
      </>
    ),
  },
  {
    keys: ["Home", "End"],
    action: (
      <>
        Nothing either: no roving tabindex, no list to walk. The pills are
        decoration, not options.
      </>
    ),
  },
  {
    keys: ["Esc"],
    action: (
      <>
        Nothing: an open fold stays open. Only the chip closes it, and closing is
        not instant — the layout is held 300ms while the pills step away
        (:148-155, Theme.ts:1685).
      </>
    ),
  },
];

const SEMANTICS_CODE = `// The chip is one control for both directions, and the
// collapsed pills are mounted for the cascade but out of the tree.
<TagPanel title="Labels" tags={tags} tagLimit={5} />;

// which is, spelled out (:228-297):
<div role="group" aria-label="Tags" id="…">   // useId, :109,:232
  <span>…visible pills…</span>
  <button type="button" aria-expanded={false} aria-controls="…"
          aria-label="Show 3 more tags">
    <Pill tone="neutral">+3</Pill>            // the glyph is aria-hidden
  </button>
  <span aria-hidden="true">…folded pills…</span>
</div>`;

const RTL_CODE = `// The row is flex, so the *flow* mirrors; the fold's
// geometry is physical, so the cascade does not.
<div dir="rtl">
  <TagPanel title="التسميات" tags={arabicTags} tagLimit={3} />
</div>`;

const CONTROLLED_CODE = `// There is nothing to control: the fold is internal.
const [open, setOpen] = useState(false);
<TagPanel tags={tags} tagLimit={3} /* no expanded, no onExpandedChange */ />;
// …so a test that clicks the chip has to wait out the 300ms retract
// before the condensed geometry commits (:148-155).`;

export const TagPanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Tag Panel"
      description="A titled group of pills with a collapse limit. The header's scale and the pills' scale are separate props — they used to share one, so a SectionSize reached a Pill that expects a PillSize."
    />
    <TagPanelPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Overflow and empty"
        description="The +N chip unfolds the ColorSwatches way — cascaded in, rippled out — and it is one focusable control for both directions; it used to be a bare button wrapping a Pill, a nested interactive with no focus ring. The empty case is an EmptyState at the pane scale, not italic grey text."
        code={overflowCode}
        filename="Overflow.tsx"
      >
        <Overflow />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The pills sit in a <C>role=&quot;group&quot;</C> region named{" "}
          <C>t(&quot;kit.tagpanel.group&quot;)</C> whose <C>id</C> comes from{" "}
          <C>useId()</C> and is wired to the chip&rsquo;s <C>aria-controls</C>{" "}
          (:109,:229-232,:270) — two panels on one page never claim each
          other&rsquo;s region. The fold is one button carrying{" "}
          <C>aria-expanded</C>, named <em>Show N more tags</em> closed and{" "}
          <em>Collapse tags</em> open (:269-277), and the <C>+</C> glyph that
          tilts into a <C>×</C> is <C>aria-hidden</C> so no reader ever hears
          &ldquo;plus three&rdquo; (:286-294). Folded pills are mounted — the
          cascade needs their width — but are <C>aria-hidden</C> and zero-width,
          so the announced set is the visible set (:190-191,:307). The empty
          case is an <C>EmptyState</C> at the pane scale, not italic text
          (:242-248).
        </p>
        <A11yCode filename="Semantics.tsx" code={SEMANTICS_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          Exactly one tab stop, which is what a fold wants. One caveat the source
          makes plain: the chip carries no focus styling of its own — its only
          classes are layout (:278) — and the kit sheet defines no global{" "}
          <C>focus-visible</C> rule, so what marks it as focused is the
          browser&rsquo;s own outline rather than the kit&rsquo;s ring. Expanding
          moves focus nowhere (:143-156); the new pills are not focusable, so
          there is nothing to lose either.
        </p>
        <KeyboardSupportTable bindings={KEYBOARD} />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Four strings, all through <C>useKitT</C> (:108): the group label
          (:232), the chip&rsquo;s two names (:273,:274-276) and the default{" "}
          <C>No tags</C> (:246). All four are in every built-in catalog —
          en.ts:382-387, es.ts:349-354, fr.ts:352-357, de.ts:350-355,
          pt.ts:349-354. Tag labels are yours. Two things the catalogs do{" "}
          <em>not</em> do: <C>showMore</C> interpolates <C>{"{count}"}</C> but
          carries no plural branch (en.ts:384), so one folded tag reads{" "}
          <em>Show 1 more tags</em> even though the engine parses{" "}
          <C>{"{count, plural, one {…} other {…}}"}</C> (icu.ts:5-7,:237-261) and
          an app shipping its own catalog can say it properly; and the count is
          printed as the browser lays out digits, with no{" "}
          <C>Intl.NumberFormat</C> anywhere near it (:275,:293).
        </p>
        <p>
          Nothing in the component reads <C>dir</C>. The row is flex, so the
          flow mirrors and the chip&rsquo;s <C>order</C> follows it (:280); the
          fold&rsquo;s geometry does not — the rhythm is <C>marginRight</C> and{" "}
          <C>marginBottom</C> (:193-194) rather than logical properties, hidden
          pills scale away from the physical left (<C>transformOrigin</C>, :195),
          and the <C>rotate-45</C> that turns <C>+</C> into <C>×</C> is a physical
          rotation (:289). Read that as: the row is right, the animation is
          left-handed in both directions.
        </p>
        <A11yCode filename="Direction.tsx" code={RTL_CODE} />
      </A11yTopic>

      <A11yTopic title="Who owns the fold">
        <p>
          The component, entirely. <C>expanded</C>, the <C>collapsing</C> mirror
          and both measurements are local state (:112-118); there is no{" "}
          <C>expanded</C>, <C>defaultExpanded</C> or <C>onExpandedChange</C>{" "}
          prop, so the fold cannot be opened from outside, cannot be restored
          after a remount, and survives swapping the tags out. The only external
          influence is re-measurement: <C>tags.length</C>, <C>tagLimit</C> and{" "}
          <C>tagSize</C> trigger it (:128) and a <C>ResizeObserver</C> covers
          everything the container does to them (:129-136). And closing is
          deferred — the expanded layout is held for <C>holdMs</C> 300ms while the
          pills ripple away (:148-155, Theme.ts:1679-1688), so an assertion
          written on the same tick as the click still sees all of them.
        </p>
        <A11yCode filename="Fold.tsx" code={CONTROLLED_CODE} />
      </A11yTopic>
    </A11ySection>

    <PropsTable props={TAGPANEL_PROPS} />
  </div>
);

export default TagPanelPage;
