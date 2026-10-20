import { ConnectionFlow } from "@cjlapao/ui-kit";
import type { ConnectionFlowNode } from "@cjlapao/ui-kit";

/**
 * `childLayout: "chain"` turns a card's `rows` into a grid the flow walks
 * rightward and downward: it enters the first card from the parent's bottom,
 * links each row with the track's own connectors, and hands off onward from
 * the grid's last card — the parent itself is a pure container. Any card can
 * carry `success` and `failure`; both are always drawn, and which one is
 * alive follows the card's status.
 *
 * The reject paths are drawn by the path engine: every edge first tries the
 * plain route through the corridors the layout already leaves free, and only
 * the ones that would cut across a card get re-routed around them — `review
 * code` fails all the way back up the ladder without crossing a face, and
 * `qa`'s rejection leaves the grid and returns to `plan` over the cards,
 * never through them.
 */
const NODES: ConnectionFlowNode[] = [
  { id: "plan", title: "Plan", icon: "Edit", status: "succeeded" },
  {
    id: "plan-gate",
    title: "Plan gate",
    subtitle: "Approval gate",
    icon: "Verified",
    status: "succeeded",
    failure: { to: "plan", label: "max 2 · then escalate" },
  },
  {
    id: "build",
    title: "Build",
    subtitle: "Ladder · 7 steps",
    icon: "Docker",
    status: "running",
    childLayout: "chain",
    rows: [
      [{ id: "create-pr", title: "Create PR", icon: "Pull", status: "succeeded" }],
      [
        { id: "create-code", title: "Create code", icon: "Edit", status: "succeeded" },
        { id: "unit-tests", title: "Unit tests", icon: "CheckCircle", status: "succeeded" },
      ],
      [{ id: "lint", title: "Lint", icon: "Clean", status: "succeeded" }],
      [
        { id: "secure-code", title: "Secure code", icon: "Key", status: "succeeded" },
        { id: "scan-deps", title: "Scan deps", icon: "Search", status: "succeeded" },
      ],
      [
        {
          id: "review-code",
          title: "Review code",
          icon: "EyeOpen",
          status: "failed",
          failure: { to: "create-code", label: "max 2 · retry" },
        },
      ],
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
  {
    id: "qa",
    title: "QA",
    icon: "Bug",
    status: "failed",
    failure: { to: "plan", label: "max 2 · then escalate" },
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
      height={600}
    />
  );
}
