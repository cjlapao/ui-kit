# ActivityFeed — sub-item `onClick` (two different clicks)

Date: 2026-11-24
Status: approved ("yes" to the presented design)
Follows: `subRowPadding` ladder (`bcd74c7d`), right gutter (`78a04f49`)

## Problem

Rows with sub-items have exactly one click: the row's (either the
disclosure toggle or the item's `onClick`). The sub-rows are deliberately
read-only — but they already wear a toned hover wash, an affordance that
promises more than it delivers. Worse, in `onClick`-mode the sub-row
clicks bubble into the parent's handler, so "clicking a sub-item" fires
the parent click — the user's "would it close the parent?" question.

## Decisions (user-approved)

- Sub-items get their **own `onClick`**; it fires **alone** — never folds
  the parent disclosure, never fires the parent's `onClick`.
- A **plain** sub-item (no `onClick`) keeps bubbling to the parent card:
  sub-rows are still the parent's content; only clickable ones divert
  the click to themselves. Text stays selectable either way.

## Behavior matrix

| parent | sub | click on the sub does |
|---|---|---|
| toggle-mode row (no `onClick`) | clickable | fires sub handler only — the region's swallow already protects the fold |
| toggle-mode row | plain | nothing (as today; selectable text) |
| `onClick` row | clickable | fires sub handler only — `stopPropagation` at the sub |
| `onClick` row | plain | parent's `onClick` fires (as today) |

## Design

**API** — one field on `ActivityFeedSubItem`:

```ts
/**
 * The sub-row's own activation. Fires alone: it never folds the parent's
 * disclosure and never fires the parent row's `onClick`. Unset keeps the
 * sub-row a read-only context row — clicks pass through to the parent
 * card, as today.
 */
onClick?: () => void;
```

The `subItems` doc on `ActivityFeedItem` drops the "never carry the
row's own `onClick`" clause; `active`/`attention`/further nesting stay
banned.

**Mechanics** — with `sub.onClick` set, the wash wrapper renders as a
real `<button type="button">` carrying the exact classes the div has now
plus `w-full text-left` (buttons default centered and shrink-to-fit) and
the accent focus ring (same token the chevron button borrows:
`getSurfaceTriggerTokens(cardAccent).focusRing`). Native Enter/Space and
focus come free — the hover wash becomes an honest affordance. The
handler: `event.stopPropagation()` then `sub.onClick()`. Plain sub-items
render the byte-identical div of today.

**Alternatives considered**: `div role="button"` + hand-rolled keydown —
rejected; the actions zone and the toggle-mode Panel both already nest
real buttons in the card action, and the native element is less code.
Parent-side delegation `(itemId, subIndex)` — rejected; per-sub handlers
were the ask.

## Parity checklist

- **React**: type + `FeedRow` sub-map (button vs div on `sub.onClick`).
- **Vue**: `ActivityFeedRow.vue` template-level `v-if` choosing
  button/div, `@click.stop`; `withDefaults` untouched (field is optional).
- **Tests (both kits)**:
  1. clickable sub fires its handler once, parent stays open (toggle
     mode) — region still visible / `aria-expanded` intact;
  2. clickable sub in `onClick` mode fires the sub only — parent's
     handler not called;
  3. plain sub in `onClick` mode still bubbles to the parent;
  4. plain sub still renders a plain div (no button) — the inert path
     stays byte-identical.
- **Playground**: wire a couple of demo sub-items to a state handler so
  the path is exercisable in the demo.
- **Docs**: `ActivityFeedPage` sub-items prose loses "read-only"; spec
  here.

## Non-goals

No sub `active`/`attention`, no sub hover-only cursor without `onClick`,
no async/pending sub buttons, no nested sub-sub-items.
