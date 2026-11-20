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
import { GridBackgroundPlayground } from "./GridBackgroundPlayground";
import GridVsDots from "./examples/GridVsDots";
import gridVsDotsCode from "./examples/GridVsDots.tsx?raw";
import Fades from "./examples/Fades";
import fadesCode from "./examples/Fades.tsx?raw";
import Scale from "./examples/Scale";
import scaleCode from "./examples/Scale.tsx?raw";
import BehindSurface from "./examples/BehindSurface";
import behindSurfaceCode from "./examples/BehindSurface.tsx?raw";

const NAMING_CODE = `// The layer is decoration: aria-hidden and pointer-events: none are set
// by the component — never label it, and never put a control inside it.
<div className="relative">            {/* positioned parent to fill */}
  <GridBackground pattern="dots" size={20} fade="radial" />
  <Panel variant="elevated">Real content, above the lattice.</Panel>
</div>`;

export const GridBackgroundPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Grid Background"
      description={'The decorative lattice behind the Agent Map\'s hubs, on its own: a square grid of lines, or — with pattern="dots" — a dot on each of the squares\' cardinal points. One spacing scale drives both, so switching pattern in place keeps every crossing exactly where it was. Colour, opacity and an edge fade are shared; it fills the nearest positioned parent, or wraps its children instead.'}
    />
    <GridBackgroundPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Grid vs dots"
        description="Same spacing, colour and opacity, both patterns. The dots are not centred in the squares — each tile paints the quarter of a dot at its origin and the three abutting tiles complete it, so a dot lands on the point where the lines used to cross."
        code={gridVsDotsCode}
        filename="GridVsDots.tsx"
      >
        <GridVsDots />
      </ExampleCard>
      <ExampleCard
        title="Edge fades"
        description="`fade` dissolves the lattice before it reaches the edges: `radial` from the centre out, `vertical` from top and bottom in, `none` for a hard fill. `fadeStart` is the percentage that stays solid before the fade begins."
        code={fadesCode}
        filename="Fades.tsx"
      >
        <Fades />
      </ExampleCard>
      <ExampleCard
        title="Scale"
        description="`size` is the lattice pitch; `dotSize` is an absolute radius in pixels. Widening the grid spreads the dots but never grows them — the dots stay 1.5px, so a loose lattice reads as sparse rather than blotchy."
        code={scaleCode}
        filename="Scale.tsx"
      >
        <Scale />
      </ExampleCard>
      <ExampleCard
        title="Behind a surface"
        description={'What `AgentMap` renders with `grid={{ pattern: "dots" }}` — dots as atmosphere under floating panels. The layer is `pointer-events: none` and `aria-hidden`, so panels above it keep every click and stay the only thing a screen reader finds.'}
        code={behindSurfaceCode}
        filename="BehindSurface.tsx"
      >
        <BehindSurface />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The lattice paints one{" "}
          <C>
            &lt;div aria-hidden="true"&gt;
          </C>{" "}
          with <C>pointer-events: none</C>: no role, no name, nothing
          focusable. It is decoration, and the component sets both itself — a
          host that labelled it would be announcing a gradient to someone who
          cannot see it.
        </p>
        <p>
          Because the layer sits under the content, whatever you render as{" "}
          <C>children</C> (or as a sibling above it) is the only thing in the
          accessibility tree. Absolutely positioned fills need a positioned
          parent — the component defaults to <C>position="absolute"</C> with{" "}
          <C>inset: 0</C>; <C>position="relative"</C> makes it a normal wrapper
          instead.
        </p>
        <A11yCode filename="Naming.tsx" code={NAMING_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          The layer is not interactive and never receives focus, so there is
          nothing to bind: <C>children</C> are ordinary document content and
          follow whatever they are.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: (
                <>
                  Skips the layer entirely — no focusable element inside it.
                  Children move through the tab order on their own rules.
                </>
              ),
            },
          ]}
        />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The component speaks no strings, so there is nothing to translate and
          nothing in the kit catalog to override. Text it happens to sit behind
          is host-owned and follows the host&apos;s own locale. All geometry is
          physical CSS pixels, so the lattice is direction-neutral: RTL, LTR and{" "}
          <C>fade="vertical"</C> render identically.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "pattern",
          type: '"grid" | "dots"',
          default: '"grid"',
          description:
            "The lattice to draw. Dots sit on the crossings of the same grid, so switching patterns in place keeps the lattice aligned.",
        },
        {
          name: "size",
          type: "number",
          default: "32",
          description:
            "Lattice pitch in CSS pixels, shared by both patterns. Non-finite or non-positive values fall back to 32.",
        },
        {
          name: "lineColor",
          type: "string",
          default: '"currentColor"',
          description:
            "CSS colour of the lines — or of the dots. Any value works, including a theme variable such as var(--color-cyan-500).",
        },
        {
          name: "dotSize",
          type: "number",
          default: "1",
          description:
            "Dot radius in CSS pixels; inert for the grid pattern. Clamped to 0.25px–half the spacing, so a dot always reads as a point.",
        },
        {
          name: "opacity",
          type: "number",
          default: "0.12",
          description: "Layer opacity, clamped to 0–1.",
        },
        {
          name: "fade",
          type: '"none" | "radial" | "vertical"',
          default: '"none"',
          description:
            "Mask the lattice towards the edges — from the centre out, or from top and bottom in.",
        },
        {
          name: "fadeStart",
          type: "number",
          default: "15",
          description:
            "Percentage of the background that stays solid before the fade begins. Clamped to 0–85.",
        },
        {
          name: "position",
          type: '"absolute" | "relative"',
          default: '"absolute"',
          description:
            "Fill the nearest positioned parent (inset 0, pointer-events none), or stay in flow and wrap children.",
        },
        {
          name: "children",
          type: "ReactNode",
          default: "undefined",
          description:
            "Optional content to render above the lattice, in the same wrapper.",
        },
        {
          name: "…HTMLAttributes<HTMLDivElement>",
          type: "div attributes",
          description:
            "Everything else — className, style, data-* — lands on the outer wrapper, not on the aria-hidden layer.",
        },
      ]}
    />
  </div>
);

export default GridBackgroundPage;
