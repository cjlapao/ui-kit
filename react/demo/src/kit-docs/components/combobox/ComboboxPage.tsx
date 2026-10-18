import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ComboboxPlayground } from "./ComboboxPlayground";
import Basics from "./examples/Basics";
import basicsCode from "./examples/Basics.tsx?raw";
import RichOptions from "./examples/RichOptions";
import richOptionsCode from "./examples/RichOptions.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const ComboboxPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Combobox"
      description="A text field that suggests without preventing: the list filters as you type, and whatever you leave in the field is the value. It renders `Input`, so the box, the sizes, the entry variants and the validation ring are the ones every other control in the kit uses — and it follows the ARIA combobox pattern, so the whole list is reachable from the keyboard."
    />
    <ComboboxPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basics"
        description="`onChange` fires on every keystroke — the field is free text. `onSelect` fires only when a row is actually chosen, which is usually the one to act on."
        code={basicsCode}
        filename="Basics.tsx"
      >
        <Basics />
      </ExampleCard>
      <ExampleCard
        title="Rich options"
        description="An option can be a bare string or an object with a label, a description, an icon and a disabled flag. The keyboard cursor steps over a disabled row rather than landing on it and refusing."
        code={richOptionsCode}
        filename="RichOptions.tsx"
      >
        <RichOptions />
      </ExampleCard>
      <ExampleCard
        title="Variants and sizes"
        description="Rendering `Input` rather than a second field implementation means every entry variant and every control size come for free, and the box lines up with the Button beside it."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="`validationStatus` is the kit's one field-status scale — it used to be declared six separate times across the form controls. `loading`, `disabled` and `readOnly` complete the set."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
    </section>
    <PropsTable
      props={[
        {
          name: "value / onChange / onSelect",
          type: "string / (value) => void / (option) => void",
          description:
            "The field is free text - onChange fires on every keystroke and whatever you leave typed is the value. onSelect fires only when a row is chosen, through mouse or Enter, which is the one to act on.",
        },
        {
          name: "options",
          type: "(string | ComboboxOption)[]",
          description:
            "A bare string is shorthand for `{ value }`. An option can carry a label, a description, a registry icon and a disabled flag - the keyboard cursor steps over a disabled row rather than landing on it and refusing.",
        },
        {
          name: "size / variant",
          type: "ControlSize / InputVariant",
          default: '"md" / "flat"',
          description:
            "The shared scales, straight through to the Input it renders - so the box lines up with the Button beside it and every entry variant comes for free.",
        },
        {
          name: "tone (color)",
          type: "TrueColor",
          default: '"blue"',
          description:
            "The kit default accent for the focus ring, the check, and the row wash - under the mouse and under the keyboard cursor alike (in tone on the selected row). The suggestion list is the field\u2019s shadow: it tints like the field does.",
        },
        {
          name: "panelVariant / panelCorner",
          type: '"auto" | SurfaceVariant / SurfaceCorner',
          default: '"auto" / "auto"',
          description:
            "The popup is a Panel from the container family, portaled to the body and placed against the viewport with a flip when there is more room above. Auto pairs its surface with the field through `SURFACE_VARIANT_FOR_FIELD` - a glass field opens a glass popup, not an opaque slab.",
        },
        {
          name: "validationStatus (error)",
          type: "ValidationStatus / boolean",
          default: '"none"',
          description:
            "The kit's one field-status scale; the boolean error flag is its alias. A free-text field should rarely set it - typing anything is legal here.",
        },
        {
          name: "loading / emptyMessage / clearable",
          type: "boolean / ReactNode / boolean",
          default: "false / localized / true",
          description:
            "Loading spins in the field's trailing slot (visible even with the list closed) and replaces the rows with a spinner inside; the keyboard cursor will not step through or commit rows hidden behind it. An unmatched filter says so instead of opening a blank box. Both messages route through the kit catalogs. Clearable swaps the caret affordance for a clear button while there is something to clear - the spinner outranks it mid-fetch.",
        },
        {
          name: "visibleRows / listClassName",
          type: "number / string",
          default: "6 / —",
          description:
            "Rows before the ScrollArea starts scrolling, capped further by the room left in the viewport. listClassName rides onto the popup card.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          A real <C>combobox</C> driving a <C>listbox</C>: <C>aria-expanded</C>,{" "}
          <C>aria-controls</C> and <C>aria-activedescendant</C> name the row the
          cursor is on, and the listbox keeps its role even while it only holds
          a spinner or the empty message - the field never points at nothing.
          Rows carry <C>aria-selected</C> and <C>aria-disabled</C>.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          Focus or <C>↓</C> opens, <C>↑ ↓</C> move the cursor (skipping disabled
          rows and wrapping), <C>Home</C>/<C>End</C> jump, <C>Enter</C> commits
          only a real row - free text you leave in place is the value.{" "}
          <C>Esc</C> closes the list and consumes the key so a host&rsquo;s own
          Escape ladder (a modal, a docked field) keeps its rung; the next
          Escape goes to the host. The cursor scrolls its own row into view -
          the list needs no tab stop to be traversed.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          The loading line, the empty message and the two trailing-affordance
          labels (<C>Clear</C>, <C>Show options</C>) resolve through the kit
          catalogs; <C>loadingMessage</C> and <C>emptyMessage</C> override per
          instance. Filter matching is case-insensitive substring - no locale
          collation, so callers with accented labels may want to filter
          upstream.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default ComboboxPage;
