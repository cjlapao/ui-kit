import { NetworkGraph } from "@cjlapao/ui-kit";

const nodes = [
  { id: "gateway", label: "Gateway", community: "edge", tone: "sky" as const, radius: 8 },
  { id: "cdn", label: "CDN", community: "edge", tone: "sky" as const },
  { id: "auth", label: "Auth", community: "core", tone: "violet" as const },
  { id: "users", label: "Users", community: "core", tone: "violet" as const },
  { id: "orders", label: "Orders", community: "core", tone: "violet" as const },
  { id: "search", label: "Search", community: "core", tone: "violet" as const },
  { id: "pg", label: "Postgres", community: "data", tone: "amber" as const },
  { id: "cache", label: "Cache", community: "data", tone: "amber" as const },
  { id: "queue", label: "Queue", community: "data", tone: "amber" as const },
];
const edges = [
  { id: "a", source: "cdn", target: "gateway" },
  { id: "b", source: "gateway", target: "auth" },
  { id: "c", source: "gateway", target: "users" },
  { id: "d", source: "gateway", target: "orders" },
  { id: "e", source: "gateway", target: "search" },
  { id: "f", source: "auth", target: "pg" },
  { id: "g", source: "users", target: "pg" },
  { id: "h", source: "orders", target: "pg" },
  { id: "i", source: "orders", target: "queue" },
  { id: "j", source: "search", target: "cache" },
  { id: "k", source: "users", target: "cache" },
];
const communities = [
  { id: "edge", label: "Edge", tone: "sky" as const },
  { id: "core", label: "Core", tone: "violet" as const },
  { id: "data", label: "Data", tone: "amber" as const },
];

export default function Inspector() {
  return (
    <NetworkGraph
      nodes={nodes}
      edges={edges}
      communities={communities}
      height={320}
      variant="outlined"
      ariaLabel="Service mesh"
      inspector
      defaultSelectedNodeId="gateway"
      inspectorButtonVariant="soft"
      inspectorButtonTone="sky"
    />
  );
}
