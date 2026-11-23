# StatTile drilldown — paged infinite-scroll dropdown on the stat tiles

Date: 2026-11-22
Components: `react/src/hooks/usePagedFetcher.ts` (new), `react/src/components/StatTileDrilldownPanel.tsx` (new),
`react/src/components/StatCard.tsx` (surgical `drilldown` prop), `react/src/components/Popover.tsx` (additive
`bareTrigger` prop) — React only (Vue parity is a separate future port, decided with the user).

## Problem

The dashboard's metric tiles ("Needs you 3", "Running now", …) each summarise a list the user then
has to go find elsewhere. The tile should open its own list: a dropdown anchored to the tile, at the
largest size the viewport allows, whose items stream in page by page from the app's API — the
`Needs you` rows are the canonical shape: icon, title, and a count.

Today the tile has no way to say "I have a list behind me". Apps would have to hand-wire
`Popover` + `InfiniteScrollPanel` + page state per tile.

## Requested behavior (from the user)

- A dropdown on the stat tiles using the **max size** available.
- **Infinite scroll** inside it, **paginated through the API** the app provides.
- Rows carry the **alert items' title and count**.
- **Solid background**, nice animations, professional look.
- Whole-tile click opens it (user's explicit choice over a dedicated trigger button).
- Examples in the playground.

## Decisions taken in review

- **`drilldown` prop on `StatCard`** over a wrapper component or a build-it-yourself kit — one
  concept, prop-driven like the rest of the family; `StatTile` (a rename layer over `StatCard`)
  inherits it for free. Rejected: `StatTileDrilldown` wrapper (proxies every card prop, drifts);
  raw building blocks (every app re-wires trigger + a11y).
- **Async fetcher, component paginates** over fully-controlled `items/hasMore/onLoadMore` pass-through
  — the app supplies `fetchItems({page, pageSize, signal}) => {items, hasMore, total?}`; page state,
  lazy first-load, skeleton, load-more and retry live in the kit. Rejected: controlled pass-through
  (app-side boilerplate for the exact behavior every tile wants).
- **Built-in alert row + optional `renderItem` override** — default row is icon chip + title +
  subtitle + right count pill; custom rows stay possible without restating the chrome.
- **Whole-tile click; drilldown wins** — when `drilldown` is set the tile click toggles the dropdown
  and `onClick` is not fired (one click, one action; navigation belongs in `onItemClick`/`footer`).
- **Reuse `Popover` (controlled) + `InfiniteScrollPanel`** — solid `elevated` surface, the kit's
  enter/leave overlay animation, viewport-clamped placement, IntersectionObserver sentinel,
  error/retry footer, end marker all come from primitives already hardened.

## Design

### `usePagedFetcher` — `react/src/hooks/usePagedFetcher.ts`

```ts
usePagedFetcher<T>({ fetchItems, pageSize = 20, reloadKey?, enabled? })
  → { items, total, hasMore, isLoading, isLoadingMore, error, loadMore, reload }
```

- `enabled` (the tile's open state) gates the first page: **no fetch before first open**; the first
  true opens page 0.
- `loadMore()` appends the next page; a generation ref + `AbortController` per request discard
  stale responses; `reload()` bumps the generation, clears items and refetches page 0 (wired to
  `reloadKey` changes while enabled, and to the retry button after an error).
- `isLoading` = first page in flight; `error` = first-page failure only — load-more failures are
  reported through `onLoadMore` rejection so `useInfiniteScroll`'s retry footer owns them.

### `StatTileDrilldownPanel` — `react/src/components/StatTileDrilldownPanel.tsx`

Fixed header (title, defaults to the card's label + `total` count pill) → `InfiniteScrollPanel`
(`layout="list"`, `variant="plain"`, explicit `height`) → optional fixed footer. First load paints
skeleton rows shaped like real rows; then rows stagger in (`translateY` + opacity, ≤ 12-step
`animation-delay`, reduced-motion neutralised). `renderItem` overrides the built-in row. Clicking a
row calls `onItemClick`. Props carry `minWidth` (320), `maxWidth` (520) and `maxHeight` (420)
defaults; the overlay itself stays viewport-clamped by `Popover`.

### `StatCard` wiring — `react/src/components/StatCard.tsx`

New prop `drilldown?: StatCardDrilldown`. When set: the card renders inside
`<Popover trigger={card} bareTrigger visible onOpenChange …>`; the card gets `cursor-pointer`,
`role="button"`, `tabIndex=0` and Enter/Space activation exactly like the `onClick` path;
`Popover` clones the trigger with `aria-haspopup="dialog"`/`aria-expanded`/`aria-controls`. The card's
own `onClick` is withheld from `Panel` so Popover's toggle is the only action.

### `Popover` — additive `bareTrigger?: boolean`

The trigger wrapper span renders `display: contents` when set, so a drilldown tile stays a true child
of the consumer's grid/flex layout (the wrapper would otherwise become the grid item and shrink the
card). Default off — every existing `Popover` consumer is untouched. Anchoring is unaffected: the
placement maths reads `anchorRef` (the card element, via `Panel`'s `forwardRef`), not the wrapper.

## Data flow

open → `enabled=true` → page 0 (skeleton) → rows animate in → sentinel near bottom → page n+1
(spinner footer) → `hasMore=false` → end marker. First-page failure → in-panel error + retry →
`reload()`. `reloadKey` change while open → abort + refetch.

## Testing

- `usePagedFetcher`: no fetch before enabled; single first page (no double-fire); append; `hasMore`
  stop; abort of stale requests; `reloadKey` refetch; first-page error + `reload`.
- `StatCard` + drilldown: closed tile fetches nothing; click/Enter opens `role=dialog`;
  `onClick` never fires while `drilldown` is set; rows render title + count; `onItemClick`;
  footer renders; Escape closes; skeleton during first load; error + retry refetches.

## Out of scope

Vue port (follow-up), search/filter UI inside the panel, sticky grouping headers, keyboard roving
focus across rows (rows are tabbable buttons already).
