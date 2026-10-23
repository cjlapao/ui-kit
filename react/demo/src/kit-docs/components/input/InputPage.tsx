import React from "react";
import {
  A11ySection,
  A11yTopic,
  Kbd,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { InputPlayground } from "./InputPlayground";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Labeled from "./examples/Labeled";
import labeledCode from "./examples/Labeled.tsx?raw";
import Validation from "./examples/Validation";
import validationCode from "./examples/Validation.tsx?raw";
import Icons from "./examples/Icons";
import iconsCode from "./examples/Icons.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import Password from "./examples/Password";
import passwordCode from "./examples/Password.tsx?raw";

export const InputPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Input"
      description="The text field. Surface, size and tone all come from the shared scales, so it lines up with the SearchBar, Select and Button beside it. Pair with FormField for labels, hints and errors."
    />
    <InputPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Variants"
        description="Six surfaces for the same control — from a flat field in a dense form to a glowing gradient on a landing page. Glass is shown twice: it keeps its white wash until a tone is asked for."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Labeled"
        description="FormField wires the label to the input, and carries the description and hint copy."
        code={labeledCode}
        filename="Labeled.tsx"
      >
        <Labeled />
      </ExampleCard>
      <ExampleCard
        title="Validation"
        description="The validation status paints the field; FormField explains why, in the right place."
        code={validationCode}
        filename="Validation.tsx"
      >
        <Validation />
      </ExampleCard>
      <ExampleCard
        title="Icons"
        description="Registry icons by name, leading or trailing — search fields and password inputs in particular."
        code={iconsCode}
        filename="Icons.tsx"
      >
        <Icons />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared xs–xl scale — height, text and icon size step together."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="All 21 true colours — focus one to see its border and ring."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
      <ExampleCard
        title="Password"
        description="PasswordInput is the same field with a built-in reveal toggle."
        code={passwordCode}
        filename="Password.tsx"
      >
        <Password />
      </ExampleCard>
    </section>

    <PropsTable
      props={[
        {
          name: "size",
          type: "ControlSize",
          default: '"md"',
          description:
            "The shared xs&rarr;xl ladder — height, text and icon scale step together, so the field lines up with the Button or Select beside it.",
        },
        {
          name: "tone / color",
          type: "TrueColor",
          default: '"blue"',
          description:
            "Focus border, ring and the leading icon&rsquo;s focus highlight. `color` is a `SearchBar`-compat alias; `tone` wins when both are passed.",
        },
        {
          name: "variant",
          type: "InputVariant",
          default: '"flat"',
          description:
            "Surface style — flat, filled, outlined, elevated, underline, glass and the gradient glow, shared byte-for-byte with Textarea and SearchBar via the theme.",
        },
        {
          name: "validationStatus",
          type: '"none" | "error" | "success"',
          default: '"none"',
          description:
            "Paints the shared status surface on the box and sets aria-invalid on error — a caller&rsquo;s own aria-invalid cannot override the error state. Explain *why* with FormField&rsquo;s hint, not the colour.",
        },
        {
          name: "glowIntensity / gradientFrom / gradientTo",
          type: "GlowIntensity / string",
          default: '"subtle" / tone 600 / tone 400',
          description:
            "The gradient glow: a two-lobe shadow — start colour glowing from the left, end colour from the right, defaulting to the tone&rsquo;s 600/400 shades. Intensity sets the shadow&rsquo;s geometry and opacity; the reach is sized into the component&rsquo;s own box, so clipping ancestors cannot shear it off.",
        },
        {
          name: "leadingIcon / trailingIcon",
          type: "IconName | ReactElement",
          description:
            "Flex siblings of the input — no padding hacks. Resting colour follows the variant; the tone&rsquo;s highlight follows on focus.",
        },
        {
          name: "onTrailingIconClick / trailingIconLabel",
          type: "(event) => void / string",
          description:
            "Makes the trailing icon a real named button that follows `disabled`. Without a label it takes the translated kit default (`kit.input.trailingAction`).",
        },
        {
          name: "className / inputClassName",
          type: "string",
          description:
            "`className` targets the box (the wrapper carrying border, fill and radius — `wrapperClassName` is the deprecated alias); `inputClassName` targets the inner `<input>`.",
        },
        {
          name: "unstyled / fullHeight",
          type: "boolean",
          default: "false",
          description:
            "`unstyled` drops the surface wholesale — the seam InputGroup stitches through; `fullHeight` lets a constrained parent stretch the field.",
        },
      ]}
    />
    <p className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
      Everything else spreads onto the native <code>&lt;input&gt;</code> —
      `value` / `defaultValue`, `type`, `placeholder`, `readOnly`, `maxLength`,
      the handlers — so the browser&rsquo;s own semantics carry through
      untouched. `forwardRef` hands out the real input element, which is what
      FormField uses for label wiring and focus management.
    </p>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The field <em>is</em> a native <code>&lt;input&gt;</code> — the
          wrapper is presentational — so role, value and typing announcements
          come from the browser untouched. The label lives with
          <strong>FormField</strong> (<code>labelFor</code> / automatic
          id-matching); a bare Input has no name of its own, which is exactly
          how native inputs fail their audits — pair them. Error status sets{" "}
          <code>aria-invalid</code> and FormField carries the explanation as
          text, never colour alone; the status icon tints but never speaks. The
          action button always has a name — yours or the translated kit default.
        </p>
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          Native by construction: <Kbd>Tab</Kbd> reaches the field, editing is
          the browser&rsquo;s, and a clickable trailing icon is a real{" "}
          <code>&lt;button&gt;</code> in the tab order (before the input, as
          written — order your DOM accordingly) with a visible focus ring. The
          focus ring is deliberately <code>ring-inset</code>: rings outside the
          border box get clipped by scrolling ancestors, which is the classic
          &ldquo;where did the focus go&rdquo; bug in form-heavy panels.
          Disabled fields drop out of the order natively and read at reduced
          opacity, not a repainted slab.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Content is 100% caller data — the field holds whatever the user types,
          in any script, with native IME composition. The only kit string is the
          unnamed action button&rsquo;s name at{" "}
          <code>kit.input.trailingAction</code> (en, es, fr, de, pt). Layout is
          RTL-safe: icons are flex siblings, so a `dir=&quot;rtl&quot;` ancestor
          mirrors the field and flips leading/trailing for free — no absolute
          offsets to invert.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default InputPage;
