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
import { ToolbarPlayground } from "./ToolbarPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Surface from "./examples/Surface";
import surfaceCode from "./examples/Surface.tsx?raw";
import Nav from "./examples/Nav";
import navCode from "./examples/Nav.tsx?raw";

export const ToolbarPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Toolbar"
      description="A named row of controls for the content beside it — PrimeVue's Toolbar with its start / center / end regions, wearing the kit's shared Panel surface: the same variants, tones, corner and padding scales, painted from the same theme helpers. role=toolbar throughout; empty regions hold their place, so an `end`-only bar still parks right, and the row wraps instead of overflowing."
    />
    <ToolbarPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="The PrimeVue demo itself: ghost icon buttons on the left, a search field centered, the primary Save on the right."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Surface"
        description="A toolbar is a sideways Panel — the `variant` ladder from `simple` to `liquid-glass`, a `tone` for the tinted ones, and the container `corner` and `padding` scales."
        code={surfaceCode}
        filename="Surface.tsx"
      >
        <Surface />
      </ExampleCard>
      <ExampleCard
        title="Nav"
        description="PrimeVue's custom toolbar is really a navbar — same three regions, different furniture. The `end` group closes with a `UserAvatar`, so the signed-in person is part of the bar."
        code={navCode}
        filename="Nav.tsx"
      >
        <Nav />
      </ExampleCard>
    </section>
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The root is always <C>role=&quot;toolbar&quot;</C> (<C>:150</C>), which
          groups the row for assistive tech — and that is the only thing the
          component says about itself. It invents no name (<C>:83-86</C>): an
          unnamed toolbar is announced, just not distinguishable, and a page with
          a Formatting bar and a Filters bar announces two identical toolbars.{" "}
          <C>aria-label</C> or <C>aria-labelledby</C> is the whole remedy, so
          name every instance (test :14-17 checks the name lands). The regions are
          plain <C>div</C>s (<C>:162-165</C>) with no role of their own, which
          means an empty region adds nothing to the accessibility tree even
          though its element stays in the DOM.
        </p>
        <p>
          There is one asymmetry worth knowing before you reach for a wrapper:{" "}
          <C>&#123;...rest&#125;</C> is spread <em>first</em> on the root
          (<C>:149</C>), ahead of <C>role</C> (<C>:150</C>) and{" "}
          <C>className</C> (<C>:151-157</C>). A caller cannot trade the role for a{" "}
          <C>group</C>, and a <C>className</C> joins the surface classes instead
          of replacing them — which is what you want for the paint (test :54-67
          asserts <C>rounded-2xl</C> survives the merge) and what you have to work
          around if you really meant to rename the widget.
        </p>
        <A11yCode filename="Naming.tsx" code={NAMING_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          <C>Toolbar.tsx</C> compares no key and takes no focus: no{" "}
          <C>onKeyDown</C>, <C>onKeyUp</C>, <C>onKeyPress</C> or <C>tabIndex</C>{" "}
          appears in its 173 lines, and no listener is attached. Every control you
          pass stays individually tabbable in DOM order, and the bar is not a stop
          on the way to them. That is an honest trade against the ARIA toolbar
          pattern, which expects one tab stop and arrow keys between buttons:
          arrow keys here do nothing special, but no control can be skipped or
          trapped, and nesting a bar inside a bar stays predictable. The{" "}
          <C>role</C> is still there (<C>:150</C>), so the group is announced
          even though the group navigation is not implemented.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: (
                <>
                  Through every control you passed, in DOM order: start, center,
                  end, then the children group (<C>:162-165</C>, asserted by test{" "}
                  :19-32 and :42-52). The bar itself never receives focus — a{" "}
                  <C>div</C> with a role and no <C>tabIndex</C> is not a stop.
                </>
              ),
            },
            {
              keys: ["shift", "tab"],
              action: (
                <>
                  Backwards through the same controls. Nothing is hidden behind a
                  disclosure and nothing traps focus, so a keyboard user can
                  always leave the bar the way they came.
                </>
              ),
            },
            {
              keys: ["arrow"],
              action: (
                <>
                  Nothing, at this level. There is no roving tabindex to walk —
                  between two icon buttons in the <C>start</C> group, the arrow
                  keys are the browser&rsquo;s, which for a <C>button</C> means no
                  movement at all. Reach for the controls&rsquo; own bindings
                  (<C>Button</C>, <C>IconButton</C>) when you need activation.
                </>
              ),
            },
            {
              keys: ["Any"],
              action: (
                <>
                  <C>&#123;...rest&#125;</C> lands on the root <C>div</C> before{" "}
                  <C>role</C> and <C>className</C> (<C>:149-151</C>), so a
                  caller&rsquo;s <C>onKeyDown</C> is the only handler in the chain —
                  and the only one you can add, since the component adds none.
                </>
              ),
            },
          ]}
        />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The bar emits no strings: there is no <C>useKitT</C>, no message key, no
          placeholder — every word on screen comes from the nodes you pass into
          the regions, so a translation layer feeds the bar through its content
          and nothing else. Layout does the rest. The root is a flex row with{" "}
          <C>flex-wrap</C> (<C>:152</C>) and each region is{" "}
          <C>flex min-w-0 flex-wrap items-center gap-2</C> (<C>:76</C>), so long
          labels wrap inside their group and the bar takes a second row instead of
          overflowing: nothing clips, and spacing is <C>gap</C>, never a physical
          margin. Under <C>dir=&quot;rtl&quot;</C> the row reverses, which is
          exactly what <C>start</C> / <C>center</C> / <C>end</C> mean — they are
          DOM-order names, not left/right names, and unlike a decorated surface
          there is no offset to mirror: the centre holds because{" "}
          <C>justify-between</C> measures both flanks (<C>:152</C>) symmetrically.
        </p>
        <A11yCode filename="Right-to-left.tsx" code={RTL_CODE} />
      </A11yTopic>

      <A11yTopic title="What an empty region is">
        <p>
          PrimeVue&rsquo;s behaviour, kept on purpose: the three regions are
          rendered unconditionally (<C>:162-164</C>), so passing nothing leaves an
          empty <C>div</C> rather than removing the slot — that is what parks an{" "}
          <C>end</C>-only bar on the right instead of sliding it left (test{" "}
          :34-40). The fourth group is the opposite: <C>children != null</C>{" "}
          (<C>:165</C>) means it is absent from the DOM until you pass something
          (test :42-52 counts it as a group of its own).
        </p>
        <A11yCode filename="Regions.tsx" code={REGIONS_CODE} />
      </A11yTopic>
    </A11ySection>

    <PropsTable props={TOOLBAR_PROPS} />
  </div>
);

/**
 * Every prop `ToolbarProps` declares (:29-74), with the default the component
 * actually destructures (:93-100) rather than the one a comment once claimed:
 * `tone` is **none** (:57,:94 → DEFAULT_SURFACE_TONE, Theme.ts:1664), not the
 * blue an earlier table advertised, and `transparency` has no default at all
 * (:72,:99) because the variant answers it (:8 of the transparency module).
 */
export const TOOLBAR_PROPS: PropDoc[] = [
  {
    name: "start / center / end",
    type: "ReactNode",
    description: (
      <>
        The three regions (<C>:33</C>,<C>:38</C>,<C>:42</C>), rendered in DOM
        order as three always-present <C>div</C>s (<C>:162-164</C>). The centre
        is centred by <C>justify-between</C> (<C>:152</C>), which measures the
        flanks — the JSDoc&rsquo;s own advice is to keep it narrow, a field or a
        stepper (<C>:34-37</C>).
      </>
    ),
  },
  {
    name: "children",
    type: "ReactNode",
    description: (
      <>
        A fourth group appended after the regions (<C>:43-48</C>), and the only
        one that disappears when empty: it is gated on{" "}
        <C>children != null</C> (<C>:165</C>).
      </>
    ),
  },
  {
    name: "variant",
    type: "PanelVariant",
    default: "elevated",
    description: (
      <>
        Panel&rsquo;s ladder, from an invisible <C>simple</C> bar to{" "}
        <C>liquid-glass</C> (<C>:49-56</C>,<C>:93</C>). The switch at{" "}
        <C>:107-145</C> reads the same exported <C>variantBaseStyles</C> map
        Panel paints from (Panel.tsx:361-380), so a bar sits flush beside a card.
      </>
    ),
  },
  {
    name: "tone",
    type: "SurfaceTone",
    default: "none",
    description: (
      <>
        Tint for the surfaces that carry one (<C>:57</C>,<C>:94</C>). It has
        nothing to do on <C>elevated</C> and <C>default</C> — neither branch
        reads the palette (<C>:141-143</C>,<C>:126-127</C>) — and on those two
        variants the playground hides the swatches.
      </>
    ),
  },
  {
    name: "padding",
    type: "PanelPadding",
    default: "xs",
    description: (
      <>
        The shared container scale (<C>:59-65</C>,<C>:95</C>) through{" "}
        <C>getSurfacePaddingClass</C> (<C>:155</C>); <C>none</C> bleeds the bar
        flush into the content it serves (<C>:61-62</C>).
      </>
    ),
  },
  {
    name: "corner",
    type: "PanelCorner",
    default: "rounded-md",
    description: (
      <>
        The shared container corner (<C>:66</C>,<C>:96</C> —{" "}
        <C>DEFAULT_SURFACE_CORNER</C>, Theme.ts:1531-1532). The names are a step
        looser than they read: that default emits <C>rounded-2xl</C> (Theme.ts:1515),
        which test :66 finds on an untouched bar; the whole ladder steps the same
        way, <C>rounded-xl</C> landing on <C>rounded-4xl</C> (test :94-103).
      </>
    ),
  },
  {
    name: "vibrancy / glassOpacity",
    type: "GlassVibrancy / GlassOpacity",
    default: 'medium / frosted',
    description: (
      <>
        Read by the <C>liquid-glass</C> branch alone (<C>:68</C>,<C>:70</C>,
        <C>:97-98</C> → <C>:133-134</C>); on every other variant the classes are
        computed and thrown away, so the playground hides both there. What the
        bar publishes is the surface itself: <C>SurfaceProvider</C>{" "}
        (<C>:161</C>) is how an <C>Input</C> on a glass bar knows it is on glass.
      </>
    ),
  },
  {
    name: "transparency",
    type: "SurfaceTransparency",
    default: "— variant decides",
    description: (
      <>
        The four-level background-alpha scale (surfaceTransparency.ts:3,:17-39),
        declared without a default (<C>:72</C>,<C>:99</C>) —{" "}
        <C>resolveSurfaceTransparency</C> answers <C>high</C> for glass,
        liquid-glass and subtle and <C>none</C> otherwise (:8). It changes alpha
        and nothing else, and only where an alpha exists: on <C>elevated</C> the
        fill is <C>bg-white</C> (Panel.tsx:363-364) and the classes come back
        untouched (:27).
      </>
    ),
  },
  {
    name: "className",
    type: "string",
    default: '""',
    description: (
      <>
        <C>:73</C>,<C>:100</C>. <C>classNames</C> merges it with the variant,
        corner and padding classes (<C>:151-157</C>) rather than replacing them,
        so a caller&rsquo;s utility can add paint but cannot subtract the surface
        (test :54-67).
      </>
    ),
  },
  {
    name: "…div props",
    type: "HTMLAttributes<HTMLDivElement>",
    description: (
      <>
        <C>:29</C> — <C>aria-label</C>, <C>aria-labelledby</C>, <C>id</C>,{" "}
        <C>data-*</C> all land on the root, which is where the bar gets its name
        (<C>:83-86</C>). They are spread <em>before</em> <C>role</C> and{" "}
        <C>className</C> (<C>:149-151</C>), so those two cannot be overridden.
        <C>ref</C>: — none. <C>Toolbar</C> is a plain function component
        (<C>:88</C>), not <C>forwardRef</C>; wrap it if you need a handle.
      </>
    ),
  },
];

const NAMING_CODE = `// Two bars, one page. Without names they are announced
// identically; the role alone (:150) does not tell them apart.
<Toolbar aria-label="Formatting" start={FORMAT_BUTTONS} />
<Toolbar aria-labelledby="filters-heading" start={FILTER_FIELDS} />
<h3 id="filters-heading">Filters</h3>`;

const RTL_CODE = `// Nothing to flip by hand: the regions are DOM-order
// names and the row is flex, so the mirror is free.
<div dir="rtl">
  <Toolbar aria-label="محرر المستند" start={ACTIONS} center={SEARCH} end={SAVE} />
</div>
// start now sits at the physical right, end at the left, and the
// centre stays centred — justify-between (Toolbar.tsx:152) measures
// both flanks. Long labels wrap inside their group (GROUP_CLASS
// :76 carries min-w-0 + flex-wrap) instead of clipping.`;

const REGIONS_CODE = `// Pass only "end": the other two regions stay in the DOM
// (:162-164) so the Save button still parks on the right.
<Toolbar aria-label="Document" end={SAVE_BUTTON} />
// →  <div role="toolbar" class="flex flex-wrap …">
//      <div class="flex min-w-0 flex-wrap …"></div>   // start, empty
//      <div class="flex min-w-0 flex-wrap …"></div>   // center, empty
//      <div class="flex min-w-0 flex-wrap …">Save</div>
//    </div>
// The "children" group behaves the other way (:165): no node, no div.`;

export default ToolbarPage;
