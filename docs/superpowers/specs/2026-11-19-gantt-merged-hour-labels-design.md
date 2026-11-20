# Gantt — merged hour labels on the hour scale

Date: 2026-11-19 · Status: approved · Builds on: `2026-11-19-gantt-hour-scale-design.md`

## Problem

At the hour tier each hour column is `pxPerDay / 24` wide (12px at the Hour
preset, 8px at the hour-fine floor) and carries its own centered label with
`px-1` padding inside an `overflow-hidden` column. The content box is ~3–4px,
so two-digit labels ("14") truncate to one visible digit — on small screens
there is no room to compensate by zooming and the header reads as a row of
single numbers.

## Decision

Keep the hourly grid lines, but draw **one label per merged group of N hours**
(N = 2, 3, 4, 6 or 12), **centered over the whole group** like a merged table
cell. The step is chosen automatically from the column width; zooming in
restores per-hour labels on its own. No new public props.

Rejected alternatives: per-component derivation (duplicates calendar
alignment across the two kits and leaks date logic into the view layer) and a
minimum column width (no merging, wastes timeline).

## Engine (`common/gantt`)

- `GanttTimeColumn` gains `labelSpan?: number`: *"this column draws the
  level's label, centered across itself plus the next `labelSpan − 1`
  columns."* Absent = no label. Generic for any fine level; only the hour
  branch emits it today.
- `buildTimeScale`'s hour branch computes the step once per scale:

  ```ts
  const hourWidth = pxPerDay / 24;
  const step = [1, 2, 3, 4, 6, 12].find((s) => hourWidth * s >= 20) ?? 12;
  ```

  and sets `labelSpan: step` on hour columns where `getHours() % step === 0`
  (via `pushLevel`'s `labelOf`). `pushLevel` spreads `labelSpan` alongside
  `major` onto the column.
- Invariants: `step` always divides 24 → **midnight always carries its label**
  (it also owns the `major` border). DST-safe: alignment is on `getHours()`,
  so a skipped hour simply leaves its slot unlabeled. Zoom behavior falls out:
  192 px/day (8px) → every 3h, 288 (12px) → every 2h, ≥480 (≥20px) → every h.

## Scale components (React + Vue)

A level is *span-managed* when any column carries `labelSpan` (only the hour
level). In such a level:

- Columns render borders as today; un-labeled columns render nothing inside.
- A labeled column becomes the positioning context and draws the label as an
  absolutely positioned overlay: `left = width/2 + (labelSpan − 1)·width/2`,
  `top 50%`, `translate(−50%, −50%)`, `whitespace-nowrap`. The column itself
  must not clip it (drop `overflow-hidden` for labeled columns; positioned
  content paints above the later siblings' backgrounds, so the label escapes
  its 12px box and reads across the group).
- Test hook: `data-gantt-label-span` attribute on labeled columns.

Non-span-managed levels (day/week/month/quarter fine levels and all coarse
levels) render exactly as before — static centered labels with truncation.

## Testing

- Engine (`gantt-engine.test.ts`): step selection at 192/288/480 px/day
  (labels every 3h/2h/1h), labeled-counts 8/12/24 across a 24-hour range,
  `labelSpan` absent on non-aligned hours, midnight always labeled, day-level
  columns never carry `labelSpan`.
- Kits: mount at `zoom = 288`, assert 12 scale columns carry
  `data-gantt-label-span="2"` and unlabeled hour columns draw borders only.

## Docs

One sentence appended to the zoom paragraph in `docs/design_system/ui-kit.md`.

## Out of scope

Working-hours windows, 12-hour (AM/PM) labels, hover tooltips for unlabeled
hours, a `labelEveryHours` prop (deferred — the auto rule covers observed
cases; revisit if someone pins a weird zoom).
