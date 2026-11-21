# TaskBoard — per-column "+ Add card" gating (`canAddCard`)

Date: 2026-11-21
Component: `react/src/components/TaskBoard` (React only — there is no Vue TaskBoard;
the engine in `common/taskboard` is untouched)

## Problem

`onAddCard` is one board-wide callback. Both render sites gate the button only on
"the callback exists" plus "the column is not at its cap":

- `TaskBoardColumn.tsx` — `onAddCard && !full`
- `TaskBoardLaneGrid.tsx` — `onAddCard && !fullColumns.has(col.id)`

So an app either gets "+ Add card" on every column or on none. There is no way to
say "create cards in Intake and Backlog, not in Done" — a `done` column ends up with
a button whose handler has to no-op, while still looking clickable.

The nearest lever, `column.maxItems`, is a capacity rule: at the cap the button does
hide, but drops into the column are refused too and the header reads `count / max`.
Using `maxItems: 0` to mean "no adding" fakes a capacity and breaks dragging.
`column.locked` is a move rule and does not touch the button.

## Requested behavior

The board keeps one `onAddCard`, and the app decides per column — and, in the lanes
layout, per column × lane cell — whether that button appears.

## Design

### API

One new prop on `TaskBoardProps`, documented beside `onAddCard`:

```ts
/**
 * Gate the "+ Add card" button per column (or per column × lane cell). Only
 * consulted when `onAddCard` is set — it filters where the button appears, it
 * never gates a drop or a move. Called during render with the same target
 * `onAddCard` receives, so one map can serve both; keep it cheap and free of
 * side effects. @default allow everywhere
 */
canAddCard?: (target: { column: string; lane: string | null }) => boolean;
```

**Default: allow everywhere.** Omitting it reproduces today's render exactly. The
existing invariant holds — no `onAddCard`, no button anywhere — because `canAddCard`
is a filter on a button that only exists when there is a handler to call.

### Where the gate is consulted

`canAddCard` rides to the parts through `TaskBoardContextValue`, next to
`onAddCard` (`context.ts`), destructured in `TaskBoard.tsx` and added to the context
`useMemo` deps. Two call sites, each asking about its own target:

| site | target asked | button shows when |
|---|---|---|
| `TaskBoardColumn` (columns layout footer) | `{ column: column.id, lane: null }` | `onAddCard && allowed && !full` |
| `TaskBoardLaneGrid` (lane row, per column cell) | `{ column: col.id, lane: lane.id }` | `onAddCard && allowed && !fullColumns.has(col.id)` |

The lanes grid already renders one button per cell, so a predicate that ignores
`lane` gates the whole column in both layouts, and one that reads it gates single
cells.

### Deliberate boundaries

- **Adds, not moves.** A column can refuse the Add button and still accept a
  dragged card. Move permission belongs to `onBeforeMove`, `column.locked`,
  `column.accepts` and `wipLimit`; overloading `canAddCard` onto drops would give
  the board two sources of truth for the same rule.
- **Capacity still wins.** A column at its `maxItems` shows no button even when
  `canAddCard` says yes — the cap is a hard rule, and the two conditions are
  independent ANDs, not overrides.
- **Collapsing needs nothing extra.** The footer lives in the column body, which is
  already `inert` while the column is collapsed.
- **No other add path exists.** The keyboard flow moves cards but never adds;
  `TaskBoardAddColumn` belongs to edit mode's column layout, not to cards.

## Testing

`react/src/components/TaskBoard/TaskBoard.test.tsx`, next to the existing "+ Add
card emits the column" and "no Add card button without onAddCard" cases:

- a `canAddCard` that denies one column hides that column's button and leaves its
  siblings' buttons;
- the allowed column's button still emits `{ column, lane: null }`;
- the predicate is asked about the target it gates — `{ column, lane: null }` in the
  columns layout, `{ column, lane }` per cell in lanes;
- lanes: a cell whose predicate answer is `false` renders no button while the cell
  beside it keeps one, and the allowed cell emits `{ column, lane }`;
- omitting `canAddCard` keeps every button (the existing cases cover the default).

## Docs

- `react/demo/src/kit-docs/components/task-board/TaskBoardPage.tsx` — a props-table
  row beside `onCardOpen / onCardContextMenu / onAddCard`, saying plainly that it
  gates the button and not the drop.
- `TaskBoardPlayground.tsx` — one toggle that denies add in a named column, so the
  behavior is visible without writing code.

## Out of scope

- Per-column drag permission or a `canMoveCard` predicate.
- A per-column data flag (`column.addable`). Rejected: add permission is the app's
  policy, not board data the backend should carry — and a predicate sees the lane,
  the user's role and anything else in scope.
- The Vue port (no TaskBoard exists there).
