import React from "react";
import { A11ySection, A11yTopic, PropsTable } from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { SlugInputPlayground } from "./SlugInputPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import CustomRules from "./examples/CustomRules";
import customRulesCode from "./examples/CustomRules.tsx?raw";
import Validation from "./examples/Validation";
import validationCode from "./examples/Validation.tsx?raw";

export const SlugInputPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Slug Input"
      description="The Input with a live slug underneath. Everything the field does — variants, sizes, tones, validation — stays; the derived slug renders under the box in the secondary text colour, validation notes stack below it, and onValueChange hands you both halves."
    />
    <SlugInputPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="Type and watch the slug line update on every keystroke — symbols ignored, whitespace collapsed to _, lowercased. The readout shows exactly what onValueChange received."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Custom rules"
        description="SlugifyOptions moves the separator, raises or preserves case and whitelists extra characters; the slugify prop replaces the whole algorithm when the rules are truly yours."
        code={customRulesCode}
        filename="CustomRules.tsx"
      >
        <CustomRules />
      </ExampleCard>
      <ExampleCard
        title="Validation"
        description="The status paints the box as it always does; the explanation sits under the slug line — error rose, hint status-aware, helpText surviving the error."
        code={validationCode}
        filename="Validation.tsx"
      >
        <Validation />
      </ExampleCard>
    </section>

    <PropsTable
      props={[
        {
          name: "showSlug",
          type: "boolean",
          default: "true",
          description:
            "Render the derived slug line under the field box. Hidden automatically while the value has nothing sluggable in it.",
        },
        {
          name: "slugLabel",
          type: "string",
          description:
            "Optional prefix for the slug line, e.g. `Slug:` — part of the announced text, not decoration.",
        },
        {
          name: "slugifyOptions",
          type: "SlugifyOptions",
          default:
            '{ separator: "_", case: "lower", allowed: "", transform: undefined }',
          description:
            "Separator that whitespace runs collapse to, casing applied last, extra characters kept beyond letters and digits, and a pre-transform on the raw value. Accents fold via NFKD (`café` → `cafe`); other symbols are dropped, never turned into separators.",
        },
        {
          name: "slugify",
          type: "(value: string) => string",
          description:
            "Replaces the default algorithm entirely — wins over `slugifyOptions`.",
        },
        {
          name: "onValueChange",
          type: "(value, slug) => void",
          description:
            "Fires on every change with the raw value and the freshly derived slug — derived from the keystroke, not from a re-read of state, so the pair can never desync from what was typed.",
        },
        {
          name: "error / hint / helpText",
          type: "ReactNode",
          description:
            "Notes under the slug line on FormField&rsquo;s type scale: error rose (and implies the error status, setting `aria-invalid`), hint muted — rose on error, emerald on success — helpText always shown, even alongside an error.",
        },
      ]}
    />
    <p className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
      Everything else is <strong>Input</strong>&rsquo;s — the full{" "}
      <code>InputProps</code> surface spreads through to the field, including{" "}
      <code>forwardRef</code> to the real <code>&lt;input&gt;</code>. The
      algorithm itself is exported as <code>slugify(value, options)</code> from
      the kit, framework-agnostic in <code>common/utils/slugify.ts</code>, for
      validation and preview panes that need the same slug the field shows.
    </p>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The slug line is an <code>aria-live=&quot;polite&quot;</code>{" "}
          paragraph wired into the field&rsquo;s <code>aria-describedby</code>{" "}
          alongside the notes, so the derived text is announced with the field
          rather than competing with every keystroke. Validation copy is text,
          never colour alone; <code>error</code> implies{" "}
          <code>aria-invalid</code> the way <strong>FormField</strong>{" "}
          enforces it.
        </p>
      </A11yTopic>

      <A11yTopic title="Keyboard Support">
        <p>
          Nothing new — the control is the native <code>&lt;input&gt;</code>{" "}
          that <strong>Input</strong> already is. The slug line is display-only
          text: not focusable, not editable, tab order passes straight
          through.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          The default rules are Unicode-aware, not ASCII-only: any script&rsquo;s
          letters and digits survive, accented Latin folds to its base form,
          and case mapping follows the character, not just A&ndash;Z. Pass your
          own <code>slugify</code> for transliterations the kit should not
          guess (transliterating Cyrillic, say).
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default SlugInputPage;
