import { useState } from "react";
import { KnowledgeExplorer, type MemoryRecord } from "@cjlapao/ui-kit";
import { memories as initialMemories } from "./data";

export default function Harness() {
  const [memories, setMemories] = useState(initialMemories);
  const [notice, setNotice] = useState("");
  const update = (record: MemoryRecord, changes: Partial<MemoryRecord>) => setMemories(current => current.map(memory => memory.id === record.id ? { ...memory, ...changes } : memory));
  return <div className="w-full"><p className="mb-4 text-sm opacity-60">Select a memory to inspect its evidence. Agent traces belong to the standalone TraceGraph component.</p>
    <KnowledgeExplorer memories={memories} defaultSelectedId="refresh"
      actions={[
        { id: "edit", label: "Edit", onClick: (memory) => setNotice(`Edit requested for “${memory.title}”. Connect this callback to your editor.`) },
        { id: "pin", label: (memory) => (memory.pinned ? "Unpin" : "Pin"), pressed: (memory) => !!memory.pinned, onClick: (memory) => update(memory, { pinned: !memory.pinned }) },
        { id: "archive", label: "Archive", hidden: (memory) => memory.status === "archived", onClick: (memory) => update(memory, { status: "archived" }) },
      ]} />
    <p className="mt-3 text-sm" role="status">{notice}</p>
  </div>;
}
