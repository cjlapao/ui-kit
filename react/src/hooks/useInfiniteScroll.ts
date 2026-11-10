import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { TableInfiniteScrollState } from "../../../common/types/InfiniteScroll";

interface Options extends TableInfiniteScrollState {
  rootRef: RefObject<HTMLDivElement | null>;
  sentinelRef: RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
  itemCount: number;
  minItems?: number;
  observeKey?: string;
}

/** Shared sentinel and request lifecycle for append-only scroll surfaces. */
export function useInfiniteScroll(options: Options) {
  const { rootRef, sentinelRef, hasMore, isLoading = false, itemCount,
    minItems = 0, rootMargin = 320, resetKey, observeKey } = options;
  const latest = useRef(options);
  const generation = useRef(0);
  const locked = useRef(false);
  const failed = useRef(false);
  const mounted = useRef(false);
  const attemptedCount = useRef<number | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useLayoutEffect(() => { latest.current = options; });
  useLayoutEffect(() => {
    mounted.current = true;
    generation.current += 1;
    attemptedCount.current = null;
    failed.current = false;
    setError(null);
    // Keep the old request locked until it settles; datasets never overlap requests.
    if (rootRef.current) rootRef.current.scrollTop = 0;
    return () => { mounted.current = false; generation.current += 1; };
  }, [resetKey, rootRef]);

  const loadMore = useCallback(async () => {
    const current = latest.current;
    if (!mounted.current || locked.current || current.isLoading || !current.hasMore) return;
    const started = generation.current;
    locked.current = true;
    attemptedCount.current = current.itemCount;
    failed.current = false;
    setIsLoadingMore(true);
    setError(null);
    try {
      await current.onLoadMore();
    } catch (caught) {
      if (started === generation.current) {
        failed.current = true;
        // Was `console.error` and nothing else, so a failed page looked exactly
        // like the end of the list.
        setError(caught || new Error("Failed to load more items"));
        current.onError?.(caught);
      }
    } finally {
      locked.current = false;
      if (mounted.current) setIsLoadingMore(false);
    }
  }, []);

  const busy = isLoading || isLoadingMore;
  // An IntersectionObserver, not a debounced scroll handler comparing
  // `getBoundingClientRect`s. The old approach missed fast scrolls, fired on
  // every resize, and could not see the sentinel at all inside a nested
  // scroller that had not scrolled yet.
  useEffect(() => {
    const root = rootRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel || !hasMore || busy || error || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (!failed.current && attemptedCount.current !== latest.current.itemCount && entries.some((entry) => entry.isIntersecting)) void loadMore();
    }, { root, rootMargin: `0px 0px ${rootMargin}px 0px`, threshold: 0 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [rootRef, sentinelRef, hasMore, busy, error, rootMargin, itemCount, resetKey, observeKey, loadMore]);

  // Keeps fetching while the panel is under-filled.
  useEffect(() => {
    if (hasMore && !busy && !error && attemptedCount.current !== itemCount && itemCount < minItems) void loadMore();
  }, [hasMore, busy, error, itemCount, minItems, resetKey, loadMore]);

  return { isLoadingMore, error, busy, loadMore };
}
