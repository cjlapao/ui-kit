import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import WorkflowTracker from "./WorkflowTracker";
import { sampleWorkflow } from "./sampleWorkflow";
import {
  computeProgress,
  computeSubSummary,
  computeTallies,
  getAttentionSteps,
  getSkippedSteps,
  resolveActiveStep,
} from "./derive";
import { normalizeStatus } from "./statusTokens";
import { isTranslucentVariant } from "./surfaces";
import {
  DEFAULT_SURFACE_CORNER,
  SURFACE_CORNERS,
  SURFACE_VARIANTS,
  getSurfaceCornerClass,
  getSurfaceTextTokens,
} from "../../theme/Theme";
import type { WorkflowData, WorkflowStep } from "./types";

const steps = sampleWorkflow.steps;

describe("WorkflowTracker — derivations", () => {
  it("computes progress from the done count", () => {
    // 4 of 12 steps are done in the fixture.
    expect(computeProgress(steps)).toBe(33);
    expect(computeProgress([])).toBe(0);
  });

  it("folds attention and blocked into a single flagged tally", () => {
    expect(computeTallies(steps)).toEqual({
      done: 4,
      skipped: 2,
      flagged: 2,
      remaining: 4,
    });
  });

  it("summarises sub-steps as accepted / skipped / open", () => {
    const active = steps.find((step) => step.id === "security_questionnaire");
    expect(computeSubSummary(active?.subSteps)).toEqual({
      accepted: 3,
      skipped: 1,
      open: 2,
    });
    expect(computeSubSummary()).toEqual({ accepted: 0, skipped: 0, open: 0 });
  });

  it("collects the attention and skipped roll-ups", () => {
    expect(getAttentionSteps(steps).map((step) => step.id)).toEqual([
      "insurance_certificates",
      "legal_review",
    ]);
    expect(getSkippedSteps(steps).map((step) => step.id)).toEqual([
      "duplicate_check",
      "tax_documents",
    ]);
  });

  it("falls back from an unknown id to the first in-progress step", () => {
    expect(resolveActiveStep(steps, "nope")?.step.id).toBe(
      "security_questionnaire",
    );
    expect(resolveActiveStep(steps, "go_live")?.index).toBe(12);
    expect(resolveActiveStep([], "anything")).toBeUndefined();
  });

  it("falls back to the first step when nothing is in progress", () => {
    const noneRunning: WorkflowStep[] = [
      { id: "a", label: "A", status: "not_started" },
      { id: "b", label: "B", status: "done" },
    ];
    expect(resolveActiveStep(noneRunning)?.step.id).toBe("a");
  });

  it("degrades unknown statuses to not_started", () => {
    expect(normalizeStatus("exploded")).toBe("not_started");
    expect(normalizeStatus(undefined)).toBe("not_started");
    expect(normalizeStatus("blocked")).toBe("blocked");
  });
});

describe("WorkflowTracker — rendering", () => {
  it("renders the fixture with no props", () => {
    render(<WorkflowTracker />);

    expect(
      screen.getByRole("heading", { name: "Northwind Logistics GmbH" }),
    ).toBeInTheDocument();
    expect(screen.getByText("33%")).toBeInTheDocument();
    expect(screen.getByText("Step 8 of 12")).toBeInTheDocument();
    expect(
      screen.getByText("3 accepted · 1 skipped · 2 open"),
    ).toBeInTheDocument();
  });

  it("renders an em dash for sub-steps with no duration", () => {
    render(<WorkflowTracker />);
    // Only the running and skipped sub-steps plus the not-started one lack one.
    expect(screen.getAllByText("—")).toHaveLength(3);
  });

  it("hides a roll-up card when its list is empty", () => {
    const data: WorkflowData = {
      title: "All clear",
      activeStepId: "a",
      steps: [{ id: "a", label: "A", status: "done" }],
    };
    render(<WorkflowTracker data={data} />);

    expect(screen.queryByText("Needs attention")).not.toBeInTheDocument();
    expect(screen.queryByText("Skipped steps")).not.toBeInTheDocument();
  });

  it("shows a placeholder and no roll-ups when there are no steps", () => {
    render(<WorkflowTracker data={{ title: "Nothing", steps: [] }} />);

    expect(screen.getByText("No steps yet")).toBeInTheDocument();
    expect(screen.getByText("No step selected")).toBeInTheDocument();
    expect(screen.queryByText("Needs attention")).not.toBeInTheDocument();
  });

  it("omits optional fields instead of printing undefined", () => {
    const { container } = render(
      <WorkflowTracker
        data={{
          title: "Bare",
          activeStepId: "a",
          steps: [{ id: "a", label: "A", status: "in_progress" }],
        }}
      />,
    );

    expect(container.textContent).not.toContain("undefined");
    expect(screen.queryByText(/Elapsed/)).not.toBeInTheDocument();
    expect(screen.queryByText("Owner")).not.toBeInTheDocument();
    expect(screen.queryByText("Sub-steps")).not.toBeInTheDocument();
  });

  it("renders static rows until a select callback is supplied", () => {
    const { rerender } = render(<WorkflowTracker />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);

    const onStepSelect = vi.fn();
    rerender(<WorkflowTracker onStepSelect={onStepSelect} />);

    fireEvent.click(screen.getByRole("button", { name: /Legal review/ }));
    expect(onStepSelect).toHaveBeenCalledWith("legal_review");
  });

  it("forwards sub-step clicks with both ids", () => {
    const onSubStepSelect = vi.fn();
    render(<WorkflowTracker onSubStepSelect={onSubStepSelect} />);

    // The rail's nested list and the detail table both expose the sub-step.
    fireEvent.click(
      screen.getAllByRole("button", { name: /Subprocessor list/ })[0],
    );
    expect(onSubStepSelect).toHaveBeenCalledWith(
      "security_questionnaire",
      "subprocessor_list",
    );
  });

  it("stays controlled — clicking a row does not move the detail panel", () => {
    const onStepSelect = vi.fn();
    render(<WorkflowTracker onStepSelect={onStepSelect} />);

    fireEvent.click(screen.getByRole("button", { name: /Go-live/ }));
    expect(screen.getByText("Step 8 of 12")).toBeInTheDocument();
  });
});

describe("WorkflowTracker — title icon", () => {
  const withIcon = {
    ...sampleWorkflow,
    icon: <img src="/logo.png" alt="Acme" />,
  };

  it("renders nothing extra when no icon is supplied", () => {
    render(<WorkflowTracker />);
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("renders the icon beside the title", () => {
    render(<WorkflowTracker data={withIcon} />);
    expect(screen.getByAltText("Acme")).toBeTruthy();
  });

  it("clips the icon to the shared corner scale", () => {
    const { container } = render(<WorkflowTracker data={withIcon} />);
    const box = container.querySelector("header span.overflow-hidden");
    // Same scale as the cards, so a rounded-full mark and a rounded-full card
    // agree. `rounded-md` is the default and maps to Tailwind's rounded-2xl.
    expect(box?.className).toContain(
      getSurfaceCornerClass(DEFAULT_SURFACE_CORNER),
    );
  });

  it.each(SURFACE_CORNERS)("accepts the %s corner", (corner) => {
    const { container } = render(
      <WorkflowTracker data={withIcon} iconCorner={corner} />,
    );
    const box = container.querySelector("header span.overflow-hidden");
    expect(box?.className).toContain(getSurfaceCornerClass(corner));
  });

  it("reserves the icon in the header skeleton so nothing shifts", () => {
    const bars = (container: HTMLElement) =>
      container.querySelectorAll("div.mb-5.animate-pulse span").length;

    const { container: withIt } = render(
      <WorkflowTracker data={withIcon} loading />,
    );
    const { container: without } = render(<WorkflowTracker loading />);
    expect(bars(withIt)).toBe(bars(without) + 1);
  });
});

describe("WorkflowTracker — loading state", () => {
  it("swaps content for skeletons and marks the region busy", () => {
    const { container } = render(<WorkflowTracker loading />);

    expect(container.firstElementChild).toHaveAttribute("aria-busy", "true");
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0,
    );
  });

  it("never leaks the default fixture while loading", () => {
    const { container } = render(<WorkflowTracker loading />);

    expect(container.textContent).not.toContain("Northwind Logistics GmbH");
    expect(container.textContent).not.toContain("Security questionnaire");
    expect(screen.queryByText("Needs attention")).not.toBeInTheDocument();
  });

  it("hides the legend while loading", () => {
    render(<WorkflowTracker loading />);
    expect(screen.queryByText("Not started")).not.toBeInTheDocument();
  });
});

describe("WorkflowTracker — empty state", () => {
  const emptyData: WorkflowData = { title: "Nothing running", steps: [] };

  it("shows the built-in placeholder with a subtitle", () => {
    render(<WorkflowTracker data={emptyData} />);

    expect(screen.getByText("No steps yet")).toBeInTheDocument();
    expect(
      screen.getByText("Steps appear here as soon as the workflow starts."),
    ).toBeInTheDocument();
  });

  it("accepts a custom placeholder", () => {
    render(
      <WorkflowTracker
        data={emptyData}
        emptyState={<p>Nothing queued for this vendor</p>}
      />,
    );

    expect(
      screen.getByText("Nothing queued for this vendor"),
    ).toBeInTheDocument();
    expect(screen.queryByText("No steps yet")).not.toBeInTheDocument();
  });

  it("still renders the header and keeps roll-ups hidden", () => {
    render(<WorkflowTracker data={emptyData} />);

    expect(
      screen.getByRole("heading", { name: "Nothing running" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Skipped steps")).not.toBeInTheDocument();
  });
});

describe("WorkflowTracker — translucent surfaces", () => {
  const railBox = (container: HTMLElement) =>
    container.querySelector<HTMLElement>('[style*="margin-left"]');

  it("keeps inner surfaces opaque on a solid variant", () => {
    const { container } = render(<WorkflowTracker variant="outlined" />);

    expect(railBox(container)!.className).toContain("bg-neutral-50");
    expect(container.querySelector(".divide-neutral-200")).not.toBeNull();
  });

  it("switches inner surfaces to translucent on every see-through variant", () => {
    // `simple` included: this list used to be a local copy that never picked
    // the variant up when the theme reclassified it as see-through.
    for (const variant of [
      "glass",
      "liquid-glass",
      "default",
      "simple",
    ] as const) {
      const { container, unmount } = render(
        <WorkflowTracker variant={variant} />,
      );

      expect(railBox(container)!.className).toContain("bg-white/20");
      expect(container.querySelector(".divide-white\\/25")).not.toBeNull();
      // Nodes stop masking the backdrop with a solid disc.
      expect(container.innerHTML).toContain("bg-white/60");
      unmount();
    }
  });

  it("lets translucentSurfaces override the variant default", () => {
    const { container: forcedOn } = render(
      <WorkflowTracker variant="outlined" translucentSurfaces />,
    );
    expect(railBox(forcedOn)!.className).toContain("bg-white/20");

    const { container: forcedOff } = render(
      <WorkflowTracker variant="liquid-glass" translucentSurfaces={false} />,
    );
    expect(railBox(forcedOff)!.className).toContain("bg-neutral-50");
  });

  it("tracks the theme's own translucent-surface list", () => {
    for (const variant of SURFACE_VARIANTS) {
      expect(isTranslucentVariant(variant)).toBe(
        getSurfaceTextTokens(variant).translucent,
      );
    }
  });

  it("darkens muted text on glass so small labels stay legible", () => {
    const { container: solid } = render(<WorkflowTracker variant="outlined" />);
    expect(solid.innerHTML).toContain("text-neutral-400");

    const { container: glass } = render(<WorkflowTracker variant="glass" />);
    expect(glass.innerHTML).toContain("text-neutral-600");
    expect(glass.innerHTML).toContain("text-neutral-700");
  });
});
