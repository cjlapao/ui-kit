# Gantt — header action buttons (`headerActions` / `headerActionsAlign`)

Date: 2026-11-19 · Depends on: chart header strip (icon | title | actions | zoom selector)

## Problem

Consumers want ad-hoc controls (e.g. a "By epic / By priority" segment pair)
**inside** the chart header — between the live pill and the zoom span selector.
The header already has an `actions` region (the status pill), but it is a
single right-aligned slot and there is no second region with an alignment
choice, so today those buttons live outside the card and drift from the zoom
controls.

## Decisions

- **New props, `actions` untouched** — `headerActions?: ReactNode` (Vue:
  `VNodeChild`) accepts any React/HTML controls; `headerActionsAlign?:
  "start" | "end"`, default `"end"`.
- **`"end"` (default)**: the group sits in the right zone, after the `actions`
  pill and immediately before the zoom selector — right-aligned against the
  span selector. Empty header → the selector keeps its right edge and the
  group rides beside it.
- **`"start"`**: the group rides the left zone — after the title block when
  present, flush left when there is no icon/title.
- **Layout: two zones.** The strip becomes
  `[left flex-1: icon · title · start-group]` +
  `actions · end-group · zoom(ml-auto)` as siblings. Today the title block
  itself carries the `flex-1` spacer, which would pin a start-aligned group to
  the right zone when a title exists; moving the spacer to a left-zone wrapper
  gives a true left edge and leaves every existing visual unchanged (pill and
  toolbar keep their spacing/`gap` values; the toolbar keeps `ml-auto`).
- **`data-gantt-header-region="start" | "end"`** on the group wrapper —
  documents which zone rendered and keeps ordering assertions honest.
- Vue mirrors the prop + `VNodeRenderer`/`hasNode` pattern exactly like
  `actions`; no new i18n strings, no new tokens.

## Testing

Both kits: default `"end"` → DOM order pill → group → zoom selector, group
wrapper carries `data-gantt-header-region="end"`; `"start"` → wrapper carries
`"start"`, group precedes the toolbar and is flush left with no title/icon;
no `headerActions` → header renders exactly as before.

## Out of scope

Slot API beyond the VNode prop (Vue), separate gap/spacing props, per-button
placement rules, demo-app wiring (consumer side).
