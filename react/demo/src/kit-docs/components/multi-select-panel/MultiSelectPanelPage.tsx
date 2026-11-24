import React from "react";
import {
  A11yCode,
  A11ySection,
  A11yTopic,
  C,
  KeyboardSupportTable,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { MultiSelectPanelPlayground } from "./MultiSelectPanelPlayground";
import Capabilities from "./examples/Capabilities";
import capabilitiesCode from "./examples/Capabilities.tsx?raw";
import LabelAlign from "./examples/LabelAlign";
import labelAlignCode from "./examples/LabelAlign.tsx?raw";
import SingleChoice from "./examples/SingleChoice";
import singleChoiceCode from "./examples/SingleChoice.tsx?raw";
import Overrides from "./examples/Overrides";
import overridesCode from "./examples/Overrides.tsx?raw";
import Hues from "./examples/Hues";
import huesCode from "./examples/Hues.tsx?raw";

export const MultiSelectPanelPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Multi Select Panel"
      description="A grid of selectable cards, built out of the kit's own Panel and Checkbox rather than a second implementation of either: Panel brings the surface, the pointer answer and the selection rim, Checkbox brings the drawn box, the form field and the card's type scale. Title, icon, subtitle and label pills are each optional — only the title is required — and every card in a row is the same size."
    />
    <MultiSelectPanelPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Input and output"
        description="Two equal columns under an uppercase group label, with icons, subtitles and pills on the title row, one card disabled per-option, and the values a real form submit carries."
        code={capabilitiesCode}
        filename="Capabilities.tsx"
      >
        <Capabilities />
      </ExampleCard>
      <ExampleCard
        title="Where the label pills sit"
        description="The same group twice: labelAlign hugs the pills to the title or pins them to the trailing edge of the row. Both groups are tonal and both carry a disabled card, which is dimmed by its own checkbox rather than by a sheet laid over the card."
        code={labelAlignCode}
        filename="LabelAlign.tsx"
      >
        <LabelAlign />
      </ExampleCard>
      <ExampleCard
        title="Single choice"
        description={
          'selectionMode="single" turns the group into a radiogroup: one tab stop, arrows walk and pick, and with allowDeselect off there is always exactly one card selected.'
        }
        code={singleChoiceCode}
        filename="SingleChoice.tsx"
      >
        <SingleChoice />
      </ExampleCard>
      <ExampleCard
        title="Per-card overrides"
        description="Group surface props are defaults each card may outvote — variant, tone, corner, padding, pulse, checkboxVariant and the three hues below — while the group's tone is still what every card and box wears when nobody has an opinion."
        code={overridesCode}
        filename="Overrides.tsx"
      >
        <Overrides />
      </ExampleCard>
      <ExampleCard
        title="Hues of its own"
        description="The same blue group twice. Top: the default, where tone is the card, its selection rim, the wash and the checkbox box. Bottom: checkboxTone puts the boxes in emerald, the Priority card selects in amber and pulses in rose, and one card outvotes the group on its box alone. The selection keeps its non-colour signals either way — an outline, the tick, aria-checked."
        code={huesCode}
        filename="Hues.tsx"
      >
        <Hues />
      </ExampleCard>
    </section>
    <PropsTable
      props={[
        {
          name: "name",
          type: "string",
          description:
            "Form field name. Multiple mode submits a checkbox field per selection, `name[]=…`; single mode submits a plain radio field, `name=…`.",
        },
        {
          name: "options",
          type: "MultiSelectPanelOption[]",
          description:
            "`{ value, title, subtitle?, icon?, labels?, disabled?, variant?, tone?, corner?, padding?, pulse?, pulseTone?, activeTone?, hoverColor?, checkboxTone?, checkboxVariant? }`. `title` is the only required field; `icon` is a registry name or any node; `labels` are the pills on the title row. Every surface and hue field beats the group's equivalent for that card.",
        },
        {
          name: "label / description",
          type: "ReactNode",
          description:
            "The group heading — an uppercase `<legend>`, which names the group for assistive tech — and the helper under it, wired through `aria-describedby`.",
        },
        {
          name: "value / defaultValue",
          type: "string[]",
          description:
            "Controlled and uncontrolled selections, as on an `<input>`: `defaultValue` is the value at mount, and re-rendering with a fresh array of the same content does not reset a group in use.",
        },
        {
          name: "onChange",
          type: "(selectedValues: string[]) => void",
          description:
            "Fires once per activation with the whole next selection — in click order for multiple mode, one item (or none) for single.",
        },
        {
          name: "selectionMode",
          type: '"multiple" | "single"',
          default: '"multiple"',
          description:
            'Multiple is a checkbox group (`role="checkbox"`, every card its own tab stop); single is a radiogroup (`role="radio"`, one tab stop, arrows pick).',
        },
        {
          name: "allowDeselect",
          type: "boolean",
          default: "true",
          description:
            "In single mode, whether clicking the selected card clears the group. Off makes the choice required. Arrows never deselect either way.",
        },
        {
          name: "columns",
          type: "number",
          default: "2",
          description:
            "Grid tracks, clamped to 1–6. Every card is then the same width, and `grid-auto-rows: 1fr` gives every row one height, so a card with a subtitle and three pills is exactly as tall as one with only a title.",
        },
        {
          name: "gap",
          type: "ControlSize",
          default: '"md"',
          description:
            "Space between cards, on the shared control scale — the same map MultiSelectPills uses for the space between pills.",
        },
        {
          name: "size",
          type: "ControlSize",
          default: '"md"',
          description:
            "Card typography, icon and checkbox box together: it is handed to `Checkbox`, so a card's type scale is the checkbox's own.",
        },
        {
          name: "checkboxVariant",
          type: "InputVariant",
          default: '"flat"',
          description:
            "The textbox surface scale — `flat`, `elevated`, `ghost`, `underline`, `glass`, `gradient` — for the drawn box, the same `variant` `Input` and `Checkbox` wear. Per-option as `checkboxVariant`.",
        },
        {
          name: "checkboxTone",
          type: "TrueColor",
          default: "the card’s tone",
          description:
            "The accent of the drawn box, allowed to disagree with the card it sits on — an emerald tick on a blue card. Omitted, each box wears its own card's tone, blue where the card is untinted. The box keeps the hue's contrast pair (`-{tone}-700` filled, `-{tone}-500` resting), so only the hue is yours, never the legibility. Per-option as `checkboxTone`.",
        },
        {
          name: "variant / tone / corner / padding",
          type: "SurfaceVariant / SurfaceTone / SurfaceCorner / SurfacePadding",
          default: '"elevated" / "blue" / "rounded-sm" / "sm"',
          description:
            'The `Panel` surface every card wears, and the defaults an option may outvote with `variant`, `tone`, `corner`, `padding` and `pulse`. `tone` is one hue for the card, its rim when selected and the checkbox box, so a card and its box read as one thing; `tone="none"` leaves the card untinted and keeps the box readable. `raisedSurface` forces every card’s first nested-panels depth step — the tinted-card-on-matching-background fix.',
        },
        {
          name: "activeTone / pulseTone / hoverColor",
          type: "TrueColor",
          default: "the card’s hue / the selected hue / the selected hue, then the card’s tone",
          description:
            "The hues a card may keep to itself. `activeTone` dresses the whole selected state — rim and wash together — so a blue card can be selected in amber; `pulseTone` is the colour of the attention glow, which by default rides the selection so a selected-and-pulsing card says both things in one colour. Omitted, both fall back through `borderColor` to the card's own tone. `hoverColor` is the hue the card wears under the pointer, and by default that is the hue it is selected in — but only while it is: the selected card hovers in the colour of its own state while its neighbours keep hovering in their tone, rather than the whole grid wearing a state one card has. Give it a hue to keep a card hovering in its brand colour. Per-option as `activeTone` / `pulseTone` / `hoverColor`.",
        },
        {
          name: "transparency / hoverable / hoverShadow / decoration / borderColor / backgroundColor",
          type: "as on Panel",
          description:
            "The rest of the `Panel` surface vocabulary, forwarded to every card. Panel’s own `title`, `subtitle`, `badge`, `media`, `actions` and `loading` are deliberately not exposed — the card’s copy comes from the option fields.",
        },
        {
          name: "glassOpacity / vibrancy / specularMode",
          type: "GlassOpacity / GlassVibrancy / SpecularMode",
          description: "Glass chrome, for the glass card variants.",
        },
        {
          name: "labelTone / labelVariant",
          type: "TrueColor / PillVariant",
          default: "the card’s tone, \"outline\"",
          description:
            "The `labels` pills, rendered with the kit&rsquo;s `Pill` at `sm`. They wrap when they overflow, and are kept out of the card&rsquo;s accessible name.",
        },
        {
          name: "labelAlign",
          type: '"left" | "right"',
          default: '"left"',
          description:
            "Which end of the title row the pills sit on. `left` hugs the title, so title and label read as one phrase; `right` pins them to the trailing edge, which lines a column of cards up. Logical, not physical — `right` means the end, so an RTL card pushes left.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description:
            "Disables the group through the `<fieldset>`, so every card is inert natively; `option.disabled` does the same for one card, which is then dimmed, unfocusable and absent from a submitted form. A card says it once, the way a lone disabled `Checkbox` does — `Panel`&rsquo;s own disabled sheet is switched off, because on a flat `simple` or `tonal` card a translucent rectangle inside the padding reads as a panel within the panel.",
        },
        {
          name: "className",
          type: "string",
          description: "Lands on the `<fieldset>` around the grid.",
        },
      ]}
    />
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The group is a real <C>fieldset</C> with a <C>legend</C>, so it is
          named natively; in single mode the fieldset also carries{" "}
          <C>role="radiogroup"</C>. Each card is a <C>Panel</C> section given{" "}
          <C>role="checkbox"</C> (or <C>role="radio"</C>) and a live{" "}
          <C>aria-checked</C> — one announced control per card, named by{" "}
          <C>aria-labelledby</C> pointing at the <em>title only</em>, so the
          label pills never fold into the name, and described by{" "}
          <C>aria-describedby</C> pointing at the subtitle. The{" "}
          <C>Checkbox</C> inside is a form field and nothing else: its{" "}
          <C>input</C> is <C>display: none</C> and <C>aria-hidden</C>, out of the
          tab order, so the value still travels to a submit without a second
          checkbox being announced inside the card. That is the deliberate
          tradeoff of this composition: the box is drawn, not a second tab stop —
          the card is the control.
        </p>
        <A11yCode
          code={`<section role="checkbox" aria-checked="true"
         aria-labelledby="…-title" aria-describedby="…-subtitle" tabindex="0">
  <label>
    <input type="checkbox" name="modality[]" value="text"
           tabindex="-1" aria-hidden="true" style="display:none" />
    <span>…drawn box…</span>
    <span id="…-title">Text</span>   <!-- the card's whole name -->
    <span id="…-subtitle">Prompt in, prose out</span>
  </label>
</section>`}
          filename="Rendered card"
        />
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          Multiple mode is a checkbox group, so every enabled card is its own tab
          stop and nothing is hijacked. Single mode is the radiogroup pattern the
          kit uses elsewhere: one tab stop — the selected card, or the first
          usable one while nothing is selected — and the arrow keys move{" "}
          <em>and pick</em>, wrapping at both ends and stepping over disabled
          cards. Keys are read on the card itself, so a key that came from
          somewhere inside it is not the card being pressed.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["Tab"],
              action:
                "Multiple: every enabled card. Single: the selected card, or the first enabled one.",
            },
            {
              keys: ["Space"],
              action:
                "Toggles the focused card (single mode: picks it) and prevents the page scroll.",
            },
            {
              keys: ["Enter"],
              action: "Same as Space.",
            },
            {
              keys: ["↑", "↓", "←", "→"],
              action:
                "Single mode only — move to the previous/next enabled card and select it, wrapping at both ends.",
            },
            {
              keys: ["Home", "End"],
              action:
                "Single mode only — first/last enabled card, selected; a disabled end card is skipped.",
            },
          ]}
        />
      </A11yTopic>
      <A11yTopic title="Colour that carries state">
        <p>
          A card&rsquo;s hue is never the only thing saying what it is. Selection
          is an outline — a 2px inset rim, not a tint alone — plus the tick in
          the box and a live <C>aria-checked</C>; <C>checkboxTone</C>,{" "}
          <C>activeTone</C> and <C>pulseTone</C> move those colours, never the
          signals. A disabled card is dimmed <em>and</em> inert natively, and the
          pulse survives <C>prefers-reduced-motion</C> as a static inner glow, so
          which card is asking stays visible with no motion at all. Each hue is
          the theme&rsquo;s own contrast pair for that tone —{" "}
          <C>{"-{tone}-700"}</C> on a filled box, <C>{"-{tone}-500"}</C> on its
          rim, the brighter step in the dark theme — so choosing a hue is not
          choosing a legibility risk.
        </p>
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          Nothing inside to translate: the group label, the helper, every title,
          subtitle and pill label is caller-supplied, and selection travels as
          ARIA attributes rather than prose. Icons are registry names, so
          host-level icon localisation reaches them the way it reaches every
          other component. Text wraps rather than truncating — a long
          translated title grows its card, and the row keeps every card the same
          height.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default MultiSelectPanelPage;
