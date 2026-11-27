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
  type KeyboardBinding,
  type PropDoc,
} from "../../shared/A11ySections";
import { TogglePlayground } from "./TogglePlayground";
import Basic from "./examples/Basic";
import basicCode from "./examples/Basic.tsx?raw";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import Icons from "./examples/Icons";
import iconsCode from "./examples/Icons.tsx?raw";
import Labeled from "./examples/Labeled";
import labeledCode from "./examples/Labeled.tsx?raw";
import Sizes from "./examples/Sizes";
import sizesCode from "./examples/Sizes.tsx?raw";
import Disabled from "./examples/Disabled";
import disabledCode from "./examples/Disabled.tsx?raw";

/**
 * Every row here was read off `react/src/components/Toggle.tsx`; the defaults are the
 * component's own destructured defaults (:194-215) or, for the two legacy spellings,
 * the fallback that actually decides (:247,:251).
 */
export const TOGGLE_PROPS: PropDoc[] = [
  {
    name: "label",
    type: "ReactNode",
    description:
      "Rendered as a real `label htmlFor` (:394-410) — the switch's accessible name, and part of the row that invites the click. With none, and no `aria-label`, a development build warns (:221-225).",
  },
  {
    name: "description",
    type: "ReactNode",
    description:
      "Helper line attached to the input with `aria-describedby` (:229,:325,:412-424). With no `label` it renders as a bare span instead, still carrying the id (:427-439).",
  },
  {
    name: "descriptionPlacement",
    type: '"stacked" | "inline"',
    default: '"stacked"',
    description:
      "Below the label, or flowing inline beside it (:197,:398-400,:433).",
  },
  {
    name: "size",
    type: "ControlSize",
    default: '"md"',
    description:
      "The shared control scale — track, thumb, glyph and label type all derive from it (:198,:244,:110-167), so a Toggle lines up with the Input and Button beside it.",
  },
  {
    name: "padding",
    type: "SurfacePadding",
    default: '"sm"',
    description:
      "Around the whole row, from the kit's shared padding scale (:199,:49-56). It is hit area, not decoration: the padded edge still toggles (:291-309).",
  },
  {
    name: "variant",
    type: "ToggleVariant",
    default: '"solid"',
    description:
      "solid · soft · outline · ghost · glass (:200,:3221-3227). The off-state track is neutral in every one of them; only the on-state fill carries the treatment (:252-256).",
  },
  {
    name: "tone",
    type: "TrueColor",
    default: '"blue"',
    description:
      "On-state fill and focus ring, from the 21 true colours (:251,:252-256). The glass variant tints with the full-chroma 500 step at a translucent alpha, because the pastel big glass surfaces use washes out at pill size (Theme:3277-3286).",
  },
  {
    name: "color",
    type: "TrueColor",
    description:
      "Deprecated spelling of `tone` (:71-75). `tone` wins when both are given (:249-251), and neither is read for anything but colour.",
  },
  {
    name: "alignLabel",
    type: '"left" | "right"',
    default: '"right"',
    description:
      "`left` is the settings-row layout, label first — it is spelled `flex-row-reverse` on the row, not a second layout (:203,:277).",
  },
  {
    name: "iconOn",
    type: "string | ReactElement",
    description:
      "Glyph in the half of the track the thumb is not in while checked (:78,:371-381). A string is a registry name; an element is painted as given.",
  },
  {
    name: "iconOff",
    type: "string | ReactElement",
    description:
      "The other half, visible while unchecked (:80,:359-369). Both are inside the `aria-hidden` track (:337), so they are decoration only.",
  },
  {
    name: "fullWidth",
    type: "boolean",
    default: "false",
    description: "Stretches the row to `w-full` (:206,:280).",
  },
  {
    name: "className",
    type: "string",
    description: "Appended last to the row's class list (:82,:284).",
  },
  {
    name: "tooltip",
    type: "string",
    description:
      "When set, the whole row is wrapped in `TooltipWrapper` (:84,:443-448). It appears on hover of the row and on focus of whatever is focusable inside it.",
  },
  {
    name: "tooltipPosition",
    type: "TooltipPosition",
    default: '"top"',
    description:
      "Forwarded to the wrapper (:86,:445); the default is `TooltipWrapper`'s own (TooltipWrapper:85), not Toggle's.",
  },
  {
    name: "glass",
    type: "boolean",
    default: "false",
    description:
      "Deprecated shorthand for `variant=\"glass\"` (:91,:247-248). Either spelling sets `data-glass` and `data-variant` on the row (:273-274) and wakes the three knobs below.",
  },
  {
    name: "vibrancy",
    type: "GlassVibrancy",
    default: '"medium"',
    description:
      "Backdrop saturation while the surface is glass (:93,:262) — inert at rest, because the neutral fill is opaque and there is no backdrop-filter chain to compose into (:258-261).",
  },
  {
    name: "glassOpacity",
    type: "GlassOpacity",
    default: '"frosted"',
    description:
      "How sheer the checked fill is; handed to `getToggleVariantTokens` with the tone (:95,:252-256).",
  },
  {
    name: "specularMode",
    type: "SpecularMode",
    default: '"none"',
    description:
      "Adds the `aria-hidden` sheen overlay inside the track (:97,:263-265,:349-357).",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description:
      "The real attribute on the input (:208,:326) — out of the tab order and skipped by the form — plus muted row, track and text (:281,:345,:407).",
  },
  {
    name: "readOnly",
    type: "boolean",
    default: "false",
    description:
      "Reads like a toggle, resists like a readout: the row click is cancelled (:292-294) and so is the input's own (:328-332), while the cursor is the only thing that changes (:282-283).",
  },
  {
    name: "checked / defaultChecked / onChange",
    type: "native input props",
    description:
      "Spread straight onto the checkbox (:333). Uncontrolled is the out-of-the-box mode: `defaultChecked` seeds it and the browser owns the state, which is why the row calls `input.click()` instead of faking an event (:303-308).",
  },
  {
    name: "id",
    type: "string",
    default: "generated",
    description:
      "`id ?? useId()` (:194,:227-228) — the label's `htmlFor` (:395) and the description's `<id>-description` both derive from it (:229).",
  },
  {
    name: "aria-label",
    type: "string",
    description:
      "The substitute name when there is genuinely no visible label; the component reads it for nothing but the development warning (:221-225).",
  },
  {
    name: "…",
    type: "InputHTMLAttributes<HTMLInputElement>",
    description:
      "…minus `size`, `color` and `children`, which the interface takes over (:58-61). Everything else — `name`, `value`, `required`, `data-*`, the rest of `aria-*` — lands on the input (:216,:333).",
  },
];

/**
 * Only what the source actually makes possible: there is no key handler anywhere in
 * `Toggle.tsx`, so every binding below is the native checkbox's, cited to the element
 * that carries it.
 */
export const KEYBOARD: KeyboardBinding[] = [
  {
    keys: ["Tab"],
    action:
      "Reaches the switch. The row is a `div` (:272-310) and the track is `aria-hidden` (:337), so the only tab stop is the `sr-only` checkbox itself (:312-324); the ring is drawn on the visible track by `peer-focus-visible` (:339).",
  },
  {
    keys: ["Space"],
    action:
      "Flips it. The native checkbox's own activation — nothing in the file intercepts the key (:269-271,:312-333), so state, thumb and `onChange` cannot drift apart.",
  },
  {
    keys: ["Enter", "in a form"],
    action:
      "Submits the form the way a native checkbox does. It does not flip the switch (:312-333) — a checkbox has never done that.",
  },
];

const NAMING_CODE = `import { Toggle } from "@cjlapao/ui-kit";

// The name comes from the visible label; the description rides along on
// aria-describedby, so it is read with the name rather than instead of it.
<Toggle label="Email me a digest" description="Sent once a day, at 09:00" />

// No visible label anywhere: the aria-label is the name, which is also the
// only thing keeping the development warning quiet (:221-225).
<Toggle aria-label="Reduce motion" />`;

const I18N_CODE = `// Every word a Toggle shows is the caller's, so translation happens upstream:
// the component takes strings, never keys.
import { Toggle } from "@cjlapao/ui-kit";
import { useT } from "./i18n";

export function DigestRow() {
  const t = useT();
  return (
    <Toggle
      alignLabel="left"
      fullWidth
      label={t("settings.digest")}
      description={t("settings.digestHint")}
    />
  );
}`;

export const TogglePage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Toggle"
      description="A switch for a single on/off setting. Five treatments from Button's vocabulary — solid, soft, outline, ghost and glass — labels and descriptions live with the control, and the whole row is the click target. Works uncontrolled out of the box."
    />
    <TogglePlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Basic"
        description="Uncontrolled: defaultChecked seeds the state and the control toggles on its own."
        code={basicCode}
        filename="Basic.tsx"
      >
        <Basic />
      </ExampleCard>
      <ExampleCard
        title="Variants"
        description={`The five \`variant\` treatments from \`Button\`'s vocabulary — each row shows the off and the on state. The off-state track is neutral in every variant; the on-state fill carries the treatment. \`color\` takes any of the 21 palette tones.`}
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Icons"
        description="`iconOn` and `iconOff` each live in the half of the track the thumb is not in — `iconOn` on the left (visible while checked), `iconOff` on the right (visible while unchecked) — centered in that half with breathing room to both the thumb and the wall, scaled to the toggle's size, and cross-fading with the thumb."
        code={iconsCode}
        filename="Icons.tsx"
      >
        <Icons />
      </ExampleCard>
      <ExampleCard
        title="Labeled"
        description="A label plus a description, stacked under the label or inline beside it."
        code={labeledCode}
        filename="Labeled.tsx"
      >
        <Labeled />
      </ExampleCard>
      <ExampleCard
        title="Sizes"
        description="Five sizes — the shared control scale every input, button and search bar offers — from dense settings lists to onboarding screens. The thumb always travels the full track, landing flush against the far wall."
        code={sizesCode}
        filename="Sizes.tsx"
      >
        <Sizes />
      </ExampleCard>
      <ExampleCard
        title="Disabled"
        description="Both disabled states stay legible — the position, not the fill, carries the meaning."
        code={disabledCode}
        filename="Disabled.tsx"
      >
        <Disabled />
      </ExampleCard>
    </section>

    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          Under the track is one native <code>checkbox</code> with{" "}
          <C>role=&quot;switch&quot;</C> (:315-316) — so readers announce the state as
          on/off, which is what a toggle means, and the state itself lives in the input
          and nowhere else. The track, thumb and both glyph slots sit inside{" "}
          <C>aria-hidden</C> (:337,:349-357,:359-381): they are a picture of what the
          input already says. The visible <C>label</C> is a real{" "}
          <code>label htmlFor</code> fed by <C>id ?? useId()</C> (:227-228,:395), and the{" "}
          <C>description</C> is joined to the input with <C>aria-describedby</C> (:229,:325)
          so it is read with the name rather than instead of it.
        </p>
        <p>
          There is no second name to collide with: <C>aria-label</C> is read by the
          component for exactly one purpose — deciding whether to warn in development that
          the switch has no accessible name at all (:221-225, <C>warnIfMissingName</C>{" "}
          warn:63-73). A <C>tooltip</C> is portalled with <C>role=&quot;tooltip&quot;</C>{" "}
          and linked by <C>aria-describedby</C> while visible (TooltipWrapper:279,:299), so
          it joins the announcement instead of replacing it.
        </p>
        <A11yCode filename="Naming.tsx" code={NAMING_CODE} />
      </A11yTopic>

      <A11yTopic title="Keyboard support">
        <p>
          All of it is native, because there is no key handler in the file to drift. The
          row carries a click handler with the a11y lint switched off and a comment saying
          why (:271): the keyboard belongs to the input, and giving the row its own would
          have meant two ways to disagree.
        </p>
        <KeyboardSupportTable bindings={KEYBOARD} />
        <p>
          That is the whole list. No <Kbd>Enter</Kbd> toggle, no arrow keys,{" "}
          <Kbd>Escape</Kbd>, <Kbd>Home</Kbd> or <Kbd>End</Kbd>: the comment at :269-271
          names arrows next to <Kbd>Space</Kbd>, but a checkbox binds none — each Toggle
          is its own tab stop, not an option in a radio group. <C>readOnly</C> prevents the
          flip rather than ignoring the key (:292-294,:328-332), and <C>disabled</C> leaves
          the tab order entirely (:326).
        </p>
      </A11yTopic>

      <A11yTopic title="Internationalization">
        <p>
          Toggle contributes no strings of its own. Its imports (:1-28) include no
          translation hook and there is no <C>kit.toggle.*</C> key anywhere in the catalog
          (<C>common/i18n/builtIn/en.ts</C>): <C>label</C>, <C>description</C> and{" "}
          <C>tooltip</C> are the caller&rsquo;s text and pass through untouched (:62-63,:84),
          while <C>iconOn</C>/<C>iconOff</C> are registry glyphs, which carry no words
          (:78,:80). The one English sentence the component can produce is the
          development-only missing-name warning, built from the literal{" "}
          <C>&quot;Toggle&quot;</C> (:221-225, warn:71) — it never reaches a user.
        </p>
        <p>
          On and off are spoken by the platform: <C>role=&quot;switch&quot;</C> maps to the
          OS switch pattern, so a French screen reader says son own thing for the state
          without the kit holding a dictionary (:316). What translation does stress is
          layout — a German label is longer than an English one, and the row is a flex
          line with the track pinned <C>shrink-0</C> (:311): <C>alignLabel=&quot;left&quot;</C>{" "}
          with <C>fullWidth</C> (:203,:206,:277,:280) is the arrangement that survives it,
          because the label wraps and the track does not.
        </p>
        <A11yCode filename="Settings.tsx" code={I18N_CODE} />
      </A11yTopic>
    </A11ySection>

    <PropsTable props={TOGGLE_PROPS} />
    <p className="text-sm text-neutral-500 dark:text-neutral-400">
      Spreads native input attributes — <code>name</code>, <code>value</code>,{" "}
      <code>required</code>, <code>data-*</code> and the rest of <code>aria-*</code> pass
      straight through to the checkbox underneath (:216,:333). The three the interface
      takes back are <code>size</code>, <code>color</code> and <code>children</code>{" "}
      (:58-61).
    </p>
  </div>
);

export default TogglePage;
