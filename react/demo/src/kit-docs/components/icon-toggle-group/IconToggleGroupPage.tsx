import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { IconToggleGroupPlayground } from "./IconToggleGroupPlayground";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import TrackVariants from "./examples/TrackVariants";
import trackVariantsCode from "./examples/TrackVariants.tsx?raw";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";
import TooltipsAndDisabled from "./examples/TooltipsAndDisabled";
import tooltipsCode from "./examples/TooltipsAndDisabled.tsx?raw";

export const IconToggleGroupPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Icon Toggle Group"
      description="A segmented control of IconButtons — the selection is each button's own active state, so there is no sliding pill, no measurement and no spring. The track is a surface from the Panel family, and the keyboard contract is the same radiogroup MultiToggle follows."
    />
    <IconToggleGroupPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Track variants"
        description="The track is a surface, so it takes the Panel family — each column pairs the group with the Panel it matches. There is no indicator row: the active option is an IconButton wearing its own on-state."
        code={trackVariantsCode}
        filename="TrackVariants.tsx"
      >
        <TrackVariants />
      </ExampleCard>
      <ExampleCard
        title="Tones and accents"
        description="tone accents the active fill, hover and focus ring; accentTone re-colours only the selected button. Both resolve through the generated theme, so every tone is really that tone."
        code={tonesCode}
        filename="Tones.tsx"
      >
        <Tones />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="The shared control scale — the buttons size themselves through the same tokens IconButton uses, so a group lines up with the IconButton or Button beside it."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="Tooltips and disabled options"
        description="An option's label names it for screen readers and doubles as its tooltip. Disabled options stay announced but unselectable, and the arrow keys step over them."
        code={tooltipsCode}
        filename="TooltipsAndDisabled.tsx"
      >
        <TooltipsAndDisabled />
      </ExampleCard>
    </section>
    <PropsTable
      props={[
        {
          name: "options",
          type: "IconToggleGroupOption[]",
          description:
            "`value`, `icon` (registry name or element), `label`, `tooltip`, `tooltipPosition`, `disabled`. The label is the accessible name — `aria-label` resolves `label → tooltip → value`, so an unnamed icon button cannot ship.",
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
            "Fires with the new value — from clicks and from the arrow keys alike. Clicking the active or a disabled option is a no-op.",
        },
        {
          name: "variant",
          type: "SurfaceVariant",
          default: '"subtle"',
          description:
            "The track, from the Panel family — the same surfaces a `Panel` offers, reading identically beside one at the same tone. `none` drops the track entirely, leaving the bare buttons.",
        },
        {
          name: "buttonVariant",
          type: "ButtonVariant",
          default: '"ghost"',
          description:
            "The `IconButton` variant the resting options render as. Ghost keeps them flat, so the selection\u2019s solid tone tile is the only box on show. The selected option always paints itself with the `icon` variant\u2019s on-tile, whichever variant is chosen here.",
        },
        {
          name: "tone",
          type: "TrueColor",
          default: '"blue"',
          description:
            "Accent for the active fill, the resting hover and the focus ring — generated from the theme.",
        },
        {
          name: "accentTone",
          type: "TrueColor",
          description:
            "Overrides only the selected button&rsquo;s fill, leaving the track and the resting options on the tone.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: '"md"',
          description:
            "The shared control scale; the buttons take their box from the `IconButton` size tokens and the track adds padding and the gap.",
        },
        {
          name: "rounded",
          type: "IconToggleGroupShape",
          default: '"lg"',
          description:
            "Corner of the track and its buttons together — one shape, both boxes.",
        },
        {
          name: "fullWidth",
          type: "boolean",
          default: "false",
          description: "Options share the parent&rsquo;s width evenly.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description:
            "Disables the whole group — `aria-disabled` on the radiogroup, every option untabbable.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          A real <C>role=&quot;radiogroup&quot;</C> of <C>role=&quot;radio&quot;</C>{" "}
          options announcing state once, as <C>aria-checked</C>. Every option is
          named — <C>label → tooltip → value</C> is the <C>aria-label</C>{" "}
          fallback chain — because an icon alone names nothing. Disabled options
          stay in the a11y tree as unchecked radios, which is how a user learns
          the option exists but is not available. Native props (<C>id</C>,{" "}
          <C>aria-label</C>, <C>data-*</C>) land on the group, not once per
          option.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          One <C>Tab</C> stop — the selected option — then <C>←</C> <C>→</C>{" "}
          (or <C>↑</C> <C>↓</C>) move the selection itself, not just the focus,
          wrapping at both ends; <C>Home</C> and <C>End</C> jump. Steps skip
          disabled options. The stop tracks the <em>selection</em>, so there is
          never a split state where the highlighted button and the keyboard
          entry point disagree.
        </p>
      </A11yTopic>
      <A11yTopic title="Contrast">
        <p>
          The selected button paints from <C>getButtonActiveClasses(&quot;icon&quot;, tone)</C>{" "}
          — the same theme slot <C>Button</C> uses, which the kit&rsquo;s
          contrast gate asserts across all 21 tones and both themes. Inactive
          buttons keep the variant&rsquo;s own focus ring; the active one gets
          the surface trigger&rsquo;s ring re-supplied, because the active
          class set replaces the variant&rsquo;s.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          Nothing to translate — deliberately. Every word is a caller-supplied{" "}
          <C>label</C> or <C>tooltip</C>; the component owns no strings, and
          options render in the order passed, which is what RTL hosts expect
          from the arrow-key handling.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default IconToggleGroupPage;
