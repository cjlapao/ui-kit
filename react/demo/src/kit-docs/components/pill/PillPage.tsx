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
import { PillPlayground } from "./PillPlayground";
import StatusBoard from "./examples/StatusBoard";
import statusBoardCode from "./examples/StatusBoard.tsx?raw";
import VariantsAndTones from "./examples/VariantsAndTones";
import variantsAndTonesCode from "./examples/VariantsAndTones.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import InteractiveTags from "./examples/InteractiveTags";
import interactiveTagsCode from "./examples/InteractiveTags.tsx?raw";

export const PillPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Pill"
      description="Small labels for status and metadata. Three opaque variants plus two glass ones, the full tone set, optional icons, a remove button, and a bare status dot."
    />
    <PillPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Status board"
        description="A row of service states — filled, icon-led, outlined and a bare dot — each carrying its own tone."
        code={statusBoardCode}
        filename="StatusBoard.tsx"
      >
        <StatusBoard />
      </ExampleCard>
      <ExampleCard
        title="Variants and tones"
        description="All five variants side by side, then the full tone palette at once."
        code={variantsAndTonesCode}
        filename="VariantsAndTones.tsx"
      >
        <VariantsAndTones />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="Pill and dot across the whole size scale — and a pill dot lines up with a Badge dot at the same size."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Interactive tags"
        description="Removable tags (removing never activates the pill), a clickable pill, a disabled one, a truncated label and a labelled dot."
        code={interactiveTagsCode}
        filename="InteractiveTags.tsx"
      >
        <InteractiveTags />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          A pill is a label — its text is its name, nothing extra needed. The
          two forms that carry no text handle it explicitly: a <C>dot</C> is{" "}
          <C>aria-hidden</C> unless given a <C>label</C> (then{" "}
          <C>role=&quot;img&quot;</C> with that name), and the remove button is
          named by <C>removeLabel</C>, defaulting to the localized
          &ldquo;Remove&rdquo;. The earlier shape left both nameless — a screen
          reader heard &ldquo;button&rdquo; twice with no context.
        </p>
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          <C>onClick</C> renders a real{" "}
          <code>&lt;button type=&quot;button&quot;&gt;</code>, so <Kbd>Tab</Kbd>{" "}
          reaches it and <Kbd>Enter</Kbd>/<Kbd>Space</Kbd>
          activate; the focus ring is <C>ring-current</C> — the tone&rsquo;s own
          colour, visible on soft, solid, outline and glass alike. The remove
          button is a second, nested stop: it <C>stopPropagation</C>s, so
          removing a tag never also fires the tag&rsquo;s own click — without
          it, a removable filter pill would delete the filter <em>and</em>{" "}
          activate it in one press.
        </p>
        <p>
          A non-interactive pill is a <code>span</code>, deliberately absent
          from the tab order — do not put <C>onClick</C> on pills just to make a
          row clickable; make the row a button and keep the pill a label.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The only string the pill owns is the remove button&rsquo;s accessible
          name, and it comes from the kit catalogs (en/de/es/fr/pt) — pass{" "}
          <C>removeLabel</C> to say something more specific in the user&rsquo;s
          language, e.g. &ldquo;Remove filter&rdquo;. Uppercase styling is
          typographic only; keep translated labels in their normal case rather
          than reaching for <C>uppercase</C> in RTL or case-losing languages.
          Long translations are the common failure: give pills in dense toolbars
          a <C>maxWidth</C> so an English three-word label and a
          fourteen-character German compound occupy the same slot, with the
          ellipsis a hint to add a <C>title</C>.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "tone",
          type: "PillTone",
          default: '"blue"',
          description:
            "Theme colour. Opaque variants paint it solid/soft/outline; the glass variants use it for the tint and rim only.",
        },
        {
          name: "variant",
          type: "PillVariant",
          default: '"soft"',
          description:
            "`solid`, `soft`, `outline`, `glass`, `liquid-glass`. Liquid-glass is glass plus a specular highlight by default.",
        },
        {
          name: "size",
          type: "PillSize",
          default: '"md"',
          description:
            "Shared control scale (24px at `md`). The dot ladder matches Badge's dot exactly, so they line up in mixed rows.",
        },
        {
          name: "corner",
          type: "PillCorner",
          default: '"full"',
          description:
            "`none | sm | md | lg | full`. `full` (capsule) is the pill's identity, so unlike surfaces this one does not default to `md`.",
        },
        {
          name: "uppercase",
          type: "boolean",
          default: "false",
          description: "Uppercase + wider tracking for status-board labels.",
        },
        {
          name: "icon / trailingIcon",
          type: "ReactNode",
          description:
            "Registry name or element; rendered through the icon renderer so it scales with the pill. Decorative — the pill's text is the name.",
        },
        {
          name: "dot",
          type: "boolean",
          default: "false",
          description:
            "Bare status dot; children/icon/onRemove are dropped. Hidden from readers unless `label` is given.",
        },
        {
          name: "label",
          type: "string",
          description:
            "Accessible name for the dot form — the only text a dot has.",
        },
        {
          name: "onRemove",
          type: "() => void",
          description:
            "Adds the nested remove button. Its click never activates the pill (`stopPropagation`), and it is focus-stopped in its own right.",
        },
        {
          name: "removeLabel",
          type: "string",
          default: 't("kit.pill.remove")',
          description:
            'Accessible name for the remove button; defaults to the localized "Remove".',
        },
        {
          name: "onClick",
          type: "(event) => void",
          description:
            'Makes the whole pill a real `<button type="button">`, turns the tone hover on (solid one shade deeper; soft/outline a translucent wash; glass rim ignite) and shows the `ring-current` focus indicator. `onRemove` alone never activates this.',
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description:
            "`opacity-50` plus native `disabled` on whichever buttons exist.",
        },
        {
          name: "maxWidth",
          type: "number | string",
          description:
            "Truncates the label instead of stretching the pill (numbers become px). Pair with `title` so the full text is reachable.",
        },
        {
          name: "glassOpacity / vibrancy / specularMode",
          type: "GlassOpacity / GlassVibrancy / SpecularMode",
          default: '"frosted" / "medium" / variant-dependent',
          description:
            "Glass tuning, see-through variants only. `specularMode` defaults to `classic` on liquid-glass, `none` on glass — that default is the only difference between them.",
        },
        {
          name: "className",
          type: "string",
          description: "Merged onto the pill.",
        },
      ]}
    />

    <p className="text-xs opacity-70">
      Other HTML attributes spread onto the rendered element (span or button).{" "}
      <C>glass</C> needs something behind it to see through — on a plain page
      background it reads as a pale soft pill; give it a <code>Panel</code> or
      imagery to bite into.
    </p>
  </div>
);

export default PillPage;
