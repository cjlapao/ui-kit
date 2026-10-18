import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { InputOtpPlayground } from "./InputOtpPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Controlled from "./examples/Controlled";
import controlledCode from "./examples/Controlled.tsx?raw";
import Mask from "./examples/Mask";
import maskCode from "./examples/Mask.tsx?raw";
import IntegerOnly from "./examples/IntegerOnly";
import integerOnlyCode from "./examples/IntegerOnly.tsx?raw";
import Ghost from "./examples/Ghost";
import ghostCode from "./examples/Ghost.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import Disabled from "./examples/Disabled";
import disabledCode from "./examples/Disabled.tsx?raw";
import Custom from "./examples/Custom";
import customCode from "./examples/Custom.tsx?raw";
import Sample from "./examples/Sample";
import sampleCode from "./examples/Sample.tsx?raw";

export const InputOtpPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Input OTP"
      description="Single-character cells for one-time codes — typed, pasted or autocompleted, with masking, integer-only input and an onComplete callback. The cells are ordinary fields, so they wear the same six surfaces, tones and focus rings as every other input."
    />
    <InputOtpPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="Uncontrolled, with the cell count set by `length`. Each cell takes one character and focus advances as you type."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Controlled"
        description="Drive the code from your own state — the value readout and reset button follow `onChange`."
        code={controlledCode}
        filename="Controlled.tsx"
      >
        <Controlled />
      </ExampleCard>
      <ExampleCard
        title="Mask"
        description="`mask` switches the cells to password inputs so the characters are hidden behind the browser&rsquo;s mask."
        code={maskCode}
        filename="Mask.tsx"
      >
        <Mask />
      </ExampleCard>
      <ExampleCard
        title="Integer Only"
        description="`integerOnly` filters everything but 0–9 and hints a numeric keyboard to mobile browsers."
        code={integerOnlyCode}
        filename="IntegerOnly.tsx"
      >
        <IntegerOnly />
      </ExampleCard>
      <ExampleCard
        title="Ghost fill"
        description="The soft, tone-tinted surface of the shared family — the whole input surface set (flat, elevated, ghost, underline, glass, gradient) reaches the cells, `glass` blurring and `gradient` glowing behind the group."
        code={ghostCode}
        filename="Ghost.tsx"
      >
        <Ghost />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="The shared control scale, so an OTP lines up with the inputs beside it."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="Disabled"
        description="`disabled` freezes the cells — the existing code stays visible but untouchable."
        code={disabledCode}
        filename="Disabled.tsx"
      >
        <Disabled />
      </ExampleCard>
      <ExampleCard
        title="Custom"
        description="`renderCell` replaces the default box. Spread the provided `inputProps` onto your own `<input>` to keep the value, events and aria wiring."
        code={customCode}
        filename="Custom.tsx"
      >
        <Custom />
      </ExampleCard>
      <ExampleCard
        title="Sample"
        description="A sign-in flow: a 6-digit code, a resend action and a submit button that unlocks only when the code is complete."
        code={sampleCode}
        filename="Sample.tsx"
      >
        <Sample />
      </ExampleCard>
    </section>
    <PropsTable
      props={[
        {
          name: "value / defaultValue",
          type: "string",
          description:
            "The full code, one character per cell — controlled and uncontrolled, exactly as on an `<input>`.",
        },
        {
          name: "onChange / onComplete",
          type: "(value: string) => void",
          description:
            "`onChange` fires on every change; `onComplete` once, when the last cell transitions to filled.",
        },
        {
          name: "length",
          type: "number",
          default: "4",
          description:
            "Cell count, clamped to 1–20 so a typo in `length` cannot render a wall.",
        },
        {
          name: "variant",
          type: "InputVariant",
          default: '"flat"',
          description:
            "The shared input surface family for the cells — they are fields. `glass` really blurs; `gradient` puts one glow behind the whole group, not one per cell. The old `outlined` / `filled` resolve to `flat` / `ghost`.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: '"md"',
          description:
            "The shared control scale drives the cell square and the gap between cells.",
        },
        {
          name: "corner",
          type: '"auto" | PillCorner',
          default: '"auto"',
          description:
            "Cell radius. `auto` keeps the size ladder&rsquo;s own rounding; the explicit tokens ride the pill corner scale — the card scale would turn a 28px square into a blob, the reason `Pill` gives for its own scale.",
        },
        {
          name: "tone",
          type: "TrueColor",
          default: '"blue"',
          description:
            "The shared field focus pair (border + inset ring, on every tone), the ghost tint and the gradient glow.",
        },
        {
          name: "glowIntensity / gradientFrom / gradientTo",
          type: "GlowIntensity / string",
          default: '"subtle" / the tone’s 600 → 400 shades',
          description:
            "The focus halo of the `gradient` variant, identical to `Input`, `Textarea` and `SearchBar` — but centred on the group.",
        },
        {
          name: "mask",
          type: "boolean",
          default: "false",
          description: 'Cells become `type="password"`.',
        },
        {
          name: "integerOnly",
          type: "boolean",
          default: "false",
          description:
            "Filters to 0–9 and hints a numeric keyboard (`inputMode`/`pattern`).",
        },
        {
          name: "invalid / disabled / readOnly",
          type: "boolean",
          default: "false",
          description:
            "`invalid` swaps the tone focus for the error border and sets `aria-invalid` on every cell.",
        },
        {
          name: "name",
          type: "string",
          description:
            "The form field name, set on the first cell — the code submits as one value.",
        },
        {
          name: "ariaLabel",
          type: "string",
          default: '"One-time password" (`kit.inputotp.label`)',
          description:
            "Names the group and, through `kit.inputotp.cell`, each cell — “Authentication code, character 3 of 6”.",
        },
        {
          name: "renderCell",
          type: "(cell: InputOtpCellContext) => ReactNode",
          description:
            "Replaces the default box. Spreading `cell.inputProps` keeps the value, events, aria labels and focus wiring.",
        },
        {
          name: "className / ref",
          type: "string / Ref<HTMLDivElement>",
          description: "Land on the group.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          One <C>role=&quot;group&quot;</C> named by <C>ariaLabel</C>, holding
          one <C>textbox</C> per cell named through the catalog —{" "}
          <em>&ldquo;One-time password, character 3 of 6&rdquo;</em>, so
          position is spoken, not guessed. <C>invalid</C> sets{" "}
          <C>aria-invalid</C> on every cell. <C>disabled</C> and <C>readOnly</C>{" "}
          are the real input attributes, not lookalikes.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          Typing fills the cell and advances focus; a keystroke on a filled cell
          replaces it (the content is selected on focus, so <C>maxLength</C>{" "}
          never silently drops it). Backspace clears the cell or steps back to
          clear the previous one, <C>ArrowLeft</C>/<C>ArrowRight</C> walk the
          row, and a paste distributes across cells, focus parking at the end.
          The first cell carries <C>autocomplete=&quot;one-time-code&quot;</C>,
          so mobile autofill delivers the whole code — and keystrokes past the
          last filled cell land at the end, because the value is a contiguous
          string the component can actually express.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          The group name (<C>kit.inputotp.label</C>) and the per-cell position
          string (<C>kit.inputotp.cell</C> — <C>Zeichen 3 von 6</C>,{" "}
          <C>caractère 3 sur 6</C>) ride the catalog in five locales; a
          caller-given <C>ariaLabel</C> flows into the translated sentence
          rather than replacing it. What stays put: the digits themselves.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default InputOtpPage;
