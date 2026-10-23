import type {
  NetworkGraphCommunity,
  NetworkGraphEdge,
  NetworkGraphNode,
} from "@cjlapao/ui-kit";

export const communities: NetworkGraphCommunity[] = [
  { id: "routing", label: "Routing", tone: "blue" },
  { id: "security", label: "Security", tone: "orange" },
  { id: "models", label: "Models", tone: "teal" },
  { id: "validation", label: "Validation", tone: "rose" },
  { id: "events", label: "Events", tone: "violet" },
  { id: "storage", label: "Storage", tone: "amber" },
];

/** Stable data: no random layout changes when controls rerender the example. */
export function makeNetwork(count: number) {
  const nodes: NetworkGraphNode[] = Array.from({ length: count }, (_, i) => ({
    id: `node-${i}`,
    label: `${communities[i % communities.length].label} ${Math.floor(i / communities.length) + 1}`,
    community: communities[i % communities.length].id,
    radius: i < communities.length ? 9 : i % 17 === 0 ? 6 : 3,
  }));
  const edges: NetworkGraphEdge[] = [];
  for (let i = 1; i < count; i++) {
    const parent = i < 6 ? 0 : (i % 6) + Math.floor(Math.floor(i / 6) / 3) * 6;
    edges.push({
      id: `edge-${i}`,
      source: `node-${i}`,
      target: `node-${Math.min(i - 1, parent)}`,
    });
    if (i > 12 && i % 3 === 0)
      edges.push({
        id: `bridge-${i}`,
        source: `node-${i}`,
        target: `node-${Math.floor(i * 0.61)}`,
      });
  }
  return { nodes, edges };
}
export const sample = makeNetwork(180);
