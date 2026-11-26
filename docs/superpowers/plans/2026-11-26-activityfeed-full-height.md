# ActivityFeed fullHeight — implementation plan

**Spec:** [`docs/superpowers/specs/2026-11-26-activityfeed-full-height-design.md`](../specs/2026-11-26-activityfeed-full-height-design.md)

Rule of the whole change: **`fullHeight` only ever adds classes, and only while
it is on.** A feed that never asks for it renders the tree it renders today, byte
for byte — the same no-op-when-unset discipline every sizing prop in this kit
obeys. The stretch rides `Panel`'s existing `flexBody`; the feed re-implements no
flex maths.

**Ground rules:**

- Never break: `maxHeight`'s capped `ScrollArea`, the Loader pin outside the
  scroller (the Table's rule), the Load-more tail outside the scroller, the
  skeleton/empty state sharing one body value, scroll-mode paging, and the
  disclosure. With `fullHeight` unset, output is byte-identical to today.
- `maxHeight` wins the body: `const fill = fullHeight && maxHeight === undefined`.
- React only. `vue/src/components/ActivityFeed.vue` is not touched; the lag is
  recorded in `Learnings.md` with §5 of the spec as the portable contract.
- Only commit files this plan touches, by explicit pathspec — the working tree
  has unrelated uncommitted icon / MultiToggle work.
- Baseline before starting: `TMPDIR=$PWD/.tmp npx vitest run
  src/components/ActivityFeed.test.tsx --coverage.enabled=false` → record here.

---

## Task 1 — Component (`react/src/components/ActivityFeed.tsx`)

- [x] `ActivityFeedProps.fullHeight?: boolean` with the spec's docstring, placed
      beside `maxHeight`; destructure `fullHeight = false`.
- [x] `const fill = fullHeight && maxHeight === undefined;` beside `infinite`.
- [x] `infinite`: `maxHeight !== undefined` → `(maxHeight !== undefined || fill)`.
- [x] Root `Panel`: `className={classNames("w-full", fullHeight && "h-full min-h-0", className)}`,
      `flexBody={fullHeight || undefined}`, `scrollable={fullHeight ? false : undefined}`.
- [x] Card column: `classNames("flex flex-col gap-4", fullHeight && "flex-1 min-h-0")`.
- [x] Body wrapper: `classNames("relative", fullHeight && "flex-1 min-h-0")` —
      the Loader stays a sibling of the scroller.
- [x] Body render gains the `fill` branch: `<ScrollArea horizontal={false}
      viewportRef={viewportRef} className="h-full min-h-0">{body}{scrollTail}</ScrollArea>`,
      ordered `maxHeight` → `fill` → `body`.
- [x] Gate: the existing suite stays green with no test edited.

## Task 2 — Tests (`react/src/components/ActivityFeed.test.tsx`)

- [x] New `describe("full height")` with the spec's seven cases (§5): stretch,
      identical default, fill frame on `h-full min-h-0` with no inline `maxHeight`,
      fill-mode paging via the observer, `maxHeight` winning the frame, the
      overlay pinned outside the scroller, the tail outside the scroller.

## Task 3 — Docs and demo

- [x] `ActivityFeedPage.tsx` — PageHeader description + API prose: `fullHeight`
      beside `maxHeight`, what stays pinned, that `maxHeight` still wins.
- [x] `ActivityFeedPlayground.tsx` — `const [fillParent, setFillParent] =
      useState(false)`; a *Fill parent* `ToggleRow`/`ControlRow` beside *Scroll
      body*; host `div` gains `style={fillParent ? { height: 480 } : undefined}`;
      `maxHeight={scroll && !fillParent ? 280 : undefined}`; `fullHeight={fillParent}`;
      footer paragraph gains the sentence.
- [x] `Learnings.md` — the React-only lag row, in the 2026-11-26 hue row's shape.

## Task 4 — Verification

- [x] Targeted suite, then the full `react` suite at its known baseline.
- [x] `themeSafelist.test.ts` green, file unmodified.
- [x] `eslint` on touched files; `react/demo` `tsc` at its pre-existing count.
- [x] Browser read of the playground at this GUI's URL, both toggles, both schemes.

**Recorded (2026-11-26, this session).** Baseline before the change: `ActivityFeed.test.tsx`
`pass 79/79`. After: `pass 86/86` — seven new under `full height`. Full `react` suite:
`6227 passed`, `3 failed`, all three in `src/theme/alertRim.test.ts` and none from here —
that committed test still probes an alert rim of `border-transparent`, which the
concurrent alert/toast work has moved under in the uncommitted `common/theme/Theme.ts`;
nothing in this plan touches a theme file. `themeSafelist.test.ts` green, file
unmodified. `eslint`: 0 errors on the touched files (test files are ignored by the
repo's eslint config). `npx tsc --noEmit` on `react/src`: 0 errors. Browser read:
Chromium over `vite build` + `vite preview` — a build, not the dev server, because the
tree is being edited by another session and an HMR reload mid-read wipes the toggle
state; the numbers are in the spec's *Verification* table.

## Task 5 — The API section, after the first reader (same day)

- [x] Count the house before imitating the neighbour: 76 of 144 pages document
  props with `PropsTable`; `ActivityFeedPage` was one of 5 still printing one
  ~893-word paragraph, which is where `fullHeight` had landed — word 880.
- [x] Three `PropsTable`s in the playground's control order (card 19 rows, item
  12, sub-item 5), every rule from the paragraph kept in a row, nothing invented
  to fill a cell.
- [x] `PropsTable`'s `default` column now decodes entities like `description`
  does — the shared renderer decoding only some of its own string columns is the
  bug, not my row.
- [x] Re-read in the browser: three tables, 36 rows, defaults reading `the card's
  tone` rather than `the card&rsquo;s tone`, and the *Fill parent* toggle present
  on a cold load — which is the answer to "I do not see the option": the source,
  the dev server and a fresh context all agree it renders, so a tab that does not
  show it predates the change.
