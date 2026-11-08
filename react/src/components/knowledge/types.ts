import type { ReactNode } from "react";
import type { PanelProps } from "../Panel";
import type { TraceGraphProps } from "../TraceGraph/types";
import type { MemoryFilters, MemoryKind, MemoryStatus, MemoryRecord, MemoryTraceLink, KnowledgeDiagnostic, KnowledgePoint, KnowledgeRelationship } from "../../../../common/knowledge/model";
export type { MemoryRecord, MemorySource, MemoryKind, MemoryStatus, MemoryFilters, MemoryTraceLink, KnowledgePoint, KnowledgeRelationship, KnowledgeDiagnostic } from "../../../../common/knowledge/model";

export type KnowledgeLabels = Partial<Record<"library" | "map" | "details" | "trace" | "search" | "kind" | "status" | "topic" | "all" | "cards" | "list" | "empty" | "noResults" | "loading" | "selectMemory" | "sources" | "noSources" | "related" | "edit" | "pin" | "unpin" | "archive" | "retrievals" | "lastRetrieved" | "feedback" | "retrievalNote" | "fit" | "zoomIn" | "zoomOut" | "topicLayout" | "projectionNote" | "relationships" | "previous" | "next" | "clear" | "ungrouped" | "linkedTraces" | "noTraceLinks" | "mapHelp" | "pinned" | `kinds.${MemoryKind}` | `statuses.${MemoryStatus}`, string>>;
export interface KnowledgeSurfaceProps extends Omit<PanelProps, "children" | "onSelect"> { labels?: KnowledgeLabels }
export interface MemoryActions {
  onEdit?: (memory: MemoryRecord) => void;
  onPinChange?: (memory: MemoryRecord, pinned: boolean) => void;
  onArchive?: (memory: MemoryRecord) => void;
}
export interface MemorySelection {
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectionChange?: (id: string | null) => void;
}
export interface MemoryCardProps extends KnowledgeSurfaceProps, MemoryActions {
  memory: MemoryRecord;
  layout?: "compact" | "expanded";
  selected?: boolean;
  highlighted?: boolean;
  onSelect?: (memory: MemoryRecord) => void;
}
export interface MemoryDetailProps extends KnowledgeSurfaceProps, MemoryActions {
  memory?: MemoryRecord | null;
  relatedMemories?: readonly MemoryRecord[];
  onRelatedSelect?: (id: string) => void;
  renderContent?: (memory: MemoryRecord) => ReactNode;
}
export interface MemoryLibraryProps extends KnowledgeSurfaceProps, MemorySelection, MemoryActions {
  memories: readonly MemoryRecord[];
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  filters?: MemoryFilters;
  defaultFilters?: MemoryFilters;
  onFiltersChange?: (filters: MemoryFilters) => void;
  /** Disable local search/filtering when the consumer supplies server-filtered records. */
  remote?: boolean;
  view?: "cards" | "list";
  defaultView?: "cards" | "list";
  onViewChange?: (view: "cards" | "list") => void;
  groupByTopic?: boolean;
  highlightedIds?: readonly string[];
  renderMemory?: (memory: MemoryRecord, state: { selected: boolean; highlighted: boolean; select: () => void }) => ReactNode;
  emptyState?: ReactNode;
}
export interface KnowledgeMapProps extends KnowledgeSurfaceProps, MemorySelection {
  memories: readonly MemoryRecord[];
  /** Omit for illustrative topic placement; supply coordinates for a real projection. */
  points?: readonly KnowledgePoint[];
  relationships?: readonly KnowledgeRelationship[];
  highlightedIds?: readonly string[];
  selectedTopic?: string | null;
  onTopicSelect?: (topic: string | null) => void;
  height?: number;
  glow?: boolean;
  onDiagnostics?: (diagnostics: readonly KnowledgeDiagnostic[]) => void;
}
export type KnowledgeRegion = "library" | "map" | "detail" | "trace";
export interface KnowledgeExplorerContext {
  selectedMemory: MemoryRecord | null;
  selectedId: string | null;
  selectMemory: (id: string | null) => void;
  query: string;
  setQuery: (query: string) => void;
  filters: MemoryFilters;
  setFilters: (filters: MemoryFilters) => void;
  highlightedIds: readonly string[];
  selectedTraceId: string | null;
  selectTrace: (id: string | null) => void;
}
export interface KnowledgeExplorerProps extends KnowledgeSurfaceProps, MemorySelection, MemoryActions {
  memories: readonly MemoryRecord[];
  points?: readonly KnowledgePoint[];
  relationships?: readonly KnowledgeRelationship[];
  trace?: Omit<TraceGraphProps, "selectedNodeId" | "onNodeSelect">;
  traceLinks?: readonly MemoryTraceLink[];
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  filters?: MemoryFilters;
  defaultFilters?: MemoryFilters;
  onFiltersChange?: (filters: MemoryFilters) => void;
  selectedTraceId?: string | null;
  defaultSelectedTraceId?: string | null;
  onTraceSelectionChange?: (id: string | null) => void;
  regions?: Partial<Record<KnowledgeRegion, boolean>>;
  renderRegion?: Partial<Record<KnowledgeRegion, (context: KnowledgeExplorerContext) => ReactNode>>;
}
