import { useMemo, useState } from "react";
import { KnowledgeMap, type KnowledgePoint, type MemoryRecord } from "@cjlapao/ui-kit";

const topics = ["Authentication", "Transport", "Testing", "Storage", "Interface", "Tooling"];
export default function MapOverview() {
  const [count, setCount] = useState(600), [glow, setGlow] = useState(true);
  const [selectedId, select] = useState<string | null>(null);
  const [topic, selectTopic] = useState<string | null>(null);
  const sample = useMemo(() => {
    const memories: MemoryRecord[] = [], points: KnowledgePoint[] = [];
    for (let i = 0; i < count; i++) {
      const cluster = i % topics.length, angle = cluster / topics.length * Math.PI * 2;
      const localAngle = i * 2.399963229728653, radius = Math.sqrt((i * 73 % 997) / 997) * 110;
      memories.push({ id: `sample-${i}`, title: `${topics[cluster]} · sample memory ${i + 1}`, summary: "Generated fixture for inspecting map density and selection.", kind: "lesson", topic: topics[cluster] });
      points.push({ memoryId: `sample-${i}`, clusterId: topics[cluster], x: Math.cos(angle) * 240 + Math.cos(localAngle) * radius, y: Math.sin(angle) * 190 + Math.sin(localAngle) * radius });
    }
    return { memories, points };
  }, [count]);
  return <div className="w-full"><div className="mb-4 flex flex-wrap gap-4 text-sm"><label>Fixture size <select className="rounded border bg-transparent p-1" value={count} onChange={event => { setCount(Number(event.target.value)); select(null); }}><option value={600}>600 memories</option><option value={3000}>3,000 memories</option></select></label><label className="flex items-center gap-2"><input type="checkbox" checked={glow} onChange={event => setGlow(event.target.checked)} />Cluster glow</label></div>
    <KnowledgeMap memories={sample.memories} points={sample.points} height={420} glow={glow} selectedId={selectedId} onSelectionChange={select} selectedTopic={topic} onTopicSelect={selectTopic} />
    <p className="mt-3 text-xs opacity-60" role="status">{selectedId ? sample.memories.find(memory => memory.id === selectedId)?.title : "Generated spatial fixture. These coordinates are illustrative, not actual embeddings."}</p>
  </div>;
}
