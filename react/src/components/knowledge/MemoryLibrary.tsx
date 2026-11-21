import { useMemo, useRef } from "react";
import "./knowledge.css";
import Panel, { SkeletonBar } from "../Panel";
import ScrollArea from "../ScrollArea";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { filterMemories } from "../../../../common/knowledge/model";
import { MemoryFilterBar } from "./MemoryFilterBar";
import { MemoryGrid } from "./MemoryGrid";
import { MemoryLoadMore, MemoryLimitNote, MemoryScrollTail } from "./MemoryPagingTail";
import { MemoryToolbar } from "./MemoryToolbar";
import { resolveControlChain, useKnowledgeCopy, useKnowledgeState } from "./shared";
import type { MemoryLibraryProps } from "./types";

/**
 * The knowledge library: a searchable, filterable, paged collection of
 * memories. Built from the standalone parts the kit exports individually —
 * `MemoryToolbar`, `MemoryFilterBar`, `MemoryGrid` and the paging tail — so
 * using a part on its own renders identically to the same region here.
 *
 * Selection, search and filters are controlled-or-uncontrolled like every
 * other knowledge component: pass the value + `on…Change` to own the state,
 * or the `default…` to seed internal state.
 */
export function MemoryLibrary({ memories, query: queryProp, defaultQuery = "", onQueryChange, filters: filtersProp,
  defaultFilters = {}, onFiltersChange, selectedId, defaultSelectedId = null, onSelectionChange,
  view: viewProp, defaultView = "cards", onViewChange, onShowMap, groupByTopic = true, highlightedIds = [], remote = false,
  renderMemory, emptyState, maxHeight, hasMore = false, onLoadMore, loadMode = "scroll", rootMargin, minItems,
  scrollResetKey, limit, onError, loadMoreLabel, showSearch = true, showFilterBar = true, size = "sm", controlsTone = "auto", searchTone = "auto",
  searchVariant = "auto", viewTone = "auto", viewVariant = "auto", actions, labels, loading = false, loaderType = "skeleton", loaderMessage, disabled = false, className = "", ...surface }: MemoryLibraryProps) {
  const copy = useKnowledgeCopy(labels);
  // Resolve the control chain once, on this card's own surface, and hand
  // concrete values to the parts — exactly how the aggregator feeds its parts.
  const chain = resolveControlChain({ tone: surface.tone, variant: surface.variant, controlsTone, searchTone, searchVariant, viewTone, viewVariant });
  const [query, setQuery] = useKnowledgeState(queryProp, defaultQuery, onQueryChange);
  const [filters, setFilters] = useKnowledgeState(filtersProp, defaultFilters, onFiltersChange);
  const [selection, select] = useKnowledgeState(selectedId, defaultSelectedId, onSelectionChange);
  const [view, setView] = useKnowledgeState(viewProp, defaultView, onViewChange);
  const visible = useMemo(() => remote ? [...memories] : filterMemories(memories, query, filters), [memories, query, filters, remote]);
  // The presentation cap. `shown` is what the library draws and counts;
  // once it reaches `limit` the paging tail stops even with more to load,
  // and a quiet note says so instead of an affordance that does nothing.
  const shown = useMemo(() => limit === undefined ? visible : visible.slice(0, Math.max(0, limit)), [visible, limit]);
  const atLimit = limit !== undefined && visible.length >= limit;
  // Infinite loading rides the kit's shared `useInfiniteScroll`, the same
  // watch ActivityFeed runs: a sentinel at the results' end is observed
  // inside the capped ScrollArea with a rootMargin lookahead, and the
  // under-fill pass keeps fetching until the viewport is full. It only
  // engages with a capped body — an uncapped library has no scroller to
  // watch, and the Load-more button covers it.
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const infinite = loadMode === "scroll" && maxHeight !== undefined && !!onLoadMore && !atLimit;
  const scroll = useInfiniteScroll({
    rootRef: viewportRef,
    sentinelRef,
    hasMore: infinite && hasMore,
    isLoading: loading,
    onLoadMore: async () => { await onLoadMore?.(); },
    itemCount: shown.length,
    minItems,
    rootMargin,
    // Search, filters, view and a wholesale refetch all swap the dataset.
    resetKey: `${query}|${filters.kind?.join(",") ?? ""}|${filters.status?.join(",") ?? ""}|${filters.topic?.join(",") ?? ""}|${view}|${scrollResetKey ?? ""}`,
    onError,
  });
  const body = loading && loaderType === "skeleton" ? <div className="kit-memory-skeleton" role="status" aria-label={typeof loaderMessage === "string" ? loaderMessage : copy("loading")}>
    <div className={`kit-memory-grid kit-memory-skeleton-grid animate-pulse motion-reduce:animate-none`} data-view={view} aria-hidden="true">
      {Array.from({ length: view === "list" ? 4 : 6 }, (_, index) => <div className="kit-memory-skeleton-card" key={index}>
        <SkeletonBar width="35%" height="h-2" /><SkeletonBar width="75%" height="h-4" /><SkeletonBar width="100%" /><SkeletonBar width="65%" />
      </div>)}
    </div>
  </div>
    : visible.length === 0 ? <div className="kit-knowledge-empty">{emptyState ?? copy(memories.length ? "noResults" : "empty")}</div>
    : <MemoryGrid records={shown} view={view} groupByTopic={groupByTopic} selectedId={selection} onSelect={record => select(record.id)} highlightedIds={highlightedIds} renderMemory={renderMemory} disabled={disabled || loading} labels={labels} actions={actions} cardTone={chain.cardTone} cardVariant={chain.cardVariant} />;
  const limitNote = !loading && limit !== undefined && atLimit && visible.length > 0 ? <MemoryLimitNote limit={limit} labels={labels} /> : null;
  return <Panel variant="elevated" padding="none" disabled={disabled} {...surface} tone={chain.cardTone} loading={loading && loaderType !== "skeleton"} loaderType={loaderType} loaderMessage={loaderType ?? copy("loading")} className={`kit-knowledge kit-memory-library ${className}`} aria-busy={loading}>
    {/* The filter section owns the search: its built-in SearchBar is the
        library's search field, showSearch or not — and showFilterBar drops
        the whole section, letting the view row lead the panel. */}
    {/* The bar loads with the body — same state, same loader type — so the
        panel tells one story while results are in flight. */}
    {showFilterBar && <MemoryFilterBar filters={filters} onFiltersChange={setFilters} memories={memories} query={query} onQueryChange={setQuery}
      showSearch={showSearch} size={size} tone={chain.controlsTone} searchTone={chain.searchTone} variant={chain.searchVariant} cardTone={surface.tone} cardVariant={chain.cardVariant} loading={loading} loaderType={loaderType} loaderProgress={surface.loaderProgress} loaderMessage={typeof loaderMessage === "string" ? loaderMessage : undefined} disabled={disabled || loading} labels={labels} />}
    {/* The results count shares the view row — it reads with the toggle it
        describes, and the row stays one line tall. */}
    <MemoryToolbar view={view} onViewChange={setView} onShowMap={onShowMap}
      resultsLabel={loading ? copy("loading") : `${shown.length} / ${memories.length}`}
      size={size} controlsTone={chain.controlsTone} viewTone={chain.viewTone} viewVariant={chain.viewVariant}
      cardTone={surface.tone} cardVariant={chain.cardVariant} disabled={disabled || loading} labels={labels} />
    {maxHeight === undefined ? <><div className="kit-memory-results" inert={loading && loaderType !== "skeleton" || undefined}>{body}</div>{limitNote}</>
      : <ScrollArea horizontal={false} viewportRef={viewportRef} viewportClassName="overscroll-contain" style={{ maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight }}>
        <div inert={loading && loaderType !== "skeleton" || undefined}>{body}</div>{infinite && !loading && <MemoryScrollTail sentinelRef={sentinelRef} error={scroll.error} isLoadingMore={scroll.isLoadingMore} onRetry={() => void scroll.loadMore()} tone={chain.controlsTone} labels={labels} />}{limitNote}
      </ScrollArea>}
    {/* The button tail: explicit `"button"` mode, or an uncapped library
        where scroll mode has no scroller to watch. The limit note already
        closes the tail, so no button competes with it. */}
    {hasMore && onLoadMore && !loading && !infinite && !atLimit && <MemoryLoadMore onLoadMore={() => void onLoadMore()} label={loadMoreLabel} tone={chain.controlsTone} cardVariant={chain.cardVariant} disabled={disabled} labels={labels} />}
  </Panel>;
}
