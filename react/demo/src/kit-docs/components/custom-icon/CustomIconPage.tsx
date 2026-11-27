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
import { CustomIconPlayground } from "./CustomIconPlayground";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import Tinting from "./examples/Tinting";
import tintingCode from "./examples/Tinting.tsx?raw";
import ButtonMode from "./examples/ButtonMode";
import buttonModeCode from "./examples/ButtonMode.tsx?raw";
import Fallback from "./examples/Fallback";
import fallbackCode from "./examples/Fallback.tsx?raw";
import ConsumerIcons from "./examples/ConsumerIcons";
import consumerIconsCode from "./examples/ConsumerIcons.tsx?raw";

/**
 * One row per declared prop (`CustomIcon.tsx:8-49`), in declaration order, plus
 * `style` and the pass-through spread. Nothing here is a guess: a row exists only
 * because the component reads the name.
 */
export const CUSTOM_ICON_PROPS: PropDoc[] = [
  {
    name: "icon",
    type: "IconName | IconComponent",
    description: (
      <>
        Required. A built-in key, a name added by <C>registerIcons</C>, or a React
        SVG component passed straight in (:14,:79). An unresolvable name warns once
        in the console (:141-144) and renders a size-preserving monogram
        (:130-139).
      </>
    ),
  },
  {
    name: "alt",
    type: "string",
    description: (
      <>
        The accessible name. Absent means decoration — <C>aria-hidden</C>{" "}
        (:125-128); present means <C>role=&quot;img&quot;</C> with that{" "}
        <C>aria-label</C>. In button mode it is also the button&rsquo;s name, so an
        activatable icon without it is an unlabelled control (:157-159).
      </>
    ),
  },
  {
    name: "customSize",
    type: "number | string",
    description: (
      <>
        Explicit size: a number becomes <C>px</C>, a string is used as the CSS
        length, and either way it goes into inline style and retires the size class
        (:22,:81-91,:105-106).
      </>
    ),
  },
  {
    name: "size",
    type: "IconSize",
    default: '"md"',
    description: (
      <>
        The shared control scale — <C>md</C> is <C>h-6 w-6</C>, 24px (:51-57,:66).
        Only applied when neither <C>customSize</C> nor a width/height token in{" "}
        <C>className</C> is present (:105-106).
      </>
    ),
  },
  {
    name: "tone",
    type: "TrueColor",
    description: (
      <>
        Theme tint, as <C>text-{`{tone}`}-500 dark:text-{`{tone}`}-400</C> — icons
        paint with <C>currentColor</C>, so tinting is just CSS colour (:26,:108-111).
        Suppressed by <C>color</C> and by <C>colored</C>.
      </>
    ),
  },
  {
    name: "color",
    type: "string",
    description: (
      <>
        <em>Not</em> the <C>tone</C> alias other controls carry: a raw CSS colour
        written to inline style, winning over <C>tone</C> and silenced by{" "}
        <C>colored</C> (:31,:92-101,:97,:109).
      </>
    ),
  },
  {
    name: "hoverColor",
    type: "string",
    description: (
      <>
        Raw CSS colour on hover. An inline style cannot express <C>:hover</C>, so it
        travels as <C>--icon-hover-color</C> and a stylesheet rule reads it — that
        class is added only when a hover colour exists (:33,:98-100,:119, and{" "}
        <C>styles.css:394-396</C> is the rule).
      </>
    ),
  },
  {
    name: "colored",
    type: "boolean",
    default: "false",
    description: (
      <>
        Keep the icon&rsquo;s own colours: makes <C>tone</C>, <C>color</C> and{" "}
        <C>hoverColor</C> inert, for multicolour glyphs (:35,:70,:92-101,:109).
      </>
    ),
  },
  {
    name: "spin",
    type: "boolean",
    default: "false",
    description: (
      <>
        <C>animate-spin</C>, stilled by <C>motion-reduce:animate-none</C> when the
        user has asked for less motion (:37,:71,:120).
      </>
    ),
  },
  {
    name: "onClick",
    type: "(event: MouseEvent<HTMLElement>) => void",
    description: (
      <>
        Renders a real <C>&lt;button type=&quot;button&quot;&gt;</C> instead of a
        span — keyboard-reachable, named by <C>alt</C>, focus ring in the icon&rsquo;s
        own colour (:43,:146-164).
      </>
    ),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: (
      <>
        In button mode the native attribute, so the button leaves the tab order
        (:151); in span mode pointer events are off and the wrapper drops to{" "}
        <C>opacity-50</C> (:44,:73,:121).
      </>
    ),
  },
  {
    name: "className",
    type: "string",
    description: (
      <>
        Merged last, so it wins (:45,:122). A <C>w-*</C>/<C>h-*</C> token in it
        suppresses the <C>size</C> class entirely (:105-106), and{" "}
        <C>mergeClassTokens</C> removes the losing width/height tokens rather than
        leaving both in place (:113-123).
      </>
    ),
  },
  {
    name: "style",
    type: "CSSProperties",
    description: (
      <>
        Spread first, then the computed width, height, <C>color</C> and{" "}
        <C>--icon-hover-color</C> are layered on top — so your own keys survive,
        unless they collide with one of those four (:75,:86-103).
      </>
    ),
  },
  {
    name: "forceSvg",
    type: "boolean",
    description: (
      <>
        Deprecated and inert (:47-48). It is not read; it falls through{" "}
        <C>...rest</C> onto the DOM element (:76,:160,:168), so it does leave a
        trace in the markup. The registry has been component-based only.
      </>
    ),
  },
  {
    name: "…",
    type: "HTMLAttributes<HTMLSpanElement>",
    description: (
      <>
        Everything else spreads onto the wrapper (:76,:160,:168) — <C>id</C>,{" "}
        <C>title</C>, extra ARIA. <C>children</C>, <C>color</C> and{" "}
        <C>onClick</C> are omitted from that spread because the component owns them
        (:9-12).
      </>
    ),
  },
];

/**
 * Every binding the component actually has: none of its own. `CustomIcon.tsx`
 * registers no key handler — what a keyboard user gets is what a real{" "}
 * <code>&lt;button&gt;</code> does, and only when <code>onClick</code> is set.
 */
export const KEYBOARD: KeyboardBinding[] = [
  {
    keys: ["Tab"],
    action: (
      <>
        Reaches the icon — in button mode only. Without <C>onClick</C> the wrapper is
        a span, and a span is not a tab stop at all (:146-171). The indicator is{" "}
        <C>focus-visible:ring-2 focus-visible:ring-current</C>, so the ring inherits
        the tint (:154).
      </>
    ),
  },
  {
    keys: ["Enter"],
    action: (
      <>
        Activates the icon, via the browser&rsquo;s own button behaviour on the real{" "}
        <C>&lt;button type=&quot;button&quot;&gt;</C> (:148-151). No key handler
        exists in the component to imitate it.
      </>
    ),
  },
  {
    keys: ["Space"],
    action: (
      <>
        Activates it too — again the native button contract, not a{" "}
        <C>keydown</C> the kit wrote (:148-151). <C>disabled</C> removes both,
        because it is the real attribute (:151).
      </>
    ),
  },
];

const LABELS_CODE = `import { CustomIcon } from "@cjlapao/ui-kit";

// The component carries no strings of its own — the only text is the caller's.
// Localize \`alt\` like any other label and the icon announces in the page's
// language, in either direction.
<CustomIcon icon="Trash" alt={t("notes.delete")} />

// Decorative beside a label: no \`alt\`, so nothing is announced twice, and no
// translation is needed either.
<span>{t("notes.delete")} <CustomIcon icon="Trash" /></span>

// Directional glyphs read as "back"/"next", which flips in RTL — mirror the
// drawing, keep the name in the user's own words.
<CustomIcon icon="ArrowChevronRight" alt={t("common.next")} className="rtl:-scale-x-100" />`;

export const CustomIconPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Custom Icon"
      description="Renders any icon in the registry. Tinted with a theme tone or a raw colour; clickable icons render as real buttons, and a missing name falls back to a size-preserving monogram."
    />
    <CustomIconPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Size ladder"
        description="The shared control scale from a 16px hairline icon to 32px, plus an explicit pixel override with customSize."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Tinting"
        description="Theme tones, a raw colour that wins over tone (with a hover colour), and colored, which keeps the icon's own colours."
        code={tintingCode}
        filename="Tinting.tsx"
      >
        <Tinting />
      </ExampleCard>
      <ExampleCard
        title="Button mode"
        description="onClick turns the icon into a real, keyboard-reachable button — with a disabled state, and spin for in-flight actions."
        code={buttonModeCode}
        filename="ButtonMode.tsx"
      >
        <ButtonMode />
      </ExampleCard>
      <ExampleCard
        title="Consumer SVG icons"
        description="Register React SVG components once at app startup, or pass a component directly. Forward SVG props and use currentColor to inherit tone, color and hoverColor; use colored to preserve fixed SVG colors."
        code={consumerIconsCode}
        filename="ConsumerIcons.tsx"
      >
        <ConsumerIcons />
      </ExampleCard>
      <ExampleCard
        title="Unknown icon"
        description="A name that is not in the registry falls back to a monogram that keeps the requested size."
        code={fallbackCode}
        filename="Fallback.tsx"
      >
        <Fallback />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          <C>alt</C> decides the icon&rsquo;s entire contract. Omit it and the
          wrapper is <em>decoration</em> — <C>aria-hidden</C>, invisible to readers
          (:125-128), which is exactly right beside a visible label and wrong
          standing on its own. Supply it and the wrapper becomes{" "}
          <C>role=&quot;img&quot;</C> carrying that text as <C>aria-label</C>{" "}
          (:126-128). Inside, the glyph itself is always <C>aria-hidden</C> and{" "}
          <C>focusable=&quot;false&quot;</C> (:131) — an inline SVG can otherwise
          join the tab order and hand a keyboard user a stop with no name. The
          registry fallback is decoration too, never a guess at a name: a missing
          icon should not start talking (:130-139).
        </p>
        <p>
          <C>onClick</C> changes the element, not just the cursor: a real{" "}
          <C>&lt;button type=&quot;button&quot;&gt;</C> named by <C>alt</C>{" "}
          (:146-164). The earlier shape — a span with a click handler — looked
          identical and was unreachable, which is an accessibility bug with good
          pixels. The source says as much (:38-42). Note what that means for the
          knobs above: an activatable icon with no <C>alt</C> is an unlabelled
          button (:157-159), and the dev build does not warn about it — the
          component only warns about unknown names (:141-144).
        </p>
        <A11yCode code={LABELS_CODE} filename="Labels.tsx" />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          The component binds no keys itself — <C>CustomIcon.tsx</C> has no{" "}
          <C>onKeyDown</C> anywhere. Everything a keyboard user gets is the browser
          doing its job on the element the component chose, and the element depends
          on <C>onClick</C>:
        </p>
        <KeyboardSupportTable bindings={KEYBOARD} />
        <p>
          Nothing else is bound: no arrow-key roving, no <C>Escape</C>, no
          typeahead. An icon without <C>onClick</C> is not focusable and should not
          be — if it needs to be, that is what <C>onClick</C> (or a real{" "}
          <C>IconButton</C>) is for. <C>disabled</C> is the native attribute in
          button mode, so the control leaves the tab order rather than sitting in it
          inert (:151); in span mode it is cosmetic — <C>pointer-events-none</C> and{" "}
          <C>opacity-50</C> on something that was never interactive (:121).
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          There are no <C>kit.custom-icon.*</C> message keys and the component
          imports no translation hook — it renders no strings of its own except the
          fallback monogram. <C>alt</C> is the caller&rsquo;s text and arrives in
          whatever language the page runs in; localize it like any other label.
          Localizing the icon <em>itself</em> is not a translation task but a
          naming task: the registry is the vocabulary, so pick the neutral glyph
          (a trash can for delete, a gear for settings) rather than one whose
          metaphor is regional.
        </p>
        <p>
          Direction lives in the drawing, not in the layout: the wrapper is{" "}
          <C>inline-flex</C> with the glyph at <C>h-full w-full</C> (:113-123,:131),
          which is direction-agnostic, so an arrow-style icon still points the way it
          was drawn in an RTL document. Mirror it with{" "}
          <C>className=&quot;rtl:-scale-x-100&quot;</C> and name it in the
          user&rsquo;s terms via <C>alt</C>. The one string the component does render
          is the fallback&rsquo;s first letter of the registry key (:136-137) —
          capitalised by CSS <C>uppercase</C>, not by locale, and it is a
          broken-placeholder shape rather than content: never a place to hang a
          translation. The console warning is a developer message, so it stays
          English like every other warning (:143).
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable props={CUSTOM_ICON_PROPS} />

    <p className="text-xs leading-6 text-neutral-600 dark:text-neutral-400">
      <C>registerIcons(icons, options?)</C> takes a record of names to SVG
      components and returns a cleanup function. Duplicate names throw unless{" "}
      <C>{"{ override: true }"}</C> is supplied, and the whole batch is validated
      before anything changes (<C>icons/customRegistry.ts:36-42</C>). Register at app startup, including server
      startup for SSR; a later registration still repaints icons that are already
      mounted, because the component subscribes with <C>useSyncExternalStore</C>{" "}
      (:78). A name registered by a consumer shadows the built-in, and the last
      registration wins (<C>icons/customRegistry.ts:24-28</C>). Imported SVG files need a bundler SVG-to-React
      transform — URL strings and raw SVG markup are not supported.
    </p>
  </div>
);

export default CustomIconPage;
