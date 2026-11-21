# FilterBar: text filters + leading/trailing slots

Approved 2026-11-21. Extend the kit `FilterBar` so a consumer can build a bar
like `Provenance: any ▾ · Tag … · Source loop slug … · ⬤ Include retracted`
without leaving the component: filters that take their value by typing, and
arbitrary kit controls at both ends of the bar.

## Scope

React kit only — `react/src/components/FilterBar.tsx`, `FilterBar.css`,
`FilterBar.test.tsx`, the documentation playground. Vue has no `FilterBar`
(same scoping as the 2026-11-20 loader spec). `MemoryFilterBar` and every
existing call site must compile and behave unchanged.

## Public API

`FilterBarFilter` becomes a discriminated union. The option arm keeps today's
shape exactly — `type` is optional and defaults to `"options"` — so existing
object literals are source-compatible.

```ts
interface FilterBarFilterBase { id: string; label: string; disabled?: boolean }

export interface FilterBarOptionFilter extends FilterBarFilterBase {
  /** @default "options" */
  type?: "options";
  count?: number;
  options: FilterBarOption[];
}

export interface FilterBarTextFilter extends FilterBarFilterBase {
  type: "text";
  /** Where the entry UI appears. @default "inline" */
  display?: "inline" | "menu";
  /** Forwarded to the kit Input (placeholder, variant, inputMode…).
   *  value/onChange/disabled/commit keys stay owned by FilterBar. */
  inputProps?: InputProps;
}

export type FilterBarFilter = FilterBarOptionFilter | FilterBarTextFilter;
```

Two new props on `FilterBarProps`, following the `Toolbar` start/end slot
convention:

```ts
/** Content at the start of the bar, before the search region. */
leading?: ReactNode;
/** Content at the end of the bar, after the action group. */
trailing?: ReactNode;
```

`FilterBarValue` stays `Record<string, string[]>`. A text filter holds one
value: `[trimmed]` while non-empty, key omitted when empty. Both new arm types
are exported from the package index alongside the existing types.

## Interaction and data flow

- **Inline field** — rendered in the bar's filter area (after the chips and
  empty-state message, in declaration order) as a kit `Input` at the bar's
  `size`, `color` as default tone. Local editing state (`editing ?? value`):
  typing edits locally without emitting; **Enter or blur commits** (trim;
  empty omits the key); **Escape reverts** to the committed value. No commit
  when the trimmed text equals the applied value. Externally driven changes
  (Clear all, chip remove, controlled `value`) sync the field while it is not
  being edited.
- **Menu field** — the filter appears in the Add filter category list;
  selecting it drills into the existing Menu shell. The header stacks Back
  above a full-width `Input` seeded from the applied value; the footer keeps
  Clear/Done. Enter or Done commits, Clear empties the draft, Back/Escape/
  outside click discard. The draft never reaches `onChange`. The root
  ArrowLeft shortcut ignores keystrokes originating in a text `input`, so the
  caret stays usable.
- **Chips** — a non-empty text filter renders one chip, `Tag: auth`, like any
  category. The chip button focuses the inline field (or opens the drill-down
  for `display: "menu"`); ✕ removes the value. `display: "inline"` text
  filters are excluded from the category list — their field is already in
  the bar; the Add filter button disables when no menu-available filter
  remains.
- **Clear all** — `commit({})` clears text values and their fields too.
- **normalize()** — text filters keep at most the first supplied value,
  trimmed; whitespace-only and unknown ids drop; prototype-key ids stay safe
  via the `hasOwnProperty` guard. One `onChange` per commit, none during
  render.
- No new i18n keys — placeholders are consumer-supplied through `inputProps`;
  the menu reuses Done/Clear/Back.

## Layout, loading and a11y

Bar order: `[leading] [search] | [Filters label] [chips/empty] [inline text
fields] [flex-1: Add filter · Clear all · result summary] [trailing]`.

The filters region and the action group become real CSS nodes
(`.fb-filters`, `.fb-actions`, `.fb-slot`, `.fb-text-fields`,
`.fb-text-field` in `FilterBar.css`, matching the file's layout-contract
comment) so they can stay **mounted, hidden and inert** under the
`loaderType="skeleton"` rewrite instead of unmounting — the same contract the
search region already honors. Uncommitted typing and consumer state inside
the slots (an open dropdown, a focused toggle) survive refetches. Spinner and
progress keep everything visible beneath the scrim, unchanged.

Bar `disabled` disables the inline text fields; `leading`/`trailing` content
stays consumer-owned (documented, not force-disabled). Slot wrappers render
nothing when the props are omitted. Skeleton placeholder shape is unchanged.
Menu inputs inherit the popup's `aria-label` (the filter label).

## Validation

`FilterBar.test.tsx` gains: inline render/placeholder; Enter and blur commit
with trim; empty omits the key; Escape reverts; external-sync to the field;
chip add/remove/edit-focus; Clear all clears text values; controlled
normalization (first value only, whitespace-only drops); menu-mode list
inclusion, Done/Enter commit, Escape discard, Clear empties the draft;
category-list exclusion of inline text filters and Add-filter disable;
`leading`/`trailing` render and hidden+inert under skeleton; bar `disabled`
reaches inline fields. All existing option-filter suites stay green under the
union types.

Documentation: `FilterBarPage` gains an ExampleCard recreating the reference
bar (leading `DropdownButton` "Provenance: any", Tag as inline text, Source
loop slug as menu text, trailing "Include retracted" `Toggle`), PropsTable
rows for `leading`/`trailing` and the text filter fields, and playground
controls (a text filter in the fixture, leading/trailing slot switches).

## Alternatives considered

- **Parallel `textFilters[]` prop** — zero risk to the option arm, but chips,
  Clear all and menu ordering must merge two arrays at every touch point:
  duplicated logic and split ordering semantics. Rejected.
- **Render-prop custom filters** — maximum flexibility, but FilterBar cannot
  size, theme or guarantee a11y for what the consumer draws, which is exactly
  what the reference bar needs. Rejected.
- **Declarative trailing control descriptors** — the slot already covers
  buttons, toggles and any future control with less API surface. Rejected.
- **Leading/trailing as filter kinds wired into `FilterBarValue`** — a
  boolean toggle chip and a Clear-all-reset toggle are questionable
  semantics; the screenshot's toggle is query scope, not a filter. Slots keep
  it consumer-owned.
