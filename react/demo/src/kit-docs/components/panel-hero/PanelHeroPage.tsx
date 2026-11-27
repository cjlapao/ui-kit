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
import { PanelHeroPlayground } from "./PanelHeroPlayground";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import Gradient from "./examples/Gradient";
import gradientCode from "./examples/Gradient.tsx?raw";
import WithActions from "./examples/WithActions";
import withActionsCode from "./examples/WithActions.tsx?raw";

export const PanelHeroPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Panel Hero"
      description="A banner: an icon, a heading, a supporting line, and anything you hand it as children. One variant is a saturated band the component paints itself; the other nine are a Panel wearing hero clothing — which is why some props answer only on one branch, and why the copy is white on the band and surface-coloured everywhere else."
    />
    <PanelHeroPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Every tone"
        description="Each stays in its own tone: the band is the tone&rsquo;s 700 into its 800 (:309-312). The table this replaces mapped every tone to a neighbour&rsquo;s pair — sky painted sky→indigo, red painted red→rose — and the kit now asserts, per colour that no lighter stop may appear (test :46-56 pins each tone to its own 700/800 pair; :58-69 forbids the 300-600 range)."
        code={tonesCode}
        filename="Tones.tsx"
      >
        <Tones />
      </ExampleCard>
      <ExampleCard
        title="Variants"
        description="gradient is the band; the other nine entries of PANEL_HERO_VARIANTS (:30) are a Panel, so they bring their own fill, ring and glass props (:281-303) and take their copy from the surface instead of being forced to white (:200,:210, test :141-152). With no icon, no chip is drawn at all (:181, test :196-199)."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="Title, subtitle and the icon chip move together on the shared control scale (:111-117,:128-134). The subtitle&rsquo;s scale used to stop at md and the chip was 48px whatever the type did; both are ControlSize now (:33-36, test :90-105)."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="Stops and glow"
        description="The stops are overridable (test :71-80), and a halo sits behind the band at the chosen intensity — inset inside the padding the band reserves (:315,:323 + Theme.ts:2056-2058) so an ancestor with overflow:auto cannot cut it. Overriding the stops opts out of the contrast floor, so keep white copy in mind."
        code={gradientCode}
        filename="Gradient.tsx"
      >
        <Gradient />
      </ExampleCard>
      <ExampleCard
        title="With actions"
        description="Children land in their own row under the title (mt-4, :218) — the natural home for a banner&rsquo;s buttons. They were once spread onto the wrapper and then overwritten by the body, which is a bug the kit keeps a test for on both branches (:31-43)."
        code={withActionsCode}
        filename="WithActions.tsx"
      >
        <WithActions />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          Two decisions decide what a screen reader hears, and both belong to the
          caller. <C>titleAs</C> picks the element the title is rendered as (
          <C>:70</C>,<C>:164</C>,<C>:196</C>), and it defaults to <C>p</C> (:237) — legal, and
          useless at the top of a page, where a banner that looks like an{" "}
          <C>h1</C> and says <C>p</C> appears nowhere in the heading outline. The
          kit pins both halves: the default is a <C>p</C> (test :156-159) and every
          member of <C>PANEL_HERO_TITLE_ELEMENTS</C> is reachable (test :161-170).
          The second decision is <C>children</C>: your actions render in their own
          row under the title (<C>:218</C>), in reading order, after having once
          been spread onto the wrapper and quietly overwritten by the body (test{" "}
          <C>:31-43</C>).
        </p>
        <p>
          Everything else on the banner is deliberately absent from the tree. The
          halo, the three circles and the diagonal wash are <C>aria-hidden</C> (
          <C>:320</C>,<C>:349</C>,<C>:353</C>,<C>:357</C>,<C>:364</C>) and{" "}
          <C>pointer-events-none</C>, so they are neither announced nor clickable.
          The icon chip is decorative too, though not by an attribute here: the
          component builds <C>CustomIcon</C> without its <C>alt</C> prop (
          <C>:168-172</C>), and <C>CustomIcon</C> hides itself when no alt is
          given (<C>CustomIcon.tsx:127</C>,<C>:131</C>) — so a hero&rsquo;s glyph
          never competes with its title. Note the asymmetry when you reach for a
          landmark: the surface branch is a <C>Panel</C>, which renders a{" "}
          <C>section</C> (Panel.tsx:1273, test :132-139), while the band is a plain{" "}
          <C>div</C> (<C>:331</C>) — and an unnamed <C>section</C> is not a landmark
          either, so name it yourself via the props spread, which lands last on
          both branches (<C>:298</C>,<C>:343</C>).
        </p>
        <A11yCode filename="Semantics.tsx" code={SEMANTICS_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          <C>PanelHero.tsx</C> compares no key and takes no focus: no{" "}
          <C>onKeyDown</C>, <C>onKeyUp</C>, <C>onKeyPress</C> or <C>tabIndex</C>{" "}
          appears anywhere in its 399 lines, and it has no listener at all — the
          two components that make up the file (:152-221,:234-371) are pure render. What the banner does decide is that
          it is not a scroller: the Panel branch forces <C>scrollable=&#123;false&#125;</C>{" "}
          (<C>:297</C>) against Panel&rsquo;s own default of <C>true</C>{" "}
          (Panel.tsx:706), and the band is <C>overflow-hidden</C> (<C>:333</C>).
          Nothing here can be scrolled by keyboard or mouse, which is the point of
          a banner: content that overflows a hero is a layout bug, not a gesture.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: (
                <>
                  Into your <C>children</C> and nothing else (<C>:218</C>,
                  <C>:367</C>). The chip, the halo and the decorations add no
                  focusable node — the icon is an <C>svg</C> with{" "}
                  <C>focusable=&quot;false&quot;</C> (CustomIcon.tsx:131) and every
                  painted layer is <C>pointer-events-none</C>.
                </>
              ),
            },
            {
              keys: ["arrow"],
              action: (
                <>
                  Nothing. There is no composite widget here to walk: no tabs, no
                  list, no roving focus — the title row is a flex row of a chip and
                  two text blocks (<C>:180</C>,<C>:195-216</C>).
                </>
              ),
            },
            {
              keys: ["Any"],
              action: (
                <>
                  Nothing at this level. <C>&#123;...rest&#125;</C> is spread last
                  on both branches (<C>:298</C>,<C>:343</C>), so a caller&rsquo;s{" "}
                  <C>onKeyDown</C> lands on the Panel or the band, and can be
                  relied on to be the only handler in the chain.
                </>
              ),
            },
          ]}
        />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The component emits no strings: no <C>useKitT</C>, no key into{" "}
          <C>common/i18n/builtIn/</C>, no default title or subtitle. Its entire
          vocabulary is class names and two inline gradients (:327,:339), and every
          word on screen is <C>title</C>, <C>subtitle</C> or <C>children</C>{" "}
          rendered verbatim (:203,:213,:218,:367) — so there is nothing here to
          translate, and nothing here to localise wrongly either. Two pieces of
          copy hygiene are the component&rsquo;s gift, though: the title row gives
          the text <C>min-w-0 flex-1</C> (<C>:195</C>,<C>:367</C>), so a German
          compound or an Arabic sentence wraps inside the chip&rsquo;s shadow
          instead of pushing through the band, and the sizes are the shared{" "}
          <C>ControlSize</C> scale (:33-38) rather than a truncated one (:90-105).
        </p>
        <p>
          What does <em>not</em> mirror is the paint. The band&rsquo;s gradient is
          written as <C>to bottom right</C> (<C>:339</C>), the wash is{" "}
          <C>bg-linear-to-tr</C> (<C>:363</C>) and the circles are pinned with
          physical offsets — <C>-right-10 -top-10</C> and <C>-left-8 -bottom-10</C>{" "}
          (<C>:348</C>,<C>:352</C>) — so under <C>dir=&quot;rtl&quot;</C> the text
          row flips and the artwork stays exactly where it was. That is a taste
          decision rather than a defect, but it means an RTL page gets the same
          visual weight on the same physical side as an LTR one; the only prop
          lever you have is the stops themselves (:95-97). The halo, for what it is
          worth, is symmetric (<C>inset-*</C>, <C>:323</C>) and mirrors perfectly.
        </p>
        <A11yCode filename="RightToLeft.tsx" code={RTL_CODE} />
      </A11yTopic>

      <A11yTopic title="The paint">
        <p>
          Two gradients, deliberately different. The band runs between the
          tone&rsquo;s <C>700</C> and <C>800</C> (<C>:309-312</C>) because that is
          where white copy clears the kit&rsquo;s measured floor — 4.93:1 at worst,
          on yellow, against 2.94:1 at <C>-400</C> where the old hand-written table
          put it (<C>:223-233</C>, test :58-69 asserts no lighter stop can appear).
          The halo behind it uses <C>600</C> and <C>400</C> (
          <C>Theme.ts:2093-2100</C>), and since both carry a gradient the kit
          reaches for the band by <C>data-variant=&quot;gradient&quot;</C> rather
          than matching CSS, which JSDOM rewrites (test :19-27).
        </p>
        <p>
          Two more traps worth knowing before you style past the props. The corner
          scale&rsquo;s names do not match its classes: <C>corner=&quot;rounded-md&quot;</C>{" "}
          — the default (:261-262) — emits <C>rounded-2xl</C>, because{" "}
          <C>surfaceCornerClasses</C> sits a step looser than its names
          (Theme.ts:1511-1515), and <C>&quot;auto&quot;</C> is not a radius at all
          but a request to inherit the theme&rsquo;s container corner
          (Theme.ts:1497-1501). And <C>style</C> is a footgun on the band only: the
          component sets <C>style=&#123;&#123; backgroundImage &#125;&#125;</C> at{" "}
          <C>:338-340</C> and spreads <C>...rest</C> <em>after</em> it (
          <C>:343</C>), so passing a <C>style</C> replaces the gradient outright
          rather than merging with it. On the Panel branch the same spread lands on{" "}
          <C>Panel</C> (<C>:298</C>) and behaves as expected.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable props={PANELHERO_PROPS} />
  </div>
);

/**
 * The API as declared at :52-109 — with the two props whose documented
 * defaults disagree with the code called out where a reader will hit them.
 */
export const PANELHERO_PROPS: PropDoc[] = [
  {
    name: "children",
    type: "ReactNode",
    description: (
      <>
        Actions or extra copy, rendered in their own row under the title (
        <C>:218</C>,<C>:367</C>). They used to be spread onto the wrapper and then
        overwritten by the body — a silently empty banner, now a test on both
        branches (:31-43).
      </>
    ),
  },
  {
    name: "title",
    type: "ReactNode",
    description: (
      <>
        Required (:62). Rendered inside the title row at <C>titleSize</C> with the
        gradient&rsquo;s own white (
        <C>:196-204</C>) or the surface&rsquo;s heading colour (
        <C>:200</C>).
      </>
    ),
  },
  {
    name: "subtitle",
    type: "ReactNode",
    description: (
      <>
        The supporting line (:64), at <C>subtitleSize</C>. On the band it is{" "}
        <C>text-white/75</C> (<C>:210</C>); on a surface it is{" "}
        <C>surfaceText.description</C> (<C>:210</C>).
      </>
    ),
  },
  {
    name: "titleAs",
    type: "PanelHeroTitleElement",
    default: "p",
    description: (
      <>
        <C>h1</C>…<C>h6</C> or <C>p</C> (:41-50,:155). The default keeps the
        existing look; a page-top banner should say <C>h1</C> or <C>h2</C> or it
        is invisible to the heading outline (test :156-170).
      </>
    ),
  },
  {
    name: "icon",
    type: "IconName | ReactElement",
    default: "— none (no chip is drawn)",
    description: (
      <>
        A registry name goes through <C>CustomIcon</C>, sized by{" "}
        <C>titleSize</C> (<C>:168-172</C> + <C>CHIP_SIZES</C> :128-134); a node is
        rendered verbatim (<C>:174</C>), so you own its size. Either way the glyph
        is decorative (CustomIcon.tsx:127,:131), and with no icon there is no chip
        at all (test :196-199).
      </>
    ),
  },
  {
    name: "variant",
    type: "PanelHeroVariant",
    default: "gradient",
    description: (
      <>
        <C>gradient</C> is the band the component paints (:305-346); the other
        nine are <C>PANEL_HERO_VARIANTS</C> minus it (:30) rendered by a{" "}
        <C>Panel</C> (<C>:281-303</C>). Only the band reads{" "}
        <C>data-variant=&quot;gradient&quot;</C> (<C>:341</C>).
      </>
    ),
  },
  {
    name: "tone",
    type: "SurfaceTone",
    default: "— none (neutral, not blue)",
    description: (
      <>
        Drives the band&rsquo;s stops (:309-312), the halo (
        <C>Theme.ts:2093-2100</C>) and <C>data-tone</C> (<C>:342</C>). The JSDoc
        says <C>@default &quot;blue&quot;</C> at :73; the code destructures nothing
        (:239) and falls through <C>tone ?? color ?? &quot;none&quot;</C> (
        <C>:260</C>) to <C>neutral</C> (Theme.ts:69).
      </>
    ),
  },
  {
    name: "color",
    type: "TrueColor",
    description: (
      <>
        A second name for <C>tone</C>, so a hero matches the rest of the kit
        (:75-76) — <C>tone ?? color</C> at <C>:260</C>, and the kit asserts the two
        are interchangeable (test :82-86). Not deprecated; the module&rsquo;s own
        <C>Hero</C>-prefixed aliases are (:382-399).
      </>
    ),
  },
  {
    name: "titleSize",
    type: "ControlSize",
    default: "sm",
    description: (
      <>
        <C>:111-117</C> — and note the weight changes with it:{" "}
        <C>font-bold</C> up to <C>md</C>, <C>font-semibold</C> at{" "}
        <C>lg</C>/<C>xl</C>. It also picks the icon chip&rsquo;s box (
        <C>:128-134</C>), which used to be 48px regardless.
      </>
    ),
  },
  {
    name: "subtitleSize",
    type: "ControlSize",
    default: "xs",
    description: (
      <>
        Same scale (:119-125). It was once truncated to{" "}
        <C>xs | sm | md</C>, so a hero could not be sized past <C>md</C> to match
        the controls beside it (test :90-105).
      </>
    ),
  },
  {
    name: "padding",
    type: "SurfacePadding",
    default: "sm",
    description: (
      <>
        <C>none</C> plus the control scale (Theme.ts:1708-1709), applied by{" "}
        <C>getSurfacePaddingClass</C> (:334) — the same padding a <C>Panel</C>{" "}
        takes, so a hero and a card line up.
      </>
    ),
  },
  {
    name: "corner",
    type: "SurfaceCorner",
    default: "rounded-md",
    description: (
      <>
        Resolved at <C>:261-262</C> to the theme&rsquo;s container default
        (Theme.ts:1531-1532) — which is the <em>name</em> for the class{" "}
        <C>rounded-2xl</C> (Theme.ts:1511-1515). <C>&quot;auto&quot;</C> means
        &ldquo;inherit the theme&rdquo;, not &ldquo;no radius&rdquo;
        (Theme.ts:1497-1501).
      </>
    ),
  },
  {
    name: "rounded",
    type: "boolean",
    default: "true",
    description: (
      <>
        Deprecated in favour of <C>corner</C> (:87-88) and ignored when{" "}
        <C>corner</C> is set (<C>:261</C>). It still works, and a test keeps it
        working: <C>rounded=&#123;false&#125;</C> drops <C>rounded-2xl</C>{" "}
        entirely (test :118-121).
      </>
    ),
  },
  {
    name: "decoration",
    type: "PanelDecoration",
    default: "both",
    description: (
      <>
        <C>none</C> <C>gradient</C> <C>shapes</C> <C>both</C> — on the band that
        means three circles and a diagonal wash (<C>:345-366</C>, test :174-193);
        on a surface it is forwarded to <C>Panel</C> (<C>:291</C>), whose
        decoration is a different picture.
      </>
    ),
  },
  {
    name: "gradientFrom / gradientTo",
    type: "string",
    default: "— the tone&rsquo;s 700 and 800",
    description: (
      <>
        <C>:95-97</C>,<C>:309-312</C>. Anything CSS accepts, including another
        tone&rsquo;s variable (test :71-80). Both are an opt-out from the contrast
        floor the defaults hold (:223-233).
      </>
    ),
  },
  {
    name: "glowIntensity",
    type: "GlowIntensity",
    default: "soft",
    description: (
      <>
        <C>subtle</C> <C>soft</C> <C>medium</C> <C>strong</C> (Theme.ts:501-502);
        the component&rsquo;s own answer is <C>soft</C> (:250), one step above the
        kit&rsquo;s standing <C>DEFAULT_GLOW_INTENSITY</C> (Theme.ts:510). Each step
        reserves its own padding and inset (<C>:315</C>,<C>:323</C>) — that is what
        stops a scroller clipping the halo. Band only: a <C>Panel</C> surface gets
        no glow (it is not among the props forwarded at :285-298).
      </>
    ),
  },
  {
    name: "glassOpacity / transparency / vibrancy / specularMode",
    type: "GlassOpacity / SurfaceTransparency / GlassVibrancy / SpecularMode",
    default: "— none (Panel decides)",
    description: (
      <>
        Forwarded straight to <C>Panel</C> (<C>:292-295</C>), so they do nothing
        on the band and nothing the surface would not do anyway. Transparency is{" "}
        <C>none | low | medium | high</C> and Panel already picks <C>high</C> for
        glass, liquid-glass and subtle (surfaceTransparency.ts:3-9).
      </>
    ),
  },
  {
    name: "raisedSurface",
    type: "boolean",
    default: "false",
    description: (
      <>
        Forwarded to <C>Panel</C> (:296) to force at least the first nested
        panels depth step, so a tinted card stays visible on a matching
        background (:107). Band only, like the glass knobs — a gradient has no fill to
        lift.
      </>
    ),
  },
  {
    name: "className",
    type: "string",
    description: (
      <>
        Merged with <C>classNames</C> on <em>whichever</em> element the variant
        picks: the band (<C>:332-337</C>) or the <C>Panel</C>
        (<C>:286</C>). Same prop, two DOM positions — check the variant before
        debugging a style that seems to miss.
      </>
    ),
  },
  {
    name: "style",
    type: "CSSProperties",
    description: (
      <>
        Lives only in <C>rest</C>, and <C>rest</C> is spread <em>after</em> the
        band&rsquo;s own <C>style=&#123;&#123; backgroundImage &#125;&#125;</C> (
        <C>:338-343</C>) — so on the gradient it <em>replaces</em> the band&rsquo;s
        paint instead of adding to it. Use <C>gradientFrom</C>/
        <C>gradientTo</C> for colour, and keep <C>style</C> for the Panel branch.
      </>
    ),
  },
  {
    name: "…div props",
    type: "HTMLAttributes<HTMLDivElement> without title and color",
    description: (
      <>
        <C>Omit&lt;…, &quot;title&quot; | &quot;color&quot;&gt;</C> (:52-55) so the
        HTML <C>title</C> tooltip cannot shadow the heading. The rest lands last on
        both branches (<C>:298</C>,<C>:343</C>), which is how you name the banner
        for assistive technology.
      </>
    ),
  },
  {
    name: "ref",
    type: "— none",
    description: (
      <>
        A plain function component (:145) with no <C>forwardRef</C>;{" "}
        <C>displayName</C> at <C>:373</C> and the deprecated <C>Hero</C> aliases
        (:382-399) are the only other exports.
      </>
    ),
  },
];

const SEMANTICS_CODE = `// A page-top banner must enter the heading outline (:155, test :161-170).
<PanelHero titleAs="h1" title="Deploy pipeline" subtitle="main · 3 running" />;

// Actions belong in children — under the title row, in reading order (:218).
// They were once spread onto the wrapper and overwritten by the body (:31-43).
<PanelHero titleAs="h2" title="Index failed" tone="rose" icon="Warning">
  <Button variant="outline">View logs</Button>
</PanelHero>;

// Naming the banner is up to you: the band is a div (:331) and Panel's section
// is unnamed until you say so — the spread lands last, on both branches (:298,:343).
<PanelHero aria-label="Release status" title="Canary 1.4.2" />;`;

const RTL_CODE = `// The copy flips; the paint does not.
<div dir="rtl">
  <PanelHero
    title="خط النشر"
    subtitle="main · 3 قيد التشغيل"
    tone="indigo"
    titleAs="h2"
  />
</div>;

// The band is "to bottom right" (:339), the wash is "bg-linear-to-tr" (:363) and
// the circles are pinned with -right-10 / -left-8 (:348,:352) — all physical, so
// the artwork keeps its LTR weight. Steer the gradient with the stop props, which
// are the only levers that reach it (:95-97).
<PanelHero
  dir="rtl"
  title="خط النشر"
  gradientFrom="var(--color-indigo-800)"
  gradientTo="var(--color-indigo-600)"
/>;`;

export default PanelHeroPage;
