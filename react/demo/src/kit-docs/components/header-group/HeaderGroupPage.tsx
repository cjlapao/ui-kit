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
import { HeaderGroupPlayground } from "./HeaderGroupPlayground";
import ToolbarHero from "./examples/ToolbarHero";
import toolbarHeroCode from "./examples/ToolbarHero.tsx?raw";
import GapLadder from "./examples/GapLadder";
import gapLadderCode from "./examples/GapLadder.tsx?raw";
import LoneGroup from "./examples/LoneGroup";
import loneGroupCode from "./examples/LoneGroup.tsx?raw";
import TonedSeparators from "./examples/TonedSeparators";
import tonedSeparatorsCode from "./examples/TonedSeparators.tsx?raw";

export const HeaderGroupPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Header Group"
      description="Clusters related header controls. Adjacent groups get a separator automatically — a lone group never draws one."
    />
    <HeaderGroupPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Toolbar"
        description="Four clusters — navigation, view, alerts and actions — in a single header bar, separated between adjacent groups."
        code={toolbarHeroCode}
        filename="ToolbarHero.tsx"
      >
        <ToolbarHero />
      </ExampleCard>
      <ExampleCard
        title="Gap ladder"
        description="Every gap size on the same three groups. The separator shares the gap's custom property, so it stays centred at each step."
        code={gapLadderCode}
        filename="GapLadder.tsx"
      >
        <GapLadder />
      </ExampleCard>
      <ExampleCard
        title="Lone group"
        description="A single group draws no leading rule; add a second and the rule appears between them."
        code={loneGroupCode}
        filename="LoneGroup.tsx"
      >
        <LoneGroup />
      </ExampleCard>
      <ExampleCard
        title="Toned separators"
        description="Untoned the rule follows the surface — light, dark and glass. A tone sets it to that colour."
        code={tonedSeparatorsCode}
        filename="TonedSeparators.tsx"
      >
        <TonedSeparators />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          Every cluster is a <C>role="group"</C> with its <C>label</C> as the
          accessible name, so screen readers can announce what a set of controls
          is for — name it, because an unnamed group is usually skipped. The
          visual separator is a CSS <C>::before</C> with empty content: purely
          decoration, invisible to the accessibility tree. The grouping
          semantics come from the role, never from the rule — turning{" "}
          <C>divider</C> off changes nothing for assistive technology.
        </p>
        <A11yCode filename="Naming.tsx" code={NAMING_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          The container itself is not focusable and adds no key bindings — that
          would only steal tab stops from what matters. The controls inside
          (buttons, toggles, links) keep their own native behaviour and order.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The component emits no strings of its own; the only text is the
          caller&rsquo;s <C>label</C>. Layout is flex with flow-relative spacing
          and DOM adjacency, so groups, gaps and the between-rules mirror
          correctly under <C>dir="rtl"</C> with no configuration.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "children",
          type: "ReactNode",
          description: "The related controls in this cluster.",
        },
        {
          name: "gap",
          type: "ControlSize",
          default: "sm",
          description: (
            <>
              Space before this group when another precedes it; the
              separator&rsquo;s offset reads the same value.
            </>
          ),
        },
        {
          name: "itemGap",
          type: "ControlSize",
          default: "xs",
          description: "Space between the items inside the group.",
        },
        {
          name: "divider",
          type: "boolean",
          default: "true",
          description:
            "Draw the rule when a group is present (a lone group never draws one).",
        },
        {
          name: "separatorSize",
          type: "ControlSize | number",
          default: "xs",
          description: (
            <>
              Separator thickness — the shared scale (1/2/3/4/6 px) or raw
              pixels, like <C>AppDivider</C>&rsquo;s <C>size</C>. The rule is
              drawn transform-free so it always pixel-snaps — one crisp
              thickness everywhere.
            </>
          ),
        },
        {
          name: "tone",
          type: "TrueColor",
          description: (
            <>
              Separator colour. Omit it and the rule is a fraction of the
              surface&rsquo;s own text colour, which adapts on glass.
            </>
          ),
        },
        {
          name: "label",
          type: "string",
          description: (
            <>
              Accessible name for the group — without it, the group is anonymous
              and often skipped.
            </>
          ),
        },
        {
          name: "className/style",
          type: "string / CSSProperties",
          description: (
            <>
              Merged onto the group wrapper; the component&rsquo;s own custom
              properties (<C>--header-group-gap</C>,{" "}
              <C>--header-group-divider</C>) can be overridden through{" "}
              <C>style</C>.
            </>
          ),
        },
        {
          name: "…div props",
          type: "HTMLAttributes",
          description: "The rest land on the wrapper div.",
        },
      ]}
    />
  </div>
);

const NAMING_CODE = `// Name the clusters — the separator is decoration,
// the label is the semantics.
<HeaderGroup label="Navigation">
  <IconButton icon="Back" srLabel="Back" />
  <IconButton icon="ArrowRight" srLabel="Forward" />
</HeaderGroup>`;

export default HeaderGroupPage;
