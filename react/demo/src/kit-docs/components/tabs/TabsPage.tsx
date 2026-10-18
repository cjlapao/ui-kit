import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11ySection,
  A11yTopic,
  C,
  Kbd,
  PropsTable,
} from "../../shared/A11ySections";
import { TabsPlayground } from "./TabsPlayground";
import EveryVariant from "./examples/EveryVariant";
import everyVariantCode from "./examples/EveryVariant.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import Orientation from "./examples/Orientation";
import orientationCode from "./examples/Orientation.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import Glass from "./examples/Glass";
import glassCode from "./examples/Glass.tsx?raw";

export const TabsPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Tabs"
      description="Switch between panes with icons, descriptions, badges and contextual actions pinned to the active tab. Seven variants — including glass and liquid glass — plus size, tone, orientation and justify; tall panels scroll on the kit's own ScrollArea."
    />
    <TabsPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Every variant"
        description="All seven variants at one tone and size, on a backdrop so the glass fills have something to blur."
        code={everyVariantCode}
        filename="EveryVariant.tsx"
      >
        <EveryVariant />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared sm / md / lg scale with icons, underline variant."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="All 21 true colours, underline at sm."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
      <ExampleCard
        title="Orientation"
        description="The same soft bar running horizontally and vertically."
        code={orientationCode}
        filename="Orientation.tsx"
      >
        <Orientation />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="Icon, description, badge, a disabled tab and contextual actions on the active tab."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Glass"
        description="Glass with a classic highlight and liquid glass with a halo — the active tab carries a tone ring."
        code={glassCode}
        filename="Glass.tsx"
      >
        <Glass />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The bar is a real <code>role=&quot;tablist&quot;</code> of{" "}
          <code>role=&quot;tab&quot;</code>s carrying <code>aria-selected</code>{" "}
          and the <code>aria-orientation</code> you chose; each tab with a panel
          wires <C>aria-controls</C> to a <code>role=&quot;tabpanel&quot;</code>{" "}
          labelled back by <code>aria-labelledby</code>. Only the active panel
          is rendered visible (native <code>hidden</code>, not a fake), and
          icons stay decorative inside the label. Badges and descriptions are
          read as part of the tab&rsquo;s name — a badge of &ldquo;2&rdquo;
          announces &ldquo;Alerts 2&rdquo;, which is the point.
        </p>
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          One tab stop, the APG way: <Kbd>Tab</Kbd> lands on the selected tab —
          the others carry <code>tabIndex=&quot;-1&quot;</code>, so the bar
          never floods the page tab order — and from there <Kbd>ArrowRight</Kbd>
          /<Kbd>ArrowLeft</Kbd> walk the list (<Kbd>ArrowUp</Kbd>/
          <Kbd>ArrowDown</Kbd> when vertical), skipping disabled tabs and
          wrapping at the ends, <Kbd>Home</Kbd>/<Kbd>End</Kbd> jump to the ends,
          and selection follows focus (automatic activation). This keyboard
          model is new — the roving tabindex existed but the arrow keys did not,
          which made the bar a dead end. In controlled mode focus follows the
          owner&rsquo;s decision: if the change is refused, focus stays put
          rather than stranding on a tab nobody selected. A bar too wide for its
          container scrolls through kit <em>ScrollArea</em> lanes (the{" "}
          <code>hover</code> variant — the same virtual bars the rest of the kit
          shows), and arrow navigation scrolls the reached tab into view; the
          scroll viewports stay out of the tab order because the tabs already
          own the keyboard.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Tabs own no strings — every label, description, badge and action name
          is caller data and localizes with the page. Two layout notes for
          translation: tab labels grow, so test a German pass before shipping{" "}
          <code>justify=&quot;between&quot;</code> or <code>fullWidth</code>,
          and vertical bars trade horizontal stretching for vertical stacking,
          which long translations survive better.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "items",
          type: "TabItem[]",
          description:
            "`{ id, label, icon?, description?, badge?, badgeColor?, disabled?, panel?, actions? }`. `panel` is the pane content; without it the tab switches nothing but `onChange`.",
        },
        {
          name: "value / defaultValue",
          type: "string",
          description:
            "Controlled / uncontrolled active id. Uncontrolled defaults to the first item — and if the active item vanishes from `items`, selection falls back to the first.",
        },
        {
          name: "onChange",
          type: "(id, item) => void",
          description:
            "Fires on selection changes — not on reselecting the active tab unless `allowReselect`. Keyboard activation fires it identically.",
        },
        {
          name: "allowReselect",
          type: "boolean",
          default: "false",
          description:
            "Clicking the active tab is silent by default; set true to make it a refresh gesture.",
        },
        {
          name: "variant",
          type: "TabsVariant",
          default: '"underline"',
          description:
            "underline · soft · pill · segmented · minimal · glass · liquid-glass. The glass pair takes the full glass sub-vocabulary.",
        },
        {
          name: "size / color",
          type: "TabsSize / TrueColor",
          default: '"md" / "blue"',
          description:
            "The whole shared control scale (xs→xl, the same five steps as Button) and the 21-tone palette — the md row aligns with md buttons and inputs.",
        },
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description:
            "Also switches the arrow axis and announces itself via aria-orientation. For the column to scroll on its own (rather than the page scrolling the whole component), Tabs needs a definite height — put it on the Tabs itself or a wrapper, not just an outer Panel.",
        },
        {
          name: "justify / fullWidth",
          type: "TabsJustify / boolean",
          default: '"start" / false',
          description:
            "start · center · end · between (horizontal only); fullWidth stretches every tab to share the row.",
        },
        {
          name: "showDividers",
          type: "boolean",
          default: "false",
          description:
            "Rules between tabs — underline and minimal variants only, where nothing else separates them.",
        },
        {
          name: "actionsColor",
          type: '"auto" | TrueColor',
          default: '"auto"',
          description:
            "Colour of the active tab&rsquo;s action icons, rendered as ghost IconButtons (the SplitView collapse shape, label as tooltip). auto follows the tabs&rsquo; color — neutral glyphs wash out on glass and image hosts — with a per-action color still winning over it.",
        },
        {
          name: "vibrancy / glassOpacity / specularMode / radius",
          type: "GlassVibrancy / GlassOpacity / SpecularMode / TabsRadius",
          default: "medium / frosted / none / md",
          description:
            "The glass-variant chrome — fill, rim, specular paint and pill corner.",
        },
        {
          name: "containerClassName / listClassName / panelClassName / className",
          type: "string",
          description:
            "Class overrides at each layer; containerClassName also overrides hideUnderlineContainer.",
        },
      ]}
    />

    <p className="text-xs opacity-70">
      Disabled tabs are natively <code>disabled</code> — skipped by arrows,
      inert to clicks. Actions render only for the <em>active</em> tab&rsquo;s
      <code>actions</code> array; icon actions get an IconButton whose
      accessible name is the action&rsquo;s string label. Crowded bars scroll:
      without actions the whole bar is one <code>ScrollArea</code> lane; with
      them the tabs take the free space and the actions a 20%-capped lane, each
      its own <code>ScrollArea</code>, so neither clips the other.
    </p>
  </div>
);

export default TabsPage;
