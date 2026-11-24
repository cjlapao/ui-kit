# InfoRow — `emptyText={null}`: suppress the dash entirely

Date: 2026-11-23
Components: `react/src/components/InfoRow.tsx`, `vue/src/components/InfoRow.vue` +
`vue/src/components/internal/InfoRowContent.vue` (dual kit, parity required)

## Problem

Rows that live for something other than their value — the sub-item verdict rows, the
collapsible disclosure rows, anything passing `hideIfEmpty={false}` — still greet the
right edge with a floating `—` while their value is empty. The docs' own SubItems
example had to reach for `emptyText=""`, which trades the dash for an empty span: the
placeholder is invisible but the tooltip anchor, the hover `measure` listeners and the
text-reveal focus ring machinery are all still mounted around nothing.

The caller wants the row, its label, its sub-items and its body — just no placeholder.

## Requested behavior

From the request, as clarified:

1. **Empty values only.** The option suppresses the `—` placeholder; real values still
   render exactly as before.
2. **States keep painting.** The loading skeleton/spinner and the error text still
   occupy the value area — they are states, not decoration. (The error also keeps its
   sr-only live-region announcement.)

Rejected shapes: a `hideValue` boolean (a third switch whose name promises more than
the empty case it governs, entangled with `emptyText` and `hideIfEmpty`); treating
`emptyText=""` as "none" (`""` and `null` mean different things in i18n catalogs, and
`""` genuinely renders an empty span today).

## Design

Extend the existing prop: `emptyText?: string | null`, default `"—"` unchanged.

- **React**: `const omitValue = isEmpty && emptyText === null && !hasError && !loading;`
  The value cluster's branch reads
  `loading ? loader : omitValue ? null : canTooltip && truncated && copyText ? <TooltipWrapper>{valueSpan}</TooltipWrapper> : valueSpan`.
  The span is gone entirely — nothing to measure, no tooltip anchor, no focus stop.
- **Vue**: a `showValueSpan` computed on the view —
  `!!slots.value || !isEmpty || loading || hasError || emptyText !== null` — and the
  built-in value span is `v-else-if="view.showValueSpan"` instead of `v-else`. A
  `#value` slot is caller content and owns the area outright, so it defeats omission.
- **No new interaction surface.** Copy and truncation-tooltip already stand down when
  empty (`copyText === null`), so the omitted span strands nothing.
- **`hideIfEmpty` untouched.** It decides whether the *row* renders; `emptyText={null}`
  decides whether the *dash* renders. An empty row with nothing else keeping it alive
  is still hidden whole; exempted rows (sub-items, body, collapsible) now render clean.

## Test contract

Both kits pin: `emptyText={null}` with `hideIfEmpty={false}` renders the row with no
`—` anywhere; loading still paints its skeleton; error still paints its text; a
sub-item row kept alive by its sub-items shows no dash; `hideIfEmpty` still hides a
nothing-else row with the placeholder suppressed. Vue additionally pins `#value` slot
precedence under `emptyText: null`.

## Docs

Props row: `emptyText` becomes `string | null` with the null semantics. SubItems
example swaps its `emptyText=""` workaround for the first-class `emptyText={null}`
(card copy updated; `?raw` mirrors the file). Playground: the Anatomy tab's "Empty
value" toggle gains a companion "No placeholder" toggle, shown only while it is on.
