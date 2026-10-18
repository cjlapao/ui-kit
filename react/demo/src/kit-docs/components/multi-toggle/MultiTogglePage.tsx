import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { MultiTogglePlayground } from "./MultiTogglePlayground";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";

export const MultiTogglePage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Multi Toggle"
      description="A segmented control — a radiogroup with a sliding indicator. The track takes the same eight surface variants as Panel, so it sits flush beside a card; the indicator is its own scale. Arrow keys, Home and End move the selection and skip disabled options."
    />
    <MultiTogglePlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Track variants and indicators"
        description="The track is a surface, so it takes the Panel family — each toggle here is paired with the Panel it matches. The indicator is separate: it is what the old `theme | solid | soft` variant was really describing."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="The full shared control scale. It used to declare its own `sm | md | lg`, so a toggle could not line up with the `xs` or `xl` Button beside it."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="Tones"
        description="Generated from the theme. The 21-entry map this replaced had `green` painting emerald classes and `red` painting rose, so those two tones rendered as their neighbours."
        code={tonesCode}
        filename="Tones.tsx"
      >
        <Tones />
      </ExampleCard>
    </section>
    <PropsTable
      props={[
        {
          name: "options",
          type: "MultiToggleOption[]",
          description:
            "`value`, `label`, `icon` (registry name or element), `disabled`, and an optional fixed `width` for icon-only segments. Labels are ReactNodes and entirely the caller&rsquo;s — this component owns no strings.",
        },
        {
          name: "value",
          type: "string",
          description:
            "The selected option&rsquo;s value. Selection always lives up here — one option is always the radio that is checked.",
        },
        {
          name: "onChange",
          type: "(value: string) => void",
          description:
            "Fires with the new value — from clicks and from the arrow keys alike, which is the whole point of a radiogroup that handles keys.",
        },
        {
          name: "variant",
          type: "SurfaceVariant",
          default: '"subtle"',
          description:
            "The track, from the Panel family — eight surfaces that read identically beside a `Panel` at the same tone. (The old union described the indicator and is deprecated.)",
        },
        {
          name: "indicator",
          type: '"solid" | "soft" | "tonal"',
          default: '"solid"',
          description:
            "How the active segment is drawn, independent of the track — `solid` is a raised card with a full-strength hairline, `tonal` the most washed. All three carry a tone-following edge, because a white pill on a light track is nearly invisible.",
        },
        {
          name: "tone",
          type: "TrueColor",
          default: '"blue"',
          description:
            "Accent for the indicator edge, the active label and the focus ring — generated from the theme, so `green` is green. `color` is the deprecated alias; `tone` wins when both are set.",
        },
        {
          name: "accentTone",
          type: "TrueColor",
          description:
            "Overrides only the active label&rsquo;s colour, leaving the edge on the tone. `accentColor` is the deprecated alias.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: '"md"',
          description:
            "The shared control scale — an `xs` or `xl` toggle lines up with the Button of the same size beside it. It used to declare its own three sizes.",
        },
        {
          name: "rounded",
          type: "MultiToggleShape",
          default: '"lg"',
          description:
            "Track corner, with the indicator&rsquo;s corner lagging one step behind so the pill never pokes through the track.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description:
            "Disables the whole group — `aria-disabled` on the radiogroup, `tabIndex` pulled from every segment.",
        },
        {
          name: "showOnlyActiveLabel",
          type: "boolean",
          default: "false",
          description:
            "Icon-only segments that widen to show the label only on the active one. The widths are measured, not guessed, so the pill lands where the text actually is.",
        },
        {
          name: "fullWidth",
          type: "boolean",
          default: "false",
          description: "Segments share the width evenly.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          A real <C>role=&quot;radiogroup&quot;</C> of{" "}
          <C>role=&quot;radio&quot;</C> segments announcing state once, as{" "}
          <C>aria-checked</C>. It used to also carry <C>aria-pressed</C> — a
          radio&rsquo;s state and a toggle button&rsquo;s state on one element,
          in two vocabularies, so screen readers narrated the selection twice in
          different grammars. Disabled segments stay in the a11y tree as
          unchecked radios, which is how a user learns the option exists but is
          not available. Native props (<C>id</C>, <C>aria-label</C>,{" "}
          <C>data-*</C>) land on the group, not once per option — they used to
          be spread onto every segment, so an <C>id</C> appeared three times and
          an <C>onClick</C> replaced each segment&rsquo;s own handler.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          One <C>Tab</C> stop — the selected segment — then <C>←</C> <C>→</C>{" "}
          (or <C>↑</C> <C>↓</C>) move the selection itself, not just the focus,
          wrapping at both ends; <C>Home</C> and <C>End</C> jump. Steps skip
          disabled options, so a keyboard user never has to arrow through an
          option that cannot be chosen. The stop tracks the <em>selection</em> —
          the same <C>value</C> the pill is drawn under — so there is never a
          split state where the pill says one segment and the keyboard enters at
          another.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          Nothing to translate — deliberately. Every visible word is a label in{" "}
          <C>options</C>, which is the caller&rsquo;s content rendered as
          ReactNodes. What is <em>not</em> language-neutral is order, and the
          kit keeps its hands off it: segments render in the order you pass,
          which means an RTL host flips them the way the arrow-key handling
          expects.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default MultiTogglePage;
