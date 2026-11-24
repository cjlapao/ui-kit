# FilterBar: single-select valueset filters

Approved 2026-11-23. Extend the kit `FilterBar` with a category whose value is
exactly one option out of a valueset — `Enrollment: enabled`, `Ring: stable` —
drawn as a checkmark menu instead of a stack of checkboxes, so picking another
value simply moves the check and re-applies the filter.

## Scope

React kit only — `react/src/components/FilterBar.tsx`, `FilterBar.test.tsx`
and the documentation page/playground. Vue has no `FilterBar` (same scoping as
the 2026-11-20 loader and 2026-11-21 text-filter specs). `MemoryFilterBar` and
every existing call site must compile and behave unchanged.

## Public API

`FilterBarFilter` gains a third arm. The two existing arms are untouched —
the option arm's `type` stays optional — so every current object literal stays
source-compatible.

```ts
interface FilterBarFilterBase { id: string; label: string; disabled?: boolean }

export interface FilterBarSingleFilter extends FilterBarFilterBase {
  type: "single";
  /** Category-row badge, same rule as the options arm. */
  count?: number;
  /** The valueset. Reuses FilterBarOption: value, label, optional count/disabled. */
  options: FilterBarOption[];
}

export type FilterBarFilter =
  | FilterBarOptionFilter | FilterBarTextFilter | FilterBarSingleFilter;
```

Declaring one is a single object literal — that is the whole authoring
surface, no parallel arrays, no render props:

```ts
{ id: "enrollment", label: "Enrollment", type: "single",
  options: [{ value: "enabled", label: "Enabled", count: 4 },
            { value: "disabled", label: "Disabled", count: 1 }] }
```

`FilterBarValue` stays `Record<string, string[]>`: a single-select holds zero
or one entry. Chips, Clear all, `onChange`, `defaultValue`, `leading`/`trailing`
and the `MemoryFilterBar` wrapper all keep working with no change.
`FilterBarSingleFilter` is exported from the package barrel next to the other
arms.

## Interaction and data flow

- **Category list** — unchanged entry: label, count badge
  (`count ?? options.length` while `showMenuCounts`), trailing chevron,
  drill-down on activate.
- **Rows** — Menu `type: "radio"` items, so each row is a
  `menuitemradio` with `aria-checked`, natively activatable by Enter and
  Space (rows are buttons). FilterBar's `renderItem` paints the same 1rem
  leading gutter as the checkbox arm but drops the square border and draws a
  bare `Check` on the selected row, keeping labels and counts column-aligned
  across the two arms. Counts follow `showMenuCounts`.
- **Apply on click** — activating an unselected row commits
  `{ ...applied, [id]: [value] }` in one `onChange`, leaves every other
  category untouched, closes the popup and returns focus to the Add filter
  trigger (the same `close(true)` focus contract as Done). Nothing is
  staged: there is no draft state for this arm.
- **Back to none** — activating the already-checked row omits the key. The
  footer `Clear` button does the same and closes, and the chip ✕ removes the
  value. No "Any" sentinel row: the consumer's valueset stays exactly the
  values it declared.
- **Footer** — `Clear` keeps its seat (left, `secondaryButtonVariant`);
  `Done` is not rendered, since nothing is staged. The header keeps the
  ChevronLeft + uppercase label Back button.
- **Keyboard** — ArrowLeft and Escape still close the drill-down. Because a
  row activation is already committed, Escape afterwards cancels nothing and
  is not an undo; that is the radio-group contract. Tab still reaches Clear.
- **Disabled** — bar `disabled`, `filter.disabled` and `option.disabled`
  behave as they do for the checkbox arm (`aria-disabled` rows never
  activate). An open drill-down of a filter that switches to disabled or
  away from single closes, reusing the existing effect.
- **normalize()** — a single-select keeps at most the first supplied value
  that matches one of its options' `value`s; unknown ids, non-matching and
  empty strings drop, so a controlled consumer passing
  `{ enrollment: ["enabled", "disabled"] }` collapses to `["enabled"]` and
  two rows can never show checked. Prototype-key ids stay safe through the
  existing `hasOwnProperty` guard. One `onChange` per commit, none during
  render.
- **Chips** — one chip per applied single-select, `Enrollment: Enabled`,
  identical to any other category: the label button opens the drill-down
  with the current value checked, ✕ removes the value.

## Layout, loading and a11y

No layout change: the row gutter, chip animation and popup arrive reuse the
existing markup, so `FilterBar.css` needs nothing new and the class contract
check is unaffected. `loaderType="skeleton"` still hides the bar's regions
while keeping them mounted, and an open drill-down closes the moment the bar
goes busy — both arms share that path. No new i18n keys: Back, Clear, Done,
Filters and the summary all exist in the kit catalog.

## Validation

`FilterBar.test.tsx` gains a `single-select filters` block: the arm appears in
the category list and drills down; rows are `menuitemradio` with exactly one
`aria-checked`; click applies one `onChange` with the single-element array,
closes the popup and restores focus to Add filter; re-clicking the checked row
omits the key; Clear clears the key and closes; other categories survive;
chip label, chip-opened drill-down shows the value checked and chip ✕
removes; controlled values collapse to the first matching option and drop
unknowns; `option.disabled` never commits; `showMenuCounts={false}` hides
option counts; Clear all clears single values. All existing option- and
text-filter suites stay green under the widened union.

Documentation: `FilterBarPage` mentions the arm in the header line and the
`filters` PropsTable row, and gains a `SingleSelect` ExampleCard; the
playground switches its Enrollment facet to `type: "single"` behind a compare
toggle so the checkmark menu can be seen next to the checkbox arm.

## Alternatives considered

- **`multiple?: boolean` on the existing options arm** — the smallest diff,
  but one arm would then carry two value cardinalities *and* two commit
  models (staged vs immediate), and the type stops describing the widget.
  Rejected.
- **Menu `selectedKey` with plain rows** — no `renderItem` work at all, but
  the check lands right-aligned at the row end and stops aligning with the
  checkbox arm's gutter. Rejected for the left-gutter checkmark.
- **A `display: "inline"` compact trigger in the bar** (MenuButton-style) —
  the `leading` slot already renders a consumer-owned `DropdownButton` or
  `MenuButton` facet with value echo; adding a second way to place one is
  YAGNI. Rejected.
- **A sentinel "Any" option in the valueset** — makes the consumer manage a
  fake value and its label, and puts a row in the list that is not a value.
  Re-click, Clear and chip ✕ already give three paths back to none. Rejected.
