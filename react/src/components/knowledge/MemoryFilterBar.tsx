import { FilterBar } from "../FilterBar";
import type { FilterBarLoaderType, FilterBarValue } from "../FilterBar";
import { filterMemories, MEMORY_KINDS, MEMORY_STATUSES } from "../../../../common/knowledge/model";
import type { MemoryFilters, MemoryKind, MemoryRecord, MemoryStatus } from "../../../../common/knowledge/model";
import { resolveControlChain, useKnowledgeCopy } from "./shared";
import type { ControlSize, InputVariant, KnowledgeLabels, SurfaceTone, SurfaceVariant, TrueColor } from "./types";

export interface MemoryFilterBarProps {
  filters: MemoryFilters;
  onFiltersChange: (filters: MemoryFilters) => void;
  /** Topics and the per-option counts are derived from the records given. */
  memories: readonly MemoryRecord[];
  /** The search term the bar's built-in SearchBar edits. Without a handler
   * the search section still shows but stays inert. */
  query?: string;
  onQueryChange?: (query: string) => void;
  /** Show the search section. Hidden search keeps its query. @default true */
  showSearch?: boolean;
  /** Show the bar's own filtered/total summary. The library keeps its
   * aria-live results line above the grid instead. @default false */
  showResultCount?: boolean;
  /** Control scale, shared with the view toggle below. @default "sm" */
  size?: ControlSize;
  /** Chips, Add-filter and Clear all tone; `"auto"` follows the card accent. */
  tone?: TrueColor | "auto";
  /** Search field accent; `"auto"` follows `tone`. @default "auto" */
  searchTone?: TrueColor | "auto";
  /** Search field surface; `"auto"` maps the card variant to a valid Input surface. */
  variant?: InputVariant | "auto";
  cardTone?: SurfaceTone;
  cardVariant?: SurfaceVariant;
  /** Draws the bar in its loading state — the library hands it its own
   * `loading` and `loaderType`, so bar and body tell the same story.
   * @default false */
  loading?: boolean;
  /** The loading treatment, shared with the body: `"spinner"` / `"progress"`
   * pin a Loader overlay to the bar, `"skeleton"` rewrites its pieces in
   * pulsing placeholder ink. @default "skeleton" */
  loaderType?: FilterBarLoaderType;
  /** The bar fill for `loaderType="progress"`, 0–100. */
  loaderProgress?: number;
  /** The label the overlay publishes. Defaults to the kit's "Loading". */
  loaderMessage?: string;
  disabled?: boolean;
  labels?: KnowledgeLabels;
}

/**
 * The library's filter section: the kit FilterBar's own SearchBar plus
 * Type (kind), Status and Topic menus whose checkbox options are derived
 * from the records. Values are multi-select — OR within a facet, AND across
 * — and the bar's Clear all empties the facets while the search field clears
 * itself. A part of MemoryLibrary; renders identically standalone.
 */
export function MemoryFilterBar({ filters, onFiltersChange, memories, query = "", onQueryChange, showSearch = true, showResultCount = false, size = "sm", tone = "auto", searchTone = "auto", variant = "auto", cardTone, cardVariant, loading = false, loaderType = "skeleton", loaderProgress, loaderMessage, disabled = false, labels }: MemoryFilterBarProps) {
  const copy = useKnowledgeCopy(labels);
  // One chain drives the whole bar: chips and buttons take the control
  // tone, the search field its own accent and surface, all `"auto"` first.
  const chain = resolveControlChain({ tone: cardTone, variant: cardVariant, controlsTone: tone, searchTone, searchVariant: variant });
  const tally = (wanted: (memory: MemoryRecord) => boolean) => memories.filter(wanted).length;
  // Topics come from the records, plus any already selected — a filter
  // applied from outside must stay selectable in the menu.
  const topics = [...new Set([...memories.flatMap(memory => memory.topic ? [memory.topic] : []), ...(filters.topic ?? [])])].sort();
  const value: FilterBarValue = {};
  if (filters.kind?.length) value.kind = [...filters.kind];
  if (filters.status?.length) value.status = [...filters.status];
  if (filters.topic?.length) value.topic = [...filters.topic];
  return <div className="kit-memory-filter-bar">
    <FilterBar
      size={size}
      color={chain.searchTone}
      buttonTone={chain.controlsTone}
      chipTone={chain.controlsTone}
      variant="none"
      tone="none"
      padding="none"
      loading={loading}
      loaderType={loaderType}
      loaderProgress={loaderProgress}
      loadingMessage={loaderMessage ?? copy("loading")}
      disabled={disabled}
      showSearch={showSearch}
      showResultCount={showResultCount}
      filteredCount={filterMemories(memories, query, filters).length}
      totalCount={memories.length}
      searchProps={{
        initialValue: query,
        onSearch: next => onQueryChange?.(next),
        onClear: () => onQueryChange?.(""),
        placeholder: copy("search"),
        debounceMs: 250,
        variant: chain.searchVariant,
        disabled,
      }}
      filters={[
        { id: "kind", label: copy("kind"), options: MEMORY_KINDS.map(kind => ({ value: kind, label: copy(`kinds.${kind}`), count: tally(memory => memory.kind === kind) })) },
        { id: "status", label: copy("status"), options: MEMORY_STATUSES.map(status => ({ value: status, label: copy(`statuses.${status}`), count: tally(memory => (memory.status ?? "active") === status) })) },
        { id: "topic", label: copy("topic"), options: topics.map(topic => ({ value: topic, label: topic, count: tally(memory => memory.topic === topic) })) },
      ]}
      value={value}
      onChange={next => onFiltersChange({
        kind: next.kind?.length ? next.kind as MemoryKind[] : undefined,
        status: next.status?.length ? next.status as MemoryStatus[] : undefined,
        topic: next.topic?.length ? next.topic : undefined,
      })} />
  </div>;
}
