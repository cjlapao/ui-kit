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
import { CustomIconPlayground } from "./CustomIconPlayground";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import Tinting from "./examples/Tinting";
import tintingCode from "./examples/Tinting.tsx?raw";
import ButtonMode from "./examples/ButtonMode";
import buttonModeCode from "./examples/ButtonMode.tsx?raw";
import Fallback from "./examples/Fallback";
import fallbackCode from "./examples/Fallback.tsx?raw";

export const CustomIconPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
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
          The <C>alt</C> prop decides the icon&rsquo;s whole a11y contract: omit
          it and the icon is <em>decoration</em> — <C>aria-hidden</C>, invisible
          to readers, which is exactly right beside a visible label and wrong
          standing alone. Supply it and the wrapper is <C>role="img"</C> with
          that <C>aria-label</C>, announced as one image. Inside, every glyph is{" "}
          <C>aria-hidden</C> and <C>focusable="false"</C> — SVG can otherwise
          join the tab order on old Edge/IE and hand keyboard users a stop with
          no name. The registry fallback (a monogram square for an unknown name)
          is decoration, never a guess at a name: a missing icon should not
          start talking.
        </p>
        <p>
          <C>onClick</C> changes the element itself: a real{" "}
          <code>&lt;button type=&quot;button&quot;&gt;</code>, named by{" "}
          <C>alt</C>. The earlier shape — a <code>span</code> with a click
          handler — looked identical and was unreachable; a mouse-only icon
          control is an accessibility bug with good pixels.
        </p>
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          Button mode inherits all of it: <Kbd>Tab</Kbd> arrives,{" "}
          <Kbd>Enter</Kbd>/<Kbd>Space</Kbd> fire, and the focus indicator is{" "}
          <C>focus-visible:ring-current</C> — the ring takes the tint the icon
          already has, so it stays visible on any tone and any host, and a mouse
          click does not leave it behind. <C>disabled</C> is the native
          attribute (out of the tab order) plus <C>opacity-50</C>; the spin
          animation honours <C>prefers-reduced-motion</C> and stops dead when
          the user has asked for less motion.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Icons carry no strings to localize — <C>alt</C> is the caller&rsquo;s
          text and arrives in whatever language the page runs in; localize it
          like any label (the i18n page shows the override route). Two
          directional notes: the registry itself is the language-neutral
          vocabulary — prefer the neutral glyphs for concepts like settings or
          delete; and arrow-style icons are read as meaning
          &ldquo;back&rdquo;/&ldquo;next&rdquo;, which flips in RTL — name them
          in the user&rsquo;s terms via <C>alt</C>, or mirror them with{" "}
          <C>className=&quot;rtl:-scale-x-100&quot;</C>. The fallback monogram
          uses the registry key&rsquo;s first letter, not localized text — it is
          a broken-placeholder shape, not content.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "icon",
          type: "IconName",
          description:
            "Registry key. An unknown name warns once and falls back to a monogram that keeps the requested size.",
        },
        {
          name: "alt",
          type: "string",
          description:
            'Accessible name. Omit for decoration (`aria-hidden`); supply for an announced `role="img"` — required in practice when `onClick` is set, or the button is unlabelled.',
        },
        {
          name: "size",
          type: "IconSize",
          default: '"md"',
          description:
            "The shared control scale — `md` is 24px (`h-6 w-6`). Ignored when `customSize` or a size class is given.",
        },
        {
          name: "customSize",
          type: "number | string",
          description:
            "Explicit pixels or any CSS length; numbers become px. Wins over `size`.",
        },
        {
          name: "tone",
          type: "TrueColor",
          description:
            "Theme tint (`text-{tone}-500`, `-400` in dark). Icons paint with `currentColor`, so the tint is just CSS colour.",
        },
        {
          name: "color",
          type: "string",
          description:
            "Raw CSS colour for values outside the palette — this is *not* the `tone` alias other controls carry; it wins over `tone` and dies to `colored`.",
        },
        {
          name: "hoverColor",
          type: "string",
          description:
            "Raw CSS colour on hover, carried as a custom property a `.custom-icon` rule consumes (an inline style cannot express `:hover`).",
        },
        {
          name: "colored",
          type: "boolean",
          default: "false",
          description:
            "Keep the icon's own colours; makes `tone`, `color` and `hoverColor` inert. For multicolour glyphs.",
        },
        {
          name: "spin",
          type: "boolean",
          default: "false",
          description:
            "`animate-spin`, stilled by `motion-reduce:animate-none` for reduced-motion users.",
        },
        {
          name: "onClick",
          type: "(event) => void",
          description:
            'Renders a real `<button type="button">` instead of a span — keyboard-reachable, named by `alt`, focus ring in the icon\'s own colour.',
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description:
            "Native `disabled` in button mode; pointer events off + `opacity-50` in span mode.",
        },
        {
          name: "className",
          type: "string",
          description:
            "Merged onto the wrapper; an explicit size class overrides `size`.",
        },
      ]}
    />

    <p className="text-xs opacity-70">
      Other HTML attributes spread through to the wrapper (span or button), so{" "}
      <C>title</C>, <C>id</C>, and extra aria attributes land where they should.{" "}
      <C>forceSvg</C> is accepted but does nothing — the registry has been
      component-based only since the icons were rebuilt.
    </p>
  </div>
);

export default CustomIconPage;
