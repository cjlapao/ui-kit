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
  type PropDoc,
} from "../../shared/A11ySections";
import { CollapsibleHelpTextPlayground } from "./CollapsibleHelpTextPlayground";
import ReviewQuestion from "./examples/ReviewQuestion";
import reviewQuestionCode from "./examples/ReviewQuestion.tsx?raw";
import Surfaces from "./examples/Surfaces";
import surfacesCode from "./examples/Surfaces.tsx?raw";
import InsideGlassPanel from "./examples/InsideGlassPanel";
import insideGlassPanelCode from "./examples/InsideGlassPanel.tsx?raw";

export const CollapsibleHelpTextPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Collapsible Help Text"
      description="Inline helper copy that truncates to a word-boundary summary and expands for the rest. It renders a Panel rather than its own card, so all nine container surfaces come for free — `card` is the kept alias of `outlined`, and `plain` skips the card entirely — plus `raisedSurface`, the tinted-card-on-matching-background fix."
    />
    <CollapsibleHelpTextPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Review question"
        description="The canonical case: a title, an icon, and copy long enough to truncate. The summary cuts on a word boundary rather than mid-word (CollapsibleHelpText.tsx:52-62); the chevron chip is decoration and the state lives in the button's aria-expanded."
        code={reviewQuestionCode}
        filename="ReviewQuestion.tsx"
      >
        <ReviewQuestion />
      </ExampleCard>
      <ExampleCard
        title="All surfaces"
        description="Every entry in COLLAPSIBLE_HELP_VARIANTS (:34-38) — plain, the card alias of outlined, and the Panel surfaces, minus none: a card with no surface at all is what plain is for. Copy colour comes from the surface it lands on, not from a fixed pair (:155)."
        code={surfacesCode}
        filename="Surfaces.tsx"
      >
        <Surfaces />
      </ExampleCard>
      <ExampleCard
        title="Inside a glass panel"
        description="A liquid-glass variant blends into the panel it lives in, and plain inherits that surface's colours. children stay visible whether or not the summary is expanded (:234-244) — the disclosure only ever governs the summary text."
        code={insideGlassPanelCode}
        filename="InsideGlassPanel.tsx"
      >
        <InsideGlassPanel />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The component has <strong>two DOMs, chosen by the copy</strong>. When{" "}
          <C>text</C> is longer than <C>maxLength</C> the content sits inside a{" "}
          <C>{`<button type="button">`}</C> carrying <C>aria-expanded</C>,
          <C>aria-controls</C> and <C>aria-label</C> (:209-216). When it fits,{" "}
          <C>needsTruncation</C> is false and the same content renders in a bare
          plain <C>div</C> with no ARIA at all (:229-232) — a short helper is
          never announced as a disclosure, and there is no way to force one.
        </p>
        <p>
          The button&apos;s <em>name</em> is <C>aria-label</C> (:216), on purpose:
          without it the accessible name would be the entire help paragraph, which
          is exactly what the comment at :215 says. That label is{" "}
          <C>expandLabel</C> while collapsed and <C>collapseLabel</C> while
          expanded, so those two props are the localized strings — the content
          beside them is yours already.
        </p>
        <p>
          <C>aria-controls</C> points at the <C>{`<span id={regionId}>`}</C>{" "}
          around the copy (:179), whose id comes from <C>useId()</C> (:274). Note
          what is <em>not</em> happening: there is no hidden full copy and no
          <C>aria-hidden</C> region. Collapsed, the paragraph literally contains
          the truncated string with its ellipsis (:279), so a screen reader reads
          that ellipsis and the button&apos;s label is the only cue that more
          exists. The chevron chip is <C>aria-hidden=&quot;true&quot;</C> (:188),
          and the whole card is a <C>{`<section>`}</C> with no role — Panel only
          turns itself into a button when it is handed an <C>onClick</C>{" "}
          (Panel.tsx:1330), and this component hands it none (:316-331). Only the
          trigger is a control.
        </p>
        <p>
          Body and children take their colours from <C>useSurfaceText()</C>{" "}
          (:148,155,238) rather than a hard-coded pair, so contrast follows the
          surface you placed the help on. <C>tone</C> moves the icon chip, the
          title, the chevron, the hover wash and the focus ring (:164-224) — it
          never touches the paragraph colour, which is why <C>tone=&quot;none&quot;</C>{" "}
          is a safe answer on a tinted card.
        </p>
        <A11yCode
          filename="the two states"
          code={`<!-- truncated: needsTruncation is true (:277) -->
<button type="button" aria-expanded="false" aria-controls=":r1:" aria-label="Show more">
  <span aria-hidden="true"><!-- chevron --></span>
  <span id=":r1:"><p class="text-sm leading-6">We encrypt your API tokens…</p></span>
</button>

<!-- fits under maxLength: no button, no ARIA (:229-232) -->
<div class="flex items-start gap-3 p-4">
  <span id=":r1:"><p class="text-sm leading-6">Short helper.</p></span>
</div>`}
        />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          There is nothing to memorise, because the component writes no key
          handlers: the file contains no <C>onKeyDown</C>, no <C>onKeyUp</C> and
          no <C>Escape</C> (grep :1-337). Everything the keyboard does here is the
          browser&apos;s doing on a real <C>{`<button type="button">`}</C> (:210).
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["Tab"],
              action:
                "Reaches the trigger, which is a native button (:210) — no tabIndex bookkeeping and no roving index. The visible ring is tone.focusRing (:224), so it follows the tone you chose.",
            },
            {
              keys: ["Enter"],
              action:
                "Activates the button natively and calls onToggle (:212,295), flipping aria-expanded and swapping the paragraph between the truncated and the full string (:278-279).",
            },
            {
              keys: ["Space"],
              action:
                "The same, also natively — a <button> swallows the page scroll for you. No preventDefault exists in this file because none is needed.",
            },
          ]}
        />
        <p>
          What is missing is worth knowing before you design around it. There is
          no <C>Escape</C> to collapse, no arrow-key movement between sibling help
          blocks, and no focus restoration: <C>expanded</C> is internal{" "}
          <C>useState</C> (:273) with no <C>defaultExpanded</C> and no{" "}
          <C>onToggle</C> callback, so the disclosure is unreadable and
          uncontrollable from outside, and the button unmounts the moment the copy
          stops overflowing — if you change <C>text</C> or <C>maxLength</C> while
          it has focus, focus lands on <C>body</C> and the keyboard user starts
          over. Reaching the full text is a two-keystroke round trip per block,
          which is why copy that fits under <C>maxLength</C> is the kinder answer.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          This component is <strong>not localized</strong>. It imports nothing
          from <C>common/i18n</C> and never calls <C>useKitT</C> (imports
          :1-22); no <C>kit.*</C> key is read on the path. The only two strings the
          kit supplies are the defaults of <C>expandLabel</C> and{" "}
          <C>collapseLabel</C>, hard-coded English in <C>HelpBody</C>&apos;s
          destructuring (:144-145) — <C>&quot;Show more&quot;</C> and{" "}
          <C>&quot;Show less&quot;</C>. Passing both props is the entire
          integration, and since they land in <C>aria-label</C> (:216) they are the
          strings a screen reader user of another language actually hears.
        </p>
        <A11yCode
          filename="the whole localization API"
          code={`<CollapsibleHelpText
  text={t("reviews.why")}
  expandLabel={t("reviews.showMore")}
  collapseLabel={t("reviews.showLess")}
/>`}
        />
        <p>
          Direction is half-handled. The card and its copy flow with the document
          — but the chevron&apos;s <C>ml-2</C> (:184) and the content&apos;s{" "}
          <C>text-left</C> (:173,218) are physical utilities, so under{" "}
          <C>dir=&quot;rtl&quot;</C> the chip keeps a margin on the wrong side and
          the text stays left-aligned. Both are cosmetic, and neither carries
          meaning, so fixing them is a stylesheet matter rather than a bug to work
          around.
        </p>
        <p>
          The real trap is that <C>maxLength</C> counts characters, not words
          (:52-62,277). The same 160 fits far more German than Japanese: CJK
          copy truncates at roughly a third of the reader-facing length, and copy
          written without spaces finds no boundary at all —{" "}
          <C>slice.lastIndexOf(&quot; &quot;)</C> (:57) has nothing to find, so it
          cuts at the exact limit, which is the mid-word slice the word-boundary
          code was written to avoid. Give non-Latin locales their own{" "}
          <C>maxLength</C>; do not translate and reuse the English number.
        </p>
      </A11yTopic>

      <A11yTopic title="Motion">
        <p>
          Three transitions, all short: the trigger&apos;s <C>transition</C> for
          the tone&apos;s hover wash (:218,223), the chevron chip&apos;s{" "}
          <C>transition</C> (:184) and the chevron&apos;s{" "}
          <C>transition-transform duration-200</C> as it rotates to{" "}
          <C>rotate-180</C> when the copy expands (:193-196).
        </p>
        <p>
          None of it is guarded: the file has no <C>motion-reduce:</C> variant, and
          the reduced-motion rules in <C>react/src/styles.css</C> reset{" "}
          <em>keyframe animations</em> (
          <C>.shimmer-text</C>, <C>.pill-pulse</C>, <C>.panel-pulse</C>) rather
          than Tailwind <C>transition</C> utilities. So the 200 ms rotation plays
          under <C>prefers-reduced-motion: reduce</C> like everything else. It is
          a single transform on a 32px chip, not a loop, so it is defensible — but
          if your accessibility review asks for it, the fix belongs in your
          stylesheet, because there is no prop for it.
        </p>
        <p>
          The Panel underneath contributes nothing to this: it is never given an{" "}
          <C>onClick</C>, so it stays a static section with no transition list of
          its own, and <C>scrollable</C> is pinned <C>false</C> (:325) — an
          expanded answer grows the card instead of scrolling inside it.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable props={COLLAPSIBLE_HELP_PROPS} />
  </div>
);

// ── API ─────────────────────────────────────────────────────────────────────

export const COLLAPSIBLE_HELP_PROPS: PropDoc[] = [
  {
    name: "text",
    type: "string",
    description:
      "Required. Trimmed before anything else is decided (:276) — and it is the *display* string that gets handed to renderMarkdown (:150-151), so your renderer never sees the hidden half.",
  },
  {
    name: "maxLength",
    type: "number",
    default: "160",
    description:
      "Characters before the summary is cut (:254,277). The cut walks back to the last space, but only if that space is past 60% of the limit (:57-60), then strips a trailing .,;: and appends … (:61). Counts characters, not words — see Internationalization.",
  },
  {
    name: "title",
    type: "ReactNode",
    description:
      "The semibold line above the copy (:174-178), in tone.title. Omitted from the HTML attributes (:69) precisely so it cannot land on the DOM as a tooltip.",
  },
  {
    name: "showIcon",
    type: "boolean",
    default: "false",
    description:
      "A 36px round chip at the start, filled with tone.iconBg and tinted tone.accent (:162-172). Off by default, so the icon is an opt-in affordance rather than decoration you have to remove.",
  },
  {
    name: "icon",
    type: "string",
    default: '"Help"',
    description:
      "Resolved by renderIcon: a registry name becomes a CustomIcon, an element is cloned with the chip's class, anything else is wrapped in a span. A registry name with no alt renders aria-hidden — the chip is never a label.",
  },
  {
    name: "tone",
    type: "SurfaceTone",
    default: '"none"',
    description:
      "The accent, and the card's tint on the variants that read one. Resolved through getCollapsibleHelpToneTokens(getSurfaceAccentColor(tone)) (:281); an unknown name lands on the blue fallback. It paints the chip, title, chevron, hover and focus ring — not the body copy, which follows the surface.",
  },
  {
    name: "variant",
    type: "CollapsibleHelpTextVariant",
    default: '"card"',
    description:
      "plain | card | the nine SURFACE_VARIANTS (:34-38). card is an alias of outlined (:42-44) kept for call sites that predate the surface set; plain renders no Panel at all (:305-311), inheriting whatever surface surrounds it.",
  },
  {
    name: "corner",
    type: "PanelCorner",
    default: "DEFAULT_SURFACE_CORNER",
    description:
      'Forwarded to the Panel (:319), which defaults to "rounded-md" — a 1rem radius (Theme.ts:1512-1531). Read only by the card, so plain ignores it.',
  },
  {
    name: "padding",
    type: "PanelPadding",
    default: '"sm"',
    description:
      'Not what it looks like: the Panel is pinned padding="none" (:320) and the inset is applied to the trigger instead (:203-205), so the hover wash covers the whole card instead of a box floating inside it. On plain there is no inset at all (:105,230).',
  },
  {
    name: "raisedSurface",
    type: "boolean",
    default: "false",
    description:
      "Forwarded to Panel (:326) and read by the nesting ladder (nestedPanel.ts:32-33): floors the card at the first depth step, which is how a tinted helper stays visible on a background that matches it.",
  },
  {
    name: "transparency",
    type: "SurfaceTransparency",
    default: "per variant",
    description:
      "Forwarded (:322) and otherwise untouched, so absent resolves per variant (surfaceTransparency.ts:7) exactly as it would on a bare Panel.",
  },
  {
    name: "glassOpacity",
    type: "GlassOpacity",
    default: "Panel's",
    description:
      "Forwarded (:321). Panel reads it only in its liquid-glass branch (Panel.tsx:959,1012), so on glass and default it changes nothing.",
  },
  {
    name: "vibrancy",
    type: "GlassVibrancy",
    default: "Panel's",
    description:
      "Forwarded (:323), same caveat: liquid-glass alone multiplies the backdrop saturation (glass.ts:223-232, Panel.tsx:958,1011).",
  },
  {
    name: "specularMode",
    type: "PanelSpecularMode",
    default: "undefined",
    description:
      "Forwarded (:324) for the three glass-aware variants — glass, liquid-glass and default (Panel.tsx:1431). Absent resolves to classic inside Panel (:820-824), so this prop is how you turn it off.",
  },
  {
    name: "expandLabel / collapseLabel",
    type: "string",
    default: '"Show more" / "Show less"',
    description:
      "The trigger's accessible name in each state (:144-145,216) — the component's only two hard-coded strings. They exist only while the copy truncates; give them translations and you have localized the component.",
  },
  {
    name: "renderMarkdown",
    type: "(text: string) => ReactNode",
    description:
      "Replaces the paragraph entirely rather than decorating it (:150-158). You then own the markup and its colour, including the surface-derived text-sm leading-6 the default branch applies (:155).",
  },
  {
    name: "children",
    type: "ReactNode",
    description:
      "Extra content under the copy, in the surface's muted colour (:234-244). It is never hidden by the disclosure — expanded or not, it is painted — and its presence squares off the trigger's bottom corners (:222).",
  },
  {
    name: "className",
    type: "string",
    description:
      "Appended to the wrapper: with plain, alongside its w-full on the div (:307); otherwise handed to Panel (:327), which concatenates it last (Panel.tsx:1321).",
  },
  {
    name: "…HTMLAttributes<HTMLDivElement>",
    type: "element attributes",
    description:
      "Rest-spread onto the wrapper div (:307) or onto the Panel (:328), where it meets Panel's own rest spread (Panel.tsx:1329) — so your id and aria-* reach the card, and data-* attributes sit on the same element as Panel's data-variant. title and color are omitted from the interface (:66-69): the component owns the first, and Panel redefines the second.",
  },
  {
    name: "ref",
    type: "— none",
    description:
      "A plain React.FC with no forwardRef (:251). Nothing outside can reach the card or the trigger element, which is also why the disclosure cannot be controlled or measured from a parent.",
  },
  {
    name: "defaultExpanded / onToggle",
    type: "— absent",
    description:
      "expanded lives in internal useState (:273) with no initial-state prop and no callback. The only way to open a helper at mount, close it from elsewhere, or react to a reader opening one is to not use this component for it — say so in your own markup instead.",
  },
];

export default CollapsibleHelpTextPage;
