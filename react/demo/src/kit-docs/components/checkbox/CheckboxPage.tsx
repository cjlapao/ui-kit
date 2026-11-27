import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import {
  A11yCode,
  A11ySection,
  A11yTopic,
  C,
  Kbd,
  KeyboardSupportTable,
  PropsTable,
} from "../../shared/A11ySections";
import type { KeyboardBinding, PropDoc } from "../../shared/A11ySections";
import { CheckboxPlayground } from "./CheckboxPlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import WithDescription from "./examples/WithDescription";
import withDescriptionCode from "./examples/WithDescription.tsx?raw";
import SelectAll from "./examples/SelectAll";
import selectAllCode from "./examples/SelectAll.tsx?raw";
import States from "./examples/States";
import statesCode from "./examples/States.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";

/**
 * Every prop `CheckboxProps` declares (:47-90), plus the two the reader reaches
 * through the input spread (:295). Nothing here is invented: each row names the
 * line the prop is declared on or the line its default is written.
 */
export const CHECKBOX_PROPS: PropDoc[] = [
  {
    name: "label",
    type: "ReactNode",
    description:
      "Text beside the box (:52). The row is one `<label>` that *wraps* the input (:409-420), so the whole line is the click target and there is no `htmlFor` to keep in sync.",
  },
  {
    name: "description",
    type: "ReactNode",
    description:
      "Secondary copy under or beside the label (:54,:346-357), pointed at by `aria-describedby` (:264-265,:290).",
  },
  {
    name: "descriptionPlacement",
    type: '"bottom" | "inline"',
    default: '"bottom"',
    description:
      "Under the label, or trailing it on the same line (:56,:351,:373-375).",
  },
  {
    name: "size",
    type: "ControlSize",
    default: '"md"',
    description:
      "The shared xs–xl scale (:58,:103-146): the box, the glyph inside it, the label and the gap all step together, and an unknown value falls back to `md` (:247).",
  },
  {
    name: "variant",
    type: "InputVariant",
    default: '"flat"',
    description:
      "The box's *rest* surface, on the shared input scale, so a checkbox matches the `Input` beside it (:62,:3421-3424). The checked fill belongs to `tone`, not to the variant.",
  },
  {
    name: "tone",
    type: "TrueColor",
    default: '"blue"',
    description:
      "Checked fill, dash and focus ring (:69,:3442-3453). The fill is the `-700` step in light and `-400` in dark so a white tick clears contrast on all 21 tones.",
  },
  {
    name: "color",
    type: "TrueColor",
    description:
      'Alias for `tone` (:71); `tone ?? color ?? "blue"` (:248), so `tone` wins when both are given.',
  },
  {
    name: "indeterminate",
    type: "boolean",
    default: "false",
    description:
      'Sets the native `indeterminate` *property* imperatively (:227-245) and `aria-checked="mixed"` (:292). The dash wins over the tick, as on the native control (:326-328).',
  },
  {
    name: "fullWidth",
    type: "boolean",
    default: "false",
    description:
      "Stretches the row and grows the label block, so `controlAlign` has free space to align against (:75,:372,:405,:414).",
  },
  {
    name: "controlAlign",
    type: '"left" | "right"',
    default: '"left"',
    description:
      'Which end the box sits on; `"right"` reverses the row and justifies it (:77,:412).',
  },
  {
    name: "validationStatus",
    type: '"none" | "error" | "success"',
    default: '"none"',
    description:
      "Tints the message like `Input`'s (:82,:428-431); `error` also replaces the variant's border (:305-310) and sets `aria-invalid` (:291).",
  },
  {
    name: "validationMessage",
    type: "ReactNode",
    description:
      "Shown under the row with its own id, pointed at by the same `aria-describedby` (:84,:422-436).",
  },
  {
    name: "required",
    type: "boolean",
    description:
      'Sets `required` on the input (:294) — native form validation, announced as "required" — and adds an `aria-hidden` asterisk (:387-394).',
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description:
      "The real attribute on the input (:293), a grey border on the box (:319) and `opacity-60` on the row (:415). A disabled *checked* box keeps its fill on purpose (:314-318).",
  },
  {
    name: "className",
    type: "string",
    description: "Applied to the outer wrapper (:87,:406).",
  },
  {
    name: "inputClassName",
    type: "string",
    description:
      "Applied to the visible box, *not* to the (invisible) input — the name is the opposite of what it does (:89,:320).",
  },
  {
    name: "id",
    type: "string",
    default: "generated",
    description:
      "Falls back to `useId()` and seeds the `-description` / `-message` ids (:220-223).",
  },
  {
    name: 'aria-label',
    type: "string",
    description:
      "Read by the development warning (:215-219) and otherwise passed to the input with the rest of the spread (:295).",
  },
  {
    name: "checked / defaultChecked / onChange",
    type: "…",
    description:
      "Not declared by the component: they arrive through `{...inputProps}` on the native input, so the controlled/uncontrolled split is exactly the platform's (:295).",
  },
  {
    name: "…",
    type: "InputHTMLAttributes",
    description:
      "`name`, `value`, `tabIndex`, remaining aria attributes and every other input attribute, minus `size`, `color` and `children` (:47-50,:295).",
  },
];

/** Only the bindings that actually exist — which means all of them are native. */
export const KEYBOARD: KeyboardBinding[] = [
  {
    keys: ["Tab"],
    action: (
      <>
        Focus lands on the native input (:275-296). The ring is drawn on the box
        beside it by <C>peer-focus-visible:ring-2</C> plus the tone ring (:312-313,
        ring token at <C>Theme.ts:3450</C>), so a mouse click does not ring it and a
        keyboard press does.
      </>
    ),
  },
  {
    keys: ["Space"],
    action: (
      <>
        Toggles the box — the browser&rsquo;s own checkbox activation (:278). The
        component registers no key handler, so there is nothing to drift.
      </>
    ),
  },
  {
    keys: ["Enter"],
    action: (
      <>
        Inside a form with a submit button, submits the form (native behaviour). It
        does <em>not</em> tick the box, and <C>required</C> blocks the submission
        until it is ticked (:294).
      </>
    ),
  },
];

const NAMING_CODE = `import { Checkbox } from "@cjlapao/ui-kit";

// The row is one <label> wrapping the input (:409-420), so the label is the
// name and the description rides along on aria-describedby (:264-265,:290).
<Checkbox label="Email me a digest" description="One email a week" />

// Description only: still named, because aria-describedby text reaches the
// accessible-name computation — the source says so (:210-219) and the warning
// check is passed (label ?? description).
<Checkbox description="One email a week" />

// Neither: the development warning fires (warn:63-73) and a reader hears an
// unnamed checkbox.
<Checkbox aria-label="Subscribe to the digest" />`;

const I18N_CODE = `// Checkbox ships no strings of its own, so there is nothing to translate
// inside it: every word is the caller's.
import { Checkbox } from "@cjlapao/ui-kit";
import { useT } from "./i18n";

export function ConsentRow() {
  const t = useT();
  return (
    <Checkbox
      controlAlign="right"
      label={t("settings.consents")}
      description={t("settings.consentsHint")}
      validationMessage={t("settings.consentsRequired")}
      required
    />
  );
}`;

export const CheckboxPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Checkbox"
      description="A drawn checkbox — the box, tick and dash are the kit's own, so they follow the tone in both themes. The native input is still underneath, keeping focus, keyboard behaviour and form participation. The variant changes the rest surface (the box you see when it is *off*); the checked fill is the tone everywhere."
    />
    <CheckboxPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="A row of options, each an independent checkbox."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="With description"
        description="Explain the consequence of the choice right where the decision is made."
        code={withDescriptionCode}
        filename="WithDescription.tsx"
      >
        <WithDescription />
      </ExampleCard>
      <ExampleCard
        title="Select all"
        description="A tri-state parent driving its children — the indeterminate dash appears while some, but not all, are checked."
        code={selectAllCode}
        filename="SelectAll.tsx"
      >
        <SelectAll />
      </ExampleCard>
      <ExampleCard
        title="States"
        description="Disabled rows keep their state visible; indeterminate marks a parent with mixed children."
        code={statesCode}
        filename="States.tsx"
      >
        <States />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared xs–xl scale — the box sits on the label's cap height at every step."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="All 21 true colours, checked and indeterminate — the tick must stay legible on the fill in both themes."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          There is one control, and it is a native <C>type=&quot;checkbox&quot;</C>{" "}
          (:278) laid invisibly over the box with <C>opacity-0</C> — not{" "}
          <C>sr-only</C>, and deliberately still pointer-enabled so{" "}
          <C>peer-hover</C> can see it (:279-289). Everything you can see is{" "}
          <C>aria-hidden</C>: the box (:300-301), the tick (:323-324) and the dash
          (:334-335). The state lives in the input and nowhere else, so a reader
          hears &ldquo;checkbox, checked&rdquo; and never a second, drawn copy of it.
        </p>
        <p>
          The naming is by <em>nesting</em>: the row is a single <C>&lt;label&gt;</C>{" "}
          that contains the input (:409-420), so there is no <C>htmlFor</C> to keep
          in sync — and nothing to get wrong when the id is generated (:220-221).{" "}
          <C>description</C> and <C>validationMessage</C> are attached through one{" "}
          <C>aria-describedby</C> that lists both ids in order (:264-265,:290,:348,
          :424), <C>validationStatus=&quot;error&quot;</C> adds{" "}
          <C>aria-invalid</C> (:291), and <C>indeterminate</C> adds{" "}
          <C>aria-checked=&quot;mixed&quot;</C> (:292) — which is exactly what a
          partially-selected parent means.
        </p>
        <p>
          An unnamed checkbox warns in development (:215-219, message at{" "}
          <C>warn:71</C>). A <C>description</C> on its own silences it, because{" "}
          <C>aria-describedby</C> text does reach the accessible-name computation —
          the check is passed <C>label ?? description</C> and the comment says the
          older version false-alarmed on description-only boxes (:210-219). A visible{" "}
          <C>label</C> is still the better answer: described-by text is announced with
          the name, not instead of it.
        </p>
        <A11yCode code={NAMING_CODE} filename="Naming.tsx" />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          All of it is native, because the component registers no key handler at all:
          there is no <C>onKeyDown</C> anywhere in <C>Checkbox.tsx</C>. What a plain{" "}
          <C>&lt;input type=&quot;checkbox&quot;&gt;</C> does with a keyboard, this
          does — nothing more, and importantly nothing less.
        </p>
        <KeyboardSupportTable bindings={KEYBOARD} />
        <p>
          <C>indeterminate</C> is a <em>property</em>, not an attribute, so React
          cannot set it: the component writes <C>input.indeterminate</C>{" "}
          imperatively on mount and whenever the prop changes (:227-245). The
          browser clears that property the moment you activate the box, so pressing{" "}
          <Kbd>Space</Kbd> on a mixed box ticks it — while <C>aria-checked=&quot;mixed&quot;</C>,
          written from the <em>prop</em> (:292), keeps announcing &ldquo;mixed&rdquo;
          until the parent recomputes it. A parent that derives it from its children
          (the <em>Select all</em> example) does; a parent that holds it in{" "}
          <C>useState</C> and never updates it does not, and ends up with a plain tick
          a reader is told is mixed.
        </p>
        <p>
          Nothing else is bound. Arrow keys, <Kbd>Home</Kbd>, <Kbd>End</Kbd>,{" "}
          <Kbd>Escape</Kbd> and type-ahead do what they do to any lone checkbox, which
          is nothing: the arrow-key roving lives in radio groups, and a group of
          checkboxes is not one. If you want one, group them with a real{" "}
          <C>fieldset</C>/<C>legend</C> — the component sets no group semantics of its
          own.
        </p>
      </A11yTopic>

      <A11yTopic title="Variants and the hover trap">
        <p>
          A variant styles the <em>rest</em> surface — the box when it is unchecked.
          The checked state deliberately replaces it: the tone owns the on-state fill
          and border (that is what <C>peer-checked:bg-&#123;tone&#125;-700</C> is for,
          <C>Theme.ts:3442-3453</C>), so switching variants while the box is checked
          shows only the decorative differences — the <C>elevated</C> shadow, the
          blur of <C>glass</C> and <C>gradient</C>. Flip <em>Starts checked</em> in the
          playground to see it. The exception is <C>glass</C> itself: an opaque fill
          would hide its own frost, so — like Toggle&rsquo;s glass track — it tints
          with the tone at a translucent alpha
          (<C>peer-checked:bg-&#123;tone&#125;-500/40</C>,<C>Theme.ts:3434-3440</C>)
          and gives the tick a drop-shadow instead (:251-261).
        </p>
        <p>
          The variants&rsquo; hover borders are <C>peer-hover:border-…</C> rules, which
          read the <em>input&rsquo;s</em> <C>:hover</C> from a sibling (:310). The
          invisible input therefore stays pointer-enabled — an <C>absolute inset-0</C>{" "}
          overlay that declared <C>pointer-events-none</C> would have silently
          deadened every variant&rsquo;s hover feedback while everything else kept
          working (:283-288). The box underneath still hovers too, since{" "}
          <C>pointer-events-none</C> is not inherited by siblings.
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          There is nothing to translate inside <C>Checkbox</C>: it imports no{" "}
          <C>useKitT</C> and <C>common/i18n/builtIn/en.ts</C> has no{" "}
          <C>kit.checkbox.*</C> keys. <C>label</C>, <C>description</C> and{" "}
          <C>validationMessage</C> are caller text and pass through untouched (:52-84).
          The only English the file contains is the development warning (:215-219),
          which is a console message for the developer, never for the user.
        </p>
        <p>
          The one glyph the component does draw is the required asterisk, and it is{" "}
          <C>aria-hidden</C> (:387-394) so no reader ever has to guess what{" "}
          &ldquo;star&rdquo; means: the meaning comes from the native{" "}
          <C>required</C> attribute (:294), which the browser announces in the
          user&rsquo;s own language. Sizing and spacing are logical too — the
          <C>gap</C> tokens (:105-145,:413) and <C>gap-x-1.5</C> (:374) follow the
          writing direction. The catch worth knowing: <C>controlAlign</C> looks like
          a physical name but is implemented as <C>flex-row-reverse</C> (:412),
          which reverses the <em>main axis</em> — so in an RTL document
          <C>&quot;right&quot;</C> puts the box on the visual left. That is usually what
          you want (the box
          leads the reading order), but it means the prop does not pin a physical side.
        </p>
        <A11yCode code={I18N_CODE} filename="Settings.tsx" />
      </A11yTopic>
    </A11ySection>

    <PropsTable props={CHECKBOX_PROPS} />

    <p className="text-xs opacity-70">
      Everything else — <C>checked</C>, <C>defaultChecked</C>, <C>onChange</C>,{" "}
      <C>name</C>, <C>value</C>, <C>tabIndex</C>, aria attributes — spreads straight
      through to the native input (:295), so the uncontrolled/controlled split, form
      participation and every reader hint work exactly as they do on a plain
      checkbox.
    </p>
  </div>
);

export default CheckboxPage;
