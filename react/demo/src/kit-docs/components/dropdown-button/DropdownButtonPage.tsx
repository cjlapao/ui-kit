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
import { DropdownButtonPlayground } from "./DropdownButtonPlayground";
import EveryVariant from "./examples/EveryVariant";
import everyVariantCode from "./examples/EveryVariant.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import SplitVersusSingle from "./examples/SplitVersusSingle";
import splitVersusSingleCode from "./examples/SplitVersusSingle.tsx?raw";

export const DropdownButtonPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Dropdown Button"
      description="A Button with an optional caret trigger that opens a menu. The trigger keeps the full Button language — variant, size and tone — while the menu takes its positioning from DropdownMenu, and an empty menu hides the caret entirely."
    />
    <DropdownButtonPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Every variant"
        description="All button variants at one tone and size, each with a working menu."
        code={everyVariantCode}
        filename="EveryVariant.tsx"
      >
        <EveryVariant />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared control scale, solid blue."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="All 21 true colours, solid at one size."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
      <ExampleCard
        title="Split versus single"
        description="The default split trigger, the collapsed single trigger, and an empty menu that hides the caret."
        code={splitVersusSingleCode}
        filename="SplitVersusSingle.tsx"
      >
        <SplitVersusSingle />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The two halves announce differently on purpose: the primary button is
          just its label; the caret is a second button named <C>caretLabel</C>{" "}
          (defaulting to the localized &ldquo;Toggle dropdown menu&rdquo;)
          carrying <C>aria-haspopup=&quot;menu&quot;</C> and a live{" "}
          <C>aria-expanded</C>. The open menu is a proper{" "}
          <code>role=&quot;menu&quot;</code> of{" "}
          <code>role=&quot;menuitem&quot;</code>s — descriptions become the
          item&rsquo;s accessible description, disabled items are natively
          disabled, and only one item sits in the tab order at a time (roving
          tabindex). The caret&rsquo;s name used to be hardcoded English; it now
          comes from the kit catalogs (en/de/es/fr/pt).
        </p>
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          <Kbd>Tab</Kbd> reaches the primary button, then the caret. Opening the
          menu (click, <Kbd>Enter</Kbd> or <Kbd>Space</Kbd> on the caret) moves
          focus straight to the first enabled item — from there{" "}
          <Kbd>ArrowDown</Kbd>/<Kbd>ArrowUp</Kbd> walk the items skipping
          disabled ones, <Kbd>Home</Kbd>/<Kbd>End</Kbd> jump to the ends,{" "}
          <Kbd>Enter</Kbd> activates. <Kbd>Escape</Kbd> closes and returns focus
          to the caret; <Kbd>Tab</Kbd> closes without trapping, matching the
          ARIA menu pattern. An outside click closes but does <em>not</em> yank
          focus back — if the user clicked another control, focus stays where
          they put it.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The only string the control owns is the caret&rsquo;s accessible name,
          and it is cataloged; everything else — labels, option text,
          descriptions — is caller data and localizes with the page. Give
          <C>caretLabel</C> the specific thing the menu does (&ldquo;Deploy
          options&rdquo;) when a list of buttons sits side by side —
          &ldquo;Toggle dropdown menu&rdquo; repeated five times reads as five
          identical, anonymous stops.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "label",
          type: "ReactNode",
          description:
            "The primary button's content. Its accessible name — keep it a verb (Deploy, Export).",
        },
        {
          name: "options",
          type: "DropdownButtonOption[]",
          description:
            "`{ value, label, description?, icon?, disabled?, danger? }`. Empty hides the caret (see below) — the control becomes a plain button.",
        },
        {
          name: "onPrimaryClick",
          type: "(event) => void",
          description:
            "The default action on the wide button. Caret clicks never fire it, primary clicks never open the menu.",
        },
        {
          name: "onOptionSelect",
          type: "(option) => void",
          description:
            "Fires on an enabled item, then closes the menu. Disabled items are inert.",
        },
        {
          name: "split",
          type: "boolean",
          default: "true",
          description:
            "Split gives the caret its own full button width; single collapses it to an icon-only trigger joined to the main button.",
        },
        {
          name: "hideDropdownTriggerWhenEmpty",
          type: "boolean",
          default: "true",
          description:
            "With `false`, an option-less button keeps a visible — disabled — caret.",
        },
        {
          name: "menuWidth",
          type: 'number | "trigger"',
          default: "220",
          description:
            "Menu width in px, or match the trigger. (The playground defaults to `trigger` to show the anchored sizing.)",
        },
        {
          name: "caretLabel",
          type: "string",
          default: 't("kit.dropdownbutton.toggle")',
          description:
            "Accessible name for the caret — override per control for lists of buttons.",
        },
        {
          name: "variant / color / size",
          type: "ButtonVariant / TrueColor / ButtonSize",
          default: '"solid" / "blue" / "md"',
          description:
            "The Button language, Button's own vocabularies — `color`, not `tone`, same as Button. `clear` is deliberately absent: a borderless button has no surface for the caret seam, so the split would read as text beside a mystery box. JS callers passing it get `ghost`.",
        },
        {
          name: "dropdownIcon",
          type: 'ButtonProps["leadingIcon"]',
          default: '"ArrowDown"',
          description: "The caret glyph.",
        },
        {
          name: "fullWidth / disabled",
          type: "boolean",
          default: "false",
          description:
            "Full width makes the main button flex; disabled takes out both halves.",
        },
        {
          name: "menuClassName / className",
          type: "string",
          description:
            "`className` lands on the wrapper (both halves + menu host), `menuClassName` on the menu.",
        },
      ]}
    />

    <p className="text-xs opacity-70">
      Remaining <code>ButtonProps</code> (icons, loading, corner, onClick, html
      type…) spread onto the <em>primary button only</em>. The menu itself is{" "}
      <code>DropdownMenu</code> — a separate component with its own page —
      teleported to <code>document.body</code> and anchored to the control.
    </p>
  </div>
);

export default DropdownButtonPage;
