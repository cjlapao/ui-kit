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
import { PageHeaderPlayground } from "./PageHeaderPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import WithSideMenu from "./examples/WithSideMenu";
import withSideMenuCode from "./examples/WithSideMenu.tsx?raw";
import FloatingShell from "./examples/FloatingShell";
import floatingShellCode from "./examples/FloatingShell.tsx?raw";

export const PageHeaderPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Page Header"
      description="The bar across the top of the main column — the Toolbar's page-level sibling. Same start / center / end regions, but the furniture of a page (brand, breadcrumb, controls) and the SideMenu's own header chrome, so the seam line runs across the shell unbroken. The floating variants pair with the floating SideMenu as one detached-card system. (Not to be confused with the docs' own page-title block, which shares the name locally.)"
    />
    <PageHeaderPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="Brand and breadcrumb trail on the left, page controls on the right — the regions of a Toolbar wearing header chrome."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="With SideMenu"
        description="The pairing it exists for: the sidebar's logo header and this bar paint the same height, seam colour and fill from one set of constants, so the horizontal line crosses the shell in one stroke — collapse the menu and nothing moves."
        code={withSideMenuCode}
        filename="WithSideMenu.tsx"
      >
        <WithSideMenu />
      </ExampleCard>
      <ExampleCard
        title="Floating pairing"
        description="Set to the same treatment as the SideMenu, the header becomes the menu's card twin: shared offset, corner, rim and shadow resolved from the same token function — the opaque pair above, the frosted tone-tinted pair below. The seam only belongs to the flush world; a detached card has none to continue."
        code={floatingShellCode}
        filename="FloatingShell.tsx"
      >
        <FloatingShell />
      </ExampleCard>
    </section>
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The element is a <C>&lt;header&gt;</C> (<C>:160</C>) and the component
          invents nothing on top of it: no <C>role</C>, no <C>aria-label</C>, no{" "}
          <C>aria-labelledby</C> — the only <C>aria-</C>* in its 198 lines is the{" "}
          <C>aria-hidden</C> that keeps the decorative surface layer out of the
          tree (<C>:182</C>). So the semantics depend on where you mount it: a{" "}
          <C>&lt;header&gt;</C> at page top level is the <em>banner</em>{" "}
          landmark; the same element inside <C>&lt;main&gt;</C> or an{" "}
          <C>&lt;article&gt;</C> is a plain <C>sectionheader</C> and is not
          reachable as a landmark. Banners are found <em>by name</em>, and an
          unnamed one is just &ldquo;banner&rdquo; — which is why the name is a
          caller decision, passed through <C>&#123;...rest&#125;</C> (<C>:161</C>,
          asserted by test :14-22). It is deliberately not{" "}
          <C>role=&quot;toolbar&quot;</C>: that is its sibling&rsquo;s job.
        </p>
        <p>
          The three regions are ordinary <C>div</C>s that stay in the DOM when
          empty (<C>:188-190</C>, test :39-47), so they contribute nothing to the
          tree; what a screen reader hears from the bar is exactly the content you
          passed, in DOM order.
        </p>
        <A11yCode filename="Naming.tsx" code={NAMING_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          <C>PageHeader.tsx</C> compares no key and takes no focus: no{" "}
          <C>onKeyDown</C>, <C>onKeyUp</C>, <C>onKeyPress</C> or <C>tabIndex</C>{" "}
          appears in its 198 lines, and no listener is attached. Nor does it
          forward a ref — it is a plain function component (<C>:114</C>) with no{" "}
          <C>forwardRef</C> — so a keyboard shortcut that has to reach the bar goes
          through <C>&#123;...rest&#125;</C> like everything else. Nothing here
          implements the ARIA toolbar pattern either; the controls you pass stay
          individually tabbable, which means none of them can be skipped or
          trapped.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: (
                <>
                  Through every control you passed, in DOM order: start, center,
                  end, then the children group (<C>:188-191</C>, asserted by test{" "}
                  :24-37 and :49-58). The bar itself never receives focus — a{" "}
                  <C>header</C> with no <C>tabIndex</C> is not a stop.
                </>
              ),
            },
            {
              keys: ["shift", "tab"],
              action: (
                <>
                  Backwards through the same controls. Nothing is hidden behind a
                  disclosure and nothing traps focus, so a keyboard user can always
                  leave the bar the way they came.
                </>
              ),
            },
            {
              keys: ["arrow"],
              action: (
                <>
                  Nothing, at this level. There is no roving tabindex to walk —
                  between two icon buttons in the <C>end</C> group the arrow keys are
                  the browser&rsquo;s, which for a <C>button</C> means no movement at
                  all. Reach for the controls&rsquo; own bindings (<C>Button</C>,{" "}
                  <C>IconButton</C>) when you need activation.
                </>
              ),
            },
            {
              keys: ["Any"],
              action: (
                <>
                  <C>&#123;...rest&#125;</C> is spread onto the root first (
                  <C>:161</C>), so a caller&rsquo;s <C>onKeyDown</C> is the only
                  handler in the chain — and the only one you can add, since the
                  component adds none.
                </>
              ),
            },
          ]}
        />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The bar emits no strings: there is no <C>useKitT</C>, no message key, no
          placeholder anywhere in the file — every word on screen comes from the
          nodes you pass into the regions, so a translation layer feeds the header
          through its content and nothing else. Layout carries the rest. Each
          region is <C>flex min-w-0 flex-wrap items-center gap-3</C> (<C>:109</C>)
          inside a <C>justify-between gap-4</C> row (<C>:163</C>), so a longer
          translation wraps <em>inside</em> its own group — <C>min-w-0</C> is what
          lets it shrink instead of pushing the row wider — and the spacing between
          groups is <C>gap</C>, never a physical margin.
        </p>
        <p>
          Direction is where the two halves of the API differ, and it is worth
          knowing before you mirror a shell. <C>start</C> / <C>center</C> /{" "}
          <C>end</C> are DOM-order names, so under <C>dir=&quot;rtl&quot;</C> the
          row reverses and the regions mirror with it, the centre holding because{" "}
          <C>justify-between</C> measures both flanks symmetrically. The gutter
          props do not: <C>paddingTop</C> and friends are resolved to{" "}
          <C>mt-*</C>, <C>mr-*</C>, <C>mb-*</C>, <C>ml-*</C> (
          <C>:165-168</C> → Theme.ts:1932-1935), which are <em>physical</em>{" "}
          margins. On a floating card in a right-to-left shell the default pair —
          open above and to the <em>right</em>, flush below and left (<C>:151-156</C>)
          — sits against the wrong edge, and you hand it back the mirror with{" "}
          <C>paddingRight=&quot;none&quot;</C> and <C>paddingLeft=&quot;xs&quot;</C>.
        </p>
        <A11yCode filename="Right-to-left.tsx" code={RTL_CODE} />
      </A11yTopic>

      <A11yTopic title="The gutter, not the padding">
        <p>
          The prop named <C>padding</C> is the space <em>outside</em> the bar: the
          JSDoc says so twice (<C>:73-88</C>) and the implementation paints it as
          margins (<C>:165-168</C>). The inset inside the bar is not adjustable —
          it is the seam&rsquo;s own <C>px-5</C> (<C>:163</C>), the inner{" "}
          <C>Panel</C> is pinned <C>padding=&quot;none&quot;</C> (<C>:185</C>), and
          the height is pinned to the sidebar&rsquo;s logo header at <C>h-15</C>{" "}
          (<C>:164</C> + Theme.ts:1718), which is what the three families of variant
          have to agree on: the flush bar adds <C>border-b</C> in the same fill and
          border colours the <C>SideMenu</C> paints on its facing edge (
          <C>:177</C>, Theme.ts:1719-1721, and test :60-67 fails if either side
          drifts); the two floating names take rim, shadow and fill from the very
          token the floating menu renders (<C>:144-145</C>, test :126-146) and have
          no seam to continue (<C>:49-52</C>); the shared Panel variants put a real{" "}
          <C>Panel</C> behind the groups (<C>:181-186</C>, test :226-235) while{" "}
          <C>none</C> and its <C>plain</C> alias paint nothing at all (
          <C>:142</C>, test :237-243).
        </p>
        <A11yCode filename="Gutter.tsx" code={GUTTER_CODE} />
      </A11yTopic>
    </A11ySection>

    <PropsTable props={PAGEHEADER_PROPS} />
  </div>
);

const NAMING_CODE = `// Two banners on one page — the names are all
// a screen reader has to tell them apart. Neither
// <header> is a landmark if it sits inside <main>.
<PageHeader aria-label="Application" start={brand} end={account} />`;

const RTL_CODE = `/* The regions mirror; the gutters do not. */
<div dir="rtl">
  <PageHeader
    variant="floating"
    start={trail}          // now on the right
    end={actions}          // now on the left
    paddingRight="none"    // mr-* is physical — flip the pair by hand
    paddingLeft="xs"
  />
</div>`;

const GUTTER_CODE = `// "sm" on the outside, and px-5 still on the inside
// (test :173-184 checks both halves of this).
<PageHeader padding="sm" start={trail} end={actions} />
// → class list carries mt-4 mr-4 mb-4 ml-4 *and* px-5.

// Per axis it is the same story: an axis you set wins,
// the ones you leave alone keep the variant's default
// (:153-156). A floating card keeps the menu's m-2 above
// and to the right and sits flush below and left.
<PageHeader variant="floating" paddingTop="none" paddingRight="lg" />
// → mt-0 mr-8 mb-0 ml-0`;

/**
 * Every prop `PageHeaderProps` declares (:24-107), with the default the component
 * actually destructures (:119-133). Two of them are worth reading twice:
 * `padding` is an <em>outer</em> gutter (:73-88) while the inner inset stays the
 * seam's `px-5` (:163), and the five forwarded knobs have no default here at all
 * because they are handed to a `Panel` that owns them (:183-185).
 */
export const PAGEHEADER_PROPS: PropDoc[] = [
  {
    name: "start",
    type: "ReactNode",
    description: (
      <>
        The left group — brand, title, breadcrumb trail (<C>:28</C>). Rendered as
        the first of three always-present <C>div</C>s (<C>:188</C>).
      </>
    ),
  },
  {
    name: "center",
    type: "ReactNode",
    description: (
      <>
        The centred group (<C>:30-32</C>), whose own JSDoc says it is rare in a
        header and should stay narrow: it is centred by <C>justify-between</C> (
        <C>:163</C>), which measures the flanks, so a wide flank moves it.
      </>
    ),
  },
  {
    name: "end",
    type: "ReactNode",
    description: (
      <>
        The right group — theme toggle, search, the signed-in avatar (
        <C>:34-36</C>). Still parks on the right when the other two are empty,
        because those two keep their <C>div</C> (test :39-47).
      </>
    ),
  },
  {
    name: "children",
    type: "ReactNode",
    description: (
      <>
        A fourth group appended after the regions (<C>:38-42</C>,<C>:191</C>) —
        the only one the bar lets go of: it is gated on <C>children != null</C>,
        so it is absent from the DOM until you pass something (test :49-58).
      </>
    ),
  },
  {
    name: "variant",
    type: "PageHeaderVariant",
    default: '"default"',
    description: (
      <>
        Three families in one prop (<C>:43-55</C>,<C>:119</C>): <C>default</C>{" "}
        paints the SideMenu&rsquo;s own header chrome so the seam continues;{" "}
        <C>floating</C> / <C>floating-glass</C> render the detached card from the
        shared sidebar tokens; the rest of <C>SURFACE_VARIANTS</C> put a real{" "}
        <C>Panel</C> behind the groups (<C>:143</C>,<C>:181-186</C>); <C>none</C>{" "}
        and its alias <C>plain</C> paint nothing (<C>:22</C>,<C>:142</C>).
      </>
    ),
  },
  {
    name: "tone",
    type: 'PanelProps["tone"]',
    default: '"none"',
    description: (
      <>
        Panel&rsquo;s palette, destructured as <C>&quot;none&quot;</C> (
        <C>:121</C>) and forwarded to the body <C>Panel</C> at <C>:183</C> — read
        nowhere else, so it is inert on every variant that has no body{" "}
        <C>Panel</C>, and on <C>elevated</C>, which reads no palette
        (Panel.tsx:963-968).
      </>
    ),
  },
  {
    name: "glassOpacity",
    type: 'PanelProps["glassOpacity"]',
    default: "Panel&rsquo;s frosted",
    description: (
      <>
        Forwarded, no default here (<C>:59</C>,<C>:122</C>). Panel spends it on the
        liquid fill and nowhere else (Panel.tsx:1012,:327-333), so it only
        distinguishes itself on <C>liquid-glass</C>.
      </>
    ),
  },
  {
    name: "vibrancy",
    type: 'PanelProps["vibrancy"]',
    default: "Panel&rsquo;s medium",
    description: (
      <>
        Forwarded, no default here (<C>:61</C>,<C>:124</C>). It tunes the
        liquid-glass backdrop (Panel.tsx:1011,:320-324).
      </>
    ),
  },
  {
    name: "specularMode",
    type: 'PanelProps["specularMode"]',
    default: "Panel&rsquo;s classic",
    description: (
      <>
        Forwarded, no default here (<C>:62</C>,<C>:125</C>). The top highlight is a
        liquid-glass feature (Panel.tsx:344-349).
      </>
    ),
  },
  {
    name: "transparency",
    type: 'PanelProps["transparency"]',
    default: "none — the variant answers it",
    description: (
      <>
        Forwarded, no default at all (<C>:60</C>,<C>:123</C>). The scale can only
        thin an alpha background that is already there, and with no{" "}
        <C>/alpha</C> in the class list the classes come back untouched
        (surfaceTransparency.ts:27) — which is why it is invisible on a{" "}
        <C>bg-white</C> surface.
      </>
    ),
  },
  {
    name: "raisedSurface",
    type: "boolean",
    default: "false",
    description: (
      <>
        Forwarded (<C>:63</C>,<C>:126</C>,<C>:184</C>) to force at least the first
        nesting step, so a tinted card stays visible on a matching background.
        Panel documents it a no-op outside the ladder&rsquo;s tinted variants
        (Panel.tsx:312-314).
      </>
    ),
  },
  {
    name: "accentColor",
    type: "TrueColor",
    default: '"blue"',
    description: (
      <>
        The hue of the <C>floating-glass</C> frosted fill (<C>:65-72</C>,
        <C>:120</C>,<C>:144-145</C>) — the same token, name and default as the{" "}
        <C>SideMenu</C>&rsquo;s <C>color</C>, so a paired set reads as one card
        system. The opaque <C>floating</C> card keeps its neutral fill whatever you
        set (test :115-124).
      </>
    ),
  },
  {
    name: "corner",
    type: "SurfaceCorner",
    default: '"rounded-md"',
    description: (
      <>
        On <C>Panel</C>&rsquo;s corner scale and with its default (<C>:97-105</C>,
        <C>:132</C>), which resolves to <C>rounded-2xl</C> (Theme.ts:1515) —
        exactly the radius the floating cards&rsquo; shared token produces, so a
        paired menu and header only drift once you turn this knob (test
        :205-222).
      </>
    ),
  },
  {
    name: "padding",
    type: "SurfacePadding",
    default: "variant-dependent",
    description: (
      <>
        The gutter the bar leaves <strong>outside</strong> itself, set uniformly (
        <C>:73-88</C>,<C>:165-168</C>) — <C>&quot;none&quot;</C> on the flush bar,{" "}
        <C>&quot;xs&quot;</C> above and to the right on the floating card, which is
        the menu&rsquo;s <C>m-2</C> decomposed (<C>:151</C>). The inner inset is not
        this prop: that stays <C>px-5</C> (<C>:163</C>, test :173-184).
      </>
    ),
  },
  {
    name: "paddingTop",
    type: "SurfacePadding",
    default: '"xs" floating, "none" flush',
    description: (
      <>
        The axis above the bar (<C>:89</C>,<C>:153</C>); beats <C>padding</C> where
        it is given (test :186-203).
      </>
    ),
  },
  {
    name: "paddingRight",
    type: "SurfacePadding",
    default: '"xs" floating, "none" flush',
    description: (
      <>
        The axis to the bar&rsquo;s right (<C>:91</C>,<C>:154</C>) — a physical{" "}
        <C>mr-*</C> (Theme.ts:1933), so it does not follow the writing direction.
      </>
    ),
  },
  {
    name: "paddingBottom",
    type: "SurfacePadding",
    default: '"none"',
    description: (
      <>
        The axis below the bar (<C>:93</C>,<C>:155</C>) — flush whatever the
        variant, because a gutter underneath would lift the card off the page it
        belongs to.
      </>
    ),
  },
  {
    name: "paddingLeft",
    type: "SurfacePadding",
    default: '"none"',
    description: (
      <>
        The axis to the bar&rsquo;s left (<C>:95</C>,<C>:156</C>) — flush on the
        side that faces the sidebar, which is what keeps the seam continuous. Also
        physical (<C>ml-*</C>, Theme.ts:1935).
      </>
    ),
  },
  {
    name: "className",
    type: "string",
    default: '""',
    description: (
      <>
        Appended last to the class list (<C>:133</C>,<C>:178</C>), so it joins the
        seam classes instead of replacing them (test :69-72 keeps{" "}
        <C>shadow-sm</C> in the merged string).
      </>
    ),
  },
  {
    name: "…html props",
    type: "HTMLAttributes<HTMLElement>",
    default: "—",
    description: (
      <>
        Spread onto the root <C>&lt;header&gt;</C> first (<C>:24</C>,<C>:161</C>),
        so <C>id</C>, <C>data-*</C>, <C>aria-label</C> and your own handlers land
        there (test :14-22). Nothing competes with them — the component sets no{" "}
        <C>role</C> — and it takes no <C>ref</C>, being a plain function component
        without <C>forwardRef</C> (<C>:114</C>).
      </>
    ),
  },
];

export default PageHeaderPage;
