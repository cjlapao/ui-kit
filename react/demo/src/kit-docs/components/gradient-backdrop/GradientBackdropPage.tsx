import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  KeyboardSupportTable,
  PropsTable,
  type PropDoc,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { GradientBackdropPlayground } from "./GradientBackdropPlayground";
import Templates from "./examples/Templates";
import templatesCode from "./examples/Templates.tsx?raw";
import CustomTheme from "./examples/CustomTheme";
import customThemeCode from "./examples/CustomTheme.tsx?raw";
import DarkOnly from "./examples/DarkOnly";
import darkOnlyCode from "./examples/DarkOnly.tsx?raw";
import BehindGlass from "./examples/BehindGlass";
import behindGlassCode from "./examples/BehindGlass.tsx?raw";

export const GradientBackdropPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Gradient Backdrop"
      description="A soft radial glow over a three-stop gradient — the backdrop to put glass and translucent components on. Six muted templates ship with the kit (Slate, Mist, Stone, Dune, Fog, Graphite), or pass your own theme. A theme can give only its light or only its dark colours: the other side is derived with a formula fitted on the templates (OKLCH lightness mirrored per colour role, hue kept). It follows the page's dark mode through CSS variables, with no JavaScript. It is React-only today: the Vue kit has no GradientBackdrop."
    />
    <GradientBackdropPlayground />

    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard
        title="Templates"
        description="`theme` takes a template id. Each tile shows the template pinned to light and to dark with `scheme`."
        code={templatesCode}
        filename="Templates.tsx"
      >
        <Templates />
      </ExampleCard>
      <ExampleCard
        title="Your own theme — light only"
        description="Give the four colours (glow, from, via, to) for light mode and the dark ones are derived. `shape` overrides any part of the geometry: angle, glow size, position and fade."
        code={customThemeCode}
        filename="CustomTheme.tsx"
      >
        <CustomTheme />
      </ExampleCard>
      <ExampleCard
        title="Dark only"
        description="The derivation runs both ways. `resolveGradientBackdropTheme` returns the colours the component will use, derived side included."
        code={darkOnlyCode}
        filename="DarkOnly.tsx"
      >
        <DarkOnly />
      </ExampleCard>
      <ExampleCard
        title="Behind glass"
        description="What it is for: a backdrop glass surfaces can be judged against, with `noise` adding a film grain so the large gradient does not band. It is a plain container — children render on top."
        code={behindGlassCode}
        filename="BehindGlass.tsx"
      >
        <BehindGlass />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The backdrop is decorative: the root is a plain <C>div</C> with no
          role, so assistive technology reads straight through to its children.
          The one accessibility attribute the component emits itself is{" "}
          <C>aria-hidden="true"</C> on the noise layer
          (<C>GradientBackdrop.tsx:89</C>), which is also{" "}
          <C>pointer-events-none</C> and sits at <C>-z-10</C> under{" "}
          <C>isolate</C> — the grain can be neither announced, clicked, nor
          painted over a sibling.
        </p>
        <p>
          The three <C>data-*</C> attributes it writes (<C>data-gradient-backdrop</C>,{" "}
          <C>data-theme</C> — the template id or <C>"custom"</C> — and{" "}
          <C>data-scheme</C>, <C>:73-75</C>) are styling and test hooks, not
          semantics, and they are written <em>after</em> the spread, so a{" "}
          <C>data-theme</C> of your own is overwritten. Attributes you pass (
          <C>aria-label</C>, <C>role</C>, <C>tabIndex</C>) reach the root through{" "}
          <C>{`{...rest}`}</C>, and so does a <C>ref</C>: the component is a{" "}
          <C>forwardRef</C>.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard Support">
        <p>
          Nothing in <C>GradientBackdrop.tsx</C> compares a key: no{" "}
          <C>onKeyDown</C>, <C>onKeyUp</C>, <C>onKeyPress</C>, focus handler or{" "}
          <C>tabIndex</C> setter, and no pointer or drag handler either. What
          keyboard behaviour exists belongs to the children, or to a handler the
          consumer spreads onto the root.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["Tab"],
              action: (
                <>
                  Moves through the children only. The root is a{" "}
                  <C>div</C> with no <C>tabIndex</C>, and the grain layer is{" "}
                  <C>aria-hidden</C> and <C>pointer-events-none</C> (
                  <C>GradientBackdrop.tsx:88-92</C>).
                </>
              ),
            },
            {
              keys: ["Any"],
              action: (
                <>
                  Nothing, unless the consumer passes a handler: key events reach
                  the root only via <C>{`{...rest}`}</C> (<C>:72</C>).
                </>
              ),
            },
          ]}
        />
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          No built-in text, and no provider: the component reads no{" "}
          <C>kit.*</C> key and renders no sentence — the only strings it produces
          are CSS <C>background</C> values and the <C>data-theme</C> /{" "}
          <C>data-scheme</C> attribute values. Template names are English
          <em>data</em> (<C>GRADIENT_BACKDROP_TEMPLATES[id].label</C>) for your
          own picker to translate.
        </p>
        <p>
          Geometry is physical, so nothing mirrors: <C>shape.angle</C> is a CSS
          degree value and <C>glowX</C> / <C>glowY</C> are percentages of the box
          (<C>common/backdrop/gradient.ts:183-188</C>). A <C>dir="rtl"</C>{" "}
          ancestor leaves the glow where the template put it — a mirrored
          backdrop is a <C>shape</C> choice, not a locale behaviour.
        </p>
      </A11yTopic>
      <A11yTopic title="Motion">
        <p>
          Nothing animates, so there is nothing to reduce: the component emits no
          <C>transition</C> or <C>animate</C> utility and <C>styles.css</C> has no
          GradientBackdrop rule. The only change is a swap — editing{" "}
          <C>theme</C> rebuilds the two CSS values in a <C>useMemo</C> (
          <C>:59-62</C>) and the background repaints at once; in{" "}
          <C>auto</C> the swap rides the <C>.dark</C> class with no transition, so
          the reduced-motion experience is identical to the full one.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable props={GRADIENT_BACKDROP_PROPS} />
  </div>
);

/** Every row verified against `GradientBackdrop.tsx` and `common/backdrop/`. */
export const GRADIENT_BACKDROP_PROPS: PropDoc[] = [
        { name: "theme", type: "GradientBackdropTemplateId | GradientBackdropTheme", default: '"slate"', description: "A built-in template id, or a theme: `{ light?, dark?, shape?, label? }`. Either colour side may be omitted — it is derived from the other. A theme with neither side, or an unknown id, falls back to Slate's colours (common/backdrop/gradient.ts:173-178) — though `data-theme` still echoes what you wrote. Colours are `#rgb` / `#rrggbb` (the `#` is optional); anything else throws while parsing (common/backdrop/color.ts:24). `label` is carried by the resolver and never painted: it is for your own picker." },
        { name: "theme.light / theme.dark", type: "{ glow, from, via, to }", description: "Hex colours: the radial highlight and the three linear stops." },
        { name: "theme.shape", type: "Partial<GradientBackdropShape>", default: "Slate's", description: "angle (deg), viaStop (%), glowWidth / glowHeight (px), glowX / glowY (%), glowFade (%). Only what you name is overridden; both schemes share one geometry (common/backdrop/gradient.ts:175)." },
        { name: "scheme", type: '"auto" | "light" | "dark"', default: '"auto"', description: "auto publishes both schemes as CSS variables and lets the kit's dark variant pick — which means the dark side needs a `.dark` ancestor, and any `data-color-scheme=\"light\"` upstream opts the subtree out (react/src/styles.css:24). light / dark pin one scheme with an inline background and emit no variables at all (:64-67)." },
        { name: "noiseScale", type: "number", default: "none (automatic)", description: "Grain scale over a repeating 200px tile: 0.25 is very fine, 2 is coarse. Only read inside the noise layer, so it does nothing while `noise` is off; a value that is not finite and positive is dropped and the tile keeps its automatic size (common/theme/noise.ts:27-32)." },
        { name: "noise", type: "boolean", default: "false", description: "Paint the kit's dither-noise (film grain) over the gradient, under the children — the texture SidePanel uses, desaturated so it never casts colour. Multiply at 8% in light (overlay is a no-op on a light base), overlay at 40% in dark; follows `scheme` when it is pinned. The root also gets `isolate`, so the grain's -z-10 stays inside the box (:80)." },
        { name: "children / className / style / …", type: "div props", description: "Spread onto the root div. Children render last, on top of the grain. Give the box a height — an unstyled plain div is invisible at zero height. className is appended with `classnames`, not tailwind-merge, so a conflicting utility you pass is kept alongside the component's own (:76-84); style is merged after the component's background, so your own `background` wins (:85)." },
        { name: "ref", type: "Ref<HTMLDivElement>", description: "The component is a forwardRef (:54) and the handle lands on the root div (:71)." },
        { name: "data-gradient-backdrop / data-theme / data-scheme", type: "emitted", description: "Written by the component after the spread: always present, the template id (or \"custom\" for a theme object), and the scheme — hooks for CSS and contract tests, not semantics. A data-theme you pass is overwritten (:72-75)." },
        { name: "resolveGradientBackdropTheme(theme)", type: "→ { light, dark, shape }", description: "The complete theme the component draws — use it to show or store the derived colours." },
        { name: "deriveDarkColor(hex, role) / deriveLightColor(hex, role)", type: "→ hex", description: "One colour's partner in the other scheme, per role — the formula fitted on the six templates. `role` defaults to \"via\", so name the role you mean. The coefficients are exported as GRADIENT_BACKDROP_DERIVATION." },
        { name: "gradientBackdropCss(colors, shape)", type: "→ string", description: "The CSS background value for one scheme, for a surface that is not a GradientBackdrop." },
      ];

export default GradientBackdropPage;
