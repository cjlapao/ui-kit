import type { RefObject } from "react";
import Button from "../Button";
import Spinner from "../Spinner";
import { SURFACE_TO_BUTTON_VARIANT } from "../../theme";
import { useKnowledgeCopy } from "./shared";
import type { KnowledgeLabels, SurfaceVariant, TrueColor } from "./types";

/** The sentinel + spinner/retry row that hangs off the end of a capped,
 * infinitely-scrolling results body. */
export function MemoryScrollTail({ sentinelRef, error, isLoadingMore, onRetry, tone = "blue", labels }: {
  sentinelRef: RefObject<HTMLDivElement | null>;
  error?: unknown;
  isLoadingMore?: boolean;
  onRetry?: () => void;
  /** Resolved control accent for the spinner and retry. @default "blue" */
  tone?: TrueColor;
  labels?: KnowledgeLabels;
}) {
  const copy = useKnowledgeCopy(labels);
  return <>
    <div ref={sentinelRef} aria-hidden="true" />
    {error ? <div className="kit-memory-scroll-error" role="alert">{copy("loadMoreError")}<Button size="xs" variant="link" color={tone} onClick={() => onRetry?.()}>{copy("retry")}</Button></div>
      : isLoadingMore ? <div className="kit-memory-scroll-loading" role="status" aria-label={copy("loadingMore")}><Spinner size="xs" color={tone} /></div> : null}
  </>;
}

/** The "showing at most N" line that replaces the tail when the presentation
 * cap is reached — the paging is over, and the note says why. */
export function MemoryLimitNote({ limit, labels }: { limit: number; labels?: KnowledgeLabels }) {
  const copy = useKnowledgeCopy(labels);
  return <p className="kit-memory-limit-note" role="status">{copy("limitReached", { count: limit })}</p>;
}

/** The explicit Load-more button tail, for `"button"` mode or an uncapped
 * library where scroll mode has no scroller to watch. */
export function MemoryLoadMore({ onLoadMore, label, tone = "blue", cardVariant = "outlined", disabled = false, labels }: {
  onLoadMore: () => void;
  /** Built-in copy is kit.knowledge.loadMore. */
  label?: string;
  tone?: TrueColor;
  /** Button surface derived from the card variant, as everywhere else. @default "outlined" */
  cardVariant?: SurfaceVariant;
  disabled?: boolean;
  labels?: KnowledgeLabels;
}) {
  const copy = useKnowledgeCopy(labels);
  return <div className="kit-memory-load-more"><Button size="sm" color={tone} variant={SURFACE_TO_BUTTON_VARIANT[cardVariant]} disabled={disabled} onClick={() => onLoadMore()}>{label ?? copy("loadMore")}</Button></div>;
}
