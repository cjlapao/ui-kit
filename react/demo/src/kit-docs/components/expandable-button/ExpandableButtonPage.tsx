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
import { ExpandableButtonPlayground } from "./ExpandableButtonPlayground";
import Triggers from "./examples/Triggers";
import triggersCode from "./examples/Triggers.tsx?raw";
import EveryVariant from "./examples/EveryVariant";
import everyVariantCode from "./examples/EveryVariant.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import Physics from "./examples/Physics";
import physicsCode from "./examples/Physics.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import Glass from "./examples/Glass";
import glassCode from "./examples/Glass.tsx?raw";

export const ExpandableButtonPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Expandable Button"
      description="A circle at rest that springs its label out on hover, focus or click — the whole IconButton palette (variant, size, tone, corner, loading, accent, icon tint, glass, tooltip) plus the elastic reveal itself: five triggers, four spring curves, glyph motion and press squish."
    />
    <ExpandableButtonPlayground />
    <section className="relative flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Triggers"
        description="The five expandOn modes side by side — hover, focus, both, click and always. Hover, Tab and press each one."
        code={triggersCode}
        filename="Triggers.tsx"
      >
        <Triggers />
      </ExampleCard>
      <ExampleCard
        title="Every variant"
        description="All eight button variants at one tone and size, each labelled with its own name."
        code={everyVariantCode}
        filename="EveryVariant.tsx"
      >
        <EveryVariant />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="All 21 true colours, solid at one size."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
      <ExampleCard
        title="Physics"
        description="The four spring presets and the five glyph motions, each caption with what it actually does — hover to feel the difference."
        code={physicsCode}
        filename="Physics.tsx"
      >
        <Physics />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="Default, loading, disabled, accent, a tinted icon, a tooltip and the label on the left — hover and press these."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Glass"
        description="The glass variant with the three specular highlight modes on a coloured backdrop."
        code={glassCode}
        filename="Glass.tsx"
      >
        <Glass />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The label you see is not the label that is announced. It lives in a{" "}
          <code>0fr</code> grid column that collapses to nothing while closed,
          and a zero-width <code>overflow: hidden</code> box is unreliable
          across screen readers — so the whole track is <C>aria-hidden</C> and
          the name comes from elsewhere, in this order: <C>aria-label</C>, then{" "}
          <C>srLabel</C>, then a <C>label</C> that happens to be a string. An{" "}
          <code>sr-only</code> span carries the result, so the control can never
          render nameless. The glyph sits in an <code>aria-hidden</code> slot
          too, and so does the loading spinner — the announcement stays the
          action&rsquo;s, never &ldquo;loading&rdquo;.
        </p>
        <p>
          <C>aria-expanded</C> is only set where the component genuinely owns
          the open state — <C>expandOn=&quot;click&quot;</C>,{" "}
          <C>expandOn=&quot;always&quot;</C> or a controlled <C>expanded</C>.
          The CSS triggers do not advertise a state they do not
          hold. A styled <C>tooltip</C> replaces the native <code>title</code>{" "}
          rather than doubling it; with no tooltip the native one falls back to
          the accessible name. Passing <C>aria-hidden</C> on the button itself
          trips the kit&rsquo;s dev warning, because a focusable control that is
          hidden from assistive tech is a defect, not a style.
        </p>
        <A11yCode
          filename="labelling.tsx"
          code={`// The visible text is aria-hidden — the name is declared separately:
<ExpandableButton icon="Send" label="Send" srLabel="Send message" />

// aria-label wins over srLabel when both are present:
<ExpandableButton icon="Send" label="Send" aria-label="Send the draft" />

// A string label names the control on its own, but say it explicitly:
<ExpandableButton
  icon="Add"
  label="Add item"
  srLabel="Add an item to the list"
  expandOn="click"   // this is the mode that carries aria-expanded
/>`}
        />
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          A real <code>button</code> element, so nothing exotic is required —
          and <C>type</C> defaults to <code>&quot;button&quot;</code>, which
          keeps a thoughtless drop into a form from submitting it.{" "}
          <code>disabled</code> and <code>loading</code> both set the real{" "}
          <code>disabled</code> attribute, so they leave the tab order and the
          hover/focus rules cannot open them.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["Tab"],
              action: (
                <>
                  Reaches the control and paints the tone-coloured ring. The
                  label opens on <code>:focus-visible</code> in{" "}
                  <code>hover</code> and <code>hover+focus</code>, and on plain{" "}
                  <code>:focus</code> in <code>focus</code> and{" "}
                  <code>hover+focus</code> — a keyboard user is never handed a
                  circle they cannot name.
                </>
              ),
            },
            {
              keys: ["Enter", "Space"],
              action: (
                <>
                  Activate the button. Under <C>expandOn=&quot;click&quot;</C>{" "}
                  they also toggle the label, because that mode keeps the open
                  state in React rather than in a <code>:hover</code> rule — so
                  it answers to the keyboard and survives a tap.
                </>
              ),
            },
          ]}
        />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Two strings, both the caller&rsquo;s: the visible <C>label</C> and the
          announced <C>srLabel</C>. Translating only the visible one is the
          classic gap — the screen reader keeps speaking the source language.
          Pass a localized <C>srLabel</C> (or rely on the string-<C>label</C>{" "}
          fallback and translate that once). Nothing else here speaks: the
          spinner&rsquo;s kit-cataloged status text (en/de/es/fr/pt) sits inside
          the <code>aria-hidden</code> glyph slot, so it never announces.
        </p>
        <p>
          The reveal is <code>grid-template-columns: 0fr to 1fr</code>, so a
          longer translation runs out to its natural width instead of being cut
          off by a guessed <code>max-width</code> — but the label is{" "}
          <code>white-space: nowrap</code>, so keep translations short. For RTL
          the gap is logical (<code>padding-inline-start/end</code>, switched
          with <C>labelPlacement</C>) and <code>before</code> is{" "}
          <code>flex-direction: row-reverse</code>, so the layout follows the
          writing direction; the run-up itself is a physical{" "}
          <code>translateX</code>, so the label still slides in from the left.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "icon",
          type: "string | ReactElement",
          description:
            "A registry icon name (see the Icon Registry page) or your own element. It renders inside an aria-hidden slot and paints with currentColor, so it decorates and never names.",
        },
        {
          name: "label",
          type: "ReactNode",
          description:
            "The text that slides out. Real text, but aria-hidden while collapsed — srLabel (or a string label) is what gets announced.",
        },
        {
          name: "variant",
          type: "ButtonVariant",
          default: '"icon"',
          description:
            "The whole Button vocabulary; the icon default is the soft tinted circle. variant=\"glass\" auto-enables the glass path.",
        },
        {
          name: "color",
          type: "TrueColor",
          default: '"blue"',
          description:
            "Tone — fill, text, ring, glass chrome and the spinner all follow it.",
        },
        {
          name: "size",
          type: "ButtonSize",
          default: '"md"',
          description:
            "The shared control scale. It sets the resting circle's symmetric padding, the glyph size and the spinner size, so an md button aligns with an md input.",
        },
        {
          name: "rounded",
          type: '"md" | "lg" | "xl" | "full"',
          default: '"full"',
          description:
            "Corner radius — the circle is the identity, and the same corner rounds the pill the control becomes when it opens.",
        },
        {
          name: "customSizeClass",
          type: "string",
          description:
            "Escape hatch replacing the computed padding class that makes the resting box. Prefer size.",
        },
        {
          name: "iconClassName",
          type: "string",
          description: "Added to the rendered glyph's class list.",
        },
        {
          name: "labelClassName",
          type: "string",
          description:
            "For the label's inner span — the one that fades and slides.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          description:
            "Swaps the glyph for a spinner, sets the real disabled attribute (so hover and focus cannot open it) and skips the usual dim, so the one signal that work is happening stays visible. Also forces iconMotion to none.",
        },
        {
          name: "spinnerVariant",
          type: '"solid" | "segments"',
          default: '"segments"',
          description: "The spinner drawn in place of the glyph.",
        },
        {
          name: "spinnerColor",
          type: "SpinnerColor",
          default: "the color tone",
          description: "Overrides the spinner's tone only.",
        },
        {
          name: "srLabel",
          type: "string",
          description:
            "The accessible name. aria-label wins over it and a string label is the fallback, with an sr-only span guaranteeing the button is never nameless. This is the prop that makes the control usable — never rely on the fallback.",
        },
        {
          name: "accent",
          type: "boolean",
          default: "false",
          description:
            "The parent owns the fill (a toolbar button on a coloured bar): the background goes transparent, the glyph inherits, and a tone ring plus a hover wash keep it focusable-looking.",
        },
        {
          name: "accentColor",
          type: "TrueColor",
          default: "the color tone",
          description:
            "Picks the accent ring and hover tone. Without accent it still tints the hover text of a non-solid variant, and nothing else.",
        },
        {
          name: "iconColor",
          type: "string",
          description:
            "Raw CSS colour for the glyph only. Omit it and the icon inherits the button's text colour, so hover states repaint the glyph too.",
        },
        {
          name: "tooltip",
          type: "string",
          description:
            "Styled tooltip on hover. Setting it drops the native title, which otherwise falls back to the accessible name.",
        },
        {
          name: "tooltipPosition",
          type: "TooltipPosition",
          default: '"top"',
          description: "Where the styled tooltip sits relative to the button.",
        },
        {
          name: "glass",
          type: "boolean",
          default: "false",
          description:
            "Translucent chrome. variant=\"glass\" turns the same path on by itself; the variant's own opaque colour classes are dropped and the chrome comes from the glass tokens instead.",
        },
        {
          name: "vibrancy",
          type: "GlassVibrancy",
          default: '"medium"',
          description: "Backdrop blur strength under the fill.",
        },
        {
          name: "glassOpacity",
          type: "GlassOpacity",
          default: '"clear"',
          description:
            "Fill transparency — clear here, where the control is an icon surface, rather than the Button's frosted.",
        },
        {
          name: "specularMode",
          type: "SpecularMode",
          default: '"none"',
          description:
            "The glass highlight overlay (none/classic/halo). Ignored unless the control is glass.",
        },
        {
          name: "expandOn",
          type: "ExpandTrigger",
          default: '"hover"',
          description:
            "What reveals the label. hover / focus / hover+focus are pure CSS (the button never re-renders to animate); click and always move the open state into React. hover also opens on :focus-visible, focus uses plain :focus, and on a touchscreen (hover: none) a tap's focus opens the hover modes too.",
        },
        {
          name: "expanded",
          type: "boolean",
          description:
            "Controlled open state. When set it owns the open state outright — hover and focus stop opening it (and stop animating the glyph, which hangs off the same open switch). One of the three modes that carry aria-expanded, with click and always.",
        },
        {
          name: "defaultExpanded",
          type: "boolean",
          default: "false",
          description:
            'Initial open state, read once at mount. It seeds the click toggle; `expandOn="always"` is open by definition and does not need it.',
        },
        {
          name: "onExpandedChange",
          type: "(expanded: boolean) => void",
          description:
            "Fires when the effective open state changes — in the CSS modes, once the pointer and focus have both let go (so a hover+focus control does not report true twice on arrival, nor false while focus still holds the label open); in click mode, on every toggle. Never from always, and never from a value you set yourself.",
        },
        {
          name: "spring",
          type: "ExpandableButtonSpring",
          default: '"bouncy"',
          description:
            "The easing, tuned by overshoot: bouncy is cubic-bezier(0.34,1.56,0.64,1) at 600ms; snappy 380ms; gentle 900ms; precise 320ms with the overshoot dialled off.",
        },
        {
          name: "springDuration",
          type: "number",
          default: "the preset's duration",
          description:
            "Milliseconds. Overrides the preset's duration only — the curve still comes from spring. Both land in the --eb-spring-* custom properties set inline; your own style prop is merged over them (it no longer replaces them), so an explicit --eb-spring-duration in style still wins.",
        },
        {
          name: "fadeDuration",
          type: "number",
          default: "300",
          description:
            "Milliseconds for the label's opacity ramp, which rides a plain ease rather than the spring — an opacity that overshoots 1 only clips. Settable independently for exactly that reason.",
        },
        {
          name: "labelGap",
          type: "string",
          default: '"0.6em"',
          description:
            "The gap the label opens between itself and the glyph. A CSS length: relative units are the point, so it stays in proportion across the size scale. It is padding inside the clipped label, which is why the closed control stays a circle.",
        },
        {
          name: "labelSlide",
          type: "string",
          default: '"0.8em"',
          description:
            "How far back the label starts, so it slides out from behind the glyph instead of fading in on the spot.",
        },
        {
          name: "elevate",
          type: "boolean",
          default: "true",
          description:
            "A resting shadow that deepens as the label springs out — the raise rides the same curve.",
        },
        {
          name: "iconMotion",
          type: "ExpandableButtonIconMotion",
          default: '"pop-tilt"',
          description:
            "What the glyph does while the label slides out: pop scales it past 1, tilt leans it 8°, lift raises it 2px, pop-tilt does the first two, none keeps it still.",
        },
        {
          name: "squish",
          type: "boolean",
          default: "true",
          description:
            "Press feedback — :active scales the whole button to 94%. Dropped under prefers-reduced-motion.",
        },
        {
          name: "labelPlacement",
          type: '"after" | "before"',
          default: '"after"',
          description:
            "Label to the right of the glyph (default) or to its left, which reverses the row and moves the gap and run-up to that side.",
        },
      ]}
    />

    <p className="text-xs opacity-70">
      Remaining native button attributes (onClick, onMouseEnter, data-*, form
      overrides…) pass straight through to the <code>button</code> — except{" "}
      <code>type</code>, which defaults to <code>button</code> and can still be
      overridden when you genuinely want a submit button. The handlers you pass
      are called after the component&rsquo;s own bookkeeping, so wiring{" "}
      <code>onMouseEnter</code> or <code>onFocus</code> alongside a CSS trigger
      does not swallow the reveal.
    </p>
  </div>
);

export default ExpandableButtonPage;
