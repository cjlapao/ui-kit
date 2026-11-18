# TaskBoard auto-collapse empty columns

A board where half the columns are empty wastes the row on strips nobody
looks at. `autoCollapseEmpty?: boolean` (default `false`) makes an empty
column render collapsed — the narrow rotated-title strip the manual caret
already produces — as the board's **default view**. The user can still expand
it; that expansion wins for the rest of the session.

Decisions locked with the requester:

1. **View-level only.** The board never emits `onColumnsChange` because a
   column became empty. The app's own `collapsed` flags stay untouched; only
   the user's own caret clicks move data (see below).
2. **Manual wins for the session.** Once a user expands an auto-collapsed
   column, that column is exempt from auto-collapse until the board remounts.
   A remount re-applies the default view.
3. **Columns layout only.** Lanes keep manual-only collapse; in `layout="lanes"`
   the prop is inert.

## Effective collapse (react, `TaskBoardBody`)

```
collapsedFor(col) = expanded.has(col.id)
  ? false
  : col.collapsed || (autoCollapseEmpty && !laneView && columnCount(cards, col.id) === 0)
```

- `expanded` is a `Set<string>` of session-exempt column ids in
  `TaskBoardBody` state — purely view, never emitted.
- Emptiness reads the committed `cards` prop, not the drag preview, so a
  mid-flight drag never collapses or expands a column under the pointer.
- The columns-layout branch maps `viewColumns` through `collapsedFor` and
  hands `TaskBoardColumn` a column with `collapsed` overridden. The column
  component itself is untouched — it already renders any `collapsed` flag as
  the strip. The lane grid keeps receiving the raw columns.

## Caret behaviour

`toggleColumn(id)` branches when `autoCollapseEmpty && !laneView && the column
is empty`:

| shown state | click result | emit? |
| --- | --- | --- |
| auto-collapsed (`col.collapsed` falsy) | add id to `expanded` | never |
| auto-collapsed **and** `col.collapsed === true` | add id to `expanded` | `{ ...col, collapsed: false }` — undoes a real flag, same as today's caret |
| exempt-expanded | remove id from `expanded` (back to auto-collapsed) | never |

Anything else (non-empty column, or flag off) keeps today's behaviour exactly:
emit the `collapsed` flip through `onColumnsChange`. The caret is offered
(`onToggle` defined) when `onColumnsChange` **or** `autoCollapseEmpty` is set,
so a read-only board with auto-collapse can still be opened manually.

## Edge cases

- Flag off: `collapsedFor` degenerates to `col.collapsed`; no behavior change.
- Dragging the last card out: the column auto-collapses on the commit that
  empties it, unless the user expanded it this session. Dragging a card back
  in expands it (it is no longer empty); a later emptying re-collapses it —
  the exemption only ever comes from clicking the caret on a column that was
  showing collapsed, so a card-emptied column with no caret history collapses
  again as the default view.
- Data-collapsed non-empty column: unaffected — clicking it emits as today and
  records no exemption (exemptions are only recorded for empty columns).
- `cards.length === 0` (whole board empty) with the flag on: every column
  shows as a strip; the board's `emptyState` line still appears above them.

## Tests (TaskBoard.test.tsx)

1. Flag on: empty column renders `data-collapsed="true"`, non-empty columns
   stay open, `onColumnsChange` is never called.
2. Flag on + `collapsed: true` on a non-empty column: it still shows collapsed
   (data wins); caret click expands it and emits `{ collapsed: false }`.
3. Caret on an auto-collapsed empty column expands it, emits nothing; it stays
   open after cards arrive and leave; a second caret click re-collapses it and
   emits nothing.
4. Flag off with an empty column: stays open (regression guard).

## Docs

- Prop row in the TaskBoard docs page table.
- Playground: an "Auto-collapse empty" toggle in the Rules group.
