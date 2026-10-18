import React from "react";
import {
  A11ySection,
  A11yTopic,
  C,
  KeyboardSupportTable,
  PropsTable,
} from "../../shared/A11ySections";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { DatePickerPlayground } from "./DatePickerPlayground";
import Variants from "./examples/Variants";
import variantsCode from "./examples/Variants.tsx?raw";
import SingleAndRange from "./examples/SingleAndRange";
import singleAndRangeCode from "./examples/SingleAndRange.tsx?raw";
import Constraints from "./examples/Constraints";
import constraintsCode from "./examples/Constraints.tsx?raw";
import Inline from "./examples/Inline";
import inlineCode from "./examples/Inline.tsx?raw";
import Validation from "./examples/Validation";
import validationCode from "./examples/Validation.tsx?raw";
import SizeLadder from "./examples/SizeLadder";
import sizeLadderCode from "./examples/SizeLadder.tsx?raw";
import EveryTone from "./examples/EveryTone";
import everyToneCode from "./examples/EveryTone.tsx?raw";
import FormFieldExample from "./examples/FormField";
import formFieldCode from "./examples/FormField.tsx?raw";

export const DatePickerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="DatePicker"
      description="The date field. A text input that parses formatted dates, paired with a real Panel calendar: single and range selection, month and year views, constraints, keyboard navigation and the shared size, tone and variant scales."
    />
    <DatePickerPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Variants"
        description="The six field surfaces — the calendar panel is a real Panel with its own surface scale."
        code={variantsCode}
        filename="Variants.tsx"
      >
        <Variants />
      </ExampleCard>
      <ExampleCard
        title="Single and range"
        description="Single picks a day; range picks a window. A second pick before the start restarts the range, PrimeVue-style."
        code={singleAndRangeCode}
        filename="SingleAndRange.tsx"
      >
        <SingleAndRange />
      </ExampleCard>
      <ExampleCard
        title="Constraints"
        description="min/max windows, disabled weekdays and predicate-disabled days. Out-of-constraint cells are disabled, not hidden."
        code={constraintsCode}
        filename="Constraints.tsx"
      >
        <Constraints />
      </ExampleCard>
      <ExampleCard
        title="Inline"
        description="The calendar rendered in place — no input, no overlay, no portal."
        code={inlineCode}
        filename="Inline.tsx"
      >
        <Inline />
      </ExampleCard>
      <ExampleCard
        title="Validation"
        description="The shared validation status paints the field and publishes aria-invalid; unparseable text is flagged and reset on blur."
        code={validationCode}
        filename="Validation.tsx"
      >
        <Validation />
      </ExampleCard>
      <ExampleCard
        title="Size ladder"
        description="The shared xs–xl scale — the field and its calendar line up with every other control."
        code={sizeLadderCode}
        filename="SizeLadder.tsx"
      >
        <SizeLadder />
      </ExampleCard>
      <ExampleCard
        title="Every tone"
        description="All 21 true colours — the selected day takes the tone's solid fill, in light and dark."
        code={everyToneCode}
        filename="EveryTone.tsx"
      >
        <EveryTone />
      </ExampleCard>
      <ExampleCard
        title="FormField"
        description="Labels, descriptions and the field, wired the same way as every other form control."
        code={formFieldCode}
        filename="FormField.tsx"
      >
        <FormFieldExample />
      </ExampleCard>
    </section>

    <PropsTable
      props={[
        {
          name: "selectionMode",
          type: '"single" | "range"',
          default: '"single"',
          description:
            "Range picks a window; a second pick before the start restarts the range instead of dead-ending. `multiple` and time picking are deliberately not in v1 — the value type already leaves room.",
        },
        {
          name: "value / defaultValue / onChange",
          type: "Date | [Date, Date | null] | null",
          description:
            "Real `Date` objects, not strings — the component&rsquo;s own value-based props, so the native input `value`/`onChange` are replaced, not shadowed. `onChange` fires on every commit: calendar pick, valid typed date, Today, Clear.",
        },
        {
          name: "format",
          type: "string",
          default: '"MMM d, yyyy"',
          description:
            "date-fns tokens for the input text — and for parsing what is typed into it, month and weekday names taken from the active locale.",
        },
        {
          name: "minDate / maxDate / disabledDays / disabledDates",
          type: "Date | string / number[] / Date[] | (date) => boolean",
          description:
            "Constraints render as disabled cells, never hidden — the grid keeps its seven-a-row shape. `disabledDays` is `getDay()` numbering.",
        },
        {
          name: "showOtherMonths / selectOtherMonths / weekStartsOn",
          type: "boolean / boolean / 0 | 1",
          default: "true / false / 1 (Monday)",
          description:
            "Grid display. `weekStartsOn` reorders the columns, headers included.",
        },
        {
          name: "inline / appendTo / showOnFocus / hideOnSelect / hideOnRangeSelection",
          type: 'boolean / "body" | "self" / boolean / boolean / boolean',
          default: 'false / "body" / true / true / false',
          description:
            "`inline` renders the calendar in place — no input, no overlay. Otherwise the overlay is a real Panel: `body` portals it out (positioned like `Picker`), `self` keeps it in the layout tree.",
        },
        {
          name: "showClear / showButtonBar / todayButtonLabel / clearButtonLabel",
          type: "boolean / boolean / ReactNode / ReactNode",
          default: 'false / false / "Today" / "Clear"',
          description:
            "The footer buttons follow the field: `flat`/`elevated`/`gradient` render solid, `ghost` stays ghost, `underline` becomes an outline — and they carry the field&rsquo;s tone and size. On a `glass`/`liquid-glass` **panel** they go glass instead (ghost fields stay ghost): a solid chip on glass reads as a mistake. Labels default to the catalog.",
        },
        {
          name: "size / tone / variant / validationStatus / glowIntensity",
          type: "ControlSize / TrueColor / InputVariant / ValidationStatus / GlowIntensity",
          default: '"md" / "blue" / "flat" / "none" / "subtle"',
          description:
            "The same field system as Input — the box is drawn byte-identically, the gradient glow is the shared two-lobe shadow, tone tints focus and the selected days.",
        },
        {
          name: "panelVariant / panelTone / panelCorner / panelClassName",
          type: '\"auto\" | SurfaceVariant / \"auto\" | TrueColor / SurfaceCorner / string',
          default: '"auto" / "auto" / "auto" (theme corner, today = md) / —',
          description:
            'The calendar&rsquo;s own Panel surface, independent of the field&rsquo;s — a flat field can drop an elevated panel. `panelVariant="auto"` follows the field&rsquo;s variant (glass field → glass calendar, flat → outlined, ghost/underline → subtle); `panelTone="auto"` resolves neutral — the field&rsquo;s accent already lives in the selected days; `panelCorner` defaults to the theme&rsquo;s container corner rather than a pinned radius.',
        },
        {
          name: "readonly / disabled",
          type: "boolean",
          default: "false",
          description:
            "There is no `loading` on purpose: a date is chosen, not fetched — an async value arrives through `value` like any other, and the calendar has no state worth waiting into.",
        },
        {
          name: "onShow / onHide / onInvalidInputChange",
          type: "() => void / () => void / (text) => void",
          description:
            "`onInvalidInputChange` fires with the raw text while it cannot be parsed — the field flags it and resets on blur.",
        },
        {
          name: "ariaLabel / panelAriaLabel",
          type: "string",
          description:
            'Override the accessible names; otherwise the input is named by its placeholder (or the translated "Date") and the panel by its mode.',
        },
      ]}
    />
    <p className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
      The rest spreads onto the inner <code>&lt;input&gt;</code> — the same
      contract as <code>Input</code>, minus the native <code>value</code>/
      <code>onChange</code>, which the component&rsquo;s date-based ones replace
      rather than shadow.
    </p>
    <A11ySection>
      <A11yTopic title="Screen reader">
        <p>
          The field is a native <C>&lt;input&gt;</C> (name: <C>ariaLabel</C> →
          placeholder → the translated{" "}
          <C>kit.datepicker.accessibleNameFallback</C>). The calendar is a{" "}
          <C>role="grid"</C> with one tab stop, <C>aria-selected</C> living on
          the gridcells (the cells&rsquo; buttons cannot carry it), the month
          and year switchers are named buttons that announce the year or month
          they currently stand on, and the panel itself is labelled — by mode —
          with <C>aria-label</C>.
        </p>
      </A11yTopic>
      <A11yTopic title="Keyboard support">
        <p>
          The overlay opens on focus, closes on Escape or Tab-out. Inside the
          grid a roving tabindex keeps one tab stop; arrows walk days across
          month borders.
        </p>
        <KeyboardSupportTable
          bindings={[
            {
              keys: ["tab"],
              action: (
                <>Leaves the overlay and the field, closing the overlay.</>
              ),
            },
            {
              keys: ["↑", "↓", "←", "→"],
              action: (
                <>Move through days; crossing an edge navigates the month.</>
              ),
            },
            { keys: ["pgup", "pgdn"], action: <>Previous / next month.</> },
            {
              keys: ["shift", "pgup", "pgdn"],
              action: (
                <>
                  Previous / next year from the grid; arrows page the year list.
                </>
              ),
            },
            {
              keys: ["enter"],
              action: (
                <>
                  Commits the grid&rsquo;s focused day, or parses and commits
                  what is typed in the input.
                </>
              ),
            },
            {
              keys: ["esc"],
              action: <>Closes the overlay, focus returns to the field.</>,
            },
          ]}
        />
      </A11yTopic>
      <A11yTopic title="Internationalization">
        <p>
          Every string the component draws — Today, Clear, the group labels, the
          panel&rsquo;s name, the fallback field name — rides the catalog under{" "}
          <C>kit.datepicker.*</C>, byte-identical in English. Month and weekday
          names for parsing typed text come from the active locale, so a German
          user typing &ldquo;24. Dezember 2026&rdquo; commits — in the{" "}
          <C>format</C> you set. RTL flows from the document; the grid mirrors
          with it.
        </p>
      </A11yTopic>
    </A11ySection>
  </div>
);

export default DatePickerPage;
