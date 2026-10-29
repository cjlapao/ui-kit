import { useState } from "react";
import { TraceGraph, type TraceGraphNode, type TraceFollowMode } from "@cjlapao/ui-kit";
import { createTraceFixture } from "../fixture";

const data = createTraceFixture(2);

export default function AgentFlow() {
  const [selected, setSelected] = useState<TraceGraphNode | null>(null);
  const [follow, setFollow] = useState<TraceFollowMode>("off");
  return <div className="w-full space-y-3">
    <TraceGraph {...data} height={340} layout="dependency" tone="violet"
      activeNodeIds={["search-2", "test-2"]} activeEdgeIds={["planner-2:search-2", "read-2:test-2"]}
      followMode={follow} onFollowModeChange={setFollow}
      onNodeSelect={setSelected}
      renderNodeTooltip={node => <span>{node.label}</span>}
      renderNodePopover={node => <div><strong>{node.label}</strong><p>Custom details: {node.id}</p></div>} />
    <p className="text-xs text-neutral-600 dark:text-neutral-400">{selected ? `External selection: ${selected.label}` : "Forks and tool calls rejoin the orchestrator after each turn."}</p>
  </div>;
}
