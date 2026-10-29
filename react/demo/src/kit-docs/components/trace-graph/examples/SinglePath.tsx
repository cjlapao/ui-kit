import { TraceGraph } from "@cjlapao/ui-kit";

const nodes = Array.from({ length: 10 }, (_, index) => ({ id: String(index), label: `Event ${index + 1}`,
  order: index, status: index === 9 ? "running" as const : "done" as const }));
const edges = nodes.slice(1).map((node, index) => ({ id: `edge-${index}`, source: String(index), target: node.id,
  status: index === 8 ? "running" as const : "done" as const }));

export default function SinglePath() {
  return <div className="w-full"><TraceGraph nodes={nodes} edges={edges} layout="timeline" height={260}
    renderNodeTooltip={node => <span>{node.label}</span>} /></div>;
}
