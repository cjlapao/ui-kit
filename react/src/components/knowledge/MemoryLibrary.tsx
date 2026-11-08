import { useMemo } from "react";
import Panel from "../Panel";
import { filterMemories, MEMORY_KINDS, MEMORY_STATUSES } from "../../../../common/knowledge/model";
import type { MemoryFilters, MemoryRecord } from "../../../../common/knowledge/model";
import { MemoryCard } from "./MemoryCard";
import { useKnowledgeCopy, useKnowledgeState } from "./shared";
import type { MemoryLibraryProps } from "./types";

export function MemoryLibrary({ memories, query: queryProp, defaultQuery = "", onQueryChange, filters: filtersProp,
  defaultFilters = {}, onFiltersChange, selectedId, defaultSelectedId = null, onSelectionChange,
  view: viewProp, defaultView = "cards", onViewChange, groupByTopic = true, highlightedIds = [], remote = false,
  renderMemory, emptyState, onEdit, onPinChange, onArchive, labels, loading = false, disabled = false, className = "", ...surface }: MemoryLibraryProps) {
  const copy = useKnowledgeCopy(labels);
  const [query, setQuery] = useKnowledgeState(queryProp, defaultQuery, onQueryChange);
  const [filters, setFilters] = useKnowledgeState(filtersProp, defaultFilters, onFiltersChange);
  const [selection, select] = useKnowledgeState(selectedId, defaultSelectedId, onSelectionChange);
  const [view, setView] = useKnowledgeState(viewProp, defaultView, onViewChange);
  const visible = useMemo(() => remote ? [...memories] : filterMemories(memories, query, filters), [memories, query, filters, remote]);
  const topics = useMemo(() => [...new Set(memories.flatMap(memory => memory.topic ? [memory.topic] : []))].sort(), [memories]);
  const highlighted = useMemo(() => new Set(highlightedIds), [highlightedIds]);
  const groups = useMemo(() => {
    const result = new Map<string, MemoryRecord[]>();
    for (const memory of visible) { const key = groupByTopic ? memory.topic ?? "" : ""; const group = result.get(key) ?? []; group.push(memory); result.set(key, group); }
    return [...result];
  }, [visible, groupByTopic]);
  function changeFilter(key: keyof MemoryFilters, value: string) { setFilters({ ...filters, [key]: value || undefined }); }
  return <Panel tone="neutral" variant="outlined" padding="none" loading={loading} disabled={disabled} {...surface} className={`kit-knowledge kit-memory-library ${className}`} aria-busy={loading}>
    <div className="kit-knowledge-toolbar"><label className="kit-knowledge-search"><span>{copy("search")}</span><input type="search" value={query} disabled={disabled} onChange={event => setQuery(event.target.value)} placeholder={copy("search")} /></label>
      <div className="kit-knowledge-view" role="group" aria-label={copy("library")}>
        {(["cards", "list"] as const).map(mode => <button type="button" key={mode} disabled={disabled} aria-pressed={view === mode} onClick={() => setView(mode)}>{copy(mode)}</button>)}
      </div>
    </div>
    <fieldset className="kit-knowledge-filters" disabled={disabled}><legend className="sr-only">{copy("library")}</legend>
      <label>{copy("kind")}<select value={filters.kind ?? ""} onChange={event => changeFilter("kind", event.target.value)}><option value="">{copy("all")}</option>{MEMORY_KINDS.map(kind => <option key={kind} value={kind}>{copy(`kinds.${kind}`)}</option>)}</select></label>
      <label>{copy("status")}<select value={filters.status ?? ""} onChange={event => changeFilter("status", event.target.value)}><option value="">{copy("all")}</option>{MEMORY_STATUSES.map(status => <option key={status} value={status}>{copy(`statuses.${status}`)}</option>)}</select></label>
      <label>{copy("topic")}<select value={filters.topic ?? ""} onChange={event => changeFilter("topic", event.target.value)}><option value="">{copy("all")}</option>{[...new Set([...topics, ...(filters.topic ? [filters.topic] : [])])].map(topic => <option key={topic}>{topic}</option>)}</select></label>
      {(query || filters.kind || filters.status || filters.topic) && <button type="button" onClick={() => { setQuery(""); setFilters({}); }}>{copy("clear")}</button>}
    </fieldset>
    <div className="kit-knowledge-results" aria-live="polite">{loading ? copy("loading") : `${visible.length} / ${memories.length}`}</div>
    {loading ? <p role="status" className="kit-knowledge-empty">{copy("loading")}</p> : visible.length === 0 ? <div className="kit-knowledge-empty">{emptyState ?? copy(memories.length ? "noResults" : "empty")}</div> : <div className="kit-memory-groups">{groups.map(([topic, items]) => <section key={topic}>
      {groupByTopic && <h3 className="kit-memory-group-title">{topic || copy("ungrouped")}<span>{items.length}</span></h3>}
      <div className="kit-memory-grid" data-view={view}>{items.map(memory => <div key={memory.id}>{renderMemory ? renderMemory(memory, { selected: selection === memory.id, highlighted: highlighted.has(memory.id), select: () => { if (!disabled) select(memory.id); } }) : <MemoryCard memory={memory} layout={view === "list" ? "compact" : "expanded"} selected={selection === memory.id} highlighted={highlighted.has(memory.id)} onSelect={disabled ? undefined : () => select(memory.id)} onEdit={disabled ? undefined : onEdit} onPinChange={disabled ? undefined : onPinChange} onArchive={disabled ? undefined : onArchive} labels={labels} />}</div>)}</div>
    </section>)}</div>}
  </Panel>;
}
