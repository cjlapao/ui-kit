import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { WorkflowTrackerRail } from "./WorkflowTrackerRail";
import { WorkflowTrackerStepDetails } from "./WorkflowTrackerStepDetails";
import { WorkflowTrackerDetails } from "./WorkflowTrackerDetails";
import { WorkflowTrackerRollups } from "./WorkflowTrackerRollups";
import { sampleWorkflow } from "./sampleWorkflow";
import SidePanel from "../SidePanel";
import WorkflowStatusNode from "./WorkflowStatusNode";
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
  it("lets controls adapt to collapse without losing their own state", () => {
    function Controls({ collapsed }: { collapsed: boolean }) {
      const [count, setCount] = useState(0);
      return (
        <button onClick={() => setCount(count + 1)}>
          {collapsed ? "Compact" : "Expanded"} controls: {count}
        </button>
      );
    }
    const { container } = render(
      <WorkflowTrackerRail
        collapsible
        fillHeight
        renderControls={({ collapsed }) => <Controls collapsed={collapsed} />}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Expanded controls: 0" }),
    );
    const control = screen.getByRole("button", {
      name: "Expanded controls: 1",
    });
    expect(container.querySelector("ol")!.parentElement).toContainElement(
      control,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Collapse workflow rail" }),
    );
    expect(screen.getByRole("button", { name: "Compact controls: 1" })).toBe(
      control,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Expand workflow rail" }),
    );
    expect(screen.getByRole("button", { name: "Expanded controls: 1" })).toBe(
      control,
    );
  });

  it("passes the effective collapse state to controls and keeps them available while loading", () => {
    const renderControls = vi.fn(({ collapsed }) => (
      <button>{collapsed ? "Compact agents" : "Agents"}</button>
    ));
    const { rerender } = render(
      <WorkflowTrackerRail collapsed loading renderControls={renderControls} />,
    );
    expect(renderControls).toHaveBeenLastCalledWith({ collapsed: false });
    expect(screen.getByRole("button", { name: "Agents" })).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    rerender(
      <WorkflowTrackerRail
        collapsible
        collapsed
        data={{ title: "Empty", steps: [] }}
        renderControls={renderControls}
      />,
    );
    expect(renderControls).toHaveBeenLastCalledWith({ collapsed: true });
    expect(
      screen.getByRole("button", { name: "Compact agents" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("shows derived progress in the compact header, including zero and complete", () => {
    const { rerender } = render(<WorkflowTrackerRail collapsible collapsed />);
    expect(
      screen.getByRole("progressbar", { name: "Progress" }),
    ).toHaveAttribute("aria-valuenow", "33");
    expect(screen.getByText("33%")).toBeInTheDocument();
    rerender(<WorkflowTrackerRail collapsible collapsed data={gateData} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
    rerender(
      <WorkflowTrackerRail
        collapsible
        collapsed
        data={{
          title: "Done",
          steps: [{ id: "done", label: "Done", status: "done" }],
        }}
        labels={{ progress: "Completion" }}
      />,
    );
    expect(
      screen.getByRole("progressbar", { name: "Completion" }),
    ).toHaveAttribute("aria-valuenow", "100");
  });

  it("offers consumer popover content only on collapsed steps", () => {
    const renderStepPopover = vi.fn((step) => <div>Preview: {step.id}</div>);
    const select = vi.fn();
    render(
      <WorkflowTrackerRail
        data={gateData}
        collapsible
        defaultCollapsed
        renderStepPopover={renderStepPopover}
        onStepSelect={select}
      />,
    );
    const step = screen.getByRole("button", {
      name: "Approval gate — Attention",
    });
    fireEvent.mouseEnter(step);
    expect(screen.getByRole("dialog", { hidden: true })).toHaveTextContent(
      "Preview: gate",
    );
    fireEvent.click(step);
    expect(select).toHaveBeenCalledWith("gate");
    expect(step).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("dialog", { hidden: true })).toHaveClass(
      "popover-overlay--leave",
    );
    renderStepPopover.mockClear();
    fireEvent.click(
      screen.getByRole("button", { name: "Expand workflow rail" }),
    );
    expect(
      screen.queryByRole("dialog", { hidden: true }),
    ).not.toBeInTheDocument();
    expect(renderStepPopover).not.toHaveBeenCalled();
    fireEvent.mouseEnter(screen.getByRole("button", { name: "Approval gate" }));
    expect(
      screen.queryByRole("dialog", { hidden: true }),
    ).not.toBeInTheDocument();
  });

  it("uses a light hover-only tile around the compact status circle", () => {
    render(
      <WorkflowTrackerRail
        data={gateData}
        collapsible
        defaultCollapsed
        onStepSelect={vi.fn()}
      />,
    );
    const step = screen.getByRole("button", {
      name: "Approval gate — Attention",
    });
    expect(step).toHaveClass(
      "hover:bg-neutral-100",
      "dark:hover:bg-white/5",
      "rounded-xl",
    );
    expect(step).not.toHaveClass("bg-neutral-200", "dark:bg-neutral-700");
    expect(step.querySelector(".rounded-full.border-2")).not.toBeNull();
    expect(step.querySelector(".ring-offset-2")).toBeNull();
  });

  it.each(["left", "right"] as const)("rounds content-facing corners on the %s edge and restores expanded geometry", (side) => {
    const { container, rerender } = render(
      <WorkflowTrackerRail collapsible collapsed side={side} corner="rounded-lg" />,
    );
    const panel = container.querySelector("section")!;
    expect(panel.style[side === "left" ? "borderTopLeftRadius" : "borderTopRightRadius"]).toBe("0px");
    expect(panel).toHaveClass("rounded-3xl");
    rerender(<WorkflowTrackerRail collapsible collapsed={false} side={side} corner="rounded-lg" />);
    expect(panel.style.borderTopLeftRadius).toBe("");
    expect(panel.style.borderTopRightRadius).toBe("");
  });

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
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0,
    );
  });

  it("hides the legend on request", () => {
    render(<WorkflowTrackerRail showLegend={false} />);
    expect(screen.queryByText("Not started")).not.toBeInTheDocument();
  });

  it("opts in to collapse and toggles internal state without losing focus", () => {
    const onCollapsedChange = vi.fn();
    const { container } = render(
      <WorkflowTrackerRail collapsible onCollapsedChange={onCollapsedChange} />,
    );
    const toggle = screen.getByRole("button", {
      name: "Collapse workflow rail",
    });
    toggle.focus();
    fireEvent.click(toggle);
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(container.firstElementChild).toHaveStyle({ width: "56px" });
    expect(
      document.getElementById(toggle.getAttribute("aria-controls")!),
    ).toBeInTheDocument();
    expect(onCollapsedChange).toHaveBeenLastCalledWith(true);
    expect(screen.queryByText("Progress")).not.toBeInTheDocument();
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(onCollapsedChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByText("Progress")).toBeInTheDocument();
  });

  it("leaves controlled state with the parent and restores the expanded width", () => {
    const onCollapsedChange = vi.fn();
    const props = {
      collapsible: true,
      onCollapsedChange,
      style: { width: 280 },
    };
    const { container, rerender } = render(
      <WorkflowTrackerRail {...props} collapsed />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Expand workflow rail" }),
    );
    expect(onCollapsedChange).toHaveBeenCalledWith(false);
    expect(
      screen.getByRole("button", { name: "Expand workflow rail" }),
    ).toHaveAttribute("aria-expanded", "false");
    rerender(<WorkflowTrackerRail {...props} collapsed={false} />);
    expect(container.firstElementChild).toHaveStyle({ width: "280px" });
  });

  it("ignores collapse state when collapsing is disabled", () => {
    render(<WorkflowTrackerRail collapsed defaultCollapsed />);
    expect(
      screen.queryByRole("button", { name: /workflow rail/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Progress")).toBeInTheDocument();
  });

  it("keeps compact steps accessible and selectable while hiding expanded actions", () => {
    const onStepSelect = vi.fn();
    render(
      <WorkflowTrackerRail
        data={gateData}
        collapsible
        defaultCollapsed
        onStepSelect={onStepSelect}
        onStepAction={vi.fn()}
      />,
    );
    const step = screen.getByRole("button", {
      name: "Approval gate — Attention",
    });
    expect(step.closest("li")).toHaveAttribute("aria-current", "step");
    fireEvent.click(step);
    expect(onStepSelect).toHaveBeenCalledWith("gate");
    expect(
      screen.queryByRole("button", { name: "Accept" }),
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Expand workflow rail" }),
    );
    expect(screen.getByRole("button", { name: "Accept" })).toBeInTheDocument();
  });

  it("handles loading and empty compact rails with custom toggle labels", () => {
    const { container, rerender } = render(
      <WorkflowTrackerRail
        collapsible
        defaultCollapsed
        loading
        loadingRows={3}
        expandLabel="Open pipeline"
      />,
    );
    expect(container.firstElementChild).toHaveAttribute("aria-busy", "true");
    expect(
      screen.getByRole("button", { name: "Open pipeline" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Progress")).not.toBeInTheDocument();
    rerender(
      <WorkflowTrackerRail
        collapsible
        defaultCollapsed
        data={{ title: "Empty", steps: [] }}
      />,
    );
    expect(screen.getByText("No steps yet")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Expand workflow rail" }),
    );
    expect(
      screen.getByText("Steps appear here as soon as the workflow starts."),
    ).toBeInTheDocument();
  });

  it("fills the parent and confines scrolling to the timeline in both modes", () => {
    const { container } = render(
      <WorkflowTrackerRail collapsible fillHeight />,
    );
    expect(container.firstElementChild).toHaveClass("h-full", "min-h-0");
    const list = container.querySelector("ol")!;
    const area = list.closest('[data-slot="scrollarea"]')!;
    const viewport = area.querySelector('[data-slot="scrollarea-viewport"]')!;
    expect(area).toHaveClass("min-h-0", "flex-1");
    expect(viewport).toHaveClass("overflow-auto");
    Object.defineProperties(viewport, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 300 },
    });
    fireEvent.scroll(viewport);
    const scrollbar = area.querySelector('[data-orientation="vertical"]')!;
    expect(scrollbar).toHaveAttribute("data-state", "hidden");
    fireEvent.pointerEnter(area);
    expect(scrollbar).toHaveAttribute("data-state", "visible");
    fireEvent.pointerLeave(area);
    expect(scrollbar).toHaveAttribute("data-state", "hidden");
    fireEvent.click(
      screen.getByRole("button", { name: "Collapse workflow rail" }),
    );
    expect(container.firstElementChild).toHaveClass("h-full");
    expect(screen.getByRole("list").closest('[data-slot="scrollarea"]')).toBe(
      area,
    );
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
    fireEvent.click(
      screen.getAllByRole("button", { name: /Subprocessor list/ })[0],
    );
    expect(onSubStepSelect).toHaveBeenCalledWith(
      "security_questionnaire",
      "subprocessor_list",
    );
  });

  it("renders quick actions and forwards both ids", () => {
    const onStepAction = vi.fn();
    render(
      <WorkflowTrackerStepDetails
        data={gateData}
        onStepAction={onStepAction}
      />,
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
    expect(
      screen.getByRole("region", { name: "Execution log" }),
    ).toBeInTheDocument();
  });
});

describe("WorkflowTrackerRollups — standalone", () => {
  it("renders both derived roll-up cards in the composite's grid", () => {
    const { container } = render(<WorkflowTrackerRollups />);
    expect(container.firstElementChild).toHaveClass("@xl:grid-cols-2");
    expect(screen.getByText("Needs attention")).toBeInTheDocument();
    expect(screen.getByText("Skipped steps")).toBeInTheDocument();
    // Derived lists: attention = insurance_certificates/legal_review,
    // skipped = duplicate_check/tax_documents — one row each.
    expect(screen.getByText("Insurance certificates")).toBeInTheDocument();
    expect(screen.getByText("Tax documents")).toBeInTheDocument();
  });

  it("renders nothing while loading or when no step qualifies", () => {
    const loading = render(<WorkflowTrackerRollups loading />);
    expect(loading.container.firstChild).toBeNull();

    const clean = render(
      <WorkflowTrackerRollups
        data={{
          title: "All clear",
          steps: [{ id: "a", label: "A", status: "done" }],
        }}
      />,
    );
    expect(clean.container.firstChild).toBeNull();
  });

  it("routes the copy overrides to the card titles", () => {
    render(
      <WorkflowTrackerRollups labels={{ needsAttention: "Blocked on you" }} />,
    );
    expect(screen.getByText("Blocked on you")).toBeInTheDocument();
    expect(screen.queryByText("Needs attention")).not.toBeInTheDocument();
  });
});

describe("WorkflowTrackerRail — collapse toggle matches SidePanel's", () => {
  it("uses the same ghost, neutral button and the same chevron as SidePanel", () => {
    const { container: rail } = render(<WorkflowTrackerRail collapsible variant="glass" cardTone="violet" />);
    const railBtn = screen.getByRole("button", { name: "Collapse workflow rail" });
    const { container: panel } = render(<SidePanel isOpen collapsible title="Inspector" />);
    const panelBtn = panel.querySelector('button[aria-label="Collapse panel"]') as HTMLElement;
    // Same button: identical classes whatever the rail's surface or tone.
    expect(railBtn.className).toBe(panelBtn.className);
    expect(railBtn.className).not.toContain("violet");
    // Same caret: the close-matched chevron glyph.
    const chevron = rail.querySelector("[data-collapse-chevron]") as SVGElement;
    expect(chevron).toBeTruthy();
    expect(chevron.querySelector("path")!.getAttribute("d")).toBe("M9.5 6.97 14.53 12 9.5 17.03");
  });

  it("points left to collapse (the rail folds toward its left edge) and right to expand", () => {
    const { container } = render(<WorkflowTrackerRail collapsible />);
    const chevron = () => container.querySelector("[data-collapse-chevron]") as SVGElement;
    expect(chevron().getAttribute("class")).toContain("rotate-180");
    fireEvent.click(screen.getByRole("button", { name: "Collapse workflow rail" }));
    expect(chevron().getAttribute("class")).not.toContain("rotate-180");
  });
});


describe("Workflow status pulse", () => {
  it.each([true, false])("animates only running steps with compact=%s", (compact) => {
    const palette = { accent: "blue", attention: "rose", blocked: "amber", muted: "neutral", translucent: false } as const;
    const { container, rerender } = render(<WorkflowStatusNode status="running" palette={palette} size={compact ? "sm" : "md"} />);
    expect(container.querySelector(".animate-ping")).toHaveClass("dark:bg-blue-400", "motion-reduce:hidden");
    for (const status of ["done", "in_progress", "blocked", "attention", "skipped", "not_started"] as const) {
      rerender(<WorkflowStatusNode status={status} palette={palette} size={compact ? "sm" : "md"} />);
      expect(container.querySelector(".animate-ping")).toBeNull();
    }
  });
});
