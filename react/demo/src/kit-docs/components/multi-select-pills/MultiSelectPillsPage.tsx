import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { MultiSelectPillsPlayground } from "./MultiSelectPillsPlayground";
import ResourceFilter from "./examples/ResourceFilter";
import resourceFilterCode from "./examples/ResourceFilter.tsx?raw";
import SingleChoice from "./examples/SingleChoice";
import singleChoiceCode from "./examples/SingleChoice.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import UncontrolledAndGlass from "./examples/UncontrolledAndGlass";
import uncontrolledAndGlassCode from "./examples/UncontrolledAndGlass.tsx?raw";

export const MultiSelectPillsPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Multi Select Pills"
      description="A row of pills used as a checkbox or radio group — real form semantics, not toggle buttons that merely look the part. It renders the kit's Pill, so it inherits every variant, tone, size and corner, including the glass pair."
    />
    <MultiSelectPillsPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Resource filter"
        description="The canonical case: a multi-select of what to include, with icons and counts, and a live readout of what a form submit would carry."
        code={resourceFilterCode}
        filename="ResourceFilter.tsx"
      >
        <ResourceFilter />
      </ExampleCard>
      <ExampleCard
        title="Single choice"
        description="Single mode is a radiogroup — arrows walk and pick, picking another swaps the selection, and a check mark keeps the state out of colour alone."
        code={singleChoiceCode}
        filename="SingleChoice.tsx"
      >
        <SingleChoice />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="A required single choice that can't be emptied, and a whole group disabled with one option disabled per-option."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Uncontrolled and glass"
        description="An uncontrolled group that keeps its own state, and the glass variants sitting on a glass panel."
        code={uncontrolledAndGlassCode}
        filename="UncontrolledAndGlass.tsx"
      >
        <UncontrolledAndGlass />
      </ExampleCard>
    </section>
    <PropsTable
      props={[
        {
          name: "name",
          type: "string",
          description:
            "Form field name. Multiple mode submits `name[]=…` checkboxes; single mode submits a plain radio field, `name=…` — the semantics carry into the request.",
        },
        {
          name: "options",
          type: "MultiSelectPillOption[]",
          description:
            "`{ value, label, description?, disabled?, icon? }`. `icon` is a registry name or any node; `disabled` opts out a single pill.",
        },
        {
          name: "value / defaultValue",
          type: "string[]",
          description:
            "Controlled and uncontrolled selections, exactly as on an `<input>` — `defaultValue` is the initial value, nothing more.",
        },
        {
          name: "onChange",
          type: "(selectedValues: string[]) => void",
          description:
            "Fires with the full next selection, in click order for multiple mode and as a one-item array (or empty one) for single.",
        },
        {
          name: "legend / description",
          type: "ReactNode",
          description:
            "Rendered as a real `<legend>` (which names the group for assistive tech) and helper text below it.",
        },
        {
          name: "selectionMode",
          type: '"multiple" | "single"',
          default: '"multiple"',
          description:
            'Multiple is a checkbox group (`role="checkbox"`, every pill its own tab stop); single is a radiogroup (`role="radio"`, roving tab stop, arrows pick).',
        },
        {
          name: "allowDeselect",
          type: "boolean",
          default: "true",
          description:
            "In single mode, whether clicking the selected pill clears it. Off makes the choice required — and the group can then never be emptied by pointer. Arrows never deselect either way.",
        },
        {
          name: "variant / unselectedVariant",
          type: "PillVariant",
          default: '"solid" / "outline"',
          description:
            "The Pill surface for each state — `glass` and `liquid-glass` really blur, on either side of the selection.",
        },
        {
          name: "tone",
          type: "TrueColor",
          default: '"blue"',
          description:
            "Accent of a selected pill, straight through to Pill&rsquo;s tone map — `red` paints red. `color` is its deprecated alias.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: '"md"',
          description:
            "The shared control scale, matching the Pill&rsquo;s own default so a group lines up with its sibling inputs.",
        },
        {
          name: "corner",
          type: "PillCorner",
          default: '"full"',
          description:
            "The pill corner scale — deliberately not the container one, whose `rounded-md` is 16px, a capsule on a 24px-tall pill anyway. `rounded` is its deprecated alias.",
        },
        {
          name: "gap",
          type: "ControlSize",
          default: '"sm"',
          description: "Space between pills, on the same scale.",
        },
        {
          name: "checkmark",
          type: "boolean",
          default: "false",
          description:
            "Swap a selected option&rsquo;s icon for a check mark, so selection is not signalled by fill alone — the `neutral` tone barely changes between states.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description:
            "Disables the whole group via the `<fieldset>`, which makes every pill inert natively.",
        },
        {
          name: "glassOpacity / vibrancy / specularMode",
          type: "GlassOpacity / GlassVibrancy / SpecularMode",
          description: "Glass chrome, forwarded to the glass pill variants.",
        },
        {
          name: "className",
          type: "string",
          description: "Lands on the `<fieldset>`.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The group is a real <C>{"fieldset"}</C>, so a <C>legend</C> names it
          natively. Multiple mode&rsquo;s pills carry <C>role="checkbox"</C>{" "}
          with live <C>aria-checked</C>; single mode promotes the fieldset
          itself to <C>role="radiogroup"</C> and the pills to{" "}
          <C>role="radio"</C> — one group, one role, named by its own legend.
          The pills used to be <C>aria-pressed</C> toggle buttons describing a
          state that the hidden form inputs already owned; now the announced
          role and the submitted value agree. Those inputs (<C>checkbox</C> in
          multiple mode, <C>radio</C> in single) are <C>aria-hidden</C> and out
          of the tab order — carriers for the value at submit time, not a second
          set of controls to announce. Disabled pills are natively disabled
          buttons.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          Multiple mode is a checkbox group, so it behaves like the native stack
          it mirrors: every pill is its own tab stop, Space toggles it (Enter
          activates too, being a real button), and no arrow keys are hijacked.
          Single mode is the radiogroup pattern, identical to <C>MultiToggle</C>
          : one tab stop — the selected pill, or the first usable one while
          nothing is selected — and arrows walk the options,
          <em> picking as they go</em>, wrapping at both ends and skipping
          disabled ones; <C>Home</C>/<C>End</C> jump to the ends. Deselecting by
          clicking the selected pill is a pointer affordance by itself — arrows
          never clear the group.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          Nothing to translate inside: every visible string — legend, helper,
          each option label and description — is caller-supplied, and the
          selection state travels as ARIA attributes, not prose. The one icon
          the component draws itself, the check mark, comes from the shared{" "}
          <C>Icon</C> registry, so host-level icon localisation reaches it like
          everything else.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default MultiSelectPillsPage;
