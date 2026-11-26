# Overflow-gated, disable-able end marker for infinite-scroll controls

**Date:** 2026-11-26
**Status:** Approved
**Components:** `InfiniteScrollPanel` (React + Vue), `TableInfiniteScroll` (React + Vue),
`common/types/InfiniteScroll.ts`

## Problem

The "You have reached the end" marker renders whenever `!hasMore && items.length > 0`,
even when the loaded content fits entirely in the scroll viewport — a short list shows
an end-of-scroll message for a list that never scrolls. There is also no way to switch
the marker off.

## Goals

1. Show the end marker only when the content actually overflows the scroll area
   (i.e., scrolling is needed / there is more than a page).
2. Let consumers disable the end marker entirely.
3. No regressions for loading / error / retry footers, which stay unconditional.
4. Existing tests pass untouched.

## Design

### 1. New primitive: `useScrollOverflow`

- React: `react/src/hooks/useScrollOverflow.ts`
- Vue: `vue/src/composables/useScrollOverflow.ts`

Given a scroller element ref, reports whether its content overflows vertically:

```
overflow = scroller.scrollHeight − excludeRef.offsetHeight > scroller.clientHeight + 1
```

- `excludeRef` — the element the caller wants to ignore in the measurement, which is
  always the gated footer itself, so the marker can never trigger itself into
  visibility (its own `p-6`/text height would otherwise push `scrollHeight` past the
  viewport once shown — the measurement converges either way).
- Re-measures via `ResizeObserver` on the scroller plus its element children,
  re-collected whenever the caller's `deps` change (items, layout, column count,
  hasMore…). Follows the panel's existing ResizeObserver-for-columns pattern.
- **Unmeasurable fallback:** an all-zero box (`clientHeight === 0 && scrollHeight === 0`
  — jsdom, hidden containers) reports `overflow = true`, preserving today's visible
  behaviour wherever real layout cannot be measured. This keeps every existing test
  passing without modification.
- Initial value is `true` (show) so the marker never has to wait a frame to appear in
  overflowing lists; when the content fits, the first measure (a React
  `useLayoutEffect` / Vue post-flush watch) hides it.

### 2. `InfiniteScrollPanel` (React + Vue)

- New prop `showEndMarker?: boolean`, `@default true`. When `false`, the end block —
  built-in marker **and** custom `endComponent` / slot — never renders.
- End block renders only when `!hasMore && items.length > 0 && showEndMarker && overflow`.
- Loading ("Loading more…") and error+retry footers are unaffected.
- Scroller element: the existing viewport ref (React `containerRef` passed to
  `ScrollArea`; Vue `containerRef`).

### 3. `TableInfiniteScroll` (React + Vue)

- `showEndMarker?: boolean` (`@default true`) added to the shared
  `TableInfiniteScrollState` config in `common/types/InfiniteScroll.ts` — one
  definition, both frameworks.
- The scroller element is passed as a component prop (`scrollRef` in React,
  `scrollElement` in Vue), wired from `Table`'s existing `scrollContainerRef` /
  `panelScrollRef` at both mount points; the shared config type stays serializable.
- The end message renders only when `config.showEndMarker !== false` and the scroller
  overflows, minus the footer's own always-present `p-3` box (`excludeRef` = the
  footer root).
- Error / "Loading more…" / "Load more" affordances stay unconditional.

### Rejected alternative

Reusing the IntersectionObserver sentinel ("is the sentinel visible without scrolling?")
as the overflow signal: the sentinel observer is intentionally detached whenever
`hasMore` is false — exactly when we need to know — so it cannot answer the question.

## Testing

- Existing React/Vue tests pass via the unmeasurable fallback.
- New cases per framework: content fits one page → marker hidden (fake
  `clientHeight` > `scrollHeight`); content overflows → marker shown;
  `showEndMarker` off → marker hidden even when overflowing.
- Demo kit-docs prop tables updated (`showEndMarker` rows).
