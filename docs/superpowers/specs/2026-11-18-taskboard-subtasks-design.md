# TaskBoard Sub tasks

A card can carry a sub-task list — the small checklist work breakdowns people
track beside a kanban card (GitHub sub-issues, Linear sub-issues). On the card
it renders as a **read-only `DotStepper` row plus a `done/total` fraction**:
one dot per sub task, at most `subtaskMaxVisible` (3 by default) dots, the rest
stacked into DotStepper's overflow markers whose tooltip names every hidden
sub task. The fraction reads progress at a glance; the dots carry per-item
state and identity; the stacks keep cards small.

## Data model (common/taskboard)

`TaskBoardCard.subtasks?: TaskBoardSubtask[]`, where a sub task is
`{ id, title, done?, status?, data? }`:

- `done: true` is the checked state — shorthand for `"completed"`.
- `status?: "pending" | "active" | "completed" | "error"` overrides `done`.
  The strings match the React `StepStatus` union 1:1, so no translation layer.
- `title` is plain text: it becomes the dot's tooltip and accessible name.
- `data` is opaque app payload, like the card's own.

`resolveSubtasks(subtasks)` (new pure engine module, `subtasks.ts`) turns the
model into `{ subtasks: [{ id, title, status }], done, total }`. Per item,
first match: explicit `status` wins; `done` resolves to `"completed"`; else
the **first** such item is `"active"` and later ones `"pending"`. So a plain
checked list reads as "done dots, one pulsing dot, grey dots" with no
ceremony, and an app that tracks real states opts out of the inference item
by item. All-done lists have no active item. The function never mutates input.

The engine itself stays uninvolved: moves spread cards, so `subtasks` ride
through `applyMove`, undo/redo and collab untouched. Editing sub tasks is the
app's `onCardOpen` editor — the board is presentational for them, like it is
for card descriptions.

## The readOnly DotStepper (react)

Card dots must not be controls: each step of `DotStepper` is a `<button>`, and
a button inside a `role="button"` card means one tab stop per sub task, a
nested-interactive a11y violation, and Panel's `hasInteractiveDescendant`
dev warning. `DotStepper` gains **`readOnly?: boolean`**: each step renders as
a non-focusable `role="img"` `<span>` (same `aria-label` — title, position and
status — same `aria-current`, same TooltipWrapper hover, same dot geometry and
pulse), overflow stacks go `tabIndex={-1}`, and `onStepSelect` /
`renderActiveContent` do nothing. A click on a dot is a click on the card and
still fires `onCardOpen`. Everything visual is untouched. (Rejected: passing
`disabled` — that fades the whole row `opacity-50` and announces a disabled
control where none exists.)

## The card row (react TaskBoardCard)

Both card presets show the row when `subtasks` is non-empty; an empty or
missing list renders nothing. The detailed preset puts it in the meta row
after priority / notes / checklist / due; the compact preset appends it to the
points-and-tag row. The row is:

- `<DotStepper readOnly variant="none" maxVisible={subtaskMaxVisible} size={dotSize}>`
  with `aria-label` = `kit.taskboard.subtasks` ("2 of 7 subtasks"), and
- a `done/total` fraction in the muted meta colour (`aria-hidden` — the group
  label already says it).

`dotSize` follows the board `size`: xs/sm → xs, md/lg → sm, xl → md, so dots
never outgrow the meta line. The board gains `subtaskMaxVisible?: number`
(default 3), delivered through the board context along with the board's raw
`controlSize`; invalid limits fall back to DotStepper's `planDotSteps` clamps.
The drag clone reuses the card body, so it carries the dots too — the spans
add nothing interactive inside the `aria-hidden` clone.

`checklist` (bare counts) and `subtasks` (per-item dots) may coexist; they are
different data and neither replaces the other.

## Strings

One new label: `kit.taskboard.subtasks` — "{done} of {total} subtasks" — with
the usual key parity in all five kit catalogs (en, de, es, fr, pt) and
`labels` overriding it per board. Known limitation, deliberately out of scope:
DotStepper's own strings (the overflow stacks' "N more steps", the default
group label) are not i18n'd yet, so the card's stack tooltips stay English
until DotStepper gets catalog keys.

## Demo and validation

Sample roadmap: a seven-sub-task overflow card, an explicit-status card, an
error-state card and a done-flag card; plus one compact lane card with three
sub tasks. An example card with an all-done list, an error item and a
dot-limit toggle; the playground gains a "Subtask dots" select; PropsTables
document `card.subtasks`, `subtaskMaxVisible` and `readOnly`.

Tests: resolver rules (flags, explicit statuses, mixed, error, all-done,
empty, no mutation) in `taskboard-subtasks.test.ts`; rendering in
`TaskBoardSubtasks.test.tsx` — dots and fraction, windowing with default 3 and
custom limits, zero buttons and zero tab stops inside the row, a dot click
still opening the card, the compact preset, and moves carrying sub tasks
through; DotStepper `readOnly` — button-free, tab-stop-free, tooltips kept,
pulse kept. `TaskBoard.test.tsx`'s "plain renders no Panel chrome" now scopes
its `section` probe to the wrapper, since card content (the dot group's Panel)
legitimately holds sections.

React-side only: TaskBoard and DotStepper are React kit components; the Vue
port stays a step behind, per the kit's standing note.
