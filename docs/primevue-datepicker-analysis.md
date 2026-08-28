# PrimeVue DatePicker (4.5.5) — Source Analysis for React Port

**Sources:** `packages/primevue/src/datepicker/DatePicker.vue` (3305 lines), `BaseDatePicker.vue`, `DatePicker.d.ts`, `style/DatePickerStyle.js`; CSS from `@primeuix/styles@2.0.3` (`datepicker` + `base` dist) and token values from `@primeuix/themes@2.0.3` (aura preset) — the checkout's lockfile resolves exactly these versions. **No CSS exists in this checkout**; `DatePickerStyle.js` only re-exports `style` from `@primeuix/styles/datepicker` and maps classes. Values below are verified against the published 2.0.3 packages.

## 1. Public API

Defaults from `BaseDatePicker.vue` (extends `BaseInput` → `BaseEditableHolder`: adds `modelValue`, `defaultValue`, `name`, `invalid`, `disabled`, `formControl`, `size`, `fluid`, `variant`).

| Group | Prop | Default | Notes |
|---|---|---|---|
| Selection | `selectionMode` | `'single'` | `single` \| `multiple` \| `range` |
| Input | `dateFormat` | `null` | falls back to locale `dateFormat` (via `datePattern`) |
| Input | `updateModelType` | `'date'` | `date` writes Dates; `string` writes formatted strings |
| Input | `placeholder`, `required`, `invalid` | `null`/`null`/`false` | |
| Overlay | `showOnFocus` | `true` | focus/click on input opens panel |
| Overlay | `appendTo` | `'body'` | `'body'` \| `'self'` \| HTMLElement; Panel is portaled, `Portal` disabled when inline |
| Overlay | `autoZIndex` | `true` | `ZIndex.set('overlay', el, baseZIndex \|\| config.zIndex.overlay)` on enter; cleared on leave |
| Overlay | `baseZIndex` | `0` | |
| Overlay | `breakpoint` | `'769px'` | matchMedia `(max-width: breakpoint)`; listener only sets vestigial `mobileActive` — real responsiveness is the injected `<style>` tag (see §4) |
| Overlay | `responsiveOptions` | `undefined` | `[{breakpoint, numMonths}]` |
| Overlay | `hideOnDateTimeSelect` | `false` | single mode + showTime |
| Overlay | `hideOnRangeSelection` | `false` | range mode, after 2nd pick |
| Calendar | `inline` | `false` | renders panel in-place, no input, no portal, `role`/`aria-modal` removed, focus initialized on mount |
| Calendar | `showOtherMonths` | `true` | render other-month cells |
| Calendar | `selectOtherMonths` | `false` | make them selectable |
| Calendar | `numberOfMonths` | `1` | N calendars side by side; prev button only on group 0, next only on last group |
| Calendar | `view` | `'date'` | initial `currentView`; `date` \| `month` \| `year`; when not `date`, month/year cells *select* instead of navigating |
| Calendar | `showWeek` | `false` | week-number column |
| Calendar | `showIcon` | `false` | |
| Calendar | `iconDisplay` | `'button'` | `button` (separate dropdown button) \| `input` (icon inside input) |
| Calendar | `icon`, `prevIcon`, `nextIcon`, `incrementIcon`, `decrementIcon` | `undefined` | Calendar/ChevronLeft/ChevronRight/ChevronUp/ChevronDown defaults |
| Calendar | `showButtonBar` | `false` | today + clear footer buttons |
| Calendar | `showClear` | `false` | clear icon; forces root `position: relative` |
| Constraints | `minDate`, `maxDate` | `null` | `Date` props (type `Date`); also constrain month/year views |
| Constraints | `disabledDates` | `null` | `Date[]` compared by y/m/d (no function predicate in 4.5.5) |
| Constraints | `disabledDays` | `null` | `number[]` weekday (0–6, JS `getDay()`) |
| Constraints | `maxDateCount` | `null` | multiple mode cap |
| Constraints | `shortYearCutoff` | `'+10'` | century resolution for 2-digit years |
| Time | `showTime` | `false` | |
| Time | `timeOnly` | `false` | timepicker only, no calendar; panel class `p-datepicker-timeonly` |
| Time | `hourFormat` | `'24'` | `'12'` adds AM/PM column |
| Time | `stepHour`/`stepMinute`/`stepSecond` | `1` | |
| Time | `showSeconds` | `false` | |
| Time | `timeSeparator` | `':'` | display only (parser hardcodes `:`) |
| Misc | `manualInput` | `true` | input `readonly = !manualInput \|\| readonly` |
| Misc | `readonly`, `disabled` | `false` | `disabled` also disables panel (`p-disabled`) |
| Misc | `fluid` | `null` | root class `p-datepicker-fluid` |
| Misc | `panelClass`/`panelStyle` | `null` | on `.p-datepicker-panel` |
| Misc | `inputId`, `inputClass`, `inputStyle` | `null` | |
| Misc | `todayButtonProps`/`clearButtonProps` | `{severity:'secondary',text:true,size:'small'}` | |
| Misc | `navigatorButtonProps`/`timepickerButtonProps` | `{severity:'secondary',text:true,rounded:true}` | |
| Misc | `ariaLabel`, `ariaLabelledby` | `null` | |
| Misc | `size` | `null` | `small`/`large` (dropdown width variants) |
| Misc | `unstyled` | `false` | skips core CSS + responsive `<style>` |

Root classes (`DatePickerStyle.js`): `p-datepicker p-component p-inputwrapper` + `p-invalid` (`$invalid`), `p-inputwrapper-filled`/`p-inputwrapper-focus`/`p-focus` (focused **or** overlayVisible), `p-datepicker-fluid`.

## 2. Value Model

- **`modelValue` types:** single → `Date` | string | null; multiple → `Date[]`; range → `[Date, Date|null]`. A string prop value is normalized in the immediate `modelValue` watcher: `rawValue = safeParse(value)` — `parseValue` per mode, falling back to `new Date(value)` (or `null` if invalid). `updateModelType:'string'` writes formatted strings back instead of Dates.
- **`rawValue`** is the internal normalized value; **`viewDate`** (computed) drives `currentMonth`/`currentYear` via `updateCurrentMetaData()`: single → the date; multiple → last element; range → if `end` exists and is ≥ `numberOfMonths` away from start, `new Date(end.y, end.m - numberOfMonths + 1, 1)` (so the whole range fits), else `start`; null/empty → `new Date()` clamped to `maxDate`/`minDate` if today is out of bounds.
- **Emits:** `update:modelValue` + `value-change` (normalized value; strings when `updateModelType==='string'`), `input` (native event, every keystroke), `date-select` (Date in `selectDate`; but `updateModelTime` emits the whole array in range/multiple — inconsistent, see §11), `show`/`hide` (no payload), `today-click` (today `Date`), `clear-click` (Event), `month-change`/`year-change` (`{month: currentMonth+1 /* 1-based! */, year}`), `focus` (Event), `blur` (`{originalEvent, value}` where `value` is the raw typed text *before* reset), `keydown` (only from panel buttons and input Enter — not day cells). There is **no** `onSelectRange`, `onChange`, `onValidInputChange`, or `onInvalidInputChange` in this version.

## 3. Input/Text Parsing

- Input is `readonly` when `!manualInput`; `autocomplete="off"`, `inputmode="none"`, `aria-autocomplete="none"`.
- `onInput` (every keystroke): `parseValue(text)` — single: `parseDateTime(text)`; multiple: split on `','`, parse each; range: split on `' - '`, parse each. `parseDateTime` regex-matches an optional time `(\d{2}:\d{2}(?::\d{2})?(?:\s+(am|pm))?)` then `parseDate` (jQuery-dateformat port; tokens `d D o m M y @ !` + `'literal'`, `lookAhead` doubles → zero-parsed). On success **and** `isValidSelection` → `updateModel(...)` + `updateCurrentMetaData()`. On **any** throw: `catch { /* NoOp */ }` — text stays as typed, **no `$invalid`/`p-invalid` class is ever set by parsing**. (`p-invalid` comes solely from the `invalid` prop or form-field state via `BaseEditableHolder.$invalid`.)
- Displayed text is always derived, never the typed text, whenever the component re-renders: `inputFieldValue = formatValue(rawValue)`. Range formats as `start - end` (` - ` literal), multiple as `a, b, c`, plus ` HH:mm[:ss][ am/pm]` when `showTime`/`timeOnly`.
- **Blur:** `onBlur` emits `blur` with the current typed text, then **forcibly resets** `input.value = formatValue(rawValue)` — an unparseable partial date is silently discarded on blur.
- **Partial input:** typing mid-date → parse throws → nothing changes; only a fully parseable + valid selection commits. **Enter** on the input closes the overlay only if the text parses to a valid selection.

## 4. Overlay Behaviour

- **Open triggers:** `onFocus` (when `showOnFocus && isEnabled()`), `onInputClick` (same, if not visible), dropdown/input-icon `onButtonClick` (toggles; also focuses input first), input ArrowDown (see §8). `isEnabled() = !disabled && !readonly`.
- **Panel:** portaled (`Portal :appendTo`, disabled when inline) inside `<transition name="p-anchored-overlay">`. `onOverlayEnter`: non-inline panel gets inline `position:absolute; top:0`, ZIndex set, then `alignOverlay()` (`appendTo:'self'`/inline → `relativePosition`; else width: for `view==='date'` overlay keeps its own outer width with `minWidth = input outer width`, otherwise width = input width; then `absolutePosition(overlay, $el)`). `currentView` watch also re-aligns after view switches.
- **Close triggers:** outside `mousedown` (`isOutsideClicked` = target not in `$el`, prev/next buttons, or overlay), `ConnectedOverlayScrollHandler` (any scroll), window `resize` (skipped on touch), Escape (input or overlay — overlay handler also `input.focus()`s), Tab **from the input** (sets all overlay tabindexes to `-1` first), clear button/icon, single-select pick (unless `showTime && !hideOnDateTimeSelect`), range completion when `hideOnRangeSelection`. `onOverlayLeave` resets `currentView = view`, unbinds listeners, emits `hide`.
- **Clicks inside overlay** `stopPropagation` and emit `overlay-click` on `OverlayEventBus`.
- **Responsive:** `createResponsiveStyle()` injects a `<style>` into `document.body` (CSP nonce applied): for each `responsiveOptions` entry (sorted breakpoint desc) `@media (max-width: X) { .p-datepicker-calendar:nth-child(j) { display:none } … ; .p-datepicker-calendar:nth-child(numMonths) .p-datepicker-next-button { display:inline-flex } }`. The `breakpoint` matchMedia listener is vestigial (`mobileActive` is dead state).
- **`hideOnDateTimeSelect`:** in `onDateSelect`, single mode: `if (!showTime || hideOnDateTimeSelect)` → `input.focus()` + `setTimeout(overlayVisible=false, 150)`. So with time shown the panel stays open (user sets time). `hideOnRangeSelection`: in `selectDate`, after `modelVal[1]` is filled → same 150 ms delayed close.

## 5. Calendar Model

- **`months` computed:** for `i < numberOfMonths`: `month = currentMonth + i`; `if (month > 11) { month = (month % 11) - 1; year++ }` (works up to 12; relies on JS negative-month normalization beyond). Per month:
  - Grid starts on locale `firstDayOfWeek`: `firstDayIndex = (getDay(1st) + sundayIndex) % 7`, `sundayIndex = firstDay>0 ? 7-firstDay : 0`.
  - Rows = `ceil((daysInMonth + firstDayIndex)/7)` — always full 7-day weeks; leading cells are prev-month days, **trailing cells are next-month days** (marked `otherMonth: true`).
  - Each cell: `{day, month, year, otherMonth, today, selectable}`. `selectable` (`isSelectable`) = NOT(otherMonth && !selectOtherMonths) AND ≥ minDate AND ≤ maxDate AND not in `disabledDates` (y/m/d equality) AND weekday not in `disabledDays`.
  - `today` via local `new Date()`; `daysInMonth = 32 - daylightSavingAdjust(new Date(y, m, 32)).getDate()` (DST fudge: `setHours(getHours() > 12 ? getHours()+2 : 0)`).
- **Rendering:** `<table role="grid">`; when `showWeek` a leading `th`/`td` column shows ISO week number (`getWeekNumber`: Thursday-based, `+4-(day||7)` algorithm) — those cells carry hardcoded `p-disabled`/`data-p-disabled` in the class map. Other-month cells render only if `showOtherMonths` (`v-if="showOtherMonths || !date.otherMonth"`). Today cell: `p-datepicker-today` + `data-p-today`; selected day span: `p-datepicker-day-selected` (or `p-datepicker-day-selected-range` for interior range days, `p-datepicker-day-selected` for endpoints).
- **Month view:** 12 spans of `monthNamesShort[i]`, 3-per-column; `selectable` via min/max year-month comparison; click → if `view==='month'` selects day 1, else `currentMonth = index`, `currentView='date'`, emit `month-change`.
- **Year view:** `base = currentYear - (currentYear % 10)`, 10 years, 2-per-column; decade header span shows `first – last`; `selectable` via min/max year; click → if `view==='year'` selects Jan 1, else `currentYear = year`, `currentView='month'`, emit `year-change`.
- **Navigation:** prev/next: date view → ±1 month (`shiftKey` → ±1 year); month view → ±1 year; year view → ±10 (`decrementDecade`/`incrementDecade` on `currentYear`). Title buttons: month-name button (date view only) → `switchToMonthView`; year button (non-year view) → `switchToYearView`; both `disabled` when `numberOfMonths > 1 || disabled` (`switchViewButtonDisabled`). After each nav, `month-change`/`year-change` with **1-based** month.

## 6. Selection Modes

- **Single:** click (or Enter/Space) on selectable day → `selectDate`: `new Date(y,m,d)`; if `showTime` inherits `currentHour/Minute` (12h: `pm && hour!==12 → +12`), seconds only when `showSeconds`; clamped to `minDate`/`maxDate` (time also synced to the bound). Emits `date-select` (Date); then focuses input + closes after 150 ms unless `showTime && !hideOnDateTimeSelect`.
- **Multiple:** selected days get `p-datepicker-day-selected`. Clicking an already-selected day **removes** it. `shouldSelectDate` blocks when `maxDateCount != null && maxDateCount <= rawValue.length` (further clicks are ignored, no error). Model = appended `Date[]`.
- **Range:** model `[start, end|null]`. First click → `[date, null]`, `focusedDateIndex=0`. Second click: if `date >= start` → `end = date`, `focusedDateIndex=1`; **if before start the range restarts**: `start = date, end = null`, `focusedDateIndex=0`. Rendering: endpoints `p-datepicker-day-selected`, interior days `p-datepicker-day-selected-range` (only when `end` set; partial range highlights only the start). `isSelected` for range uses `isDateBetween` (inclusive, millisecond compare). Time (if `showTime`) applies to the element at `focusedDateIndex`. `hideOnRangeSelection` closes 150 ms after `end` is set.
- All modes: on select, every non-disabled day span is set `tabIndex=-1`, then the clicked cell is focused.

## 7. Time Picker

- Layout (only when `currentView==='date'`): `[increment ▲ / hour / decrement ▼] : [min] (: [sec]) (: [AM/PM])`; columns `p-datepicker-hour-picker/-minute-picker/-second-picker/-ampm-picker`, labels `formattedCurrentHour/Minute/Second` (0-padded; 12h shows 12 for hour 0), separators render `timeSeparator`. `timeOnly` drops the calendar and the top border (`p-datepicker-timeonly`).
- **Buttons:** `mousedown` → `repeat()`: immediate step, then `setTimeout` 500 ms, then every **100 ms** while held; `mouseup`/`Enter|Space keyup` → `clearTimePickerTimer()` + `updateModelTime()` (commits); `mouseleave` clears the timer **without committing**. Keyboard: Enter/Space keydown steps, keyup commits.
- `increment/decrement` wrap (24h: `% 24`; 12h: AM/PM flip at noon/midnight, hour 12 kept); all gated by `validateTime` (min/max only constrain when same calendar date). `toggleAMPM` flips `pm` and commits, skipped if invalid with min/max set.
- `updateModelTime` writes into a clone of `viewDate` (range: element at `focusedDateIndex`; multiple: last), rebuilds the model, `updateModel` + emits `date-select`. No auto-hide on time change.

## 8. Keyboard Navigation

**Input field** (`onKeyDown`): `ArrowDown` → opens overlay if closed; with overlay open → `trapFocus` (prevents default, moves focus to first focusable `SPAN`/button inside overlay). `Escape` → close (only when visible). `Tab` → close + clear overlay tabindexes so native tabbing works. `Enter` → close if text parses valid. (Arrows/Home/End/PageUp/Down/PageUp are **not** handled on the input.)

**Day cells** (`onDateCellKeydown`, roving `tabIndex`, disabled cells skipped via `data-p-disabled`): `ArrowDown/Up` → next/prev row same column, skipping disabled; no row → `navForward/Backward` (month/decade per view). `ArrowLeft/Right` → prev/next cell same row; edge → `navigateToMonth`: with `numberOfMonths>1` jumps to first/last cell of the *neighboring calendar group*, else changes month. `Home/End` → first/last cell of row (or nav to neighboring month if that cell is disabled). `PageUp/PageDown` → prev/next month; `Shift+PageUp/Down` → prev/next year. `Enter`/`NumpadEnter`/`Space` → `onDateSelect`. `Escape` → close (no focus return to input). `Alt+ArrowUp` → close. `Tab` → `trapFocus` (cycles focusable elements inside overlay; shift reverses; first Tab from input targets first SPAN or BUTTON).

**Month cells:** `Up/Down` ±3 (3-per-column), `Left/Right` ±1 (edge → year nav), `PageUp/Down` → year nav (Shift ignored), `Enter/Space` → select month, `Escape` close, `Tab` trap.
**Year cells:** `Up/Down` ±2 (2-per-column), `Left/Right` ±1 (edge → decade nav), `PageUp/Down` → decade nav, `Enter/Space` → select year, `Escape` close, `Tab` trap.
**Panel buttons** (`onContainerButtonKeydown`): `Tab` → trap, `Escape` → close; also re-emits `keydown`.

## 9. A11Y

- **Input:** `role="combobox"`, `aria-autocomplete="none"`, `aria-haspopup="dialog"`, `aria-expanded=overlayVisible`, `aria-controls=<id>_panel` (only when visible), `aria-labelledby`/`aria-label`, `inputmode="none"`, `autocomplete="off"`, `tabindex=0`.
- **Dropdown button:** `aria-label=locale.chooseDate`, `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`.
- **Panel:** `role="dialog"`, `aria-modal="true"`, `aria-label=locale.chooseDate`, `id=${$id}_panel` (both dropped in inline mode).
- **Grid:** `role="grid"`, `th scope="col" abbr=weekday`; day `td` `aria-label=<day>`; day span `aria-selected`, `aria-disabled`; `data-p-today`, `data-p-other-month`, `data-p-selected`, `data-p-disabled` data attributes.
- **Live regions:** `p-hidden-accessible` divs with `aria-live="polite"` containing the selected day number / month / year (rendered only when selected).
- **Buttons:** nav buttons `aria-label` = `prevMonth/nextMonth/prevYear/nextYear/prevDecade/nextDecade`; view switches `chooseMonth`/`chooseYear`; time buttons `nextHour/prevHour/nextMinute/prevMinute/nextSecond/prevSecond`, AM/PM buttons `am`/`pm`.
- **Focus management:** opening never moves focus into the panel (input keeps focus; `initFocusableCell` only sets `tabIndex=0` on selected→today→first cell, guarded by `preventFocus`). Focus enters the grid on cell click or ArrowDown. `Escape` from the overlay refocuses the input; `Escape` from a cell does not. `Tab` out from input un-sets all overlay tabindexes.

## 10. Animations & Motion (exact values)

Source: `@primeuix/styles@2.0.3` — the datepicker stylesheet has **no keyframes**; all motion is in `base` CSS + token-driven `transition`s.

- **Overlay open:** `.p-anchored-overlay-enter-active { animation: p-animate-anchored-overlay-enter 300ms cubic-bezier(.19,1,.22,1); }`
  `@keyframes p-animate-anchored-overlay-enter { from { opacity: 0; transform: scale(0.93); } }` (to = natural style).
- **Overlay close:** `.p-anchored-overlay-leave-active { animation: p-animate-anchored-overlay-leave 300ms cubic-bezier(.19,1,.22,1); }`
  `@keyframes p-animate-anchored-overlay-leave { to { opacity: 0; transform: scale(0.93); } }`
  No explicit `transform-origin` (CSS default = center). The enter hook also positions the panel (`position:absolute; top:0`) before the animation.
- **Cell/button hover & selection transitions** — on `.p-datepicker-day`, `.p-datepicker-month`, `.p-datepicker-year`, `.p-datepicker-select-month`, `.p-datepicker-select-year`, `.p-datepicker-dropdown`: `transition: background, color, border-color, [box-shadow,] outline-color <datepicker.transition.duration>`; aura token `datepicker.transitionDuration = {transition.duration} = 0.2s` (default `ease`). So selection "animation" is just the 0.2 s background/color crossfade on the class change — **no scale/pop on day cells, no day-cell keyframes, no inline-panel animation**.
- **Mask keyframes** (`p-animate-overlay-mask-enter/leave`, 0.3 s) exist in base but the datepicker uses an anchored overlay with **no mask**.
- **Ripple** (`v-ripple` on day/month/year cells): JS-driven ink (appended span, tokenized via `@primeuix/themes/*/ripple`), not part of the datepicker CSS.
- Concrete cell values (aura): day cell `2rem × 2rem`, `border-radius: 50%`, selected `background: primary.color`, range interior `background: highlight.background`, today `background: surface.200`; panel `padding 0.75rem`, `border-radius: 6px` (content.border.radius = border.radius.md), `box-shadow: 0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1)`.

## 11. Edge Cases & Gotchas

- **String modelValue** is parsed on mount via `safeParse`; if both `parseValue` and `new Date()` fail, `rawValue = null` (value silently lost).
- `month-change`/`year-change` fire with **1-based months** (`currentMonth + 1`).
- `shortYearCutoff` `'+10'` → `cutoff = (currentYear % 100) + parseInt(shortYearCutoff)`; 2-digit year `y < 100` maps to `currentCentury + (y <= cutoff ? 0 : -100)`.
- `daylightSavingAdjust` mutates parsed/constructed dates (`+2h` when hour > 12) — can shift parsed times near DST boundaries.
- All date math is **local time**; no UTC handling; `new Date(string)` fallback uses engine-dependent parsing.
- `minDate`/`maxDate` are `Date` props (not strings); day selection beyond them **clamps to the bound** and syncs the time state to the bound's time.
- **Other-month days in range mode:** only selectable with `selectOtherMonths`; selecting one also moves `currentMonth/currentYear` to that cell's month.
- `disabledDates` is `Date[]` only (no function predicate in 4.5.5); `disabledDays` is weekday numbers (JS Sunday=0).
- **Blur always overwrites the input** with the formatted value — no way to keep a partially-typed date; invalid input produces no visual error state.
- `date-select` emits the whole array (not just the changed date) when fired from `updateModelTime`.
- `Enter` on the input closes only when the text is valid; a failed parse leaves the overlay open.
- Overlay closes on **scroll and resize (non-touch)** — surprising for tall pages; also on outside mousedown (not click).
- `currentView` resets to the `view` prop on every hide; with `view !== 'date'`, selecting a month/year commits a date instead of navigating.
- `switchViewButtonDisabled`: title month/year buttons disabled when `numberOfMonths > 1`.
- The `breakpoint` matchMedia state (`mobileActive`) is dead code — don't port it; port the injected `<style>` approach (or a media-query CSS equivalent).
- `onDateSelect` sets `tabIndex=-1` on all day spans before focusing the clicked cell (roving tabindex managed imperatively).
- `numberOfMonths > 1`: prev/next buttons render once per panel (first/last group); the `months` watcher re-runs `updateFocus` on every grid rebuild.
- 150 ms `setTimeout` delays before closing after selection (allows ripple/focus to settle) — keep or consciously drop.
- `appendTo:'self'` uses `relativePosition` (below the anchor) instead of `absolutePosition`; root gets `position:relative` for both `appendTo:'self'` and `showClear`.
