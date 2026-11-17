import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AgentMap, type AgentMapProject } from "./AgentMap";
import { layoutProjects } from "./layout";

const projects: AgentMapProject[] = [{ id: "atlas", name: "Atlas", agents: [{ id: "builder", name: "Builder", activity: "Writing code", status: "working" }, { id: "reviewer", name: "Reviewer", activity: "Waiting for approval", status: "attention" }] }, { id: "orbit", name: "Orbit", agents: [{ id: "done", name: "Tester", activity: "Tests passed", status: "completed" }] }];

describe("AgentMap", () => {
  it("expands projects and selects an agent", () => {
    render(<AgentMap projects={projects} />);
    fireEvent.click(screen.getByRole("button", { name: /Atlas, 2 agents/ }));
    fireEvent.click(screen.getByRole("button", { name: /Reviewer, Atlas/ }));
    expect(screen.getByText("Waiting for approval")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Reviewer, Atlas/ }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: /Reviewer, Atlas/ }).querySelector(".cj-agent-map__attention-ring")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Builder, Atlas/ }).querySelector(".cj-agent-map__attention-ring")).toBeNull();
  });
  it("supports controlled expansion and selection", () => {
    const onExpandedProjectChange = vi.fn(); const onAgentSelect = vi.fn();
    render(<AgentMap projects={projects} expandedProjectId="atlas" selectedAgentId={null} onExpandedProjectChange={onExpandedProjectChange} onAgentSelect={onAgentSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /Atlas, 2 agents/ }));
    expect(onExpandedProjectChange).toHaveBeenCalledWith(null);
    fireEvent.click(screen.getByRole("button", { name: /Builder, Atlas/ }));
    expect(onAgentSelect).toHaveBeenCalledWith(projects[0].agents[0], projects[0]);
    expect(screen.getByText("Select an agent to see its activity.")).toBeTruthy();
  });
  it("offers a project list in a narrow container", () => {
    const measure = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 320 } as DOMRect);
    try {
      render(<AgentMap projects={projects} />);
      fireEvent.click(screen.getByRole("button", { name: /Atlas/ }));
      expect(screen.getByRole("button", { name: /Atlas/ }).querySelector(".cj-agent-map__attention-ring")).toBeTruthy();
      expect(screen.getByRole("button", { name: /Reviewer.*Needs attention/ }).querySelector(".cj-agent-map__attention-ring")).toBeTruthy();
      fireEvent.click(screen.getByRole("button", { name: /Reviewer.*Needs attention/ }));
      expect(screen.getByRole("heading", { name: "Reviewer" })).toBeTruthy();
    } finally { measure.mockRestore(); }
  });
  it("applies the requested panel variants", () => {
    const measure = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 320 } as DOMRect);
    try {
      const { container } = render(<AgentMap projects={projects} defaultExpandedProjectId="atlas" panelVariant="outlined" detailsVariant="simple" listVariant="subtle" panelTone="blue" detailsTone="rose" listTone="green" />);
      expect(container.querySelector(".cj-agent-map__panel")?.getAttribute("data-variant")).toBe("outlined");
      expect(container.querySelector(".cj-agent-map__details")?.getAttribute("data-variant")).toBe("simple");
      expect(container.querySelector(".cj-agent-map__project-list")?.getAttribute("data-variant")).toBe("subtle");
      expect(container.querySelector(".cj-agent-map__agent-list")?.getAttribute("data-variant")).toBe("subtle");
      expect(container.querySelector(".cj-agent-map__panel")?.getAttribute("data-tone")).toBe("blue");
      expect(container.querySelector(".cj-agent-map__details")?.getAttribute("data-tone")).toBe("rose");
      expect(container.querySelector(".cj-agent-map__project-list")?.getAttribute("data-tone")).toBe("green");
      expect(container.querySelector(".cj-agent-map__agent-list")?.getAttribute("data-tone")).toBe("green");
    } finally { measure.mockRestore(); }
  });
  it("applies independent grid and glow tones and honors a custom grid color", () => {
    const { container, rerender } = render(<AgentMap projects={projects} gridTone="blue" glowTone="rose" />);
    const viewport = container.querySelector(".cj-agent-map__viewport") as HTMLElement;
    expect(viewport.style.getPropertyValue("--cj-agent-map-grid-color")).toBe("var(--color-blue-500)");
    expect(viewport.style.getPropertyValue("--cj-agent-map-glow-color")).toBe("var(--color-rose-500)");
    const grid = viewport.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(grid.style.backgroundImage).toContain("--cj-agent-map-grid-color");
    rerender(<AgentMap projects={projects} gridTone="blue" glowTone="rose" grid={{ lineColor: "red" }} />);
    expect((viewport.querySelector('[aria-hidden="true"]') as HTMLElement).style.backgroundImage).toContain("red");
  });
  it("lists agents when an expanded project has more than twenty", () => {
    const large: AgentMapProject = { id: "large", name: "Large", agents: Array.from({ length: 21 }, (_, i) => ({ id: `agent-${i}`, name: `Agent ${i}`, activity: "Working", status: "working" })) };
    render(<AgentMap projects={[large]} defaultExpandedProjectId="large" />);
    expect(document.querySelector(".cj-agent-map__agent-list [data-slot='scrollarea-viewport']")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Agent 8/ }));
    expect(screen.getByRole("heading", { name: "Agent 8" })).toBeTruthy();
  });
  it("focuses a large project and returns to the project overview", () => {
    const large: AgentMapProject = { id: "large", name: "Large", agents: Array.from({ length: 14 }, (_, i) => ({ id: `agent-${i}`, name: `Agent ${i}`, activity: "Working", status: "working" })) };
    render(<AgentMap projects={[...projects, large]} defaultExpandedProjectId="large" />);
    fireEvent.click(screen.getByRole("button", { name: /Agent 13, Large/ }));
    expect(screen.getByRole("heading", { name: "Agent 13" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "← All projects" }));
    expect(screen.getByRole("button", { name: /Atlas, 2 agents/ })).toBeTruthy();
  });
  it("keeps a ten-agent project on the map with scaled orbs", () => {
    const medium: AgentMapProject = { id: "medium", name: "Medium", agents: Array.from({ length: 10 }, (_, i) => ({ id: `medium-${i}`, name: `Agent ${i}`, activity: "Working", status: "working" })) };
    const { container } = render(<AgentMap projects={[medium]} defaultExpandedProjectId="medium" />);
    expect(screen.getByRole("button", { name: /Agent 9, Medium/ })).toBeTruthy();
    expect(container.querySelectorAll(".cj-agent-map__orb")).toHaveLength(10);
    expect(container.querySelector(".cj-agent-map__agent")?.getAttribute("style")).toContain("--agent-scale: 0.8");
    expect(screen.queryByRole("button", { name: "← All projects" })).toBeNull();
  });
  it("packs full project footprints inside the available width without overlap", () => {
    for (const width of [400, 600, 1000]) {
      const { circles, height } = layoutProjects([{ id: "a", radius: 62 }, { id: "b", radius: 164 }, { id: "c", radius: 62 }, { id: "d", radius: 62 }], width);
      for (const [i, a] of circles.entries()) {
        expect(a.x - a.radius).toBeGreaterThanOrEqual(0); expect(a.x + a.radius).toBeLessThanOrEqual(width);
        expect(a.y + a.radius).toBeLessThanOrEqual(height);
        for (const b of circles.slice(i + 1)) expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(a.radius + b.radius);
      }
    }
  });
  it("scatters busy project layouts deterministically without collisions", () => {
    const items = ["atlas", "horizon", "orbit", "northstar", "meridian", "lumen", "canvas", "beacon"].map((id, i) => ({ id, radius: i === 3 ? 164 : 62 }));
    for (const width of [400, 650, 1000]) {
      const result = layoutProjects(items, width, 18, true);
      expect(result).toEqual(layoutProjects(items, width, 18, true));
      expect(result.circles).not.toEqual(layoutProjects(items, width, 18, false).circles);
      for (const [i, circle] of result.circles.entries()) {
        expect(circle.x - circle.radius).toBeGreaterThanOrEqual(0);
        expect(circle.x + circle.radius).toBeLessThanOrEqual(width);
        expect(circle.y - circle.radius).toBeGreaterThanOrEqual(0);
        expect(circle.y + circle.radius).toBeLessThanOrEqual(result.height);
        for (const other of result.circles.slice(i + 1)) expect(Math.hypot(circle.x - other.x, circle.y - other.y)).toBeGreaterThanOrEqual(circle.radius + other.radius);
      }
    }
  });
});
