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
  type PropDoc,
} from "../../shared/A11ySections";
import { CollapsiblePanelPlayground } from "./CollapsiblePanelPlayground";
import DeploymentLogs from "./examples/DeploymentLogs";
import deploymentLogsCode from "./examples/DeploymentLogs.tsx?raw";
import Accordion from "./examples/Accordion";
import accordionCode from "./examples/Accordion.tsx?raw";
import BuildConfiguration from "./examples/BuildConfiguration";
import buildConfigurationCode from "./examples/BuildConfiguration.tsx?raw";
import OverflowCollapse from "./examples/OverflowCollapse";
import overflowCollapseCode from "./examples/OverflowCollapse.tsx?raw";

/**
 * Collapsible Panel's API table.
 *
 * Every row is a prop the component reads or forwards, with the line it is read
 * on. The interesting part is the split: the container half of the interface is
 * `Omit<PanelProps, "title" | "subtitle" | "actions" | "children" | "onToggle">`
 * (<code>:14-18</code>) spread straight onto the card, and the disclosure half is
 * five props of its own — where <code>expanded</code> alone decides which of the
 * two components this is.
 */

export const COLLAPSIBLE_PANEL_PROPS: PropDoc[] = [
  {
    name: "title",
    type: "ReactNode",
    default: "— required",
    description:
      "The header line, in a semibold span (:139-141) — not Panel's h3, so it adds nothing to the heading outline. It is also, by default, the header's accessible name.",
  },
  {
    name: "subtitle",
    type: "ReactNode",
    default: "— absent",
    description:
      "Second header line in muted copy (:142-146). Rendered only when truthy, and it joins the header's computed name.",
  },
  {
    name: "actions",
    type: "ReactNode",
    default: "— absent",
    description:
      "Right of the header, before the chevron (:156-166) — a node, not Panel's PanelAction[]. Clicks and key presses inside it are stopped before they reach the header (:161-162), so activating something there does not toggle the card.",
  },
  {
    name: "headerLabel",
    type: "string",
    default: "— absent",
    description:
      "aria-label on the header (:121). The header is a div with role=\"button\" (:114-116), so its name is computed from everything inside it — title, subtitle, action labels. Set this whenever title is not a plain string.",
  },
  {
    name: "children",
    type: "ReactNode",
    default: "— required",
    description:
      "The content, rendered in a role=\"region\" box labelled by the header (:198-201) and reachable by landmark navigation.",
  },
  {
    name: "defaultExpanded",
    type: "boolean",
    default: "false",
    description:
      "Starting state, uncontrolled (:242,266). Read once, by useState. Ignored the moment expanded is passed — and passing expanded={false} counts as passing it (:267).",
  },
  {
    name: "expanded",
    type: "boolean",
    default: "— uncontrolled",
    description:
      "Controlled mode. The test is typeof expanded === \"boolean\" (:267), so omitting the prop and passing false are two different components: the first lets the header drive itself, the second keeps the card shut under a parent.",
  },
  {
    name: "onToggle",
    type: "(expanded: boolean) => void",
    default: "— absent",
    description:
      "Called with the value the card is about to take, in controlled mode too (:277-282) — which is why a controlled card without it has a header that fires into the void. Suppressed while disabled (:278).",
  },
  {
    name: "contentMaxHeight",
    type: "number",
    default: "320",
    description:
      "Inline maxHeight: min(Npx, 65vh) on the content box (:220-223); the viewport half of that min() is not a prop, so a large number stops being the answer on a short screen. Not read while fillHeight is on.",
  },
  {
    name: "minExpandedHeight",
    type: "number | string",
    default: "— absent",
    description:
      "Inline minHeight on the content box (:227), holding it a stable size through the 0fr→1fr grid transition instead of letting it spring to full content height first (:224-226).",
  },
  {
    name: "fillHeight",
    type: "boolean",
    default: "false",
    description:
      "Expanded content stretches to the parent instead of scrolling: overflow-hidden in place of the thin scrollbar (:216), min-h-0 flex-1 on the grid (:193), and the card becomes flex min-h-0 flex-col rather than shrink-0 (:288). Needs a parent with a height to fill.",
  },
  {
    name: "contentClassName",
    type: "string",
    default: "— absent",
    description:
      "Appended last to the content box's classes (:211-217), so a caller's p-4 beats the inset the padding prop produced.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description:
      "Header out of the tab order and aria-disabled on (:117,120), click and key handlers removed (:122-123), cursor-not-allowed opacity-60 (:134). Forwarded to Panel as well, which dims the card its own way. The content stays rendered either way.",
  },
  {
    name: "variant",
    type: "PanelVariant",
    default: "elevated",
    description:
      "Forwarded to Panel (:291). This component keeps Panel's own default rather than inventing one (:253).",
  },
  {
    name: "tone",
    type: "SurfaceTone",
    default: "none",
    description:
      "Forwarded, and resolved once — resolvePanelTone(tone, color) (:264, Panel.tsx:495-497) — so the card and the header's hover wash and focus ring can never disagree. tone wins over the deprecated color alias.",
  },
  {
    name: "padding",
    type: "SurfacePadding",
    default: "sm",
    description:
      "The one container prop that does not reach the card: it is the inset of the header and the content box (:91,132,214) while the card itself is pinned padding=\"none\" (:293), which keeps the header's hover wash flush with the card edge.",
  },
  {
    name: "corner",
    type: "SurfaceCorner",
    default: "rounded-md",
    description:
      "Forwarded (:294) from DEFAULT_SURFACE_CORNER (:256, Theme.ts:1531). The header takes rounded-[inherit] with rounded-b-none so it follows the card (:128-131).",
  },
  {
    name: "raisedSurface",
    type: "boolean",
    default: "false",
    description:
      "Forwarded (:298) — Panel's nested-panels depth step, for a card sitting on a background of its own tint.",
  },
  {
    name: "transparency / specularMode / vibrancy / glassOpacity",
    type: "PanelProps",
    default: "— variant's own",
    description:
      "Forwarded, and consumed by Panel alone. transparency rewrites the slash-alpha fills of whichever variant is showing; specularMode covers glass, liquid-glass and default (Panel.tsx:391); vibrancy and glassOpacity are read only in the liquid branch (Panel.tsx:958,1011-1012) — everywhere else they are forwarded into code that changes nothing.",
  },
  {
    name: "hoverable",
    type: "boolean",
    default: "false",
    description:
      "This component overrides Panel here (:258): Panel would resolve an absent hoverable to Boolean(onClick) (Panel.tsx:725), and a card whose only control is its header should not light up as though the whole card were a button. The header has its own wash (:135).",
  },
  {
    name: "loading, loader*",
    type: "PanelProps",
    default: "false / skeleton",
    description:
      "Forwarded. With the default loaderType=\"skeleton\", Panel returns its skeleton in place of the whole body (Panel.tsx:1233-1236) — header included, because the header is one of Panel's children here. aria-busy stays on the card (Panel.tsx:1328).",
  },
  {
    name: "scrollable",
    type: "boolean",
    default: "— pinned false",
    description:
      "Set by the component (:297): the content box owns its own scroll, so a second scroller from Panel would only nest inside it.",
  },
  {
    name: "className",
    type: "string",
    default: "— absent",
    description:
      "Merged onto the card after the transition and shrink-0 classes (:286-290), so your classes win the collision.",
  },
  {
    name: "…Panel props",
    type: "PanelProps",
    default: "Panel's own",
    description:
      "Everything else is spread onto the card (:298) — media, badge, icon, description, decoration, transparency, glass knobs, active, pulse. Two to be careful with: description and badge render in Panel's own header above the disclosure header (Panel.tsx:594,1126-1131), duplicating what subtitle already does; and onClick makes the card a role=\"button\" with its own tab stop (Panel.tsx:1329-1330), so you would have a button-role header inside a button-role card.",
  },
  {
    name: "ref",
    type: "— none",
    default: "—",
    description:
      "A plain React.FC with no forwardRef (:238), so there is no handle on either the card or the header.",
  },
];

const NAMING_CODE = `// The plain case: the header names itself from its content.
<CollapsiblePanel title="Deployment logs">
  <LogOutput />
</CollapsiblePanel>

// A node title puts a status glyph and an environment tag into that
// computed name — say the name plainly instead (:121).
<CollapsiblePanel
  title={<span>Logs <Badge tone="rose">3 errors</Badge></span>}
  headerLabel="Deployment logs"
  actions={<Button onClick={refresh}>Refresh</Button>}
>
  <LogOutput />
</CollapsiblePanel>`;

const I18N_CODE = `// Nothing in this component is English: every string is a prop.
const copy = useMessages("settings");

<CollapsiblePanel
  title={copy("settings.logs.title")}
  subtitle={copy("settings.logs.updated", { minutes: 5 })}
  // The region's announced name — translate it like any other string.
  headerLabel={copy("settings.logs.title")}
  actions={<Button>{copy("common.refresh")}</Button>}
>
  <LogOutput />
</CollapsiblePanel>`;

export const CollapsiblePanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Collapsible Panel"
      description="A Panel with a header that opens and closes it — so the container API (variant, tone, corner, the glass knobs) is forwarded, while padding moves inside: it insets the header and the content, and the card is pinned to padding=none so the header's hover wash stays flush with the card edge. Controlled or uncontrolled by the presence of expanded, with a header action that cannot toggle the card, a content box capped at min(contentMaxHeight, 65vh), and per-instance ids from useId so any number of panels can share a page."
    />

    <CollapsiblePanelPlayground />

    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Deployment logs"
        description="Open from the start, with a subtitle and a header action. Fourteen log lines exceed the default contentMaxHeight, so the body scrolls inside its cap; the Copy logs button stops its own clicks, so pressing it never toggles the panel."
        code={deploymentLogsCode}
        filename="DeploymentLogs.tsx"
      >
        <DeploymentLogs />
      </ExampleCard>
      <ExampleCard
        title="Accordion"
        description="Three uncontrolled panels, each starting from its own defaultExpanded. Ids come from useId (:273-275), so every aria-controls points at its own region — the version that hardcoded them made every header in the stack target the first panel's content."
        code={accordionCode}
        filename="Accordion.tsx"
      >
        <Accordion />
      </ExampleCard>
      <ExampleCard
        title="Build configuration"
        description="Uncontrolled and collapsed: defaultExpanded is the starting state and nothing more, and the component owns the value from there (:266-268)."
        code={buildConfigurationCode}
        filename="BuildConfiguration.tsx"
      >
        <BuildConfiguration />
      </ExampleCard>
      <ExampleCard
        title="Collapse overflowing content"
        description="The controlled form — the external button and the header both drive one piece of parent state. Two nested scroll areas sit inside a body capped at contentMaxHeight of 180 with a minExpandedHeight of 100 holding its floor, which is what keeps the card from springing to full content height before it collapses (the 0fr→1fr grid transition reads that floor, :224-227)."
        code={overflowCollapseCode}
        filename="OverflowCollapse.tsx"
      >
        <OverflowCollapse />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The header is a <C>div</C> with <C>role="button"</C> (
          <C>:114-116</C>), not a native <C>&lt;button&gt;</C>: <C>actions</C>{" "}
          may render its own button, and nesting one inside another is invalid
          markup. It carries <C>aria-expanded</C> and <C>aria-controls</C> at the
          content (<C>:118-119</C>), <C>aria-disabled</C> when <C>disabled</C> (
          <C>:120</C>) and <C>aria-label</C> from <C>headerLabel</C> (
          <C>:121</C>). Its name is computed from its content — title, subtitle
          and the labels of any actions — which is why a node title needs that
          label saying the name plainly.
        </p>
        <p>
          The content is a <C>role="region"</C> labelled by the header (
          <C>:198-201</C>), so it is reachable by landmark navigation. Collapsed,
          it is <C>inert</C> and <C>aria-hidden</C> rather than <C>hidden</C> (
          <C>:202-207</C>): <C>hidden</C> would be <C>display: none</C> and kill
          the transition, while <C>inert</C> keeps it out of the tab order and out
          of the announcement without freezing the animation. Ids come from{" "}
          <C>useId</C> (<C>:273-275</C>), so panels never share an{" "}
          <C>aria-controls</C> target. One asymmetry worth knowing: Panel&rsquo;s
          own <C>title</C> renders an <C>h3</C> (Panel.tsx:1082) and this one a{" "}
          <C>span</C> (<C>:139</C>), so a collapsible section adds nothing to the
          heading outline — put a real heading in <C>children</C> if readers
          navigate by headings.
        </p>
        <A11yCode filename="Naming.tsx" code={NAMING_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          The header is a real tab stop (<C>tabIndex</C> 0, or -1 when{" "}
          <C>disabled</C> — <C>:117</C>) with a focus-visible ring from the
          surface&rsquo;s trigger tokens (<C>:135</C>, Theme.ts:1197) — inset,
          because the card clips it with <C>overflow: hidden</C> (
          Theme.ts:1180-1182). Its Enter and Space handling fires only when the
          header itself has focus (<C>:96-98</C>): without that guard, pressing
          Enter on a header button bubbled up and toggled the panel as well.
          Space&rsquo;s default scroll is prevented (<C>:100</C>). Actions are
          wrapped in a <C>div</C> that stops both activation paths (
          <C>:161-162</C>), so the guard has two independent layers. While{" "}
          <C>disabled</C>, the click and key handlers are not attached at all (
          <C>:122-123</C>), and collapsed content is skipped entirely because it
          is <C>inert</C> (<C>:207</C>); expanded content and header actions take
          their own tab stops.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: (
                <>
                  Reaches the header. Collapsed content is{" "}
                  <C>inert</C> and never receives focus (<C>:207</C>).
                </>
              ),
            },
            {
              keys: ["enter"],
              action: (
                <>
                  Toggles the panel, but only while the header itself is focused
                  (<C>:96-99</C>).
                </>
              ),
            },
            {
              keys: ["space"],
              action: (
                <>
                  Toggles too, with <C>preventDefault()</C> so the page does not
                  scroll (<C>:100</C>).
                </>
              ),
            },
            {
              keys: ["tab", "tab"],
              action: (
                <>
                  Into the expanded content and its header actions, each with
                  their own stops. There is no <C>Escape</C> binding to close the
                  card.
                </>
              ),
            },
          ]}
        />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The component contributes no strings of its own — there is no i18n
          import anywhere in the file (<C>:1-12</C>), and the chevron is an{" "}
          <C>aria-hidden</C> icon (<C>:176</C>) rather than a labelled control.
          Everything a reader hears comes from props: <C>title</C>,{" "}
          <C>subtitle</C>, <C>actions</C>, <C>children</C> and{" "}
          <C>headerLabel</C>. That last one is the easy miss — it is the{" "}
          <em>announced name</em> of the header (<C>:121</C>), so treat it as
          copy, not as a debugging hook.
        </p>
        <p>
          Direction mostly follows the document: the header is a{" "}
          <C>flex … gap-3</C> row (<C>:128</C>) and the chevron rotates (
          <C>rotate-180</C>, <C>:174</C>) rather than flipping, so neither needs
          mirroring. Two physical details to watch in an RTL layout: the header is
          <C>text-left</C> (<C>:128</C>), which keeps title and subtitle
          left-aligned regardless of direction, and the action cluster is{" "}
          <C>h-5 shrink-0</C> (<C>:156</C>) — it never gives way, so a long
          translated title wraps under itself while a wide action button keeps its
          ground.
        </p>
        <A11yCode filename="Translations.tsx" code={I18N_CODE} />
      </A11yTopic>

      <A11yTopic title="Motion">
        <p>
          Opening is a <C>grid-template-rows</C> transition,{" "}
          <C>0fr → 1fr</C> with an opacity fade (<C>:190-196</C>) — chosen over
          the earlier <C>max-height</C> guess, which either clipped tall content
          or let the panel coast through empty slack (<C>:183-189</C>). That one
          is gated: <C>motion-reduce:transition-none</C> (<C>:192</C>) leaves a
          reader who asked for less motion with an instant open and close.
        </p>
        <p>
          Two animations are <em>not</em> gated, and both are worth knowing
          before a designer files the bug: the chevron&rsquo;s{" "}
          <C>transition-transform duration-300</C> (<C>:172</C>) keeps rotating,
          and the card&rsquo;s <C>transition-all duration-300</C> (<C>:287</C>)
          keeps easing the height. The collapsed half stays animatable precisely
          because it is <C>inert</C> instead of <C>hidden</C> (<C>:203-207</C>) —
          the same choice that keeps it out of the accessibility tree is what lets
          it animate at all.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable props={COLLAPSIBLE_PANEL_PROPS} />
  </div>
);

export default CollapsiblePanelPage;
