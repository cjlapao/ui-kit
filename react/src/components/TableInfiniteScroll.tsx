import { useRef } from "react";
import type { RefObject } from "react";
import Button from "./Button";
import { useKitT } from "../i18n";
import type { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useScrollOverflow } from "../hooks/useScrollOverflow";
import type { TableInfiniteScrollState } from "../../../common/types/InfiniteScroll";

interface Props {
  config: TableInfiniteScrollState;
  sentinelRef: RefObject<HTMLDivElement | null>;
  /** The scroller the rows live in. The end marker only appears when its
   * content actually overflows — a table that fits has no end of scrolling
   * to announce. Without it the marker always shows, as it used to. */
  scrollRef?: RefObject<HTMLElement | null>;
  itemCount: number;
  state: ReturnType<typeof useInfiniteScroll>;
}

/** Outside the body table so status never participates in row/column measurement. */
export function TableInfiniteScroll({ config, sentinelRef, scrollRef, itemCount, state }: Props) {
  const { error, busy, loadMore } = state;
  const t = useKitT();
  const rootRef = useRef<HTMLDivElement>(null);
  // This footer sits inside the scroller, so it excludes its own always-there
  // box from the overflow reading — the marker never triggers itself in.
  const overflow = useScrollOverflow(scrollRef, {
    excludeRef: rootRef,
    deps: [itemCount, config.hasMore, error, busy],
  });
  const message = error
    ? t("kit.table.loadMoreError")
    : busy
      ? t("kit.table.loadingMore")
      : !config.hasMore && itemCount > 0 && config.showEndMarker !== false && overflow
        ? t("kit.table.endOfResults")
        : null;

  return (
    <div
      ref={rootRef}
      data-slot="table-infinite-scroll"
      className="p-3 text-center text-sm text-neutral-500 dark:text-neutral-400"
    >
      <div ref={sentinelRef} aria-hidden="true" />
      <div role="status" aria-live="polite">{message}</div>
      {error ? (
        <Button size="sm" variant="outline" onClick={() => void loadMore()}>
          {t("kit.table.retryLoadMore")}
        </Button>
      ) : config.hasMore && !busy ? (
        <Button size="sm" variant="outline" onClick={() => void loadMore()}>
          {t("kit.table.loadMore")}
        </Button>
      ) : null}
    </div>
  );
}
