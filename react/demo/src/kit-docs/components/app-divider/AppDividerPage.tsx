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
import { AppDividerPlayground } from "./AppDividerPlayground";
import HeaderSections from "./examples/HeaderSections";
import headerSectionsCode from "./examples/HeaderSections.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Thicknesses from "./examples/Thicknesses";
import thicknessesCode from "./examples/Thicknesses.tsx?raw";
import LabelPositions from "./examples/LabelPositions";
import labelPositionsCode from "./examples/LabelPositions.tsx?raw";

export const AppDividerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="App Divider"
      description="A rule between sections. Vertical by default, because it was written for header sections, and one CSS pixel thick by default, because Tailwind's border ladder has no hairline. Give it a label and it becomes an announced separator; leave it unlabelled and it is decoration, hidden from assistive tech. With no tone the rule takes the surrounding surface's own divider colour, which is what keeps it visible on glass."
    />
    <AppDividerPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Header sections"
        description="The canonical case, both orientations in one screen: 2px rules between three toolbar items, then a labelled horizontal rule between two sign-in paths. The labelled one is the only thing either a screen reader or a keyboard user will meet."
        code={headerSectionsCode}
        filename="HeaderSections.tsx"
      >
        <HeaderSections />
      </ExampleCard>
      <ExampleCard
        title="Variants"
        description="Solid, dashed and dotted are one borderStyle with a border width (:172-176). Gradient is a different animal: a linear-gradient painted from the tone's colour variable (:148-150), fading out at both ends — and the one variant that ignores the surface's divider colour."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Thicknesses"
        description="The shared control scale as line thickness — xs 1, sm 2, md 3, lg 4, xl 6 CSS pixels, applied inline because w-[1.2px] used to round to 1px on one display and 2px on another (:18-32)."
        code={thicknessesCode}
        filename="Thicknesses.tsx"
      >
        <Thicknesses />
      </ExampleCard>
      <ExampleCard
        title="Label positions"
        description="The label can sit at the start, the centre or the end of the rule; start and end keep a 1rem stub (<C>basis-4</C>) on the far side, so the rule still reads as a rule (:199-204)."
        code={labelPositionsCode}
        filename="LabelPositions.tsx"
      >
        <LabelPositions />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The rule carries its semantic weight through the <C>label</C>.{" "}
          <C>decorative ?? !label</C> (:130) decides everything downstream: an
          unlabelled divider gets <C>aria-hidden</C> on the wrapper and no{" "}
          <C>role</C> at all (:208-210), so it is paint and nothing more; a
          labelled one publishes <C>role=&quot;separator&quot;</C> with{" "}
          <C>aria-orientation</C> (:208-209) and is announced where it sits. The
          painted line inside it is <C>aria-hidden=&quot;true&quot;</C> either way
          (:136,:161), which is why a labelled rule is announced once — as the break
          it names — and not as a separator plus a stray glyph. With a label the
          rule is drawn twice, once either side (:220-228), both segments hidden.
        </p>
        <p>
          <C>decorative</C> overrides the choice both ways, and both overrides have
          a cost worth saying: forcing it on hides a rule that has words in it
          (those words leave the accessibility tree while staying on screen), and
          forcing it off an unlabelled rule publishes a separator with no
          accessible name — a reader hears an unnamed separator. What this is{" "}
          <em>not</em> is a splitter: the component never sets <C>tabIndex</C>, so
          it is the non-focusable variant of <C>separator</C>. The interactive
          variant would need <C>tabIndex</C> plus <C>aria-valuenow</C> and{" "}
          <C>aria-valuetext</C>, and none of those exist here — deliberately,
          because a rule between two sections has no value to set.
        </p>
        <A11yCode filename="Semantics.tsx" code={SEMANTICS_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          <C>AppDivider.tsx</C> compares no key and installs no listener: there is
          no <C>onKeyDown</C>, <C>onKeyUp</C>, <C>onKeyPress</C>, focus handler,{" "}
          <C>tabIndex</C>, timer or <C>matchMedia</C> call in the 235-line file.
          The only route a key event has into the rule is the consumer forwarding
          one through <C>...rest</C> (:218).
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: (
                <>
                  Skips the rule entirely. Nothing in the file is focusable — no
                  button, link or <C>tabIndex</C> — so focus moves from the content
                  before the rule to the content after it (:206-229).
                </>
              ),
            },
            {
              keys: ["Any"],
              action: (
                <>
                  Nothing, unless the consumer passes a handler: key events reach
                  this root <C>div</C> only via <C>...rest</C> (:47-50,:218), and
                  the wrapper has no behaviour of its own to interfere with.
                </>
              ),
            },
          ]}
        />
        <p>
          Which is the correct answer for a divider: a focusable separator would have to
          carry a value an arrow key could move, and a rule between two sections has
          no value to move. Keeping it out of the tab order leaves the focus with the
          content either side, which is what the role is for here.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The component writes no word of its own: it imports no i18n helper and
          contains no user-visible string, and <C>common/i18n/builtIn/en.ts</C> has no
          divider key of any kind — the only text it can render is
          the caller&rsquo;s <C>label</C> (:74), which may be a string or any node,
          so its translation is the application&rsquo;s business. That also means
          an untranslated rule is never the reason a page fails a locale audit; a
          long label in German simply squeezes the two stubs (:199-204), it does
          not break anything.
        </p>
        <p>
          The geometry follows <C>dir</C> where it matters and does not need to
          elsewhere. The wrapper is <C>flex</C> with <C>flex-col</C> or{" "}
          <C>flex-row</C> (:212-213), so in a right-to-left row the stub, the label
          and the tail swap sides for free — <C>labelPosition=&quot;start&quot;</C>{" "}
          means <em>inline start</em>, which is the right edge there. The spacing is{" "}
          <C>mx-*</C> / <C>my-*</C> (:35-45), symmetric by construction, and the
          deprecated <C>margin</C> alias writes the logical{" "}
          <C>marginInline</C>/<C>marginBlock</C> (:126-128). The only physical
          direction in the file is the gradient&rsquo;s <C>to bottom</C> /{" "}
          <C>to right</C> (:149), and because it fades from transparent through the
          colour and back to transparent, flipping the page does not visibly change
          it. <C>aria-orientation</C> (:209) describes the rule&rsquo;s own axis,
          not a side of the screen, so it stays true either way.
        </p>
        <A11yCode filename="Labels.tsx" code={LABEL_CODE} />
      </A11yTopic>

      <A11yTopic title="Rendering the rule">
        <p>
          Three props decide what the line looks like and none of them is a class
          table. Thickness is <C>size</C> mapped to real pixels and written inline
          on <C>borderLeftWidth</C> or <C>borderTopWidth</C> (:26-32,:174-176) — the
          docstring is blunt about why: Tailwind&rsquo;s ladder jumps 1→2→4→8, and
          the old <C>w-[1.2px]</C> rounded unpredictably, occasionally to nothing
          (:21-24). <C>variant</C> is <C>borderStyle</C> for solid, dashed and
          dotted (:173, the four names at :10-16); <C>gradient</C> paints a{" "}
          <C>linear-gradient</C> instead and sets no border at all (:133-156).
        </p>
        <p>
          Colour is the interesting one. With a <C>tone</C> the rule gets{" "}
          <C>getAppDividerToneTokens(tone)</C>{" "}
          (<C>common/theme/Theme.ts:1480</C>) — a table entry rather than an
          interpolation at the call site, so the safelist guard can tie{" "}
          <C>border-&#123;tone&#125;-400 dark:border-&#123;tone&#125;-500</C> to the emitted stylesheet (
          <C>common/theme/Theme.ts:1467-1478</C>). It replaced the hairline-outline
          pairing, which all but vanished on a dark card (:165-169,:170). Without one it
          reads <C>surface.divider</C> from the surface context (:111,:170), which is
          how the same rule stays visible inside an outlined card, a liquid-glass
          card and a bare page. The gradient variant consults neither: it composes{" "}
          <C>var(--color-&#123;tone&#125;-400)</C> itself (:148-150), so an untoned
          gradient fades through neutral-400 regardless of what the surface says.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable props={APP_DIVIDER_PROPS} />
  </div>
);

/**
 * The API as declared at :47-89, including the three deprecated aliases that
 * used to be documented and ignored (:114-116 names the bug).
 */
export const APP_DIVIDER_PROPS: PropDoc[] = [
  {
    name: "orientation",
    type: "AppDividerOrientation",
    default: "vertical",
    description: (
      <>
        Which way the rule runs, destructured to <C>"vertical"</C> (:95) and
        documented that way because the component was written for header sections (
        :52-55). It also decides the fallback <C>length</C> (:117).
      </>
    ),
  },
  {
    name: "variant",
    type: "AppDividerVariant",
    default: "solid",
    description: (
      <>
        The four names are <C>APP_DIVIDER_VARIANTS</C> (:10-16). The first three
        become <C>borderStyle</C> (:173); <C>gradient</C> paints a{" "}
        <C>linear-gradient</C> instead and sets no border (:133-156).
      </>
    ),
  },
  {
    name: "tone",
    type: "TrueColor",
    default: "— absent (:170)",
    description: (
      <>
        The accent, with no default of its own (:59-63,:97). Absent means the rule
        takes <C>surface.divider</C> from the surrounding surface (:111,:170), which
        is what makes it adapt on glass; a tone routes to{" "}
        <C>getAppDividerToneTokens</C> (<C>common/theme/Theme.ts:1480</C>). There is
        no <C>"none"</C> member — absence <em>is</em> the neutral answer.
      </>
    ),
  },
  {
    name: "size",
    type: "ControlSize",
    default: "xs",
    description: (
      <>
        Thickness on the shared control scale (:64,:98), mapped to 1/2/3/4/6 CSS
        pixels (:26-32) and applied inline (:174-176) rather than through{" "}
        <C>border-&#123;n&#125;</C>.
      </>
    ),
  },
  {
    name: "spacing",
    type: '"none" | ControlSize',
    default: "sm",
    description: (
      <>
        Margin on the rule&rsquo;s cross axis (:66,:99) — <C>mx-*</C> when
        vertical, <C>my-*</C> when horizontal (:35-45,:119-122). Symmetric, so nothing has to
        flip under <C>dir</C>.
      </>
    ),
  },
  {
    name: "length",
    type: "number | string",
    default: "— 1.5rem vertical, 100% horizontal (:117)",
    description: (
      <>
        Along the rule&rsquo;s own axis: height when vertical, width when
        horizontal (:68-72). A number is pixels, a string is used verbatim (:91-92),
        and a passed <C>style</C> still wins (:217).
      </>
    ),
  },
  {
    name: "label",
    type: "ReactNode",
    default: "— absent (decoration)",
    description: (
      <>
        The semantic switch: its presence is what <C>decorative ?? !label</C> (:130)
        reads to decide between <C>aria-hidden</C> and{" "}
        <C>role=&quot;separator&quot;</C> (:208-210). A string or any node; the rule
        is drawn on both sides of it (:220-228).
      </>
    ),
  },
  {
    name: "labelPosition",
    type: "AppDividerLabelPosition",
    default: "center",
    description: (
      <>
        <C>start</C> / <C>center</C> / <C>end</C> along the inline axis; the off-centre
        positions give the far stub a fixed <C>basis-4</C> instead (:199-204).
        Meaningful only with a{" "}
        <C>label</C>.
      </>
    ),
  },
  {
    name: "decorative",
    type: "boolean",
    default: "— !label (:130)",
    description: (
      <>
        Three states, because absent is one of them: inherit, force hidden,{" "}
        <C>false</C> to announce even an unlabelled rule — which announces a
        separator with no name. Never a splitter: no <C>tabIndex</C> is set, so the
        focusable variant of the role is out of scope.
      </>
    ),
  },
  {
    name: "height",
    type: "number | string",
    description: (
      <>
        Deprecated — alias of <C>length</C>, honoured only when <C>length</C> is
        absent (:117). It used to be documented and silently ignored (:114-116).
      </>
    ),
  },
  {
    name: "width",
    type: "number",
    description: (
      <>
        Deprecated — a number of pixels sets the <em>thickness</em>; the shared{" "}
        <C>size</C> scale is preferred (:118).
      </>
    ),
  },
  {
    name: "margin",
    type: "number | string",
    description: (
      <>
        Deprecated — alias of <C>spacing</C>, written as the logical{" "}
        <C>marginInline</C>/<C>marginBlock</C>, so it takes precedence over the{" "}
        <C>mx-*</C> classes when both are set (:126-128).
      </>
    ),
  },
  {
    name: "className",
    type: "string",
    description: (
      <>
        Appended to <C>flex items-center</C> plus the orientation and spacing
        classes (:211-216) — it does not replace them.
      </>
    ),
  },
  {
    name: "style",
    type: "CSSProperties",
    description: (
      <>
        Spread <em>last</em> (:217), so an inline <C>style</C> overrides the computed
        thickness, length and margin — the escape hatch the deprecated props used to
        be.
      </>
    ),
  },
  {
    name: "…div props",
    type: "HTMLAttributes<HTMLDivElement>",
    description: (
      <>
        Everything but <C>children</C> and <C>color</C> (:47-50) lands on the wrapper
        through <C>...rest</C> (:218), including <C>id</C>, <C>data-*</C> and{" "}
        <C>aria-*</C> — the only way a consumer can attach a handler to a rule.
      </>
    ),
  },
  {
    name: "ref",
    type: "— none",
    description: (
      <>
        A plain function component (:94) with no imperative handle, so the wrapper
        element is not reachable. The rule is decorative; measure the section around
        it instead.
      </>
    ),
  },
];

const SEMANTICS_CODE = `// Decoration — two toolbar items with a rule between them.
// decorative ?? !label (AppDivider.tsx:130) resolves to hidden: aria-hidden,
// no role, and a keyboard user never meets it.
<AppDivider />;

// Semantics — the rule names the break it makes, so it is announced once,
// as a separator with aria-orientation, and the painted line stays hidden.
<AppDivider orientation="horizontal" label="OR" />;

// The override that costs something: announced, but with nothing to announce.
<AppDivider orientation="horizontal" decorative={false} />`;

const LABEL_CODE = `// The label is the only text the component can render — translate it yourself.
// "start" is the inline start, so it lands on the right in a dir="rtl" row.
<AppDivider
  orientation="horizontal"
  label={t("auth.or")}
  labelPosition="start"
/>;

// Long labels squeeze the stubs on either side (:199-204) rather than
// overflowing; the far stub keeps its fixed 1rem basis either way.`;

export default AppDividerPage;
