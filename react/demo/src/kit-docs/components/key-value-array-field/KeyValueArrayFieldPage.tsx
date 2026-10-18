import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { KeyValueArrayFieldPlayground } from "./KeyValueArrayFieldPlayground";
import EnvironmentVariables from "./examples/EnvironmentVariables";
import environmentVariablesCode from "./examples/EnvironmentVariables.tsx?raw";
import DuplicateKeys from "./examples/DuplicateKeys";
import duplicateKeysCode from "./examples/DuplicateKeys.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";

export const KeyValueArrayFieldPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Key/Value Array"
      description="Collect arbitrary metadata pairs. Renders a Panel, so it takes every container surface, and its inputs take every input surface — with duplicate-key flagging, a row cap and collapsible help."
    />
    <KeyValueArrayFieldPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Environment variables"
        description="The canonical case: a hint under the label, collapsible help, and a few seeded pairs. Add, edit and remove rows freely."
        code={environmentVariablesCode}
        filename="EnvironmentVariables.tsx"
      >
        <EnvironmentVariables />
      </ExampleCard>
      <ExampleCard
        title="Duplicate keys"
        description="Two rows share the key `region` — both are flagged, because the second would silently win when the map is serialised."
        code={duplicateKeysCode}
        filename="DuplicateKeys.tsx"
      >
        <DuplicateKeys />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="The empty placeholder with a custom message, and a field capped at three rows — the add button disables at the limit — with a field-level error."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
    </section>

    <PropsTable
      props={[
        {
          name: "label / hint / help",
          type: "ReactNode / ReactNode / string",
          description:
            "The label names the whole group; `help` is the collapsible explainer (plain surface, tone-tinted, so it never stacks a second card).",
        },
        {
          name: "value / onChange",
          type: "KeyValuePair[]",
          description:
            "Always controlled — `{ key, value }` pairs in, the whole array back out on every change. Rows keep stable ids internally, so typing never remounts an input.",
        },
        {
          name: "error",
          type: "string",
          description:
            'Field-level message; `role="alert"`, wired as the group&rsquo;s `aria-describedby`.',
        },
        {
          name: "keyLabel / valueLabel / addLabel / emptyState",
          type: "string / string / string / ReactNode",
          default:
            '"Key" / "Value" / "Add entry" / "No entries yet." (all translated)',
          description:
            "Copy overrides — the defaults come from the catalog, and `keyLabel`/`valueLabel` double as placeholders, column headings and row names (`Remove key 1`).",
        },
        {
          name: "flagDuplicateKeys",
          type: "boolean",
          default: "true",
          description:
            "Rows whose key repeats an earlier one are both flagged with the shared error field state — a map with two of the same key silently loses data on the way out.",
        },
        {
          name: "maxRows / disabled / isVisible",
          type: "number / boolean / boolean",
          default: "— / false / true",
          description:
            "The add button disables at the cap with a &ldquo;limit reached&rdquo; note; `isVisible={false}` renders nothing (form builders).",
        },
        {
          name: "variant / tone / corner / padding",
          type: "PlainSurfaceVariant / TrueColor / SurfaceCorner / ControlSize",
          default: '"outlined" / "blue" / "auto" / "sm"',
          description:
            "The card renders a real `Panel`, so every container surface comes for free; `plain` drops the card and keeps the rows.",
        },
        {
          name: "inputVariant / size",
          type: '"auto" | InputVariant / ControlSize',
          default: '"auto" / "sm"',
          description:
            "Row inputs&rsquo; variant — `auto` follows the card (glass card → glass inputs, tinted → ghost, boxed → flat), an explicit choice overrides — and the shared control scale for inputs and buttons. The add button follows the inputs&rsquo; variant (solid for boxed, ghost for ghost, glass for glass), and a glass card turns it glass regardless.",
        },
        {
          name: "glassOpacity / vibrancy / specularMode",
          type: "GlassOpacity / GlassVibrancy / PanelSpecularMode",
          description: "Passed through to the Panel when the surface is glass.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The whole field is a <C>role="group"</C> labelled by its heading and
          described by the field error. Inputs have no <C>id</C> to point at,{" "}
          <em>so they carry explicit</em> <C>aria-label</C>s built from the
          column copy — <C>Schlüssel 2</C>, <C>Wert 2</C> — and each row&rsquo;s
          remove button is named, not just iconed. Duplicate keys publish the
          shared <C>aria-invalid</C>. The aria-hidden column headings are
          decoration over that naming, not a substitute for it.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          Plain tabbing — no grid trap: every input, both per row, and the
          remove button of the row it stands in, then Add. Adding focuses
          nothing new automatically: the new row&rsquo;s key input arrives at
          the end of the tab order below the button. Delete happens through the
          row&rsquo;s button; there is no row-deletion shortcut.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          Column defaults, the add button, the duplicate warning, the empty
          placeholder, the limit note and the remove names all ride the catalog
          under <C>kit.keyValueArrayField.*</C>, byte-identical in English. The
          row names interpolate the (lower-cased) column copy and the row
          number, so a German row answers to{" "}
          <em>„Schlüssel schlüssel 1 entfernen&rdquo;</em> — pass{" "}
          <C>keyLabel</C> if you want the name to read differently from the
          heading.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default KeyValueArrayFieldPage;
