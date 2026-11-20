import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { FieldRowPlayground } from "./FieldRowPlayground";
import ExplorerRow from "./examples/ExplorerRow";
import explorerRowCode from "./examples/ExplorerRow.tsx?raw";
import Bands from "./examples/Bands";
import bandsCode from "./examples/Bands.tsx?raw";
import EscapeHatch from "./examples/EscapeHatch";
import escapeHatchCode from "./examples/EscapeHatch.tsx?raw";

export const FieldRowPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="FieldRow"
      description="A toolbar/filter row for controls of different heights. It lays its children on shared label, control and note bands, so a two-line Picker trigger sets the height of the whole control band — the combobox, the input and the bare button beside it fill it instead of drifting on the baseline. Drop controls in; no per-control props."
    />
    <FieldRowPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="The row that motivated it"
        description="The GraphExplorer toolbar from aeon, before and after. The picker renders title + subtitle, which makes its trigger two lines tall; plain flex leaves the combobox and button on the bottom edge at their own heights. The same children in a FieldRow share one control band — the button included."
        code={explorerRowCode}
        filename="ExplorerRow.tsx"
      >
        <ExplorerRow />
      </ExampleCard>
      <ExampleCard
        title="Shared bands"
        description="A wrapping label, a description, none: per-field flex lets the controls start at three different baselines. The row sizes the label band, the control band and the notes band once each, and aligns every field to them."
        code={bandsCode}
        filename="Bands.tsx"
      >
        <Bands />
      </ExampleCard>
      <ExampleCard
        title="Outside a row — the lines escape hatch"
        description="With no row to share a band with, a two-line picker still stands taller than its neighbours. lines={2} floors a field at the size's two-line height from the shared theme token; the picker does it itself as soon as any option has a subtitle."
        code={escapeHatchCode}
        filename="EscapeHatch.tsx"
      >
        <EscapeHatch />
      </ExampleCard>
    </section>
    <PropsTable
      props={[
        {
          name: "gap",
          type: "ControlSize",
          default: '"md"',
          description:
            "Column gap on the shared control scale. Band row-spacing stays compact regardless.",
        },
        {
          name: "children",
          type: "ReactNode",
          description:
            "FormField children are placed directly on the bands (they span them with subgrid); any other child — a bare Button, an IconButton — is wrapped into the control band alone, which is what keeps a label-less action at field height instead of stretching into the label band. Widths go on the FormField: className=\"w-80\".",
        },
        {
          name: "className",
          type: "string",
          description: "Extra classes on the grid root.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The row is a layout grid with no semantics of its own — it is the
          fields that carry the roles. A <C>FormField</C> keeps labelling its
          control (the row must not break the <C>htmlFor</C> association),
          and a bare <C>Button</C> child is a real button regardless of the
          band it sits on. Nothing in the row is focusable, so reading order
          is the children&rsquo; order.
        </p>
      </A11yTopic>
      <A11yTopic title="Layout notes">
        <p>
          Bands are one CSS grid (<C>grid-auto-flow: column</C> with rows{" "}
          <C>auto 1fr auto</C>); fields span them with <C>subgrid</C>
          (Chrome 117+, Safari 16+, Firefox 71+). The row is a single
          toolbar line — it does not wrap; for responsive multi-column
          forms use <C>FormLayout</C>. A control with a custom{" "}
          <C>height</C> class of its own opts out of the band — that is
          deliberate control, not an accident.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default FieldRowPage;
