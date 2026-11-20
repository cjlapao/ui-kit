import { useState } from "react";
import { MemoryCard, MemoryLibrary, MemoryDetail, KnowledgeMap, MemoryFilterBar, MemoryGrid, MemoryToolbar, type MemoryFilters, type MemoryRecord } from "@cjlapao/ui-kit";
import { memories, points } from "./data";

// Older records the Load-more tail appends, so the capped library has a
// second page to reach. Eight base records plus these make the scroll
// watcher and the count line both move.
const EXTRA: MemoryRecord[] = [
  { id: "cache", title: "Invalidate the cache at write time", summary: "TTLs hide staleness. Purge on write, let reads repopulate.", kind: "decision", topic: "Transport", scope: "packages/api", status: "active", usage: { retrievalCount: 6 } },
  { id: "flaky", title: "Quarantine flaky suites, do not delete them", summary: "Move unstable specs behind a flag and a ticket. Silence is not stability.", kind: "lesson", topic: "Testing", scope: "workspace", status: "needs-review", usage: { retrievalCount: 4 } },
  { id: "logs", title: "Log correlation ids on every hop", summary: "A request id threaded through adapters turns three logs into one story.", kind: "convention", topic: "Observability", scope: "workspace", status: "active", usage: { retrievalCount: 11 } },
  { id: "budget", title: "Budget worker threads per build", summary: "Parallel builds saturate CI runners. Cap workers, not jobs.", kind: "decision", topic: "Build", scope: "infra", status: "active", usage: { retrievalCount: 3 } },
  { id: "types", title: "Keep public types at the package edge", summary: "Re-export what consumers need. Internal shapes may churn freely.", kind: "convention", topic: "Build", scope: "packages", status: "active", usage: { retrievalCount: 8 } },
  { id: "spans", title: "Trace spans inherit request ids", summary: "Child spans without a parent id fragment the waterfall.", kind: "pitfall", topic: "Observability", scope: "packages/api", status: "active", usage: { retrievalCount: 5 } },
  { id: "snap", title: "Snapshot long-lived fixtures", summary: "Fixtures that encode a contract deserve snapshots; behavioural ones do not.", kind: "lesson", topic: "Testing", scope: "test", status: "superseded", usage: { retrievalCount: 1 } },
  { id: "seeds", title: "Seed clocks and ids in property tests", summary: "Deterministic seeds keep failures replayable across machines.", kind: "code", topic: "Testing", scope: "test", status: "active", usage: { retrievalCount: 9 } },
];

// The library owns this filtering internally; the hand-wired grid expects
// already-filtered records, so the consumer owns it here instead.
function matches(memory: MemoryRecord, query: string, filters: MemoryFilters): boolean {
  if (filters.kind?.length && !filters.kind.includes(memory.kind)) return false;
  if (filters.status?.length && !filters.status.includes(memory.status ?? "active")) return false;
  if (filters.topic?.length && !filters.topic.includes(memory.topic ?? "")) return false;
  if (!query.trim()) return true;
  const needle = query.trim().toLowerCase();
  return [memory.title, memory.summary, memory.content, memory.topic].some(text => text?.toLowerCase().includes(needle));
}

export default function Standalone() {
  const [selectedId, select] = useState<string | null>("refresh");
  const [filters, setFilters] = useState<MemoryFilters>({});
  const [records, setRecords] = useState<MemoryRecord[]>(memories);
  const selected = records.find(memory => memory.id === selectedId);
  // The hand-wired row below keeps its own toolbar state; the grid receives
  // filtered records and exposes plain click events to this component.
  const [partsQuery, setPartsQuery] = useState("");
  const [partsView, setPartsView] = useState<"cards" | "list">("list");
  const [partsFilters, setPartsFilters] = useState<MemoryFilters>({});
  const partsRecords = memories.filter(memory => matches(memory, partsQuery, partsFilters));
  return <div className="grid w-full gap-6">
    <div><p className="mb-3 text-xs uppercase tracking-widest opacity-60">MemoryCard · no library required</p><MemoryCard memory={memories[0]} /></div>
    {/* The library sits in a deliberately narrow viewer: a capped-height
        ScrollArea where list mode reads as a dense list and card mode keeps
        one readable column. Load-more appends the older page until the
        presentation limit of twelve — the tail settles into an "at most 12"
        note while four records still sit behind it. */}
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]"><MemoryLibrary memories={records} selectedId={selectedId} onSelectionChange={select} filters={filters} onFiltersChange={setFilters} maxHeight={340} limit={12} hasMore={records.length < memories.length + EXTRA.length} onLoadMore={async () => { await new Promise(resolve => setTimeout(resolve, 500)); setRecords(current => [...current, ...EXTRA.slice(current.length - memories.length, current.length - memories.length + 4)]); }} />
      <div className="grid gap-4"><KnowledgeMap memories={records} points={points} selectedId={selectedId} onSelectionChange={select} selectedTopic={filters.topic} onTopicSelect={topics => setFilters({ ...filters, topic: topics })} /><MemoryDetail memory={selected} relatedMemories={records.filter(memory => selected?.relatedIds?.includes(memory.id))} onRelatedSelect={select} /></div>
    </div>
    {/* The library's own parts, composed by hand: MemoryLibrary is exactly
        this row plus a scroll area, so each part on its own renders like the
        region inside it — and every click event lands on this component. */}
    <div className="grid gap-3">
      <p className="text-xs uppercase tracking-widest opacity-60">MemoryFilterBar · MemoryToolbar · MemoryGrid · click events owned here</p>
      <MemoryFilterBar filters={partsFilters} onFiltersChange={setPartsFilters} memories={memories} query={partsQuery} onQueryChange={setPartsQuery} />
      <MemoryToolbar view={partsView} onViewChange={setPartsView} />
      {partsRecords.length === 0
        ? <p className="text-sm opacity-60">Nothing matches “{partsQuery}”. Clear the search or a filter to bring the records back.</p>
        : <MemoryGrid records={partsRecords} view={partsView} selectedId={selectedId} onSelect={memory => select(memory.id)} />}
    </div>
  </div>;
}
