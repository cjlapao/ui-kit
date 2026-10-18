import { ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

/**
 * A bypassed step is arched over rather than connected through. With
 * `autoState`, an untouched (neutral) step that something later passed is
 * detected as skipped without being flagged.
 */
const NODES: ConnectionFlowNode[] = [
  { id: "a", title: "Lint", tone: "emerald" },
  { id: "b", title: "Integration tests", tone: "neutral" },
  { id: "c", title: "Publish", tone: "emerald" },
];

export default function Skipped() {
  return <ConnectionFlow
      fitOnLoad nodes={NODES} autoState variant="outlined" height={200} />;
}
