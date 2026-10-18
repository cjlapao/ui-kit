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
import { AppDividerPlayground } from "./AppDividerPlayground";
import HeaderSections from "./examples/HeaderSections";
import headerSectionsCode from "./examples/HeaderSections.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Thicknesses from "./examples/Thicknesses";
import thicknessesCode from "./examples/Thicknesses.tsx?raw";
import LabelPositions from "./examples/LabelPositions";
import labelPositionsCode from "./examples/LabelPositions.tsx?raw";

export const AppDividerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="App Divider"
      description="A rule between sections — vertical or horizontal, optionally labelled. Takes the surrounding surface's divider colour unless given a tone, so it adapts on glass."
    />
    <AppDividerPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Header sections"
        description="The canonical case: vertical rules between toolbar items, and a labelled horizontal rule between two sign-in options. A labelled divider is announced as a separator."
        code={headerSectionsCode}
        filename="HeaderSections.tsx"
      >
        <HeaderSections />
      </ExampleCard>
      <ExampleCard
        title="Variants"
        description="Solid, dashed, dotted, and gradient — the gradient fades out at both ends."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Thicknesses"
        description="The shared control scale as line thickness, from a 1px hairline to 6px."
        code={thicknessesCode}
        filename="Thicknesses.tsx"
      >
        <Thicknesses />
      </ExampleCard>
      <ExampleCard
        title="Label positions"
        description="The label can sit at the start, the center, or the end of the rule — start and end keep a short stub on the far side."
        code={labelPositionsCode}
        filename="LabelPositions.tsx"
      >
        <LabelPositions />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The rule carries its semantic weight through the <C>label</C>. An
          unlabelled divider is decoration — <C>aria-hidden</C>, invisible to
          the accessibility tree — while a labelled one publishes{" "}
          <C>role="separator"</C> with its <C>aria-orientation</C>, so it is
          announced where it sits. <C>decorative</C> overrides the choice either
          way. Nothing else is announced: the segments either side of a labelled
          rule are ordinary content and keep their own place in the reading
          order.
        </p>
        <A11yCode filename="Semantics.tsx" code={SEMANTICS_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          None, by design — a divider is not interactive and must never land in
          the tab order. There are no key bindings to learn; keyboard and
          screen-reader users move through the content around it.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The component speaks no strings of its own — the only text is the
          caller&rsquo;s <C>label</C>, so translation belongs to the
          application. Direction comes for free: the layout uses flexbox
          start/end and logical-order margins, so the whole rule (stub sides
          included) mirrors automatically under <C>dir="rtl"</C>, and{" "}
          <C>aria-orientation</C> describes the rule&rsquo;s own axis, not a
          screen side.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "orientation",
          type: '"vertical" | "horizontal"',
          default: "vertical",
          description: (
            <>
              Which way the rule runs — <C>aria-orientation</C> when it is
              announced.
            </>
          ),
        },
        {
          name: "variant",
          type: '"solid" | "dashed" | "dotted" | "gradient"',
          default: "solid",
          description:
            "Line style; the gradient fades out at both ends, built from the tone's colour variable.",
        },
        {
          name: "tone",
          type: "TrueColor",
          description: (
            <>
              Accent colour. Omit it and the rule takes the surrounding
              surface&rsquo;s <C>divider</C> token, which adapts on glass.
            </>
          ),
        },
        {
          name: "size",
          type: "ControlSize",
          default: "xs",
          description:
            "Thickness on the shared scale — 1/2/3/4/6 px (xs–xl), applied as real pixels.",
        },
        {
          name: "spacing",
          type: '"none" | ControlSize',
          default: "sm",
          description: "Margin on the rule's cross axis.",
        },
        {
          name: "length",
          type: "number | string",
          description:
            "Along the rule's own axis. Defaults to 1.5rem vertical, full width horizontal.",
        },
        {
          name: "label",
          type: "ReactNode",
          description: (
            <>
              Text set into the rule — the switch between decoration and
              announced <C>separator</C>.
            </>
          ),
        },
        {
          name: "labelPosition",
          type: '"start" | "center" | "end"',
          default: "center",
          description: "Start and end keep a short stub on the far side.",
        },
        {
          name: "decorative",
          type: "boolean",
          description:
            "Forces aria-hidden on (or off). Default: hidden unless a label is set.",
        },
        {
          name: "height",
          type: "number | string",
          description: (
            <>
              Deprecated — alias of <C>length</C>.
            </>
          ),
        },
        {
          name: "width",
          type: "number",
          description: (
            <>
              Deprecated — alias of <C>size</C> (as pixels).
            </>
          ),
        },
        {
          name: "margin",
          type: "number | string",
          description: (
            <>
              Deprecated — alias of <C>spacing</C>.
            </>
          ),
        },
        {
          name: "…div props",
          type: "HTMLAttributes",
          description: "className and the rest land on the wrapper div.",
        },
      ]}
    />
  </div>
);

const SEMANTICS_CODE = `// Decoration — two toolbar items with a rule between them.
<AppDivider />

// Semantics — the rule names the break it makes.
<AppDivider label="OR" />`;

export default AppDividerPage;
