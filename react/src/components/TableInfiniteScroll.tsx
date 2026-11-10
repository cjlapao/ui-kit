import type { RefObject } from "react";
import Button from "./Button";
import { useKitT } from "../i18n";
import type { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import type { TableInfiniteScrollState } from "../../../common/types/InfiniteScroll";

interface Props {
  config: TableInfiniteScrollState;
  sentinelRef: RefObject<HTMLDivElement | null>;
  itemCount: number;
  state: ReturnType<typeof useInfiniteScroll>;
}

/** Outside the body table so status never participates in row/column measurement. */
export function TableInfiniteScroll({ config, sentinelRef, itemCount, state }: Props) {
  const { error, busy, loadMore } = state;
  const t = useKitT();
  const message = error
    ? t("kit.table.loadMoreError")
    : busy
      ? t("kit.table.loadingMore")
      : !config.hasMore && itemCount > 0
        ? t("kit.table.endOfResults")
        : null;

  return (
    <div
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
