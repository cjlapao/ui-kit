import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11ySection,
  A11yTopic,
  C,
  PropsTable,
} from "../../shared/A11ySections";
import { InfoRowPlayground } from "./InfoRowPlayground";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import Copy from "./examples/Copy";
import copyCode from "./examples/Copy.tsx?raw";

export const InfoRowPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Info Row"
      description="One label/value line in a details panel — with copy-to-clipboard, a tooltip when the value is truncated, and loading, empty and error states. Its copy colour and hairline come from the surface it sits on, so a row on glass reads as well as one on a white card."
    />
    <InfoRowPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Variants"
        description="`elevated` is the kit default — the row renders inside a `Panel` of its own. `plain` draws no surface and stays the root element, so the hairline's `last:border-0` still matches among sibling rows — pass it explicitly for the details-list texture."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="The full shared control scale. The component declared its own `xs | sm | md | lg`, so it could not be set to `xl` beside an `xl` Button — and `padding` had its own eight-member list where the kit has six."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="Loading, empty and error"
        description="A row that is loading or has failed stays visible even with no value — `hideIfEmpty` used to win over both, so a panel visibly jumped as values arrived. The skeleton bar is sized from the row's own scale."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Copy and truncation"
        description="Copy is a real `IconButton`, revealed on hover and on keyboard focus. A missing clipboard or a rejected write reports a failure instead of throwing. The truncation tooltip is the shared portaled `TooltipWrapper`, so a scrolling panel cannot clip it — and it now answers to focus, not just to a pointer."
        code={copyCode}
        filename="Copy.tsx"
      >
        <Copy />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          A loading row carries <C>aria-busy</C> on the row element itself, so
          assistive tech knows the value is pending rather than missing. A{" "}
          <C>loaderType="spinner"</C> is a <C>role="status"</C> with a localised
          label; a skeleton is decorative and announces nothing. An <C>error</C>{" "}
          renders its text visibly and duplicates it into a polite{" "}
          <C>role="status"</C> — a row that silently shows <C>—</C> for a failed
          lookup is indistinguishable from one that is genuinely empty, and that
          confusion is exactly what the error prop exists to prevent.
        </p>
        <p>
          Copying is confirmed, not silent: the button&rsquo;s accessible name
          flips to <C>kit.inforow.copiedLong</C> and a polite live region
          announces it — polite, so a confirmation never interrupts what is
          being read. If the clipboard is unavailable or the write is rejected
          (a document that lost focus mid-click is the common case), the name
          flips to <C>kit.inforow.copyFailed</C>, the button turns rose, and the
          same live region says so; nothing throws.
        </p>
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          The row itself is plain text — no listbox semantics, no arrow keys;
          rows are read in document order, which is right for a details panel.
          The copy button is a real <C>button</C> in the tab order, and it is
          revealed on <C>focus-visible</C>, not just on hover — an invisible
          button that still accepts Enter used to be a keyboard trap of
          confusion. It claims no space while hidden, so the value owns the full
          column until the button slides in. The pointer and the keyboard are
          the only things summoning the button — never its own confirmation
          state, and never the DOM focus a mouse-click leaves behind: leaving
          the row mid-confirmation hides the check right with the pointer, and
          returning within its moment finds it waiting. When the confirmation
          ends, hover stops summoning too — the fold lands under even a parked
          cursor — until the pointer leaves the row and re-arms. The keyboard's
          branch of the rule is <C>:focus-visible</C>— a focus that cannot come
          from a click — so a Tab-navigated user always keeps the button, and
          its focus ring, on screen. A truncated value is a focusable span (an
          inset ring, so the focus stays inside the row) and its tooltip answers
          to focus as well as hover; it is portaled, so a scrolling panel cannot
          clip it.
        </p>
        <p>
          Boolean values render as localised Yes/No text, so they are read as
          words rather than as nothing — and copy still offers the same text.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Every built-in string is catalog-resolved (<C>kit.inforow.*</C>, five
          locales): the loading label, the copy button&rsquo;s idle name and
          tooltip, both confirmation phrasings, the failure message, and the
          Yes/No pair rendered for boolean values. The <C>emptyText</C>{" "}
          placeholder defaults to a locale-neutral <C>—</C>, and Labels, values
          and errors are the caller&rsquo;s text and pass through untouched;
          want a whole new language? Layer <C>kit.inforow.*</C> keys in your own
          catalogs — the i18n page shows the override live.
        </p>
      </A11yTopic>
    </A11ySection>

    <PropsTable
      props={[
        {
          name: "label",
          type: "ReactNode",
          description:
            "Left column. Composed labels are welcome; keep interactive children out of the row.",
        },
        {
          name: "value",
          type: "ReactNode",
          description:
            "string/number render as copyable text; boolean renders localised Yes/No, also copyable; a ReactNode renders as-is and suppresses the copy button; null/undefined/'' count as empty.",
        },
        {
          name: "variant",
          type: "PlainSurfaceVariant",
          default: '"elevated"',
          description:
            "The kit surface family. `plain` draws no surface and keeps the row as the root element — pass it for details-list texture where the hairline's `last:border-0` must match siblings.",
        },
        {
          name: "tone",
          type: "TrueColor",
          default: '"blue"',
          description:
            "Accent for the hover wash, focus rings and glass tint. Text colour is not tinted — it comes from the surface, so a row on glass stays readable.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: '"md"',
          description:
            "The shared control scale — type, gaps, label width, skeleton-bar height and icon size all derive from it.",
        },
        {
          name: "labelSize / valueSize",
          type: "ControlSize",
          description:
            "Independent type overrides for either column when the row's own `size` is not enough.",
        },
        {
          name: "padding",
          type: "SurfacePadding",
          description:
            "Vertical padding override. Omit it and padding derives from `size`.",
        },
        {
          name: "corner",
          type: "SurfaceCorner",
          default: "rounded-md",
          description:
            "Only visible with a surface variant — a plain row draws none.",
        },
        {
          name: "labelWidth",
          type: "string",
          description:
            'Fixed label-column width class (`"w-32"`). Defaults per size (`w-16`…`w-32`); pass `""` to let the label size naturally.',
        },
        {
          name: "copyable",
          type: "boolean",
          default: "true",
          description:
            "Auto-off for ReactNode values (nothing meaningful to copy); explicit `true` forces the button for any stringifiable value.",
        },
        {
          name: "onCopy",
          type: "(text: string) => void",
          description: "Fired after a confirmed write.",
        },
        {
          name: "loading",
          type: "boolean",
          description:
            "Placeholder in the value's place, `aria-busy` on the row, copy suppressed. The row stays visible even with no value — `hideIfEmpty` does not win over a pending row.",
        },
        {
          name: "loaderType",
          type: '"skeleton" | "spinner"',
          default: '"skeleton"',
          description:
            'Skeleton bar (decorative, sized from the row scale) or spin ring (`role="status"`, localised). Both stand down under `prefers-reduced-motion`.',
        },
        {
          name: "error",
          type: "string",
          description:
            "Replaces the value, visibly and in a polite live region. Also keeps the row visible under `hideIfEmpty`.",
        },
        {
          name: "hideIfEmpty",
          type: "boolean",
          default: "true",
          description:
            "Removes the row entirely when the value is empty — loading and error rows excepted.",
        },
        {
          name: "emptyText",
          type: "string",
          default: '"—"',
          description: "Placeholder when `hideIfEmpty` is off.",
        },
        {
          name: "wrap",
          type: "boolean",
          default: "false",
          description: "Wrap the value instead of truncating it.",
        },
        {
          name: "tooltipOnTruncate",
          type: "boolean",
          default: "true",
          description:
            "Portaled full-value tooltip on hover and focus, measured live — only while truncation actually happens.",
        },
        {
          name: "mono",
          type: "boolean",
          description: "Monospace for the value — digests, ids, IPs.",
        },
        {
          name: "hoverable",
          type: "boolean",
          description:
            "Tone-coloured hover wash with rounded corners; drops the hairline while on.",
        },
        {
          name: "noBorder / noPadding",
          type: "boolean",
          description:
            "Local escapes for lists whose borders or padding are managed externally.",
        },
        {
          name: "glassOpacity / vibrancy",
          type: "GlassOpacity / GlassVibrancy",
          description: "Glass tuning for the glass variants.",
        },
      ]}
    />
    <p className="text-sm text-neutral-500 dark:text-neutral-400">
      <code>InfoRow</code> spreads div attributes. Rows are meant to be siblings
      in a plain flow — wrapping them in per-row containers breaks the
      hairline&rsquo;s last-child rule.
    </p>
  </div>
);

export default InfoRowPage;
