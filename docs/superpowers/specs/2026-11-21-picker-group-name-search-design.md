# Picker — group labels participate in search

Date: 2026-11-21
Component: `react/src/components/Picker.tsx` (React only — the Vue `Picker.vue`
has no group support at all, so porting grouping there is out of scope)

## Problem

`PickerItem.group` gives items group headers (first-appearance order, made
contiguous when present), and with `groupSelectable` the header toggles every
visible item in the group. But the dropdown's search ignores the group label
entirely: the query matches `textValue ?? title ?? id`, `subtitle`,
`description` and tag labels only.

Typing a group's name — the one word the consumer used to name that whole
section — returns "No items found" unless a row's own fields happen to
contain it. The group label is visible furniture of the list and should be
findable like the rest of it.

## Requested behavior

When the query matches a group label, **the whole group appears**: every item
that carries that `group` value, header included. Items in non-matching
groups stay hidden unless their own fields match the query, exactly as today.
Matching follows the existing normalization — case-insensitive, query
trimmed.

Example (the demo's grouped mode): typing `compute` shows every `Compute`
row under its `Compute` header, plus any `Batch` row whose title/subtitle/
description/tags contain "compute".

## Design

### API

No new props, no new state, no new i18n strings. The public item shape is
unchanged; only the search predicate broadens. The `group` JSDoc on
`PickerItem` gains one sentence stating the label participates in search, so
the generated prop table documents it.

### Implementation

Single interception point: the `filtered` `useMemo` in `Picker.tsx`. The item
predicate gains one OR-clause alongside the existing field checks:

```ts
const matched = !q ? baseItems : baseItems.filter(
  (item) =>
    (item.textValue ?? item.title ?? item.id).toLowerCase().includes(q) ||
    (item.subtitle ?? "").toLowerCase().includes(q) ||
    (item.description ?? "").toLowerCase().includes(q) ||
    (item.tags ?? []).some((t) => t.label.toLowerCase().includes(q)) ||
    (item.group ?? "").toLowerCase().includes(q),
);
```

Everything downstream already consumes `filtered` and inherits the behavior
for free:

- **Headers** render from `filtered` by detecting `item.group` changes between
  consecutive rows — a group surfaced by a label match renders its header
  because every member carries the same label.
- **Contiguity bucketing** (first-appearance order, ungrouped items keeping
  their place) runs on the matched set, unchanged.
- **Keyboard navigation** walks `filtered`, so the revealed rows are reachable
  with arrows/Enter like any other match.
- **`groupSelectable`** documents "toggles every **visible** item in the
  group" — `handleToggleGroup` already reads `filtered`, so a label-filtered
  view keeps that contract exactly.
- **Empty state** appears when neither any group label nor any item field
  matches — the search box finally knows about the words printed on the
  headers.

`defaultFilter` (the consumer's predicate) continues to run *before* the text
query, on the full `items` array; a group hidden by the predicate stays
hidden regardless of label match. Ungrouped items (`group` undefined) are
unaffected — the `?? ""` arm never matches.

### Rejected alternatives

- **Opt-in prop** (`searchGroups?: boolean`): API surface for behavior nobody
  asked to disable; tags/description matching is not opt-in either.
- **Structured query syntax** (`group:Fruits`): parsing, escaping and docs
  cost far beyond "make the printed labels findable".

## Testing

`react/src/components/Picker.test.tsx`, existing `describe("Picker groups")`
block. The dropdown search input is the `combobox` role (open it with a click
on the trigger first, as the existing body/search test does). New cases:

- query matching a group label (e.g. `"tools"`) shows every item of that
  group and its header, even when no item field contains the query;
- a group-name query hides items of non-matching groups whose own fields do
  not match;
- a query that matches both a group label and another item's text shows the
  union (matched group's rows + that item and its header);
- matching is case-insensitive and whitespace-trimmed, consistent with the
  existing search tests.

Run `npx vitest run src/components/Picker.test.tsx` from `react/`.

## Out of scope

- Vue `Picker.vue` (no grouping exists there; porting it is its own task).
- `TagPicker` / `VariablePicker` (not requested).
- Any change to `defaultFilter`, `groupSelectable`, header rendering or
  trigger pills.
