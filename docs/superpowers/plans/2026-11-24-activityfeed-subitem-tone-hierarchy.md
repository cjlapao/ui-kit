# Implementation plan — ActivityFeed sub-item tone hierarchy + toned hover

Spec: `docs/superpowers/specs/2026-11-24-activityfeed-subitem-tone-hierarchy-design.md`

## Task 1 — Theme

- `common/theme/Theme.ts`: `TRUE_COLOR_SUB_DOT_CLASSES` +
  `getTrueColorSubDotClass` (literal map, 21 colours, `bg-{c}-600
  dark:bg-{c}-300`); `SubItemHoverClasses` type + `getSubItemHoverClasses(tone)`
  (templates: `hover:bg-{t}-100`, `dark:hover:bg-{t}-500/20`,
  `group-hover:bg-{t}-500`, `dark:group-hover:bg-{t}-400`).
- `scripts/generate-safelist.mjs`: add only the missing `@source inline` shapes.
- `react/src/theme/themeSafelist.test.ts`: register the getter in the walk.
- Gate: react build (css) + `TMPDIR=$PWD/.tmp npx vitest run src/theme/themeSafelist.test.ts`.

## Task 2 — React component

- `ActivityFeedSubItem.hoverTone?: TrueColor` (documented).
- `FeedRow` sub-row map: wrapper class = `flex items-start gap-3 group
  rounded-md px-1.5 py-0.5 -mx-1.5 -my-0.5 transition-colors duration-200
  motion-reduce:transition-none` + `getSubItemHoverClasses(hoverTone).wash`;
  dot = `getTrueColorSubDotClass(resolvedSubTone)` +
  `transition-colors duration-200 motion-reduce:transition-none` +
  `hover.dot` — all passed through the existing `entryContent` dotClass string
  (no signature change; main rows byte-identical).
- `hoverTone = sub.hoverTone ?? sub.tone ?? item.tone ?? dotFloor`.
- Gate: `npx tsc --noEmit` + existing ActivityFeed suite green.

## Task 3 — React tests

- New tests in the `sub-items disclosure` describe: shifted step both themes
  (inherited + explicit), wash + group-hover dot classes (explicit hue),
  default-inherit hue, custom-body wash-without-dot.

## Task 4 — Vue component

- `ActivityFeedSubItem.hoverTone?: TrueColor`; `ActivityFeedSubRowView` gains
  settled `subRowClass`; `rowView` composes wrapper + dot classes with the
  shared getters; `ActivityFeedRow.vue` sub wrapper takes `:class="sub.subRowClass"`.
- Gate: `npx vue-tsc --noEmit` + existing Vue suite green.

## Task 5 — Vue tests

- Mirror Task 3 through the wrapper classes/`classes()` assertions.

## Task 6 — Demo docs

- `SubItems.tsx`: `hoverTone` on one template sub + the custom sub.
- Playground: `hoverTone` on the cache-warm-up sub.
- `ActivityFeedPage.tsx`: API paragraph — `hoverTone` in the sub fields +
  one sentence on the automatic step and default hover; ExampleCard copy.

## Task 7 — Gate + commits

- i18n untouched. Run: react tsc + ActivityFeed suite + themeSafelist (after
  css build), vue-tsc + Vue suite, demo tsc.
- Commits by explicit pathspec only: theme (Theme.ts, generate-safelist.mjs,
  themeSafelist.test.ts), react (component, test), vue (SFCs, test), demo
  (3 files). Never touch the pre-existing dirty icon files or Learnings.md.
