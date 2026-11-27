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
  type KeyboardBinding,
  type PropDoc,
} from "../../shared/A11ySections";
import { SidePanelPlayground } from "./SidePanelPlayground";
import Sides from "./examples/Sides";
import sidesCode from "./examples/Sides.tsx?raw";
import Floating from "./examples/Floating";
import floatingCode from "./examples/Floating.tsx?raw";
import ActionsAndPills from "./examples/ActionsAndPills";
import actionsAndPillsCode from "./examples/ActionsAndPills.tsx?raw";

export const SidePanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Side Panel"
      description="A panel docked to any edge of its container. Out of flow it is `position: absolute`, so it needs a positioned ancestor and covers the content instead of taking a column; `docked` is the opposite — in flow, taking space, never getting a scrim. It shares Panel's surfaces, tone and size scales, and its one keyboard contract is the resize separator."
    />
    <SidePanelPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Either edge"
        description="side='right' or 'left'. It is absolutely positioned, so it fills the container it is placed in and needs a positioned ancestor."
        code={sidesCode}
        filename="Sides.tsx"
      >
        <Sides />
      </ExampleCard>
      <ExampleCard
        title="Floating and inset"
        description="floating and floating-glass are the legacy names for elevated and glass (:45-50) — and they are the two that carry an offset in their own tokens, so they arrive inset without being told (:506-513). A legacy name also keeps the older fill path, so it is bordered where its modern alias is ringed (:906-907,:961). inset sets the gap on any variant and a size picks it from the shared padding scale; radius sizes the corners that face the content."
        code={floatingCode}
        filename="Floating.tsx"
      >
        <Floating />
      </ExampleCard>
      <ExampleCard
        title="Actions strip and header pills"
        description="subHeader is a non-scrolling strip right under the title section — filters here stay put while the list scrolls beneath it (:1101). headerPills carries the count and a quick toggle, centred with the close button (:1071); headerActions stays free for the panel's real buttons. The footer never scrolls with the body (:1116)."
        code={actionsAndPillsCode}
        filename="ActionsAndPills.tsx"
      >
        <ActionsAndPills />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          What the component puts on the page is thin, and saying so is the point.
          The shell is a <C>div</C> (<C>data-sp-shell</C>, :892) and the content
          another <C>div</C> (<C>data-sp-content</C>, :1010): no{" "}
          <C>role</C>, no <C>aria-label</C>, no <C>aria-labelledby</C>, no{" "}
          <C>aria-modal</C> anywhere in the file. The title renders as an{" "}
          <C>h3</C> (:1043) inside that content, so it is announced in browse mode
          but names nothing — <C>warnIfMissingTitle</C> nags in development (:491)
          about a name the panel never wires up. The genuinely labelled parts are
          the two icon buttons (:1087, :802) and the separator (:1204-1210). The
          scrim is <C>aria-hidden</C> (:1164): a pointer convenience, not a
          control, and the one <C>onClick</C> in the file that no key can reach
          (:1163-1185). The chevron does report state — <C>aria-expanded</C> from the
          shared toggle button — but it has no <C>aria-controls</C> and the rail it
          governs has no <C>id</C>, so the property points at nothing
          (CollapseToggleButton.tsx:81). A collapsed panel keeps its content mounted but{" "}
          <C>inert</C> and <C>aria-hidden</C> (:1014-1015), so the rows cannot be
          read while the rail is showing; a closed panel returns{" "}
          <C>null</C> (:839) and leaves nothing to announce.
        </p>
        <p>
          There is no focus trap and no restore, which is honest for in-page
          chrome and wrong for a modal: <C>Modal</C> owns the page-owning,
          scroll-locking, focus-trapping story, as its own docstring says (:348-351).
        </p>
        <A11yCode filename="Semantics.tsx" code={SEMANTICS_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          One control in this component is keyboard-operable and it is not the
          panel: the resize separator. It is a real ARIA&nbsp;1.2{" "}
          <C>role=&quot;separator&quot;</C> with <C>aria-orientation</C>,{" "}
          <C>aria-valuenow</C>/<C>aria-valuemin</C>/<C>aria-valuemax</C> and a tab
          stop (:1200-1211), and it answers exactly five keys (:809-834).
          Everything else in the header is a button the kit or you rendered.
        </p>
        <KeyboardSupportTable bindings={KEYBOARD} />
        <A11yCode filename="EscapeIsYours.tsx" code={ESCAPE_CODE} />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Four keys, all of them chrome: <C>kit.sidepanel.closeAria</C> (:1087),{" "}
          <C>kit.sidepanel.resize</C> — the separator&rsquo;s name (:1207),{" "}
          <C>kit.sidepanel.collapse</C> (:1068) and <C>kit.sidepanel.expand</C>{" "}
          (:1137), read through <C>useKitT</C> (:21,:483) and present in every
          built-in catalog (en.ts:435-440, de.ts:412, fr.ts:414, es.ts:411,
          pt.ts:410). Title, subtitle, labels and body are the caller&rsquo;s
          content and pass through untouched.
        </p>
        <p>
          Docking is physical, not logical. <C>side</C> names an edge and the
          arrow keys mirror that edge (:815-816), not the writing direction —
          nothing in the file consults a direction, so a mirrored layout picks its
          own <C>side</C> and its own <C>corner</C> behaviour rather than getting
          one for free.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable props={SIDEPANEL_PROPS} />
  </div>
);

/**
 * Every prop in `SidePanelProps` (:304-408), in the order the interface declares
 * them, with what the code actually does rather than what the JSDoc hopes.
 */
export const SIDEPANEL_PROPS: PropDoc[] = [
  {
    name: "isOpen",
    type: "boolean",
    description: (
      <>
        Required, and the one thing the panel will not hold for you: there is no{" "}
        <C>defaultOpen</C>. Closing is two steps — the shell is swept to{" "}
        <C>width: 0</C> and stays mounted until that transition reports back
        (<C>transitionend</C> on the shell, :613-623,:944), and only then does{" "}
        <C>!mounted</C> return <C>null</C> (:839). A <C>docked</C> panel that is not
        open skips the sweep and returns <C>null</C> on the spot (:839), so it has no
        exit animation in either motion mode.
      </>
    ),
  },
  {
    name: "docked",
    type: "boolean",
    default: "false",
    description: (
      <>
        In flow instead of out of it: <C>relative shrink-0</C> (:898) rather than{" "}
        <C>absolute z-40</C> (:899). It takes a column, reflows the row, and never
        gets a scrim — <C>overlay</C> is ignored while docked (:1162). As a{" "}
        <C>PageBodyLayout</C> zone it publishes its own width into that row&rsquo;s
        minimum-width floor (:765-792).
      </>
    ),
  },
  {
    name: "flush",
    type: "boolean",
    default: "true",
    description: (
      <>
        Squares the corners on the attached edge, including the collapsed rail
        (:520); set <C>false</C> for a free-standing, fully rounded panel (:229-231).
      </>
    ),
  },
  {
    name: "onClose",
    type: "() => void",
    description: (
      <>
        The close button&rsquo;s handler (:1086) <em>and</em> the scrim&rsquo;s{" "}
        <C>onClick</C> (:1165). No <C>onClose</C> means no close button at all
        (:1080) and a scrim that clicks through to nothing. A <C>collapsible</C>{" "}
        panel renders no close button either way (:1080) — it folds instead.
      </>
    ),
  },
  {
    name: "title / subtitle / icon",
    type: "ReactNode",
    description: (
      <>
        The header&rsquo;s three parts; the title is an <C>h3</C> (:1043) and the
        subtitle a <C>p</C> under it (:1054). None of them names the panel for a
        screen reader — see the screen-reader section.
      </>
    ),
  },
  {
    name: "width",
    type: "number",
    default: "420",
    description: (
      <>
        px, and only on the horizontal axis: a <C>top</C> or <C>bottom</C> panel
        ignores it entirely and sizes from <C>height</C> (:902,:925-927). Unresized it{" "}
        <em>is</em> the width; once <C>resizable</C> is on, <C>resolvedWidth =
        currentWidth</C> (:697) and the prop is only the seed — the dragged number
        lives in local state that no callback reports (:656-665). Nothing clamps it
        either: pass a <C>width</C> wider than <C>maxWidth</C> and you get it, until
        the separator is touched (:834).      </>
    ),
  },
  {
    name: "height / minHeight / maxHeight",
    type: "number",
    default: "240 / 120 / 600",
    description: (
      <>
        The same three on the other axis, for <C>side=&quot;top&quot;</C> or{" "}
        <C>&quot;bottom&quot;</C> (:244-249) — <C>vertical</C> swaps every size,
        handle and arrow key to them (:493,:819-821).
      </>
    ),
  },
  {
    name: "headerActions",
    type: "ReactNode",
    description: (
      <>
        Buttons and menus in the header&rsquo;s right cluster, before the pills:{" "}
        <C>[collapse] [headerActions] [headerPills] [close]</C> (:259,:1065-1090).
      </>
    ),
  },
  {
    name: "headerPills",
    type: "ReactNode",
    description: (
      <>
        A count or status, in its own <C>data-sp-header-pills</C> row, centred with
        the close button and deliberately separate from <C>headerActions</C> so
        buttons and pills coexist (:1071-1079).
      </>
    ),
  },
  {
    name: "subHeader",
    type: "ReactNode",
    description: (
      <>
        The non-scrolling strip between header and body — <C>flex-none</C> outside
        the scroll container, styled through <C>data-sp-sub-header</C>, padded by
        the size token&rsquo;s <C>stripPad</C> (:1101-1108). Inside{" "}
        <C>data-sp-content</C>, so collapsing takes it with the body (:1098-1099).
      </>
    ),
  },
  {
    name: "footer",
    type: "ReactNode",
    description: (
      <>
        Below the scroll container, <C>flex-none</C>, so it never travels with the
        rows (:1116-1120). Where the action buttons usually live.
      </>
    ),
  },
  {
    name: "children",
    type: "ReactNode",
    description: (
      <>
        The body, in <C>relative flex-1 min-h-0 overflow-y-auto</C> (:1111) — the
        only part of the panel that scrolls. There is no prop to move that scroll
        elsewhere: with a tall <C>subHeader</C> and a tall <C>footer</C> they keep
        their room and the body gets what is left.
      </>
    ),
  },
  {
    name: "className",
    type: "string",
    description: (
      <>
        Lands on <C>data-sp-content</C> (:1021), not on the shell — so a border or
        a width utility styles the content box, while the surface, its corners and
        its shadow live two elements up (:892-908).
      </>
    ),
  },
  {
    name: "closeIconSize",
    type: "IconSize",
    description: (
      <>
        Overrides the close button&rsquo;s size; it and the collapse chevron
        otherwise share one number from the size token, which is what lets the
        chevron sit exactly where the close button was (:800,:1083).
      </>
    ),
  },
  {
    name: "resizable",
    type: "boolean",
    default: "false",
    description: (
      <>
        Renders the edge handle (:1195) — a <C>role=&quot;separator&quot;</C> with
        a tab stop, mouse drag (:647-692) and five keys (:809-834). Collapsed, the
        handle is <em>parked</em> rather than removed: no role, every{" "}
        <C>aria-*</C> gone, out of the tab order, click-through (:881-888,:1200-1211).
      </>
    ),
  },
  {
    name: "minWidth / maxWidth",
    type: "number",
    default: "280 / 900",
    description: (
      <>
        What the arrows clamp against, what Home and End land on (:822-834), and
        what <C>aria-valuemin</C>/<C>aria-valuemax</C> report (:1209-1210). The
        clamp runs on key press, not on your prop: a <C>width</C> outside the
        bounds is honoured until the separator is used.
      </>
    ),
  },
  {
    name: "tone",
    type: "TrueColor",
    default: '"neutral"',
    description: (
      <>
        Accent for the resize handle only — <C>tone ?? color ?? &quot;neutral&quot;</C>{" "}
        (:494). The header&rsquo;s buttons stay ghost and neutral: chrome, not a
        call to action (:1084-1085). <C>color</C> is its deprecated alias (:289-290).
      </>
    ),
  },
  {
    name: "variant",
    type: "SurfaceVariant | legacy sidebar name",
    default: '"outlined"',
    description: (
      <>
        The shared Panel family (:461). Four legacy names still work — <C>sidebar</C>,{" "}
        <C>inset</C>, <C>floating</C>, <C>floating-glass</C> — and each resolves to a
        current one for tokens and text (:45-50,:496-497). They are{" "}
        <em>not</em> spelled the same however: a legacy name keeps the older fill
        path, painting its own sidebar surface with its own border and shadow, while
        the modern name renders a nested <C>Panel</C> instead (:906-907,:961,:965-979).{" "}
        <C>floating</C> and <C>elevated</C> are the same panel described two ways, not
        the same panel painted the same way. On a desktop shell, <C>glass</C> and{" "}
        <C>liquid-glass</C> pay a <C>backdrop-filter</C> read-back per frame —{" "}
        <C>simple</C> is the cheap surface (:294-299).
      </>
    ),
  },
  {
    name: "glassOpacity / transparency / vibrancy / specularMode / raisedSurface",
    type: "Panel's glass options",
    description: (
      <>
        Passed straight to the inner <C>Panel</C> that paints the fill (:965-979) —
        which is why <C>noise</C> and <C>raisedSurface</C> do nothing under a legacy
        variant, whose fill is its own class list instead (:961).
      </>
    ),
  },
  {
    name: "surfaceTone",
    type: "SurfaceTone",
    default: '"none"',
    description: (
      <>
        The tone of the surface fill, kept apart from the accent on purpose (:332-338)
        and forwarded straight to the nested <C>Panel</C> that paints it (:968). The
        JSDoc announces <C>&quot;neutral&quot;</C> (:336); the code opens at{" "}
        <C>&quot;none&quot;</C> (:467) — a different bag, not a greyer one, so the
        plain panel ships untinted and any expectation built on the announced default
        is wrong about the paint, not just the shade.
      </>
    ),
  },
  {
    name: "size",
    type: "ControlSize",
    default: '"md"',
    description: (
      <>
        One token drives the header&rsquo;s <C>pad</C>, the sub-header&rsquo;s{" "}
        <C>stripPad</C>, the footer&rsquo;s <C>pad</C> (:1117), the title, subtitle
        and icon sizes (<C>SIZE_TOKENS</C>, :171-216) and both header buttons&rsquo;
        glyph size (:800,:1083). The body gets none of it: the scroll container has
        no padding at all (:1111), so a panel with no padding in its markup is a
        panel with text against the edge.
      </>
    ),
  },
  {
    name: "side",
    type: "SidePanelSide",
    default: '"right"',
    description: (
      <>
        <C>&quot;left&quot; | &quot;right&quot; | &quot;top&quot; | &quot;bottom&quot;</C>{" "}
        (:136-137). Top and bottom are not a rotation of a side panel: they move
        size, handle orientation, the sweep axis and the arrow keys to the height
        axis (:493,:819-821), and fold to a strip as tall as the rail is wide
        (:711).
      </>
    ),
  },
  {
    name: "overlay",
    type: "boolean",
    default: "false",
    description: (
      <>
        Adds the scrim: <C>absolute inset-0 z-30</C>, fading with the panel,{" "}
        <C>aria-hidden</C>, clicking it calls <C>onClose</C> (:1162-1184). It dims
        the <em>container&rsquo;s</em> box, not the viewport, because the panel is{" "}
        <C>absolute</C> (:348-351,:899) — and it steps back while the panel is
        collapsed (:1173,:1177).
      </>
    ),
  },
  {
    name: "noise / noiseScale",
    type: "boolean / number",
    default: "false / —",
    description: (
      <>
        The same film grain <C>SideMenu</C> paints, on the decorative layer
        (<C>data-sp-noise</C>, :988). <C>noiseScale</C> sizes a repeating 200px tile (:361-363); omit
        it to keep the automatic sizing. Both need a current variant — a legacy
        alias paints its own fill (:961).
      </>
    ),
  },
  {
    name: "inset",
    type: "boolean | SurfacePadding",
    description: (
      <>
        Detaches the panel from the two edges beside the docked one. Omitted, it
        asks the variant&rsquo;s tokens whether they carry an offset — only{" "}
        <C>floating</C> and <C>floating-glass</C> do (:506-513,:2389) — so the
        floating aliases arrive inset without being told. <C>true</C> is{" "}
        <C>md</C>, 16px (:514-517); <C>false</C> and <C>&quot;none&quot;</C> sit
        flush.
      </>
    ),
  },
  {
    name: "corner",
    type: "SurfaceCorner",
    default: '"rounded-md"',
    description: (
      <>
        The shared scale <C>Panel</C> takes, applied to the two corners facing the
        content (:325-331,:520). The default is the theme&rsquo;s{" "}
        <C>DEFAULT_SURFACE_CORNER</C> (:474 → common/theme/Theme.ts:1531), and{" "}
        <C>&quot;auto&quot;</C> is a request to keep tracking the theme — not a
        request for square corners.
      </>
    ),
  },
  {
    name: "collapsible",
    type: "boolean",
    default: "false",
    description: (
      <>
        Swaps the close button for a chevron (:1066,:1080) that folds the panel to{" "}
        <C>COLLAPSED_RAIL_WIDTH</C> — 56px, the workflow rail&rsquo;s own number
        (:709 → Theme.ts:1545). Top and bottom fold to a strip that tall (:711,:1135).
      </>
    ),
  },
  {
    name: "collapsed / defaultCollapsed / onCollapsedChange",
    type: "boolean / boolean / (collapsed) => void",
    default: "— / false / —",
    description: (
      <>
        Three states, not two. Omit <C>collapsed</C> and the panel owns it (:701-705);
        pass it and the host does — while <C>onCollapsedChange</C> fires either way
        (:706), so a host that ignores it simply refuses to expand. <C>collapsed</C>{" "}
        is read only when <C>collapsible</C> is on (:702): without it, the rail
        never appears. <C>defaultCollapsed</C> seeds the uncontrolled case (:701).
      </>
    ),
  },
  {
    name: "collapsedLabel",
    type: "ReactNode",
    default: "the title",
    description: (
      <>
        The rail&rsquo;s text, falling back to <C>title</C> (:1138,:1147) — vertical
        for a side panel (<C>writing-mode:vertical-rl</C>, :1143) and laid along the
        strip for a top/bottom one, always <C>truncate</C>d, uppercase and
        letter-spaced, so a long title reads as three letters and an ellipsis (:1142).
      </>
    ),
  },
  {
    name: "motion",
    type: "PanelMotion",
    default: '"layout"',
    description: (
      <>
        <C>&quot;layout&quot;</C> animates the flow size — honest cost: every frame
        of the sweep relayouts the row, so any <C>ResizeObserver</C> below it runs
        its full pass inside the animation. <C>&quot;slide&quot;</C> takes the final
        size in one layout and counter-animates the content with{" "}
        <C>transform</C> + <C>opacity</C>, at the price of a centre that snaps
        instead of easing (:379-401,:713-763). Under <C>prefers-reduced-motion</C>{" "}
        both are instant (:488,:570).
      </>
    ),
  },
  {
    name: "onKeyDown",
    type: "KeyboardEventHandler<HTMLDivElement>",
    description: (
      <>
        A consumer passthrough on <C>data-sp-content</C> (:1031), placed there so a
        wrapper around <C>children</C> would not miss keys pressed while the header
        has focus (:402-407). The panel itself answers no keys here — Escape-to-close
        is yours to write, and the file says so.
      </>
    ),
  },
  {
    name: "…",
    type: "SidePanelProps",
    description: (
      <>
        The props this table has not named are pass-throughs of surfaces already
        described above (<C>color</C> is <C>tone</C>&rsquo;s alias, :289-290; the
        glass quartet is typed through <C>PanelProps</C>, :304-309). Nothing in{" "}
        <C>SidePanelProps</C> (:304-408) is undocumented here.
      </>
    ),
  },
];

const KEYBOARD: KeyboardBinding[] = [
  {
    keys: ["Tab"],
    action: (
      <>
        Into the header&rsquo;s cluster and nothing else the panel owns: the
        collapse chevron when <C>collapsible</C> (:1066), the close button when{" "}
        <C>onClose</C> is set and <C>collapsible</C> is not (:1080), then whatever{" "}
        <C>headerActions</C> and <C>footer</C> put there. The panel body is not
        focusable; there is no trap and no restore.
      </>
    ),
  },
  {
    keys: ["ArrowLeft", "ArrowRight"],
    action: (
      <>
        On the focused separator, and mirrored per <C>side</C>: a right-docked panel
        grows on <C>ArrowLeft</C> (the pointer moves left, :806-816), a left-docked
        one on <C>ArrowRight</C>. 20px a press, clamped to the bounds, with{" "}
        <C>preventDefault()</C> (:812,:834).
      </>
    ),
  },
  {
    keys: ["ArrowUp", "ArrowDown"],
    action: (
      <>
        The pair a <C>top</C> or <C>bottom</C> panel uses instead, mapped the same
        way (:815-816). They do nothing to a left/right panel — the key is chosen
        by <C>side</C>, not by whichever axis the reader is thinking about.
      </>
    ),
  },
  {
    keys: ["Home", "End"],
    action: (
      <>
        Jump to the minimum and the maximum — <C>minWidth</C>/<C>maxWidth</C>, or{" "}
        <C>minHeight</C>/<C>maxHeight</C> on a top/bottom panel (:819-831), the same
        numbers <C>aria-valuemin</C>/<C>aria-valuemax</C> advertise (:1209-1210).
      </>
    ),
  },
  {
    keys: ["Enter", "Space"],
    action: (
      <>
        Nothing at the separator: it is a slider-like control, and the handler only
        reads the five keys above (:809-834). They belong to the buttons in the
        header and footer, which are ordinary buttons.
      </>
    ),
  },
  {
    keys: ["Escape"],
    action: (
      <>
        Nothing closes on Escape. There is no document-level listener and no panel
        handler — <C>onKeyDown</C> is a passthrough whose own comment exists so a
        consumer can add it (:402-408,:1031). Until you do, the keyboard path out of
        an overlay panel is its close button.
      </>
    ),
  },
];

const SEMANTICS_CODE = `// Closed: nothing exists, nothing is announced (:839).
<SidePanel isOpen={false} />

// Open, resizable: an h3 inside a plain div, a named close button, and a
// separator that does report its value (:892,:1043,:1087,:1204-1210).
<SidePanel isOpen title="Details" onClose={close} resizable width={420} />

// The panel adds no landmark and no name, so the host that needs one adds it:
<aside aria-label="Build details" className="relative">
  <SidePanel isOpen title="Build 412">{details}</SidePanel>
</aside>`;

const ESCAPE_CODE = `<SidePanel
  isOpen={open}
  onClose={() => setOpen(false)}
  overlay
  // The panel's own comment asks for exactly this (:402-408).
  onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
  title="Details"
>
  <Editor />
</SidePanel>`;

export default SidePanelPage;
