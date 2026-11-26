# Spec: ActivityFeed — fullHeight, the feed that fills its parent

Date: 2026-11-26
Status: implemented and verified — 86 named tests in `ActivityFeed.test.tsx` (79 before,
7 new under `full height`), the full `react` suite green but for three pre-existing
`src/theme/alertRim.test.ts` failures belonging to the concurrent alert/toast rim work in
`common/theme/Theme.ts`, and a browser read of the playground (numbers in
*Verification*). Caller approvals: "Fill parent, rows scroll inside", "React only, Vue
recorded as lag", "maxHeight wins", "ok lets implement it".
Components: React `ActivityFeed`. Vue knowingly lags — see *Out of scope*.

## Goal

Let an `ActivityFeed` sit in a flex/grid cell that already has a height — the
right-hand column of a two-pane workspace, a tab's stretched body, a dashboard row
beside a `Table fullHeight` — and fill it: header, tag, filters and the Load-more
tail keep their size at the card's edges, and the rows take the rest and scroll
inside the card.

One prop, the same word the kit already uses for it: `fullHeight`.

## Problem

`ActivityFeed` today knows one height story: `maxHeight` caps the body in a
`ScrollArea` (`ActivityFeed.tsx:1074-1087`), and without it the feed grows to
whatever its rows demand. A caller who puts the feed in a bounded parent gets
neither answer:

- The root is a `Panel`, and `Panel`'s root is `relative flex w-full min-h-0
  flex-col overflow-hidden shrink-0` (`Panel.tsx:1276`). A parent that *does*
  constrain the height clips the overflowing rows — with no scrollbar, because
  nothing in the chain was ever told to scroll.
- The scroll machinery refuses to engage without a cap:
  `const infinite = loadMode === "scroll" && maxHeight !== undefined && !!onLoadMore`
  (`ActivityFeed.tsx:855`). A feed filling a parent has a real scroller — it just
  isn't a `maxHeight` one, so paging silently degrades to the button.
- The other components that fill a parent already agreed on a contract, and this
  one is not in it: `Table` (`flexBody` + `h-full w-full min-h-0` + a
  `ScrollArea` on `h-full min-h-0`, `Table.tsx:1663,1953-1962,2469`),
  `MemoryLibrary` (`const fill = fullHeight && maxHeight === undefined`,
  `MemoryLibrary.tsx:55`), `AccessMatrix`, `EmptyState`, `Gantt`.

So the same layout that works around a `Table` cannot be built around a feed.

## Decisions (from the design session)

| Question | Decision |
|---|---|
| What `fullHeight` does to the body | **Fill the parent and let the rows scroll inside it** — the Table's contract. Rejected: `h-full` alone, which `Panel`'s `overflow-hidden` root turns into a silent clip; and measuring the parent into an internal `maxHeight`, which needs a ResizeObserver, mis-renders on resize, and duplicates the cap the caller can already pass |
| `maxHeight` + `fullHeight` together | **`maxHeight` wins the body** — `MemoryLibrary`'s exact rule (`fill = fullHeight && maxHeight === undefined`). The card still stretches; the scroller inside it stays capped |
| Infinite scroll under fill | **Fill counts as a scroller** — `infinite` gains `|| fill`, so scroll-mode paging works without a `maxHeight` |
| Loader overlay | Stays **outside** the scroller, pinned to the `relative` wrapper — the Table's rule, already the feed's shape for `maxHeight` |
| Where the flex lives | `Panel`'s own `flexBody`, never re-implemented in the feed. `scrollable` goes `false` only under `fullHeight`, so an unasked-for feed renders byte-identical |
| Naming | `fullHeight`, like every other sizing prop in the kit (`Table`, `AccessMatrix`, `EmptyState`, `SideMenu`, `Picker`, `Input`, `Gantt`, `NetworkGraph`, the knowledge family) |
| Vue | **React now, Vue recorded as lag** — the pattern the 2026-11-26 hue spec set. `vue/src/components/Panel.vue` already has `flexBody` (`:68,270,607,617`), so the port is small; the portable contract is the React test list in §5 |

## Design

### 1. API — `react/src/components/ActivityFeed.tsx`

One prop on `ActivityFeedProps`, beside `maxHeight`:

```ts
/**
 * Fills the height of a parent that has one — the Table's `fullHeight`
 * contract. The header, tag, filters and Load-more keep their size and the
 * rows take the rest, scrolling inside the card; with no `maxHeight` the
 * body region becomes the scroller, which also gives scroll-mode paging a
 * viewport to watch. An explicit `maxHeight` still wins the body — the card
 * stretches, the cap inside it holds. Without a defined-height parent the
 * card stays content-sized, exactly as it is today.
 * @default false
 */
fullHeight?: boolean;
```

`Panel` is not re-taught anything: `flexBody` already turns the body section into
`flex-1 flex flex-col w-full min-h-0` (`Panel.tsx:1143,1156`), and that is the
only reason the feed's own column has something to stretch against.

### 2. The chain of stretches

Five guarded edits, each adding classes only while `fullHeight` is on — a feed
that never asks for it renders the tree it renders today, byte for byte:

| where | today | with `fullHeight` |
|---|---|---|
| `const fill` | — | `fullHeight && maxHeight === undefined` |
| `infinite` | `… && maxHeight !== undefined && …` | `… && (maxHeight !== undefined \|\| fill) && …` |
| root `Panel` | `className={classNames("w-full", className)}` | `+ "h-full min-h-0"`, `flexBody={fullHeight \|\| undefined}`, `scrollable={fullHeight ? false : undefined}` |
| card column | `flex flex-col gap-4` | `+ flex-1 min-h-0` |
| body wrapper | `relative` (the Loader's pin) | `+ flex-1 min-h-0` |
| body render | `maxHeight` → capped `ScrollArea`; else `body` | `maxHeight` → capped `ScrollArea` (wins); `fill` → `ScrollArea` on `h-full min-h-0` carrying `viewportRef`; else `body` |

Three things this deliberately does **not** touch:

- **The Loader pin.** Spinner/progress stay a sibling of the scroller inside the
  `relative` wrapper, never inside the scrolling element — an `absolute inset-0`
  overlay in a scroller scrolls away with the rows (the Table's rule, and the
  comment at `ActivityFeed.tsx:1058-1061`).
- **The Load-more tail.** It is a sibling of the body wrapper in the card's
  column, so `flex-1` on the body pushes it to the card's bottom instead of
  letting it drift after the rows.
- **The skeleton and the empty state.** Both ride the same `body` value into the
  same scroller, so switching states under `fullHeight` never resizes the card.

`viewportRef` is handed to the fill `ScrollArea` as it already is to the capped
one, which is what keeps `useInfiniteScroll`'s sentinel observed against the
element that actually scrolls.

`scrollable` deserves its half-sentence: `Panel`'s body section carries
`overflow-auto` by default (`Panel.tsx:1158`, `scrollable = true` at `:706`).
Under `fullHeight` that would make a second scroller competing with the feed's
own, so the prop goes `false` there. `undefined` is passed otherwise, so Panel's
default — and every existing feed — is untouched.

### 3. Why `maxHeight` wins instead of becoming a floor

`Gantt` turns `height` into a `minHeight` under `fullHeight` because there the
prop *is* the canvas height and dropping it would collapse the chart. Here
`maxHeight` is a cap the caller chose deliberately, and the kit already answered
this question one component over: `MemoryLibrary.tsx:53-56` — *"A maxHeight cap
wins: it brings its own ScrollArea. Without one, fullHeight turns the results box
into the scroller."* One question, one answer, in both places. A caller who wants
the fill with a floor writes `min-h-*` on the parent, which is what a parent is
for.

### 4. Nothing new enters the build

Every class this adds — `h-full`, `min-h-0`, `flex-1`, `flex-col`,
`overflow-hidden` — is a plain utility the kit already ships and that
`Table`'s `fullHeight` puts on the same elements. No tone-indexed class shape,
no gradient, no alpha rung, so `scripts/generate-safelist.mjs` gains nothing and
`themeSafelist.test.ts` stays green unmodified.

### 5. Tests — `react/src/components/ActivityFeed.test.tsx`

New `describe("full height")`, on the file's existing conventions (`items`, the
IntersectionObserver stub and its `observers` array, `[data-slot="scrollarea"]`
readers):

1. **stretches the card** — `fullHeight` puts `h-full` on the root `section` and
   `flex-1` + `min-h-0` on the Panel's body section.
2. **the identical default** — without the prop, no `h-full` anywhere and no
   `data-slot="scrollarea"`: the negative control that proves nothing moved.
3. **fill mode is the scroller** — `fullHeight` with no `maxHeight` renders a
   `ScrollArea` whose frame carries `h-full` and `min-h-0` and has **no** inline
   `maxHeight`, with the rows inside its viewport.
4. **fill mode pages** — `fullHeight` + `hasMore` + `onLoadMore`, default
   `loadMode="scroll"`: no Load-more button, a live observer, and triggering the
   sentinel calls `onLoadMore` — the mirror of the existing "degrades to the
   button when scroll mode has no capped body".
5. **`maxHeight` wins the body** — `fullHeight` + `maxHeight={240}` lands
   `240px` on the frame (the existing cap assertion, unchanged) and the frame is
   not the fill frame.
6. **the overlay stays pinned** — `fullHeight` + `loading` +
   `loaderType="spinner"`: the `role="status"` Loader is *not* inside the
   `ScrollArea`, and the rows/skeleton are.
7. **the tail stays outside** — `fullHeight` + `hasMore` +
   `loadMode="button"`: the Load-more button is not inside the scroller.

### 6. Docs and demo

- `ActivityFeedPage.tsx` — the PageHeader description and the API prose gain
  `fullHeight` beside `maxHeight`, with the two sentences that matter: what stays
  pinned, and that `maxHeight` still wins the body.
  **Follow-up the same day, after the first read:** that prose was a single
  ~893-word paragraph — this page was one of only five of 144 that still printed
  the API as a wall instead of the house `PropsTable` (76 pages use it) — so
  `fullHeight` landed somewhere around word 880, and a reader coming from the
  playground's *Fill parent* toggle found no row to look at. The API section is
  now three `PropsTable`s in the playground's own order: **ActivityFeed** (19
  rows, `maxHeight` and `fullHeight` sitting directly after the paging props),
  **ActivityFeedItem** (12) and **ActivityFeedSubItem** (5). Every rule the
  paragraph carried survives in a row — the count grammar, the filter match
  order, the click isolation of `actions`, the attention/selection hue ladder,
  the never-nest-and-never-filter sub-rows, the Vue event names — and nothing
  new was invented to fill a cell.
- `A11ySections.tsx` — `PropsTable` ran `decodeDocEntities` on `description`
  only, so a `default` of `"the card&rsquo;s tone"` printed its nine characters
  literally while its neighbour decoded the same text. Both string columns now
  go through the decoder; `type` stays verbatim, because a type expression is
  code and `&lt;` there means the three characters.
- `ActivityFeedPlayground.tsx` — a **Fill parent** toggle beside *Scroll body*,
  the preview host gaining `style={fullHeight ? { height: 480 } : undefined}` and
  `maxHeight={scroll && !fullHeight ? 280 : undefined}` — the toggle has to
  release the cap, or §3's precedence would hide the very thing being shown.
  Footer paragraph gains the same sentence.
- `Learnings.md` — the React-only lag, in the shape the 2026-11-26 hue row set:
  what is React-only, that the shared theme and `Panel` needed no change
  (`flexBody` already existed), and that the portable contract for the Vue pass is
  this spec's §5, which it must leave untouched.

## Out of scope

- **Vue.** `vue/src/components/ActivityFeed.vue` has no `maxHeight` at all, so
  there is no cap for `fullHeight` to disagree with; the port needs only the
  stretch chain — `h-full min-h-0` on the root Panel, `:flex-body="fullHeight"`,
  `flex-1 min-h-0` on the card column and the `relative` body wrapper, and an
  `overflow-y-auto` region inside it (Vue's Table runs that shape at
  `Table.vue:1461-1477` rather than a `ScrollArea`). Recorded, not half-fixed.
- `fullWidth` — the feed is already `w-full` on the root.
- A `minHeight` floor under `fullHeight` (`Gantt`'s answer; see §3), and a
  `height` prop the feed has never had.
- Row virtualization — `maxHeight` never promised it and neither does this.

## Verification

1. `TMPDIR=$PWD/.tmp npx vitest run src/components/ActivityFeed.test.tsx --coverage.enabled=false`,
   then the full `react` suite against its known baseline.
2. `themeSafelist.test.ts` green with the file unmodified.
3. `eslint` clean on the touched files; `react/demo` `tsc` at its pre-existing
   error count. Prettier printWidth is 100 — never run `prettier --write` over
   these files.
4. Playground read in the browser at this GUI's URL (Chromium over the built site, so no
   HMR under the read). The host is the 480px box §6 gives it:

   | state | card | scroller | verdict |
   |---|---|---|---|
   | cap on, fill off (today) | 794px, content-sized | viewport 280px of 576, `max-height: 280px` | untouched |
   | cap off, fill off | 794px, content-sized | no `ScrollArea` at all | the byte-identical default |
   | cap off, **fill on** | **480px — the host exactly** | frame `h-full min-h-0`, `max-height: none`, viewport 262px of 576, `flex-grow: 1` on the region | fills, and scrolls inside |
   | cap on, fill on | 480px | the cap's own frame | see the note below |
   | fill on, 3 pages loaded | 480px unchanged | viewport 262px of 846 | the card never resizes as rows arrive |
   | fill on, spinner loading | 480px unchanged | 20 rows still inside; `role=status` a **sibling** of the frame | overlay pinned, not scrolled away |

   Header sat 42px from the card's top and the Load-more 33px off its bottom in every
   filled state — pinned, not drifting after the rows. Scroll mode needed no button: the
   row count climbed 11 → 14 untouched and 23 after a scroll to the bottom, which is the
   `|| fill` half of §2 earning its keep — the same layout on the old condition would
   have shown a button instead.

   The one thing the playground cannot show is §3's precedence, because §6 has it
   release the cap on purpose (a cap that won the body would hide the fill the toggle is
   there to demo). That case is the unit tests' — `fullHeight` + `maxHeight={240}` lands
   `240px` on the frame while the card still carries `h-full`.
