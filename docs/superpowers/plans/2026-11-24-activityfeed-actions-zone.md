# Implementation plan — ActivityFeed actions zone

Spec: `docs/superpowers/specs/2026-11-24-activityfeed-actions-zone-design.md`

## Task 1 — React component

- `ActivityFeedItem.actions?: ReactNode` + `ActivityFeedSubItem.actions?: ReactNode`
  (documented: right side, before the caret, clicks never activate the row).
- Module-level `ACTIONS_WRAPPER = "flex shrink-0 items-start gap-1"` and a
  `zoneSwallow` pair (`onClick`/`onKeyDown` → `stopPropagation`).
- `FeedRow` header: `{item.actions != null && <div …>{item.actions}</div>}`
  between the entry and `chevron`.
- Sub-row map: same zone after the entry inside the sub wrapper.
- Gate: `npx tsc --noEmit` + existing ActivityFeed suite green.

## Task 2 — React tests (5)

Zone order (header before chevron; sub after `<time>`), row-toggle immunity
(click + Enter keep the grid `0fr`), row `onClick` not fired by action
clicks, zone with custom body (row + sub), no-zone row draws no wrapper.

## Task 3 — Vue component

- Types: `actions?: VNodeChild` on both interfaces.
- View objects: `hasActions`/`actions` on `ActivityFeedRowView` and
  `ActivityFeedSubRowView`; `rowView` settles them.
- `ActivityFeedRow.vue`: header wrapper `@click.stop @keydown.stop` +
  `VNodeRenderer` between entry and chevron; same in the sub wrapper after
  the entry.
- Gate: `npx vue-tsc --noEmit` + existing Vue suite green.

## Task 4 — Vue tests (5, mirror)

Same five via `classes()`/`emitted()`; immunity asserts no `toggle` emit and
the row `onClick` spy untouched.

## Task 5 — Playground + docs

- `ActivityFeedPlayground.tsx`: import `Menu`, `IconButton`, `type MenuItem`;
  deploy row (row-toggle) gets a dots menu (View details / Copy id / sep /
  Archive danger); the "rolled 4 pods" sub gets View logs / Restart.
- `ActivityFeedPage.tsx`: `actions?` in both prop literals + one sentence.

## Task 6 — Gate + commits

react tsc + suite + eslint, vue-tsc + suite, demo tsc (10-error baseline).
Commits by explicit pathspec: spec/plan; react (component, test); vue
(component, internal row, test); demo (playground, page).
