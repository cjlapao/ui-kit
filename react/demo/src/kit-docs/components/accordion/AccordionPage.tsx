import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11yCode,
  A11ySection,
  A11yTopic,
  C,
  KeyboardSupportTable,
  PropsTable,
} from "../../shared/A11ySections";
import { AccordionPlayground } from "./AccordionPlayground";
import CloudRegions from "./examples/CloudRegions";
import cloudRegionsCode from "./examples/CloudRegions.tsx?raw";
import Faq from "./examples/Faq";
import faqCode from "./examples/Faq.tsx?raw";
import GlassSettings from "./examples/GlassSettings";
import glassSettingsCode from "./examples/GlassSettings.tsx?raw";

export const AccordionPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Accordion"
      description="A stacked disclosure list built on Panel — every container surface, tone, corner and padding, on the shared control size, and standing on the container standard: elevated, tone blue, sm padding, medium corner. Independent ids per instance, inert collapsed content, APG arrow-key navigation and per-row loaders."
    />
    <AccordionPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Cloud regions"
        description="Dense rows with icons, badges and a per-row refresh action. The action's click never toggles the row, and the row shows its own loader while it refreshes."
        code={cloudRegionsCode}
        filename="CloudRegions.tsx"
      >
        <CloudRegions />
      </ExampleCard>
      <ExampleCard
        title="Faq"
        description="Plain rows in the outlined surface — one open by default, the rest collapsed and inert."
        code={faqCode}
        filename="Faq.tsx"
      >
        <Faq />
      </ExampleCard>
      <ExampleCard
        title="Glass settings"
        description="A glass accordion over a busy backdrop: the surface tints with the tone and the copy keeps its contrast from the surface's text tokens."
        code={glassSettingsCode}
        filename="GlassSettings.tsx"
      >
        <GlassSettings />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          Each header is a <C>role="button"</C> element (a <C>div</C>, not a
          native <C>&lt;button&gt;</C>, because row actions may themselves be
          buttons — nesting those would be invalid markup) carrying{" "}
          <C>aria-expanded</C> and <C>aria-controls</C> into the content. The
          content is a <C>role="region"</C> labelled by its header, so each row
          is reachable by landmark navigation; while collapsed it is{" "}
          <C>inert</C> and <C>aria-hidden</C>, so it is neither announced nor
          focusable. The list itself is a <C>role="group"</C> — pass{" "}
          <C>ariaLabel</C> to name it, and with several accordions on one page
          the <C>useId</C>-based ids keep their <C>aria-controls</C> from
          colliding. An empty <C>items</C> list announces a built-in{" "}
          <em>No items</em> state; a loading row announces a built-in{" "}
          <em>Loading</em> label.
        </p>
        <A11yCode filename="Naming.tsx" code={NAMING_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          Follows the WAI-ARIA APG accordion pattern: arrows move between
          headers and never toggle, activation is explicit. Disabled rows are
          skipped by both <C>Tab</C> (out of the tab order) and the arrow walk.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: <>Move between headers; disabled rows are skipped.</>,
            },
            { keys: ["enter"], action: <>Toggle the focused row.</> },
            { keys: ["space"], action: <>Toggle the focused row.</> },
            {
              keys: ["down"],
              action: (
                <>
                  Focus the next header, wrapping at the end. Disabled rows are
                  skipped.
                </>
              ),
            },
            {
              keys: ["up"],
              action: <>Focus the previous header, wrapping at the start.</>,
            },
            { keys: ["home"], action: <>Focus the first enabled header.</> },
            { keys: ["end"], action: <>Focus the last enabled header.</> },
          ]}
        />
        <p>
          <C>Right</C> and <C>Left</C> map to the same next/previous moves as
          <C>Down</C> and <C>Up</C>. And Enter/Space only fire when the header
          itself is focused — activating a row <em>action</em> button does not
          also toggle the row, and the action area stops propagation on both
          click and keydown.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Every string the component speaks itself — the <em>No items</em>{" "}
          empty-list title and the <em>Loading</em> row label — comes from the
          built-in kit catalog, shipped in English, Spanish, French, German and
          Portuguese, and is overridable through the i18n provider like any
          other <C>kit.accordion.*</C> key. Titles, subtitles, descriptions and
          content are plain caller-supplied React nodes, so their translation is
          the application&rsquo;s business. Row order and the arrow walk follow
          the visual list, so in RTL locales the reading order stays correct;
          both arrow pairs map to previous/next, not to physical screen sides.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "items",
          type: "AccordionItem[]",
          description: (
            <>
              The rows: <C>id</C>, <C>title</C>, optional <C>subtitle</C> /{" "}
              <C>description</C> / <C>icon</C> / <C>badge</C> / <C>actions</C>,
              required <C>content</C>, plus per-row <C>disabled</C> and{" "}
              <C>loading</C>.
            </>
          ),
        },
        {
          name: "size",
          type: "ControlSize",
          default: "md",
          description: (
            <>
              Density of row type, icons and the indicator — the inset is{" "}
              <C>padding</C>&rsquo;s job.
            </>
          ),
        },
        {
          name: "indicator",
          type: '"chevron" | "plus-minus" | "none"',
          default: "chevron",
          description: (
            <>
              The expand affordance; <C>aria-hidden</C> — the header state
              carries the meaning.
            </>
          ),
        },
        {
          name: "indicatorPlacement",
          type: '"left" | "right"',
          default: "right",
          description: "Where the indicator sits in the header.",
        },
        {
          name: "animated",
          type: "boolean",
          default: "true",
          description: (
            <>
              Height transition via <C>grid-template-rows</C>; <C>false</C>{" "}
              drops the transition class, and motion-reduce users never get it.
            </>
          ),
        },
        {
          name: "multiple",
          type: "boolean",
          default: "false",
          description: (
            <>
              Allow several open rows; with <C>false</C> opening one closes the
              others.
            </>
          ),
        },
        {
          name: "defaultOpenIds",
          type: "string[]",
          description: "Initially open rows (uncontrolled).",
        },
        {
          name: "openIds",
          type: "string[]",
          description: (
            <>
              Controlled mode — pass it and the component stops keeping its own
              state; pair with <C>onChange</C>, or reuse <C>useAccordion</C>.
            </>
          ),
        },
        {
          name: "onChange",
          type: "(openIds: string[]) => void",
          description: "Fires with the new open set after every change.",
        },
        {
          name: "onItemToggle",
          type: "(id, isOpen) => void",
          description: "Per-row convenience callback.",
        },
        {
          name: "ariaLabel",
          type: "string",
          description: "Accessible name for the group of rows.",
        },
        {
          name: "itemClassName",
          type: "string",
          description: "Extra classes on each row wrapper.",
        },
        {
          name: "headerClassName",
          type: "string",
          description: "Extra classes on each header.",
        },
        {
          name: "contentClassName",
          type: "string",
          description: "Extra classes inside the content region.",
        },
        {
          name: "iconClassName",
          type: "string",
          description: "Extra classes on the icon chip.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables every row; rows stay visible at 60% opacity.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          description: (
            <>
              Replaces the list with the Panel skeleton; switch the style with{" "}
              <C>loaderType</C> (<C>"skeleton"</C> | <C>"spinner"</C> |{" "}
              <C>"progress"</C>). Per-row loaders go in the item&rsquo;s own{" "}
              <C>loading</C> field — those overlay the row with a spinner.
            </>
          ),
        },
        {
          name: "…Panel props",
          type: "PanelProps",
          description:
            "variant, tone, padding, corner, hoverable, glass props and the rest forward to the underlying Panel — standing on the container standard: elevated, tone blue, sm padding, medium corner.",
        },
      ]}
    />
  </div>
);

const NAMING_CODE = `// Name the group, and the rows are already announced correctly:
// each header gets role=button + aria-expanded, each content a labelled region.
<Accordion
  items={regions}
  ariaLabel="Cloud regions"
  multiple
  defaultOpenIds={["region-us"]}
/>`;

export default AccordionPage;
