import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ScrollAreaPlayground } from "./ScrollAreaPlayground";
import {
  A11yCode,
  A11ySection,
  A11yTopic,
  C,
  KeyboardSupportTable,
  PropsTable,
  type PropDoc,
} from "../../shared/A11ySections";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Horizontal from "./examples/Horizontal";
import horizontalCode from "./examples/Horizontal.tsx?raw";
import BothScrollbars from "./examples/BothScrollbars";
import bothScrollbarsCode from "./examples/BothScrollbars.tsx?raw";
import ScrollFade from "./examples/ScrollFade";
import scrollFadeCode from "./examples/ScrollFade.tsx?raw";

/**
 * Every prop `ScrollAreaProps` declares (:36-105), read off the file — including
 * the three that are easy to miss because they are what the component does to
 * <em>your</em> element: `tabIndex` is honoured only while something overflows,
 * `gutter` is a lane that follows scrollability rather than visibility, and
 * `className` carries the height without which none of this is ever drawn.
 */
export const SCROLLAREA_PROPS: PropDoc[] = [
  {
    name: "variant",
    type: "ScrollAreaVariant",
    default: '"auto"',
    description:
      "When the bars show themselves: auto (on hover or while scrolling — the macOS behaviour), hover, scroll (it lingers 800ms after the last event, :110), always, hidden (:20-25,:352-358). Visibility only — the content scrolls identically under all five, and hidden still scrolls (:18). Also echoed as data-variant on the root (:443, test :197).",
  },
  {
    name: "mask",
    type: "boolean",
    default: "false",
    description:
      "Fades the content at the edges it can scroll toward, so a clipped row reads as clipped instead of finished (:47-50,:416-436). The reach is the exported SCROLLAREA_MASK_FADE_PX — 24px (:112) — and only axes that actually overflow are faded; the two gradients intersect when both axes are live (:432-434).",
  },
  {
    name: "horizontal",
    type: "boolean",
    default: "true",
    description: (
      <>
        Whether the region can scroll sideways (:51-58). <C>virtualScroll</C>{" "}
        forces it off (:161). False draws no sideways bar at all (:553-584, test{" "}
        :322), clamps <C>overflowX</C> inline on the scroller where a class could
        lose the cascade (:468, test :340) and lays the content out as{" "}
        <C>block</C> instead of <C>table</C>, so one <C>nowrap</C> row cannot
        inflate the locked axis (:492, test :351). Say so for a nav list or a
        text column: <C>scrollWidth</C> reports clipped content as loudly as
        scrollable content (:53-56,:262-266).
      </>
    ),
  },
  {
    name: "vertical",
    type: "boolean",
    default: "true",
    description: (
      <>
        Whether the region can scroll downward (:59-60). <C>virtualScroll</C>{" "}
        forces it on (:162). False renders no vertical bar element at all (:519),
        and with nothing overflowing the lane is not paid either (:504).
      </>
    ),
  },
  {
    name: "gutter",
    type: "boolean",
    default: "true",
    description:
      "Whether the content pays the overlay bar's lane — a 10px right inset (SCROLLAREA_LANE_PX, :117) applied as pr-2.5 (:504). Paid only while the vertical axis actually scrolls, never on a gesture, or the text would jog sideways every time a bar appeared (:493-503, test :219-242). Refund it with false when the rows already trail ≥10px of their own padding, as a padded menu list does — then the caller's padding is the lane and the thumb still never touches content (:71-83, test :257).",
  },
  {
    name: "tabIndex",
    type: "number",
    default: "0",
    description:
      "Tab order entry for the scrolling viewport (:61-67). Honoured only while an axis overflows: while everything fits the viewport is tabIndex={-1} whatever you pass, because a region that fits has no business one tab deep (:458, test :126-137).",
  },
  {
    name: "contentClassName",
    type: "string",
    description: (
      <>
        Classes for the content wrapper (:68-70,:482-506) — the box inside the
        scroller, which is where the lane&rsquo;s <C>pr-2.5</C> lands and where a{" "}
        <C>table</C> layout is set for the sideways axis (:492).
      </>
    ),
  },
  {
    name: "viewportClassName",
    type: "string",
    description: (
      <>
        Classes for the element that actually carries <C>overflow: auto</C>{" "}
        (:84-88,:471-480). Behaviour that belongs to the scroller goes here, not on
        the frame — an <C>overscroll-contain</C> so a wheel at the end of the
        content does not chain to the page is the JSDoc&rsquo;s own example (:86-87,
        test :297).
      </>
    ),
  },
  {
    name: "viewportRole",
    type: "React.AriaRole",
    description: (
      <>
        The only role the kit puts on the viewport, and only if you ask (:90-96,{" "}
        :457). For a caller carrying a composite-widget contract across that
        element: the kit&rsquo;s <C>TableViewport</C> declares the scroller a{" "}
        <C>rowgroup</C> because it groups exactly the body&rsquo;s rows, and a
        focusable, role-less <C>div</C> owned by a surrounding{" "}
        <C>role=&quot;table&quot;</C> is not allowed in the table&rsquo;s owned tree.
      </>
    ),
  },
  {
    name: "viewportRef",
    type: "React.Ref<HTMLDivElement>",
    description: (
      <>
        Gets the element that scrolls, not the frame around it — pan, zoom
        anchoring, scroll-into-view (:97-100). The component&rsquo;s internal ref and
        the caller&rsquo;s are both attached, because a forwarded ref of one&rsquo;s
        own would leave the kit without its own scrollbars (:165-178, test :297).
      </>
    ),
  },
  {
    name: "virtualScroll",
    type: "ScrollAreaVirtualScroll",
    description: (
      <>
        <C>{"{ contentSize, viewportSize, offset, onScroll }"}</C> for an engine
        that renders its own viewport (:27-34,:39). Sizes may be pixels or logical
        units — a terminal scrolls by rows (:27-28, test :47-87). The scroller goes{" "}
        <C>overflow: hidden</C> (:467), <C>horizontal</C> is forced off and{" "}
        <C>vertical</C> on (:161-162), and the child engine owns wheel and keyboard
        (:37-38); the kit only measures and draws the thumb (:210-253,:397-409).
      </>
    ),
  },
  {
    name: "className",
    type: "string",
    default: '""',
    description: (
      <>
        Merged onto the root (:158,:440-441). This is where the height comes from:
        the region has none of its own, so without <C>h-*</C> or <C>max-h-*</C>{" "}
        here nothing ever overflows and no bar, lane or tab stop is ever created
        (:101-104). A <C>max-h-*</C> counts too — the viewport inherits the cap
        through <C>max-h-[inherit]</C> and scrolls inside it rather than growing
        past it and being silently clipped (:473-476, test :110).
      </>
    ),
  },
  {
    name: "children",
    type: "ReactNode",
    description:
      "The scrollable content (:101-104). Its own padding is what the lane is measured against, which is why a padded list wants gutter={false}.",
  },
  {
    name: "…html props",
    type: "React.HTMLAttributes<HTMLDivElement>",
    description: (
      <>
        Everything else lands on the frame (:36,:440). <C>aria-label</C> or{" "}
        <C>id</C> + <C>aria-labelledby</C> is how the region gets a name — the
        viewport itself has no label prop, only <C>viewportRole</C>.{" "}
        <C>onPointerEnter</C> / <C>onPointerLeave</C> are merged, not replaced, so
        the bars still appear for a caller that also watches the pointer
        (:444-451, test :287).
      </>
    ),
  },
];

const NAMING_CODE = `// A named scrolling region. The frame carries the name, because the
// viewport — the element that actually scrolls — has no label prop of its
// own, only viewportRole (:90-96,:457).
export default function Reports() {
  return (
    <ScrollArea
      aria-label="Quarterly reports"
      className="h-56 w-full"
      variant="always"
    >
      <ul className="space-y-2 pr-2">
        <li>Q1 — signed</li>
        <li>Q2 — signed</li>
        <li>Q3 — draft</li>
      </ul>
    </ScrollArea>
  );
}`;

const ROLE_CODE = `// Inside a role="table", a focusable role-less div is not allowed in the
// table's owned tree (:90-96) — which is exactly why the kit's TableViewport
// passes viewportRole="rowgroup" and keeps the scroller's own behaviour on the
// same element via viewportClassName.
<ScrollArea
  viewportRole="rowgroup"
  viewportClassName="overscroll-contain"
  className="max-h-64"
  gutter={false}
>
  <tbody>{rows}</tbody>
</ScrollArea>`;

const RTL_CODE = `// Nothing in ScrollArea reads dir: the fade is to bottom / to right
// (:421-426) and the lane is a physical pr-2.5 (:504) — a right inset under
// dir="rtl" too. The sideways thumb tracks the browser's own scrollLeft sign
// (:240-249), with no compensation added, which is the argument for locking the
// axis a region does not need (:51-58).
<div dir="rtl">
  <ScrollArea className="h-40 w-full" horizontal={false} mask>
    <p className="text-sm">…</p>
  </ScrollArea>
</div>`;

export const ScrollAreaPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Scroll Area"
      description="A scrollable region whose scrollbars are drawn by the kit instead of the browser — PrimeVue's ScrollArea. Scrolling itself stays completely native (wheel, touch, keyboard), so behaviour never surprises anyone; only the thin overlay bars are ours, sized by the visible fraction and shown only when wanted."
    />
    <ScrollAreaPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="The classic list: bars invisible until hovered or scrolled (the `auto` default), and the same thin rounded look the kit's native scrollbar hack faked webkit-only for years."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Horizontal"
        description="Wide content brings the horizontal bar up on the same rules as the vertical one — and `gutter={false}` is what a padded list wants, or the lane stacks on top of its own padding."
        code={horizontalCode}
        filename="Horizontal.tsx"
      >
        <Horizontal />
      </ExampleCard>
      <ExampleCard
        title="Both Scrollbars"
        description="Overflow on both axes gets both bars and a corner square where they meet — a sticky header riding the vertical scroll while the columns slide under it (the bars sit above sticky children on purpose, test :38-46)."
        code={bothScrollbarsCode}
        filename="BothScrollbars.tsx"
      >
        <BothScrollbars />
      </ExampleCard>
      <ExampleCard
        title="Scroll Fade"
        description="`mask` fades the content at the edges it can scroll toward, so a clipped row reads as clipped instead of finished — 24px of reach, and only on axes that actually overflow."
        code={scrollFadeCode}
        filename="ScrollFade.tsx"
      >
        <ScrollFade />
      </ExampleCard>
    </section>
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The two bars are the interesting part, because they are <em>not</em>{" "}
          announced. Each carries a full scrollbar contract —{" "}
          <C>role=&quot;scrollbar&quot;</C>, <C>aria-controls</C> pointing at the
          viewport&rsquo;s <C>useId</C>, <C>aria-orientation</C>, <C>aria-label</C>{" "}
          and a live <C>aria-valuenow</C> (:523-528,:558-563) — and{" "}
          <C>aria-hidden=&quot;true&quot;</C> on top of it. The reason is in the
          source: a scrollbar role a screen reader announces and the reader cannot
          operate is a worse promise than no role, and the thumbs answer{" "}
          <em>pointer</em> events only (:512-518,:541-544,:576-579). Everything a
          reader needs is the native, still-scrollable viewport underneath.
        </p>
        <p>
          That viewport has no role of its own unless you pass{" "}
          <C>viewportRole</C> (:457) and no name of its own at all — there is no{" "}
          <C>viewportLabel</C>. Name the frame through the spread props (:440): a
          region someone can tab into should say what it holds. The{" "}
          <C>data-slot</C> / <C>data-orientation</C> / <C>data-state</C> /{" "}
          <C>data-overflow-*</C> attributes are styling hooks, not semantics
          (:442,:459-460,:520-522).
        </p>
        <A11yCode code={NAMING_CODE} filename="naming.tsx" />
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          There is no key handler in the component — none in 598 lines. The
          JSDoc&rsquo;s own wording is that keyboard users scroll the focused area{" "}
          <em>natively</em> (:62-67), because scrolling was never taken away: the
          native scrollbar is hidden by class, not replaced (:471-480, test{" "}
          :209), and wheel, touch and keyboard all keep driving the real one
          (:133-143,:512-518).
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["Tab"],
              action:
                "Enters the viewport — but only while an axis overflows. While everything fits it is tabIndex={-1} whatever you passed, so a region that fits is never one tab deep (:458, test :126-137).",
            },
            {
              keys: ["Shift", "Tab"],
              action:
                "Leaves it. Nothing else in the component is focusable: the bars and thumbs are rendered without a tab stop and are aria-hidden (:519-584).",
            },
            {
              keys: ["↑", "↓", "←", "→"],
              action:
                "Scroll the focused viewport, in the browser. The kit adds no arrow handling of any kind — the JSDoc says so outright (:62-67) and the source has no onKeyDown (:512-518).",
            },
            {
              keys: ["Page Up", "Page Down", "Home", "End"],
              action:
                "Also native, on the same focused viewport (:472 carries overflow-auto). This is the whole keyboard API, which is the point of keeping scrolling native.",
            },
            {
              keys: ["Enter", "Space"],
              action:
                "Nothing to activate. A thumb is not a button: it answers pointerdown/move/up/cancel only (:541-544,:576-579).",
            },
            {
              keys: ["Any", "on a bar"],
              action:
                "Nothing — and deliberately so. A bar that a reader could focus but not drive would be a second, worse way to scroll; the lane is chrome (aria-hidden, :523,:558).",
            },
          ]}
        />
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          <C>ScrollArea</C> renders no text of its own and never calls{" "}
          <C>useKitT</C> — there is nothing to translate. Its only literal strings
          are the two bar labels, <C>&quot;Vertical scroll&quot;</C> and{" "}
          <C>&quot;Horizontal scroll&quot;</C> (:527,:562), and they sit on{" "}
          <C>aria-hidden</C> elements, so no reader ever hears them: they are
          documentation for the DOM, not copy for a locale.
        </p>
        <p>
          What <em>is</em> physical, and stays physical under{" "}
          <C>dir=&quot;rtl&quot;</C>: the edge fade is{" "}
          <C>to bottom</C> / <C>to right</C> (:421-426) — correct, since it tracks
          the scroll axis, not the reading order — and the lane is a{" "}
          <C>pr-2.5</C> right inset (:504) that does not move to the left edge. The
          sideways thumb is derived from <C>viewport.scrollLeft</C> (:240-249) and
          the browser&rsquo;s own sign convention for it; nothing here compensates,
          so a right-to-left region that does not need sideways scrolling should say
          so with <C>{"horizontal={false}"}</C> and skip the whole question
          (:51-58). Text content, of course, is the caller&rsquo;s.
        </p>
        <A11yCode code={RTL_CODE} filename="rtl.tsx" />
      </A11yTopic>
      <A11yTopic title="Focus, and the role a table will not accept">
        <p>
          The viewport carries <C>outline-none</C> and then a focus-visible ring:{" "}
          <C>focus-visible:ring-2 ring-inset ring-blue-400</C> (:472,:478). That is
          the only visible focus cue for the region, and it appears exactly when the
          tab stop exists — which is to say only while something overflows.
        </p>
        <p>
          A focusable, role-less <C>div</C> is usually fine as a scroll container. It
          is <em>not</em> fine inside a composite widget that owns its descendants:
          the kit&rsquo;s <C>TableViewport</C> therefore passes{" "}
          <C>viewportRole=&quot;rowgroup&quot;</C>, because the scroller groups
          exactly the body&rsquo;s rows and a surrounding <C>role=&quot;table&quot;</C>{" "}
          may not own an unroled focusable element (:90-96). Pass it yourself for the
          same reason whenever you wrap a grid, a listbox or a tree.
        </p>
        <A11yCode code={ROLE_CODE} filename="table-viewport.tsx" />
      </A11yTopic>
    </A11ySection>
    <PropsTable props={SCROLLAREA_PROPS} />
  </div>
);

export default ScrollAreaPage;
