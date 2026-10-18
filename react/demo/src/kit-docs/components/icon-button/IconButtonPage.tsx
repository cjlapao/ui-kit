import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11ySection,
  A11yTopic,
  C,
  Kbd,
  PropsTable,
} from "../../shared/A11ySections";
import { IconButtonPlayground } from "./IconButtonPlayground";
import EveryVariant from "./examples/EveryVariant";
import everyVariantCode from "./examples/EveryVariant.tsx?raw";
import SizeAndCorner from "./examples/SizeAndCorner";
import sizeAndCornerCode from "./examples/SizeAndCorner.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import Glass from "./examples/Glass";
import glassCode from "./examples/Glass.tsx?raw";

export const IconButtonPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Icon Button"
      description="A square icon-only control. The full Button palette — variant, size, tone — plus corner radius, loading, accent and icon tint, glass fill with specular highlights, and a styled tooltip."
    />
    <IconButtonPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Every variant"
        description="All button variants at one tone and size."
        code={everyVariantCode}
        filename="EveryVariant.tsx"
      >
        <EveryVariant />
      </ExampleCard>
      <ExampleCard
        title="Size and corner"
        description="The shared control scale, then the four corner radii at lg."
        code={sizeAndCornerCode}
        filename="SizeAndCorner.tsx"
      >
        <SizeAndCorner />
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
        title="States"
        description="Default, loading, disabled, accent, a tinted icon and a tooltip — hover and press these."
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
          A square of icon with a name attached: <C>srLabel</C> (or{" "}
          <C>aria-label</C>, which wins) becomes both the accessible name and
          the native tooltip, and an <code>sr-only</code> span guarantees the
          button can never render nameless. The glyph itself stays decorative —
          rendered <code>aria-hidden</code> — so the icon&rsquo;s own SVG title
          never double-speaks. When a styled <C>tooltip</C> is set the native{" "}
          <code>title</code> is dropped rather than doubling up. A{" "}
          <code>loading</code> button swaps the glyph for a spinner that is
          itself <code>aria-hidden</code>: the name stays the action&rsquo;s,
          not &ldquo;loading&rdquo;, so the announcement never goes stale
          mid-click.
        </p>
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          A real <code>button</code> element, so <Kbd>Enter</Kbd> and{" "}
          <Kbd>Space</Kbd> activate it and <Kbd>Tab</Kbd> reaches it — nothing
          exotic. It defaults to <C>type=&quot;button&quot;</C>, which matters
          more here than it sounds: the native default is <code>submit</code>,
          and an icon button dropped into a form without thinking used to submit
          it. <Kbd>Tab</Kbd> focus shows the tone-coloured ring;{" "}
          <code>disabled</code> and <code>loading</code> both take it out of the
          tab order — because they set the real <code>disabled</code> attribute,
          not a fake <code>aria-disabled</code> lookalike.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The label is the whole of the control&rsquo;s text, so it must be
          translated like any other string — a translated page full of
          untranslated icon buttons is the classic gap. Pass a localized
          <C>srLabel</C>; it serves the screen reader, the native tooltip and
          the fallback name at once. The spinner&rsquo;s own status text is
          kit-cataloged (en/de/es/fr/pt).
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "icon",
          type: "string | ReactElement",
          description:
            "A registry icon name (see the Icon Registry page) or your own element. Elements you pass should be decorative — aria-hidden — and let the label do the naming.",
        },
        {
          name: "srLabel",
          type: "string",
          default: '"Icon button"',
          description:
            "The accessible name, and the native title when no styled tooltip is set. This is the prop that makes an icon button usable — never rely on the fallback.",
        },
        {
          name: "variant",
          type: "ButtonVariant",
          default: '"icon"',
          description:
            "The Button vocabulary. The icon default is the soft tinted square; solid/soft/outline/glass behave as everywhere else.",
        },
        {
          name: "color",
          type: "TrueColor",
          default: '"blue"',
          description: "Tone — fill, text, ring and spinner all follow it.",
        },
        {
          name: "size",
          type: "ButtonSize",
          default: '"md"',
          description:
            "The shared control scale: the box and glyph step together, so an md icon button aligns with an md input.",
        },
        {
          name: "rounded",
          type: '"md" | "lg" | "xl" | "full"',
          default: '"full"',
          description:
            "Corner radius. The circle is the identity; pick a Button-matching corner for squares.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          description:
            "Spinner replaces the glyph, clicks are blocked, and the button is disabled without dimming — so the spinner, the one signal that work is happening, stays visible.",
        },
        {
          name: "accent",
          type: "boolean",
          default: "false",
          description:
            "The parent owns the fill (a toolbar button on a coloured bar): the glyph inherits, a tone ring and hover wash keep it focusable-looking. accentColor picks the ring tone.",
        },
        {
          name: "iconColor",
          type: "string",
          description:
            "Raw CSS colour for the glyph only. Omit it and the icon inherits the button's text colour, so hover states repaint the glyph too.",
        },
        {
          name: "tooltip / tooltipPosition",
          type: "string / TooltipPosition",
          default: '"top"',
          description: "Styled tooltip; setting it drops the native title.",
        },
        {
          name: "glass / vibrancy / glassOpacity / specularMode",
          type: "boolean / GlassVibrancy / GlassOpacity / SpecularMode",
          default:
            "false / medium / clear — frosted for a Button, clear here / none",
          description:
            'Translucent chrome; `variant="glass"` auto-enables the same path.',
        },
        {
          name: "customSizeClass",
          type: "string",
          description:
            "Escape hatch replacing the computed box size class. Prefer `size`.",
        },
      ]}
    />

    <p className="text-xs opacity-70">
      Remaining native button attributes (onClick, onFocus, data-*, form
      overrides…) pass straight through to the <code>button</code> — except{" "}
      <code>type</code>, which defaults to <code>button</code> and can still be
      overridden when you genuinely want a submit button.
    </p>
  </div>
);

export default IconButtonPage;
