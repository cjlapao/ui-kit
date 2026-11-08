import { useState } from "react";
import { KnowledgeExplorer, type MemoryRecord } from "@cjlapao/ui-kit";
import { memories as initialMemories, nodes, edges, traceLinks } from "./data";

export default function Harness() {
  const [memories, setMemories] = useState(initialMemories);
  const [notice, setNotice] = useState("");
  const update = (record: MemoryRecord, changes: Partial<MemoryRecord>) => setMemories(current => current.map(memory => memory.id === record.id ? { ...memory, ...changes } : memory));
  return <div className="w-full"><p className="mb-4 text-sm opacity-60">Select a trace step to highlight retrieved memories. Select a memory to inspect its evidence and linked steps.</p>
    <KnowledgeExplorer memories={memories} defaultSelectedId="refresh" trace={{ nodes, edges, height: 260, layout: "timeline", animation: false, sparkles: false }} traceLinks={traceLinks}
      onPinChange={(memory, pinned) => update(memory, { pinned })} onArchive={memory => update(memory, { status: "archived" })}
      onEdit={memory => setNotice(`Edit requested for “${memory.title}”. Connect this callback to your editor.`)} />
    <p className="mt-3 text-sm" role="status">{notice}</p>
  </div>;
}
