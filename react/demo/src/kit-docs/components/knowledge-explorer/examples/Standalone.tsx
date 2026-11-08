import { useState } from "react";
import { MemoryCard, MemoryLibrary, MemoryDetail, KnowledgeMap, type MemoryFilters } from "@cjlapao/ui-kit";
import { memories, points } from "./data";

export default function Standalone() {
  const [selectedId, select] = useState<string | null>("refresh");
  const [filters, setFilters] = useState<MemoryFilters>({});
  const selected = memories.find(memory => memory.id === selectedId);
  return <div className="grid w-full gap-6">
    <div><p className="mb-3 text-xs uppercase tracking-widest opacity-60">MemoryCard · no library required</p><MemoryCard memory={memories[0]} /></div>
    <div className="grid items-start gap-4 lg:grid-cols-2"><MemoryLibrary memories={memories} selectedId={selectedId} onSelectionChange={select} filters={filters} onFiltersChange={setFilters} />
      <div className="grid gap-4"><KnowledgeMap memories={memories} points={points} selectedId={selectedId} onSelectionChange={select} selectedTopic={filters.topic} onTopicSelect={topic => setFilters({ ...filters, topic: topic ?? undefined })} /><MemoryDetail memory={selected} relatedMemories={memories.filter(memory => selected?.relatedIds?.includes(memory.id))} onRelatedSelect={select} /></div>
    </div>
  </div>;
}
