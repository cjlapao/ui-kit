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
import { ContentActionsPlayground } from "./ContentActionsPlayground";
import AgentHeader from "./examples/AgentHeader";
import agentHeaderCode from "./examples/AgentHeader.tsx?raw";
import { NoActions } from "./examples/NoActions";
import noActionsCode from "./examples/NoActions.tsx?raw";
import { ScrollingActions } from "./examples/ScrollingActions";
import scrollingActionsCode from "./examples/ScrollingActions.tsx?raw";

export const ContentActionsPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Content Actions"
      description="A neutral two-region layout: content yields width as the actions grow, and the actions stay on one row, scrolling sideways when space runs out. It is deliberately inert — no surface, no padding, no ARIA role and no key handling of its own — so it can sit inside any card, header or row without arguing with it."
    />
    <ContentActionsPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Growing actions"
        description="Adjust the width or drag the preview corner, then hover each action. ExpandableButton grows as its label slides out, and the content gives up exactly that much width. The surrounding border belongs to this example — ContentActions adds no surface or padding."
        code={agentHeaderCode}
        filename="AgentHeader.tsx"
      >
        <AgentHeader />
      </ExampleCard>
      <ExampleCard
        title="Actions omitted"
        description="With no actions prop there is no second region at all: the presence test at :25 rejects undefined, null and false alike, and the row is skipped at :35 rather than rendered empty — so no gap is left behind where it would have been."
        code={noActionsCode}
        filename="NoActions.tsx"
      >
        <NoActions />
      </ExampleCard>
      <ExampleCard
        title="Row that scrolls"
        description="Six actions in a 320 px box. flex-nowrap and [&amp;&gt;*]:shrink-0 (:39) forbid both wrapping and squashing, so the row overflows into a scroll area instead. Tab to the right-hand buttons and the browser scrolls them into view — the row is a scroll container, not a clip."
        code={scrollingActionsCode}
        filename="ScrollingActions.tsx"
      >
        <ScrollingActions />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          There is no <C>role</C>, no <C>aria-*</C> and no <C>tabIndex</C> anywhere in
          the 51 lines of <C>ContentActions.tsx</C>: the root, the content region and
          the actions region are plain <C>div</C>s (<C>:27-45</C>), which is exactly
          what a layout primitive should be. The kit&rsquo;s own test is the guardian of
          that — it asserts <C>queryByRole(&quot;toolbar&quot;)</C> is null after
          rendering its actions (<C>ContentActions.test.tsx:18</C>) and repeats the
          check for every alignment (:44). A <C>toolbar</C> role would be a promise this
          component cannot keep: the ARIA pattern expects arrow keys to move focus
          between the items, and nothing here moves focus at all.
        </p>
        <p>
          So the names have to arrive with the actions. The playground&rsquo;s{" "}
          <C>ExpandableButton</C>s get theirs from the same fallback chain as everyone
          else (<C>aria-label</C> → <C>srLabel</C> → the string label, ExpandableButton.tsx:466)
          and an sr-only span keeps that name while the visible label is{" "}
          <C>aria-hidden</C> in its collapsed state (:437,:469); a plain{" "}
          <C>&lt;button&gt;Edit&lt;/button&gt;</C> is named by its text and works just as
          well, which is what the kit&rsquo;s test does (:16). Order is DOM order and
          nothing else: content first, actions second, with the test pinning{" "}
          <C>firstElementChild.textContent</C> (:15). Two absences are load-bearing — an
          omitted <C>actions</C> region is not in the tree at all (:35), so no empty
          group is announced, and the sideways scroll at :39 hides buttons{" "}
          <em>visually</em> only: clipped actions remain in the accessibility tree and
          scroll into view when focused.
        </p>
        <A11yCode filename="NamingActions.tsx" code={NAMING_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          <C>ContentActions.tsx</C> compares no key and installs no listener: no{" "}
          <C>onKeyDown</C>, <C>onKeyUp</C>, <C>onKeyPress</C> or{" "}
          <C>addEventListener</C> appears in the file, and it never moves focus, traps
          it, or restores it. Everything below is the browser doing its ordinary thing
          with two divs — the value the component adds is in what it declines to
          interfere with.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: (
                <>
                  Into the actions in DOM order (:44 renders the nodes untouched) and
                  out again. The row is a scroll container (<C>overflow-x-auto</C>, :39),
                  so focusing a button that has scrolled past the edge brings it into
                  view — the reason a clipped row is still reachable.
                </>
              ),
            },
            {
              keys: ["arrow"],
              action: (
                <>
                  Nothing, and that is the point. A real toolbar moves focus between its
                  items with the arrow keys; this component implements none of that,
                  which is precisely why it claims no toolbar role (:26-47, pinned by{" "}
                  <C>ContentActions.test.tsx:18</C>,:44). Arrow keys do whatever the
                  focused control itself does with them.
                </>
              ),
            },
            {
              keys: ["Any"],
              action: (
                <>
                  Nothing at this level. No key is compared between the root (
                  <C>:27</C>) and the actions region (<C>:43-45</C>), so{" "}
                  <C>Enter</C>, <C>Space</C> and <C>Escape</C> reach the buttons
                  unhandled — and <C>&#123;...rest&#125;</C> at :28 means{" "}
                  <C>onKeyDown</C> passed from outside lands on the root div, where the
                  browser&rsquo;s bubbling gives the actions first refusal.
                </>
              ),
            },
          ]}
        />
        <p>
          If a row of actions genuinely needs arrow-key navigation, the role and the
          key handling belong to the consumer — a wrapper that owns both, with a
          documented focus order. Adding the role to this component would advertise a
          behaviour no one implemented.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The component owns no strings. There is nothing to translate, no{" "}
          <C>useKitT</C> and no key into <C>common/i18n/builtIn/</C>: its entire
          vocabulary is Tailwind classes and the three <C>data-slot</C> markers (
          <C>:29</C>,<C>:32</C>,<C>:37</C>) that let a consumer style the regions
          without depending on internal class names. Text arrives only as{" "}
          <C>children</C> and <C>actions</C> and is rendered untouched (
          <C>:33</C>,<C>:44</C>) — whatever language the application is in, the component
          repeats it faithfully.
        </p>
        <p>
          Direction comes for free because both rows are flex rows (
          <C>flex</C> at <C>:30</C> and <C>:39</C>), and a flex row follows the writing
          mode: with <C>dir=&quot;rtl&quot;</C> the content sits at the right and the
          actions at the left, with no prop to flip and no class to undo. The horizontal
          distribution is direction-agnostic too — <C>flex-1</C> on the content (
          <C>:32</C>) and <C>flex-initial</C> on the actions (<C>:39</C>) are logical,
          and so is <C>gap</C>, which is why the same five classes serve both
          directions. <C>align</C> stays what it always is, the cross axis (
          <C>:30</C>), so it never quietly becomes a start/end knob under RTL. Line
          breaking is left where it belongs: <C>truncate</C> and <C>line-clamp-*</C> are
          classes the caller passes in, so a CJK title breaks as CJK text should and the
          content region&rsquo;s <C>min-w-0</C> (<C>:32</C>) is what makes shrinking
          possible in the first place.
        </p>
        <A11yCode filename="RightToLeft.tsx" code={RTL_CODE} />
      </A11yTopic>

      <A11yTopic title="The flex chain">
        <p>
          Four declarations decide everything here. The root is{" "}
          <C>flex min-w-0 flex-nowrap</C> (<C>:30</C>); the content is{" "}
          <C>min-w-0 flex-1</C> (<C>:32</C>); the actions are{" "}
          <C>flex min-w-0 flex-initial flex-nowrap items-center overflow-x-auto</C>{" "}
          with <C>[&amp;&gt;*]:shrink-0</C> (<C>:39</C>); and <C>gap</C> is applied to
          both rows from one map (<C>:30</C>,<C>:40</C>). The <C>min-w-0</C> appears
          three times because a flex item&rsquo;s default minimum size is its content —
          without it, one long word in the title would widen the whole component instead
          of truncating, and no amount of <C>truncate</C> on the child would help.
        </p>
        <p>
          <C>flex-initial</C> on the actions row (<C>:39</C>) is <C>0 1 auto</C>: it
          takes its content width, never grows past it, and may shrink to fit the
          container. Since its children are <C>shrink-0</C>, shrinking the row can only
          mean one thing — the row scrolls (<C>overflow-x-auto</C>) rather than squashing
          an icon into 12 pixels. That pair is the whole contract: actions keep their
          intrinsic widths, content gives up its width first, and nothing wraps.
          Meanwhile the component adds no padding, no margin and no surface of its own (
          <C>:26-47</C>), so it inherits the rhythm of whatever card holds it, and nothing
          animates: there is no <C>transition</C>, <C>animate</C> or{" "}
          <C>motion-reduce</C> class in the file, so the only motion in these examples
          comes from the buttons the caller supplies.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable props={CONTENTACTIONS_PROPS} />
  </div>
);

/**
 * The API as declared at :9-12 — four props of its own plus the two from
 * `ContentActionsLayoutProps`, with the pass-through and the absences named
 * rather than glossed.
 */
export const CONTENTACTIONS_PROPS: PropDoc[] = [
  {
    name: "children",
    type: "ReactNode",
    default: "— renders an empty content region",
    description: (
      <>
        Whatever fills the flexible region (:33). The region adds{" "}
        <C>min-w-0 flex-1</C> and nothing else (:32), so truncation,{" "}
        <C>line-clamp</C> and line breaking stay in the caller&rsquo;s hands.
      </>
    ),
  },
  {
    name: "actions",
    type: "ReactNode",
    default: "— absent (the region is not rendered)",
    description: (
      <>
        The single row of actions (:44). Rendered only when{" "}
        <C>actions != null &amp;&amp; typeof actions !== &quot;boolean&quot;</C> (
        <C>:25</C>,<C>:35</C>) — <C>undefined</C>, <C>null</C> and <C>false</C> all
        remove the region entirely, and each action must bring its own accessible name.
      </>
    ),
  },
  {
    name: "gap",
    type: "ControlSize",
    default: "md",
    description: (
      <>
        <C>xs</C> <C>sm</C> <C>md</C> <C>lg</C> <C>xl</C> → <C>gap-1</C>…
        <C>gap-6</C> (<C>common/components/contentActions.ts:12-18</C>). Applied twice:
        between the two regions (<C>:30</C>) and between the actions themselves (
        <C>:40</C>).
      </>
    ),
  },
  {
    name: "align",
    type: '"start" | "center" | "end"',
    default: "start",
    description: (
      <>
        Cross-axis only — <C>items-start</C>, <C>items-center</C> or{" "}
        <C>items-end</C> (<C>:30</C> with the map at{" "}
        <C>contentActions.ts:19-23</C>). The horizontal split is{" "}
        <C>flex-1</C> versus <C>flex-initial</C> (<C>:32</C>,<C>:39</C>), not this prop.
      </>
    ),
  },
  {
    name: "contentClassName",
    type: "string",
    default: "— none added",
    description: (
      <>
        Appended to <C>min-w-0 flex-1</C> on the content region (<C>:32</C>).{" "}
        <C>overflow-hidden</C> is the one that matters: without it a long word widens
        the flex item instead of ellipsizing the title.
      </>
    ),
  },
  {
    name: "actionsClassName",
    type: "string",
    default: "— none added",
    description: (
      <>
        Appended to the actions row&rsquo;s own classes (:41) — the hook for anything
        beyond <C>flex-nowrap</C>, <C>items-center</C> and <C>overflow-x-auto</C> (
        <C>:39</C>).
      </>
    ),
  },
  {
    name: "className",
    type: "string",
    description: (
      <>
        Merged <em>after</em> the layout classes on the root (:30), so it adds to{" "}
        <C>flex min-w-0 flex-nowrap</C> and the align/gap maps rather than replacing
        them; the kit&rsquo;s test pins that both survive (:30 of the test).
      </>
    ),
  },
  {
    name: "style",
    type: "CSSProperties",
    description: (
      <>
        Part of <C>&#123;...rest&#125;</C> on the root (:28) — the documented way to size
        the box around these regions, since the component never sizes itself.
      </>
    ),
  },
  {
    name: "aria-label",
    type: "string",
    default: "— none applied",
    description: (
      <>
        Passes through to the root div (:9,:28). With no role applied (:26-47) most
        assistive tech will not announce it, so a name on the wrapper is decoration:
        name the actions, not the layout.
      </>
    ),
  },
  {
    name: "role",
    type: "AriaRole",
    default: "— none applied",
    description: (
      <>
        Also just a pass-through (:9,:28). Adding <C>toolbar</C> here would promise
        arrow-key focus movement that nothing implements — the test asserts the role is
        absent (<C>ContentActions.test.tsx:18</C>,:41), so add it only together with the
        key handling that makes it true.
      </>
    ),
  },
  {
    name: "…div props",
    type: "HTMLAttributes<HTMLDivElement>",
    description: (
      <>
        Spread onto the root before the component&rsquo;s own attributes (:28), so{" "}
        <C>id</C>, <C>data-*</C> and event handlers land there (
        <C>ContentActions.test.tsx:29-35</C>) — but{" "}
        <C>data-slot</C> is written after the spread (:29) and always wins.
      </>
    ),
  },
  {
    name: "ref",
    type: "— none",
    description: (
      <>
        A plain function component (:15) with no <C>forwardRef</C> and no imperative
        handle; reach the regions through their <C>data-slot</C> markers (
        <C>:29</C>,<C>:32</C>,<C>:37</C>) if you need a node.
      </>
    ),
  },
];

const NAMING_CODE = `// The regions are unnamed divs. Name the things inside them instead.
<ContentActions
  actions={
    <>
      {/* ExpandableButton's visible label is aria-hidden while collapsed, so the
          name comes from aria-label -> srLabel -> the label string (:466). */}
      <ExpandableButton icon="Trash" label="Delete agent" srLabel="Delete agent" />
      <button onClick={save}>Save</button>
    </>
  }
>
  <h3 className="truncate">Brainstormer</h3>
</ContentActions>;

// Wrong: a role the component cannot honour. It claims arrow-key navigation and
// offers none, and the kit's own test asserts the role is absent.
<ContentActions role="toolbar" actions={row}>
  <h3 className="truncate">Brainstormer</h3>
</ContentActions>;`;

const RTL_CODE = `// Nothing to flip: both rows are flex rows, so they follow the writing mode.
<div dir="rtl">
  <ContentActions gap="sm" align="center" contentClassName="overflow-hidden" actions={row}>
    <h3 className="truncate text-lg font-semibold">المولّد</h3>
  </ContentActions>
</div>;

// The content now sits at the right and the actions at the left; gap, flex-1 and
// flex-initial are all logical, and align still means the vertical axis (:30).`;

export default ContentActionsPage;
