# Implementation plan — Panel raisedSurface (forced depth step)

Spec: `docs/superpowers/specs/2026-11-24-panel-raised-surface-design.md`

## Task 1 — Shared ladder helper

- `common/theme/nestedPanel.ts`: `nestedPanelSurface(parent, variant, tone, eligible, force = false)`.
- Auto ladder unchanged; then `depth = force && TINTED_VARIANTS.includes(variant) ? Math.max(autoDepth, 1) : autoDepth`.
- JSDoc: the force is the caller's explicit floor — bypasses parent matching,
  `nestedSurface={false}` and `backgroundColor`, still capped by the ladder and
  only inside the tinted set.
- Gate: typecheck both kits (only the two Panels call the helper; ActivityFeed
  takes the wash table, not the function, and is untouched).

## Task 2 — React component

- `PanelProps.raisedSurface?: boolean` + JSDoc (forced depth step, neutral-page
  invisibility, no-op outside the tinted set, floors never lowers).
- Destructure `raisedSurface = false`; pass as the fifth arg to
  `nestedPanelSurface(parentPanel, variant, resolvedTone, nestedSurface && !backgroundColor, raisedSurface)`.
- Gate: `npx tsc --noEmit` + existing Panel suites green.

## Task 3 — React tests (5, in Panel.nesting.test.tsx)

Forced step-1 wash on each tinted variant with no parent; survives
`backgroundColor` + `nestedSurface={false}`; no wash on `elevated`; floor
semantics (forced inside a matching parent keeps `[0.08]`); matching child of a
raised parent steps to `[0.08]`.

## Task 4 — Vue component

- `PanelProps.raisedSurface?: boolean` + same JSDoc; `withDefaults` gains
  `raisedSurface: false`; `nestedPanel` computed passes `props.raisedSurface`.
- Gate: `npx vue-tsc --noEmit` + existing Vue Panel suites green.

## Task 5 — Vue tests (5, mirror in Panel.nesting.test.ts)

Same five via `mount` + `:scope > [data-nested-panel-wash]` selectors.

## Task 6 — Playground + docs page

- `PanelPlayground.tsx`: `raisedSurface` state + `ToggleRow` ("try it on a
  `tonal`/`simple` card over the neutral page"), prop wired to the preview Panel.
- `PanelPage.tsx`: one sentence on the forced depth step.

## Task 7 — Gate + commits

react tsc + Panel suites, vue-tsc + Vue suites, demo tsc baseline.
Commits by explicit pathspec: docs (spec, plan); common+react (helper,
component, tests); vue (component, tests); demo (playground, page).
