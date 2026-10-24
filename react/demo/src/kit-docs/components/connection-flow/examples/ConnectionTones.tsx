import { ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowConnection, ConnectionFlowNode } from "@cjlapao/ui-kit";

const nodes: ConnectionFlowNode[] = [
  { id: "check", title: "Check result", tone: "blue", gridPosition: { column: 0, row: 0 } },
  { id: "publish", title: "Publish", tone: "blue", gridPosition: { column: 1, row: 0 } },
  { id: "retry", title: "Retry", tone: "blue", gridPosition: { column: 1, row: 1 } },
];
const connections: ConnectionFlowConnection[] = [
  { id: "accepted", fromId: "check", toId: "publish", tone: "emerald", type: "success", label: "Accepted",
    description: "Publish when validation succeeds", data: { condition: { field: "valid", equals: true } } },
  { id: "rejected", fromId: "check", toId: "retry", tone: "rose", type: "failure", label: "Needs changes",
    description: "Retry when validation fails", data: { condition: { field: "valid", equals: false } } },
];

export default function ConnectionTones() {
  return <ConnectionFlow nodes={nodes} connections={connections} height={340} title="Branch-specific connection tones" progressType="none" />;
}
