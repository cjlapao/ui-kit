# Gantt hour time-scale — design

Date: 2026-11-19 · Scope: `common/gantt` (engine), React + Vue kits (toolbar
labels, grid emphasis), i18n built-ins, docs.

## Goals

1. Add an **Hour** interval to the Gantt's time scale: a 5th zoom preset
   (Hour / Day / Week / Month / Quarter) that renders 24 hour columns per day.
2. Full-24-hour days — no working-hours model (the engine has none; adding
   one is out of scope).
3. Drag precision follows the zoom: past the hour threshold, `snap="day"`
   snaps to the hour and `snap="none"` clamps to the hour, without any new
   public props.

## Approach

Continuous-zoom tier (option A). The zoom model is pure `pxPerDay`: wheel
zoom, ± buttons, preset snapping (`nearestPreset`), header levels and body
grid lines all derive from it. Adding an `"hour"` tier above `day` in
`pickBaseUnit` plus one preset and a higher max zoom makes every surface
hour-aware with zero special-casing. Alternatives rejected: a separate
`showHours` toggle (forks the scale logic from the zoom model) and overloading
the Day preset (changes existing behavior for all consumers).

## Engine — `common/gantt/types.ts`

- `GANTT_ZOOM_PRESETS`: prepend `{ label: "Hour", value: 288 }`
  (288 px/day = 12 px per hour column). Result: Hour 288 / Day 48 / Week 16 /
  Month 5 / Quarter 1.6.
- `GANTT_MAX_ZOOM`: `96 → 576` (24 px/hour at max zoom).
- New export `GANTT_HOUR_PX_PER_DAY = 192` — the single "hour-fine" threshold
  (≥ 8 px/hour). Same constant drives `pickBaseUnit` and the `snapDate`
  auto-refine; replaces the folklore `> 120` note in the `snapDate` doc.
- `GanttTimeColumn` gains optional `major?: boolean` — true on the midnight
  hour column, used for a stronger border at day boundaries in the scale and
  body grid.

## Engine — `common/gantt/time.ts`

- `startOfHour(ms)`; `formatHour(ms, locale)` — localized hour number with
  `hourCycle: "h23"` (always short enough for a 12 px column; the 12-hour
  "AM/PM" form truncates at this width and time-of-day headers are inherently
  24-hour).
- `pickBaseUnit`: returns `"hour"` when `pxPerDay >= GANTT_HOUR_PX_PER_DAY`,
  otherwise unchanged (`day` ≥ 24, `week` ≥ 4, `month` ≥ 0.8, else `quarter`).
- `buildTimeScale` hour branch: fine level = whole-hour columns
  (`label = formatHour`, `major` on midnight); coarse level = day columns
  (`label` = day number, `subLabel` = weekday) — the existing day/month
  pattern with the roles swapped. `levels.reverse()` keeps coarse on top.
- `snapDate(ms, snap, pxPerDay?)`: when `pxPerDay >= GANTT_HOUR_PX_PER_DAY`,
  `"day"` behaves as `"hour"` and `"none"` clamps to the hour; without the
  third argument behavior is byte-identical to today (back-compat).
- `applyDragDates` (in `drag.ts`) already receives `pxPerDay` — it forwards it
  to its three `snapDate` call sites.

## Surfaces

- `GanttToolbar.tsx` / `GanttToolbar.vue`: `ZOOM_LABELS` gains
  `Hour: t("kit.gantt.zoomHour")`. The segmented control renders the presets
  array-driven, so no other change.
- i18n built-ins (`en/pt/de/fr/es`): `zoomHour` = Hour / Hora / Stunde /
  Heure / Hora.
- Body grid lines come from the fine scale level automatically → per-hour
  grid at the Hour tier. Columns with `major: true` (midnight) render a
  stronger border in both `GanttScale` and the body grid lines.
- The drag tooltip already switches to `HH:mm` at `zoom >= 24`; the Hour tier
  (≥ 192) satisfies it.
- `GANTT_HOUR_PX_PER_DAY` is re-exported from both kit Gantt index files
  alongside `GANTT_ZOOM_PRESETS` / `GANTT_MAX_ZOOM`.

## Compatibility

- Consumers pinning `zoom` above the old max are unaffected (raising the cap
  only widens what is allowed).
- `snapDate` call sites that omit `pxPerDay` keep the old day/none semantics.
- The Quarter preset stays — purely additive.

## Testing

- Engine (`gantt-engine.test.ts`): `pickBaseUnit` hour tier + boundary; hour
  columns tile the range, align to whole hours, width = `pxPerDay / 24`;
  midnight `major` flag; coarse day level labels; `snapDate` auto-refine
  (with and without the `pxPerDay` arg); presets array + max-zoom constants.
- Components: toolbar renders an "Hour" button (React + Vue); the existing
  "Quarter" presence assertions stay valid.
- Docs: `docs/design_system/ui-kit.md` zoom section updated (presets,
  `GANTT_MAX_ZOOM`, `pickBaseUnit` tiers).
