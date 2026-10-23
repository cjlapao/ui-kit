import { ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

const nodes: ConnectionFlowNode[] = [
  { id: "clarify", title: "Clarify", height: 104 },
  {
    id: "answers",
    title: "Clarify answers",
    height: 104,
    tone: "amber",
    connector: { label: "clarify · max 2 · then escalate" },
  },
  {
    id: "discovery",
    title: "Discovery",
    height: 104,
    failure: {
      to: "clarify",
      label:
        "Review the answers and return to clarification before another attempt",
    },
  },
];

export default function Captions() {
  return (
    <ConnectionFlow
      nodes={nodes}
      title="Wrapped captions"
      variant="outlined"
      tone="blue"
      height={380}
      fitOnLoad
    />
  );
}
