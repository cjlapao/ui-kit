import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { InputGroupPlayground } from "./InputGroupPlayground";
import UrlBuilder from "./examples/UrlBuilder";
import urlBuilderCode from "./examples/UrlBuilder.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import Compound from "./examples/Compound";
import compoundCode from "./examples/Compound.tsx?raw";

export const InputGroupPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Input Group"
      description="A field with addons welded to its edges. The group owns the box — its children render unstyled — so it takes the same surface, size, corner and tone scales as the Input inside it, glass and gradient glow included."
    />
    <InputGroupPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="URL builder"
        description="The canonical case: a protocol prefix and a domain suffix welded to a field, so the user only types the middle."
        code={urlBuilderCode}
        filename="UrlBuilder.tsx"
      >
        <UrlBuilder />
      </ExampleCard>
      <ExampleCard
        title="Every variant"
        description="All six surfaces — the group owns the box, so the addon fill and focus edge follow the same tone tokens as a standalone Input."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared control scale — the addon's padding and type track the field at every step."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Compound"
        description="More than a field inside: an unstyled Select as a unit picker, and a solid Button as a submit."
        code={compoundCode}
        filename="Compound.tsx"
      >
        <Compound />
      </ExampleCard>
    </section>
    <PropsTable
      props={[
        {
          name: "children",
          type: "ReactNode",
          description:
            "Fields to weld together. Children that are known fields get cloned with `tone`, `size`, `unstyled` and the group&rsquo;s `disabled` (a child&rsquo;s own `disabled` still wins); anything else — a plain `Button`, a `span` — is left exactly as written.",
        },
        {
          name: "leadingAddon / trailingAddon",
          type: "ReactNode",
          description:
            "The `https://` and the `.com`. Filled, bordered and type-scaled from the tone and size — the same tables the field between them reads.",
        },
        {
          name: "variant",
          type: "InputGroupVariant",
          default: '"elevated"',
          description:
            "The shared surfaces. The group is the surface — a `ghost` group reads its tone; a `gradient` one carries a glow.",
        },
        {
          name: "size",
          type: "InputGroupSize",
          default: '"md"',
          description:
            "The shared control scale, pushed into the children too, so half a group can never be a different size than its other half.",
        },
        {
          name: "tone",
          type: "TrueColor",
          default: '"blue"',
          description:
            "The resting edge, the focus outline, the addon fill and the glow&rsquo;s lobes. `color` works as a deprecated alias.",
        },
        {
          name: "corner",
          type: "SurfaceCorner",
          default: '"auto"',
          description:
            "Group radius from the shared control corner; an explicit token replaces it on every surface.",
        },
        {
          name: "glowIntensity / gradientFrom / gradientTo",
          type: "GlowIntensity / string",
          default: '"subtle" / the tone&rsquo;s 600 → 400 shades',
          description:
            "The `gradient` variant&rsquo;s focus halo, identical to `Input`, `Textarea` and `SearchBar`. Lit while anything inside the group has focus — moving focus between two children never blinks it.",
        },
        {
          name: "validationStatus",
          type: '"none" | "error" | "success"',
          default: '"none"',
          description:
            "Replaces the tone edge rather than stacking on it — `underline` gets a bottom-rule version, since a rectangle around an underline would contradict the variant.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description:
            "Reaches the fields inside, not just the group&rsquo;s opacity — a dimmed input you could still type into is worse than a grey one.",
        },
        {
          name: "className",
          type: "string",
          description: "Lands on the group box.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The box is a presentational <C>&lt;div&gt;</C> — deliberately. The
          role of a field belongs to the field inside, so <C>&lt;label&gt;</C>s,
          <C>aria-label</C>s and validation states keep working on the child
          exactly where they would outside the group. What needs care are the
          addons: <C>https://</C> before a field called &ldquo;Website&rdquo;
          carries information a screen reader never hears if the field is named
          only at the child. Say it in the name —{" "}
          <C>aria-label=&quot;Website URL (without https://)&quot;</C> or a
          visible <C>&lt;label&gt;</C> that includes it — or mark a purely
          decorative addon <C>aria-hidden</C> so it cannot read as stray prose.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          Tab goes to the children; the group itself is not focusable, which is
          correct for a box of controls. What the group adds is an edge that
          says &ldquo;you are inside the same control&rdquo;: a tone outline
          drawn — not a ring, an <C>outline</C>, because rings are painted under
          the opaque addons and were only ever visible between them. Focus
          moving between two children keeps the edge lit and never lets the
          gradient halo blink.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          Nothing to translate — deliberately. The group contributes no strings:
          addons, children and their labels are the caller&rsquo;s. What is not
          locale-neutral is content order — an <C>https://</C> prefix reads
          left-to-right, but a currency addon may belong on the right in the
          reader&rsquo;s language. The group has no opinion: put the addon on
          the side the language wants; <C>leadingAddon</C> and{" "}
          <C>trailingAddon</C> are the only opinions it has.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default InputGroupPage;
