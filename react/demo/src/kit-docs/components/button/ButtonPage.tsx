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
import { ButtonPlayground } from "./ButtonPlayground";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import Icons from "./examples/Icons";
import iconsCode from "./examples/Icons.tsx?raw";
import AllTones from "./examples/AllTones";
import allTonesCode from "./examples/AllTones.tsx?raw";
import Active from "./examples/Active";
import activeCode from "./examples/Active.tsx?raw";

/**
 * Every row below was written against `react/src/components/Button.tsx` at the
 * cited line — including the two props the JSDoc under-documents and the three
 * the component reads straight off the spread (`aria-label`, `aria-expanded` and
 * the native `disabled`/`type` pair).
 */
export const BUTTON_PROPS: PropDoc[] = [
  {
    name: "variant",
    type: "ButtonVariant",
    default: '"solid"',
    description: (
      <>
        solid · soft · outline · ghost · link · clear · icon · glass, from the
        runtime list (Theme:12-21). <C>icon</C> is not a colour treatment: it is
        icon mode (:150), and <C>glass</C> auto-enables <C>glass</C> (:189) and
        discards the variant&rsquo;s own colour classes with it (:193-200).
      </>
    ),
  },
  {
    name: "color",
    type: "TrueColor",
    default: '"blue"',
    description: (
      <>
        One of the 21 palette colours (:117). Feeds the fill, the rim, the text and
        the focus ring (:149); ignored entirely once the surface is glass, which
        builds its chrome from <C>getGlassChromeClasses</C> instead (:193-200).
      </>
    ),
  },
  {
    name: "size",
    type: "ButtonSize",
    default: '"md"',
    description: (
      <>
        The shared control scale — xs · sm · md · lg · xl (Theme:381), aliased to{" "}
        <C>ControlSize</C> at :47 so a rename reaches Button without a second list.
        One token set decides text padding, the square box in icon mode, the gap,
        the icon&rsquo;s size and the spinner&rsquo;s (:148). An unlisted size falls
        back to <C>md</C> (Theme:487-488).
      </>
    ),
  },
  {
    name: "weight",
    type: "ButtonWeight",
    default: '"normal"',
    description: (
      <>
        normal · medium · semibold · bold (:119,:243). Separate from{" "}
        <C>size</C>, because a dense toolbar still wants a loud label.
      </>
    ),
  },
  {
    name: "leadingIcon",
    type: "string | ReactElement",
    description: (
      <>
        A registry name or your own element; both go through the icon renderer
        (:279-295) and size themselves from <C>size</C>. <C>loading</C> replaces it
        with the spinner (:315) — this is the slot that says what the button is doing
        right now.
      </>
    ),
  },
  {
    name: "trailingIcon",
    type: "string | ReactElement",
    description: (
      <>
        The same slot at the end of the label (:326). Hidden while{" "}
        <C>loading</C>, so a caret does not keep pointing at a popup that is already
        gone.
      </>
    ),
  },
  {
    name: "iconColor",
    type: "string",
    description: (
      <>
        A raw CSS colour that tints only the glyph, via an inline style on a wrapper
        span (:286-294). Omit it and the icon paints with <C>currentColor</C>, which
        is what keeps glyph and label matching through every variant, hover and dark
        mode (:65-69).
      </>
    ),
  },
  {
    name: "children",
    type: "ReactNode",
    description: (
      <>
        The label. In icon mode it is not rendered as markup: a string child becomes
        the sr-only name, else <C>aria-label</C> is used, else the catalog&rsquo;s{" "}
        <C>kit.button.name</C> (:268-273,:322) — which is why a node child silently
        loses the name.
      </>
    ),
  },
  {
    name: "iconOnly",
    type: "boolean",
    default: "false",
    description: (
      <>
        The other door to icon mode (:124,:150): square box (<C>box</C> tokens), no
        text padding, sr-only label. Same effect as <C>variant=&quot;icon&quot;</C>,
        which is the option to reach for when the whole control is a glyph.
      </>
    ),
  },
  {
    name: "fullWidth",
    type: "boolean",
    default: "false",
    description: (
      <>
        <C>w-full</C> (:244) — form actions and mobile sheets, where the tap target
        should be the row.
      </>
    ),
  },
  {
    name: "accent",
    type: "boolean",
    default: "false",
    description: (
      <>
        &ldquo;The parent owns the fill&rdquo; (:158-164): the variant&rsquo;s
        background and text classes are dropped for a transparent fill, an accent ring
        and its hover. It also sits out the held-open hover (:212-214), because it
        already draws its own.
      </>
    ),
  },
  {
    name: "accentColor",
    type: "TrueColor",
    description: (
      <>
        Two props in one. With <C>active</C> it is the persistent fill&rsquo;s colour
        (:170-179); otherwise, and only outside icon mode on an enabled button, it
        replaces the <em>hover</em> classes while <C>color</C> keeps the base
        (:180-184). Its absence means &ldquo;whatever <C>color</C> is&rdquo; (:151).
      </>
    ),
  },
  {
    name: "active",
    type: "boolean",
    default: "false",
    description: (
      <>
        The persistent on-state (:72,:170-179): the <C>getButtonActiveClasses</C>{" "}
        recipe with its own hover, kept off <C>disabled</C> and <C>loading</C>. Distinct
        from a hover you cannot park on, and from <C>aria-expanded</C>, which is about a
        popup rather than a selection.
      </>
    ),
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: (
      <>
        Sets the real <C>disabled</C> attribute (:305) so no click can land, adds{" "}
        <C>aria-busy</C> (:310), paints the spinner in the leading slot and hides the
        trailing icon (:315,:326), and skips <C>disabled:opacity-50</C> (:239) — the
        comment at :98-103 explains why: dimming a loading control fades the one
        element that has to stay visible.
      </>
    ),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: (
      <>
        The native attribute (:135,:260,:305): out of the tab order, out of the
        accessibility tree, dimmed by <C>disabled:opacity-50</C> unless{" "}
        <C>loading</C> is holding the button open.
      </>
    ),
  },
  {
    name: "type",
    type: '"button" | "submit" | "reset"',
    default: '"button"',
    description: (
      <>
        Deliberately not HTML&rsquo;s default: a <C>&lt;button&gt;</C> in a{" "}
        <C>&lt;form&gt;</C> submits it, which made every unspecified Button do that
        (:300-303). An explicit <C>type</C> still wins (:141).
      </>
    ),
  },
  {
    name: "onClick",
    type: "MouseEventHandler<HTMLButtonElement>",
    description: (
      <>
        Passed straight to the element (:311) — it never fires while{" "}
        <C>loading</C> or <C>disabled</C>, because the attribute is set rather than the
        handler guarded (:305).
      </>
    ),
  },
  {
    name: "tooltip",
    type: "string",
    description: (
      <>
        Wraps the button in a <C>TooltipWrapper</C> (:330-341). While visible the tip
        is portalled with <C>role=&quot;tooltip&quot;</C> and the button points at it
        with <C>aria-describedby</C> (TooltipWrapper:279,:299) — and only while
        visible, so the id is never dangling.
      </>
    ),
  },
  {
    name: "tooltipPosition",
    type: "TooltipPosition",
    default: '"top"',
    description: (
      <>
        top · bottom · left · right. Button has no default of its own: it forwards the
        value (:334) and <C>TooltipWrapper</C> is what says{" "}
        <C>&quot;top&quot;</C> (TooltipWrapper:85).
      </>
    ),
  },
  {
    name: "tooltipDelay",
    type: "number",
    default: "1000",
    description: (
      <>
        Milliseconds of rest before the tip appears, again <C>TooltipWrapper</C>&rsquo;s
        default (:336 ← TooltipWrapper:84). Lower it in a dense toolbar where the tip
        is the only place the full label lives; focus does not wait (TooltipWrapper:270-282).
      </>
    ),
  },
  {
    name: "tooltipDisabled",
    type: "boolean",
    default: "false",
    description: (
      <>
        Hides a visible tip and blocks new ones (:336). <C>MenuButton</C> sets it while
        its menu is open so the ghost of a tooltip never floats over the rows
        (:92-94); pass it yourself while a surface you own is up.
      </>
    ),
  },
  {
    name: "glass",
    type: "boolean",
    default: "false",
    description: (
      <>
        Fill + vibrancy + chrome (:74,:189-200), the same recipe as{" "}
        <C>variant=&quot;glass&quot;</C> — either one enables it, and{" "}
        <C>data-glass</C> reports the resolved answer (:309).
      </>
    ),
  },
  {
    name: "vibrancy",
    type: "GlassVibrancy",
    default: '"medium"',
    description: (
      <>
        low · medium · high, or a number for an explicit blur (:76,:197). Only read
        once the surface is glass.
      </>
    ),
  },
  {
    name: "glassOpacity",
    type: "GlassOpacity",
    default: '"frosted"',
    description: (
      <>
        frosted · light · clear, or a number (:78,:196). The fill&rsquo;s
        transparency, not the text&rsquo;s contrast — which comes from the chrome
        classes (:198).
      </>
    ),
  },
  {
    name: "specularMode",
    type: "SpecularMode",
    default: '"none"',
    description: (
      <>
        none · classic · halo (:80,:220-235). Forces <C>relative</C> on the button and
        adds an absolutely positioned, <C>aria-hidden</C> overlay — decorative, so it is
        invisible to readers, and it is skipped entirely when the surface is not glass
        (:220).
      </>
    ),
  },
  {
    name: "className",
    type: "string",
    description: (
      <>
        Appended last (:247), so a caller&rsquo;s utilities win the cascade against the
        recipe — which is how <C>getButtonLinkClasses</C> (:355-368) makes a router
        link byte-identical to a real solid Button.
      </>
    ),
  },
  {
    name: "aria-label",
    type: "string",
    description: (
      <>
        Read before render for the name warning (:262-263) and used as the sr-only
        fallback in icon mode (:268-273). The dev-time nudge is{" "}
        <C>warnIfMissingName</C>: one warning per component, never a throw.
      </>
    ),
  },
  {
    name: "aria-expanded",
    type: "boolean | 'true' | 'false'",
    description: (
      <>
        Not in the props interface — <C>Button</C> reads it off the spread (:211)
        because <C>Menu</C> stamps it on whatever it is handed as a trigger. When it is
        <C>true</C> the button holds the variant&rsquo;s hover classes as{" "}
        <C>aria-expanded:</C> utilities (:212-218, Theme:3127-3135), unless{" "}
        <C>active</C>, <C>accent</C> or glass already owns that surface.
      </>
    ),
  },
  {
    name: "…",
    type: "ButtonHTMLAttributes<HTMLButtonElement>",
    description: (
      <>
        Everything else spreads onto the <C>&lt;button&gt;</C> last (:312), which is
        also why a caller&rsquo;s <C>data-*</C> beats the component&rsquo;s own{" "}
        <C>data-variant</C>/<C>data-color</C>/<C>data-size</C>/<C>data-glass</C>{" "}
        (:306-309). The kit always sets <C>type</C>, <C>className</C>,{" "}
        <C>disabled</C> and those four data attributes; nothing else.
      </>
    ),
  },
];

/** Only the bindings that exist in the source — which, for Button, means none of its own. */
export const KEYBOARD: KeyboardBinding[] = [
  {
    keys: ["Tab"],
    action: (
      <>
        Reaches the button: the shared base drops the browser outline (:104) and the
        variant&rsquo;s recipe draws its own ring in the fill&rsquo;s colour
        (Theme:2745-2751). A <C>disabled</C> or <C>loading</C> button is skipped
        entirely (:305) — the real attribute, so it leaves the tab order and the
        accessibility tree together.
      </>
    ),
  },
  {
    keys: ["Enter", "Space"],
    action: (
      <>
        Activate the native <C>&lt;button&gt;</C>: <C>Button</C> registers no key
        handler of its own, calls no <C>preventDefault</C>, and only passes{" "}
        <C>onClick</C> through (:311). What those two keys <em>do</em> is decided by{" "}
        <C>type</C>.
      </>
    ),
  },
  {
    keys: ["Enter", "in a form"],
    action: (
      <>
        Nothing, with the default <C>type=&quot;button&quot;</C> (:141,:300-303). Set{" "}
        <C>type=&quot;submit&quot;</C> and the same keypress submits the form — the
        behaviour the default exists to prevent.
      </>
    ),
  },
  {
    keys: ["Focus", "hover"],
    action: (
      <>
        Either one summons a <C>tooltip</C> (:330-341); focus does not wait out{" "}
        <C>tooltipDelay</C> (TooltipWrapper:270-282), so a keyboard user is never
        handed a hint on a timer the pointer invented.
      </>
    ),
  },
];

const NAMING_CODE = `// What a reader announces — and what to write instead of guessing.
<Button onClick={save}>Save draft</Button>            // name = the text (:263 sees it, no warning)
<Button onClick={save} aria-label="Save draft" />     // no text: the name comes from here (:261)

<Button onClick={save} iconOnly leadingIcon="Save">Save draft</Button>
//   icon mode renders no label: the string child becomes the sr-only name (:268-273,:322)

<Button onClick={save} iconOnly leadingIcon="Save">
  <Pill>Draft</Pill>          // a node child is not a string, so there is nothing to announce
</Button>                     // — the catalog's "Button" is what a reader says (:322)

<Button onClick={save} aria-hidden="true">Save</Button>
//   warned: a control readers cannot see that Tab still reaches (:264-267)`;

const I18N_CODE = `// common/i18n/builtIn/en.ts:328-330 — the one built-in string Button owns.
kit.button: {
  name: "Button",   // the last-resort sr-only name in icon mode (:322)
}                    // de "Schaltfläche" (:297), fr "Bouton" (:299), es "Botón" (:296), pt "Botão" (:296)

// Everything else is the caller's text and passes through untouched: children,
// tooltip, aria-label. Icons are registry names, so they carry no words at all.
// The fallback exists because an icon-only button with a node child has nothing
// a reader could announce — a bare <button> is read as just "button".`;

export const ButtonPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Button"
      description="The primary action control. Eight variants, five sizes, four label weights and every true color — plus loading, disabled, accent, active and icon states, a tooltip, and a glass surface, all on one native <button>."
    />
    <ButtonPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Variants"
        description="From the loudest solid primary to a nearly invisible clear button."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="The shared control scale, from xs for dense toolbars up to xl for empty states."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="Loading keeps the spinner bright while blocking input; disabled dims the label and the control."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Icons"
        description="Leading and trailing icons from the registry by name, and the icon-only variant for compact toolbars."
        code={iconsCode}
        filename="Icons.tsx"
      >
        <Icons />
      </ExampleCard>
      <ExampleCard
        title="All tones"
        description="Every one of the 21 true colours as a solid button, fixed size."
        code={allTonesCode}
        filename="AllTones.tsx"
      >
        <AllTones />
      </ExampleCard>
      <ExampleCard
        title="Pressed"
        description="The active prop is the persistent “on” state — a toggle that stays lit, distinct from the hover and focus styles."
        code={activeCode}
        filename="Active.tsx"
      >
        <Active />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          A <code>&lt;button&gt;</code> is the whole semantic story — no listbox
          theatre, no invented roles: <C>Button</C> sets no <C>role</C> and no{" "}
          <C>aria-*</C> of its own except <C>aria-busy</C> (:310). What the button is{" "}
          <em>for</em> is what matters, so an unnamed one is treated as a bug: in
          development <C>warnIfMissingName</C> breaks the silence (:263) — one warning
          per component, never a throw — and an <C>aria-hidden</C> on an enabled Button
          warns too, because that hides a control still in the tab order (:264-267).
        </p>
        <p>
          Icon mode carries the name itself: a <C>string</C> child, else the{" "}
          <C>aria-label</C>, else the catalog&rsquo;s <C>kit.button.name</C>, in the
          user&rsquo;s language (:268-273,:322). The <C>||</C> is deliberate —{" "}
          <C>&quot;&quot;</C> is a string, and an empty sr-only span is a button
          announced as nothing but &ldquo;button&rdquo; (:317-319).{" "}
          <C>loading</C> is announced by <C>aria-busy</C>, not by the spinner, which is{" "}
          <C>aria-hidden</C> (:256); the specular overlay is hidden the same way
          (:220-235). A <C>disabled</C> button is removed with the native attribute
          (:305) rather than an <C>aria-disabled</C> that leaves it focusable.
        </p>
        <A11yCode code={NAMING_CODE} filename="Naming.tsx" />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          The native behaviour is kept whole because the file never touches it: there is
          no <C>onKeyDown</C>, no <C>preventDefault</C> and no role anywhere in{" "}
          <C>Button.tsx</C> — <C>Tab</C> reaches it, <C>Enter</C> and <C>Space</C>{" "}
          activate it, and every variant plus the accent and glass layers carries its own{" "}
          <C>focus-visible</C> ring (:104,:160, Theme:2745-2751). What changes is what <C>Enter</C>{" "}
          <em>means</em>: <C>type</C> defaults to <C>&quot;button&quot;</C>, so a stray
          Enter in a form no longer submits it (:141,:300-303), and a tip answers to
          focus as well as hover — pointer-only hints are invisible to keyboard drivers
          (:330-341, TooltipWrapper:270-282). Nothing else is bound: there is no list,
          no popup and no disclosure inside this component, so no arrow keys, no
          Home/End and no Escape — a popup trigger&rsquo;s Escape belongs to{" "}
          <C>Menu</C>, which also owns the <C>aria-expanded</C> Button only reads
          (:211).
        </p>
        <KeyboardSupportTable bindings={KEYBOARD} />
      </A11yTopic>

      <A11yTopic title="Triggers and held-open state">
        <p>
          A Button that opens something does not know it opened it. <C>Menu</C> stamps{" "}
          <C>aria-expanded</C> on whatever it is handed as a trigger and Button reads it
          off the spread (:211); while it is <C>true</C> the button keeps the
          variant&rsquo;s own hover classes, rewritten to <C>aria-expanded:</C>{" "}
          utilities (:212-218, Theme:3127-3135). No new colour to keep in sync, and the
          pointer&rsquo;s departure stops being a problem under the very interaction
          that raised the popup. <C>active</C>, <C>accent</C> and glass each own their
          surface already, so all three sit it out (:213).
        </p>
        <p>
          The matching prop is <C>tooltipDisabled</C> (:336): <C>MenuButton</C> holds a
          tip down while its menu is open, so the ghost of it never floats over the rows
          the user is trying to read (:92-94).
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Button is almost language-free by construction: <C>children</C>,{" "}
          <C>tooltip</C> and <C>aria-label</C> are the caller&rsquo;s text and pass
          through untouched, and icons are registry names, which carry no words at all.
          The one built-in string is the icon-only fallback name,{" "}
          <C>kit.button.name</C> (:322) — one key, five locales. It exists so that an
          icon-only button with a node child is announced as <em>something</em> in the
          user&rsquo;s language instead of nothing; it is a safety net, not a label, and
          the name warning is what tells you it fired.
        </p>
        <A11yCode code={I18N_CODE} filename="i18n.ts" />
      </A11yTopic>
    </A11ySection>

    <PropsTable props={BUTTON_PROPS} />
    <p className="text-sm text-neutral-500 dark:text-neutral-400">
      Spreads native button attributes — <C>onClick</C>, <C>aria-*</C>,{" "}
      <C>data-*</C> pass straight through (:312), and the dev-time name warning listens
      to the <C>aria-label</C> you set there too (:261-263). The kit&rsquo;s own{" "}
      <C>data-variant</C>/<C>data-color</C>/<C>data-size</C>/<C>data-glass</C>{" "}
      (:306-309) report the <em>resolved</em> surface, which is how <C>data-glass</C>{" "}
      can read <C>true</C> from <C>variant=&quot;glass&quot;</C> alone.
    </p>
  </div>
);

export default ButtonPage;
