import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { SelectPlayground } from "./SelectPlayground";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const SelectPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Select"
      description="The native dropdown, with the platform caret replaced by the kit&rsquo;s. Surface, size, corner and tone come from the shared scales, so it lines up with the Input and SearchBar beside it — glass blurs, gradient glows, and the popup itself is the browser&rsquo;s."
    />
    <SelectPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Every variant"
        description="All six surfaces at the same size, so a Select lines up with the Input and SearchBar beside it."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared control scale — xs to xl — the same steps Input and SearchBar run on."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="Focus one to see its border and ring; the tone tokens are generated from the palette, not hand-written."
        code={tonesCode}
        filename="Tones.tsx"
      >
        <Tones />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="Validation, disabled, a leading icon, a hidden caret and multiple selection."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
    </section>
    <PropsTable
      props={[
        {
          name: "closeOnSelect",
          type: "boolean",
          default: "false",
          description: "Explicitly blurs the Select after a selection change to dismiss the native picker. Calls onChange first. Ignored for multiple. False retains browser behavior, which normally closes single-select pickers automatically.",
        },
        {
          name: "(native attributes)",
          type: "SelectHTMLAttributes",
          description:
            "value/defaultValue, onChange, multiple, required, name, id… pass straight through to the <select>. The Select stays a select — the form value, the popup, the keyboard and the OS typeahead are the browser&rsquo;s.",
        },
        {
          name: "variant",
          type: "InputVariant",
          default: '"flat"',
          description:
            "The shared field surfaces. `glass` really blurs; `gradient` carries one glow behind the field like `Input` and `SearchBar`.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: '"md"',
          description:
            "The shared control scale — the option rows&rsquo; line heights follow it too, so the dropdown matches the box.",
        },
        {
          name: "tone",
          type: "TrueColor",
          default: '"blue"',
          description:
            "Focus border/ring, caret-on-focus, validation-neutral icon accent, and the styled picker&rsquo;s hover/selected colours (travelling as CSS variables, nothing to safelist). `color` works as a deprecated alias.",
        },
        {
          name: "corner",
          type: "SurfaceCorner",
          default: '"auto"',
          description:
            "Field radius from the shared control corner; an explicit token replaces it on every surface, `underline`&rsquo;s no-radius aside.",
        },
        {
          name: "glowIntensity / gradientFrom / gradientTo",
          type: "GlowIntensity / string",
          default: '"subtle" / the tone&rsquo;s 600 → 400 shades',
          description:
            "The `gradient` variant&rsquo;s focus halo, identical to `Input`, `Textarea` and `SearchBar`.",
        },
        {
          name: "validationStatus",
          type: '"none" | "success" | "error"',
          default: '"none"',
          description:
            "Swaps the tone focus pair for the status surface and tints the caret — while leaving the native `required`/pattern machinery alone.",
        },
        {
          name: "placeholder",
          type: "ReactNode",
          description:
            "A `hidden disabled` option and — the part everyone gets wrong — the empty default the browser actually needs to show it; an uncontrolled select otherwise lands on the first *selectable* option.",
        },
        {
          name: "leadingIcon",
          type: "string | ReactElement",
          description:
            "A registry icon name or element, flexed beside the box. Rests in the variant&rsquo;s muted colour, picks up the tone on focus.",
        },
        {
          name: "hideCaret",
          type: "boolean",
          default: "false",
          description:
            "Drops the kit caret. Always dropped for `multiple` — a box of rows has no popup to point at.",
        },
        {
          name: "className / selectClassName / unstyled",
          type: "string / string / boolean",
          description:
            "`className` lands on the surface wrapper (like `Input`), `selectClassName` on the control, `unstyled` drops the chrome for `InputGroup`.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          It is a real <C>&lt;select&gt;</C> — the role, the option list, the
          &ldquo;N items&rdquo; announcement and the popup labelling are the
          browser&rsquo;s, so nothing drifts.{" "}
          <C>validationStatus=&quot;error&quot;</C> sets <C>aria-invalid</C>{" "}
          itself (after the prop spread, so a caller cannot accidentally leave
          an errored select claiming to be valid). Name it with a{" "}
          <C>&lt;label htmlFor&gt;</C> or an <C>aria-label</C> — the kit never
          invents a name.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          All native, which is the point: focus reaches it with <C>Tab</C>,
          arrows move the selection, typing jumps to an option (typeahead),
          <C>Enter</C>/<C>Space</C> opens the platform popup. The only synthetic
          corner is the box itself — the caret and wrapper padding live outside
          the select, so a click there is routed to <C>showPicker()</C>; the
          keyboard path never needed help.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          Nothing to translate — deliberately. The Select contributes no strings
          of its own: options, placeholder and label are the caller&rsquo;s, and
          the popup chrome (scrollbars, tick marks, the native menu) is drawn by
          the browser in the user&rsquo;s locale. Localise your{" "}
          <C>&lt;option&gt;</C> text and the control is done. What stays put:
          nothing — there is no English to carry.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default SelectPage;
