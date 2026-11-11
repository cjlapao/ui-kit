import { useMemo, useState } from "react";
import Panel from "../Panel";
import { TraceGraph } from "../TraceGraph/TraceGraph";
import { filterMemories } from "../../../../common/knowledge/model";
import { MemoryLibrary } from "./MemoryLibrary";
import { MemoryDetail } from "./MemoryDetail";
import { KnowledgeMap } from "./KnowledgeMap";
import { useKnowledgeCopy, useKnowledgeState } from "./shared";
import type { KnowledgeExplorerContext, KnowledgeExplorerProps, KnowledgeRegion } from "./types";

export function KnowledgeExplorer({ memories, points, relationships, trace, traceLinks = [], selectedId,
  defaultSelectedId = null, onSelectionChange, query: queryProp, defaultQuery = "", onQueryChange,
  filters: filtersProp, defaultFilters = {}, onFiltersChange, selectedTraceId: traceIdProp,
  defaultSelectedTraceId = null, onTraceSelectionChange, regions, renderRegion, onEdit, onPinChange,
  onArchive, labels, loading = false, disabled = false, className = "", ...surface }: KnowledgeExplorerProps) {
  const copy = useKnowledgeCopy(labels);
  const [selection, select] = useKnowledgeState(selectedId, defaultSelectedId, onSelectionChange);
  const [query, setQuery] = useKnowledgeState(queryProp, defaultQuery, onQueryChange);
  const [filters, setFilters] = useKnowledgeState(filtersProp, defaultFilters, onFiltersChange);
  const [traceId, selectTrace] = useKnowledgeState(traceIdProp, defaultSelectedTraceId, onTraceSelectionChange);
  const [mobileView, setMobileView] = useState<KnowledgeRegion>("library");
  const records = useMemo(() => new Map(memories.map(memory => [memory.id, memory])), [memories]);
  const selectedMemory = selection ? records.get(selection) ?? null : null;
  const highlightedIds = useMemo(() => [...new Set(traceLinks.filter(link => link.traceNodeId === traceId && records.has(link.memoryId)).map(link => link.memoryId))], [traceLinks, traceId, records]);
  const linkedTraceIds = useMemo(() => new Set(traceLinks.filter(link => link.memoryId === selection).map(link => link.traceNodeId)), [traceLinks, selection]);
  const linkedNodes = useMemo(() => trace?.nodes.filter(node => linkedTraceIds.has(node.id)) ?? [], [trace?.nodes, linkedTraceIds]);
  const traceNodes = useMemo(() => trace?.nodes.map(node => linkedTraceIds.has(node.id) ? { ...node, tone: "cyan" as const } : node) ?? [], [trace?.nodes, linkedTraceIds]);
  // Layout uses all records to stay stable; query/filter changes only alter highlights.
  const matchingIds = useMemo(() => filterMemories(memories, query, filters).map(memory => memory.id), [memories, query, filters]);
  const enabled = (["library", "map", "detail", "trace"] as const).filter(region => regions?.[region] !== false && (region !== "trace" || !!trace || !!renderRegion?.trace));
  const view = enabled.includes(mobileView) ? mobileView : enabled[0];
  const context: KnowledgeExplorerContext = { selectedMemory, selectedId: selection, selectMemory: select, query, setQuery, filters, setFilters, highlightedIds, selectedTraceId: traceId, selectTrace };
  const actions = { onEdit: disabled ? undefined : onEdit, onPinChange: disabled ? undefined : onPinChange, onArchive: disabled ? undefined : onArchive };
  const shared = { labels, disabled, loading };
  const content = (region: KnowledgeRegion) => {
    if (renderRegion?.[region]) return renderRegion[region]!(context);
    if (region === "library") return <MemoryLibrary {...shared} {...actions} memories={memories} query={query} onQueryChange={setQuery} filters={filters} onFiltersChange={setFilters} selectedId={selection} onSelectionChange={select} highlightedIds={highlightedIds} />;
    if (region === "map") return <KnowledgeMap {...shared} memories={memories} points={points} relationships={relationships} selectedId={selection} onSelectionChange={select} highlightedIds={traceId ? highlightedIds : query || filters.kind || filters.status ? matchingIds : []} selectedTopic={filters.topic} onTopicSelect={topic => setFilters({ ...filters, topic: topic ?? undefined })} />;
    if (region === "detail") return <><MemoryDetail {...actions} labels={labels} memory={selectedMemory} relatedMemories={(selectedMemory?.relatedIds ?? []).flatMap(id => { const record = records.get(id); return record ? [record] : []; })} onRelatedSelect={disabled ? undefined : select} />{selectedMemory && trace && <section className="kit-knowledge-linked-traces"><h4>{copy("linkedTraces")}</h4>{linkedNodes.length ? linkedNodes.map(node => <button type="button" key={node.id} disabled={disabled} aria-pressed={traceId === node.id} onClick={() => selectTrace(node.id)}>{node.label ?? node.id}</button>) : <p>{copy("noTraceLinks")}</p>}</section>}</>;
    return trace && <TraceGraph {...trace} disabled={disabled || trace.disabled} nodes={traceNodes} selectedNodeId={traceId} onNodeSelect={node => selectTrace(node?.id ?? null)} />;
  };
  return <Panel tone="none" variant="simple" padding="none" loading={loading} disabled={disabled} {...surface} className={`kit-knowledge kit-knowledge-explorer ${className}`}>
    <div className="kit-knowledge-mobile-nav" role="group" aria-label={copy("library")}>{enabled.map(region => <button key={region} type="button" aria-pressed={view === region} onClick={() => setMobileView(region)}>{copy(region === "detail" ? "details" : region)}</button>)}</div>
    <div className="kit-knowledge-regions">{enabled.map(region => <section key={region} className={`kit-knowledge-region kit-knowledge-region-${region}`} data-mobile-active={view === region} aria-label={copy(region === "detail" ? "details" : region)}>{content(region)}</section>)}</div>
  </Panel>;
}
