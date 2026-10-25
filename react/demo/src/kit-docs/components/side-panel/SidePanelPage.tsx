import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11yCode,
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { SidePanelPlayground } from "./SidePanelPlayground";
import Sides from "./examples/Sides";
import sidesCode from "./examples/Sides.tsx?raw";
import Floating from "./examples/Floating";
import floatingCode from "./examples/Floating.tsx?raw";

export const SidePanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Side Panel"
      description="A panel docked to either edge of its container. It overlays rather than occupying a column, so opening it never reflows the content beside it, and it can be drag-resized. `overlay` dims the rest of the container behind a click-to-close scrim. Takes SideMenu's surface family — a docked panel and a docked menu are the same object — plus the kit's tone and size scales."
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
        description="floating and floating-glass lift the panel off the top and bottom while it stays flush to its edge, rounding only the two corners that face the content. The inset prop sets that on any variant; radius sizes the corners."
        code={floatingCode}
        filename="Floating.tsx"
      >
        <Floating />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The title is an <C>h3</C>, the close button is named (&ldquo;Close
          panel&rdquo;, from the catalog), and a resizable panel carries a real
          ARIA&nbsp;1.2 separator — <C>role="separator"</C> with
          <C>aria-valuenow</C>/<C>aria-valuemin</C>/<C>aria-valuemax</C>
          reporting the width in px. The overlay is <C>aria-hidden</C>: it is a
          pointer convenience, not a control. Honest limits: the panel itself
          claims no landmark or dialog role — it is in-page chrome, and a closed
          panel unmounts to nothing, so nothing is announced at all.
        </p>
        <A11yCode filename="Semantics.tsx" code={SEMANTICS_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          The resize grip is focusable and works without a mouse: arrows resize
          by 20px steps (mirrored for the docked side — a right panel grows on
          ArrowLeft, exactly like dragging), Home and End jump to
          <C>minWidth</C> and <C>maxWidth</C>. While closed there is nothing to
          tab to. Two deliberate absences: there is no focus trap and no focus
          restore — this is a docked panel, not a dialog — and Escape is not
          wired. That is what <C>onKeyDown</C> is for; it lands on the panel
          body, so a consumer&rsquo;s Escape-to-close also catches keys pressed
          while the close button has focus. The scrim closes on click; the
          keyboard path is the close button.
        </p>
        <A11yCode filename="EscapeToClose.tsx" code={ESCAPE_CODE} />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The strings the panel speaks — the close button&rsquo;s name, the
          separator&rsquo;s, and the collapse / expand chevron&rsquo;s — are
          catalog keys (<C>kit.sidepanel.closeAria</C>,{" "}
          <C>kit.sidepanel.resize</C>, <C>kit.sidepanel.collapse</C>,{" "}
          <C>kit.sidepanel.expand</C>) shipped
          in all five locales; everything else, title and body included, is the
          caller&rsquo;s content and passes through untouched. Docking is
          physical, not logical: <code>side</code> names an edge, so mirrored
          layouts pick their side themselves.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "isOpen",
          type: "boolean",
          description: (
            <>
              Open or closed. Closed, the panel unmounts entirely once the width
              transition ends — no hidden tab stops.
            </>
          ),
        },
        {
          name: "onClose",
          type: "() => void",
          description:
            "Fired by the close button — and by the overlay scrim when overlay is on. A collapsible panel has no close button (it collapses instead); the scrim still calls it.",
        },
        {
          name: "title / subtitle / icon",
          type: "ReactNode",
          description:
            "Header line, a secondary line under it, an icon left of both. The title renders as h3.",
        },
        {
          name: "headerActions",
          type: "ReactNode",
          description:
            "Extra nodes beside the close button — save/cancel, menus, whatever the panel is for.",
        },
        {
          name: "footer",
          type: "ReactNode",
          description: "Sticky footer at the bottom of the panel.",
        },
        {
          name: "width",
          type: "number",
          default: "420",
          description:
            "Panel width in px — the value the open/close transition animates.",
        },
        {
          name: "resizable",
          type: "boolean",
          default: "false",
          description: (
            <>
              Drag (or keyboard-resize) the outer edge. Adds the{" "}
              <C>role="separator"</C> grip to the tab order, and a faint pill
              centred on the edge that says it moves before the pointer finds
              it (it hands over to the full-height pill on hover).
            </>
          ),
        },
        {
          name: "minWidth / maxWidth",
          type: "number",
          default: "280 / 900",
          description:
            "Resize clamps — also what Home/End and the separator's aria values report.",
        },
        {
          name: "variant",
          type: "SideMenu variant",
          default: "sidebar",
          description:
            "The SideMenu surface family — a docked panel and a docked menu are the same object.",
        },
        {
          name: "surfaceTone",
          type: "TrueColor",
          default: "neutral",
          description: (
            <>
              Tone of the <em>surface</em>, separate from the accent <C>tone</C>
              .
            </>
          ),
        },
        {
          name: "tone",
          type: "TrueColor",
          description: (
            <>
              Accent for the resize grip. The header&rsquo;s close and collapse
              buttons stay neutral — chrome, not a call to action. <C>color</C>{" "}
              is its deprecated alias.
            </>
          ),
        },
        {
          name: "inset",
          type: "boolean",
          description:
            "Float off the top/bottom edges. Defaults from the variant — floating and floating-glass carry their own offset.",
        },
        {
          name: "corner",
          type: "SurfaceCorner",
          description:
            "The shared corner scale Panel takes, applied to the two corners facing the content.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: "md",
          description: "Header padding and type scale.",
        },
        {
          name: "side",
          type: '"left" | "right"',
          default: '"right"',
          description:
            "Which physical edge to dock to; keyboard resize directions mirror it.",
        },
        {
          name: "collapsible / collapsed / defaultCollapsed / onCollapsedChange",
          type: "boolean / boolean / boolean / (collapsed) => void",
          default: "false / — / false / —",
          description:
            "Replaces the close button: a chevron (drawn on the close glyph's geometry, so it is the same size) folds the panel to a rail as wide as the collapsed WorkflowTracker rail (COLLAPSED_RAIL_WIDTH, 56px): the expand chevron on top, the label running vertically. The content stays mounted but inert; resizing and the overlay scrim step back while collapsed. Controlled when `collapsed` is set.",
        },
        {
          name: "collapsedLabel",
          type: "ReactNode",
          default: "title",
          description: "The vertical text of the collapsed rail.",
        },
        {
          name: "noise",
          type: "boolean",
          default: "false",
          description:
            "The same dither-grain texture SideMenu paints, over the background layer.",
        },
        {
          name: "overlay",
          type: "boolean",
          default: "false",
          description:
            "Scrim over the rest of the container — fades with the panel, click-to-close, aria-hidden. The viewport-owning modal story stays Modal's.",
        },
        {
          name: "onKeyDown",
          type: "KeyboardEventHandler",
          description: (
            <>
              Fires on the panel body (close button included) — built for
              Escape-to-close, which the panel deliberately does not hardwire.
            </>
          ),
        },
      ]}
    />
  </div>
);

const SEMANTICS_CODE = `// Closed: nothing exists, nothing is announced.
<SidePanel isOpen={false} />
// Open, resizable: h3 title + named close + a valuenow-bearing separator.
<SidePanel isOpen title="Details" onClose={close} resizable width={420} />`;

const ESCAPE_CODE = `<SidePanel
  isOpen={open}
  onClose={() => setOpen(false)}
  overlay
  onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
  title="Details"
>
  <Editor />
</SidePanel>`;

export default SidePanelPage;
