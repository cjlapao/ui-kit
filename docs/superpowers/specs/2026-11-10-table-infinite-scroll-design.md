# Table infinite scrolling

## Approved direction

Add optional infinite scrolling to React and Vue Table. Preserve existing pagination behavior when infinite scrolling is absent. Reuse InfiniteScrollPanel fetching and observer behavior through a React hook and Vue composable; do not wrap Table in another scrolling panel.

## Public API and data ownership

Add an optional `infiniteScroll` configuration with `hasMore: boolean`, `onLoadMore: () => Promise<void>`, optional `rootMargin: number` (default 320 pixels), optional `onError: (error: unknown) => void`, and optional `resetKey: string | number`.

The parent fetches pages and supplies accumulated rows through `data`. The table neither fetches URLs nor merges results. The parent updates `hasMore` when the last page arrives. Existing `loading` represents initial loading or dataset replacement; subsequent page loading uses an inline status without hiding existing rows.

Infinite scrolling takes precedence over `pagination` if both are supplied. Hide pagination controls in this mode, but preserve custom footer content. Document that consumers should choose one mode.

## Shared loading behavior

Extract framework-specific fetching controllers from InfiniteScrollPanel. Both consumers use the same sentinel observation, synchronous in-flight guard, error handling, retry action, and observer cleanup. Preserve panel layout and its existing public API, including `minItems`.

Observe a sentinel inside the existing table body viewport. Use that viewport as the observer root. Load another page when the sentinel enters the bottom preload margin. Reobserve after appended rows so a short page can continue filling the viewport. Stop when `hasMore` is false, initial loading is active, or a request has failed. Never run concurrent loads. Provide a manual load action when IntersectionObserver is unavailable.

Failures retain existing rows and show an inline retry button. Retry clears the error and requests the same next page through the parent callback. Successful exhaustion shows an end marker when rows exist. Loading and error controls must not appear as data rows to selection or grouping logic.

## Reset and table interactions

Changing `resetKey` clears the loading error and returns the body viewport to the top. An earlier request must not publish stale loading or error state into the replacement dataset. Consumers remain responsible for discarding stale network results and replacing accumulated rows.

For remote sorting or filtering, the parent replaces rows, resets its page/cursor, and changes `resetKey`. Use existing controlled sorting and `manualSorting` for server-wide order. Local sorting and grouping continue to operate on loaded rows only.

Keep headers, toolbar, and footer outside the vertical body viewport. Preserve column alignment, horizontal synchronization, sticky columns, resizing, selection, grouping, `maxHeight`, and `fullHeight`. Recommend `maxHeight` or a bounded `fullHeight` parent for progressive loading. No row virtualization or automatic retention limit is included.

## Documentation and verification

Update public exports and table documentation. Add a playground example that switches between pagination and infinite scrolling, with simulated asynchronous pages and a bounded viewport.

Test sentinel-triggered loading, single-request locking, appended rows, exhaustion, initial loading suppression, failures and retry, reset during a pending request, observer cleanup, and pagination compatibility. Run existing InfiniteScrollPanel and Table tests for both frameworks, plus relevant type/build checks. Check that the sentinel remains within the actual body viewport and does not disturb table column measurement or semantics.
