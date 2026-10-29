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
import { CollapsiblePanelPlayground } from "./CollapsiblePanelPlayground";
import DeploymentLogs from "./examples/DeploymentLogs";
import deploymentLogsCode from "./examples/DeploymentLogs.tsx?raw";
import BuildConfiguration from "./examples/BuildConfiguration";
import buildConfigurationCode from "./examples/BuildConfiguration.tsx?raw";
import Accordion from "./examples/Accordion";
import accordionCode from "./examples/Accordion.tsx?raw";
import OverflowCollapse from "./examples/OverflowCollapse";
import overflowCollapseCode from "./examples/OverflowCollapse.tsx?raw";


export const CollapsiblePanelPage: React.FC = () => (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Collapsible Panel"
      description="Accordion-style panel built on Panel, so it takes every container surface, tone, corner and padding — and the container standard for its defaults: elevated, tone blue, sm padding, medium corner. Controlled or uncontrolled, with a header action, a scrollable content cap and independent ids per panel."
    />
    <CollapsiblePanelPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard title="Collapse overflowing content"
        description="Two nested scroll areas inside a body capped at 180px. Scroll the lists, then collapse using the header or external button. The panel should shrink directly without first expanding to its full content height."
        code={overflowCollapseCode} filename="OverflowCollapse.tsx">
        <OverflowCollapse />
      </ExampleCard>
      <ExampleCard
        title="Deployment logs"
        description="An open panel with a subtitle and a header action. The log output exceeds `contentMaxHeight`, so the body scrolls instead of growing."
        code={deploymentLogsCode}
        filename="DeploymentLogs.tsx"
      >
        <DeploymentLogs />
      </ExampleCard>
      <ExampleCard
        title="Build configuration"
        description="Uncontrolled and collapsed: `defaultExpanded` sets the starting state, and each panel keeps its own ids, so several can coexist."
        code={buildConfigurationCode}
        filename="BuildConfiguration.tsx"
      >
        <BuildConfiguration />
      </ExampleCard>
      <ExampleCard
        title="Accordion"
        description="Three uncontrolled panels stacked — each toggles independently, and their header ids stay distinct."
        code={accordionCode}
        filename="Accordion.tsx"
      >
        <Accordion />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The header is a <C>role="button"</C> element (not a native{" "}
          <C>&lt;button&gt;</C>, because header actions may contain buttons —
          nesting those would be invalid markup) carrying{" "}
          <C>aria-expanded</C> and <C>aria-controls</C> into the content. Its
          accessible name is computed from the header content — title,
          subtitle, even the action labels — so when the title is anything
          richer than a string, or actions sit in the header, pass{" "}
          <C>headerLabel</C> to say the name plainly. The content is a{" "}
          <C>role="region"</C> labelled by the header, so it is discoverable by
          landmark navigation; while collapsed it is <C>inert</C> and{" "}
          <C>aria-hidden</C> rather than <C>hidden</C> — not announced, not
          focusable, yet still able to animate open. Ids come from{" "}
          <C>useId</C>, so any number of panels can coexist on one page
          without their <C>aria-controls</C> crossing wires.
        </p>
        <A11yCode filename="Naming.tsx" code={NAMING_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          The header is a real tab stop (removed from the order when{" "}
          <C>disabled</C>). Its Enter/Space handling fires only when the header
          itself is focused — key events from header actions are stopped one
          element earlier, so activating a button never double-toggles the
          panel. Once expanded, header actions and the content pick up their
          own tab stops; collapsed content is <C>inert</C> and skipped
          entirely.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: <>Moves focus to the header.</>,
            },
            {
              keys: ["enter"],
              action: <>Toggles the panel while the header is focused.</>,
            },
            {
              keys: ["space"],
              action: <>Toggles too — and prevents the page scroll it would otherwise cause.</>,
            },
          ]}
        />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The component speaks no strings of its own: <C>title</C>,{" "}
          <C>subtitle</C>, <C>actions</C> and <C>headerLabel</C> are all yours
          to feed from your translations — <C>headerLabel</C> is the one to
          localise the region's name with, since the region is announced by
          it. The chevron is an <C>aria-hidden</C> arrow that rotates
          down/up rather than flipping, so it needs no RTL mirroring; text
          direction otherwise follows the document.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        { name: "title", type: "ReactNode", description: "Header line. Required — it forms the region's accessible name together with the subtitle, unless headerLabel overrides." },
        { name: "subtitle", type: "ReactNode", description: "Second header line, in muted copy." },
        { name: "actions", type: "ReactNode", description: "Right of the header, before the chevron. Clicks and key presses inside it do not toggle the panel." },
        { name: "headerLabel", type: "string", description: "Accessible name of the header. Use it when title is not a plain string or actions sit in the header." },
        { name: "defaultExpanded", type: "boolean", default: "false", description: "Starting state, uncontrolled." },
        { name: "expanded", type: "boolean", description: "Controlled mode — pass it and the component stops keeping its own state." },
        { name: "onToggle", type: "(expanded: boolean) => void", description: "Fires after every toggle, controlled or not." },
        { name: "children", type: "ReactNode", description: "The content. Announced as a region labelled by the header." },
        { name: "contentMaxHeight", type: "number", default: "320", description: "Content grows to here, then scrolls. Never exceeds 65vh." },
        { name: "minExpandedHeight", type: "number | string", description: "Floor for the content while expanded." },
        { name: "fillHeight", type: "boolean", default: "false", description: "Expanded content stretches to fill the available height instead of scrolling." },
        { name: "contentClassName", type: "string", description: "Extra classes on the content box." },
        { name: "disabled", type: "boolean", default: "false", description: "Toggling off, header out of the tab order, aria-disabled on." },
        { name: "loading", type: "boolean", default: "false", description: "The Panel skeleton over the card." },
        { name: "…Panel props", type: "PanelProps", description: "variant, tone, padding, corner, className and the rest forward to the underlying Panel — standing on the container standard: elevated, tone blue, sm padding, medium corner." },
      ]}
    />
  </div>
);

const NAMING_CODE = `// The plain case — the header names itself from its content.
<CollapsiblePanel title="Deployment logs">
  <LogOutput />
</CollapsiblePanel>

// A rich title or header actions muddy the computed name —
// say it plainly.
<CollapsiblePanel
  title={<span>Logs <Badge>3 errors</Badge></span>}
  headerLabel="Deployment logs"
  actions={<Button onClick={refresh}>Refresh</Button>}
>
  <LogOutput />
</CollapsiblePanel>
`;

export default CollapsiblePanelPage;
