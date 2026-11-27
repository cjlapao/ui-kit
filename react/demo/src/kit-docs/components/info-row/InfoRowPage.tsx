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
} from "../../shared/A11ySections";
import type { KeyboardBinding, PropDoc } from "../../shared/A11ySections";
import { InfoRowPlayground } from "./InfoRowPlayground";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import Copy from "./examples/Copy";
import copyCode from "./examples/Copy.tsx?raw";
import SubItems from "./examples/SubItems";
import subItemsCode from "./examples/SubItems.tsx?raw";
import Collapsible from "./examples/Collapsible";
import collapsibleCode from "./examples/Collapsible.tsx?raw";
import BottomBorder from "./examples/BottomBorder";
import bottomBorderCode from "./examples/BottomBorder.tsx?raw";

/**
 * Every row was read out of `react/src/components/InfoRow.tsx`. One of them says
 * so out loud because the component disagrees with its own documentation: `tone`
 * is documented `@default "blue"` (:116) and destructures `"none"` (:388,:915).
 */
export const INFOROW_PROPS: PropDoc[] = [
  {
    name: "label",
    type: "ReactNode",
    description: (
      <>
        Required left column (:71). Without <C>labelWidth</C> the span is capped at
        30% of the row and truncated (:657-659) — the shared{" "}
        <C>useSmartLayout</C> rule.
      </>
    ),
  },
  {
    name: "value",
    type: "ReactNode",
    description: (
      <>
        The right column, and the row&rsquo;s whole personality (:95,:312-329): a{" "}
        <C>string</C> or <C>number</C> paints as text and is copyable; a{" "}
        <C>boolean</C> paints the catalog&rsquo;s <C>Yes</C>/<C>No</C> (:804-809) and
        is copyable too; any other node paints as-is and loses the copy button,
        because there is no string to copy (:328,:436);{" "}
        <C>&quot;&quot;</C>, <C>null</C> and <C>undefined</C> are &ldquo;empty&rdquo;.
      </>
    ),
  },
  {
    name: "labelSize / valueSize",
    type: "InfoRowSize",
    description: (
      <>
        Break one column out of the row&rsquo;s <C>size</C> (:76,:100,:431-432).
        Omitted, both follow <C>size</C>.
      </>
    ),
  },
  {
    name: "labelClassName / valueClassName / iconClassName",
    type: "string",
    description: (
      <>
        Extra classes for the three painted spans (:81,:105,:183). A text colour on
        any of them <em>replaces</em> the row&rsquo;s own ink instead of losing to it
        — that is what <C>hasTextColor</C> decides (:540,:566,:656).
      </>
    ),
  },
  {
    name: "labelWidth",
    type: "string",
    description: (
      <>
        Three answers, not two (:87,:657-659): omitted, the label is capped at 30% and
        truncates; <C>&quot;&quot;</C> lets it grow with no cap; a class like{" "}
        <C>&quot;w-32&quot;</C> fixes it. The size&rsquo;s own default width is only
        used in that third case.
      </>
    ),
  },
  {
    name: "size",
    type: "InfoRowSize",
    default: '"md" (:373)',
    description: (
      <>
        One token sets the text size, the gap, the padding, the skeleton bar&rsquo;s
        height, the icon&rsquo;s size and the body indent (:242-293). The shared{" "}
        <C>ControlSize</C> scale — <C>xl</C> included (:38).
      </>
    ),
  },
  {
    name: "variant",
    type: "InfoRowVariant",
    default: '"elevated" (:387,:914)',
    description: (
      <>
        <C>plain</C> draws no surface and <em>is</em> the root element, so a list of
        them keeps the hairline&rsquo;s <C>last:border-0</C> contract (:980-990). Every
        other variant is wrapped in a <C>Panel</C> that receives it (:992-1013) — which
        is why the body only reads <C>variant</C> for <C>bottomBorder</C> (:524).
      </>
    ),
  },
  {
    name: "tone",
    type: "SurfaceTone",
    default: '"none" (:388,:915) — its JSDoc says "blue" (:116)',
    description: (
      <>
        The accent everything else derives from: the loader&rsquo;s ink (:514-515), the
        icon&rsquo;s tint (:537), the copy button&rsquo;s colour (:742). It is{" "}
        <C>getSurfaceAccentColor(tone)</C> (:985,:1009), so <C>&quot;none&quot;</C>{" "}
        resolves to the theme&rsquo;s default rather than to no colour.
      </>
    ),
  },
  {
    name: "corner",
    type: "SurfaceCorner",
    default: '"rounded-md" (:916)',
    description: (
      <>
        The radius of the wrapping <C>Panel</C> (:997) — ignored by <C>plain</C>, which
        paints no surface.
      </>
    ),
  },
  {
    name: "padding",
    type: "InfoRowPadding",
    description: (
      <>
        Vertical padding for the row itself (:123,:433-434); omitted, the{" "}
        <C>size</C> token&rsquo;s own value is used. Horizontal padding is{" "}
        <C>noPadding</C>&rsquo;s business.
      </>
    ),
  },
  {
    name: "copyable",
    type: "boolean",
    default: "true (:375)",
    description: (
      <>
        The copy button also needs a value with a string in it:{" "}
        <C>copyable &amp;&amp; copyText !== null &amp;&amp; !isEmpty &amp;&amp; !loading
        &amp;&amp; !hasError</C> (:436-437).
      </>
    ),
  },
  {
    name: "onCopy",
    type: "(text: string) => void",
    description: (
      <>
        Fires only after the write actually succeeded (:500) — a document that lost
        focus, or no <C>navigator.clipboard</C> at all, reports failure through the
        button instead of throwing (:338-346).
      </>
    ),
  },
  {
    name: "mono",
    type: "boolean",
    default: "false (:377)",
    description: (
      <>
        Tabular monospace for digests, paths and tokens (:132,:567).
      </>
    ),
  },
  {
    name: "hideIfEmpty",
    type: "boolean",
    default: "true (:913)",
    description: (
      <>
        The row returns <C>null</C> when its value is empty — unless it is{" "}
        <C>loading</C>, has an <C>error</C>, carries <C>subItems</C>, has a{" "}
        <C>body</C>, or is <C>collapsible</C> (:965-974). A row with something to say
        stays visible.
      </>
    ),
  },
  {
    name: "emptyText",
    type: "string | null",
    default: '"—" (:378)',
    description: (
      <>
        What an empty value paints (:144,:572). <C>null</C> paints no span at all
        (:443) — no dash, no tooltip anchor, nothing to measure. The default em dash is
        the row&rsquo;s only untranslatable glyph.
      </>
    ),
  },
  {
    name: "wrap",
    type: "boolean",
    default: "false (:379)",
    description: (
      <>
        Breaks the value across lines instead of truncating it (:146,:565) — and drops
        the truncation tooltip, which has nothing to measure (:438-439).
      </>
    ),
  },
  {
    name: "tooltipOnTruncate",
    type: "boolean",
    default: "true (:380)",
    description: (
      <>
        The full value in a portaled tooltip, but only once the value is actually
        clipped: it is measured on hover and on focus, never per render (:506-510), and
        the span becomes focusable so a keyboard user can reach it (:559).
      </>
    ),
  },
  {
    name: "loading",
    type: "boolean",
    default: "false (:381,:917)",
    description: (
      <>
        Paints a placeholder in the value area and puts <C>aria-busy</C> on the row
        (:629). It also outranks <C>hideIfEmpty</C> (:968) — a row still fetching is
        not a row with nothing to show.
      </>
    ),
  },
  {
    name: "loaderType",
    type: '"skeleton" | "spinner"',
    default: '"skeleton" (:382)',
    description: (
      <>
        The skeleton is a <C>SkeletonBar</C> at 40% width, sized from the row&rsquo;s
        scale, and announces nothing; the spinner is a <C>role=&quot;status&quot;</C>{" "}
        with the catalog&rsquo;s loading label (:681-701). Both stop animating under{" "}
        <C>motion-reduce</C>.
      </>
    ),
  },
  {
    name: "error",
    type: "string",
    description: (
      <>
        Replaces the value with the caller&rsquo;s message in rose, and duplicates it
        into a polite <C>role=&quot;status&quot;</C> (:161,:572,:771-775) — an empty
        row and a failed lookup must not look alike. Also outranks{" "}
        <C>hideIfEmpty</C> (:969).
      </>
    ),
  },
  {
    name: "noBorder / noPadding / hoverable",
    type: "boolean",
    default: "false (:384,:385,:386)",
    description: (
      <>
        Local escapes: the bottom hairline (:620-623), the horizontal padding (:605),
        and a tone-coloured wash that replaces the hairline while it is on (:610-616).
      </>
    ),
  },
  {
    name: "glassOpacity / vibrancy / transparency",
    type: "GlassOpacity / GlassVibrancy / SurfaceTransparency",
    description: (
      <>
        Tuning for the two glass variants, forwarded to the <C>Panel</C>{" "}
        (:1000-1002). <C>transparency</C> has no JSDoc at all in the source (:170) yet
        is read and forwarded (:920,:1001) — it is listed here because it works.
      </>
    ),
  },
  {
    name: "raisedSurface",
    type: "boolean",
    default: "false (:922)",
    description: (
      <>
        Forces the nesting step on the wrapping <C>Panel</C> (:1003) so a row on the
        page&rsquo;s own tint reads as a card. No effect on <C>plain</C>.
      </>
    ),
  },
  {
    name: "icon",
    type: "IconName | ReactElement",
    description: (
      <>
        A leading glyph in the row&rsquo;s tone (:181,:535-547), wrapped in{" "}
        <C>aria-hidden</C> (:648) because the label already says what it signals. It
        also moves the sub-items and the body to the title&rsquo;s edge (:800,:892).
      </>
    ),
  },
  {
    name: "subItems",
    type: "InfoRowSubItem[]",
    description: (
      <>
        Secondary lines stacked under the main one (:190,:798-844):{" "}
        <C>{"{text, value, mono, className}"}</C> (:50-62). A <C>boolean</C> value
        localises like the main value (:804-809); an entry with neither text nor value
        renders nothing (:814) — and sub-items alone keep the row mounted past{" "}
        <C>hideIfEmpty</C> (:970).
      </>
    ),
  },
  {
    name: "collapsible",
    type: "boolean",
    description: (
      <>
        Omitted, it is implied by <C>body</C>: <C>collapsible ?? body !== undefined</C>{" "}
        (:199,:450). <C>false</C> with a body renders the content always-open and
        withholds only the affordance (:455). <C>true</C> with <em>no</em> body still
        gives the row <C>role=&quot;button&quot;</C> and an <C>aria-controls</C> (:587-590)
        pointing at a region that is never rendered (:853,:875) — toggle them together.
      </>
    ),
  },
  {
    name: "defaultExpanded",
    type: "boolean",
    default: "false (:393)",
    description: (
      <>
        The uncontrolled starting point (:201,:451); ignored once{" "}
        <C>expanded</C> is passed (:449).
      </>
    ),
  },
  {
    name: "expanded / onToggle",
    type: "boolean / (expanded: boolean) => void",
    description: (
      <>
        The controlled pair, same shape as <C>CollapsiblePanel</C>&rsquo;s (:203,:205).{" "}
        <C>onToggle</C> fires on every activation, controlled or not (:461), and the
        whole row — main line, sub-items, chevron — is the toggle (:585-594).
      </>
    ),
  },
  {
    name: "body",
    type: "ReactNode",
    description: (
      <>
        The disclosure&rsquo;s content (:212,:853-899): a <C>role=&quot;region&quot;</C>{" "}
        labelled by the row, opened with <C>grid-template-rows: 0fr → 1fr</C>, and{" "}
        <C>inert</C> + <C>aria-hidden</C> while folded (:874-882) so nothing inside it
        takes a tab stop. Its own clicks and keys stop at the wrapper (:858-864).
      </>
    ),
  },
  {
    name: "bottomBorder",
    type: "boolean",
    default: "false (:397)",
    description: (
      <>
        A section edge under the whole block — sub-items and an open body included
        (:219,:521-524). Honoured by <C>simple</C> and <C>none</C> only;{" "}
        <C>noBorder</C> still wins.
      </>
    ),
  },
  {
    name: "className",
    type: "string",
    description: (
      <>
        Lands on the row for <C>plain</C> (:987) and on the wrapping{" "}
        <C>Panel</C> for every other variant, where the row itself is given{" "}
        <C>undefined</C> (:1004,:1010).
      </>
    ),
  },
  {
    name: "…",
    type: "div attributes",
    description: (
      <>
        Everything else spreads onto the root element (:64-69 withhold{" "}
        <C>color</C>, <C>title</C>, <C>content</C>, <C>onCopy</C> and{" "}
        <C>onToggle</C>, each of which would mean something else as a native
        attribute). No <C>data-*</C> attributes are set anywhere in the component, and
        the only aria the row always carries is <C>aria-busy</C> (:629).
      </>
    ),
  },
];

/** Only the bindings that exist in the source — and where they do not. */
export const KEYBOARD: KeyboardBinding[] = [
  {
    keys: ["Tab"],
    action: (
      <>
        Reaches the copy button and, when the value is clipped, the value span itself —
        it is the only element besides the button that takes a tab stop (:559,:738). A
        folded body is <C>inert</C>, so nothing inside it is in the order at all
        (:881).
      </>
    ),
  },
  {
    keys: ["Enter", "Space"],
    action: (
      <>
        On the row, and only when it is a disclosure: <C>handleHeaderKeyDown</C>{" "}
        toggles it, with <C>preventDefault</C> so Space does not scroll the page
        (:480-492). The guard at :485 means a key pressed while a child — the copy
        button, usually — has focus activates that child, never the row.
      </>
    ),
  },
  {
    keys: ["Enter", "Space"],
    action: (
      <>
        On the copy <C>IconButton</C>, which copies like any button; its accessible name
        is the catalog&rsquo;s copy string and flips to the confirmation (:738-759).
      </>
    ),
  },
  {
    keys: ["Pointer", "Enter", "Space"],
    action: (
      <>
        On a collapsed row&rsquo;s chevron: the chevron itself is{" "}
        <C>aria-hidden</C> and has no handler — the click lands on the row and the row
        is the control (:778-791,:591).
      </>
    ),
  },
  {
    keys: ["Mouse"],
    action: (
      <>
        The only thing that can dismiss the copy button&rsquo;s reveal, by leaving the
        row and re-arming it (:597); hovering cannot, once a copy has folded it away
        (:734-735).
      </>
    ),
  },
];

const SEMANTICS_CODE = `// What the row puts on the element, and what only the disclosure adds.
<InfoRow
  label="Image digest"
  value="sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b"
  loading                                   // aria-busy on the row (:629)
  error="Registry unreachable"              // + a duplicate role="status" (:771-775)
/>;

<InfoRow
  label="Release notes"
  value="v4.12.0"
  collapsible                               // role="button" + tabIndex + aria-expanded
  body={<Notes />}                          // + role="region" labelled by the row (:874-882)
/>;
// The chevron is aria-hidden (:787) and the icon is aria-hidden (:648): the row's own
// text is its accessible name, and the glyphs only signal what the words already say.
// A collapsed body is inert + aria-hidden rather than hidden, so the 0fr→1fr transition
// still plays while nothing inside it stays reachable (:878-881).`;

const I18N_CODE = `// common/i18n/builtIn/en.ts:331-339 — seven keys, five locales.
kit.inforow: {
  yes: "Yes",                 // a boolean value, and each sub-item's boolean (:807-808)
  no: "No",
  copy: "Copy to clipboard",  // the button's name and tooltip at rest (:748,:755)
  copied: "Copied!",          // the button while the confirmation runs (:752)
  copiedLong: "Copied to clipboard",   // the live region (:766)
  copyFailed: "Copy failed",  // name, tooltip and live region on a failed write (:747,:754,:768)
  loading: "Loading",         // the spinner's aria-label (:692)
}

// App strings are the caller's and pass through untouched: label, value, error,
// emptyText, sub-item text. The one glyph no catalog can reach is the empty placeholder,
// "—" (:378) — pass your own emptyText if a locale needs a word there.`;

export const InfoRowPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Info Row"
      description="One label/value line in a details panel — with copy-to-clipboard, a tooltip when the value is truncated, and loading, empty and error states. A leading icon, stacked sub-items and an optional disclosure body cover the richer shapes a review or a trigger config asks for. Its copy colour and hairline come from the surface it sits on, so a row on glass reads as well as one on a white card."
    />
    <InfoRowPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Variants"
        description="`elevated` is the kit default — the row renders inside a `Panel` of its own. `plain` draws no surface and stays the root element, so the hairline's `last:border-0` still matches among sibling rows — pass it explicitly for the details-list texture."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="The full shared control scale. The component declared its own `xs | sm | md | lg`, so it could not be set to `xl` beside an `xl` Button — and `padding` had its own eight-member list where the kit has six."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="Loading, empty and error"
        description="A row that is loading or has failed stays visible even with no value — `hideIfEmpty` used to win over both, so a panel visibly jumped as values arrived. The skeleton bar is sized from the row's own scale."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Copy and truncation"
        description="Copy is a real `IconButton`, revealed on hover and on keyboard focus. A missing clipboard or a rejected write reports a failure instead of throwing. The truncation tooltip is the shared portaled `TooltipWrapper`, so a scrolling panel cannot clip it — and it now answers to focus, not just to a pointer."
        code={copyCode}
        filename="Copy.tsx"
      >
        <Copy />
      </ExampleCard>
      <ExampleCard
        title="Sub items"
        description="A verdict row can say more than one thing: a leading `icon` in the row's tone, and `subItems` — `text value` lines stacked under the main line, indented to the title's left edge when an icon is present. A boolean sub-item value localises to Yes/No; a line with neither text nor value renders nothing."
        code={subItemsCode}
        filename="SubItems.tsx"
      >
        <SubItems />
      </ExampleCard>
      <ExampleCard
        title="Collapsible"
        description="`collapsible` (implied whenever a `body` is present) makes the whole row the toggle — main line, sub-items and all: `role='button'` on the row, Enter and Space, and the focus ring of a shared trigger, exactly where the hover wash lands. The body unfolds with the same `grid-template-rows: 0fr→1fr` animation the collapsible panel uses; collapsed, it is `inert` rather than `hidden`, so the transition plays and nothing inside the folded body takes a tab stop. The open body, the value cluster and any links or inputs inside the row keep their own clicks."
        code={collapsibleCode}
        filename="Collapsible.tsx"
      >
        <Collapsible />
      </ExampleCard>
      <ExampleCard
        title="Bottom border"
        description="`bottomBorder` draws a section edge under each row — the rules of a simple key/value table. It is honoured by the `simple` and `none` variants only: the surfaced variants already frame themselves, and `plain` keeps its hairline so the last row still goes bare. The rule spans the full row width, including under any sub-items; where the caller stops opting in, the table ends."
        code={bottomBorderCode}
        filename="BottomBorder.tsx"
      >
        <BottomBorder />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          A loading row carries <C>aria-busy</C> on the row element itself (:629), so
          assistive tech knows the value is pending rather than missing. A{" "}
          <C>loaderType=&quot;spinner&quot;</C> is a <C>role=&quot;status&quot;</C>{" "}
          with a localised label (:691-692); a skeleton is decorative and announces
          nothing (:695-700). An <C>error</C> renders its text visibly and duplicates it
          into a polite <C>role=&quot;status&quot;</C> (:771-775) — a row that silently
          shows <C>—</C> for a failed lookup is indistinguishable from one that is
          genuinely empty, and that confusion is exactly what the error prop exists to
          prevent.
        </p>
        <p>
          Copying is confirmed, not silent: the button&rsquo;s accessible name flips to{" "}
          <C>kit.inforow.copiedLong</C> and a polite live region announces it (:764-770)
          — polite, so a confirmation never interrupts what is being read. If the
          clipboard is unavailable or the write is rejected (a document that lost focus
          mid-click is the common case), the name flips to <C>kit.inforow.copyFailed</C>,
          the button turns rose (:742), and the same live region says so; nothing throws
          (:338-346).
        </p>
        <A11yCode code={SEMANTICS_CODE} filename="Semantics.tsx" />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          The row itself is plain text — no listbox semantics, no arrow keys; rows are
          read in document order, which is right for a details panel. There is no
          Home/End and no Escape anywhere either: outside the disclosure handler and
          the two <C>stopPropagation</C> guards (:672-678,:858-864) the component
          listens for no key at all. The copy button is a real <C>button</C> in the
          tab order, and it is revealed on{" "}
          <C>focus-visible</C>, not just on hover (:732-735) — an invisible button that
          still accepts Enter used to be a keyboard trap of confusion. It claims no
          space while hidden, so the value owns the full column until the button slides
          in. The pointer and the keyboard are the only things summoning it — never its
          own confirmation state, and never the DOM focus a mouse-click leaves behind.
          A truncated value is a focusable span with an inset ring (:559,:568) and its
          tooltip answers to focus as well as hover; it is portaled to{" "}
          <C>document.body</C> (TooltipWrapper.tsx:295,:339), so a scrolling panel
          cannot clip it.
        </p>
        <p>
          Boolean values render as localised Yes/No text (:319-323), so they are read
          as words rather than as nothing — and copy still offers the same text.
        </p>
        <KeyboardSupportTable bindings={KEYBOARD} />
      </A11yTopic>

      <A11yTopic title="Disclosure rows">
        <p>
          A <C>collapsible</C> row makes the whole control the toggle — main line,
          sub-items and all: a real <C>role=&quot;button&quot;</C> on the row with{" "}
          <C>aria-expanded</C> and <C>aria-controls</C> (:585-594), answering to click,
          Enter and Space (with <C>preventDefault</C>, so Space never scrolls the page
          — :486-488). Its accessible name is the row&rsquo;s own text; the chevron is{" "}
          <C>aria-hidden</C> (:787). The open body stops the activation from reaching
          the row (:858-864), and so do the value-cluster controls (:672-678) — copying
          a digest must never fold the body shut — while a guard keeps any real link,
          button or input in the row out of the toggle too (:471-474), so it activates
          itself instead. The collapsed body is <C>inert</C> and <C>aria-hidden</C>,
          not <C>hidden</C> (:878-881): nothing inside it lands in the tab order or the
          accessibility tree, yet the grid-rows transition can still play.
        </p>
        <p>
          Two asymmetries to know. <C>collapsible</C> without a <C>body</C> leaves the
          row advertising <C>aria-controls</C> for a region that is never rendered
          (:590 vs :853) — set them together. And the row&rsquo;s{" "}
          <C>onMouseLeave</C> is wired unconditionally, even on a row that cannot fold
          (:597), because its only job is re-arming the copy reveal.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Every built-in string is catalog-resolved (<C>kit.inforow.*</C>, seven keys,
          five locales — <C>en</C>, <C>de</C>, <C>fr</C>, <C>es</C>, <C>pt</C>): the
          loading label, the copy button&rsquo;s idle name and tooltip, both
          confirmation phrasings, the failure message, and the Yes/No pair that boolean
          values render — the main one (:957-960) and each sub-item&rsquo;s
          (:804-809). The <C>emptyText</C> placeholder defaults to a locale-neutral{" "}
          <C>—</C> (:378), which is the row&rsquo;s single untranslatable glyph; pass
          your own <C>emptyText</C> where a locale wants a word. Labels, values and
          errors are the caller&rsquo;s text and pass through untouched.
        </p>
        <A11yCode code={I18N_CODE} filename="i18n.ts" />
      </A11yTopic>
    </A11ySection>

    <PropsTable props={INFOROW_PROPS} />
    <p className="text-sm text-neutral-500 dark:text-neutral-400">
      <code>InfoRow</code> spreads div attributes. Rows are meant to be siblings
      in a plain flow — wrapping them in per-row containers breaks the
      hairline&rsquo;s last-child rule, which is exactly what the{" "}
      <code>plain</code> variant exists to avoid (:980-990).
    </p>
  </div>
);

export default InfoRowPage;
