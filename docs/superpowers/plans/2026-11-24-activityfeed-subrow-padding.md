# Implementation plan — ActivityFeed `subRowPadding` (+ corner default)

Spec: `docs/superpowers/specs/2026-11-24-activityfeed-subrow-padding-design.md`

## Task 1 — Shared map

`common/theme/nestedPanel.ts`: `SUB_ROW_PADDING: Record<SurfacePadding, {
row: string; column: string }>` with the spec's table; import the
`SurfacePadding` type from `./Theme`. Static literals for the scanner.

## Task 2 — React

- Props: `subRowPadding?: SurfacePadding` (`@default "xs"`); amend
  `subRowCorner`'s doc/default to `"rounded"`.
- `FeedRow` takes `subRowPadding`; `subRowClass` swaps the welded
  `-mx-1.5 -my-0.5 px-1.5 py-0.5` for the map's `row`; column div takes
  the map's `column` beside `flex flex-col pl-5`.
- Gate: `npx tsc --noEmit`.

## Task 3 — React tests

2 new (default xs via map, `"md"` override swaps row+column tokens);
corner-default + hover-wash assertions to `getSurfaceCornerClass("rounded")`.

## Task 4 — Vue

Prop + `withDefaults` (`subRowPadding: "xs"`, `subRowCorner: "rounded"`);
`rowView`: map's `row` in `subRowClass`, new `subColumnClass` from the
map's `column` (+ view type field); template binds it on the column div.
Gate: `npx vue-tsc --noEmit`.

## Task 5 — Vue tests (mirror)

Same two through `classes()`; corner assertions to `("rounded")`.

## Task 6 — Playground + docs

`subPadding` state `"xs"` + SelectControl (`panelPaddingOptions`) under
"Sub-row corner"; `subCorner` state default → `"rounded"`; feed gets
`subRowPadding={subPadding}`. Docs clause for both defaults.

## Task 7 — Gate + commits

react tsc+eslint+suite (+dist rebuild if the safelist test demands the new
classes), vue-tsc+suite, demo tsc. Commits: docs; common+react; vue; demo.
