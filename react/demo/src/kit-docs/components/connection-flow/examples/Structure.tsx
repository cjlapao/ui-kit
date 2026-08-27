import { ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

/**
 * `kind` borrows TreeView's idea of connection type: `step` follows the track,
 * `parallel` stacks into lanes that fan out and back in, and `children` hang
 * vertically below their parent.
 */
const NODES: ConnectionFlowNode[] = [
  { id: "root", title: "Plan", icon: "Blueprint", tone: "violet" },
  {
    id: "provision",
    title: "Provision",
    icon: "Cog",
    tone: "violet",
    children: [
      { id: "net", title: "Network", tone: "violet" },
      { id: "db", title: "Database", tone: "violet" },
    ],
  },
  { id: "api", title: "API", kind: "parallel", tone: "sky" },
  { id: "worker", title: "Worker", kind: "parallel", tone: "sky" },
  { id: "web", title: "Web", kind: "parallel", tone: "sky" },
  { id: "smoke", title: "Smoke test", icon: "Bug", tone: "emerald" },
];

export default function Structure() {
  return (
    <ConnectionFlow
      fitOnLoad nodes={NODES} variant="outlined" height={300} flowState="stopped" />
  );
}
