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
import { CheckboxPlayground } from "./CheckboxPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import WithDescription from "./examples/WithDescription";
import withDescriptionCode from "./examples/WithDescription.tsx?raw";
import SelectAll from "./examples/SelectAll";
import selectAllCode from "./examples/SelectAll.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";

export const CheckboxPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Checkbox"
      description="A drawn checkbox — the box, tick and dash are the kit's own, so they follow the tone in both themes. The native input is still underneath, keeping focus, keyboard behaviour and form participation. The variant changes the rest surface (the box you see when it is *off*); the checked fill is the tone everywhere."
    />
    <CheckboxPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="A row of options, each an independent checkbox."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="With description"
        description="Explain the consequence of the choice right where the decision is made."
        code={withDescriptionCode}
        filename="WithDescription.tsx"
      >
        <WithDescription />
      </ExampleCard>
      <ExampleCard
        title="Select all"
        description="A tri-state parent driving its children — the indeterminate dash appears while some, but not all, are checked."
        code={selectAllCode}
        filename="SelectAll.tsx"
      >
        <SelectAll />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="Disabled rows keep their state visible; indeterminate marks a parent with mixed children."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared xs–xl scale — the box sits on the label's cap height at every step."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="All 21 true colours, checked and indeterminate — the tick must stay legible on the fill in both themes."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The box, tick and dash are drawings; the <em>control</em> is a native{" "}
          <code>checkbox</code> laid invisibly over the box — readers announce{" "}
          <em>&ldquo;checkbox, checked&rdquo;</em> and the tri-state{" "}
          <C>indeterminate</C> is announced as <code>aria-checked="mixed"</code>
          , which is exactly what a partially-selected parent means. The{" "}
          <C>label</C> is a real <code>label htmlFor</code>, <C>description</C>{" "}
          and <C>validationMessage</C> are attached via <C>aria-describedby</C>,
          and <C>validationStatus=&quot;error&quot;</C> also sets{" "}
          <C>aria-invalid</C>. All decoration is <C>aria-hidden</C> — the state
          lives in the input, nowhere else. An unnamed checkbox warns in
          development (<C>warnIfMissingName</C>); a <C>description</C> alone
          silences it, because <C>aria-describedby</C> text does reach the
          accessible-name computation — but a visible <C>label</C> is still the
          better answer.
        </p>
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          All of it is native: <Kbd>Tab</Kbd> reaches the checkbox and{" "}
          <Kbd>Space</Kbd> toggles it — there are no key handlers to drift from
          browser behaviour, and the control keeps real form participation (
          <C>required</C> blocks form submission natively). The whole row — box,
          label, description and their padding — is one <code>label</code>{" "}
          element, so it is all click target. The focus ring is drawn by{" "}
          <C>peer-focus-visible</C> on the visible box: keyboard focus rings the
          control, a mouse click does not, and the ring never lands on the
          invisible input.
        </p>
        <p>
          <C>indeterminate</C> is a <em>property</em>, not an attribute — the
          component sets <C>input.indeterminate</C> imperatively (on mount and
          whenever the prop changes), the same way a hand-written ref would;
          keyboard users then move it out of mixed by pressing <Kbd>Space</Kbd>,
          which is the platform&rsquo;s own rule.
        </p>
      </A11yTopic>

      <A11yTopic title="Variants and the hover trap">
        <p>
          A variant styles the <em>rest</em> surface — the box when it is
          unchecked. The checked state deliberately replaces it: the tone owns
          the on-state fill and border (that is what{" "}
          <C>peer-checked:bg-&#123;tone&#125;-700</C> is for), so switching
          variants while the box is checked shows only the decorative
          differences — the <code>elevated</code> shadow, the blur of{" "}
          <code>glass</code> and <code>gradient</code>. The exception is{" "}
          <code>glass</code> itself: an opaque fill would hide its own frost, so
          — like Toggle&rsquo;s glass track — it tints with the tone at a
          translucent alpha (<C>peer-checked:bg-&#123;tone&#125;-500/40</C>) and
          keeps its frost edge. Uncheck the box in the playground to see the
          rest surfaces apart.
        </p>
        <p>
          The variants&rsquo; hover borders are{" "}
          <C>peer-hover:border-&hellip;</C> rules, which read the{" "}
          <em>input&rsquo;s</em> <C>:hover</C> from a sibling. The invisible
          input therefore stays pointer-enabled — an <C>absolute inset-0</C>{" "}
          overlay that declared <C>pointer-events-none</C> would have silently
          deadened every variant&rsquo;s hover feedback while everything else
          kept working. The box underneath still hovers too, since{" "}
          <C>pointer-events-none</C> is not inherited by siblings.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Checkbox carries no built-in strings to localize — label, description
          and validation message are all caller text and pass through untouched.
          The <C>required</C> asterisk is <C>aria-hidden</C>: screen readers get
          &ldquo;required&rdquo; in the user&rsquo;s language from the native{" "}
          <C>required</C> attribute, so the mark never needs translating.
          Flexbox lays the row out in reading order, so in an RTL document the
          box lands on the logical end automatically — note that{" "}
          <C>controlAlign</C> names physical sides, so a deliberate
          &ldquo;right&rdquo; stays right in both directions.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "label",
          type: "ReactNode",
          description:
            "Text beside the box, wired as a real `label htmlFor`. Part of the click target.",
        },
        {
          name: "description",
          type: "ReactNode",
          description:
            "Secondary copy under or beside the label, attached via `aria-describedby`.",
        },
        {
          name: "descriptionPlacement",
          type: '"bottom" | "inline"',
          default: '"bottom"',
          description: "Under the label, or trailing it on the same line.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: '"md"',
          description:
            "The shared xs–xl scale; `md` is a 20px box with `rounded-md` corners, aligned with an `md` input.",
        },
        {
          name: "variant",
          type: "InputVariant",
          default: '"flat"',
          description:
            "Box surface on the shared input scale (`flat`, `elevated`, …), so checkboxes match the fields around them.",
        },
        {
          name: "tone",
          type: "TrueColor",
          default: '"blue"',
          description:
            "Checked fill, dash and focus ring. The fill is `-700` (light) / `-400` (dark) so the white tick clears contrast on every tone.",
        },
        {
          name: "color",
          type: "TrueColor",
          description: "Alias for `tone`; `tone` wins when both are given.",
        },
        {
          name: "indeterminate",
          type: "boolean",
          default: "false",
          description:
            'Sets the native `indeterminate` property and `aria-checked="mixed"`. Wins over `checked` visually, as on the native control.',
        },
        {
          name: "fullWidth",
          type: "boolean",
          default: "false",
          description:
            'Stretches the row; with `controlAlign="right"` the box pins to the far end.',
        },
        {
          name: "controlAlign",
          type: '"left" | "right"',
          default: '"left"',
          description: "Which side the box sits on.",
        },
        {
          name: "validationStatus",
          type: '"none" | "error" | "success"',
          default: '"none"',
          description:
            "Tints the border and message like `Input`'s; `error` also sets `aria-invalid`.",
        },
        {
          name: "validationMessage",
          type: "ReactNode",
          description: "Shown under the row, linked via `aria-describedby`.",
        },
        {
          name: "required",
          type: "boolean",
          description:
            'Sets `required` on the input (native form validation, announced as "required") and adds an aria-hidden asterisk.',
        },
        {
          name: "className",
          type: "string",
          description: "Applied to the row wrapper.",
        },
        {
          name: "inputClassName",
          type: "string",
          description:
            "Applied to the visible box, not to the (invisible) input.",
        },
      ]}
    />

    <p className="text-xs opacity-70">
      Everything else — <C>checked</C>, <C>defaultChecked</C>, <C>onChange</C>,{" "}
      <C>disabled</C>, <C>name</C>, <C>value</C>, <C>id</C>, aria attributes —
      spreads straight through to the native input, so the uncontrolled/
      controlled split, form participation and every reader hint work exactly as
      they do on a plain checkbox.
    </p>
  </div>
);

export default CheckboxPage;
