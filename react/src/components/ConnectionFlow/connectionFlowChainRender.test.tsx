import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import ConnectionFlow from "./ConnectionFlow";
import type { ConnectionFlowNode } from "../../connectionFlow";

const PIPELINE: ConnectionFlowNode[] = [
  { id: "setup", title: "Setup", status: "succeeded" },
  {
    id: "build",
    title: "Build",
    status: "running",
    childLayout: "chain",
    rows: [
      [{ id: "create-pr", title: "Create PR", status: "succeeded" }],
      [
        { id: "create-code", title: "Create Code", status: "succeeded" },
        { id: "lint", title: "Lint", status: "succeeded" },
      ],
      [
        {
          id: "verify",
          title: "Verify",
          status: "failed",
          failure: { to: "create-code", label: "retry" },
        },
      ],
      [{ id: "merge", title: "Merge", status: "pending" }],
    ],
  },
  { id: "deploy", title: "Deploy", status: "pending" },
];

describe("ConnectionFlow chained grid rendering", () => {
  it("renders every card of the grid and the parent", () => {
    const { getByText } = render(<ConnectionFlow nodes={PIPELINE} />);
    for (const title of [
      "Build",
      "Create PR",
      "Create Code",
      "Lint",
      "Verify",
      "Merge",
      "Deploy",
    ]) {
      expect(getByText(title)).toBeTruthy();
    }
  });

  it("draws the branch caption along the loop-back", () => {
    const { getByText } = render(<ConnectionFlow nodes={PIPELINE} />);
    expect(getByText("retry")).toBeTruthy();
  });
});
