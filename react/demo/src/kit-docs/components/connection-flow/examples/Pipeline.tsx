import { ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

/**
 * `childLayout: "chain"` turns a card's `rows` into a grid the flow walks
 * rightward and downward: it enters the first card from the parent's bottom,
 * links each row with the track's own connectors, and hands off onward from
 * the grid's last card — the parent itself is a pure container. Any card can
 * carry `success` and `failure`; both are always drawn, and which one is
 * alive follows the card's status. Here `verify code` failed, so its rose
 * edge flows back into `create code` — the closed loop that runs the chain
 * down again — while its way forward sits dim.
 */
const NODES: ConnectionFlowNode[] = [
  { id: "setup", title: "Setup", icon: "Cog", status: "succeeded" },
  {
    id: "build",
    title: "Build",
    icon: "Docker",
    status: "running",
    childLayout: "chain",
    rows: [
      [{ id: "create-pr", title: "Create PR", icon: "Pull", status: "succeeded" }],
      [
        { id: "create-code", title: "Create code", icon: "Edit", status: "succeeded" },
        { id: "unit-tests", title: "Unit tests", icon: "CheckCircle", status: "succeeded" },
        { id: "lint", title: "Lint", icon: "Clean", status: "succeeded" },
      ],
      [
        {
          id: "verify-code",
          title: "Verify code",
          icon: "Verified",
          status: "failed",
          failure: { to: "create-code", label: "re-run" },
        },
      ],
      [
        { id: "secure-code", title: "Secure code", icon: "Key", status: "pending" },
        { id: "scan-deps", title: "Scan deps", icon: "Search", status: "pending" },
      ],
      [{ id: "review-code", title: "Review code", icon: "EyeOpen", status: "pending" }],
      [
        {
          id: "merge-code",
          title: "Merge code",
          icon: "Push",
          status: "pending",
          success: { label: "ship" },
        },
      ],
    ],
  },
  { id: "deploy", title: "Deploy", icon: "Rocket", status: "pending" },
  { id: "done", title: "Done", icon: "Complete", status: "pending", terminal: true },
];

export default function Pipeline() {
  return (
    <ConnectionFlow
      fitOnLoad
      nodes={NODES}
      variant="outlined"
      height={430}
    />
  );
}
