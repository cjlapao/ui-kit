import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11ySection,
  A11yTopic,
  C,
  KeyboardSupportTable,
  PropsTable,
  type PropDoc,
} from "../../shared/A11ySections";
import { PageBodyLayoutPlayground } from "./PageBodyLayoutPlayground";
import WorkspaceLayout from "./WorkspaceLayout";
import workspaceLayoutCode from "./WorkspaceLayout.tsx?raw";

/**
 * Every public prop, as the API table prints it. Exported so the playground's
 * snippet test can assert the Code view only names a prop the component takes.
 */
export const PAGE_BODY_LAYOUT_PROPS: PropDoc[] = [
  {
    name: "variant",
    type: "PageBodyLayoutVariant",
    default: '"outlined"',
    description:
      "The layout's own surface: the Panel variants plus none (accepted as plain) — transparent, no border, shadow or outer inset, leaving only the zones and the gutters between them. Anything but none is a Panel; none is a bare flex column.",
  },
  {
    name: "header",
    type: "ReactNode",
    description:
      "Above the body row, full width, never scrolled by it. false and null mean no zone at all — no element, no gutter.",
  },
  {
    name: "left",
    type: "ReactNode",
    description:
      "Full-height zone before the centre, as wide as its content. A docked SidePanel or WorkflowTrackerRail sizes and collapses itself, publishing its width into --page-zone-min-left.",
  },
  {
    name: "right",
    type: "ReactNode",
    description:
      "Full-height zone after the centre, as wide as its content, publishing into --page-zone-min-right.",
  },
  {
    name: "bottom",
    type: "ReactNode",
    description:
      "Zone beneath the centre only — it spans the centre column, not the side zones — as tall as its content.",
  },
  {
    name: "children",
    type: "ReactNode",
    description:
      "The centre. The only zone that grows: it takes the width and height the others leave, and scrolls on its own.",
  },
  {
    name: "gap",
    type: "number",
    default: "8",
    description:
      "Gutter between zones in px, independent of padding. One gutter per zone that exists.",
  },
  {
    name: "padding",
    type: "SurfacePadding",
    default: '"xs"',
    description:
      "Outer body inset on the shared responsive Panel scale (none, xs, sm, md, lg, xl). Ignored by none/plain, which have no edge to inset from.",
  },
  {
    name: "centerPadding",
    type: "SurfacePadding",
    default: '"none"',
    description:
      "Inset inside the centre only. Changes nothing about the side or bottom zones.",
  },
  {
    name: "minCenterWidth",
    type: "number",
    default: "240",
    description:
      "The centre's minimum width, and the numeric part of the row's floor: published zone widths + this + gutters + padding. Below that the container scrolls instead of the centre sliding under a zone.",
  },
  {
    name: "minCenterHeight",
    type: "number",
    default: "120",
    description: "The centre's minimum height, in px.",
  },
  {
    name: "tone",
    type: "SurfaceTone",
    default: '"none"',
    description:
      "The tint the surface takes, forwarded to Panel. A no-op for none/plain, which paint nothing.",
  },
  {
    name: "corner",
    type: "PanelCorner",
    default: '"rounded-md"',
    description:
      "The card radius on the shared corner scale, forwarded to Panel; auto tracks the theme's container corner. No radius on none/plain.",
  },
  {
    name: "transparency",
    type: "SurfaceTransparency",
    default: 'none, except glass, liquid-glass and subtle ("high")',
    description:
      "Background alpha only — never content, borders, shadows or decorations. Leave it unset and the variant answers; pin it and this layout stops answering.",
  },
  {
    name: "vibrancy",
    type: "GlassVibrancy",
    default: '"medium"',
    description: "Backdrop vibrancy, read by liquid-glass.",
  },
  {
    name: "glassOpacity",
    type: "GlassOpacity",
    default: '"frosted"',
    description:
      "Glass fill alpha for liquid-glass. Only the three presets are safelisted — a number emits an arbitrary opacity Tailwind cannot see and the fill silently disappears.",
  },
  {
    name: "specularMode",
    type: "PanelSpecularMode",
    default: '"classic"',
    description: "How light reflects off the liquid-glass surface.",
  },
  {
    name: "raisedSurface",
    type: "boolean",
    default: "false",
    description:
      "Forces the first nested-panels depth step — the tinted-card-on-matching-background fix. A floor, never an override, and a documented no-op outside simple, tonal, subtle, glass and liquid-glass.",
  },
  {
    name: "className + attributes",
    type: "—",
    description:
      "Everything else lands on the root — the plain layout's div, or Panel's section.",
  },
];

export default function PageBodyLayoutPage() {
  return (
    <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8">
      <PageHeader
        name="Page Body Layout"
        description="A header above a centre with left, right and bottom zones. The layout holds no state: each zone is as big as what you put in it, and the centre takes the rest. The bottom zone spans only the centre."
      />
      <PageBodyLayoutPlayground />
      <ExampleCard
        title="Resizable workspace"
        description="The workflow rail and the two docked SidePanels collapse, animate and resize themselves; the zones follow and the centre adjusts. The Terminal is a SidePanel docked to the bottom: it folds to its header and expands upward, and its grip sits on its top edge."
        code={workspaceLayoutCode}
        filename="WorkspaceLayout.tsx"
      >
        <WorkspaceLayout />
      </ExampleCard>
      <div className="flex flex-col gap-4 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        <p>
          Give the layout a bounded height. Left and right zones stretch their
          content to the body&rsquo;s height; the bottom zone stretches it to the
          centre&rsquo;s width. A docked <code>SidePanel</code> takes width (or
          height for <code>side="bottom"</code>), resizable and collapsible
          itself.
        </p>
        <p>
          The body row floors itself at{" "}
          <code>
            calc(--page-zone-min-left + --page-zone-min-right + centre minimum +
            gaps + padding)
          </code>{" "}
          — a docked <code>SidePanel</code> and a collapsible{" "}
          <code>WorkflowTrackerRail</code> publish their own widths into those
          variables, so a tight container scrolls instead of the centre sliding
          under a zone, with no <code>fit-content</code> intrinsic-size pass
          being re-run inside every frame of a collapse. Every{" "}
          <code>data-page-region</code> carries <code>contain: layout style</code>{" "}
          (never <code>paint</code> — popovers and menus render outside a
          region&rsquo;s box). On WebKitGTK, the layout&rsquo;s own{" "}
          <code>glass</code>/<code>liquid-glass</code> variants read the backdrop
          back on the main thread whenever anything under the page scrolls —{" "}
          <code>simple</code> or <code>elevated</code> is the low-cost desktop
          default; a zone&rsquo;s <code>motion="slide"</code> removes the
          sweep&rsquo;s per-frame layout entirely (the centre snaps; the panel
          still sweeps). And when the body&rsquo;s fill agrees with the page
          beneath it, <code>raisedSurface</code> forces the first nested-panels
          depth step — the tinted-card-on-matching-background fix.
        </p>
      </div>
      <A11ySection>
        <A11yTopic title="Screen reader">
          <p>
            The layout brings <em>no</em> semantics, which is the one thing to
            get right about it: it is a box that arranges boxes. What it renders
            is <C>div</C>s carrying <C>data-page-layout</C>, <C>data-page-row</C>{" "}
            and <C>data-page-region</C> — styling and containment hooks, not
            ARIA. The landmarks are therefore yours: the <C>&lt;main&gt;</C>{" "}
            belongs to the centre, a <C>&lt;nav&gt;</C> or{" "}
            <C>role="complementary"</C> to whatever the side zones hold, and a
            nameless <C>&lt;section&gt;</C> is generic rather than a landmark, so
            the <C>Panel</C> this layout wraps its body in when <C>variant</C>{" "}
            is not <C>none</C> adds no region either.
          </p>
          <p>
            Two details do the rest. A zone passed <C>false</C> or <C>null</C>{" "}
            renders no element at all, so a rail you folded away leaves no empty
            region behind for a screen reader to walk into —{" "}
            <C>{"left={open && <Rail />}"}</C> is the idiom the layout is built
            for. And the zones are <C>overflow-auto</C> without a tab stop of
            their own: keyboard users reach the content <em>inside</em> them,
            which is right while that content is focusable; a centre holding only
            prose needs <C>tabIndex={0}</C> and a labelled{" "}
            <C>role="region"</C> of your own, or its overflow is mouse-only.
            Containment is <C>layout style</C> and deliberately never{" "}
            <C>paint</C>, so menus and popovers opened inside a zone still escape
            its box.
          </p>
        </A11yTopic>
        <A11yTopic title="Keyboard Support">
          <KeyboardSupportTable
            bindings={[
              {
                keys: ["tab"],
                action: (
                  <>
                    Into whatever the zones hold. The layout adds no tab stop, no
                    focus trap and no roving index — and a scrollable zone is not
                    focusable on its own, which is why the topic above asks you to
                    label one that holds unfocusable prose.
                  </>
                ),
              },
              {
                keys: ["up", "down", "page up", "page down", "home", "end"],
                action: (
                  <>
                    With focus inside a zone that overflows: scroll it. Native
                    scroll behaviour, on the two <C>overflow-auto</C>{" "}
                    containers — the body row and the centre.
                  </>
                ),
              },
              {
                keys: ["left", "right", "up", "down", "home", "end"],
                action: (
                  <>
                    On a docked <C>SidePanel</C>&rsquo;s grip — the usual tenant
                    of a side or bottom zone, and the only key binding this layout
                    is normally seen with. It is a <C>role="separator"</C> with a
                    tab stop of its own: the arrow pointing away from the docked
                    edge grows the panel by 20px, the opposite arrow shrinks it,{" "}
                    <C>Home</C> takes <C>minWidth</C>/<C>minHeight</C> and{" "}
                    <C>End</C> the maximum, with <C>aria-valuenow</C> reporting
                    where it landed. Parked (collapsed), it drops the role, every{" "}
                    <C>aria-*</C> and its tab stop together.
                  </>
                ),
              },
            ]}
          />
          <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            No key moves a zone&rsquo;s size through this layout, because this
            layout resizes nothing: zones are as big as their content, and the
            only resize in a workspace is the panel being dragged — which is why
            the keys live on the grip that does it.
          </p>
        </A11yTopic>
        <A11yTopic title="Internationalization">
          <p>
            The layout speaks no strings: no labels, no titles, nothing to
            translate — the kit has no <C>kit.pagebody.*</C> keys because there is
            nothing here to say. Everything it owns is geometry, and geometry has
            two translation problems, both with a lever.
          </p>
          <p>
            <em>Direction</em>: the zones are named <C>left</C> and <C>right</C>{" "}
            in physical terms, but they are flex items, so under <C>dir="rtl"</C>{" "}
            the row mirrors and the <C>left</C> zone lands on the right — its
            content has to be built for that too, because the layout will not
            flip it for you. The published minimums, <C>--page-zone-min-left</C>{" "}
            and <C>--page-zone-min-right</C>, are likewise physical and follow
            the panel that publishes them, not the document&rsquo;s direction.
            Body and centre insets are symmetric <C>p-*</C> padding, so mirroring
            costs nothing there.
          </p>
          <p>
            <em>Length</em>: a longer string widens a zone until the row reaches
            its floor, and then the container scrolls — the intended failure, not
            a breakage. <C>minCenterWidth</C> is the lever: raise it so the
            centre keeps a readable measure in the language you are testing, and
            let the side zones be as wide as their own content asks.{" "}
            <C>gap</C> is plain px rather than a logical property, so it stays
            honest in either direction.
          </p>
        </A11yTopic>
      </A11ySection>
      <section className="flex flex-col gap-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          API
        </h2>
        <div className="max-w-3xl">
          <PropsTable props={PAGE_BODY_LAYOUT_PROPS} />
        </div>
      </section>
    </div>
  );
}
