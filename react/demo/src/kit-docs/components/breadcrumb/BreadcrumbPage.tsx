import React from "react";
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
import { BreadcrumbPlayground } from "./BreadcrumbPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Route from "./examples/Route";
import routeCode from "./examples/Route.tsx?raw";
import CustomSeparator from "./examples/CustomSeparator";
import customSeparatorCode from "./examples/CustomSeparator.tsx?raw";
import Ellipsis from "./examples/Ellipsis";
import ellipsisCode from "./examples/Ellipsis.tsx?raw";
import CustomItem from "./examples/CustomItem";
import customItemCode from "./examples/CustomItem.tsx?raw";
import Tones from "./examples/Tones";
import tonesCode from "./examples/Tones.tsx?raw";

/**
 * The two contracts, as the API table prints them. Exported so the playground's
 * snippet test can assert the Code view only names a prop or a crumb field the
 * component actually takes.
 */
export const BREADCRUMB_PROPS: PropDoc[] = [
  {
    name: "items",
    type: "BreadcrumbItem[]",
    description:
      "The trail, one <li> per crumb. Nothing here measures, counts or collapses: the ellipsis every breadcrumb trail seems to need is a crumb you write yourself, which is why there is no max-items prop to look for.",
  },
  {
    name: "home",
    type: "BreadcrumbItem",
    description:
      "Prepended when it is truthy — so home={{}} buys you a blank crumb and a separator, not a home icon.",
  },
  {
    name: "separator",
    type: "ReactNode",
    default: "a ChevronRight at the size scale",
    description:
      "One node, computed once and reused between every pair. Resolved with ??, so neither null nor undefined blanks it: pass \"\" and the empty aria-hidden <li> still sits in the row, taking its gap.",
  },
  {
    name: "color",
    type: "TrueColor",
    default: '"blue"',
    description:
      "Tints a crumb on hover, on focus-visible and when it is the current page. The resting crumb is a fixed neutral, so a swatch looks inert until something is hovered.",
  },
  {
    name: "size",
    type: "ControlSize",
    default: '"md"',
    description:
      "The shared control scale, and the only size knob: trail text size, crumb padding, icon-to-label gap, crumb icon and separator glyph all follow it.",
  },
  {
    name: "ariaLabel",
    type: "string",
    default: '"Breadcrumb"',
    description:
      "The name of the nav landmark. Plain English, un-localized — pass your own for another language. It is applied before ...rest, so an aria-label you spread yourself wins.",
  },
  {
    name: "className + attributes",
    type: "—",
    description:
      "The class joins the trail's own text size on the root; every other attribute lands on the <nav>.",
  },
];

export const BREADCRUMB_ITEM_PROPS: PropDoc[] = [
  {
    name: "label",
    type: "ReactNode",
    description:
      "The text, truncated at 14rem inside the crumb. With none, the crumb has no accessible name until you give it ariaLabel.",
  },
  {
    name: "icon",
    type: "string | ReactElement",
    description:
      "Registered icon name or your own element, sized by the trail's size and hidden from assistive tech — the label carries the name.",
  },
  {
    name: "to",
    type: "string",
    description:
      "The router's Link, for a crumb that goes somewhere. Checked first: set it alongside href or onClick and those are dropped without a word.",
  },
  {
    name: "href",
    type: "string",
    description: "A plain anchor, reached only when to is absent.",
  },
  {
    name: "onClick",
    type: "() => void",
    description:
      "Renders the crumb as a button — tested for truthiness, and only reached when to and href are both absent.",
  },
  {
    name: "current",
    type: "boolean",
    default: "false",
    description:
      "This is the page you are on: it gains the tone and font-medium, and aria-current=\"page\" — but only on the Link and the plain-text crumb. A current crumb that also has href or onClick is still a link or a button, and gets no aria-current at all.",
  },
  {
    name: "badge",
    type: "ReactNode",
    description:
      "Appended after the label with no wrapper of its own; the crumb's own gap does the spacing.",
  },
  {
    name: "ariaLabel",
    type: "string",
    description:
      "The accessible name for a crumb with no label — read only when label is absent, so setting both does nothing.",
  },
];

export const BreadcrumbPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Breadcrumb"
      description="The page hierarchy as a trail of crumbs — items carry a router path, an href or a click handler, the current page gets aria-current, the tone (default blue) tints link hover, focus and the current crumb with the kit's contrast-correct text pair, and size rides the shared control scale."
    />
    <BreadcrumbPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description={'A home crumb and the trail to the current page, which renders as text with `aria-current="page"`.'}
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Route"
        description="Real navigation — `to` renders the router's `Link`, so clicking a crumb goes back up the hierarchy."
        code={routeCode}
        filename="Route.tsx"
      >
        <Route />
      </ExampleCard>
      <ExampleCard
        title="Custom Separator"
        description={`Any node between items — here a plain \"/" instead of the default chevron.`}
        code={customSeparatorCode}
        filename="CustomSeparator.tsx"
      >
        <CustomSeparator />
      </ExampleCard>
      <ExampleCard
        title="Ellipsis"
        description="An icon-only crumb stands in for the hidden levels above."
        code={ellipsisCode}
        filename="Ellipsis.tsx"
      >
        <Ellipsis />
      </ExampleCard>
      <ExampleCard
        title="Custom Item"
        description="Items can carry icons and extra content — a `Badge` after the label here."
        code={customItemCode}
        filename="CustomItem.tsx"
      >
        <CustomItem />
      </ExampleCard>
      <ExampleCard
        title="Tones"
        description={`The \`color\` prop takes any of the 21 TrueColors — it tints the link hover, the focus ring and the current crumb.`}
        code={tonesCode}
        filename="Tones.tsx"
      >
        <Tones />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The whole trail is one <C>nav</C> landmark, named by <C>ariaLabel</C> —
          and inside it an <C>ol</C> whose <C>li</C> elements are <em>not</em> only
          crumbs: every separator is an <C>li</C> too, carrying{" "}
          <C>aria-hidden=&ldquo;true&rdquo;</C>, so a four-crumb trail is nine list
          items and a screen reader counts the chevron gaps among them. That is the
          cost of a separator that sits in the flow rather than in CSS; the{" "}
          <C>aria-hidden</C> is what keeps the chevron itself from being read out.
        </p>
        <p>
          The current crumb is where the component is honest-to-here rather than
          honest-to-there. <C>current</C> adds <C>font-medium</C> and the tone
          everywhere, but <C>aria-current=&ldquo;page&rdquo;</C> only on the{" "}
          <C>to</C> and plain-text crumbs — a <C>current</C> crumb that also has{" "}
          <C>href</C> or <C>onClick</C> stays a link or a button and announces
          nothing about being where you are. Mark the last crumb with{" "}
          <C>current</C> and no <C>href</C>/<C>onClick</C> if that matters to you.
          Everything else is naming: icons are decorative (the label is the name),
          a crumb with no <C>label</C> needs <C>ariaLabel</C>, and a badge is read
          as whatever you put in it.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard Support">
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: (
                <>
                  Between crumbs, left to right. Only crumbs that <em>are</em>{" "}
                  something: a <C>to</C> or <C>href</C> crumb is an anchor, an{" "}
                  <C>onClick</C> crumb is a <C>button</C>. A crumb with none of the
                  three — the current page, usually — is a <C>span</C> with no{" "}
                  <C>tabIndex</C>, so it is deliberately not in the ring: you cannot
                  tab to where you already are.
                </>
              ),
            },
            {
              keys: ["enter"],
              action: (
                <>
                  On a focused link or button crumb: follow it. Native, in every
                  case — this component attaches no key handler of its own.
                </>
              ),
            },
            {
              keys: ["space"],
              action: (
                <>
                  On a focused <C>onClick</C> crumb only, because that is the branch
                  that renders a <C>button</C>. Anchors do not activate on Space,
                  and there is nothing in the kit making them.
                </>
              ),
            },
          ]}
        />
        <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          There is no roving tabindex, no arrow-key navigation and no menu to open:
          a breadcrumb trail is a list of links, and the browser already knows how
          to move through a list of links. The focus ring — a 2px ring in the{" "}
          <C>color</C> you chose — is the component&rsquo;s only keyboard-related
          contribution, and it appears on the crumbs that can take focus.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          The kit has no <C>kit.breadcrumb.*</C> keys: <em>every</em> word on screen
          is a prop — <C>label</C>, <C>badge</C>, <C>separator</C>, per-crumb{" "}
          <C>ariaLabel</C> — so translation is entirely yours, and there is nothing
          to locale. The component does speak two strings of its own, both hardcoded
          English rather than catalog keys: the <C>&quot;Breadcrumb&quot;</C>{" "}
          default that names the landmark (pass <C>ariaLabel</C> in your language),
          and the <C>ChevronRight</C> icon behind the default separator.
        </p>
        <p>
          Direction has one real problem and it is the separator. The trail is a flex
          row, so under <C>dir=&quot;rtl&quot;</C> the crumbs themselves mirror, and{" "}
          <C>truncate</C> follows the document&rsquo;s direction; but the default
          glyph is a <em>right</em>-pointing chevron with no RTL flip, so it ends up
          pointing at the past. Pass a mirrored <C>separator</C> — your own element,{" "}
          <C>rtl:rotate-180</C> or a locale-appropriate mark — for anything but
          Latin-left-to-right reading. The crumb&rsquo;s horizontal padding is
          symmetric, and the trail wraps rather than scrolls, so a long translation
          costs a second row, never a clipped crumb.
        </p>
      </A11yTopic>
    </A11ySection>

    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        API
      </h2>
      <div className="flex max-w-3xl flex-col gap-6">
        <PropsTable props={BREADCRUMB_PROPS} />
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <C>BreadcrumbItem</C> — one crumb
          </h3>
          <PropsTable props={BREADCRUMB_ITEM_PROPS} />
        </div>
      </div>
    </section>
  </div>
);

export default BreadcrumbPage;
