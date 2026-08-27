import { CONNECTION_FLOW_STATUSES, ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

/**
 * `status` says what happened to a step; the tone and the glyph follow from it.
 * A CI already knows this, and hand-translating it to a tone at every call site
 * is how a flow ends up with `red` on one card and `rose` on the next.
 *
 * `tone` still wins where it is set — the last node here is `failed` painted
 * violet — so a status is a default, not a constraint. `running` also implies
 * `active` and `skipped` implies bypassing, so the semantics are stated once.
 */
const NODES: ConnectionFlowNode[] = [
  ...CONNECTION_FLOW_STATUSES.map((status, index) => ({
    id: status,
    title: status,
    status,
    // `skipped` would otherwise be arched over rather than shown.
    skipped: false,
    kind: index === 0 ? undefined : ("parallel" as const),
    group: "statuses",
  })),
  {
    id: "override",
    title: "failed, but violet",
    status: "failed" as const,
    tone: "violet" as const,
    skipped: false,
    kind: "parallel" as const,
    group: "statuses",
  },
];

export default function Status() {
  return (
    <ConnectionFlow
      fitOnLoad
      nodes={NODES}
      size="sm"
      progressType="none"
      showControls={false}
      height={280}
    />
  );
}
