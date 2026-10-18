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
import { ToolbarPlayground } from "./ToolbarPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Surface from "./examples/Surface";
import surfaceCode from "./examples/Surface.tsx?raw";
import Nav from "./examples/Nav";
import navCode from "./examples/Nav.tsx?raw";

export const ToolbarPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
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
          The root is always <C>role="toolbar"</C>, which groups the row for
          assistive tech — but a name is not part of the deal: an unnamed
          toolbar is announced, just not distinguishable. On a page with a
          Formatting bar and a Filters bar, <C>aria-label</C> is the only thing
          telling them apart, so name every instance. Empty regions stay in the
          DOM but render nothing, adding nothing to the accessibility tree.
        </p>
        <A11yCode filename="Naming.tsx" code={NAMING_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          Every control in the regions stays individually tabbable, in DOM
          order: start, center, end, then the children group. The kit does not
          implement the ARIA toolbar pattern&rsquo;s roving tabindex (one tab
          stop, arrow keys between buttons) — an honest trade: arrow keys do
          nothing special, but no control can be skipped or trapped, and nesting
          toolbars stays predictable.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The bar emits no strings — every word lives in the content passed into
          the regions. The regions are flex flow, so under <C>dir="rtl"</C> the{" "}
          <C>start</C> group moves to the physical right and <C>end</C> to the
          left, which is exactly what those names mean logically; long labels
          wrap within a region and the bar itself wraps rows instead of
          overflowing.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "start / center / end",
          type: "ReactNode",
          description: (
            <>
              The three regions. They hold their DOM place when empty — an{" "}
              <C>end</C>-only bar still parks right. The center group is centred
              by <C>justify-between</C>, which only measures exact when the
              flanking groups match in width; keep it narrow.
            </>
          ),
        },
        {
          name: "children",
          type: "ReactNode",
          description: "Extra group appended after the regions.",
        },
        {
          name: "variant",
          type: "PanelVariant",
          default: "elevated",
          description: (
            <>
              A toolbar is a sideways Panel — the whole{" "}
              <code>SURFACE_VARIANTS</code> ladder, painted from the same theme
              helpers, with the same <code>elevated</code> default. Bars that
              should recede into chrome pass <code>outlined</code> or{" "}
              <code>subtle</code>.
            </>
          ),
        },
        {
          name: "tone",
          type: "TrueColor",
          default: "blue",
          description:
            "Accent for the tinted and translucent variants — the kit-wide surface default.",
        },
        {
          name: "padding",
          type: "SurfacePadding",
          default: "xs",
          description: (
            <>
              Shared container scale; <code>none</code> bleeds the bar flush
              into its content.
            </>
          ),
        },
        {
          name: "corner",
          type: "SurfaceCorner",
          default: "rounded-md",
          description: "Shared container corner.",
        },
        {
          name: "vibrancy / glassOpacity",
          type: "GlassVibrancy / GlassOpacity",
          default: "medium / frosted",
          description:
            "Glass knobs for liquid-glass; the surface is published through SurfaceProvider, so an Input on a glass bar reads its contrast like one on a glass card.",
        },
        {
          name: "…html props",
          type: "HTMLAttributes",
          description: (
            <>
              aria-label, id, className — everything lands on the root, which is
              always <C>role="toolbar"</C>. Give each bar its own name.
            </>
          ),
        },
      ]}
    />
  </div>
);

const NAMING_CODE = `// A page with two bars — without names, they are
// announced identically.
<Toolbar aria-label="Formatting" start={...} />
<Toolbar aria-label="Filters" start={...} />`;

export default ToolbarPage;
