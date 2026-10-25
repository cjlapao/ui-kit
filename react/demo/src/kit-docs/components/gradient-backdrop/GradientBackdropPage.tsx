import React from "react";
import { A11ySection, A11yTopic, C, PropsTable } from "../../shared/A11ySections";
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
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Gradient Backdrop"
      description="A soft radial glow over a three-stop gradient — the backdrop to put glass and translucent components on. Six muted templates ship with the kit (Slate, Mist, Stone, Dune, Fog, Graphite), or pass your own theme. A theme can give only its light or only its dark colours: the other side is derived with a formula fitted on the templates (OKLCH lightness mirrored per colour role, hue kept). It follows the page's dark mode through CSS variables, with no JavaScript. React ships first; the Vue kit is a step behind."
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
        description="What it is for: a backdrop glass surfaces can be judged against. It is a plain container — children render on top."
        code={behindGlassCode}
        filename="BehindGlass.tsx"
      >
        <BehindGlass />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The backdrop is decorative: a plain <C>div</C> with no role, so assistive technology reads straight through to
          its children. Attributes you pass (<C>aria-label</C>, <C>role</C>, <C>data-*</C>) are forwarded, for the rare
          case where the backdrop itself is a landmark.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard Support">
        <p>None — it holds no focusable element of its own; focus moves through its children as usual.</p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>No built-in text. Template labels are English data (<C>GRADIENT_BACKDROP_TEMPLATES[id].label</C>) for your own UI to translate.</p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        { name: "theme", type: "GradientBackdropTemplateId | GradientBackdropTheme", default: '"slate"', description: "A built-in template id, or a theme: `{ light?, dark?, shape?, label? }`. Either colour side may be omitted — it is derived from the other. A theme with neither side, or an unknown id, falls back to Slate." },
        { name: "theme.light / theme.dark", type: "{ glow, from, via, to }", description: "Hex colours (#rgb or #rrggbb): the radial highlight and the three linear stops." },
        { name: "theme.shape", type: "Partial<GradientBackdropShape>", default: "Slate's", description: "angle (deg), viaStop (%), glowWidth / glowHeight (px), glowX / glowY (%), glowFade (%). Only what you name is overridden." },
        { name: "scheme", type: '"auto" | "light" | "dark"', default: '"auto"', description: "auto follows the kit's dark class through CSS variables; light / dark pin one scheme with an inline background." },
        { name: "children / className / style / …", type: "div props", description: "Spread onto the root div. Give it a size with className; children render on top." },
        { name: "resolveGradientBackdropTheme(theme)", type: "→ { light, dark, shape }", description: "The complete theme the component draws — use it to show or store the derived colours." },
        { name: "deriveDarkColor(hex, role) / deriveLightColor(hex, role)", type: "→ hex", description: "One colour's partner in the other scheme. The coefficients are exported as GRADIENT_BACKDROP_DERIVATION." },
        { name: "gradientBackdropCss(colors, shape)", type: "→ string", description: "The CSS background value for one scheme, for a surface that is not a GradientBackdrop." },
      ]}
    />
  </div>
);

export default GradientBackdropPage;
