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
import { ToastPlayground } from "./ToastPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Severities from "./examples/Severities";
import severitiesCode from "./examples/Severities.tsx?raw";
import StackedAndExpanded from "./examples/StackedAndExpanded";
import stackedAndExpandedCode from "./examples/StackedAndExpanded.tsx?raw";
import EveryPosition from "./examples/EveryPosition";
import everyPositionCode from "./examples/EveryPosition.tsx?raw";
import ProgressAndLoading from "./examples/ProgressAndLoading";
import progressAndLoadingCode from "./examples/ProgressAndLoading.tsx?raw";
import StickyAndGroups from "./examples/StickyAndGroups";
import stickyAndGroupsCode from "./examples/StickyAndGroups.tsx?raw";
import Surfaces from "./examples/Surfaces";
import surfacesCode from "./examples/Surfaces.tsx?raw";
import ActionsAndCustom from "./examples/ActionsAndCustom";
import actionsAndCustomCode from "./examples/ActionsAndCustom.tsx?raw";

/**
 * The three tables, transcribed from the source rather than from memory:
 * `Toast/types.ts` for the message, `Toast/ToastViewport.tsx` for the deck, and
 * `Toast/useToast.ts` for the handle. The playground's snippet test asserts
 * against these rows, so a prop the Code view prints without a row here fails
 * the build — which is the only reason anyone keeps tables like this true.
 */
export const TOAST_INPUT_PROPS: PropDoc[] = [
  {
    name: "intent",
    type: '"info" | "success" | "warning" | "danger" | "neutral"',
    default: '"neutral"',
    description:
      "What the message means. Picks the tone, the default glyph and how assistive tech is told about it.",
  },
  {
    name: "title",
    type: "ReactNode",
    description: "Headline.",
  },
  {
    name: "detail",
    type: "ReactNode",
    description: "Body copy under the title.",
  },
  {
    name: "variant",
    type: "AlertVariant",
    default: '"glass"',
    description: "One of the five Alert surfaces, from the same token table.",
  },
  {
    name: "color",
    type: "TrueColor",
    default: "the intent&rsquo;s tone",
    description: "Overrides just the tone; the intent still picks the glyph and the politeness.",
  },
  {
    name: "size",
    type: "ControlSize",
    default: '"md"',
    description: "Type-and-padding scale: title, detail, glyph and card height move together.",
  },
  {
    name: "icon",
    type: "string | ReactElement | false",
    default: "the intent&rsquo;s icon",
    description: "A registry icon name, your own element, or false for none.",
  },
  {
    name: "vibrancy",
    type: "GlassVibrancy",
    default: '"medium"',
    description: "Backdrop vibrancy — glass variants only, at Panel parity.",
  },
  {
    name: "glassOpacity",
    type: "GlassOpacity",
    default: '"frosted"',
    description: "Glass fill opacity — glass variants only.",
  },
  {
    name: "specularMode",
    type: "SpecularMode",
    default: '"classic"',
    description: "Specular highlight — glass variants only.",
  },
  {
    name: "life",
    type: "number",
    default: "5000",
    description:
      "Auto-dismiss after this many milliseconds. 0 is the same as sticky. The timer pauses while the deck is hovered, focused or pressed, and resumes with its remaining time.",
  },
  {
    name: "sticky",
    type: "boolean",
    default: "false",
    description: "No timer at all.",
  },
  {
    name: "closable",
    type: "boolean",
    default: "true",
    description: "false hides the close button — swipe and the API still dismiss.",
  },
  {
    name: "progress",
    type: "number",
    description:
      "0..100, drawn as the kit&rsquo;s Progress in the message&rsquo;s tone. Patch it live with toast.update(id, { progress }).",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "The kit&rsquo;s Spinner replaces the intent glyph.",
  },
  {
    name: "group",
    type: "string",
    description:
      "Routing key: the message reaches only viewports whose group equals it, and ungrouped messages reach only ungrouped viewports.",
  },
  {
    name: "onClick",
    type: "(event: MouseEvent) => void",
    description:
      "The card body. The close button and the action row stop their own propagation, so they never fire this.",
  },
  {
    name: "actions",
    type: "ToastMessageAction[]",
    description: "Trigger-family buttons in the card&rsquo;s footer row.",
  },
  {
    name: "meta",
    type: "unknown",
    description: "Opaque; echoed back on the close and life-end events.",
  },
];

export const TOAST_VIEWPORT_PROPS: PropDoc[] = [
  {
    name: "group",
    type: "string",
    description:
      "Renders only messages whose group equals it. Omit for the common single-stack app.",
  },
  {
    name: "position",
    type: "ToastPosition",
    default: '"top-right"',
    description: "Six corners plus center; cards slide in from the edge they sit on.",
  },
  {
    name: "mode",
    type: '"stacked" | "expanded"',
    default: '"stacked"',
    description: "Stacked fans out on hover or focus; expanded keeps the fan-out permanent.",
  },
  {
    name: "gap",
    type: "number",
    default: "12",
    description: "Stack offset between cards, in px.",
  },
  {
    name: "limit",
    type: "number",
    default: "3",
    description: "How many newest toasts stay visible.",
  },
  {
    name: "width",
    type: "string",
    default: '"18.75rem"',
    description:
      "The column the cards fill — every card is width:100% of it, so this is the lever for long details.",
  },
  {
    name: "zIndex",
    type: "number",
    default: "2000",
    description: "Above Modal&rsquo;s 1600.",
  },
  {
    name: "breakpoints",
    type: "ToastBreakpoints",
    description:
      "Responsive widths, PrimeVue parity: a style element scoped to this viewport is injected with the media queries.",
  },
  {
    name: "onClose",
    type: "ToastCloseHandler",
    description: "A message of this viewport&rsquo;s group closed, for any reason.",
  },
  {
    name: "onLifeEnd",
    type: "ToastLifeEndHandler",
    description: "One of its messages expired via life.",
  },
  {
    name: "className + attributes",
    type: "string | CSSProperties",
    description: "Forwarded to the fixed-position container.",
  },
];

export const TOAST_API_PROPS: PropDoc[] = [
  {
    name: "show(input)",
    type: "(ToastInput) => number",
    description: "The full form. Returns the id for a later update or close.",
  },
  {
    name: "info · success · warning · danger · neutral",
    type: "(title?, detail?, opts?) => number",
    description:
      "Intent sugar: the tone, the glyph and the live-region politeness come from the shared intent config.",
  },
  {
    name: "update(id, patch)",
    type: "(number, ToastUpdate) => void",
    description: "Patch a live message in place — the progress path.",
  },
  {
    name: "close(id)",
    type: "(number) => void",
    description: "Dismiss one message.",
  },
  {
    name: "closeGroup(group)",
    type: "(string) => void",
    description: "Dismiss a whole batch by its routing key.",
  },
  {
    name: "clear()",
    type: "() => void",
    description: "Empty the store.",
  },
  {
    name: "onClose · onLifeEnd",
    type: "(handler) => () => void",
    description: "Store-level subscriptions — every viewport hears them. Return an unsubscribe.",
  },
];

const ANNOUNCEMENT_CODE = `// intent is the whole announcement story
toast.success("Saved")      // role="status"  aria-live="polite"
toast.danger("Disk full")   // role="alert"   aria-live="assertive"`;

export const ToastPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Toast"
      description="Transient notifications with the kit's alert-family surface. A stack of glass cards pins to a page corner: the newest sits in front, the older ones peek out behind it as a deck — and on hover (or focus) the deck fans out to full height. Auto-dismiss timers pause while the deck is engaged, and every card can be swiped away."
    />
    <ToastPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="One provider, one viewport, one hook call — the toast takes care of its own lifetime."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Severities"
        description="The shared alert-intent scale: the intent picks tone, icon and whether the announcement is polite or assertive."
        code={severitiesCode}
        filename="Severities.tsx"
      >
        <Severities />
      </ExampleCard>
      <ExampleCard
        title="Stacked and expanded"
        description="The signature behaviour: a clipped deck that fans out on hover, and an expanded mode that keeps the fan-out permanent."
        code={stackedAndExpandedCode}
        filename="StackedAndExpanded.tsx"
      >
        <StackedAndExpanded />
      </ExampleCard>
      <ExampleCard
        title="Every position"
        description="All seven anchor points, two rem from every edge — cards slide in from the edge they sit on."
        code={everyPositionCode}
        filename="EveryPosition.tsx"
      >
        <EveryPosition />
      </ExampleCard>
      <ExampleCard
        title="Progress and loading"
        description="A live toast: a spinner and a progress bar while work runs, updated in place by toast.update, then the same card turns green."
        code={progressAndLoadingCode}
        filename="ProgressAndLoading.tsx"
      >
        <ProgressAndLoading />
      </ExampleCard>
      <ExampleCard
        title="Sticky and groups"
        description="Sticky toasts opt out of the timer; a group tag lets one call clear a whole batch at once."
        code={stickyAndGroupsCode}
        filename="StickyAndGroups.tsx"
      >
        <StickyAndGroups />
      </ExampleCard>
      <ExampleCard
        title="Surfaces"
        description="The same five Alert surfaces — subtle, solid, outline, glass and liquid-glass — driven by the same token table."
        code={surfacesCode}
        filename="Surfaces.tsx"
      >
        <Surfaces />
      </ExampleCard>
      <ExampleCard
        title="Actions and custom"
        description="A clickable card body, an action row, and a custom icon — action clicks stop propagation."
        code={actionsAndCustomCode}
        filename="ActionsAndCustom.tsx"
      >
        <ActionsAndCustom />
      </ExampleCard>
    </section>
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          Each card <em>is</em> the live region: <C>role</C> and{" "}
          <C>aria-live</C> come from the intent, through the same{" "}
          <C>ALERT_INTENT_CONFIG</C> the <C>Alert</C> reads —{" "}
          <C>info</C>, <C>success</C> and <C>neutral</C> announce politely as{" "}
          <C>status</C>, <C>warning</C> and <C>danger</C> interrupt as{" "}
          <C>alert</C> — with <C>aria-atomic="true"</C> so the card is read as
          one statement rather than as its parts. A card clipped behind the
          deck is <C>aria-hidden</C> as well as <C>tabIndex=&#123;-1&#125;</C>,
          so the pile you cannot see is not read to you either; it becomes
          speakable when the deck opens. The close button is a real{" "}
          <C>&lt;button&gt;</C>, and the action row is trigger-family buttons,
          so both are named by their own content. <C>progress</C> is the
          kit&rsquo;s <C>Progress</C>, which publishes <C>role="progressbar"</C>{" "}
          and <C>aria-valuenow</C> rather than a coloured strip.
        </p>
        <A11yCode filename="Announcement.tsx" code={ANNOUNCEMENT_CODE} />
      </A11yTopic>
      <A11yTopic title="Keyboard Support">
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: (
                <>
                  Move through the visible cards&rsquo; close buttons and
                  action rows. Cards hidden in the deck hold{" "}
                  <C>tabIndex=&#123;-1&#125;</C>, so they join the tab order
                  once the deck is open — and opening the deck by focusing into
                  it is what <C>mode="stacked"</C> does on hover, with the same
                  timers paused.
                </>
              ),
            },
            {
              keys: ["enter", "space"],
              action: (
                <>
                  Activate the focused close button or action button (native
                  behaviour). A clickable card body has no key binding of its
                  own: <C>onClick</C> is a pointer affordance, and the actions
                  row is where a keyboard user acts.
                </>
              ),
            },
          ]}
        />
        <p>
          There is deliberately no <C>Escape</C> binding. A toast is not a
          dialog: it does not take focus, does not trap it, and does not own
          the page, so <C>Escape</C> would mean whatever the page above it
          already means. Dismissal has two honest paths — the close button for
          the keyboard, swipe for the pointer.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          The component speaks exactly one string of its own: the close
          button&rsquo;s accessible name, <C>kit.toast.closeAria</C> (&ldquo;Close
          notification&rdquo;), which comes from the kit&rsquo;s i18n
          dictionary and ships translated in the five built-in locales.
          Everything else it says is the caller&rsquo;s — <C>title</C>,{" "}
          <C>detail</C>, <C>actions[].label</C>, <C>icon</C> — passed through
          untouched, so the live region reads your text in your page&rsquo;s{" "}
          <C>lang</C> and nothing needs translating in the kit. Two things to
          know about the deck itself: the corners are <em>physical</em>, not
          logical, so an RTL page picks <C>top-left</C> for what an LTR page
          calls <C>top-right</C>; and the column width is the one layout lever
          a long translation has, since every card is 100% of it and the title
          wraps while the buttons keep their row.
        </p>
      </A11yTopic>
    </A11ySection>
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        API
      </h2>
      <div className="max-w-3xl">
        <PropsTable title="ToastInput — toast.show(…)" props={TOAST_INPUT_PROPS} />
        <PropsTable title="ToastViewport" props={TOAST_VIEWPORT_PROPS} />
        <PropsTable title="The handle — useToast()" props={TOAST_API_PROPS} />
      </div>
    </section>
  </div>
);

export default ToastPage;
