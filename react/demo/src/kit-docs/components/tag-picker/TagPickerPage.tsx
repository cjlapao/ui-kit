import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { TagPickerPlayground } from "./TagPickerPlayground";
import Create from "./examples/Create";
import createCode from "./examples/Create.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const TagPickerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Tag Picker"
      description="A multi-select that renders its selection as removable pills, with optional free-text creation. Arrow keys and Enter drive the list; Backspace on an empty query removes the last tag."
    />
    <TagPickerPlayground />
    <PropsTable
      props={[
        {
          name: "items / value / onChange",
          type: "TagPickerItem[] / string[] / (values) => void",
          description:
            "Known options and the controlled selection. A value with no matching item is a free-text entry and renders with its raw text as the pill label.",
        },
        {
          name: "multi",
          type: "boolean",
          default: "true",
          description:
            "Off, the picker behaves as single-select: a pick replaces the value and the dropdown closes.",
        },
        {
          name: "allowCreate / onCreateItem",
          type: "boolean / (label) => void",
          default: "false / —",
          description:
            "A query matching nothing (case-insensitively, against both labels and current values) offers a create row. Provided onCreateItem takes over persistence — the component only reports the confirmed label and the owner must store it; without it the text lands in value directly.",
        },
        {
          name: "normalizeValue",
          type: "(value: string) => string",
          description:
            "Applied to creations and known-item picks alike, before the value is stored — e.g. (v) => v.toUpperCase().",
        },
        {
          name: "tagLimit",
          type: "number",
          default: "3",
          description:
            "Pills shown before a +N pill appears; clicking it expands, Show less collapses. 0 shows all.",
        },
        {
          name: "highlightNew",
          type: "boolean",
          default: "true",
          description:
            'Values added during this session (absent from the first value) get an emerald pill and a new flag in the list — the cue for "what I just did"',
        },
        {
          name: "tone / itemColor",
          type: "TrueColor",
          default: '"blue" / falls back to tone',
          description:
            "tone accents the focus, open state and selected rows; itemColor re-tints the pills alone. color is a deprecated alias for tone.",
        },
        {
          name: "size / variant / validationStatus",
          type: "ControlSize / InputVariant / ValidationStatus",
          description:
            "Straight from the field system shared with Input, Select, SearchBar and Picker — same surfaces, same scale, same focus treatment, so a TagPicker stacked beside an Input lines up.",
        },
        {
          name: "panelVariant / panelCorner",
          type: '"auto" | SurfaceVariant / SurfaceCorner',
          default: '"auto"',
          description:
            "The dropdown card&rsquo;s surface and radius. auto follows the field&rsquo;s variant through SURFACE_VARIANT_FOR_FIELD — the mapping SmartInput&rsquo;s suggestion card uses — and resolves the corner through the theme&rsquo;s scale. The popup used to be a hardcoded white box.",
        },
        {
          name: "readOnly / disabled / loading",
          type: "boolean",
          default: "false",
          description:
            "Read-only hides the remove buttons and dims rather than repainting — a neutral background override used to turn a glass trigger into a grey slab. Loading shows a spinner row and the chevron reports aria-busy.",
        },
        {
          name: "escapeBoundary",
          type: "boolean",
          default: "—",
          description:
            "@deprecated — accepted and ignored. The dropdown is portaled to the document root, so it always positions against the viewport; inside a panel or modal the popup lands below the field either way.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The trigger is a plain container — pills each carry their own named
          remove button (<C>Remove prod</C>), so an interactive container would
          nest controls. The chevron is the named opener (<C>Toggle options</C>)
          with <C>aria-haspopup="listbox"</C>; while open, the search input is
          the combobox driving the listbox through <C>aria-activedescendant</C>,
          and rows carry <C>aria-selected</C> — true for checked rows, false
          otherwise, as a multi-selectable listbox requires.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          <C>Enter</C> or <C>Space</C> on the chevron opens; opening lights the
          first checked row (single mode lights the selection so it announces) —
          an empty multi list opens unlit until an arrow key asks for a cursor,
          because a lone lit row reads as picked. <C>↑</C> <C>↓</C> move,{" "}
          <C>Enter</C> toggles (staying open in multi), <C>Backspace</C> on an
          empty query removes the last pill, <C>Escape</C> closes only the
          dropdown.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          Every default and label routes through the kit catalogs —
          placeholders, empty and loading rows, the create row, the <C>new</C>{" "}
          flag, Show {`{count}`} more tags, and all aria names. A German page
          gets <C>Optionen umschalten</C> and <C>prod entfernen</C> with no
          English leaking through destructuring defaults.
        </p>
      </A11yTopic>
    </A11ySection>
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Variants"
        description="Every InputVariant the other fields offer. The trigger painted a hardcoded white box before, so none of these were reachable."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Loading, disabled, read-only and error"
        description="Loading disables the trigger as well as showing the spinner — there is nothing to pick yet. Read-only dims rather than repainting the surface, which used to turn a glass trigger into a grey slab."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Creating values"
        description="A query matching nothing offers a create row, and values added this session are flagged so the user can see what they just did."
        code={createCode}
        filename="Create.tsx"
      >
        <Create />
      </ExampleCard>
    </section>
  </div>
);

export default TagPickerPage;
