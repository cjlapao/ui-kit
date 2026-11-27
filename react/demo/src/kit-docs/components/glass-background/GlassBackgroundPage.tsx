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
import { GlassBackgroundPlayground } from "./GlassBackgroundPlayground";
import SignInForm from "./examples/SignInForm";
import signInFormCode from "./examples/SignInForm.tsx?raw";
import Directions from "./examples/Directions";
import directionsCode from "./examples/Directions.tsx?raw";
import Palettes from "./examples/Palettes";
import palettesCode from "./examples/Palettes.tsx?raw";
import Shimmer from "./examples/Shimmer";
import shimmerCode from "./examples/Shimmer.tsx?raw";
import AmbientOff from "./examples/AmbientOff";
import ambientOffCode from "./examples/AmbientOff.tsx?raw";

export const GlassBackgroundPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Glass Background"
      description="A gradient layer that sits behind glass surfaces. Pick a primary tone (the component's is blue), steer the gradient in eight directions, and layer ambient glows or a slow shimmer on top; the secondary and deep stops are derived neighbouring hues unless you override them. By default it fills the nearest positioned ancestor — switch it to fixed for a page-level backdrop."
    />
    <GlassBackgroundPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Sign-in form"
        description="The classic case: a liquid-glass panel floating on the gradient, with the ambient glow breathing behind it."
        code={signInFormCode}
        filename="SignInForm.tsx"
      >
        <SignInForm />
      </ExampleCard>
      <ExampleCard
        title="Eight directions"
        description={`\`direction\` maps to a CSS gradient angle — \`t\`, \`tr\`, \`r\`, \`br\`, \`b\`, \`bl\`, \`l\`, \`tl\`. Bottom-right (\`br\`) is the default.`}
        code={directionsCode}
        filename="Directions.tsx"
      >
        <Directions />
      </ExampleCard>
      <ExampleCard
        title="Palettes"
        description="`colorSecondary` and `colorDeep` override the middle and final gradient stops. Omit either and a neighboring hue is derived from `color` automatically."
        code={palettesCode}
        filename="Palettes.tsx"
      >
        <Palettes />
      </ExampleCard>
      <ExampleCard
        title="Shimmer"
        description="`shimmer` adds a slow-moving light band across the surface — subtle enough to sit under glass, off by default."
        code={shimmerCode}
        filename="Shimmer.tsx"
      >
        <Shimmer />
      </ExampleCard>
      <ExampleCard
        title="Ambient off"
        description="`ambient` (default on) renders two large blurred glow circles in the primary color behind the content. Turn it off for a flatter, quieter gradient."
        code={ambientOffCode}
        filename="AmbientOff.tsx"
      >
        <AmbientOff />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The backdrop is silent by construction. Its four decorative layers —
          the two <C>.glass-gradient</C> divs, the two glow divs, the shimmer
          band — contain no text and carry no role, so nothing enters the
          accessibility tree; the component's only accessibility attribute is{" "}
          <C>aria-hidden="true"</C> on the shimmer wrapper (
          <C>GlassBackground.tsx:144</C>). The theme you are not looking at is
          <C>display: none</C>, not <C>visibility: hidden</C> (
          <C>GlassBackground.tsx:95,104</C>), so the other gradient layer is
          out of the tree as well — which is also why a test that queries{" "}
          <C>.glass-gradient</C> is reading the <em>light</em> stops
          (<C>-300 / -200 / -50</C>) and silently ignoring the dark ones.
        </p>
        <p>
          Note where the children land: inside the same root, in the{" "}
          <C>relative z-10</C> wrapper (<C>GlassBackground.tsx:151</C>). So the
          usual way of silencing a decorative wrapper from the outside —
          <C>aria-hidden</C> on the element, which <C>...rest</C> forwards to
          the root at <C>:91</C> — would hide the panel floating on top of it
          too. Leave the layers empty (they have no content slot of their own)
          and put every word in <C>children</C>; that is also where the landmark
          and the heading belong.
        </p>
        <A11yCode
          filename="Backdrop.tsx"
          code={`{/* Decorative by emptiness: the layers hold no text, so there is
    nothing for AT to announce — and no aria-hidden on the root, which
    would hide the panel inside it as well. */}
<div className="relative isolate min-h-svh">
  <GlassBackground color="blue" direction="br">
    <main className="flex min-h-svh items-center justify-center p-6">
      <Panel variant="liquid-glass" corner="rounded-lg" padding="md">
        <h1 className="text-lg font-semibold">Deploy your first job</h1>
        <p>The heading is the backdrop's only accessible content.</p>
      </Panel>
    </main>
  </GlassBackground>
</div>`}
        />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          <C>GlassBackground.tsx</C> compares no key and installs no listener:
          there is no <C>onKeyDown</C>, <C>onKeyUp</C>, <C>onKeyPress</C>,
          focus handler, <C>tabIndex</C> setter, timer or <C>matchMedia</C>{" "}
          call in the file. Everything keyboard-related is either the children's
          own behaviour or whatever the consumer forwards to the root through{" "}
          <C>...rest</C>.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["Tab"],
              action: (
                <>
                  Skips the backdrop. It renders no focusable element — no
                  button, link or <C>tabIndex</C> anywhere in the file — so the
                  only stops are the children in the <C>z-10</C> wrapper.
                </>
              ),
            },
            {
              keys: ["Any"],
              action: (
                <>
                  Nothing, unless the consumer passes a handler: key events
                  reach a root <C>div</C> only via <C>...rest</C> (
                  <C>GlassBackground.tsx:91</C>).
                </>
              ),
            },
          ]}
        />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The component speaks no strings. There is no <C>kit.*</C> key, no
          i18n import and no rendered English literal in{" "}
          <C>GlassBackground.tsx</C> — the only string values it produces are
          CSS angles and <C>var(--color-…)</C> templates — so no provider is
          required and no locale can be more complete than another. Every word
          on screen arrives in <C>children</C>, which the app translates.
        </p>
        <p>
          Nothing mirrors either. <C>direction</C> compiles to a physical CSS
          angle (<C>br → "to bottom right"</C>, <C>GlassBackground.tsx:67-76</C>)
          and the two glows are offset physically (<C>top/left: -25%</C> and{" "}
          <C>bottom/right: -25%</C>, <C>:79-82</C>), so a <C>dir="rtl"</C>{" "}
          ancestor changes neither. A page that wants the light coming from the
          other side picks the mirrored code itself — <C>bl</C> for{" "}
          <C>br</C> — which is an author decision, not the component's.
        </p>
      </A11yTopic>

      <A11yTopic title="Motion">
        <p>
          Both effects are 6-second CSS loops on the same clock:{" "}
          <C>.shimmer-band</C> sweeps in the first 40% of its cycle (
          <C>styles.css:61-95</C>) while <C>.ambient-pulse</C> breathes between
          0.35 and 0.55 opacity (<C>styles.css:109-121</C>). Under{" "}
          <C>prefers-reduced-motion: reduce</C> both get{" "}
          <C>animation: none !important</C> (<C>styles.css:790-811</C>) — with
          an asymmetric result worth knowing: the shimmer band's base opacity
          is 0, so it disappears, while the glows keep their base 0.35 and stay
          as a static bloom.
        </p>
        <p>
          Tone changes are instant. The <C>transition-colors duration-300</C>{" "}
          on the gradient layers (<C>GlassBackground.tsx:95,104</C>) covers{" "}
          <C>background-color</C> and <C>--tw-gradient-*</C>, not{" "}
          <C>background-image</C> or the <C>--glass-*</C> custom properties the
          gradient actually reads, so it never fades.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable props={GLASS_BACKGROUND_PROPS} />
  </div>
);

/** Every public prop of `GlassBackgroundProps`, defaults from the destructuring at :49-61. */
export const GLASS_BACKGROUND_PROPS: PropDoc[] = [
  {
    name: "position",
    type: `"fixed" | "absolute"`,
    default: '"absolute"',
    description:
      'Fills the nearest positioned ancestor, which must be `relative` (an unpositioned parent collapses it to zero height), or covers the viewport. The docblock calls the component "a fixed, full-viewport gradient layer" (:45-47) while the code defaults to `absolute` (:50) — the code and the tests are the ones to follow. `fixed` inside a scrolled container escapes its parent and papers the page.',
  },
  {
    name: "color",
    type: "TrueColor",
    default: '"blue"',
    description:
      'Primary stop, and the only tone the ambient glows use (:129-130). Light mode reads the `-300` step for the first stop and `-400` for the glows; dark mode `-700` and `-500`. Both `.glass-gradient` layers are always mounted, so an unimported stylesheet is the only thing that can make the gradient transparent.',
  },
  {
    name: "colorSecondary",
    type: "TrueColor",
    default: "— (derived)",
    description:
      "Middle stop. Left out, `getGlassBackgroundSecondaryTone(color)` picks a neighbouring hue (common/theme/glass.ts:419) — `blue → indigo`, `teal → emerald`, `zinc → stone`. All 21 tones have an entry and none maps to itself. Used only for `--glass-via` (`-200` light, `-600` dark); never for the glows.",
  },
  {
    name: "colorDeep",
    type: "TrueColor",
    default: "— (derived)",
    description:
      "Final stop. Left out, `getGlassBackgroundDeepTone(color)` decides (common/theme/glass.ts:423) — `blue → violet`, `sky → indigo`, `amber → red`. Light mode uses the `-50` step, dark mode the `-800`.",
  },
  {
    name: "direction",
    type: "GradientDirection",
    default: '"br"',
    description:
      'Eight codes, each mapped to a CSS angle string at :67-76 and handed to `--glass-angle`; `.glass-gradient` falls back to `to bottom right` on its own (styles.css:130). Physical rather than logical — see Internationalization.',
  },
  {
    name: "shimmer",
    type: "boolean",
    default: "false",
    description:
      "One `.shimmer-band` sweeping a 6 s loop (styles.css:61-95), clipped by a `pointer-events-none` wrapper that is also the only `aria-hidden` node in the file. Its gradient is fixed white (a 0.42 core in light mode, 0.18 in dark), never derived from `color`.",
  },
  {
    name: "ambient",
    type: "boolean",
    default: "true",
    description:
      "Two blurred glow circles, both `w-2/3 h-2/3`, at `top/left: -25%` and `bottom/right: -25%` (:79-82). The count, size and offsets are not configurable; the colour follows `color` only. The wrapper clips them with `overflow-hidden` — the root has none.",
  },
  {
    name: "children",
    type: "ReactNode (inherited)",
    default: "—",
    description:
      "Wrapped unconditionally in `<div className=\"relative z-10\">` (:151) — an empty div when absent. Interactive content belongs there: the two gradient layers do not set `pointer-events-none` (only the effect wrappers do, :115,143), so they swallow pointer events across the whole inset-0 area from anything behind the component.",
  },
  {
    name: "className / style / div attributes",
    type: 'Omit<HTMLAttributes<HTMLDivElement>, "color">',
    default: "—",
    description:
      'Spread onto the root div (:85-92). `className` is concatenated after the positioning classes with plain `classnames`, not tailwind-merge — `className="fixed"` or `z-50` wins on stylesheet order, not author order. `style` reaches the root only: the five `--glass-*` / `--glow-*` properties are inlined on the inner layers (:97-100,106-109,129-130), so a consumer override of `--glass-from` is a silent no-op. `role`, `data-*` and event handlers all land on the root.',
  },
];

export default GlassBackgroundPage;
