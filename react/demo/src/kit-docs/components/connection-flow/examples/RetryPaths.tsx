import { ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

const nodes: ConnectionFlowNode[] = [
  {
    id: "implement",
    title: "Implement",
    subtitle: "Model step",
    items: [{ id: "agent", title: "Agent", subtitle: "Developer" }],
  },
  {
    id: "offer-review",
    title: "Offer review",
    tone: "amber",
    items: [
      { id: "decision", title: "Decision", subtitle: "Review before pushing?" },
    ],
  },
  {
    id: "review",
    title: "Inline review",
    items: [{ id: "agent", title: "Agent", subtitle: "Code reviewer" }],
    failure: { to: "implement", label: "Implement · retry" },
  },
  {
    id: "offer-security",
    title: "Offer security",
    tone: "amber",
    items: [
      {
        id: "decision",
        title: "Decision",
        subtitle: "Scan sensitive changes?",
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    items: [{ id: "agent", title: "Agent", subtitle: "Security engineer" }],
    failure: { to: "implement", label: "Implement · retry" },
  },
];

export default function RetryPaths() {
  return (
    <ConnectionFlow
      nodes={nodes}
      title="Review and security retries"
      variant="glass"
      tone="blue"
      height={340}
    />
  );
}
