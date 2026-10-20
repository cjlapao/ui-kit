import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { WorkflowTrackerRail } from "./WorkflowTrackerRail";
import { WorkflowTrackerStepDetails } from "./WorkflowTrackerStepDetails";
import { WorkflowTrackerDetails } from "./WorkflowTrackerDetails";
import { sampleWorkflow } from "./sampleWorkflow";
import type { WorkflowData } from "./types";

const gateData: WorkflowData = {
  title: "Gate",
  activeStepId: "gate",
  steps: [
    {
      id: "gate",
      label: "Approval gate",
      status: "attention",
      elapsed: "3h",
      actions: [
        { id: "accept", label: "Accept", tone: "emerald" },
        { id: "reject", label: "Reject", tone: "rose" },
      ],
    },
    { id: "publish", label: "Publish", status: "not_started" },
  ],
};

describe("WorkflowTrackerRail — standalone", () => {
  it("derives progress, tallies and the legend from data", () => {
    render(<WorkflowTrackerRail />);

    expect(screen.getByText("Progress")).toBeInTheDocument();
    expect(screen.getByText("33%")).toBeInTheDocument();
    expect(screen.getByText("Insurance certificates")).toBeInTheDocument();
    // Legend
    expect(screen.getByText("Not started")).toBeInTheDocument();
  });

  it("becomes interactive only through its own callbacks", () => {
    const onStepSelect = vi.fn();
    render(<WorkflowTrackerRail onStepSelect={onStepSelect} />);

    fireEvent.click(screen.getByRole("button", { name: /Legal review/ }));
    expect(onStepSelect).toHaveBeenCalledWith("legal_review");
    // No onStepAction supplied — the fixture's quick actions stay hidden.
    expect(screen.queryByText("Remind vendor")).not.toBeInTheDocument();
  });

  it("renders rail quick actions and forwards both ids", () => {
    const onStepAction = vi.fn();
    render(<WorkflowTrackerRail onStepAction={onStepAction} />);

    fireEvent.click(screen.getByRole("button", { name: "Nudge Legal" }));
    expect(onStepAction).toHaveBeenCalledWith("legal_review", "nudge");
  });

  it("swaps for the rail skeleton while loading", () => {
    const { container } = render(<WorkflowTrackerRail loading />);

    expect(container.textContent).not.toContain("Insurance certificates");
    expect(
      container.querySelectorAll(".animate-pulse").length,
    ).toBeGreaterThan(0);
  });

  it("hides the legend on request", () => {
    render(<WorkflowTrackerRail showLegend={false} />);
    expect(screen.queryByText("Not started")).not.toBeInTheDocument();
  });
});

describe("WorkflowTrackerStepDetails — standalone", () => {
  it("resolves the active step with the composite's fallback rule", () => {
    render(
      <WorkflowTrackerStepDetails
        data={{ ...sampleWorkflow, activeStepId: "nope" }}
      />,
    );

    // Unknown id falls back to the first in-progress step.
    expect(screen.getByText("Step 8 of 12")).toBeInTheDocument();
    expect(
      screen.getByText("3 accepted · 1 skipped · 2 open"),
    ).toBeInTheDocument();
  });

  it("renders the sub-steps table statically until callbacks arrive", () => {
    render(<WorkflowTrackerStepDetails />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);

    const onSubStepSelect = vi.fn();
    render(<WorkflowTrackerStepDetails onSubStepSelect={onSubStepSelect} />);
    fireEvent.click(screen.getAllByRole("button", { name: /Subprocessor list/ })[0]);
    expect(onSubStepSelect).toHaveBeenCalledWith(
      "security_questionnaire",
      "subprocessor_list",
    );
  });

  it("renders quick actions and forwards both ids", () => {
    const onStepAction = vi.fn();
    render(
      <WorkflowTrackerStepDetails data={gateData} onStepAction={onStepAction} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Accept" }));
    expect(onStepAction).toHaveBeenCalledWith("gate", "accept");
  });

  it("skeletons while loading", () => {
    const { container } = render(<WorkflowTrackerStepDetails loading />);
    expect(container.textContent).not.toContain("Security questionnaire");
  });
});

describe("WorkflowTrackerDetails — standalone", () => {
  it("renders the scrollable region for the active step's details", () => {
    render(<WorkflowTrackerDetails />);

    const region = screen.getByRole("region", { name: "Step details" });
    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent("Review activity");
  });

  it("renders nothing — not even the card — without details", () => {
    const { container } = render(
      <WorkflowTrackerDetails
        data={{
          title: "Quiet",
          activeStepId: "a",
          steps: [{ id: "a", label: "A", status: "done" }],
        }}
      />,
    );

    expect(container.querySelector('[data-slot="scrollarea"]')).toBeNull();
    expect(screen.queryByRole("region")).toBeNull();
  });

  it("renders nothing while loading", () => {
    render(<WorkflowTrackerDetails loading />);
    expect(screen.queryByRole("region", { name: "Step details" })).toBeNull();
  });

  it("routes the copy override to the region label", () => {
    render(<WorkflowTrackerDetails labels={{ details: "Execution log" }} />);
    expect(screen.getByRole("region", { name: "Execution log" })).toBeInTheDocument();
  });
});
