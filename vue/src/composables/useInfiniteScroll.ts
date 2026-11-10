import { computed, onBeforeUnmount, ref, watch, watchEffect } from "vue";
import type { Ref } from "vue";
import type { TableInfiniteScrollState } from "../../../common/types/InfiniteScroll";

interface Options extends TableInfiniteScrollState {
  isLoading?: boolean;
  itemCount: number;
  minItems?: number;
}

/** Shared sentinel and request lifecycle for append-only scroll surfaces. */
export function useInfiniteScroll(
  rootRef: Ref<HTMLDivElement | null>,
  sentinelRef: Ref<HTMLDivElement | null>,
  options: () => Options,
) {
  const isLoadingMore = ref(false);
  const error = ref<unknown>(null);
  const busy = computed(() => options().isLoading || isLoadingMore.value);
  let generation = 0;
  let locked = false;
  let failed = false;
  let disposed = false;
  let attemptedCount: number | null = null;

  watch(() => options().resetKey, () => {
    generation += 1;
    attemptedCount = null;
    failed = false;
    error.value = null;
    if (rootRef.value) rootRef.value.scrollTop = 0;
  }, { flush: "sync" });
  onBeforeUnmount(() => { disposed = true; generation += 1; });

  const loadMore = async () => {
    const current = options();
    if (locked || current.isLoading || !current.hasMore || disposed) return;
    const started = generation;
    locked = true;
    attemptedCount = current.itemCount;
    failed = false;
    isLoadingMore.value = true;
    error.value = null;
    try {
      await current.onLoadMore();
    } catch (caught) {
      if (started === generation && !disposed) {
        failed = true;
        // Was `console.error` and nothing else, so a failed page looked exactly
        // like the end of the list.
        error.value = caught || new Error("Failed to load more items");
        current.onError?.(caught);
      }
    } finally {
      locked = false;
      if (!disposed) isLoadingMore.value = false;
    }
  };

  // An IntersectionObserver, not a debounced scroll handler comparing
  // `getBoundingClientRect`s. The old approach missed fast scrolls, fired on
  // every window resize, and could not see the sentinel inside a nested scroller
  // that had not scrolled yet.
  watchEffect((onCleanup) => {
    const { hasMore, rootMargin = 320, itemCount, resetKey } = options();
    // Track appended data and dataset replacement even when the root stays mounted.
    void itemCount;
    void resetKey;
    const root = rootRef.value;
    const sentinel = sentinelRef.value;
    if (!root || !sentinel || !hasMore || busy.value || error.value || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (!failed && attemptedCount !== options().itemCount && entries.some((entry) => entry.isIntersecting)) void loadMore();
    }, { root, rootMargin: `0px 0px ${rootMargin}px 0px`, threshold: 0 });
    observer.observe(sentinel);
    onCleanup(() => observer.disconnect());
  }, { flush: "post" });

  // Keeps fetching while the panel is under-filled.
  watchEffect(() => {
    const { hasMore, itemCount, minItems = 0 } = options();
    if (hasMore && !busy.value && !error.value && attemptedCount !== itemCount && itemCount < minItems) void loadMore();
  });
  return { isLoadingMore, error, busy, loadMore };
}
