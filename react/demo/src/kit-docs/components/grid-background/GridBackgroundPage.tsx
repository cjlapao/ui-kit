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
        description="Same spacing, colour and opacity, both patterns. Each tile draws a complete dot and is offset by half a cell, so the dots land where the lines cross."
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
        description={'The lattice AgentMap draws by default (AgentMap.tsx:325): dots as atmosphere under floating panels, tinted by `--cj-agent-map-grid-color`. Here the panels sit beside the lattice rather than inside it, which is what keeps them clickable — a fill sets `pointer-events: none` on its own root — and the layer is `aria-hidden`, so it is not in the accessibility tree either.'}
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
          instead. One consequence of the fill mode is easy to miss: the{" "}
          <em>root</em> also gets <C>pointerEvents: "none"</C> (<C>:49</C>), and
          descendants inherit it — children of an absolutely positioned
          lattice are not clickable until they set <C>pointer-events: auto</C>{" "}
          themselves. Render content beside the lattice, as the examples do, or
          use <C>position="relative"</C>.
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
            {
              keys: ["Any"],
              action: (
                <>
                  Nothing. The file compares no key and holds no handler at all:
                  no <C>onKeyDown</C> / <C>onKeyUp</C> / <C>onKeyPress</C>, no{" "}
                  <C>tabIndex</C>, no focus, pointer or timer logic, and no
                  effect that could install one. A key event reaches the wrapper
                  only through a handler the consumer spreads in{" "}
                  <C>…props</C> (<C>:49</C>).
                </>
              ),
            },
          ]}
        />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The component speaks no strings, so there is nothing to translate and
          nothing in the kit catalog to override — it imports no i18n module and
          reads no <C>kit.*</C> key. Text it happens to sit behind is host-owned
          and follows the host&apos;s own locale.
        </p>
        <p>
          Everything it writes is physical, so nothing mirrors: the horizontal
          rule is <C>linear-gradient(90deg, …)</C>, the dots are{" "}
          <C>radial-gradient(circle at center, …)</C> tiled by{" "}
          <C>backgroundSize</C>, and <C>fade=&quot;vertical&quot;</C> is{" "}
          <C>linear-gradient(to bottom, …)</C> (<C>:43,47</C>) — degrees and{" "}
          <C>to bottom</C> are not logical directions, so RTL, LTR and every fade
          render identically. A mirrored lattice is not a thing this component
          does; it is a pattern you would have to supply yourself.
        </p>
      </A11yTopic>

      <A11yTopic title="Motion">
        <p>
          The lattice is static by default. With <C>shimmer</C> enabled on dots,
          a wave passes across the pattern. The animation is disabled and the
          usual static opacity restored when reduced motion is preferred.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable props={GRID_BACKGROUND_PROPS} />
  </div>
);

/** Every row verified against `GridBackground.tsx`. */
export const GRID_BACKGROUND_PROPS: PropDoc[] = [
  {
    name: "pattern",
    type: '"grid" | "dots"',
    default: '"grid"',
    description:
      "The lattice to draw: crossing rules, or a dot on every crossing. Each tile draws a complete centered dot and is offset by half the spacing, keeping the dots aligned with the grid crossings.",
  },
  {
    name: "size",
    type: "number",
    default: "32",
    description:
      "Lattice pitch in CSS pixels, shared by both patterns; it becomes `backgroundSize` (:48). Non-finite or non-positive values fall back to 32 (:38). The rules themselves are always 1px — a wider lattice spreads, it does not thicken (:47).",
  },
  {
    name: "lineColor",
    type: "string",
    default: '"currentColor"',
    description:
      "CSS colour of the lines, or of the dots. Interpolated straight into the gradient (:47), so an invalid value paints nothing at all rather than warning; `currentColor` inherits the text colour around the box, not the page's. A theme variable such as var(--color-cyan-500) works, which is what AgentMap passes.",
  },
  {
    name: "dotSize",
    type: "number",
    default: "1",
    description:
      "Dot radius in CSS pixels — absolute, so a loose lattice reads sparse rather than blotchy. Inert while `pattern` is grid: the grid branch never reads it (:47). Clamped to 0.25px, below which a dot stops reading as a point, and to half the spacing, above which it would collide with its neighbour (:28-29,39).",
  },
  {
    name: "shimmer",
    type: "boolean",
    default: "false",
    description: "Sends a subtle wave across the dots. Only applies to the dots pattern and is disabled when reduced motion is preferred.",
  },
  {
    name: "opacity",
    type: "number",
    default: "0.12",
    description:
      "Layer opacity, clamped to 0–1; a non-finite value falls back to 0.12 (:40). It lands on the inner layer, so it dims the lattice alone (:48).",
  },
  {
    name: "fade",
    type: '"none" | "radial" | "vertical"',
    default: '"none"',
    description:
      "Mask the lattice towards the edges: radial from the centre out, or vertical — top and bottom dissolving in. The mask is written to both `maskImage` and `WebkitMaskImage` on the inner layer only (:43,48); `none` emits no mask property at all.",
  },
  {
    name: "fadeStart",
    type: "number",
    default: "15",
    description:
      "Percentage of the box that stays solid before the fade begins. Clamped to 0–85 (:41), which keeps at least a 7.5% fade on each side of a vertical fade (`edge = (100 − start) / 2`, :42-43). It does not mean the same thing in both fades: radial keeps a solid ellipse out to `start`% of its radius, while vertical ignores `start` itself and uses only the two `edge` stops (:43). Inert while `fade` is none, because that is the only branch that builds a mask (:43).",
  },
  {
    name: "position",
    type: '"absolute" | "relative"',
    default: '"absolute"',
    description:
      "Fill the nearest positioned parent, or stay in flow and wrap children. Absolute also puts `inset: 0` **and `pointer-events: none` on the root** (:49), which descendants inherit — children of a fill are not clickable unless they set `pointer-events: auto`. Relative leaves the root hit-testable but gives it no height, so it needs a size or content of its own. The lattice itself is `position: absolute; inset: 0` either way (:48): it always fills whichever box `position` produced.",
  },
  {
    name: "children",
    type: "ReactNode",
    default: "undefined",
    description:
      "Rendered after the aria-hidden lattice, in the same wrapper (:50). Coming later in the JSX is not enough to sit above it: the lattice is a positioned element, so static content paints **under** it — give the content `position` (or `z-index`) yourself, which is why every example here is `relative`. With the default fill mode, also see the pointer-events note on `position`.",
  },
  {
    name: "…HTMLAttributes<HTMLDivElement>",
    type: "div attributes",
    description:
      "Everything else — className, id, data-*, onKeyDown — lands on the outer wrapper, never on the aria-hidden layer (:49-50). `style` is merged last, so your own `position`, `inset` or `pointerEvents` override the component's (:49).",
  },
  {
    name: "AgentMap's grid prop",
    type: "false | Pick<GridBackgroundProps, \"pattern\" | \"size\" | \"lineColor\" | \"dotSize\" | \"opacity\" | \"fade\" | \"fadeStart\">",
    description:
      "Where the kit uses this itself: AgentMap draws the lattice on its own (AgentMap.tsx:325) — dots, 32px pitch, 1.5px dots, 0.35 opacity, radial fade, tinted by --cj-agent-map-grid-color. `false` removes it; the object overrides those seven, and `position` is deliberately not on offer.",
  },
];

export default GridBackgroundPage;
