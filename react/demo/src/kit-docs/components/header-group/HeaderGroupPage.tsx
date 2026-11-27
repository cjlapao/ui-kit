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
import { HeaderGroupPlayground } from "./HeaderGroupPlayground";
import ToolbarHero from "./examples/ToolbarHero";
import toolbarHeroCode from "./examples/ToolbarHero.tsx?raw";
import GapLadder from "./examples/GapLadder";
import gapLadderCode from "./examples/GapLadder.tsx?raw";
import LoneGroup from "./examples/LoneGroup";
import loneGroupCode from "./examples/LoneGroup.tsx?raw";
import TonedSeparators from "./examples/TonedSeparators";
import tonedSeparatorsCode from "./examples/TonedSeparators.tsx?raw";

export const HeaderGroupPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Header Group"
      description="A named cluster of header controls, and the one piece of arithmetic that makes a toolbar read as three: a rule drawn between adjacent groups, centred in a gutter that the same prop sizes. It is a group to assistive technology and nothing to the keyboard — no focus of its own, no key of its own, and a separator that exists only as a pseudo-element."
    />
    <HeaderGroupPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Toolbar"
        description="Four clusters — navigation, view, alerts and actions — in one bar. Each is a role=&quot;group&quot; with its own name (:150-151), and the rule belongs to whichever group is second, so the first never wears a leading line."
        code={toolbarHeroCode}
        filename="ToolbarHero.tsx"
      >
        <ToolbarHero />
      </ExampleCard>
      <ExampleCard
        title="Gap ladder"
        description="Every gap size across the same three groups. gap becomes both the gutter and the rule&rsquo;s offset from one custom property (:162,:165-167), which is why the line stays centred at 4 px and at 24 px alike — the kit pins that pairing at HeaderGroup.test.tsx:28-40."
        code={gapLadderCode}
        filename="GapLadder.tsx"
      >
        <GapLadder />
      </ExampleCard>
      <ExampleCard
        title="Lone group"
        description="The separator is a ::before on the following group ([&amp;+&amp;], :62-70), so a lone group has nothing to hide and no wrapper element is needed between clusters. divider={false} removes the whole ladder from the class list rather than recolouring it (:157, test :18-26)."
        code={loneGroupCode}
        filename="LoneGroup.tsx"
      >
        <LoneGroup />
      </ExampleCard>
      <ExampleCard
        title="Toned separators"
        description="Untoned the rule is color-mix(in srgb, currentColor 25%, transparent) (:177), so it inherits the copy colour the surface chose and survives a dark header. A tone pins it to var(--color-&lt;tone&gt;-400) (:176) without needing a safelist entry inside an arbitrary variant (test :63-68)."
        code={tonedSeparatorsCode}
        filename="TonedSeparators.tsx"
      >
        <TonedSeparators />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          This is one of the few kit components that{" "}
          <em>does</em> claim a role: every cluster is a <C>div</C> with{" "}
          <C>role=&quot;group&quot;</C> and <C>aria-label=&#123;label&#125;</C> (
          <C>:150-151</C>), because a cluster of related controls is exactly what that
          role means — the component had no semantics at all before it, and the kit&rsquo;s
          test exists to keep it that way (:10-15, &ldquo;is a labelled group, not an
          anonymous div&rdquo;). The name is the caller&rsquo;s job, though:{" "}
          <C>label</C> has no default (:105), and an unnamed group is usually skipped, so
          the controls arrive with no context.
        </p>
        <p>
          The visual rule is not part of the announcement. It is a{" "}
          <C>::before</C> with <C>content: [&#39;&#39;]</C> (<C>:63</C>) — decoration,
          invisible to the tree — which is why <C>divider=&#123;false&#125;</C> changes
          nothing for assistive technology (:157 removes classes, not semantics). Two
          details make the name honest rather than decorative. The copy colour comes from
          the surface the group sits on (<C>surface.heading</C>, <C>:156</C>; a{" "}
          <C>Panel</C> publishes that context at Panel.tsx:1272, and the translucent
          pair is deliberately stronger — <C>text-neutral-900 dark:text-white</C> at{" "}
          <C>common/theme/Theme.ts:1159</C>), so a label on glass is still the same
          colour as the rule&rsquo;s 25% wash is built from (<C>:177</C>). And{" "}
          <C>&#123;...rest&#125;</C> is spread <em>last</em> (<C>:181</C>), after{" "}
          <C>role</C> and <C>aria-label</C>, so a caller passing <C>aria-label</C>{" "}
          directly replaces the <C>label</C> prop rather than adding a second name —
          useful once, confusing forever: prefer <C>label</C>.
        </p>
        <A11yCode filename="NamingGroups.tsx" code={NAMING_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          <C>HeaderGroup.tsx</C> compares no key and takes no focus: there is no{" "}
          <C>onKeyDown</C>, <C>onKeyUp</C>, <C>onKeyPress</C> or <C>tabIndex</C> anywhere
          in its 192 lines, and it has no focus handler to steal a stop. That is the
          design — a wrapper that took a tab stop would cost the bar one more keypress
          before the control anyone wanted. The only listener it installs is a{" "}
          <C>resize</C> one for the rule&rsquo;s pixel snap (<C>:131</C>), which redraws
          and never intercepts.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: (
                <>
                  Straight through to the items, in DOM order: the children are rendered
                  verbatim inside the inner row (<C>:183-185</C>) and the wrapper is not
                  focusable. A group&rsquo;s items are therefore reachable exactly as
                  many times as there are items — no more, whatever the rule looks like.
                </>
              ),
            },
            {
              keys: ["arrow"],
              action: (
                <>
                  Nothing, and no roving focus is expected: <C>role=&quot;group&quot;</C>{" "}
                  (:150) is a grouping, not a composite widget, so arrow keys belong to
                  whatever control has focus. A toolbar that{" "}
                  <em>did</em> move focus with arrows would need{" "}
                  <C>toolbar</C> plus the implementation — neither of which is here.
                </>
              ),
            },
            {
              keys: ["Any"],
              action: (
                <>
                  Nothing at this level. No key is compared between the root (
                  <C>:146-152</C>) and the inner row (<C>:183</C>), and{" "}
                  <C>&#123;...rest&#125;</C> (<C>:181</C>) hands <C>onKeyDown</C> to the
                  wrapper if the caller wants one.
                </>
              ),
            },
          ]}
        />
        <p>
          There is one non-keyboard side effect worth knowing about, because it is the
          only place the component acts on its own: a <C>useLayoutEffect</C> measures the
          group&rsquo;s origin and re-renders it onto the device-pixel grid, observing the
          element, its parent and <C>window.resize</C> (<C>:116-136</C>). It is guarded for
          SSR and for environments with no <C>ResizeObserver</C> (<C>:117-120</C>), the
          observer is disconnected on unmount (<C>:133</C>), and it never touches focus or
          selection.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The component emits no strings: no <C>useKitT</C>, no key into{" "}
          <C>common/i18n/builtIn/</C>, no default label. Its whole vocabulary is class
          names and four custom properties (<C>:162-178</C>); text arrives only as{" "}
          <C>label</C> and <C>children</C> and is rendered verbatim (<C>:151</C>,
          <C>:184</C>). So the translation work is entirely the caller&rsquo;s, and the
          component&rsquo;s job is to not fight it — which, in one specific place, it
          does.
        </p>
        <p>
          The clusters mirror. The root is a flex row (<C>:153</C>) and the inner row is
          another (<C>:183</C>), so with <C>dir=&quot;rtl&quot;</C> the groups and their
          items reverse on the inline axis, and <C>gap</C>-based spacing (
          <C>ITEM_GAP</C>, <C>:16-22</C>) is direction-agnostic. The <em>rule</em> does
          not. Its gutter is a physical <C>margin-left</C> (<C>[&amp;+&amp;]:ml-[…]</C>,{" "}
          <C>:62</C>) and its position is a physical <C>left</C> fed by a negative pixel
          value computed in JS (<C>:65</C>,<C>:165-167</C>) from{" "}
          <C>getBoundingClientRect().left</C> (<C>:123</C>) — viewport coordinates, which
          know nothing about writing mode. Set the stage to RTL and you can watch the
          consequence: the clusters flip and the line ends up on the outside of the
          gutter. The honest options are to keep <C>divider=&#123;false&#125;</C> in RTL
          surfaces and draw the rule with logical utilities (<C>ms-*</C>/<C>me-*</C>), or
          to override the two custom properties through <C>style</C> (<C>:178</C> — the
          caller&rsquo;s <C>style</C> is spread last inside the object) with a positive
          offset. What you should not do is assume mirroring: nothing in this file mirrors
          it.
        </p>
        <A11yCode filename="RightToLeft.tsx" code={RTL_CODE} />
      </A11yTopic>

      <A11yTopic title="The rule&rsquo;s arithmetic">
        <p>
          Three ladders and one formula, all private to the component. <C>GAP_PX</C>{" "}
          (<C>:7-13</C>) turns <C>gap</C> into pixels for the gutter;{" "}
          <C>SEPARATOR_THICKNESS</C> (<C>:28-34</C>) turns <C>separatorSize</C> into the
          same 1/2/3/4/6 steps <C>AppDivider</C> uses — or takes a raw number, since the
          prop is <C>ControlSize | number</C> (<C>:88</C>,<C>:141-143</C>); and the
          offset is <C>-round((gapPx + separatorPx) / 2)</C> (<C>:165-167</C>), so at the
          defaults a 1 px rule sits <C>-5px</C> from the group that draws it in an 8 px
          gutter. The kit pins each of those numbers: <C>24px</C>/<C>-13px</C> at{" "}
          <C>gap=&quot;xl&quot;</C> (:28-40 of the test), the whole thickness ladder
          (:109-127), raw pixels (:129-138).
        </p>
        <p>
          The centring is <C>top-1/4</C> + <C>h-1/2</C> (<C>:66-67</C>) — half the group,
          which is <C>h-full</C> (<C>:153</C>), which is the bar. That is why the height
          slider is in the playground: the rule grows with the bar instead of staying a
          fixed 16 px. And the reason it carries <em>no</em> transform (:41-59) is a
          raster bug worth knowing before you add one: a <C>-translate-y-1/2</C> takes the
          pseudo-element out of paint-time pixel snapping, so on a header at a fractional
          layout origin a 1 px rule anti-aliases across two device pixels and some
          separators read thicker than others. The component&rsquo;s answer is integer
          arithmetic plus the <C>ResizeObserver</C> snap (<C>:122-124</C>), and the test
          asserts the class list stays transform-free (:140-145).
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable props={HEADERGROUP_PROPS} />
  </div>
);

/**
 * The API as declared at :72-97 — seven props of its own, the inherited set with
 * `color` deliberately excluded, and the pass-through that quietly outranks
 * `label`.
 */
export const HEADERGROUP_PROPS: PropDoc[] = [
  {
    name: "children",
    type: "ReactNode",
    description: (
      <>
        The controls in this cluster (:76). They go into an inner row of{" "}
        <C>flex items-center px-1</C> plus the <C>itemGap</C> class (:183-185), rendered
        verbatim — no wrapper, no reordering, no extra tab stop.
      </>
    ),
  },
  {
    name: "gap",
    type: "ControlSize",
    default: "sm",
    description: (
      <>
        <C>xs</C> <C>sm</C> <C>md</C> <C>lg</C> <C>xl</C> → 4/8/12/16/24 px (
        <C>:7-13</C>) as <C>--header-group-gap</C> (<C>:162</C>). One value, two
        effects: the gutter between adjacent groups and the rule&rsquo;s offset (
        <C>:165-167</C>, pinned together at <C>HeaderGroup.test.tsx:28-40</C>).
      </>
    ),
  },
  {
    name: "itemGap",
    type: "ControlSize",
    default: "xs",
    description: (
      <>
        The same scale mapped to <C>gap-1</C>…<C>gap-6</C> (<C>:16-22</C>) on the inner
        row only (:183) — the space between a cluster&rsquo;s own controls, never
        between clusters (test :71-97).
      </>
    ),
  },
  {
    name: "divider",
    type: "boolean",
    default: "true",
    description: (
      <>
        Adds the whole <C>[&amp;+&amp;]</C> separator ladder to the class list (
        <C>:157</C>,<C>:61-70</C>). Off, the rule is gone rather than transparent — and
        a lone group never draws one, because the rule belongs to the second of two
        adjacent groups (test :18-26).
      </>
    ),
  },
  {
    name: "separatorSize",
    type: "ControlSize | number",
    default: "xs",
    description: (
      <>
        Rule thickness: the named ladder 1/2/3/4/6 px (<C>:28-34</C>) or a raw number of
        pixels (<C>:141-143</C>), landing in <C>--header-group-sep-w</C> (
        <C>:168</C>). Drawn transform-free on purpose, so the browser pixel-snaps it
        (<C>:41-59</C>, test :140-145).
      </>
    ),
  },
  {
    name: "tone",
    type: "TrueColor",
    default: "— none (the rule follows the copy)",
    description: (
      <>
        <C>var(--color-&#123;tone&#125;-400)</C> when set; otherwise{" "}
        <C>color-mix(in srgb, currentColor 25%, transparent)</C> (both at{" "}
        <C>:175-177</C>; the kit pins both halves — <C>:54-61</C> for the wash, <C>:63-68</C> for every tone). Untoned is the surface-aware answer — the
        old flat <C>bg-neutral-300</C> had no dark partner and vanished on a dark
        header. Worth knowing when you re-tint: the JSDoc at <C>:90-91</C> promises
        <em>the surface&rsquo;s own divider colour</em>, and what <C>:177</C> mixes is
        25% of the copy colour <C>:156</C> just chose — the same adaptation by way of
        <C>currentColor</C>, a different token, so a <C>surface.divider</C> change
        will not move this rule.
      </>
    ),
  },
  {
    name: "label",
    type: "string",
    default: "— none (an unnamed group)",
    description: (
      <>
        Becomes <C>aria-label</C> on the <C>role=&quot;group&quot;</C> wrapper (
        <C>:151</C>,<C>:150</C>); the kit tests for it by name (:10-15). An unnamed
        group is legal and usually skipped, so treat this as required in practice.
      </>
    ),
  },
  {
    name: "className",
    type: "string",
    description: (
      <>
        Appended last by <C>classNames</C> (<C>:152-159</C>), so it adds to{" "}
        <C>relative flex h-full items-center</C> and the surface copy class instead of
        replacing either (test :155-163).
      </>
    ),
  },
  {
    name: "style",
    type: "CSSProperties",
    description: (
      <>
        Spread <em>after</em> the four generated custom properties (
        <C>:160-179</C>), so it is the documented override hook —{" "}
        <C>&#123;&#123; &quot;--header-group-sep-x&quot;: &quot;6px&quot; &#125;&#125;</C>{" "}
        beats the computed offset. Anything else you pass lands on the root.
      </>
    ),
  },
  {
    name: "…div props",
    type: "HTMLAttributes<HTMLDivElement> without color",
    description: (
      <>
        <C>Omit&lt;…, &quot;color&quot;&gt;</C> (:72-75) keeps a stray <C>color</C>{" "}
        from landing on the wrapper, and the rest is spread last (
        <C>:181</C>) — which means a passed <C>aria-label</C> or <C>role</C> replaces{" "}
        <C>:150-151</C> rather than joining them.
      </>
    ),
  },
  {
    name: "ref",
    type: "— none",
    description: (
      <>
        A <C>React.FC</C> (:99) with no <C>forwardRef</C>. The internal{" "}
        <C>useRef</C> at <C>:112</C> belongs to the pixel snap and is not exposed; the{" "}
        <C>displayName</C> at <C>:190</C> is the only other thing the module adds.
      </>
    ),
  },
];

const NAMING_CODE = `// The role is unconditional (:150); the name is yours, and an unnamed
// group is usually skipped.
<HeaderGroup label="View controls">
  <IconButton icon="ViewGrid" srLabel="Grid view" />
  <IconButton icon="Notification" srLabel="Alerts" />
</HeaderGroup>;

// Wrong: no name. The buttons are still reachable, but nothing says what they are
// a set of — and the separator is not it: content is empty ('', :63), so it is
// decoration the accessibility tree never sees.
<HeaderGroup>
  <IconButton icon="ViewGrid" srLabel="Grid view" />
</HeaderGroup>;`;

const RTL_CODE = `// The clusters mirror, the rule does not.
<div dir="rtl">
  <HeaderGroup label="التنقل">
    <IconButton icon="Back" srLabel="خلف" />
  </HeaderGroup>
  <HeaderGroup label="العرض">
    <CustomIcon icon="ViewGrid" size="sm" tone="blue" />
  </HeaderGroup>
</div>;

// margin-left (:62) and left (:65) are physical, and the negative offset is
// computed from viewport coordinates (:123,:165-167), so the line lands outside
// the gutter. Either drop the rule and draw it with logical utilities…
<HeaderGroup divider={false} label="التنقل">…</HeaderGroup>;

// …or keep the rule and override the two properties it reads (:178 lets you).
<HeaderGroup label="العرض" style={{ "--header-group-sep-x": "6px" }}>…</HeaderGroup>;`;

export default HeaderGroupPage;
