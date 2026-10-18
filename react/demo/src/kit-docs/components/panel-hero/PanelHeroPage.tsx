import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11yCode,
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
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
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Panel Hero"
      description="A banner: an icon, a heading and a supporting line, on a saturated gradient or on any of the kit's container surfaces. The gradient runs between the tone's own 700 and 800 shades, read from Tailwind's palette variables — which is what keeps its white copy above the kit's measured contrast floor."
    />
    <PanelHeroPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Every tone"
        description="Each stays in its own tone. The table this replaces mapped every tone to a *different* one's gradient — `sky` painted sky→indigo, `red` painted red→rose — and its light stop was `-400`, where white measures 2.94:1 on yellow."
        code={tonesCode}
        filename="Tones.tsx"
      >
        <Tones />
      </ExampleCard>
      <ExampleCard
        title="Variants"
        description="`gradient` is the saturated band; every other variant is a `Panel`, so it brings its own fill, ring and glass props, and its copy comes from the surface rather than being forced to white."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="Title, subtitle and the icon chip move together on the shared control scale. The subtitle's own scale used to stop at `md`, and the chip was pinned at 48px whatever the type did."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="Stops and glow"
        description="The stops are overridable, and a halo sits behind the band at the chosen intensity — inset within reserved padding so an ancestor with `overflow: auto` cannot clip it."
        code={gradientCode}
        filename="Gradient.tsx"
      >
        <Gradient />
      </ExampleCard>
      <ExampleCard
        title="With actions"
        description="Children render full-width under the title row — the natural home for a banner&rsquo;s buttons. They used to be silently dropped."
        code={withActionsCode}
        filename="WithActions.tsx"
      >
        <WithActions />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The headline is a real heading when you ask for one: <C>titleAs</C>{" "}
          picks the element, and it defaults to <C>p</C> — a page-top banner
          should pass <C>h1</C> or <C>h2</C> so it appears in the heading list.
          The icon chip, the floating shapes and the wash are <C>aria-hidden</C>{" "}
          decoration; the copy colour is forced to white only on the gradient
          band (measured 4.93:1 minimum against the tone&rsquo;s 700 stop),
          while every surface variant takes it from the surrounding surface.
        </p>
        <A11yCode filename="Semantics.tsx" code={SEMANTICS_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          The banner itself is static — no bindings, no tab stop. Buttons and
          links passed as <C>children</C> keep their own native keyboard
          behaviour, in reading order after the heading text.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The component ships no strings; title, subtitle and children are the
          caller&rsquo;s. Layout is flow-based, so long translations wrap inside
          the title column while the icon chip keeps its size, and everything
          mirrors with <C>dir="rtl"</C> including the gradient&rsquo;s diagonal.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "title",
          type: "ReactNode",
          description: (
            <>
              Main heading — rendered by <C>titleAs</C>.
            </>
          ),
        },
        {
          name: "subtitle",
          type: "ReactNode",
          description: "Supporting line under the title.",
        },
        {
          name: "titleAs",
          type: '"h1"…"h6" | "p"',
          default: "p",
          description:
            "The heading element; pass h1/h2 for a page-top banner so it enters the heading outline.",
        },
        {
          name: "children",
          type: "ReactNode",
          description:
            "Actions or extra copy, full-width under the title row. Was silently dropped before 0.2.",
        },
        {
          name: "icon",
          type: "IconName | ReactElement",
          description:
            "Icon chip; decorative (aria-hidden). Omit it and the slot is not drawn.",
        },
        {
          name: "tone",
          type: "TrueColor",
          default: "blue",
          description: "Drives the gradient stops and every variant's accent.",
        },
        {
          name: "variant",
          type: '"gradient" | PanelVariant',
          default: "gradient",
          description:
            "The saturated band, or any Panel surface — which brings its own fill, ring and glass props.",
        },
        {
          name: "titleSize / subtitleSize",
          type: "ControlSize",
          default: "sm / xs",
          description:
            "Shared control scale; the icon chip scales with the title.",
        },
        {
          name: "padding",
          type: "SurfacePadding",
          default: "sm",
          description: "Standard container padding.",
        },
        {
          name: "corner",
          type: "SurfaceCorner",
          default: "rounded-md",
          description: "Standard container corner.",
        },
        {
          name: "rounded",
          type: "boolean",
          description: "Deprecated — false means corner none.",
        },
        {
          name: "decoration",
          type: '"shapes" | "gradient" | "both" | "none"',
          default: "both",
          description:
            "Floating circles and diagonal wash inside the band; also forwarded to Panel surfaces.",
        },
        {
          name: "gradientFrom / gradientTo",
          type: "string",
          description: (
            <>
              Overrides for the band&rsquo;s stops. Defaults: the tone&rsquo;s
              700 and 800 — the kit&rsquo;s measured floor for white copy.
            </>
          ),
        },
        {
          name: "glowIntensity",
          type: "GlowIntensity",
          default: "soft",
          description:
            "Halo behind the band, inset within reserved padding so scrollable ancestors cannot clip it.",
        },
        {
          name: "glassOpacity / vibrancy / specularMode",
          type: "GlassOpacity / GlassVibrancy / SpecularMode",
          description: "Glass fill knobs for the see-through variants.",
        },
        {
          name: "color",
          type: "TrueColor",
          description: "Deprecated alias of tone.",
        },
      ]}
    />
  </div>
);

const SEMANTICS_CODE = `// A page-top banner must enter the heading outline.
<PanelHero titleAs="h1" title="Deploy pipeline" subtitle="main · 3 running" />

// Actions belong in children — under the title row, in reading order.
<PanelHero titleAs="h2" title="Index failed">
  <Button variant="outline">View logs</Button>
</PanelHero>`;

export default PanelHeroPage;
