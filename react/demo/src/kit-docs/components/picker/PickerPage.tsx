import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PickerPlayground } from "./PickerPlayground";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const PickerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Picker"
      description="A searchable single- or multi-select over rich rows — icon, title, subtitle, description and pills. The list is portaled and flips above the trigger when there is no room below."
    />
    <PickerPlayground />
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
        title="Loading, disabled and error"
        description="All three come from the shared field system, so a Picker and an Input agree on them. The loading row's chevron now sits at the trailing edge — it used to sit against the word Loading."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Tones"
        description="Generated from the palette. The literal map this replaced spelled red as rose and green as emerald — and since those literals were also what Tailwind scanned, the correct classes had never been emitted."
        code={tonesCode}
        filename="Tones.tsx"
      >
        <Tones />
      </ExampleCard>
    </section>
    <PropsTable
      props={[
        {
          name: "items",
          type: "PickerItem[]",
          description:
            "Rich rows: `title`, `subtitle`, `description`, `icon`, `tags`. This is why the widget is an ARIA listbox rather than a native <select> — native options cannot carry this content.",
        },
        {
          name: "selectedId",
          type: "string",
          description:
            "Single-select selection. Omit for uncontrolled none; the trigger shows `placeholder` until something is picked.",
        },
        {
          name: "onSelect",
          type: "(item: PickerItem) => void",
          description:
            "Fires with the whole item — the row, not just its id, so callers rarely need a lookup.",
        },
        {
          name: "multi / selectedIds / onMultiChange",
          type: "boolean / string[] / (ids) => void",
          description:
            "Multi-select mode: `aria-multiselectable` on the listbox, pills on the trigger, and a `3 selected / Clear` summary when they overflow `maxPillsShown`.",
        },
        {
          name: "defaultFilter",
          type: "{ label, predicate }",
          description:
            "A pre-applied slice of the list with a toggle in the search row — the search placeholder names the active slice (&ldquo;Search running items…&rdquo;) so users never wonder what they are searching.",
        },
        {
          name: "placeholder / emptyMessage / loadingMessage",
          type: "string",
          description:
            "All optional — and their defaults now live in the kit catalogue, so leaving them out gets the user&rsquo;s language, not English.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          description:
            "Disables the trigger (a loading picker must not be re-opened) with a wait cursor rather than the disabled dim, and shows a spinner row while keeping the list browsable.",
        },
        {
          name: "tone / color",
          type: "TrueColor",
          default: '"blue"',
          description:
            "The shared field tone. `color` is the deprecated alias and `tone` wins when both are set — the family rule.",
        },
        {
          name: "variant / size / validationStatus / glow trio",
          type: "InputVariant / ControlSize / ValidationStatus / …",
          description:
            "Straight from the field system shared with Input, Select and SearchBar — same surfaces, same scale, same focus treatment, so a Picker stacked beside an Input lines up.",
        },
        {
          name: "escapeBoundary",
          type: "boolean",
          default: "—",
          description:
            "@deprecated — accepted and ignored. The dropdown is portaled to the document root, so it always positions against the viewport: inside a scrollable Panel or a Modal the popup lands below the field either way, the way the DatePicker&rsquo;s overlay has since been fixed. And Escape was never this flag&rsquo;s business: while the dropdown is open its Escape handler consumes the key, so only the dropdown closes and the Modal behind it survives — no flag needed.",
        },
        {
          name: "fullWidth / fullHeight / maxPillsShown",
          type: "boolean / boolean / number",
          description:
            "Layout knobs: fill the container, let the list grow past the capped dropdown height, and how many pills before the count summary.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          A deliberate ARIA implementation: the search field is a{" "}
          <C>role=&quot;combobox&quot;</C> driving a{" "}
          <C>role=&quot;listbox&quot;</C> of <C>role=&quot;option&quot;</C>{" "}
          rows, with the keyboard highlight announced through{" "}
          <C>aria-activedescendant</C> — focus never leaves the field, so the
          typed query survives. A native <C>&lt;select&gt;</C> cannot host
          icon-subtitle-tag rows, so the pattern is not laziness; the localized
          names (&ldquo;Search options&rdquo;, &ldquo;Options&rdquo;) come from
          the kit catalogue, not from hardcoded English.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          <C>Enter</C> or <C>Space</C> opens; opening highlights and announces
          the first option (or the selected one); <C>↑</C> <C>↓</C> move the
          highlight, <C>Home</C>/<C>End</C> jump, <C>Enter</C> confirms,{" "}
          <C>Escape</C> closes <em>only</em> the dropdown — the key is consumed
          while it is open, so the Modal behind it survives. Clicking the filter
          pill toggles the slice without moving focus out of the search field,
          so keyboard state survives.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          Everything visible by default is a kit string —{" "}
          <C>kit.picker.placeholder</C>, <C>empty</C>, <C>loading</C>, the three
          search placeholders (including the interpolated <C>searchIn</C>,
          &ldquo;Search {`{group}`} items…&rdquo;), <C>selectedCount</C> and the
          accessible names — so an untouched <C>&lt;Picker items /&gt;</C>{" "}
          renders in the user&rsquo;s language. The items themselves are caller
          content, translated upstream. The German tests assert &ldquo;Wird
          geladen…&rdquo; and the German listbox names, because these defaults
          used to be English baked into the component — the kind of bug no one
          sees until they are wrong in front of a user.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default PickerPage;
