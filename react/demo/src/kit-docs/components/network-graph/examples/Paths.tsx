import { useMemo, useState } from "react";
import { NetworkGraph, findNetworkPath } from "@cjlapao/ui-kit";
import { communities, sample } from "../data";

export default function Paths() {
  const [target, setTarget] = useState("node-179");
  const path = useMemo(
    () => findNetworkPath(sample.edges, "node-22", target),
    [target],
  );
  return (
    <div className="space-y-3">
      <p className="text-sm">
        Select a destination to trace an unweighted, undirected shortest path
        from Models 4.
      </p>
      <NetworkGraph
        {...sample}
        communities={communities}
        highlightedEdgeIds={path}
        selectedNodeId={null}
        onNodeSelect={(node) => {
          if (node) setTarget(node.id);
        }}
        height={360}
        variant="tonal"
        tone="teal"
      />
    </div>
  );
}
