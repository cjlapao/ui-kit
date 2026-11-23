import { useCallback, useEffect, useRef, useState } from "react";

/** Arguments every page request gets. `page` is 0-based. */
export interface PagedFetcherParams {
  page: number;
  pageSize: number;
  /** Aborted when the request goes stale (reload, unmount). */
  signal: AbortSignal;
}

/** One page of results. `total`, when given, drives the panel's count chip. */
export interface PagedFetcherPage<T> {
  items: T[];
  hasMore: boolean;
  total?: number;
}

export type PagedFetcher<T> = (
  params: PagedFetcherParams,
) => Promise<PagedFetcherPage<T>>;

export interface UsePagedFetcherOptions<T> {
  /**
   * The app's page endpoint. Kept in a ref — an inline arrow re-rendering
   * the host must not restart the state machine.
   */
  fetchItems: PagedFetcher<T>;
  /** Items per page. @default 20 */
  pageSize?: number;
  /** Change it (while `enabled`) to abort, clear and refetch from page 0. */
  reloadKey?: string | number;
  /**
   * Gate on the first page: nothing is fetched until this turns true, and
   * the first true is the only thing that triggers page 0. Reverting it
   * later keeps the cache — reopening the surface shows the loaded pages.
   */
  enabled?: boolean;
}

export interface UsePagedFetcherResult<T> {
  items: T[];
  /** Whatever the latest page reported, when the API reports it. */
  total: number | undefined;
  hasMore: boolean;
  /** First page in flight — the surface shows a skeleton while this is true. */
  isLoading: boolean;
  /** A later page in flight — the surface shows its footer spinner. */
  isLoadingMore: boolean;
  /**
   * First-page failure only. Load-more rejections are rethrown from
   * `loadMore` so `useInfiniteScroll`'s retry footer owns them.
   */
  error: unknown;
  /** Fetch and append the next page. Safe to call from an observer. */
  loadMore: () => Promise<void>;
  /** Abort, clear and refetch page 0 — the retry path. */
  reload: () => void;
}

/**
 * The page-state machine behind the `StatCard` drilldown (and anything else
 * that wants `InfiniteScrollPanel` fed from an async fetcher): lazy first page
 * on `enabled`, append-on-scroll through `loadMore`, aborts and generation
 * guards so a reload can never let a stale response land, and a `reloadKey`
 * that refetches the moment the app's filters change.
 */
export function usePagedFetcher<T>({
  fetchItems,
  pageSize = 20,
  reloadKey,
  enabled = true,
}: UsePagedFetcherOptions<T>): UsePagedFetcherResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchRef = useRef(fetchItems);
  fetchRef.current = fetchItems;

  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);
  hasMoreRef.current = hasMore;
  const busyRef = useRef(false);
  const generationRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  /** Which `reloadKey` the current pages belong to (null = nothing loaded). */
  const loadedKeyRef = useRef<string | null>(null);

  const runPage = useCallback(
    async (page: number, isInitial: boolean): Promise<void> => {
      const generation = generationRef.current;
      const controller = new AbortController();
      controllerRef.current?.abort();
      controllerRef.current = controller;
      busyRef.current = true;
      if (isInitial) {
        setError(null);
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      try {
        const response = await fetchRef.current({
          page,
          pageSize,
          signal: controller.signal,
        });
        if (generation !== generationRef.current) return;
        setItems((previous) =>
          isInitial ? response.items : [...previous, ...response.items],
        );
        setTotal(response.total);
        setHasMore(response.hasMore);
        pageRef.current = page + 1;
      } catch (caught) {
        if (generation !== generationRef.current) return;
        if (controller.signal.aborted) {
          // Unmount/dev-remount aborts leave the key unset so the next
          // `enabled` pass refetches; reload() aborts bump the generation
          // and never reach here as current.
          if (isInitial) loadedKeyRef.current = null;
          return;
        }
        if (isInitial) {
          loadedKeyRef.current = null;
          setError(caught ?? new Error("Failed to load items"));
        } else {
          throw caught;
        }
      } finally {
        if (generation === generationRef.current) {
          busyRef.current = false;
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [pageSize],
  );

  const loadInitial = useCallback(() => {
    generationRef.current += 1;
    pageRef.current = 0;
    setItems([]);
    setHasMore(true);
    setTotal(undefined);
    setError(null);
    loadedKeyRef.current = String(reloadKey ?? "");
    void runPage(0, true);
  }, [runPage, reloadKey]);

  const loadMore = useCallback(async () => {
    if (busyRef.current || !hasMoreRef.current) return;
    await runPage(pageRef.current, false);
  }, [runPage]);

  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  // The first page rides on `enabled`/`reloadKey` only — never on identity
  // churn. A key already loaded (e.g. after closing and reopening the
  // surface) keeps its pages instead of refetching.
  useEffect(() => {
    if (!enabled) return;
    const key = String(reloadKey ?? "");
    if (loadedKeyRef.current === key) return;
    generationRef.current += 1;
    pageRef.current = 0;
    setItems([]);
    setHasMore(true);
    setTotal(undefined);
    setError(null);
    loadedKeyRef.current = key;
    void runPage(0, true);
    // A StrictMode remount aborts the in-flight page and the catch resets
    // `loadedKeyRef`, so the re-run of THIS effect refetches — no cleanup
    // abort here, or unmount would race the generation guard.
  }, [enabled, reloadKey]);

  // Unmount: abort, but do NOT bump the generation. A StrictMode remount
  // re-runs the `enabled` effect on the same instance, and its catch path
  // only releases `loadedKeyRef` for an abort that is still current — an
  // aborted-with-stale-generation first page would leave the key set and
  // the second setup pass would skip the refetch, stranding an empty panel.
  useEffect(() => () => controllerRef.current?.abort(), []);

  return {
    items,
    total,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    reload: loadInitial,
  };
}
