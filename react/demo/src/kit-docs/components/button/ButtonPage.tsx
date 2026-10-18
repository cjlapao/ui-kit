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
import { ButtonPlayground } from "./ButtonPlayground";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import Icons from "./examples/Icons";
import iconsCode from "./examples/Icons.tsx?raw";
import AllTones from "./examples/AllTones";
import allTonesCode from "./examples/AllTones.tsx?raw";
import Active from "./examples/Active";
import activeCode from "./examples/Active.tsx?raw";

export const ButtonPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Button"
      description="The primary action control. Eight variants, five sizes, four label weights and every true color — plus loading, disabled and icon states, all on one component."
    />
    <ButtonPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Variants"
        description="From the loudest solid primary to a nearly invisible clear button."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="The shared control scale, from xs for dense toolbars up to xl for empty states."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="Loading keeps the spinner bright while blocking input; disabled dims the label and the control."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Icons"
        description="Leading and trailing icons from the registry by name, and the icon-only variant for compact toolbars."
        code={iconsCode}
        filename="Icons.tsx"
      >
        <Icons />
      </ExampleCard>
      <ExampleCard
        title="All tones"
        description="Every one of the 21 true colours as a solid button, fixed size."
        code={allTonesCode}
        filename="AllTones.tsx"
      >
        <AllTones />
      </ExampleCard>
      <ExampleCard
        title="Pressed"
        description="The active prop is the persistent “on” state — a toggle that stays lit, distinct from the hover and focus styles."
        code={activeCode}
        filename="Active.tsx"
      >
        <Active />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          A <code>&lt;button&gt;</code> is the whole semantic story — no listbox
          theatre, no fake roles. What the button is <em>for</em> is what
          matters, so an unnamed one is treated as a bug: in development the kit
          warns (<C>warnIfMissingName</C>) when a Button has neither children
          nor an <C>aria-label</C>, and an icon-only button renders an sr-only
          label — the visible children, else the <C>aria-label</C>, else a
          localised fallback (<C>kit.button.name</C>) so it is at least
          announced as <em>something</em> in the user&rsquo;s language. An{" "}
          <C>aria-hidden</C> on an enabled Button also warns — it would hide a
          control that is still in the tab order.
        </p>
        <p>
          <C>loading</C> sets <C>aria-busy</C> on the button and hides the
          spinner from readers (<C>aria-hidden</C>) — the busy state is the
          announcement, not a spinning glyph. <C>disabled</C> is the native
          attribute, which removes the button from the tab order and the
          accessibility tree exactly as intended; a real <code>disabled</code>{" "}
          always beats a click-blocker. A <C>tooltip</C> is portalled with{" "}
          <C>role="tooltip"</C> and, while visible, linked to the button via{" "}
          <C>aria-describedby</C>, so it is spoken with the name.
        </p>
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          Native behaviour is kept whole: <Kbd>Tab</Kbd> reaches it,{" "}
          <Kbd>Enter</Kbd> and <Kbd>Space</Kbd> activate it, disabled skips it.
          Every variant and every accent/glass layer carries a{" "}
          <C>focus-visible</C> ring — no mouse-click can produce one, but
          keyboard focus always can. <C>type</C> defaults to{" "}
          <code>"button"</code>, not the HTML default <code>"submit"</code>: a
          Button inside a <code>&lt;form&gt;</code> used to fire the form on a
          stray Enter; an explicit <C>type="submit"</C> still opts in.
          <C>loading</C> also blocks the click (the attribute is set, the
          spinner kept bright — <code>disabled:opacity-50</code> is skipped
          while loading so the one element that must stay visible does).
        </p>
        <p>
          A <C>tooltip</C> answers to focus as well as hover — pointer-only
          hints are invisible to keyboard drivers — and appears instantly on
          focus rather than after the hover delay.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Button is mostly language-free: the label, tooltip text and accessible
          name are the caller&rsquo;s and pass through untouched. The one
          built-in string is the icon-only fallback name —{" "}
          <C>kit.button.name</C>, five locales — used only when nothing else
          names the control. Icons come from the registry by name, so they carry
          no words at all. Want a new language? Layer <C>kit.button.*</C> keys
          in your own catalogs — the i18n page shows the override live.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "variant",
          type: "ButtonVariant",
          default: '"solid"',
          description:
            "solid · soft · outline · ghost · link · clear · icon · glass — solid is the primary action, ghost/link the quiet ones, icon the compact toolbar square.",
        },
        {
          name: "color",
          type: "TrueColor",
          default: '"blue"',
          description:
            "The kit's 21 true colours; every fill, hover, ring and glass tint derives from it.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: '"md"',
          description:
            "The shared control scale — padding, label type, icon size and spinner size all derive from it. xs for dense toolbars up to xl for empty states.",
        },
        {
          name: "weight",
          type: "ButtonWeight",
          default: '"normal"',
          description: "Label font weight: normal through bold.",
        },
        {
          name: "leadingIcon / trailingIcon",
          type: "string | ReactElement",
          description:
            "Registry name or a rendered element. Icons paint with `currentColor` and match the label; `iconColor` tints the glyph alone.",
        },
        {
          name: "iconOnly",
          type: "boolean",
          description:
            'Square icon button; the accessible name comes from children, `aria-label`, or the localised fallback — never silence. (`variant="icon"` implies it.)',
        },
        {
          name: "loading",
          type: "boolean",
          description:
            "Spinner replaces the icon, `aria-busy` appears, clicks are blocked without dimming the spinner, and the trailing icon steps aside for it.",
        },
        {
          name: "disabled",
          type: "boolean",
          description:
            "Native attribute; dims the whole control and leaves the tab order.",
        },
        {
          name: "active",
          type: "boolean",
          description:
            'Persistent lit "on" state with hover suppressed — a toggle that stays visibly pressed. `accentColor` overrides which colour lights it.',
        },
        {
          name: "accent / accentColor",
          type: "boolean / TrueColor",
          description:
            '"The parent owns the fill": the variant\'s fill drops out and only the accent ring and hover wash remain. `accentColor` alone swaps just the hover colour.',
        },
        {
          name: "glass / vibrancy / glassOpacity / specularMode",
          type: "boolean / GlassVibrancy / GlassOpacity / SpecularMode",
          description:
            'Translucent chrome with backdrop vibrancy and an optional specular overlay. `variant="glass"` implies `glass`; the tuning knobs apply to either.',
        },
        {
          name: "tooltip / tooltipPosition",
          type: "string / TooltipPosition",
          description:
            "Portalled styled tooltip on hover and focus, described to screen readers while visible.",
        },
        {
          name: "fullWidth",
          type: "boolean",
          description:
            "Stretch to the container — form actions, mobile sheets.",
        },
        {
          name: "type",
          type: '"button" | "submit" | "reset"',
          default: '"button"',
          description:
            "Overrides HTML's submit-by-default so a button in a form does not submit it by accident.",
        },
      ]}
    />
    <p className="text-sm text-neutral-500 dark:text-neutral-400">
      Spreads native button attributes — <code>onClick</code>,{" "}
      <code>aria-*</code>, <code>data-*</code> pass straight through, and the
      dev-mode name warning listens to the ones you set there too.
    </p>
  </div>
);

export default ButtonPage;
