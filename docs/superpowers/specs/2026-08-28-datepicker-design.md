# DatePicker (React kit) — Design

**Date:** 2026-08-28 · **Status:** approved · **Scope:** React only — Vue is explicitly
a step behind this pass (user instruction), stated in the final report.
**Reference source:** PrimeVue DatePicker 4.5.5, analysed in
`docs/primevue-datepicker-analysis.md`.

## 1. What it is

`DatePicker` — a date field with a calendar overlay (or an inline calendar).
It is a **field-family** control: its input box is described by the shared field
system (`InputVariant` × `ControlSize` × `TrueColor` × `ValidationStatus`) exactly
like `Input`, and its calendar panel is a **panel-family** surface rendered as a
real `Panel` (`SurfaceVariant` × `SurfaceCorner`). Selection modes: `single` and
`range`. Deliberately not in v1: `multiple` selection, time picking, responsive
multi-month (`numberOfMonths`).

## 2. Value model

- `value?: DatePickerValue`, `defaultValue`, `onChange(value)` — controlled or
  uncontrolled like the kit's other controls.
- `DatePickerValue = Date | [Date, Date | null] | null`:
  - `single` → `Date | null`
  - `range` → `[Date, Date | null] | null` (second element `null` while the range
    is still open)
- Values are always `Date` objects (local midnight for calendar picks).
  No string write-back (PrimeVue's `updateModelType: "string"` is dropped).
- Constraints `minDate`/`maxDate` accept `Date | string`, compared day-level.
- `disabledDays?: number[]` (0–6, `getDay()` numbering),
  `disabledDates?: Date[] | ((d: Date) => boolean)` — the predicate form is a
  documented addition (PrimeVue 4.5.5 only takes `Date[]`).

## 3. API

```ts
interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "color" | "className"> {
  // selection
  selectionMode?: "single" | "range";      // "single"
  value?: DatePickerValue;
  defaultValue?: DatePickerValue;
  onChange?: (value: DatePickerValue) => void;
  format?: string;                         // date-fns tokens, "MMM d, yyyy"

  // constraints
  minDate?: Date | string;
  maxDate?: Date | string;
  disabledDays?: number[];
  disabledDates?: Date[] | ((date: Date) => boolean);
  weekStartsOn?: 0 | 1;                    // 1 (Monday)

  // calendar display
  showOtherMonths?: boolean;               // true
  selectOtherMonths?: boolean;             // false
  showClear?: boolean;                     // clear icon in the field when filled
  showButtonBar?: boolean;                 // Today + Clear footer
  inline?: boolean;                        // panel only, no input/portal
  showOnFocus?: boolean;                   // true
  appendTo?: "body" | "self";              // "body" (portal), Picker positioning
  hideOnSelect?: boolean;                  // true (single)
  hideOnRangeSelection?: boolean;          // false

  // field system — mirrors Input
  size?: ControlSize;                      // "md"
  tone?: TrueColor;                        // "blue" (also `color` alias)
  variant?: InputVariant;                  // "flat"
  glowIntensity?: GlowIntensity;
  gradientFrom?: string; gradientTo?: string;
  validationStatus?: ValidationStatus;     // "none"
  leadingIcon?: string | React.ReactElement;
  className?: string;                      // the field box
  inputClassName?: string;
  unstyled?: boolean;

  // loading / states
  loading?: boolean;
  loaderType?: "spinner" | "progress" | "skeleton";  // "spinner"
  readonly?: boolean; disabled?: boolean;

  // panel family
  panelVariant?: SurfaceVariant;           // "elevated"
  panelTone?: TrueColor;                   // "neutral"
  panelCorner?: SurfaceCorner;             // DEFAULT_SURFACE_CORNER
  panelClassName?: string;

  // events
  onShow?(): void; onHide?(): void;
  onInvalidInputChange?(text: string): void;
  todayButtonLabel?: React.ReactNode;      // "Today"
  clearButtonLabel?: React.ReactNode;      // "Clear"
  ariaLabel?: string;                      // input accessible name
  panelAriaLabel?: string;                 // "Choose a date" / "Choose a date range"
}
```

## 4. Behaviour ported from PrimeVue 4.5.5

**Text input.** Displayed text is always derived from the value
(`format(value)`; range renders `start - end`). Every keystroke parses
(date-fns `parse`; range splits on ` - `); a fully parseable, constraint-valid
date commits immediately. Unparseable partial input stays as typed and marks the
text invalid (visible cue below). **Blur resets the text to the formatted value**
(PrimeVue parity). Enter closes the overlay only when the text parses.
`inputMode="none"`, `autoComplete="off"`.

**Overlay.** Opens on focus/click of the input (when `showOnFocus`) or on the
trailing calendar-icon toggle; closes on outside pointer-down, resize, Escape
(returns focus to the input), Tab-out from the input, single pick (150 ms delay,
unless `hideOnSelect={false}`), range completion (when
`hideOnRangeSelection`). Portaled to `document.body`, positioned with the
`Picker` positioning engine (nearest clipping-ancestor boundary, z-index walk,
flip above/below, width = max(input, panel) clamped). Deliberate deviation: the
overlay does **not** close on scroll (PrimeVue does; the source analysis itself
flags it as surprising) — it repositions instead.

**Calendar.** Full 7-day weeks including other-month cells (shown when
`showOtherMonths`, selectable when `selectOtherMonths`; picking one moves the
view month). The grid is always 6 rows × 7 — other-month days fill the remainder
(documented deviation from PrimeVue's 4–6 rows, which resizes the panel between
months and fights the open/close animation). Month view: 12 short month names,
3 per column. Year view: the decade of 10 years, 2 per column, `first – last`
header. Prev/next: date view ±1 month (Shift = ±1 year), month view ±1 year,
year view ±1 decade. Title buttons switch date → month → year views.

**Selection.**
- `single`: pick → commit, focus the input, close (after 150 ms).
- `range`: first pick → `[date, null]`; second pick ≥ start → `[start, date]`
  (close when `hideOnRangeSelection`); **second pick before start restarts the
  range** `[date, null]`; a third pick on a completed range also restarts.
  Endpoints render solid, interior days render the soft tone tint.
- Out-of-constraint days are non-selectable (no silent clamp — v1 has no time
  component to clamp, so disabling the cells is the honest behaviour).

**Button bar** (`showButtonBar`): `Today` (disabled when today is out of
constraints) + `Clear` (clears to `null`), kit `Button`s at `size="sm"`.

## 5. Visual language

- **Field**: the exact `Input.tsx` field system — `getFieldSizeTokens`,
  `getFieldToneTokens`, `getInputVariantTokens`, `FIELD_STATUS_CLASSES`,
  `stripBorderColor`, glow wrapper for `gradient`. Trailing cluster: optional
  clear icon button (`Close` icon) + calendar toggle button (kit trailing-button
  styling).
- **Calendar panel**: a real `Panel` — `variant={panelVariant}` (default
  `elevated`), `tone={panelTone}` (default `neutral`),
  `corner={panelCorner}`, `padding="none"`, `scrollable={false}` — so glass /
  liquid-glass, specular edges and `useSurfaceText()` copy adaptation come for
  free (brief objective 1). The calendar owns its own inset; weekday labels and
  nav titles use the surface text tokens.
- **Day cells**: circular `h-8 w-8`, `text-sm`,
  `transition-colors duration-200` (the aura token value). States:
  - enabled: `text-neutral-700 dark:text-neutral-300`,
    `hover:bg-neutral-100 dark:hover:bg-neutral-800`
  - other-month (not selectable): muted, no hover
  - disabled: `text-neutral-300 dark:text-neutral-700 cursor-not-allowed`
  - today (unselected): neutral `border` ring
  - selected (single, or range endpoints): the kit solid-fill pattern
    `bg-{tone}-700 text-white dark:bg-{tone}-400 dark:text-neutral-950`
  - range interior: `bg-{tone}-500/15 dark:bg-{tone}-500/15`
  All dynamic tone classes are already covered by `scripts/generate-safelist.mjs`
  (`bg-{c}-700`, `dark:bg-{c}-400`, `bg-{c}-500/15`, `dark:bg-{c}-500/15`,
  `focus-visible:ring-{c}-400`); verify per tone in the built CSS anyway.
- **Month/year cells**: same state system; selected = solid tone fill.

## 6. Animation (PrimeVue 4.5.5 values)

- Overlay open/close: **300 ms, `cubic-bezier(0.19, 1, 0.22, 1)`,
  opacity 0↔1, scale 0.93↔1**, default (center) transform-origin — the
  `p-anchored-overlay-enter/leave` values from `@primeuix/styles@2.0.3`.
  Keyframes live in `react/src/styles.css` (brief §5.10) as
  `.dp-date-picker-overlay--enter/--leave` classes; a React enter/leave state
  machine keeps the panel mounted through the exit animation and unmounts on
  `animationend`, guarded by `event.target === event.currentTarget` +
  `animationName` (Learnings). `prefers-reduced-motion` collapses the duration
  to 1 ms (the animation still ends, so the unmount fires).
- Cells: 0.2 s background/color/border-color crossfade only — no pop or scale,
  matching PrimeVue.

## 7. A11y

- Input: `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` (panel id)
  when open, `aria-invalid` on `validationStatus="error"`. No
  `role="combobox"` — PrimeVue's combobox role has no associated listbox; a
  disclosure on a plain input is the honest pattern.
- Panel: `role="dialog"`, `aria-label`. **`aria-modal` deliberately omitted** —
  PrimeVue sets it but never truly traps focus (brief §5.6).
- Roving tabindex: active cell (selected → today → first selectable) is
  `tabIndex=0`, all others `-1`. `ArrowDown` from the input moves focus into the
  grid; arrows / Home / End / PageUp / PageDown (Shift = year) navigate with
  disabled-cell skipping and month navigation at grid edges; `Tab` from a cell
  cycles inside the panel; `Tab` from the input closes the overlay; `Escape`
  closes and **always** returns focus to the input (PrimeVue skips the refocus
  for cell-Escape; we don't).
- Grid: `role="grid"`, weekday `th` with `scope`/`abbr`, day cells
  `aria-label` (full date), `aria-selected`, `aria-disabled`.
- **Invalid-while-typing cue** (usability improvement over PrimeVue's silent
  no-op): the input text takes a muted rose colour while unparseable, and
  `onInvalidInputChange(text)` fires for apps that lift it into a `FormField`.

## 8. Loading / empty / error

- `loading` + `loaderType`: field mode → absolute `Loader` over the box
  (Panel's overlay pattern) with `aria-busy`; inline + `"skeleton"` → a
  **skeleton calendar** (header bar + 6 × 7 pulsing circles shaped like the real
  grid).
- Empty = no value: the placeholder carries it; the calendar always has content.
- Error = `validationStatus` through the field system.

## 9. Files

| File | Purpose |
| --- | --- |
| `common/utils/dates.ts` | date-fns-backed utilities: parse/format, grid build, constraints, range helpers, weekday/month labels |
| `react/src/components/DatePicker/types.ts` | props, value types, exported constants |
| `react/src/components/DatePicker/DatePicker.tsx` | field, value/text state, overlay state machine, input keyboard, clear/toggle icons, loading |
| `react/src/components/DatePicker/CalendarPanel.tsx` | `Panel` surface, header/nav, view switching, button bar, month & year views |
| `react/src/components/DatePicker/DayGrid.tsx` | day table, cells, roving tabindex, grid keyboard |
| `react/src/components/DatePicker/useOverlayPosition.ts` | Picker-style fixed positioning + z-index walk |
| `react/src/components/DatePicker/index.ts` | re-exports |
| `react/src/components/index.ts` | barrel additions |
| `react/src/styles.css` | overlay enter/leave keyframes + reduced-motion |
| `react/demo/src/pages/UxDemo/demos/DatePickerDemo.tsx` | UxDemo playground |
| `react/demo/src/kit-docs/components/datepicker/*` | kit-docs page: playground + examples |
| `react/demo/src/kit-docs/registry.ts`, `shared/options.ts` | registry entry + option arrays |
| `react/src/components/DatePicker/DatePicker.test.tsx`, `dates.test.ts` | tests |

## 10. Explicit deviations from PrimeVue

1. No `multiple` mode, no time picker, no `numberOfMonths`/responsive — v1 scope.
2. No `updateModelType` string model — values are `Date`.
3. No `role="combobox"` (invalid ARIA), no `aria-modal` (unfulfilled promise).
4. Escape from the overlay always refocuses the input.
5. Overlay repositions on scroll instead of closing.
6. Invalid typed text shows a cue + `onInvalidInputChange` (PrimeVue: silent).
7. 6 fixed grid rows (PrimeVue: 4–6, panel resizes between months).
8. Out-of-constraint cells are disabled rather than clamped.
9. `disabledDates` accepts a predicate (PrimeVue: `Date[]` only).
10. 150 ms close delay after a single pick is kept (lets the selection
    crossfade land before the exit animation starts).

## 11. Verification (brief §6)

`lint` + `vitest run` + `tsup build` (react); demo `tsc --noEmit` + `vite build`
(error count not up); **dist rebuilt before** any demo inspection; per-tone grep
of `dist/index.css` for the five dynamic token families; headless screenshots
light + dark, opaque + glass, over the demo backdrop; `Learnings.md` appended.
