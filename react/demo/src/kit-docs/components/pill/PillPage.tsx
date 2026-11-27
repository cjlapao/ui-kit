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
} from "../../shared/A11ySections";
import type { KeyboardBinding, PropDoc } from "../../shared/A11ySections";
import { PillPlayground } from "./PillPlayground";
import StatusBoard from "./examples/StatusBoard";
import statusBoardCode from "./examples/StatusBoard.tsx?raw";
import VariantsAndTones from "./examples/VariantsAndTones";
import variantsAndTonesCode from "./examples/VariantsAndTones.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import InteractiveTags from "./examples/InteractiveTags";
import interactiveTagsCode from "./examples/InteractiveTags.tsx?raw";
import AttentionPulse from "./examples/AttentionPulse";
import attentionPulseCode from "./examples/AttentionPulse.tsx?raw";

/**
 * One row per prop the playground can print, in the order `PillProps` declares
 * them (:76-125). Line references are to `react/src/components/Pill.tsx`.
 */
export const PILL_PROPS: PropDoc[] = [
  {
    name: "children",
    type: "ReactNode",
    description:
      "The label. Its text is the pill's accessible name (:147,:244-253); a dot drops it (:99-103,:218-242).",
  },
  {
    name: "tone",
    type: "PillTone (TrueColor)",
    default: '"blue"',
    description:
      "The 21-tone palette (:78,:128). Opaque variants take it from the theme's pill table (Theme.ts:2919-2933); a glass pill takes its tint and copy colour from it and keeps a white rim (:185-195 ← glass.ts:98-130,:321-335).",
  },
  {
    name: "variant",
    type: "PillVariant",
    default: '"soft"',
    description:
      "solid, soft, outline, glass, liquid-glass (:20-26,:79-80). The last two are the see-through pair that accept the three glass props (:44-45,:154).",
  },
  {
    name: "size",
    type: "PillSize (ControlSize)",
    default: '"md"',
    description:
      "Five steps from 16px to 32px (:51-57,:81-82). The dot has its own ladder matching Badge (:59-66) and adornments collapse the five steps to two (:68-74).",
  },
  {
    name: "corner",
    type: "PillCorner",
    default: '"full"',
    description:
      "none | sm | md | lg | full (:33-42,:83-84) — its own scale, not SurfaceCorner's, which is tuned for cards (:28-32).",
  },
  {
    name: "uppercase",
    type: "boolean",
    default: "false",
    description: "uppercase plus tracking-wide on the label (:85,:287).",
  },
  {
    name: "icon",
    type: "ReactNode",
    description:
      "Before the label (:95-96,:246-250). A string is a registry name and goes through the icon renderer at the size the pill's size implies; anything else passes through untouched (:210-215).",
  },
  {
    name: "trailingIcon",
    type: "ReactNode",
    description: "After the label, same treatment as icon (:97-98,:254-258).",
  },
  {
    name: "dot",
    type: "boolean",
    default: "false",
    description:
      "A bare status circle: children, icon, trailingIcon and onRemove are dropped so it stays a dot (:99-103,:218-242).",
  },
  {
    name: "label",
    type: "string",
    description:
      "The accessible name for a dot, which has none of its own. Without it the dot is aria-hidden — decoration (:120-124,:236-238).",
  },
  {
    name: "pulse",
    type: "boolean",
    default: "false",
    description:
      "An inset glow in the pill's own tone, riding in as --pill-glow so the keyframes stay colour-agnostic (:104-110,:167-172,:286). Off while disabled (:166).",
  },
  {
    name: "onRemove",
    type: "() => void",
    description:
      "Adds the nested remove button. Its click calls stopPropagation first, so removing never activates the pill (:111-112,:259-273).",
  },
  {
    name: "removeLabel",
    type: "string",
    default: 't("kit.pill.remove")',
    description:
      "The remove button's accessible name; the catalog string is the fallback (:113-114,:268).",
  },
  {
    name: "onClick",
    type: "(event: React.MouseEvent<HTMLElement>) => void",
    description:
      "Makes the whole pill activatable — it renders as a real <button type=\"button\"> with a focus ring, and it is the only thing that turns the tone's hover classes on (:115-116,:156-159,:283,:300-316).",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description:
      "opacity-50 on any pill (:288); a real disabled attribute on the button and on the remove button, which is what takes them out of the tab order (:262,:305). It also beats pulse (:166).",
  },
  {
    name: "maxWidth",
    type: "number | string",
    description:
      "Truncates the label span and sets style.maxWidth; a bare number becomes px (:118-119,:251,:292-298).",
  },
  {
    name: "glassOpacity",
    type: "GlassOpacity",
    default: '"frosted"',
    description:
      "frosted 65% / light 85% / clear 30% alpha, or a number (glass.ts:98-130). See-through variants only (:86-87,:133,:191).",
  },
  {
    name: "vibrancy",
    type: "GlassVibrancy",
    default: '"medium"',
    description:
      "Backdrop saturation: low 1, medium 1.2, high 1.4, or a multiplier (glass.ts:223-233,:88-89,:134,:192).",
  },
  {
    name: "specularMode",
    type: "SpecularMode",
    default: 'classic on liquid-glass, none on glass',
    description:
      "The highlight, resolved per variant when the prop is absent (:90-94,:197-198). none buys no overlay element at all (:199-200 ← glass.ts:280-283); the overlay it does add is aria-hidden (:200-208).",
  },
  {
    name: "className",
    type: "string",
    description: "Merged onto whichever element rendered (:146,:233,:289).",
  },
  {
    name: "style",
    type: "CSSProperties",
    description:
      "Merged last, over the glow custom properties and maxWidth (:148,:235,:292-298).",
  },
  {
    name: "…rest",
    type: "HTMLAttributes<HTMLSpanElement>",
    description:
      "Everything else — title, id, data-*, a second aria attribute — is spread onto the span (:77,:239,:322) or onto the button when onClick is set (:311). Note there is no title prop of its own: a truncated label needs the spread to hand the full text back.",
  },
];

/**
 * Only what the source binds. Pill installs no key handler anywhere (:76-125);
 * what the keyboard can do comes from the two elements it may render — a real
 * <button> and, inside it, the remove button.
 */
export const KEYBOARD: KeyboardBinding[] = [
  {
    keys: ["Tab"],
    action:
      "Reaches the pill itself only when onClick is set, because only then is it a real <button type=\"button\"> (:300-316). A label pill and a dot are <span>s: no tab stop, nothing to reach (:223-241,:319-326).",
  },
  {
    keys: ["Tab"],
    action:
      "Reaches the remove button as a second, nested stop while onRemove is set and the pill is not a dot (:259-273). It is its own button, not a click zone painted over the label.",
  },
  {
    keys: ["Enter", "Space"],
    action:
      "Activate whichever of the two has focus — native <button> behaviour, not a handler Pill writes (:300-316,:260-272).",
  },
  {
    keys: ["Enter", "Space"],
    action:
      "On the remove button: removes, and only removes. Its onClick calls stopPropagation before onRemove, so the pill's own onClick never fires in the same press (:263-267).",
  },
  {
    keys: ["Any key"],
    action:
      "Nothing else. There is no onKeyDown, no Escape, no arrow-key roving: the only focus styling is CSS focus-visible rings — ring-2 ring-current on the pill, ring-1 ring-current on the remove button, both drawn in the tone (:269,:308).",
  },
];

const RENDERED_CODE = `// What the DOM actually gets, for three of the shapes above.

// The label pill — a span, no tab stop, no aria of any kind (:319-326).
<span class="inline-flex … rounded-full bg-blue-50 text-blue-700 …">
  Operational
</span>

// The same pill made activatable (:300-316).
<button type="button" class="… cursor-pointer … focus-visible:ring-2 focus-visible:ring-current">
  Operational
</button>

// A dot with no name and a dot with one (:223-241).
<span class="inline-block … h-2.5 w-2.5 bg-blue-500" aria-hidden="true" />
<span class="inline-block … h-2.5 w-2.5 bg-blue-500" role="img" aria-label="Degraded" />

// And the remove button, always named (:259-273).
<button type="button" aria-label="Remove" class="-mr-1 … focus-visible:ring-1 focus-visible:ring-current">
  <svg …>…</svg>
</button>`;

export const PillPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Pill"
      description="Small labels for status and metadata. Three opaque variants plus two glass ones, the full tone set, optional icons, a remove button, and a bare status dot — and it is a span until onClick turns it into a button."
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
      <ExampleCard
        title="Attention pulse"
        description="pulse glows inward from the pill's rim in its own tone — the attention call, with no layout spill. Dots pulse too; a disabled pill stays quiet."
        code={attentionPulseCode}
        filename="AttentionPulse.tsx"
      >
        <AttentionPulse />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          A label pill asks for nothing: it is a <C>&lt;span&gt;</C> whose text is
          its name (:244-253,:319-326). The forms that carry no text name
          themselves — the remove button is named by <C>removeLabel</C> falling
          back to the localized &ldquo;Remove&rdquo; (:268), and a <C>dot</C>{" "}
          without a <C>label</C> is <C>aria-hidden</C>, because a coloured
          circle with nothing to say is decoration (:120-124,:236-238). The glass
          highlight is <C>aria-hidden</C> too, so the specular overlay is never a
          second thing in the reading order (:200-208).
        </p>
        <p>
          The honest gap is <C>disabled</C>. On the button branch and on the
          remove button it is a real <C>disabled</C> attribute, so it is
          announced and taken out of the tab order (:262,:305). On a label pill —
          a <C>&lt;span&gt;</C> — it is <C>opacity-50</C> and nothing else
          (:288): a reader hears the label exactly as before. Say it in the text,
          or give the pill <C>onClick</C> so it becomes a button.
        </p>
        <A11yCode code={RENDERED_CODE} filename="what-reaches-the-dom.tsx" />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          Pill binds no key handler at all. What a keyboard can do with it is
          decided by which of its two elements renders, and by nothing else.
        </p>
        <KeyboardSupportTable bindings={KEYBOARD} />
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          One string belongs to the kit: the remove button&rsquo;s name,{" "}
          <C>t(&quot;kit.pill.remove&quot;)</C> through <C>useKitT</C> (:151,:268).
          It ships in the five built-in catalogs — <C>Remove</C>, <C>Supprimer</C>,{" "}
          <C>Entfernen</C>, <C>Quitar</C>, <C>Remover</C> (builtIn/en.ts:376-378,
          fr.ts:346-348, de.ts:344-346, es.ts:344-346, pt.ts:344-346), and the
          English values are the component&rsquo;s old hardcoded literals verbatim,
          which is why a page without a provider looks exactly as it did before
          i18n (builtIn/en.ts:1-6).
        </p>
        <p>
          <C>useKitT</C> resolves to the provider&rsquo;s engine or the built-in
          one and never warns, so a pill in an app that mounted no provider keeps
          working in English rather than printing a key (I18nContext.tsx:119-135).
          Everything else is the caller&rsquo;s text and stays that way: the label,
          the dot&rsquo;s <C>label</C> and both adornments (:236-237,:244-253).
          Passing <C>removeLabel</C> steps outside i18n entirely — the catalog is
          only asked when the prop is absent (:268).
        </p>
        <p>
          Direction comes for free from the layout, not from the component: the
          pill is a flex row, so under <C>dir=&quot;rtl&quot;</C> the adornments
          swap sides with the label, while the remove button&rsquo;s{" "}
          <C>-mr-1</C> stays a physical right-hand margin (:269) — mirror it
          yourself if that edge matters to you.
        </p>
      </A11yTopic>

      <A11yTopic title="A pill that is a button">
        <p>
          <C>onClick</C> is not a style decision. Without it the component returns
          a <C>&lt;span&gt;</C> with no tab stop and no hover response
          (:156-159,:319-326); with it, a <C>&lt;button type=&quot;button&quot;&gt;</C>{" "}
          with <C>focus-visible:ring-2 ring-current</C> (:300-316). The hover
          classes come from the same tone table as the fill, and the theme note
          says why that pairing matters: the hover <em>is</em> the affordance,
          &ldquo;because a pill otherwise carries no button chrome at all&rdquo;
          (Theme.ts:2912-2918).
        </p>
        <p>
          A removable, clickable pill therefore holds two focusable elements, and
          the nested one is the one that must not leak: its click calls{" "}
          <C>stopPropagation</C> before <C>onRemove</C> (:263-267), otherwise
          deleting a filter would also open whatever the pill points at.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable props={PILL_PROPS} title="PillProps" />

    <p className="text-xs opacity-70">
      Other HTML attributes spread onto whichever element rendered — span or
      button (:77,:239,:311,:322). <C>glass</C> and <C>liquid-glass</C> need
      something behind them to see through: on a plain page background they read
      as a pale soft pill, so give them a <code>Panel</code>, a photo, or the
      workbench&rsquo;s own backdrop toggle above.
    </p>
  </div>
);

export default PillPage;
