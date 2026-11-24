# Implementation plan — ActivityFeed `subRowCorner`

Spec: `docs/superpowers/specs/2026-11-24-activityfeed-subrow-corner-design.md`

## Task 1 — React

- `ActivityFeedProps.subRowCorner?: SurfaceCorner` documented
  `@default "rounded-sm"` beside `rowCorner`.
- Feed destructure `subRowCorner = "rounded-sm"`; thread into `FeedRow`
  (new prop) and swap the wrapper's literal `rounded-md` for
  `getSurfaceCornerClass(subRowCorner)` in `subRowClass`'s `classNames`.
- Gate: `npx tsc --noEmit`.

## Task 2 — React tests (2)

Default token via `getSurfaceCornerClass("rounded-sm")`; override with
`"rounded-xl"` → `getSurfaceCornerClass("rounded-xl")` present, default
absent. Exact tokens through the `tokens()` helper.

## Task 3 — Vue

- Prop `subRowCorner?: SurfaceCorner` + `withDefaults` entry
  `subRowCorner: "rounded-sm"`; import `getSurfaceCornerClass`.
- `rowView`'s `subRowClass`: literal `rounded-md` → accessor.
- Gate: `npx vue-tsc --noEmit`.

## Task 4 — Vue tests (2, mirror)

Same two through `classes()`.

## Task 5 — Playground + docs

- `subCorner` state (`"rounded-sm"`), "Sub-row corner" SelectControl with
  `panelCornerOptions` under "Item corner", `subRowCorner={subCorner}` on
  the feed.
- API paragraph: `subRowCorner` beside the row surface sentence.

## Task 6 — Gate + commits

react tsc+eslint+suite, vue-tsc+suite, demo tsc (10-error baseline).
Commits by explicit pathspec: docs; react; vue; demo.
