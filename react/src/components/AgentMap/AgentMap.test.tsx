import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AgentMap, type AgentMapProject } from "./AgentMap";
import { layoutProjects, layoutProjectsHorizontally } from "./layout";

const projects: AgentMapProject[] = [{ id: "atlas", name: "Atlas", agents: [{ id: "builder", name: "Builder", activity: "Writing code", status: "working" }, { id: "reviewer", name: "Reviewer", activity: "Waiting for approval", status: "attention" }] }, { id: "orbit", name: "Orbit", agents: [{ id: "done", name: "Tester", activity: "Tests passed", status: "completed" }] }];

describe("AgentMap", () => {
  it("retains the full project title for tooltips and assistive technology", () => {
    const name = "A very long project title with SupercalifragilisticUnbrokenIdentifier";
    const project: AgentMapProject = { id: "long", name, agents: [] };
    render(<AgentMap projects={[project]} />);
    const hub = screen.getByRole("button", { name: `${name}, 0 agents` });
    expect(hub.getAttribute("title")).toBe(name);
    expect(hub.querySelector("strong")?.textContent).toBe(name);
  });
  it("shows a dedicated empty-project state and restores the map when projects arrive", () => {
    const { rerender } = render(<AgentMap projects={[]} />);
    expect(screen.getByText("No projects to display")).toBeTruthy();
    expect(screen.queryByText("Selected agent")).toBeNull();
    rerender(<AgentMap projects={projects} />);
    expect(screen.queryByText("No projects to display")).toBeNull();
    expect(screen.getByRole("button", { name: /Atlas, 2 agents/ })).toBeTruthy();
  });
  it("reports no working agents without hiding completed or attention-needed work", () => {
    const inactive: AgentMapProject[] = [{ id: "a", name: "Atlas", agents: [{ id: "review", name: "Reviewer", status: "attention", activity: "Waiting for approval" }, { id: "done", name: "Builder", status: "completed", activity: "Finished" }] }];
    render(<AgentMap projects={inactive} defaultExpandedProjectId="a" />);
    expect(screen.getByRole("status").textContent).toBe("No agents are currently working.");
    expect(screen.getByRole("button", { name: /Reviewer, Atlas, Needs attention/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Builder, Atlas, Completed/ })).toBeTruthy();
  });
  it("distinguishes projects with no assigned agents and supports custom empty copy", () => {
    const unassigned: AgentMapProject[] = [{ id: "new", name: "New project", agents: [] }];
    const { rerender } = render(<AgentMap projects={unassigned} />);
    expect(screen.getByRole("status").textContent).toBe("No agents are assigned to these projects yet.");
    expect(screen.getByRole("button", { name: /New project, 0 agents/ })).toBeTruthy();
    rerender(<AgentMap projects={unassigned} noActiveAgentsMessage="Nothing running" />);
    expect(screen.getByRole("status").textContent).toBe("Nothing running");
    rerender(<AgentMap projects={[]} emptyProjects={<span>Custom empty view</span>} />);
    expect(screen.getByText("Custom empty view")).toBeTruthy();
  });
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
    expect(screen.queryByText("Inspector")).toBeNull();
  });
  it("opens the inspector for a valid selection and hides it again when cleared", () => {
    const { container, rerender } = render(<AgentMap projects={projects} selectedAgentId={null} inspectorTitle="Agent details" />);
    const inspector = container.querySelector(".cj-agent-map__inspector")!;
    expect(inspector.getAttribute("aria-hidden")).toBe("true");
    expect(inspector.hasAttribute("inert")).toBe(true);
    expect(screen.queryByText("Agent details")).toBeNull();
    rerender(<AgentMap projects={projects} selectedAgentId="reviewer" inspectorTitle="Agent details" />);
    expect(inspector.getAttribute("aria-hidden")).toBe("false");
    expect(inspector.hasAttribute("inert")).toBe(false);
    expect(screen.getByText("Agent details")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Reviewer" })).toBeTruthy();
    rerender(<AgentMap projects={projects} selectedAgentId="missing" />);
    expect(inspector.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByText("Agent details")).toBeNull();
  });
  it("uses Inspector as the default title", () => {
    render(<AgentMap projects={projects} defaultSelectedAgentId="builder" />);
    expect(screen.getByText("Inspector")).toBeTruthy();
  });
  it("dismisses the inspector on outside clicks but keeps it open inside the inspector", () => {
    const { container } = render(<AgentMap projects={projects} defaultExpandedProjectId="atlas" defaultSelectedAgentId="builder" />);
    fireEvent.pointerDown(screen.getByText("Current activity"));
    expect(screen.getByText("Inspector")).toBeTruthy();
    fireEvent.pointerDown(screen.getByRole("button", { name: /Reviewer, Atlas/ }));
    fireEvent.click(screen.getByRole("button", { name: /Reviewer, Atlas/ }));
    expect(screen.getByRole("heading", { name: "Reviewer" })).toBeTruthy();
    fireEvent.pointerDown(container.querySelector(".cj-agent-map__canvas")!);
    expect(screen.queryByText("Inspector")).toBeNull();
  });
  it("opens the other project's agents and clears the prior selection", () => {
    render(<AgentMap projects={projects} defaultExpandedProjectId="atlas" defaultSelectedAgentId="builder" />);
    fireEvent.click(screen.getByRole("button", { name: /Orbit, 1 agents/ }));
    expect(screen.getByRole("button", { name: /Tester, Orbit/ })).toBeTruthy();
    expect(screen.queryByText("Inspector")).toBeNull();
  });
  it("requests clearing controlled selection on an outside click", () => {
    const onSelectionClear = vi.fn();
    const { rerender } = render(<AgentMap projects={projects} selectedAgentId="builder" onSelectionClear={onSelectionClear} />);
    fireEvent.pointerDown(document.body);
    expect(onSelectionClear).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Inspector")).toBeTruthy();
    rerender(<AgentMap projects={projects} selectedAgentId={null} onSelectionClear={onSelectionClear} />);
    expect(screen.queryByText("Inspector")).toBeNull();
  });
  it("requests clearing controlled selection when changing projects", () => {
    const onSelectionClear = vi.fn();
    const onExpandedProjectChange = vi.fn();
    render(<AgentMap projects={projects} selectedAgentId="builder" expandedProjectId="atlas" onSelectionClear={onSelectionClear} onExpandedProjectChange={onExpandedProjectChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Orbit, 1 agents/ }));
    expect(onSelectionClear).toHaveBeenCalledTimes(1);
    expect(onExpandedProjectChange).toHaveBeenCalledWith("orbit");
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
  it("grows the project layout horizontally without crossing its height or overlapping", () => {
    const items = Array.from({ length: 14 }, (_, i) => ({ id: `project-${i}`, radius: i === 3 ? 164 : 62 }));
    for (const scattered of [false, true]) {
      const { circles, width } = layoutProjectsHorizontally(items, 420, 18, scattered);
      expect(width).toBeGreaterThan(420);
      for (const [i, circle] of circles.entries()) {
        expect(circle.x - circle.radius).toBeGreaterThanOrEqual(0);
        expect(circle.x + circle.radius).toBeLessThanOrEqual(width);
        expect(circle.y - circle.radius).toBeGreaterThanOrEqual(0);
        expect(circle.y + circle.radius).toBeLessThanOrEqual(420);
        for (const other of circles.slice(i + 1)) expect(Math.hypot(circle.x - other.x, circle.y - other.y)).toBeGreaterThanOrEqual(circle.radius + other.radius);
      }
    }
  });
  it("uses a horizontal-only ScrollArea and exposes sizing options", () => {
    const { container } = render(<AgentMap projects={projects} fullHeight fullWidth={false} />);
    const root = container.querySelector(".cj-agent-map")!;
    expect(root.classList.contains("cj-agent-map--full-height")).toBe(true);
    expect(root.classList.contains("cj-agent-map--intrinsic-width")).toBe(true);
    const scroll = container.querySelector(".cj-agent-map__orbs-scroll")!;
    expect(scroll.querySelector('[data-slot="scrollarea-viewport"]')?.getAttribute("style")).toContain("overflow-y: hidden");
    expect(scroll.querySelector('[data-orientation="vertical"]')).toBeNull();
    expect(scroll.querySelector('[data-orientation="horizontal"]')).toBeTruthy();
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
